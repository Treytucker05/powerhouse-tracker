// src/lib/fiveThreeOne/conditioningPlanner.js
import { CONDITIONING_PLACEMENT, DAYS, MODALITIES } from './conditioningLibrary.js';

/**
 * scheduleFromState: try to read user lift days (Mon..Sun → liftKey)
 * Expected format in state.schedule or state.week: 
 *   { Mon:'press', Tue:'deadlift', Thu:'bench', Fri:'squat' } (examples)
 */
export function deriveLiftDayMap(state) {
    // Try several likely shapes the app may hold
    const sched = state?.schedule?.days || state?.week || {};
    const map = {};

    // Normalize keys to Mon..Sun if possible
    if (Array.isArray(sched)) {
        // Our app uses an array of days with .lift; assume Mon/Tue/Thu/Fri order when frequency 4
        const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let i = 0;
        for (const d of sched) {
            const dayName = defaultDays[i] || defaultDays[0];
            if (d?.lift) map[dayName] = d.lift;
            i++;
        }
    } else {
        for (const k of Object.keys(sched || {})) {
            const key = k.slice(0, 3).toLowerCase();
            const day = DAYS.find(d => d.slice(0, 3).toLowerCase() === key);
            if (day) map[day] = sched[k];
        }
    }

    // Default to 4-day Press/DL/Bench/Squat (Mon/Tue/Thu/Fri)
    if (Object.keys(map).length === 0) {
        map.Mon = 'press';
        map.Tue = 'deadlift';
        map.Thu = 'bench';
        map.Fri = 'squat';
    }
    return map;
}

/**
 * Build a conditioning plan for the week
 * @param {*} state full wizard state (needs schedule + template context)
 * @param {*} options conditioning options (frequency, placement, modalities)
 * @returns [{ day:'Tue', mode:'hiit'|'liss', modality:string, prescription:{}, notes:string }]
 */
export function buildConditioningPlan(state, options) {
    const out = [];
    const liftDays = deriveLiftDayMap(state);

    const freq = Math.max(0, Number(options?.frequency ?? 2));
    const hiitCount = Math.min(freq, Math.max(0, Number(options?.hiitPerWeek ?? freq)));
    const lissCount = Math.max(0, Math.min(freq - hiitCount, Number(options?.lissPerWeek ?? (freq - hiitCount))));
    const place = options?.placement || CONDITIONING_PLACEMENT.AFTER_LIFTS;

    // helpers
    const isLiftDay = d => !!liftDays[d];
    const isLowerDay = d => ['squat', 'deadlift'].includes(liftDays[d] || '');
    const hiitMods = (options?.hiitModalities || []).filter(k => MODALITIES[k]?.mode === 'hiit');
    const lissMods = (options?.lissModalities || []).filter(k => MODALITIES[k]?.mode === 'liss');

    const pickMod = (arr, idx) => (arr.length ? arr[idx % arr.length] : null);

    // Candidate days by placement policy
    const afterLiftOrder = DAYS.filter(d => isLiftDay(d)); // attach post-session
    const offDayOrder = DAYS.filter(d => !isLiftDay(d));   // place on non-lift days

    const targets = place === CONDITIONING_PLACEMENT.AFTER_LIFTS
        ? afterLiftOrder
        : place === CONDITIONING_PLACEMENT.OFF_DAYS
            ? offDayOrder
            : // mixed: try off-days first, then remaining lift days
            [...offDayOrder, ...afterLiftOrder];

    // Assign HIIT sessions first (prefer after lower body or off-days not adjacent to lower)
    let assigned = 0;
    for (let i = 0; i < targets.length && assigned < hiitCount; i++) {
        const d = targets[i];

        // If this is BEFORE a lower day, skip to avoid interference
        const nextIdx = (DAYS.indexOf(d) + 1) % DAYS.length;
        const nextDay = DAYS[nextIdx];
        const avoid = isLowerDay(nextDay);

        if (avoid && place !== CONDITIONING_PLACEMENT.AFTER_LIFTS) continue;

        const modKey = pickMod(hiitMods, assigned) || 'hill_sprint';
        const mod = MODALITIES[modKey];
        out.push({
            day: d,
            mode: 'hiit',
            modality: modKey,
            prescription: { ...mod.default },
            notes: isLiftDay(d) ? `After ${liftDays[d]} session` : 'Standalone session'
        });
        assigned++;
    }

    // Assign LISS sessions next
    let lissAssigned = 0;
    for (let i = 0; i < targets.length && lissAssigned < lissCount; i++) {
        const d = targets[i];

        // Skip days that already got a session
        if (out.some(s => s.day === d)) continue;

        const modKey = pickMod(lissMods, lissAssigned) || 'walk';
        const mod = MODALITIES[modKey];
        out.push({
            day: d,
            mode: 'liss',
            modality: modKey,
            prescription: { ...mod.default },
            notes: isLiftDay(d) ? `After ${liftDays[d]} session (easy)` : 'Standalone easy session'
        });
        lissAssigned++;
    }

    // Sort by weekday order
    out.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
    return out.slice(0, freq);
}

