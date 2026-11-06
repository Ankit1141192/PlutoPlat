const rateLimit = require('express-rate-limit');

const getKey = (req) => {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.ip ||
    '127.0.0.1'
  );
};

/**
 * General API Rate Limiter
 * Protects against DDoS and repeated rapid API flooding.
 */
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Strict Login Rate Limiter (IP-Level)
 * First defensive line before database account-level lockout.
 */
const loginRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // Max 20 attempts per IP in 30 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
  message: {
    success: false,
    message: 'Too many login attempts from this network. Please try again after 30 minutes.',
  },
});

/**
 * Registration & Sensitive Auth Operations Limiter
 */
const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Max 30 attempts per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
  message: {
    success: false,
    message: 'Too many account operations from this IP. Please try again later.',
  },
});

module.exports = {
  apiLimiter,
  loginRateLimiter,
  authRateLimiter,
};
