// Use a fixed palette of distinct pastel colors for avatars
const pastelPalette = [
	'#FFD6E0', '#FFECB3', '#B2EBF2', '#C8E6C9', '#D1C4E9', '#FFF9C4', '#F8BBD0', '#B3E5FC', '#DCEDC8', '#FFE0B2',
	'#E1BEE7', '#FFCCBC', '#C5CAE9', '#F0F4C3', '#B2DFDB', '#F5E1FD', '#E0F7FA', '#FFF3E0', '#E6EE9C', '#FCE4EC',
	'#E3F2FD', '#F9FBE7', '#FFDEEA', '#E0F2F1', '#F3E5F5', '#FFF8E1', '#E8F5E9', '#FBE9E7', '#EDE7F6', '#FFF0F6',
	'#F1F8E9', '#F0F4C3', '#E0F7FA', '#FFF3E0', '#E6EE9C', '#FCE4EC', '#F3E5F5', '#E1F5FE', '#FFF9C4', '#F8BBD0',
	'#B3E5FC', '#DCEDC8', '#FFE0B2', '#E1BEE7', '#FFCCBC', '#C5CAE9', '#F0F4C3', '#B2DFDB', '#F5E1FD', '#E0F7FA',
	'#FFF3E0', '#E6EE9C', '#FCE4EC', '#E3F2FD', '#F9FBE7', '#FFDEEA', '#E0F2F1', '#F3E5F5', '#FFF8E1', '#E8F5E9',
	'#FBE9E7', '#EDE7F6', '#FFF0F6', '#F1F8E9', '#F0F4C3', '#E0F7FA', '#FFF3E0', '#E6EE9C', '#FCE4EC'
];
function getRandomLightColor(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const idx = Math.abs(hash) % pastelPalette.length;
	return pastelPalette[idx];
}
import React, { useState, useMemo, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Alert from '@/components/ui/alert';
import { useUpdateUserStatus } from '@/api/hooks/useUpdateUserStatus';
import { useUsers } from '@/api/hooks/useUsers';
import { Link, useNavigate } from 'react-router-dom';
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
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";




const Settings = () => {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('customers');
   const [tableState, setTableState] = useState({
	   page: 1,
	   pageSize: 10,
	   sort: { key: 'name', direction: 'asc' },
	   search: '',
	   statuses: []
   });
	const [selectedRows, setSelectedRows] = useState([]);
	// Modal state for status change
	const [modalOpen, setModalOpen] = useState(false);
	const [modalUser, setModalUser] = useState(null);
	const [modalStatus, setModalStatus] = useState(null);
	// Alert state
	const [alert, setAlert] = useState({ type: '', message: '' });
	const updateUserStatus = useUpdateUserStatus();
   const { data: users = [], isLoading } = useUsers();


	   // Filter and sort data on frontend
	   const filteredAndSortedData = useMemo(() => {
		   let filteredData = Array.isArray(users) ? [...users] : [];

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
	   }, [users, tableState]);


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
		 const openStatusModal = (user, status) => {
			 setModalUser(user);
			 setModalStatus(status);
			 setModalOpen(true);
		 };

		 const handleConfirmStatus = async () => {
			 if (!modalUser || !modalStatus) return;
			 try {
				 await updateUserStatus.mutateAsync({ id: modalUser.id, status: modalStatus });
				 setModalOpen(false);
				 setModalUser(null);
				 setModalStatus(null);
				 setAlert({ type: 'success', message: 'User status updated successfully!' });
			 } catch (error) {
				 setAlert({ type: 'error', message: 'Failed to update user status.' });
			 }
		 };

		 useEffect(() => {
			 if (alert.message) {
				 const timer = setTimeout(() => setAlert({ type: '', message: '' }), 3000);
				 return () => clearTimeout(timer);
			 }
		 }, [alert]);

		 const columns = [
		   {
			   key: 'customer',
			   header: 'Customer',
			   sortable: true,
			   icon: <MaterialIcon className={'text-content-secondary'} icon="group" size={16} />, 
			   render: (row) => (
				<Link to={`/admin/customers/${row.id}`}>
				   <div className="flex items-center gap-3">
										 <div
											 className="w-8 h-8 rounded-full flex items-center justify-center"
											 style={{ backgroundColor: getRandomLightColor(row.name || row.id || "avatar") }}
										 >
												 <span className="text-sm font-semibold text-content-brand">{row.avatar || (row.name ? row.name[0] : '')}</span>
										 </div>
					   <button
						   className="font-medium text-content-primary hover:text-content-brand hover:underline transition-colors text-left"
						   >
						   {row.name}
					   </button>
				   </div>
						   </Link>
			   )
		   },
		   {
			   key: 'email',
			   header: 'Email',
			   sortable: true,
			   icon: <MaterialIcon className={'text-content-secondary'} icon="email" size={16} />, 
			   render: (row) => (
				   <span className="font-normal text-content-primary">{row.email}</span>
			   )
		   },
		   {
			   key: 'subscription',
			   header: 'Subscription',
			   sortable: true,
			   icon: <MaterialIcon className={'text-content-secondary'} icon="diamond" size={16} />, 
			   render: (row) => (
				   <span className="font-normal text-content-primary">{row.subscription || 'Basic'}</span>
			   )
		   },
		   {
			   key: 'purchased',
			   header: 'Purchased',
			   sortable: true,
			   icon: <MaterialIcon className={'text-content-secondary'} icon="shopping_cart" size={16} />, 
			   render: (row) => (
				   <span className="font-normal text-content-primary">{row.purchased ?? 0}</span>
			   )
		   },
		   {
			   key: 'refunded',
			   header: 'Refunded',
			   sortable: true,
			   icon: <MaterialIcon className={'text-content-secondary'} icon="currency_exchange" size={16} />, 
			   render: (row) => (
				   <span className="font-normal text-content-primary">{row.refunded ?? 0}</span>
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
						   "w-2 h-2 rounded-full",
						   row.status === 'active' ? "bg-green-700" : "bg-red-700"
					   )} />
					   <span className={cn(
						   "text-sm font-medium",
						   row.status === 'active' ? "text-green-700" : "text-red-700"
					   )}>
						   {row.status === 'active' ? 'Enabled' : 'Disabled'}
					   </span>
				   </div>
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
					   <DropdownMenuContent align="end" className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg">
						   <DropdownMenuSub className="rounded-xl">
							   <DropdownMenuSubTrigger className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors !hover:bg-red-50">
								   Update Status
							   </DropdownMenuSubTrigger>
							   <DropdownMenuSubContent className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg mr-2">
								   <DropdownMenuItem
									   onClick={(e) => {
										   e.stopPropagation();
										   openStatusModal(row, 'active');
									   }}
									   className={cn(
										   "flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
										   row.status === 'active' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
									   )}
								   >
									   <div className="flex items-center justify-between w-full gap-2">
										   <span>Enabled</span>
										   {row.status === 'active' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
									   </div>
								   </DropdownMenuItem>
								   <DropdownMenuItem
									   onClick={(e) => {
										   e.stopPropagation();
										   openStatusModal(row, 'inactive');
									   }}
									   className={cn(
										   "flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
										   row.status === 'inactive' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
									   )}
								   >
									   <div className="flex items-center justify-between gap-2 w-full">
										   <span>Disabled</span>
										   {row.status === 'inactive' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
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
		   <div className="p-8">
			   <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
			   {/* Header */}
			   <div className="flex items-center justify-between mb-6 mt-0">
				   <h1 className="w-full font-bold text-[32px] leading-[32px] tracking-[-0.025em]">
					   Settings
				   </h1>
			   </div>
			   <div>               
					  {/* Navigation Tabs */}
					  <div className="flex h-[46px] border-b border-borderColor-primary mb-0">
						  <button
							  onClick={() => setActiveTab('customers')}
							  className={cn(
								  "relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-5 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
								  activeTab === 'customers'
									  ? "text-content-brand"
									  : "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
							  )}
							  style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
						  >
							  Customers
							  {activeTab === 'customers' && (
							   <span
								   className={cn(
									   "absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand",
								   )}
							   />
							  )}
						  </button>
						  <button
							  onClick={() => setActiveTab('pricing')}
							  className={cn(
								  "relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors",
								  activeTab === 'pricing'
									  ? "text-content-brand"
									  : "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
						   )}
						   style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					   >
						   Pricing plans
						   {activeTab === 'pricing' && (
							   <span
								   className={cn(
									   "absolute left-0 rounded-full -bottom-[2px] w-full h-[2px] bg-bg-brand",
								   )}
							   />
						   )}
					   </button>
					  </div>
			   </div>

			   {/* Customers Tab Content */}
			   {activeTab === 'customers' && (
				   <div>
					   <div className="flex items-center justify-between mt-[22px] mb-5">
						   <h2 className="text-2xl font-semibold text-content-primary">Customers</h2>
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
					   {/* Confirm Modal for status change */}
					   <Modal
						   open={modalOpen}
						   onOpenChange={setModalOpen}
						   type={`${modalStatus === 'inactive' ? 'delete' : 'confirm'}`}
						   title={`${modalStatus === 'inactive' ? 'Disable' : 'Enable'} purchase ability?`}
						   content={`Are you sure you want to ${modalStatus === 'inactive' ? 'disable' : 'enable'} purchase ability for ${modalUser?.name}?`}
						   buttonText={modalStatus === 'inactive' ? 'Set Disabled' : 'Set Enabled'}
						   onConfirm={handleConfirmStatus}
						   loading={updateUserStatus.isLoading}
					   />
				   </div>
			   )}

			   {/* Pricing Plans Tab Content */}
			   {activeTab === 'pricing' && (
				   <div className="text-center py-12">
					   <MaterialIcon icon="pricing" size={48} className="mx-auto text-gray-400 mb-4" />
					   <h3 className="text-lg font-medium text-content-primary mb-2">Pricing Plans</h3>
					   <p className="text-content-secondary">Pricing plans management coming soon...</p>
				   </div>
			   )}
		   </div>
	   );
};

export default Settings;