// routes/RootRedirect.jsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, loading, isAuthenticated, isAdmin, redirectToWordPress, redirectPath } = useAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();
  
  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If it's an admin route, only check admin authentication
  if (isAdminRoute) {
    return isAdminAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/admin/login" replace />;
  }
  
  // For non-admin routes, check WordPress auth parameters
  const urlParams = new URLSearchParams(location.search);
  const hasAuthParams = urlParams.get('uid') && urlParams.get('token');

  // If we have auth params, don't do anything else - let the auth process complete
  if (hasAuthParams) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Authenticating with WordPress...</p>
      </div>
    );
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If authenticated, redirect to home
  if (isAuthenticated && user) {
    return <Navigate to="/my-leads" replace />;
  }

  // If not authenticated and not loading, show login page
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Insuppent</h1>
        <p className="text-gray-600 mb-6">Please login through WordPress to access the application.</p>
        <button
          onClick={redirectToWordPress}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login with WordPress
        </button>
        <div className="mt-4 text-sm text-gray-500">
          <p>Don't have an account? Contact administrator for access.</p>
        </div>
      </div>
    </div>
  );

    // User is authenticated, use the redirectPath from context
  if (user && redirectPath) {
    console.log('Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback
  return <LoadingSpinner />;
};

export default RootRedirect;