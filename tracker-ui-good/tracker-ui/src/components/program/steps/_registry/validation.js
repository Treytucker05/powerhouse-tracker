// src/components/program/steps/_registry/validation.js

function isNum(x) {
    return typeof x === 'number' && isFinite(x) && x > 0;
}

export function validateFundamentals(state) {
    const errs = [];
    const lifts = state?.coreLiftsEnabled || { squat: true, bench: true, deadlift: true, press: true };
    for (const k of Object.keys(lifts)) {
        if (!lifts[k]) continue;
        const L = state?.lifts?.[k] || {};
        const haveTM = isNum(L.tm);
        const have1RM = isNum(L.oneRM);
        const tmPctDec = (typeof L.tmPct === 'number' && L.tmPct <= 1)
            ? L.tmPct
            : (typeof state?.tmPct === 'number' && state.tmPct > 0 && state.tmPct <= 1 ? state.tmPct : 0.90);
        if (!(haveTM || have1RM)) errs.push(`Enter TM or 1RM for ${k}`);
        if (!(tmPctDec >= 0.80 && tmPctDec <= 0.95)) errs.push(`TM% for ${k} should be 85–90 (got ${Math.round(tmPctDec * 100) || 'unset'})`);
    }
    const roundingInc = state?.rounding?.increment;
    if (!isNum(roundingInc)) errs.push('Set a weight rounding increment (e.g., 5 lb or 2.5 kg)');
    return { ok: errs.length === 0, errors: errs };
}

export function validateTemplate(state) {
    const id = state?.template?.id || null;
    if (!id) return { ok: false, errors: ['Choose a template (BBB, Triumvirate, etc.) or Custom'] };
    // BBB details sanity
    if (id === 'bbb') {
        const pct = state?.template?.bbb?.pct ?? 50;
        if (![50, 60, 70].includes(pct)) return { ok: false, errors: ['BBB % must be 50, 60, or 70'] };
    }
    return { ok: true, errors: [] };
}

export function validateScheduleWarmup(state) {
    const freq = state?.schedule?.frequency;
    const days = state?.schedule?.days || [];
    const errs = [];
    if (!freq) errs.push('Select training frequency');
    if (!days.length) errs.push('Configure at least 3 training days');
    if (days.length > 4) errs.push('Limit lifting days to 3–4 per week');
    // Detect >2 consecutive days (simplistic check: if user added artificial extra days)
    if (days.length >= 3) {
        // If they have provided a frequency flag inconsistent with day count, note it
        if (freq === '3day' && days.length > 3) errs.push('3‑day rolling schedule should list only 3 days here');
    }
    return { ok: errs.length === 0, errors: errs };
}

export function validateCycleProgression(state) {
    const opt = state?.loading?.option;
    const upper = state?.progression?.upper;
    const lower = state?.progression?.lower;
    const errs = [];
    if (![1, 2].includes(opt)) errs.push('Pick Loading Option 1 or 2');
    if (!isNum(upper)) errs.push('Set upper-body TM increment (+5 lb default)');
    if (!isNum(lower)) errs.push('Set lower-body TM increment (+10 lb default)');
    return { ok: errs.length === 0, errors: errs };
}

export function validateAssistance(state) {
    // Assistance is governed by template; nothing hard-blocking if template chosen.
    return { ok: true, errors: [] };
}

export function validateConditioning(state) {
    // Optional step – treat as ok even if unset.
    return { ok: true, errors: [] };
}

export function validateAdvanced(state) {
    // Optional step – treat as ok.
    return { ok: true, errors: [] };
}
