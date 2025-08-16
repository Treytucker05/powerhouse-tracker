import { describe, it, expect } from 'vitest';
import { planConditioningFromState, normalizeConditioningModalities, toCanonicalModalityKey } from '../conditioningPlanner.js';

describe('conditioningPlanner normalization', () => {
    it('maps legacy human labels to canonical keys', () => {
        const mods = normalizeConditioningModalities({ hiit: ['Hill Sprints', 'Prowler pushes'], liss: ['Walking', 'Easy Bike'] });
        expect(mods.hiit).toContain('hill_sprint');
        expect(mods.hiit).toContain('prowler_push');
        expect(mods.liss).toEqual(expect.arrayContaining(['walk', 'easy_bike']));
    });

    it('planConditioningFromState builds sessions from legacy flat fields', () => {
        const state = {
            schedule: { days: ['press', 'deadlift', 'bench', 'squat'], frequency: 4 },
            conditioning: {
                sessionsPerWeek: 3,
                hiitPerWeek: 2,
                modalities: { hiit: ['Hill Sprints'], liss: ['Walking'] }
            }
        };
        const sessions = planConditioningFromState(state);
        expect(sessions.length).toBe(3);
        const hiit = sessions.filter(s => s.mode === 'hiit');
        expect(hiit.length).toBe(2);
        expect(hiit[0].modality).toBe('hill_sprint');
    });

    it('respects explicit weeklyPlan', () => {
        const state = {
            conditioning: {
                weeklyPlan: [
                    { day: 'Mon', mode: 'hiit', modality: 'hill_sprint', prescription: { sprints: 8 } },
                    { day: 'Wed', mode: 'liss', modality: 'walk', prescription: { minutes: 30 } }
                ]
            }
        };
        const sessions = planConditioningFromState(state);
        expect(sessions).toHaveLength(2);
        expect(sessions[0].modality).toBe('hill_sprint');
    });

    it('falls back to empty when frequency 0', () => {
        const state = { conditioning: { sessionsPerWeek: 0 } };
        expect(planConditioningFromState(state)).toEqual([]);
    });

    it('toCanonicalModalityKey handles unknown gracefully', () => {
        expect(toCanonicalModalityKey('Unk XYZ', 'hiit')).toBe('hill_sprint');
        expect(toCanonicalModalityKey('slow walk', 'liss')).toBe('walk');
    });
});
