const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const user = await User.findOne({
      'certificates.certificateId': req.params.certificateId
    }).populate('certificates.course', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    const certificate = user.certificates.find(
      cert => cert.certificateId === req.params.certificateId
    );

    res.status(200).json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        studentName: user.name,
        courseName: certificate.course.title,
        issuedDate: certificate.issuedDate,
        valid: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying certificate',
      error: error.message
    });
  }
});

// @desc    Download certificate
// @route   GET /api/certificates/:enrollmentId/download
// @access  Private
router.get('/:enrollmentId/download', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('course', 'title')
      .populate('user', 'name email');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!enrollment.certificate.issued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate not yet issued for this course'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        certificateUrl: enrollment.certificate.certificateUrl,
        certificateId: enrollment.certificate.certificateId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading certificate',
      error: error.message
    });
  }
});

module.exports = router;
