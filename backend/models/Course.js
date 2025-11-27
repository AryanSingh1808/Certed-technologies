const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Course category is required']
    },
    subcategory: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner'
    },
    duration: {
      hours: {
        type: Number,
        default: 40
      },
      weeks: {
        type: Number,
        default: 4
      },
      display: {
        type: String,
        default: '40 Hours'
      }
    },
    price: {
      regular: {
        type: Number,
        required: [true, 'Regular price is required'],
        min: [0, 'Price cannot be negative']
      },
      discounted: {
        type: Number,
        min: [0, 'Price cannot be negative']
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/800x600?text=Course+Thumbnail'
    },
    images: [String],
    overview: {
      type: String,
      default: ''
    },
    whatYouWillLearn: [
      {
        type: String,
        trim: true
      }
    ],
    curriculum: [
      {
        moduleNumber: Number,
        moduleTitle: {
          type: String,
          required: true,
          trim: true
        },
        moduleDuration: String,
        topics: [
          {
            type: String,
            trim: true
          }
        ]
      }
    ],
    prerequisites: [
      {
        type: String,
        trim: true
      }
    ],
    targetAudience: [
      {
        type: String,
        trim: true
      }
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    },
    instructorName: {
      type: String,
      default: 'Expert Instructors'
    },
    deliveryMode: {
      type: [String],
      enum: ['Online', 'Classroom', 'Corporate', 'Self-Paced', 'Hybrid'],
      default: ['Online']
    },
    trainingMode: {
      liveOnline: {
        type: Boolean,
        default: true
      },
      classroom: {
        type: Boolean,
        default: false
      },
      corporate: {
        type: Boolean,
        default: false
      },
      selfPaced: {
        type: Boolean,
        default: false
      }
    },
    batches: [
      {
        startDate: Date,
        endDate: Date,
        timing: String,
        mode: {
          type: String,
          enum: ['Online', 'Classroom', 'Hybrid']
        },
        location: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Location'
        },
        seatsAvailable: {
          type: Number,
          default: 30
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],
    certificationDetails: {
      provided: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'Course Completion Certificate'
      },
      accreditation: String,
      description: String
    },
    features: [
      {
        icon: String,
        title: String,
        description: String
      }
    ],
    requirements: {
      system: [String],
      software: [String],
      skills: [String]
    },
    brochureUrl: {
      type: String,
      default: ''
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0
    },
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String]
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from title before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.price.discounted && this.price.regular > this.price.discounted) {
    return Math.round(((this.price.regular - this.price.discounted) / this.price.regular) * 100);
  }
  return 0;
});

// Virtual for effective price
courseSchema.virtual('effectivePrice').get(function() {
  return this.price.discounted || this.price.regular;
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
