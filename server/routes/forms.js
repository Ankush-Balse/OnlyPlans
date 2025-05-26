import express from 'express';
import {
  createForm,
  getFormByEvent,
  updateForm,
  deleteForm,
  exportFormResponses
} from '../controllers/formController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/event/:eventId', getFormByEvent);

// Protected routes
router.post('/', protect, authorize('admin', 'volunteer'), createForm);
router.put('/:id', protect, authorize('admin', 'volunteer'), updateForm);
router.delete('/:id', protect, authorize('admin', 'volunteer'), deleteForm);
router.get('/:id/export', protect, authorize('admin', 'volunteer'), exportFormResponses);

export default router;