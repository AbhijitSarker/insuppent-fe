import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaBars, FaBell, FaChevronDown } from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="flex h-14 items-center border-b bg-white px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-2"
        onClick={onMenuClick}
      >
        <FaBars className="h-5 w-5" />
      </Button>
      
      <div className="ml-auto flex items-center gap-4">
        {/* <Button variant="ghost" size="icon" className="relative">
          <FaBell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button> */}
        {/* <ThemeToggle /> */}
        <Button variant="ghost" className="gap-2">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar"
            className="h-6 w-6 rounded-full"
          />
          <span className="hidden lg:block">John Doe</span>
          <FaChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;