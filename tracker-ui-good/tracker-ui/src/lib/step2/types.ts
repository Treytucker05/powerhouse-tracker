// Shared types for Step 2 scheme/template cards (extracted so tests & other steps can import)
export type SchemeId = 'scheme_531' | 'scheme_351' | 'scheme_5spro';
export type TemplateId = 'bbb' | 'triumvirate' | 'periodization_bible' | 'bodyweight' | 'jackshit';

export type SchemeSet = {
    reps: number;
    percentage: number; // percent of TM
    isAmrap: boolean;
};
export type SchemeWeek = { isDeload: boolean; sets: SchemeSet[] };

export type SchemeCard = {
    id: SchemeId;
    name: string;
    weeks: SchemeWeek[];
    /** Legacy, human-readable AMRAP policy (compat) */
    amrapPolicy: string;
    /** Structured flags for deterministic logic */
    amrapFlags: { lastSet: boolean; deload: false; scheme5spro: boolean; seventhWeek: false };
    notes?: string;
};

export type TemplateCard = {
    id: TemplateId;
    name: string;
    timePerSession: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    defaultAssistance: string[];
    supplementalSummary: string;
    deloadPolicy: 'ON' | 'OFF';
    why?: string;
};
