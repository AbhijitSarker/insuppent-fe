import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 min-w-[56px] h-[24px] px-2 py-[6px] box-border rounded-lg text-xs font-semibold transition-colors",
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
    <div className={cn(badgeVariants({ variant }), "text-center font-['Inter','sans-serif'] text-[12px] font-medium leading-4", className)}>
      {Icon && (typeof Icon === 'string' ? (
        <span className="material-icons-outlined text-[14px] align-middle" style={{ lineHeight: '1' }}>{Icon}</span>
      ) : (
        <Icon className="h-3 w-3 shrink-0 align-middle" />
      ))}
      <span className="ml-1 align-middle">{props.children}</span>
    </div>
  )
}

export { Badge, badgeVariants }