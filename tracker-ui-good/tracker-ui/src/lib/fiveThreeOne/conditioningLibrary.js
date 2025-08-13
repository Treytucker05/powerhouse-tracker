// src/lib/fiveThreeOne/conditioningLibrary.js

// Wendler-aligned defaults/guidelines
export const CONDITIONING_GUIDELINES = {
    minSessionsPerWeek: 2,
    placeAfterLifting: true, // not before
    notes: [
        'Condition after lifting, not before.',
        'Hill sprints and prowler work are preferred.',
        'Keep it simple; progress volume a little over time.',
        'Ensure one full rest day each week.'
    ]
};

export const CONDITIONING_PLACEMENT = {
    AFTER_LIFTS: 'after_lifts',
    OFF_DAYS: 'off_days',
    MIXED: 'mixed'
};

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MODALITIES = {
    // HIIT / sprints / pushes
    prowler_push: {
        label: 'Prowler Pushes',
        mode: 'hiit',
        default: { trips: 10, distance_m: 20, rest_sec: 60 }
    },
    hill_sprint: {
        label: 'Hill Sprints',
        mode: 'hiit',
        default: { sprints: 10, walk_down: true }
    },
    sled_drag: {
        label: 'Sled Drags',
        mode: 'hiit',
        default: { trips: 10, distance_m: 20, rest_sec: 60 }
    },
    bike_interval: {
        label: 'Bike Intervals',
        mode: 'hiit',
        default: { work_sec: 30, rest_sec: 90, rounds: 10 }
    },
    row_interval: {
        label: 'Rower Intervals',
        mode: 'hiit',
        default: { work_sec: 30, rest_sec: 90, rounds: 10 }
    },

    // LISS / easy
    walk: {
        label: 'Walking',
        mode: 'liss',
        default: { minutes: 30 }
    },
    easy_bike: {
        label: 'Easy Bike',
        mode: 'liss',
        default: { minutes: 30 }
    },
    easy_row: {
        label: 'Easy Row',
        mode: 'liss',
        default: { minutes: 25 }
    },
    swim: {
        label: 'Swimming (Easy)',
        mode: 'liss',
        default: { minutes: 20 }
    }
};

// Reasonable defaults if user doesn’t touch anything
export const DEFAULT_CONDITIONING_OPTIONS = {
    frequency: 2,            // total sessions per week
    hiitPerWeek: 2,          // HIIT count (<= frequency)
    lissPerWeek: 0,          // remainder often LISS
    placement: CONDITIONING_PLACEMENT.AFTER_LIFTS,
    hiitModalities: ['prowler_push', 'hill_sprint'],
    lissModalities: ['walk', 'easy_bike'],

    // Session recipes (editable in UI)
    sessionDefaults: {
        hiit: { work_sec: 30, rest_sec: 90, rounds: 10 },
        hills: { sprints: 10, walk_down: true },
        prowler: { trips: 10, distance_m: 20, rest_sec: 60 },
        liss: { minutes: 30 }
    },

    // Recovery toggles (soft targets)
    recovery: {
        mobility_min_per_day: 10,
        foam_roll: true,
        soft_tissue_areas: ['quads', 'hams', 'glutes', 't-spine']
    }
};
