import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "user", // Default role
		});

		// Send welcome email
		const emailData = {
			to: email,
			subject: "Welcome to OnlyPlans!",
			text: `Hello ${name},\n\nThank you for joining OnlyPlans! We're excited to have you as a member.\n\nRegards,\nThe OnlyPlans Team`,
			html: `
        <h2>Welcome to OnlyPlans!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining OnlyPlans! We're excited to have you as a member.</p>
        <p>You can now discover, register for, and create amazing events.</p>
        <p>Regards,<br />The OnlyPlans Team</p>
      `,
		};

		await sendEmail(emailData);

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			userId: user._id,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Check for user email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate JWT
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});

		// Remove password from response
		const userObject = user.toObject();
		delete userObject.password;

		res.status(200).json({
			success: true,
			user: userObject,
			token,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
	res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Generate reset token
		const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Save reset token to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
		await user.save();

		// Create reset url
		const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

		// Send email
		const emailData = {
			to: email,
			subject: "OnlyPlans Password Reset",
			text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
			html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link is valid for 1 hour.</p>
      `,
		};

		await sendEmail(emailData);

		res.status(200).json({
			success: true,
			message: "Password reset email sent",
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
	try {
		const { resetToken } = req.params;
		const { password } = req.body;

		// Verify token
		try {
			const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

			// Find user by token
			const user = await User.findOne({
				_id: decoded.id,
				resetPasswordToken: resetToken,
				resetPasswordExpire: { $gt: Date.now() },
			});

			if (!user) {
				return res.status(400).json({
					success: false,
					message: "Invalid or expired token",
				});
			}

			// Hash new password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			// Clear reset token fields
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();

			res.status(200).json({
				success: true,
				message: "Password reset successful",
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired token",
			});
		}
	} catch (error) {
		next(error);
	}
};
