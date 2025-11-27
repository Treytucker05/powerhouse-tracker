import { describe, it, expect } from 'vitest';
import { computeWarmupSets, getWarmupsByPolicy, DEFAULT_WARMUP, MINIMAL_WARMUP } from '../warmup.js';

describe('warmup helpers coverage', () => {
    it('computeWarmupSets returns [] for invalid tm', () => {
        expect(computeWarmupSets('x', DEFAULT_WARMUP).length).toBe(0);
    });
    it('computeWarmupSets maps pct to weight with rounding', () => {
        const sets = computeWarmupSets(200, DEFAULT_WARMUP, { increment: 5, mode: 'nearest' });
        expect(sets[0].weight % 5).toBe(0);
    });
    it('getWarmupsByPolicy minimal uses MINIMAL_WARMUP', () => {
        const sets = getWarmupsByPolicy('minimal', [], 180, { increment: 5, mode: 'nearest' });
        expect(sets).toHaveLength(MINIMAL_WARMUP.length);
    });
    it('getWarmupsByPolicy custom falls back to default if custom empty', () => {
        const sets = getWarmupsByPolicy('custom', [], 150, { increment: 5, mode: 'nearest' });
        expect(sets).toHaveLength(DEFAULT_WARMUP.length);
    });
});
