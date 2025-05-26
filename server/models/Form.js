import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  fields: [
    {
      id: String,
      type: {
        type: String,
        enum: [
          'text',
          'number',
          'email',
          'date',
          'textarea',
          'select',
          'radio',
          'checkbox',
          'file',
          'phone',
          'url'
        ],
        required: true
      },
      label: {
        type: String,
        required: true
      },
      placeholder: String,
      required: {
        type: Boolean,
        default: false
      },
      options: [
        {
          label: String,
          value: String
        }
      ],
      validation: {
        minLength: Number,
        maxLength: Number,
        pattern: String
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Form', formSchema);