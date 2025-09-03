import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { MaterialCheckbox } from "./Table";
import { Input } from "./input";
import MaterialIcon from "./MaterialIcon";

const Select = React.forwardRef(({ className, children, icon, label, value, isMulti = false, onValueChange, hasSearch = false, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const selectRef = React.useRef(null);
  const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value;

  const selectedLabels = React.Children.toArray(children)
    .filter(child => 
      isMulti 
        ? selectedValues.includes(child.props.value)
        : child.props.value === selectedValues
    )
    .map(child => child.props.children)
    .join(", ");

  // Show label and count for multi-select when items are selected
  const displayLabel = isMulti && selectedValues.length > 0 
    ? `${label}: ${selectedValues.length} selected`
    : selectedLabels || label;

  const handleItemClick = (newValue) => {
    if (!isMulti) {
      onValueChange?.(newValue);
      setIsOpen(false);
      setSearchQuery("");
      return;
    }

    // For multi-select, immediately update the value
    const updatedValues = selectedValues.includes(newValue)
      ? selectedValues.filter(v => v !== newValue)
      : [...selectedValues, newValue];

    if (newValue === "__ALL__") {
      onValueChange?.([]);
      setSearchQuery("");
      return;
    }

    onValueChange?.(updatedValues);
  };

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter children based on search query
  const filteredChildren = React.Children.toArray(children).filter(child => {
    if (!searchQuery || child.props.value === "__ALL__") return true;
    return child.props.children.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative !rounded-[8px]" ref={selectRef}>
      <button
        type="button"
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 min-h-[36px] w-full items-center justify-between gap-2 rounded-lg whitespace-nowrap px-3 py-2 text-[14px] leading-[20px] font-semibold text-content-primary bg-[#0000000F] transition-colors hover:bg-[#0000001A] focus:outline-none focus:bg-[#0000001A]",
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <MaterialIcon icon={icon} size={16} className="text-content-primary shrink-0" />}
          <span className="truncate font-semibold text-[14px] leading-[20px]">{displayLabel}</span>
        </div>
        <MaterialIcon icon="keyboard_arrow_down" size={16} className="text-content-primary" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 min-w-[240px] overflow-hidden rounded-[8px] border border-borderColor-primary bg-white shadow-lg">
          {hasSearch && (
            <div className="p-2 relative">
              <MaterialIcon
                icon="search"
                size={20}
                className="absolute left-3 ml-1 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
              />
              <Input
                type="text"
                placeholder="Search states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 bg-transparent pr-3 py-2 bg-white border border-borderColor-primary rounded-lg text-sm text-content-primary focus:ring-1 focus:ring-gray-300 focus:border-gray-300 placeholder:text-content-tertiary font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[0%]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="p-1.5 max-h-[300px] overflow-y-auto">
            {filteredChildren.map(child => {
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
            {filteredChildren.length === 0 && (
              <div className="px-3 py-2 text-sm text-content-secondary">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
Select.displayName = "Select";

const SelectItem = React.forwardRef(({ className, children, icon, isSelected, onSelect, isMulti, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-base outline-none hover:bg-bg-tertiary transition-colors",
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
          <MaterialCheckbox
            checked={isSelected}
            onChange={onSelect}
            className="rounded-[4px] border-borderColor-primary"
          />
        </div>
        {icon && <MaterialIcon icon={icon} size={16} className="text-content-secondary shrink-0" />}
        <span className="truncate text-content-primary leading-5">{children}</span>
      </div>
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectItem };