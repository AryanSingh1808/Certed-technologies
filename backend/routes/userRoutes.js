const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getEnrolledCourses,
  getCertificates,
  updatePreferences
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.get('/certificates', protect, getCertificates);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
