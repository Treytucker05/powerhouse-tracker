// src/lib/fiveThreeOne/percentTables.js
// NOTE: Rounding now delegated to centralized roundToIncrement in lib/math/rounding.ts
import { roundToIncrement } from '../math/rounding.ts';

// Warm-ups used every day before main work sets
export const WARMUP_SET_PCTS = [40, 50, 60]; // of TM

// Two official loading options (from Wendler)
export const LOADING_TABLES = {
    1: {
        1: [{ pct: 65, reps: '5' }, { pct: 75, reps: '5' }, { pct: 85, reps: '5+' }],
        2: [{ pct: 70, reps: '3' }, { pct: 80, reps: '3' }, { pct: 90, reps: '3+' }],
        3: [{ pct: 75, reps: '5' }, { pct: 85, reps: '3' }, { pct: 95, reps: '1+' }],
        4: [{ pct: 40, reps: '5' }, { pct: 50, reps: '5' }, { pct: 60, reps: '5' }]
    },
    2: {
        1: [{ pct: 75, reps: '5' }, { pct: 80, reps: '5' }, { pct: 85, reps: '5+' }],
        2: [{ pct: 80, reps: '3' }, { pct: 85, reps: '3' }, { pct: 90, reps: '3+' }],
        3: [{ pct: 85, reps: '5' }, { pct: 90, reps: '3' }, { pct: 95, reps: '1+' }],
        4: [{ pct: 40, reps: '5' }, { pct: 50, reps: '5' }, { pct: 60, reps: '5' }]
    }
};

// Deprecated local rounding helper (was ROUND_TO). All callers now use roundToIncrement.
// Keeping no-op export (removed) would encourage drift; remove and migrate call sites instead.

/** Build warmups (40/50/60% x 5/5/3) for a given TM */
export function buildWarmups(tm, include = true, roundInc = 5, mode = 'nearest') {
    if (!include) return [];
    const reps = [5, 5, 3];
    return WARMUP_SET_PCTS.map((pct, i) => {
        const raw = tm * pct / 100;
        return {
            type: 'warmup',
            pct,
            weight: roundToIncrement(raw, roundInc, mode),
            reps: String(reps[i])
        };
    });
}

/** Build main 3 sets for week & loading option */
export function buildMainSets(tm, loadingOption = 1, week = 1, roundInc = 5, mode = 'nearest') {
    const rows = LOADING_TABLES[String(loadingOption)]?.[week] || [];
    return rows.map(r => {
        const raw = tm * r.pct / 100;
        return {
            type: 'main',
            pct: r.pct,
            weight: roundToIncrement(raw, roundInc, mode),
            reps: r.reps
        };
    });
}
