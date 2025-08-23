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
        mode: "Template" | "Preset" | "Custom";
        volumePreset: "Minimal" | "Standard" | "Loaded"; // 0–25, 25–50, 50–100
        picks: Record<"Push" | "Pull" | "Single-Leg/Core" | "Core", string[]>; // exercise names
        perCategoryTarget: Record<string, number>; // target reps per category
    };
    warmup: {
        mobility: string; // name
        jumpsThrowsDose: number; // default 10 or 15
        jump?: string;
        throw?: string;
        novFullPrep?: boolean;
    };
    conditioning: {
        hardDays: number;
        easyDays: number;
        modalities: string[]; // selected activities
        preferredDays?: string[]; // M/T/W/...
    };
    cycle?: {
        includeDeload: boolean;
        notes?: string;
    };
};

export interface SeventhWeekRow {
    ProtocolId: string;
    Name: string;
    Kind: "Deload" | "TMTest" | "PRTest" | string;
    MainSets: string;
    Percentages: string;
    Criteria: string;
    Notes: string;
}
export interface TMRuleRow {
    PolicyId: string;
    Name: string;
    StartTMPercent: number;
    UpperBumpPerCycle: number;
    LowerBumpPerCycle: number;
    FiveForwardThreeBack: boolean;
    ConservativeOption: boolean;
    Notes: string;
}
export interface JokerRuleRow {
    RuleId: string;
    AllowedPattern: string;
    AllowedWeeks: string;
    MaxJokers: number;
    IncrementHint: string;
    StopCondition: string;
    Notes: string;
}

export interface ConditioningRow {
    id: string;
    display_name: string;
    category: string;           // e.g., Football, General
    goal: string;               // conditioning | strength+athleticism | etc.
    conditioning_mode: string;  // prowler | sled | hill_sprints | tempo_runs | jumps_throws | sport_specific | easy_cardio
    time_per_session_min?: number | '';
    time_per_week_min?: number | '';
    population?: string;        // team | skill | linemen | general
    seasonality?: string;       // off_season | in_season | pre_season
    equipment?: string;         // pipe list
    book: string;
    pages: string;
    notes?: string;
    tags?: string;              // pipe-delimited
    rules_markdown?: string;
}

export interface JumpsThrowsRow {
    id: string;
    display_name: string;
    category: string;
    goal: string;               // athleticism | power | etc.
    conditioning_mode: string;  // jumps | throws | jumps_throws
    population?: string;
    equipment?: string;         // boxes|hurdles|med_balls
    book: string;
    pages: string;
    notes?: string;
    tags?: string;
    rules_markdown?: string;
}
