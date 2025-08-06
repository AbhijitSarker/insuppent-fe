import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocation, Link } from "react-router-dom";
import { FaChartPie, FaUserFriends, FaCog } from "react-icons/fa";

const defaultRoutes = [
	{
		label: "My Leads",
		icon: FaUserFriends,
		href: "/",
		active: false,
	},
	{
		label: "All Leads",
		icon: FaChartPie,
		href: "/admin",
		active: false,
	},
	{
		label: "Settings",
		icon: FaCog,
		href: "/admin/settings",
		active: false,
	},
];

const Sidebar = ({ className, isCollapsed, routes = defaultRoutes }) => {
	const location = useLocation();

	const navigationRoutes = routes.map((route) => ({
		...route,
		active: location.pathname === route.href,
	}));

	return (
		<div
			className={cn(
				"flex h-full lg:w-56 w-14 flex-col bg-white shadow-sm",
				className
			)}
		>
			<div className="flex h-14 items-center justify-center border-b px-2">
				<Link to="/admin" className="flex items-center gap-x-2">
					<img src="/logo.svg" alt="Logo" className="h-8 w-8" />
					{!isCollapsed && (
						<span className="font-bold text-xl hidden lg:block">
							Insuppent
						</span>
					)}
				</Link>
			</div>
			<div className="flex flex-col gap-2 p-2">
				{navigationRoutes.map((route) => (
					<Link key={route.href} to={route.href}>
						<Button
							variant={route.active ? "default" : "ghost"}
							className={cn(
								"w-full justify-start gap-2",
								route.active &&
									"bg-blue-600 text-white hover:bg-blue-700",
								!route.active && "text-gray-600 hover:text-gray-900"
							)}
						>
							<route.icon size={20} />
							<span className="hidden lg:block">{route.label}</span>
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Sidebar;