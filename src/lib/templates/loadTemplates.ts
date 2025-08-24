import { TemplateCsv, TemplateNormalized, splitList, toNum, toBool } from "./types";

// TS: In browser builds, fetch is available; declare for type-checking in non-DOM configs.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const fetch: any;

async function simpleCsvFetch<T=any>(url: string): Promise<T[]> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);
  if (!lines.length) return [] as T[];
  const header = lines[0].split(",").map(h => h.replace(/^\"|\"$/g, "").trim());
  const rows: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const obj: any = {};
    header.forEach((h, idx) => { obj[h] = (cols[idx] ?? "").replace(/^\"|\"$/g, "").trim(); });
    rows.push(obj);
  }
  return rows as T[];
}

export async function loadTemplates(): Promise<TemplateNormalized[]> {
  // Use absolute path from site root; bundlers and static servers will serve from /public or similar
  const url = `/methodology/extraction/templates_additions.csv`;
  const rows = await simpleCsvFetch<TemplateCsv>(url).catch(() => []);
  const items: TemplateNormalized[] = [];
  for (const r of rows) {
    if (!r || !(r as any).id || !(r as any).display_name) continue;
    items.push({
      id: r.id.trim(),
      display_name: r.display_name.trim(),
      category: (r.category ?? "").toLowerCase(),
      goal: r.goal?.trim(),
      days_per_week: toNum(r.days_per_week),
      scheme: r.scheme?.trim(),
      supplemental: r.supplemental?.trim(),
      assistance_mode: r.assistance_mode?.toLowerCase(),
      assistance_targets: splitList(r.assistance_targets),
      conditioning_mode: r.conditioning_mode?.toLowerCase(),
      time_per_session_min: toNum(r.time_per_session_min),
      time_per_week_min: toNum(r.time_per_week_min),
      leader_anchor_fit: r.leader_anchor_fit,
      pr_sets_allowed: toBool(r.pr_sets_allowed),
      jokers_allowed: toBool(r.jokers_allowed),
      amrap_style: r.amrap_style?.toLowerCase(),
      deload_policy: r.deload_policy,
      seventh_week_default: r.seventh_week_default,
      tm_default_pct: toNum(r.tm_default_pct),
      tm_prog_upper_lb: toNum(r.tm_prog_upper_lb),
      tm_prog_lower_lb: toNum(r.tm_prog_lower_lb),
      equipment: splitList(r.equipment),
      population: r.population?.toLowerCase(),
      seasonality: r.seasonality?.toLowerCase(),
      constraints: r.constraints?.toLowerCase(),
      experience: r.experience?.toLowerCase(),
      book: r.book,
      pages: r.pages,
      notes: r.notes,
      tags: splitList(r.tags),
      ui_main: r.ui_main,
      ui_supplemental: r.ui_supplemental,
      ui_assistance: r.ui_assistance,
      ui_conditioning: r.ui_conditioning,
      ui_notes: r.ui_notes,
    });
  }
  return items;
}
