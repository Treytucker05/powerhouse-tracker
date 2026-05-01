export type TemplateIssue = { id: string; field: string; message: string };

export function validateTemplate(t: any): TemplateIssue[] {
    const issues: TemplateIssue[] = [];
    const id = t?.id ?? "unknown";
    if (!t?.id) issues.push({ id, field: "id", message: "Missing id" });
    if (!t?.display_name) issues.push({ id, field: "display_name", message: "Missing display_name" });
    if (t?.tm_default_pct != null) {
        const v = Number(t.tm_default_pct);
        if (!Number.isFinite(v) || v < 75 || v > 95) {
            issues.push({ id, field: "tm_default_pct", message: "TM default should be 75–95" });
        }
    }
    if (t?.days_per_week != null) {
        const d = Number(t.days_per_week);
        if (!Number.isFinite(d) || d < 1 || d > 7) {
            issues.push({ id, field: "days_per_week", message: "days_per_week must be 1–7" });
        }
    }
    return issues;
}
