const express = require('express');
const router = express.Router();
const auditController = require('../../controllers/auditController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Protected: SuperAdmin only (Feature 8: Platform analytics & Audit logs)
router.get('/', authenticate, authorize('super_admin'), auditController.getAuditLogs);
router.get('/analytics', authenticate, authorize('super_admin'), auditController.getPlatformAnalytics);

module.exports = router;
