const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const { logAudit } = require('../../utils/auditLogger');
const Enquiry = require('../../models/Enquiry');
const Property = require('../../models/Property');

/**
 * Schedule a new property visit
 * POST /api/v1/visits
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { propertyId, visitType, date, timeSlot, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    const visitEnquiry = await Enquiry.create({
      property: property._id,
      buyer: req.user._id,
      seller: property.owner,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      message: `Scheduled ${visitType || 'On-site'} property visit for ${date || 'upcoming window'} (${timeSlot || 'Window'}). ${notes || ''}`,
      enquiryType: 'site_visit',
      status: 'pending',
      siteVisit: {
        requested: true,
        date: date ? new Date(date) : new Date(),
        notes: notes || `${visitType || 'Chauffeured On-Site'} - ${timeSlot || 'Mid-day Window'}`
      }
    });

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'ENQUIRY',
      targetId: visitEnquiry._id,
      targetType: 'Enquiry',
      description: `User scheduled property visit for ${property.title}`,
      req,
    });

    return ApiResponse.success(res, 'Property visit requested successfully. Concierge will confirm access credentials.', {
      visit: visitEnquiry
    }, 201);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all scheduled visits for authenticated buyer
 * GET /api/v1/visits
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const visits = await Enquiry.find({
      buyer: req.user._id,
      'siteVisit.requested': true
    })
      .populate('property', 'title location price images')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Scheduled visits retrieved successfully.', { visits });
  } catch (error) {
    next(error);
  }
});

/**
 * Cancel a scheduled visit
 * PATCH /api/v1/visits/:id/cancel
 */
router.patch('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const visit = await Enquiry.findOne({
      _id: req.params.id,
      buyer: req.user._id
    });

    if (!visit) {
      return ApiResponse.error(res, 'Visit not found or unauthorized.', 404);
    }

    visit.status = 'cancelled';
    await visit.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'ENQUIRY',
      targetId: visit._id,
      targetType: 'Enquiry',
      description: `User cancelled scheduled visit ${visit._id}`,
      req,
    });

    return ApiResponse.success(res, 'Visit cancelled successfully.', { visit });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
