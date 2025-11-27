import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AssistancePlanItem, Step3Selection } from '../types/step3';

type Step3State = Step3Selection;

type Action =
    | { type: 'RESET' }
    | { type: 'SET_SUPPLEMENTAL'; payload: Step3State['supplemental'] }
    | { type: 'SET_SUPP_CONFIG'; payload: NonNullable<Step3State['supplementalConfig']> }
    | { type: 'SET_ASSISTANCE'; payload: Partial<Step3State['assistance']> }
    | { type: 'SET_ASSISTANCE_PICKS'; payload: Step3State['assistance']['picks'] }
    | { type: 'SET_ASSISTANCE_PER_DAY'; payload: Partial<Record<'press' | 'deadlift' | 'bench' | 'squat', AssistancePlanItem[]>> }
    | { type: 'CLEAR_ASSISTANCE_DAY'; payload: 'press' | 'deadlift' | 'bench' | 'squat' }
    | { type: 'SET_WARMUP'; payload: Partial<Step3State['warmup']> }
    | { type: 'SET_CONDITIONING'; payload: Partial<Step3State['conditioning']> }
    | { type: 'SET_CYCLE'; payload: Partial<NonNullable<Step3State['cycle']>> }
    | { type: 'setAssistanceMode'; payload: 'Template' | 'Preset' | 'Custom' };

const INITIAL: Step3State = {
    supplemental: undefined,
    supplementalConfig: undefined,
    assistance: {
        mode: 'Preset',
        volumePreset: 'Standard',
        picks: { Push: [], Pull: [], 'Single-Leg/Core': [], Core: [] },
        perCategoryTarget: { Push: 50, Pull: 50, 'Single-Leg/Core': 50, Core: 50 },
        perDay: { press: [], deadlift: [], bench: [], squat: [] },
    },
    warmup: {
        mobility: '',
        mobilityPreset: 'Agile 8',
        jumpsThrowsDose: 10,
        jumpsPerDay: 20,
        throwsPerDay: 10,
        novFullPrep: false,
    },
    conditioning: {
        hardDays: 2,
        easyDays: 3,
        modalities: [],
        preferredDays: [],
        allowOverage: false,
    },
    cycle: {
        includeDeload: true,
        leaderCycles: 2,
        week7Variant: 'Deload',
        anchorPairing: '',
        notes: '',
    },
};

function reducer(state: Step3State, action: Action): Step3State {
    switch (action.type) {
        case 'RESET':
            return { ...INITIAL };
        case 'SET_SUPPLEMENTAL':
            return { ...state, supplemental: action.payload };
        case 'SET_SUPP_CONFIG':
            return { ...state, supplementalConfig: action.payload };
        case 'SET_ASSISTANCE':
            return { ...state, assistance: { ...state.assistance, ...action.payload } };
        case 'SET_ASSISTANCE_PICKS':
            return { ...state, assistance: { ...state.assistance, picks: action.payload } };
        case 'SET_ASSISTANCE_PER_DAY': {
            const prev = state.assistance.perDay || { press: [], deadlift: [], bench: [], squat: [] };
            return { ...state, assistance: { ...state.assistance, perDay: { ...prev, ...action.payload } } };
        }
        case 'CLEAR_ASSISTANCE_DAY': {
            const prev = state.assistance.perDay || { press: [], deadlift: [], bench: [], squat: [] };
            const next = { ...prev, [action.payload]: [] } as Record<'press' | 'deadlift' | 'bench' | 'squat', AssistancePlanItem[]>;
            return { ...state, assistance: { ...state.assistance, perDay: next } };
        }
        case 'SET_WARMUP':
            return { ...state, warmup: { ...state.warmup, ...action.payload } };
        case 'SET_CONDITIONING':
            return { ...state, conditioning: { ...state.conditioning, ...action.payload } };
        case 'setAssistanceMode':
            return { ...state, assistance: { ...state.assistance, mode: action.payload } };
        case 'SET_CYCLE': {
            const nextCycle = { includeDeload: true, notes: '', ...(state.cycle || {}), ...action.payload };
            return { ...state, cycle: nextCycle };
        }
        default:
            return state;
    }
}

const KEY = 'step3';

function loadFromSession(): Step3State {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return { ...INITIAL };
        const parsed = JSON.parse(raw);
        // cheap shape guard
        return { ...INITIAL, ...(parsed || {}) } as Step3State;
    } catch {
        return { ...INITIAL };
    }
}

function saveToSession(state: Step3State) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch { }
}

type Step3ContextValue = {
    state: Step3State;
    dispatch: React.Dispatch<Action>;
    actions: {
        reset: () => void;
        setSupplemental: (row: Step3State['supplemental']) => void;
        setSupplementalConfig: (cfg: NonNullable<Step3State['supplementalConfig']>) => void;
        setAssistance: (patch: Partial<Step3State['assistance']>) => void;
        setAssistancePicks: (picks: Step3State['assistance']['picks']) => void;
        setAssistancePerDay: (patch: Partial<Record<'press' | 'deadlift' | 'bench' | 'squat', AssistancePlanItem[]>>) => void;
        clearAssistanceDay: (day: 'press' | 'deadlift' | 'bench' | 'squat') => void;
        setWarmup: (patch: Partial<Step3State['warmup']>) => void;
        setConditioning: (patch: Partial<Step3State['conditioning']>) => void;
        setCycle: (patch: Partial<NonNullable<Step3State['cycle']>>) => void;
        setAssistanceMode: (mode: 'Template' | 'Preset' | 'Custom') => void;
    };
};

const Step3Context = createContext<Step3ContextValue | undefined>(undefined);

export function Step3Provider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, undefined, loadFromSession);

    useEffect(() => {
        saveToSession(state);
    }, [state]);

    const actions = useMemo<Step3ContextValue['actions']>(
        () => ({
            reset: () => dispatch({ type: 'RESET' }),
            setSupplemental: (row) => dispatch({ type: 'SET_SUPPLEMENTAL', payload: row }),
            setSupplementalConfig: (cfg) => dispatch({ type: 'SET_SUPP_CONFIG', payload: cfg }),
            setAssistance: (patch) => dispatch({ type: 'SET_ASSISTANCE', payload: patch }),
            setAssistancePicks: (picks) => dispatch({ type: 'SET_ASSISTANCE_PICKS', payload: picks }),
            setAssistancePerDay: (patch) => dispatch({ type: 'SET_ASSISTANCE_PER_DAY', payload: patch }),
            clearAssistanceDay: (day) => dispatch({ type: 'CLEAR_ASSISTANCE_DAY', payload: day }),
            setWarmup: (patch) => dispatch({ type: 'SET_WARMUP', payload: patch }),
            setConditioning: (patch) => dispatch({ type: 'SET_CONDITIONING', payload: patch }),
            setCycle: (patch) => dispatch({ type: 'SET_CYCLE', payload: patch }),
            setAssistanceMode: (mode) => dispatch({ type: 'setAssistanceMode', payload: mode }),
        }),
        []
    );

    const value: Step3ContextValue = useMemo(() => ({ state, dispatch, actions }), [state, actions]);
    return <Step3Context.Provider value={value}>{children}</Step3Context.Provider>;
}

export function useStep3() {
    const ctx = useContext(Step3Context);
    if (!ctx) throw new Error('useStep3 must be used within a Step3Provider');
    return ctx;
}
