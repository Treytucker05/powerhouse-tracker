// Assistance load rules (non-canonical guidance for computed targets)
// We use % of the most relevant TM where it makes sense. Bodyweight stays "BW".
export const ASSISTANCE_LOAD_RULES = {
    // Lower body
    GOOD_MORNINGS: { method: 'percentOfTM', sourceLift: 'squat', percent: 0.35 },
    RDL: { method: 'percentOfTM', sourceLift: 'deadlift', percent: 0.45 },
    LEG_CURLS: { method: 'na' },           // machine; not computed
    LEG_RAISES: { method: 'bodyweight' },

    // Upper body
    DIPS: { method: 'bodyweight' },
    CHIN_UPS: { method: 'bodyweight' },
    CLOSE_GRIP_BENCH: { method: 'percentOfTM', sourceLift: 'bench', percent: 0.60 },
    DB_ROWS: { method: 'na' }, // leave as guidance-only for now (variation heavy)
    PUSH_UPS: { method: 'bodyweight' }
};

export const DEFAULT_CONDITIONING = {
    sessionsPerWeek: 2,
    hiitPerWeek: 1,
    modalities: {
        hiit: ['Prowler Pushes', 'Hill Sprints'],
        liss: ['Walking', 'Cycling']
    },
    note: 'Do 2–3 short sessions per week after lifting or on off days.'
};
// 5/3/1 V2 Template Presets (Pure Descriptors)
// These objects are PURE and side-effect free. They describe intent; the engine
// or higher-level orchestration will interpret them when generating sessions.

export const TEMPLATE_KEYS = {
    BBB: 'bbb',
    TRIUMVIRATE: 'triumvirate',
    PERIODIZATION_BIBLE: 'periodization_bible',
    BODYWEIGHT: 'bodyweight',
    JACK_SHIT: 'jack_shit',
    CUSTOM: 'custom'
};

// Canonical 4‑day order used in many Wendler writeups
export function getDefaultSchedule() {
    return {
        frequency: '4day',
        days: ['press', 'deadlift', 'bench', 'squat'], // canonical order (press first)
        includeWarmups: true,
        warmupScheme: {
            percentages: [40, 50, 60],
            reps: [5, 5, 3]
        }
    };
}

/**
 * presetBBB
 * Book-accurate BBB template:
 *  - startPercent: 50-60% only (book range)
 *  - pairing: 'same' | 'opposite'
 *  - progressTo: optional progression target within book range
 *  - No 70% options (not in original book)
 *  - No 3-Month Challenge (removed as requested)
 */
export function presetBBB({ tmPct, units, options = {} }) {
    const pairing = options.pairing || 'same'; // opposite allowed
    const startPercent = options.startPercent || 50; // book-accurate start range: 50-60%
    const progressTo = options.progressTo || 60; // book-accurate progression target

    return {
        key: TEMPLATE_KEYS.BBB,
        loadingOption: 1,
        schedule: getDefaultSchedule(),
        supplemental: {
            strategy: 'bbb',
            pairing, // 'same' | 'opposite'
            percentOfTM: startPercent,
            sets: 5,
            reps: 10,
            progressTo // optional progression within book range
        },
        assistance: {
            mode: 'minimal',
            suggestions: {
                press: ['Chin-ups'], // Book-accurate from pages 46-47
                bench: ['Dumbbell Row'], // Book-accurate from pages 46-47
                deadlift: ['Hanging Leg Raise'], // Book-accurate from pages 46-47
                squat: ['Leg Curl'] // Book-accurate from pages 46-47
            }
        },
        assistanceLoadMode: 'percentRules',
        conditioning: { ...DEFAULT_CONDITIONING },
        meta: { tmPct, units }
    };
}

