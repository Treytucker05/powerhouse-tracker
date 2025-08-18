import { describe, it, expect } from 'vitest';
import { step1_fundamentals, calcTrainingMax, roundWeight, chooseIncrement } from '../index';
import type { Step1State } from '../types';

describe('calcTrainingMax', () => {
    it('computes TM = 1RM * tmPercent', () => {
        expect(calcTrainingMax(300, 0.9)).toBe(270);
        expect(calcTrainingMax(200, 0.85)).toBe(170);
    });
});

describe('rounding & increments', () => {
    it('lb default rounds to 5 lb', () => {
        const inc = chooseIncrement('lb', false, undefined);
        expect(inc).toBe(5);
        expect(roundWeight(271, 'lb', inc)).toBe(270);
        expect(roundWeight(272.6, 'lb', inc)).toBe(275);
    });

    it('lb microplates rounds to 2.5 lb', () => {
        const inc = chooseIncrement('lb', true, undefined);
        expect(inc).toBe(2.5);
        expect(roundWeight(271, 'lb', inc)).toBe(272.5);
    });

    it('kg default rounds to 2.5 kg; microplates to 1 kg', () => {
        expect(chooseIncrement('kg', false)).toBe(2.5);
        expect(chooseIncrement('kg', true)).toBe(1);
        expect(roundWeight(99.4, 'kg', 2.5)).toBe(100);
        expect(roundWeight(99.4, 'kg', 1)).toBe(99);
    });
});

describe('step1_fundamentals', () => {
    const base: Step1State = {
        unit: 'lb',
        microplates: false,
        tmPercent: 0.9,
        entryMode: 'oneRm',
        lifts: {
            press: { oneRm: 150 },
            deadlift: { oneRm: 405 },
            bench: { oneRm: 250 },
            squat: { oneRm: 365 }
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
            unit: 'kg',
            microplates: true,
            tmPercent: 0.85
        });
        const rows = Object.fromEntries(res.tmTable.map(r => [r.lift, r]));
        // Example check: 150 lb ≈ 68.04 kg if user typed kg already we just use kg;
        // Here we only assert increment & null-safe behavior
        expect(rows.press.increment).toBe(1);
        expect(res.helper.length).toBeGreaterThan(10);
    });

    it('flags missing or invalid inputs', () => {
        const res = step1_fundamentals({
            unit: 'lb',
            microplates: false,
            tmPercent: 0.9,
            entryMode: 'oneRm',
            lifts: { press: {}, deadlift: {}, bench: {}, squat: {} }
        });
        res.tmTable.forEach(r => {
            expect(r.tmRaw).toBeNull();
            expect(r.warnings).toContain('Missing TM');
        });
    });
});
