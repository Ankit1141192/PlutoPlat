const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { isOriginAllowed } = require('../middlewares/domainSecurity');

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    if (!name || !email || !phone || !password) {
      return ApiResponse.error(
        res,
        'Name, email, phone, and password are required.',
        400
      );
    }

    if (password.length < 8) {
      return ApiResponse.error(
        res,
        'Password must contain at least 8 characters.',
        400
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = String(phone).replace(/[\s\-\(\)]/g, '');

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      const field = existingUser.email === cleanEmail ? 'Email' : 'Phone number';
      return ApiResponse.error(res, `${field} is already registered.`, 409);
    }

    // Determine target role and subscription tier
    const targetRole = role && ['user', 'admin', 'super_admin'].includes(role) ? role : 'user';
    let subscriptionTier = 'Free';
    if (targetRole === 'super_admin') subscriptionTier = 'Website Owner';
    else if (targetRole === 'admin') subscriptionTier = 'agent_pro';

    const initialSessionId = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    // Create user (password will be hashed via pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: targetRole,
      subscriptionTier,
      location: location || {},
      activeSessions: [
        {
          sessionId: initialSessionId,
          deviceInfo: String(req.headers['user-agent'] || 'Unknown Device').substring(0, 100),
          ip: req.ip || '',
          createdAt: new Date(),
        },
      ],
    });

    const token = user.generateAuthToken(initialSessionId);

    // Audit log
    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'CREATE',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: `User registered with email: ${user.email}`,
      req,
    });

    return ApiResponse.success(
      res,
      'User registered successfully.',
      {
        user,
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * User Login with 5-attempt limit & 30-minute lockout
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Email and password are required.', 400);
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Query user including sensitive security fields and active sessions
    const user = await User.findOne({ email: cleanEmail }).select(
      '+password +loginAttempts +lockUntil +activeSessions'
    );

    // If user does not exist, return generic error to prevent account enumeration
    if (!user) {
      return ApiResponse.error(res, 'Invalid email or password.', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      return ApiResponse.error(
        res,
        'Your account has been deactivated. Please contact support.',
        403
      );
    }

    // Check if account is currently locked (due to 5 failed attempts)
    if (typeof user.isLocked === 'function' && user.isLocked()) {
      const remainingMinutes = user.getLockRemainingMinutes ? user.getLockRemainingMinutes() : 30;

      await logAudit({
        actor: user._id,
        actorRole: user.role,
        action: 'LOGIN',
        module: 'AUTH',
        targetId: user._id,
        targetType: 'User',
        description: `Blocked login attempt on locked account (${remainingMinutes} mins remaining)`,
        req,
        status: 'FAILED',
        failureReason: 'ACCOUNT_LOCKED',
      }).catch(() => {});

      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to 5 consecutive failed login attempts. Please try again after ${remainingMinutes} minute(s).`,
        remainingMinutes,
        isLocked: true,
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Record failed attempt and apply 30-min lockout if attempts >= 5
      if (typeof user.handleFailedLogin === 'function') {
        await user.handleFailedLogin().catch(() => {});
      }

      await logAudit({
        actor: user._id,
        actorRole: user.role,
        action: 'LOGIN',
        module: 'AUTH',
        targetId: user._id,
        targetType: 'User',
        description: `Failed login attempt (${user.loginAttempts || 1}/5)`,
        req,
        status: 'FAILED',
        failureReason: 'INVALID_CREDENTIALS',
      }).catch(() => {});

      const attempts = user.loginAttempts || 1;
      if (attempts >= 5) {
        return res.status(423).json({
          success: false,
          message:
            'Account has been temporarily locked for 30 minutes due to 5 consecutive failed login attempts.',
          remainingMinutes: 30,
          isLocked: true,
        });
      }

      const remainingAttempts = Math.max(1, 5 - attempts);
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. You have ${remainingAttempts} attempt(s) remaining before account lockout for 30 minutes.`,
        remainingAttempts,
      });
    }

    // Successful login: reset failed attempts & record last login
    if (typeof user.handleSuccessfulLogin === 'function') {
      await user.handleSuccessfulLogin().catch(() => {});
    }

    // Concurrent Device Control: Maximum 2 concurrent device sessions allowed
    const sessionId = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    const existingSessions = Array.isArray(user.activeSessions) ? user.activeSessions : [];
    // Keep at most 1 previous active session so this new session makes it at most 2 devices
    const updatedSessions = existingSessions.slice(-1);
    updatedSessions.push({
      sessionId,
      deviceInfo: String(req.headers['user-agent'] || 'Unknown Device').substring(0, 100),
      ip: req.ip || '',
      createdAt: new Date(),
    });

    await User.updateOne({ _id: user._id }, { activeSessions: updatedSessions });

    const token = user.generateAuthToken(sessionId);

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'LOGIN',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: `User successfully logged in: ${user.email} (Active sessions: ${updatedSessions.length}/2)`,
      req,
      status: 'SUCCESS',
    }).catch(() => {});

    const populatedUser = await User.findById(user._id).populate('savedProperties').catch(() => null);

    return ApiResponse.success(res, 'Login successful.', {
      user: populatedUser || user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user details
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    return ApiResponse.success(res, 'User profile fetched successfully.', {
      user: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Request Password Reset Token & Dispatch Email
 * POST /api/v1/auth/forgot-password, /api/v2/auth/forgot-password, /api/v3/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email, origin: clientOrigin, portal: clientPortal } = req.body;
    if (!email) {
      return ApiResponse.error(res, 'Email address is required.', 400);
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return ApiResponse.error(res, 'No registered account found with that email address.', 404);
    }

    // Generate random 32-byte reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await user.save({ validateBeforeSave: false });

    // Determine originating portal and appropriate branding
    const reqPath = (req.originalUrl || req.url || '').toLowerCase();
    let portalName = 'Client Desk';
    let defaultOrigin = 'https://www.plutoplot.in';

    if (reqPath.includes('/v3') || clientPortal === 'superadmin' || user.role === 'super_admin') {
      portalName = 'SuperAdmin Executive Control';
      defaultOrigin = 'https://superadmin.plutoplot.in';
    } else if (reqPath.includes('/v2') || clientPortal === 'admin' || user.role === 'admin') {
      portalName = 'Broker Workstation';
      defaultOrigin = 'https://admin.plutoplot.in';
    }

    // Resolve base URL for reset link (enforce allowed plutoplot.in origin)
    let resolvedOrigin = clientOrigin;
    if (!resolvedOrigin && req.headers['origin']) {
      resolvedOrigin = req.headers['origin'];
    } else if (!resolvedOrigin && req.headers['referer']) {
      try {
        const u = new URL(req.headers['referer']);
        resolvedOrigin = `${u.protocol}//${u.host}`;
      } catch {
        resolvedOrigin = null;
      }
    }
    if (!resolvedOrigin || !isOriginAllowed(resolvedOrigin)) {
      resolvedOrigin = defaultOrigin;
    }
    resolvedOrigin = resolvedOrigin.replace(/\/$/, '');

    const resetUrl = `${resolvedOrigin}/reset-password?token=${rawResetToken}`;

    // Dispatch email
    const emailRes = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      resetToken: rawResetToken,
      portalName,
    });

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'UPDATE',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: `Password reset token requested and dispatched via email (${emailRes.success ? 'Delivered' : 'Failed'})`,
      req,
    }).catch(() => {});

    return ApiResponse.success(
      res,
      'Password reset instructions and verification link have been dispatched to your email.',
      {
        resetToken: rawResetToken,
        resetUrl,
        expiresInMinutes: 15,
        email: user.email,
        emailSent: emailRes.success,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password with Token
 * POST /api/v1/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const rawToken = req.body.token || req.body.resetToken;
    const newPassword = req.body.newPassword || req.body.password;

    if (!rawToken || !newPassword) {
      return ApiResponse.error(res, 'Reset token and new password are required.', 400);
    }

    if (newPassword.length < 8) {
      return ApiResponse.error(res, 'New password must contain at least 8 characters.', 400);
    }

    const tokenStr = String(rawToken).trim();
    const hashedToken = crypto.createHash('sha256').update(tokenStr).digest('hex');

    const user = await User.findOne({
      $or: [
        { resetPasswordToken: hashedToken },
        { resetPasswordToken: tokenStr },
      ],
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return ApiResponse.error(res, 'Invalid or expired password reset token.', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'UPDATE',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: 'Password reset successfully completed',
      req,
    });

    return ApiResponse.success(res, 'Password has been reset successfully. You may now proceed to log in.');
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password (Authenticated User)
 * POST /api/v1/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return ApiResponse.error(res, 'Current password and new password are required.', 400);
    }

    if (newPassword.length < 8) {
      return ApiResponse.error(res, 'New password must contain at least 8 characters.', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'User not found.', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 'Current password is incorrect.', 401);
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'UPDATE',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: 'User updated account password',
      req,
    });

    return ApiResponse.success(res, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout User & Invalidate active session
 * POST /api/v1/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'PlutoPlatSecureSecretKey2026';
      try {
        const decoded = jwt.verify(token, secret);
        if (decoded?.id && decoded?.sessionId) {
          await User.updateOne(
            { _id: decoded.id },
            { $pull: { activeSessions: { sessionId: decoded.sessionId } } }
          );
        }
      } catch (_) {}
    }
    return ApiResponse.success(res, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
