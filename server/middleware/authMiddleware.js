import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Event from '../models/Event.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;
  
  // Check if auth header exists and has the correct format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is an event volunteer or admin
export const isEventVolunteer = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.body.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (
      req.user.role === 'admin' ||
      event.createdBy.toString() === (req.user._id || req.user.id).toString() ||
      event.volunteers.includes(req.user._id || req.user.id)
    ) {
      req.event = event;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this event'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};