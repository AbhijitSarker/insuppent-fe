import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <RadixCheckbox.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0 rounded-[4px] border border-gray-300 bg-white shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white hover:border-primary flex items-center justify-center transition-all",
      className
    )}
    {...props}
  >
    <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
      <CheckIcon className="h-3.5 w-3.5 font-bold" strokeWidth={3} />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };