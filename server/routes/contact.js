import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', submitContactForm);

export default router; 