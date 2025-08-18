import type { Step1State, Step1Result, TMRow, Unit, LiftId } from './types';

const LIFTS: LiftId[] = ['press', 'deadlift', 'bench', 'squat'] as const;

export function calcTrainingMax(oneRm: number, tmPercent: number): number {
    return oneRm * tmPercent;
}

export function chooseIncrement(unit: Unit, microplates?: boolean, override?: number): number {
    if (override && override > 0) return override;
    if (unit === 'lb') return microplates ? 2.5 : 5;
    return microplates ? 1 : 2.5; // kg
}

export function roundWeight(value: number, unit: Unit, increment: number): number {
    // Deterministic banker's rounding is unnecessary here; classic half-up to nearest increment is expected by lifters.
    return Math.round(value / increment) * increment;
}

function validateTm(tm: number | null, unit: Unit): string[] {
    const warns: string[] = [];
    if (tm == null || !isFinite(tm)) {
        warns.push('Missing TM');
        return warns;
    }
    if (tm <= 0) warns.push('TM must be > 0');
    // Extremely permissive range to avoid false positives; UI can apply tighter heuristics if desired.
    const maxKg = unit === 'kg' ? 500 : 1102.3; // parity marker only
    if (tm > maxKg) warns.push('TM unrealistically high');
    return warns;
}

function toNumberOrNull(v: unknown): number | null {
    return typeof v === 'number' && isFinite(v) ? v : null;
}

export function buildTmRow(
    lift: LiftId,
    state: Step1State
): TMRow {
    const inc = chooseIncrement(state.unit, state.microplates, state.roundingIncrement);
    const input = state.lifts[lift] || {};
    const oneRm = toNumberOrNull(input.oneRm);
    const tmDirect = toNumberOrNull(input.tm);

    let tmRaw: number | null = null;

    if (state.entryMode === 'tm') {
        tmRaw = tmDirect;
    } else {
        tmRaw = oneRm != null ? calcTrainingMax(oneRm, state.tmPercent) : null;
    }

    const warnings = validateTm(tmRaw, state.unit);
    const tmDisplay = tmRaw != null ? roundWeight(tmRaw, state.unit, inc) : null;

    return {
        lift,
        tmRaw,
        tmDisplay,
        unit: state.unit,
        increment: inc,
        warnings
    };
}

export function step1_fundamentals(state: Step1State): Step1Result {
    const rows = LIFTS.map((lift) => buildTmRow(lift, state));

    const helper =
        'Wendler default: 90% TM. Conservative: 85%. Weights are rounded to the nearest increment.';

    return {
        tmTable: rows,
        helper
    };
}
