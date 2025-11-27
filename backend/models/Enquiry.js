const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseName: {
      type: String,
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    enquiryType: {
      type: String,
      enum: ['course', 'corporate', 'callback', 'brochure', 'general', 'popup'],
      default: 'course',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'closed', 'spam'],
      default: 'new',
    },
    source: {
      type: String,
      enum: [
        'website',
        'landing-page',
        'popup',
        'course-detail',
        'homepage',
        'contact-form',
        'contact-page',      // ✅ Added
        'about-page',        // ✅ Added
        'courses-page',      // ✅ Added
        'blog-page',         // ✅ Added
        'footer',            // ✅ Added
        'header',            // ✅ Added
        'other',
        'popup',                    // ✅ ADD THIS
        'homepage-popup',           // ✅ ADD THIS
        'homepage-popup-5sec'       // ✅ ADD THIS
      ],
      default: 'website',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followUpDate: Date,
    contactedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
