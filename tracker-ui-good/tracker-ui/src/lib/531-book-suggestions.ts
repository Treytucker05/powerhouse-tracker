/*
These constants and comments are suggestions pulled directly from Jim Wendler’s 5/3/1 books. Use them to scaffold UI defaults and validations for an initial program-design flow (no logging/PR tracking/history in v1). Don’t invent new options. If an option is marked `future: true`, expose it behind a feature flag (saved for a later ‘Leader/Anchor’ release). Percentages are based on Training Max (TM). TM defaults to 90% of true max; some templates use 85% TM as noted below.
*/

/** ---------- Types ---------- */
export type ProgrammingApproach =
    | 'classic_531'
    | 'three_five_one'
    | 'fives_pro'
    | 'leader_anchor'      // future
    | 'competition_prep';

export type Supplemental =
    | 'fsl'                // First Set Last
    | 'ssl'                // Second Set Last (future on some plans)
    | 'bbb'                // Boring But Big
    | 'bbs'                // Boring But Strong (future)
    | 'widowmaker';        // 1x20 @ FSL on squat/press/bp as programmed

export type AssistanceMode = 'minimal' | 'balanced' | 'template' | 'custom';

export type CoreScheme = 'classic_531' | 'three_five_one' | 'fives_pro';

export interface WarmupStep {
    label: string;
    reps?: string;          // e.g., "30–50 rolls/leg", "x5"
    percentTM?: number;     // 0.40 = 40% TM, etc.
    notes?: string;
}
export interface WarmupStyle {
    id: string;
    label: string;
    description: string;
    steps: WarmupStep[];
    appliesTo: ('press' | 'bench' | 'squat' | 'deadlift' | 'all')[];
    source: string;
}

export interface PercentRow { percentTM: number; reps: string; amrap?: boolean; }
export interface WeekPattern { week: 1 | 2 | 3 | 4; main: PercentRow[]; deload?: boolean; }

export interface MainSetOption {
    id: 'option1' | 'option2';
    label: string;
    description: string;
    pattern: WeekPattern[];
    source: string;
}

export interface SupplementalDef {
    id: Supplemental;
    label: string;
    description: string;
    defaultTM: '90%' | '85-90%';
    defaultLoading: string;      // sets x reps @ %
    typicalCombos?: string[];
    future?: boolean;            // for Leader/Anchor era items
    source: string;
}

export interface AssistanceTier {
    id: AssistanceMode;
    label: string;
    pushReps: string;
    pullReps: string;
    singleLegCoreReps: string;
    notes?: string;
    source: string;
}

export interface ConditioningTier {
    id: 'minimal' | 'standard' | 'extensive';
    label: string;
    hardDaysPerWeek: string;
    easyDaysPerWeek: string;
    notes?: string;
    source: string;
}

export interface BuilderCatalog {
    trainingMax: {
        defaultTM: number;                 // 0.90
        beginnerOption?: number;           // 0.85 (when noted)
        notes: string;
        source: string;
    };
    approaches: { id: ProgrammingApproach; label: string; description: string; future?: boolean; source: string }[];
    coreSchemes: { id: CoreScheme; label: string; amrapDefault: boolean; source: string }[];
    mainSetOptions: MainSetOption[];
    warmups: WarmupStyle[];
    supplemental: SupplementalDef[];
    assistance: AssistanceTier[];
    conditioning: ConditioningTier[];
}

