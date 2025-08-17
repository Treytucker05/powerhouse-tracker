// src/lib/fiveThreeOne/persistCycle.js
import * as storage from '../storage.js';

const ACTIVE_KEY = 'fiveThreeOne_activeCycle_v1';

/**
 * Persist current active cycle to local storage.
 * Initializes week/day progress to week 1, first planned day.
 */
export function persistActiveCycle(programObj) {
    const firstWeek = programObj?.weeks?.[0] || { week: 1, days: [] };
    const firstDayIndex = Math.max(0, (firstWeek.days || []).findIndex(d => !!d));
    const payload = {
        status: 'active',
        startedAt: new Date().toISOString(),
        currentWeek: 1,
        currentDayIndex: firstDayIndex === -1 ? 0 : firstDayIndex,
        program: programObj
    };
    try {
        storage.set(ACTIVE_KEY, payload);
    } catch (e) { /* ignore storage errors */ }
    return payload;
}

export function getActiveCycle() {
    try {
        return storage.get(ACTIVE_KEY) || null;
    } catch (e) { return null; }
}

export function clearActiveCycle() {
    try {
        storage.remove(ACTIVE_KEY);
    } catch (e) { /* ignore */ }
}

export function saveActiveCycle(payload) {
    try {
        storage.set('fiveThreeOne_activeCycle_v1', payload);
    } catch (e) { /* ignore */ }
    return payload;
}

/**
 * Return { active, today, weekObj } where:
 *  - active = active cycle object
 *  - today = current day entry (with lift, sets, etc.)
 *  - weekObj = the full week container
 */
export function getToday() {
    const active = getActiveCycle();
    if (!active?.program) return { active: null, today: null, weekObj: null };
    const w = active.currentWeek ?? 1;
    const di = active.currentDayIndex ?? 0;
    const weekObj = active.program.weeks?.[w - 1] || null;
    const today = weekObj?.days?.[di] || null;
    return { active, today, weekObj };
}

/**
 * Advance to next planned day. If end of week, move to next week (1..4).
 * If cycle end (beyond week 4), mark status 'complete' and do not advance.
 */
export function advanceActiveCycle() {
    const active = getActiveCycle();
    if (!active?.program?.weeks?.length) return null;

    const totalWeeks = active.program.weeks.length;
    let w = active.currentWeek ?? 1;
    let di = active.currentDayIndex ?? 0;

    const daysInWeek = active.program.weeks[w - 1]?.days?.length || 0;
    if (di + 1 < daysInWeek) {
        di = di + 1;
    } else if (w + 1 <= totalWeeks) {
        w = w + 1;
        di = 0;
    } else {
        // End of cycle
        const done = { ...active, status: 'complete', completedAt: new Date().toISOString() };
        return saveActiveCycle(done);
    }

    const next = { ...active, currentWeek: w, currentDayIndex: di };
    return saveActiveCycle(next);
}
