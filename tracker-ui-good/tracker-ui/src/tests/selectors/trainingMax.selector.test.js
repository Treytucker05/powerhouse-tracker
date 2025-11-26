import { describe, it, expect, beforeEach } from 'vitest';
import { selectTrainingMax } from '../../lib/selectors/programSelectors.js';

// Minimal helper to simulate program shapes
function baseProgram(extra = {}) {
    return {
        trainingMaxes: {},
        lifts: {
            squat: { tm: null }, bench: { tm: null }, deadlift: { tm: null }, press: { tm: null }
        },
        ...extra
    };
}

describe('selectTrainingMax fallback order', () => {
    beforeEach(() => {
        try { localStorage.removeItem('ph531.tm.debug'); } catch { /* ignore */ }
    });

    it('returns 0 when nothing set', () => {
        const p = baseProgram();
        expect(selectTrainingMax(p, 'squat')).toBe(0);
    });

    it('prefers canonical trainingMaxes over legacy lifts.tm', () => {
        const p = baseProgram({
            trainingMaxes: { squat: 365 },
            lifts: { squat: { tm: 355 } }
        });
        expect(selectTrainingMax(p, 'squat')).toBe(365);
    });

    it('falls back to legacy lifts.tm when canonical missing', () => {
        const p = baseProgram({ lifts: { squat: { tm: 285 } } });
        expect(selectTrainingMax(p, 'squat')).toBe(285);
    });

    it('supports future trainingMax alias on lift object', () => {
        const p = baseProgram({ lifts: { squat: { trainingMax: 300 } } });
        expect(selectTrainingMax(p, 'squat')).toBe(300);
    });

    it('falls back to debug localStorage mirror when both canonical and legacy absent', () => {
        const mirror = { squat: 250 };
        try { localStorage.setItem('ph531.tm.debug', JSON.stringify(mirror)); } catch { /* ignore */ }
        const p = baseProgram();
        expect(selectTrainingMax(p, 'squat')).toBe(250);
    });

    it('returns 0 when all sources invalid/non-positive', () => {
        const p = baseProgram({ trainingMaxes: { squat: 0 }, lifts: { squat: { tm: -10 } } });
        expect(selectTrainingMax(p, 'squat')).toBe(0);
    });
});
