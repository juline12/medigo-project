const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  messages: [
    {
      sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  reply: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['Open', 'Replied'],
    default: 'Open'
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
