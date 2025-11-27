// Centralized template & scheme specifications for 5/3/1 builder (UI-first)
// Consolidates data previously embedded inside Step 2 component.

export interface TemplateDef { id: string; title: string; desc: string; }
export interface SchemeDef { id: string; title: string; amrap: 'on' | 'off'; }
export interface DayDetail { day: number; primary: string; supplemental?: string; supplementalNote?: string; assistance?: string[]; }
export interface TemplateDetailConfig { blurb: string; days: DayDetail[]; }
export interface TemplateMeta {
    time: string;
    difficulty: string;
    focus: string[];
    suitability: string;
    caution?: string;
    // New: compatibility and defaults to guide Step 2 and reflect Step 1 choices
    supports?: Array<2 | 3 | 4>; // which days-per-week variants are well-supported
    splits?: Partial<{ '2D': string; '3D': string; '4D': string }>; // concise rotation examples by frequency
    leaderAnchor?: 'leader' | 'anchor' | 'either';
    recommendedTmPct?: number | { min: number; max: number };
    roundingDefault?: 'nearest' | 'down' | 'up';
    microplatesRecommended?: boolean;
    // Optional policy hints (not yet rendered everywhere)
    amrapPolicy?: 'on' | 'off' | 'cycle-dependent';
    jokerPolicy?: 'allowed' | 'discouraged' | 'not_used';
    tmIncrements?: { upper: number; lower: number };
    deloadPolicy?: string;
}

export const TEMPLATES: TemplateDef[] = [
    { id: 'bbb', title: 'Boring But Big', desc: '5×10 supplemental volume focus.' },
    { id: 'triumvirate', title: 'Triumvirate', desc: 'Two assistance lifts per day.' },
    { id: 'periodization_bible', title: 'Periodization Bible', desc: 'Structured assistance families.' },
    { id: 'bodyweight', title: 'Bodyweight', desc: 'Calisthenics-focused assistance.' },
    { id: 'jackshit', title: 'Jack Sh*t', desc: 'Only main lifts, no supplemental.' },
    // CSV-backed template (slug from "5's PRO + 5x5 FSL")
    { id: '5_s_pro_5x5_fsl', title: "5's PRO + 5x5 FSL", desc: 'Base-building leaders: no AMRAP, 5×5 FSL volume.' },
    // CSV-backed template (slug from "5's PRO + SSL")
    { id: '5_s_pro_ssl', title: "5's PRO + SSL", desc: 'SSL hits intensity with controlled volume.' }
];

export const SCHEMES: SchemeDef[] = [
    { id: 'scheme_531', title: 'Classic 5/3/1', amrap: 'on' },
    { id: 'scheme_351', title: '3/5/1', amrap: 'on' },
    { id: 'scheme_5spro', title: '5s Pro', amrap: 'off' }
];

