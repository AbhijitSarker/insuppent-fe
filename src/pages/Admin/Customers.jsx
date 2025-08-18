import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsers, useUser } from '@/api/hooks/useUsers';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/button';
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



// Mock leads data based on the image
const mockLeads = [
	{
		id: 1,
		name: 'Kristin Watson',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'mortgage',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Arizona',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'active'
	},
	{
		id: 2,
		name: 'Dianne Russell',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'auto',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Alabama',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'refunded'
	},
	{
		id: 3,
		name: 'Brooklyn Simmons',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'home',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Connecticut',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'active'
	},
	{
		id: 4,
		name: 'Floyd Miles',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'home',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Arkansas',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'active'
	},
	{
		id: 5,
		name: 'Jacob Jones',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'mortgage',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Colorado',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'refunded'
	},
	{
		id: 6,
		name: 'Kathryn Murphy',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'auto',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Alaska',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'active'
	},
	{
		id: 7,
		name: 'Ronald Richards',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'auto',
		address: '1901 Thornridge Cir. Shiloh',
		state: 'Arizona',
		price: '$12.99',
		datePurchased: '13 June, 2025 4:30 pm',
		status: 'active'
	}
];


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

	// Get customer data from API
	const { data: customer, isLoading: isUserLoading, isError: isUserError } = useUser(customerId);

	// Filter and sort data based on active tab and filters
	const filteredAndSortedData = useMemo(() => {
		let filteredData = [...mockLeads];

		// Apply tab filter
		if (activeTab === 'active') {
			filteredData = filteredData.filter(lead => lead.status === 'active');
		} else if (activeTab === 'refunded') {
			filteredData = filteredData.filter(lead => lead.status === 'refunded');
		}

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
	}, [mockLeads, activeTab, tableState]);

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
		const allCount = mockLeads.length;
		const activeCount = mockLeads.filter(lead => lead.status === 'active').length;
		const refundedCount = mockLeads.filter(lead => lead.status === 'refunded').length;
		return { all: allCount, active: activeCount, refunded: refundedCount };
	}, []);

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
			render: () => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MaterialIcon icon="more_vert" size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem>
							<MaterialIcon icon="edit" size={16} className="mr-2" />
							Edit Lead
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MaterialIcon icon="visibility" size={16} className="mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<MaterialIcon icon="delete" size={16} className="mr-2" />
							Delete Lead
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const typeOptions = [
		{ value: 'Mortgage', label: 'Mortgage' },
		{ value: 'Auto', label: 'Auto' },
		{ value: 'Business', label: 'Business' },
		{ value: 'Life Insurance', label: 'Life Insurance' },
		{ value: 'Home', label: 'Home' },
	];

	const stateOptions = [
		{ value: 'Arizona', label: 'Arizona' },
		{ value: 'Alabama', label: 'Alabama' },
		{ value: 'Connecticut', label: 'Connecticut' },
		{ value: 'Arkansas', label: 'Arkansas' },
		{ value: 'Colorado', label: 'Colorado' },
		{ value: 'Alaska', label: 'Alaska' },
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
										{customer.subscription || 'Basic'}
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
							/>							)}
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
							/>							)}
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
							/>							)}
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