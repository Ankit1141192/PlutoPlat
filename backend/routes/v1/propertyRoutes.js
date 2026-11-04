const express = require('express');
const router = express.Router();
const propertyController = require('../../controllers/propertyController');
const { authenticate, optionalAuthenticate, authorize } = require('../../middlewares/auth');

// Public listing & search (respects role if authenticated)
router.get('/', optionalAuthenticate, propertyController.getProperties);

// Logged-in user's own listings
router.get('/my/listings', authenticate, propertyController.getMyProperties);

// Single property details
router.get('/:id', propertyController.getPropertyById);

// Authenticated property creation (Agents/SuperAdmin only; regular buyers blocked)
router.post('/', authenticate, propertyController.createProperty);

// SuperAdmin property moderation (Approve / Reject)
router.patch('/:id/moderate', authenticate, authorize('super_admin'), propertyController.moderateProperty);

// Update property (Owner or SuperAdmin)
router.put('/:id', authenticate, propertyController.updateProperty);

// Delete property (Owner or SuperAdmin)
router.delete('/:id', authenticate, propertyController.deleteProperty);

module.exports = router;
