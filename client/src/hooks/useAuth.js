/**
 * useAuth — convenience hook that wraps the auth store.
 * Adds derived helpers: isAuthenticated, role checks.
 */
import useAuthStore from '@/store/authStore';

const ROLE_HOME = {
  admin: '/admin',
  doctor: '/doctor',
  patient: '/patient',
  rider: '/rider',
};

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const logout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || null;
  const homePath = role ? ROLE_HOME[role] : '/';

  const hasRole = (allowed) => {
    if (!role) return false;
    if (Array.isArray(allowed)) return allowed.includes(role);
    return role === allowed;
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    error,
    homePath,
    hasRole,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };
}
