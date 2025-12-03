// Payment handling for Razorpay
const API_URL = 'https://certedtechnologies.com/api';

// Get course and user data from URL parameters or session storage
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId') || sessionStorage.getItem('selectedCourseId');
const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');

// Display course details on payment page
async function displayCourseDetails() {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    const data = await response.json();
    
    if (data.success) {
      const course = data.data;
      document.getElementById('courseName').textContent = course.title;
      document.getElementById('coursePrice').textContent = `₹${course.price}`;
      document.getElementById('courseDuration').textContent = course.duration;
    }
  } catch (error) {
    console.error('Error loading course details:', error);
  }
}

// Initialize Razorpay payment
async function initiatePayment() {
  try {
    // Validate user is logged in
    if (!userId) {
      alert('Please login to continue with payment');
      window.location.href = '/login';
      return;
    }

    // Show loading state
    const payBtn = document.getElementById('payNowBtn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Step 1: Create order on backend
    const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        courseId: courseId,
        userId: userId,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    console.log('✅ Order created:', orderData.orderId);

    // Step 2: Configure Razorpay options
    const options = {
      key: orderData.keyId, // Razorpay Key ID from backend
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'Certed Technologies',
      description: orderData.course.title,
      image: '/public/images/logo.png', // Your logo
      order_id: orderData.orderId,
      handler: async function (response) {
        // Step 3: Payment successful - Verify on backend
        await verifyPayment(response, orderData);
      },
      prefill: {
        name: orderData.user.name,
        email: orderData.user.email,
        contact: orderData.user.phone || '',
      },
      notes: {
        course_id: courseId,
        user_id: userId,
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function() {
          // Payment popup closed
          payBtn.disabled = false;
          payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
          console.log('Payment cancelled by user');
        }
      }
    };

    // Step 4: Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      alert(`Payment Failed: ${response.error.description}`);
      payBtn.disabled = false;
      payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
    });

    rzp.open();

  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    alert(error.message || 'Payment failed. Please try again.');
    const payBtn = document.getElementById('payNowBtn');
    payBtn.disabled = false;
    payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
  }
}

// Verify payment on backend
async function verifyPayment(razorpayResponse, orderData) {
  try {
    console.log('Verifying payment...');

    const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        courseId: courseId,
        userId: userId,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      console.log('✅ Payment verified and enrollment completed');
      
      // Show success message
      showSuccessMessage(verifyData.enrollment);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    } else {
      throw new Error(verifyData.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    alert('Payment verification failed. Please contact support with your payment ID.');
  }
}

// Show success message
function showSuccessMessage(enrollment) {
  const container = document.querySelector('.payment-container');
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="mb-4">
        <i class="fas fa-check-circle text-success" style="font-size: 80px;"></i>
      </div>
      <h2 class="text-success mb-3">🎉 Payment Successful!</h2>
      <p class="lead">You have been successfully enrolled in the course.</p>
      <div class="alert alert-info mt-4">
        <strong>Order ID:</strong> ${enrollment.orderId}<br>
        <strong>Payment ID:</strong> ${enrollment.paymentId}<br>
        <strong>Enrolled At:</strong> ${new Date(enrollment.enrolledAt).toLocaleString()}
      </div>
      <p class="mt-4">Redirecting to dashboard...</p>
      <div class="spinner-border text-primary mt-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Display course details
  if (courseId) {
    displayCourseDetails();
  } else {
    alert('No course selected');
    window.location.href = '/courses';
  }

  // Pay Now button
  const payBtn = document.getElementById('payNowBtn');
  if (payBtn) {
    payBtn.addEventListener('click', initiatePayment);
  }

  // Back to course button
  const backBtn = document.getElementById('backToCourseBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = `/course/${courseId}`;
    });
  }
});
