import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-[rgb(var(--input-border))] bg-[rgb(var(--input-bg))] px-3 py-2 text-sm transition-colors placeholder:text-[rgb(var(--input-placeholder))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgb(var(--input-ring))] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
