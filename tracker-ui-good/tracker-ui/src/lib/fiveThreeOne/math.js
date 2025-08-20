// src/lib/fiveThreeOne/math.js
// Delegates rounding to centralized math utilities to ensure consistent behavior & alias handling.
import { roundToIncrement } from '../math/rounding.ts';

export function e1RM(weight, reps) {
    const w = Number(weight || 0), r = Number(reps || 0);
    if (!w || !r) return 0;
    return +(w * r * 0.0333 + w).toFixed(1);
}

export function percentOfTM(tm, pct, inc = 5, mode = 'nearest') {
    const v = Number(tm || 0) * (Number(pct || 0) / 100);
    return roundToIncrement(v, inc, mode);
}

// minimal unit helpers (reads user pref from localStorage)
export function getUnit() {
    const raw = (typeof localStorage !== 'undefined' ? localStorage.getItem('unit') : 'lb') || 'lb';
    return typeof raw === 'string' ? raw.toLowerCase() : 'lb';
}

export function setUnit(unit) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('unit', unit.toLowerCase());
}

export function getIncrementForUnit() {
    return getUnit() === 'kg' ? 2.5 : 5;
}

export function toDisplayWeight(value, mode = 'nearest') {
    // Assuming storage is already in user unit. Extend later if needed.
    return roundToIncrement(Number(value || 0), getIncrementForUnit(), mode);
}

// Backward compatibility: legacy modules imported roundToIncrement from this file.
// Re-export the centralized implementations so existing callers continue to work.
export { roundToIncrement, roundUpToIncrement, roundDownToIncrement } from '../math/rounding.ts';
