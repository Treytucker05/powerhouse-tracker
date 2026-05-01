// Shared 5/3/1 template schema and defaults
export type Phase = "Leader" | "Anchor";
export type MainPattern = "5s PRO" | "5/3/1 PR" | "SVR" | "3/5/1 PR";
export type PercentSource = "FSL" | "SSL" | "Fixed";

export interface AssistanceTargets {
    Push: string;        // "25–50", "50–100"
    Pull: string;
    "Single-Leg/Core": string;
    Core?: string;
}

export interface TemplateConfig {
    templateId: string;
    phase: Phase;

    mainWork: {
        pattern: MainPattern;
        scheme: string;           // e.g., "5s PRO (no AMRAP)"
        amrapPolicy: "on" | "off";
        jokerPolicy: "used" | "not_used";
        tm: "inherited_from_step1"; // 0.85 or 0.90 chosen earlier
        notes?: string;
    };

    supplemental: {
        scheme: PercentSource;    // FSL / SSL / Fixed
        setsReps: "5x5" | "3x5" | "5x3" | "5x10" | "10x5";
        percentSource: PercentSource;
        weeklyPercents: { week1: number; week2: number; week3: number };
        alternateOptions?: string[];
        notes?: string;
    };

    assistance: {
        categories: AssistanceTargets;
        mode: "Template" | "Preset" | "Custom";
        notes?: string;
    };

    warmup: {
        mobilityPreset: string;
        novPrep: boolean;
        jumpsDose: number;   // contacts/session
        throwsDose: number;  // optional contacts/session
        notes?: string;
    };

    conditioning: {
        hardSessionsPerWeek: string;   // "2–3"
        easySessionsPerWeek: string;   // "≥ hard"
        modalities: string[];
        notes?: string;
    };

    cycle: {
        leaderCycles: string;          // "2–3"
        then7thWeek: boolean;
        "7thWeekVariant": "Deload" | "TM Test" | "Deload or TM Test";
        anchorPairing: string[];
    };

    policiesRow: string;

    timeRecovery: {
        sessionLength: string;         // "45–60 min"
        recoveryDayScore?: number;
        recoveryWeekScore?: number;
        balance?: "OK" | "Good" | "Caution";
    };
}

// Global defaults (safe base-building)
export const DEFAULTS: Omit<TemplateConfig, "templateId"> = {
    phase: "Leader",
    mainWork: {
        pattern: "5s PRO",
        scheme: "5s PRO (no AMRAP)",
        amrapPolicy: "off",
        jokerPolicy: "not_used",
        tm: "inherited_from_step1",
    },
    supplemental: {
        scheme: "FSL",
        setsReps: "5x5",
        percentSource: "FSL",
        weeklyPercents: { week1: 0.65, week2: 0.70, week3: 0.75 },
        alternateOptions: ["3x5 FSL", "5x3 FSL"],
    },
    assistance: {
        categories: { Push: "50–100", Pull: "50–100", "Single-Leg/Core": "50–100" },
        mode: "Template",
    },
    warmup: { mobilityPreset: "Agile 8", novPrep: true, jumpsDose: 20, throwsDose: 10 },
    conditioning: {
        hardSessionsPerWeek: "2–3",
        easySessionsPerWeek: "≥ hard",
        modalities: ["Prowler", "Hills", "Bike", "Carries"],
    },
    cycle: {
        leaderCycles: "2–3",
        then7thWeek: true,
        "7thWeekVariant": "Deload or TM Test",
        anchorPairing: [],
    },
    policiesRow: "AMRAP Off · Jokers No · TM inc +5/+10 · 7th Week required",
    timeRecovery: { sessionLength: "45–60 min", balance: "Good" },
};

// FSL Leader override
export const FSL_LEADER: TemplateConfig = {
    templateId: "fsl_leader",
    ...DEFAULTS,
    supplemental: {
        scheme: "FSL",
        setsReps: "5x5",
        percentSource: "FSL",
        weeklyPercents: { week1: 0.65, week2: 0.70, week3: 0.75 },
        alternateOptions: ["3x5 FSL", "5x3 FSL"],
        notes: "High conditioning room; use 50–100 reps assistance.",
    },
    assistance: {
        categories: { Push: "50–100", Pull: "50–100", "Single-Leg/Core": "50–100" },
        mode: "Template",
    },
    policiesRow:
        "AMRAP Off · Jokers No · FSL 65/70/75% TM · TM inc +5/+10 · 7th Week required",
};

// SSL Leader override
export const SSL_LEADER: TemplateConfig = {
    templateId: "ssl_leader",
    ...DEFAULTS,
    supplemental: {
        scheme: "SSL",
        setsReps: "5x5",
        percentSource: "SSL",
        weeklyPercents: { week1: 0.75, week2: 0.80, week3: 0.85 },
        alternateOptions: ["3x5 SSL", "5x3 SSL"],
        notes: "Heavier than FSL; cap assistance at 25–50 reps/category.",
    },
    assistance: {
        categories: { Push: "25–50", Pull: "25–50", "Single-Leg/Core": "25–50", Core: "25–50" },
        mode: "Template",
    },
    conditioning: { ...DEFAULTS.conditioning, hardSessionsPerWeek: "2–3" },
    timeRecovery: { ...DEFAULTS.timeRecovery, balance: "OK" },
    policiesRow:
        "AMRAP Off · Jokers No · SSL 75/80/85% TM · TM inc +5/+10 · 7th Week required",
};

// Known IDs from Step 2 to schema-config map
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
    fsl_leader: FSL_LEADER,
    ssl_leader: SSL_LEADER,
    // Map existing Step 2 IDs to the same configs
    "5_s_pro_5x5_fsl": FSL_LEADER,
    "5_s_pro_ssl": SSL_LEADER,
};

export function resolveTemplateConfig(id?: string | null): TemplateConfig | null {
    if (!id) return null;
    return TEMPLATE_CONFIGS[id] || null;
}
