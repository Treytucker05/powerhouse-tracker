import { describe, it, expect } from 'vitest';
import { buildProgram, getMainSetScheme, calcMainSets } from '../compute531.js';
import { UNITS } from '../../units.ts';

const baseLifts = {
    press: { tm: 100 },
    deadlift: { tm: 300 },
    bench: { tm: 200 },
    squat: { tm: 250 }
};

function makeState(extra = {}) {
    return {
        units: UNITS.LBS,
        loading: { option: 1, includeDeload: true },
        schedule: { frequency: '4day', order: ['press', 'deadlift', 'bench', 'squat'] },
        template: { id: null },
        lifts: baseLifts,
        rounding: { increment: 5, mode: 'nearest' },
        ...extra
    };
}

describe('compute531 schedule & loading frequency branches', () => {
    it('scheduleWeeks 3day rotation shape via buildProgram', () => {
        const prog = buildProgram(makeState({ schedule: { frequency: '3day', order: ['press', 'deadlift', 'bench'] } }));
        expect(prog.weeks).toHaveLength(4);
        expect(prog.weeks[0].days).toHaveLength(3);
        expect(prog.weeks[1].days).toHaveLength(3);
    });

    it('scheduleWeeks 2day rotation shape', () => {
        const prog = buildProgram(makeState({ schedule: { frequency: '2day' } }));
        expect(prog.weeks[0].days).toHaveLength(2);
        expect(prog.weeks[1].days).toHaveLength(2);
    });

    it('scheduleWeeks 1day rotation shape', () => {
        const prog = buildProgram(makeState({ schedule: { frequency: '1day' } }));
        expect(prog.weeks[0].days).toHaveLength(2); // pair preview
    });

    it('loading option 2 produces expected first-week percents', () => {
        const scheme = getMainSetScheme(2, 1);
        expect(scheme.map(s => s.pct)).toEqual([75, 80, 85]);
        const sets = calcMainSets(200, 2, 1, { increment: 5, mode: 'nearest' });
        expect(sets[0].pct).toBe(75);
    });

    it('calcMainSets legacy object path with option 2 week 3 has AMRAP flags', () => {
        const list = calcMainSets(250, { week: 3, option: 2, increment: 5, mode: 'nearest' });
        expect(list[2].amrap).toBe(true);
    });
});
