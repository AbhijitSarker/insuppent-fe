import React, { useState } from 'react';
import { Table } from '../../components/common/table-system';

const AllLeads = () => {
    const [loading, setLoading] = useState(false);

    // Sample data - replace with your actual API call
    const data = [
        { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            phone: '(555) 123-4567',
            type: 'Auto',
            status: 'In Discussion', 
            date: '2025-08-01',
            value: 25000
        },
        { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com',
            phone: '(555) 234-5678', 
            type: 'Home',
            status: 'Contacted', 
            date: '2025-08-02',
            value: 450000
        },
        { 
            id: 3, 
            name: 'Robert Johnson', 
            email: 'robert@example.com',
            phone: '(555) 345-6789', 
            type: 'Life Insurance',
            status: 'No Response', 
            date: '2025-08-01',
            value: 100000
        },
        { 
            id: 4, 
            name: 'Sarah Wilson', 
            email: 'sarah@example.com',
            phone: '(555) 456-7890', 
            type: 'Business',
            status: 'Purchased', 
            date: '2025-07-30',
            value: 75000
        },
        { 
            id: 5, 
            name: 'Michael Brown', 
            email: 'michael@example.com',
            phone: '(555) 567-8901', 
            type: 'Mortgage',
            status: 'Sold', 
            date: '2025-07-29',
            value: 350000
        }
    ];

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
        },
        {
            key: 'type',
            label: 'Insurance Type',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
        },
        {
            key: 'value',
            label: 'Value',
            sortable: true,
            render: (value) => new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value)
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Edit:', row);
                        }}
                        className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete:', row);
                        }}
                        className="px-3 py-1 text-sm text-danger-600 hover:text-danger-800 font-medium"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const handleRowClick = (row) => {
        console.log('Row clicked:', row);
        // Navigate to lead details or open modal
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-900">All Leads</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    View and manage all your insurance leads
                </p>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table
                    data={data}
                    columns={columns}
                    searchableColumns={['name', 'email', 'phone', 'type']}
                    filterableColumns={['type', 'status']}
                    initialSort="date"
                    pageSize={5}
                    loading={loading}
                    onRowClick={handleRowClick}
                    className="min-h-[400px]"
                />
            </div>
        </div>
    );
};

export default AllLeads;