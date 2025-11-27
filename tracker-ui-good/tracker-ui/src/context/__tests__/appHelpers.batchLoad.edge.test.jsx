import { describe, it, expect, vi, beforeEach } from 'vitest';
import { batchLoadFromSupabase, checkTableExists, syncToLocalStorage } from '../appHelpers.js';

vi.mock('react-toastify', () => ({ toast: { info: vi.fn(), warn: vi.fn() } }));

vi.mock('@/lib/supabaseClient', () => {
    const state = { session: { user: { id: 'u' } }, behaviors: new Map(), throwTables: new Set(), sessionMode: 'ok' };
    return {
        supabase: {
            auth: {
                getSession: vi.fn(async () => {
                    if (state.sessionMode === 'error') return { data: { session: null }, error: new Error('session-err') };
                    if (state.sessionMode === 'throw') throw new Error('hard auth fail');
                    return { data: { session: state.session }, error: null };
                })
            },
            from: (table) => {
                if (state.throwTables.has(table)) throw new Error('boom from select');
                const beh = state.behaviors.get(table) || { data: [{ id: 1 }], error: null };
                const chain = {
                    select: () => chain,
                    eq: () => chain,
                    limit: () => Promise.resolve({ data: beh.data, error: beh.error })
                };
                return chain;
            }
        },
        __api: state
    };
});
import { __api as __supabase } from '@/lib/supabaseClient';

beforeEach(() => {
    localStorage.clear();
    __supabase.behaviors.clear();
    __supabase.throwTables.clear();
    __supabase.sessionMode = 'ok';
});

describe('batchLoadFromSupabase edge branches', () => {
    it('covers table missing (42P01) branch inside per-table promise', async () => {
        __supabase.behaviors.set('t_missing', { data: [], error: { code: '42P01', message: 'no table' } });
        syncToLocalStorage('t_missing', { cached: true });
        const out = await batchLoadFromSupabase(['t_missing'], 'u');
        expect(out.t_missing.cached).toBe(true);
    });

    it('covers schema issue 42703 branch', async () => {
        __supabase.behaviors.set('t_schema', { data: [], error: { code: '42703', message: 'bad column' } });
        syncToLocalStorage('t_schema', { cache2: true });
        const out = await batchLoadFromSupabase(['t_schema'], 'u');
        expect(out.t_schema.cache2).toBe(true);
    });

    it('covers generic error code branch with no local fallback returning null', async () => {
        __supabase.behaviors.set('t_generic', { data: [], error: { code: 'XX', message: 'weird' } });
        const out = await batchLoadFromSupabase(['t_generic'], 'u');
        expect(out.t_generic).toBe(null);
    });

    it('covers thrown error inside table loop (catch err path)', async () => {
        __supabase.throwTables.add('t_throw');
        syncToLocalStorage('t_throw', { local: 1 });
        const out = await batchLoadFromSupabase(['t_throw'], 'u');
        expect(out.t_throw.local).toBe(1);
    });

    it('covers outer catch when auth session retrieval errors after having valid local fallbacks (error object path)', async () => {
        __supabase.sessionMode = 'error';
        syncToLocalStorage('x1', { a: 1 });
        const out = await batchLoadFromSupabase(['x1'], 'u');
        expect(out.x1.a).toBe(1);
    });

    it('covers outer catch with thrown auth error (exception path)', async () => {
        __supabase.sessionMode = 'throw';
        syncToLocalStorage('x2', { b: 2 });
        const out = await batchLoadFromSupabase(['x2'], 'u');
        expect(out.x2.b).toBe(2);
    });

    it('handles empty table list returning empty object', async () => {
        const out = await batchLoadFromSupabase([], 'u');
        expect(out).toEqual({});
    });
});
