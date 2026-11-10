const rateLimit = require('express-rate-limit');

const getKey = (req) => {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.ip ||
    '127.0.0.1'
  );
};

const isDev = process.env.NODE_ENV === 'development';

/**
 * General API Rate Limiter
 * Protects against DDoS and repeated rapid API flooding.
 */
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: isDev ? 10000 : (Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKey,
  validate: false,
  skip: () => isDev,
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
  windowMs: 30 * 60 * 1000,
  max: isDev ? 200 : 20,
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
  windowMs: 60 * 60 * 1000,
  max: isDev ? 300 : 30,
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
