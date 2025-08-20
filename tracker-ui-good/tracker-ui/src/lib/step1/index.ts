import type { Step1State, Step1Result, TMRow, LiftId } from './types';

const LIFTS: LiftId[] = ['press', 'deadlift', 'bench', 'squat'];

// Epley (simple) for reps based estimate: 1RM ≈ w * (1 + r/30)
function epley(weight: number, reps: number): number {
    return weight * (1 + reps / 30);
}

export function calcTrainingMax(oneRm: number, tmPct: number): number {
    return oneRm * tmPct;
}

export function roundWeight(val: number, increment: number): number {
    return Math.round(val / increment) * increment;
}

function deriveOneRm(input: Step1State['lifts'][LiftId], tmPct: number): { tmRaw: number | null; source: 'tested' | 'reps' | 'manual' | 'none'; } {
    if (!input) return { tmRaw: null, source: 'none' };
    switch (input.method) {
        case 'tested':
            if (!isFinite(input.oneRM)) return { tmRaw: null, source: 'tested' };
            return { tmRaw: calcTrainingMax(input.oneRM, tmPct), source: 'tested' };
        case 'reps':
            if (!isFinite(input.weight) || !isFinite(input.reps) || input.reps <= 0) return { tmRaw: null, source: 'reps' };
            return { tmRaw: calcTrainingMax(epley(input.weight, input.reps), tmPct), source: 'reps' };
        case 'manual':
            if (!isFinite(input.manualTM)) return { tmRaw: null, source: 'manual' };
            return { tmRaw: input.manualTM, source: 'manual' }; // already a TM value
        default:
            return { tmRaw: null, source: 'none' };
    }
}

function validate(tmRaw: number | null): string[] {
    const w: string[] = [];
    if (tmRaw == null) w.push('Missing TM');
    else if (tmRaw <= 0) w.push('TM must be > 0');
    return w;
}

function buildRow(lift: LiftId, state: Step1State): TMRow {
    const { tmRaw } = deriveOneRm(state.lifts[lift], state.tmPct);
    const inc = state.rounding.increment;
    const tmDisplay = tmRaw != null ? roundWeight(tmRaw, inc) : null;
    return {
        lift,
        tmRaw,
        tmDisplay,
        unit: state.units,
        increment: inc,
        warnings: validate(tmRaw)
    };
}

export function step1_fundamentals(state: Step1State): Step1Result {
    const tmTable: TMRow[] = LIFTS.map(lift => buildRow(lift, state));
    const inc = state.rounding.increment;
    const hint = `Training max = ${Math.round(state.tmPct * 100)}% of estimated 1RM unless manual. Rounded to nearest ${inc}${state.units}.`;
    return { tmTable, helper: { roundingHint: hint } };
}

// Legacy named exports kept for tests that still import them (can adjust tests later)
// roundWeight already exported via function declaration above
