import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex h-14 items-center border-b bg-white px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-2"
        onClick={onMenuClick}
      >
        <MaterialIcon icon="menu" size={20} />
      </Button>
      
      <div className="ml-auto flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden lg:block">{user.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;