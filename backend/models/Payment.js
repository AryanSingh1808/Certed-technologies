const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment'
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created'
    },
    paymentMethod: {
      type: String,
      default: ''
    },
    paymentEmail: String,
    paymentContact: String,
    receipt: {
      type: String,
      unique: true
    },
    invoiceUrl: String,
    refund: {
      razorpayRefundId: String,
      amount: Number,
      reason: String,
      refundedAt: Date
    },
    failureReason: String,
    metadata: {
      type: Map,
      of: String
    },
    paidAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
