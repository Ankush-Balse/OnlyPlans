import express from "express";
import multer from "multer";
import path from "path";
import { protect, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

const router = express.Router();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
	destination: "./uploads/profiles",
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
		cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
	},
});

// Get all users (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json({
			success: true,
			data: users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching users",
		});
	}
});

// Get user profile
router.get("/:id", protect, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Only allow users to view their own profile or admins to view any profile
		if (req.user.role !== "admin" && req.user.id !== req.params.id) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to view this profile",
			});
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching user profile",
		});
	}
});

// Update user profile
router.put("/:id", protect, async (req, res) => {
	try {
		console.log(req.user);
		if (req.user.role !== "admin" && req.user.id !== req.params.id) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update this profile",
			});
		}

		const fieldsToUpdate = {
			name: req.body.name,
			email: req.body.email,
			bio: req.body.bio,
			preferences: req.body.preferences,
		};

		const user = await User.findByIdAndUpdate(
			req.params.id,
			fieldsToUpdate,
			{ new: true, runValidators: true }
		).select("-password");

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating user profile",
		});
	}
});

// Update user role (admin only)
router.put("/:id/role", protect, authorize("admin"), async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ role: req.body.role },
			{ new: true, runValidators: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating user role",
		});
	}
});

// Delete user (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		await user.remove();

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting user",
		});
	}
});

// Update profile picture
router.put(
	"/:id/profile-picture",
	protect,
	upload.single("profilePicture"),
	async (req, res) => {
		try {
			// Only allow users to update their own profile picture or admins to update any profile picture
			if (req.user.role !== "admin" && req.user.id !== req.params.id) {
				return res.status(403).json({
					success: false,
					message: "Not authorized to update this profile picture",
				});
			}

			if (!req.file) {
				return res.status(400).json({
					success: false,
					message: "Please upload a file",
				});
			}

			const user = await User.findByIdAndUpdate(
				req.params.id,
				{ profilePicture: `/uploads/profiles/${req.file.filename}` },
				{ new: true, runValidators: true }
			).select("-password");

			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			res.status(200).json({
				success: true,
				data: user,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating profile picture",
			});
		}
	}
);

export default router;
