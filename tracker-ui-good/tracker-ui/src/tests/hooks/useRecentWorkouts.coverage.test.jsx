import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/lib/supabaseClient', () => {
    const chain = () => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null })
    });
    return {
        supabase: { from: vi.fn(() => chain()) },
        getCurrentUserId: vi.fn(async () => 'USER_ID')
    };
});

import useRecentWorkouts from '@/hooks/useRecentWorkouts';
import * as supabaseApi from '@/lib/supabaseClient';

const createWrapper = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: 0 } } });
    return ({ children }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe('useRecentWorkouts (coverage)', () => {
    it('returns workouts on success', async () => {
        // Arrange chain returning one record
        supabaseApi.supabase.from.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: [{ id: 1, title: 'W1', date: '2025-06-05', duration_minutes: 45, exercises_count: 5, sets_count: 15, total_volume: 5000, completed: true }], error: null })
        });
        const { result } = renderHook(() => useRecentWorkouts(3), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.data?.length).toBe(1));
        expect(result.current.data[0].name).toBe('W1');
    });

    it('handles authentication failure (returns fallback)', async () => {
        supabaseApi.getCurrentUserId.mockResolvedValueOnce(null);
        const { result } = renderHook(() => useRecentWorkouts(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.data).toBeTruthy());
        expect(result.current.data[0].id).toMatch(/^fw/);
    });

    it('handles empty data', async () => {
        const { result } = renderHook(() => useRecentWorkouts(), { wrapper: createWrapper() });
        await waitFor(() => expect(Array.isArray(result.current.data)).toBe(true));
        // default chain returns []
        expect(result.current.data).toEqual([]);
    });

    it('handles Supabase error with fallback', async () => {
        supabaseApi.supabase.from.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: null, error: new Error('fail') })
        });
        const { result } = renderHook(() => useRecentWorkouts(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.data).toBeTruthy());
        expect(result.current.data[0].id).toMatch(/^fw/);
    });
});
