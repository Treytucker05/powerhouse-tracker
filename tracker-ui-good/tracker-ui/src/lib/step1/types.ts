export type Unit = 'lb' | 'kg';
export type LiftId = 'press' | 'deadlift' | 'bench' | 'squat';

export type EntryMode = 'oneRm' | 'tm';

export interface Step1LiftInput {
    oneRm?: number | null; // raw user input
    tm?: number | null;    // raw user input
}

export interface Step1State {
    unit: Unit;                 // 'lb' | 'kg'
    roundingIncrement?: number; // optional override; if omitted we infer from unit + microplates
    microplates?: boolean;      // lb: 2.5 vs 5 | kg: 1 vs 2.5
    tmPercent: number;          // e.g. 0.90 (default) or 0.85
    entryMode: EntryMode;       // 'oneRm' or 'tm'
    lifts: Record<LiftId, Step1LiftInput>;
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
    helper: string;
}
