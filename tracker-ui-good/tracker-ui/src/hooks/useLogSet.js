import { useState, useCallback } from 'react';
// TODO(treytucker): stub implementation for test stabilization; replace with real logging pipeline by 2025-08-31
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { useActiveSession } from './useActiveSession';

/**
 * Lightweight implementation to satisfy tests.
 * logSet: calls session.addSet then re-queries logged sets to determine completion.
 */
export const useLogSet = () => {
    const { activeSession, addSet, finishSession } = useActiveSession();
    const [isLogging, setIsLogging] = useState(false);
    const [error, setError] = useState(null);

    const logSet = useCallback(async (setData) => {
        setIsLogging(true); setError(null);
        try {
            const created = await addSet(setData);

            // Emit volume:updated event
            window.dispatchEvent(new CustomEvent('volume:updated', { detail: { setData: created } }));

            // Determine if session complete
            if (activeSession?.planned_sets && Array.isArray(activeSession.planned_sets) && activeSession.planned_sets.length) {
                const userId = await getCurrentUserId();
                if (userId && activeSession.id) {
                    const { data } = await supabase.from('logged_sets').select('*').eq('session_id', activeSession.id);
                    const plannedCount = activeSession.planned_sets.length;
                    const completedCount = data ? data.length : 0;
                    if (completedCount >= plannedCount) {
                        await finishSession();
                        window.dispatchEvent(new CustomEvent('session:completed', { detail: { sessionId: activeSession.id, completedSets: completedCount } }));
                    }
                }
            }
            return created;
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setIsLogging(false);
        }
    }, [activeSession, addSet, finishSession]);

    return { logSet, isLogging, error };
};
