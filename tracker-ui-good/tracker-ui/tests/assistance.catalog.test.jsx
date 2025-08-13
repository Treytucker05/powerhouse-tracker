import { describe, it, expect } from 'vitest';
import { ASSISTANCE_CATALOG, EXERCISE_NOTES, normalizeAssistance } from '../src/methods/531/assistance/index.js';
import { TEMPLATE_KEYS } from '../src/lib/templates/531.presets.v2.js';

function allExercises() {
    // Catalog now flattened array
    if (Array.isArray(ASSISTANCE_CATALOG)) return ASSISTANCE_CATALOG.map(e => e.id);
    const set = new Set();
    Object.values(ASSISTANCE_CATALOG).forEach(arr => (arr || []).forEach(e => set.add(e.id)));
    return Array.from(set);
}

describe('Assistance Catalog Integrity', () => {
    it('every exercise has note or is explicitly exempt', () => {
        const missing = allExercises().filter(id => !EXERCISE_NOTES[id]);
        expect(missing).toEqual([]);
    });

    it('normalization returns arrays with no undefined entries', () => {
        const templates = [TEMPLATE_KEYS.BBB, TEMPLATE_KEYS.TRIUMVIRATE, TEMPLATE_KEYS.PERIODIZATION_BIBLE, TEMPLATE_KEYS.BODYWEIGHT];
        for (const tpl of templates) {
            const arr = normalizeAssistance(tpl, 'Press', {});
            expect(Array.isArray(arr)).toBe(true);
            expect(arr.length).toBeGreaterThan(0);
            expect(arr.some(x => x == null)).toBe(false);
        }
    });

    it('jack_shit template yields empty assistance', () => {
        const arr = normalizeAssistance(TEMPLATE_KEYS.JACK_SHIT, 'Press', {});
        expect(arr).toEqual([]);
    });

    it('catalog entries have required fields', () => {
        ASSISTANCE_CATALOG.forEach(item => {
            expect(item.id).toBeTruthy();
            expect(item.name).toBeTruthy();
            expect(item.block).toBeTruthy();
            expect(item.sets).toBeDefined();
            expect(item.reps).toBeDefined();
            expect(Array.isArray(item.equipment || item.equip || [])).toBe(true);
        });
    });

    it('template defaults resolve to valid catalog items', () => {
        const templates = [TEMPLATE_KEYS.BBB, TEMPLATE_KEYS.TRIUMVIRATE, TEMPLATE_KEYS.PERIODIZATION_BIBLE, TEMPLATE_KEYS.BODYWEIGHT];
        const lifts = ['Press', 'Bench', 'Deadlift', 'Squat'];
        for (const tpl of templates) {
            for (const lift of lifts) {
                const arr = normalizeAssistance(tpl, lift, {});
                arr.forEach(it => {
                    const found = ASSISTANCE_CATALOG.find(c => c.id === it.id);
                    expect(found).toBeTruthy();
                    expect(it.block).toBeTruthy();
                    expect(it.sets).toBeDefined();
                    expect(it.reps).toBeDefined();
                    expect(Array.isArray(it.equipment || [])).toBe(true);
                    // Note may be null only if intentionally missing, but spec says all items have notes
                    expect(it.note).toBeTruthy();
                });
            }
        }
    });
});
