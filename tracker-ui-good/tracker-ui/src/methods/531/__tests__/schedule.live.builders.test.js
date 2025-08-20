import { describe, it, expect } from 'vitest';
import { buildSchedule4Day, buildSchedule3Day, buildSchedule2Day, buildSchedule1Day, SPLIT_4DAY_B } from '@/methods/531/schedule';

const dummyPack = {};

describe('live schedule builders', () => {
    const baseState = { week: 1, cycle: 1, units: 'lbs', roundingPref: { lbs: 5, kg: 2.5 }, advanced: { schedulePreview: { daysPerWeek: 4 } } };

    it('buildSchedule4Day returns four days with meta', () => {
        const s = buildSchedule4Day({ state: baseState, pack: dummyPack, split: SPLIT_4DAY_B, weekLabel: '3x5' });
        expect(s.days).toHaveLength(4);
        expect(s.meta.split).toBe(SPLIT_4DAY_B);
    });

    it('buildSchedule3Day rotates lifts and sets rotation index', () => {
        const s = buildSchedule3Day({ state: { ...baseState, week: 2 }, pack: dummyPack });
        expect(s.days).toHaveLength(3);
        expect(typeof s.meta.rotationIndex).toBe('number');
    });

    it('buildSchedule2Day rotates pairs', () => {
        const s = buildSchedule2Day({ state: { ...baseState, week: 3 }, pack: dummyPack });
        expect(s.days).toHaveLength(2);
    });

    it('buildSchedule1Day rotates single lift', () => {
        const s = buildSchedule1Day({ state: { ...baseState, week: 4 }, pack: dummyPack });
        expect(s.days).toHaveLength(1);
    });
});
