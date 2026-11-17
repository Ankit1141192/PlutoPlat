const express = require('express');
const router = express.Router();
const enquiryController = require('../../controllers/enquiryController');
const { authenticate, optionalAuthenticate, authorize } = require('../../middlewares/auth');

// Create enquiry (Available to authenticated buyers and guest website visitors - user only able to send)
router.post('/', optionalAuthenticate, enquiryController.createEnquiry);
router.post('/contact', optionalAuthenticate, enquiryController.createEnquiry);

// Get enquiries (Role-scoped: Buyer sees own, Admin sees leads on own listings + general, SuperAdmin sees all)
router.get('/', authenticate, enquiryController.getMyEnquiries);
router.get('/my', authenticate, enquiryController.getMyEnquiries);

// Update lead status (Admin or SuperAdmin only - regular users cannot update)
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), enquiryController.updateEnquiryStatus);

module.exports = router;
