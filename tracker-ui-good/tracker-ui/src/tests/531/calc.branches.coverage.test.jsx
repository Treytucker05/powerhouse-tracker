import { describe, it, expect } from 'vitest';
import {
    computeWarmupsFromPack,
    computeMainFromPack,
    computeMainSets,
    computeWarmups,
    computeAssistance,
    computeNextTMs,
    computeBBBFromConfig
} from '@/methods/531/calc';

// Pack with program defaults (to exercise rounding fallback path) and week main sets
const packFull = {
    program: { defaults: { rounding: { lbs: 5, kg: 2.5 } }, id: 'custom' },
    progressions: {
        warmups: [{ value: 40, reps: 5 }, { value: 50, reps: 5 }, { value: 60, reps: 3 }],
        weeks: [{ label: 'Week1', main: [{ value: 65, reps: 5 }, { value: 75, reps: 5 }, { value: 85, reps: 5, amrap: true }] }]
    }
};

// Pack with a non-amrap last set to contrast branch in computeMainSets
const packNonAmrap = {
    progressions: {
        warmups: [{ value: 40, reps: 5 }],
        weeks: [{ label: 'Week1', main: [{ value: 65, reps: 5 }, { value: 75, reps: 5 }, { value: 85, reps: 5 }] }]
    }
};

describe('calc targeted branch coverage', () => {
    it('warmups early return (no tm) vs populated (with tm & rounding fallback)', () => {
        // Early return: no tm value present in tms
        const early = computeWarmupsFromPack({ pack: packFull, lift: 'bench', tms: {}, units: 'lbs' });
        expect(early).toEqual([]);

        // Populated: tms provides tm, uses program defaults rounding
        const warm = computeWarmupsFromPack({ pack: packFull, lift: 'bench', tms: { bench: 100 }, units: 'lbs' });
        const weights = warm.map(w => w.weight);
        expect(weights).toEqual([40, 50, 60]);

        // Direct computeWarmups positional (covers alternate path) with missing pack -> [] branch
        const none = computeWarmups('bench', 100, 'Week1', { lbs: 5, kg: 2.5 }, 'lbs', null);
        expect(none).toEqual([]);
    });

    it('amrap branch toggle (last row amrap true vs false) and assistance no-op', () => {
        // Using positional computeMainSets with amrap option toggled; pack with last set amrap true
        const withAmrapOpt = computeMainSets('squat', 200, 'Week1', { amrap: true }, { lbs: 5, kg: 2.5 }, 'lbs', packFull).rows;
        const noAmrapLast = computeMainSets('squat', 200, 'Week1', { amrap: true }, { lbs: 5, kg: 2.5 }, 'lbs', packNonAmrap).rows;
        const lastTrue = withAmrapOpt[withAmrapOpt.length - 1].amrap;
        const lastFalse = noAmrapLast[noAmrapLast.length - 1].amrap;
        expect(lastTrue).toBe(true);
        expect(lastFalse).toBe(false);

        // Unknown week label returns empty rows
        const unknown = computeMainFromPack({ pack: packFull, lift: 'squat', weekLabel: 'WeekX', tms: { squat: 200 }, units: 'lbs' });
        expect(unknown.rows).toEqual([]);

        // Assistance (assistanceFor may produce empty array path) => expect array
        const assist = computeAssistance('custom-pack-id', 'bench', { templateKey: 'tplX' });
        expect(Array.isArray(assist)).toBe(true);

        // computeNextTMs path with pass vs fail (bench passes, squat fails with reps 0 vs min 1)
        const next = computeNextTMs({ tms: { bench: 100, squat: 300 }, units: 'lbs', rounding: { lbs: 5 }, amrapWk3: { bench: 5, squat: 0 }, state: { amrapMinWk3: 1 } });
        expect(next.bench).toBe(105); // +5
        expect(next.squat).toBe(290); // -10
    });

    it('bbb config default 60% fallback branch', () => {
        const cfg = computeBBBFromConfig({ supplemental: { strategy: 'bbb', sets: 2, reps: 12 }, lift: 'press', tms: { press: 100 }, units: 'lbs', rounding: { lbs: 5 } });
        expect(cfg.pct).toBe(60); // default fallback path
    });
});
