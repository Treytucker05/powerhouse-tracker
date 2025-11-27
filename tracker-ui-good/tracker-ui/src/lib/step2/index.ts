// Step 2: Scheme & Template card hydrators (pure, no side effects)

import schemesPack from '@/packs/schemes.json';
import templatesPack from '@/packs/templates.json';
import logicPack from '@/packs/logic.json';
import type { SchemeId, TemplateId, SchemeWeek, SchemeCard, TemplateCard } from './types';

// ...existing code...

type SchemePack = {
    version: string;
    lastUpdated: string;
    schemes: Record<
        SchemeId,
        {
            id: SchemeId;
            name: string;
            weeks: SchemeWeek[];
        }
    >;
};

type TemplatePack = {
    version: string;
    lastUpdated: string;
    templates: Record<
        TemplateId,
        {
            id: TemplateId;
            name: string;
            supplemental:
            | { type: 'bbb' | 'fsl' | 'ssl'; sets?: number; reps?: number; percentage?: number; contentReference?: string }
            | { type: 'none' };
            assistance: Array<{
                category: 'Push' | 'Pull' | 'Single-leg' | 'Single-leg/Core' | 'Core';
                volume?: string;
                contentReference?: string;
            }>;
            compatibleSchemes: SchemeId[];
            timePerSession: string; // minutes range string
            deloadPolicy: 'ON' | 'OFF';
            why?: string;
        }
    >;
};

type LogicPack = {
    version: string;
    lastUpdated: string;
    progression: {
        upperLb: number;
        lowerLb: number;
        upperKg: number;
        lowerKg: number;
    };
    rounding: {
        lb: { default: number; micro: number };
        kg: { default: number; micro: number };
    };
    features: { leaderAnchor: boolean; seventhWeek: boolean };
};

// Legacy human-readable AMRAP policy strings (kept for backward compatibility with older UI/tests)
const AMRAP_POLICY_LABEL: Record<SchemeId, string> = {
    scheme_531: 'AMRAP on last set; NO AMRAP on deload (40/50/60)',
    scheme_351: 'AMRAP on last set; NO AMRAP on deload (40/50/60)',
    scheme_5spro: 'NO AMRAP (5s Pro); all sets prescribed; deload has no AMRAP'
};

// Structured flags for new deterministic logic usage
const AMRAP_FLAGS: Record<
    SchemeId,
    { lastSet: boolean; deload: false; scheme5spro: boolean; seventhWeek: false }
> = {
    scheme_531: { lastSet: true, deload: false, scheme5spro: false, seventhWeek: false },
    scheme_351: { lastSet: true, deload: false, scheme5spro: false, seventhWeek: false },
    scheme_5spro: { lastSet: false, deload: false, scheme5spro: true, seventhWeek: false }
};

// Types moved to types.ts for reuse

const _schemes = schemesPack as unknown as SchemePack;
const _templates = templatesPack as unknown as TemplatePack;
const _logic = logicPack as unknown as LogicPack;

// Heuristic difficulty from time string; stable & pure
function inferDifficulty(timePerSession: string): 'easy' | 'moderate' | 'hard' {
    // Parse "min-max" minutes; fall back to moderate
    const m = /(\d+)\s*-\s*(\d+)/.exec(timePerSession);
    if (!m) return 'moderate';
    const avg = (parseInt(m[1], 10) + parseInt(m[2], 10)) / 2;
    if (avg < 50) return 'easy';
    if (avg <= 70) return 'moderate';
    return 'hard';
}

function supplementalToSummary(t: TemplatePack['templates'][TemplateId]['supplemental']): string {
    if (t.type === 'none') return 'None';
    const parts: string[] = [t.type.toUpperCase()];
    if (typeof t.sets === 'number' && typeof t.reps === 'number') parts.push(`${t.sets}×${t.reps}`);
    if (typeof t.percentage === 'number') parts.push(`@ ${t.percentage}% TM`);
    return parts.join(' ').trim();
}

export function step2_scheme_cards(): SchemeCard[] {
    const out: SchemeCard[] = Object.values(_schemes.schemes).map((s) => ({
        id: s.id,
        name: s.name,
        weeks: s.weeks,
        amrapPolicy: AMRAP_POLICY_LABEL[s.id],
        amrapFlags: AMRAP_FLAGS[s.id]
    }));
    // Determinism guard: ensure deload week sets have isAmrap=false
    return out.map((card) => ({
        ...card,
        weeks: card.weeks.map((w) =>
            w.isDeload
                ? { ...w, sets: w.sets.map((set) => ({ ...set, isAmrap: false })) }
                : w
        )
    }));
}

export function step2_template_cards(): TemplateCard[] {
    return Object.values(_templates.templates).map((t) => ({
        id: t.id,
        name: t.name,
        timePerSession: t.timePerSession,
        difficulty: inferDifficulty(t.timePerSession),
        defaultAssistance: Array.from(
            new Set(
                t.assistance.map((a) =>
                    a.category === 'Single-leg/Core' ? 'Single-leg' : a.category
                )
            )
        ),
        supplementalSummary: supplementalToSummary(t.supplemental),
        deloadPolicy: t.deloadPolicy,
        why: t.why
    }));
}

// Expose logic pack snapshot if needed downstream (no mutations)
export function step2_logic_snapshot() {
    return _logic;
}

export const step2 = { step2_scheme_cards, step2_template_cards, step2_logic_snapshot };
export type Step2API = typeof step2;
