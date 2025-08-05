import React, { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { useLeads } from '@/api/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaCar, FaHome, FaCity, FaTicketAlt, FaGlobe, FaLock, FaMapMarkerAlt, FaBookmark, FaPercent, FaTag } from 'react-icons/fa';

const typeIcons = {
	auto: FaCar,
	commercial: FaCity,
	home: FaHome,
	mortgage: FaBuilding,
};

const columns = [
	{ key: 'name', header: 'Name', sortable: true, icon: <FaUser size={14} /> },
	{ key: 'email', header: 'Email', sortable: true, icon: <FaEnvelope size={14} /> },
	{ key: 'phone', header: 'Phone', sortable: true, icon: <FaPhone size={14} /> },
	{ 
		key: 'type', 
		header: 'Type', 
		sortable: true, 
		icon: <FaBookmark size={14} />, 
		render: (row) => (
			<Badge variant={row.type} icon={row.type}>
				{row.type.charAt(0).toUpperCase() + row.type.slice(1)}
			</Badge>
		)
	},
	{ 
		key: 'status', 
		header: 'Status', 
		sortable: true, 
		icon: <FaGlobe size={14} />,
		render: (row) => (
			<div className="flex items-center gap-2 justify-center">
				<span className={row.status === 'public' ? 'w-2 h-2 rounded-full bg-[#15803D]' : 'w-2 h-2 rounded-full bg-[#B91C1C]'} />
				<span className={`font-['Inter'] font-medium text-[14px] leading-[16px] tracking-[0%] text-center ${
					row.status === 'public' ? 'text-[#15803D]' : 'text-[#B91C1C]'
				}`}>
					{row.status.charAt(0).toUpperCase() + row.status.slice(1)}
				</span>
			</div>
		)
	},
];

const statusOptions = [
	{ value: '__ALL__', label: 'Status' },
	{ value: 'public', label: 'Public' },
	{ value: 'private', label: 'Private' },
];

const typeOptions = [
	{ value: '__ALL__', label: 'Type' },
	{ value: 'auto', label: 'Auto' },
	{ value: 'mortgage', label: 'Mortgage' },
	{ value: 'home', label: 'Home' },
];

const stateOptions = [
	{ value: '__ALL__', label: 'All States' },
	{ value: 'AL', label: 'Alabama' },
	{ value: 'AK', label: 'Alaska' },
	{ value: 'AZ', label: 'Arizona' },
	{ value: 'AR', label: 'Arkansas' },
	{ value: 'CA', label: 'California' },
	{ value: 'CO', label: 'Colorado' },
	{ value: 'CT', label: 'Connecticut' },
	{ value: 'DE', label: 'Delaware' },
	{ value: 'FL', label: 'Florida' },
	{ value: 'GA', label: 'Georgia' },
	{ value: 'HI', label: 'Hawaii' },
	{ value: 'ID', label: 'Idaho' },
	{ value: 'IL', label: 'Illinois' },
	{ value: 'IN', label: 'Indiana' },
	{ value: 'IA', label: 'Iowa' },
	{ value: 'KS', label: 'Kansas' },
	{ value: 'KY', label: 'Kentucky' },
	{ value: 'LA', label: 'Louisiana' },
	{ value: 'ME', label: 'Maine' },
	{ value: 'MD', label: 'Maryland' },
	{ value: 'MA', label: 'Massachusetts' },
	{ value: 'MI', label: 'Michigan' },
	{ value: 'MN', label: 'Minnesota' },
	{ value: 'MS', label: 'Mississippi' },
	{ value: 'MO', label: 'Missouri' },
	{ value: 'MT', label: 'Montana' },
	{ value: 'NE', label: 'Nebraska' },
	{ value: 'NV', label: 'Nevada' },
	{ value: 'NH', label: 'New Hampshire' },
	{ value: 'NJ', label: 'New Jersey' },
	{ value: 'NM', label: 'New Mexico' },
	{ value: 'NY', label: 'New York' },
	{ value: 'NC', label: 'North Carolina' },
	{ value: 'ND', label: 'North Dakota' },
	{ value: 'OH', label: 'Ohio' },
	{ value: 'OK', label: 'Oklahoma' },
	{ value: 'OR', label: 'Oregon' },
	{ value: 'PA', label: 'Pennsylvania' },
	{ value: 'RI', label: 'Rhode Island' },
	{ value: 'SC', label: 'South Carolina' },
	{ value: 'SD', label: 'South Dakota' },
	{ value: 'TN', label: 'Tennessee' },
	{ value: 'TX', label: 'Texas' },
	{ value: 'UT', label: 'Utah' },
	{ value: 'VT', label: 'Vermont' },
	{ value: 'VA', label: 'Virginia' },
	{ value: 'WA', label: 'Washington' },
	{ value: 'WV', label: 'West Virginia' },
	{ value: 'WI', label: 'Wisconsin' },
	{ value: 'WY', label: 'Wyoming' }
];

const AdminLeads = () => {
	const [tableState, setTableState] = useState({
		page: 1,
		pageSize: 15,
		sort: { key: 'createdAt', direction: 'desc' },
		search: '',
		types: [],
		statuses: [],
		states: []
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
		type: tableState.types.length ? tableState.types.join(',') : undefined,
		status: tableState.statuses.length ? tableState.statuses.join(',') : undefined,
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

	const handleTypeChange = (values) => {
		setTableState(prev => ({ 
			...prev, 
			types: values === '__ALL__' ? [] : Array.isArray(values) ? values : [values],
			page: 1 
		}));
	};

	const handleStatusChange = (values) => {
		setTableState(prev => ({ 
			...prev, 
			statuses: values === '__ALL__' ? [] : Array.isArray(values) ? values : [values],
			page: 1 
		}));
	};

	const handleStateChange = (values) => {
		setTableState(prev => ({ 
			...prev, 
			states: values === '__ALL__' ? [] : Array.isArray(values) ? values : [values],
			page: 1 
		}));
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
			value: tableState.types,
			onChange: handleTypeChange,
			icon: FaTag,
			isMulti: true
		},
		{
			key: 'state',
			label: 'State',
			options: stateOptions,
			value: tableState.states,
			onChange: handleStateChange,
			icon: FaMapMarkerAlt,
			isMulti: true
		},
		{
			key: 'status',
			label: 'Status',
			options: statusOptions,
			value: tableState.statuses,
			onChange: handleStatusChange,
			icon: FaGlobe,
			isMulti: true
		}
	];

	return (
		<div className="p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Manage Leads</h1>
				<Button
					variant="default"
					size="lg"
					onClick={handleExportSelected}
					disabled={selectedRows.length === 0}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl h-10"
				>
					{selectedRows.length ? `Export ${selectedRows.length} Selected` : 'Export Selected'}
				</Button>
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
					<span className="text-sm text-muted-foreground">
						Showing {leadsData?.data?.length || 0} of {leadsData?.meta?.total || 0} results
					</span>
				}
				paginationDelta={2}
			/>
		</div>
	);
};

export default AdminLeads;