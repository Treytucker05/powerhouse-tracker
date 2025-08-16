// src/lib/fiveThreeOne/assistanceLibrary.js

// Template IDs used across UI/state
export const TEMPLATE_IDS = {
    BBB: 'bbb',
    TRIUMVIRATE: 'triumvirate',
    PERIODIZATION_BIBLE: 'periodization_bible',
    BODYWEIGHT: 'bodyweight',
    JACK_SHIT: 'jack_shit'
};

// Canonical per-lift order used across the builder
export const DAY_ORDER = ['press', 'deadlift', 'bench', 'squat'];

// Opposite lift mapping for BBB pairing
export const OPPOSITES = {
    squat: 'deadlift',
    deadlift: 'squat',
    bench: 'press',
    press: 'bench',
    press: 'bench'
};

// Lightweight catalogue of assistance exercises by bucket
export const ASSISTANCE_CATALOG = {
    // Upper push
    dips: { name: 'Dips', bucket: 'upper_push' },
    pushups: { name: 'Push-Ups', bucket: 'upper_push' },
    db_press: { name: 'DB Bench Press', bucket: 'upper_push' },
    cgbp: { name: 'Close-Grip Bench', bucket: 'upper_push' },

    // Upper pull
    chins: { name: 'Chin-Ups', bucket: 'upper_pull' },
    rows: { name: 'DB Rows', bucket: 'upper_pull' },
    facepulls: { name: 'Face Pulls', bucket: 'upper_pull' },

    // Hinge/posterior
    ghr: { name: 'Glute-Ham Raise', bucket: 'posterior' },
    rdl: { name: 'Romanian Deadlift', bucket: 'posterior' },
    goodmornings: { name: 'Good Mornings', bucket: 'posterior' },
    rackpulls: { name: 'Rack Pulls', bucket: 'posterior' },

    // Squat/quad
    legpress: { name: 'Leg Press', bucket: 'quad' },
    lunges: { name: 'Lunges', bucket: 'quad' },
    stepups: { name: 'Step-Ups', bucket: 'quad' },
    legcurl: { name: 'Leg Curls', bucket: 'hamstring' },

    // Core
    hlr: { name: 'Hanging Leg Raises', bucket: 'core' },
    abwheel: { name: 'Ab Wheel', bucket: 'core' },
    situps: { name: 'Sit-Ups', bucket: 'core' }
};

// Triumvirate (book-accurate assistance per p. 48)
export const TRIUMVIRATE_DEFAULTS = {
    press: [
        { ref: 'dips', sets: 5, reps: 15 },
        { ref: 'chins', sets: 5, reps: 10 }
    ],
    bench: [
        { ref: 'db_press', sets: 5, reps: 15 }, // Fixed: DB Bench Press per p. 48
        { ref: 'rows', sets: 5, reps: 10 }      // Fixed: DB Rows per p. 48
    ],
    deadlift: [
        { ref: 'goodmornings', sets: 5, reps: 10 },
        { ref: 'hlr', sets: 5, reps: 15 }
    ],
    squat: [
        { ref: 'legpress', sets: 5, reps: 15 }, // Fixed: Leg Press per p. 48
        { ref: 'legcurl', sets: 5, reps: 10 }   // Fixed: Leg Curls per p. 48
    ]
};

// Periodization Bible category targets
export const PB_CATEGORIES = {
    upper: [
        { key: 'shoulders_chest', label: 'Shoulders/Chest' },
        { key: 'lats_upperback', label: 'Lats/Upper Back' },
        { key: 'triceps', label: 'Triceps' }
    ],
    lower_deadlift: [
        { key: 'hamstrings', label: 'Hamstrings' },
        { key: 'quads', label: 'Quads' },
        { key: 'abs', label: 'Abs' }
    ],
    lower_squat: [
        { key: 'low_back', label: 'Low Back' },
        { key: 'quads', label: 'Quads' },
        { key: 'abs', label: 'Abs' }
    ]
};

// Bodyweight pool
export const BODYWEIGHT_POOL = {
    press: ['chins', 'dips', 'pushups', 'hlr'],
    deadlift: ['chins', 'hlr', 'pushups'],
    bench: ['chins', 'dips', 'pushups', 'hlr'],
    squat: ['pushups', 'hlr', 'situps']
};
