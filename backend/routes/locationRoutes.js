const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .sort('displayOrder city');

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
});

// @desc    Get location by ID
// @route   GET /api/locations/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
});

module.exports = router;
