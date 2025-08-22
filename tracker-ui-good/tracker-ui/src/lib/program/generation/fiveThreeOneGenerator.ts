// Lightweight 5/3/1 program generation utility (UI-first)
// Produces a simplified program structure for Step 4 preview.

export interface GeneratedSet {
    pct: number;
    reps: string;
    weight?: number;
    type: 'work' | 'amrap' | 'deload';
}

export interface GeneratedMainLiftDay {
    lift: string;
    week: number;
    dayIndex: number;
    sets: GeneratedSet[];
    notes?: string;
}

export interface GeneratedDaySummary {
    main?: GeneratedMainLiftDay;
    warmup?: string;
    supplemental?: string;
    assistance?: string;
}

export interface GeneratedWeek {
    week: number;
    days: GeneratedDaySummary[];
    isDeload?: boolean;
}

export interface Generate531ProgramParams {
    tms: Record<string, number>;
    scheduleFrequency: 2 | 3 | 4;
    includeDeload: boolean;
    rounding: number;
    schemeId?: 'scheme_531' | 'scheme_351' | 'scheme_5spro';
    supplemental?: string;
    assistanceMode?: string;
    liftOrder?: string[]; // explicit 4-day ordering
    liftRotation?: string[][]; // for 2 & 3 day (each inner array length == scheduleFrequency)
    mainSetOption?: 1 | 2; // Option 1 (default) vs Option 2 percentage pattern
    warmupsEnabled?: boolean;
    warmupScheme?: 'standard' | 'minimalist' | 'jumps_integrated' | 'custom';
    variants?: Record<string, string>; // per-lift variant codes (press, bench, squat, deadlift)
}

export interface GeneratedProgram531 {
    methodology: '531';
    weeks: GeneratedWeek[];
    params: Generate531ProgramParams;
    meta: { mainLiftsPlanned: string[]; variantLabels?: Record<string, string> };
}

// Percentage tables for main set Options (used for classic 5/3/1 only)
const WEEK_PCTS_OPTION: Record<1 | 2, Record<number, [number, number, number]>> = {
    1: {
        1: [65, 75, 85],
        2: [70, 80, 90],
        3: [75, 85, 95]
    },
    2: {
        1: [75, 80, 85],
        2: [80, 85, 90],
        3: [85, 90, 95]
    }
};
const DELOAD_PCTS: [number, number, number] = [40, 50, 60];

const MAIN_LIFT_ORDER_4 = ['press', 'deadlift', 'bench', 'squat'];
const MAIN_LIFT_ORDER_3 = ['press', 'deadlift', 'squat'];
const MAIN_LIFT_ORDER_2 = ['press', 'deadlift'];

function roundTo(weight: number, inc: number) {
    if (!inc) return Math.round(weight);
    return Math.round(weight / inc) * inc;
}

function buildMainDay(
    lift: string,
    week: number,
    tm: number,
    rounding: number,
    mainSetOption: 1 | 2,
    schemeId: 'scheme_531' | 'scheme_351' | 'scheme_5spro' = 'scheme_531'
): GeneratedMainLiftDay {
    if (!tm || tm <= 0) return { lift, week, dayIndex: 0, sets: [], notes: 'TM missing' };
    let pcts: [number, number, number];
    let reps: [string, string, string];
    let amrapIdx = 2; // last set by default

    if (schemeId === 'scheme_351') {
        // 3/5/1 ordering by week
        if (week === 1) { pcts = [70, 80, 90]; reps = ['3', '3', '3+']; amrapIdx = 2; }
        else if (week === 2) { pcts = [65, 75, 85]; reps = ['5', '5', '5']; amrapIdx = -1; /* no AMRAP typical */ }
        else { pcts = [75, 85, 95]; reps = ['5', '3', '1+']; amrapIdx = 2; }
    } else if (schemeId === 'scheme_5spro') {
        // 5s Pro: prescribed 5s ONLY, no AMRAP
        if (week === 1) { pcts = [65, 75, 85]; }
        else if (week === 2) { pcts = [70, 80, 85]; }
        else { pcts = [75, 85, 90]; }
        reps = ['5', '5', '5']; amrapIdx = -1;
    } else {
        const opt = (mainSetOption === 2 ? 2 : 1);
        pcts = WEEK_PCTS_OPTION[opt][week];
        reps = week === 1 ? ['5', '5', '5+'] : week === 2 ? ['3', '3', '3+'] : ['5', '3', '1+'];
        amrapIdx = 2;
    }

    const sets: GeneratedSet[] = pcts.map((pct, idx) => ({
        pct,
        reps: reps[idx],
        weight: roundTo(tm * (pct / 100), rounding),
        type: idx === amrapIdx ? 'amrap' : 'work'
    }));
    return { lift, week, dayIndex: 0, sets, notes: `Week ${week} main work (${schemeId.replace('scheme_', '')})` };
}

