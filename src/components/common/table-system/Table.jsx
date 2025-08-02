import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import TableSearch from './TableSearch';
import TableFilter from './TableFilter';
import { useTable } from './useTable';

const Table = ({
  data,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  initialSort = null,
  pageSize: initialPageSize = 10,
  className = '',
  onRowClick,
  loading = false,
}) => {
  const {
    data: displayData,
    totalItems,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    sortBy,
    sortDirection,
    handleSort,
    searchQuery,
    handleSearch,
    filters,
    handleFilter
  } = useTable(data, {
    initialSortBy: initialSort,
    initialPageSize,
    searchableColumns,
    filterableColumns
  });

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-sm text-neutral-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasTopBar = searchableColumns.length > 0 || filterableColumns.length > 0;

  return (
    <div className={`flex flex-col ${className}`}>
      {hasTopBar && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {searchableColumns.length > 0 && (
            <TableSearch
              onSearch={handleSearch}
              searchQuery={searchQuery}
            />
          )}
          {filterableColumns.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {filterableColumns.map(column => (
                <TableFilter
                  key={column}
                  column={column}
                  value={filters[column]}
                  onChange={handleFilter}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <TableHeader
              columns={columns}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody
              data={displayData}
              columns={columns}
              onRowClick={onRowClick}
            />
          </table>
        </div>

        {totalItems > 0 && (
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}

        {totalItems === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 bg-neutral-50">
            <svg 
              className="w-12 h-12 text-neutral-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-neutral-600 text-sm">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;