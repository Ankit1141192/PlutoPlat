

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

const TOKEN_KEY = 'pluto_token';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getToken = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Send a request to the backend.
 *
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {string} path        e.g. "/auth/login"
 * @param {object} [options]
 * @param {object}  [options.body]  data to send as JSON
 * @param {boolean} [options.auth]  true = attach the login token
 */
const request = async (method, path, { body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Unable to reach the server. Please check your internet connection.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

export const Api = {
  // ───────── Register ─────────
  async register(payload) {
    const data = await request('POST', '/auth/register', { body: payload });
    if (data?.data?.token) saveToken(data.data.token);
    return data;
  },

  // ───────── Login ─────────
  async login(payload) {
    const data = await request('POST', '/auth/login', { body: payload });
    if (data?.data?.token) saveToken(data.data.token);
    return data;
  },

  // ───────── Logout (removes only buyer token) ─────────
  logout() {
    clearToken();
  },

  // ───────── Forgot password ─────────
  forgotPassword(payload) {
    return request('POST', '/auth/forgot-password', { body: payload });
  },

  // ───────── Reset password ─────────
  resetPassword(payload) {
    return request('POST', '/auth/reset-password', { body: payload });
  },

  // ───────── Profile ─────────
  getMe() {
    return request('GET', '/auth/me', { auth: true });
  },

  getUserProfile(id) {
    return request('GET', `/users/profile/${id}`);
  },

  updateUserProfile(id, payload) {
    return request('PUT', `/users/profile/${id}`, { body: payload, auth: true });
  },

  // ───────── Properties ─────────
  getProperties(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/properties${q ? `?${q}` : ''}`);
  },

  getPropertyById(id) {
    return request('GET', `/properties/${id}`);
  },

  // ───────── Saved Properties ─────────
  getSavedProperties() {
    return request('GET', '/users/saved-properties', { auth: true });
  },

  toggleSavedProperty(propertyId) {
    return request('POST', `/users/saved-properties/${propertyId}/toggle`, { auth: true });
  },

  // ───────── Notifications ─────────
  getNotifications() {
    return request('GET', '/notifications', { auth: true });
  },

  markNotificationRead(id) {
    return request('PATCH', `/notifications/${id}/read`, { auth: true });
  },

  markAllNotificationsRead() {
    return request('PATCH', '/notifications/read-all', { auth: true });
  },

  deleteNotification(id) {
    return request('DELETE', `/notifications/${id}`, { auth: true });
  },

  // ───────── Testimonials ─────────
  getTestimonials() {
    return request('GET', '/testimonials');
  },
};

export default Api;