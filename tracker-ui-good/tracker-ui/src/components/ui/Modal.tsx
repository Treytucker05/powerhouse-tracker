import React from 'react';

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidthClass?: string; // e.g., 'max-w-lg'
};

export default function Modal({ open, title, onClose, children, footer, maxWidthClass = 'max-w-xl' }: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className={`relative w-full ${maxWidthClass} mx-4 bg-[#0b1220] border border-gray-800 rounded shadow-lg`}>
                <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="text-sm font-semibold" style={{ color: '#ef4444' }}>{title}</div>
                    <button aria-label="Close" className="text-gray-400 hover:text-gray-200" onClick={onClose}>✕</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
                {footer && (
                    <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/40 flex items-center justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
