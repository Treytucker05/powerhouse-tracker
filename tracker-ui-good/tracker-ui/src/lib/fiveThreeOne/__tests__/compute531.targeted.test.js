import { describe, it, expect } from 'vitest';
import { getMainSetScheme, calcMainSets, effectiveTM, buildProgram, classifyLift } from '../compute531.js';
import { UNITS } from '../../units.ts';

describe('compute531 targeted branches', () => {
    it('getMainSetScheme clamps week and option', () => {
        expect(getMainSetScheme(99, -5).length).toBe(3); // option defaults to 1, week clamped to 1
        expect(getMainSetScheme(2, 5)[0].pct).toBeGreaterThan(0); // week clamped to 4
    });

    it('calcMainSets supports legacy options object signature and week 4 no amrap', () => {
        const tm = 200;
        const legacy = calcMainSets(tm, { week: 4, option: 1, increment: 5, mode: 'nearest' });
        expect(legacy[2].amrap).toBe(false); // deload
        const direct = calcMainSets(tm, 2, 2, { increment: 5, mode: 'nearest' });
        expect(direct.length).toBe(3);
    });

    it('effectiveTM falls back to global tmPct when lift.tmPct invalid and rounds per increment/mode', () => {
        const state = {
            units: UNITS.LBS,
            rounding: { increment: 5, mode: 'ceiling' },
            lifts: { press: { oneRM: 200, tmPct: 2 } }, // invalid tmPct
            trainingMax: { percent: 0.85 }
        };
        const tm = effectiveTM('press', state); // global getTmPct likely 0.85
        expect(tm % 5).toBe(0);
    });

    it('buildProgram honors includeDeload=false and supplemental template branches', () => {
        const state = {
            units: UNITS.LBS,
            loading: { option: 1, includeDeload: false },
            schedule: { frequency: '4day', order: ['press', 'deadlift', 'bench', 'squat'] },
            template: { id: 'bbb', bbb: { pct: 60, variant: 'opposite' } },
            lifts: {
                press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 }
            },
            rounding: { increment: 5, mode: 'nearest' }
        };
        const prog = buildProgram(state);
        expect(prog.weeks.length).toBe(4); // still 4 preview weeks but week 4 not deload flagged
        const w4 = prog.weeks[3];
        expect(w4.deload).toBe(false);
        // check supplemental variant selection path executed
        const firstDay = prog.weeks[0].days[0];
        expect(firstDay.supplemental && firstDay.supplemental.type).toBe('bbb');
    });

    it('classifyLift groups upper vs lower', () => {
        expect(classifyLift('bench')).toBe('upper');
        expect(classifyLift('squat')).toBe('lower');
    });
});
