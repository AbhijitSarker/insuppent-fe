import { Navigate, createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import MyLeads from "../pages/User/MyLeads";
import AllLeads from "../pages/User/AllLeads";
import AdminLayout from "../layouts/AdminLayout";
import AdminLeads from "../pages/Admin/AdminLeads";
import Settings from "../pages/Admin/Settings";

const RootRedirect = () => {
  // const isAuthenticated = localStorage.getItem('userToken');

  // Redirect to the dashboard if the user is authenticated, otherwise redirect to the login
  // return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />;

  //TODO: Remove this temporary redirect
  return <Navigate to="/" />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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

          <AllLeads />

        ),
      },
      {
        path: "my-leads",
        element: (
          <MyLeads />
        ),
      },
    ],
  },
  {
    path: "admin",
    element: (

      <AdminLayout />
    ),
    children: [
      {
        index: true,
        element: (
          <AdminLeads />
        ),
      },
      {
        path: "settings",
        element: (
          <Settings />
        ),
      },
    ],
  }
],
);