import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const adminRoutes = [
  {
    label: "All Leads",
    icon: "people",
    href: "/admin",
  },
  {
    label: "Settings",
    icon: "settings",
    href: "/admin/settings",
  }
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar showNavigation={false} showAdminButton={true} />
      </div>

      {/* Fixed Sidebar below navbar */}
      <div className="fixed left-0 top-14 bottom-0 z-40 w-56">
        <Sidebar 
          className="h-[calc(100vh-3.5rem)] overflow-y-auto"
          routes={adminRoutes}
        />
      </div>

      {/* Main content with offsets for fixed header and sidebar */}
      <main className="pt-14 pl-56">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;