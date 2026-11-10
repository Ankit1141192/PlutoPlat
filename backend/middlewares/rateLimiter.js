/**
 * Cloudflare Workers & Node.js Compatible Rate Limiter
 * Does NOT use global timers (setInterval/setTimeout) which are disallowed in Cloudflare Workers global scope.
 * Uses an in-memory Map with lazy cleanup on incoming requests.
 */

const isDev = process.env.NODE_ENV === 'development';

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests. Please try again later.',
}) => {
  const store = new Map();

  return (req, res, next) => {
    // In local development, bypass rate limiting unless explicitly forced
    if (isDev && process.env.ENFORCE_RATE_LIMIT !== 'true') {
      return next();
    }

    try {
      const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.ip ||
        '127.0.0.1';

      const now = Date.now();
      const record = store.get(ip);

      // Lazy cleanup of expired entries if the store grows large
      if (store.size > 2000) {
        for (const [key, val] of store.entries()) {
          if (now > val.resetTime) {
            store.delete(key);
          }
        }
      }

      if (!record || now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }

      if (record.count >= max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return res.status(429).json({
          success: false,
          message: typeof message === 'string' ? message : (message.message || 'Too many requests. Please try again later.'),
          retryAfter,
        });
      }

      record.count += 1;
      return next();
    } catch {
      // Never block legitimate requests on limiter failure
      return next();
    }
  };
};

/**
 * General API Rate Limiter
 */
const apiLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 2000,
  message: 'Too many requests from this IP. Please try again later.',
});

/**
 * Strict Login Rate Limiter (IP-Level)
 */
const loginRateLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: 'Too many login attempts from this network. Please try again after 30 minutes.',
});

/**
 * Registration & Sensitive Auth Operations Limiter
 */
const authRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many account operations from this IP. Please try again later.',
});

module.exports = {
  apiLimiter,
  loginRateLimiter,
  authRateLimiter,
};
