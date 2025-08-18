import { generateCycle } from '../engines/FiveThreeOneEngine.v2.js';

export function selectPreviewWeekIndex(program) {
    return Number(program?.loading?.previewWeek ?? 3);
}

export function selectTmForLift(program, liftKey) {
    return program?.lifts?.[liftKey]?.tm ?? null;
}

// Unified training max selector with fallbacks:
// 1. Canonical flat map: program.trainingMaxes
// 2. Legacy nested: program.lifts[lift].tm
// 3. Debug localStorage mirror (ph531.tm.debug) for instrumentation during alpha
// Returns 0 when not available.
export function selectTrainingMax(program, liftKey) {
    if (!liftKey) return 0;
    const canonical = program?.trainingMaxes?.[liftKey];
    if (canonical != null && canonical > 0) return canonical;
    const legacy = program?.lifts?.[liftKey]?.tm;
    if (legacy != null && legacy > 0) return legacy;
    // Debug fallback (non-critical): safe parse
    try {
        const debug = JSON.parse(globalThis?.localStorage?.getItem('ph531.tm.debug') || '{}');
        const val = debug?.[liftKey];
        if (val != null && val > 0) return val;
    } catch { /* ignore */ }
    return 0;
}

export function selectCycle(program) {
    return generateCycle(program);
}
