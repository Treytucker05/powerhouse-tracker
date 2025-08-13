// src/components/ui/Toast.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastCtx = createContext({ show: () => { } });

export function ToastProvider({ children }) {
    const [msg, setMsg] = useState(null);

    const show = useCallback((text, opts = {}) => {
        setMsg({ text, kind: opts.kind || 'info', ttl: opts.ttl || 3000 });
    }, []);

    useEffect(() => {
        if (!msg) return;
        const id = setTimeout(() => setMsg(null), msg.ttl);
        return () => clearTimeout(id);
    }, [msg]);

    return (
        <ToastCtx.Provider value={{ show }}>
            {children}
            {msg && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-4 py-2 rounded shadow-lg border ${msg.kind === 'success' ? 'bg-green-900/80 border-green-600 text-green-200' :
                            msg.kind === 'warn' ? 'bg-yellow-900/80 border-yellow-600 text-yellow-200' :
                                msg.kind === 'error' ? 'bg-red-900/80 border-red-600 text-red-200' :
                                    'bg-gray-900/80 border-gray-700 text-gray-200'
                        }`}>
                        {msg.text}
                    </div>
                </div>
            )}
        </ToastCtx.Provider>
    );
}

export function useToast() {
    return useContext(ToastCtx);
}
