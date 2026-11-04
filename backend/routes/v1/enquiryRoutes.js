const express = require('express');
const router = express.Router();
const enquiryController = require('../../controllers/enquiryController');
const { authenticate } = require('../../middlewares/auth');

// Create enquiry (Buyers & SuperAdmin; Admins blocked)
router.post('/', authenticate, enquiryController.createEnquiry);

// Get enquiries (Role-scoped: Buyer sees own, Admin sees leads on own listings, SuperAdmin sees all)
router.get('/', authenticate, enquiryController.getMyEnquiries);

// Update lead status (Admin on own properties, or SuperAdmin)
router.patch('/:id/status', authenticate, enquiryController.updateEnquiryStatus);

module.exports = router;
