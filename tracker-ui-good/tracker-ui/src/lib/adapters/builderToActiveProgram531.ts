// Build and start an Active 5/3/1 program from the Builder (Steps 1–3)
// Payload shape mirrors ProgramWizard531V2.handleStartCycle output for compatibility with Program531ActiveV2

import { buildMainSetsForLift, buildWarmupSets } from '@/methods/531';

type Units = 'lb' | 'kg' | 'lbs';

export interface BuilderStep1Like {
    units: Units;
    rounding: any; // number or { increment:number, mode?:'nearest'|'up'|'down' }
    tmPct: number;
    tmTable: Record<string, number>;
    deadliftRepStyle?: 'dead_stop' | 'touch_and_go' | string;
}
export interface BuilderStep2Like { templateId?: string; schemeId?: string }
export interface BuilderStep3Like {
    scheduleFrequency?: 2 | 3 | 4;
    liftOrder?: string[];
    liftRotation?: string[][];
    warmupsEnabled?: boolean;
    warmupScheme?: string | null;
    mainSetOption?: 1 | 2;
    deload?: boolean;
    supplemental?: string; // 'bbb'|'fsl'|'ssl'|'widowmakers'|'none'
    assistanceMode?: 'minimal' | 'balanced' | 'template' | 'custom' | string;
}

function humanLiftName(key: string) {
    if (key === 'press') return 'Press';
    return key.charAt(0).toUpperCase() + key.slice(1);
}

function oppositeOf(liftKey: string) {
    if (liftKey === 'press') return 'bench';
    if (liftKey === 'bench') return 'press';
    if (liftKey === 'squat') return 'deadlift';
    if (liftKey === 'deadlift') return 'squat';
    return liftKey;
}

function getRoundingConfig(units: Units, rounding: any) {
    if (typeof rounding === 'object' && rounding) {
        return { increment: rounding.increment || (units === 'kg' ? 2.5 : 5), mode: rounding.mode || 'nearest' };
    }
    const inc = (typeof rounding === 'number' && rounding > 0) ? rounding : (units === 'kg' ? 2.5 : 5);
    return { increment: inc, mode: 'nearest' as const };
}

export function buildActiveProgramPayloadFromBuilder(step1: BuilderStep1Like, step2: BuilderStep2Like, step3: BuilderStep3Like) {
    const units = (step1?.units as Units) || 'lb';
    const roundingCfg = getRoundingConfig(units, step1?.rounding);
    const loadingOption = step3?.mainSetOption || 1;
    const freq = Number(step3?.scheduleFrequency || 4) as 2 | 3 | 4;
    const defaultDays = ['press', 'deadlift', 'bench', 'squat'];
    const days = (() => {
        if (freq === 4) return (step3?.liftOrder && step3.liftOrder.length === 4) ? step3.liftOrder : defaultDays;
        if (Array.isArray(step3?.liftRotation) && step3!.liftRotation!.length > 0) {
            return step3!.liftRotation![0];
        }
        return defaultDays.slice(0, freq);
    })();

    const trainingMaxes = {
        squat: Number(step1?.tmTable?.squat || 0),
        bench: Number(step1?.tmTable?.bench || 0),
        deadlift: Number(step1?.tmTable?.deadlift || 0),
        press: Number(step1?.tmTable?.press || 0)
    };
    const tmKeys = Object.keys(trainingMaxes);
    const tmOk = tmKeys.every(k => trainingMaxes[k as keyof typeof trainingMaxes] > 0);
    if (!tmOk) throw new Error('Missing training maxes');

    const weeks: Array<any> = [];
    for (let w = 0; w < 4; w++) {
        const daysOut = days.map((liftKey, idx) => {
            const tm = trainingMaxes[liftKey as keyof typeof trainingMaxes] || 0;

            const warmups = buildWarmupSets({
                includeWarmups: !!step3?.warmupsEnabled,
                warmupScheme: step3?.warmupScheme,
                tm,
                roundingIncrement: roundingCfg.increment,
                roundingMode: roundingCfg.mode,
                units
            });

            const main = buildMainSetsForLift({
                tm,
                weekIndex: w,
                option: loadingOption,
                roundingIncrement: roundingCfg.increment,
                roundingMode: roundingCfg.mode,
                units
            });

            // Supplemental (minimal: only BBB handled explicitly here)
            let supplementalOut: any = null;
            const sup = (step3?.supplemental || 'none').toLowerCase();
            if (sup === 'bbb' && w !== 3) { // omit on deload week
                const pairing = 'same';
                const bbbLiftKey = liftKey;
                const bbbTm = trainingMaxes[bbbLiftKey as keyof typeof trainingMaxes] || 0;
                const pct = 50; // first cycle guidance
                // compute once using rounding increment/mode
                const raw = bbbTm * (pct / 100);
                const weight = Math.round(raw / roundingCfg.increment) * roundingCfg.increment;
                supplementalOut = { type: 'bbb', pairing, liftKey: bbbLiftKey, sets: 5, reps: 10, percentOfTM: pct, weight, units };
            }

            const assistanceOut: any = { mode: step3?.assistanceMode || 'minimal' };

            const dayObj: any = {
                day: idx + 1,
                liftKey,
                lift: humanLiftName(liftKey),
                warmups,
                main,
                assistance: assistanceOut
            };
            if (liftKey === 'deadlift' && step1?.deadliftRepStyle) {
                dayObj.repStyle = step1.deadliftRepStyle; // cue-only for UI
            }
            if (supplementalOut) dayObj.supplemental = supplementalOut;
            return dayObj;
        });
        const weekObj: any = { week: w + 1, days: daysOut };
        if (w === 3) weekObj.isDeload = true;
        weeks.push(weekObj);
    }

    const payload = {
        meta: {
            createdAt: new Date().toISOString(),
            templateKey: step2?.templateId || null,
            flowMode: 'custom',
            units,
            loadingOption
        },
        trainingMaxes,
        rounding: { increment: roundingCfg.increment, mode: roundingCfg.mode },
        schedule: {
            frequency: freq,
            days,
            includeWarmups: !!step3?.warmupsEnabled,
            warmupScheme: step3?.warmupScheme || null
        },
        supplemental: { strategy: (step3?.supplemental || 'none').toLowerCase() },
        assistance: { mode: step3?.assistanceMode || 'minimal' },
        // Conditioning omitted in builder path for now
        weeks
    };

    return payload;
}

export function startActiveProgramFromBuilder(step1: BuilderStep1Like, step2: BuilderStep2Like, step3: BuilderStep3Like) {
    const payload = buildActiveProgramPayloadFromBuilder(step1, step2, step3);
    localStorage.setItem('ph531.activeProgram.v2', JSON.stringify(payload));
    return payload;
}
