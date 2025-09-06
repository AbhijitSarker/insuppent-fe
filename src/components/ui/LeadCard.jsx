import React from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Badge, badgeVariants } from "@/components/ui/badge";
import Button from "./button";
import aiSvg from '../../assets/ai.svg';

// Format phone number as (000) 000-0000
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
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

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {
        return 'Today';
    }
    return date.toLocaleDateString();
}

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const LeadCard = ({ lead, onBuy, onShowEmails, onUpdateStatus, onComment, onStatusChange }) => {
    return (
        <div className="rounded-xl border border-borderColor-primary bg-white mb-4 divide-y divide-borderColor-secondary w-full max-w-md mx-auto sm:max-w-full">
            <div className="px-4 py-3 pb-2 border-b border-borderColor-secondary flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-lg text-content-primary px-1 inline-block rounded break-words max-w-[60vw] sm:max-w-none">
                    {lead.name}
                </span>
                <div className="flex gap-2 flex-shrink-0">
                    {onShowEmails && (
                        <Button size="icon" variant="ghost" title="Show Emails" onClick={() => onShowEmails(lead)}>
                            <img className='h-6' src={aiSvg} alt="AI" />
                        </Button>
                    )}
                    {(onStatusChange || onComment || onUpdateStatus) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" title="More actions">
                                    <MaterialIcon icon="more_vert" size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg"
                            >
                            {onStatusChange && (
                                <DropdownMenuSub className="rounded-xl">
                                    <DropdownMenuSubTrigger className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors !hover:bg-red-50">
                                        Update Status
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg mr-2">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStatusChange(lead, 'public');
                                            }}
                                            className={cn(
                                                "flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
                                                lead.status === 'public' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
                                            )}
                                        >
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <span>Public</span>
                                                {lead.status === 'public' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStatusChange(lead, 'private');
                                            }}
                                            className={cn(
                                                "flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
                                                lead.status === 'private' ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <span>Private</span>
                                                {lead.status === 'private' ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                )}
                                {onUpdateStatus && (
                                    <DropdownMenuSub className="rounded-xl">
                                        <DropdownMenuSubTrigger className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors !hover:bg-red-50">
                                            Update Status
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="w-[160px] rounded-xl border border-borderColor-secondary bg-white p-1 shadow-lg mr-2">
                                            {['Purchased', 'Contacted', 'In Discussion', 'No Response', 'Sold'].map(status => (
                                                <DropdownMenuItem
                                                    key={status}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdateStatus(lead, status);
                                                    }}
                                                    className={cn(
                                                        "flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
                                                        lead.leadStatus === status ? 'bg-bg-secondary' : 'hover:bg-bg-tertiary'
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between w-full gap-2">
                                                        <span>{status}</span>
                                                        {lead.leadStatus === status ? <MaterialIcon icon="check" size={20} className={'text-content-brand'} /> : <></>}
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                )}
                                {onComment && (
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onComment(lead);
                                        }}
                                        className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors hover:bg-bg-tertiary"
                                    >
                                        Add Comment
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
            {/* Info rows */}
            <div className="flex flex-col justify-center divide-y divide-borderColor-secondary text-[14px] leading-5 font-normal">
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="date_range" size={18} className="text-content-secondary" />
                    <span>{formatDate(lead.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="phone" size={18} className="text-content-secondary" />
                    <span className="break-all">{formatPhoneNumber(lead.phone)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="email" size={18} className="text-content-secondary" />
                    <span className="break-all">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="local_offer" size={18} className="text-content-secondary" />
                    <Badge variant={lead.type} icon={lead.type}>
                        {lead.type?.charAt(0).toUpperCase() + lead.type?.slice(1)}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="home_work" size={18} className="text-content-secondary" />
                    <span className="break-all">{lead.address}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-auto sm:h-10 flex-wrap">
                    <MaterialIcon icon="location_on" size={18} className="text-content-secondary" />
                    <span>{stateAbbrToName[lead.state]}{lead.zip ? `, ${lead.zip}` : ''}</span>
                </div>
            </div>
            {/* Buy button */}
            <div className="px-4 py-3 flex justify-center border-t border-borderColor-secondary">
                {
                    lead.isRefunded && (
                        <Badge variant="refunded">
                            {lead.isRefunded ? "Refunded" : ""}
                        </Badge>

                        // <div className="text-red-500 font-medium mr-4 self-center">
                        //     {lead.isRefunded ? "Refunded" : ""}
                        // </div>
                    )
                }

                {lead.price && (
                    <button
                        className="text-content-brand px-3 rounded-lg py-1 font-medium leading-[17px] text-[14px] w-full sm:w-auto"
                        onClick={() => onBuy && onBuy(lead)}
                    >
                        Buy ${lead.price?.toFixed(2)}
                    </button>
                )}
            </div>
        </div>
    );
};

export default LeadCard;
