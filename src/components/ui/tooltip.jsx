import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TooltipPrimitive.Root delayDuration={100} {...props} ref={ref} />
  )
)
Tooltip.displayName = TooltipPrimitive.Root.displayName

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 8, ...props }, ref) => (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align="end"
        className={cn(
          // Custom styles for prominent, modern tooltip
          "z-50 overflow-visible rounded-lg bg-[#1C1917] px-4 py-2 text-sm text-white shadow-3xl animate-in fade-in-0 zoom-in-95 border-none text-left",
          "font-normal leading-snug",
          className
        )}
        {...props}
      />
    )
  )
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
