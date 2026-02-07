import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Subscription API
export const subscriptionAPI = {
  create: (data) => API.post('/subscriptions', data),
  getMySubscriptions: () => API.get('/subscriptions/my-subscriptions'),
  getActive: () => API.get('/subscriptions/active'),
  togglePause: (id, data) => API.post(`/subscriptions/${id}/toggle-pause`, data),
  cancel: (id) => API.put(`/subscriptions/${id}/cancel`),
  
  // Seller routes
  getAll: () => API.get('/subscriptions/all'),
  getTodaySummary: () => API.get('/subscriptions/today-summary'),
};

export default API;