import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';


const RootRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If it's an admin route, only check admin authentication
  if (isAdminRoute) {
    return isAdminAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/admin/login" replace />;
  }

  // Show loading state while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // If authenticated, redirect to main app
  if (isAuthenticated && user) {
    return <Navigate to="/my-leads" replace />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/auth/login" replace />;
};

export default RootRedirect;