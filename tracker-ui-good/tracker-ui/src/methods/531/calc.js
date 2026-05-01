import { extractWarmups, extractWeekByLabel } from "./packAdapter.js";
import { buildClassicMainSets } from './engines/mainSets.js';
// Static import of assistance rules (was inline require) to avoid duplicate module instantiation
import { assistanceFor } from './assistanceRules.js';
import { buildSupplemental } from './engines/supplemental.js';

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

export function computeMainSets(lift, tm, weekLabel, { amrap } = {}, roundingPref, units, pack, state) {
    if (!tm) return { rows: [], amrapLast: false };
    const rnd = roundingPref || { lbs: 5, kg: 2.5 };
    // Prefer pack-defined week when provided (preserves template-specific AMRAP flags & values)
    try {
        const wk = pack ? extractWeekByLabel(pack, weekLabel) : null;
        if (wk && Array.isArray(wk.main) && wk.main.length) {
            const rows = wk.main.map(s => {
                const pct = s.value ?? s.percentage ?? s.pct;
                const reps = s.reps ?? 0;
                const weight = roundLoad((pct / 100) * tm, units, rnd);
                return { pct, reps, amrap: Boolean(s.amrap), weight, percent_of: 'tm' };
            });
            const amrapLast = rows.length ? Boolean(rows[rows.length - 1]?.amrap) : false;
            return { rows, amrapLast };
        }
    } catch { /* ignore and fallback to classic */ }
    // Otherwise use classic engine to build rows; enforces percent_of='tm' and AMRAP policy
    const classic = buildClassicMainSets({ tm, weekLabel, units, roundingPref: rnd, state });
    let rows = classic.rows;
    // Auto backoff: when enabled, append FSL/SSL line using schemeId
    try {
        const auto = state?.automation?.autoFsl;
        const schemeId = state?.supplemental?.schemeId || state?.supplemental?.strategy;
        if (auto && (schemeId === 'fsl' || schemeId === 'ssl') && rows.length >= 2) {
            const refIdx = schemeId === 'fsl' ? 0 : 1;
            const ref = rows[refIdx];
            if (ref) {
                rows.push({ pct: ref.pct, reps: typeof ref.reps === 'string' ? ref.reps : 5, amrap: false, weight: ref.weight, percent_of: 'tm', backoff: schemeId });
            }
        }
    } catch { /* non-fatal */ }
    const amrapLast = rows.length ? Boolean(rows[rows.length - 1]?.amrap) : false;
    return { rows, amrapLast };
}

export function computeSupplemental(pack, lift, tm, state) {
    if (!tm) return null;
    const sup = state?.supplemental;
    if (!sup) return null;
    const schemeId = sup.schemeId || sup.strategy || sup.mode;
    const weekLabel = state?.weekLabel || state?.currentWeekLabel; // optional, usually passed via schedule/makeDay meta
    const roundingIncrement = (state?.roundingIncrement != null)
        ? state.roundingIncrement
        : ((state?.units === 'kg' || state?.units === 'kgs') ? 2.5 : 5);
    const built = buildSupplemental({ schemeId, weekLabel, tm, roundingIncrement });
    if (built) return built;
    // Only apply BBB fallback when the selected scheme is BBB; otherwise return null
    if (String(schemeId || '').toLowerCase() !== 'bbb') return null;
    const pct = sup.percentOfTM ?? sup.intensity?.value ?? 50;
    const units = state?.units || 'lbs';
    const rounding = state?.roundingPref || { lbs: 5, kg: 2.5 };
    const load = roundLoad((tm * pct) / 100, units, rounding);
    return { type: 'bbb', sets: sup.sets ?? 5, reps: sup.reps ?? 10, pct, load };
}

export function computeAssistance(pack, lift, state) {
    const tplId = state?.templateKey || state?.template || (typeof pack === 'string' ? pack : pack?.program?.id) || 'custom';
    return assistanceFor ? (assistanceFor(tplId, lift, state) || []) : [];
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
    // Default BBB percent lowered from 60 to 50 (legacy export may still specify 60 explicitly)
    const value = supplemental.percentOfTM ?? supplemental.intensity?.value ?? 50;
    const load = roundLoad((tm * value) / 100, units, rnd);
    return {
        sets: supplemental.sets ?? 5,
        reps: supplemental.reps ?? 10,
        pct: value,
        load
    };
}

// --- Volume & Stress helpers (for Step 4 mini-panel) ---
// estimateTonnage(sets): expects array of objects each with numeric weight & reps.
// Returns sum(weight * reps); silently skips invalid rows.
export function estimateTonnage(sets) {
    if (!Array.isArray(sets) || sets.length === 0) return 0;
    return sets.reduce((acc, s) => {
        const w = Number(s.weight);
        const r = Number(s.reps);
        if (Number.isFinite(w) && Number.isFinite(r)) return acc + (w * r);
        return acc;
    }, 0);
}

// sumRepsByBlock(day): given a day object with assistance: [{block, sets, reps}]
// Returns { blockName: totalEstimatedReps }
export function sumRepsByBlock(day) {
    const out = {};
    if (!day || !Array.isArray(day.assistance)) return out;
    for (const it of day.assistance) {
        const sets = Number(it.sets) || 0;
        let reps = 0;
        if (typeof it.reps === 'number') reps = it.reps;
        else if (typeof it.reps === 'string') {
            if (/^\d+-\d+/.test(it.reps)) {
                const [a, b] = it.reps.split('-').map(n => Number(n));
                if (Number.isFinite(a) && Number.isFinite(b)) reps = Math.round((a + b) / 2);
            } else if (/^\d+/.test(it.reps)) reps = Number(it.reps);
            else reps = 12; // heuristic fallback
        }
        const total = sets * reps;
        const block = it.block || 'general';
        out[block] = (out[block] || 0) + total;
    }
    return out;
}

// --- Progression helpers (cycle advancement) ---
export const LIFTS = ["squat", "bench", "deadlift", "press"];

export function roundTo(v, step) {
    const s = Number(step || 5);
    return Math.round(Number(v) / s) * s;
}

function incFor(lift, units) {
    const upper = ["bench", "press"].includes(lift);
    if (units === "kg") return upper ? 2.5 : 5;
    return upper ? 5 : 10; // lbs
}

// Week-3 AMRAP gate: default min=1, overridable per state
export function passedAmrapWk3(reps, state) {
    if (reps == null) return true; // treat missing data as pass
    const min = Number(state?.amrapMinWk3 ?? 1);
    return Number(reps) >= min;
}

// Pure TM progression (no I/O)
export function nextTM(lift, tm, units, passed, rounding) {
    const base = Number(tm) || 0;
    const inc = incFor(lift, units);
    const next = passed ? (base + inc) : Math.max(0, base - inc);
    // Use unit-appropriate rounding step (previously always preferred lbs key which broke kg increments)
    const step = units === 'kg' ? (rounding?.kg ?? 2.5) : (rounding?.lbs ?? 5);
    return roundTo(next, step);
}

// Batch apply based on recorded wk3 AMRAP reps
export function computeNextTMs({ tms, units, rounding, amrapWk3 = {}, state }) {
    const out = {};
    for (const lift of LIFTS) {
        const reps = amrapWk3?.[lift];
        const passed = passedAmrapWk3(reps, state);
        out[lift] = nextTM(lift, Number(tms?.[lift] || 0), units, passed, rounding);
    }
    return out;
}
