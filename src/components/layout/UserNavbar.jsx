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
import MaterialIcon from "@/components/ui/MaterialIcon";
import moreInfoIcon from "@/assets/more-info-icon.svg";

const UserNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const navigationLinks = [
    { label: "Find Leads", href: "/" },
    { label: "My Leads", href: "/my-leads" },
  ];

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const desktopNavbar = (
    <div className="w-full h-16 border-b border-borderColor-primary bg-white shadow-sm">
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo and nav links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-x-2">
            <div className="h-12">
              <img
                src="/Insuplex360.svg"
                alt="Logo"
                className="h-full w-full"
              />
            </div>
          </Link>
          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 flex"></div>
          <div className="h-[46px] gap-2 mb-0 flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={[
                  "relative flex h-[46px] items-center px-2 py-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
                  location.pathname === link.href
                    ? "text-content-brand"
                    : "text-content-primary hover:border-b-2 hover:border-borderColor-primary",
                ].join(" ")}
                style={{ fontFamily: "Inter, sans-serif", letterSpacing: 0 }}
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
        <div className="flex items-center gap-4">
          <a
            href="https://insuplex360.academy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity"
            title="Insuplex360 Academy"
          >
            <img src={moreInfoIcon} alt="Info" className="w-full h-full" />
          </a>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300"></div>
          
          {user && (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-bg-brand flex items-center justify-center text-white text-sm font-medium focus:outline-none">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border border-gray-200">
                  <DropdownMenuLabel className="font-semibold">
                    {user.name || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-content-red cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
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
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-x-2">
            <div className="h-12">
              <img src="/Insuplex360.svg" alt="Logo" className="h-full w-full" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <a
                  href="https://insuplex360.academy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity mr-2"
                  title="Insuplex360 Academy"
                >
                  <img src={moreInfoIcon} alt="Info" className="w-full h-full" />
                </a>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium focus:outline-none">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border border-gray-200">
                    <DropdownMenuLabel className="font-semibold">
                      {user.name || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-content-red cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-4 sm:gap-8 border-t border-gray-100 bg-white px-2 lg:px-0">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={[
              "relative flex items-center px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 border-transparent leading-[20px] transition-colors whitespace-nowrap",
              location.pathname === link.href
                ? "text-content-brand"
                : "text-black hover:border-b-2 hover:border-content-brand",
            ].join(" ")}
            style={{ fontFamily: "Inter, sans-serif", letterSpacing: 0 }}
          >
            {link.label}
            {location.pathname === link.href && (
              <span className="absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  return isMobile ? mobileNavbar : desktopNavbar;
};

export default UserNavbar;
