

import React, { useState, useEffect, useMemo } from 'react';
import { Table } from '@/components/ui/Table';
import LeadCard from '@/components/ui/LeadCard';
import Alert from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Button from '@/components/ui/button';
import EmailModal from '@/components/ui/EmailModal';
import { useMyLeads } from '@/api/hooks/useLeads';
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

const MyLeads = () => {
    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 13,
        sort: { key: 'createdAt', direction: 'desc' },
        search: '',
        types: [],
        states: []
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [emailModalOpen, setEmailModalOpen] = useState(false);

    useEffect(() => {
        setSelectedRows([]);
    }, [tableState]);

    // const { data: leadsData, isLoading } = useMyLeads ? useMyLeads() : { data: null, isLoading: false };

    // Temporary sample data for development/demo
    const sampleLeads = [
        {
            id: 1,
            createdAt: '2025-08-01T10:00:00Z',
            name: 'John Doe',
            phone: '555-1234',
            email: 'john.doe@example.com',
            type: 'auto',
            address: '123 Main St',
            state: 'CA',
            datePurchased: '2025-08-10T12:00:00Z',
            price: 25.5,
            status: 'active',
        },
        {
            id: 2,
            createdAt: '2025-08-05T14:30:00Z',
            name: 'Jane Smith',
            phone: '555-5678',
            email: 'jane.smith@example.com',
            type: 'home',
            address: '456 Oak Ave',
            state: 'TX',
            datePurchased: null,
            price: 40.0,
            status: 'inactive',
        },
        {
            id: 3,
            createdAt: '2025-08-15T09:15:00Z',
            name: 'Alice Johnson',
            phone: '555-9012',
            email: 'alice.j@example.com',
            type: 'mortgage',
            address: '789 Pine Rd',
            state: 'NY',
            datePurchased: '2025-08-20T15:00:00Z',
            price: 60.75,
            status: 'active',
        },
    ];

    // Use sample data instead of API for now
    const leadsData = { data: sampleLeads };
    const isLoading = false;

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
        { key: 'name', header: 'Full name', sortable: true, icon: <MaterialIcon className={'text-content-secondary'} icon="group" size={16} /> },
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
            key: 'price',
            header: 'Price',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="attach_money" size={16} />,
            render: (row) => (
                <span>${row.price?.toFixed(2) ?? '--'}</span>
            )
        },
        {
            key: 'aiEmail',
            header: '',
            icon: null,
            render: (row) => (
                <Button size="icon" variant="ghost" title="Generate Email" onClick={() => setEmailModalOpen(true)}>
                    <MaterialIcon icon="auto_awesome" className="text-primary" />
                </Button>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            icon: <MaterialIcon className={'text-content-secondary'} icon="verified_user" size={16} />,
            render: (row) => (
                <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || '--'}
                </Badge>
            )
        },
    ];

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
                    <h1 className="w-full font-bold text-[2rem] sm:text-[32px] leading-[32px] tracking-[-0.025em]">
                        My Leads
                    </h1>
                </div>
                <div className={` flex gap-2 items-center ${selectedRows.length > 0 ? '' : 'hidden'}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRows([])}
                        disabled={selectedRows.length === 0}
                    >
                        Clear Selection
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        {selectedRows.length} lead(s) selected
                    </span>
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
                    cardComponent={LeadCard}
                    isMobile={isMobile}
                />
            </div>
            <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
        </>
    );
};

export default MyLeads;