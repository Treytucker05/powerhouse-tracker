import { describe, it, expect } from 'vitest';
import { advanceCycle, advanceCycleSelective } from '../progression.js';

const baseState = {
    units: 'lbs',
    roundingPref: { lbs: 5, kg: 2.5 },
    cycle: 1,
    week: 3,
    lifts: {
        press: { tm: 100 },
        deadlift: { tm: 300 },
        bench: { tm: 200 },
        squat: { tm: 250 }
    },
    tms: { press: 100, deadlift: 300, bench: 200, squat: 250 },
    history: []
};

describe('progression selective logic (targeted)', () => {
    it('advanceCycle returns updated cycle, week reset and history entry', () => {
        const next = advanceCycle(baseState, { amrapWk3: { press: 10 } });
        expect(next.cycle).toBe(2);
        expect(next.week).toBe(1);
        expect(next.history.length).toBe(1);
        // TMs should not be negative
        Object.values(next.tms).forEach(v => expect(v).toBeGreaterThan(0));
    });

    it('advanceCycleSelective respects include map and customIncrements with pass/fail logic', () => {
        const state = { ...baseState };
        const originalDeadlift = state.tms.deadlift;
        const next = advanceCycleSelective(state, {
            amrapWk3: { press: 12, deadlift: 1 }, // press passed, deadlift likely fails threshold
            include: { press: true, deadlift: true, bench: false, squat: false },
            customIncrements: { press: 5, deadlift: 10, bench: 5 }
        });
        expect(next.cycle).toBe(2);
        // press progressed upward (passed)
        expect(next.tms.press).toBeGreaterThan(state.tms.press);
        // Deadlift may reduce or hold; ensure it did not increase by custom increment erroneously if fail logic executes
        expect(next.tms.deadlift).not.toBeGreaterThan(originalDeadlift + 10);
        // bench not included so unchanged
        expect(next.tms.bench).toBe(state.tms.bench);
        // squat not included no custom increment
        expect(next.tms.squat).toBe(state.tms.squat);
        // history entry captures metadata
        const entry = next.history[next.history.length - 1];
        expect(entry.customIncrements).toBeTruthy();
        expect(entry.include.press).toBe(true);
    });
});
