import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const UserLayout = () => {
	return (
		<div className="min-h-screen bg-[#F9FAFB]">
			<div className="fixed top-0 left-0 right-0 z-50">
				<Navbar showNavigation={true} />
			</div>
			<main className="pt-14">
				<Outlet />
			</main>
		</div>
	);
};

export default UserLayout;