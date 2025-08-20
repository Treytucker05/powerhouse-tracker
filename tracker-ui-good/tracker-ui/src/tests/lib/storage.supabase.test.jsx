import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper to mock supabase client per test scenario
function mockSupabaseChains(chains) {
    return chains;
}

describe('storage.js supabase success paths', () => {
    let originalEnv;

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development'; // ensure supabase var not nulled
        vi.resetModules();
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('saveMacrocycle uses supabase when available and succeeds without local fallback', async () => {
        const mockSaved = { id: 'sup-123', name: 'Test', updatedAt: Date.now() };
        const mockSupabase = {
            from: () => ({
                upsert: () => ({
                    select: () => ({
                        single: async () => ({ data: mockSaved, error: null })
                    })
                })
            })
        };
        vi.doMock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
        const { saveMacrocycle } = await import('@/lib/storage.js');
        const id = await saveMacrocycle({ id: 'sup-123', name: 'Test' });
        expect(id).toBe('sup-123');
        expect(localStorage.getItem('macro_sup-123')).toBeNull();
    });

    it('loadAllMacrocycles fetches from supabase when available', async () => {
        const mockData = [
            { id: '1', name: 'Cycle 1', updatedAt: 2 },
            { id: '2', name: 'Cycle 2', updatedAt: 1 }
        ];
        const mockSupabase = {
            from: () => ({
                select: () => ({
                    order: () => ({ data: mockData, error: null })
                })
            })
        };
        vi.doMock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
        const { loadAllMacrocycles } = await import('@/lib/storage.js');
        const list = await loadAllMacrocycles();
        expect(list).toEqual(mockData);
    });

    it('deleteMacrocycle successfully deletes via supabase', async () => {
        const mockSupabase = {
            from: () => ({
                delete: () => ({
                    eq: () => ({ error: null })
                })
            })
        };
        vi.doMock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
        const { deleteMacrocycle } = await import('@/lib/storage.js');
        const ok = await deleteMacrocycle('x1');
        expect(ok).toBe(true);
    });

    it('loadMacrocycle fetches single cycle from supabase', async () => {
        const mockRecord = { id: 'abc', name: 'Sup Cycle' };
        const mockSupabase = {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: mockRecord, error: null })
                    })
                })
            })
        };
        vi.doMock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
        const { loadMacrocycle } = await import('@/lib/storage.js');
        const rec = await loadMacrocycle('abc');
        expect(rec).toEqual(mockRecord);
    });
});
