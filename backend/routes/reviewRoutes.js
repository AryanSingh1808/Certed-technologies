const express = require('express');
const router = express.Router();
const {
  submitReview,
  getCourseReviews,
  markHelpful,
  approveReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public route
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.post('/', protect, submitReview);
router.post('/:id/helpful', protect, markHelpful);

// Admin routes
router.put('/:id/approve', protect, authorize('admin'), approveReview);

module.exports = router;
