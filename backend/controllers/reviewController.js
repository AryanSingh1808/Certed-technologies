const Review = require('../models/Review');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Submit a course review
// @route   POST /api/reviews
// @access  Private
exports.submitReview = async (req, res) => {
  try {
    const { courseId, rating, title, comment, pros, cons } = req.body;

    if (!courseId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course ID, rating, and comment'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user enrolled in course
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === courseId
    );

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      course: courseId,
      rating,
      title: title || '',
      comment,
      pros: pros || [],
      cons: cons || [],
      isVerifiedPurchase: isEnrolled
    });

    // Update course rating
    const reviews = await Review.find({ course: courseId, isApproved: true });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Course.findByIdAndUpdate(courseId, {
      'rating.average': avgRating,
      'rating.count': reviews.length,
      $push: { reviews: review._id }
    });

    console.log('✅ New review submitted:', review._id);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      course: req.params.courseId,
      isApproved: true
    })
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip(skip);

    const count = await Review.countDocuments({
      course: req.params.courseId,
      isApproved: true
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews: count,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpful.users.some(
      userId => userId.toString() === req.user.id
    );

    if (alreadyMarked) {
      // Remove helpful mark
      review.helpful.users = review.helpful.users.filter(
        userId => userId.toString() !== req.user.id
      );
      review.helpful.count -= 1;
    } else {
      // Add helpful mark
      review.helpful.users.push(req.user.id);
      review.helpful.count += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? 'Helpful mark removed' : 'Marked as helpful',
      helpfulCount: review.helpful.count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful',
      error: error.message
    });
  }
};

// @desc    Approve review (Admin)
// @route   PUT /api/reviews/:id/approve
// @access  Private (Admin)
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving review',
      error: error.message
    });
  }
};
