import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Helper to generate ISO date (YYYY-MM-DD) for current week offsets (Mon=0)
function currentWeekDate(offset) {
    const now = new Date();
    const currentDay = now.getDay(); // 0=Sun
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now.getTime() + mondayOffset * 24 * 60 * 60 * 1000);
    monday.setHours(0, 0, 0, 0);
    const d = new Date(monday.getTime() + offset * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
}

describe('useWeekStatus branch coverage (happy/edge paths)', () => {
    let queryClient;
    const wrapper = ({ children }) => {
        queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    beforeEach(() => {
        vi.resetModules();
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('processes successful data with mixed session statuses', async () => {
        const sessions = [
            { date: currentWeekDate(0), completed: true, planned: true, focus: 'Upper', id: '1' }, // completed + planned
            { date: currentWeekDate(1), completed: false, planned: true, focus: 'Lower', id: '2' }, // planned
            { date: currentWeekDate(2), completed: true, planned: false, focus: 'Upper', id: '3' }, // completed unplanned
            { date: currentWeekDate(3), completed: false, planned: false, focus: null, id: '4' } // scheduled (neither)
        ];
        vi.doMock('@/lib/api/supabaseClient', () => ({
            getCurrentUserId: vi.fn().mockResolvedValue('user-123'),
            supabase: {
                from: () => ({
                    select: () => ({ eq: () => ({ gte: () => ({ lte: () => ({ order: vi.fn().mockResolvedValue({ data: sessions, error: null }) }) }) }) })
                })
            }
        }));
        const { default: useWeekStatus } = await import('@/hooks/useWeekStatus');
        const { result } = renderHook(() => useWeekStatus(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data).toBeDefined();
        expect(result.current.data.completedCount).toBe(2);
        expect(result.current.data.totalPlanned).toBe(3); // two completed + one planned-only
        expect(result.current.data.days).toHaveLength(7);
        const statuses = result.current.data.days.map(d => d.status);
        expect(statuses).toContain('completed');
        expect(statuses).toContain('planned');
        expect(statuses).toContain('scheduled');
        expect(statuses).toContain('rest');
    });

    it('handles empty week (no sessions)', async () => {
        vi.doMock('@/lib/api/supabaseClient', () => ({
            getCurrentUserId: vi.fn().mockResolvedValue('user-123'),
            supabase: { from: () => ({ select: () => ({ eq: () => ({ gte: () => ({ lte: () => ({ order: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }) }) }) }
        }));
        const { default: useWeekStatus } = await import('@/hooks/useWeekStatus');
        const { result } = renderHook(() => useWeekStatus(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data.completedCount).toBe(0);
        expect(result.current.data.totalPlanned).toBe(0);
        expect(result.current.data.days).toHaveLength(7);
        expect(result.current.data.days.every(d => d.status === 'rest')).toBe(true);
    });

    it('handles partial week data correctly', async () => {
        const sessions = [
            { date: currentWeekDate(0), completed: true, planned: true, focus: 'Upper', id: '1' },
            { date: currentWeekDate(2), completed: false, planned: true, focus: 'Lower', id: '2' }
        ];
        vi.doMock('@/lib/api/supabaseClient', () => ({
            getCurrentUserId: vi.fn().mockResolvedValue('user-123'),
            supabase: { from: () => ({ select: () => ({ eq: () => ({ gte: () => ({ lte: () => ({ order: vi.fn().mockResolvedValue({ data: sessions, error: null }) }) }) }) }) }) }
        }));
        const { default: useWeekStatus } = await import('@/hooks/useWeekStatus');
        const { result } = renderHook(() => useWeekStatus(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data.completedCount).toBe(1);
        expect(result.current.data.totalPlanned).toBe(2);
        expect(result.current.data.days).toHaveLength(7);
    });
});
