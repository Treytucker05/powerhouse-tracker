// src/lib/fiveThreeOne/compute531.js
// Pure functions to build a 4-week 5/3/1 plan from wizard state
// NOTE: Rounding utilities consolidated in lib/math/rounding.ts

import { roundToIncrement, roundUpToIncrement } from '../math/rounding.ts';
import { getTmPct } from '../tm.ts';
import { UNITS, incrementFor } from '../units.ts';

// Internal array form used by buildProgram/mainSetsFor
const LOADING_OPTIONS_ARRAY = {
    1: [
        { week: 1, sets: [{ pct: 65, reps: 5 }, { pct: 75, reps: 5 }, { pct: 85, reps: 5, amrap: true }] },
        { week: 2, sets: [{ pct: 70, reps: 3 }, { pct: 80, reps: 3 }, { pct: 90, reps: 3, amrap: true }] },
        { week: 3, sets: [{ pct: 75, reps: 5 }, { pct: 85, reps: 3 }, { pct: 95, reps: 1, amrap: true }] },
        { week: 4, sets: [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 5 }] }, // deload
    ],
    2: [
        { week: 1, sets: [{ pct: 75, reps: 5 }, { pct: 80, reps: 5 }, { pct: 85, reps: 5, amrap: true }] },
        { week: 2, sets: [{ pct: 80, reps: 3 }, { pct: 85, reps: 3 }, { pct: 90, reps: 3, amrap: true }] },
        { week: 3, sets: [{ pct: 85, reps: 5 }, { pct: 90, reps: 3 }, { pct: 95, reps: 1, amrap: true }] },
        { week: 4, sets: [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 5 }] },
    ],
};

// Public percent table (per Prompt 7) used by Step 4 UI
export const LOADING_OPTIONS = {
    1: {
        1: [65, 75, 85],
        2: [70, 80, 90],
        3: [75, 85, 95],
        4: [40, 50, 60]
    },
    2: {
        1: [75, 80, 85],
        2: [80, 85, 90],
        3: [85, 90, 95],
        4: [40, 50, 60]
    }
};

export const WARMUP_SCHEME = { jumps: [40, 50, 60], reps: [5, 5, 3] }; // Wendler: 40/50/60 x 5/5/3

// Percent tables for main set schemes (Option 1 & 2)
export const PERCENT_SCHEMES = {
    1: {
        1: [{ pct: 65, reps: '5' }, { pct: 75, reps: '5' }, { pct: 85, reps: '5+' }],
        2: [{ pct: 70, reps: '3' }, { pct: 80, reps: '3' }, { pct: 90, reps: '3+' }],
        3: [{ pct: 75, reps: '5' }, { pct: 85, reps: '3' }, { pct: 95, reps: '1+' }],
        4: [{ pct: 40, reps: '5' }, { pct: 50, reps: '5' }, { pct: 60, reps: '5' }],
    },
    2: {
        1: [{ pct: 75, reps: '5' }, { pct: 80, reps: '5' }, { pct: 85, reps: '5+' }],
        2: [{ pct: 80, reps: '3' }, { pct: 85, reps: '3' }, { pct: 90, reps: '3+' }],
        3: [{ pct: 85, reps: '5' }, { pct: 90, reps: '3' }, { pct: 95, reps: '1+' }],
        4: [{ pct: 40, reps: '5' }, { pct: 50, reps: '5' }, { pct: 60, reps: '5' }],
    },
};

export function getMainSetScheme(option = 1, week = 1) {
    const opt = Number(option) === 2 ? 2 : 1;
    const w = Math.max(1, Math.min(4, Number(week) || 1));
    return PERCENT_SCHEMES[opt][w];
}

// Legacy local implementation removed; imported version supports (value, inc, mode?)

function pctOfTM(tm, pct) {
    return tm * (pct / 100);
}

// getTmPct now sourced from central tm.ts (returns decimal 0.xx)

export function effectiveTM(lift, state) {
    const l = state?.lifts?.[lift] || {};
    const tmPct = (typeof l.tmPct === 'number' && l.tmPct > 0 && l.tmPct <= 1)
        ? l.tmPct
        : getTmPct(state);
    const base = l.tm ?? (l.oneRM ? l.oneRM * tmPct : null); // tmPct already decimal
    if (!base) return null;
    const inc = state?.rounding?.increment ?? (state?.units === UNITS.KG ? 2.5 : 5);
    const mode = state?.rounding?.mode ?? 'nearest';
    return roundToIncrement(base, inc, mode);
}

function warmupsFor(tm, state) {
    const inc = state?.rounding?.increment ?? (state?.units === UNITS.KG ? 2.5 : 5);
    const mode = state?.rounding?.mode ?? 'nearest';
    return WARMUP_SCHEME.jumps.map((p, i) => ({
        pct: p,
        reps: WARMUP_SCHEME.reps[i],
        weight: roundToIncrement(pctOfTM(tm, p), inc, mode),
    }));
}

