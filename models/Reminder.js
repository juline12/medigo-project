const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  medicineName: {
    type: String,
    required: true,
    minlength: 2
  },

  time: {
    type: String,
    required: true
  },

  frequency: {
    type: String,
    enum: ['Once per day', 'Twice per day', 'Three times per day'],
    default: 'Once per day'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
