import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import MaterialIcon from "./MaterialIcon";
import { Select, SelectItem } from "./select";
import { Input } from "./input";
import Papa from "papaparse";
import { useDebounce } from "@/hooks/useDebounce";
import TableCell from "./TableCell";
// import TableCell from "@/components/ui/TableCell";

/**
 * TableColumn: { key: string, header: string|ReactNode, render?: (row) => ReactNode, sortable?: boolean, filterable?: boolean }
 * TableProps: {
 *   columns: TableColumn[],
 *   data: any[],
 *   loading?: boolean,
 *   page?: number,
 *   pageSize?: number,
 *   total?: number,
 *   onPageChange?: (page) => void,
 *   onSortChange?: (sortKey, direction) => void,
 *   onFilterChange?: (filters) => void,
 *   onSearch?: (search) => void,
 *   sort?: { key: string, direction: 'asc'|'desc' },
 *   filters?: Record<string, any>,
 *   search?: string,
 *   className?: string,
 *   rowSelection?: boolean,
 *   selectedRows?: any[],
 *   onRowSelect?: (row, checked) => void,
 *   onSelectAll?: (checked) => void,
 *   columnVisibility?: boolean,
 *   visibleColumns?: string[],
 *   onVisibleColumnsChange?: (visibleColumns) => void,
 *   columnFilterTypes?: Record<string, 'text'|'select'>,
 *   columnFilterOptions?: Record<string, string[]>,
 * }
 */

// Custom Material Icon Checkbox Component
export const MaterialCheckbox = ({ checked, onChange, className }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center transition-all duration-200 cursor-pointer",
        checked && "bg-blue-600 border-blue-600",
        !checked && "bg-white hover:border-gray-400",
        className
      )}
    >
      {checked && (
        <MaterialIcon
          icon="check"
          size={12}
          className="text-white"
        />
      )}
    </button>
  );
};

