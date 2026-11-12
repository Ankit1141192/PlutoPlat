const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.IO with HTTP Server
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins for dev/prod client access
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room based on role & userId
    socket.on('register', (data) => {
      try {
        const { role = 'user', userId = null } = data || {};
        
        // Always join global broadcast room
        socket.join('all');

        // Join specific role room
        if (role) {
          const roleRoom = `role:${role}`;
          socket.join(roleRoom);
          console.log(`[Socket.IO] Socket ${socket.id} joined room: ${roleRoom}`);
        }

        // Join individual user room if authenticated
        if (userId) {
          const userRoom = `user:${userId}`;
          socket.join(userRoom);
          console.log(`[Socket.IO] Socket ${socket.id} joined user room: ${userRoom}`);
        }

        socket.emit('registered', {
          success: true,
          socketId: socket.id,
          role,
          userId,
        });
      } catch (err) {
        console.error('[Socket.IO] Registration error:', err.message);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Retrieve active io instance
 */
const getIO = () => io;

/**
 * Emit Notification to targeted recipient panels
 * @param {Object} notif - Notification document or object
 */
const emitNotification = (notif) => {
  if (!io) return;

  const role = (notif.recipientRole || 'all').toLowerCase();
  console.log(`[Socket.IO] Broadcasting notification "${notif.title}" to target: [${role}]`);

  // Target specific rooms
  if (role === 'all') {
    io.to('all').emit('new_notification', notif);
  } else if (role === 'both' || role === 'user_and_admin') {
    io.to('role:user').to('role:admin').to('role:super_admin').emit('new_notification', notif);
  } else if (role === 'user') {
    io.to('role:user').to('role:super_admin').emit('new_notification', notif);
  } else if (role === 'admin') {
    io.to('role:admin').to('role:super_admin').emit('new_notification', notif);
  } else if (role === 'super_admin') {
    io.to('role:super_admin').emit('new_notification', notif);
  }

  // If targeted to a specific user id
  if (notif.userId) {
    io.to(`user:${notif.userId}`).emit('new_notification', notif);
  }
};

/**
 * Emit Property events so all connected panels update dynamically
 */
const emitPropertyEvent = (eventType, property) => {
  if (!io) return;
  console.log(`[Socket.IO] Broadcasting property event: ${eventType}`);
  io.to('all').emit(eventType, property);
};

/**
 * Emit Testimonial events so all connected panels update dynamically
 */
const emitTestimonialEvent = (eventType, testimonial) => {
  if (!io) return;
  console.log(`[Socket.IO] Broadcasting testimonial event: ${eventType}`);
  io.to('all').emit(eventType, testimonial);
};

module.exports = {
  initSocket,
  getIO,
  emitNotification,
  emitPropertyEvent,
  emitTestimonialEvent,
};
