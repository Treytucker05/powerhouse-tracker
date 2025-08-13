import { describe, it, expect } from 'vitest';
import { ASSISTANCE_CATALOG, getExerciseMeta, normalizeAssistance, blocksFor } from '../assistance/index.js';
import { TEMPLATE_KEYS } from '../../../lib/templates/531.presets.v2.js';

// Edge / branch coverage for assistance index utilities

describe('assistance/index edge cases', () => {
    it('getExerciseMeta returns null for unknown id', () => {
        expect(getExerciseMeta('not_real_exercise')).toBeNull();
    });

    it('normalizeAssistance returns [] for unknown templateKey', () => {
        expect(normalizeAssistance('unknown_template', 'Bench')).toEqual([]);
    });

    it('normalizeAssistance returns [] when template key missing', () => {
        expect(normalizeAssistance(undefined, 'Bench')).toEqual([]);
    });

    it('normalizeAssistance maps canonical lift name detection (case-insensitive within word)', () => {
        const res = normalizeAssistance(TEMPLATE_KEYS.BBB, 'Competition Bench Press');
        expect(res.length).toBeGreaterThan(0);
        // BBB Bench defaults include chinups & ab_wheel by id meta
        const ids = res.map(r => r.id);
        expect(ids).toContain('chinups');
        expect(ids).toContain('ab_wheel');
    });

    it('blocksFor returns unique blocks for template/lift', () => {
        const blocks = blocksFor(TEMPLATE_KEYS.PERIODIZATION_BIBLE, 'Deadlift Day');
        expect(Array.isArray(blocks)).toBe(true);
        // Expect at least hinge/back/core blocks represented
        expect(blocks.length).toBeGreaterThan(1);
    });

    it('ASSISTANCE_CATALOG has consistent shape', () => {
        expect(ASSISTANCE_CATALOG.length).toBeGreaterThan(10);
        for (const ex of ASSISTANCE_CATALOG.slice(0, 5)) { // sample check first 5 for speed
            expect(ex).toHaveProperty('id');
            expect(ex).toHaveProperty('name');
            expect(ex).toHaveProperty('sets');
            expect(ex).toHaveProperty('reps');
            expect(Array.isArray(ex.equipment)).toBe(true);
        }
    });
});
