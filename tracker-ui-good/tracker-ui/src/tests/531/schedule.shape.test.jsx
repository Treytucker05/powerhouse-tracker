import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import * as sched from '@/methods/531/schedule';

const build = (opts) =>
    sched.buildSchedule?.(opts) ??
    sched.makeSchedule?.(opts) ??
    sched.getSchedule?.(opts) ??
    (typeof sched.default === 'function' ? sched.default(opts) : undefined);

// Minimal deterministic helper (previous dump removed to keep test silent & fast)
const shape = (plan) => ({
    isArray: Array.isArray(plan),
    weeksLen: plan?.weeks?.length ?? null,
    daysLen: plan?.days?.length ?? null,
    mode: plan?.mode || null
});

describe('schedule shape inspection', () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
        vi.spyOn(Math, 'random').mockReturnValue(0.123456);
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterAll(() => {
        Math.random.mockRestore?.();
        console.warn.mockRestore?.();
        console.error.mockRestore?.();
        vi.useRealTimers();
    });

    it('produces stable shapes for 3-day and 4-day splits', () => {
        const three = build({ daysPerWeek: 3, method: '531', split: 'SPLIT_3DAY' });
        const four = build({ daysPerWeek: 4, method: '531', split: 'SPLIT_4DAY_A' });
        const s3 = shape(three);
        const s4 = shape(four);
        // Basic invariants (adjust if underlying generator changes)
        expect(s3.weeksLen || s3.daysLen).toBeTruthy();
        expect(s4.weeksLen || s4.daysLen).toBeTruthy();
        // If weeks present, expect 4 (standard 5/3/1 cycle)
        if (s3.weeksLen != null) expect(s3.weeksLen).toBeGreaterThanOrEqual(4);
        if (s4.weeksLen != null) expect(s4.weeksLen).toBeGreaterThanOrEqual(4);
        // Distinguish 3 vs 4 day by either daysLen or inferred plan content length
        if (s3.daysLen != null && s4.daysLen != null) {
            expect(s3.daysLen).not.toBe(s4.daysLen);
        }
        // Note: Module imported before spy; we don't assert on Math.random value here.
    });
});
