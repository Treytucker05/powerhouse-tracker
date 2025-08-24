import { TemplateNormalized } from "./types";

export interface TemplateValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTemplate(t: TemplateNormalized): TemplateValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!t.id) errors.push("Missing id");
  if (!t.display_name) errors.push("Missing display_name");

  const dpw = t.days_per_week;
  if (dpw != null) {
    if (!Number.isFinite(dpw)) errors.push("days_per_week must be a number");
    else if (dpw < 2 || dpw > 7) warnings.push("days_per_week is outside typical 2-7 range");
  }

  if (t.tm_default_pct != null) {
    const tm = t.tm_default_pct;
    if (!Number.isFinite(tm)) errors.push("tm_default_pct must be a number");
    else if (tm < 0.7 || tm > 1.05) warnings.push("tm_default_pct seems atypical (<70% or >105%)");
  }

  // Basic sanity: assistance + conditioning lists are small
  if (t.assistance_targets && t.assistance_targets.length > 8) warnings.push("Large number of assistance targets");
  if (t.tags && t.tags.length > 16) warnings.push("High tag count; consider trimming");

  return { ok: errors.length === 0, errors, warnings };
}
