import { describe, it, expect } from 'vitest';
import { set, get, remove } from '@/lib/storage';

// Force localStorage exceptions by monkey patching

describe('storage branch paths', () => {
    it('handles set/get/remove exceptions gracefully', () => {
        const origSet = global.localStorage.setItem;
        const origGet = global.localStorage.getItem;
        const origRem = global.localStorage.removeItem;
        global.localStorage.setItem = () => { throw new Error('set fail'); };
        global.localStorage.getItem = () => { throw new Error('get fail'); };
        global.localStorage.removeItem = () => { throw new Error('remove fail'); };
        expect(() => set('k', 'v')).not.toThrow();
        expect(() => get('k')).not.toThrow();
        expect(() => remove('k')).not.toThrow();
        global.localStorage.setItem = origSet;
        global.localStorage.getItem = origGet;
        global.localStorage.removeItem = origRem;
    });

    it('handles localStorage quota exceeded error', () => {
        const origSet = global.localStorage.setItem;
        global.localStorage.setItem = () => {
            const err = new Error('QuotaExceededError');
            err.name = 'QuotaExceededError';
            throw err;
        };
        expect(() => set('quota', { big: true })).not.toThrow();
        global.localStorage.setItem = origSet;
    });
});
