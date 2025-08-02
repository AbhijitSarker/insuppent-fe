import React from 'react';

const TableHeader = ({ columns, sortBy, sortDirection, onSort }) => {
  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortBy !== column.key) {
      return (
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <thead className="bg-neutral-50 border-b border-neutral-200">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            onClick={() => column.sortable && onSort(column.key)}
            className={`px-6 py-3 text-left ${
              column.sortable ? 'cursor-pointer hover:bg-neutral-100' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                {column.label}
              </span>
              {getSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;