import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Define email options
  const mailOptions = {
    from: `OnlyPlans <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };
  
  // Send email
  try {
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${options.to}`);
    } else {
      console.log('Email not sent in development mode');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
    }
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Email could not be sent');
  }
};

// Function to send event reminder emails
export const sendEventReminders = async (event, registrations) => {
  try {
    // Create email template
    const createEmailTemplate = (userName, eventTitle, eventDate, eventLocation) => {
      return {
        subject: `Reminder: ${eventTitle} is coming up soon!`,
        text: `Hello ${userName},\n\nThis is a reminder that ${eventTitle} is scheduled for ${new Date(eventDate).toDateString()} at ${eventLocation}.\n\nWe look forward to seeing you there!\n\nRegards,\nThe OnlyPlans Team`,
        html: `
          <h2>Event Reminder</h2>
          <p>Hello ${userName},</p>
          <p>This is a reminder that <strong>${eventTitle}</strong> is scheduled for <strong>${new Date(eventDate).toDateString()}</strong> at ${eventLocation}.</p>
          <p>We look forward to seeing you there!</p>
          <p>Regards,<br />The OnlyPlans Team</p>
        `
      };
    };
    
    // Send emails to all registrants
    for (const registration of registrations) {
      const emailTemplate = createEmailTemplate(
        registration.user.name,
        event.title,
        event.date,
        event.location
      );
      
      await sendEmail({
        to: registration.user.email,
        ...emailTemplate
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error sending reminders:', error);
    return false;
  }
};