const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { sendEmail } = require('../utils/emailService');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing && existing.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }

    // Create or update subscription
    const newsletter = await Newsletter.findOneAndUpdate(
      { email },
      { email, name, status: 'active', subscribedAt: new Date() },
      { upsert: true, new: true }
    );

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Certed Technologies Newsletter',
        html: `
          <h2>Welcome to Certed Technologies!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
          <ul>
            <li>Latest course updates</li>
            <li>Industry insights and tips</li>
            <li>Exclusive offers and discounts</li>
            <li>Expert advice and resources</li>
          </ul>
          <p>Stay tuned for valuable content!</p>
          <p>Best Regards,<br>Certed Technologies Team</p>
        `
      });
    } catch (emailError) {
      console.error('Newsletter email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message
    });
  }
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    await Newsletter.findOneAndUpdate(
      { email },
      { status: 'unsubscribed', unsubscribedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing',
      error: error.message
    });
  }
});

module.exports = router;
