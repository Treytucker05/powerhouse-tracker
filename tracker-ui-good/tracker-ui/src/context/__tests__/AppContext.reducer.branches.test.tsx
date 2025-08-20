import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '@/context/AppContext';
import { APP_ACTIONS } from '@/context/appActions';
import * as helpers from '@/context/appHelpers';

vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u1' } } } })),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({ limit: vi.fn(() => Promise.resolve({ data: [], error: null })) })),
            upsert: vi.fn(() => ({ select: () => ({ single: () => Promise.resolve({ data: { ok: true }, error: null }) }) }))
        }))
    }
}));

function renderCtx() {
    return renderHook(() => useApp(), { wrapper: ({ children }) => <AppProvider>{children}</AppProvider> });
}

describe('AppContext reducer branch coverage', () => {
    it('handles program save and clear branches', () => {
        const { result } = renderCtx();
        act(() => result.current.dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: { id: 'p1', name: 'Prog' } }));
        expect(result.current.currentProgram?.id).toBe('p1');
        act(() => result.current.dispatch({ type: APP_ACTIONS.CLEAR_PROGRAM }));
        expect(result.current.currentProgram).toBeNull();
    });

    it('handles timeline set/add/update/remove/clear branches', () => {
        const { result } = renderCtx();
        act(() => result.current.dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: [{ id: 'e1', name: 'Event1' }] }));
        expect(result.current.timeline.length).toBe(1);
        act(() => result.current.dispatch({ type: APP_ACTIONS.ADD_TIMELINE_EVENT, payload: { id: 'e2', name: 'Event2' } }));
        expect(result.current.timeline.length).toBe(2);
        act(() => result.current.dispatch({ type: APP_ACTIONS.UPDATE_TIMELINE_EVENT, payload: { id: 'e2', name: 'Event2b' } }));
        expect(result.current.timeline.find((e: any) => e.id === 'e2')?.name).toBe('Event2b');
        act(() => result.current.dispatch({ type: APP_ACTIONS.REMOVE_TIMELINE_EVENT, payload: 'e1' }));
        expect(result.current.timeline.length).toBe(1);
        act(() => result.current.dispatch({ type: APP_ACTIONS.CLEAR_TIMELINE }));
        expect(result.current.timeline.length).toBe(0);
    });

    it('handles volume landmarks and mesocycle branches', () => {
        const { result } = renderCtx();
        act(() => result.current.setAssessment({ volumeLandmarks: { MEV: 10 }, mesocycle: { week: 1 } }));
        act(() => result.current.dispatch({ type: APP_ACTIONS.UPDATE_VOLUME_LANDMARKS, payload: { MRV: 20 } }));
        expect(result.current.assessment?.volumeLandmarks?.MRV).toBe(20);
        act(() => result.current.dispatch({ type: APP_ACTIONS.SET_VOLUME_LANDMARKS, payload: { MEV: 12, MRV: 18 } }));
        expect(result.current.assessment?.volumeLandmarks?.MEV).toBe(12);
        act(() => result.current.dispatch({ type: APP_ACTIONS.CLEAR_VOLUME_LANDMARKS }));
        expect(result.current.assessment?.volumeLandmarks).toBeNull();

        act(() => result.current.dispatch({ type: APP_ACTIONS.UPDATE_MESOCYCLE, payload: { week: 2 } }));
        expect(result.current.assessment?.mesocycle?.week).toBe(2);
        act(() => result.current.dispatch({ type: APP_ACTIONS.SET_MESOCYCLE, payload: { week: 3 } }));
        expect(result.current.assessment?.mesocycle?.week).toBe(3);
        act(() => result.current.dispatch({ type: APP_ACTIONS.CLEAR_MESOCYCLE }));
        expect(result.current.assessment?.mesocycle).toBeNull();
    });
});

describe('appHelpers branch functions', () => {
    it('syncToSupabase early returns without userId', async () => {
        const res = await helpers.syncToSupabase('user_assessments', { a: 1 }, undefined);
        expect(res).toBeNull();
    });
});

describe('Context utility actions', () => {
    it('setLoading and clearLoading toggle loading flags', () => {
        const { result } = renderCtx();
        act(() => result.current.setLoading('assessment', true));
        expect(result.current.loading.assessment).toBe(true);
        act(() => result.current.clearLoading('assessment'));
        expect(result.current.loading.assessment).toBe(false);
    });

    it('setError and clearError manage errors object', () => {
        const { result } = renderCtx();
        act(() => result.current.setError('assessment', 'Boom'));
        expect(result.current.errors.assessment).toBe('Boom');
        act(() => result.current.clearError('assessment'));
        expect(result.current.errors.assessment).toBeNull();
    });

    it('clearUserData resets stored state', () => {
        const { result } = renderCtx();
        act(() => {
            result.current.setAssessment({ foo: 'bar' });
            result.current.dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: { id: 'p1' } });
            result.current.dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: [{ id: 'e1' }] });
        });
        expect(result.current.assessment).not.toBeNull();
        act(() => result.current.clearUserData());
        expect(result.current.assessment).toBeNull();
        expect(result.current.currentProgram).toBeNull();
        expect(result.current.timeline.length).toBe(0);
    });
});
