// src/hooks/useUnsavedChanges.js
import { useEffect } from 'react';

export function useUnsavedChanges(enabled) {
    useEffect(() => {
        if (!enabled) return;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [enabled]);
}
