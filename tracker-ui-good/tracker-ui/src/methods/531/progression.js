import { computeNextTMs, LIFTS } from './calc';

// advanceCycle: produce next cycle state snapshot with updated TMs and history entry
export function advanceCycle(prevState, { amrapWk3 = {} } = {}) {
    if (!prevState) return prevState;
    const units = prevState.units || 'lbs';
    const rounding = prevState.roundingPref || { lbs: 5, kg: 2.5 };
    // Build current TM map (state.lifts may hold tm values)
    const tms = {};
    for (const l of LIFTS) tms[l] = prevState.lifts?.[l]?.tm || prevState.tms?.[l] || 0;
    const nextTms = computeNextTMs({ tms, units, rounding, amrapWk3, state: prevState });
    const cycleNum = (prevState.cycle ?? 1);
    return {
        ...prevState,
        tms: nextTms,
        lifts: {
            ...prevState.lifts,
            ...Object.fromEntries(Object.entries(prevState.lifts || {}).map(([k, v]) => [k, { ...v, tm: nextTms[k] }]))
        },
        cycle: cycleNum + 1,
        week: 1,
        history: [
            ...(prevState.history || []),
            { cycle: cycleNum, amrapWk3, tms, at: Date.now() }
        ]
    };
}

// advanceCycleSelective: allow user to opt specific lifts in/out of progression (keeps others unchanged)
export function advanceCycleSelective(prevState, { amrapWk3 = {}, include = {} } = {}) {
    if (!prevState) return prevState;
    const units = prevState.units || 'lbs';
    const rounding = prevState.roundingPref || { lbs: 5, kg: 2.5 };
    const tms = {}; // current
    for (const l of LIFTS) tms[l] = prevState.lifts?.[l]?.tm || prevState.tms?.[l] || 0;
    const fullNext = computeNextTMs({ tms, units, rounding, amrapWk3, state: prevState });
    const finalNext = { ...tms };
    for (const l of LIFTS) {
        if (include[l]) finalNext[l] = fullNext[l]; // only progress if user opted in
    }
    const cycleNum = (prevState.cycle ?? 1);
    return {
        ...prevState,
        tms: finalNext,
        lifts: {
            ...prevState.lifts,
            ...Object.fromEntries(Object.entries(prevState.lifts || {}).map(([k, v]) => [k, { ...v, tm: finalNext[k] }]))
        },
        cycle: cycleNum + 1,
        week: 1,
        history: [
            ...(prevState.history || []),
            { cycle: cycleNum, amrapWk3, tmsBefore: tms, tmsAfter: finalNext, include, at: Date.now() }
        ]
    };
}

export default { advanceCycle, advanceCycleSelective };
