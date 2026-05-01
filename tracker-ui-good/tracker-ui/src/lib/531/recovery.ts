export type RecoveryInput = {
    minutes: number; // estimated session minutes
    hardConditioning: number; // days per week
    easyConditioning: number; // days per week
    assistanceVolumeScore?: number; // 0..1 heuristic
};

export type RecoveryScore = {
    day: number; // 0..100 (higher is better)
    week: number; // 0..100
    flags: string[]; // human-readable hints
};

export function calcRecovery({ minutes, hardConditioning, easyConditioning, assistanceVolumeScore = 0.5 }: RecoveryInput): RecoveryScore {
    // Simple heuristic: minutes beyond 75 reduce day score; conditioning adds weekly load.
    const dayBase = 100 - Math.max(0, minutes - 60) * 0.8 - Math.max(0, minutes - 90) * 0.6;
    const day = Math.max(0, Math.min(100, Math.round(dayBase - assistanceVolumeScore * 10)));

    const condLoad = hardConditioning * 10 + easyConditioning * 4;
    const weekBase = 100 - condLoad;
    const week = Math.max(0, Math.min(100, Math.round(weekBase)));

    const flags: string[] = [];
    if (minutes > 90) flags.push("Session exceeds 90 minutes");
    if (hardConditioning > 2) flags.push("Hard conditioning > 2x/week");
    if (week < 60) flags.push("Weekly recovery is low");
    return { day, week, flags };
}

export function autoTrimTo60(minutes: number) {
    return Math.min(60, Math.max(0, Math.round(minutes)));
}