export function presetTriumvirate() {
    return {
        key: TEMPLATE_KEYS.TRIUMVIRATE,
        loadingOption: 1,
        schedule: getDefaultSchedule(),
        supplemental: { strategy: 'none' },
        assistance: {
            mode: 'triumvirate',
            patternPerDay: {
                press: [
                    { name: 'Dips', sets: 5, reps: 15, rule: ASSISTANCE_LOAD_RULES.DIPS },
                    { name: 'Chin-ups', sets: 5, reps: 10, rule: ASSISTANCE_LOAD_RULES.CHIN_UPS }
                ],
                deadlift: [
                    { name: 'Good Mornings', sets: 5, reps: 12, rule: ASSISTANCE_LOAD_RULES.GOOD_MORNINGS }, // Book-accurate reps
                    { name: 'Hanging Leg Raises', sets: 5, reps: 15, rule: ASSISTANCE_LOAD_RULES.LEG_RAISES }
                ],
                bench: [
                    { name: 'Dumbbell Bench Press', sets: 5, reps: 15, rule: ASSISTANCE_LOAD_RULES.DB_ROWS }, // Book-accurate p.48
                    { name: 'Dumbbell Row', sets: 5, reps: 10, rule: ASSISTANCE_LOAD_RULES.DB_ROWS } // Book-accurate p.48
                ],
                squat: [
                    { name: 'Leg Press', sets: 5, reps: 15, rule: ASSISTANCE_LOAD_RULES.LEG_CURLS }, // Book-accurate p.48
                    { name: 'Leg Curl', sets: 5, reps: 10, rule: ASSISTANCE_LOAD_RULES.LEG_CURLS } // Book-accurate p.48
                ]
            }
        },
        assistanceLoadMode: 'percentRules',
        conditioning: { ...DEFAULT_CONDITIONING }
    };
}

export function presetPeriodizationBible() {
    return {
        key: TEMPLATE_KEYS.PERIODIZATION_BIBLE,
        loadingOption: 1,
        schedule: getDefaultSchedule(),
        supplemental: { strategy: 'none' },
        assistance: {
            mode: 'periodization_bible',
            blocks: [
                { title: 'Assistance 1', sets: 5, reps: '10-15', rule: ASSISTANCE_LOAD_RULES.DIPS },
                { title: 'Assistance 2', sets: 3, reps: '8-12', rule: ASSISTANCE_LOAD_RULES.GOOD_MORNINGS },
                { title: 'Assistance 3', sets: 3, reps: '8-12', rule: ASSISTANCE_LOAD_RULES.DB_ROWS },
                { title: 'Assistance 4', sets: 2, reps: '15-20', rule: ASSISTANCE_LOAD_RULES.LEG_RAISES },
                { title: 'Core', sets: 2, reps: '10-15', rule: ASSISTANCE_LOAD_RULES.LEG_CURLS }
            ]
        },
        assistanceLoadMode: 'percentRules',
        conditioning: { ...DEFAULT_CONDITIONING }
    };
}

export function presetBodyweight() {
    return {
        key: TEMPLATE_KEYS.BODYWEIGHT,
        loadingOption: 1,
        schedule: getDefaultSchedule(),
        supplemental: { strategy: 'none' },
        assistance: {
            mode: 'bodyweight',
            menu: ['Push-ups', 'Chin-ups', 'Dips', 'Planks', 'Lunges', 'Single-leg Squats']
        },
        assistanceLoadMode: 'percentRules',
        conditioning: { ...DEFAULT_CONDITIONING }
    };
}

export function presetJackShit() {
    return {
        key: TEMPLATE_KEYS.JACK_SHIT,
        loadingOption: 1,
        schedule: getDefaultSchedule(),
        supplemental: { strategy: 'none' },
        assistance: { mode: 'none' },
        assistanceLoadMode: 'percentRules',
        conditioning: { ...DEFAULT_CONDITIONING }
    };
}

export function getTemplatePreset(key, ctx, opts = {}) {
    const state = ctx?.state || {};
    const baseArgs = { tmPct: state.tmPct, units: state.units };
    switch (key) {
        case TEMPLATE_KEYS.BBB: return presetBBB({ ...baseArgs, options: opts.bbb || {} });
        case TEMPLATE_KEYS.TRIUMVIRATE: return presetTriumvirate();
        case TEMPLATE_KEYS.PERIODIZATION_BIBLE: return presetPeriodizationBible();
        case TEMPLATE_KEYS.BODYWEIGHT: return presetBodyweight();
        case TEMPLATE_KEYS.JACK_SHIT: return presetJackShit();
        default: return null; // CUSTOM handled separately
    }
}
