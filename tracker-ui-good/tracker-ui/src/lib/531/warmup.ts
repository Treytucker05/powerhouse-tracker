export type MainPattern = '531' | '3/5/1' | '5s PRO';

export interface WarmupPlanInput {
    mainPattern: MainPattern;
    jumpsThrowsDose: number;
    mobility?: string;
    jump?: string;
    throw?: string;
    novFullPrep?: boolean;
}

export interface WarmupPlan {
    title: string;
    lines: string[];
}

/**
 * Build a simple warm-up interleaver plan based on selected pattern and NOV toggle.
 * Keep it lightweight for preview/export; the training engine can override later.
 */
export function buildWarmupPlan({
    mainPattern,
    jumpsThrowsDose,
    mobility,
    jump,
    throw: thr,
    novFullPrep,
}: WarmupPlanInput): WarmupPlan {
    const lines: string[] = [];

    if (novFullPrep) {
        lines.push('5–8 min easy cardio');
        if (mobility) lines.push(`Mobility: ${mobility} (2–3 drills)`);
        else lines.push('Mobility circuit: hips, t‑spine, shoulders');
        lines.push('Core activation: dead bug / bird dog / plank');
    } else if (mobility) {
        lines.push(`Mobility: ${mobility}`);
    }

    // Bar progression by pattern (generic)
    if (mainPattern === '5s PRO') {
        lines.push('Bar x5, 40% x5, 50% x5, 60% x5');
    } else if (mainPattern === '3/5/1') {
        lines.push('Bar x5, 40% x5, 50% x5, 60% x3');
    } else {
        // 531
        lines.push('Bar x5, 40% x5, 50% x5, 60% x3');
    }

    // Jumps/throws guidance
    const jumpName = jump || 'Jumps';
    const throwName = thr || '';
    const jtTotal = Math.max(0, Math.round(jumpsThrowsDose || 0));
    if (jtTotal > 0) {
        const parts: string[] = [];
        parts.push(`${jumpName}`);
        if (throwName) parts.push(`${throwName}`);
        lines.push(`Thread ${parts.join(' + ')} across warm-ups (${jtTotal} total reps)`);
    }

    return { title: 'Warm‑up', lines };
}
