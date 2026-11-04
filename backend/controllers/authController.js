const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { logAudit } = require('../utils/auditLogger');

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

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Phone number';
      return ApiResponse.error(res, `${field} is already registered.`, 409);
    }

    // Create user (password will be hashed via pre-save hook)
    // Default role is user; do not allow public registration to set super_admin/admin
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: role && ['user'].includes(role) ? role : 'user',
      location: location || {},
    });

    const token = user.generateAuthToken();

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

    // Query user including sensitive security fields
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +loginAttempts +lockUntil'
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
    if (user.isLocked()) {
      const remainingMinutes = user.getLockRemainingMinutes();

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
      });

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
      await user.handleFailedLogin();

      await logAudit({
        actor: user._id,
        actorRole: user.role,
        action: 'LOGIN',
        module: 'AUTH',
        targetId: user._id,
        targetType: 'User',
        description: `Failed login attempt (${user.loginAttempts}/5)`,
        req,
        status: 'FAILED',
        failureReason: 'INVALID_CREDENTIALS',
      });

      if (user.loginAttempts >= 5) {
        return res.status(423).json({
          success: false,
          message:
            'Account has been temporarily locked for 30 minutes due to 5 consecutive failed login attempts.',
          remainingMinutes: 30,
          isLocked: true,
        });
      }

      const remainingAttempts = 5 - user.loginAttempts;
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. You have ${remainingAttempts} attempt(s) remaining before account lockout for 30 minutes.`,
        remainingAttempts,
      });
    }

    // Successful login: reset failed attempts & record last login
    await user.handleSuccessfulLogin();
    const token = user.generateAuthToken();

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'LOGIN',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: `User successfully logged in: ${user.email}`,
      req,
      status: 'SUCCESS',
    });

    return ApiResponse.success(res, 'Login successful.', {
      user,
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
    return ApiResponse.success(res, 'User profile fetched successfully.', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Request Password Reset Token
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ApiResponse.error(res, 'Email address is required.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return ambiguous success to avoid user enumeration
      return ApiResponse.success(res, 'If an account exists with this email, password reset instructions have been dispatched.');
    }

    // Generate random 32-byte reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await user.save({ validateBeforeSave: false });

    await logAudit({
      actor: user._id,
      actorRole: user.role,
      action: 'UPDATE',
      module: 'AUTH',
      targetId: user._id,
      targetType: 'User',
      description: 'Password reset token requested',
      req,
    });

    return ApiResponse.success(res, 'Password reset instructions have been dispatched to your email address.', {
      resetToken: rawResetToken,
      expiresInMinutes: 15,
    });
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
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return ApiResponse.error(res, 'Reset token and new password are required.', 400);
    }

    if (newPassword.length < 8) {
      return ApiResponse.error(res, 'New password must contain at least 8 characters.', 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
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

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
