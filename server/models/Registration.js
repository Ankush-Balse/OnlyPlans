import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formResponses: {
    type: Object,
    default: {}
  },
  attended: {
    type: Boolean,
    default: false
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Make sure a user can only register once for an event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);