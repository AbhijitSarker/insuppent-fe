import React, { useState } from 'react';
import Button from '@/components/ui/button';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { Badge } from '@/components/ui/badge';

const sampleLead = {
    name: 'Darlene Robertson',
    email: 'trungkienksptknd@gmail.com',
    address: '4140 Parker Rd. Allentown',
    state: 'Indiana',
    type: 'Home',
};

const sampleEmails = [
    {
        style: 'Friendly',
        subject: 'Ready to Find Your Perfect Home in Indiana?',
        body: `Hi Darlene,\n\nI hope you’re doing well! I saw that you’re exploring home options in Indiana, and I’d love to help make your search easier.\n\nWhether you’re buying your first home or looking for something new, we offer expert guidance and personalized options that match your needs and budget.\n\nWould you be open to a quick chat to discuss what you’re looking for?\nLooking forward to hearing from you!\n\nBest regards,\nYour Name\nYour Company\n[Phone Number] | [Email]\n[Website Link]`
    },
    {
        style: 'Professional',
        subject: 'Indiana Homes You’ll Love – Take a Look',
        body: `Hi Darlene,\n\nJust checking in to see how your home search is going!\n\nWe’ve helped many Indiana residents like yourself find their ideal homes, and I’d love to do the same for you. I’ve put together a quick list of homes currently available that might interest you.\n\n👉 [Insert link to listings or guide]\n\nWould you be open to a quick chat to discuss what you’re looking for?\nLooking forward to hearing from you!\n\nLet me know if you’d like to schedule a time to talk or view any properties.\n\nAll the best,\nYour Name\nYour Company\n[Phone Number] | [Email]`
    },
    {
        style: 'Casual',
        subject: 'Ready to Find Your Perfect Home in Indiana?',
        body: `Hi Darlene,\n\nI hope you’re doing well! I saw that you’re exploring home options in Indiana, and I’d love to help make your search easier.\n\nWhether you’re buying your first home or looking for something new, we offer expert guidance and personalized options that match your needs and budget.\n\nWould you be open to a quick chat to discuss what you’re looking for?\nLooking forward to hearing from you!\n\nBest regards,\nYour Name\nYour Company\n[Phone Number] | [Email]\n[Website Link]`
    }
];

const EmailModal = ({ open, onClose }) => {
    const [copiedIdx, setCopiedIdx] = useState(null);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 rounded-3xl">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity animate-fadeIn" onClick={onClose} />
            {/* Modal panel */}
            <div className="rounded-3xl absolute left-1/2 bottom-0 w-full -translate-x-1/2 h-[90vh] bg-bg-secondary  flex flex-col border-t border-border animate-slideUpModal">
                {/* Header with icon and title */}
                <div className="flex items-center gap-4 px-5 py-5 border-b border-border bg-white rounded-t-3xl">
                    {/* <div className="rounded-full bg-primary/10 p-2 flex items-center"> */}
                    <img src="/src/assets/ai.svg" alt="" />
                    {/* </div> */}
                    <h2 className="text-2xl text-content-primary tracking-tight font-semibold">AI Generated Email</h2>
                    <div className="flex-1" />
                    <button onClick={onClose} className="text-2xl px-2 py-1 rounded hover:bg-muted/60 transition-colors" title="Close">
                        &times;
                    </button>
                </div>
                {/* Lead info */}
                <div className="mx-8 border-b py-6 border-border">
                    <div>
                        <div className="font-semibold text-lg mb-2">Email copy for <span className="text-primary">{sampleLead.name}</span></div>
                        <div className="flex gap-5 text-sm text-muted-foreground flex-wrap  text-content-primary ">
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="email" size={16} /> {sampleLead.email}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="home_work" size={16} /> {sampleLead.address}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded"><MaterialIcon className={'text-content-secondary'} icon="location_on" size={16} /> {sampleLead.state}</span>
                            <span className="flex items-center gap-[6px] bg-muted py-1 rounded">
                                <Badge
                                    variant={
                                        sampleLead.type.toLowerCase() === 'auto' ? 'auto'
                                        : sampleLead.type.toLowerCase() === 'mortgage' ? 'mortgage'
                                        : sampleLead.type.toLowerCase() === 'home' ? 'home'
                                        : 'default'
                                    }
                                    icon={sampleLead.type.toLowerCase()}
                                    className="capitalize"
                                >
                                    {sampleLead.type}
                                </Badge>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Email styles side by side */}
                <div className="flex-1 overflow-auto p-8 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleEmails.map((email, idx) => (
                            <div key={idx} className="relative flex flex-col items-stretch">
                                {/* Floating tab style label, visually overlapping the box border */}
                                <div className='w-min'>
                                    <div
                                        className="px-3 py-[6px] bg-white border border-gray-300 font-semibold text-sm shadow-sm"
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
                                        {email.style}
                                    </div>
                                </div>
                                <div
                                    className="border rounded-tl-none border-gray-300 rounded-xl bg-white flex flex-col min-h-[350px] relative"
                                    style={{ boxShadow: '0 2px 8px 0 rgba(60,72,88,0.06)' }}
                                >
                                    {/* Subject row */}
                                    <div className="relative flex items-center justify-between border-b py-4 px-6">
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
                                    <div className='flex relative px-6 pt-[18px] pb-[26px]'>
                                        <pre className="whitespace-pre-wrap text-sm flex-1" style={{ fontFamily: 'inherit' }}>{email.body}</pre>
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
