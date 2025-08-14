import { describe, it, expect } from 'vitest';
import {
    computeWarmups,
    computeMainSets,
    computeSupplemental,
    computeWarmupsFromPack,
    computeMainFromPack,
    computeBBBFromConfig,
    estimateTonnage,
    sumRepsByBlock,
    passedAmrapWk3,
    nextTM,
    computeNextTMs,
    roundLoad
} from '@/methods/531/calc';

// Minimal synthetic pack matching extractWarmups / extractWeekByLabel expectations
const pack = {
    progressions: {
        warmups: [
            { value: 40, reps: 5 },
            { value: 50, reps: 5 },
            { value: 60, reps: 3 }
        ],
        weeks: [
            { label: 'Week1', main: [{ value: 65, reps: 5 }, { value: 75, reps: 5 }, { value: 85, reps: 5 }] },
            { label: 'Week2', main: [{ value: 70, reps: 3 }, { value: 80, reps: 3 }, { value: 90, reps: 3 }] },
            { label: 'Week3', main: [{ value: 75, reps: 5 }, { value: 85, reps: 3 }, { value: 95, reps: 1, amrap: true }] }
        ]
    }
};

describe('5/3/1 calc basics', () => {
    it('computes standard warm-ups 40/50/60 from TM=100', () => {
        const tm = 100;
        const wu = computeWarmups('bench', tm, 'Week1', { lbs: 5, kg: 2.5 }, 'lbs', pack);
        const weights = wu.map(w => w.weight);
        expect(weights).toEqual(expect.arrayContaining([40, 50, 60]));
    });

    it('computes Week 1/2/3 main set % correctly at TM=100', () => {
        const tm = 100;
        const wk1 = computeMainSets('squat', tm, 'Week1', {}, { lbs: 5, kg: 2.5 }, 'lbs', pack).rows;
        const wk2 = computeMainSets('squat', tm, 'Week2', {}, { lbs: 5, kg: 2.5 }, 'lbs', pack).rows;
        const wk3 = computeMainSets('squat', tm, 'Week3', {}, { lbs: 5, kg: 2.5 }, 'lbs', pack).rows;
        const w = s => s.map(x => x.weight);
        expect(w(wk1)).toEqual(expect.arrayContaining([65, 75, 85]));
        expect(w(wk2)).toEqual(expect.arrayContaining([70, 80, 90]));
        expect(w(wk3)).toEqual(expect.arrayContaining([75, 85, 95]));
    });

    it('rounds kg loads to plate increment (roundLoad helper)', () => {
        // Exercise roundLoad indirectly via computeWarmups with kg
        const tm = 102.3; // arbitrary
        const kgPack = pack; // same percentages
        const wuKg = computeWarmups('press', tm, 'Week1', { lbs: 5, kg: 2.5 }, 'kg', kgPack);
        // All weights should be multiples of 2.5
        for (const row of wuKg) {
            const multiple = row.weight / 2.5;
            expect(Math.abs(multiple - Math.round(multiple)) < 1e-6).toBe(true);
        }
    });

    it('covers value/percentage/pct branching and BBB percent fallbacks', () => {
        const altPack = {
            progressions: {
                warmups: [
                    { value: 40, reps: 5 },      // value path
                    { percentage: 50, reps: 5 }, // percentage path
                    { pct: 60, reps: 3 }         // pct path
                ],
                weeks: [
                    {
                        label: 'Week1', main: [
                            { value: 65, reps: 5 },
                            { percentage: 75, reps: 5 },
                            { pct: 85, reps: 5, amrap: true }
                        ]
                    }
                ]
            }
        };
        const wu = computeWarmups('bench', 100, 'Week1', { lbs: 5, kg: 2.5 }, 'lbs', altPack);
        expect(wu.map(r => r.weight)).toEqual([40, 50, 60]);
        const main = computeMainSets('bench', 100, 'Week1', {}, { lbs: 5, kg: 2.5 }, 'lbs', altPack).rows;
        expect(main.map(r => r.weight)).toEqual([65, 75, 85]);
    });

    it('handles early return cases (no pack / missing tm)', () => {
        expect(computeWarmups('bench', 0, 'Week1', undefined, 'lbs', null)).toEqual([]);
        expect(computeMainSets('bench', 0, 'Week1', {}, undefined, 'lbs', null)).toEqual({ rows: [], amrapLast: false });
    });

    it('computes supplemental BBB config', () => {
        const state = { supplemental: { strategy: 'bbb', percentOfTM: 50, sets: 3, reps: 10 }, units: 'lbs', roundingPref: { lbs: 5, kg: 2.5 } };
        const sup = computeSupplemental(null, 'bench', 100, state);
        expect(sup && sup.type).toBe('bbb');
        const none = computeSupplemental(null, 'bench', 0, state); // missing tm path
        expect(none).toBeNull();
    });

    it('bbb config via computeBBBFromConfig (valid and invalid)', () => {
        const cfg = computeBBBFromConfig({ supplemental: { strategy: 'bbb', percentOfTM: 60, sets: 5, reps: 10 }, lift: 'squat', tms: { squat: 200 }, units: 'lbs', rounding: { lbs: 5 } });
        expect(cfg && cfg.load).toBe(120); // 60% of 200
        const invalid = computeBBBFromConfig({ supplemental: { strategy: 'fsl' }, lift: 'squat', tms: { squat: 200 } });
        expect(invalid).toBeNull();
    });

    it('estimateTonnage skips invalid rows', () => {
        const ton = estimateTonnage([
            { weight: 100, reps: 5 },
            { weight: 'bad', reps: 10 },
            { weight: 50, reps: 'x' },
            { weight: 80, reps: 8 }
        ]);
        expect(ton).toBe(100 * 5 + 80 * 8);
    });

    it('sumRepsByBlock parses rep formats', () => {
        const res = sumRepsByBlock({
            assistance: [
                { block: 'push', sets: 3, reps: '8-12' }, // average 10 -> 30
                { block: 'push', sets: 2, reps: '10' },    // 20 -> total 50
                { block: 'pull', sets: 4, reps: 'pump' }   // fallback 12 -> 48
            ]
        });
        expect(res.push).toBe(50);
        expect(res.pull).toBe(48);
    });

    it('passedAmrapWk3 handles null reps and failing reps', () => {
        expect(passedAmrapWk3(null, { amrapMinWk3: 3 })).toBe(true); // null treated as pass
        expect(passedAmrapWk3(2, { amrapMinWk3: 3 })).toBe(false);
    });

    it('nextTM decreases when not passed', () => {
        const down = nextTM('bench', 100, 'lbs', false, { lbs: 5 });
        expect(down).toBe(95);
    });

    it('computeNextTMs applies amrap pass/fail per lift', () => {
        const tms = { bench: 100, squat: 300 };
        const next = computeNextTMs({ tms, units: 'lbs', rounding: { lbs: 5 }, amrapWk3: { bench: 5, squat: 0 }, state: { amrapMinWk3: 1 } });
        // bench passed (+5), squat failed (-10)
        expect(next.bench).toBe(105);
        expect(next.squat).toBe(290);
    });

    it('roundLoad respects unit-specific rounding', () => {
        const lbsVal = roundLoad(152, 'lbs', { lbs: 5, kg: 2.5 });
        const kgVal = roundLoad(152, 'kg', { lbs: 5, kg: 2.5 });
        expect(lbsVal % 5).toBe(0);
        expect(Math.abs((kgVal / 2.5) - Math.round(kgVal / 2.5)) < 1e-6).toBe(true);
    });
});
