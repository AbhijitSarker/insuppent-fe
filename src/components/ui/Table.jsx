import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Checkbox } from "./checkbox";
import { Select, SelectItem } from "./select";
import { Input } from "./input";
import Papa from "papaparse";
import { useDebounce } from "@/hooks/useDebounce";

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

export function Table({
  columns,
  data,
  loading = false,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
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
}) {
  const [internalSearch, setInternalSearch] = React.useState(search);
  const debouncedSearch = useDebounce(internalSearch, 500);

  // Calculate if all rows are selected
  const allSelected = data.length > 0 && selectedRows.length === data.length && 
    data.every(row => selectedRows.some(selected => selected.id === row.id));

  // Reset internal search when external search prop changes
  React.useEffect(() => {
    setInternalSearch(search);
  }, [search]);

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

  return (
    <div className={cn("", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl pb-4">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="relative w-[400px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
            <Input
              type="text"
              placeholder="Search leads..."
              value={internalSearch}
              onChange={handleSearch}
              className="w-[400px] h-10 pl-10 bg-white border border-[#D6D3D1] rounded-xl text-sm text-[rgb(var(--table-text))] focus:ring-2 focus:ring-gray-200 placeholder:text-gray-400  text-[14px] leading-[20px] tracking-normal font-['Inter','sans-serif']"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filter.value || (filter.isMulti ? [] : "__ALL__")}
                onValueChange={(value) => handleFilterChange(filter, value)}
                className="h-10 bg-[#0000000F] border-none rounded-xl text-[rgb(var(--table-text))] text-black focus:ring-2 focus:ring-gray-200 font-semibold text-[14px] leading-[20px] tracking-normal font-['Inter','sans-serif']"
                icon={filter.icon}
                label={filter.label}
                isMulti={filter.isMulti}
              >
                <SelectItem 
                  value="__ALL__" 
                  icon={filter.icon}
                  isMulti={filter.isMulti}
                  data-state={filter.value}
                >
                  {filter.label}
                </SelectItem>
                {filter.options.filter(opt => opt.value !== "__ALL__").map((opt) => (
                  <SelectItem 
                    key={opt.value} 
                    value={opt.value}
                    // icon={filter.icon}
                    isMulti={filter.isMulti}
                    data-state={filter.value}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
            ))}
            {(filters.length > 0 || search) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-3 py-2 h-9 text-xs font-medium border-none text-[rgb(var(--table-text))] rounded-md hover:bg-[rgb(var(--table-row-hover))] bg-transparent shadow-none text-primary"
              >
                <span className="text-primary text-lg">X</span>Clear&nbsp;filter
              </Button>
            )}
          </div>
        </div>
        <Button 
          variant="default" 
          size="lg"
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 min-w-[140px] rounded-md"
        >
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[rgb(var(--table-border))] bg-white">
        <table className="min-w-full divide-y divide-[rgb(var(--table-border))] bg-white text-sm">
          <thead className="bg-[rgb(var(--table-header-bg))]">
            <tr>
              {rowSelection && (
                <th className="px-2 py-2.5 w-[48px]">
                  <div className="flex items-center justify-center">
                    <Checkbox 
                      checked={allSelected} 
                      onCheckedChange={handleSelectAllRows}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-left font-semibold uppercase tracking-wider select-none cursor-pointer whitespace-nowrap text-[rgb(var(--table-text))]",
                    col.sortable && "hover:underline"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.icon}
                    {col.header}
                    {col.sortable && sort?.key === col.key && (
                      <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                    )}
                  </span>
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
                    <td key={col.key || colIdx} className="px-4 py-2.5 text-sm">
                      <span className="block h-5 w-full bg-gray-200 rounded-md shimmer" />
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
                return (
                  <tr 
                    key={i} 
                    className={cn(
                      "border-b border-[rgb(var(--table-border))] last:border-0 transition-colors h-[46px]",
                      isSelected ? "bg-[rgb(var(--table-selected-row))]" : "hover:bg-[rgb(var(--table-row-hover))]"
                    )}
                  >
                    {rowSelection && (
                      <td className="px-2 py-2.5">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleRowSelect(row, checked)}
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-0 align-middle text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5 h-full min-h-[32px]">
                          {col.render ? col.render(row) : row[col.key]}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2 border-t border-[rgb(var(--table-border))] bg-[rgb(var(--table-header-bg))] rounded-b-lg">
          <div>{footerContent}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="rounded-full"
            >
              <ChevronLeftIcon />
            </Button>
            {paginationRange.map((p, idx) =>
              p === '...'
                ? <span key={idx} className="px-2 text-muted-foreground">...</span>
                : <Button
                    key={p}
                    variant={p === page ? "outline" : "ghost"}
                    size="icon"
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      "rounded-full w-8 h-8",
                      p === page && "border border-primary bg-white shadow"
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
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;