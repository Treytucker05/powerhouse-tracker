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
