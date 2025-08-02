import { useState, useMemo, useCallback } from 'react';

export const useTable = (data, options = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSortBy = null,
    initialSortDirection = 'asc',
    searchableColumns = [],
    filterableColumns = []
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Handle sorting
  const handleSort = useCallback((column) => {
    if (sortBy === column) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(1); // Reset to first page when sorting changes
  }, [sortBy]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when search changes
  }, []);

  // Handle filters
  const handleFilter = useCallback((column, value) => {
    setFilters(current => ({
      ...current,
      [column]: value
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  // Process data with current sorting, filtering, and pagination
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery && searchableColumns.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchableColumns.some(column =>
          String(item[column]).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        result = result.filter(item => 
          String(item[column]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, searchableColumns, filters, sortBy, sortDirection]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, page, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  return {
    // Data
    data: paginatedData,
    totalItems: processedData.length,
    totalPages,
    
    // Pagination state
    page,
    pageSize,
    setPage,
    setPageSize,
    
    // Sorting state
    sortBy,
    sortDirection,
    handleSort,
    
    // Search state
    searchQuery,
    handleSearch,
    
    // Filter state
    filters,
    handleFilter,
  };
};