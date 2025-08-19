import React, { useState, useEffect, useMemo } from 'react';
import Alert from '@/components/ui/alert';
import { Table } from '@/components/ui/Table';
import { useLeads } from '@/api/hooks/useLeads';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MaterialIcon from '@/components/ui/MaterialIcon';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const typeIcons = {
	auto: 'directions_car',
	commercial: 'location_city',
	home: 'home',
	mortgage: 'business',
};

const AdminLeads = () => {
const [tableState, setTableState] = useState({
 page: 1,
 pageSize: 13,
 sort: { key: 'createdAt', direction: 'desc' },
 search: '',
 types: [],
 statuses: [],
 states: []
});

// Helper: Map state abbreviation to full name
const stateAbbrToName = {
	'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
	'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
	'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
	'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
	'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
	'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
	'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
	'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
	'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
	'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};
			const [selectedRows, setSelectedRows] = useState([]);
			const [loadingStatuses, setLoadingStatuses] = useState({});
			// Modal state for status change
			const [modalOpen, setModalOpen] = useState(false);
			const [modalLead, setModalLead] = useState(null);
			const [modalStatus, setModalStatus] = useState(null);
			// Alert state
			const [alert, setAlert] = useState({ type: '', message: '' });

	// Reset selected rows when filters change
	useEffect(() => {
		setSelectedRows([]);
	}, [tableState]);

	const { data: leadsData, isLoading, isUpdating, updateStatus } = useLeads();

	// Filter and sort data on frontend
	const filteredAndSortedData = useMemo(() => {
		if (!leadsData?.data) return [];

		let filteredData = [...leadsData.data];

		// Apply search filter
		if (tableState.search) {
			const searchTerm = tableState.search.toLowerCase();
			filteredData = filteredData.filter(lead =>
				lead.name?.toLowerCase().includes(searchTerm) ||
				lead.email?.toLowerCase().includes(searchTerm) ||
				lead.phone?.toLowerCase().includes(searchTerm) ||
				lead.address?.toLowerCase().includes(searchTerm) ||
				lead.state?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply type filter
		if (tableState.types.length > 0) {
			filteredData = filteredData.filter(lead =>
				tableState.types.includes(lead.type)
			);
		}

		// Apply status filter
		if (tableState.statuses.length > 0) {
			filteredData = filteredData.filter(lead =>
				tableState.statuses.includes(lead.status)
			);
		}

		// Apply state filter
		if (tableState.states.length > 0) {
			filteredData = filteredData.filter(lead =>
				tableState.states.includes(lead.state)
			);
		}

		// Apply sorting
		if (tableState.sort.key) {
			filteredData.sort((a, b) => {
				let aVal = a[tableState.sort.key];
				let bVal = b[tableState.sort.key];

				// Handle date sorting
				if (tableState.sort.key === 'createdAt') {
					aVal = new Date(aVal);
					bVal = new Date(bVal);
				}

				// Handle string sorting
				if (typeof aVal === 'string') {
					aVal = aVal.toLowerCase();
					bVal = bVal.toLowerCase();
				}

				if (aVal < bVal) {
					return tableState.sort.direction === 'asc' ? -1 : 1;
				}
				if (aVal > bVal) {
					return tableState.sort.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}

		return filteredData;
	}, [leadsData?.data, tableState]);

	// Paginate the filtered data
	const paginatedData = useMemo(() => {
		const startIndex = (tableState.page - 1) * tableState.pageSize;
		const endIndex = startIndex + tableState.pageSize;
		return filteredAndSortedData.slice(startIndex, endIndex);
	}, [filteredAndSortedData, tableState.page, tableState.pageSize]);

	// Calculate total count for pagination
	const totalCount = filteredAndSortedData.length;

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
		setSelectedRows(checked ? paginatedData || [] : []);
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

	   // Open modal and set lead/status
	   const openStatusModal = (lead, status) => {
		   setModalLead(lead);
		   setModalStatus(status);
		   setModalOpen(true);
	   };

		// Confirm status change
		const handleConfirmStatus = async () => {
			if (!modalLead || !modalStatus) return;
			try {
				await updateStatus(modalLead.id, modalStatus);
				setModalOpen(false);
				setModalLead(null);
				setModalStatus(null);
				setAlert({ type: 'success', message: 'Lead status updated successfully!' });
			} catch (error) {
				console.error('Error updating lead status:', error);
				setAlert({ type: 'error', message: 'Failed to update lead status.' });
			}
		};

		const columns = [
			{
				key: 'createdAt',
				header: 'Date Added',
				sortable: true,
				icon: <MaterialIcon className={'text-content-secondary'} icon="date_range" size={16} />,
				render: (row) => (
					<span>{new Date(row.createdAt).toLocaleDateString()}</span>
				)
			},
			{ key: 'name', header: 'Name', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="group" size={16} /> },
			{ key: 'email', header: 'Email', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="email" size={16} /> },
			{ key: 'phone', header: 'Phone', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="phone" size={16} /> },
			{ 
				key: 'type', 
				header: 'Type', 
				sortable: true, 
				icon: <MaterialIcon className={'text-content-secondary'} icon="local_offer" size={16} />, 
				render: (row) => (
					<Badge variant={row.type} icon={row.type}>
						{row.type.charAt(0).toUpperCase() + row.type.slice(1)}
					</Badge>
				)
			},
			{ key: 'address', header: 'Address', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="home_work" size={16} /> },
			{
				key: 'state',
				header: 'State',
				sortable: true,
				icon: <MaterialIcon className={'text-content-secondary'} icon="location_on" size={16} />,
				render: (row) => (
					<span>{stateAbbrToName[row.state] || row.state}</span>
				)
			},
			{ 
				key: 'status', 
				header: 'Status', 
				sortable: true, 
				icon: <MaterialIcon className={'text-content-secondary'} icon="flag" size={16} />,
				render: (row) => (
					<div className="flex items-center gap-2">
						<div className={cn(
							"flex items-center gap-2 font-medium",
							row.status === 'public' ? "text-green-700" : "text-red-700"
						)}>
							<span className={cn(
								"w-2 h-2 rounded-full",
								row.status === 'public' ? "bg-green-700" : "bg-red-700"
							)} />
							{row.status === 'public' ? 'Public' : 'Private'}
						</div>
					</div>
				)
			},
			{
				key: 'actions',
				header: '',
				render: (row) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 p-0"
							>
								<MaterialIcon icon="more_vert" size={20} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent 
							align="end" 
							className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg"
						>
							<DropdownMenuSub className="rounded-xl">
								<DropdownMenuSubTrigger className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors !hover:bg-red-50">
									Update Status
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg mr-2">
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											openStatusModal(row, 'public');
										}}
										className={cn(
											"flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
											row.status === 'public' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
										)}
									>
										<div className="flex items-center justify-between w-full gap-2">
											<span>Public</span>
											{row.status === 'public' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
										</div>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											openStatusModal(row, 'private');
										}}
										className={cn(
											"flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
											row.status === 'private' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
										)}
									>
										<div className="flex items-center justify-between gap-2 w-full">
											<span>Private</span>
											{row.status === 'private' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
										</div>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			}
		];

	const statusOptions = [
		{ value: 'public', label: 'Public' },
		{ value: 'private', label: 'Private' },
	];

	const typeOptions = [
		{ value: 'auto', label: 'Auto' },
		{ value: 'mortgage', label: 'Mortgage' },
		{ value: 'home', label: 'Home' },
	];

	const stateOptions = [
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

	const filters = [
		{
			key: 'type',
			label: 'Type',
			options: typeOptions,
			value: tableState.types,
			onChange: handleTypeChange,
			icon: 'local_offer',
			isMulti: true
		},
		{
			key: 'state',
			label: 'State',
			options: stateOptions,
			value: tableState.states,
			onChange: handleStateChange,
			icon: 'location_on',
			isMulti: true,
			hasSearch: true
		},
		{
			key: 'status',
			label: 'Status',
			options: statusOptions,
			value: tableState.statuses,
			onChange: handleStatusChange,
			icon: 'flag',
			isMulti: true
		}
	];

		// Auto-hide alert after 3 seconds
		useEffect(() => {
			if (alert.message) {
				const timer = setTimeout(() => setAlert({ type: '', message: '' }), 3000);
				return () => clearTimeout(timer);
			}
		}, [alert]);

		return (
			<div className="p-8 !bg-transparent">
				<Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
			   <div className="flex items-center justify-between mb-7 mt-0">
				   <h1 className="w-full font-bold text-[32px] leading-[32px] tracking-[-0.025em]">
					   All Leads
				   </h1>
			   </div>
			   <Table
				   columns={columns}
				   data={paginatedData}
				   loading={isLoading}
				   page={tableState.page}
				   pageSize={tableState.pageSize}
				   total={totalCount}
				   onPageChange={handlePageChange}
				   onPageSizeChange={(newPageSize) => {
					   setTableState(prev => ({
						   ...prev,
						   pageSize: newPageSize,
						   page: 1 // Reset to first page when changing page size
					   }));
				   }}
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
					   <span className=''>
						   Showing {paginatedData?.length || 0} of {totalCount || 0} results
					   </span>
				   }
				   paginationDelta={2}
			   />
			   {/* Confirm Modal for status change */}
			   <Modal
				   open={modalOpen}
				   onOpenChange={setModalOpen}
				   type={'confirm'}
				   title={`Change Status for ${modalLead?.name || 'Lead'}`}
				   content={`Are you sure you want to change status to "${modalStatus}" for this lead?`}
				   buttonText={modalStatus === 'private' ? 'Set Private' : 'Set Public'}
				   onConfirm={handleConfirmStatus}
				   loading={isUpdating}
			   />
		   </div>
	   );
};

export default AdminLeads;