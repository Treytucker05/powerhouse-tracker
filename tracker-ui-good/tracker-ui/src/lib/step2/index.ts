// Step 2: Scheme & Template card hydrators (pure, no side effects)

import schemesPack from '@/packs/schemes.json';
import templatesPack from '@/packs/templates.json';
import logicPack from '@/packs/logic.json';

type SchemeId = 'scheme_531' | 'scheme_351' | 'scheme_5spro';
type TemplateId =
    | 'bbb'
    | 'triumvirate'
    | 'periodization_bible'
    | 'bodyweight'
    | 'jackshit';

type SchemeSet = {
    reps: number;
    percentage: number; // percent of TM, e.g. 65
    isAmrap: boolean;
};

type SchemeWeek = {
    isDeload: boolean;
    sets: SchemeSet[];
};

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

export type SchemeCard = {
    id: SchemeId;
    name: string;
    weeks: SchemeWeek[];
    amrapPolicy: {
        amrapOnDeload: false;
        amrapOnWorkWeeks: boolean; // false for 5s Pro, true otherwise
    };
    notes?: string;
};

export type TemplateCard = {
    id: TemplateId;
    name: string;
    timePerSession: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    defaultAssistance: string[]; // category labels only
    supplementalSummary: string; // e.g., "BBB 5×10 @ 50% TM" or "None"
    deloadPolicy: 'ON' | 'OFF';
    why?: string;
};

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
    const out: SchemeCard[] = Object.values(_schemes.schemes).map((s) => {
        const is5sPro = s.id === 'scheme_5spro';
        return {
            id: s.id,
            name: s.name,
            weeks: s.weeks,
            amrapPolicy: {
                amrapOnDeload: false,
                amrapOnWorkWeeks: is5sPro ? false : true
            }
        };
    });
    // Determinism guard: ensure deload week sets have isAmrap=false; do not mutate source packs
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
