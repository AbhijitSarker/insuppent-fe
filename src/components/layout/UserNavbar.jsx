import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const UserNavbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const navigationLinks = [
        { label: "Find Leads", href: "/" },
        { label: "My Leads", href: "/my-leads" }
    ];

    // Responsive: detect mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const desktopNavbar = (
        <div className="w-full h-16 flex  items-center justify-between border-b border-borderColor-primary bg-white px-4 lg:px-6 shadow-sm">

            <div className="w-full h-16 flex  items-center justify-between border-b border-borderColor-primary bg-white px-4 lg:px-6 container mx-auto">
                {/* Left: Logo and nav links */}
                <div className="flex items-center gap-8  -ml-10">
                    <Link to="/" className="flex items-center gap-x-2">
                        <div className="h-12">
                            <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
                        </div>
                    </Link>
                    {/* Separator */}
                    <div className="w-px h-6 bg-gray-300 flex"></div>
                    <div className="h-[46px] gap-2 mb-0 flex">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={
                                    [
                                        "relative flex h-[46px] items-center px-2 py-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
                                        location.pathname === link.href
                                            ? "text-content-brand"
                                            : "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
                                    ].join(' ')
                                }
                                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
                            >
                                {link.label}
                                {location.pathname === link.href && (
                                    <span
                                        className={
                                            "absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand"
                                        }
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
                {/* Right: User profile */}
                <div className="flex items-center gap-4  -mr-10">
                    {user && (
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium focus:outline-none">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-semibold">{user.name || 'User'}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-content-red cursor-pointer">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const mobileNavbar = (
        <div className="w-full border-b border-borderColor-primary bg-white shadow-sm">
            {/* Top row: logo and avatar */}
            <div className="flex items-center justify-between px-4 py-3 lg:px-6 container mx-auto">
                <Link to="/" className="flex items-center gap-x-2">
                    <div className="h-12">
                        <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium focus:outline-none">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-semibold">{user.name || 'User'}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-content-red cursor-pointer">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center gap-8 border-b border-gray-100 bg-white px-2 lg:px-0">
                {navigationLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={[
                            "relative flex items-center px-6 py-4 text-base font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
                            location.pathname === link.href
                                ? "text-blue-600"
                                : "text-black hover:border-b-2 hover:border-blue-600"
                        ].join(' ')}
                        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
                    >
                        {link.label}
                        {location.pathname === link.href && (
                            <span
                                className="absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-blue-600"
                            />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );

    return isMobile ? mobileNavbar : desktopNavbar

};

export default UserNavbar;
