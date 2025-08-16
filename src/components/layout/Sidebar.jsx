import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocation, Link } from "react-router-dom";
import MaterialIcon from "../ui/MaterialIcon";

const Sidebar = ({ className, routes }) => {
	const location = useLocation();

	const navigationRoutes = routes.map((route) => ({
		...route,
		active: location.pathname === route.href,
	}));

	return (
		<div
			className={cn(
				"flex h-full w-56 flex-col bg-white border-r border-gray-200",
				className
			)}
		>
			{/* Navigation items */}
			<div className="flex flex-col gap-1 pl-0 p-4">
				{navigationRoutes.map((route) => (
					<Link key={route.href} to={route.href}>
						<Button
							variant="ghost"
							className="w-full justify-start gap-3 h-12 px-4 pr-0 rounded-lg transition-all duration-200 relative hover:bg-transparent">
							{route.active && (
								<div className="absolute left-0 h-[32px] w-[6px] bg-blue-600 rounded-r-lg"></div>
							)}
							<div 
								className={cn(
									"text-black p-2 w-full h-10 rounded-lg flex items-center gap-3 text-sm font-medium leading-6",
									route.active
										? "bg-[#E7E5E4]"
										: "hover:bg-[#E7E5E4]"
								)}
							>

							<MaterialIcon 
								icon={route.icon} 
								size={20} 
									className="people text-black"/>
							<span className="font-medium text-black">{route.label}</span>
								</div>
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Sidebar;