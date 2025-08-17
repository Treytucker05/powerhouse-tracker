import { generateCycle } from '../engines/FiveThreeOneEngine.v2.js';

export function selectPreviewWeekIndex(program) {
    return Number(program?.loading?.previewWeek ?? 3);
}

export function selectTmForLift(program, liftKey) {
    return program?.lifts?.[liftKey]?.tm ?? null;
}

export function selectCycle(program) {
    return generateCycle(program);
}
