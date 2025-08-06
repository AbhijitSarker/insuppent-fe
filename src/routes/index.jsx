import { Navigate, createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import MyLeads from "../pages/User/MyLeads";
import AllLeads from "../pages/User/AllLeads";
import AdminLayout from "../layouts/AdminLayout";
import AdminLeads from "../pages/Admin/AdminLeads";
import Settings from "../pages/Admin/Settings";
import Home from "@/components/pages/Home";
import RootRedirect from "./RootRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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