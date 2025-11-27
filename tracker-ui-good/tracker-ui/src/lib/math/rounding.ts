// Centralized rounding utilities for 5/3/1 and related computations
// All weights expected as numbers (already normalized to user-selected units)

// Accepted external rounding mode tokens. We support a few aliases for legacy callers.
export type RoundingMode =
    | 'nearest'
    | 'floor'
    | 'ceiling'
    // aliases / legacy tokens
    | 'ceil'
    | 'up'
    | 'down';

export function assertIncrement(inc: number) {
    if (!Number.isFinite(inc) || inc <= 0) throw new Error(`Invalid increment: ${inc}`);
}

export function roundToIncrement(value: number, increment: number, mode: RoundingMode = 'nearest'): number {
    if (!Number.isFinite(value)) return 0;
    if (!Number.isFinite(increment) || increment <= 0) return Math.round(value);

    // Normalize legacy / alias tokens.
    let normalized: 'nearest' | 'floor' | 'ceiling';
    switch (mode) {
        case 'ceil':
        case 'up':
            normalized = 'ceiling';
            break;
        case 'down':
            normalized = 'floor';
            break;
        case 'floor':
        case 'nearest':
        case 'ceiling':
            normalized = mode;
            break;
        default:
            normalized = 'nearest';
    }

    const x = value / increment;
    switch (normalized) {
        case 'floor':
            return Math.floor(x) * increment;
        case 'ceiling':
            return Math.ceil(x) * increment;
        default:
            return Math.round(x) * increment;
    }
}

export function roundUpToIncrement(value: number, increment: number): number {
    return roundToIncrement(value, increment, 'ceiling');
}

export function roundDownToIncrement(value: number, increment: number): number {
    return roundToIncrement(value, increment, 'floor');
}
