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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';


// User route - only checks WordPress auth
const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // If this is an admin route, don't check WordPress auth
  if (window.location.pathname.startsWith('/admin')) {
    return children;
  }

  // Show loading state (including during WP redirect)
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

export const routes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
            <Login />
        ),
      },
      {
        path: "signup",
        element: (
            <Signup />
        ),
      },
    ],
  },
  {
    path: "admin",
    children: [
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
            <ChangePassword />
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
    ],
  },
];