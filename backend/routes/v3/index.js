const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const ApiResponse = require('../../utils/apiResponse');
const Property = require('../../models/Property');
const User = require('../../models/User');
const Enquiry = require('../../models/Enquiry');
const AuditLog = require('../../models/AuditLog');
const { logAudit } = require('../../utils/auditLogger');

// All v3 routes strictly require authentication as 'super_admin'
router.use(authenticate, authorize('super_admin'));

/**
 * ══════════════════════════════════════════
 * 1. SUPERADMIN PROPERTY GOVERNANCE & MODERATION
 * ══════════════════════════════════════════
 */

// Moderation queue: all pending properties awaiting review
router.get('/properties/moderation-queue', async (req, res, next) => {
  try {
    const pendingProperties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone role')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Moderation queue fetched.', {
      count: pendingProperties.length,
      properties: pendingProperties,
    });
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

    return ApiResponse.success(res, `Property "${property.title}" is now verified and live.`, {
      property,
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
router.get('/analytics', async (req, res, next) => {
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
});

module.exports = router;
