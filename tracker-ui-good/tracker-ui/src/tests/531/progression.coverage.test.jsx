import { describe, it, expect } from 'vitest';
import { advanceCycle } from '@/methods/531/progression';

function baseState(tms = {}) {
    return {
        cycle: 1,
        week: 3,
        units: 'lbs',
        roundingPref: { lbs: 5, kg: 2.5 },
        lifts: Object.fromEntries(Object.entries(tms).map(([k, v]) => [k, { tm: v }]))
    };
}

describe('advanceCycle (5/3/1 TM progression)', () => {
    it('returns null/undefined unchanged when prevState missing', () => {
        expect(advanceCycle(null, {})).toBeNull();
    });
    it('adds +5 for upper-body lifts (bench/press)', () => {
        const st = baseState({ bench: 100, press: 150, squat: 0, deadlift: 0 });
        const next = advanceCycle(st, { amrapWk3: { bench: 5, press: 3 } });
        expect(next.tms.bench).toBe(105);
        expect(next.tms.press).toBe(155);
    });

    it('adds +10 for lower-body lifts (squat/deadlift)', () => {
        const st = baseState({ squat: 300, deadlift: 405, bench: 0, press: 0 });
        const next = advanceCycle(st, { amrapWk3: { squat: 5, deadlift: 3 } });
        expect(next.tms.squat).toBe(310);
        expect(next.tms.deadlift).toBe(415);
    });

    it('increments cycle number and resets week to 1', () => {
        const st = baseState({ bench: 100 });
        const next = advanceCycle(st, { amrapWk3: { bench: 1 } });
        expect(next.cycle).toBe(2);
        expect(next.week).toBe(1);
    });
});
