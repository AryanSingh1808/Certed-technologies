const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public route
router.post('/', submitEnquiry);

// Admin routes
router.get('/', protect, authorize('admin'), getAllEnquiries);
router.get('/:id', protect, authorize('admin'), getEnquiryById);
router.put('/:id', protect, authorize('admin'), updateEnquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
