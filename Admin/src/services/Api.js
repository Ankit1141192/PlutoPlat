/**
 * PlutoPlat Admin & Agent API Service
 * Handles all network requests for the Admin & Broker workstation.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://my-node-backend.ankit2914978.workers.dev/api/v1';

const getToken = () => localStorage.getItem('pluto_admin_token') || localStorage.getItem('pluto_token');

const buildHeaders = (auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

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

export const AdminApi = {
  // Authentication
  async login(payload) {
    const data = await request('POST', '/auth/login', { body: payload });
    if (data?.data?.token) {
      localStorage.setItem('pluto_admin_token', data.data.token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('pluto_admin_token');
  },

  async getMe() {
    return request('GET', '/auth/me', { auth: true });
  },

  // Properties Management
  async getProperties(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/properties${q ? `?${q}` : ''}`, { auth: true });
  },

  async getMyProperties() {
    return request('GET', '/properties/my/listings', { auth: true });
  },

  async getPropertyById(id) {
    return request('GET', `/properties/${id}`, { auth: true });
  },

  async createProperty(payload) {
    return request('POST', '/properties', { body: payload, auth: true });
  },

  async updateProperty(id, payload) {
    return request('PUT', `/properties/${id}`, { body: payload, auth: true });
  },

  async deleteProperty(id) {
    return request('DELETE', `/properties/${id}`, { auth: true });
  },

  // Leads & Inquiries
  async getMyEnquiries(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/enquiries/my${q ? `?${q}` : ''}`, { auth: true });
  },

  async updateEnquiryStatus(id, payload) {
    return request('PATCH', `/enquiries/${id}/status`, { body: payload, auth: true });
  },

  // Agent Profile
  async updateProfile(id, payload) {
    return request('PUT', `/users/profile/${id}`, { body: payload, auth: true });
  }
};

export default AdminApi;
