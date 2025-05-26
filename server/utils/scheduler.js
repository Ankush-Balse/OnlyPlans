import Event from '../models/Event.js';
import User from '../models/User.js';
import emailService from './emailService.js';

export const scheduleEventReminders = () => {
  // Check for upcoming events every hour
  setInterval(async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      // Find all events happening tomorrow
      const upcomingEvents = await Event.find({
        date: {
          $gte: tomorrow,
          $lte: endOfTomorrow
        },
        status: 'published'
      }).populate({
        path: 'registrations.user',
        select: 'email preferences'
      });

      // Send reminders for each event
      for (const event of upcomingEvents) {
        const registeredUsers = event.registrations
          .filter(reg => 
            reg.status === 'approved' && 
            reg.user.preferences?.emailNotifications !== false
          )
          .map(reg => reg.user.email);

        // Send reminder emails in batches to avoid overwhelming the email service
        const batchSize = 50;
        for (let i = 0; i < registeredUsers.length; i += batchSize) {
          const batch = registeredUsers.slice(i, i + batchSize);
          await Promise.all(
            batch.map(email =>
              emailService.sendEventNotification(email, event, 'reminder')
                .catch(err => console.error(`Failed to send reminder to ${email}:`, err))
            )
          );
        }

        console.log(`Sent reminders for event: ${event.title}`);
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  }, 3600000); // Run every hour
}; 