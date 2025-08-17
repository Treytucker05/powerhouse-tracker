// src/lib/fiveThreeOne/math.js
export function e1RM(weight, reps) {
    const w = Number(weight || 0), r = Number(reps || 0);
    if (!w || !r) return 0;
    return +(w * r * 0.0333 + w).toFixed(1);
}

export function roundToIncrement(value, inc = 5) {
    if (!Number.isFinite(value)) return 0;
    return Math.round(value / inc) * inc;
}

export function percentOfTM(tm, pct, inc = 5) {
    const v = Number(tm || 0) * (Number(pct || 0) / 100);
    return roundToIncrement(v, inc);
}

// minimal unit helpers (reads user pref from localStorage)
export function getUnit() {
    return (localStorage.getItem('unit') || 'lb').toLowerCase();
}

export function setUnit(unit) {
    localStorage.setItem('unit', unit.toLowerCase());
}

export function getIncrementForUnit() {
    return getUnit() === 'kg' ? 2.5 : 5;
}

export function toDisplayWeight(value) {
    // Assuming storage is already in user unit. Extend later if needed.
    return roundToIncrement(Number(value || 0), getIncrementForUnit());
}
