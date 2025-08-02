import React from 'react';

const TablePagination = ({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange
}) => {
  const pageSizeOptions = [5, 10, 25, 50, 100];
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-neutral-200">
      <div className="flex items-center gap-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          {startItem}-{endItem} of {totalItems}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-1 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z" clipRule="evenodd" transform="rotate(-90 10 10)" />
            <path fillRule="evenodd" d="M9.707 15.707a1 1 0 01-1.414 0L4 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z" clipRule="evenodd" transform="rotate(-90 5 10)" />
          </svg>
        </button>
        
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <span className="px-4 py-1 text-sm text-neutral-600">
          Page {page} of {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-1 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0L10 11.414l4.293 4.293a1 1 0 001.414-1.414l-5-5a1 1 0 00-1.414 0l-5 5a1 1 0 000 1.414z" clipRule="evenodd" transform="rotate(90 10 10)" />
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 001.414 0L15 11.414l4.293 4.293a1 1 0 001.414-1.414l-5-5a1 1 0 00-1.414 0l-5 5a1 1 0 000 1.414z" clipRule="evenodd" transform="rotate(90 15 10)" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TablePagination;