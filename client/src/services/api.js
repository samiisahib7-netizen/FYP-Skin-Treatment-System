import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling — 401 forces logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || err.message || 'Request failed';

    if (status === 401) {
      // Token invalid/expired — clear and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status >= 500) {
      toast.error('Server error. Please try again.');
    } else if (status && status !== 400 && status !== 422) {
      // 4xx client errors are usually surfaced inline by forms
      toast.error(message);
    }

    return Promise.reject(err);
  }
);

export default api;
