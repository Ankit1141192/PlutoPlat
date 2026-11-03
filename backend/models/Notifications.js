const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['All', 'New', 'Updated', 'Scheduled', 'Cancelled'],
    required: true
  },
  message: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});
module.exports = mongoose.model('Notification', notificationSchema);