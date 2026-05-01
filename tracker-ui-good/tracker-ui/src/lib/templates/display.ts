type AnyRow = Record<string, any>;

function norm(s: any) {
    return String(s || "").trim();
}

function has(str: any, q: string) {
    return norm(str).toLowerCase().includes(q.toLowerCase());
}

export function deriveMainWork(row: AnyRow): string {
    const scheme = norm(row.scheme || row.core_scheme || row["Main Work"]);
    const category = norm(row.category);
    if (scheme) {
        if (/(^|[^0-9])531([^0-9]|$)/.test(scheme) || has(scheme, "5/3/1")) return "5/3/1";
        if (has(scheme, "351") || has(scheme, "3/5/1")) return "3/5/1";
        if (has(scheme, "5s pro") || has(scheme, "5's pro") || has(scheme, "5’s pro") || has(scheme, "5 PRO")) return "5's PRO";
        return scheme;
    }
    if (category === "Football") return "Field Block";
    return "—";
}

export function deriveSupplemental(row: AnyRow): string {
    const s = norm(row.supplemental || row["Supplemental"]);
    if (!s) return "none";
    if (has(s, "bbb") || has(s, "boring but big")) return "BBB 5×10";
    if (has(s, "bbs") || has(s, "boring but strong")) return "BBS 5×5";
    if (has(s, "fsl") || has(s, "first set last")) return "FSL (per template)";
    if (has(s, "none")) return "none";
    return s;
}

export function deriveAssistance(row: AnyRow): string {
    const mode = norm(row.assistance_mode);
    const targetsRaw = norm(row.assistance_targets);
    const targets = targetsRaw ? targetsRaw.split("|").map((t: string) => t.trim()).filter(Boolean).join("/ ") : "";
    if (mode === "template") {
        return targets ? `${targets} 50–100 reps/workout (base)` : "Balanced 50–100 reps/workout (base)";
    }
    if (has(mode, "balanced")) return "Balanced";
    if (has(mode, "custom")) return "Custom";
    const fallback = norm(row["Assistance"]);
    return fallback || "—";
}

const COND_LABELS: Record<string, string> = {
    jumps_throws: "Jumps/Throws",
    sport_specific: "Football Intervals/Tempo",
    hill_sprints: "Hill Sprints",
    prowler: "Prowler/Sled",
    easy_cardio: "Easy Cardio",
};

export function deriveConditioning(row: AnyRow): string {
    const modes = norm(row.conditioning_mode);
    if (!modes) return norm(row["Conditioning"]) || "—";
    const parts = modes.split("|").map((k: string) => k.trim()).filter(Boolean).map((k: string) => COND_LABELS[k] || k);
    return parts.length ? parts.join(" + ") : (norm(row["Conditioning"]) || "—");
}

export function deriveLeaderAnchor(row: AnyRow): string {
    const v = norm(row.leader_anchor || row.leader_anchor_fit || row["Leader/Anchor"]);
    if (!v) return "—";
    const low = v.toLowerCase();
    if (/(leader).*(anchor)/.test(low)) return "Leader or Anchor";
    if (/\bleader\b/.test(low)) return "Leader";
    if (/\banchor\b/.test(low)) return "Anchor";
    if (has(low, "standalone")) return "Standalone";
    return v;
}

export function deriveNotes(row: AnyRow): string {
    return norm(row.ui_notes || row["ui_notes"] || row.notes || row["Notes"]) || "—";
}

export function ensureFootballTag(tags: string | undefined, category: string | undefined): string {
    const base = norm(tags);
    const list = base ? base.split("|").map((t) => t.trim()).filter(Boolean) : [];
    if (norm(category) === "Football" && !list.includes("template:football")) list.push("template:football");
    return list.join("|");
}

export function withDerived<T extends AnyRow>(row: T): T & { __display: { mainWork: string; supplemental: string; assistance: string; conditioning: string; leaderAnchor: string; notes: string; tags: string; } } {
    const mainWork = deriveMainWork(row);
    const supplemental = deriveSupplemental(row);
    const assistance = deriveAssistance(row);
    const conditioning = deriveConditioning(row);
    const leaderAnchor = deriveLeaderAnchor(row);
    const notes = deriveNotes(row);
    const tags = ensureFootballTag(row.tags || row.__tags, row.category);
    return {
        ...row,
        __display: { mainWork, supplemental, assistance, conditioning, leaderAnchor, notes, tags },
    };
}
