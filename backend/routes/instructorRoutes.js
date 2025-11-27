const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find({ isActive: true })
      .populate('courses', 'title thumbnail')
      .sort('-isFeatured -rating.average');

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructors',
      error: error.message
    });
  }
});

// @desc    Get instructor by ID
// @route   GET /api/instructors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .populate('courses', 'title thumbnail price rating');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor',
      error: error.message
    });
  }
});

module.exports = router;
