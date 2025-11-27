const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

// Create Razorpay order (Protected - user must be logged in)
router.post('/create-order', protect, createOrder);

// Verify payment after checkout (Protected)
router.post('/verify', protect, verifyPayment);

// Get payment details (Admin only)
router.get('/payment/:paymentId', protect, admin, getPaymentDetails);

// Process refund (Admin only)
router.post('/refund', protect, admin, refundPayment);

module.exports = router;
