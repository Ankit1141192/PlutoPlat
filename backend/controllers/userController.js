const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

/**
 * Get user profile by ID
 * GET /api/v1/users/profile/:id
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }
    return ApiResponse.success(res, 'User profile retrieved successfully.', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile (Self or SuperAdmin)
 * PUT /api/v1/users/profile/:id
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Security check: users can only update their own profile unless they are super_admin
    const isOwner = req.user._id.toString() === userId;
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isOwner && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only update your own profile.', 403);
    }

    const { name, phone, location, profileImage, savedProperties } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    if (phone && phone !== user.phone) {
      const phoneTaken = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneTaken) {
        return ApiResponse.error(res, 'Phone number is already in use.', 409);
      }
      user.phone = phone;
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (location) user.location = { ...user.location, ...location };
    if (savedProperties) user.savedProperties = savedProperties;

    await user.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: 'UPDATE',
      module: 'USER',
      targetId: user._id,
      targetType: 'User',
      description: `Updated profile details for user ${user._id}`,
      req,
    });

    return ApiResponse.success(res, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * List all users (SuperAdmin only)
 * GET /api/v1/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return ApiResponse.success(res, 'Users retrieved successfully.', {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SuperAdmin action: Update role, subscription, active status, or unlock account
 * PATCH /api/v1/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, unlockAccount, role, subscriptionTier } = req.body;
    const user = await User.findById(req.params.id).select('+loginAttempts +lockUntil');

    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    if (role && ['user', 'admin', 'super_admin'].includes(role)) {
      user.role = role;
    }

    if (subscriptionTier && ['free', 'agent_pro', 'vip_concierge'].includes(subscriptionTier)) {
      user.subscriptionTier = subscriptionTier;
    }

    if (unlockAccount === true) {
      user.loginAttempts = 0;
      user.lockUntil = null;
    }

    await user.save();

    await logAudit({
      actor: req.user._id,
      actorRole: req.user.role,
      action: unlockAccount ? 'UNBLOCK' : 'UPDATE',
      module: 'ADMIN',
      targetId: user._id,
      targetType: 'User',
      description: `SuperAdmin updated privileges for user ${user._id} (Role: ${user.role}, Tier: ${user.subscriptionTier || 'free'}, Active: ${user.isActive})`,
      req,
    });

    return ApiResponse.success(res, 'User account status and privileges updated successfully.', {
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
};
