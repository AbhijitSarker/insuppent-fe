import React, { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { useLeads } from '@/api/hooks/useLeads';
import { Button } from '@/components/ui/button';
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

const columns = [
	{ key: 'name', header: 'Name', sortable: true, icon: <PersonIcon fontSize="small" /> },
	{ key: 'email', header: 'Email', sortable: true, icon: <EmailIcon fontSize="small" /> },
	{ key: 'phone', header: 'Phone', sortable: true, icon: <PhoneIcon fontSize="small" /> },
	{ key: 'type', header: 'Type', sortable: true, icon: <BusinessIcon fontSize="small" /> },
	{ key: 'status', header: 'Status', sortable: true, icon: <SortIcon fontSize="small" /> },
];

const statusOptions = [
	{ value: '__ALL__', label: 'Status' },
	{ value: 'public', label: 'Public' },
	{ value: 'private', label: 'Private' },
];

const typeOptions = [
	{ value: '__ALL__', label: 'Type' },
	{ value: 'auto', label: 'Auto' },
	{ value: 'manual', label: 'Manual' },
];

const AdminLeads = () => {
	const [tableState, setTableState] = useState({
		page: 1,
		pageSize: 10,
		sort: { key: 'createdAt', direction: 'desc' },
		search: '',
		type: '__ALL__',
		status: '__ALL__',
	});
	const [selectedRows, setSelectedRows] = useState([]);

	// Reset selected rows when filters change
	useEffect(() => {
		setSelectedRows([]);
	}, [tableState]);

	const { data: leadsData, isLoading } = useLeads({
		page: tableState.page,
		limit: tableState.pageSize,
		sortBy: tableState.sort.key,
		sortOrder: tableState.sort.direction,
		type: tableState.type !== '__ALL__' ? tableState.type : undefined,
		status: tableState.status !== '__ALL__' ? tableState.status : undefined,
		searchTerm: tableState.search || undefined,
	});

	// Table state update handlers
	const handlePageChange = (newPage) => {
		setTableState(prev => ({ ...prev, page: newPage }));
	};

	const handleSearch = (value) => {
		setTableState(prev => ({ ...prev, search: value, page: 1 }));
	};

	const handleSortChange = (key, direction) => {
		setTableState(prev => ({ ...prev, sort: { key, direction }, page: 1 }));
	};

	const handleTypeChange = (value) => {
		setTableState(prev => ({ ...prev, type: value, page: 1 }));
	};

	const handleStatusChange = (value) => {
		setTableState(prev => ({ ...prev, status: value, page: 1 }));
	};

	// Row selection handlers
	const handleRowSelect = (row, checked) => {
		setSelectedRows(prev =>
			checked ? [...prev, row] : prev.filter(r => r.id !== row.id)
		);
	};

	const handleSelectAll = (checked) => {
		setSelectedRows(checked ? leadsData?.data || [] : []);
	};

	// Export selected rows
	const handleExportSelected = () => {
		if (!selectedRows.length) return;
		const csv = [
			columns.map(col => col.header),
			...selectedRows.map(row => columns.map(col => row[col.key]))
		]
			.map(row => row.join(','))
			.join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'selected-leads.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	const filters = [
		{
			key: 'type',
			label: 'Type',
			options: typeOptions,
			value: tableState.type,
			onChange: handleTypeChange,
		},
		{
			key: 'status',
			label: 'Status',
			options: statusOptions,
			value: tableState.status,
			onChange: handleStatusChange,
		},
	];

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Manage Leads</h1>
			<div className="mb-2 flex gap-2 items-center">
				<Button
					variant="outline"
					size="sm"
					onClick={handleExportSelected}
					disabled={selectedRows.length === 0}
				>
					Export Selected
				</Button>
				<span className="text-xs text-muted-foreground">
					{selectedRows.length} row(s) selected
				</span>
			</div>
			<Table
				columns={columns}
				data={leadsData?.data || []}
				loading={isLoading}
				page={tableState.page}
				pageSize={tableState.pageSize}
				total={leadsData?.meta?.total || 0}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				sort={tableState.sort}
				search={tableState.search}
				onSearch={handleSearch}
				rowSelection
				selectedRows={selectedRows}
				onRowSelect={handleRowSelect}
				onSelectAll={handleSelectAll}
				filters={filters}
				footerContent={
					<span>
						Showing {leadsData?.data?.length || 0} of {leadsData?.meta?.total || 0} results
					</span>
				}
				paginationDelta={2}
			/>
		</div>
	);
};

export default AdminLeads;