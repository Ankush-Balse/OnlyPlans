import Form from '../models/Form.js';
import Event from '../models/Event.js';
import { Parser } from 'json2csv';

// @desc    Create a form for an event
// @route   POST /api/forms
// @access  Private (Admin & Volunteer)
export const createForm = async (req, res, next) => {
  try {
    const { eventId, title, fields } = req.body;
    
    // Check if user is admin or volunteer
    if (req.user.role !== 'admin' && req.user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and volunteers can create forms'
      });
    }
    
    // Validate event ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // If user is volunteer, check if they are assigned to the event
    if (req.user.role === 'volunteer') {
      const isAssignedVolunteer = event.volunteers.some(
        volunteer => volunteer.toString() === req.user.id
      );
      
      if (!isAssignedVolunteer) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to create forms for this event'
        });
      }
    }
    
    // Check if form already exists for event
    const existingForm = await Form.findOne({ event: eventId });
    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: 'A form already exists for this event'
      });
    }
    
    // Create form
    const form = await Form.create({
      event: eventId,
      title,
      fields,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: form
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get a form by event ID
// @route   GET /api/forms/event/:eventId
// @access  Public
export const getFormByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Validate event ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Get form
    const form = await Form.findOne({ event: eventId });
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found for this event'
      });
    }
    
    res.status(200).json({
      success: true,
      data: form
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update a form
// @route   PUT /api/forms/:id
// @access  Private (Admin & Volunteer)
export const updateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, fields } = req.body;
    
    // Find the form
    const form = await Form.findById(id);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    // Check if user is admin or the volunteer who created the form
    if (req.user.role !== 'admin') {
      // If volunteer, check if they created the form
      if (req.user.role === 'volunteer' && form.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this form'
        });
      }
    }
    
    // Update form
    form.title = title || form.title;
    form.fields = fields || form.fields;
    form.updatedAt = Date.now();
    
    await form.save();
    
    res.status(200).json({
      success: true,
      data: form
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a form
// @route   DELETE /api/forms/:id
// @access  Private (Admin & Volunteer who created)
export const deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find the form
    const form = await Form.findById(id);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    // Check if user is admin or the volunteer who created the form
    if (req.user.role !== 'admin') {
      // If volunteer, check if they created the form
      if (req.user.role === 'volunteer' && form.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this form'
        });
      }
    }
    
    // Delete form
    await form.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Export form responses as CSV
// @route   GET /api/forms/:id/export
// @access  Private (Admin & Volunteer)
export const exportFormResponses = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or volunteer
    if (req.user.role !== 'admin' && req.user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Find form
    const form = await Form.findById(id).populate('event');
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }
    
    // If volunteer, check if they are assigned to the event
    if (req.user.role === 'volunteer') {
      const event = await Event.findById(form.event);
      const isAssignedVolunteer = event.volunteers.some(
        volunteer => volunteer.toString() === req.user.id
      );
      
      if (!isAssignedVolunteer) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to export responses for this event'
        });
      }
    }
    
    // Get registrations with form responses
    const registrations = await Registration.find({ event: form.event })
      .populate('user', 'name email');
    
    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registrations found for this event'
      });
    }
    
    // Prepare data for CSV
    const formattedData = registrations.map(registration => {
      const baseData = {
        'User Name': registration.user.name,
        'User Email': registration.user.email,
        'Registration Date': registration.createdAt,
        'Attended': registration.attended ? 'Yes' : 'No'
      };
      
      // Add form responses
      const responses = registration.formResponses || {};
      form.fields.forEach(field => {
        baseData[field.label] = responses[field.id] || '';
      });
      
      return baseData;
    });
    
    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(formattedData);
    
    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.event.title.replace(/\s+/g, '_')}_responses.csv`);
    
    // Send CSV
    res.status(200).send(csv);

  } catch (error) {
    next(error);
  }
};