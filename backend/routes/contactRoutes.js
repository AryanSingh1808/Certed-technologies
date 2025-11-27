const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const contact = await ContactSubmission.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message - Certed Technologies',
        html: `
          <h2>Thank You for Contacting Us!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and will get back to you shortly.</p>
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
          <p>Best Regards,<br>Certed Technologies Team</p>
        `
      });

      // Notify admin
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission - ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will contact you soon!',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

module.exports = router;
