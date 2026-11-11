const Notification = require('../models/Notifications');
const { emitNotification } = require('./socketService');

/**
 * Universal Notification Dispatcher
 * Persists high-priority alerts for Users, Agents (Admins), and SuperAdmins
 * and dispatches them in real-time over Socket.IO to connected panels
 */
const sendNotification = async ({
  userId = null,
  recipientRole = 'all',
  title,
  message,
  description = '',
  type = 'general',
  category = 'General',
  link = '',
  actionLabel = 'View Details',
}) => {
  try {
    const notif = await Notification.create({
      userId,
      recipientRole,
      title,
      message,
      description: description || message,
      type,
      category,
      link,
      actionLabel,
      read: false,
      isUnread: true,
    });

    // Real-time Socket.IO emission to target panel(s)
    try {
      emitNotification(notif.toObject ? notif.toObject() : notif);
    } catch (socketErr) {
      console.warn('[Socket.IO Dispatch Warning]:', socketErr.message);
    }

    return notif;
  } catch (err) {
    console.error('Notification dispatch notice:', err.message);
    return null;
  }
};

module.exports = { sendNotification };
