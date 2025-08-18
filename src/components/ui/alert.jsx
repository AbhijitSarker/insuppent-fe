import React from 'react';

const alertStyles = {
  base: 'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded shadow-lg flex items-center min-w-[500px]',
  success: 'bg-green-100 text-green-800 border border-green-300',
  error: 'bg-red-100 text-red-800 border border-red-300',
  info: 'bg-blue-100 text-blue-800 border border-blue-300',
};

const icons = {
  success: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  info: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
  ),
};

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`${alertStyles.base} ${alertStyles[type]}`}
      role="alert"
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-xl leading-none focus:outline-none">&times;</button>
      )}
    </div>
  );
}
