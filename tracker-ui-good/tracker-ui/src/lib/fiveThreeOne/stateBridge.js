// src/lib/fiveThreeOne/stateBridge.js
// Pulls program config from context if available, else from localStorage.
// Keeps this page decoupled from your internal state shape.

export function getLocal(key, def) {
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? def; }
    catch { return def; }
}

export function getTrainingMaxesFromAny(contextMaybe) {
    // Try ProgramContext-like shape
    if (contextMaybe?.trainingMaxes) return contextMaybe.trainingMaxes;
    // Try known localStorage key
    return getLocal('trainingMaxes', {
        squat: 0, bench: 0, deadlift: 0, overhead_press: 0
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
