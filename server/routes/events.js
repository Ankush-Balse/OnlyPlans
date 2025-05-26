import express from "express";
import multer from "multer";
import path from "path";
import {
	protect,
	authorize,
	isEventVolunteer,
} from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
import emailService from "../utils/emailService.js";
import { Parser } from "json2csv";
import User from "../models/User.js";
import fs from "fs";
import { promisify } from "util";

const router = express.Router();

const unlinkAsync = promisify(fs.unlink);

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath =
			file.fieldname === "speakerImages"
				? "./uploads/speakers"
				: "./uploads/events";
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5000000 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png/;
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = filetypes.test(file.mimetype);
		if (extname && mimetype) {
			return cb(null, true);
		}
		cb(new Error("Only images are allowed!"));
	},
});

// Get all events with filters
router.get("/", async (req, res) => {
	const { type } = req.query;

	// If type is specified, ensure user is authenticated
	if (type) {
		return protect(req, res, async () => {
			try {
				const {
					search,
					tags,
					status,
					startDate,
					endDate,
					page = 1,
					limit = 10,
				} = req.query;

				const query = {};

				// Basic filters
				if (search) {
					query.$or = [
						{ title: { $regex: search, $options: "i" } },
						{ description: { $regex: search, $options: "i" } },
					];
				}
				if (tags) query.tags = { $in: tags.split(",") };
				if (status) query.status = status;
				if (startDate || endDate) {
					query.date = {};
					if (startDate) query.date.$gte = new Date(startDate);
					if (endDate) query.date.$lte = new Date(endDate);
				}

				// User-specific filters
				if (req.user && type) {
					switch (type) {
						case "registered":
							query["registrations.user"] =
								req.user._id || req.user.id;
							break;
						case "managed":
							query.$or = [
								{ createdBy: req.user._id || req.user.id },
								{ volunteers: req.user._id || req.user.id },
							];
							break;
						case "volunteering":
							query.volunteers = req.user._id || req.user.id;
							break;
					}
				}

				// If user is admin or volunteer, allow seeing non-active events
				if (
					req.user &&
					(req.user.role === "admin" || req.user.role === "volunteer")
				) {
					// Don't add status filter unless explicitly requested
					if (status) query.status = status;
				} else {
					// For normal users, only show active events
					query.status = "published";
				}

				const events = await Event.find(query)
					.populate("createdBy", "name")
					.populate("volunteers", "name email")
					.sort({ date: 1 })
					.skip((page - 1) * limit)
					.limit(parseInt(limit));

				const total = await Event.countDocuments(query);

				res.status(200).json({
					success: true,
					data: events,
					pagination: {
						page: parseInt(page),
						limit: parseInt(limit),
						total,
					},
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					message: "Error fetching events",
				});
			}
		});
	}

	// For public event listing (no type specified)
	try {
		const {
			search,
			tags,
			status,
			startDate,
			endDate,
			page = 1,
			limit = 10,
		} = req.query;

		const query = {};

		if (status) {
			if (status !== "all") {
				query.status = status;
			}
		} else {
			query.status = "published";
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}
		if (tags) query.tags = { $in: tags.split(",") };
		if (startDate || endDate) {
			query.date = {};
			if (startDate) query.date.$gte = new Date(startDate);
			if (endDate) query.date.$lte = new Date(endDate);
		}

		const events = await Event.find(query)
			.populate("createdBy", "name")
			.sort({ date: 1 })
			.skip((page - 1) * limit)
			.limit(parseInt(limit));

		const total = await Event.countDocuments(query);

		res.status(200).json({
			success: true,
			data: events,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching events",
		});
	}
});

// Create event with speaker images
router.post(
	"/",
	protect,
	authorize("admin"),
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "speakerImages", maxCount: 10 },
	]),
	async (req, res) => {
		try {
			const eventData = {
				...req.body,
				createdBy: req.user._id || req.user.id,
			};

			if (req.files?.image) {
				eventData.image = `/uploads/events/${req.files.image[0].filename}`;
			}

			// Parse JSON strings for speakers and schedule
			if (typeof eventData.speakers === "string") {
				eventData.speakers = JSON.parse(eventData.speakers);
			}
			if (typeof eventData.schedule === "string") {
				eventData.schedule = JSON.parse(eventData.schedule);
			}
			if (typeof eventData.tags === "string") {
				eventData.tags = JSON.parse(eventData.tags);
			}
			if (typeof eventData.speakerImageIndices === "string") {
				eventData.speakerImageIndices = JSON.parse(
					eventData.speakerImageIndices
				);
			}

			// Assign speaker images if provided
			if (req.files?.speakerImages && eventData.speakerImageIndices) {
				const speakerImages = req.files.speakerImages;
				eventData.speakers = eventData.speakers.map(
					(speaker, speakerIndex) => {
						const imageIndex =
							eventData.speakerImageIndices[speakerIndex];
						return {
							...speaker,
							image:
								imageIndex !== undefined &&
								speakerImages[imageIndex]
									? `/uploads/speakers/${speakerImages[imageIndex].filename}`
									: null,
						};
					}
				);
			}

			const event = await Event.create(eventData);
			res.status(201).json({
				success: true,
				data: event,
			});
		} catch (error) {
			console.error("Error creating event:", error);
			res.status(500).json({
				success: false,
				message: "Error creating event",
				error: error.message,
			});
		}
	}
);

// Get single event
router.get("/:id", async (req, res) => {
	try {
		const event = await Event.findById(req.params.id)
			.populate("createdBy", "name")
			.populate("volunteers", "name email");

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
		res.status(500).json({
			success: false,
			message: "Error fetching event",
		});
	}
});

// Update event
router.put(
	"/:id",
	protect,
	isEventVolunteer,
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "speakerImages", maxCount: 10 },
	]),
	async (req, res) => {
		try {
			const eventData = { ...req.body };
			const event = await Event.findById(req.params.id);

			if (!event) {
				return res.status(404).json({
					success: false,
					message: "Event not found",
				});
			}

			// Handle main event image
			if (req.files?.image) {
				// Delete old image if it exists
				if (event.image) {
					const oldImagePath = path.join(".", event.image);
					try {
						await unlinkAsync(oldImagePath);
					} catch (err) {
						console.error("Error deleting old event image:", err);
					}
				}
				eventData.image = `/uploads/events/${req.files.image[0].filename}`;
			}

			// Parse JSON strings
			if (typeof eventData.speakers === "string") {
				eventData.speakers = JSON.parse(eventData.speakers);
			}
			if (typeof eventData.schedule === "string") {
				eventData.schedule = JSON.parse(eventData.schedule);
			}
			if (typeof eventData.tags === "string") {
				eventData.tags = JSON.parse(eventData.tags);
			}
			if (typeof eventData.speakerImageIndices === "string") {
				eventData.speakerImageIndices = JSON.parse(
					eventData.speakerImageIndices
				);
			}

			// Handle speaker images
			if (eventData.speakers) {
				const oldSpeakers = event.speakers || [];
				const newSpeakers = eventData.speakers;

				// Find deleted speakers and remove their images
				for (const oldSpeaker of oldSpeakers) {
					const speakerStillExists = newSpeakers.some(
						(s) => s._id === oldSpeaker._id
					);
					if (!speakerStillExists && oldSpeaker.image) {
						const imagePath = path.join(".", oldSpeaker.image);
						try {
							await unlinkAsync(imagePath);
						} catch (err) {
							console.error("Error deleting speaker image:", err);
						}
					}
				}

				// Handle new and updated speaker images
				if (req.files?.speakerImages && eventData.speakerImageIndices) {
					const speakerImages = req.files.speakerImages;

					eventData.speakers = newSpeakers.map(
						(speaker, speakerIndex) => {
							// If this speaker has a new image assigned
							const imageIndex =
								eventData.speakerImageIndices[speakerIndex];
							if (
								imageIndex !== undefined &&
								speakerImages[imageIndex]
							) {
								// If speaker had an old image, delete it
								const oldSpeaker = oldSpeakers.find(
									(s) => s._id === speaker._id
								);
								if (oldSpeaker?.image) {
									const oldImagePath = path.join(
										".",
										oldSpeaker.image
									);
									try {
										unlinkAsync(oldImagePath);
									} catch (err) {
										console.error(
											"Error deleting old speaker image:",
											err
										);
									}
								}

								return {
									...speaker,
									image: `/uploads/speakers/${speakerImages[imageIndex].filename}`,
								};
							}

							// If speaker exists in old speakers, keep their existing image
							const oldSpeaker = oldSpeakers.find(
								(s) => s._id === speaker._id
							);
							if (oldSpeaker) {
								return {
									...speaker,
									image: oldSpeaker.image,
								};
							}

							// New speaker without image
							return speaker;
						}
					);
				}
			}

			const updatedEvent = await Event.findByIdAndUpdate(
				req.params.id,
				eventData,
				{ new: true, runValidators: true }
			).populate("volunteers", "name email");

			res.status(200).json({
				success: true,
				data: updatedEvent,
			});
		} catch (error) {
			console.error("Error updating event:", error);
			res.status(500).json({
				success: false,
				message: "Error updating event",
				error: error.message,
			});
		}
	}
);

