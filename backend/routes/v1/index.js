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

module.exports = router;
