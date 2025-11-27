const Course = require('../models/Course');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get all courses with filtering and pagination
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      deliveryMode,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (level && level !== 'all') query.level = level;
    if (deliveryMode) query.deliveryMode = { $in: [deliveryMode] };

    if (minPrice || maxPrice) {
      query['price.regular'] = {};
      if (minPrice) query['price.regular'].$gte = Number(minPrice);
      if (maxPrice) query['price.regular'].$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch courses
    const courses = await Course.find(query)
      .populate('category', 'name icon slug')
      .populate('instructor', 'name avatar designation')
      .sort(sort)
      .limit(limit * 1)
      .skip(skip)
      .lean();

    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalCourses: count,
        hasNextPage: page * limit < count,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isActive: true,
      isFeatured: true
    })
      .populate('category', 'name icon slug')
      .populate('instructor', 'name avatar')
      .sort('-enrollmentCount -rating.average')
      .limit(6)
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured courses',
      error: error.message
    });
  }
};

// @desc    Get trending courses
// @route   GET /api/courses/trending
// @access  Public
exports.getTrendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isActive: true,
      isTrending: true
    })
      .populate('category', 'name icon')
      .populate('instructor', 'name avatar')
      .sort('-enrollmentCount')
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending courses',
      error: error.message
    });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('category', 'name icon slug')
      .populate('instructor')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
        options: { limit: 10, sort: '-createdAt' }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Get course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('category', 'name icon slug')
      .populate('instructor')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Public
exports.searchCourses = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const courses = await Course.find({
      $text: { $search: q },
      isActive: true
    })
      .select('title slug thumbnail price category')
      .populate('category', 'name')
      .limit(limit * 1)
      .lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching courses',
      error: error.message
    });
  }
};

// @desc    Get related courses
// @route   GET /api/courses/:id/related
// @access  Public
exports.getRelatedCourses = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const relatedCourses = await Course.find({
      category: course.category,
      _id: { $ne: course._id },
      isActive: true
    })
      .populate('category', 'name icon')
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      count: relatedCourses.length,
      data: relatedCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related courses',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    // Update category course count
    await Category.findByIdAndUpdate(course.category, {
      $inc: { courseCount: 1 }
    });

    console.log('✅ New course created:', course.title);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};
