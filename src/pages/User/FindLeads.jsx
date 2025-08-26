
import React, { useState, useEffect, useMemo } from 'react';
import CheckoutPage from '@/components/pages/CheckoutPage.jsx';
import Alert from '@/components/ui/alert';
import { Table } from '@/components/ui/Table';
import LeadCard from '@/components/ui/LeadCard';
import { usePublicLeads } from '@/api/hooks/useLeads';
import { Badge } from '@/components/ui/badge';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Button from '@/components/ui/button';
import { Link } from 'react-router-dom';

const typeIcons = {
    auto: 'directions_car',
    commercial: 'location_city',
    home: 'home',
    mortgage: 'business',
};

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

const FindLeads = () => {
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
    const [checkoutLeads, setCheckoutLeads] = useState(null); // null or array of leads

    useEffect(() => {
        setSelectedRows([]);
    }, [tableState]);

    const { data: leadsData, isLoading } = usePublicLeads();

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
            key: 'price',
            header: 'Action',
            render: (row) => (
                <button
                    className="text-content-brand px-3 rounded-lg py-1 font-medium hover:bg-[#DBEAFE] leading-[18px]"
                    onClick={() => setCheckoutLeads([row])}
                >
                    Buy ${row.price?.toFixed(2) ?? '--'}
                </button>
            )
        }
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
        <div className="p-4 sm:p-8 !bg-transparent">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
            <div className="flex items-center justify-between mb-7 mt-0">
                <h1 className="w-full font-bold text-[2rem] sm:text-[32px] leading-[32px] tracking-[-0.025em]">
                    Find Leads
                </h1>
                {/* <Link to="/admin">Admin</Link> */}
            </div>
            <div className={`flex gap-2 items-center ${selectedRows.length > 0 ? '' : 'hidden'}`}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCheckoutLeads(selectedRows)}
                    disabled={selectedRows.length === 0}
                >
                    Purchase Selected
                </Button>
                <span className="text-xs text-muted-foreground">
                    {selectedRows.length} lead(s) selected
                </span>
            </div>

            {checkoutLeads && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <CheckoutPage
                        leads={checkoutLeads}
                        onCancel={() => setCheckoutLeads(null)}
                    />
                </div>
            )}
            {/* Table handles both desktop and mobile rendering */}
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
    );
};

export default FindLeads;
