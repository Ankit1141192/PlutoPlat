const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Saved Properties
router.get('/saved-properties', authenticate, userController.getSavedProperties);
router.post('/saved-properties/:propertyId/toggle', authenticate, userController.toggleSavedProperty);

// Notifications
router.get('/notifications', authenticate, userController.getNotifications);
router.patch('/notifications/:id/read', authenticate, userController.markNotificationRead);

// Public/Authenticated: Get user profile by ID
router.get('/profile/:id', userController.getUserProfile);

// Authenticated: Update profile (self or super_admin)
router.put('/profile/:id', authenticate, userController.updateUserProfile);

// SuperAdmin only: List all users (Feature 7: Manage admins, users roles & subscription)
router.get('/', authenticate, authorize('super_admin'), userController.getAllUsers);

// SuperAdmin only: Modify role, subscription tier, active status, or unlock account
router.patch('/:id/status', authenticate, authorize('super_admin'), userController.updateUserStatus);

module.exports = router;
