import { describe, it, expect } from 'vitest';
// Explicit index.js to avoid resolution issues in ESM + alias when importing a directory
import { normalizeAssistance } from '@/methods/531/assistance/index.js';

// Equipment filtering edge cases: we treat provided equipment array as permissive; items whose tags
// are all contained in the user's equipment list should pass. Empty equipment list -> still returns defaults.

describe('assistance equipment filtering (edge cases)', () => {
    const baseState = { units: 'lbs', equipment: ['bb', 'db', 'band', 'cable', 'bench', 'bar'] };

    it('returns only items whose equipment requirements are satisfied', () => {
        const items = normalizeAssistance('periodization_bible', 'press', baseState);
        expect(items.length).toBeGreaterThan(0);
        expect(items.every(i => (i.equipment || []).every(tag => baseState.equipment.includes(tag)))).toBe(true);
    });

    it('gracefully falls back when equipment list is empty (still returns template defaults)', () => {
        const items = normalizeAssistance('triumvirate', 'deadlift', { ...baseState, equipment: [] });
        expect(items.length).toBeGreaterThan(0);
    });
});
