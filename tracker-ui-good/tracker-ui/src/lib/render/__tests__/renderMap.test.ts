import { describe, it, expect } from 'vitest';
import { packs } from '../../packs';
import { renderMap, roundTo, resolveSupplemental } from '../renderMap';

const baseState = {
    units: 'lb' as const,
    rounding: 5,
    tmPercent: 0.9 as const,
    tms: { press: 150, deadlift: 405, bench: 225, squat: 315 },
    schemeId: 'scheme_531' as const,
    templateId: 'bbb' as any,
    frequency: 4 as const,
    warmupId: 'standard' as const,
    assistanceMode: 'balanced' as const,
    conditioningPreset: 'standard' as const
};

describe('packs load', () => {
    it('has schemes and templates objects', () => {
        expect(packs.schemes).toBeTruthy();
        expect(packs.templates).toBeTruthy();
    });
});

describe('roundTo', () => {
    it('rounds to nearest increment (lb)', () => {
        expect(roundTo(201, 5, 'lb')).toBe(200);
        expect(roundTo(202.6, 5, 'lb')).toBe(205);
    });
    it('rounds to micro increment (kg)', () => {
        expect(roundTo(100.2, 0.5, 'kg')).toBe(100);
        expect(roundTo(100.3, 0.5, 'kg')).toBe(100.5);
    });
});

describe('renderMap smoke', () => {
    it('step1 fundamentals', () => {
        const r = renderMap.step1_fundamentals(baseState);
        expect(r.tmTable.length).toBe(4);
    });
    it('step2 cards', () => {
        renderMap.step2_template_cards();
        renderMap.step2_scheme_cards();
    });
    it('step3 defaults (null ok)', () => {
        expect(renderMap.step3_defaults_from_template(null)).toBeNull();
    });
    it('step3 catalogs', () => {
        const c = renderMap.step3_catalogs();
        expect(c.warmups).toBeTruthy();
    });
    it('step4 preview builds weeks', () => {
        const r = renderMap.step4_cycle_preview(baseState);
        expect(r.weeks.length).toBeGreaterThan(0);
    });
});

describe('supplemental logic', () => {
    it('bbb resolves 5x10', () => {
        const week = { sets: [{ pctOfTM: 0.65 }, { pctOfTM: 0.75 }, { pctOfTM: 0.85 }] };
        const sup = resolveSupplemental('bbb' as any, 'bench', baseState.tms, week);
        expect(sup?.sets.length).toBe(5);
        expect(sup?.sets[0].reps).toBe(10);
    });
});
