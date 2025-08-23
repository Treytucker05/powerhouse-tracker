import type { SupplementalRow } from '@/types/step3';

export const ASSISTANCE_PRESETS = {
    Minimal: { perCategory: [0, 25] },
    Standard: { perCategory: [25, 50] },
    Loaded: { perCategory: [50, 100] },
} as const;

export type AssistancePreset = keyof typeof ASSISTANCE_PRESETS;

export function defaultAssistancePreset(s?: SupplementalRow): AssistancePreset {
    if (!s) return 'Standard';
    if (s.SupplementalScheme === 'BBB' || s.SupplementalScheme === 'BBS' || s.SupplementalScheme === 'SSL')
        return 'Standard'; // keep assistance modest on heavy/volume leaders
    if (s.MainPattern === '531') return 'Loaded'; // anchors often allow more assistance
    return 'Standard';
}

export function capHardConditioning(hardRequested: number, s?: SupplementalRow) {
    const cap = s?.HardConditioningMax ?? 3;
    return Math.min(hardRequested, cap);
}

export function minEasyConditioning(easyRequested: number, s?: SupplementalRow) {
    const min = s?.EasyConditioningMin ?? 3;
    return Math.max(easyRequested, min);
}

export function defaultJumpsThrows(s?: SupplementalRow) {
    return s?.JumpsThrowsDefault ?? 10;
}

// naive time model (mins)
const TIME = {
    MAIN_SET: 10, // includes warmups
    SUPP_SET: 1.2, // per set
    ASSIST_REP: 0.15, // per rep (bodyweight-ish)
    JUMP_THROW: 0.4, // per rep
    HARD_COND: 15,
    EASY_COND: 25,
} as const;

export function estimateSessionMinutes(args: {
    mainPattern: '531' | '3/5/1' | '5s PRO';
    supplementalSets: number;
    assistanceTargets: Record<string, number>;
    jumpsThrows: number;
}) {
    const main = TIME.MAIN_SET;
    const supp = args.supplementalSets * TIME.SUPP_SET;
    const assistTotal = Object.values(args.assistanceTargets).reduce((a, b) => a + b, 0);
    const assistance = assistTotal * TIME.ASSIST_REP;
    const jt = args.jumpsThrows * TIME.JUMP_THROW;
    return Math.round(main + supp + assistance + jt);
}

export function warningsForSelection(s: SupplementalRow | undefined, minutes: number, hardDays: number, deloadIncluded: boolean = true) {
    const notes: string[] = [];
    if (!s) return notes;
    if ((s.SupplementalScheme === 'BBB' || s.SupplementalScheme === 'BBS') && hardDays > 2)
        notes.push('Reduce hard conditioning to ≤ 2 days during BBB/BBS.');
    if (minutes > 75) notes.push('Planned session likely exceeds 75 minutes; trim assistance or supplemental.');
    if (!deloadIncluded) notes.push('Deload week is disabled — monitor fatigue and plan active recovery.');
    return notes;
}

// Lightweight calendar drop validator. True=allow, False=block.
export function validateSelection(opts: {
    type: 'SESSION' | 'COND'; intensity?: 'Hard' | 'Easy';
    currentHard: number; currentEasy: number; s?: SupplementalRow;
}): boolean {
    if (opts.type === 'COND' && opts.intensity === 'Hard') {
        const cap = opts.s?.HardConditioningMax ?? 3;
        return opts.currentHard + 1 <= cap;
    }
    if (opts.type === 'COND' && opts.intensity === 'Easy') {
        const min = opts.s?.EasyConditioningMin ?? 0;
        return opts.currentEasy + 1 >= Math.min(min, 7) || true; // allow but warn elsewhere
    }
    return true;
}

// Centralized Jokers gating (basic):
// - Only on Anchor
// - Only with 3/5/1 main pattern
// - Intended for heavy anchors with good bar speed (left for UI to prompt)
export function jokersAllowed(params: { phase: 'Leader' | 'Deload' | 'Anchor' | 'TMTest'; mainPattern: '531' | '3/5/1' | '5s PRO' | string; }): boolean {
    if (params.phase !== 'Anchor') return false;
    return params.mainPattern === '3/5/1';
}
