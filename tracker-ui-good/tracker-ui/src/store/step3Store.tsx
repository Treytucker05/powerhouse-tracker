import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Step3Selection } from '../types/step3';

type Step3State = Step3Selection;

type Action =
    | { type: 'RESET' }
    | { type: 'SET_SUPPLEMENTAL'; payload: Step3State['supplemental'] }
    | { type: 'SET_ASSISTANCE'; payload: Partial<Step3State['assistance']> }
    | { type: 'SET_ASSISTANCE_PICKS'; payload: Step3State['assistance']['picks'] }
    | { type: 'SET_WARMUP'; payload: Partial<Step3State['warmup']> }
    | { type: 'SET_CONDITIONING'; payload: Partial<Step3State['conditioning']> };

const INITIAL: Step3State = {
    supplemental: undefined,
    assistance: {
        volumePreset: 'Standard',
        picks: { Push: [], Pull: [], 'Single-Leg/Core': [], Core: [] },
        perCategoryTarget: { Push: 25, Pull: 25, 'Single-Leg/Core': 25, Core: 25 },
    },
    warmup: {
        mobility: '',
        jumpsThrowsDose: 10,
    },
    conditioning: {
        hardDays: 1,
        easyDays: 2,
        modalities: [],
        preferredDays: [],
    },
};

function reducer(state: Step3State, action: Action): Step3State {
    switch (action.type) {
        case 'RESET':
            return { ...INITIAL };
        case 'SET_SUPPLEMENTAL':
            return { ...state, supplemental: action.payload };
        case 'SET_ASSISTANCE':
            return { ...state, assistance: { ...state.assistance, ...action.payload } };
        case 'SET_ASSISTANCE_PICKS':
            return { ...state, assistance: { ...state.assistance, picks: action.payload } };
        case 'SET_WARMUP':
            return { ...state, warmup: { ...state.warmup, ...action.payload } };
        case 'SET_CONDITIONING':
            return { ...state, conditioning: { ...state.conditioning, ...action.payload } };
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
        setAssistance: (patch: Partial<Step3State['assistance']>) => void;
        setAssistancePicks: (picks: Step3State['assistance']['picks']) => void;
        setWarmup: (patch: Partial<Step3State['warmup']>) => void;
        setConditioning: (patch: Partial<Step3State['conditioning']>) => void;
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
            setAssistance: (patch) => dispatch({ type: 'SET_ASSISTANCE', payload: patch }),
            setAssistancePicks: (picks) => dispatch({ type: 'SET_ASSISTANCE_PICKS', payload: picks }),
            setWarmup: (patch) => dispatch({ type: 'SET_WARMUP', payload: patch }),
            setConditioning: (patch) => dispatch({ type: 'SET_CONDITIONING', payload: patch }),
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
