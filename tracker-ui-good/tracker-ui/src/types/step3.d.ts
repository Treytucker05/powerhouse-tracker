export interface SupplementalRow {
    Template: string;
    Phase: "Leader" | "Anchor";
    MainPattern: "531" | "3/5/1" | "5s PRO";
    SupplementalScheme: "BBB" | "BBS" | "FSL" | "SSL" | "WM" | "Backoff" | "PR+Jokers" | string;
    SupplementalSetsReps: string; // "5x10", "10x5", "FSL 3x5", etc.
    SupplementalPercentSchedule: string; // "50/60/70" | "70" | "FSL" | "SSL"
    AssistancePerCategoryMin: number;
    AssistancePerCategoryMax: number;
    HardConditioningMax: number;
    EasyConditioningMin: number;
    JumpsThrowsDefault: number; // e.g., 10 or 15
    TMRecommendation: string; // "80-85", etc.
    Notes: string;
    CycleMin: number;
    CycleMax: number;
    CompatibleAnchors: string;
}

export interface AssistanceRow {
    Category: "Push" | "Pull" | "Single-Leg/Core" | "Core" | string;
    Exercise: string;
    Equipment: string;
    Difficulty: "Easy" | "Medium" | "Hard" | "None" | string;
    BackStressFlag: "Low" | "Medium" | "High" | string;
    Notes: string;
}

export interface WarmupRow {
    Type: "mobility" | "jump" | "throw" | string;
    Name: string;
    DefaultDose: string;
    ExampleProtocol: string;
    Notes: string;
}

export interface ConditioningRow {
    Activity: string;
    Intensity: "Easy" | "Hard" | string;
    ModalityGroup: string;
    SuggestedDuration: string;
    DefaultFreqPerWeek: number;
    Notes: string;
}

export type Step3Selection = {
    supplemental?: SupplementalRow;
    assistance: {
        volumePreset: "Minimal" | "Standard" | "Loaded"; // 0–25, 25–50, 50–100
        picks: Record<"Push" | "Pull" | "Single-Leg/Core" | "Core", string[]>; // exercise names
        perCategoryTarget: Record<string, number>; // target reps per category
    };
    warmup: {
        mobility: string; // name
        jumpsThrowsDose: number; // default 10 or 15
        jump?: string;
        throw?: string;
    };
    conditioning: {
        hardDays: number;
        easyDays: number;
        modalities: string[]; // selected activities
        preferredDays?: string[]; // M/T/W/...
    };
};
