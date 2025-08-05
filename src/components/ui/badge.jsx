import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        auto: "bg-[#F4F1FF] text-[#6941C6]",
        business: "bg-[#EFF8FF] text-[#175CD3]",
        commercial: "bg-[#ECFDF3] text-[#027A48]",
        home: "bg-[#FDF4FF] text-[#C11574]",
        lifestyle: "bg-[#FFF6ED] text-[#B93815]",
        default: "bg-gray-100 text-gray-900",
        public: "bg-emerald-50 text-emerald-700",
        private: "bg-gray-100 text-gray-700",
        purple: "bg-[#FAF5FF] text-[#A21CAF]",
        lime: "bg-[#F7FEE7] text-[#4D7C0F]",
        green: "bg-[#F0FDF4] text-[#0F766E]"
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  icon: Icon,
  ...props
}) {
  return (
    <div className={cn(badgeVariants({ variant }), className)}>
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{props.children}</span>
    </div>
  )
}

export { Badge, badgeVariants }