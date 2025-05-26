import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin only)
export const getStatistics = async (req, res, next) => {
	try {
		// Get total counts
		const totalUsers = await User.countDocuments();
		const totalEvents = await Event.countDocuments();
		const totalRegistrations = await Registration.countDocuments();

		// Get recent events (last 5)
		const recentEvents = await Event.find()
			.sort("-createdAt")
			.limit(5)
			.populate("createdBy", "name");

		// Get user growth (last 7 days)
		const userGrowth = await User.aggregate([
			{
				$match: {
					createdAt: {
						$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
					},
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$createdAt",
						},
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Get event categories distribution
		const eventCategories = await Event.aggregate([
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
				},
			},
		]);

		// Get registration trends (last 7 days)
		const registrationTrends = await Registration.aggregate([
			{
				$match: {
					createdAt: {
						$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
					},
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$createdAt",
						},
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		res.status(200).json({
			success: true,
			data: {
				totalUsers,
				totalEvents,
				totalRegistrations,
				recentEvents,
				userGrowth: userGrowth.map((item) => ({
					date: item._id,
					count: item.count,
				})),
				eventCategories: eventCategories.map((item) => ({
					category: item._id,
					count: item.count,
				})),
				registrationTrends: registrationTrends.map((item) => ({
					date: item._id,
					count: item.count,
				})),
			},
		});
	} catch (error) {
		next(error);
	}
};
