import { Navigate, createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminLeads from "../pages/Admin/AdminLeads";
import Settings from "../pages/Admin/Settings";
import Customers from "../pages/Admin/Customers";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import { useAuth } from "@/contexts/AuthContext";
import Home from "@/components/pages/Home";
import RootRedirect from "./RootRedirect";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
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
  // {
  //   path: "/",
  //   element: (
  //     <UserLayout />
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: (

  //         <AllLeads />

  //       ),
  //     },
  //     {
  //       path: "my-leads",
  //       element: (
  //         <Home />
  //       ),
  //     },
  //   ],
  // },
]);