// Delete event
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		await event.remove();
		res.status(200).json({
			success: true,
			message: "Event deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting event",
		});
	}
});

// Register for event
router.post("/:id/register", protect, async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if event is active
		if (event.status !== "published") {
			return res.status(400).json({
				success: false,
				message: "Event is not open for registration",
			});
		}

		// Check if already registered
		const isRegistered = event.registrations.some(
			(reg) =>
				reg.user.toString() === (req.user._id || req.user.id).toString()
		);

		if (isRegistered) {
			return res.status(400).json({
				success: false,
				message: "You are already registered for this event",
			});
		}

		// Check if event is full
		if (
			event.maxAttendees &&
			event.registrations.length >= event.maxAttendees
		) {
			return res.status(400).json({
				success: false,
				message: "Event is already full",
			});
		}

		// Check if event date has passed
		if (new Date(event.date) < new Date()) {
			return res.status(400).json({
				success: false,
				message: "Cannot register for past events",
			});
		}

		// Validate form data
		const formData = req.body.formData || {};
		const formErrors = [];

		// Check if all required fields are present and validate field types
		event.registrationForm.fields.forEach((field) => {
			if (field.required && !formData[field.label]) {
				formErrors.push(`${field.label} is required`);
			} else if (formData[field.label]) {
				// Type validation
				switch (field.type) {
					case "email":
						if (
							!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
								formData[field.label]
							)
						) {
							formErrors.push(
								`${field.label} must be a valid email`
							);
						}
						break;
					case "number":
						if (isNaN(formData[field.label])) {
							formErrors.push(`${field.label} must be a number`);
						}
						break;
					case "select":
						if (
							field.options &&
							!field.options.find(
								(opt) => opt.value === formData[field.label]
							)
						) {
							formErrors.push(
								`${field.label} must be one of the provided options`
							);
						}
						break;
					case "date":
						if (isNaN(new Date(formData[field.label]).getTime())) {
							formErrors.push(
								`${field.label} must be a valid date`
							);
						}
						break;
					case "phone":
						// Basic phone number validation (allows international format)
						if (!/^\+?[\d\s-()]{8,}$/.test(formData[field.label])) {
							formErrors.push(
								`${field.label} must be a valid phone number`
							);
						}
						break;
					case "url":
						// URL validation
						try {
							new URL(formData[field.label]);
						} catch (error) {
							formErrors.push(
								`${field.label} must be a valid URL`
							);
						}
						break;
				}
			}
		});

		if (formErrors.length > 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid form data",
				errors: formErrors,
			});
		}

		// Add registration
		event.registrations.push({
			user: req.user._id || req.user.id,
			status: "confirmed",
			registeredAt: new Date(),
			formData: formData,
		});

		await event.save();

		// Send confirmation email
		try {
			await emailService.sendEventNotification(
				req.user.email,
				event,
				"registration"
			);
		} catch (emailError) {
			console.error("Failed to send confirmation email:", emailError);
		}

		res.status(200).json({
			success: true,
			message: "Successfully registered for event",
			data: {
				event: {
					_id: event._id,
					title: event.title,
					date: event.date,
					location: event.location,
				},
				registration:
					event.registrations[event.registrations.length - 1],
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({
			success: false,
			message: "Error registering for event",
		});
	}
});

