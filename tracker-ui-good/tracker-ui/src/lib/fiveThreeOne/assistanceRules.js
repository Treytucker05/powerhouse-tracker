// src/lib/fiveThreeOne/assistanceRules.js
export const TEMPLATE_IDS = {
    BBB: 'bbb',
    TRIUMVIRATE: 'triumvirate',
    PERIODIZATION_BIBLE: 'periodizationBible',
    BODYWEIGHT: 'bodyweight',
    JACK_SHIT: 'jackShit',
};

export const DEFAULT_ASSISTANCE_LIB = {
    shared: {
        push: ['Dips', 'Push-Ups', 'DB Bench Press', 'Close-Grip Bench'],
        pull: ['Chin-Ups', 'Pull-Ups', 'DB Row', 'Kroc Row', 'Face Pull'],
        squat: ['Front Squat', 'Leg Press', 'Step-Ups', 'Lunges'],
        hinge: ['Good Morning', 'Romanian Deadlift', 'Back Extension', 'Rack Pull'],
        core: ['Hanging Leg Raise', 'Ab Wheel', 'Weighted Plank', 'Cable Crunch'],
    },
    mapByMainLift: {
        squat: {
            supplementalSame: 'Back Squat',
            opposite: 'Deadlift',
            accessories: ['Leg Curl', 'Leg Press', 'Hanging Leg Raise', 'Good Morning'],
        },
        deadlift: {
            supplementalSame: 'Deadlift',
            opposite: 'Back Squat',
            accessories: ['Glute-Ham Raise', 'Romanian Deadlift', 'Hanging Leg Raise', 'Back Extension'],
        },
        bench: {
            supplementalSame: 'Bench Press',
            opposite: 'Overhead Press',
            accessories: ['Dips', 'DB Row', 'Face Pull', 'Push-Ups'],
        },
        press: {
            supplementalSame: 'Overhead Press',
            opposite: 'Bench Press',
            accessories: ['Dips', 'Chin-Ups', 'DB Shoulder Press', 'Face Pull'],
        },
    },
};

