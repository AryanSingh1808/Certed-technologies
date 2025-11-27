const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getFeaturedCourses,
  getTrendingCourses,
  getCourseById,
  getCourseBySlug,
  searchCourses,
  getRelatedCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/trending', getTrendingCourses);
router.get('/search', searchCourses);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourseById);
router.get('/:id/related', getRelatedCourses);

// Admin routes
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
