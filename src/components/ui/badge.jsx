import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MdDirectionsCar } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { IoMdBusiness } from "react-icons/io";


const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium gap-1 font-['Inter'] leading-[16px] tracking-[0%] text-center",
  {
    variants: {
      variant: {
        auto: "bg-[#FAF5FF] text-[#A21CAF]",
        home: "bg-[#F7FEE7] text-[#4D7C0F]",
        mortgage: "bg-[#F0FDF4] text-[#0F766E]",
      },
    },
    defaultVariants: {
      variant: "auto",
    },
  }
);

const iconMap = {
  'home': TiHome,
  'mortgage': IoMdBusiness,
  'auto': MdDirectionsCar
,
};

function Badge({ className, variant, icon, children, ...props }) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : null;
  
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {IconComponent && <IconComponent size={12} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };