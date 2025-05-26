import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import mongoose from "mongoose";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
	try {
		const {
			page = 1,
			limit = 10,
			sort = "-createdAt",
			category,
			search,
			tags,
			startDate,
			endDate,
			userId,
		} = req.query;

		const pageNum = parseInt(page, 10);
		const limitNum = parseInt(limit, 10);

		// Build query
		const query = {};

		// Category filter
		if (category) {
			query.category = category;
		}

		// Date range filter
		if (startDate || endDate) {
			query.date = {};
			if (startDate) {
				query.date.$gte = new Date(startDate);
			}
			if (endDate) {
				query.date.$lte = new Date(endDate);
			}
		}

		// Search
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Tags filter
		if (tags) {
			const tagList = tags.split(",");
			query.tags = { $in: tagList };
		}

		// Get user preferences if userId is provided
		let userPreferences = null;
		if (userId) {
			const user = await User.findById(userId);
			if (user?.preferences?.categories?.length > 0) {
				userPreferences = user.preferences;
			}
		}

		// Execute query
		const events = await Event.find(query)
			.sort(sort)
			.skip((pageNum - 1) * limitNum)
			.limit(limitNum)
			.populate("createdBy", "name");

		const total = await Event.countDocuments(query);

		// Get recommended events based on user preferences
		let recommendedEvents = [];
		if (userPreferences) {
			recommendedEvents = await Event.find({
				category: { $in: userPreferences.categories },
				_id: { $nin: events.map((e) => e._id) },
			})
				.sort("-createdAt")
				.limit(3)
				.populate("createdBy", "name");
		}

		res.status(200).json({
			success: true,
			data: events,
			recommendedEvents,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum),
			},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res, next) => {
	try {
		const event = await Event.findById(req.params.id)
			.populate("createdBy", "name")
			.populate("volunteers", "name");

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Get registration count
		const registrationCount = await Registration.countDocuments({
			event: req.params.id,
		});

		// Add to data
		const eventData = event.toObject();
		eventData.registrationCount = registrationCount;

		res.status(200).json({
			success: true,
			data: eventData,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin only)
export const createEvent = async (req, res, next) => {
	try {
		// Check if user is admin
		if (req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Only admins can create events",
			});
		}

		// Create event
		const event = await Event.create({
			...req.body,
			createdBy: req.user.id,
		});

		res.status(201).json({
			success: true,
			data: event,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
export const updateEvent = async (req, res, next) => {
	try {
		// Check if user is admin
		if (req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Only admins can update events",
			});
		}

		// Find and update event
		const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		res.status(200).json({
			success: true,
			data: event,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
export const deleteEvent = async (req, res, next) => {
	try {
		// Check if user is admin
		if (req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Only admins can delete events",
			});
		}

		// Find and delete event
		const event = await Event.findByIdAndDelete(req.params.id);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Delete all registrations for the event
		await Registration.deleteMany({ event: req.params.id });

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Check if event exists
		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if user is already registered
		const existingRegistration = await Registration.findOne({
			event: id,
			user: userId,
		});

		if (existingRegistration) {
			return res.status(400).json({
				success: false,
				message: "You are already registered for this event",
			});
		}

		// Create registration
		const registration = await Registration.create({
			event: id,
			user: userId,
			formResponses: req.body.formResponses || {},
		});

		// Get user details for email
		const user = await User.findById(userId);

		// Send confirmation email
		const emailData = {
			to: user.email,
			subject: `Registration Confirmation: ${event.title}`,
			text: `Thank you for registering for ${
				event.title
			}. The event will take place on ${new Date(
				event.date
			).toDateString()} at ${event.location}.`,
			html: `
        <h2>Registration Confirmation</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for registering for <strong>${event.title}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>We look forward to seeing you there!</p>
        <p>Regards,<br />The OnlyPlans Team</p>
      `,
		};

		await sendEmail(emailData);

		res.status(201).json({
			success: true,
			data: registration,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private (Admin & Volunteers)
export const getEventRegistrations = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Check if user is admin or volunteer
		if (req.user.role !== "admin" && req.user.role !== "volunteer") {
			return res.status(403).json({
				success: false,
				message: "Unauthorized",
			});
		}

		// Check if event exists
		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Get registrations
		const registrations = await Registration.find({ event: id }).populate(
			"user",
			"name email"
		);

		res.status(200).json({
			success: true,
			count: registrations.length,
			data: registrations,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Assign volunteers to an event
// @route   POST /api/events/:id/volunteers
// @access  Private (Admin only)
export const assignVolunteers = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { volunteerIds } = req.body;

		// Check if user is admin
		if (req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Only admins can assign volunteers",
			});
		}

		// Validate volunteer IDs
		if (!volunteerIds || !Array.isArray(volunteerIds)) {
			return res.status(400).json({
				success: false,
				message: "Please provide valid volunteer IDs",
			});
		}

		// Convert strings to ObjectIds
		const volunteerObjectIds = volunteerIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		// Check if all users exist and are volunteers
		const volunteers = await User.find({
			_id: { $in: volunteerObjectIds },
			role: "volunteer",
		});

		if (volunteers.length !== volunteerIds.length) {
			return res.status(400).json({
				success: false,
				message: "One or more volunteer IDs are invalid",
			});
		}

		// Update event
		const event = await Event.findByIdAndUpdate(
			id,
			{ volunteers: volunteerObjectIds },
			{ new: true }
		);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Send notification to volunteers
		for (const volunteer of volunteers) {
			const emailData = {
				to: volunteer.email,
				subject: `You've been assigned to an event: ${event.title}`,
				text: `You have been assigned as a volunteer for ${
					event.title
				}. The event will take place on ${new Date(
					event.date
				).toDateString()} at ${event.location}.`,
				html: `
          <h2>Volunteer Assignment</h2>
          <p>Dear ${volunteer.name},</p>
          <p>You have been assigned as a volunteer for <strong>${
				event.title
			}</strong>.</p>
          <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p>Please log in to your volunteer dashboard for more details.</p>
          <p>Regards,<br />The OnlyPlans Team</p>
        `,
			};

			await sendEmail(emailData);
		}

		res.status(200).json({
			success: true,
			data: event,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get event statistics
// @route   GET /api/events/:id/stats
// @access  Private (Admin & Volunteers)
export const getEventStats = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Check if user is admin or volunteer
		if (req.user.role !== "admin" && req.user.role !== "volunteer") {
			return res.status(403).json({
				success: false,
				message: "Unauthorized",
			});
		}

		// Check if event exists
		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Get registration count
		const registrationCount = await Registration.countDocuments({
			event: id,
		});

		// Get attendance count
		const attendanceCount = await Registration.countDocuments({
			event: id,
			attended: true,
		});

		// Get feedback stats
		const registrationsWithFeedback = await Registration.find({
			event: id,
			feedback: { $exists: true, $ne: null },
		});

		const feedbackCount = registrationsWithFeedback.length;

		let positiveCount = 0;
		let negativeCount = 0;

		registrationsWithFeedback.forEach((registration) => {
			if (registration.feedback.rating >= 4) {
				positiveCount++;
			} else if (registration.feedback.rating <= 2) {
				negativeCount++;
			}
		});

		res.status(200).json({
			success: true,
			data: {
				registrationCount,
				attendanceCount,
				feedbackStats: {
					total: feedbackCount,
					positive: positiveCount,
					negative: negativeCount,
					positivePercentage:
						feedbackCount > 0
							? (positiveCount / feedbackCount) * 100
							: 0,
					negativePercentage:
						feedbackCount > 0
							? (negativeCount / feedbackCount) * 100
							: 0,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};
