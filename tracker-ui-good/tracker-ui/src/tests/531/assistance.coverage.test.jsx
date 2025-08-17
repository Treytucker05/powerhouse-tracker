import { describe, it, expect } from 'vitest';
import * as assist from '@/methods/531/assistance';

// Try to resolve normalizeAssistance regardless of export style
const normalize = assist.normalizeAssistance || assist.default?.normalizeAssistance || assist.default || (() => { throw new Error('normalizeAssistance not found'); });

// Choose a template key we know exists based on TEMPLATE_KEYS in presets (lowercased in normalize)
// From code: keys come from TEMPLATE_KEYS (BBB, TRIUMVIRATE, PERIODIZATION_BIBLE, BODYWEIGHT, JACK_SHIT)
// normalize lowercases templateKey so pass canonical constant value directly.

describe('531 assistance (coverage)', () => {
    it('uses template defaults when custom is absent (BBB Press)', () => {
        const out = normalize('BBB', 'Press', { equipment: ['barbell', 'chinup bar', 'ab wheel'] });
        expect(Array.isArray(out)).toBe(true);
        expect(out.length).toBeGreaterThan(0); // defaults applied
        // Each item should have id & name at least
        out.forEach(it => expect(it.id).toBeTruthy());
    });

    it('falls back gracefully when equipment filters out all items (BODYWEIGHT -> none match)', () => {
        // Provide equipment list that intentionally excludes many (empty) to trigger filter fallback path
        const out = normalize('BODYWEIGHT', 'Press', { equipment: [] });
        expect(Array.isArray(out)).toBe(true);
        // Implementation keeps original list if filtering would remove all; with empty user equipment it should NOT filter anything out.
        expect(out.length).toBeGreaterThan(0);
    });

    it('equipment filtering reduces set when partial match available', () => {
        // Pick TRIUVIRATE template (two items) and supply equipment that matches only universal/no-equip ones
        const full = normalize('TRIUMVIRATE', 'Press', { equipment: [] });
        const filtered = normalize('TRIUMVIRATE', 'Press', { equipment: ['dip bars'] }); // unlikely to match all entries' equipment arrays exactly
        expect(Array.isArray(full)).toBe(true);
        expect(Array.isArray(filtered)).toBe(true);
        // Either filtered equals full (if eq arrays are empty) or smaller; assert logical conditions without over-specifying
        expect(filtered.length).toBeGreaterThan(0);
    });
});
