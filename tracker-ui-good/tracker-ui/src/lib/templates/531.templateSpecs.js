// 5/3/1 Template Specificatio        assistanceHint: {
            intent: 'BBB is supplemental work. Assistance should be minimal: 25-50 reps total of opposite movement pattern.',
            examples: {
                press: ['Chin-ups: 5×10'], // Book-accurate BBB assistance
                bench: ['DB Rows: 5×10'], // Book-accurate BBB assistance  
                deadlift: ['Hanging Leg Raises: 5×15'], // Book-accurate BBB assistance
                squat: ['Leg Curls: 5×10'] // Book-accurate BBB assistance
            },
            totalReps: '25-50 reps total assistance work'
        }
    },

import { TEMPLATE_KEYS } from './531.presets.v2.js';

const TIME = {
    FAST: '30-40 min',
    MODERATE: '45-60 min',
    LONG: '60-90 min'
};

export const TEMPLATE_SPECS = {
    [TEMPLATE_KEYS.BBB]: {
        key: TEMPLATE_KEYS.BBB,
        name: 'Boring But Big (BBB)',
        blurb: 'High-volume supplemental work (5×10) for hypertrophy and work capacity. The most popular 5/3/1 template for size and conditioning. Requires careful recovery management.',
        metaBadges: {
            time: TIME.LONG,
            difficulty: 'Intermediate',
            focus: 'Hypertrophy'
        },
        structure: [
            'Main 5/3/1 sets',
            'Supplemental 5×10 @ 50-70% TM',
            'Minimal assistance (push/pull/core)',
            'Conditioning 2-3x weekly'
        ],
        time: TIME.LONG,
        recovery: 'High local muscular fatigue; manage assistance & conditioning carefully. Deload as prescribed. 3‑Month Challenge pushes recovery—attempt only when consistent.',
        who: 'Intermediate/advanced lifters pursuing hypertrophy with significant main‑lift volume; not ideal for novices still grooving technique under lower fatigue.',
        assistanceHint: {
            intent: 'BBB is supplemental work. Assistance should be minimal: 25-50 reps total of opposite movement pattern.',
            examples: {
                press: ['Chin-ups: 5×5-10', 'DB Rows: 3×8-12'],
                deadlift: ['Hanging Leg Raises: 5×5-10', 'Plank: 3×30-60s'],
                bench: ['Chin-ups: 5×5-10', 'Face Pulls: 3×12-15'],
                squat: ['Leg Curls: 3×10-15', 'Back Extensions: 3×10-15']
            },
            totalReps: '25-50 reps total assistance work'
        }
    },
    [TEMPLATE_KEYS.TRIUMVIRATE]: {
        key: TEMPLATE_KEYS.TRIUMVIRATE,
        name: 'Triumvirate',
        blurb: 'Main lift + exactly two focused assistance movements (5 sets each). Balanced, time‑efficient baseline. For lifters wanting a sustainable structure without large assistance volume. 3–4 training days; avoid >2 consecutive days.',
        metaBadges: {
            time: '45-60 min',
            difficulty: 'Intermediate',
            focus: 'Balanced'
        },
        structure: [
            'Main 5/3/1 sets',
            '2 assistance exercises (5 sets each)',
            'Optional conditioning'
        ],
        time: TIME.MODERATE,
        recovery: 'Moderate systemic stress. Sustainable long-term baseline template.',
        who: 'Beginner to early intermediate lifters building consistency; also useful as anchor between higher volume cycles.',
        assistanceHint: {
            intent: 'Two assistance movements: 50-100 reps total. Focus on movement patterns that support your main lifts.',
            examples: {
                press: ['Dips: 5×15', 'Chin-ups: 5×10'],
                bench: ['DB Bench Press: 5×15', 'DB Rows: 5×10'], // Fixed: p. 48
                deadlift: ['Good Mornings: 5×10', 'Hanging Leg Raises: 5×15'],
                squat: ['Leg Press: 5×15', 'Leg Curls: 5×10'] // Fixed: p. 48
            },
            totalReps: '50-100 reps total assistance work'
        }
    },
    [TEMPLATE_KEYS.PERIODIZATION_BIBLE]: {
        key: TEMPLATE_KEYS.PERIODIZATION_BIBLE,
        name: 'Periodization Bible',
        blurb: 'Layered assistance blocks emphasizing multiple movement patterns (Dave Tate style). For lifters seeking broad movement pattern coverage and higher assistance volume in a four‑day split.',
        metaBadges: {
            time: '60-90 min',
            difficulty: 'Advanced',
            focus: 'Periodized'
        },
        structure: [
            'Main 5/3/1 sets',
            '4–5 varied assistance blocks (10–20 rep ranges)',
            'Core & posterior chain emphasis',
            'Conditioning kept brief'
        ],
        time: TIME.LONG,
        recovery: 'High total volume; monitor joints & sleep. Scale blocks down if recovery degrades.',
        who: 'Experienced lifters needing structured variation and comprehensive pattern balance over a training block.',
        assistanceHint: {
            intent: 'Higher volume assistance: 100-200 reps total. Multiple movement patterns but scale intelligently.',
            examples: {
                press: ['Chin-ups: 5×6-10', 'Dips: 4×8-12', 'Face Pulls: 3×12-15'],
                deadlift: ['Good Mornings: 4×8-10', 'Leg Curls: 3×10-15', 'Hanging Leg Raises: 4×8-12'],
                bench: ['DB Rows: 5×8-12', 'Push-ups: 3×12-20', 'Dips: 3×10-15'],
                squat: ['RDL: 4×8-10', 'Leg Curls: 3×10-15', 'Leg Raises: 4×10-15']
            },
            totalReps: '100-200 reps total assistance work'
        }
    },
    [TEMPLATE_KEYS.BODYWEIGHT]: {
        key: TEMPLATE_KEYS.BODYWEIGHT,
        name: 'Bodyweight Assistance',
        blurb: 'Leverages bodyweight variations for assistance when equipment is limited. Good for beginners, older lifters, or joint‑sensitive phases needing lower external loading.',
        metaBadges: {
            time: '30-40 min',
            difficulty: 'Beginner Friendly',
            focus: 'Equipment-Free'
        },
        structure: [
            'Main 5/3/1 sets',
            'Calisthenics assistance (push / pull / squat / core)',
            'Short conditioning or finishers'
        ],
        time: TIME.FAST,
        recovery: 'Lower external loading; easier joint stress but watch elbow/shoulder volume from high push/pull reps.',
        who: 'Novice / detrained / equipment‑limited lifters focusing on movement quality and joint friendliness.',
        assistanceHint: {
            intent: 'Bodyweight movements: 50-100 reps total. Focus on movement quality and gradual progression.',
            examples: {
                press: ['Chin-ups: 5×3-8', 'Push-ups: 3×10-20'],
                deadlift: ['Reverse Lunges: 3×8-12 each leg', 'Hanging Leg Raises: 3×5-10'],
                bench: ['Dips: 4×5-12', 'Inverted Rows: 4×8-15'],
                squat: ['Single-leg Squats: 3×5-8 each leg', 'Planks: 3×30-60s']
            },
            totalReps: '50-100 reps total assistance work'
        }
    },
    [TEMPLATE_KEYS.JACK_SHIT]: {
        key: TEMPLATE_KEYS.JACK_SHIT,
        name: 'Jack Shit',
        blurb: 'Only the main 5/3/1 work. No supplemental or assistance. For experienced lifters during highly stressful or time‑constrained weeks—maintain momentum without added fatigue.',
        metaBadges: {
            time: '30-40 min',
            difficulty: 'Beginner Friendly',
            focus: 'Strength Only'
        },
        structure: [
            'Main 5/3/1 sets only',
            'Leave gym (or do light mobility)',
            'Add conditioning if energy allows'
        ],
        time: TIME.FAST,
        recovery: 'Very low auxiliary fatigue. Ideal for stressful life phases or resetting motivation.',
        who: 'Any lifter needing a strategic low‑stress microcycle (travel, finals week, high job stress).',
        assistanceHint: {
            intent: 'Deliberately none. Focus only on main lifts. If you routinely add accessories, switch templates.',
            examples: {},
            totalReps: '0 reps assistance work'
        }
    }
};

export function getTemplateSpec(key) {
    return TEMPLATE_SPECS[key] || null;
}

export default TEMPLATE_SPECS;
