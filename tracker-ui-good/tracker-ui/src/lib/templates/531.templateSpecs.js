// 5/3/1 Template Specifications
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
        blurb: 'High-volume supplemental work (5×10) for size and work capacity. Start conservative with 50% and progress slowly. Book-accurate assistance pairings from pages 46-47.',
        metaBadges: {
            time: TIME.LONG,
            difficulty: 'Intermediate',
            focus: 'Hypertrophy'
        },
        structure: [
            'Main 5/3/1 sets',
            'Supplemental 5×10 @ 50-60% TM (book range)',
            'ONE assistance movement (25-50 reps)',
            'Optional conditioning 2-3x weekly'
        ],
        time: TIME.LONG,
        recovery: 'High local muscular fatigue; manage assistance & conditioning carefully. Deload as prescribed. Cut back on everything during Week 4.',
        who: 'Intermediate/advanced lifters pursuing hypertrophy with significant main‑lift volume; not ideal for novices still grooving technique under lower fatigue.',
        assistanceHint: {
            intent: 'BBB assistance should be ONE movement only (book-accurate). 25-50 reps total. Opposite movement pattern for balance.',
            examples: {
                Press: ['Chin-ups: 5×10'], // Book-accurate from pages 46-47
                Bench: ['Dumbbell Row: 5×10'], // Book-accurate from pages 46-47
                Deadlift: ['Hanging Leg Raise: 5×15'], // Book-accurate from pages 46-47
                Squat: ['Leg Curl: 5×10'] // Book-accurate from pages 46-47
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
            intent: 'Exactly three total movements per day: main lift + two assistance (book-accurate from pages 47-49).',
            examples: {
                Press: ['Dips: 5×15', 'Chin-ups: 5×10'], // Book-accurate
                Bench: ['Dumbbell Bench Press: 5×15', 'Dumbbell Row: 5×10'], // Book-accurate p.48
                Deadlift: ['Good Mornings: 5×12', 'Hanging Leg Raises: 5×15'], // Book-accurate
                Squat: ['Leg Press: 5×15', 'Leg Curl: 5×10'] // Book-accurate p.48
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
            intent: 'Higher volume assistance: 100-200 reps total. Multiple movement patterns per day (Dave Tate style).',
            examples: {
                Press: ['Shoulders: 5×10-20', 'Lats: 5×10-20', 'Triceps: 5×10-20'], // Book-accurate categories
                Bench: ['Chest: 5×10-20', 'Upper Back: 5×10-20', 'Triceps: 5×10-20'], // Book-accurate categories
                Deadlift: ['Hamstrings: 5×10-20', 'Abs: 5×10-20', 'Low Back: 5×10-20'], // Book-accurate categories
                Squat: ['Quads: 5×10-20', 'Hamstrings: 5×10-20', 'Abs: 5×10-20'] // Book-accurate categories
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
            intent: 'Bodyweight movements: Minimum 75 reps per exercise. Book-accurate pairings from page 52.',
            examples: {
                Press: ['Chin-ups: 75+ reps', 'Dips: 75+ reps'], // Book-accurate from p.52
                Bench: ['Chin-ups: 75+ reps', 'Dips: 75+ reps'], // Book-accurate from p.52
                Deadlift: ['Good Morning: 75+ reps', 'Leg Raises: 75+ reps'], // Book-accurate from p.52
                Squat: ['Good Morning: 75+ reps', 'Leg Raises: 75+ reps'] // Book-accurate from p.52
            },
            totalReps: '75+ reps per exercise minimum'
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
