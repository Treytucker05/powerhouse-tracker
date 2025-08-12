// src/lib/engines/AssistanceEngine.v2.js
// Pure helpers for assistance weight calculation from TM with rounding.
export function computeAssistanceLoad({
    method,            // 'percentOfTM' | 'bodyweight' | 'na' | 'percentOfBodyweight'
    sourceLift,        // 'squat'|'bench'|'deadlift'|'overhead_press' | undefined
    percent = 0,       // e.g., 0.35 => 35% of TM
    tms = {},          // { squat, bench, deadlift, overhead_press }
    bodyweight = 0,    // optional, if we later want % of BW for DB rows etc.
    roundingIncrement = 5,
    roundingMode = 'nearest',
    units = 'lbs'
}) {
    if (!method || method === 'na') return { label: '—', weight: null, units };
    if (method === 'bodyweight') return { label: 'BW', weight: null, units };
    if (method === 'percentOfBodyweight') {
        const raw = (bodyweight || 0) * percent;
            const w = assistanceRoundToIncrement(raw, roundingIncrement, roundingMode);
        return { label: `${w} ${units}`, weight: w, units };
    }
    // percentOfTM
    const tm = sourceLift ? tms?.[sourceLift] || 0 : 0;
    if (!tm || tm <= 0) return { label: '—', weight: null, units };
    const raw = tm * percent;
        const w = assistanceRoundToIncrement(raw, roundingIncrement, roundingMode);
    return { label: `${w} ${units}`, weight: w, units };
}

     // Local rounding helper (intentionally not exported to avoid name collision with main engine)
     function assistanceRoundToIncrement(value, increment = 5, mode = 'nearest') {
    if (!value || increment <= 0) return 0;
    const f = value / increment;
    if (mode === 'floor') return Math.floor(f) * increment;
    if (mode === 'ceil') return Math.ceil(f) * increment;
    return Math.round(f) * increment;
}

// Given a day's assistance items and TMs + rounding, compute rendered rows.
// items: [{ name, sets, reps, rule: { method, sourceLift, percent? } }]
export function buildAssistanceForDay({
    items = [],
    tms = {},
    units = 'lbs',
    roundingIncrement = 5,
    roundingMode = 'nearest',
    bodyweight = 0
}) {
    return items.map(it => {
        const res = computeAssistanceLoad({
            ...it.rule,
            tms,
            units,
            roundingIncrement,
            roundingMode,
            bodyweight
        });
        return {
            name: it.name,
            sets: it.sets,
            reps: it.reps,
            loadLabel: res.label,   // "BW", "—", or "xx lbs|kg"
            weight: res.weight,
            units: res.units
        };
    });
}
