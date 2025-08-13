// src/lib/fiveThreeOne/autoRegulation.js

export function estimate1RM(weight, reps) {
    // Wendler e1RM: W * reps * 0.0333 + W
    const w = Number(weight) || 0, r = Math.max(1, Number(reps) || 1);
    return w * r * 0.0333 + w;
}

export const DEFAULT_AUTOREG = {
    amrapCapRPE: 9,              // stop '+' sets around RPE 9
    holdTMIfE1RMDrops: true,     // hold increments if e1RM trending down
    holdThresholdPct: 2,         // % drop vs last cycle to trigger hold
    allowHalfIncrementsOnStall: true, // UB +2.5 / LB +5 instead of +5/+10
};

/**
 * Decide TM increment recommendations.
 * @param {*} history { bench:[e1RM_by_cycle...], squat:[...], deadlift:[...], press:[...] }
 * @param {*} baseIncrements { upper:5, lower:10 }
 * @param {*} opts DEFAULT_AUTOREG-like
 * @returns per-lift inc suggestion in pounds e.g. { bench:5, press:5, squat:10, deadlift:10 }
 */
export function recommendTMIncrements(history = {}, baseIncrements = { upper: 5, lower: 10 }, opts = DEFAULT_AUTOREG) {
    const lifts = ['bench', 'overhead_press', 'squat', 'deadlift'];
    const out = {};
    for (const k of lifts) {
        const arr = Array.isArray(history[k]) ? history[k] : [];
        const last = arr[arr.length - 1];
        const prev = arr[arr.length - 2];
        const isUpper = (k === 'bench' || k === 'overhead_press');
        const base = isUpper ? baseIncrements.upper : baseIncrements.lower;

        if (last && prev && opts.holdTMIfE1RMDrops) {
            const dropPct = ((last - prev) / prev) * 100;
            if (dropPct <= -Math.abs(opts.holdThresholdPct || 2)) {
                out[k] = opts.allowHalfIncrementsOnStall ? Math.max(0, Math.round((base / 2) * 2) / 2) : 0; // half or 0
                continue;
            }
        }
        out[k] = base; // default +5/+10
    }
    return out;
}
