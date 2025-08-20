import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock supabase client module
vi.mock('@/lib/supabaseClient', () => {
    return {
        supabase: {
            from: vi.fn(() => ({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [{ date: new Date().toISOString().split('T')[0], completed: true, planned: true, focus: 'Push Day A' }], error: null })
            }))
        },
        getCurrentUserId: vi.fn(async () => 'USER_ID')
    };
});

import useWeekStatus from '@/hooks/useWeekStatus';

const createWrapper = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: 0 } } });
    return ({ children }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe('useWeekStatus (coverage)', () => {
    it('returns computed week status on success', async () => {
        const { result } = renderHook(() => useWeekStatus(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.data).toBeTruthy());
        expect(result.current.data.days.length).toBe(7);
        expect(result.current.data.completedCount).toBeGreaterThanOrEqual(1);
    });

    it('returns fallback data when user not authenticated', async () => {
        const mod = await import('@/lib/supabaseClient');
        mod.getCurrentUserId.mockResolvedValueOnce(null);
        const { result } = renderHook(() => useWeekStatus(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.data).toBeTruthy());
        expect(result.current.data.days.length).toBe(7);
    });
});