/** ---------- Catalog (book-sourced) ---------- */
export const WENDLER_531_BOOK_SUGGESTIONS: BuilderCatalog = {
    trainingMax: {
        defaultTM: 0.90,
        beginnerOption: 0.85, // used by some Leader/FSL/BBS/SSL setups
        notes:
            'Percent work is based on Training Max (TM). Start at ~90% of true max; some templates call for ~85% TM (especially Leader cycles and BBS/SSL).',
        source:
            'TM 90%: 5/3/1 Manual pp.22–23. 85% TM appears throughout Leader templates/BBS/SSL in 5/3/1 Forever.'
    },

    approaches: [
        {
            id: 'classic_531',
            label: 'Classic 5/3/1',
            description: 'Standard 4‑week wave with PR set on week 1/2/3 and deload.',
            source: '5/3/1 Manual pp.22–23 (“two options”).'
        },
        {
            id: 'three_five_one',
            label: '3/5/1 Variant',
            description: '6‑week cycle that swaps weeks 1 & 2 (3x3 then 3x5), add deload after two cycles.',
            source: 'Beyond 5/3/1 pp.11–12.'
        },
        {
            id: 'fives_pro',
            label: '5s Pro',
            description: 'All main work sets are sets of 5 (no PR sets); typically paired with FSL/SSL.',
            source: '5/3/1 Forever, numerous templates (e.g., pp.63–68, 129–147).'
        },
        {
            id: 'leader_anchor',
            label: 'Leader / Anchor',
            description: 'Periodized pairing (1–2 Leader cycles then 1–2 Anchor cycles).',
            future: true,
            source: '5/3/1 Forever (Leader/Anchor model).'
        },
        {
            id: 'competition_prep',
            label: 'Competition Prep',
            description: 'Strength/meet‑prep phases that include singles and adjusted PR logic.',
            source: 'Beyond 5/3/1 Strength phases pp.160–186.'
        }
    ],

    coreSchemes: [
        { id: 'classic_531', label: 'Classic 5/3/1', amrapDefault: true, source: '5/3/1 Manual pp.22–23.' },
        { id: 'three_five_one', label: '3/5/1', amrapDefault: true, source: 'Beyond 5/3/1 pp.11–12.' },
        { id: 'fives_pro', label: '5s Pro', amrapDefault: false, source: '5/3/1 Forever pp.63–68.' }
    ],

    mainSetOptions: [
        {
            id: 'option1',
            label: 'Option 1 (standard)',
            description: 'Keeps you fresher before the PR set.',
            pattern: [
                { week: 1, main: [{ percentTM: 0.65, reps: 'x5' }, { percentTM: 0.75, reps: 'x5' }, { percentTM: 0.85, reps: 'x5+', amrap: true }] },
                { week: 2, main: [{ percentTM: 0.70, reps: 'x3' }, { percentTM: 0.80, reps: 'x3' }, { percentTM: 0.90, reps: 'x3+', amrap: true }] },
                { week: 3, main: [{ percentTM: 0.75, reps: 'x5' }, { percentTM: 0.85, reps: 'x3' }, { percentTM: 0.95, reps: 'x1+', amrap: true }] },
                { week: 4, deload: true, main: [{ percentTM: 0.40, reps: 'x5' }, { percentTM: 0.50, reps: 'x5' }, { percentTM: 0.60, reps: 'x5' }] }
            ],
            source: '5/3/1 Manual p.22.'
        },
        {
            id: 'option2',
            label: 'Option 2 (alternate loading)',
            description: 'More fatiguing for lower‑body days; same week‑4 deload.',
            pattern: [
                { week: 1, main: [{ percentTM: 0.75, reps: 'x5' }, { percentTM: 0.80, reps: 'x5' }, { percentTM: 0.85, reps: 'x5+', amrap: true }] },
                { week: 2, main: [{ percentTM: 0.80, reps: 'x3' }, { percentTM: 0.85, reps: 'x3' }, { percentTM: 0.90, reps: 'x3+', amrap: true }] },
                { week: 3, main: [{ percentTM: 0.75, reps: 'x5' }, { percentTM: 0.85, reps: 'x3' }, { percentTM: 0.95, reps: 'x1+', amrap: true }] },
                { week: 4, deload: true, main: [{ percentTM: 0.40, reps: 'x5' }, { percentTM: 0.50, reps: 'x5' }, { percentTM: 0.60, reps: 'x5' }] }
            ],
            source: '5/3/1 Manual p.22–23.'
        }
    ],

    warmups: [
        {
            id: 'prep_block',
            label: 'Foam roll → Stretch → Jump rope',
            description:
                'General prep from the manual before barbell work.',
            steps: [
                { label: 'Foam roll IT band/hamstrings/quads, back, piriformis', reps: '30–50 rolls/leg' },
                { label: 'Stretch: hamstrings/low back; hip flexors/quads; shoulders/chest', reps: '3–5 × 10s each' },
                { label: 'Jump rope sequence', reps: '450–500 total jumps', notes: '100 DL, 50 L, 50 R, 100 alt, 50 high‑knees, 100 DL' }
            ],
            appliesTo: ['all'],
            source: '5/3/1 Manual pp.55–59.'
        },
        {
            id: 'percent_ramp',
            label: 'Percent warm‑up to first work set',
            description: 'Simple bar ramp in % of TM, then start Week pattern.',
            steps: [
                { label: 'Warm‑up set', percentTM: 0.40, reps: 'x5' },
                { label: 'Warm‑up set', percentTM: 0.50, reps: 'x5' },
                { label: 'Warm‑up set', percentTM: 0.60, reps: 'x3' }
            ],
            appliesTo: ['press', 'bench', 'squat', 'deadlift'],
            source: '5/3/1 for Powerlifting (2011) p.19 (How to Warm‑up).'
        },
        {
            id: 'jumps_throws_plus_percent',
            label: 'Jumps/Throws + percent warm‑up',
            description: 'Add 10–20 low‑stress jumps/throws pre‑lift, then do 40/50/60% bar ramp.',
            steps: [
                { label: 'Jumps/Throws', reps: '≈10–20 total', notes: 'low‑stress choices when supplemental volume is high' },
                { label: '40% TM', percentTM: 0.40, reps: 'x5' },
                { label: '50% TM', percentTM: 0.50, reps: 'x5' },
                { label: '60% TM', percentTM: 0.60, reps: 'x3' }
            ],
            appliesTo: ['all'],
            source: '5/3/1 Forever pp.63–68 & p.134–147 notes on jumps/throws with BBB/BBS.'
        }
    ],

    supplemental: [
        {
            id: 'fsl',
            label: 'First Set Last (FSL)',
            description:
                'Use the first work‑set % (65/70/75% depending on week) for back‑off work; common prescriptions are 5×5 or 3–5×5–8; can also do single AMRAP FSL.',
            defaultTM: '85-90%',
            defaultLoading: '5×5 @ FSL (or 3–5×5–8; or 1×AMRAP FSL)',
            typicalCombos: ['Pair with 5s Pro (Leader) → PR sets (Anchor)'],
            source: '5/3/1 Forever pp.63–66; Beyond 5/3/1 pp.20–24.'
        },
        {
            id: 'ssl',
            label: 'Second Set Last (SSL)',
            description:
                'Use the second work‑set % as the supplemental (e.g., 5×5 @ 70/75/85% by week). Often paired with 5s Pro as Leader.',
            defaultTM: '85-90%',
            defaultLoading: '5×5 @ second‑set %',
            typicalCombos: ['3 cycles SSL (Leader) → 2 cycles FSL (Anchor)'],
            future: true,
            source: '5/3/1 Forever pp.129–131.'
        },
        {
            id: 'bbb',
            label: 'Boring But Big (BBB)',
            description:
                'Hypertrophy back‑off: 5×10. Variations: 30–40% in early cycles; fixed 50–70%; or at first‑set % (65/70/75% by week).',
            defaultTM: '90%',
            defaultLoading: '5×10 @ 30–40% (ramp later to 50–70% or use 65/70/75% by week)',
            typicalCombos: ['Use with 5s Pro main work when volume is high'],
            source: 'Beyond 5/3/1 pp.30–35.'
        },
        {
            id: 'bbs',
            label: 'Boring But Strong (BBS)',
            description:
                'Strength volume: 10×5 @ FSL (usually 65→70→75% across weeks). Prefer 85% TM; often Leader only.',
            defaultTM: '85-90%',
            defaultLoading: '10×5 @ FSL (65/70/75% across the three weeks)',
            typicalCombos: ['Best with 5s Pro; use as Leader, then Anchor with PR sets'],
            future: true,
            source: '5/3/1 Forever pp.134–147.'
        },
        {
            id: 'widowmaker',
            label: 'Widowmaker',
            description:
                'High‑rep finisher—most commonly 1×20 @ FSL on squat (and sometimes press/bench in specific templates). Use sparingly.',
            defaultTM: '85-90%',
            defaultLoading: '1×20 @ FSL',
            typicalCombos: ['Appears as Anchor options after 5s Pro Leaders'],
            source: '5/3/1 Forever pp.133–146 & program menus including “5/3/1 and Widowmakers”.'
        }
    ],

    assistance: [
        {
            id: 'minimal',
            label: 'Minimal',
            pushReps: '25–50',
            pullReps: '25–50',
            singleLegCoreReps: '25–50',
            notes: 'Keep assistance easy when conditioning is high.',
            source: '5/3/1 Forever pp.62–63 (“base level of assistance”).'
        },
        {
            id: 'balanced',
            label: 'Balanced',
            pushReps: '50–100',
            pullReps: '50–100',
            singleLegCoreReps: '50–100',
            notes: 'Use when recovery allows; reduces need for extra conditioning.',
            source: '5/3/1 Forever pp.62–63 & 144–146 (assistance counts).'
        },
        {
            id: 'template',
            label: 'Template‑driven',
            pushReps: 'Template‑specific',
            pullReps: 'Template‑specific',
            singleLegCoreReps: 'Template‑specific',
            notes: 'Follow assistance as prescribed by BBB/BBS/FSL/SSL templates.',
            source: 'Beyond 5/3/1 BBB pp.30–35; Forever SSL/BBS pp.129–147.'
        },
        {
            id: 'custom',
            label: 'Custom',
            pushReps: 'User‑defined',
            pullReps: 'User‑defined',
            singleLegCoreReps: 'User‑defined',
            notes: 'Coach enters targets per session.',
            source: '—'
        }
    ],

    conditioning: [
        {
            id: 'minimal',
            label: 'Minimal',
            hardDaysPerWeek: '0–2',
            easyDaysPerWeek: '2–4',
            notes: 'When lifting volume is high (e.g., BBB/BBS), bias easy work.',
            source: '5/3/1 Forever pp.62–63, 144–146.'
        },
        {
            id: 'standard',
            label: 'Standard',
            hardDaysPerWeek: '2–3',
            easyDaysPerWeek: '3–5',
            notes: 'Default general recommendation.',
            source: '5/3/1 Forever pp.144–146.'
        },
        {
            id: 'extensive',
            label: 'Extensive',
            hardDaysPerWeek: '3 (cap)',
            easyDaysPerWeek: '4–6',
            notes: 'Use only when recovery and TM are dialed in.',
            source: '5/3/1 Forever pp.144–146.'
        }
    ]
};
