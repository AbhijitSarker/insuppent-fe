import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import MaterialIcon from "./MaterialIcon";


const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium gap-1 font-['Inter'] leading-[16px] tracking-[0%] text-center",
  {
    variants: {
      variant: {
        auto: "bg-[#FAF5FF] text-[#7E22CE]",
        // home: "bg-lime-50 text-lime-700",
        // mortgage: "bg-green-50 text-green-700",
        home: "bg-[#FEFCE8] text-[#A16207]",
        mortgage: "bg-[#FDF2F8] text-[#BE185D]",
      },
    },
    defaultVariants: {
      variant: "auto",
    },
  }
);

const iconMap = {
  'home': 'home',
  'mortgage': 'business',
  'auto': 'directions_car'
};

function Badge({ className, variant, icon, children, ...props }) {
  const iconName = typeof icon === 'string' ? iconMap[icon] : null;
  
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {iconName && <MaterialIcon icon={iconName} size={12} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };