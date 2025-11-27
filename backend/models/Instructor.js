const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: String,
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=Instructor&background=0D6EFD&color=fff'
    },
    designation: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    expertise: [String],
    experience: {
      years: Number,
      description: String
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number
      }
    ],
    certifications: [
      {
        name: String,
        issuedBy: String,
        year: Number
      }
    ],
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    studentsTaught: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create slug before saving
instructorSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Instructor', instructorSchema);
