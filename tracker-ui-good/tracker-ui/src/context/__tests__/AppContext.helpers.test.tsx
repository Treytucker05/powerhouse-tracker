import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp, handleAuthFailure } from '@/context/AppContext';
import * as helpers from '@/context/appHelpers';

vi.mock('@/lib/supabaseClient', () => {
    const makeQuery = () => ({
        select: vi.fn(() => ({
            eq: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
            })),
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        upsert: vi.fn(() => ({
            select: () => ({
                single: () => Promise.resolve({ data: { ok: true }, error: null })
            })
        }))
    });
    return {
        supabase: {
            auth: {
                getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u1' } } } })),
                onAuthStateChange: vi.fn((cb) => {
                    cb('SIGNED_IN', { user: { id: 'u1' } });
                    return { data: { subscription: { unsubscribe: vi.fn() } } };
                })
            },
            from: vi.fn(() => makeQuery())
        }
    };
});

function renderUseApp() {
    return renderHook(() => useApp(), { wrapper: ({ children }) => <AppProvider>{children}</AppProvider> });
}

describe('AppContext basic flow', () => {
    it('provides user after auth bootstrap', async () => {
        const { result } = renderUseApp();
        expect(result.current.user).toBeTruthy();
        expect(result.current.user?.id).toBe('u1');
    });

    it('allows setting and clearing assessment', () => {
        const { result } = renderUseApp();
        act(() => result.current.setAssessment({ strength: 10 }));
        expect(result.current.assessment?.strength).toBe(10);
        act(() => result.current.clearAssessment());
        expect(result.current.assessment).toBeNull();
    });

    it('updateAssessment generates recommendation and persists', async () => {
        const { result } = renderUseApp();
        await act(async () => {
            await result.current.updateAssessment({
                primaryGoal: 'General Fitness',
                trainingExperience: 'Beginner <1 year',
                timeline: '4-8 weeks'
            });
        });
        expect(result.current.assessment?.recommendedSystem).toBe('Linear');
    });

    it('handleAuthFailure triggers navigate on protected route', () => {
        const navigate = vi.fn();
        Object.defineProperty(window, 'location', { value: { pathname: '/private' }, writable: true });
        handleAuthFailure(navigate, 'Test');
        expect(navigate).toHaveBeenCalledWith('/login', expect.any(Object));
    });
});

describe('appHelpers.generateRecommendation', () => {
    it('returns Linear for beginner', () => {
        expect(helpers.generateRecommendation('General Fitness', 'Beginner <1 year', '4-8 weeks')).toBe('Linear');
    });
    it('returns Conjugate for elite athletic performance', () => {
        expect(helpers.generateRecommendation('Athletic Performance', 'Elite 5+ years', '12-16 weeks')).toBe('Conjugate');
    });
    it('returns Linear for bodybuilding intermediate', () => {
        expect(helpers.generateRecommendation('Bodybuilding/Physique', 'Intermediate 1-3 years', '12-16 weeks')).toBe('Linear');
    });
});

describe('appHelpers.sync/load localStorage', () => {
    beforeEach(() => localStorage.clear());
    it('persists and retrieves object', () => {
        const ok = helpers.syncToLocalStorage('testKey', { a: 1 });
        expect(ok).toBe(true);
        const loaded = helpers.loadFromLocalStorage('testKey');
        expect(loaded?.a).toBe(1);
    });
});
