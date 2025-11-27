const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    testimonial: {
      type: String,
      required: [true, 'Testimonial is required'],
      maxlength: [500, 'Testimonial cannot exceed 500 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/100x100?text=Avatar'
    },
    position: {
      type: String,
      trim: true,
      default: 'Student'
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
