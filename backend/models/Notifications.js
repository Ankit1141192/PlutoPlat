const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recipientRole: {
      type: String,
      enum: ['all', 'user', 'admin', 'super_admin', 'both', 'user_and_admin'],
      default: 'all',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: 'general',
    },
    category: {
      type: String,
      default: 'General',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    actionLabel: {
      type: String,
      default: 'View Details',
    },
    read: {
      type: Boolean,
      default: false,
    },
    isUnread: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id string helper
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);
