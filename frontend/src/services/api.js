import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Guest cart ID
    const guestId = localStorage.getItem('guestId');
    if (guestId) {
      config.headers['X-Guest-Id'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        // Optionally redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) =>
    api.put(`/auth/resetpassword/${token}`, { password }),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (slug) => api.get(`/products/${slug}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  search: (q) => api.get('/products/search', { params: { q } }),
};

// Admin Products API
export const adminProductsAPI = {
  getAll: (params) => api.get('/admin/products', { params }),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
  uploadImages: (id, formData) =>
    api.post(`/admin/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
