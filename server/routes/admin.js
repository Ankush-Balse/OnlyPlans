import express from 'express';
import { getStatistics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/statistics
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/statistics', getStatistics);

export default router; 