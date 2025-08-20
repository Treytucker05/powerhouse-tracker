// src/lib/step4/index.ts
import type {
    Step4State, CyclePreview, DayPreview, Lift, SchemeId, PreviewSet, PreviewSupplemental
} from './types';

// Packs (fallback-friendly)
import schemesPack from '@/packs/schemes.json';
import deloadPack from '@/packs/logic/deload.json';

// ---- Deterministic helpers ----

const OPPO: Record<Lift, Lift> = { squat: 'deadlift', deadlift: 'squat', bench: 'press', press: 'bench' };

function toTMMap(state: Step4State): Record<Lift, number> {
    const lifts: Lift[] = ['press', 'deadlift', 'bench', 'squat'];
    const table = {} as Record<Lift, number>;
    for (const l of lifts) {
        const tm = state.tm?.[l];
        if (typeof tm === 'number' && tm > 0) { table[l] = tm; continue; }
        const max = state.oneRm?.[l];
        table[l] = typeof max === 'number' && max > 0 ? max * 0.9 : 0; // start-too-light
    }
    return table;
}

function inc(unit: 'lb' | 'kg', micro: boolean) {
    return unit === 'lb' ? (micro ? 2.5 : 5) : (micro ? 1 : 2.5);
}
function roundToLoad(x: number, unit: 'lb' | 'kg', micro: boolean): number {
    const step = inc(unit, micro);
    return Math.round(x / step) * step;
}

// Scheme fallback (if packs missing)
type SchemeWeek = { sets: { reps: number; pct: number; amrap: boolean }[]; deload?: boolean };
const FALLBACK_SCHEMES: Record<SchemeId, SchemeWeek[]> = {
    scheme_531: [
        // Week1 65/75/85 (AMRAP last)
        { sets: [{ reps: 5, pct: 0.65, amrap: false }, { reps: 5, pct: 0.75, amrap: false }, { reps: 5, pct: 0.85, amrap: true }] },
        // Week2 70/80/90
        { sets: [{ reps: 3, pct: 0.70, amrap: false }, { reps: 3, pct: 0.80, amrap: false }, { reps: 3, pct: 0.90, amrap: true }] },
        // Week3 75/85/95 (1+)
        { sets: [{ reps: 5, pct: 0.75, amrap: false }, { reps: 3, pct: 0.85, amrap: false }, { reps: 1, pct: 0.95, amrap: true }] },
        // Deload marker; actual % replaced by deload rules
        { sets: [], deload: true }
    ],
    scheme_351: [
        // Week1: 3s first
        { sets: [{ reps: 3, pct: 0.70, amrap: false }, { reps: 3, pct: 0.80, amrap: false }, { reps: 3, pct: 0.90, amrap: true }] },
        // Week2: 5s
        { sets: [{ reps: 5, pct: 0.65, amrap: false }, { reps: 5, pct: 0.75, amrap: false }, { reps: 5, pct: 0.85, amrap: false }] }, // often no AMRAP here
        // Week3: 5/3/1
        { sets: [{ reps: 5, pct: 0.75, amrap: false }, { reps: 3, pct: 0.85, amrap: false }, { reps: 1, pct: 0.95, amrap: true }] },
        { sets: [], deload: true }
    ],
    scheme_5spro: [
        // Prescribed 5s only, no AMRAP
        { sets: [{ reps: 5, pct: 0.65, amrap: false }, { reps: 5, pct: 0.75, amrap: false }, { reps: 5, pct: 0.85, amrap: false }] },
        { sets: [{ reps: 5, pct: 0.70, amrap: false }, { reps: 5, pct: 0.80, amrap: false }, { reps: 5, pct: 0.85, amrap: false }] },
        { sets: [{ reps: 5, pct: 0.75, amrap: false }, { reps: 5, pct: 0.85, amrap: false }, { reps: 5, pct: 0.90, amrap: false }] },
        { sets: [], deload: true }
    ]
};

function getSchemeWeeks(id: SchemeId): SchemeWeek[] {
    const fromPack = (() => {
        // For robustness: schemesPack may be object keyed or array; try both.
        if (Array.isArray((schemesPack as any)?.schemes)) {
            const arr = (schemesPack as any).schemes;
            const found = arr.find((s: any) => s.id === id);
            if (found?.weeks) {
                return found.weeks.map((w: any) => ({
                    deload: !!w.isDeload,
                    sets: Array.isArray(w.sets) ? w.sets.map((st: any) => ({
                        reps: st.reps,
                        pct: (st.percentage ?? 0) / 100,
                        amrap: !!st.isAmrap
                    })) : []
                }));
            }
        } else if ((schemesPack as any)?.schemes?.[id]) {
            const found = (schemesPack as any).schemes[id];
            if (found?.weeks) {
                return found.weeks.map((w: any) => ({
                    deload: !!w.isDeload,
                    sets: Array.isArray(w.sets) ? w.sets.map((st: any) => ({
                        reps: st.reps,
                        pct: (st.percentage ?? 0) / 100,
                        amrap: !!st.isAmrap
                    })) : []
                }));
            }
        }
        return null;
    })();
    return fromPack ?? FALLBACK_SCHEMES[id];
}

