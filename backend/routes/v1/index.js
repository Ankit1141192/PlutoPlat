const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const auditRoutes = require('./auditRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const visitRoutes = require('./visitRoutes');
const dealRoutes = require('./dealRoutes');
const agentRoutes = require('./agentRoutes');
const userController = require('../../controllers/userController');
const { optionalAuthenticate } = require('../../middlewares/auth');

// Mount V1 API sub-routers (User / Buyer Panel Workflow)
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/visits', visitRoutes);
router.use('/deals', dealRoutes);
router.use('/agents', agentRoutes);
router.use('/audits', auditRoutes);
router.use('/testimonials', testimonialRoutes);

// Direct notifications endpoints for client panel
router.get('/notifications', optionalAuthenticate, userController.getNotifications);
router.patch('/notifications/read-all', optionalAuthenticate, userController.markAllNotificationsRead);
router.patch('/notifications/:id/read', optionalAuthenticate, userController.markNotificationRead);
router.delete('/notifications/:id', optionalAuthenticate, userController.deleteNotification);

module.exports = router;
