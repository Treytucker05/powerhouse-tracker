// 5/3/1 Canonical Template Explainer Specs (pure data; no side-effects)
// These enrich the lighter preset objects with structured descriptive metadata
// used for Step 2 (selection modal/panel) and Step 4 (review popover).

import { TEMPLATE_KEYS } from './531.presets.v2.js';

// Shared strings helpers (keep them small & opinionated)
const TIME = {
    FAST: '~35–45 min',
    MODERATE: '~45–60 min',
    LONG: '~60–75 min'
};

export const TEMPLATE_SPECS = {
    [TEMPLATE_KEYS.BBB]: {
        key: TEMPLATE_KEYS.BBB,
        name: 'Boring But Big',
        blurb: 'Main lift + 5×10 supplemental volume (high practice + hypertrophy). Start 50% TM and optionally progress (50→60%) or run the 3‑Month Challenge (30/45/60%). For lifters seeking size/volume or extra main‑lift practice. Intermediate+ recommended due to high volume.',
        metaBadges: {
            time: '60-90 min',
            difficulty: 'Advanced',
            focus: 'Size & Strength'
        },
        structure: [
            'Main 5/3/1 sets',
            'Supplemental: 5×10 @ variant % (Standard 50–60%; 3‑Month: 30 → 45 → 60%)',
            'Minimal assistance (push/pull/core)',
            'Optional conditioning after lifting'
        ],
        time: TIME.LONG,
        recovery: 'High local muscular fatigue; manage assistance & conditioning carefully. Deload as prescribed. 3‑Month Challenge pushes recovery—attempt only when consistent.',
        who: 'Intermediate/advanced lifters pursuing hypertrophy with significant main‑lift volume; not ideal for novices still grooving technique under lower fatigue.',
        assistanceHint: {
            intent: 'Keep accessories minimal early. Favor opposite pattern + core.',
            examples: {
                press: ['Chin-ups', 'Face Pulls'],
                deadlift: ['Hanging Leg Raises', 'Back Extensions'],
                bench: ['DB Rows', 'Dips'],
                squat: ['Leg Curls', 'Hanging Leg Raises']
            }
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
            intent: 'Pick movements that directly support the lift (push, pull, single-leg / posterior chain, core).',
            examples: {
                press: ['Dips', 'Chin-ups'],
                deadlift: ['Good Mornings', 'Hanging Leg Raises'],
                bench: ['DB Rows', 'Dips'],
                squat: ['Leg Curls', 'Leg Raises']
            }
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
            intent: 'Spread stress across push, pull, hinge, single-leg, core; avoid maxing all patterns simultaneously.',
            examples: {
                press: ['Chin-ups', 'Dips', 'Face Pulls'],
                deadlift: ['Good Mornings', 'Leg Curls', 'Hanging Leg Raises'],
                bench: ['DB Rows', 'Push-ups', 'Dips'],
                squat: ['RDL', 'Leg Curls', 'Leg Raises']
            }
        }
    },
    [TEMPLATE_KEYS.BODYWEIGHT]: {
        key: TEMPLATE_KEYS.BODYWEIGHT,
        name: 'Bodyweight Assistance',
        blurb: 'Leverages bodyweight variations for assistance when equipment is limited. Good for beginners, older lifters, or joint‑sensitive phases needing lower external loading.',
        metaBadges: {
            time: '45-60 min',
            difficulty: 'Intermediate',
            focus: 'Bodyweight Focus'
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
            intent: 'Rotate movements if reps become excessively easy; add tempo or pauses before adding load.',
            examples: {
                press: ['Chin-ups', 'Push-ups'],
                deadlift: ['Reverse Lunges', 'Hanging Leg Raises'],
                bench: ['Dips', 'Inverted Rows'],
                squat: ['Single-leg Squats', 'Planks']
            }
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
            intent: 'Deliberately none. If you routinely “sneak” accessories in, switch templates instead.',
            examples: {}
        }
    }
};

export function getTemplateSpec(key) {
    return TEMPLATE_SPECS[key] || null;
}
