import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import AdminNavbar from '@/components/layout/AdminNavbar';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar is always visible on desktop, drawer on mobile
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block fixed left-0 top-14 bottom-0 z-40 w-56">
        <Sidebar 
          className="h-[calc(100vh-3.5rem)] overflow-y-auto"
          routes={adminRoutes}
        />
      </div>

      {/* Sidebar Drawer for mobile (slide in/out) */}
      <div className={
        `fixed inset-0 z-50 md:hidden pointer-events-none transition-all duration-300 ${sidebarOpen ? 'pointer-events-auto' : ''}`
      }>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 max-w-full bg-white shadow-lg border-r border-borderColor-primary transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <Sidebar
            className="h-full"
            routes={adminRoutes}
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main content with offsets for fixed header and sidebar */}
      <main className="pt-14 md:pl-56">
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;