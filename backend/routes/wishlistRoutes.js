const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title thumbnail price rating category');

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
});

// @desc    Add course to wishlist
// @route   POST /api/wishlist/:courseId
// @access  Private
router.post('/:courseId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Course already in wishlist'
      });
    }

    user.wishlist.push(req.params.courseId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
});

// @desc    Remove course from wishlist
// @route   DELETE /api/wishlist/:courseId
// @access  Private
router.delete('/:courseId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      courseId => courseId.toString() !== req.params.courseId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
});

module.exports = router;
