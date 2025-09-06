import React, { useState, useEffect, useMemo } from 'react';
import { Table } from '@/components/ui/Table';
import LeadCard from '@/components/ui/LeadCard';
import Alert from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import EmailModal from '@/components/ui/EmailModal';
import { useMyLeads } from '@/api/hooks/useLeads';
import aiSvg from '../../assets/ai.svg';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Select, SelectItem } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Modal state for AI email

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

const statusOptions = [
    'Purchased', 'Contacted', 'In Discussion', 'No Response', 'Sold'
];

const MyLeads = () => {

    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 13,
        sort: { key: 'createdAt', direction: 'desc' },
        search: '',
        types: [],
        states: [],
        statuses: []
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [emailModalOpen, setEmailModalOpen] = useState(false);

    useEffect(() => {
        setSelectedRows([]);
    }, [tableState]);

    // Fetch leads from backend
    const { data: leadsData, isLoading } = useMyLeads();

    const filteredAndSortedData = useMemo(() => {
        if (!leadsData?.data) return [];
        let filteredData = [...leadsData.data];
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
        if (tableState.types.length > 0) {
            filteredData = filteredData.filter(lead =>
                tableState.types.includes(lead.type)
            );
        }
        if (tableState.states.length > 0) {
            filteredData = filteredData.filter(lead =>
                tableState.states.includes(lead.state)
            );
        }
        if (tableState.statuses && tableState.statuses.length > 0) {
            filteredData = filteredData.filter(lead =>
                tableState.statuses.includes(lead.leadStatus)
            );
        }
        if (tableState.sort.key) {
            filteredData.sort((a, b) => {
                let aVal = a[tableState.sort.key];
                let bVal = b[tableState.sort.key];
                if (tableState.sort.key === 'createdAt') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
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

    const paginatedData = useMemo(() => {
        const startIndex = (tableState.page - 1) * tableState.pageSize;
        const endIndex = startIndex + tableState.pageSize;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [filteredAndSortedData, tableState.page, tableState.pageSize]);

    const totalCount = filteredAndSortedData.length;

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
    const handleRowSelect = (row, checked) => {
        setSelectedRows(prev =>
            checked ? [...prev, row] : prev.filter(r => r.id !== row.id)
        );
    };
    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? paginatedData || [] : []);
    };

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => setAlert({ type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalLead, setModalLead] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);
    // Bulk status modal
    const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
    const [bulkStatus, setBulkStatus] = useState(statusOptions[0]);
    // Bulk comment modal
    const [bulkCommentModalOpen, setBulkCommentModalOpen] = useState(false);
    const [bulkComment, setBulkComment] = useState("");
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [commentLead, setCommentLead] = useState(null);
    const [commentValue, setCommentValue] = useState("");

    const { updateStatus, isUpdatingStatus, upsertComment, isUpdatingComment } = useMyLeads();

    const columns = [
        {
            key: 'name',
            header: 'Full name',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="group" size={16} />,
            render: (row) => (
                <span className="flex items-center gap-1">
                    {row.name}
                    {row.comment && (
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <span tabIndex={0} className="flex items-center">
                                        <MaterialIcon icon="comment" size={18} className="text-content-secondary cursor-pointer" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="center" className="whitespace-pre-line !min-w-0 !max-w-fit">
                                    {row.comment}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </span>
            )

        },
        { key: 'phone', header: 'Phone', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="phone" size={16} /> },
        { key: 'email', header: 'Email', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="email" size={16} /> },
        {
            key: 'type',
            header: 'Type',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="local_offer" size={16} />,
            render: (row) => (
                <Badge variant={row.type} icon={row.type}>
                    {row.type?.charAt(0).toUpperCase() + row.type?.slice(1)}
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
            key: 'datePurchased',
            header: 'Date Purchased',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="shopping_cart" size={16} />,
            render: (row) => (
                <span>{row.datePurchased ? new Date(row.datePurchased).toLocaleDateString() : '--'}</span>
            )
        },
        {
            key: 'leadStatus',
            header: 'Status',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="verified_user" size={16} />,
            render: (row) => {
                const status = row.leadStatus?.charAt(0).toUpperCase() + row.leadStatus?.slice(1);
                let colorClass = 'text-gray-700', dotClass = 'bg-gray-400';
                if (status === 'In Discussion') { colorClass = 'text-[#A16207]'; dotClass = 'bg-[#A16207]'; }
                else if (status === 'Purchased') { colorClass = 'text-[#1D4ED8]'; dotClass = 'bg-[#1D4ED8]'; }
                else if (status === 'Contacted') { colorClass = 'text-[#0E7490]'; dotClass = 'bg-[#0E7490]'; }
                else if (status === 'No Response') { colorClass = 'text-[#B91C1C]'; dotClass = 'bg-[#B91C1C]'; }
                else if (status === 'Sold') { colorClass = 'text-[#15803D]'; dotClass = 'bg-[#15803D]'; }
                return (
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 font-medium ${colorClass}`}>
                            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                            {status || '--'}
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'aiEmail',
            header: '',
            icon: null,
            render: (row) => (
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => { setEmailModalOpen(row); }}
                                className="ai-gradient-hover"
                            >
                                <img className='h-6' src={aiSvg} alt="AI" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center" className="text-base px-4 py-2">
                            Generate Email
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
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
                                {statusOptions.map(opt => (
                                    <DropdownMenuItem
                                        key={opt}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalLead(row);
                                            setModalStatus(opt);
                                            setModalOpen(true);
                                        }}
                                        className={row.leadStatus === opt ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'}
                                    >
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <span>{opt}</span>
                                            {row.leadStatus === opt ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                setCommentLead(row);
                                setCommentValue(row.comment || "");
                                setCommentModalOpen(true);
                            }}
                            className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors hover:bg-bg-tertiary"
                        >
                            {row.comment ? 'Edit Comment' : 'Add Comment'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    ];
    // Status modal confirm
    const handleConfirmStatus = async () => {
        if (!modalLead || !modalStatus) return;
        try {
            await updateStatus(modalLead.id, modalStatus);
            setModalOpen(false);
            setModalLead(null);
            setModalStatus(null);
            setAlert({ type: 'success', message: 'Lead status updated successfully!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to update lead status.' });
        }
    };

    // Bulk status modal confirm
    const handleConfirmBulkStatus = async () => {
        if (!selectedRows.length || !bulkStatus) return;
        try {
            await Promise.all(selectedRows.map(lead => updateStatus(lead.id, bulkStatus)));
            setBulkStatusModalOpen(false);
            setBulkStatus(statusOptions[0]);
            setSelectedRows([]);
            setAlert({ type: 'success', message: 'Lead statuses updated successfully!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to update lead statuses.' });
        }
    };

    // Bulk comment modal confirm
    const handleConfirmBulkComment = async () => {
        if (!selectedRows.length || !bulkComment) return;
        try {
            await Promise.all(selectedRows.map(lead => upsertComment(lead.id, bulkComment)));
            setBulkCommentModalOpen(false);
            setBulkComment("");
            setSelectedRows([]);
            setAlert({ type: 'success', message: 'Comments updated for selected leads!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to update comments.' });
        }
    };

    // Comment modal confirm
    const handleConfirmComment = async () => {
        if (!commentLead) return;
        try {
            await upsertComment(commentLead.id, commentValue);
            setCommentModalOpen(false);
            setCommentLead(null);
            setCommentValue("");
            setAlert({ type: 'success', message: 'Comment updated successfully!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to update comment.' });
        }
    };

    const typeOptions = [
        { value: 'auto', label: 'Auto' },
        { value: 'mortgage', label: 'Mortgage' },
        { value: 'home', label: 'Home' },
    ];
    const stateOptions = Object.entries(stateAbbrToName).map(([abbr, name]) => ({ value: abbr, label: name }));

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
            options: statusOptions.map(opt => ({ value: opt, label: opt })),
            value: tableState.statuses || [],
            onChange: (values) => {
                setTableState(prev => ({
                    ...prev,
                    statuses: values === '__ALL__' ? [] : Array.isArray(values) ? values : [values],
                    page: 1
                }));
            },
            icon: 'flag',
            isMulti: true
        }
    ];


    // Responsive: detect mobile
    const [isMobile, setIsMobile] = useState(false);
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div className="p-4 sm:p-8 !bg-transparent">
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
                <div className="flex items-center justify-between mb-7 mt-0">
                    <h1 className="w-full font-bold text-[2rem] sm:text-[32px] leading-[32px] tracking-[-0.025em] text-bg-secondary md:text-content-primary">
                        My Leads
                    </h1>
                </div>
                <div className={` flex gap-2 items-center ${selectedRows.length > 0 ? '' : 'hidden'}`}>
                    <span className="text-sm font-semibold leading-5 text-muted-foreground">
                        {selectedRows.length} lead(s) selected
                    </span>
                    <button
                        onClick={() => setBulkStatusModalOpen(true)}
                        className={`bg-[#0D0D0D14] px-3 py-2  rounded-lg text-content-primary text-sm font-semibold leading-5 flex items-center justify-center min-w-[90px]`}
                    >
                        Change Status
                    </button>
                    <button
                        className={`bg-[#0D0D0D14] px-3 py-2  rounded-lg text-content-primary text-sm font-semibold leading-5 flex items-center justify-center min-w-[90px]`}
                        onClick={() => setBulkCommentModalOpen(true)}
                    >
                        Add Comment
                    </button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRows([])}
                        className="flex items-center gap-2 px-3 py-2 h-9 text-sm font-semibold border-none rounded-lg !hover:bg-blue-100 !bg-transparent text-content-brand hover:text-content-brand shadow-none"
                    >
                        <MaterialIcon icon="close" size={20} className="text-content-brand p-0" />
                        Clear Selection
                    </Button>
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
                            page: 1
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
                        <span>
                            Showing {paginatedData?.length || 0} of {totalCount || 0} results
                        </span>
                    }
                    paginationDelta={2}
                    searchFilterVisibility={selectedRows.length > 0 ? false : true}
                    cardComponent={(props) => <LeadCard {...props} onShowEmails={setEmailModalOpen} onUpdateStatus={(lead) => { setModalLead(lead); setModalStatus(lead.leadStatus || 'Purchased'); setModalOpen(true); }} onComment={(lead) => { 
                        // Only open the comment modal if this is a real comment action (not a tooltip click)
                        if (!lead.preventModal) {
                            setCommentLead(lead);
                            setCommentValue(lead.comment || "");
                            setCommentModalOpen(true);
                        }
                    }} />}
                    isMobile={isMobile}
                    showExport={true}
                />
            </div>
            <EmailModal
                open={!!emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                lead={emailModalOpen}
            />
            {/* Status Modal */}
            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                type={'confirm'}
                title={`Change Status for ${modalLead?.name || 'Lead'}`}
                content={`Are you sure you want to change status to "${modalStatus}" for ${modalLead?.name || 'Lead'}?`}
                buttonText={'Change Status'}
                onConfirm={handleConfirmStatus}
                loading={isUpdatingStatus}
            />
            {/* Bulk Status Modal */}
            <Modal
                open={bulkStatusModalOpen}
                onOpenChange={setBulkStatusModalOpen}
                type={'confirm'}
                title={`Update Status for ${selectedRows.length} Lead(s)`}
                content={
                    <>
                        <Select
                            value={bulkStatus}
                            onValueChange={setBulkStatus}
                            className="w-min mt-4"
                            label="Status"
                            icon="verified_user"
                        >
                            {statusOptions.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </Select>
                        <div className="mb-2 mt-4 text-sm text-muted-foreground">This will update the status for all selected leads.</div>
                    </>
                }
                buttonText={'Update Status'}
                onConfirm={handleConfirmBulkStatus}
                loading={isUpdatingStatus ? true : undefined}
            />
            {/* Bulk Comment Modal */}
            <Modal
                open={bulkCommentModalOpen}
                onOpenChange={setBulkCommentModalOpen}
                type={'confirm'}
                title={`Edit Comment for ${selectedRows.length} Lead(s)`}
                content={
                    <div>
                        <textarea
                            className="w-full border rounded p-2 mt-2"
                            rows={4}
                            value={bulkComment}
                            onChange={e => setBulkComment(e.target.value)}
                            placeholder="Enter your comment to apply to all selected leads..."
                        />
                        <button
                            type="button"
                            className="mt-2 px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300"
                            onClick={() => setBulkComment("")}
                        >
                            Clear
                        </button>
                    </div>
                }
                buttonText={'Edit Comment'}
                onConfirm={handleConfirmBulkComment}
                loading={isUpdatingComment ? true : undefined}
            />
            {/* Comment Modal */}
            <Modal
                open={commentModalOpen}
                onOpenChange={setCommentModalOpen}
                type={'confirm'}
                title={`${commentLead?.comment ? 'Edit' : 'Add'} comment for ${commentLead?.name || 'Lead'}`}
                content={
                    <div className="mt-2 relative">
                        <textarea
                            className="w-full border rounded p-2"
                            rows={4}
                            value={commentValue}
                            onChange={e => setCommentValue(e.target.value)}
                            placeholder="Enter your comment here..."
                        />
                        <button
                            type="button"
                            className="absolute left-0 -bottom-[52px] text-sm font-semibold leading-5 px-3 py-[6px]  rounded border border-red-500 bg-white text-red-500 hover:bg-red-100 focus:outline-none"
                            aria-label="Clear comment"
                            onClick={() => setCommentValue("")}
                        >
                            Clear
                        </button>
                    </div>
                }
                buttonText={commentLead?.comment ? "Save Changes" : "Add comment"}
                onConfirm={handleConfirmComment}
                loading={isUpdatingComment ? true : undefined}
            />
        </>
    );
};


export default MyLeads;