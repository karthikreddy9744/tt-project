import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.101:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

// Study Groups API
export const studyGroupsAPI = {
  getAll: () => api.get('/study-groups'),
  getById: (id) => api.get(`/study-groups/${id}`),
  create: (data) => api.post('/study-groups', data),
  update: (id, data) => api.put(`/study-groups/${id}`, data),
  delete: (id) => api.delete(`/study-groups/${id}`),
  join: (id) => api.post(`/study-groups/${id}/join`),
  leave: (id) => api.post(`/study-groups/${id}/leave`),
  getMembers: (id) => api.get(`/study-groups/${id}/members`),
};

// Files API
export const filesAPI = {
  getAll: (params) => api.get('/files', { params }),
  getById: (id) => api.get(`/files/${id}`),
  upload: (formData) => api.post('/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/files/${id}`),
  upvote: (id) => api.post(`/files/${id}/upvote`),
  downvote: (id) => api.post(`/files/${id}/downvote`),
  download: (id) => api.get(`/files/${id}/download`, { responseType: 'blob' }),
};

// Discussions API
export const discussionsAPI = {
  getAll: (params) => api.get('/discussions', { params }),
  getById: (id) => api.get(`/discussions/${id}`),
  create: (data) => api.post('/discussions', data),
  update: (id, data) => api.put(`/discussions/${id}`, data),
  delete: (id) => api.delete(`/discussions/${id}`),
  addReply: (id, data) => api.post(`/discussions/${id}/replies`, data),
  upvote: (id) => api.post(`/discussions/${id}/upvote`),
  downvote: (id) => api.post(`/discussions/${id}/downvote`),
  markSolved: (id) => api.post(`/discussions/${id}/solve`),
};

// Sessions API
export const sessionsAPI = {
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  join: (id) => api.post(`/sessions/${id}/join`),
  leave: (id) => api.post(`/sessions/${id}/leave`),
  start: (id) => api.post(`/sessions/${id}/start`),
  end: (id) => api.post(`/sessions/${id}/end`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Search API
export const searchAPI = {
  query: (params) => api.get('/search', { params }),
  suggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
};

export default api;
