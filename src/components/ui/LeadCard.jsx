import React from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { Badge } from "@/components/ui/badge";

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

const LeadCard = ({ lead }) => {
    return (
        <div className="rounded-xl border border-borderColor-primary bg-white mb-4 DIdivide-y divide-borderColor-secondary ">

            <div className="px-4 pt-4 pb-2 border-b border-borderColor-secondary">
                <span className="font-bold text-lg text-content-primary  px-1 inline-block rounded">
                    {lead.name}
                </span>
            </div>
            {/* Info rows */}
            <div className="flex flex-col divide-y divide-borderColor-secondary text-[16px]">
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="date_range" size={18} className="text-content-secondary" />
                    <span>{formatDate(lead.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="phone" size={18} className="text-content-secondary" />
                    <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="email" size={18} className="text-content-secondary" />
                    <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="local_offer" size={18} className="text-content-secondary" />
                    <Badge variant={lead.type} icon={lead.type}>
                        {lead.type?.charAt(0).toUpperCase() + lead.type?.slice(1)}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="home_work" size={18} className="text-content-secondary" />
                    <span>{lead.address}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <MaterialIcon icon="location_on" size={18} className="text-content-secondary" />
                    <span>{lead.state}{lead.zip ? `, ${lead.zip}` : ''}</span>
                </div>
            </div>
            {/* Buy button */}
            <div className="px-4 py-3 flex justify-center  border-t border-borderColor-secondary">
                {lead.price && (
                    <button className="text-blue-600 font-semibold text-[18px] hover:underline focus:outline-none">
                        Buy ${lead.price?.toFixed(2)}
                    </button>
                )}
            </div>
        </div>
    );
};

export default LeadCard;
