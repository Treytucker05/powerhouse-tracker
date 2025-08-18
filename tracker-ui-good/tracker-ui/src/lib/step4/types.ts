// src/lib/step4/types.ts
export type Unit = 'lb' | 'kg';
export type Lift = 'press' | 'deadlift' | 'bench' | 'squat';
export type SchemeId = 'scheme_531' | 'scheme_351' | 'scheme_5spro';
export type SupplementalType = 'bbb' | 'fsl' | 'ssl' | 'none';

export interface Step4State {
  unit: Unit;
  microplates: boolean;
  // Either provide TM directly or 1RM (we’ll prefer TM if present):
  tm?: Partial<Record<Lift, number>>;          // training maxes (program basis)
  oneRm?: Partial<Record<Lift, number>>;       // true 1RMs (we’ll apply 90% rule)
  // Programming
  schemeId: SchemeId;
  deload: { enabled: boolean; mode: '40/50/60'; amrap: false };
  // Supplemental (from Step 3)
  supplemental: {
    type: SupplementalType;
    sets?: number;
    reps?: number;
    pctOfTM?: number;          // e.g., 0.5 for 50%
    pairing?: 'same' | 'opposite';
  };
  // For labels / ordering
  schedule: { frequency: 2 | 3 | 4; order: Lift[] };
  // Assistance (for preview targets only)
  assistance: { buckets: Array<'Push'|'Pull'|'Single-leg'|'Core'>; targetRepsPerBucket: [number, number] };
}

export interface PreviewSet {
  reps: string;                 // "5", "3+", "1", "5 (no AMRAP)"
  pct: number;                  // 0..1 of TM
  weightRaw: number;            // unrounded
  weight: number;               // rounded to implementable load
  amrap: boolean;
}

export interface PreviewSupplemental {
  type: SupplementalType;
  sets: number;
  reps: number;
  pct: number;                  // 0..1 of TM
  weightRaw: number;
  weight: number;               // rounded
  pairing: 'same'|'opposite';
}

export interface DayPreview {
  lift: Lift;
  weekIndex: 1|2|3|4;           // standard wave, week 4 = deload (or replaced by deload rules)
  main: PreviewSet[];
  supplemental?: PreviewSupplemental;
  assistanceTargets?: { bucket: 'Push'|'Pull'|'Single-leg'|'Core'; min: number; max: number }[];
}

export interface CyclePreview {
  unit: Unit;
  microplates: boolean;
  schemeId: SchemeId;
  days: DayPreview[];           // ordered by schedule.order × 4 weeks
  tmTable: Record<Lift, number>;
}