function deloadPrescription(mode: '40/50/60') {
    // Pack can override but we lock AMRAP=false.
    const p = (deloadPack as any)?.percentages ?? [40, 50, 60];
    const arr = (Array.isArray(p) ? p : [40, 50, 60]).map((x: number) => ({ reps: 5, pct: x / 100, amrap: false }));
    return arr.length ? arr : [{ reps: 5, pct: 0.4, amrap: false }, { reps: 5, pct: 0.5, amrap: false }, { reps: 5, pct: 0.6, amrap: false }];
}

function formatReps(set: PreviewSet, schemeId: SchemeId, isDeload: boolean): string {
    if (isDeload) return `${set.reps}`; // no AMRAP label on deload
    if (schemeId === 'scheme_5spro') return `${set.reps}`; // prescribed only
    return set.amrap ? `${set.reps}+` : `${set.reps}`;
}

// ---- Supplemental builder ----

function buildSupplemental(
    state: Step4State, dayLift: Lift, tm: number, unit: 'lb' | 'kg', micro: boolean
): PreviewSupplemental | undefined {
    const s = state.supplemental;
    if (s.type === 'none') return undefined;

    // BBB/FSL/SSL share pct-of-TM concept in our preview layer.
    let pct = s.pctOfTM;
    if (!pct) {
        if (s.type === 'bbb') pct = 0.5;
        else if (s.type === 'fsl') pct = 0.65; // first-set weight (week1)
        else if (s.type === 'ssl') pct = 0.75; // second-set weight (week1)
        else pct = 0;
    }
    const sets = s.sets ?? (s.type === 'bbb' ? 5 : 5);
    const reps = s.reps ?? (s.type === 'bbb' ? 10 : 5);
    const weightRaw = tm * pct;
    const weight = roundToLoad(weightRaw, unit, micro);

    return {
        type: s.type,
        sets, reps, pct,
        weightRaw, weight,
        pairing: s.pairing ?? 'same'
    };
}

// ---- Main API ----

export function step4_cycle_preview(state: Step4State): CyclePreview {
    const unit = state.unit;
    const micro = state.microplates;
    const tmTable = toTMMap(state);
    const weeks = getSchemeWeeks(state.schemeId);

    const days: DayPreview[] = [];
    // 4-week wave * scheduled order
    for (let w = 0; w < 4; w++) {
        const isDeload = weeks[w]?.deload || (w === 3); // sentinel week4
        const setsRaw = isDeload
            ? deloadPrescription(state.deload.mode)
            : (weeks[w]?.sets ?? []);

        for (const lift of state.schedule.order) {
            const tm = tmTable[lift] ?? 0;
            const main: PreviewSet[] = setsRaw.map((st: { reps: number; pct: number; amrap: boolean }, idx: number) => {
                // AMRAP policy:
                const baseAmrap = st.amrap === true;
                const amrap =
                    isDeload ? false :
                        (state.schemeId === 'scheme_5spro' ? false : baseAmrap);
                const weightRaw = tm * st.pct;
                const weight = roundToLoad(weightRaw, unit, micro);
                const m: PreviewSet = {
                    reps: String(st.reps), pct: st.pct, weightRaw, weight, amrap
                };
                m.reps = formatReps(m, state.schemeId, isDeload);
                return m;
            });

            // Supplemental (paired lift logic for display weight source)
            let supp = buildSupplemental(state, lift, tm, unit, micro);
            if (supp && supp.pairing === 'opposite') {
                const oppoTM = tmTable[OPPO[lift]] ?? 0;
                const weightRaw = oppoTM * supp.pct;
                supp = { ...supp, weightRaw, weight: roundToLoad(weightRaw, unit, micro) };
            }

            // Assistance target display
            const assistanceTargets = state.assistance.buckets.map(b => ({
                bucket: b,
                min: state.assistance.targetRepsPerBucket[0],
                max: state.assistance.targetRepsPerBucket[1]
            }));

            days.push({
                lift,
                weekIndex: (w + 1) as 1 | 2 | 3 | 4,
                main,
                supplemental: supp,
                assistanceTargets: assistanceTargets.length ? assistanceTargets : undefined
            });
        }
    }

    return { unit, microplates: micro, schemeId: state.schemeId, days, tmTable };
}
