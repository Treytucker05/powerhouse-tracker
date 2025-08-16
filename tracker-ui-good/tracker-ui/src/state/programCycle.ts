// src/state/programCycle.ts
// Single persistence path for finalized 5/3/1 review plan.
// Framework-agnostic; can be swapped out for remote storage later.

export type ActivePlan = {
  id: string;
  createdAt: string;          // ISO timestamp
  cycle: number;              // always 1 on initial create
  reviewState: any;           // opaque ReviewState payload
  nextCycleIncrements: { upper: number; lower: number }; // +5 / +10 (lbs) default
};

const KEY = "ph_active_plan_v1";

export function startCycle(reviewState: any, inc: { upper: number; lower: number } = { upper: 5, lower: 10 }): ActivePlan {
  if (!reviewState?.tm_by_lift || !reviewState?.days) {
    throw new Error("Invalid review state — missing TMs or days.");
  }
  const plan: ActivePlan = {
    id: (globalThis as any)?.crypto?.randomUUID?.() ?? String(Date.now()),
    createdAt: new Date().toISOString(),
    cycle: 1,
    reviewState,
    nextCycleIncrements: inc,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(plan));
  } catch (e) {
    // surface minimal info for debugging
    console.warn("Failed to persist active plan", e);
  }
  return plan;
}

export function getActivePlan(): ActivePlan | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActivePlan;
  } catch {
    return null;
  }
}

export function clearActivePlan(): void {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
