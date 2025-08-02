import React from 'react';

const TableFilter = ({ column, value, onChange }) => {
  const getFilterOptions = (columnKey) => {
    switch (columnKey) {
      case 'type':
        return ['Auto', 'Home', 'Business', 'Life Insurance', 'Mortgage'];
      case 'status':
        return ['Purchased', 'Contacted', 'In Discussion', 'No Response', 'Sold'];
      default:
        return [];
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={value || ''}
        onChange={(e) => onChange(column, e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer appearance-none"
      >
        <option value="">Filter {column}</option>
        {getFilterOptions(column).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default TableFilter;