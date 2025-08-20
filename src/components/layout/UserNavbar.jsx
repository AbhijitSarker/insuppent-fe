import { ThemeToggle } from "@/components/ThemeToggle";
import MaterialIcon from "@/components/ui/MaterialIcon";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
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

    return (
        <div className="w-full h-16 flex  items-center justify-between border-b border-borderColor-primary bg-white px-4 lg:px-6">

            <div className="w-full h-16 flex  items-center justify-between border-b border-borderColor-primary bg-white px-4 lg:px-6 container mx-auto">
                {/* Left: Logo and nav links */}
                <div className="flex items-center gap-8  -ml-10">
                    <Link to="/" className="flex items-center gap-x-2">
                        <div className="h-12">
                            <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
                        </div>
                    </Link>
                    {/* Separator */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    <div className="flex h-[46px] gap-2 mb-0">
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
};

export default UserNavbar;
