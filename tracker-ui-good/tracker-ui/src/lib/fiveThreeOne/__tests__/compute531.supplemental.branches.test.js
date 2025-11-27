import { describe, it, expect } from 'vitest';
import { buildProgram } from '../compute531.js';
import { UNITS } from '../../units.ts';

const baseLifts = {
    press: { tm: 100 },
    deadlift: { tm: 300 },
    bench: { tm: 200 },
    squat: { tm: 250 }
};

function makeState(templateId, extra = {}) {
    return {
        units: UNITS.LBS,
        loading: { option: 1, includeDeload: true },
        schedule: { frequency: '4day', order: ['press', 'deadlift', 'bench', 'squat'] },
        template: { id: templateId, bbb: { pct: 50, variant: 'same' } },
        lifts: baseLifts,
        rounding: { increment: 5, mode: 'nearest' },
        ...extra
    };
}

describe('compute531 supplemental template branches', () => {
    it('triumvirate template returns picks array', () => {
        const prog = buildProgram(makeState('triumvirate'));
        const sup = prog.weeks[0].days[0].supplemental;
        expect(sup?.type).toBe('triumvirate');
        expect(Array.isArray(sup.picks)).toBe(true);
    });

    it('periodizationBible template returns picks array', () => {
        const prog = buildProgram(makeState('periodizationBible'));
        const sup = prog.weeks[0].days[0].supplemental;
        expect(sup?.type).toBe('periodizationBible');
    });

    it('bodyweight template returns bodyweight target reps', () => {
        const prog = buildProgram(makeState('bodyweight'));
        const sup = prog.weeks[0].days[0].supplemental;
        expect(sup?.type).toBe('bodyweight');
        expect(sup?.picks?.[0]?.targetReps).toBe(75);
    });

    it('jackShit template returns jackShit supplemental', () => {
        const prog = buildProgram(makeState('jackShit'));
        const sup = prog.weeks[0].days[0].supplemental;
        expect(sup?.type).toBe('jackShit');
    });

    it('no template id returns null supplemental', () => {
        const state = makeState(null, { template: { id: null } });
        const prog = buildProgram(state);
        const sup = prog.weeks[0].days[0].supplemental;
        expect(sup).toBeNull();
    });
});
