import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="relative flex items-center justify-center">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-blue-500 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-xl"></div>
      <div className="absolute animate-pulse rounded-full h-12 w-12 bg-white border-2 border-blue-300 shadow-inner"></div>
      <div className="absolute animate-ping h-32 w-32 rounded-full bg-blue-200 opacity-25"></div>
    </div>
  </div>
);

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