// Utility
function cap(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

export function defaultScheduleFromState(state) {
    // Fallback if schedule not yet configured
    const order = (state?.schedule?.days?.length ? state.schedule.days
        : [{ id: 'D1', lift: 'press' }, { id: 'D2', lift: 'deadlift' }, { id: 'D3', lift: 'bench' }, { id: 'D4', lift: 'squat' }]
    ).map((d, i) => ({ id: d.id || `D${i + 1}`, lift: d.lift }));
    return order;
}

/**
 * Build recommended assistance block(s) for a given day.
 * Returns a shape that the UI can render and the preview can consume.
 */
export function buildAssistanceForDay(templateId, mainLift, opts = {}) {
    const lib = DEFAULT_ASSISTANCE_LIB.mapByMainLift[mainLift] || {};
    const shared = DEFAULT_ASSISTANCE_LIB.shared;

    const bbbPair = opts?.bbbPair || 'same'; // 'same' or 'opposite'
    const bbbPct = cap(Number(opts?.bbbPercent || 60), 40, 75); // percent of TM
    const bwTarget = cap(Number(opts?.bwTarget || 75), 50, 200);

    if (templateId === TEMPLATE_IDS.JACK_SHIT) {
        return { kind: 'jack', blocks: [] };
    }

    if (templateId === TEMPLATE_IDS.BBB) {
        const liftName = bbbPair === 'opposite' ? lib.opposite : lib.supplementalSame;
        const block = { type: 'BBB', items: [{ name: liftName, sets: 5, reps: 10, percentTM: bbbPct }] };
        // Keep accessories lean per Wendler spirit
        const accessories = (lib.accessories || []).slice(0, 2).map(name => ({ name, sets: 3, reps: 12 }));
        return { kind: 'bbb', blocks: [block], accessories };
    }

    if (templateId === TEMPLATE_IDS.TRIUMVIRATE) {
        // Exactly 3 exercises: main 5/3/1 is assumed; provide two recs by main lift
        const recsByLift = {
            press: [
                { name: 'Dips', sets: 5, reps: '15' },
                { name: 'Chin-Ups', sets: 5, reps: '10' },
            ],
            deadlift: [
                { name: 'Good Morning', sets: 5, reps: '10-12' },
                { name: 'Hanging Leg Raise', sets: 5, reps: '12-15' },
            ],
            bench: [
                { name: 'DB Row', sets: 5, reps: '10-12' },
                { name: 'Dips', sets: 5, reps: '12-15' },
            ],
            squat: [
                { name: 'Leg Press', sets: 5, reps: '12-15' },
                { name: 'Leg Curl', sets: 5, reps: '10-12' },
            ],
        };
        return { kind: 'triumvirate', blocks: [{ type: 'Triumvirate', items: recsByLift[mainLift] || [] }] };
    }

    if (templateId === TEMPLATE_IDS.PERIODIZATION_BIBLE) {
        // 3 categories per session, higher volume, moderate intensity
        if (mainLift === 'bench' || mainLift === 'press') {
            return {
                kind: 'pb',
                blocks: [
                    { category: 'Shoulders/Chest', items: [{ name: 'DB Press', sets: 5, reps: '10-15' }, { name: 'Dips', sets: 3, reps: '10-15' }] },
                    { category: 'Lats/Upper Back', items: [{ name: 'Row (any)', sets: 5, reps: '10-15' }, { name: 'Chin-Ups', sets: 3, reps: '8-12' }] },
                    { category: 'Triceps', items: [{ name: 'Pushdown/Extension', sets: 5, reps: '10-15' }] },
                ],
            };
        } else {
            const lowerDay = (mainLift === 'deadlift') ? 'DL' : 'SQ';
            return {
                kind: 'pb',
                blocks: lowerDay === 'DL'
                    ? [
                        { category: 'Hamstrings', items: [{ name: 'Romanian Deadlift', sets: 5, reps: '8-12' }] },
                        { category: 'Quads', items: [{ name: 'Leg Press', sets: 3, reps: '10-15' }] },
                        { category: 'Abs', items: [{ name: 'Hanging Leg Raise', sets: 3, reps: '10-15' }] },
                    ]
                    : [
                        { category: 'Low Back', items: [{ name: 'Back Extension', sets: 5, reps: '10-15' }] },
                        { category: 'Quads', items: [{ name: 'Leg Press', sets: 3, reps: '10-15' }] },
                        { category: 'Abs', items: [{ name: 'Cable Crunch', sets: 3, reps: '12-20' }] },
                    ],
            };
        }
    }

    if (templateId === TEMPLATE_IDS.BODYWEIGHT) {
        const upper = (mainLift === 'bench' || mainLift === 'press');
        const bwList = upper
            ? [{ name: 'Chin-Ups', targetReps: bwTarget }, { name: 'Dips', targetReps: bwTarget }, { name: 'Push-Ups', targetReps: bwTarget }]
            : [{ name: 'Chin-Ups', targetReps: bwTarget }, { name: 'Single-Leg Squat/Lunge', targetReps: bwTarget }, { name: 'Sit-Ups/Ab Wheel', targetReps: bwTarget }];
        return { kind: 'bodyweight', blocks: [{ type: 'Bodyweight', items: bwList }] };
    }

    // Fallback
    return { kind: 'custom', blocks: [] };
}

/**
 * Build a whole-week assistance plan from template config + schedule.
 * Returns { byDay: { [dayId]: { mainLift, plan } } }
 */
export function buildWeekAssistancePlan(state) {
    const templateId = state?.template;
    const cfg = state?.templateConfig || {};
    const days = defaultScheduleFromState(state);

    const byDay = {};
    for (const d of days) {
        const plan = buildAssistanceForDay(templateId, d.lift, cfg);
        byDay[d.id] = { mainLift: d.lift, plan };
    }
    return { byDay };
}
