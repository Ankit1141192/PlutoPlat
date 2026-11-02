const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Protects against DDoS and repeated rapid API flooding.
 */
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
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
  max: 10, // Max 10 attempts per IP in 30 minutes
  standardHeaders: true,
  legacyHeaders: false,
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
  max: 15, // Max 15 attempts per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
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
