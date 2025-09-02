import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers, useUser } from '@/api/hooks/useUsers';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/button';
import { useUserPurchasedLeads } from '@/api/hooks/useLeads';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MaterialIcon from '@/components/ui/MaterialIcon';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { markLeadUserRefunded } from '@/api/services/purchaseService.js';

const Customers = () => {
	const navigate = useNavigate();
	const { customerId } = useParams();
	const [activeTab, setActiveTab] = useState('all');
	const [tableState, setTableState] = useState({
		page: 1,
		pageSize: 10,
		sort: { key: 'name', direction: 'asc' },
		search: '',
		types: [],
		states: []
	});
	const [selectedRows, setSelectedRows] = useState([]);
	const [isRefunding, setIsRefunding] = useState(false);

	// Get customer data from API
	const { data: customer, isLoading: isUserLoading, isError: isUserError } = useUser(customerId);
	// Get purchased leads for this customer
	const { data: purchasedLeadsData, isLoading: isLeadsLoading, isError: isLeadsError, refetch } = useUserPurchasedLeads(customerId);
	const purchasedLeads = purchasedLeadsData?.data || [];

	// Filter and sort data based on active tab and filters
	const filteredAndSortedData = useMemo(() => {
		let filteredData = [...purchasedLeads];

		// Tab filter
		if (activeTab === 'active') {
			filteredData = filteredData.filter(lead => !lead.isRefunded);
		} else if (activeTab === 'refunded') {
			filteredData = filteredData.filter(lead => lead.isRefunded);
		}

		// Search filter
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

		// Type filter
		if (tableState.types.length > 0) {
			filteredData = filteredData.filter(lead =>
				tableState.types.includes(lead.type)
			);
		}

		// State filter
		if (tableState.states.length > 0) {
			filteredData = filteredData.filter(lead =>
				tableState.states.includes(lead.state)
			);
		}

		// Sorting
		if (tableState.sort.key) {
			filteredData.sort((a, b) => {
				let aVal = a[tableState.sort.key];
				let bVal = b[tableState.sort.key];
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
	}, [purchasedLeads, activeTab, tableState]);

	// Paginate the filtered data
	const paginatedData = useMemo(() => {
		const startIndex = (tableState.page - 1) * tableState.pageSize;
		const endIndex = startIndex + tableState.pageSize;
		return filteredAndSortedData.slice(startIndex, endIndex);
	}, [filteredAndSortedData, tableState.page, tableState.pageSize]);

	// Calculate total count for pagination
	const totalCount = filteredAndSortedData.length;

	// Calculate counts for each tab
	const tabCounts = useMemo(() => {
		const allCount = purchasedLeads.length;
		const activeCount = purchasedLeads.filter(lead => !lead.isRefunded).length;
		const refundedCount = purchasedLeads.filter(lead => lead.isRefunded).length;
		return { all: allCount, active: activeCount, refunded: refundedCount };
	}, [purchasedLeads]);

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

	// Handler for marking a lead as refunded
	const handleMarkAsRefunded = async (leadId) => {
		setIsRefunding(true);
		try {
			await markLeadUserRefunded(leadId, true);
			// Refetch leads to update datatable
			refetch && refetch();
		} catch (err) {
			// Optionally show error
			console.error('Failed to mark as refunded', err);
		} finally {
			setIsRefunding(false);
		}
	};

	// Table columns configuration
	const columns = [
		{
			key: 'name',
			header: 'Full name',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="group" size={16} />,
			render: (row) => (
				<div className="flex items-center gap-2">
					<span className="font-medium text-content-primary">{row.name}</span>
					{row.status === 'refunded' && (
						<Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
							Refunded
						</Badge>
					)}
				</div>
			)
		},
		{
			key: 'phone',
			header: 'Phone',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="phone" size={16} />,
			render: (row) => (
				<span className="text-content-primary">{row.phone}</span>
			)
		},
		{
			key: 'email',
			header: 'Email',
			sortable: true,
			value: row => row.email,
			icon: <MaterialIcon className={'text-content-secondary'} icon="email" size={16} />,
		},
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
		{
			key: 'address',
			header: 'Address',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="business" size={16} />,
			render: (row) => (
				<span className="text-content-primary">{row.address}</span>
			)
		},
		{
			key: 'state',
			header: 'State',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="location_on" size={16} />,
			render: (row) => (
				<span className="text-content-primary">{row.state}</span>
			)
		},
		// {
		// 	key: 'price',
		// 	header: 'Price',
		// 	sortable: true,
		// 	icon: <MaterialIcon className={'text-content-secondary'} icon="attach_money" size={16} />,
		// 	render: (row) => (
		// 		<span className="font-medium text-content-primary">{row.price}</span>
		// 	)
		// },
		{
			key: 'datePurchased',
			header: 'Date purchased',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="event" size={16} />,
			render: (row) => (
				<span className="text-content-primary">{row.datePurchased}</span>
			)
		},
		{
			key: 'actions',
			header: '',
			render: (row) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MaterialIcon icon="more_vert" size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						{!row.isRefunded ? (
							<DropdownMenuItem
								onClick={() => handleMarkAsRefunded(row.id)}
								disabled={isRefunding}
								className="text-blue-600"
							>
								<MaterialIcon icon="undo" size={16} className="mr-2" />
								Mark as refunded
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem
								onClick={() => handleMarkAsRefunded(row.id)}
								disabled={isRefunding}
								className="text-red-600"
							>
								<MaterialIcon icon="redo" size={16} className="mr-2" />
								Mark as not refunded
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const typeOptions = [
		{ value: 'mortgage', label: 'Mortgage' },
		{ value: 'auto', label: 'Auto' },
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
		}
	];

	// Handle back navigation
	const handleBackClick = () => {
		navigate('/admin/settings');
	};

	return (
		<div className="">
			{/* Header with Back Navigation */}
			<div className="bg-bg-primary px-6 pt-6 border-b border-borderColor-primary">
				<div className="flex items-center gap-2 p-3 w-[90px] h-9 rounded-lg hover:bg-bg-tertiary" onClick={handleBackClick}>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"

					>
						<MaterialIcon icon="arrow_back" size={20} />
					</Button>
					<span className="text-sm text-content-primary font-semibold">Back</span>
				</div>

				{/* User Profile Section */}
				{isUserLoading ? (
					<div className="flex items-center gap-4 my-6">
						<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse" />
						<div>
							<div className="h-6 w-32 bg-bg-tertiary rounded mb-2 animate-pulse" />
							<div className="h-4 w-48 bg-bg-tertiary rounded animate-pulse" />
						</div>
					</div>
				) : isUserError ? (
					<div className="text-red-500 my-6">Customer not found.</div>
				) : customer ? (
					<div className="flex items-center gap-4 my-6">
						<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
							<span className="text-2xl font-bold text-content-brand">{customer.avatar || (customer.name ? customer.name[0] : '')}</span>
						</div>
						<div>
							<div className="flex items-center gap-4 justify-between">
								<h1 className="text-3xl font-semibold text-content-primary leading-9 tracking-[-0.025em]">{customer.name}</h1>
								<Badge variant="secondary" className="bg-gray-100 text-gray-700">
									{customer.subscription || 'Subscriber'}
								</Badge>
							</div>
							<p className="text-gray-600 ">{customer.email}</p>
						</div>
					</div>
				) : null}

				{/* Lead Categories/Tabs */}
				<div className="flex h-[46px] border-borderColor-primary mb-0">
					<button
						onClick={() => setActiveTab('all')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-5 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
							activeTab === 'all'
								? "text-content-brand"
								: "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
						)}
						style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					>
						All leads ({tabCounts.all})
						{activeTab === 'all' && (
							<span
								className={cn(
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand",
								)}
							/>)}
					</button>
					<button
						onClick={() => setActiveTab('active')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
							activeTab === 'active'
								? "text-content-brand"
								: "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
						)}
						style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					>
						Active leads ({tabCounts.active})
						{activeTab === 'active' && (
							<span
								className={cn(
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand",
								)}
							/>)}
					</button>
					<button
						onClick={() => setActiveTab('refunded')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
							activeTab === 'refunded'
								? "text-content-brand"
								: "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
						)}
						style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					>
						Refunded leads ({tabCounts.refunded})
						{activeTab === 'refunded' && (
							<span
								className={cn(
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand",
								)}
							/>)}
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='p-6 pt-0'>
				<div className="flex items-center justify-between mt-[18px] mb-5">
					<h2 className="text-xl font-semibold text-content-primary">
						{activeTab === 'all' ? 'All leads' :
							activeTab === 'active' ? 'Active leads' : 'Refunded leads'}
					</h2>
				</div>

				{/* Leads Table */}
				<Table
					columns={columns}
					data={paginatedData}
					page={tableState.page}
					pageSize={tableState.pageSize}
					total={totalCount}
					onPageChange={handlePageChange}
					onPageSizeChange={(newPageSize) => {
						setTableState(prev => ({
							...prev,
							pageSize: newPageSize,
							page: 1
						}));
					}}
					onSortChange={handleSortChange}
					sort={tableState.sort}
					search={tableState.search}
					onSearch={handleSearch}
					rowSelection={true}
					selectedRows={selectedRows}
					onRowSelect={handleRowSelect}
					onSelectAll={handleSelectAll}
					filters={filters}
				/>
			</div>
		</div>
	);
};

export default Customers;