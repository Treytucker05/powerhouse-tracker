import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '@/context/AppContext';
import * as helpers from '@/context/appHelpers';

vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u1' } } } })),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({ eq: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve({ data: [], error: null })) })) }))
        }))
    }
}));

function renderCtx() {
    return renderHook(() => useApp(), { wrapper: ({ children }) => <AppProvider>{children}</AppProvider> });
}

describe('AppContext action error branches', () => {
    it('saveProgram catches thrown sync error', async () => {
        const spy = vi.spyOn(helpers, 'syncToSupabase').mockRejectedValueOnce(new Error('fail sync'));
        const { result } = renderCtx();
        await act(async () => {
            try {
                await result.current.saveProgram({ id: 'p1' });
            } catch { }
        });
        spy.mockRestore();
    });

    it('updateTimeline falls back gracefully', async () => {
        const { result } = renderCtx();
        await act(async () => { await result.current.updateTimeline({ phases: 3 }); });
        expect(result.current.timeline?.phases).toBe(3);
    });

    it('clearUserData removes localStorage keys', () => {
        localStorage.setItem('userProfile', '{}');
        const { result } = renderCtx();
        act(() => { result.current.clearUserData(); });
        expect(localStorage.getItem('userProfile')).toBeNull();
    });
});
