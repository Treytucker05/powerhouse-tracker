// Supplemental engine: FSL, SSL, BBB, BBS

function roundToIncrement(value, step = 5) {
    const s = Number(step) || 5;
    return Math.round(Number(value) / s) * s;
}

export function mapWeekLabelToIndex(weekLabel) {
    const lbl = String(weekLabel || '').toLowerCase();
    if (lbl.includes('3x5')) return 1;
    if (lbl.includes('3x3')) return 2;
    if (lbl.includes('5/3/1') || lbl.includes('531') || lbl.includes('5/3/1')) return 3;
    return 0; // unknown/deload
}

export function getFirstSetPct(weekIndex) {
    // Week1 65, Week2 70, Week3 75
    if (weekIndex === 1) return 65;
    if (weekIndex === 2) return 70;
    if (weekIndex === 3) return 75;
    return null;
}

export function getSecondSetPct(weekIndex) {
    // Week1 75, Week2 80, Week3 85
    if (weekIndex === 1) return 75;
    if (weekIndex === 2) return 80;
    if (weekIndex === 3) return 85;
    return null;
}

export function buildSupplemental({ schemeId, weekLabel, tm, roundingIncrement = 5, bbbVariant }) {
    const weekIndex = mapWeekLabelToIndex(weekLabel);
    if (!tm || weekIndex === 0) return null; // skip deload/unknown
    const sid = String(schemeId || '').toLowerCase();
    const step = roundingIncrement || 5;

    if (sid === 'fsl') {
        const pct = getFirstSetPct(weekIndex);
        if (!pct) return null;
        const load = roundToIncrement((tm * pct) / 100, step);
        return { type: 'fsl', sets: 5, reps: 5, pct, load };
    }
    if (sid === 'ssl') {
        const pct = getSecondSetPct(weekIndex);
        if (!pct) return null;
        const load = roundToIncrement((tm * pct) / 100, step);
        return { type: 'ssl', sets: 5, reps: 5, pct, load };
    }
    if (sid === 'bbs') {
        const pct = getFirstSetPct(weekIndex);
        if (!pct) return null;
        const load = roundToIncrement((tm * pct) / 100, step);
        return { type: 'bbs', sets: 10, reps: 5, pct, load };
    }
    if (sid === 'bbb') {
        // Default BBB Standard 5x10 @ 50% unless variant provided
        let pct = 50;
        if (bbbVariant && typeof bbbVariant === 'object') {
            // Hook examples only (no-op if not provided):
            // { mode: '3-month', cycle: 1|2|3 } => 50/60/70
            // { mode: '6-week', week: 1..6 } => 50/50/60/60/70/70
            // { mode: 'variant1', weekIndex: 1..3 } => 65/70/75
            // { mode: 'variant2', weekIndex: 1..3 } => 65(5x10),70(5x8),75(5x5) (reps would need dynamic)
            const mode = String(bbbVariant.mode || '').toLowerCase();
            if (mode === 'variant1') {
                pct = [null, 65, 70, 75][weekIndex] || 65;
            } else if (mode === '3-month') {
                pct = [50, 60, 70][Math.max(0, (bbbVariant.cycle || 1) - 1)] || 50;
            } else if (mode === '6-week') {
                const wk = Number(bbbVariant.week || weekIndex);
                pct = wk <= 2 ? 50 : (wk <= 4 ? 60 : 70);
            }
        }
        const load = roundToIncrement((tm * pct) / 100, step);
        return { type: 'bbb', sets: 5, reps: 10, pct, load };
    }
    return null;
}