export const TEMPLATE_DETAILS: Record<string, TemplateDetailConfig> = {
    bbb: {
        blurb: 'Boring But Big adds high‑volume 5×10 work with the same main lift (50–60% TM first cycle).',
        days: [
            { day: 1, primary: 'Press', supplemental: 'Press 5×10', supplementalNote: '50–60% TM', assistance: ['Pull (Rows/Chins) 5×10–15', 'Single-Leg/Core 5×10–20'] },
            { day: 2, primary: 'Deadlift', supplemental: 'Deadlift 5×10', supplementalNote: '50–60% TM', assistance: ['Hamstring / Low Back 4–5×10', 'Abs / Bracing 4–5×12–15'] },
            { day: 3, primary: 'Bench', supplemental: 'Bench 5×10', supplementalNote: '50–60% TM', assistance: ['Vertical Pull 5×10–12', 'Push (DB Press / Dips) 5×10–15'] },
            { day: 4, primary: 'Squat', supplemental: 'Squat 5×10', supplementalNote: '50–60% TM', assistance: ['Posterior Chain 4×10', 'Core / Carry 4×40–60y'] }
        ]
    },
    triumvirate: {
        blurb: 'Triumvirate uses the main lift plus only TWO focused assistance lifts to control fatigue.',
        days: [
            { day: 1, primary: 'Press', assistance: ['Weighted Chin-Ups 5×8', 'Dips 5×10'] },
            { day: 2, primary: 'Deadlift', assistance: ['Good Morning 5×10', 'Hanging Leg Raise 5×10'] },
            { day: 3, primary: 'Bench', assistance: ['DB Row 5×10', 'DB Incline Press 5×10'] },
            { day: 4, primary: 'Squat', assistance: ['Lunge 5×12 / leg', 'Back Extension 5×12'] }
        ]
    },
    periodization_bible: {
        blurb: 'Periodization Bible organizes secondary lifts by movement family for balance.',
        days: [
            { day: 1, primary: 'Press', assistance: ['Shoulder / Upper Back 3–4×8–12', 'Triceps / Pull 3–4×8–12', 'Core 3–4×10–15'] },
            { day: 2, primary: 'Deadlift', assistance: ['Hamstring 4×8–12', 'Low Back 4×8–12', 'Abs 4×12–15'] },
            { day: 3, primary: 'Bench', assistance: ['Horizontal Pull 4×8–12', 'Chest / Triceps 4×8–12', 'Core / Carry 3–4×'] },
            { day: 4, primary: 'Squat', assistance: ['Quad 4×8–12', 'Posterior Chain 4×8–12', 'Core / Single-Leg 3–4×'] }
        ]
    },
    bodyweight: {
        blurb: 'Bodyweight template couples main lifts with calisthenics volume for strength-endurance.',
        days: [
            { day: 1, primary: 'Press', assistance: ['Pull-Ups / Chin-Ups 50–75 total', 'Push-Ups 75–100 total', 'Planks 3–5× :30–:45'] },
            { day: 2, primary: 'Deadlift', assistance: ['Hanging Leg Raises 50 total', 'Back Extensions 3–4×12', 'Burpees (optional) 3×10'] },
            { day: 3, primary: 'Bench', assistance: ['Pull-Ups 50 total', 'Dips 50 total', 'Ab Wheel 4×10'] },
            { day: 4, primary: 'Squat', assistance: ['Lunges 100 total steps', 'Sit-Ups 75–100', 'Back Raises 3×12'] }
        ]
    },
    jackshit: {
        blurb: 'Jack Sh*t is the stripped down variant: hit the main lifts hard and go home.',
        days: [
            { day: 1, primary: 'Press' },
            { day: 2, primary: 'Deadlift' },
            { day: 3, primary: 'Bench' },
            { day: 4, primary: 'Squat' }
        ]
    },
    // 5's PRO + 5x5 FSL (leader)
    ['5_s_pro_5x5_fsl']: {
        blurb: "Leader cycle: 5's PRO (no AMRAP) keeps bar speed crisp; 5×5 FSL adds controlled volume.",
        days: [
            { day: 1, primary: 'Press', supplemental: 'Press 5×5 @ FSL', supplementalNote: 'W1 65% TM • W2 70% TM • W3 75% TM', assistance: ['Pull 50–75 total', 'Single-Leg/Core 50–75'] },
            { day: 2, primary: 'Deadlift', supplemental: 'Deadlift 5×5 @ FSL', supplementalNote: 'W1 65% TM • W2 70% TM • W3 75% TM', assistance: ['Hamstrings/Low Back 4×10–12', 'Abs 4×12–15'] },
            { day: 3, primary: 'Bench', supplemental: 'Bench 5×5 @ FSL', supplementalNote: 'W1 65% TM • W2 70% TM • W3 75% TM', assistance: ['Vertical Pull 5×8–12', 'Push (DB/Dips) 4×10–12'] },
            { day: 4, primary: 'Squat', supplemental: 'Squat 5×5 @ FSL', supplementalNote: 'W1 65% TM • W2 70% TM • W3 75% TM', assistance: ['Quads/Posterior Chain 4×10', 'Core/Carry 3–4×'] }
        ]
    },
    // 5's PRO + SSL (leader)
    ['5_s_pro_ssl']: {
        blurb: "Leader cycle: 5's PRO (no AMRAP); SSL 5×5 uses the second-set % each week (W1 75%, W2 80%, W3 85% TM) for heavier, controlled supplemental volume. Keep assistance modest (≈25–50 reps per category). Do jumps/throws first.",
        days: [
            { day: 1, primary: 'Press', supplemental: 'Press 5×5 @ SSL', supplementalNote: 'W1 75% TM • W2 80% TM • W3 85% TM', assistance: ['Pull 25–50 total', 'Push 25–50 total', 'Single-Leg/Core 25–50 total'] },
            { day: 2, primary: 'Deadlift', supplemental: 'Deadlift 5×5 @ SSL', supplementalNote: 'W1 75% TM • W2 80% TM • W3 85% TM', assistance: ['Hamstrings/Low Back 25–50', 'Abs/Bracing 25–50', 'Back/Upper Back 25–50'] },
            { day: 3, primary: 'Bench', supplemental: 'Bench 5×5 @ SSL', supplementalNote: 'W1 75% TM • W2 80% TM • W3 85% TM', assistance: ['Vertical Pull 25–50', 'Push (DB/Dips) 25–50', 'Core 25–50'] },
            { day: 4, primary: 'Squat', supplemental: 'Squat 5×5 @ SSL', supplementalNote: 'W1 75% TM • W2 80% TM • W3 85% TM', assistance: ['Quads/Posterior Chain 25–50', 'Core/Carry 25–50', 'Upper Back 25–50'] }
        ]
    }
};

