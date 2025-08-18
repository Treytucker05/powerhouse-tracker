import { packs, getScheme } from '../packs';

export type BuilderState = {
    units: 'lb' | 'kg';
    rounding: number; // increment (e.g. 2.5 for kg micro, 5 for lb)
    tmPercent: 0.85 | 0.9;
    tms: { press: number; deadlift: number; bench: number; squat: number };
    schemeId: keyof typeof packs['schemes'];
    templateId: keyof typeof packs['templates'] | null;
    frequency: 2 | 3 | 4;
    warmupId: 'standard' | 'minimalist' | 'jumps_integrated';
    assistanceMode: 'minimal' | 'balanced' | 'template' | 'custom';
    conditioningPreset: 'minimal' | 'standard' | 'extensive';
    populationTag?: string; // dynamic; resolved at runtime
};

export const roundTo = (val: number, step: number, _units: 'lb' | 'kg') => {
    const r = Math.round(val / step) * step;
    return Number(r.toFixed(2));
};

// Basic extraction helpers based on assumed shapes (actual JSON supplies fields)
const extractWeeks = (scheme: any) => scheme.weeks || [];
const extractTemplateMeta = (tpl: any) => tpl.meta || tpl.params || {};

const resolveSupplemental = (
    templateId: BuilderState['templateId'],
    lift: keyof BuilderState['tms'],
    tms: BuilderState['tms'],
    week: any
) => {
    if (!templateId) return null;
    // Placeholder logic: actual percentages drawn from template JSON once present
    if (templateId === 'bbb') {
        const pct = week?.sets?.[week.sets.length - 1]?.pctOfTM || 0.5; // fallback
        const weight = tms[lift] * pct;
        return { type: 'BBB', sets: Array.from({ length: 5 }, () => ({ reps: 10, pct, weight })) };
    }
    // FSL/SSL not yet part of template set; left for future expansion.
    return null;
};

const resolveAssistance = (state: BuilderState, lift: keyof BuilderState['tms']) => {
    if (state.assistanceMode === 'custom') return [];
    if (state.assistanceMode === 'template' && state.templateId) {
        return [{ name: 'TEMPLATE_ASSIST', targetReps: 50 }];
    }
    if (state.assistanceMode === 'minimal') {
        return [
            { group: 'push', target: 25 },
            { group: 'pull', target: 25 }
        ];
    }
    // balanced
    return [
        { group: 'push', target: 30 },
        { group: 'pull', target: 30 },
        { group: 'single', target: 20 },
        { group: 'core', target: 30 }
    ];
};

const resolveConditioning = (state: BuilderState) => {
    return { preset: state.conditioningPreset };
};

export const renderMap = {
    step1_fundamentals(state: BuilderState) {
        const scheme = getScheme(state.schemeId);
        const weeks = extractWeeks(scheme);
        const tmTable = Object.entries(state.tms).map(([lift, tm]) => ({ lift, tm, trainingMax: tm * state.tmPercent }));
        return { tmTable, helper: { weeks: weeks.length } };
    },
    step2_template_cards() {
        return Object.entries(packs.templates).map(([id, tpl]) => ({
            id,
            title: (tpl as any).name || id,
            difficulty: (tpl as any).difficulty || 'n/a',
            timePerSession: (tpl as any).time || 60,
            defaultAssistance: (tpl as any).assistance || [],
            deloadPolicy: (tpl as any).deload || 'standard',
            why: (tpl as any).rationale || ''
        }));
    },
    step2_scheme_cards() {
        return Object.entries(packs.schemes).map(([id, scheme]) => ({
            id,
            title: (scheme as any).name || id,
            weeks: extractWeeks(scheme).length,
            amrapFlags: extractWeeks(scheme).map((w: any) => w.sets?.some((s: any) => s.amrap))
        }));
    },
    step3_defaults_from_template(templateId: keyof typeof packs['templates'] | null) {
        if (!templateId) return null;
        const tpl = packs.templates[templateId];
        const meta = extractTemplateMeta(tpl);
        return {
            schedule: meta.schedule || null,
            warmups: meta.warmups || null,
            programming: meta.programming || null,
            deload: meta.deload || 'standard',
            supplemental: meta.supplemental || null,
            assistance: meta.assistance || null,
            conditioning: meta.conditioning || null
        };
    },
    step3_catalogs() {
        return {
            warmups: packs.catalogs.warmups,
            assistanceGroups: packs.catalogs.assistance,
            conditioning: packs.catalogs.conditioning,
            leaderAnchor: packs.logic.leader_anchor,
            populations: packs.modifiers.populations,
            injury: packs.modifiers.injury,
            sport: packs.modifiers.sport_integration
        };
    },
    step4_cycle_preview(state: BuilderState) {
        const scheme = getScheme(state.schemeId);
        const weeks = extractWeeks(scheme);
        const outWeeks = weeks.map((w: any, wi: number) => {
            const main = Object.keys(state.tms).map(lift => {
                const tm = state.tms[lift as keyof BuilderState['tms']] * state.tmPercent;
                const sets = (w.sets || []).map((s: any) => ({
                    pct: s.pctOfTM,
                    reps: s.reps,
                    amrap: !!s.amrap,
                    weight: roundTo(tm * s.pctOfTM, state.rounding, state.units)
                }));
                return {
                    lift,
                    warmup: { id: state.warmupId },
                    mainSets: sets,
                    supplemental: resolveSupplemental(state.templateId, lift as any, state.tms, w),
                    assistance: resolveAssistance(state, lift as any)
                };
            });
            return { week: wi + 1, main };
        });
        return {
            weeks: outWeeks,
            conditioning: resolveConditioning(state),
            summary: { totalWeeks: outWeeks.length },
            footer: { note: 'All weights rounded.' }
        };
    }
};

export type RenderMap = typeof renderMap;
export { resolveSupplemental, resolveAssistance, resolveConditioning };