/**
 * planConditioningFromState: unified accessor that returns a normalized weekly conditioning plan
 * regardless of whether the wizard is using the new Step6 (conditioning.options + weeklyPlan)
 * shape or the earlier simple shape (sessionsPerWeek, hiitPerWeek, modalities{..}).
 * Falls back to auto-generation when only options are present. Returns [] if no sessions requested.
 */
// Internal mapper: convert arbitrary user-entered labels to canonical modality keys
function mapToCanonicalModality(label, fallbackMode) {
    if (MODALITIES[label]) return label;
    const lower = String(label).toLowerCase();
    if (lower.includes('prowler')) return 'prowler_push';
    if (lower.includes('hill')) return 'hill_sprint';
    if (lower.includes('sled')) return 'sled_drag';
    if (lower.includes('row') && fallbackMode === 'hiit') return 'row_interval';
    if (lower.includes('bike') && fallbackMode === 'hiit') return 'bike_interval';
    if (lower.includes('walk')) return 'walk';
    if (lower.includes('swim')) return 'swim';
    if (lower.includes('bike')) return 'easy_bike';
    if (lower.includes('row')) return 'easy_row';
    return fallbackMode === 'hiit' ? 'hill_sprint' : 'walk';
}

export function normalizeConditioningModalities(modalitiesObj = {}) {
    return {
        hiit: (modalitiesObj.hiit || []).map(m => mapToCanonicalModality(m, 'hiit')),
        liss: (modalitiesObj.liss || []).map(m => mapToCanonicalModality(m, 'liss'))
    };
}

export function planConditioningFromState(state) {
    const cond = state?.conditioning || {};

    // Case 1: Explicit weeklyPlan authored by user (Step6 UI). Trust it and normalize.
    if (Array.isArray(cond.weeklyPlan) && cond.weeklyPlan.length) {
        return cond.weeklyPlan.map(s => ({
            day: s.day,
            mode: s.mode,
            modality: mapToCanonicalModality(s.modality, s.mode),
            prescription: { ...(s.prescription || {}) },
            notes: s.notes || (s.mode === 'hiit' ? 'After lift' : 'Easy session')
        }));
    }

    // Collect option style config (Step6) or legacy flat fields.
    const opts = cond.options || cond; // legacy cond placed fields at root
    const frequency = Number(opts.frequency ?? cond.sessionsPerWeek ?? 0) || 0;
    if (!frequency) return [];
    const hiitPerWeek = Number(opts.hiitPerWeek ?? cond.hiitPerWeek ?? frequency);
    const lissPerWeek = Number(opts.lissPerWeek ?? Math.max(0, frequency - hiitPerWeek));
    const placement = opts.placement || CONDITIONING_PLACEMENT.AFTER_LIFTS;

    const hiitModalities = (opts.hiitModalities || cond.modalities?.hiit || []).map(m => mapToCanonicalModality(m, 'hiit'));
    const lissModalities = (opts.lissModalities || cond.modalities?.liss || []).map(m => mapToCanonicalModality(m, 'liss'));

    try {
        return buildConditioningPlan(state, {
            frequency,
            hiitPerWeek,
            lissPerWeek,
            placement,
            hiitModalities,
            lissModalities
        });
    } catch (e) {
        console.warn('planConditioningFromState failed', e);
        return [];
    }
}

// Export mapping function for external consumers (e.g., export builders) to canonicalize stored legacy modality labels
export function toCanonicalModalityKey(label, modeHint) {
    return mapToCanonicalModality(label, modeHint);
}
