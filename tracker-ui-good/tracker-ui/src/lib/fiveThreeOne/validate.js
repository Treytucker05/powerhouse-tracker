// src/lib/fiveThreeOne/validate.js
export function validateTM(tm, oneRM) {
    const t = Number(tm || 0), m = Number(oneRM || 0);
    if (!t || !m) return { ok: false, level: 'error', msg: 'Missing TM or 1RM' };
    const ratio = t / m;
    if (ratio > 0.95) return { ok: false, level: 'warn', msg: 'TM too high (>95% of 1RM). Reduce for safety.' };
    if (ratio < 0.80) return { ok: true, level: 'info', msg: 'TM very conservative (<80% of 1RM). This is okay if desired.' };
    return { ok: true, level: 'ok', msg: 'TM in recommended range.' };
}

// three warm-up sets at 40/50/60% TM
export function getStandardWarmups(tm) {
    const TM = Number(tm || 0);
    return [
        { pct: 40, reps: 5, weight: TM * 0.40 },
        { pct: 50, reps: 5, weight: TM * 0.50 },
        { pct: 60, reps: 3, weight: TM * 0.60 },
    ];
}
