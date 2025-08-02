import React from 'react';

const TableBody = ({ data, columns }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'purchased':
        return 'bg-primary-50 text-primary-700';
      case 'contacted':
        return 'bg-success-50 text-success-700';
      case 'in discussion':
        return 'bg-warning-50 text-warning-700';
      case 'no response':
        return 'bg-danger-50 text-danger-700';
      case 'sold':
        return 'bg-success-50 text-success-700';
      default:
        return 'bg-neutral-50 text-neutral-700';
    }
  };

  return (
    <tbody className="bg-white divide-y divide-neutral-200">
      {data.map((row, rowIndex) => (
        <tr 
          key={row.id || rowIndex}
          className="hover:bg-neutral-50 transition-colors duration-150"
        >
          {columns.map((column) => {
            let content = row[column.key];
            
            // Special handling for status
            if (column.key === 'status') {
              const statusClass = getStatusColor(content);
              content = (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                  {content}
                </span>
              );
            }
            
            // Special handling for type badges
            if (column.key === 'type') {
              const typeColor = {
                'Auto': 'bg-purple-50 text-purple-700',
                'Home': 'bg-green-50 text-green-700',
                'Business': 'bg-orange-50 text-orange-700',
                'Life Insurance': 'bg-pink-50 text-pink-700',
                'Mortgage': 'bg-blue-50 text-blue-700'
              }[content] || 'bg-neutral-50 text-neutral-700';
              
              content = (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                  {content}
                </span>
              );
            }

            return (
              <td
                key={column.key}
                className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900"
              >
                {column.render ? column.render(row[column.key], row) : content}
              </td>
            );
          })}
        </tr>
      ))}
      {data.length === 0 && (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-8 whitespace-nowrap text-sm text-neutral-500 text-center bg-neutral-50"
          >
            No data available
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;