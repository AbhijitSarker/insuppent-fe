import React from 'react';
import { STATUS_COLORS, TYPE_COLORS, DATE_FORMAT_OPTIONS, CURRENCY_FORMAT_OPTIONS } from '../tableConstants';

export const leadsColumns = [
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
        render: (value) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                TYPE_COLORS[value?.toLowerCase()] || 'bg-neutral-50 text-neutral-700'
            }`}>
                {value}
            </span>
        )
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (value) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                STATUS_COLORS[value?.toLowerCase()] || 'bg-neutral-50 text-neutral-700'
            }`}>
                {value}
            </span>
        )
    },
    {
        key: 'value',
        label: 'Value',
        sortable: true,
        render: (value) => value ? new Intl.NumberFormat('en-US', CURRENCY_FORMAT_OPTIONS).format(value) : '-'
    },
    {
        key: 'date',
        label: 'Date',
        sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS.short) : '-'
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