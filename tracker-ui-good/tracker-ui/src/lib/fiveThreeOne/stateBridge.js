// src/lib/fiveThreeOne/stateBridge.js
// Pulls program config from context if available, else from localStorage.
// Keeps this page decoupled from your internal state shape.

export function getLocal(key, def) {
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? def; }
    catch { return def; }
}

export function getTrainingMaxesFromAny(contextMaybe) {
    // 1) Prefer direct context shape if provided
    if (contextMaybe?.trainingMaxes) return contextMaybe.trainingMaxes;

    // 2) Attempt to read the V2 builder state (canonical) and derive TMs
    try {
        const v2 = getLocal('ph_program_v2', null);
        if (v2 && (v2.trainingMaxes || v2.lifts)) {
            // If flat map exists, prefer it
            if (v2.trainingMaxes && Object.keys(v2.trainingMaxes).length) return v2.trainingMaxes;
            // Otherwise, derive from per-lift records
            const lifts = v2.lifts || {};
            const derived = {
                squat: Number(lifts?.squat?.tm) || 0,
                bench: Number(lifts?.bench?.tm) || 0,
                deadlift: Number(lifts?.deadlift?.tm) || 0,
                press: Number(lifts?.press?.tm) || 0,
            };
            if (Object.values(derived).some(v => v > 0)) return derived;
        }
    } catch { /* ignore parse errors */ }

    // 3) Active 5/3/1 program payload (Program531ActiveV2 / exports)
    try {
        const active = getLocal('ph531.activeProgram.v2', null);
        if (active?.trainingMaxes && Object.keys(active.trainingMaxes).length) return active.trainingMaxes;
    } catch { /* ignore */ }

    // 4) Legacy AppContext current program (step1.trainingMaxes or top-level trainingMaxes)
    try {
        const cp = getLocal('currentProgram', null);
        const tm = cp?.trainingMaxes || cp?.step1?.trainingMaxes;
        if (tm && Object.keys(tm).length) return tm;
    } catch { /* ignore */ }

    // 5) Last-resort compatibility key
    return getLocal('trainingMaxes', {
        squat: 0, bench: 0, deadlift: 0, press: 0
    });
}

export function getLoadingOptionFromAny(contextMaybe) {
    if (contextMaybe?.loadingOption) return contextMaybe.loadingOption; // 1 or 2
    return Number(localStorage.getItem('loadingOption') || 1);
}

export function getLiftOrderFromAny(contextMaybe) {
    if (contextMaybe?.liftOrder) return contextMaybe.liftOrder;
    return ['press', 'deadlift', 'bench', 'squat']; // canonical default
}

export function getClientMetaFromAny(contextMaybe) {
    const def = { clientName: 'Client', startDate: null };
    if (!contextMaybe) return { ...def, ...getLocal('clientMeta', {}) };
    return {
        clientName: contextMaybe.clientName || def.clientName,
        startDate: contextMaybe.startDate || def.startDate,
    };
}
