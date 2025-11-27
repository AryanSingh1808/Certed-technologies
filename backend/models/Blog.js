const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    author: {
      name: {
        type: String,
        required: true,
        default: 'Admin'
      },
      bio: String,
      avatar: String
    },
    featuredImage: {
      type: String,
      default: 'https://via.placeholder.com/800x400?text=Blog'
    },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    tags: [String],
    readTime: {
      type: Number,
      default: 5
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for search
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
