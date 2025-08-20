// src/lib/step4/tests/step4.test.ts
import { describe, it, expect } from 'vitest';
import { step4_cycle_preview } from '../index';
import type { Step4State } from '../types';

const baseState: Step4State = {
    unit: 'lb',
    microplates: false,
    oneRm: { bench: 200, squat: 300, deadlift: 405, press: 135 },
    schemeId: 'scheme_531',
    deload: { enabled: true, mode: '40/50/60', amrap: false },
    supplemental: { type: 'bbb', sets: 5, reps: 10, pctOfTM: 0.5, pairing: 'same' },
    schedule: { frequency: 4, order: ['press', 'deadlift', 'bench', 'squat'] },
    assistance: { buckets: ['Push', 'Pull', 'Single-leg', 'Core'], targetRepsPerBucket: [50, 100] },
};

describe('step4_cycle_preview — core', () => {
    it('computes week1 5/3/1 main sets with AMRAP only on last set', () => {
        const out = step4_cycle_preview(baseState);
        const day = out.days.find(d => d.weekIndex === 1 && d.lift === 'bench')!;
        // TM = 200*0.9 = 180
        expect(day.main[0].pct).toBeCloseTo(0.65);
        expect(day.main[0].weight).toBe(round(180 * 0.65, 'lb', false));
        expect(day.main[0].amrap).toBe(false);
        expect(day.main[1].amrap).toBe(false);
        expect(day.main[2].amrap).toBe(true);
        expect(day.main[2].reps.endsWith('+')).toBe(true);
    });

    it('deload week uses 40/50/60 with no AMRAP', () => {
        const out = step4_cycle_preview(baseState);
        const day = out.days.find(d => d.weekIndex === 4 && d.lift === 'squat')!;
        const pcts = day.main.map(s => s.pct);
        expect(pcts).toEqual([0.4, 0.5, 0.6]);
        expect(day.main.every(s => s.amrap === false)).toBe(true);
    });

    it('BBB supplemental weight = 50% TM, rounded', () => {
        const out = step4_cycle_preview(baseState);
        const day = out.days.find(d => d.weekIndex === 1 && d.lift === 'bench')!;
        // TM bench = 180, 50% = 90 -> round to nearest 5 = 90
        expect(day.supplemental?.weight).toBe(90);
        expect(day.supplemental?.sets).toBe(5);
        expect(day.supplemental?.reps).toBe(10);
    });
});

describe('step4_cycle_preview — scheme variants & rounding', () => {
    it('5s Pro disables AMRAP across weeks', () => {
        const st = { ...baseState, schemeId: 'scheme_5spro' } satisfies Step4State;
        const out = step4_cycle_preview(st);
        const anyAmrap = out.days.some(d => d.main.some(s => s.amrap));
        expect(anyAmrap).toBe(false);
    });

    it('microplates change rounding increment', () => {
        const st = { ...baseState, unit: 'kg', microplates: true } satisfies Step4State;
        const out = step4_cycle_preview(st);
        const d = out.days.find(x => x.weekIndex === 1 && x.lift === 'press')!;
        // TM press = 135*0.9=121.5, 65% -> 78.975 -> round 1kg => 79
        expect(d.main[0].weight).toBe(79);
    });

    it('opposite pairing uses opposite TM for supplemental', () => {
        const st: Step4State = {
            ...baseState,
            supplemental: { type: 'bbb', sets: 5, reps: 10, pctOfTM: 0.5, pairing: 'opposite' }
        };
        const out = step4_cycle_preview(st);
        const squatW1 = out.days.find(d => d.weekIndex === 1 && d.lift === 'squat')!;
        // Opposite of squat = deadlift; TM deadlift = 405*0.9=364.5, 50% = 182.25 -> round lb5 => 180
        expect(squatW1.supplemental?.weight).toBe(180);
    });
});

// local rounding helper mirrors lib logic
function round(x: number, unit: 'lb' | 'kg', micro: boolean) {
    const step = unit === 'lb' ? (micro ? 2.5 : 5) : (micro ? 1 : 2.5);
    return Math.round(x / step) * step;
}
