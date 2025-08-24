// Minimal describe util to compute a display object if MD not found
export type TemplateDesc = {
  id: string;
  display_name: string;
  days_per_week: { default: number };
  tm: { default_pct: number };
  scheme: { raw?: string; parsed?: { variant: string } };
  supplemental?: { raw?: string };
  assistance?: { mode?: string; targets?: string[]; volume?: string };
  rules?: { pr_sets_allowed?: boolean; jokers_allowed?: boolean; seventh_week_default?: string };
};

export function simpleDescribe(t: TemplateDesc) {
  return `# ${t.display_name}\n\n` +
    `## Inputs & Defaults\n- Days/week: ${t.days_per_week?.default ?? 4}\n- TM%: ${t.tm?.default_pct ?? 90}\n\n` +
    `## Main Work\n- ${t.scheme?.raw || t.scheme?.parsed?.variant || 'custom'}\n\n` +
    `## Supplemental\n- ${t.supplemental?.raw || 'N/A'}\n\n` +
    `## Assistance\n- Mode: ${t.assistance?.mode || 'template'}\n- Targets: ${(t.assistance?.targets||[]).join(', ') || 'push, pull, single_leg, core'}\n- Volume: ${t.assistance?.volume || '50–100 reps/category'}\n\n` +
    `## Rules\n- PR sets: ${t.rules?.pr_sets_allowed ? 'allowed' : 'not allowed'}\n- Jokers: ${t.rules?.jokers_allowed ? 'allowed' : 'not allowed'}\n- 7th Week: ${t.rules?.seventh_week_default || 'n/a'}`;
}