function mainSetsFor(tm, loadingOption, targetWeek, state) {
    const table = LOADING_OPTIONS_ARRAY[loadingOption] || LOADING_OPTIONS_ARRAY[1];
    const entry = table.find((w) => w.week === targetWeek);
    if (!entry) return [];
    const inc = state?.rounding?.increment ?? (state?.units === UNITS.KG ? 2.5 : 5);
    const mode = state?.rounding?.mode ?? 'nearest';

    // Check for 5s PRO programming approach
    const is5sPro = state?.programmingApproach === 'basic' && state?.supplemental?.type === '5spro';
    const isLeaderPhase = state?.programmingApproach === 'leaderAnchor' && state?.cyclePhase === 'leader';

    return entry.sets.map((s) => ({
        pct: s.pct,
        reps: is5sPro ? 5 : s.reps, // 5s PRO: all sets are 5 reps
        amrap: !is5sPro && !isLeaderPhase && !!s.amrap && targetWeek !== 4, // no AMRAP for 5s PRO, leader phases, or deload
        weight: roundToIncrement(pctOfTM(tm, s.pct), inc, mode),
    }));
}

// Simple set calculation using schemes; used by previews/utilities
export function calcMainSets(tm, optionOrOpts = 1, week = 1, rounding = { increment: 5, mode: 'nearest' }, programmingOptions = {}) {
    if (!Number.isFinite(tm)) return [];

    // Support legacy signature: calcMainSets(tm, { week, option, increment, mode, programmingApproach, supplementalType })
    if (optionOrOpts && typeof optionOrOpts === 'object') {
        const {
            week: w = 1,
            option: opt = 1,
            increment = 5,
            mode = 'nearest',
            programmingApproach = 'basic',
            supplementalType = null,
            cyclePhase = null
        } = optionOrOpts;

        const is5sPro = programmingApproach === 'basic' && supplementalType === '5spro';
        const isLeaderPhase = programmingApproach === 'leaderAnchor' && cyclePhase === 'leader';

        return getMainSetScheme(opt, w).map(s => ({
            pct: s.pct,
            reps: is5sPro ? 5 : (typeof s.reps === 'string' ? Number(s.reps.replace('+', '')) || Number(s.reps) || 0 : s.reps),
            amrap: !is5sPro && !isLeaderPhase && typeof s.reps === 'string' ? s.reps.includes('+') && w !== 4 : false,
            weight: roundToIncrement(tm * (s.pct / 100), increment, mode),
        }));
    }

    const opt = Number(optionOrOpts) || 1;
    const inc = rounding?.increment ?? 5;
    const mode = rounding?.mode ?? 'nearest';
    const { programmingApproach = 'basic', supplementalType = null, cyclePhase = null } = programmingOptions;

    const is5sPro = programmingApproach === 'basic' && supplementalType === '5spro';
    const isLeaderPhase = programmingApproach === 'leaderAnchor' && cyclePhase === 'leader';

    return getMainSetScheme(opt, week).map(s => ({
        pct: s.pct,
        reps: is5sPro ? 5 : (typeof s.reps === 'string' ? Number(s.reps.replace('+', '')) || Number(s.reps) || 0 : s.reps),
        amrap: !is5sPro && !isLeaderPhase && typeof s.reps === 'string' ? s.reps.includes('+') && week !== 4 : false,
        weight: roundToIncrement(tm * (s.pct / 100), inc, mode),
    }));
}

function supplementalFor(lift, week, state) {
    const template = state?.template?.id || null;
    const inc = state?.rounding?.increment ?? (state?.units === UNITS.KG ? 2.5 : 5);
    const mode = state?.rounding?.mode ?? 'nearest';
    const tm = effectiveTM(lift, state);
    if (!template || !tm) return null;

    if (template === 'bbb') {
        const pct = state?.template?.bbb?.pct ?? 50; // 50/60/70 supported
        const variant = state?.template?.bbb?.variant ?? 'same'; // 'same' | 'opposite'
        const targetLift = variant === 'opposite'
            ? (lift === 'squat' ? 'deadlift' : lift === 'deadlift' ? 'squat' : lift === 'bench' ? 'press' : 'bench')
            : lift;

        const tmForSupplement = effectiveTM(targetLift, state) ?? tm;
        const w = roundToIncrement(pctOfTM(tmForSupplement, pct), inc, mode);
        const vol = { sets: 5, reps: 10 };
        const note = `BBB ${pct}% TM (${variant === 'same' ? 'same lift' : 'opposite lift: ' + targetLift})`;
        return { type: 'bbb', targetLift, weight: w, volume: vol, note };
    }

    if (template === 'triumvirate') {
        // Two assistance picks per day (already chosen or defaults)
        const picks = state?.assistance?.selections?.[lift] || defaultTriumvirate(lift);
        return { type: 'triumvirate', picks };
    }

    if (template === 'periodizationBible') {
        const picks = defaultPeriodizationBible(lift);
        return { type: 'periodizationBible', picks };
    }

    if (template === 'bodyweight') {
        const picks = defaultBodyweight(lift);
        return { type: 'bodyweight', picks };
    }

    if (template === 'jackShit') {
        return { type: 'jackShit' };
    }

    return null;
}

