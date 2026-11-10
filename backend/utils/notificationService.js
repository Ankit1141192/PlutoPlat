const Notification = require('../models/Notifications');

/**
 * Universal Notification Dispatcher
 * Persists high-priority alerts for Users, Agents (Admins), and SuperAdmins
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
    return notif;
  } catch (err) {
    console.error('Notification dispatch notice:', err.message);
    return null;
  }
};

module.exports = { sendNotification };
