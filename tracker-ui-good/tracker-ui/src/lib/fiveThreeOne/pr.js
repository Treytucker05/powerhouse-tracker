// src/lib/fiveThreeOne/pr.js
import { getHistory } from './history';
import { e1RM as calcE1RM } from './math.js';

// Normalize lift label for grouping
export function liftKey(s) {
    return (s?.liftLabel || s?.lift || '').toString().trim() || 'Unknown';
}

// Find AMRAP (or best) set from a logged session
export function getAmrapFromSession(session) {
    const sets = session?.mainSets || [];
    if (!sets.length) return null;
    // Prefer explicitly flagged amrap or last set
    const withFlag = sets.find(s => s.amrap);
    const candidate = withFlag || sets[sets.length - 1];
    const reps = Number(candidate?.loggedReps ?? 0);
    const weight = Number(candidate?.weight ?? 0);
    if (!reps || !weight) return null;
    const e1RM = +(calcE1RM(weight, reps)).toFixed(1);
    return { weight, reps, e1RM };
}

// Best e1RM per lift across all sessions
export function getBestE1RMPerLift(history = getHistory()) {
    const best = {};
    for (const s of history) {
        const k = liftKey(s);
        const amrap = getAmrapFromSession(s);
        const score = amrap?.e1RM ?? Number(s?.e1RM ?? 0);
        if (!score) continue;
        if (!best[k] || score > best[k].e1RM) {
            best[k] = {
                e1RM: score,
                when: s.when,
                day: s.day,
                weight: amrap?.weight ?? null,
                reps: amrap?.reps ?? null,
            };
        }
    }
    return best;
}

// Rep-records per lift, grouped by AMRAP weight -> best reps
export function getRepRecords(history = getHistory()) {
    const byLift = {};
    for (const s of history) {
        const k = liftKey(s);
        const amrap = getAmrapFromSession(s);
        if (!amrap) continue;
        const w = Math.round(amrap.weight); // round for stable keys
        byLift[k] ||= {};
        const prev = byLift[k][w];
        if (!prev || amrap.reps > prev.reps) {
            byLift[k][w] = { reps: amrap.reps, when: s.when, e1RM: amrap.e1RM };
        }
    }
    return byLift;
}

// Determine if a session set a new e1RM PR for its lift
export function isE1RMPR(session, history = getHistory()) {
    const k = liftKey(session);
    const amrap = getAmrapFromSession(session);
    const score = amrap?.e1RM ?? Number(session?.e1RM ?? 0);
    if (!score) return false;
    const best = getBestE1RMPerLift(history);
    return !best[k] || score > best[k].e1RM;
}
