// 7th-Week protocol engine
import { getAssistanceTargets } from './assistance';

export type SeventhWeekMode = 'deload' | 'tm_test';

export interface SeventhWeekRow {
    pct: number; // percent of TM
    reps: number | string; // e.g., 5, '3-5', '3+', '5+'
    amrap: boolean; // true only for final test entry in tm_test
    percent_of: 'tm';
}

export interface SeventhWeekPlan {
    rows: SeventhWeekRow[];
    assistanceTargets: { push: number; pull: number; core: number };
}

/**
 * Build 7th-Week sequence rows.
 * - Deload: 70%x5, 80%x3-5, 90%x1, 100%x1 (no AMRAP)
 * - TM Test: 70%x5, 80%x5, 90%x5, 100%x(5+ if tmPct=0.85 else 3+), AMRAP true on final only
 */
export function buildSeventhWeek(mode: SeventhWeekMode, tmPct: number): SeventhWeekPlan {
    // Align assistance defaults with assistance targets engine
    const at = getAssistanceTargets({ seventhWeekMode: mode }).targets;
    const assistanceTargets = { push: at.push, pull: at.pull, core: at.core } as const;
    const rows: SeventhWeekRow[] = [];
    const m = (mode || 'deload').toLowerCase() as SeventhWeekMode;

    if (m === 'tm_test') {
        const finalReps = (Math.round((tmPct || 0.85) * 100) <= 86) ? '5+' : '3+';
        rows.push(
            { pct: 70, reps: 5, amrap: false, percent_of: 'tm' },
            { pct: 80, reps: 5, amrap: false, percent_of: 'tm' },
            { pct: 90, reps: 5, amrap: false, percent_of: 'tm' },
            { pct: 100, reps: finalReps, amrap: true, percent_of: 'tm' },
        );
    } else {
        // deload
        rows.push(
            { pct: 70, reps: 5, amrap: false, percent_of: 'tm' },
            { pct: 80, reps: '3-5', amrap: false, percent_of: 'tm' },
            { pct: 90, reps: 1, amrap: false, percent_of: 'tm' },
            { pct: 100, reps: 1, amrap: false, percent_of: 'tm' },
        );
    }

    return { rows, assistanceTargets };
}
