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
import axios from 'axios';
import { useBrandColor } from '@/contexts/BrandColorContext';
import { getLeadMembershipMaxSaleCounts, updateLeadMembershipMaxSaleCount } from '@/api/services/leadMembershipService';
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
import { axiosSecure } from '@/api/axios/config';

const Settings = () => {
	// Pricing plans state and handlers
	const [pricingPlans, setPricingPlans] = useState([]);
	const [loadingPricing, setLoadingPricing] = useState(false);
	const [editCountModal, setEditCountModal] = useState({ open: false, plan: null, count: '' });
	const [editCountLoading, setEditCountLoading] = useState(false);

	// Fetch pricing plans (lead sale counts) from API
	useEffect(() => {
		const fetchPlans = async () => {
			setLoadingPricing(true);
			try {
				const data = await getLeadMembershipMaxSaleCounts();
				setPricingPlans(data.map(item => ({
					name: item.membership.charAt(0).toUpperCase() + item.membership.slice(1),
					membership: item.membership,
					leadCount: item.maxLeadSaleCount,
				})));
			} catch (e) {
				setAlert({ type: 'error', message: 'Failed to fetch lead sale counts.' });
			} finally {
				setLoadingPricing(false);
			}
		};
		fetchPlans();
	}, []);

	// Pricing table columns
	const pricingColumns = [
		{
			key: 'name',
			header: 'Membership',
			sortable: false,
			render: (row) => (<span className="font-medium text-content-primary">{row.name}</span>),
		},
		{
			key: 'leadCount',
			header: 'Lead sale count',
			sortable: false,
			render: (row) => (<span className="text-content-primary">{row.leadCount}</span>),
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
					<DropdownMenuContent align="end" className="w-[160px] sm:w-[180px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg">
						<DropdownMenuItem
							onClick={() => setEditCountModal({ open: true, plan: row, count: row.leadCount })}
							className="flex cursor-pointer items-center rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm outline-none transition-colors hover:bg-bg-tertiary"
						>
							Edit Lead Sale Count
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	// Save lead sale count
	const handleSaveLeadCount = async () => {
		if (!editCountModal.plan) return;
		setEditCountLoading(true);
		try {
			await updateLeadMembershipMaxSaleCount(editCountModal.plan.membership, Number(editCountModal.count));
			setPricingPlans(plans => plans.map(p =>
				p.membership === editCountModal.plan.membership
					? { ...p, leadCount: Number(editCountModal.count) }
					: p
			));
			setEditCountModal({ open: false, plan: null, count: '' });
			setAlert({ type: 'success', message: `[${editCountModal.plan.name}] lead sale count updated.` });
		} catch (e) {
			setAlert({ type: 'error', message: 'Failed to update lead sale count.' });
		} finally {
			setEditCountLoading(false);
		}
	};
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('customers');
	// Appearance tab state
	const { brandColor, setBrandColor } = useBrandColor();
	const [initialBrandColor, setInitialBrandColor] = useState(brandColor);
	const [brandColorLoading, setBrandColorLoading] = useState(false);
	const [brandColorSaving, setBrandColorSaving] = useState(false);
	// Fetch brand color from backend
	useEffect(() => {
		const fetchBrandColor = async () => {
			setBrandColorLoading(true);
			try {
				const res = await axiosSecure.get('/settings/brand-color');
				const color = res.data.brandColor || '#2563EB';
				setBrandColor(color);
				setInitialBrandColor(color);
			} catch (e) {
				setBrandColor('#2563EB');
				setInitialBrandColor('#2563EB');
			} finally {
				setBrandColorLoading(false);
			}
		};
		fetchBrandColor();
	}, []);

	// Save brand color to backend
	const handleSaveBrandColor = async () => {
		setBrandColorSaving(true);
		try {
			await axiosSecure.put('/settings/brand-color', { brandColor });
			setAlert({ type: 'success', message: 'Brand color updated.' });
		} catch (e) {
			setAlert({ type: 'success', message: 'Brand color updated.' });
		} finally {
			setBrandColorSaving(false);
		}
	};
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
					<div className="flex items-center gap-2 sm:gap-3">
						<div
							className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm"
							style={{ backgroundColor: getRandomLightColor(row.name || row.id || "avatar") }}
						>
							<span className="font-semibold text-content-primary">{row.avatar || (row.name ? row.name[0] : '')}</span>
						</div>
						<button
							className="font-medium text-content-primary hover:text-content-brand hover:underline transition-colors text-left text-xs sm:text-sm"
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
				<span className="font-normal text-content-primary text-xs sm:text-sm">{row.email}</span>
			)
		},
		{
			key: 'subscription',
			header: 'Subscription',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="diamond" size={16} />,
			render: (row) => (
				<span className="font-normal text-content-primary text-xs sm:text-sm">{row.subscription || 'Subscriber'}</span>
			)
		},
		{
			key: 'purchased',
			header: 'Purchased',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="shopping_cart" size={16} />,
			render: (row) => (
				<span className="font-normal text-content-primary text-xs sm:text-sm">{row.purchased ?? 0}</span>
			)
		},
		{
			key: 'refunded',
			header: 'Refunded',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="currency_exchange" size={16} />,
			render: (row) => (
				<span className="font-normal text-content-primary text-xs sm:text-sm">{row.refunded ?? 0}</span>
			)
		},
		{
			key: 'status',
			header: 'Status',
			sortable: true,
			icon: <MaterialIcon className={'text-content-secondary'} icon="flag" size={16} />,
			render: (row) => (
				<div className="flex items-center gap-1 sm:gap-2">
					<div className={cn(
						"w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
						row.status === 'active' ? "bg-green-700" : "bg-red-700"
					)} />
					<span className={cn(
						"text-xs sm:text-sm font-medium",
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
						<Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
							<MaterialIcon icon="more_vert" size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[140px] sm:w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg">
						<DropdownMenuSub className="rounded-xl">
							<DropdownMenuSubTrigger className="flex cursor-pointer items-center rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition-colors !hover:bg-red-50">
								Update Status
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-[140px] sm:w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg mr-2">
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										openStatusModal(row, 'active');
									}}
									className={cn(
										"flex cursor-pointer items-center rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition-colors",
										row.status === 'active' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
									)}
								>
									<div className="flex items-center justify-between w-full gap-2">
										<span>Enabled</span>
										{row.status === 'active' ? <MaterialIcon icon="check" size={16} sm:size={20} className={'text-content-brand'} /> : <></>}
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										openStatusModal(row, 'inactive');
									}}
									className={cn(
										"flex cursor-pointer items-center rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition-colors",
										row.status === 'inactive' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
									)}
								>
									<div className="flex items-center justify-between gap-2 w-full">
										<span>Disabled</span>
										{row.status === 'inactive' ? <MaterialIcon icon="check" size={16} sm:size={20} className={'text-content-brand'} /> : <></>}
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
		{ value: 'active', label: 'Enabled' },
		{ value: 'inactive', label: 'Disabled' },
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
		<div className="p-4 md:p-6 lg:p-8" style={{ '--brand-color': brandColor }}>
			<Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
			{/* Header */}
			<div className="flex items-center justify-between mb-4 md:mb-6 mt-0">
				<h1 className="w-full font-bold text-2xl md:text-[32px] leading-[1.2] md:leading-[32px] tracking-[-0.025em]">
					Settings
				</h1>
			</div>
			<div>
				{/* Navigation Tabs */}
				<div className="flex flex-wrap h-auto md:h-[46px] border-b border-borderColor-primary mb-0 overflow-x-auto">
					<button
						onClick={() => setActiveTab('customers')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors whitespace-nowrap",
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
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px]",
								)}
								style={{ backgroundColor: 'var(--brand-color)' }}
							/>
						)}
					</button>
					<button
						onClick={() => setActiveTab('pricing')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors whitespace-nowrap",
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
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px]",
								)}
								style={{ backgroundColor: 'var(--brand-color)' }}
							/>
						)}
					</button>
					<button
						onClick={() => setActiveTab('appearance')}
						className={cn(
							"relative text-content-primary flex h-[46px] items-center px-2 pt-2 pb-4 text-sm font-semibold border-b-2 border-transparent leading-[20px] transition-colors whitespace-nowrap",
							activeTab === 'appearance'
								? "text-content-brand"
								: "text-content-primary hover:border-b-2 hover:border-borderColor-primary"
						)}
						style={{ fontFamily: 'Inter, sans-serif', letterSpacing: 0 }}
					>
						Appearance
						{activeTab === 'appearance' && (
							<span
								className={cn(
									"absolute left-0 rounded-full -bottom-[2px] w-full h-[2px]",
								)}
								style={{ backgroundColor: 'var(--brand-color)' }}
							/>
						)}
					</button>
				</div>
			</div>
			{/* Appearance Tab Content */}
			{activeTab === 'appearance' && (
				<div className="mt-4 md:mt-[22px]">
					<h2 className="text-xl md:text-2xl font-semibold text-content-primary mb-4 md:mb-6">Appearance</h2>
					<div className="bg-bg-primary rounded-2xl border border-borderColor-primary px-4 md:px-6 py-4 md:py-5">
						<div className="space-y-5">
							<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8 xl:gap-12">
								<div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 lg:gap-12 xl:gap-32">
									<div className="space-y-1">
										<h3 className="text-sm font-semibold text-black">Brand Color</h3>
										<p className="text-sm text-content-primary">Select or customize your brand color</p>
									</div>

									<div className="flex justify-start gap-3 mt-2">
										<div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden bg-white relative">
											<input
												type="color"
												value={brandColor}
												onChange={e => setBrandColor(e.target.value)}
												className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
											/>
											<div
												className="w-full h-full"
												style={{ backgroundColor: brandColor }}
											/>
										</div>
										<input
											type="text"
											value={brandColor.toUpperCase()}
											onChange={e => setBrandColor(e.target.value)}
											className="w-[100px] h-8 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-content-brand focus:border-transparent"
										/>
									</div>
								</div>

								<div className="flex items-center justify-end gap-3 mt-4 md:mt-16 lg:mt-24">
									<button
										type="button"
										className="h-9 px-3 sm:px-4 text-sm font-medium text-gray-700 hover:text-gray-800 rounded-lg border transition-colors"
										onClick={() => setBrandColor('#2563EB')}
									>
										Cancel
									</button>
									<button
										onClick={handleSaveBrandColor}
										disabled={brandColor === initialBrandColor}
										className={`relative h-9 px-3 sm:px-4 text-sm font-medium text-white rounded-lg transition-colors overflow-hidden ${brandColor === initialBrandColor
												? 'bg-gray-400 cursor-not-allowed'
												: 'bg-[var(--brand-color)]'
											}`}
										style={{ '--brand-color': brandColor }}
									>
										<span className="relative z-10">Save changes</span>
										<span
											className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ${brandColor !== initialBrandColor && 'hover:bg-opacity-20'
												}`}
										></span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}			{/* Customers Tab Content */}
			{activeTab === 'customers' && (
				<div>
					<div className="flex items-center justify-between mt-4 md:mt-[22px] mb-3 md:mb-5">
						<h2 className="text-xl md:text-2xl font-semibold text-content-primary">Customers</h2>
					</div>

					{/* Customer Table */}
					<div className="overflow-x-auto">
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
							rowSelection={false}
							selectedRows={selectedRows}
							onRowSelect={handleRowSelect}
							onSelectAll={handleSelectAll}
							filters={filters}
						/>
					</div>
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
				<div>
					<div className="flex items-center justify-between mt-4 md:mt-[22px] mb-3 md:mb-5">
						<h2 className="text-xl md:text-2xl font-semibold text-content-primary">Pricing Plan</h2>
					</div>
					<div className="overflow-x-auto">
						<Table
							columns={pricingColumns}
							data={pricingPlans}
							page={1}
							pageSize={10}
							total={pricingPlans.length}
							onPageChange={() => { }}
							onPageSizeChange={() => { }}
							onSortChange={() => { }}
							sort={{ key: '', direction: 'asc' }}
							search={''}
							onSearch={() => { }}
							rowSelection={false}
							selectedRows={[]}
							onRowSelect={() => { }}
							onSelectAll={() => { }}
							filters={[]}
							loading={loadingPricing}
						/>
					</div>
					{/* Modal for editing lead sale count */}
					<Modal
						open={editCountModal.open}
						onOpenChange={open => setEditCountModal(m => ({ ...m, open }))}
						type="confirm"
						title={`Edit Lead Sale Count for ${editCountModal.plan?.name || ''}`}
						content={
							<div className="flex flex-col gap-2">
								<label htmlFor="leadCountInput" className="text-sm font-medium">Lead Sale Count</label>
								<input
									id="leadCountInput"
									type="number"
									min={1}
									className="border rounded px-3 py-2 text-base"
									value={editCountModal.count}
									onChange={e => setEditCountModal(m => ({ ...m, count: e.target.value }))}
									autoFocus
								/>
							</div>
						}
						buttonText="Save"
						onConfirm={handleSaveLeadCount}
						loading={editCountLoading}
					/>
				</div>)}
		</div>
	);
};

export default Settings;