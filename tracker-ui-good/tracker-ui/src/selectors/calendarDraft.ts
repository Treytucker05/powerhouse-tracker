import type { Weekday } from "@/store/scheduleStore";

/**
 * Build a weekly draft schedule from Step 1 (schedule) and Step 3 (conditioning).
 * Consumers: Calendar page can call this if no saved plan exists.
 */
export function buildWeeklyDraft(args: {
    trainingDays: Weekday[];
    rotationLabel: string;
    conditioningPreferred: Weekday[];
    hardDays: number;
    easyDays: number;
}) {
    // Return a simple object; your Calendar can translate into events.
    const { trainingDays, rotationLabel, conditioningPreferred, hardDays, easyDays } = args;
    const hard = conditioningPreferred.slice(0, hardDays);
    const easyPool = conditioningPreferred.filter(d => !hard.includes(d));
    const easy = easyPool.slice(0, Math.max(0, easyDays));

    return {
        trainingDays,
        rotationLabel,
        conditioning: { hard, easy }
    };
}
