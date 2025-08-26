import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '@/components/layout/UserNavbar';

const UserLayout = () => {
	return (
		<div className="min-h-screen bg-[#F9FAFB]">
			{/* Fixed Navbar */}
			<div className="fixed top-0 left-0 right-0 z-50">
				<UserNavbar />
			</div>

			{/* Main content with offset for fixed header */}
			<main className="pt-16 md:pt-14 ">
				<div className="h-[calc(100vh-3.5rem)] overflow-y-auto mx-auto container">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default UserLayout;
