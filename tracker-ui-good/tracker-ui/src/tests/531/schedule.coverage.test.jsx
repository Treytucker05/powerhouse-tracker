import { describe, it, expect } from 'vitest';
import * as sched from '@/methods/531/schedule';

// Use the actual exported builder (historical helper kept minimal for resilience)
const build = (opts) => sched.buildSchedule?.(opts) || (typeof sched.default === 'function' ? sched.default(opts) : undefined);

describe('531 schedule basics (shape aware)', () => {
    it('builds canonical 4-week x 4-day plan when mode="4day" (legacy multi-week preview)', () => {
        const plan4wk = build({ mode: '4day' });
        expect(plan4wk).toBeTruthy();
        expect(plan4wk.mode).toBe('4day');
        expect(Array.isArray(plan4wk.weeks)).toBe(true);
        expect(plan4wk.weeks).toHaveLength(4); // 3 loading + 1 deload label
        // Each week should list all four lifts
        plan4wk.weeks.forEach(w => expect(w.days).toHaveLength(4));
    });

    it('builds 5-week rotating 3-day cycle when mode="3day"', () => {
        const plan3wk = build({ mode: '3day' });
        expect(plan3wk).toBeTruthy();
        expect(plan3wk.mode).toBe('3day');
        expect(plan3wk.weeks).toHaveLength(5); // 4 loading rotation + Deload
        plan3wk.weeks.slice(0, 4).forEach(w => expect(w.days).toHaveLength(3));
        const deload = plan3wk.weeks[4];
        expect(deload.label).toMatch(/Deload/i);
        expect(deload.days).toHaveLength(3);
        // First deload session should combine two lifts (combineWith marker present)
        expect(deload.days[0].combineWith).toBeDefined();
    });

    it('returns empty weeks for unsupported mode', () => {
        const other = build({ mode: '2day_preview_unsupported' });
        expect(other.mode).toBe('2day_preview_unsupported');
        expect(other.weeks).toEqual([]); // current placeholder branch
    });
});
