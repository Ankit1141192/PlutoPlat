/**
 * Strict Domain & Origin Verification Middleware
 * Ensures API endpoints can only be accessed from authorized plutoplot.in & plutoplat domains.
 * Rejects requests from unauthorized domains, localhost, forged referrers, or direct bot hits.
 */

const parseAllowedOrigins = () => {
  const allowed =
    process.env.ALLOWED_ORIGIN ||
    'https://www.plutoplot.in,https://admin.plutoplot.in,https://superadmin.plutoplot.in,https://plutoplot.in,*.plutoplot.in,*.plutoplat.in,*.plutoplat.com';
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

/**
 * Checks whether an origin strictly matches plutoplot.in (or plutoplat.in / .com)
 * or any explicitly configured allowed origin.
 * Checks whether an origin strictly matches plutoplot.in (or plutoplat.in / .com)
 * or any explicitly configured allowed origin, or local development environments.
 */
const isOriginAllowed = (origin) => {
  if (!origin) return false;

  try {
    const originLower = origin.toLowerCase().trim().replace(/\/$/, '');

    // Allow localhost & loopback addresses for local development & testing
    if (
      originLower.includes('localhost') ||
      originLower.includes('127.0.0.1') ||
      originLower.includes('[::1]') ||
      originLower.includes('.localhost')
    ) {
      return true;
    }

    let url;
    try {
      url = new URL(originLower);
    } catch {
      // If no protocol was provided, prepend https://
      url = new URL(`https://${originLower}`);
    }

    const hostname = url.hostname;

    // Permit root domain and any valid subdomain of plutoplot.in or plutoplat.in/com
    if (
      hostname === 'plutoplot.in' ||
      hostname.endsWith('.plutoplot.in') ||
      hostname === 'plutoplat.in' ||
      hostname.endsWith('.plutoplat.in') ||
      hostname === 'plutoplat.com' ||
      hostname.endsWith('.plutoplat.com')
    ) {
      return true;
    }

    // Check against configured ALLOWED_ORIGIN entries
    const allowedOrigins = parseAllowedOrigins();
    return allowedOrigins.some((allowed) => {
      if (allowed === '*' || allowed === originLower || allowed === hostname) {
        return true;
      }
      if (allowed.startsWith('*.')) {
        const rootDomain = allowed.slice(2);
        return hostname === rootDomain || hostname.endsWith('.' + rootDomain);
      }
      try {
        const allowedUrl = new URL(allowed);
        if (allowedUrl.origin === url.origin) return true;
        if (allowedUrl.hostname.startsWith('*.')) {
          const rootDomain = allowedUrl.hostname.slice(2);
          return hostname === rootDomain || hostname.endsWith('.' + rootDomain);
        }
      } catch {
        // Not a URL string
      }
      return false;
    });
  } catch {
    return false;
  }
};

const enforceAllowedDomain = (req, res, next) => {
  // Allow CORS preflight requests to pass to CORS handler
  if (req.method === 'OPTIONS') {
    return next();
  }

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
    if (isOriginAllowed(requestOrigin)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access Denied: Requests from unauthorized domains are blocked by CORS.',
      origin: requestOrigin,
    });
  }

  // If no origin/referer header was sent (e.g. direct bot/curl)
  if (enforceStrict) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Missing verified domain origin or referer header.',
    });
  }

  // In non-strict mode without origin header, continue
  next();
};

module.exports = {
  enforceAllowedDomain,
  parseAllowedOrigins,
  isOriginAllowed,
};
