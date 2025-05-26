import { sendEmail } from '../utils/email.js';
import User from '../models/User.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    // Send email to admin
    const emailData = {
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `Contact Form: ${subject || 'New Message'}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await sendEmail(emailData);

    // Check user preferences for confirmation email
    const user = await User.findOne({ email });
    if (user?.preferences?.emailNotifications !== false) {
      // Send confirmation email to user
      const confirmationEmail = {
        to: email,
        subject: 'Thank you for contacting us',
        text: `
          Dear ${name},

          Thank you for contacting us. We have received your message and will get back to you shortly.

          Best regards,
          The OnlyPlans Team
        `,
        html: `
          <h2>Thank you for contacting us</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
          <p>Best regards,<br />The OnlyPlans Team</p>
        `
      };

      await sendEmail(confirmationEmail);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    next(error);
  }
}; 