export type Unit = 'lb' | 'kg';
export type LiftId = 'press' | 'deadlift' | 'bench' | 'squat';

// Discriminated union for how each lift's TM is determined
export type LiftInput =
    | { method: 'tested'; oneRM: number }
    | { method: 'reps'; weight: number; reps: number }
    | { method: 'manual'; manualTM: number };

export interface RoundingStrategy {
    strategy: 'nearest'; // Add 'up' | 'down' later if needed
    increment: number;   // e.g., 2.5, 5, 1.0
}

export interface Step1State {
    units: Unit;
    tmPct: number; // 0.85 | 0.90
    rounding: RoundingStrategy;
    lifts: Record<LiftId, LiftInput>;
    // Selected lift variant (does not yet affect TM math; informational / future logic hook)
    variants?: Record<LiftId, string>;
}

export interface TMRow {
    lift: LiftId;
    tmRaw: number | null;       // exact decimal (never rounded)
    tmDisplay: number | null;   // rounded for UI
    unit: Unit;
    increment: number;          // actual increment used for rounding
    warnings: string[];         // validation messages per row
}

export interface Step1Result {
    tmTable: TMRow[];
    helper: {
        roundingHint: string;
    };
}
