import type { SupplementalRow, Step3Selection } from "@/types/step3";

/**
 * Derive per-category assistance target from a SupplementalRow using book guidance.
 * - For heavy/volume leaders (BBB/BBS/SSL) favor the lower end (min).
 * - Otherwise use midpoint of [min, max].
 */
export function deriveTemplateTargets(s: SupplementalRow): Record<string, number> {
    const min = Number((s as any).AssistancePerCategoryMin ?? 25);
    const max = Number((s as any).AssistancePerCategoryMax ?? 50);
    const isHeavyLeader = s.Phase === "Leader" && ["BBB", "BBS", "SSL"].includes(s.SupplementalScheme as any);
    const isFSLLdr = s.Phase === 'Leader' && (s.SupplementalScheme as any) === 'FSL';
    // For SSL/BBB/BBS leaders → keep to lower end (min). For FSL leader → target high end (favor ~75 if 50–100).
    const target = isHeavyLeader
        ? min
        : (isFSLLdr ? Math.max(60, Math.min(100, Math.round(((min || 25) + (max || 100) + 50) / 2))) : Math.round((min + max) / 2));
    return { "Push": target, "Pull": target, "Single-Leg/Core": target, "Core": target };
}

/**
 * Build a Step-3 defaults payload from a SupplementalRow.
 * Sets:
 * - assistance.mode = "Template" (+ perCategoryTarget)
 * - warmup.jumpsThrowsDose = s.JumpsThrowsDefault
 * - conditioning.hardDays <= s.HardConditioningMax, easyDays >= s.EasyConditioningMin
 * Note: Does not override assistance.picks.
 */
export function buildStep3DefaultsFromSupplemental(s: SupplementalRow): Partial<Step3Selection> {
    const targets = deriveTemplateTargets(s);
    const hardCap = Number((s as any).HardConditioningMax ?? 2);
    const easyMin = Number((s as any).EasyConditioningMin ?? 3);
    // Special defaults for SSL Leader (5s PRO + SSL): heavier supplemental → modest assistance, NOV prep, higher jumps dose
    const isSSLLeader = s.Phase === 'Leader' && (s.SupplementalScheme as any) === 'SSL';
    const isFSLLeader = s.Phase === 'Leader' && (s.SupplementalScheme as any) === 'FSL';
    return {
        supplemental: s,
        assistance: {
            mode: "Template",
            volumePreset: (isFSLLeader ? "Loaded" : "Standard"),
            picks: { "Push": [], "Pull": [], "Single-Leg/Core": [], "Core": [] },
            perCategoryTarget: targets,
        } as any,
        warmup: {
            mobility: (isSSLLeader || isFSLLeader) ? 'Agile 8' : '',
            jumpsThrowsDose: (isSSLLeader || isFSLLeader) ? 20 : ((s as any).JumpsThrowsDefault ?? 10),
            novFullPrep: (isSSLLeader || isFSLLeader) ? true : undefined,
        },
        conditioning: {
            hardDays: Math.min(isSSLLeader ? 2 : (isFSLLeader ? 3 : 2), hardCap),
            easyDays: Math.max(isSSLLeader ? 2 : 3, easyMin),
            modalities: []
        },
        cycle: { includeDeload: true }
    } as Partial<Step3Selection>;
}

export function diffFromDefaults(cur: Partial<Step3Selection>, base: Partial<Step3Selection>) {
    const diffs: string[] = [];
    if (!cur || !base) return diffs;
    if ((cur as any).assistance?.mode !== (base as any).assistance?.mode) diffs.push("Assistance mode");
    const curT = JSON.stringify((cur as any).assistance?.perCategoryTarget || {});
    const baseT = JSON.stringify((base as any).assistance?.perCategoryTarget || {});
    if (curT !== baseT) diffs.push("Assistance targets");
    if (((cur as any).warmup?.jumpsThrowsDose || 0) !== ((base as any).warmup?.jumpsThrowsDose || 0)) diffs.push("Jumps/Throws dose");
    if (((cur as any).conditioning?.hardDays || 0) !== ((base as any).conditioning?.hardDays || 0)) diffs.push("Hard conditioning");
    if (((cur as any).conditioning?.easyDays || 0) !== ((base as any).conditioning?.easyDays || 0)) diffs.push("Easy conditioning");
    return diffs;
}
