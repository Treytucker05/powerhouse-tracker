// src/lib/fiveThreeOne/progression.js
import { roundToIncrement, classifyLift } from './compute531.js';

/**
 * Apply standard TM increments across lifts (does not mutate input)
 * @param {object} lifts e.g. {squat:{tm:...}, bench:{tm:...}, deadlift:{tm:...}, press:{tm:...}}
 * @param {{upper:number,lower:number}} inc
 * @param {{increment:number,mode:'nearest'|'floor'|'ceiling'}} rounding
 */
export function applyIncrements(lifts, inc = { upper: 5, lower: 10 }, rounding = { increment: 5, mode: 'nearest' }) {
    const next = { ...(lifts || {}) };
    ['squat', 'deadlift', 'bench', 'press', 'overhead_press'].forEach(lift => {
        if (!next[lift]) return;
        const klass = classifyLift(lift);
        const add = klass === 'upper' ? (inc.upper ?? 5) : (inc.lower ?? 10);
        const tm = Number(next[lift].tm);
        if (Number.isFinite(tm)) {
            next[lift] = { ...(next[lift] || {}), tm: roundToIncrement(tm + add, rounding?.increment ?? 5, rounding?.mode ?? 'nearest') };
        }
    });
    return next;
}

/**
 * Reset a TM by ratio (e.g. 0.9 for 90% standard reset)
 * @param {number} currentTM
 * @param {number} ratio 0.9 or 0.85
 * @param {{increment:number,mode:'nearest'|'floor'|'ceiling'}} rounding
 */
export function resetTM(currentTM, ratio = 0.9, rounding = { increment: 5, mode: 'nearest' }) {
    if (!Number.isFinite(currentTM)) return currentTM;
    const raw = currentTM * ratio;
    return roundToIncrement(raw, rounding?.increment ?? 5, 'ceiling');
}
