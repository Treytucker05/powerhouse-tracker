// TODO(treytucker): stub for tests; integrate real session state store by 2025-08-31
export const useActiveSession = () => {
    return {
        activeSession: { id: 'session-123', planned_sets: [] },
        addSet: async (setData) => ({ id: 'set-123', ...setData }),
        finishSession: async () => ({ success: true })
    };
};
