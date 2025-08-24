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
			<main className="pt-14">
				<div className="h-[calc(100vh-3.5rem)] overflow-y-auto mx-auto container">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default UserLayout;

// // layouts/UserLayout.jsx
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useState } from 'react';

// const UserLayout = () => {
// 	const { user, isAuthenticated, logout, getUserDisplayName } = useAuth();
// 	const navigate = useNavigate();
// 	const [isMenuOpen, setIsMenuOpen] = useState(false);

// 	const handleLogout = async () => {
// 		try {
// 			await logout();
// 		} catch (error) {
// 			console.error('Logout error:', error);
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen bg-gray-50">
// 			{/* Navigation */}
// 			<nav className="bg-white shadow-lg">
// 				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// 					<div className="flex justify-between h-16">
// 						<div className="flex items-center">
// 							<Link to="/" className="flex-shrink-0 flex items-center">
// 								<h1 className="text-xl font-bold text-gray-900">Lead Finder</h1>
// 							</Link>
// 						</div>

// 						{/* Desktop Navigation */}
// 						<div className="hidden md:flex items-center space-x-4">
// 							<Link
// 								to="/"
// 								className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
// 							>
// 								Find Leads
// 							</Link>

// 							{isAuthenticated && (
// 								<>
// 									<Link
// 										to="/my-leads"
// 										className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
// 									>
// 										My Leads
// 									</Link>
// 									<Link
// 										to="/profile"
// 										className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
// 									>
// 										Profile
// 									</Link>
// 								</>
// 							)}

// 							{isAuthenticated ? (
// 								<div className="flex items-center space-x-4">
// 									<span className="text-sm text-gray-600">
// 										Welcome, {getUserDisplayName()}
// 									</span>
// 									{user?.roles?.includes('admin') && (
// 										<Link
// 											to="/admin"
// 											className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
// 										>
// 											Admin Panel
// 										</Link>
// 									)}
// 									<button
// 										onClick={handleLogout}
// 										className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
// 									>
// 										Logout
// 									</button>
// 								</div>
// 							) : (
// 								<div className="flex items-center space-x-2">
// 									<Link
// 										to="/auth/login"
// 										className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
// 									>
// 										Login
// 									</Link>
// 									<Link
// 										to="/auth/signup"
// 										className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
// 									>
// 										Sign Up
// 									</Link>
// 								</div>
// 							)}
// 						</div>

// 						{/* Mobile menu button */}
// 						<div className="md:hidden flex items-center">
// 							<button
// 								onClick={() => setIsMenuOpen(!isMenuOpen)}
// 								className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
// 							>
// 								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// 									{isMenuOpen ? (
// 										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// 									) : (
// 										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// 									)}
// 								</svg>
// 							</button>
// 						</div>
// 					</div>

// 					{/* Mobile Navigation Menu */}
// 					{isMenuOpen && (
// 						<div className="md:hidden">
// 							<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
// 								<Link
// 									to="/"
// 									className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
// 									onClick={() => setIsMenuOpen(false)}
// 								>
// 									Find Leads
// 								</Link>

// 								{isAuthenticated && (
// 									<>
// 										<Link
// 											to="/my-leads"
// 											className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
// 											onClick={() => setIsMenuOpen(false)}
// 										>
// 											My Leads
// 										</Link>
// 										<Link
// 											to="/profile"
// 											className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
// 											onClick={() => setIsMenuOpen(false)}
// 										>
// 											Profile
// 										</Link>
// 									</>
// 								)}

// 								{isAuthenticated ? (
// 									<div className="space-y-2 pt-2 border-t border-gray-200">
// 										<div className="px-3 py-2 text-sm text-gray-600">
// 											Welcome, {getUserDisplayName()}
// 										</div>
// 										{user?.roles?.includes('admin') && (
// 											<Link
// 												to="/admin"
// 												className="block px-3 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
// 												onClick={() => setIsMenuOpen(false)}
// 											>
// 												Admin Panel
// 											</Link>
// 										)}
// 										<button
// 											onClick={() => {
// 												handleLogout();
// 												setIsMenuOpen(false);
// 											}}
// 											className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
// 										>
// 											Logout
// 										</button>
// 									</div>
// 								) : (
// 									<div className="space-y-2 pt-2 border-t border-gray-200">
// 										<Link
// 											to="/auth/login"
// 											className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
// 											onClick={() => setIsMenuOpen(false)}
// 										>
// 											Login
// 										</Link>
// 										<Link
// 											to="/auth/signup"
// 											className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
// 											onClick={() => setIsMenuOpen(false)}
// 										>
// 											Sign Up
// 										</Link>
// 									</div>
// 								)}
// 							</div>
// 						</div>
// 					)}
// 				</div>
// 			</nav>

// 			{/* Main Content */}
// 			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
// 				<Outlet />
// 			</main>

// 			{/* Footer */}
// 			<footer className="bg-white border-t border-gray-200 mt-12">
// 				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
// 					<div className="text-center text-sm text-gray-500">
// 						© 2024 Lead Finder. All rights reserved.
// 					</div>
// 				</div>
// 			</footer>
// 		</div>
// 	);
// };

// export default UserLayout;