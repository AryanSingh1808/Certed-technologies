const Enquiry = require('../models/Enquiry');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit course enquiry
// @route   POST /api/enquiry
// @access  Public
exports.submitEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      course,
      courseName,
      branch,
      city,
      companyName,
      message,
      enquiryType,
      source,
    } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and phone number',
      });
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      course,
      courseName: courseName || '',
      branch,
      city: city || '',
      companyName: companyName || '',
      message: message || '',
      enquiryType: enquiryType || 'course',
      source: source || 'website',
    });

    console.log('✅ New enquiry received:', enquiry._id);

    // Send confirmation email to user
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Enquiry Received</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for your interest in Certed Technologies! We have received your enquiry and our team will get back to you within 24 hours.</p>
              
              <div class="details">
                <h3>Your Enquiry Details:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                ${courseName ? `<p><strong>Course:</strong> ${courseName}</p>` : ''}
                ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
                ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p>For immediate assistance, please call us at <strong>+91-XXXXXXXXXX</strong></p>
              
              <p>Best Regards,<br><strong>Certed Technologies Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 Certed Technologies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: email,
        subject: 'Enquiry Received - Certed Technologies',
        html: emailHtml,
      });

      console.log('✅ Confirmation email sent to user');
    } catch (emailError) {
      console.error('⚠️  Email sending error:', emailError.message);
      // Continue even if email fails - don't block enquiry submission
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will contact you soon!',
      data: enquiry,
    });
  } catch (error) {
    console.error('❌ Submit enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting enquiry',
      error: error.message,
    });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiry
// @access  Private (Admin)
exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, enquiryType, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (enquiryType) query.enquiryType = enquiryType;

    const skip = (page - 1) * limit;

    const enquiries = await Enquiry.find(query)
      .populate('course', 'title')
      .populate('branch', 'name city')
      .sort(sort)
      .limit(limit * 1)
      .skip(skip);

    const count = await Enquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: enquiries,
    });
  } catch (error) {
    console.error('❌ Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiries',
      error: error.message,
    });
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiry/:id
// @access  Private (Admin)
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('course', 'title thumbnail')
      .populate('branch', 'name city address')
      .populate('assignedTo', 'name email');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('❌ Get enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiry',
      error: error.message,
    });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiry/:id
// @access  Private (Admin)
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    if (status) enquiry.status = status;

    if (notes) {
      enquiry.notes.push({
        note: notes,
        addedBy: req.user.id,
        addedAt: new Date(),
      });
    }

    if (status === 'contacted' && !enquiry.contactedAt) {
      enquiry.contactedAt = new Date();
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry,
    });
  } catch (error) {
    console.error('❌ Update enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating enquiry',
      error: error.message,
    });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiry/:id
// @access  Private (Admin)
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting enquiry',
      error: error.message,
    });
  }
};
