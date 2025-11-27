const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
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
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    enrollmentId: {
      type: String,
      unique: true
    },
    batch: {
      batchId: mongoose.Schema.Types.ObjectId,
      startDate: Date,
      timing: String,
      mode: String
    },
    deliveryMode: {
      type: String,
      enum: ['Online', 'Classroom', 'Corporate', 'Self-Paced', 'Hybrid'],
      default: 'Online'
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    preferredSchedule: {
      type: String,
      enum: ['Weekday Morning', 'Weekday Evening', 'Weekend', 'Flexible'],
      default: 'Weekday Evening'
    },
    amount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    enrollmentStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'suspended'],
      default: 'pending'
    },
    progress: {
      completedModules: [Number],
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      lastAccessedAt: Date
    },
    certificate: {
      issued: {
        type: Boolean,
        default: false
      },
      certificateId: String,
      issuedDate: Date,
      certificateUrl: String
    },
    notes: {
      type: String,
      default: ''
    },
    completedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

// Generate unique enrollment ID before saving
enrollmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.enrollmentId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.enrollmentId = `ENR${timestamp}${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
