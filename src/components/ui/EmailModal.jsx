import React, { useState } from 'react';
import Button from '@/components/ui/button';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { Badge } from '@/components/ui/badge';
import aiSvg from '../../assets/ai.svg';

const EmailModal = ({ open, onClose, lead }) => {
    const [copiedIdx, setCopiedIdx] = useState(null);
    if (!open || !lead) return null;
    return (
        <div className="fixed inset-0 z-50 rounded-3xl">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity animate-fadeIn" onClick={onClose} />
            {/* Modal panel */}
            <div className="rounded-3xl absolute left-1/2 bottom-0 w-full -translate-x-1/2 h-[90vh] bg-bg-secondary  flex flex-col border-t border-borderColor-primary animate-slideUpModal">
                {/* Header with icon and title */}
                <div className="flex items-center gap-4 px-5 py-5 border-b border-borderColor-primary bg-white rounded-t-3xl">
                    <img src={aiSvg} alt="" />
                    <h2 className="text-2xl text-content-primary tracking-tight font-semibold">AI Generated Email</h2>
                    <div className="flex-1" />
                    <button onClick={onClose} className="text-2xl px-2 py-1 rounded hover:bg-muted/60 transition-colors" title="Close">
                        &times;
                    </button>
                </div>
                {/* Lead info */}
                <div className="mx-8 border-b py-6 border-borderColor-primary">
                    <div>
                        <div className="font-semibold text-2xl leading-8 mb-2">Email copy for <span className="text-primary">{lead.name}</span></div>
                        <div className="flex gap-5 text-sm text-muted-foreground flex-wrap  text-content-primary ">
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="email" size={16} /> {lead.email}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="home_work" size={16} /> {lead.address}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="location_on" size={16} /> {lead.state}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded">
                                <Badge
                                    variant={lead.type?.toLowerCase()}
                                    icon={lead.type?.toLowerCase()}
                                    className="capitalize"
                                >
                                    {lead.type}
                                </Badge>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Email styles side by side */}
                <div className="flex-1 overflow-auto p-8 bg-bg-secondary">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(lead.emails || []).map((email, idx) => (
                            <div key={idx} className="relative flex flex-col items-stretch">
                                <div className='w-min'>
                                    <div
                                        className="px-3 py-[6px] bg-white border border-borderColor-primary font-semibold text-sm shadow-sm"
                                        style={{
                                            borderBottom: 'none',
                                            borderTopLeftRadius: '8px',
                                            borderTopRightRadius: '8px',
                                            borderBottomLeftRadius: 0,
                                            borderBottomRightRadius: 0,
                                            boxShadow: '0 2px 8px 0 rgba(60,72,88,0.06)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {email.tone ? email.tone.charAt(0).toUpperCase() + email.tone.slice(1) : `Email ${idx + 1}`}
                                    </div>
                                </div>
                                <div
                                    className="border rounded-tl-none border-borderColor-primary rounded-xl bg-white flex flex-col min-h-[350px] relative"
                                    style={{ boxShadow: '0 2px 8px 0 rgba(60,72,88,0.06)' }}
                                >
                                    {/* Subject row */}
                                    <div className="relative flex items-center justify-between border-b py-4 px-6 gap-2">
                                        <div className="font-semibold text-sm leading-tight">Subject: {email.subject}</div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            title="Copy subject"
                                            onClick={() => {
                                                navigator.clipboard.writeText(email.subject);
                                                setCopiedIdx(`subject-${idx}`);
                                                setTimeout(() => setCopiedIdx(null), 1200);
                                            }}
                                            className="px-3 text-content-primary bg-bg-tertiary"
                                        >
                                            <MaterialIcon icon="content_copy" size={18} />
                                        </Button>
                                        {copiedIdx === `subject-${idx}` && (
                                            <span className="absolute right-5 -bottom-4 text-xs bg-black text-white text-success bg-muted px-2 py-1 rounded shadow-lg">Copied!</span>
                                        )}
                                    </div>
                                    {/* Email body */}
                                    <div className='flex gap-2 relative px-6 pt-[18px] pb-[26px]'>
                                        <div className="text-sm flex-1" style={{ fontFamily: 'inherit' }}
                                            dangerouslySetInnerHTML={{ __html: email.body }}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                title="Copy email body"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(email.body);
                                                    setCopiedIdx(`body-${idx}`);
                                                    setTimeout(() => setCopiedIdx(null), 1200);
                                                }}
                                                className="m-0 p-0 bg-bg-tertiary"
                                            >
                                                <MaterialIcon icon="content_copy" size={18} />
                                            </Button>
                                            {copiedIdx === `body-${idx}` && (
                                                <span className="absolute top-[75px] bg-black text-white text-xs text-success bg-muted px-2 py-1 rounded shadow">Copied!</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Animations */}
            <style jsx>{`
                    .animate-fadeIn {
                        animation: fadeInBg 0.25s;
                    }
                    @keyframes fadeInBg {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-slideUpModal {
                        animation: slideUpModal 0.35s cubic-bezier(0.4,0,0.2,1);
                    }
                    @keyframes slideUpModal {
                        from { transform: translate(-50%, 100%); }
                        to { transform: translate(-50%, 0); }
                    }
                `}</style>
        </div>
    );
};

export default EmailModal;
