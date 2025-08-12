import { extractWarmups, extractWeekByLabel } from "./packAdapter";

// Shared compute helpers (lift + TM + week context). These unify 3-day and 4-day previews.
// Signatures kept simple & stable for plug-and-play usage across schedule builders.

export function computeWarmups(lift, tm, weekLabel, roundingPref, units, pack) {
    if (!pack || !tm) return [];
    const wu = extractWarmups(pack) || [];
    const rnd = roundingPref || { lbs: 5, kg: 2.5 };
    return wu.map(s => {
        const pct = s.value ?? s.percentage ?? s.pct;
        const reps = s.reps ?? 0;
        const weight = roundLoad((pct / 100) * tm, units, rnd);
        return { pct, reps, weight };
    });
}

export function computeMainSets(lift, tm, weekLabel, { amrap } = {}, roundingPref, units, pack) {
    if (!pack || !tm) return { rows: [], amrapLast: false };
    const wk = extractWeekByLabel(pack, weekLabel);
    const main = wk?.main || [];
    const rnd = roundingPref || { lbs: 5, kg: 2.5 };
    const rows = main.map((s, idx) => {
        const pct = s.value ?? s.percentage ?? s.pct;
        const reps = s.reps ?? 0;
        // Respect pack amrap flag; optionally force only for final heavy week
        const isAmrap = Boolean(s.amrap && (amrap ? true : s.amrap));
        const weight = roundLoad((pct / 100) * tm, units, rnd);
        return { pct, reps, amrap: isAmrap, weight };
    });
    const amrapLast = rows.length ? Boolean(rows[rows.length - 1]?.amrap) : false;
    return { rows, amrapLast };
}

export function computeSupplemental(pack, lift, tm, state) {
    const sup = state?.supplemental;
    if (!sup) return null;
    const mode = sup.strategy || sup.mode;
    if (mode !== 'bbb') return null; // future: extend for FSL, SSL, etc.
    const pct = sup.percentOfTM ?? sup.intensity?.value ?? 60;
    if (!tm) return null;
    const units = state?.units || 'lbs';
    const rounding = state?.roundingPref || { lbs: 5, kg: 2.5 };
    const load = roundLoad((tm * pct) / 100, units, rounding);
    return { type: 'bbb', sets: sup.sets ?? 5, reps: sup.reps ?? 10, pct, load };
}

export function computeAssistance(pack, lift, state) {
    // For now rely on already derived assistance.items array in state.
    // Future: derive per-lift assistance groups. Return items union filtered by lift if we encode categories.
    return state?.assistance?.items || [];
}

export function roundLoad(x, units = "lbs", rounding = { lbs: 5, kg: 2.5 }) {
    const step = units === "kg" ? (rounding.kg ?? 2.5) : (rounding.lbs ?? 5);
    return Math.round(x / step) * step;
}
export function tmFor(lift, tms = {}) {
    return Number(tms?.[lift] ?? 0) || 0;
}
export function computeWarmupsFromPack({ pack, lift, tms, units = "lbs", rounding }) {
    if (!pack) return [];
    const tm = tmFor(lift, tms);
    if (!tm) return [];
    const wu = extractWarmups(pack) || [];
    const rnd = rounding || pack?.program?.defaults?.rounding || { lbs: 5, kg: 2.5 };
    return wu.map(s => {
        const pct = s.value ?? s.percentage ?? s.pct;
        const reps = s.reps ?? 0;
        const weight = roundLoad((pct / 100) * tm, units, rnd);
        return { pct, reps, weight };
    });
}
export function computeMainFromPack({ pack, lift, weekLabel, tms, units = "lbs", rounding }) {
    if (!pack) return { rows: [], amrapLast: false };
    const tm = tmFor(lift, tms);
    if (!tm) return { rows: [], amrapLast: false };
    const wk = extractWeekByLabel(pack, weekLabel);
    const main = wk?.main || [];
    const rnd = rounding || pack?.program?.defaults?.rounding || { lbs: 5, kg: 2.5 };
    const rows = main.map(s => {
        const pct = s.value ?? s.percentage ?? s.pct;
        const reps = s.reps ?? 0;
        const amrap = Boolean(s.amrap);
        const weight = roundLoad((pct / 100) * tm, units, rnd);
        return { pct, reps, amrap, weight };
    });
    const amrapLast = rows.length ? Boolean(rows[rows.length - 1]?.amrap) : false;
    return { rows, amrapLast };
}
export function computeBBBFromConfig({ supplemental, lift, tms, units = "lbs", rounding, pack }) {
    if (!supplemental) return null;
    const mode = supplemental.strategy || supplemental.mode;
    if (mode !== "bbb") return null;
    const tm = tmFor(lift, tms);
    if (!tm) return null;
    const rnd = rounding || pack?.program?.defaults?.rounding || { lbs: 5, kg: 2.5 };
    const value = supplemental.percentOfTM ?? supplemental.intensity?.value ?? 60;
    const load = roundLoad((tm * value) / 100, units, rnd);
    return {
        sets: supplemental.sets ?? 5,
        reps: supplemental.reps ?? 10,
        pct: value,
        load
    };
}
