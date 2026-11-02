const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { authenticate, authorize } = require('../../middlewares/auth');

// Public: Get user profile by ID
router.get('/profile/:id', userController.getUserProfile);

// Authenticated: Update profile
router.put('/profile/:id', authenticate, userController.updateUserProfile);

// Admin only: List all users
router.get('/', authenticate, authorize('admin', 'super_admin'), userController.getAllUsers);

// Admin only: Activate/deactivate or unlock account
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), userController.updateUserStatus);

module.exports = router;
