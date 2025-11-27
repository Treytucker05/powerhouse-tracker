// src/lib/step5/types.ts
export type Unit = 'lb' | 'kg';
export type Lift = 'press' | 'deadlift' | 'bench' | 'squat';
export type Phase = 'leader' | 'anchor' | 'none';
export type SeventhWeekMode = 'off' | 'deload' | 'test';

export interface ProgressIncrements {
    upperLb: 5;   // bench/press
    lowerLb: 10;  // squat/deadlift
    upperKg: 2.5;
    lowerKg: 5;
}

export interface LeaderAnchorFlags {
    enabled: boolean;
    leaderCycles: 1 | 2 | 3;     // how many Leaders before Anchor
    anchorCycles: 1 | 2;         // how many Anchors after Leaders
    progressAt: 'eachCycle' | 'endOfBlock'; // when to apply +5/+10
    seventhWeekBetween: SeventhWeekMode;    // inserted between Leader->Anchor
    seventhWeekAfterAnchor: SeventhWeekMode;// inserted after Anchor block
}

export interface Step5State {
    unit: Unit;
    // current training maxes (basis for next cycle computation)
    tm: Record<Lift, number>;

    // cycle accounting
    cycleIndex: number;         // 0-based within current block
    totalCyclesCompleted: number;

    // leader/anchor controls
    phase: Phase;               // 'none' if not using L/A
    la: LeaderAnchorFlags;

    // progression rules (+5/+10 lb | +2.5/+5 kg)
    increments?: Partial<ProgressIncrements>;

    // optional controls
    holdProgression?: boolean;              // if true, do not add increments this boundary
    resetLifts?: Partial<Record<Lift, boolean>>; // if true for a lift, drop TM by 10%
}

export interface ProgressEvent {
    type: 'standard' | 'held' | 'reset' | 'seventhWeek';
    note?: string;
}

export interface Step5Result {
    nextTm: Record<Lift, number>;
    nextCycleIndex: number;
    nextPhase: Phase;
    events: Partial<Record<Lift, ProgressEvent>>;
    insertedSeventhWeek?: SeventhWeekMode; // if a 7th week “cycle” is inserted next
}
