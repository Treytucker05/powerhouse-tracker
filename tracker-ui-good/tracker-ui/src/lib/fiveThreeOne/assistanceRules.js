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
        return { kind: 'jack', blocks: [], displayText: 'Main lift only' };
    }

    if (templateId === TEMPLATE_IDS.BBB) {
        const liftName = bbbPair === 'opposite' ? lib.opposite : lib.supplementalSame;
        const exerciseNames = {
            'press': 'Overhead Press',
            'bench': 'Bench Press',
            'squat': 'Back Squat',
            'deadlift': 'Deadlift'
        };
        const bbbExerciseName = exerciseNames[mainLift] || mainLift;
        const displayName = `BBB ${bbbExerciseName} 5×10 @ ${bbbPct}%`;

        const block = {
            type: 'BBB',
            items: [{
                name: liftName,
                displayName: displayName,
                exercise: bbbExerciseName,
                sets: 5,
                reps: 10,
                percentTM: bbbPct
            }]
        };
        // Keep accessories lean per Wendler spirit
        const accessories = (lib.accessories || []).slice(0, 2).map(name => ({
            name,
            sets: 3,
            reps: 12,
            displayName: `${name} 3×12`
        }));
        return { kind: 'bbb', blocks: [block], accessories };
    }

    if (templateId === TEMPLATE_IDS.TRIUMVIRATE) {
        // Exactly 3 exercises: main 5/3/1 is assumed; provide two recs by main lift
        const recsByLift = {
            press: [
                { name: 'Dips', sets: 5, reps: '15', displayName: 'Dips 5×15' },
                { name: 'Chin-Ups', sets: 5, reps: '10', displayName: 'Chin-Ups 5×10' },
            ],
            deadlift: [
                { name: 'Good Morning', sets: 5, reps: '10-12', displayName: 'Good Morning 5×10-12' },
                { name: 'Hanging Leg Raise', sets: 5, reps: '12-15', displayName: 'Hanging Leg Raise 5×12-15' },
            ],
            bench: [
                { name: 'DB Row', sets: 5, reps: '10-12', displayName: 'DB Row 5×10-12' },
                { name: 'Dips', sets: 5, reps: '12-15', displayName: 'Dips 5×12-15' },
            ],
        squat: [
            { name: 'Leg Press', sets: 5, reps: '12-15', displayName: 'Leg Press 5×12-15' },
            { name: 'Leg Curl', sets: 5, reps: '10-12', displayName: 'Leg Curl 5×10-12' },
        ],
    };
    return { kind: 'triumvirate', blocks: [{ type: 'Triumvirate', items: recsByLift[mainLift] || [] }] };
}

if (templateId === TEMPLATE_IDS.PERIODIZATION_BIBLE) {
    // Dave Tate pattern: each day 3 assistance categories, each 5x10-20 (user chooses specific lifts later)
    const upperCats = [
        { category: 'Shoulders/Chest', displayName: 'Shoulders/Chest 5×10-20' },
        { category: 'Lats/Upper Back', displayName: 'Lats/Upper Back 5×10-20' },
        { category: 'Triceps', displayName: 'Triceps 5×10-20' }
    ];
    const lowerCats = [
        { category: 'Hamstrings', displayName: 'Hamstrings 5×10-20' },
        { category: 'Quads', displayName: 'Quads 5×10-20' },
        { category: 'Abs', displayName: 'Abs 5×10-20' }
    ];
    const chosen = (mainLift === 'press' || mainLift === 'bench') ? upperCats : lowerCats;
    return {
        kind: 'pb',
        blocks: chosen.map(cat => ({
            category: cat.category,
            items: [{
                name: cat.category + ' (choose exercise)',
                displayName: cat.displayName,
                sets: 5,
                reps: '10-20'
            }]
    }))
    };
}

if (templateId === TEMPLATE_IDS.BODYWEIGHT) {
    const upper = (mainLift === 'bench' || mainLift === 'press');
    const bwList = upper
        ? [
            { name: 'Chin-Ups', targetReps: bwTarget, displayName: `Chin-Ups (${bwTarget} total reps)` },
            { name: 'Dips', targetReps: bwTarget, displayName: `Dips (${bwTarget} total reps)` },
            { name: 'Push-Ups', targetReps: bwTarget, displayName: `Push-Ups (${bwTarget} total reps)` }
        ]
        : [
            { name: 'Chin-Ups', targetReps: bwTarget, displayName: `Chin-Ups (${bwTarget} total reps)` },
            { name: 'Single-Leg Squat/Lunge', targetReps: bwTarget, displayName: `Single-Leg Squat/Lunge (${bwTarget} total reps)` },
            { name: 'Sit-Ups/Ab Wheel', targetReps: bwTarget, displayName: `Sit-Ups/Ab Wheel (${bwTarget} total reps)` }
        ];
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