// Update registration status
router.put(
	"/:id/registrations/:userId",
	protect,
	isEventVolunteer,
	async (req, res) => {
		try {
			const event = await Event.findById(req.params.id);
			const registration = event.registrations.id(req.params.userId);

			if (!registration) {
				return res.status(404).json({
					success: false,
					message: "Registration not found",
				});
			}

			registration.status = req.body.status;
			await event.save();

			res.status(200).json({
				success: true,
				data: registration,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating registration",
			});
		}
	}
);

// Update registration form
router.put("/:id/registration-form", protect, async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if user is admin or assigned volunteer
		if (
			req.user.role !== "admin" &&
			!event.volunteers.includes(req.user._id || req.user.id)
		) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update registration form",
			});
		}

		// Update form fields
		event.registrationForm = {
			fields: req.body.fields,
			lastUpdatedBy: req.user._id || req.user.id,
			lastUpdatedAt: new Date(),
		};

		// If event is in draft status, update to pending
		if (event.status === "draft") {
			event.status = "pending";
		}

		await event.save();

		res.status(200).json({
			success: true,
			message: "Registration form updated successfully",
			data: event,
		});
	} catch (error) {
		console.error("Error updating registration form:", error);
		res.status(500).json({
			success: false,
			message: "Error updating registration form",
		});
	}
});

// Assign volunteer to event
router.post(
	"/:id/volunteers",
	protect,
	authorize("admin"),
	async (req, res) => {
		try {
			const event = await Event.findById(req.params.id);
			if (!event) {
				return res.status(404).json({
					success: false,
					message: "Event not found",
				});
			}

			const volunteerId = req.body.volunteerId;

			// Check if volunteer exists and has volunteer role
			const volunteer = await User.findById(volunteerId);
			if (!volunteer || volunteer.role !== "volunteer") {
				return res.status(400).json({
					success: false,
					message: "Invalid volunteer ID or user is not a volunteer",
				});
			}

			if (event.volunteers.includes(volunteerId)) {
				return res.status(400).json({
					success: false,
					message: "Volunteer already assigned to this event",
				});
			}

			// Add event to volunteer's managedEvents
			volunteer.managedEvents.push(event._id);
			await volunteer.save();

			// Add volunteer to event's volunteers
			event.volunteers.push(volunteerId);

			// If this is the first volunteer being assigned and event is in draft status
			if (event.status === "draft" && event.volunteers.length === 1) {
				event.status = "published";
			}

			await event.save();

			// Send email to volunteer
			try {
				await emailService.sendVolunteerAssignment(
					volunteer.email,
					event
				);
			} catch (emailError) {
				console.error(
					"Failed to send volunteer assignment email:",
					emailError
				);
			}

			res.status(200).json({
				success: true,
				message: "Volunteer assigned successfully",
				data: event,
			});
		} catch (error) {
			console.error("Error assigning volunteer:", error);
			res.status(500).json({
				success: false,
				message: "Error assigning volunteer",
			});
		}
	}
);

// Update event status
router.patch("/:id/status", protect, authorize("admin"), async (req, res) => {
	try {
		const { status } = req.body;
		const event = await Event.findById(req.params.id);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Validate status transition
		if (status === "published") {
			// Check if event has volunteers and registration form
			if (event.volunteers.length === 0) {
				return res.status(400).json({
					success: false,
					message:
						"Cannot activate event without assigned volunteers",
				});
			}
			if (!event.registrationForm?.fields?.length) {
				return res.status(400).json({
					success: false,
					message: "Cannot activate event without registration form",
				});
			}
		}

		event.status = status;
		await event.save();

		res.status(200).json({
			success: true,
			message: "Event status updated successfully",
			data: event,
		});
	} catch (error) {
		console.error("Error updating event status:", error);
		res.status(500).json({
			success: false,
			message: "Error updating event status",
		});
	}
});

// Export registrations to CSV
router.get("/:id/export", protect, isEventVolunteer, async (req, res) => {
	try {
		const event = await Event.findById(req.params.id).populate(
			"registrations.user",
			"name email"
		);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		const registrations = event.registrations.map((reg) => ({
			name: reg.user.name,
			email: reg.user.email,
			status: reg.status,
			submittedAt: reg.submittedAt,
			...reg.formData,
		}));

		const parser = new Parser();
		const csv = parser.parse(registrations);

		res.header("Content-Type", "text/csv");
		res.attachment(`${event.title}-registrations.csv`);
		res.send(csv);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error exporting registrations",
		});
	}
});

// Update speaker image
router.put(
	"/:id/speakers/:speakerIndex/image",
	protect,
	authorize("admin"),
	upload.single("image"),
	async (req, res) => {
		try {
			const { id, speakerIndex } = req.params;
			const event = await Event.findById(id);

			if (!event) {
				return res.status(404).json({
					success: false,
					message: "Event not found",
				});
			}

			if (!event.speakers[speakerIndex]) {
				return res.status(404).json({
					success: false,
					message: "Speaker not found",
				});
			}

			if (!req.file) {
				return res.status(400).json({
					success: false,
					message: "Please upload an image",
				});
			}

			// Update speaker image
			event.speakers[
				speakerIndex
			].image = `/uploads/speakers/${req.file.filename}`;
			await event.save();

			res.status(200).json({
				success: true,
				data: event.speakers[speakerIndex],
			});
		} catch (error) {
			console.error("Error updating speaker image:", error);
			res.status(500).json({
				success: false,
				message: "Error updating speaker image",
			});
		}
	}
);

// Remove volunteer from event
router.delete(
	"/:id/volunteers/:volunteerId",
	protect,
	authorize("admin"),
	async (req, res) => {
		try {
			const event = await Event.findById(req.params.id);
			if (!event) {
				return res.status(404).json({
					success: false,
					message: "Event not found",
				});
			}

			const { volunteerId } = req.params;

			// Check if volunteer exists and has volunteer role
			const volunteer = await User.findById(volunteerId);
			if (!volunteer || volunteer.role !== "volunteer") {
				return res.status(400).json({
					success: false,
					message: "Invalid volunteer ID or user is not a volunteer",
				});
			}

			if (!event.volunteers.includes(volunteerId)) {
				return res.status(400).json({
					success: false,
					message: "Volunteer is not assigned to this event",
				});
			}

			// Remove event from volunteer's managedEvents
			volunteer.managedEvents = volunteer.managedEvents.filter(
				(eventId) => eventId.toString() !== event._id.toString()
			);
			await volunteer.save();

			// Remove volunteer from event's volunteers
			event.volunteers = event.volunteers.filter(
				(id) => id.toString() !== volunteerId
			);
			await event.save();

			res.status(200).json({
				success: true,
				message: "Volunteer removed successfully",
				data: event,
			});
		} catch (error) {
			console.error("Error removing volunteer:", error);
			res.status(500).json({
				success: false,
				message: "Error removing volunteer",
			});
		}
	}
);

// Get event registrations
router.get(
	"/:id/registrations",
	protect,
	authorize("admin", "volunteer"),
	async (req, res) => {
		try {
			const event = await Event.findById(req.params.id).populate(
				"registrations.user",
				"name email"
			);

			if (!event) {
				return res.status(404).json({
					success: false,
					message: "Event not found",
				});
			}

			res.status(200).json({
				success: true,
				data: event.registrations,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching event registrations",
			});
		}
	}
);

export default router;
