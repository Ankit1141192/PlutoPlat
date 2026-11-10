/**
 * Strict Domain & Origin Verification Middleware
 * Ensures API endpoints can only be accessed from the authorized domain(s).
 * Rejects requests from unauthorized domains, forged referrers, or direct bot hits.
 */

const parseAllowedOrigins = () => {
  const allowed = process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000';
  return allowed
    .replace(/^"|"$/g, '')
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

const isLocalhostOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '[::1]' ||
      url.hostname.endsWith('.localhost')
    );
  } catch {
    return false;
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

  // Always allow local development origins if strict mode is disabled
  if (requestOrigin && !enforceStrict && isLocalhostOrigin(requestOrigin)) {
    return next();
  }

  // If origin/referer is present, verify against allowed list
  if (requestOrigin) {
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed === '*' || allowed === requestOrigin) return true;
      if (isLocalhostOrigin(requestOrigin) && (allowed.includes('localhost') || allowed.includes('127.0.0.1'))) {
        return true;
      }
      if (allowed.startsWith('*.')) {
        const rootDomain = allowed.slice(2);
        try {
          const parsed = new URL(requestOrigin);
          return parsed.hostname.endsWith(rootDomain) || parsed.hostname === rootDomain;
        } catch {
          return false;
        }
      }
      return false;
    });

    if (!isAllowed && enforceStrict) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Requests from unauthorized domains are blocked.',
        origin: requestOrigin,
      });
    }
    return next();
  }

  // If no origin/referer header was sent (e.g. direct curl, postman hit)
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
