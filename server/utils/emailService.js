import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import User from "../models/User.js";

class EmailService {
	constructor() {
		// this.transporter = nodemailer.createTransport({
		// 	host: process.env.SMTP_HOST,
		// 	port: parseInt(process.env.SMTP_PORT),
		// 	secure: process.env.SMTP_SECURE === "true",
		// 	auth: {
		// 		user: process.env.EMAIL_USER,
		// 		pass: process.env.EMAIL_PASS,
		// 	},
		// });
		this.transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	async sendEventNotification(to, event, type) {
		try {
			// Check user preferences for email notifications
			const user = await User.findOne({ email: to });
			if (!user?.preferences?.emailNotifications) {
				console.log(`User ${to} has disabled email notifications`);
				return false;
			}

			const templates = {
				registration: {
					subject: `Registration Confirmed: ${event.title}`,
					text: `Thank you for registering for ${event.title}!\n\nEvent Details:\nDate: ${event.date}\nLocation: ${event.location}\n\nWe look forward to seeing you there!`,
				},
				reminder: {
					subject: `Reminder: ${event.title} is Tomorrow!`,
					text: `This is a reminder that ${event.title} is happening tomorrow!\n\nEvent Details:\nDate: ${event.date}\nLocation: ${event.location}\n\nWe look forward to seeing you there!`,
				},
				cancellation: {
					subject: `Event Cancelled: ${event.title}`,
					text: `We regret to inform you that ${event.title} has been cancelled.\n\nIf you have any questions, please contact the event organizers.`,
				},
			};

			const template = templates[type];
			if (!template) throw new Error("Invalid notification type");

			const mailOptions = {
				from: process.env.SMTP_FROM,
				to: user.email,
				subject: template.subject,
				text: template.text,
				html: template.text.replace(/\n/g, "<br>"),
			};

			await this.transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					console.log("error", err.message);
				} else {
					console.log("sent", info.response);
				}
			});

			return true;
		} catch (error) {
			console.error("Email sending failed:", error);
			throw error;
		}
	}

	async sendVolunteerAssignment(to, event) {
		try {
			// Check user preferences for email notifications
			const user = await User.findOne({ email: to });
			if (!user?.preferences?.emailNotifications) {
				console.log(`User ${to} has disabled email notifications`);
				return false;
			}

			const mailOptions = {
				from: process.env.SMTP_FROM,
				to,
				subject: `You've Been Assigned as a Volunteer: ${event.title}`,
				text: `You have been assigned as a volunteer for ${event.title}.\n\nEvent Details:\nDate: ${event.date}\nLocation: ${event.location}\n\nPlease log in to the platform to manage your responsibilities.`,
				html: `<h2>Volunteer Assignment</h2>
					<p>You have been assigned as a volunteer for <strong>${event.title}</strong>.</p>
					<h3>Event Details:</h3>
					<p>Date: ${event.date}</p>
					<p>Location: ${event.location}</p>
					<p>Please log in to the platform to manage your responsibilities.</p>`,
			};

			await this.transporter.sendMail(mailOptions);
			return true;
		} catch (error) {
			console.error("Email sending failed:", error.message);
			console.log(this.transporter);
			throw error;
		}
	}
}

export default new EmailService();
