import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const adminRoutes = [
  {
    label: "All Leads",
    icon: "analytics",
    href: "/admin",
  },
  {
    label: "Settings",
    icon: "settings",
    href: "/admin/settings",
  }
];

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        className="fixed left-0 top-0 z-50 h-full transition-all duration-300"
        isCollapsed={isSidebarCollapsed}
        routes={adminRoutes}
      />
      <div className="flex-1 lg:pl-56 pl-14">
        <Navbar onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="min-h-[calc(100vh-3.5rem)] bg-[#FAFAF9]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;