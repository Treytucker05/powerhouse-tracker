import { describe, it, expect, vi } from 'vitest';
import {
    computeAssistance,
    computeBBBFromConfig,
    computeSupplemental,
    nextTM,
    computeNextTMs
} from '@/methods/531/calc';

// Additional targeted branch coverage for calc.js

describe('calc additional branch coverage', () => {
    it('computeAssistance returns array when assistanceFor present (baseline branch)', async () => {
        // Use real module (no mock) to assert non-empty assistance for coverage
        const { computeAssistance: fresh } = await import('@/methods/531/calc');
        const res = fresh('custom', 'bench', { templateKey: 'bbb' });
        expect(Array.isArray(res)).toBe(true);
    });

    it('computeBBBFromConfig early returns and default sets/reps fallback', () => {
        // No supplemental
        expect(computeBBBFromConfig({ supplemental: null, lift: 'bench', tms: { bench: 200 } })).toBeNull();
        // Non-bbb mode
        expect(computeBBBFromConfig({ supplemental: { strategy: 'fsl' }, lift: 'bench', tms: { bench: 200 } })).toBeNull();
        // Missing TM
        expect(computeBBBFromConfig({ supplemental: { strategy: 'bbb' }, lift: 'bench', tms: {} })).toBeNull();
        // Default sets/reps + pct fallback (no percentOfTM / intensity)
        const cfg = computeBBBFromConfig({ supplemental: { strategy: 'bbb' }, lift: 'bench', tms: { bench: 200 }, units: 'lbs' });
        expect(cfg).toBeTruthy();
        // Default lowered to 50% (legacy was 60%)
        expect(cfg.pct).toBe(50);
        expect(cfg.sets).toBe(5);
        expect(cfg.reps).toBe(10);
    });

    it('computeSupplemental covers null sup, non-bbb, and fallback 50% with default sets/reps', () => {
        // No supplemental in state
        expect(computeSupplemental(null, 'squat', 300, { units: 'lbs' })).toBeNull();
        // Non-bbb strategy
        expect(computeSupplemental(null, 'squat', 300, { supplemental: { strategy: 'fsl' }, units: 'lbs' })).toBeNull();
        // Fallback now 50 path
        const sup = computeSupplemental(null, 'squat', 300, { supplemental: { strategy: 'bbb' }, units: 'lbs', roundingPref: { lbs: 5 } });
        expect(sup.pct).toBe(50);
        expect(sup.sets).toBe(5);
        expect(sup.reps).toBe(10);
    });

    it('explicit legacy 60% override still honored', () => {
        const cfg = computeBBBFromConfig({ supplemental: { strategy: 'bbb', percentOfTM: 60 }, lift: 'bench', tms: { bench: 200 }, units: 'lbs' });
        expect(cfg.pct).toBe(60);
        const sup = computeSupplemental(null, 'bench', 200, { supplemental: { strategy: 'bbb', percentOfTM: 60 }, units: 'lbs' });
        expect(sup.pct).toBe(60);
    });

    it('nextTM kg increments differ for upper vs lower lifts', () => {
        const benchNext = nextTM('bench', 100, 'kg', true, { kg: 2.5 }); // +2.5 then rounded
        const squatNext = nextTM('squat', 100, 'kg', true, { kg: 2.5 }); // +5 then rounded
        expect(benchNext - 100).toBe(2.5);
        expect(squatNext - 100).toBe(5);
    });

    it('computeNextTMs with kg uses proper increments and pass/fail logic', () => {
        const tms = { bench: 100, squat: 150, deadlift: 180, press: 60 };
        const next = computeNextTMs({ tms, units: 'kg', rounding: { kg: 2.5 }, amrapWk3: { bench: 5, squat: 0, deadlift: 3, press: null }, state: { amrapMinWk3: 1 } });
        // bench passed -> +2.5 ; squat failed -> -5 ; deadlift passed -> +5 ; press null reps -> treated as pass -> +2.5
        expect(next.bench).toBe(102.5);
        expect(next.squat).toBe(145); // 150 - 5
        expect(next.deadlift).toBe(185); // 180 + 5
        expect(next.press).toBe(62.5); // 60 + 2.5
    });
});
