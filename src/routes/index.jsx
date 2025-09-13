import FindLeads from '@/pages/User/FindLeads';
import { Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLeads from "../pages/Admin/AdminLeads";
import Settings from "../pages/Admin/Settings";
import Customers from "../pages/Admin/Customers";
import AdminLogin from "../pages/Admin/Auth/AdminLogin";
import AdminSignup from "../pages/Admin/Auth/AdminSignup";
import ChangePassword from "../pages/Admin/Auth/ChangePassword";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import RootRedirect from "./RootRedirect";
import MyLeads from '@/pages/User/MyLeads';

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="relative flex items-center justify-center">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-blue-500 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-xl"></div>
      <div className="absolute animate-pulse rounded-full h-12 w-12 bg-white border-2 border-blue-300 shadow-inner"></div>
      <div className="absolute animate-ping h-32 w-32 rounded-full bg-blue-200 opacity-25"></div>
    </div>
  </div>
);

// User route - only checks WordPress auth
const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, redirectToWordPress } = useAuth();
  
  // Check for auth params in URL
  const hasAuthParams = new URLSearchParams(window.location.search).has('uid');

  // If this is an admin route, don't check WordPress auth
  if (window.location.pathname.startsWith('/admin')) {
    return children;
  }

  // If we have auth params, show loading and let auth complete
  if (hasAuthParams) {
    return <LoadingSpinner />;
  }

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to WordPress login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Admin route - only checks admin JWT auth
const AdminRoute = ({ children }) => {
  const { admin, loading, isAuthenticated } = useAdminAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Auth route - only for WordPress user authentication
const AuthRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Check for auth params in URL
  const hasAuthParams = new URLSearchParams(window.location.search).has('uid');

  // If we have auth params, let the auth process complete
  if (hasAuthParams) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is already authenticated with WordPress, redirect to home
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public route - accessible to everyone, but may show different content for authenticated users
const PublicRoute = ({ children }) => {
  return children;
};

// Unauthorized page component
const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-6">You don't have permission to access this resource.</p>
      <div className="space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-bg-brand text-white rounded hover:bg-opacity-20"
        >
          Go Back
        </button>
        <Navigate to="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-opacity-20">
          Home
        </Navigate>
      </div>
    </div>
  </div>
);

export const routes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthRoute>
            <Signup />
          </AuthRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    children: [
      // Admin auth routes - no protection needed
      {
        path: "login",
        element: <AdminLogin />
      },
      {
        path: "signup",
        element: <AdminSignup />
      },
      {
        path: "change-password",
        element: (
          // <AdminRoute>
            <ChangePassword />
          // </AdminRoute>
        ),
      },
      // Protected admin routes
      {
        path: "",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminLeads />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "customers/:customerId",
            element: <Customers />,
          },
        ],
      }
    ],
  },
  {
    path: "/",
    element: (<ProtectedRoute>
      <UserLayout />,
          </ProtectedRoute>),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <FindLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-leads",
        element: (
          <ProtectedRoute>
            <MyLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          // <ProtectedRoute>
            <div>Profile Page - Protected Route</div>
          // </ProtectedRoute>
        ),
      },
      // Add more protected user routes here
      // {
      //   path: "purchase-history",
      //   element: (
      //     <ProtectedRoute>
      //       <PurchaseHistory />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
];