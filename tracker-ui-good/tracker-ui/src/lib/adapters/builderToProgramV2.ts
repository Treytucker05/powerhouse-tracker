// Adapter: map Builder (steps 1–3) state to ProgramContextV2-compatible snapshot
// Non-invasive: pure functions + optional localStorage writer. UI can call this to seed the v2 engine.

type Units = 'lb' | 'kg';

export interface Step1Like {
    units: Units;
    rounding: number;
    tmPct: number; // 0.85 | 0.9 typically
    tmTable: Record<string, number>;
}
export interface Step2Like { schemeId?: string; templateId?: string }
export interface Step3Like {
    scheduleFrequency?: 2 | 3 | 4;
    liftOrder?: string[];
    liftRotation?: string[][];
    warmupsEnabled?: boolean;
    warmupScheme?: 'standard' | 'minimalist' | 'jumps_integrated' | 'custom' | string;
    customWarmups?: Array<{ pct: number; reps: number }>;
    mainSetOption?: 1 | 2;
    deload?: boolean;
    supplemental?: string; // 'bbb'|'fsl'|'ssl'|'widowmakers'|'none'
    assistanceMode?: 'minimal' | 'balanced' | 'template' | 'custom' | string;
}

export function computeWarmupScheme(step3: Step3Like) {
    const id = step3.warmupScheme || 'standard';
    if (id === 'custom' && Array.isArray(step3.customWarmups) && step3.customWarmups.length) {
        return {
            percentages: step3.customWarmups.map(r => r.pct),
            reps: step3.customWarmups.map(r => r.reps)
        };
    }
    if (id === 'minimalist') return { percentages: [40, 55], reps: [5, 3] };
    // jumps_integrated previews same ramp as standard at engine level
    return { percentages: [40, 50, 60], reps: [5, 5, 3] };
}

function mapAssistanceMode(id?: string) {
    const m = (id || '').toLowerCase();
    if (m === 'minimal' || m === 'template' || m === 'custom') return m;
    return 'balanced';
}

function mapSupplemental(id?: string) {
    const k = (id || 'none').toLowerCase();
    if (['bbb', 'fsl', 'ssl', 'widowmakers', 'widowmaker', 'none'].includes(k)) return k === 'widowmaker' ? 'widowmakers' : k;
    return 'none';
}

export function makeV2FromBuilder(step1: Step1Like, step2: Step2Like, step3: Step3Like) {
    const frequency = step3.scheduleFrequency || 4;
    const order = (frequency === 4 ? (step3.liftOrder && step3.liftOrder.length === 4 ? step3.liftOrder : ['press', 'deadlift', 'bench', 'squat'])
        : (step3.liftRotation && step3.liftRotation.length ? step3.liftRotation[0] : (frequency === 3 ? ['press', 'deadlift', 'bench'] : ['press', 'deadlift'])));
    const warmupScheme = computeWarmupScheme(step3);
    const supplemental = mapSupplemental(step3.supplemental);
    const assistanceMode = mapAssistanceMode(step3.assistanceMode);

    // Build a minimal V2-like snapshot (fields merged by ProgramContextV2 on hydrate)
    const v2 = {
        // Advisory: carry builder template/scheme into v2 store for downstream consumers
        templateKey: step2?.templateId || null,
        template: step2?.templateId || 'custom',
        units: step1.units,
        rounding: step1.rounding === 2.5 && step1.units === 'kg' ? 'nearest' : 'nearest', // keep simplify: UI controls inc elsewhere
        tmPct: step1.tmPct,
        trainingMaxes: { ...step1.tmTable },
        lifts: {
            press: { name: 'press', tm: step1.tmTable.press, trainingMax: step1.tmTable.press },
            deadlift: { name: 'deadlift', tm: step1.tmTable.deadlift, trainingMax: step1.tmTable.deadlift },
            bench: { name: 'bench', tm: step1.tmTable.bench, trainingMax: step1.tmTable.bench },
            squat: { name: 'squat', tm: step1.tmTable.squat, trainingMax: step1.tmTable.squat }
        },
        schedule: {
            frequency: frequency === 4 ? '4day' : frequency === 3 ? '3day' : '2day',
            order,
            includeWarmups: !!step3.warmupsEnabled,
            warmupScheme,
            // carry schemeId from builder Step 2
            schemeId: step2?.schemeId || 'scheme_531'
        },
        loading: { option: step3.mainSetOption || 1, includeDeload: !!step3.deload },
        supplemental: { strategy: supplemental },
        assistance: { mode: assistanceMode }
    } as any;
    return v2;
}

export function writeProgramV2ToLocalStorage(state: any) {
    try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('ph_program_v2', JSON.stringify(state)); } catch { /* ignore */ }
}
