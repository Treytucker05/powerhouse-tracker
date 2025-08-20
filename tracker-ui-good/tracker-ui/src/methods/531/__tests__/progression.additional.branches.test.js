import { describe, it, expect } from 'vitest';
import { advanceCycleSelective } from '../progression.js';

describe('progression additional fail/decrement branches', () => {
    it('advanceCycleSelective applies decrement when AMRAP fail with custom increment and clamps at zero', () => {
        const state = {
            units: 'lbs',
            roundingPref: { lbs: 5, kg: 2.5 },
            cycle: 2,
            week: 3,
            amrapMinWk3: 5,
            lifts: {
                bench: { tm: 10 },
                press: { tm: 100 },
                deadlift: { tm: 300 },
                squat: { tm: 250 }
            },
            tms: { bench: 10, press: 100, deadlift: 300, squat: 250 },
            history: []
        };
        const next = advanceCycleSelective(state, {
            amrapWk3: { bench: 1 },
            include: { bench: true },
            customIncrements: { bench: 20 }
        });
        expect(next.tms.bench).toBe(0);
        const hist = next.history[next.history.length - 1];
        expect(hist.tmsAfter.bench).toBe(0);
    });
});
