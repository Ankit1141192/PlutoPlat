const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const Property = require('../../models/Property');
const User = require('../../models/User');
const Enquiry = require('../../models/Enquiry');
const AuditLog = require('../../models/AuditLog');
const { logAudit } = require('../../utils/auditLogger');
const { sendNotification } = require('../../utils/notificationService');
const userController = require('../../controllers/userController');
const { normalizeProperty } = require('../../controllers/propertyController');
const { emitPropertyEvent } = require('../../utils/socketService');
const testimonialRoutes = require('../v1/testimonialRoutes');
const authRoutes = require('../v1/authRoutes');

// Mount public auth endpoints for SuperAdmin portal
router.use('/auth', authRoutes);

// All other v3 routes strictly require authentication as 'super_admin'
router.use(authenticate, authorize('super_admin'));

/**
 * ══════════════════════════════════════════
 * 1. SUPERADMIN PROPERTY GOVERNANCE & MODERATION
 * ══════════════════════════════════════════
 */

// Master property directory for SuperAdmin
router.get('/properties', async (req, res, next) => {
  try {
    const rawProperties = await Property.find({})
      .populate('owner', 'name email phone role')
      .sort({ createdAt: -1 });

    const properties = rawProperties.map(normalizeProperty);

    return ApiResponse.success(res, 'All properties retrieved successfully.', { properties });
  } catch (error) {
    next(error);
  }
});

// SuperAdmin creates a property (Auto-approved and verified for user portal)
router.post('/properties', async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
      isVerified: true,
      status: 'approved',
      featured: req.body.featured !== undefined ? req.body.featured : true,
    };

    const property = await Property.create(propertyData);

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: 'CREATE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `SuperAdmin published platform listing "${property.title}"`,
      req,
    });

    const locText = typeof property.location === 'string'
      ? property.location
      : property.location?.city || 'Kanpur, UP';

    // Broadcast notification to Users and Agents
    await sendNotification({
      recipientRole: 'all',
      title: 'New Featured Property Added',
      message: `"${property.title}" in ${locText} is now published on the public portal.`,
      type: 'property',
      category: 'Off-Market',
      link: `/property/${property._id}`,
    });

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_created', normalized);
    } catch (e) {}

    return ApiResponse.success(
      res,
      'Property created and published to live catalog.',
      { property: normalized },
      201
    );
  } catch (error) {
    next(error);
  }
});

// SuperAdmin updates any property
router.put('/properties/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!property) return ApiResponse.error(res, 'Property not found.', 404);

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    return ApiResponse.success(res, 'Property updated successfully.', { property: normalized });
  } catch (error) {
    next(error);
  }
});

// SuperAdmin deletes any property
router.delete('/properties/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return ApiResponse.error(res, 'Property not found.', 404);

    try {
      emitPropertyEvent('property_deleted', { id: req.params.id, _id: req.params.id });
    } catch (e) {}

    return ApiResponse.success(res, 'Property listing permanently removed.');
  } catch (error) {
    next(error);
  }
});

// Moderation queue: all pending properties awaiting review
router.get('/properties/moderation-queue', async (req, res, next) => {
  try {
    const rawPending = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone role')
      .sort({ createdAt: -1 });

    const pendingProperties = rawPending.map(normalizeProperty);

    return ApiResponse.success(res, 'Moderation queue fetched.', {
      count: pendingProperties.length,
      properties: pendingProperties,
    });
  } catch (error) {
    next(error);
  }
});

