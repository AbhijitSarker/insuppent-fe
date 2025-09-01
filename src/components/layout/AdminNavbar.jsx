import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="w-full h-14 flex items-center justify-between border-b border-borderColor-primary bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden mr-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <MaterialIcon icon="menu" size={24} />
        </button>
        <div className="h-12">
          <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
        </div>
        <div className="w-px h-6 bg-bg-tertiary border"></div>
        <Button className="text-sm text-content-primary font-semibold bg-bg-tertiary h-[26px] shadow-none hover:bg-bg-tertiary">
          Admin
        </Button>
      </div>
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
  );
};

export default AdminNavbar;
