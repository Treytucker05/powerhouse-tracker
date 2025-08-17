import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuickActions } from '@/hooks/useQuickActions';

const createClient = () => new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: 0 } } });

const wrapper = ({ children }) => (
    <QueryClientProvider client={createClient()}>{children}</QueryClientProvider>
);

describe('useQuickActions (coverage)', () => {
    it('returns baseline quick actions data', () => {
        const { result } = renderHook(() => useQuickActions(), { wrapper });
        expect(result.current).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.data).toBeTruthy();
        expect(result.current.data.startTodayLabel).toMatch(/Start/);
        expect(typeof result.current.data.startToday).toBe('function');
    });

    it('exposes disabled flags (baseline false)', () => {
        const { result } = renderHook(() => useQuickActions(), { wrapper });
        const d = result.current.data;
        expect(d.startTodayDisabled).toBe(false);
        expect(d.openLoggerDisabled).toBe(false);
        expect(d.viewProgramDisabled).toBe(false);
        // future branch coverage placeholder: when hasPlannedSession true logic added
        expect(d.hasPlannedSession).toBe(false);
    });
});
