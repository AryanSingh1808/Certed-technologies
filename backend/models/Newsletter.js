const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    name: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed', 'bounced'],
      default: 'active'
    },
    source: {
      type: String,
      default: 'website'
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: Date,
    preferences: {
      courseUpdates: {
        type: Boolean,
        default: true
      },
      blogPosts: {
        type: Boolean,
        default: true
      },
      offers: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
