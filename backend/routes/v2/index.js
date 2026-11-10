const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const Property = require('../../models/Property');
const Enquiry = require('../../models/Enquiry');
const User = require('../../models/User');
const { logAudit } = require('../../utils/auditLogger');
const { sendNotification } = require('../../utils/notificationService');
const userController = require('../../controllers/userController');
const testimonialRoutes = require('../v1/testimonialRoutes');
const authRoutes = require('../v1/authRoutes');

// Mount public auth endpoints for Admin / Agent portal
router.use('/auth', authRoutes);

// All other v2 routes require authentication as 'admin' (Agent) or 'super_admin'
router.use(authenticate, authorize('admin', 'super_admin'));

/**
 * ══════════════════════════════════════════
 * 1. ADMIN PROPERTIES CRUD (Agent's Listings)
 * ══════════════════════════════════════════
 */

// Get listings managed by this agent (also alias /properties/my/listings)
const getAgentProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Agent listings retrieved successfully.', { properties });
  } catch (error) {
    next(error);
  }
};
router.get('/properties', getAgentProperties);
router.get('/properties/my/listings', getAgentProperties);

// Get single property by ID
router.get('/properties/:id', async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return ApiResponse.error(res, 'Property not found.', 404);
    return ApiResponse.success(res, 'Property retrieved successfully.', { property });
  } catch (error) {
    next(error);
  }
});

// Agent submits new property (Published & live on user panel)
router.post('/properties', async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      isVerified: req.body.isVerified !== undefined ? req.body.isVerified : true,
      status: req.body.status || 'approved',
    };

    const property = await Property.create(propertyData);

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'CREATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `Agent published property "${property.title}"`,
      req,
    });

    const locText = typeof property.location === 'string'
      ? property.location
      : property.location?.city || 'Kanpur, UP';

    // 1. Notify SuperAdmin
    await sendNotification({
      recipientRole: 'super_admin',
      title: 'New Property Listing Published',
      message: `Agent ${req.user.name} published "${property.title}" in ${locText}.`,
      type: 'approval',
      category: 'Listing Updates',
      link: `/properties`,
    });

    // 2. Notify Agent
    await sendNotification({
      userId: req.user._id,
      recipientRole: 'admin',
      title: 'Listing Published Successfully',
      message: `Your listing "${property.title}" is now published and live on the public user portal.`,
      type: 'property',
      category: 'Listing Updates',
      link: `/properties`,
    });

    // 3. Broadcast to prospective buyers
    await sendNotification({
      recipientRole: 'user',
      title: 'New Luxury Property Available',
      message: `"${property.title}" in ${locText} is now open for private inquiries.`,
      type: 'property',
      category: 'Off-Market',
      link: `/property/${property._id}`,
    });

    return ApiResponse.success(
      res,
      'Property submitted and published successfully. Visible on the public portal.',
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
const getAgentLeads = async (req, res, next) => {
  try {
    const leads = await Enquiry.find({ seller: req.user._id })
      .populate('property', 'title price location images')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Agent leads retrieved successfully.', { leads });
  } catch (error) {
    next(error);
  }
};
router.get('/leads', getAgentLeads);
router.get('/enquiries/my', getAgentLeads);

// Update lead status (e.g. contacted, interested, closed)
const updateLeadStatus = async (req, res, next) => {
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
};
router.patch('/leads/:id/status', updateLeadStatus);
router.patch('/enquiries/:id/status', updateLeadStatus);

// Update user/agent profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.error(res, 'User not found.', 404);
    if (String(user._id) !== String(req.user._id) && req.user.role !== 'super_admin') {
      return ApiResponse.error(res, 'Unauthorized.', 403);
    }
    const { name, phone, location, avatar } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = String(phone).replace(/[\s\-\(\)]/g, '');
    if (location) user.location = { ...user.location, ...location };
    if (avatar) user.avatar = avatar;
    await user.save();
    return ApiResponse.success(res, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};
router.put('/users/:id', updateUserProfile);
router.patch('/users/:id', updateUserProfile);

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

/**
 * ══════════════════════════════════════════
 * 4. ADMIN NOTIFICATIONS
 * ══════════════════════════════════════════
 */
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/read-all', userController.markAllNotificationsRead);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.delete('/notifications/:id', userController.deleteNotification);

/**
 * ══════════════════════════════════════════
 * 5. ADMIN TESTIMONIALS
 * ══════════════════════════════════════════
 */
router.use('/testimonials', testimonialRoutes);

module.exports = router;