export function Table({
  columns,
  data,
  loading = false,
  page = 1,
  pageSize = 15,
  total = 0,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSearch,
  sort,
  search = "",
  className,
  rowSelection = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  filters = [],
  footerContent = null,
  paginationDelta = 2,
  searchFilterVisibility = true,
  cardComponent: CardComponent,
  isMobile = false,
}) {
  const [internalSearch, setInternalSearch] = React.useState(search);
  const [pageSizeInput, setPageSizeInput] = React.useState(pageSize.toString());
  const debouncedSearch = useDebounce(internalSearch, 500);

  // Calculate if all rows are selected
  const allSelected = data.length > 0 && selectedRows.length === data.length &&
    data.every(row => selectedRows.some(selected => selected.id === row.id));

  // Reset internal search when external search prop changes
  React.useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  // Reset page size input when pageSize prop changes
  React.useEffect(() => {
    setPageSizeInput(pageSize.toString());
  }, [pageSize]);

  // Notify parent of debounced search changes
  React.useEffect(() => {
    if (onSearch && debouncedSearch !== search) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setInternalSearch(value);
  };

  const handleSort = (col) => {
    if (!col.sortable || loading) return;
    let direction = "asc";
    if (sort?.key === col.key && sort.direction === "asc") direction = "desc";
    if (onSortChange) onSortChange(col.key, direction);
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(total / pageSize);
    if (newPage < 1 || newPage > totalPages || loading) return;
    if (onPageChange) onPageChange(newPage);
  };

  const handleFilterChange = (filter, value) => {
    filter.onChange(value);
  };

  const handlePageSizeInputChange = (e) => {
    const value = e.target.value;
    setPageSizeInput(value);
  };

  const handlePageSizeInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const newPageSize = parseInt(pageSizeInput);
      if (newPageSize && newPageSize >= 1 && newPageSize <= 100) {
        // Reset to first page when changing page size
        if (onPageChange) onPageChange(1);
        // Call the onPageSizeChange prop to update page size
        if (onPageSizeChange) onPageSizeChange(newPageSize);
      } else {
        setPageSizeInput(pageSize.toString());
      }
    }
  };

  const handlePageSizeInputBlur = () => {
    const newPageSize = parseInt(pageSizeInput);
    if (newPageSize && newPageSize >= 1 && newPageSize <= 100) {
      // Reset to first page when changing page size
      if (onPageChange) onPageChange(1);
      // Call the onPageSizeChange prop to update page size
      if (onPageSizeChange) onPageSizeChange(newPageSize);
    } else {
      setPageSizeInput(pageSize.toString());
    }
  };

  const handleClearFilters = () => {
    // Clear all filters
    filters.forEach(filter => {
      if (filter.onChange) {
        filter.onChange(filter.isMulti ? [] : '__ALL__');
      }
    });
    // Clear search
    if (onSearch) {
      setInternalSearch('');
      onSearch('');
    }
  };

  // Export to CSV
  const handleExport = () => {
    const exportCols = columns;
    const csv = Papa.unparse([
      exportCols.map((col) => col.header),
      ...data.map((row) => exportCols.map((col) => row[col.key]))
    ]);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectAllRows = (checked) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const handleRowSelect = (row, checked) => {
    if (onRowSelect) {
      onRowSelect(row, checked);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(total / pageSize);

  // Pagination bar helper
  function getPaginationRange(current, total, delta) {
    const range = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);

    return range;
  }

  const paginationRange = getPaginationRange(page, totalPages, paginationDelta);

  // Render cards for mobile if cardComponent is provided
  if (isMobile && CardComponent) {
    return (
      <div className={cn("", className)}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {searchFilterVisibility && (
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <div className="relative w-full lg:w-[400px]">
                <MaterialIcon
                  icon="search"
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search"
                  value={internalSearch}
                  onChange={handleSearch}
                  className="w-full md:w-[400px] h-9 pl-10 pr-3 py-2 bg-white border border-borderColor-primary rounded-lg text-sm text-content-primary focus:ring-1 focus:ring-gray-300 focus:border-gray-300 placeholder:text-content-tertiary font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[0%]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={filter.value || (filter.isMulti ? [] : "__ALL__")}
                    onValueChange={(value) => handleFilterChange(filter, value)}
                    className="h-[36px]"
                    icon={filter.icon}
                    label={filter.label}
                    isMulti={filter.isMulti}
                    hasSearch={filter.hasSearch}
                  >
                    {filter.options.filter(opt => opt.value !== "__ALL__").map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        isMulti={filter.isMulti}
                        data-state={filter.value}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                ))}
                {(filters.some(f => (f.isMulti ? (f.value && f.value.length > 0) : (f.value && f.value !== "__ALL__")))) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-3 py-2 h-9 text-sm font-semibold border-none rounded-lg !hover:bg-blue-100 !bg-transparent text-content-brand hover:text-content-brand shadow-none"
                  >
                    <MaterialIcon icon="close" size={20} className="text-content-brand p-0" />
                    Clear filter
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-borderColor-secondary bg-white p-4 shadow-sm mb-4 animate-pulse h-[180px]" />
            ))
          ) : data.length === 0 ? (
            <div className="text-center py-8">No data found.</div>
          ) : (
            data.map((row) => <CardComponent key={row.id} lead={row} />)
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-center h-12 px-4 py-2 border-t border-borderColor-secondary rounded-b-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-full"
            >
              <MaterialIcon icon="chevron_left" size={20} className="text-content-secondary" />
            </Button>
            {paginationRange.map((p, idx) =>
              p === '...'
                ? <span key={idx} className="px-2">...</span>
                : <Button
                  key={p}
                  variant={p === page ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "rounded-[8px] w-8 h-8",
                    p === page && "border border-gray-300 bg-red shadow text-content-primary"
                  )}
                  disabled={p === page}
                >
                  {p}
                </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="rounded-full"
            >
              <MaterialIcon icon="chevron_right" size={20} className="text-content-secondary" />
            </Button>

          </div>
        </div>
      </div>
    );
  }

  // Desktop/table view
  return (
    <div className={cn("", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {
          searchFilterVisibility && (
            <div className="flex flex-1 flex-wrap items-center gap-4 sm:w-full">
              <div className="relative w-[400px]">
                <MaterialIcon
                  icon="search"
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search"
                  value={internalSearch}
                  onChange={handleSearch}
                  className="w-[400px] h-9 pl-10 pr-3 py-2 bg-white border border-borderColor-primary rounded-lg text-sm text-content-primary focus:ring-1 focus:ring-gray-300 focus:border-gray-300 placeholder:text-content-tertiary font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[0%]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={filter.value || (filter.isMulti ? [] : "__ALL__")}
                    onValueChange={(value) => handleFilterChange(filter, value)}
                    className="h-[36px] sm:w-auto"
                    icon={filter.icon}
                    label={filter.label}
                    isMulti={filter.isMulti}
                    hasSearch={filter.hasSearch}
                  >
                    {filter.options.filter(opt => opt.value !== "__ALL__").map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        isMulti={filter.isMulti}
                        data-state={filter.value}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                ))}
                {(filters.some(f => (f.isMulti ? (f.value && f.value.length > 0) : (f.value && f.value !== "__ALL__")))) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-3 py-2 h-9 text-sm font-semibold border-none rounded-lg !hover:bg-blue-100 !bg-transparent text-content-brand hover:text-content-brand shadow-none"
                  >
                    <MaterialIcon icon="close" size={20} className="text-content-brand p-0" />
                    Clear filter
                  </Button>
                )}
              </div>
            </div>
          )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-borderColor-primary bg-white">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-white">
            <tr className="border-b border-borderColor-secondary">
              {rowSelection && (
                <th className="px-2 py-3 w-[48px] border-b border-borderColor-secondary">
                  <div className="flex items-center justify-center">
                    <MaterialCheckbox
                      checked={allSelected}
                      onChange={() => handleSelectAllRows(!allSelected)}
                    />
                  </div>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-3 text-left font-['Inter'] font-semibold text-[14px] leading-[16px] tracking-[0%] select-none cursor-pointer whitespace-nowrap text-content-secondary",
                    col.sortable && "hover:bg-bg-tertiary transition-colors",
                    col.key === "createdAt" && "w-[140px]",
                    col.key === "name" && "w-[200px]",
                    col.key === "email" && "w-[220px]",
                    col.key === "phone" && "w-[150px]",
                    col.key === "type" && "w-[120px]",
                    col.key === "address" && "w-[250px]",
                    col.key === "state" && "w-[100px]",
                    col.key === "status" && "w-[120px]",
                    col.key === "actions" && "w-[30px]"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center justify-start gap-[6px] h-5">
                    {col.icon && <span className="text-content-secondary flex items-center justify-center">{col.icon}</span>}
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-content-secondary flex items-center">
                        {sort?.key === col.key ? (
                          sort.direction === "asc" ? (
                            <MaterialIcon icon="keyboard_arrow_up" size={16} />
                          ) : (
                            <MaterialIcon icon="keyboard_arrow_down" size={16} />
                          )
                        ) : (
                          <MaterialIcon icon="unfold_more" size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b last:border-0">
                  {rowSelection && (
                    <td className="px-2 py-2.5">
                      <span className="block h-5 w-4 bg-gray-200 rounded-md shimmer" />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={cn(
                        "px-4 py-2.5 text-sm",
                        col.key === "createdAt" && "w-[140px]",
                        col.key === "name" && "w-[200px]",
                        col.key === "email" && "w-[220px]",
                        col.key === "phone" && "w-[150px]",
                        col.key === "type" && "w-[120px]",
                        col.key === "address" && "w-[250px]",
                        col.key === "state" && "w-[100px]",
                        col.key === "status" && "w-[800px]",
                        col.key === "actions" && "w-[80px]"
                      )}
                    >
                      <span className="block h-5 w-full  bg-bg-tertiary rounded-md shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="text-center py-8">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const isSelected = selectedRows?.some(selected => selected.id === row.id);
                const nextRowSelected = i < data.length - 1 && selectedRows?.some(selected => selected.id === data[i + 1].id);
                return (
                  <tr
                    key={i}
                    className={cn(
                      "border-b last:border-0 transition-colors h-[48px]",
                      isSelected ? "bg-bg-tertiary border-borderColor-secondary" : nextRowSelected ? "border-borderColor-secondary hover:bg-borderColor-tertiary" : "border-borderColor-secondary hover:bg-bg-tertiary"
                    )}
                  >
                    {rowSelection && (
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center">
                          <MaterialCheckbox
                            checked={isSelected}
                            onChange={() => handleRowSelect(row, !isSelected)}
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-3 py-2 align-middle text-sm whitespace-nowrap",
                          col.key === "createdAt" && "w-[140px]",
                          col.key === "name" && "w-[200px]",
                          col.key === "email" && "w-[260px]",
                          col.key === "phone" && "w-[150px]",
                          col.key === "type" && "w-[120px]",
                          col.key === "address" && "w-[280px]",
                          col.key === "state" && "w-[100px]",
                          col.key === "status" && "w-[80px]",
                          col.key === "actions" && "w-[50px]"
                        )}
                      >
                        <TableCell col={col} row={row} forceString={['email', 'address', 'phone', 'state', 'createdAt', 'datePurchased', 'subscription', 'purchased', 'refunded', 'price'].includes(col.key)} />
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between h-12 px-4 py-2 border-t border-borderColor-secondary bg-white rounded-b-lg">
          <div className="flex items-center gap-4">
            <div className="text-content-primary text-[13px] leading-5 tracking-normal font-[450] flex items-center justify-start !antialiased">
              Page Size:
            </div>
            <div className="flex items-center gap-1 mr-2">
              <Input
                type="number"
                value={pageSizeInput}
                onChange={handlePageSizeInputChange}
                onKeyDown={handlePageSizeInputKeyDown}
                onBlur={handlePageSizeInputBlur}
                min={1}
                max={100}
                className="w-16 h-8 text-center text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-content-primary text-[13px] leading-5 tracking-normal font-[450] flex items-center justify-start">
              Showing {data?.length || 0} of {total || 0} results
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-full"
            >
              <MaterialIcon icon="chevron_left" size={20} className="text-content-secondary" />
            </Button>
            {paginationRange.map((p, idx) =>
              p === '...'
                ? <span key={idx} className="px-2">...</span>
                : <Button
                  key={p}
                  variant={p === page ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "rounded-[8px] w-8 h-8",
                    p === page && "border border-gray-300 bg-red shadow text-content-primary"
                  )}
                  disabled={p === page}
                >
                  {p}
                </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="rounded-full"
            >
              <MaterialIcon icon="chevron_right" size={20} className="text-content-secondary" />
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;