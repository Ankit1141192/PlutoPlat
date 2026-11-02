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
    return ApiResponse.success(res, 'User profile retrieved successfully.', {
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/v1/users/profile/:id
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Security check: users can only update their own profile unless they are admin/super_admin
    const isOwner = req.user._id.toString() === userId;
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return ApiResponse.error(
        res,
        'Forbidden: You can only update your own profile.',
        403
      );
    }

    const { name, phone, location, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    // Phone uniqueness check if changed
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
 * List all users (Admin/Super Admin only)
 * GET /api/v1/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return ApiResponse.success(res, 'Users retrieved successfully.', {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin action: unlock account or update status
 * PATCH /api/v1/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, unlockAccount } = req.body;
    const user = await User.findById(req.params.id).select(
      '+loginAttempts +lockUntil'
    );

    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
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
      description: `Admin updated status for user ${user._id}`,
      req,
    });

    return ApiResponse.success(res, 'User status updated successfully.', {
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