function defaultTriumvirate(lift) {
    // Book-accurate Triumvirate assistance per p. 48
    if (lift === 'press') return [{ ex: 'Dips', scheme: '5×15' }, { ex: 'Chin-ups', scheme: '5×10' }];
    if (lift === 'bench') return [{ ex: 'DB Bench Press', scheme: '5×15' }, { ex: 'DB Rows', scheme: '5×10' }]; // Fixed: p. 48
    if (lift === 'deadlift') return [{ ex: 'Good Mornings', scheme: '5×12' }, { ex: 'Hanging Leg Raises', scheme: '5×15' }];
    if (lift === 'squat') return [{ ex: 'Leg Press', scheme: '5×15' }, { ex: 'Leg Curls', scheme: '5×10' }]; // Fixed: p. 48
    return [];
}

function defaultPeriodizationBible(lift) {
    // Simple balanced buckets; adjust later per UI selections
    if (lift === 'press' || lift === 'bench') {
        return [
            { bucket: 'Shoulders/Chest', ex: 'DB Press', scheme: '5x12-15' },
            { bucket: 'Lats/Upper Back', ex: 'Rows/Chins', scheme: '5x10-15' },
            { bucket: 'Triceps', ex: 'Extensions', scheme: '5x12-20' },
        ];
    }
    // Lower days
    return [
        { bucket: 'Posterior', ex: 'RDL/GHR', scheme: '5x10-15' },
        { bucket: 'Quads', ex: 'Leg Press/Lunges', scheme: '5x12-20' },
        { bucket: 'Abs', ex: 'Hanging Leg Raises', scheme: '5x12-20' },
    ];
}

function defaultBodyweight(lift) {
    return [
        { ex: 'Chin-ups', targetReps: 75 },
        { ex: 'Dips or Push-ups', targetReps: 75 },
        { ex: 'Hanging Leg Raises', targetReps: 75 },
    ];
}

function scheduleWeeks(state) {
    const freq = state?.schedule?.frequency || '4day';
    const order = state?.schedule?.order?.length ? state.schedule.order : ['press', 'deadlift', 'bench', 'squat'];

    if (freq === '4day') {
        // Week template repeats same order each week
        return [order, order, order, order];
    }

    if (freq === '3day') {
        // 6-week rolling is canonical; here we preview first 4 weeks rotation
        // W1: P-DL-B, W2: SQ-P-DL, W3: B-SQ-P, W4: DL-B-SQ
        return [
            ['press', 'deadlift', 'bench'],
            ['squat', 'press', 'deadlift'],
            ['bench', 'squat', 'press'],
            ['deadlift', 'bench', 'squat'],
        ];
    }

    if (freq === '2day') {
        // Default pairings
        return [
            ['squat', 'bench'],
            ['deadlift', 'press'],
            ['squat', 'bench'],
            ['deadlift', 'press'],
        ];
    }

    // 1-day: alternate pairs weekly; preview 4 weeks
    return [
        ['squat', 'bench'],
        ['deadlift', 'press'],
        ['squat', 'bench'],
        ['deadlift', 'press'],
    ];
}

export function buildProgram(state) {
    const units = state?.units || UNITS.LBS;
    const loadingOption = state?.loading?.option || 1;
    const includeDeload = state?.loading?.includeDeload !== false; // default true
    const weeksOrder = scheduleWeeks(state);

    const lifts = ['press', 'deadlift', 'bench', 'squat'];
    const tmTable = Object.fromEntries(
        lifts.map((lift) => [lift, effectiveTM(lift, state)])
    );

    const weeks = weeksOrder.map((days, wi) => {
        const weekNum = wi + 1;
        const isDeload = weekNum === 4 && includeDeload;
        const dayPlans = days.map((lift) => {
            const tm = tmTable[lift];
            const warmups = tm ? warmupsFor(tm, state) : [];
            const mains = tm ? mainSetsFor(tm, loadingOption, weekNum, state) : [];
            const supplemental = supplementalFor(lift, weekNum, state);
            return { lift, tm, warmups, mains, supplemental };
        });
        return { week: weekNum, deload: isDeload, days: dayPlans };
    });

    return {
        units,
        meta: {
            template: state?.template?.id || null,
            frequency: state?.schedule?.frequency || '4day',
            order: state?.schedule?.order || ['press', 'deadlift', 'bench', 'squat'],
            rounding: state?.rounding || { increment: units === UNITS.KG ? 2.5 : 5, mode: 'nearest' },
            increments: state?.progression || { upper: 5, lower: 10, roundingMode: 'ceiling' },
        },
        tms: tmTable,
        weeks,
    };
}

// Utility for e1RM if you log AMRAPs later
export function estimate1RM(weight, reps) {
    return weight * reps * 0.0333 + weight;
}

// Alias for Prompt 7 naming
export function calcE1RM(weight, reps) {
    if (!Number.isFinite(weight) || !Number.isFinite(reps) || reps <= 0) return 0;
    return weight * reps * 0.0333 + weight;
}

// Classify lift for increment rules
export function classifyLift(lift) {
    if (lift === 'bench' || lift === 'press') return 'upper';
    return 'lower';
}
