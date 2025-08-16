import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <RadixCheckbox.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0 rounded-[4px] border border-borderColor-primary bg-white shadow-sm hover:border-primary flex items-center justify-center",
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