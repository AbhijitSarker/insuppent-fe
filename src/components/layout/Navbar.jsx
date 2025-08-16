import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = ({ onMenuClick, showNavigation = false, showAdminButton = false }) => {
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
    <div className="w-full h-14 flex items-center justify-between border-b bg-white px-4 lg:px-6">
      {/* Left side - Logo and menu button */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-x-2">
        <div className="h-10"> 
          <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
        </div>
        </Link>

        {/* Admin button (only for admin layout) */}
        {showAdminButton && (
          <>
            <div className="w-px h-6 bg-bg-tertiary border"></div>
            <Button className="text-sm text-content-primary font-semibold bg-bg-tertiary h-[26px] shadow-none">
              Admin
            </Button>
          </>
        )}
      </div>

      {/* Center - Navigation links (only for user layout) */}
      {showNavigation && (
        <div className="hidden lg:flex items-center gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-content-brand border-b-2 border-blue-600 pb-1"
                  : "text-content-primary hover:text-content-brand"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Right side - Help link, user profile, and Admin button */}
      <div className="flex items-center gap-4">
        {/* Need help link */}
        <Link 
          to="/help" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-content-primary underline"
        >
          <MaterialIcon icon="help" size={16} />
          <span className="hidden sm:block">Need help?</span>
        </Link>
        
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300"></div>
        
        {/* User profile */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {/* <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button> */}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default Navbar;