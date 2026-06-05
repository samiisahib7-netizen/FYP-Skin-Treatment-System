/**
 * Auth store — global auth state (user, token, loading, error).
 * Persists token + user to localStorage so refresh keeps you signed in.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@/services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /** POST /auth/login */
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authService.login({ email, password });
          set({ token, user, isLoading: false });
          return user;
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Login failed';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      /** POST /auth/register */
      register: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authService.register({ name, email, password });
          set({ token, user, isLoading: false });
          return user;
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Registration failed';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      /** POST /auth/forgot-password */
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.forgotPassword({ email });
          set({ isLoading: false });
          return res.message || 'If an account exists, a reset link has been sent.';
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Request failed';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      /** POST /auth/reset-password/:token */
      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.resetPassword(token, { password });
          set({ isLoading: false });
          return res.message || 'Password updated.';
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Reset failed';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      /** GET /auth/me — refresh user info */
      refreshMe: async () => {
        if (!get().token) return;
        try {
          const user = await authService.me();
          set({ user });
        } catch {
          // ignore — interceptor will handle 401
        }
      },

      /** Logout (client-side) */
      logout: () => {
        authService.logout();
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'skin-treatment-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
