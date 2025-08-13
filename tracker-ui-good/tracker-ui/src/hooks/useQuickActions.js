// TODO(treytucker): stub for tests; implement real quick-actions logic by 2025-08-31
export const useQuickActions = () => {
    return {
        data: {
            startTodayLabel: "Start Today's Workout",
            startToday: () => { },
            startTodayDisabled: false,
            openLogger: () => { },
            openLoggerDisabled: false,
            viewProgram: () => { },
            viewProgramDisabled: false,
            hasPlannedSession: false,
            todaySession: null,
            sessionCompleted: false
        },
        isLoading: false,
        error: null
    };
};
