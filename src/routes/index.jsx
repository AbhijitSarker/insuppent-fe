import FindLeads from '@/pages/User/FindLeads';
import { Navigate, createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLeads from "../pages/Admin/AdminLeads";
import Settings from "../pages/Admin/Settings";
import Customers from "../pages/Admin/Customers";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import { useAuth } from "@/contexts/AuthContext";
import RootRedirect from "./RootRedirect";
import MyLeads from '@/pages/User/MyLeads';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-blue-500 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-xl"></div>
        <div className="absolute animate-pulse rounded-full h-12 w-12 bg-white border-2 border-blue-300 shadow-inner"></div>
        <div className="absolute animate-ping h-32 w-32 rounded-full bg-blue-200 opacity-25"></div>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/admin" />;
  }
      

  return children;
};

export const router = createBrowserRouter([
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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
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
  },
  {
    path: "/",
    element: (
      <UserLayout />
    ),
    children: [
      {
        index: true,
        element: (

          <FindLeads />
        ),
      },
      {
        path: "my-leads",
        element: (
          <MyLeads />
        ),
      },
      // {
      //   path: "purchase-history",
      //   element: (
      //     <ProtectedRoute>
      //       {React.createElement(require('@/pages/User/PurchaseHistory.jsx').default)}
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);