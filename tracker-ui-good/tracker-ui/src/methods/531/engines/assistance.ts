// Assistance targets engine (per-session defaults)

export type SeventhWeekMode = 'deload' | 'tm_test' | undefined;
export type Phase = 'leader' | 'anchor' | string | undefined;

export interface AssistanceTargets {
    push: number;
    pull: number;
    core: number;
}

export interface AssistanceRanges {
    push: [number, number];
    pull: [number, number];
    core: [number, number];
}

export interface AssistanceTargetsResult {
    targets: AssistanceTargets; // concrete defaults to use
    ranges: AssistanceRanges; // guideline ranges for UI
    defaultRange?: AssistanceRanges; // optional narrower default band for 7th-week
    meta: { mode: SeventhWeekMode; phase: Phase };
}

const NORMAL_RANGES: AssistanceRanges = {
    push: [50, 100],
    pull: [50, 100],
    core: [50, 100],
};

// For normal weeks, store midpoints as defaults (e.g., 75)
const NORMAL_DEFAULTS: AssistanceTargets = { push: 75, pull: 75, core: 75 };

const SEVENTH_RANGES: AssistanceRanges = {
    push: [25, 50],
    pull: [25, 50],
    core: [25, 50],
};

// For 7th-Week, store a practical default band 30–40, with single-number defaults at the midpoint
const SEVENTH_DEFAULT_BAND: AssistanceRanges = {
    push: [30, 40],
    pull: [30, 40],
    core: [30, 40],
};
const SEVENTH_DEFAULTS: AssistanceTargets = { push: 35, pull: 35, core: 35 };

function isSeventhWeek(mode: SeventhWeekMode) {
    return mode === 'deload' || mode === 'tm_test';
}

/**
 * Return recommended assistance targets per session based on seventh-week mode and phase.
 * - Normal weeks: 50–100 each (defaults: 75)
 * - 7th‑Week (deload or tm_test): 25–50 each (defaults: 35), with a default band of 30–40
 */
export function getAssistanceTargets({
    seventhWeekMode,
    phase,
}: {
    seventhWeekMode?: SeventhWeekMode;
    phase?: Phase;
}): AssistanceTargetsResult {
    if (isSeventhWeek(seventhWeekMode)) {
        return {
            targets: SEVENTH_DEFAULTS,
            ranges: SEVENTH_RANGES,
            defaultRange: SEVENTH_DEFAULT_BAND,
            meta: { mode: seventhWeekMode, phase },
        };
    }
    // Future: allow slight nudge per phase if desired
    return {
        targets: NORMAL_DEFAULTS,
        ranges: NORMAL_RANGES,
        meta: { mode: seventhWeekMode, phase },
    };
}

export default getAssistanceTargets;
