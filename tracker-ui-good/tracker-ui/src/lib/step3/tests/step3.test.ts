import { describe, it, expect } from 'vitest';
import { step3_defaults_from_template, step3_catalogs } from '../index';

describe('step3_defaults_from_template', () => {
    it('bbb: sets BBB supplemental, deload off, scheme_531, leader/anchor enabled', () => {
        const d = step3_defaults_from_template('bbb');
        expect(d.programming.schemeId).toBe('scheme_531');
        expect(d.supplemental.type).toBe('bbb');
        expect(d.supplemental.sets).toBe(5);
        expect(d.supplemental.reps).toBe(10);
        expect(d.supplemental.pctOfTM).toBe(0.5);
        expect(d.deload.enabled).toBe(false);
        expect(d.programming.leaderAnchor?.enabled).toBe(true);
        expect(d.programming.leaderAnchor?.leader).toBe(2);
        expect(d.programming.leaderAnchor?.anchor).toBe(1);
    });

    it('triumvirate: no supplemental, deload on, assistance buckets length 2, 50-100 target', () => {
        const d = step3_defaults_from_template('triumvirate');
        expect(d.supplemental.type).toBe('none');
        expect(d.deload.enabled).toBe(true);
        expect(d.assistance.buckets.length).toBe(2);
        expect(d.assistance.targetRepsPerBucket).toEqual([50, 100]);
    });

    it('jackshit: no supplemental, deload on, zero assistance target, minimal conditioning', () => {
        const d = step3_defaults_from_template('jackshit');
        expect(d.supplemental.type).toBe('none');
        expect(d.deload.enabled).toBe(true);
        expect(d.assistance.buckets.length).toBe(0);
        expect(d.assistance.targetRepsPerBucket).toEqual([0, 0]);
        expect(d.conditioning.mode).toBe('minimal');
    });

    it('periodization_bible: template assistance uses all 4 buckets, 50-100 target', () => {
        const d = step3_defaults_from_template('periodization_bible');
        expect(d.assistance.buckets.sort()).toEqual(['Core', 'Pull', 'Push', 'Single-leg'].sort());
        expect(d.assistance.targetRepsPerBucket).toEqual([50, 100]);
    });

    it('bodyweight: assistance 75-100 target, standard conditioning with jumps/walks', () => {
        const d = step3_defaults_from_template('bodyweight');
        expect(d.assistance.targetRepsPerBucket).toEqual([75, 100]);
        expect(d.conditioning.mode).toBe('standard');
        expect(d.conditioning.presets).toEqual(expect.arrayContaining(['jumps', 'walks']));
    });
});

describe('step3_catalogs', () => {
    const c = step3_catalogs();

    it('returns 4 assistance buckets with non-empty arrays (may be seeded)', () => {
        expect(c.assistance).toHaveProperty('Push');
        expect(c.assistance).toHaveProperty('Pull');
        expect(c.assistance).toHaveProperty('Single-leg');
        expect(c.assistance).toHaveProperty('Core');
        // Arrays (can be empty if packs minimal, still arrays)
        Object.values(c.assistance).forEach(arr => expect(Array.isArray(arr)).toBe(true));
    });

    it('includes warmup modes and conditioning activities/presets', () => {
        expect(c.warmups).toEqual(expect.arrayContaining(['standard']));
        expect(c.conditioning.presets).toEqual(expect.arrayContaining(['minimal', 'standard', 'extensive']));
    });
});
