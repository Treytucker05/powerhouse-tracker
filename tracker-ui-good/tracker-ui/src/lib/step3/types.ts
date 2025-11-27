// src/lib/step3/types.ts
export type SchemeId = 'scheme_531' | 'scheme_351' | 'scheme_5spro';
export type TemplateId = 'bbb' | 'triumvirate' | 'periodization_bible' | 'bodyweight' | 'jackshit';
export type Lift = 'press' | 'deadlift' | 'bench' | 'squat';

export type WarmupMode = 'standard' | 'minimalist' | 'jumps_integrated';
export type SupplementalType = 'bbb' | 'fsl' | 'ssl' | 'none';

export interface Step3Defaults {
    schedule: { frequency: 2 | 3 | 4; order: Lift[] };
    warmups: { mode: WarmupMode };
    programming: {
        schemeId: SchemeId;
        leaderAnchor?: { enabled: boolean; leader: number; anchor: number; seventhWeek: boolean };
    };
    deload: { enabled: boolean; mode: '40/50/60'; amrap: false };
    supplemental: { type: SupplementalType; sets?: number; reps?: number; pctOfTM?: number; pairing?: 'same' | 'opposite' };
    assistance: { mode: 'template' | 'minimal' | 'balanced' | 'custom'; buckets: Array<'Push' | 'Pull' | 'Single-leg' | 'Core'>; targetRepsPerBucket: [number, number] };
    conditioning: { mode: 'minimal' | 'standard' | 'extensive'; weekly: { hard: number; easy: number }; presets: string[] };
}

export interface Step3Catalogs {
    assistance: { Push: string[]; Pull: string[]; 'Single-leg': string[]; Core: string[] };
    warmups: WarmupMode[];
    conditioning: { activities: string[]; presets: Array<'minimal' | 'standard' | 'extensive'> };
    supplemental: SupplementalType[];
    schemes: SchemeId[];
}
