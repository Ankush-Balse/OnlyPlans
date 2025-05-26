import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// Create user
		user = await User.create({
			name,
			email,
			password,
		});

		sendTokenResponse(user, 201, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error in user registration",
		});
	}
});

// Login user
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		sendTokenResponse(user, 200, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error in login",
		});
	}
});

// Get current user
router.get("/me", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error getting user info",
		});
	}
});

// Logout user
router.get("/logout", (req, res) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "User logged out successfully",
	});
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	const options = {
		expires: new Date(
			Date.now() +
				parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode)
		.cookie("token", token, options)
		.json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				profilePicture: user.profilePicture,
				preferences: user.preferences,
				bio: user.bio,
			},
		});
};

export default router;
