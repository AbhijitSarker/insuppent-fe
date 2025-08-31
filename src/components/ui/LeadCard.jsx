import React from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import Button from "./button";

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

const LeadCard = ({ lead, onBuy, onShowEmails, onUpdateStatus, onComment }) => {
    return (
        <div className="rounded-xl border border-borderColor-primary bg-white mb-4 DIdivide-y divide-borderColor-secondary ">
            <div className="px-4 py-3 pb-2 border-b border-borderColor-secondary flex items-center justify-between">
                <span className="font-bold text-lg text-content-primary  px-1 inline-block rounded">
                    {lead.name}
                </span>
            <div className="flex gap-2">
                {onShowEmails && (
                    <Button size="icon" variant="ghost" title="Show Emails" onClick={() => onShowEmails(lead)}>
                        <img className='h-6' src="/src/assets/ai.svg" alt="AI" />
                    </Button>
                )}
                {onUpdateStatus && (
                    <Button size="icon" variant="ghost" title="Update Status" onClick={() => onUpdateStatus(lead)}>
                        <MaterialIcon icon="flag" size={20} />
                    </Button>
                )}
                {onComment && (
                    <Button size="icon" variant="ghost" title="Comment" onClick={() => onComment(lead)}>
                        <MaterialIcon icon="comment" size={20} />
                    </Button>
                )}
            </div>
            </div>
            {/* Info rows */}
            <div className="flex flex-col justify-center divide-y divide-borderColor-secondary text-[14px] leading-5 font-normal">
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="date_range" size={18} className="text-content-secondary" />
                    <span>{formatDate(lead.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="phone" size={18} className="text-content-secondary" />
                    <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="email" size={18} className="text-content-secondary" />
                    <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="local_offer" size={18} className="text-content-secondary" />
                    <Badge variant={lead.type} icon={lead.type}>
                        {lead.type?.charAt(0).toUpperCase() + lead.type?.slice(1)}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="home_work" size={18} className="text-content-secondary" />
                    <span>{lead.address}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 h-10">
                    <MaterialIcon icon="location_on" size={18} className="text-content-secondary" />
                    <span>{lead.state}{lead.zip ? `, ${lead.zip}` : ''}</span>
                </div>
            </div>
            {/* Buy button */}
            <div className="px-4 py-3 flex justify-center  border-t border-borderColor-secondary">
                {lead.price && (
                    <button
                        className="text-content-brand px-3 rounded-lg py-1 font-medium leading-[17px] text-[14px]"
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
