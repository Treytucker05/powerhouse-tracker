import { describe, it, expect } from 'vitest';
import { getAssistanceTargets } from '@/methods/531/engines/assistance';

describe('assistance targets engine', () => {
    it('returns normal week defaults and ranges', () => {
        const res = getAssistanceTargets({ seventhWeekMode: undefined, phase: 'leader' });
        expect(res.targets).toEqual({ push: 75, pull: 75, core: 75 });
        expect(res.ranges.push).toEqual([50, 100]);
        expect(res.meta.phase).toBe('leader');
    });

    it('returns 7th-week defaults and ranges for deload', () => {
        const res = getAssistanceTargets({ seventhWeekMode: 'deload', phase: 'anchor' });
        expect(res.targets).toEqual({ push: 35, pull: 35, core: 35 });
        expect(res.ranges.core).toEqual([25, 50]);
        expect(res.defaultRange?.pull).toEqual([30, 40]);
    });

    it('returns 7th-week defaults for tm_test as well', () => {
        const res = getAssistanceTargets({ seventhWeekMode: 'tm_test', phase: 'leader' });
        expect(res.targets.push).toBe(35);
    });
});
