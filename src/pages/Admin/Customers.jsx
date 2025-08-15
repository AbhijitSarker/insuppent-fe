import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Mock customers data
const mockCustomers = [
	{
		id: 1,
		name: 'Courtney Henry',
		email: 'jessica.hanson@example.com',
		subscription: 'Basic',
		avatar: 'C'
	},
	{
		id: 2,
		name: 'Floyd Miles',
		email: 'floyd.miles@example.com',
		subscription: 'Basic',
		avatar: 'F'
	},
	{
		id: 3,
		name: 'Kristin Watson',
		email: 'kristin.watson@example.com',
		subscription: 'Basic',
		avatar: 'K'
	},
	{
		id: 4,
		name: 'Robert Fox',
		email: 'robert.fox@example.com',
		subscription: 'Basic',
		avatar: 'R'
	},
	{
		id: 5,
		name: 'Jane Cooper',
		email: 'jane.cooper@example.com',
		subscription: 'Basic',
		avatar: 'J'
	},
	{
		id: 6,
		name: 'Leslie Alexander',
		email: 'leslie.alexander@example.com',
		subscription: 'Basic',
		avatar: 'L'
	},
	{
		id: 7,
		name: 'Dianne Russell',
		email: 'dianne.russell@example.com',
		subscription: 'Basic',
		avatar: 'D'
	},
	{
		id: 8,
		name: 'Brooklyn Simmons',
		email: 'brooklyn.simmons@example.com',
		subscription: 'Basic',
		avatar: 'B'
	}
];

// Mock leads data based on the image
const mockLeads = [
	{
		id: 1,
		name: 'Kristin Watson',
		phone: '(217) 555-0113',
		email: 'debbie.baker@example.com',
		type: 'Mortgage',
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
		type: 'Auto',
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
		type: 'Business',
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
		type: 'Life Insurance',
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
		type: 'Home',
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
		type: 'Mortgage',
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
		type: 'Auto',
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
		pageSize: 13,
		sort: { key: 'name', direction: 'asc' },
		search: '',
		types: [],
		states: []
	});
	const [selectedRows, setSelectedRows] = useState([]);

	// Get customer data based on ID
	const customer = useMemo(() => {
		return mockCustomers.find(c => c.id === parseInt(customerId)) || mockCustomers[1]; // Default to Floyd Miles
	}, [customerId]);

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
			icon: <MaterialIcon className={'text-gray-500'} icon="person" size={16} />,
			render: (row) => (
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-900">{row.name}</span>
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
			icon: <MaterialIcon className={'text-gray-500'} icon="phone" size={16} />,
			render: (row) => (
				<span className="text-gray-600">{row.phone}</span>
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
			key: 'type',
			header: 'Type',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="local_offer" size={16} />,
			render: (row) => {
				const typeColors = {
					'Mortgage': 'bg-green-100 text-green-700',
					'Auto': 'bg-purple-100 text-purple-700',
					'Business': 'bg-orange-100 text-orange-700',
					'Life Insurance': 'bg-pink-100 text-pink-700',
					'Home': 'bg-green-100 text-green-700'
				};
				const iconMap = {
					'Life Insurance': 'person',
					'Home': 'home'
				};
				
				return (
					<Badge variant="secondary" className={typeColors[row.type]}>
						{iconMap[row.type] && (
							<MaterialIcon icon={iconMap[row.type]} size={12} className="mr-1" />
						)}
						{row.type}
					</Badge>
				);
			}
		},
		{
			key: 'address',
			header: 'Address',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="business" size={16} />,
			render: (row) => (
				<span className="text-gray-600">{row.address}</span>
			)
		},
		{
			key: 'state',
			header: 'State',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="location_on" size={16} />,
			render: (row) => (
				<span className="text-gray-600">{row.state}</span>
			)
		},
		{
			key: 'price',
			header: 'Price',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="attach_money" size={16} />,
			render: (row) => (
				<span className="font-medium text-gray-900">{row.price}</span>
			)
		},
		{
			key: 'datePurchased',
			header: 'Date purchased',
			sortable: true,
			icon: <MaterialIcon className={'text-gray-500'} icon="event" size={16} />,
			render: (row) => (
				<span className="text-gray-600">{row.datePurchased}</span>
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
		<div className="p-6">
			{/* Header with Back Navigation */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-6">
					<Button 
						variant="ghost" 
						size="icon" 
						className="h-8 w-8"
						onClick={handleBackClick}
					>
						<MaterialIcon icon="arrow_back" size={20} />
					</Button>
					<span className="text-sm text-gray-600">Back</span>
				</div>

				{/* User Profile Section */}
				<div className="flex items-center gap-4 mb-6">
					<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
						<span className="text-2xl font-bold text-blue-600">{customer.avatar}</span>
					</div>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
							<Badge variant="secondary" className="bg-gray-100 text-gray-700">
								{customer.subscription}
							</Badge>
						</div>
						<p className="text-gray-600">{customer.email}</p>
					</div>
				</div>

				{/* Lead Categories/Tabs */}
				<div className="flex space-x-8 border-b border-gray-200">
					<button
						onClick={() => setActiveTab('all')}
						className={cn(
							"pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
							activeTab === 'all'
								? "border-blue-600 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						)}
					>
						All leads ({tabCounts.all})
					</button>
					<button
						onClick={() => setActiveTab('active')}
						className={cn(
							"pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
							activeTab === 'active'
								? "border-blue-600 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						)}
					>
						Active leads ({tabCounts.active})
					</button>
					<button
						onClick={() => setActiveTab('refunded')}
						className={cn(
							"pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
							activeTab === 'refunded'
								? "border-blue-600 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						)}
					>
						Refunded leads ({tabCounts.refunded})
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
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