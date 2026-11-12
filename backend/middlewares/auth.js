const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and binds user to request
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'PlutoPlatSecureSecretKey2026';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or forged token.',
      });
    }

    // Find user in DB with lock status and active session records
    const user = await User.findById(decoded.id).select('+lockUntil +activeSessions');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account associated with this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    if (user.isLocked()) {
      const remainingMinutes = user.getLockRemainingMinutes();
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Please try again after ${remainingMinutes} minutes.`,
      });
    }

    // Enforce 2-device concurrent login limit:
    // If the token carries a sessionId, check that it is still present in activeSessions
    if (decoded.sessionId && Array.isArray(user.activeSessions) && user.activeSessions.length > 0) {
      const isSessionActive = user.activeSessions.some((s) => s.sessionId === decoded.sessionId);
      if (!isSessionActive) {
        return res.status(401).json({
          success: false,
          message: 'Session expired: Maximum 2 concurrent devices allowed with these credentials. You were signed out because another device logged in.',
          sessionExpired: true,
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to an internal error.',
      error: error.message,
    });
  }
};

/**
 * Optional Authentication Middleware
 * If token is provided, binds user to request; otherwise proceeds as guest
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const secret = process.env.JWT_SECRET || 'PlutoPlatSecureSecretKey2026';
    try {
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      if (user && user.isActive && !user.isLocked()) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch {
      req.user = null;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access based on user role (e.g., 'admin', 'super_admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorize,
};
