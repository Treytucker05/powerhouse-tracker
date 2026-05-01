// Classic 5/3/1 main set builder with AMRAP policy and 7th-week handling
// Local rounding helper to avoid circular imports
function roundLoadLocal(x, units = 'lbs', roundingPref = { lbs: 5, kg: 2.5 }) {
    const step = units === 'kg' ? (roundingPref.kg ?? 2.5) : (roundingPref.lbs ?? 5);
    return Math.round(x / step) * step;
}

// Percent tables by weekLabel
const TABLES = {
    "3x5": { percents: [65, 75, 85], reps: [5, 5, 5] },
    "3x3": { percents: [70, 80, 90], reps: [3, 3, 3] },
    "5/3/1": { percents: [75, 85, 95], reps: [5, 3, 1] },
};

// 7th-Week protocol (aligned with engines/seventhWeek.ts)
// Deload: 70x5, 80x3-5, 90x1, 100x1 (no AMRAP)
// TM Test: 70x5, 80x5, 90x5, 100x(5+ if tmPct≈0.85 else 3+) with AMRAP on final only
function buildSeventhWeekSpec(state) {
    const mode = (state?.seventhWeek?.mode || 'deload').toLowerCase();
    const tmPct = (typeof state?.tmPct === 'number' && state.tmPct > 0)
        ? state.tmPct
        : ((typeof state?.tmPctChoice === 'number' && state.tmPctChoice > 0) ? (state.tmPctChoice / 100) : 0.85);
    if (mode === 'tm_test') {
        const finalReps = (Math.round((tmPct || 0.85) * 100) <= 86) ? '5+' : '3+';
        return {
            percents: [70, 80, 90, 100],
            reps: [5, 5, 5, finalReps],
            amrapIndex: 3
        };
    }
    return {
        percents: [70, 80, 90, 100],
        reps: [5, '3-5', 1, 1],
        amrapIndex: -1
    };
}

export function buildClassicMainSets({ tm, weekLabel, units = 'lbs', roundingPref = { lbs: 5, kg: 2.5 }, state }) {
    if (!tm) return { rows: [], amrapLast: false };

    let spec = TABLES[weekLabel];
    let isSeventh = false;
    if (!spec) {
        // Treat anything not matching the three main labels as 7th week (Deload/TM Test)
        spec = buildSeventhWeekSpec(state);
        isSeventh = true;
    }

    const isAnchor = weekLabel === '5/3/1';
    const isLeader = weekLabel === '3x5' || weekLabel === '3x3';

    const rows = spec.percents.map((pct, i) => {
        const reps = spec.reps[i];
        const weight = roundLoadLocal((pct / 100) * tm, units, roundingPref);
        // AMRAP policy: Anchor -> AMRAP only on 3rd set; 7th week -> only on final test set for tm_test
        let amrap = false;
        let outReps = reps;
        if (!isSeventh) {
            amrap = (isAnchor && i === 2);
            if (amrap && typeof reps === 'number') outReps = `${reps}+`;
        } else if (spec.amrapIndex === i) {
            amrap = true;
        }
        return { pct, reps: outReps, amrap, weight, percent_of: 'tm' };
    });

    return { rows, amrapLast: rows.length ? !!rows[rows.length - 1].amrap : false };
}
