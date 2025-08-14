import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Additional error-path coverage for storage.js to raise branch %

describe('storage.js error path coverage', () => {
    let storage;

    beforeEach(async () => {
        localStorage.clear();
        vi.resetModules();
        process.env.NODE_ENV = 'test'; // default test env (supabase disabled)
        storage = await import('@/lib/storage.js');
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('handles localStorage.setItem throwing error in set()', () => {
        const original = localStorage.setItem;
        localStorage.setItem = vi.fn(() => { throw new Error('Storage quota exceeded'); });
        expect(() => storage.set('err-key', { foo: 'bar' })).not.toThrow();
        localStorage.setItem = original;
    });

    it('handles localStorage.removeItem throwing error in remove()', () => {
        const original = localStorage.removeItem;
        localStorage.removeItem = vi.fn(() => { throw new Error('Security error'); });
        expect(() => storage.remove('missing-key')).not.toThrow();
        localStorage.removeItem = original;
    });

    it('saveMacrocycle falls back to localStorage when supabase upsert returns error', async () => {
        vi.resetModules();
        process.env.NODE_ENV = 'development'; // enable supabase path
        vi.doMock('@/lib/api/supabaseClient', () => ({
            supabase: {
                from: () => ({
                    upsert: () => ({
                        select: () => ({
                            single: async () => ({ data: null, error: new Error('Database connection failed') })
                        })
                    })
                })
            },
            getCurrentUserId: () => Promise.resolve('user-123')
        }));
        const { saveMacrocycle } = await import('@/lib/storage.js');
        const id = await saveMacrocycle({ name: 'Fallback Test', weeks: 4 });
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0); // randomUUID full string
        const storedRaw = localStorage.getItem(`macro_${id}`);
        expect(storedRaw).toBeTruthy();
        const stored = JSON.parse(storedRaw);
        expect(stored.name).toBe('Fallback Test');
    });

    it('loadAllMacrocycles falls back to localStorage after supabase error', async () => {
        // seed local data
        localStorage.setItem('macro_local1', JSON.stringify({ id: 'local1', name: 'Local Cycle 1', updatedAt: Date.now() - 1000 }));
        localStorage.setItem('macro_local2', JSON.stringify({ id: 'local2', name: 'Local Cycle 2', updatedAt: Date.now() }));

        vi.resetModules();
        process.env.NODE_ENV = 'development';
        vi.doMock('@/lib/api/supabaseClient', () => ({
            supabase: {
                from: () => ({
                    select: () => ({
                        order: () => ({ data: null, error: new Error('Query failed') })
                    })
                })
            },
            getCurrentUserId: () => Promise.resolve('user-123')
        }));
        const { loadAllMacrocycles } = await import('@/lib/storage.js');
        const cycles = await loadAllMacrocycles();
        expect(cycles.map(c => c.id)).toEqual(['local2', 'local1']);
    });

    it('loadMacrocycle falls back to localStorage when supabase single() errors', async () => {
        const id = 'macro-x1';
        localStorage.setItem(`macro_${id}`, JSON.stringify({ id, name: 'Local Macro' }));

        vi.resetModules();
        process.env.NODE_ENV = 'development';
        vi.doMock('@/lib/api/supabaseClient', () => ({
            supabase: {
                from: () => ({
                    select: () => ({
                        eq: () => ({ single: async () => ({ data: null, error: new Error('Not found') }) })
                    })
                })
            },
            getCurrentUserId: () => Promise.resolve('user-123')
        }));
        const { loadMacrocycle } = await import('@/lib/storage.js');
        const rec = await loadMacrocycle(id);
        expect(rec).toBeTruthy();
        expect(rec.name).toBe('Local Macro');
    });

    it('handles supabase object lacking from() (user not authenticated edge) gracefully', async () => {
        vi.resetModules();
        process.env.NODE_ENV = 'development';
        vi.doMock('@/lib/api/supabaseClient', () => ({
            supabase: {}, // truthy but missing from -> triggers TypeError caught by try/catch
            getCurrentUserId: () => Promise.resolve(null)
        }));
        const { saveMacrocycle, loadAllMacrocycles } = await import('@/lib/storage.js');
        const id = await saveMacrocycle({ name: 'Unauth Test' });
        const list = await loadAllMacrocycles();
        expect(list.some(c => c.id === id)).toBe(true);
    });
});
