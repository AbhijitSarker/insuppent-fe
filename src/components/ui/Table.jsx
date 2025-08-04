import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Checkbox } from "./checkbox";
import { Select, SelectItem } from "./select";
import Papa from "papaparse";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";

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
  filters = [], // [{ key, label, options, value, onChange }]
  footerContent = null,
  paginationDelta = 2,
}) {
  const [internalSearch, setInternalSearch] = React.useState(search);
  React.useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  const handleSearch = (e) => {
    setInternalSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSort = (col) => {
    if (!col.sortable) return;
    let direction = "asc";
    if (sort?.key === col.key && sort.direction === "asc") direction = "desc";
    if (onSortChange) onSortChange(col.key, direction);
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) onPageChange(newPage);
  };

  // Row selection logic
  const allSelected = data.length > 0 && selectedRows?.length === data.length;
  const handleSelectAll = () => {
    if (onSelectAll) onSelectAll(!allSelected);
  };
  const handleRowSelect = (row, checked) => {
    if (onRowSelect) onRowSelect(row, checked);
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
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-4 py-3 mb-2">
        <input
          type="text"
          placeholder="Search"
          value={internalSearch}
          onChange={handleSearch}
          className="border border-input bg-muted rounded-md px-3 py-2 text-sm w-56 focus:outline-none focus:ring focus:ring-primary/20"
        />
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value || "__ALL__"}
            onValueChange={filter.onChange}
          >
            <SelectItem value="__ALL__">{filter.label}</SelectItem>
            {filter.options.filter(opt => opt.value !== "__ALL__").map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
        ))}
        <Button variant="outline" size="sm" onClick={handleExport} className="ml-auto">Export CSV</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="min-w-full divide-y divide-border bg-white text-sm">
          <thead className="bg-muted/50">
            <tr>
              {rowSelection && (
                <th className="px-2 py-2">
                  <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2 text-left font-semibold uppercase tracking-wider select-none cursor-pointer whitespace-nowrap",
                    col.sortable && "hover:underline"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="flex items-center gap-1">
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
                    <td className="px-2 py-2">
                      <span className="block h-5 w-4 bg-gray-200 rounded-md shimmer" />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={col.key || colIdx} className="px-4 py-2 text-sm">
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
              data.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-accent/30">
                  {rowSelection && (
                    <td className="px-2 py-2">
                      <Checkbox
                        checked={selectedRows?.includes(row)}
                        onCheckedChange={(checked) => handleRowSelect(row, checked)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-sm whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 rounded-b-xl">
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