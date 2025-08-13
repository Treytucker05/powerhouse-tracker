// src/lib/fiveThreeOne/percentTables.js

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

export const ROUND_TO = (inc = 5) => (w) => Math.round(w / inc) * inc;

/** Build warmups (40/50/60% x 5/5/3) for a given TM */
export function buildWarmups(tm, include = true, roundInc = 5) {
    if (!include) return [];
    const round = ROUND_TO(roundInc);
    const reps = [5, 5, 3];
    return WARMUP_SET_PCTS.map((pct, i) => ({
        type: 'warmup',
        pct,
        weight: round(tm * pct / 100),
        reps: String(reps[i])
    }));
}

/** Build main 3 sets for week & loading option */
export function buildMainSets(tm, loadingOption = 1, week = 1, roundInc = 5) {
    const round = ROUND_TO(roundInc);
    const rows = LOADING_TABLES[String(loadingOption)]?.[week] || [];
    return rows.map(r => ({
        type: 'main',
        pct: r.pct,
        weight: round(tm * r.pct / 100),
        reps: r.reps
    }));
}
