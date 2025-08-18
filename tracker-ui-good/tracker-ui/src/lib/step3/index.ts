import templates from '@/packs/templates.json';
import catalogsPack from '@/packs/catalogs.json';

// Public API types (also re-exported from types.ts if needed elsewhere)
export type TemplateId = 'bbb' | 'triumvirate' | 'periodization_bible' | 'bodyweight' | 'jackshit';
export type SchemeId = 'scheme_531' | 'scheme_351' | 'scheme_5spro';

// API shape per spec
export type Step3Defaults = {
    schedule: { frequency: 2 | 3 | 4; order: Array<'press' | 'deadlift' | 'bench' | 'squat'> };
    warmups: { mode: 'standard' | 'minimalist' | 'jumps_integrated' };
    programming: { schemeId: SchemeId; leaderAnchor?: { enabled: boolean; leader: number; anchor: number; seventhWeek: boolean } };
    deload: { enabled: boolean; mode: '40/50/60'; amrap: false };
    supplemental: { type: 'bbb' | 'fsl' | 'ssl' | 'none'; sets?: number; reps?: number; pctOfTM?: number; pairing?: 'same' | 'opposite' };
    assistance: { mode: 'template' | 'minimal' | 'balanced' | 'custom'; buckets: Array<'Push' | 'Pull' | 'Single-leg' | 'Core'>; targetRepsPerBucket: [number, number] };
    conditioning: { mode: 'minimal' | 'standard' | 'extensive'; weekly: { hard: number; easy: number }; presets: string[] };
};

export type Step3Catalogs = {
    assistance: { Push: string[]; Pull: string[]; 'Single-leg': string[]; Core: string[] };
    warmups: Array<'standard' | 'minimalist' | 'jumps_integrated'>;
    conditioning: { activities: string[]; presets: Array<'minimal' | 'standard' | 'extensive'> };
    supplemental: Array<'bbb' | 'fsl' | 'ssl' | 'none'>;
    schemes: Array<SchemeId>;
};

const TEMPLATE_IDS: TemplateId[] = ['bbb', 'triumvirate', 'periodization_bible', 'bodyweight', 'jackshit'];
const SCHEME_IDS: SchemeId[] = ['scheme_531', 'scheme_351', 'scheme_5spro'];
const WARMUP_MODES = ['standard', 'minimalist', 'jumps_integrated'] as const;
const SUPP_TYPES = ['bbb', 'fsl', 'ssl', 'none'] as const;
const CONDITIONING_PRESETS = ['minimal', 'standard', 'extensive'] as const;

// Deterministic mapping tables
const TEMPLATE_SCHEME: Record<TemplateId, SchemeId> = {
    bbb: 'scheme_531',
    triumvirate: 'scheme_531',
    periodization_bible: 'scheme_531',
    bodyweight: 'scheme_531',
    jackshit: 'scheme_351'
};

const TEMPLATE_DELOAD_ENABLED: Record<TemplateId, boolean> = {
    bbb: false,
    triumvirate: true,
    periodization_bible: true,
    bodyweight: true,
    jackshit: true
};

const TEMPLATE_SUPP: Record<TemplateId, Step3Defaults['supplemental']> = {
    bbb: { type: 'bbb', sets: 5, reps: 10, pctOfTM: 0.5, pairing: 'same' },
    triumvirate: { type: 'none' },
    periodization_bible: { type: 'none' },
    bodyweight: { type: 'none' },
    jackshit: { type: 'none' }
};

const TEMPLATE_ASSISTANCE: Record<TemplateId, { buckets: Array<'Push' | 'Pull' | 'Single-leg' | 'Core'>; target: [number, number] }> = {
    bbb: { buckets: ['Push', 'Pull', 'Single-leg', 'Core'], target: [50, 100] },
    triumvirate: { buckets: ['Push', 'Pull'], target: [50, 100] },
    periodization_bible: { buckets: ['Push', 'Pull', 'Single-leg', 'Core'], target: [50, 100] },
    bodyweight: { buckets: ['Push', 'Pull', 'Single-leg', 'Core'], target: [75, 100] },
    jackshit: { buckets: [], target: [0, 0] }
};

const TEMPLATE_CONDITIONING: Record<TemplateId, Step3Defaults['conditioning']> = {
    bbb: { mode: 'standard', weekly: { hard: 2, easy: 2 }, presets: ['prowler pushes', 'walks'] },
    triumvirate: { mode: 'standard', weekly: { hard: 2, easy: 2 }, presets: ['hill sprints', 'walks'] },
    periodization_bible: { mode: 'minimal', weekly: { hard: 1, easy: 2 }, presets: [] },
    bodyweight: { mode: 'standard', weekly: { hard: 1, easy: 3 }, presets: ['jumps', 'walks'] },
    jackshit: { mode: 'minimal', weekly: { hard: 1, easy: 1 }, presets: [] }
};

export function step3_defaults_from_template(templateId: TemplateId): Step3Defaults {
    if (!TEMPLATE_IDS.includes(templateId)) throw new Error(`Unknown templateId: ${templateId}`);
    const schemeId = TEMPLATE_SCHEME[templateId];
    const deloadEnabled = TEMPLATE_DELOAD_ENABLED[templateId];
    const supplemental = TEMPLATE_SUPP[templateId];
    const assistance = TEMPLATE_ASSISTANCE[templateId];
    const conditioning = TEMPLATE_CONDITIONING[templateId];

    return {
        schedule: { frequency: 4, order: ['press', 'deadlift', 'bench', 'squat'] },
        warmups: { mode: 'standard' },
        programming: {
            schemeId,
            ...(templateId === 'bbb'
                ? { leaderAnchor: { enabled: true, leader: 2, anchor: 1, seventhWeek: true } }
                : {})
        },
        deload: { enabled: deloadEnabled, mode: '40/50/60', amrap: false },
        supplemental,
        assistance: { mode: 'template', buckets: assistance.buckets, targetRepsPerBucket: assistance.target },
        conditioning
    };
}

export function step3_catalogs(): Step3Catalogs {
    const c = catalogsPack as any;
    const assistance = {
        Push: (c.assistance?.Push?.primary ?? c.assistance?.Push ?? []),
        Pull: (c.assistance?.Pull?.primary ?? c.assistance?.Pull ?? []),
        'Single-leg': (c.assistance?.['Single-leg']?.primary ?? c.assistance?.['Single-leg'] ?? []),
        Core: (c.assistance?.Core?.primary ?? c.assistance?.Core ?? [])
    } as Record<'Push' | 'Pull' | 'Single-leg' | 'Core', string[]>;

    const warmups: Step3Catalogs['warmups'] = (Array.isArray(c.warmups)
        ? c.warmups.map((w: any) => w.schemeType || w).filter((m: any) => WARMUP_MODES.includes(m))
        : []) as any;

    const conditioningActivities: string[] = Array.isArray(c.conditioning?.conditioningActivities)
        ? c.conditioning.conditioningActivities.map((a: any) => a.activity)
        : [];

    return {
        assistance,
        warmups: warmups.length ? warmups : ['standard', 'minimalist', 'jumps_integrated'],
        conditioning: {
            activities: conditioningActivities,
            presets: [...CONDITIONING_PRESETS]
        },
        supplemental: [...SUPP_TYPES],
        schemes: [...SCHEME_IDS]
    };
}