export const TEMPLATE_META: Record<string, TemplateMeta> = {
    bbb: {
        time: '60–75m sessions', difficulty: 'Intermediate', focus: ['Hypertrophy Volume', 'Main Lift Practice'],
        suitability: 'Lifters with solid recovery wanting size + main lift volume.',
        caution: 'High volume – ensure calories/sleep; start 50% TM for 5×10.',
        supports: [3, 4],
        splits: { '3D': 'SQ/BP • DL/PR • SQ/PR', '4D': 'PR • DL • BP • SQ' },
        leaderAnchor: 'either', recommendedTmPct: 0.9, roundingDefault: 'nearest', microplatesRecommended: true
    },
    triumvirate: {
        time: '45–60m sessions', difficulty: 'Beginner', focus: ['Strength', 'Balanced Assistance'],
        suitability: 'General strength; minimal but effective assistance focus.',
        caution: 'Limit extra fluff – template works because it is constrained.',
        supports: [2, 3, 4],
        splits: { '2D': 'SQ/BP • DL/PR', '3D': 'SQ/BP • DL/PR • SQ/PR', '4D': 'PR • DL • BP • SQ' },
        leaderAnchor: 'either', recommendedTmPct: 0.9, roundingDefault: 'nearest', microplatesRecommended: true
    },
    periodization_bible: {
        time: '55–70m sessions', difficulty: 'Intermediate', focus: ['Balanced Development', 'Movement Families'],
        suitability: 'Those wanting structure without excessive volume.',
        caution: 'Stay submaximal on assistance to keep recovery intact.',
        supports: [3, 4],
        splits: { '3D': 'SQ/BP • DL/PR • SQ/PR', '4D': 'PR • DL • BP • SQ' },
        leaderAnchor: 'either', recommendedTmPct: 0.9, roundingDefault: 'nearest', microplatesRecommended: true
    },
    bodyweight: {
        time: '45–60m sessions', difficulty: 'All Levels', focus: ['Relative Strength', 'Conditioning'],
        suitability: 'Limited equipment situations / cutting phases.',
        caution: 'Track total reps; avoid junk fatigue.',
        supports: [2, 3, 4],
        splits: { '2D': 'SQ/BP • DL/PR', '3D': 'SQ/BP • DL/PR • SQ/PR', '4D': 'PR • DL • BP • SQ' },
        leaderAnchor: 'either', recommendedTmPct: 0.9, roundingDefault: 'nearest', microplatesRecommended: true
    },
    jackshit: {
        time: '25–35m sessions', difficulty: 'Advanced', focus: ['Strength Specificity', 'Recovery Priority'],
        suitability: 'Time-crunched or emphasizing recovery between heavy sports.',
        caution: 'Minimal hypertrophy stimulus; cycle out after peak block.',
        supports: [2, 3, 4],
        splits: { '2D': 'SQ/BP • DL/PR', '3D': 'SQ/BP • DL/PR • SQ/PR', '4D': 'PR • DL • BP • SQ' },
        leaderAnchor: 'either', recommendedTmPct: 0.9, roundingDefault: 'nearest', microplatesRecommended: true
    },
    ['5_s_pro_5x5_fsl']: {
        time: '45–60m sessions', difficulty: 'All Levels', focus: ['Base Building', 'Volume Control'],
        suitability: 'Leader cycle with submax main work and steady volume; great when pushing conditioning.',
        caution: '5s PRO has no AMRAP. Prioritize bar speed; if it degrades, reduce volume (e.g., 3×5 FSL) or deload.',
        supports: [2, 3, 4],
        splits: {
            '2D': 'A = SQ+BP (5s PRO → FSL 5×5) | B = DL+PR (5s PRO → FSL 5×5), alternate A/B each week',
            '3D': 'Alternates weekly to balance Bench/Press',
            '4D': 'PR • DL • BP • SQ'
        },
        leaderAnchor: 'either', recommendedTmPct: { min: 0.85, max: 0.90 }, roundingDefault: 'nearest', microplatesRecommended: true,
        amrapPolicy: 'off',
        jokerPolicy: 'not_used',
        tmIncrements: { upper: 5, lower: 10 },
        deloadPolicy: '7th Week between Leader and Anchor; also prior to a Leader to verify TM'
    },
    ['5_s_pro_ssl']: {
        time: '45–60m sessions', difficulty: 'All Levels', focus: ['Strength'],
        suitability: 'Leader emphasizing heavier supplemental via SSL; keep assistance modest and bar speed crisp.',
        caution: '5s PRO has no AMRAP. SSL uses the second-set % (75/80/85% TM). If bar speed drops or recovery lags, switch SSL to 3×5 or 5×3 until performance returns.',
        supports: [2, 3, 4],
        splits: {
            '2D': 'A = SQ+BP (5s PRO → SSL 5×5) | B = DL+PR (5s PRO → SSL 5×5), alternate A/B each week',
            '3D': 'Alternates weekly to balance Bench/Press',
            '4D': 'PR • DL • BP • SQ'
        },
        leaderAnchor: 'leader', recommendedTmPct: { min: 0.85, max: 0.90 }, roundingDefault: 'nearest', microplatesRecommended: true,
        amrapPolicy: 'off',
        jokerPolicy: 'not_used',
        tmIncrements: { upper: 5, lower: 10 },
        deloadPolicy: '7th Week Deload/Test between Leader and Anchor; verify TM before starting a new Leader'
    }
};

