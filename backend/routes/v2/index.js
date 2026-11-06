const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const Property = require('../../models/Property');
const Enquiry = require('../../models/Enquiry');
const { logAudit } = require('../../utils/auditLogger');

// All v2 routes require authentication as 'admin' (Agent) or 'super_admin'
router.use(authenticate, authorize('admin', 'super_admin'));

/**
 * ══════════════════════════════════════════
 * 1. ADMIN PROPERTIES CRUD (Agent's Listings)
 * ══════════════════════════════════════════
 */

// Get listings managed by this agent
router.get('/properties', async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Agent listings retrieved successfully.', { properties });
  } catch (error) {
    next(error);
  }
});

// Agent submits new property (Automatically sets status: 'pending', isVerified: false)
router.post('/properties', async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      isVerified: false,
      status: 'pending',
    };

    const property = await Property.create(propertyData);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Agent submitted property "${property.title}" for SuperAdmin verification`,
      req,
    });

    return ApiResponse.success(
      res,
      'Property submitted successfully. It has been queued for SuperAdmin verification.',
      { property },
      201
    );
  } catch (error) {
    next(error);
  }
});

// Agent updates their own listing
router.put('/properties/:id', async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: req.user._id });
    if (!property) {
      return ApiResponse.error(res, 'Property not found or unauthorized.', 404);
    }

    Object.assign(property, req.body);
    // Any edit by an agent returns property to pending verification
    if (req.user.role !== 'super_admin') {
      property.isVerified = false;
      property.status = 'pending';
    }

    await property.save();
    return ApiResponse.success(res, 'Property updated and queued for review.', { property });
  } catch (error) {
    next(error);
  }
});

// Agent deletes their own listing
router.delete('/properties/:id', async (req, res, next) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!property) {
      return ApiResponse.error(res, 'Property not found or unauthorized.', 404);
    }
    return ApiResponse.success(res, 'Property listing removed.');
  } catch (error) {
    next(error);
  }
});

/**
 * ══════════════════════════════════════════
 * 2. ADMIN LEADS (Leads on Agent's Own Properties)
 * ══════════════════════════════════════════
 */
router.get('/leads', async (req, res, next) => {
  try {
    const leads = await Enquiry.find({ seller: req.user._id })
      .populate('property', 'title price location images')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Agent leads retrieved successfully.', { leads });
  } catch (error) {
    next(error);
  }
});

// Update lead status (e.g. contacted, interested, closed)
router.patch('/leads/:id/status', async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findOne({ _id: req.params.id, seller: req.user._id });

    if (!enquiry) {
      return ApiResponse.error(res, 'Enquiry not found or unauthorized.', 404);
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;
    await enquiry.save();

    return ApiResponse.success(res, 'Lead stage updated successfully.', { enquiry });
  } catch (error) {
    next(error);
  }
});

/**
 * ══════════════════════════════════════════
 * 3. ADMIN VISITS & DEAL STAGES
 * ══════════════════════════════════════════
 */
router.get('/visits', async (req, res, next) => {
  try {
    const visits = await Enquiry.find({
      seller: req.user._id,
      'siteVisit.requested': true
    })
      .populate('property', 'title location price images')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Assigned site visits retrieved successfully.', { visits });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
