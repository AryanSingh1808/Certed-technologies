const API_URL = 'http://localhost:5000/api';
let currentCourse = null;

// Load Course Summary
async function loadCourseSummary() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');
        
        if (!courseId) {
            showEnrollmentError('Course ID not provided');
            return;
        }
        
        const response = await fetch(`${API_URL}/courses/${courseId}`);
        const result = await response.json();
        
        if (result.success) {
            currentCourse = result.data;
            displayCourseSummary(result.data);
        } else {
            showEnrollmentError(result.message);
        }
    } catch (error) {
        console.error('Error loading course summary:', error);
        showEnrollmentError('Failed to load course details');
    }
}

// Display Course Summary
function displayCourseSummary(course) {
    const price = course.discountedPrice || course.price;
    const tax = Math.round(price * 0.18);
    const total = price + tax;
    
    const summaryHTML = `
        <div class="mb-3">
            <img src="${course.thumbnail}" alt="${course.title}" class="img-fluid rounded mb-3">
            <h5 class="fw-bold">${course.title}</h5>
            <p class="text-muted small">${course.description.substring(0, 100)}...</p>
        </div>
    `;
    
    document.getElementById('enrollment-summary').innerHTML = summaryHTML;
    document.getElementById('summary-price').textContent = `₹${price.toLocaleString()}`;
    document.getElementById('summary-tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('summary-total').textContent = `₹${total.toLocaleString()}`;
}

// Handle Enrollment Form Submission
document.addEventListener('DOMContentLoaded', () => {
    loadCourseSummary();
    
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    enrollmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!enrollmentForm.checkValidity()) {
            enrollmentForm.classList.add('was-validated');
            return;
        }
        
        // Get form data
        const formData = {
            student: {
                name: document.getElementById('studentName').value.trim(),
                email: document.getElementById('studentEmail').value.trim(),
                phone: document.getElementById('studentPhone').value.trim()
            },
            course: currentCourse._id,
            deliveryMode: document.getElementById('deliveryMode').value,
            preferredSchedule: document.getElementById('preferredSchedule').value,
            company: document.getElementById('studentCompany').value.trim(),
            experience: document.getElementById('studentExperience').value,
            notes: document.getElementById('specialRequests').value.trim()
        };
        
        // Show loading state
        const submitBtn = document.getElementById('enrollmentSubmitBtn');
        const submitText = document.getElementById('enrollmentSubmitText');
        const submitSpinner = document.getElementById('enrollmentSubmitSpinner');
        
        submitBtn.disabled = true;
        submitText.classList.add('d-none');
        submitSpinner.classList.remove('d-none');
        
        try {
            // Send data to backend
            const response = await fetch(`${API_URL}/enrollments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            // Display result
            const alertContainer = document.getElementById('enrollmentAlertContainer');
            
            if (result.success) {
                alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <h5 class="alert-heading"><i class="fas fa-check-circle me-2"></i>Enrollment Successful!</h5>
                        <p>${result.message}</p>
                        <p class="mb-0">We'll contact you shortly with further details.</p>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                
                // Reset form
                enrollmentForm.reset();
                enrollmentForm.classList.remove('was-validated');
                
                // Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = `/pages/course-detail.html?id=${currentCourse._id}`;
                }, 3000);
            } else {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        ${result.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
            }
            
            // Scroll to alert
            alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Error submitting enrollment:', error);
            document.getElementById('enrollmentAlertContainer').innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    An error occurred. Please try again later.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.classList.remove('d-none');
            submitSpinner.classList.add('d-none');
        }
    });
});

// Show Enrollment Error
function showEnrollmentError(message) {
    document.querySelector('.enrollment-section').innerHTML = `
        <div class="container text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h2>Error Loading Enrollment Form</h2>
            <p class="text-muted">${message}</p>
            <a href="/pages/courses.html" class="btn btn-primary mt-3">Back to Courses</a>
        </div>
    `;
}
