import express from "express";
import {
	getVolunteers,
	makeVolunteer,
	removeVolunteer,
	getVolunteerEvents,
	getVolunteerDashboard
} from "../controllers/volunteersController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorize("admin"), getVolunteers);
router.post("/:userId", protect, authorize("admin"), makeVolunteer);
router.delete("/:userId", protect, authorize("admin"), removeVolunteer);

// Volunteer routes
router.get('/:id/dashboard', protect, authorize('volunteer'), getVolunteerDashboard);
router.get('/my-events', protect, authorize('volunteer'), getVolunteerEvents);

export default router;
