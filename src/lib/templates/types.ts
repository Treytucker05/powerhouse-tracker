export type StrArr = string | string[];

export interface TemplateCsv {
    id: string;
    display_name: string;
    category?: string;
    goal?: string;
    days_per_week?: string;
    scheme?: string;
    supplemental?: string;
    assistance_mode?: string;
    assistance_targets?: StrArr;
    conditioning_mode?: string;
    time_per_session_min?: string;
    time_per_week_min?: string;
    leader_anchor_fit?: string;
    pr_sets_allowed?: string;
    jokers_allowed?: string;
    amrap_style?: string;
    deload_policy?: string;
    seventh_week_default?: string;
    tm_default_pct?: string;
    tm_prog_upper_lb?: string;
    tm_prog_lower_lb?: string;
    equipment?: StrArr;
    population?: string;
    seasonality?: string;
    constraints?: string;
    experience?: string;
    book?: string;
    pages?: string;
    notes?: string;
    tags?: StrArr;
    ui_main?: string;
    ui_supplemental?: string;
    ui_assistance?: string;
    ui_conditioning?: string;
    ui_notes?: string;
}

export interface TemplateNormalized {
    id: string;
    display_name: string;
    category: string;
    goal?: string;
    days_per_week?: number;
    scheme?: string;
    supplemental?: string;
    assistance_mode?: string;
    assistance_targets: string[];
    conditioning_mode?: string;
    time_per_session_min?: number;
    time_per_week_min?: number;
    leader_anchor_fit?: string;
    pr_sets_allowed: boolean;
    jokers_allowed: boolean;
    amrap_style?: string;
    deload_policy?: string;
    seventh_week_default?: string;
    tm_default_pct?: number;
    tm_prog_upper_lb?: number;
    tm_prog_lower_lb?: number;
    equipment: string[];
    population?: string;
    seasonality?: string;
    constraints?: string;
    experience?: string;
    book?: string;
    pages?: string;
    notes?: string;
    tags: string[];
    ui_main?: string;
    ui_supplemental?: string;
    ui_assistance?: string;
    ui_conditioning?: string;
    ui_notes?: string;
}

export const splitList = (v?: StrArr): string[] =>
    (Array.isArray(v) ? v.join("|") : (v ?? ""))
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.toLowerCase());

export const toNum = (v?: string) => {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

export const toBool = (v?: string) => {
    const s = (v ?? "").toString().trim().toLowerCase();
    if (!s) return false;
    return ["1", "true", "yes", "y"].includes(s);
};
