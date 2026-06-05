/**
 * Auth service.
 * - In DEV (before backend is live), uses mock data so UI can be exercised end-to-end.
 * - Once the backend is running, set VITE_USE_MOCK=false in .env to use real API.
 */
import api from './api';
import {
  mockLogin,
  mockRegister,
  mockForgotPassword,
  mockResetPassword,
  mockMe,
} from './mock/auth.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const authService = {
  login: (payload) => (USE_MOCK ? mockLogin(payload) : api.post('/auth/login', payload).then((r) => r.data.data)),
  register: (payload) => (USE_MOCK ? mockRegister(payload) : api.post('/auth/register', payload).then((r) => r.data.data)),
  forgotPassword: (payload) =>
    USE_MOCK
      ? mockForgotPassword(payload)
      : api.post('/auth/forgot-password', payload).then((r) => r.data),
  resetPassword: (token, payload) =>
    USE_MOCK
      ? mockResetPassword(payload)
      : api.post(`/auth/reset-password/${token}`, payload).then((r) => r.data),
  me: () => (USE_MOCK ? mockMe() : api.get('/auth/me').then((r) => r.data.data)),
  changePassword: (payload) => api.post('/auth/change-password', payload).then((r) => r.data),
  logout: () => {
    // Stateless JWT — client just clears local storage; backend logout is a no-op for now.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
