import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

// Types kept intentionally loose (UI-first placeholder)
export interface LiftInputs {
    oneRm?: number;
    repCalcWeight?: number;
    repCalcReps?: number;
    manualTm?: number;
}

export interface Step1StateMeta {
    units: 'lb' | 'kg';
    tmPct: 0.85 | 0.9;
    microplates: boolean;
    rounding: number; // active rounding increment derived from units + microplates
    inputs: Record<string, LiftInputs>; // press, deadlift, bench, squat
    tmTable: Record<string, number>; // computed/placeholder TMs (rounded)
    variants?: Record<string, string>; // per-lift variant codes
}

interface Step2StateMeta {
    templateId?: string;
    schemeId?: string;
}

interface BuilderStateShape {
    step1: Step1StateMeta;
    step2: Step2StateMeta;
    step3: Step3StateMeta;
    setStep1: (partial: Partial<Step1StateMeta>) => void;
    setStep2: (partial: Partial<Step2StateMeta>) => void;
    setStep3: (partial: Partial<Step3StateMeta>) => void;
    reset: () => void;
}

const DEFAULT_STEP1: Step1StateMeta = {
    units: 'lb',
    tmPct: 0.9,
    microplates: false,
    rounding: 5,
    inputs: { press: {}, deadlift: {}, bench: {}, squat: {} },
    tmTable: { press: 0, deadlift: 0, bench: 0, squat: 0 },
    variants: { press: 'overhead_press', bench: 'bench_press', squat: 'back_squat', deadlift: 'conventional_deadlift' }
};
const DEFAULT_STEP2: Step2StateMeta = { templateId: undefined, schemeId: undefined };
interface Step3StateMeta {
    scheduleFrequency?: 2 | 3 | 4;
    warmupsEnabled?: boolean;
    warmupScheme?: string;
    approach?: string; // classic, 351, 5spro, leader_anchor, comp_prep
    deload?: boolean;
    supplemental?: string; // fsl, ssl, bbb, bbs, widowmakers
    assistanceMode?: string; // minimal, balanced, template, custom
    conditioningPlan?: string; // minimal, standard, extensive
    customNotes?: string;
    liftOrder?: string[]; // ordering of primary lifts for the week (press, deadlift, bench, squat)
    liftRotation?: string[][]; // multi-week rotation for 2 & 3 day templates (each inner array = one week of main lifts)
    mainSetOption?: 1 | 2; // Option 1 (default) vs Option 2 loading pattern for main sets
    novFullPrep?: boolean; // N.O.V. foam + stretch + rope sequence before barbell ramp
}
const DEFAULT_STEP3: Step3StateMeta = {
    scheduleFrequency: 4,
    warmupsEnabled: true,
    warmupScheme: 'standard',
    approach: 'classic531',
    deload: true,
    supplemental: 'bbb',
    assistanceMode: 'balanced',
    conditioningPlan: 'standard',
    customNotes: '',
    liftOrder: ['press', 'deadlift', 'bench', 'squat'],
    liftRotation: [['press', 'deadlift', 'bench', 'squat']],
    mainSetOption: 1,
    novFullPrep: false
};

const BuilderStateCtx = createContext<BuilderStateShape | undefined>(undefined);
const LS_KEY = 'ph531.builder.ui.state';

export function BuilderStateProvider({ children }: { children: ReactNode }) {
    const [step1, setStep1State] = useState<Step1StateMeta>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_STEP1, ...(parsed.step1 || {}) } as Step1StateMeta;
            }
        } catch { /* ignore */ }
        return DEFAULT_STEP1;
    });
    const [step2, setStep2State] = useState<Step2StateMeta>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_STEP2, ...(parsed.step2 || {}) } as Step2StateMeta;
            }
        } catch { /* ignore */ }
        return DEFAULT_STEP2;
    });
    const [step3, setStep3State] = useState<Step3StateMeta>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_STEP3, ...(parsed.step3 || {}) } as Step3StateMeta;
            }
        } catch { /* ignore */ }
        return DEFAULT_STEP3;
    });

    useEffect(() => {
        try { localStorage.setItem(LS_KEY, JSON.stringify({ step1, step2, step3 })); } catch { /* ignore */ }
    }, [step1, step2, step3]);

    const setStep1 = useCallback((partial: Partial<Step1StateMeta>) => {
        setStep1State(prev => ({ ...prev, ...partial }));
    }, []);
    const setStep2 = useCallback((partial: Partial<Step2StateMeta>) => {
        setStep2State(prev => ({ ...prev, ...partial }));
    }, []);
    const setStep3 = useCallback((partial: Partial<Step3StateMeta>) => {
        setStep3State(prev => ({ ...prev, ...partial }));
    }, []);

    const reset = useCallback(() => { setStep1State(DEFAULT_STEP1); setStep2State(DEFAULT_STEP2); setStep3State(DEFAULT_STEP3); }, []);

    return (
        <BuilderStateCtx.Provider value={{ step1, step2, step3, setStep1, setStep2, setStep3, reset }}>
            {children}
        </BuilderStateCtx.Provider>
    );
}

export function useBuilder() {
    const ctx = useContext(BuilderStateCtx);
    if (!ctx) throw new Error('useBuilder must be used within BuilderStateProvider');
    return ctx;
}