export function getSchemeDescriptor(id?: string) {
    switch (id) {
        case 'scheme_531': return 'Week Waves: 5/5/5+, 3/3/3+, 5/3/1+';
        case 'scheme_351': return 'Week Waves: 3/3/3+, 5/5/5+, 5/3/1+';
        case 'scheme_5spro': return 'All Weeks: 5×5 @ increasing % (No AMRAP)';
        default: return 'Select a scheme to view set waves';
    }
}

// Human label for template id (UI-facing). Ensures BBB casing.
export function templateLabel(id?: string | null) {
    switch (id) {
        case 'bbb': return 'BBB';
        case 'triumvirate': return 'Triumvirate';
        case 'periodization_bible': return 'Periodization Bible';
        case 'bodyweight': return 'Bodyweight';
        case 'jackshit': return 'Jack Sh*t';
        case undefined:
        case null:
            return 'none';
        default:
            return String(id);
    }
}

// Human label for scheme id (UI-facing)
export function schemeLabel(id?: string | null) {
    if (!id) return '(none)';
    const s = SCHEMES.find(x => x.id === id);
    return s?.title || String(id);
}

// AMRAP behavior for a scheme id
export function schemeAmrap(id?: string | null): 'on' | 'off' | null {
    if (!id) return null;
    const s = SCHEMES.find(x => x.id === id);
    return s?.amrap ?? null;
}
