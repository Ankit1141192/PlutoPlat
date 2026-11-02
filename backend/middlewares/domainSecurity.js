/**
 * Strict Domain & Origin Verification Middleware
 * Ensures API endpoints can only be accessed from the authorized domain(s).
 * Rejects requests from unauthorized domains, forged referrers, or direct bot hits.
 */

const parseAllowedOrigins = () => {
  const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:3000';
  return allowed
    .split(',')
    .map((o) => o.trim().toLowerCase().replace(/\/$/, ''))
    .filter(Boolean);
};

const extractOriginFromUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
};

const enforceAllowedDomain = (req, res, next) => {
  // Allow CORS preflight requests to pass to CORS handler
  if (req.method === 'OPTIONS') {
    return next();
  }

  const allowedOrigins = parseAllowedOrigins();
  const enforceStrict = process.env.ENFORCE_ORIGIN_CHECK === 'true';

  const rawOrigin = req.headers['origin'];
  const rawReferer = req.headers['referer'];

  let requestOrigin = null;

  if (rawOrigin) {
    requestOrigin = rawOrigin.trim().toLowerCase().replace(/\/$/, '');
  } else if (rawReferer) {
    requestOrigin = extractOriginFromUrl(rawReferer);
  }

  // If origin/referer is present, verify against allowed list
  if (requestOrigin) {
    const isAllowed = allowedOrigins.includes(requestOrigin);
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Requests from unauthorized domains are blocked.',
        origin: requestOrigin,
      });
    }
    return next();
  }

  // If no origin/referer header was sent (e.g. direct bot, curl, postman hit)
  // When strict mode is enabled, reject request to protect server APIs
  if (enforceStrict) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Missing verified domain origin or referer header.',
    });
  }

  // In non-strict development mode without origin, continue
  next();
};

module.exports = {
  enforceAllowedDomain,
  parseAllowedOrigins,
};
