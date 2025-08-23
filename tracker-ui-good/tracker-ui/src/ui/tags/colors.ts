export const TAG_GROUP_STYLES: Record<string, { pill: string; text: string; border: string }> = {
    Template: { pill: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/30" },
    Scheme: { pill: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
    Supplemental: { pill: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
    Assistance: { pill: "bg-zinc-500/15", text: "text-zinc-300", border: "border-zinc-500/30" },
    Season: { pill: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30" },
    Population: { pill: "bg-sky-500/15", text: "text-sky-300", border: "border-sky-500/30" },
    Conditioning: { pill: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30" },
    Meta: { pill: "bg-slate-500/15", text: "text-slate-300", border: "border-slate-500/30" },
    default: { pill: "bg-slate-500/10", text: "text-slate-300", border: "border-slate-500/20" },
};

// Convenience helper: get styles by group label with sensible fallback
export function getTagStyle(group: string) {
    const key = group && TAG_GROUP_STYLES[group] ? group : (group ? group : "Meta");
    return TAG_GROUP_STYLES[key] ?? TAG_GROUP_STYLES.Meta;
}
