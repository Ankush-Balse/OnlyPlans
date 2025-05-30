import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Route imports
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import formRoutes from "./routes/forms.js";
import volunteersRoutes from "./routes/volunteers.js";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";
import healthRouter from "./routes/health.js";

// Middleware imports
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CLIENT_URL
				: "http://localhost:5173",
		credentials: true,
	})
);

// Is server healthy
app.use("/api/health", healthRouter);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/volunteers", volunteersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// // Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
// 	// Set static folder
// 	app.use(express.static(path.join(__dirname, "../dist")));

// 	// Any route that doesn't match API routes will load the React app
// 	app.get("*", (req, res) => {
// 		res.sendFile(path.join(__dirname, "../dist/index.html"));
// 	});
// }

// Error handling middleware
app.use(errorHandler);

// Schedule email reminders
import { scheduleEventReminders } from "./utils/scheduler.js";
scheduleEventReminders();

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
