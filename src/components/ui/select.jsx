import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

const Select = React.forwardRef(({ className, children, icon: Icon, label, value, isMulti = false, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value;

  const selectedLabels = React.Children.toArray(children)
    .filter(child => 
      isMulti 
        ? selectedValues.includes(child.props.value)
        : child.props.value === selectedValues
    )
    .map(child => child.props.children)
    .join(", ");

  const displayLabel = selectedLabels || label;

  const handleItemClick = (newValue) => {
    if (!isMulti) {
      onValueChange?.(newValue);
      setIsOpen(false);
      return;
    }

    // For multi-select, immediately update the value
    const updatedValues = selectedValues.includes(newValue)
      ? selectedValues.filter(v => v !== newValue)
      : [...selectedValues, newValue];

    if (newValue === "__ALL__") {
      onValueChange?.([]);
      return;
    }

    onValueChange?.(updatedValues);
  };

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.select-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative select-container">
      <button
        type="button"
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 whitespace-nowrap rounded-2xl border border-gray-200 bg-gray-50/80 px-4 text-base text-gray-700 shadow-sm transition-colors hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="h-5 w-5 text-gray-500 shrink-0" />}
          <span className="truncate font-medium">{displayLabel}</span>
        </div>
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="p-1.5 max-h-[300px] overflow-y-auto">
            {React.Children.map(children, child => {
              if (!React.isValidElement(child)) return null;

              const isSelected = isMulti
                ? selectedValues.includes(child.props.value)
                : child.props.value === selectedValues;

              return React.cloneElement(child, {
                isSelected,
                onSelect: () => handleItemClick(child.props.value),
                isMulti
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
});
Select.displayName = "Select";

const SelectItem = React.forwardRef(({ className, children, icon: Icon, isSelected, onSelect, isMulti, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-base outline-none hover:bg-gray-50 transition-colors",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">
          <Checkbox 
            checked={isSelected}
            className="rounded-[4px] border-gray-300"
          />
        </div>
        {Icon && <Icon className="h-5 w-5 text-gray-500 shrink-0" />}
        <span className="truncate text-gray-700">{children}</span>
      </div>
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectItem };