import User from "../models/User.js";
import Event from "../models/Event.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
export const getVolunteers = asyncHandler(async (req, res) => {
	const volunteers = await User.find({ role: "volunteer" }).select(
		"-password"
	);
	res.status(200).json({
		success: true,
		data: volunteers,
	});
});

// @desc    Make a user a volunteer
// @route   POST /api/volunteers/:userId
// @access  Private/Admin
export const makeVolunteer = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		throw new ErrorResponse("User not found", 404);
	}

	user.role = "volunteer";
	await user.save();

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Remove volunteer role from user
// @route   DELETE /api/volunteers/:userId
// @access  Private/Admin
export const removeVolunteer = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		throw new ErrorResponse("User not found", 404);
	}

	if (user.role !== "volunteer") {
		throw new ErrorResponse("User is not a volunteer", 400);
	}

	user.role = "user";
	await user.save();

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Get events assigned to volunteer
// @route   GET /api/volunteers/my-events
// @access  Private/Volunteer
export const getVolunteerEvents = asyncHandler(async (req, res) => {
	const events = await Event.find({
		volunteers: req.user._id || req.user.id,
	}).populate("organizer", "name email");

	res.status(200).json({
		success: true,
		data: events,
	});
});

// @desc    Get volunteer dashboard data
// @route   GET /api/volunteers/:id/dashboard
// @access  Private/Volunteer
export const getVolunteerDashboard = asyncHandler(async (req, res) => {
	// Check if the volunteer is accessing their own dashboard
	if (req.user._id.toString() !== req.params.id) {
		throw new ErrorResponse("Not authorized to access this dashboard", 403);
	}

	// Get events where the volunteer is assigned
	const events = await Event.find({
		volunteers: req.user._id,
	}).populate("createdBy", "name");

	// Calculate statistics
	const stats = {
		totalEvents: events.length,
		totalRegistrations: 0,
		pendingApprovals: 0,
		upcomingEvents: events.filter(
			(event) => new Date(event.date) > new Date()
		),
		totalVolunteers: 0,
		completedEvents: events.filter((event) => event.status === "completed")
			.length,
		pendingTasks: events.filter((event) => event.status === "pending")
			.length,
	};

	// Calculate total registrations and pending approvals
	for (const event of events) {
		stats.totalRegistrations += event.registrations
			? event.registrations.length
			: 0;
		stats.pendingApprovals += event.registrations
			? event.registrations.filter((reg) => reg.status === "pending")
					.length
			: 0;
	}

	// Get total volunteers count (from all events)
	const volunteerCounts = await Event.aggregate([
		{ $match: { volunteers: req.user._id } },
		{ $project: { volunteerCount: { $size: "$volunteers" } } },
		{ $group: { _id: null, total: { $sum: "$volunteerCount" } } },
	]);
	stats.totalVolunteers =
		volunteerCounts.length > 0 ? volunteerCounts[0].total : 0;

	res.status(200).json({
		success: true,
		data: stats,
	});
});
