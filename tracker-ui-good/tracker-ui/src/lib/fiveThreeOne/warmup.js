// src/lib/fiveThreeOne/warmup.js
import { roundToIncrement } from './compute531.js';

/**
 * Default 5/3/1 warm-up per Wendler:
 * 40% x5, 50% x5, 60% x3 (of Training Max)
 */
export const DEFAULT_WARMUP = [
    { pct: 40, reps: 5 },
    { pct: 50, reps: 5 },
    { pct: 60, reps: 3 },
];

/**
 * Minimal option (when time is tight):
 * 50% x5, 60% x3
 */
export const MINIMAL_WARMUP = [
    { pct: 50, reps: 5 },
    { pct: 60, reps: 3 },
];

/**
 * Compute warm-up sets from TM and a scheme
 * @param {number} tm - training max
 * @param {Array<{pct:number,reps:number}>} scheme
 * @param {object} rounding - { increment:number, mode:'nearest'|'floor'|'ceiling' }
 * @returns {Array<{pct:number,reps:number,weight:number}>}
 */
export function computeWarmupSets(tm, scheme, rounding = { increment: 5, mode: 'nearest' }) {
    if (!Number.isFinite(tm)) return [];
    const inc = rounding?.increment ?? 5;
    const mode = rounding?.mode ?? 'nearest';
    return (scheme || []).map(s => ({
        pct: s.pct,
        reps: s.reps,
        weight: roundToIncrement(tm * (s.pct / 100), inc, mode),
    }));
}

/**
 * Build warm-up sets from policy string or custom
 * @param {'standard'|'minimal'|'custom'} policy
 * @param {Array<{pct:number,reps:number}>} custom
 * @param {number} tm
 * @param {object} rounding
 */
export function getWarmupsByPolicy(policy, custom, tm, rounding) {
    const sch =
        policy === 'minimal' ? MINIMAL_WARMUP
            : policy === 'custom' ? (custom && custom.length ? custom : DEFAULT_WARMUP)
                : DEFAULT_WARMUP;
    return computeWarmupSets(tm, sch, rounding);
}
