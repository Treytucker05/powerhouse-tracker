/**
 * TODO: FiveThreeOneEngine.v2.js - Canonical 5/3/1 Engine V2
 * Pure utility functions for 5/3/1 calculations and cycle generation.
 * Legacy FiveThreeOneEngine.js remains for existing pages compatibility.
 */

// Rounds to increment (overloaded for backward compatibility)
// New signature expectation: roundToIncrement(value, increment = 5, mode = 'nearest')
// Legacy calls used: roundToIncrement(value, units('lb'|'kg'), mode)
export function roundToIncrement(value, increment = 5, mode = 'nearest') {
    if (!Number.isFinite(value)) return 0;
    let inc = 5;
    let roundingMode = mode || 'nearest';
    // Backward compat: if second arg is a string treat it as units
    if (typeof increment === 'string') {
        const units = increment;
        inc = units === 'kg' ? 2.5 : 5;
    } else if (typeof increment === 'number') {
        inc = increment > 0 ? increment : 5;
    }
    if (roundingMode === 'ceil') return Math.ceil(value / inc) * inc;
    if (roundingMode === 'floor') return Math.floor(value / inc) * inc;
    // default nearest
    return Math.round(value / inc) * inc;
}

// Returns [{pct, reps, amrap}, ...] for weekIndex 0..3
export function getWeekScheme(option = 1, weekIndex = 0) {
    // Object form (original) for legacy callers when weekIndex provided.
    const legacy = {
        1: [
            [{ pct: 65, reps: 5 }, { pct: 75, reps: 5 }, { pct: 85, reps: 5, amrap: true }],
            [{ pct: 70, reps: 3 }, { pct: 80, reps: 3 }, { pct: 90, reps: 3, amrap: true }],
            [{ pct: 75, reps: 5 }, { pct: 85, reps: 3 }, { pct: 95, reps: 1, amrap: true }],
            [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 5, amrap: false }]
        ],
        2: [
            [{ pct: 75, reps: 5 }, { pct: 80, reps: 5 }, { pct: 85, reps: 5, amrap: true }],
            [{ pct: 80, reps: 3 }, { pct: 85, reps: 3 }, { pct: 90, reps: 3, amrap: true }],
            [{ pct: 85, reps: 5 }, { pct: 90, reps: 3 }, { pct: 95, reps: 1, amrap: true }],
            [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 5, amrap: false }]
        ]
    };
    // Percent matrix form (new helpers expect this when only one arg is supplied)
    const percentMatrix = {
        1: [
            [65, 75, 85],
            [70, 80, 90],
            [75, 85, 95],
            [40, 50, 60]
        ],
        2: [
            [75, 80, 85],
            [80, 85, 90],
            [85, 90, 95],
            [40, 50, 60]
        ]
    };
    if (arguments.length === 1) {
        return percentMatrix[option] || percentMatrix[1];
    }
    return legacy[option]?.[weekIndex] || legacy[1][weekIndex] || [];
}

// Generate warmup sets from program.warmups (default 40/50/60 × 5/5/3)
export function getWarmupSets(program, liftTM) {
    const sets = program?.warmups?.sets || [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 3 }];
    return sets.map(s => ({
        ...s,
        weight: calcSetWeight(liftTM, s.pct, program.units, program.rounding)
    }));
}

// Calculate set weight with rounding
export function calcSetWeight(tm, pct, units = 'lb', rounding = 'ceil') {
    return roundToIncrement(Number(tm) * (pct / 100), units, rounding);
}

// Generate a complete training day
export function generateDay({ lift, weekIndex, program, dayId }) {
    const tm = program.lifts?.[lift]?.tm;
    const warmups = getWarmupSets(program, tm);

    // Main work sets (3 sets per day)
    const mainSets = getWeekScheme(program.loading.option, weekIndex)
        .map(s => ({
            ...s,
            weight: calcSetWeight(tm, s.pct, program.units, program.rounding)
        }));

    let supplemental = null;

    // BBB supplemental work if template is BBB
    if (program.template === 'bbb' && program.supplemental?.type === 'BBB') {
        const pairing = program.supplemental.pairing || 'same';
        let supplementalLift = lift;

        // Handle opposite pairing
        if (pairing === 'opposite') {
            const oppositeMap = {
                press: 'bench',
                bench: 'press',
                squat: 'deadlift',
                deadlift: 'squat'
            };
            supplementalLift = oppositeMap[lift] || lift;
        }

        const supplementalTM = program.lifts?.[supplementalLift]?.tm || tm;
        const supplementalPct = program.supplemental.pct || 50;

        supplemental = {
            lift: supplementalLift,
            sets: program.supplemental.sets || 5,
            reps: program.supplemental.reps || 10,
            pct: supplementalPct,
            weight: roundToIncrement(supplementalTM * (supplementalPct / 100), program.units, program.rounding)
        };
    }

    // Assistance work from program.assistance[dayId]
    const assistance = program.assistance?.[dayId] || [];

    return {
        lift,
        warmups,
        mainSets,
        tm,
        supplemental,
        assistance
    };
}

// Generate complete 4-week cycle
export function generateCycle(program) {
    const weekCount = program.loading.includeDeload ? 4 : 3;
    return {
        weeks: Array.from({ length: weekCount }, (_, w) => ({
            index: w + 1,
            days: program.schedule.days.map(day =>
                generateDay({
                    lift: day.lift,
                    weekIndex: w,
                    program,
                    dayId: day.id
                })
            )
        }))
    };
}

// --- New pure helpers (added per V2 Step 4 spec) ---
// EXACT specification implementation (idempotent; no side effects)
export function buildMainSetsForLift({ tm, weekIndex, option = 1, roundingIncrement = 5, roundingMode = "nearest", units = "lbs" }) {
    if (!tm || tm <= 0) return { week: weekIndex + 1, sets: [], amrapOnLast: false };
    const scheme = getWeekScheme(option);
    const week = weekIndex + 1;
    const isDeload = week === 4;
    const percents = scheme[weekIndex]; // e.g., [65,75,85] or [40,50,60]
    const amrapOnLast = !isDeload; // weeks 1–3 only

    const sets = percents.map((p, i) => {
        const raw = tm * (p / 100);
        const weight = roundToIncrement(raw, roundingIncrement, roundingMode);
        const baseReps = isDeload ? [5, 5, 5][i] : [5, 3, 1][i];
        const reps = (i === 2 && !isDeload) ? (baseReps + "+") : baseReps;
        return { percent: p, reps, weight, units };
    });

    return { week, sets, amrapOnLast };
}

export function buildWarmupSets({ includeWarmups, warmupScheme, tm, roundingIncrement = 5, roundingMode = "nearest", units = "lbs" }) {
    if (!includeWarmups || !tm || tm <= 0) return [];
    const perc = Array.isArray(warmupScheme?.percentages) ? warmupScheme.percentages : [40, 50, 60];
    const reps = Array.isArray(warmupScheme?.reps) ? warmupScheme.reps : [5, 5, 3];
    const len = Math.min(perc.length, reps.length);
    const out = [];
    for (let i = 0; i < len; i++) {
        const raw = tm * (perc[i] / 100);
        const weight = roundToIncrement(raw, roundingIncrement, roundingMode);
        out.push({ percent: perc[i], reps: reps[i], weight, units });
    }
    return out;
}
