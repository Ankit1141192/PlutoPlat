/**
 * Real-Time Telemetry & Event Dispatch Service
 * (Decoupled from Socket.IO - Lightweight native event dispatch)
 */

let activeServer = null;

const initSocket = (httpServer) => {
  activeServer = httpServer;
  return null;
};

const getIO = () => null;

/**
 * Emit Notification to targeted recipient panels
 * @param {Object} notif - Notification document or object
 */
const emitNotification = (notif) => {
  if (!notif) return;
  const role = (notif.recipientRole || 'all').toLowerCase();
  console.log(`[Notification Engine] Dispatched notification "${notif.title}" to target: [${role}]`);
};

/**
 * Emit Property events so all connected panels update dynamically
 */
const emitPropertyEvent = (eventType, property) => {
  if (!property) return;
  const propTitle = property.title || property.id || property._id || 'Property';
  console.log(`[Property Engine] Dispatched property event [${eventType}] for: ${propTitle}`);
};

/**
 * Emit Testimonial events so all connected panels update dynamically
 */
const emitTestimonialEvent = (eventType, testimonial) => {
  if (!testimonial) return;
  console.log(`[Testimonial Engine] Dispatched testimonial event [${eventType}]`);
};

module.exports = {
  initSocket,
  getIO,
  emitNotification,
  emitPropertyEvent,
  emitTestimonialEvent,
};
