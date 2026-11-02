const express = require('express');
const router = express.Router();
const enquiryController = require('../../controllers/enquiryController');
const { authenticate } = require('../../middlewares/auth');

// Create enquiry
router.post('/', authenticate, enquiryController.createEnquiry);

// Get my enquiries (buyer or seller)
router.get('/', authenticate, enquiryController.getMyEnquiries);

module.exports = router;
