// 3-day 5/3/1 rotation per Wendler: roll 4 lifts across 3 weekly sessions.
// Weeks 1–3: loading (3x5, 3x3, 5/3/1). Week 4: loading completes for all lifts that haven't hit wk3 yet.
// Week 5: deload for all four lifts, grouped to fit 3 sessions.
const LIFTS = ["press", "deadlift", "bench", "squat"]; 
const WEEK_LABELS = ["3x5", "3x3", "5/3/1"];

export function buildSchedule({ mode = "4day", liftOrder = LIFTS } = {}) {
    if (mode === "4day") {
        // Simple 4 weeks x 4 days
        const weeks = [0, 1, 2, 3].map((wIdx) => ({
            label: wIdx === 3 ? "Deload" : WEEK_LABELS[wIdx],
            days: liftOrder.map((lift) => ({ lift, weekLabel: wIdx === 3 ? "Deload" : WEEK_LABELS[wIdx] }))
        }));
        return { mode, weeks };
    }

    if (mode !== "3day") {
        // TODO: implement 2day/1day later
        return { mode, weeks: [] };
    }

    // 3-day canonical 5-week rotation:
    // W1:  P(w1), D(w1), B(w1)
    // W2:  S(w1), P(w2), D(w2)
    // W3:  B(w2), S(w2), P(w3)
    // W4:  D(w3), B(w3), S(w3)
    // W5:  Deload grouped to 3 sessions: (P + D), (B), (S)
    const [P, D, B, S] = liftOrder;

    const weeks = [
        {
            label: "Week 1", days: [
                { lift: P, weekLabel: "3x5" },
                { lift: D, weekLabel: "3x5" },
                { lift: B, weekLabel: "3x5" },
            ]
        },
        {
            label: "Week 2", days: [
                { lift: S, weekLabel: "3x5" },
                { lift: P, weekLabel: "3x3" },
                { lift: D, weekLabel: "3x3" },
            ]
        },
        {
            label: "Week 3", days: [
                { lift: B, weekLabel: "3x3" },
                { lift: S, weekLabel: "3x3" },
                { lift: P, weekLabel: "5/3/1" },
            ]
        },
        {
            label: "Week 4", days: [
                { lift: D, weekLabel: "5/3/1" },
                { lift: B, weekLabel: "5/3/1" },
                { lift: S, weekLabel: "5/3/1" },
            ]
        },
        // Deload week (3 sessions). First session carries two deload lifts to fit 4 lifts into 3 days.
        {
            label: "Deload", days: [
                { lift: P, weekLabel: "Deload", combineWith: D },
                { lift: B, weekLabel: "Deload" },
                { lift: S, weekLabel: "Deload" },
            ]
        },
    ];
    return { mode, weeks };
}

// 4-day parity support (preview builder consumed by UI via schedulePreview)
export const SPLIT_4DAY_A = ["press","deadlift","bench","squat"]; // default
export const SPLIT_4DAY_B = ["bench","squat","press","deadlift"]; // alternative

// Generic day factory leveraging unified compute helpers (imported lazily where used)
export function makeDay({ lift, weekLabel, state, pack, roundingPref, units }) {
    const tmPct = state?.tmPct || 0.9;
    const tmRaw = state?.lifts?.[lift]?.tm || 0; // state already stores TM directly
    const tm = Number(tmRaw);
    const { computeWarmups, computeMainSets, computeSupplemental, computeAssistance } = require('./calc.js');
    return {
        lift,
        warmups: computeWarmups(lift, tm, weekLabel, roundingPref, units, pack),
        main: computeMainSets(lift, tm, weekLabel, { amrap: weekLabel === '5/3/1' }, roundingPref, units, pack),
        supplemental: computeSupplemental(pack, lift, tm, state),
        assistance: computeAssistance(pack, lift, state)
    };
}

export function buildSchedule4Day({ state, pack, split = SPLIT_4DAY_A, weekLabel = '3x5' }) {
    const units = state?.units || 'lbs';
    const roundingPref = state?.roundingPref || { lbs: 5, kg: 2.5 };
    const days = split.map(lift => makeDay({ lift, weekLabel, state, pack, roundingPref, units }));
    return { mode: '4day_live', daysPerWeek: 4, days, meta: { split, weekLabel } }; // simple shape consumed by renderer adaptor
}
