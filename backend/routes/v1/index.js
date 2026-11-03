const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const propertyRoutes = require('./propertyRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const auditRoutes = require('./auditRoutes');
const testimonialRoutes = require('./testimonialRoutes');

// Mount V1 API sub-routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/audits', auditRoutes);
router.use('/testimonials', testimonialRoutes);

module.exports = router;