// Multi-action moderation endpoint (used by SuperAdminApi.moderateProperty)
router.patch('/properties/:id/moderate', async (req, res, next) => {
  try {
    const { action, reason, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }
    const property = await Property.findById(req.params.id);
    if (!property) return ApiResponse.error(res, 'Property not found.', 404);

    const isApprove = action === 'approve' || status === 'approved';
    property.isVerified = isApprove;
    property.status = isApprove ? 'approved' : 'rejected';
    await property.save();

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: isApprove ? 'APPROVE' : 'REJECT',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `SuperAdmin ${isApprove ? 'approved' : 'rejected'} property "${property.title}".`,
      req,
    });

    if (isApprove) {
      if (property.owner) {
        await sendNotification({
          userId: property.owner,
          recipientRole: 'admin',
          title: 'Property Listing Approved by SuperAdmin',
          message: `Your listing "${property.title}" has been verified and published to the live public portal.`,
          type: 'approval',
          category: 'Listing Updates',
          link: `/property/${property._id}`,
        });
      }
      await sendNotification({
        recipientRole: 'user',
        title: 'New Verified Listing Live',
        message: `"${property.title}" has been verified and is open for inquiries.`,
        type: 'property',
        category: 'Off-Market',
        link: `/property/${property._id}`,
      });
    } else {
      if (property.owner) {
        await sendNotification({
          userId: property.owner,
          recipientRole: 'admin',
          title: 'Listing Moderation Notice',
          message: `Your listing "${property.title}" was not approved. Reason: ${reason || 'Incomplete verification documents'}.`,
          type: 'system',
          category: 'Security Alerts',
          link: `/properties`,
        });
      }
    }

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    return ApiResponse.success(
      res,
      `Property "${property.title}" moderation complete (${property.status}).`,
      { property: normalized }
    );
  } catch (error) {
    next(error);
  }
});

// 1-Click Approve Property Listing
router.patch('/properties/:id/approve', async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    property.isVerified = true;
    property.status = 'approved';
    await property.save();

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: 'APPROVE',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `SuperAdmin approved listing "${property.title}" for live catalog`,
      req,
    });

    // Notify listing agent
    if (property.owner) {
      await sendNotification({
        userId: property.owner,
        recipientRole: 'admin',
        title: 'Property Listing Approved by SuperAdmin',
        message: `Your listing "${property.title}" has been verified and published to the live public portal.`,
        type: 'approval',
        category: 'Listing Updates',
        link: `/property/${property._id}`,
      });
    }

    // Notify prospective buyers
    await sendNotification({
      recipientRole: 'user',
      title: 'New Verified Property Live',
      message: `"${property.title}" is now live and available for private viewing.`,
      type: 'property',
      category: 'Off-Market',
      link: `/property/${property._id}`,
    });

    return ApiResponse.success(res, `Property "${property.title}" is now verified and live.`, {
      property: normalized,
    });
  } catch (error) {
    next(error);
  }
});

// Reject Property Listing with reason
router.patch('/properties/:id/reject', async (req, res, next) => {
  try {
    const { reason } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found.', 404);
    }

    property.isVerified = false;
    property.status = 'rejected';
    await property.save();

    const normalized = normalizeProperty(property);
    try {
      emitPropertyEvent('property_updated', normalized);
    } catch (e) {}

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: 'REJECT',
      module: 'PROPERTY',
      targetId: property._id,
      targetType: 'Property',
      description: `SuperAdmin rejected listing "${property.title}". Reason: ${reason || 'Document verification incomplete'}`,
      req,
    });

    if (property.owner) {
      await sendNotification({
        userId: property.owner,
        recipientRole: 'admin',
        title: 'Listing Moderation Notice',
        message: `Your listing "${property.title}" was rejected. Reason: ${reason || 'Document verification incomplete'}.`,
        type: 'system',
        category: 'Security Alerts',
        link: `/properties`,
      });
    }

    return ApiResponse.success(res, `Property listing rejected.`, { property });
  } catch (error) {
    next(error);
  }
});

/**
 * ══════════════════════════════════════════
 * 2. SUPERADMIN USER & ROLE GOVERNANCE
 * ══════════════════════════════════════════
 */

// Master directory of all users
router.get('/users', async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Global users list retrieved.', { users });
  } catch (error) {
    next(error);
  }
});

// Role Escalation / Demotion
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return ApiResponse.error(res, 'Invalid role specification.', 400);
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: 'UPDATE_ROLE',
      module: 'USER',
      targetId: user._id,
      targetType: 'User',
      description: `SuperAdmin updated role for user ${user._id} to ${role.toUpperCase()}`,
      req,
    });

    return ApiResponse.success(res, `User role updated to ${role.toUpperCase()}.`, { user });
  } catch (error) {
    next(error);
  }
});

