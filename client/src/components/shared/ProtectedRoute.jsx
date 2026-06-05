/**
 * ProtectedRoute — wraps a route and enforces auth + role guard.
 * - If not logged in → redirect to /login with `from` state.
 * - If logged in but wrong role → redirect to user's homePath.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loading from './Loading';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, isLoading, homePath } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading variant="fullscreen" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={homePath} replace />;
  }

  return children;
}
