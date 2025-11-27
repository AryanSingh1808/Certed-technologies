const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { sendEnrollmentEmail } = require('../utils/emailService');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    // Validate input
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and User ID are required',
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create Razorpay order
    const amount = course.price * 100; // Convert to paise
    const currency = 'INR';
    const receipt = `receipt_${Date.now()}`;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: {
        courseId: course._id.toString(),
        courseName: course.title,
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name,
      },
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      course: {
        id: course._id,
        title: course.title,
        price: course.price,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment and create enrollment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification data is incomplete',
      });
    }

    // Create signature verification string
    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    // Generate expected signature
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment is verified - Create enrollment
      console.log('✅ Payment verified successfully');

      // Get course and user details
      const course = await Course.findById(courseId);
      const user = await User.findById(userId);

      if (!course || !user) {
        return res.status(404).json({
          success: false,
          message: 'Course or User not found',
        });
      }

      // Create enrollment
      const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        paymentStatus: 'completed',
        paymentMethod: 'razorpay',
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: course.price,
        enrolledAt: new Date(),
      });

      console.log('✅ Enrollment created:', enrollment._id);

      // Send enrollment confirmation email
      try {
        await sendEnrollmentEmail(
          {
            name: user.name,
            email: user.email,
          },
          {
            title: course.title,
            price: course.price,
            duration: course.duration,
          }
        );
        console.log('✅ Enrollment email sent');
      } catch (emailError) {
        console.error('❌ Error sending email:', emailError.message);
        // Continue even if email fails
      }


      res.status(200).json({
        success: true,
        message: 'Payment verified and enrollment completed successfully',
        enrollment: {
          id: enrollment._id,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          course: course.title,
          enrolledAt: enrollment.enrolledAt,
        },
      });
    } else {
      // Signature verification failed
      console.log('❌ Payment verification failed');
      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private (Admin)
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment: payment,
    });
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message,
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payment/refund
// @access  Private (Admin)
const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes: {
        reason: 'User requested refund',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refund: refund,
    });
  } catch (error) {
    console.error('❌ Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
};
