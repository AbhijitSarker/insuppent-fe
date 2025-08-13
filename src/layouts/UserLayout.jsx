import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const userRoutes = [
	{
		label: 'My Leads',
		icon: 'people',
		href: '/my-leads',
	},
	{
		label: 'All Leads',
		icon: 'analytics',
		href: '/',
	},
];

const UserLayout = () => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	return (
		<div className="min-h-screen flex">
			<Sidebar
				className="fixed left-0 top-0 z-50 h-full transition-all duration-300"
				isCollapsed={isSidebarCollapsed}
				routes={userRoutes}
			/>
			<div className="flex-1 lg:pl-56 pl-14">
				<Navbar onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
				<main className="min-h-[calc(100vh-3.5rem)] bg-[#F9FAFB]">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default UserLayout;