// Release 5-attempt security lockout
router.patch('/users/:id/unlock', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    await logAudit({
      actor: req.user._id,
      actorRole: 'super_admin',
      action: 'UNBLOCK',
      module: 'ADMIN',
      targetId: user._id,
      targetType: 'User',
      description: `SuperAdmin released 5-attempt lockout for user ${user._id}`,
      req,
    });

    return ApiResponse.success(res, 'Account lockout released successfully.', { user });
  } catch (error) {
    next(error);
  }
});

/**
 * ══════════════════════════════════════════
 * 3. GLOBAL LEADS MATRIX & AUDIT TELEMETRY
 * ══════════════════════════════════════════
 */
router.get('/leads', async (req, res, next) => {
  try {
    const leads = await Enquiry.find({})
      .populate('property', 'title price location')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Global leads matrix retrieved.', { leads });
  } catch (error) {
    next(error);
  }
});
router.get('/enquiries/my', async (req, res, next) => {
  try {
    const leads = await Enquiry.find({})
      .populate('property', 'title price location')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Global leads matrix retrieved.', { leads });
  } catch (error) {
    next(error);
  }
});

router.patch('/enquiries/:id/status', async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return ApiResponse.error(res, 'Enquiry not found.', 404);
    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;
    await enquiry.save();
    return ApiResponse.success(res, 'Enquiry status updated.', { enquiry });
  } catch (error) {
    next(error);
  }
});

// Update user profile
const updateSuperAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.error(res, 'User not found.', 404);
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
router.put('/users/profile/:id', updateSuperAdminProfile);
router.patch('/users/profile/:id', updateSuperAdminProfile);
router.put('/users/:id', updateSuperAdminProfile);
router.patch('/users/:id', updateSuperAdminProfile);

// Immutable cluster audit telemetry
router.get('/audits', async (req, res, next) => {
  try {
    const audits = await AuditLog.find({})
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    return ApiResponse.success(res, 'Audit logs ledger fetched.', { audits });
  } catch (error) {
    next(error);
  }
});

// Platform executive analytics
const getPlatformAnalyticsHandler = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const verifiedProperties = await Property.countDocuments({ isVerified: true });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const totalLeads = await Enquiry.countDocuments();

    return ApiResponse.success(res, 'Executive platform analytics generated.', {
      analytics: {
        totalUsers,
        totalProperties,
        verifiedProperties,
        pendingProperties,
        totalLeads,
        systemStatus: 'Operational - Institutional Enterprise'
      }
    });
  } catch (error) {
    next(error);
  }
};
router.get('/analytics', getPlatformAnalyticsHandler);
router.get('/audits/analytics', getPlatformAnalyticsHandler);

/**
 * ══════════════════════════════════════════
 * 4. SUPERADMIN NOTIFICATIONS DISPATCH & INBOX
 * ══════════════════════════════════════════
 */
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/read-all', userController.markAllNotificationsRead);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.delete('/notifications/:id', userController.deleteNotification);

// SuperAdmin broadcast custom notification
router.post('/notifications', async (req, res, next) => {
  try {
    const { title, message, recipientRole = 'all', type = 'system', category = 'Security Alerts', link = '' } = req.body;
    if (!title || !message) {
      return ApiResponse.error(res, 'Title and message are required for platform dispatch.', 400);
    }
    const notif = await sendNotification({
      recipientRole,
      title,
      message,
      type,
      category,
      link,
    });
    return ApiResponse.success(res, 'Platform notification broadcast successfully.', { notification: notif }, 201);
  } catch (error) {
    next(error);
  }
});

/**
 * ══════════════════════════════════════════
 * 5. SUPERADMIN TESTIMONIALS GOVERNANCE
 * ══════════════════════════════════════════
 */
router.use('/testimonials', testimonialRoutes);

module.exports = router;
