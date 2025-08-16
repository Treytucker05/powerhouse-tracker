import { describe, it } from 'vitest';
import * as sched from '@/methods/531/schedule';

const build = (opts) =>
    sched.buildSchedule?.(opts) ??
    sched.makeSchedule?.(opts) ??
    sched.getSchedule?.(opts) ??
    (typeof sched.default === 'function' ? sched.default(opts) : undefined);

const dump = (label, plan) => {
    // eslint-disable-next-line no-console
    console.log(
        `\n== ${label} ==\n` +
        `type: ${Array.isArray(plan) ? 'array' : typeof plan}\n` +
        `keys: ${plan && typeof plan === 'object' ? Object.keys(plan).join(', ') : 'n/a'}\n` +
        `days len (plan.days?): ${plan?.days?.length ?? 'n/a'}\n` +
        `top-level array length: ${Array.isArray(plan) ? plan.length : 'n/a'}\n` +
        `weeks len (plan.weeks?): ${plan?.weeks?.length ?? 'n/a'}\n` +
        `mode: ${plan?.mode ?? 'n/a'}\n` +
        `day keys (if object): ${plan && !Array.isArray(plan) && typeof plan === 'object'
            ? Object.keys(plan.days ?? plan).join(', ')
            : 'n/a'
        }\n`
    );
};

// Converted to skipped test to eliminate noisy console output while keeping file (auto-regenerated elsewhere?)
describe.skip('schedule shape inspection (temporary)', () => {
    it('logs shape for 3-day and 4-day outputs', () => {
        const p3 = build({ daysPerWeek: 3, method: '531', split: 'SPLIT_3DAY' });
        const p4 = build({ daysPerWeek: 4, method: '531', split: 'SPLIT_4DAY_A' });
        dump('3-day', p3);
        dump('4-day', p4);
    });
});
