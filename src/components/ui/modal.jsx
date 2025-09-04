
import React from "react";
import Button from "./button";

/**
 * Modal component using shadcn/radix-ui
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {function} props.onOpenChange - Callback for open state change
 * @param {string} props.type - 'confirm' | 'delete'
 * @param {string|React.ReactNode} props.content - Modal content
 * @param {string} props.buttonText - Button text
 * @param {function} props.onConfirm - Confirm callback
 */
export default function Modal({ open, onOpenChange, type = "confirm", title, content, buttonText = "Confirm", onConfirm, loading }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
            <div className="w-full max-w-xs md:min-w-[464px] md:max-w-lg rounded-lg p-4 md:p-6 bg-white shadow-xl relative mx-2">
                <div className="mb-4">
                    <h2 className={"text-xl leading-7 font-semibold text-content-primary"}>
                        {title}
                    </h2>
                    <div className="text-content-secondary mt-2 text-sm font-normal leading-5">{content}</div>
                </div>
                <div className="flex gap-2 justify-end mt-4">

                    <button onClick={() => onOpenChange(false)} className="text-content-primary text-sm font-semibold leading-5 px-3 py-2 hover:text-gray-700">
                        Cancel
                    </button>
                    <button
                        className={`${type === 'confirm' ? 'bg-bg-brand border-blue-500 ' : 'bg-content-red'} px-3 py-2  rounded-lg text-white text-sm font-semibold leading-5 flex items-center justify-center min-w-[90px]`}
                    onClick={onConfirm}
                    >
                        {buttonText}
                    </button>
                </div>
                {/* <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                >
                    ×
                </button> */}
            </div>
        </div>
    );
}

// Add loader CSS if not present globally
// .loader { border-width: 2px; border-style: solid; border-radius: 9999px; border-top-color: transparent; animation: spin 1s linear infinite; }
// @keyframes spin { to { transform: rotate(360deg); } }
