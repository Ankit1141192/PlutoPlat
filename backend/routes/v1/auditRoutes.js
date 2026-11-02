const express = require('express');
const router = express.Router();
const auditController = require('../../controllers/auditController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Protected: Super Admin & Admin only
router.get('/', authenticate, authorize('admin', 'super_admin'), auditController.getAuditLogs);

module.exports = router;
