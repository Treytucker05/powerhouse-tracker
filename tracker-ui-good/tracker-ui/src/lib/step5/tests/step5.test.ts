import { describe, it, expect } from 'vitest';
import { step5_progression } from '../index';
import type { Step5State } from '../types';

function baseState(overrides: Partial<Step5State> = {}): Step5State {
    return {
        unit: 'lb',
        tm: { squat: 400, bench: 250, deadlift: 450, press: 155 },
        phase: 'none',
        cycleIndex: 0,
        la: { enabled: false, leaderCycles: 2, anchorCycles: 1, progressAt: 'eachCycle', seventhWeekBetween: 'off', seventhWeekAfterAnchor: 'off' },
        ...overrides,
    } as Step5State;
}

describe('step5_progression', () => {
    it('standard lb increments +5/+10', () => {
        const r = step5_progression(baseState());
        expect(r.nextTm).toEqual({ squat: 410, bench: 255, deadlift: 460, press: 160 });
    });
    it('kg increments +2.5/+5', () => {
        const r = step5_progression(baseState({ unit: 'kg' }));
        expect(r.nextTm).toEqual({ squat: 405, bench: 252.5, deadlift: 455, press: 157.5 });
    });
    it('hold progression leaves TMs unchanged and events reflect held', () => {
        const r = step5_progression(baseState({ holdProgression: true }));
        expect(r.nextTm).toEqual({ squat: 400, bench: 250, deadlift: 450, press: 155 });
        expect(Object.values(r.events).every(e => e.type === 'held')).toBe(true);
    });
    it('reset lifts applies -10% then adds increment', () => {
        const r = step5_progression(baseState({ resetLifts: { bench: true, squat: true } }));
        // bench: 250 *0.9 =225 +5=230 ; squat 400*0.9=360 +10=370
        expect(r.nextTm.bench).toBeCloseTo(230, 5);
        expect(r.nextTm.squat).toBeCloseTo(370, 5);
    });
    it('leader endOfBlock: no mid-leader progression', () => {
        const r = step5_progression(baseState({
            phase: 'leader',
            la: { enabled: true, leaderCycles: 2, anchorCycles: 1, progressAt: 'endOfBlock', seventhWeekBetween: 'off', seventhWeekAfterAnchor: 'off' },
            cycleIndex: 0,
        }));
        // should hold first leader cycle
        expect(r.nextTm).toEqual({ squat: 400, bench: 250, deadlift: 450, press: 155 });
        expect(Object.values(r.events).every(e => e.type === 'held')).toBe(true);
    });
    it('leader boundary progresses last leader cycle and moves to anchor', () => {
        const r = step5_progression(baseState({
            phase: 'leader',
            la: { enabled: true, leaderCycles: 1, anchorCycles: 1, progressAt: 'endOfBlock', seventhWeekBetween: 'off', seventhWeekAfterAnchor: 'off' },
            cycleIndex: 0,
        }));
        expect(r.nextTm.bench).toBe(255);
        expect(r.nextPhase).toBe('anchor');
    });
    it('insert seventh week between leader and anchor', () => {
        const r = step5_progression(baseState({
            phase: 'leader',
            la: { enabled: true, leaderCycles: 1, anchorCycles: 1, progressAt: 'eachCycle', seventhWeekBetween: 'deload', seventhWeekAfterAnchor: 'off' },
            cycleIndex: 0,
        }));
        expect(r.insertedSeventhWeek).toBe('deload');
        expect(r.nextPhase).toBe('anchor');
        expect(Object.values(r.events).every(e => e.type === 'seventhWeek')).toBe(true);
    });
    it('insert seventh week after anchor', () => {
        const r = step5_progression(baseState({
            phase: 'anchor',
            la: { enabled: true, leaderCycles: 1, anchorCycles: 1, progressAt: 'eachCycle', seventhWeekBetween: 'off', seventhWeekAfterAnchor: 'test' },
            cycleIndex: 0,
        }));
        expect(r.insertedSeventhWeek).toBe('test');
        expect(r.nextPhase).toBe('leader');
    });
});
