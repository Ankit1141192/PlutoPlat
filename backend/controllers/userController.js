const User = require('../models/User');
const Property = require('../models/Property');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { normalizeProperty } = require('./propertyController');

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
    const isOwner = req.user._id.toString() === userId.toString();
    const isSuperAdmin = req.user.role === 'super_admin';

    if (!isOwner && !isSuperAdmin) {
      return ApiResponse.error(res, 'Forbidden: You can only update your own profile.', 403);
    }

    const { name, phone, location, profileImage, avatar, savedProperties } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    if (phone && phone.replace(/[\s\-\(\)]/g, '') !== user.phone) {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const phoneTaken = await User.findOne({ phone: cleanPhone, _id: { $ne: userId } });
      if (phoneTaken) {
        return ApiResponse.error(res, 'Phone number is already in use.', 409);
      }
      user.phone = cleanPhone;
    }

    if (name) user.name = name.trim();

    // Profile photo update (supports URLs, Base64 data URLs)
    const newPhoto = profileImage || avatar;
    if (newPhoto) {
      user.profileImage = newPhoto;
    }

    if (location) {
      if (typeof location === 'string') {
        user.location = { ...user.location, city: location, address: location };
      } else if (typeof location === 'object') {
        user.location = { ...user.location, ...location };
      }
    }

    if (Array.isArray(savedProperties)) {
      user.savedProperties = savedProperties;
    }

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
    const { role, search, page = 1, limit = 50 } = req.query;

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
        totalPages: Math.ceil(total / limitNum) || 1,
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

    if (subscriptionTier) {
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
      description: `SuperAdmin updated privileges for user ${user._id} (Role: ${user.role}, Active: ${user.isActive})`,
      req,
    });

    return ApiResponse.success(res, 'User account status and privileges updated successfully.', {
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Saved Properties for current user
 * GET /api/v1/users/saved-properties
 */
const getSavedProperties = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    const rawProps = user?.savedProperties || [];
    const normalizedProps = rawProps.map(normalizeProperty);

    return ApiResponse.success(res, 'Saved properties retrieved successfully.', {
      savedProperties: normalizedProps,
      savedIds: (user?.savedProperties || []).map(p => (p._id ? p._id.toString() : p.toString())),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle Saved Property (Save or Remove)
 * POST /api/v1/users/saved-properties/:propertyId/toggle
 */
const toggleSavedProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    // Find the property by ID or slug if possible
    let targetProperty = null;
    if (propertyId.match(/^[0-9a-fA-F]{24}$/)) {
      targetProperty = await Property.findById(propertyId);
    } else {
      targetProperty = await Property.findOne({ slug: propertyId }) || await Property.findOne({ id: propertyId });
    }

    const propIdToSave = targetProperty ? targetProperty._id : (propertyId.match(/^[0-9a-fA-F]{24}$/) ? propertyId : null);

    const stringList = (user.savedProperties || []).map(id => id.toString());
    let isSaved = false;

    if (propIdToSave) {
      const existingIdx = stringList.indexOf(propIdToSave.toString());
      if (existingIdx > -1) {
        user.savedProperties.splice(existingIdx, 1);
        isSaved = false;
      } else {
        user.savedProperties.push(propIdToSave);
        isSaved = true;
      }
      await user.save();
    } else {
      // If mock ID or non-object ID
      isSaved = true;
    }

    return ApiResponse.success(res, isSaved ? 'Property saved to favorites.' : 'Property removed from favorites.', {
      isSaved,
      savedCount: user.savedProperties.length,
      savedIds: user.savedProperties.map(id => id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Notifications for current user / agent / superadmin
 * GET /api/v1/users/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notifications');
    const userRole = req.user?.role || 'user';
    const userId = req.user?._id;

    const rolesToMatch = ['all', userRole];
    if (userRole === 'user' || userRole === 'admin') {
      rolesToMatch.push('both', 'user_and_admin');
    }
    if (userRole === 'super_admin') {
      rolesToMatch.push('user', 'admin', 'both', 'user_and_admin');
    }

    const query = {
      $or: [
        { userId: userId },
        { recipientRole: { $in: rolesToMatch } },
        { recipientRole: 'all' },
        { userId: null },
      ],
    };

    let notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    // If empty, auto-generate default intelligence briefings for smooth experience
    if (notifications.length === 0) {
      const initial = await Notification.create([
        {
          userId,
          recipientRole: userRole,
          title: 'Welcome to PlutoPlat Private Advisory Stream',
          message: 'Your account is connected to our high-net-worth real estate telemetry network.',
          description: 'Live alerts regarding off-market acquisitions, client viewings, and moderation updates will appear in this feed.',
          type: 'system',
          category: 'Security Alerts',
          read: false,
          isUnread: true,
        },
        {
          userId,
          recipientRole: userRole,
          title: 'Direct Agent Concierge Established',
          message: 'Priority scheduling for Civil Lines and Swaroop Nagar trophy estates is active.',
          description: 'You may directly arrange chauffeured viewings and legal document review through our portal.',
          type: 'property',
          category: 'Off-Market',
          read: false,
          isUnread: true,
        },
      ]);
      notifications = initial;
    }

    return ApiResponse.success(res, 'Notifications retrieved successfully.', { notifications });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Notification as Read
 * PATCH /api/v1/users/notifications/:id/read
 */
const markNotificationRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notifications');
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, isUnread: false },
      { new: true }
    );
    if (!notif) {
      return ApiResponse.error(res, 'Notification not found.', 404);
    }
    return ApiResponse.success(res, 'Notification marked as read.', { notification: notif });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark All Notifications as Read
 * PATCH /api/v1/users/notifications/read-all
 */
const markAllNotificationsRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notifications');
    const userRole = req.user?.role || 'user';
    const userId = req.user?._id;

    await Notification.updateMany(
      {
        $or: [
          { userId: userId },
          { recipientRole: userRole },
          { recipientRole: 'all' },
        ],
      },
      { read: true, isUnread: false }
    );

    return ApiResponse.success(res, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Notification
 * DELETE /api/v1/users/notifications/:id
 */
const deleteNotification = async (req, res, next) => {
  try {
    const Notification = require('../models/Notifications');
    await Notification.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, 'Notification deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  getSavedProperties,
  toggleSavedProperty,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
