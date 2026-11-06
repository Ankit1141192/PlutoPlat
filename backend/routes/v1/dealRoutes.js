const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const Enquiry = require('../../models/Enquiry');

/**
 * Get active deal transactions and 7-stage workflow for authenticated buyer
 * GET /api/v1/deals
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    // Retrieve buyer inquiries that have active progress
    const activeEnquiries = await Enquiry.find({
      buyer: req.user._id,
      status: { $in: ['pending', 'contacted', 'interested'] }
    })
      .populate('property', 'title location price images numericPrice')
      .populate('seller', 'name email phone profileImage')
      .sort({ updatedAt: -1 });

    const formattedDeals = activeEnquiries.map((enq, idx) => {
      // Map CRM status to 7-stage deal process
      let currentStage = 1;
      let stageLabel = 'Enquiry Submitted';

      if (enq.status === 'pending') {
        currentStage = enq.siteVisit?.requested ? 3 : 1;
        stageLabel = enq.siteVisit?.requested ? 'Site Visit Requested' : 'Enquiry Submitted';
      } else if (enq.status === 'contacted') {
        currentStage = 2;
        stageLabel = 'Agent Advisory & Consultation';
      } else if (enq.status === 'interested') {
        currentStage = 4;
        stageLabel = 'Offer & Terms Negotiation';
      }

      return {
        id: `DEAL-${enq._id.toString().substring(18, 24).toUpperCase()}`,
        enquiryId: enq._id,
        propertyId: enq.property?._id,
        propertyTitle: enq.property?.title || 'Prime Residence',
        propertyLocation: enq.property?.location?.city || 'Civil Lines, Kanpur',
        propertyPrice: enq.property?.price ? `₹${(enq.property.price / 10000000).toFixed(2)} Cr` : '₹8.50 Cr',
        propertyImage: enq.property?.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        agentName: enq.seller?.name || 'Michael Sharma',
        agentPhone: enq.seller?.phone || '+91 98210 33445',
        agentEmail: enq.seller?.email || 'm.sharma@plutoplat.com',
        currentStage,
        stageLabel,
        stages: [
          { step: 1, name: 'Enquiry Submitted', status: currentStage >= 1 ? 'completed' : 'pending' },
          { step: 2, name: 'Agent Advisory & Consultation', status: currentStage >= 2 ? (currentStage === 2 ? 'current' : 'completed') : 'pending' },
          { step: 3, name: 'Site Visit Completed', status: currentStage >= 3 ? (currentStage === 3 ? 'current' : 'completed') : 'pending' },
          { step: 4, name: 'Offer & Terms Negotiation', status: currentStage >= 4 ? (currentStage === 4 ? 'current' : 'completed') : 'pending' },
          { step: 5, name: 'Token & Booking Advance', status: currentStage >= 5 ? (currentStage === 5 ? 'current' : 'completed') : 'pending' },
          { step: 6, name: 'Legal Due Diligence & Cadastre', status: currentStage >= 6 ? (currentStage === 6 ? 'current' : 'completed') : 'pending' },
          { step: 7, name: 'Deed Registration & Handover', status: currentStage === 7 ? 'completed' : 'pending' }
        ],
        nextAction: 'Senior Advisor is coordinating documentation and seller liaison.',
        escrowEstimate: '10% Token Escrow upon term agreement'
      };
    });

    return ApiResponse.success(res, 'Active deals pipeline retrieved successfully.', {
      deals: formattedDeals
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
