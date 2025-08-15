import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Mock customer data based on the image
const mockCustomers = [
	{
		id: 1,
		name: 'Courtney Henry',
		email: 'jessica.hanson@example.com',
		subscription: 'Basic',
		purchased: 145,
		refunded: 1,
		status: 'enabled',
		avatar: 'C'
	},
	{
		id: 2,
		name: 'Floyd Miles',
		email: 'floyd.miles@example.com',
		subscription: 'Basic',
		purchased: 112,
		refunded: 0,
		status: 'enabled',
		avatar: 'F'
	},
	{
		id: 3,
		name: 'Kristin Watson',
		email: 'kristin.watson@example.com',
		subscription: 'Basic',
		purchased: 98,
		refunded: 2,
		status: 'enabled',
		avatar: 'K'
	},
	{
		id: 4,
		name: 'Robert Fox',
		email: 'robert.fox@example.com',
		subscription: 'Basic',
		purchased: 67,
		refunded: 5,
		status: 'disabled',
		avatar: 'R'
	},
	{
		id: 5,
		name: 'Jane Cooper',
		email: 'jane.cooper@example.com',
		subscription: 'Basic',
		purchased: 89,
		refunded: 3,
		status: 'disabled',
		avatar: 'J'
	},
	{
		id: 6,
		name: 'Leslie Alexander',
		email: 'leslie.alexander@example.com',
		subscription: 'Basic',
		purchased: 156,
		refunded: 8,
		status: 'disabled',
		avatar: 'L'
	},
	{
		id: 7,
		name: 'Dianne Russell',
		email: 'dianne.russell@example.com',
		subscription: 'Basic',
		purchased: 134,
		refunded: 1,
		status: 'enabled',
		avatar: 'D'
	},
	{
		id: 8,
		name: 'Brooklyn Simmons',
		email: 'brooklyn.simmons@example.com',
		subscription: 'Basic',
		purchased: 78,
		refunded: 0,
		status: 'enabled',
		avatar: 'B'
	}
];

const Settings = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('customers');
	const [tableState, setTableState] = useState({
		page: 1,
		pageSize: 13,
		sort: { key: 'name', direction: 'asc' },
		search: '',
		statuses: []
	});
	const [selectedRows, setSelectedRows] = useState([]);

	// Filter and sort data on frontend
	const filteredAndSortedData = useMemo(() => {
		let filteredData = [...mockCustomers];

		// Apply search filter
		if (tableState.search) {
			const searchTerm = tableState.search.toLowerCase();
			filteredData = filteredData.filter(customer =>
				customer.name?.toLowerCase().includes(searchTerm) ||
				customer.email?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply status filter
		if (tableState.statuses.length > 0) {
			filteredData = filteredData.filter(customer =>
				tableState.statuses.includes(customer.status)
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
	}, [tableState]);

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

	const handleStatusChange = (values) => {
		setTableState(prev => ({ 
			...prev, 
			statuses: values === '__ALL__' ? [] : Array.isArray(values) ? values : [values],
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

	// Handle customer name click
	const handleCustomerClick = (customerId) => {
		navigate(`/admin/customers/${customerId}`);
	};

	// Table columns configuration
	const columns = [
		{
			key: 'customer',
			header: 'Customer',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="person" size={16} />,
			render: (row) => (
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
						<span className="text-sm font-semibold text-blue-600">{row.avatar}</span>
					</div>
					<button
						onClick={() => handleCustomerClick(row.id)}
						className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors text-left"
					>
						{row.name}
					</button>
				</div>
			)
		},
		{
			key: 'email',
			header: 'Email',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="email" size={16} />,
			render: (row) => (
				<span className="text-gray-600">{row.email}</span>
			)
		},
		{
			key: 'subscription',
			header: 'Subscription',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="subscriptions" size={16} />,
			render: (row) => (
				<Badge variant="secondary" className="bg-gray-100 text-gray-700">
					{row.subscription}
				</Badge>
			)
		},
		{
			key: 'purchased',
			header: 'Purchased',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="shopping_cart" size={16} />,
			render: (row) => (
				<span className="font-medium text-gray-900">{row.purchased}</span>
			)
		},
		{
			key: 'refunded',
			header: 'Refunded',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="money_off" size={16} />,
			render: (row) => (
				<span className="font-medium text-gray-900">{row.refunded}</span>
			)
		},
		{
			key: 'status',
			header: 'Status',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="flag" size={16} />,
			render: (row) => (
				<div className="flex items-center gap-2">
					<div className={cn(
						"w-2 h-2 rounded-full",
						row.status === 'enabled' ? "bg-green-700" : "bg-red-700"
					)} />
					<span className={cn(
						"text-sm font-medium",
						row.status === 'enabled' ? "text-green-700" : "text-red-700"
					)}>
						{row.status === 'enabled' ? 'Enabled' : 'Disabled'}
					</span>
				</div>
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
							Edit Customer
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MaterialIcon icon="visibility" size={16} className="mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<MaterialIcon icon="delete" size={16} className="mr-2" />
							Delete Customer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	];

	const statusOptions = [
		{ value: 'enabled', label: 'Enabled' },
		{ value: 'disabled', label: 'Disabled' },
	];

	const filters = [
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

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6 mt-0">
				<h1 className="w-full font-bold text-[32px] leading-[32px] tracking-[-0.025em]">
					Settings
				</h1>
			</div>
			<div>				
				   {/* Navigation Tabs */}
				   <div className="flex space-x-3 h-[46px] border-b border-gray-200 mb-0">
					   <button
						   onClick={() => setActiveTab('customers')}
						   className={cn(
							   "relative flex items-center px-6 py-2 text-sm font-semibold leading-[20px] border-b-2 transition-colors",
							   activeTab === 'customers'
								   ? "border-blue-600 text-blue-600"
								   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						   )}
						   style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					   >
						   Customers
						   {activeTab === 'customers' && (
							   <span className="absolute left-0 -bottom-[2px] w-full h-[3px] bg-blue-600 rounded-t" />
						   )}
					   </button>
					   <button
						   onClick={() => setActiveTab('pricing')}
						   className={cn(
							   "relative flex items-center px-6 py-2 text-sm font-semibold leading-[20px] border-b-2 transition-colors",
							   activeTab === 'pricing'
								   ? "border-blue-600 text-blue-600"
								   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						   )}
						   style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					   >
						   Pricing plans
						   {activeTab === 'pricing' && (
							   <span className="absolute left-0 -bottom-[2px] w-full h-[3px] bg-blue-600 rounded-t" />
						   )}
					   </button>
				   </div>
			</div>

			{/* Customers Tab Content */}
			{activeTab === 'customers' && (
				<div>
					<div className="flex items-center justify-between mt-[22px] mb-5">
						<h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
					</div>

					{/* Customer Table */}
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
			)}

			{/* Pricing Plans Tab Content */}
			{activeTab === 'pricing' && (
				<div className="text-center py-12">
					<MaterialIcon icon="pricing" size={48} className="mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">Pricing Plans</h3>
					<p className="text-gray-500">Pricing plans management coming soon...</p>
				</div>
			)}
		</div>
	);
};

export default Settings;