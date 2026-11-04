/**
 * PlutoPlat API Service
 * Connects to the live Cloudflare Workers backend.
 * Base URL: https://my-node-backend.ankit2914978.workers.dev
 *
 * All authenticated requests automatically attach the JWT token
 * stored in localStorage under the key "pluto_token".
 */

const BASE_URL = 'https://my-node-backend.ankit2914978.workers.dev/api/v1';

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

/** Retrieve the stored JWT token */
const getToken = () => localStorage.getItem('pluto_token');

/** Build common headers; attach Bearer token when available */
const buildHeaders = (auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Centralised fetch wrapper.
 * Throws an Error with the backend's message on non-2xx responses.
 */
const request = async (method, path, { body, auth = false } = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

// ─────────────────────────────────────────────
// API Service
// ─────────────────────────────────────────────

export const Api = {

  // ══════════════════════════════════════════
  // AUTH  —  /api/v1/auth
  // ══════════════════════════════════════════

  /**
   * Register a new user account.
   * POST /api/v1/auth/register
   * @param {{ name, email, phone, password, role?, location? }} payload
   */
  async register(payload) {
    return request('POST', '/auth/register', { body: payload });
  },

  /**
   * Login with email & password. Returns { user, token }.
   * POST /api/v1/auth/login
   * @param {{ email, password }} payload
   */
  async login(payload) {
    const data = await request('POST', '/auth/login', { body: payload });
    if (data?.data?.token) {
      localStorage.setItem('pluto_token', data.data.token);
    }
    return data;
  },

  /**
   * Request password reset token.
   * POST /api/v1/auth/forgot-password
   * @param {{ email }} payload
   */
  async forgotPassword(payload) {
    return request('POST', '/auth/forgot-password', { body: payload });
  },

  /**
   * Reset password with verification token.
   * POST /api/v1/auth/reset-password
   * @param {{ token, newPassword }} payload
   */
  async resetPassword(payload) {
    return request('POST', '/auth/reset-password', { body: payload });
  },

  /**
   * Logout — clears the stored token locally.
   */
  logout() {
    localStorage.removeItem('pluto_token');
  },

  /**
   * Get the currently authenticated user's profile.
   * GET /api/v1/auth/me  (requires auth)
   */
  async getMe() {
    return request('GET', '/auth/me', { auth: true });
  },

  // ══════════════════════════════════════════
  // USERS  —  /api/v1/users
  // ══════════════════════════════════════════

  /**
   * Get a public user profile by ID.
   * GET /api/v1/users/profile/:id
   * @param {string} id
   */
  async getUserProfile(id) {
    return request('GET', `/users/profile/${id}`);
  },

  /**
   * Update a user's profile. (requires auth — own profile)
   * PUT /api/v1/users/profile/:id
   * @param {string} id
   * @param {{ name?, phone?, location?, profileImage? }} payload
   */
  async updateUserProfile(id, payload) {
    return request('PUT', `/users/profile/${id}`, { body: payload, auth: true });
  },

  /**
   * Get all users. (SuperAdmin only)
   * GET /api/v1/users
   */
  async getAllUsers(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request('GET', `/users${qs ? `?${qs}` : ''}`, { auth: true });
  },

  /**
   * SuperAdmin: Update role, subscription, status, or unlock account.
   * PATCH /api/v1/users/:id/status
   * @param {string} id
   * @param {{ isActive?: boolean, unlockAccount?: boolean, role?: string, subscriptionTier?: string }} payload
   */
  async updateUserStatus(id, payload) {
    return request('PATCH', `/users/${id}/status`, { body: payload, auth: true });
  },

  // ══════════════════════════════════════════
  // PROPERTIES  —  /api/v1/properties
  // ══════════════════════════════════════════

  /**
   * Get all properties with optional query params.
   * GET /api/v1/properties
   */
  async getProperties(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request('GET', `/properties${qs ? `?${qs}` : ''}`, { auth: true });
  },

  /**
   * Get single property by ID.
   * GET /api/v1/properties/:id
   * @param {string} id
   */
  async getPropertyById(id) {
    return request('GET', `/properties/${id}`);
  },

  /**
   * Create a new property listing. (Agents / SuperAdmin)
   * POST /api/v1/properties
   * @param {object} payload
   */
  async createProperty(payload) {
    return request('POST', '/properties', { body: payload, auth: true });
  },

  /**
   * SuperAdmin: Approve or Reject a listing
   * PATCH /api/v1/properties/:id/moderate
   * @param {string} id
   * @param {{ status: 'active'|'rejected', rejectionReason?: string }} payload
   */
  async moderateProperty(id, payload) {
    return request('PATCH', `/properties/${id}/moderate`, { body: payload, auth: true });
  },

  /**
   * Update an existing property listing. (requires auth — owner/admin)
   * PUT /api/v1/properties/:id
   * @param {string} id
   * @param {object} payload
   */
  async updateProperty(id, payload) {
    return request('PUT', `/properties/${id}`, { body: payload, auth: true });
  },

  /**
   * Delete a property listing. (requires auth — owner/admin)
   * DELETE /api/v1/properties/:id
   * @param {string} id
   */
  async deleteProperty(id) {
    return request('DELETE', `/properties/${id}`, { auth: true });
  },

  // ══════════════════════════════════════════
  // ENQUIRIES & LEADS  —  /api/v1/enquiries
  // ══════════════════════════════════════════

  /**
   * Submit a property enquiry (Buyers & SuperAdmin).
   * POST /api/v1/enquiries
   * @param {{ propertyId, message, name?, email?, phone?, siteVisitDate? }} payload
   */
  async createEnquiry(payload) {
    return request('POST', '/enquiries', { body: payload, auth: true });
  },

  /**
   * Get enquiries (Role-scoped: Buyer own, Admin own property leads, SuperAdmin all).
   * GET /api/v1/enquiries
   */
  async getMyEnquiries(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request('GET', `/enquiries${qs ? `?${qs}` : ''}`, { auth: true });
  },

  /**
   * Update lead stage or admin notes.
   * PATCH /api/v1/enquiries/:id/status
   * @param {string} id
   * @param {{ status?: string, adminNotes?: string }} payload
   */
  async updateEnquiryStatus(id, payload) {
    return request('PATCH', `/enquiries/${id}/status`, { body: payload, auth: true });
  },

  // ══════════════════════════════════════════
  // TESTIMONIALS  —  /api/v1/testimonials
  // ══════════════════════════════════════════

  /**
   * Get all testimonials (newest first).
   * GET /api/v1/testimonials
   */
  async getTestimonials() {
    return request('GET', '/testimonials');
  },

  /**
   * Get a single testimonial by ID.
   * GET /api/v1/testimonials/:id
   * @param {string} id
   */
  async getTestimonialById(id) {
    return request('GET', `/testimonials/${id}`);
  },

  /**
   * Create a new testimonial.
   * POST /api/v1/testimonials
   * @param {{ name, rating, imageUrl, company, role, message }} payload
   */
  async createTestimonial(payload) {
    return request('POST', '/testimonials', { body: payload });
  },

  /**
   * Update a testimonial by ID.
   * PUT /api/v1/testimonials/:id
   * @param {string} id
   * @param {{ name?, rating?, imageUrl?, company?, role?, message? }} payload
   */
  async updateTestimonial(id, payload) {
    return request('PUT', `/testimonials/${id}`, { body: payload });
  },

  /**
   * Delete a testimonial by ID.
   * DELETE /api/v1/testimonials/:id
   * @param {string} id
   */
  async deleteTestimonial(id) {
    return request('DELETE', `/testimonials/${id}`);
  },

  // ══════════════════════════════════════════
  // AUDIT LOGS & ANALYTICS  —  /api/v1/audits
  // ══════════════════════════════════════════

  /**
   * Get all audit logs. (SuperAdmin only)
   * GET /api/v1/audits
   */
  async getAuditLogs(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request('GET', `/audits${qs ? `?${qs}` : ''}`, { auth: true });
  },

  /**
   * Get platform analytics & intelligence metrics. (SuperAdmin only)
   * GET /api/v1/audits/analytics
   */
  async getPlatformAnalytics() {
    return request('GET', '/audits/analytics', { auth: true });
  },
};

export default Api;
