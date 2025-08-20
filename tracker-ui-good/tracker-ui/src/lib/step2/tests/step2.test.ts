import { describe, it, expect } from 'vitest';
import { step2_scheme_cards, step2_template_cards, step2_logic_snapshot } from '../index';

describe('step2_scheme_cards', () => {
    const cards = step2_scheme_cards();

    it('includes stable scheme IDs', () => {
        const ids = cards.map((c) => c.id).sort();
        expect(ids).toEqual(['scheme_351', 'scheme_531', 'scheme_5spro'].sort());
    });

    it('enforces deload 40/50/60 with no AMRAP on scheme_531', () => {
        const s531 = cards.find((c) => c.id === 'scheme_531')!;
        const deload = s531.weeks.find((w) => w.isDeload)!;
        const pcts = deload.sets.map((s) => s.percentage);
        const amrapFlags = deload.sets.map((s) => s.isAmrap);
        expect(pcts).toEqual([40, 50, 60]);
        expect(amrapFlags).toEqual([false, false, false]);
        expect(typeof s531.amrapPolicy).toBe('string');
        expect(s531.amrapPolicy).toMatch(/NO AMRAP on deload/);
        expect(s531.amrapFlags.lastSet).toBe(true);
    });

    it('disables all AMRAP on 5s Pro work weeks', () => {
        const sp = cards.find((c) => c.id === 'scheme_5spro')!;
        expect(sp.amrapFlags.scheme5spro).toBe(true);
        sp.weeks
            .filter((w) => !w.isDeload)
            .forEach((w) => w.sets.forEach((set) => expect(set.isAmrap).toBe(false)));
    });
});

describe('step2_template_cards', () => {
    const cards = step2_template_cards();

    it('includes stable template IDs', () => {
        const ids = cards.map((c) => c.id).sort();
        expect(ids).toEqual(['bbb', 'bodyweight', 'jackshit', 'periodization_bible', 'triumvirate'].sort());
    });

    it('BBB advertises 5×10 @ 50% TM and time range', () => {
        const bbb = cards.find((c) => c.id === 'bbb')!;
        expect(bbb.supplementalSummary).toContain('BBB');
        expect(bbb.supplementalSummary).toContain('5×10');
        expect(bbb.supplementalSummary).toContain('50%');
        expect(typeof bbb.timePerSession).toBe('string');
    });

    it('difficulty is inferred deterministically from timePerSession', () => {
        const jack = cards.find((c) => c.id === 'jackshit')!;
        // 30-45 → avg 37.5 → "easy"
        expect(jack.difficulty).toBe('easy');
    });
});

describe('step2 logic snapshot', () => {
    it('exposes +5/+10 lb and +2.5/+5 kg progression', () => {
        const logic = step2_logic_snapshot();
        expect(logic.progression.upperLb).toBe(5);
        expect(logic.progression.lowerLb).toBe(10);
        expect(logic.progression.upperKg).toBe(2.5);
        expect(logic.progression.lowerKg).toBe(5);
    });
});
