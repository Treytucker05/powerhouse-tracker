import { describe, it, expect } from 'vitest';
import { step1_fundamentals, calcTrainingMax, roundWeight } from '../index';
import type { Step1State } from '../types';

describe('calcTrainingMax', () => {
    it('computes TM = 1RM * tmPercent', () => {
        expect(calcTrainingMax(300, 0.9)).toBe(270);
        expect(calcTrainingMax(200, 0.85)).toBe(170);
    });
});

describe('rounding', () => {
    it('roundWeight rounds to nearest increment', () => {
        expect(roundWeight(271, 5)).toBe(270);
        expect(roundWeight(272.6, 5)).toBe(275);
        expect(roundWeight(99.4, 2.5)).toBe(100);
        expect(roundWeight(99.4, 1)).toBe(99);
    });
});

describe('step1_fundamentals', () => {
    const base: Step1State = {
        units: 'lb',
        tmPct: 0.9,
        rounding: { strategy: 'nearest', increment: 5 },
        lifts: {
            press: { method: 'tested', oneRM: 150 },
            deadlift: { method: 'tested', oneRM: 405 },
            bench: { method: 'tested', oneRM: 250 },
            squat: { method: 'tested', oneRM: 365 }
        }
    };

    it('builds a TM table with rounded display values (lb, 5 lb inc)', () => {
        const res = step1_fundamentals(base);
        const rows = Object.fromEntries(res.tmTable.map(r => [r.lift, r]));
        expect(rows.press.tmRaw).toBeCloseTo(135);
        expect(rows.press.tmDisplay).toBe(135);
        expect(rows.deadlift.tmDisplay).toBe(365); // 405*0.9=364.5 → 365
        expect(rows.bench.tmDisplay).toBe(225);    // 250*0.9=225
        expect(rows.squat.tmDisplay).toBe(330);    // 365*0.9=328.5 → 330
    });

    it('supports 85% conservative TM and kg microplate rounding', () => {
        const res = step1_fundamentals({
            ...base,
            units: 'kg',
            tmPct: 0.85,
            rounding: { strategy: 'nearest', increment: 1 }
        });
        const rows = Object.fromEntries(res.tmTable.map(r => [r.lift, r]));
        expect(rows.press.increment).toBe(1);
        expect(res.helper.roundingHint.length).toBeGreaterThan(10);
    });

    it('flags missing or invalid inputs', () => {
        const res = step1_fundamentals({
            units: 'lb',
            tmPct: 0.9,
            rounding: { strategy: 'nearest', increment: 5 },
            lifts: { press: { method: 'tested', oneRM: NaN as any }, deadlift: { method: 'tested', oneRM: NaN as any }, bench: { method: 'tested', oneRM: NaN as any }, squat: { method: 'tested', oneRM: NaN as any } }
        });
        res.tmTable.forEach(r => {
            expect(r.tmRaw).toBeNull();
            expect(r.warnings).toContain('Missing TM');
        });
    });
});
