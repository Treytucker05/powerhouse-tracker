import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Targeted branch coverage for storage.js

describe('storage.js targeted branch coverage', () => {
    let storage;

    beforeEach(async () => {
        localStorage.clear();
        vi.resetModules();
        storage = await import('@/lib/storage.js');
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('handles corrupted JSON in get()', () => {
        const key = 'test_key';
        localStorage.setItem(key, 'invalid{json');
        const result = storage.get(key);
        expect(result).toBeNull();
        // undefined string value path
        localStorage.setItem(key, String(undefined));
        expect(storage.get(key)).toBeNull();
    });

    it('loadAllMacrocycles skips invalid/missing id entries and sorts by updatedAt desc', async () => {
        localStorage.setItem('macro_valid1', JSON.stringify({ id: 'valid1', name: 'Valid Cycle', updatedAt: '1704067200000' })); // 2024-01-01
        localStorage.setItem('macro_corrupt', 'not{valid}json');
        localStorage.setItem('macro_valid2', JSON.stringify({ id: 'valid2', name: 'Another Cycle', updatedAt: '1706832000000' })); // 2024-02-02
        localStorage.setItem('macro_incomplete', JSON.stringify({ updatedAt: '2024-03-03' })); // no id -> filtered
        localStorage.setItem('other_key', 'data');
        const { loadAllMacrocycles } = storage;
        const cycles = await loadAllMacrocycles();
        expect(cycles.map(c => c.id)).toEqual(['valid2', 'valid1']);
    });

    it('deleteMacrocycle returns true (local success) when no supabase client present', async () => {
        const id = 'local-cycle-123';
        localStorage.setItem(`macro_${id}`, JSON.stringify({ id, name: 'Test' }));
        const { deleteMacrocycle } = storage;
        const res = await deleteMacrocycle(id);
        expect(res).toBe(true);
        expect(localStorage.getItem(`macro_${id}`)).toBeNull();
    });

    it('loadMacrocycle returns null for missing id', async () => {
        const { loadMacrocycle } = storage;
        const res = await loadMacrocycle('missing-id');
        expect(res).toBeNull();
    });

    it('get gracefully handles thrown getItem (quota simulation)', () => {
        const original = localStorage.getItem;
        localStorage.getItem = () => { throw new Error('QuotaExceededError'); };
        const res = storage.get('any');
        expect(res).toBeNull();
        localStorage.getItem = original;
    });

    it('remove handles non-existent key', () => {
        expect(() => storage.remove('never-existed')).not.toThrow();
    });
});
