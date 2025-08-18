import { describe, it, expect } from 'vitest';
import { step2_scheme_cards, step2_template_cards } from '../index';

// Helper to index by id
const byId = <T extends { id: string }>(arr: T[]) => Object.fromEntries(arr.map(o => [o.id, o]));

describe('step2 scheme/template cards', () => {
    const schemes = byId(step2_scheme_cards());
    const templates = byId(step2_template_cards());

    it('includes expected scheme ids', () => {
        expect(Object.keys(schemes)).toEqual(expect.arrayContaining(['scheme_531', 'scheme_351', 'scheme_5spro']));
    });

    it('classifies amrap policy with deload correctly', () => {
        expect(schemes.scheme_531.amrapPolicy).toMatch(/amrap/);
        expect(schemes.scheme_531.amrapPolicy).toContain('deload');
    });

    it('includes expected template ids', () => {
        expect(Object.keys(templates)).toEqual(expect.arrayContaining(['bbb', 'triumvirate', 'periodization_bible', 'bodyweight', 'jackshit']));
    });

    it('bbb card exposes supplemental & timePerSession', () => {
        const bbb = templates.bbb;
        expect(bbb).toBeTruthy();
        expect(bbb.timePerSession?.toLowerCase()).toContain('60');
        // assistance array presence
        expect(Array.isArray(bbb.defaultAssistance)).toBe(true);
    });
});