function buildDeloadDay(lift: string, tm: number, rounding: number): GeneratedMainLiftDay {
    const sets: GeneratedSet[] = DELOAD_PCTS.map(pct => ({ pct, reps: '5', weight: roundTo(tm * (pct / 100), rounding), type: 'deload' }));
    return { lift, week: 4, dayIndex: 0, sets, notes: 'Deload' };
}

export function generate531Program(params: Generate531ProgramParams): GeneratedProgram531 {
    const { tms, scheduleFrequency, includeDeload, rounding, schemeId = 'scheme_531', supplemental, assistanceMode, liftOrder, liftRotation, mainSetOption = 1, warmupsEnabled, warmupScheme, variants } = params;
    const baseOrder = scheduleFrequency === 4 ? (liftOrder && liftOrder.length === 4 ? liftOrder : MAIN_LIFT_ORDER_4)
        : scheduleFrequency === 3 ? MAIN_LIFT_ORDER_3 : MAIN_LIFT_ORDER_2;
    const weeks: GeneratedWeek[] = [];
    for (let week = 1; week <= 3; week++) {
        const days: GeneratedDaySummary[] = [];
        const rotationWeek = (scheduleFrequency < 4 && liftRotation && liftRotation.length > 0)
            ? liftRotation[(week - 1) % liftRotation.length]
            : undefined;
        for (let d = 0; d < scheduleFrequency; d++) {
            const lift = rotationWeek ? rotationWeek[d] : baseOrder[d % baseOrder.length];
            const main = buildMainDay(lift, week, tms[lift] || 0, rounding, mainSetOption, schemeId);
            main.dayIndex = d + 1;
            // Warm-up descriptor (simple text for preview)
            const warmup = (() => {
                if (!warmupsEnabled) return undefined;
                switch (warmupScheme) {
                    case 'minimalist': return 'Warm-up: 40%×5, 55%×3';
                    case 'jumps_integrated': return 'Warm-up: 3–5 Jumps/Throws + 40%×5, 50%×5, 60%×3';
                    case 'custom': return 'Warm-up: Custom ramp';
                    default: return 'Warm-up: 40%×5, 50%×5, 60%×3';
                }
            })();
            // Supplemental descriptor
            const suppText = (() => {
                if (!supplemental) return undefined;
                const sup = supplemental.toLowerCase();
                if (sup === 'bbb') {
                    const pct = 50; // first cycle guidance
                    const w = roundTo((tms[lift] || 0) * (pct / 100), rounding);
                    return `BBB 5×10 @ ${pct}% (${w})`;
                }
                if (sup === 'fsl') {
                    const fsl = main?.sets?.[0];
                    if (fsl && typeof fsl.weight === 'number') return `FSL sets @ ${fsl.pct}% (${fsl.weight})`;
                    return 'FSL sets (first-set weight)';
                }
                if (sup === 'ssl') {
                    const ssl = main?.sets?.[1];
                    if (ssl && typeof ssl.weight === 'number') return `SSL sets @ ${ssl.pct}% (${ssl.weight})`;
                    return 'SSL sets (second-set weight)';
                }
                if (sup === 'widowmakers' || sup === 'widowmaker') return 'Widowmaker set (high-rep finisher)';
                return `${supplemental.toUpperCase()} sets`;
            })();
            days.push({
                main,
                warmup,
                supplemental: suppText,
                assistance: assistanceMode ? `${assistanceMode} assistance` : undefined
            });
        }
        weeks.push({ week, days });
    }
    if (includeDeload) {
        const week = 4;
        const days: GeneratedDaySummary[] = [];
        const rotationWeek = (scheduleFrequency < 4 && liftRotation && liftRotation.length > 0)
            ? liftRotation[(week - 1) % liftRotation.length]
            : undefined;
        for (let d = 0; d < scheduleFrequency; d++) {
            const lift = rotationWeek ? rotationWeek[d] : baseOrder[d % baseOrder.length];
            const main = buildDeloadDay(lift, tms[lift] || 0, rounding);
            main.dayIndex = d + 1;
            days.push({ main, supplemental: 'Deload', assistance: 'Recovery focus' });
        }
        weeks.push({ week, days, isDeload: true });
    }
    // Collect variant labels (UI will map codes to readable labels; safe to echo codes here)
    const variantLabels: Record<string, string> = {};
    if (variants) Object.entries(variants).forEach(([k, v]) => { if (v) variantLabels[k] = v; });
    return { methodology: '531', weeks, params, meta: { mainLiftsPlanned: baseOrder, variantLabels: Object.keys(variantLabels).length ? variantLabels : undefined } };
}

export function tryGenerate531(params: Generate531ProgramParams | undefined): GeneratedProgram531 | undefined {
    if (!params) return undefined;
    const hasAnyTM = Object.values(params.tms || {}).some(v => v && v > 0);
    if (!hasAnyTM) return undefined;
    try { return generate531Program(params); } catch { return undefined; }
}
