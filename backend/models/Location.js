const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'India'
    },
    address: {
      street: String,
      landmark: String,
      pincode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    contactInfo: {
      phone: [String],
      email: [String],
      whatsapp: String
    },
    timings: {
      weekdays: {
        type: String,
        default: '9:00 AM - 7:00 PM'
      },
      weekends: {
        type: String,
        default: '10:00 AM - 5:00 PM'
      }
    },
    facilities: [String],
    image: String,
    isActive: {
      type: Boolean,
      default: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create slug before saving
locationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = `${this.city}-${this.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Location', locationSchema);
