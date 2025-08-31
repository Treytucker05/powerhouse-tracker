import * as React from 'react';
import { useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import { step1_fundamentals } from '@/lib/step1';
import type { Step1State, LiftId } from '@/lib/step1/types';
import { useBuilder } from '@/context/BuilderState';
import { useProgramV2, setTmPctChoice, setRoundingIncrement } from '@/methods/531/contexts/ProgramContextV2.jsx';
import { UNITS as CANON_UNITS } from '@/lib/units';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import BuilderProgress from './BuilderProgress';
import SchedulePanel from '@/components/program/steps/Step1/SchedulePanel';
import type { Assignments as RotationAssignments } from '@/components/program/steps/Step1/DndRotationPlanner';
import Step1CalendarPlanner from '@/components/program/steps/Step1/Step1CalendarPlanner';
// Lightweight local UI primitives (placeholder until design system integration)
type PillVariant = 'indigo' | 'emerald' | 'amber' | 'neutral' | 'red';
type PillProps = React.PropsWithChildren<{ active?: boolean; onClick?: () => void; label?: string; variant?: PillVariant }>;
const variantStyles: Record<PillVariant, { active: string; inactive: string; focus: string }> = {
    indigo: {
        active: 'bg-indigo-600/25 text-indigo-200 border-2 border-indigo-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border border-gray-700 hover:border-indigo-500 hover:text-indigo-200',
        focus: 'focus-visible:ring-1 focus-visible:ring-gray-500/30 focus-visible:ring-offset-0'
    },
    emerald: {
        active: 'bg-emerald-600/20 text-emerald-200 border-2 border-emerald-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border border-gray-700 hover:border-emerald-500 hover:text-emerald-200',
        focus: 'focus-visible:ring-1 focus-visible:ring-gray-500/30 focus-visible:ring-offset-0'
    },
    amber: {
        active: 'bg-amber-600/25 text-amber-200 border-2 border-amber-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border border-gray-700 hover:border-amber-500 hover:text-amber-200',
        focus: 'focus-visible:ring-1 focus-visible:ring-gray-500/30 focus-visible:ring-offset-0'
    },
    neutral: {
        active: 'bg-gray-700 text-gray-100 border-2 border-gray-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-gray-200',
        focus: 'focus-visible:ring-1 focus-visible:ring-gray-500/30 focus-visible:ring-offset-0'
    },
    red: {
        // Make active state highly distinct vs. inactive and independent of focus
        active: 'bg-red-600 text-white border-2 border-red-300 shadow-md ring-2 ring-red-400/70 ring-offset-1 ring-offset-gray-900',
        inactive: 'bg-gray-900/40 text-red-200 border border-red-700/70 hover:border-red-500/70 hover:bg-red-900/20',
        focus: 'focus-visible:ring-1 focus-visible:ring-gray-500/30 focus-visible:ring-offset-0'
    }
};
const Pill = ({ active, onClick, children, variant = 'red' }: PillProps) => {
    const v = variantStyles[variant];
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={!!active}
            className={`px-3 py-1 text-[11px] rounded-md border transition select-none font-semibold outline-none ${v.focus} ${active ? v.active : v.inactive}`}
        >
            {active ? <span className="mr-1">✓</span> : null}
            {children}
        </button>
    );
};

type SwitchProps = { checked: boolean; onCheckedChange: (v: boolean) => void; label?: string };
const Switch = ({ checked, onCheckedChange, label }: SwitchProps) => (
    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
        <span className={`relative inline-flex h-4 w-7 items-center rounded-full transition ${checked ? 'bg-red-500/70' : 'bg-gray-600'} focus-within:ring-2 focus-within:ring-red-500/60`}>
            <input aria-label={label} type="checkbox" className="sr-only" checked={checked} onChange={e => onCheckedChange(e.target.checked)} />
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-3.5' : 'translate-x-0.5'}`}></span>
        </span>
        <span className="text-gray-300">{label}</span>
    </label>
);

const HelperText: React.FC<React.PropsWithChildren> = ({ children }) => (
    <span className="text-[10px] text-gray-400 max-w-[180px] inline-block leading-relaxed">{children}</span>
);

// Enhanced numeric input: auto-clear leading zero on focus, prevent invalid characters, allow blank instead of forced 0
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    const { onFocus, onBlur, onChange, value } = props;
    return (
        <input
            {...props}
            inputMode={props.type === 'number' ? 'decimal' : props.inputMode}
            onFocus={(e) => {
                if (e.target.value === '0') {
                    e.target.value = '';
                }
                onFocus?.(e);
            }}
            onBlur={(e) => {
                if (e.target.value === '.') {
                    e.target.value = '';
                }
                onBlur?.(e);
            }}
            onKeyDown={(e) => {
                // Prevent scientific notation or minus signs for these fields
                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
            }}
            className={`mt-1 w-full rounded-md border border-gray-700 bg-gray-800/60 px-2 py-1 text-sm text-gray-100 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 ${props.className || ''}`.trim()}
            type={props.type || 'number'}
        />
    );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...rest }) => (
    <button
        {...rest}
        className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
            bg-red-600 text-white hover:bg-red-500 ${className || ''}`}
    >
        {children}
    </button>
);

// NEW: single source of truth for Step 1 (default mirrors current UI defaults)
// Type widening: augment Step1State locally with deadliftRepStyle & rounding.strategy variants until global type updated.
type LocalStep1 = Step1State & { deadliftRepStyle?: 'dead_stop' | 'touch_and_go'; rounding: { strategy: 'nearest' | 'down' | 'up'; increment: number } };
const defaultStep1State: LocalStep1 = {
    units: 'lb',                 // 'lb' | 'kg'
    tmPct: 0.90,                 // 0.85 or 0.90
    rounding: { strategy: 'nearest', increment: 5 }, // LB default 5; KG default 2.5
    lifts: {
        squat: { method: 'tested', oneRM: 0 },
        bench: { method: 'tested', oneRM: 0 },
        deadlift: { method: 'tested', oneRM: 0 },
        press: { method: 'tested', oneRM: 0 }
    },
    variants: { squat: 'back_squat', bench: 'bench_press', deadlift: 'conventional_deadlift', press: 'overhead_press' },
    deadliftRepStyle: 'touch_and_go'
};

interface Props {
    goToStep?: (n: number) => void;
    saveProgramDraft?: (data: any) => void; // TODO strong type when draft shape available
    // When embedded inside ProgramWizard531, these are provided. Keep optional for standalone usage/tests.
    data?: any;
    updateData?: (updates: any) => void;
}

export default function ProgramFundamentals({ goToStep, saveProgramDraft, data, updateData }: Props) {
    const { state: program, dispatch } = useProgramV2();
    // Some legacy tests mount without a Router; detect and fallback
    let navigate: ReturnType<typeof useNavigate> | null = null;
    try {
        // presence of navigation context provider indicates router
        // calling useNavigate inside try still throws if no router; catch below
        navigate = useNavigate();
    } catch (e) {
        navigate = null;
    }
    const { state: builderState, setState: setBuilderState } = useBuilder();
    const step1 = (builderState as any)?.step1 || {};
    const setStep1 = (u: any) => setBuilderState({ step1: { ...((builderState as any)?.step1 || {}), ...u } });
    // Adapt builder's Step1 meta shape to this component's richer state shape; keep internal but sync outward.
    const [state, setState] = React.useState<LocalStep1>(() => {
        // Derive initial lift method/values from builder meta (if any) so data persists without waiting on Supabase hydration.
        const deriveLift = (key: string) => {
            const input = ((step1 && (step1 as any).inputs) ? (step1 as any).inputs : {})[key] || {} as any;
            if (input.manualTm && input.manualTm > 0) {
                return { method: 'manual', manualTM: input.manualTm } as any;
            }
            if (input.repCalcWeight && input.repCalcReps) {
                return { method: 'reps', weight: input.repCalcWeight, reps: input.repCalcReps } as any;
            }
            if (input.oneRm && input.oneRm > 0) {
                return { method: 'tested', oneRM: input.oneRm } as any;
            }
            return { method: 'tested', oneRM: 0 } as any;
        };
        // Normalize potential aliases coming from persisted builder meta
        const normalizeUnits = (u: any): 'lb' | 'kg' => (u === 'kg' || u === 'kilogram' || u === 'kilograms') ? 'kg' : 'lb';
        const normalizePct = (p: any): 0.85 | 0.90 => (p === 0.85 ? 0.85 : 0.90);
        const normalizeStrategy = (s: any): 'nearest' | 'down' | 'up' => (s === 'down' || s === 'up') ? s : 'nearest';
        return {
            ...defaultStep1State,
            units: normalizeUnits(step1 ? (step1 as any).units : undefined),
            tmPct: normalizePct(step1 ? (step1 as any).tmPct : undefined),
            rounding: { strategy: normalizeStrategy(step1 ? (step1 as any)?.rounding?.strategy : undefined), increment: (typeof (step1 ? (step1 as any).rounding : undefined) === 'number' ? ((step1 as any)?.rounding as any) : (step1 as any)?.rounding?.increment) || 5 },
            lifts: {
                squat: deriveLift('squat'),
                bench: deriveLift('bench'),
                deadlift: deriveLift('deadlift'),
                press: deriveLift('press'),
            },
            variants: {
                squat: (step1 as any)?.variants?.squat || 'back_squat',
                bench: (step1 as any)?.variants?.bench || 'bench_press',
                deadlift: (step1 as any)?.variants?.deadlift || 'conventional_deadlift',
                press: (step1 as any)?.variants?.press || 'overhead_press'
            },
            deadliftRepStyle: (step1 as any)?.deadliftRepStyle || 'touch_and_go'
        } as LocalStep1;
    });
    // Rotation mapping (DnD planner). Kept separately so we can pass as controlled value and persist alongside step1
    const [rotation, setRotation] = React.useState<RotationAssignments>({});
    const [startDateISO, setStartDateISO] = React.useState<string>(() => {
        const existing = (step1 as any)?.startDate;
        const today = new Date();
        const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return typeof existing === 'string' && existing.match(/^\d{4}-\d{2}-\d{2}$/) ? existing : iso;
    });

    // (debug logging removed)

    // If builder meta later gains values (e.g., restored from localStorage) while internal lifts are still empty, sync once.
    React.useEffect(() => {
        const allEmpty = Object.values(state.lifts).every((l: any) => (l.oneRM ?? l.weight ?? l.manualTM ?? 0) === 0);
        const hasAny = Object.values(((step1 as any)?.inputs || {})).some((i: any) => (i?.oneRm || i?.manualTm || (i?.repCalcWeight && i?.repCalcReps)));
        if (!allEmpty || !hasAny) return;
        const deriveLift = (key: string) => {
            const input = (((step1 as any)?.inputs || {}) as any)[key] || {} as any;
            if (input.manualTm && input.manualTm > 0) return { method: 'manual', manualTM: input.manualTm } as any;
            if (input.repCalcWeight && input.repCalcReps) return { method: 'reps', weight: input.repCalcWeight, reps: input.repCalcReps } as any;
            if (input.oneRm && input.oneRm > 0) return { method: 'tested', oneRM: input.oneRm } as any;
            return { method: 'tested', oneRM: 0 } as any;
        };
        setState(prev => ({
            ...prev,
            lifts: {
                squat: deriveLift('squat'),
                bench: deriveLift('bench'),
                deadlift: deriveLift('deadlift'),
                press: deriveLift('press'),
            },
            variants: {
                squat: (step1 as any)?.variants?.squat || (prev as any).variants?.squat || 'back_squat',
                bench: (step1 as any)?.variants?.bench || (prev as any).variants?.bench || 'bench_press',
                deadlift: (step1 as any)?.variants?.deadlift || (prev as any).variants?.deadlift || 'conventional_deadlift',
                press: (step1 as any)?.variants?.press || (prev as any).variants?.press || 'overhead_press'
            },
            deadliftRepStyle: (step1 as any)?.deadliftRepStyle || (prev as any).deadliftRepStyle || 'touch_and_go'
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(step1 as any)?.inputs, (step1 as any)?.variants, (step1 as any)?.deadliftRepStyle]);

    // Push condensed snapshot back to builder meta on every calc change & debounce persist
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const disableCloudSaveRef = React.useRef<boolean>(false);
    const lastPushedRef = React.useRef<string>('');
    React.useEffect(() => {
        const res: any = step1_fundamentals(state as any);
        const tmTable: any[] = Array.isArray(res?.tmTable) ? res.tmTable : [];
        const condensed: any = {
            units: state.units as any,
            tmPct: (state.tmPct === 0.85 ? 0.85 : 0.9) as 0.85 | 0.9,
            microplates: state.rounding.increment < (state.units === 'lb' ? 5 : 2.5),
            rounding: state.rounding.increment,
            inputs: Object.fromEntries(Object.entries(state.lifts).map(([k, v]) => [k, {
                oneRm: (v as any).oneRM,
                repCalcWeight: (v as any).weight,
                repCalcReps: (v as any).reps,
                manualTm: (v as any).manualTM
            }])) as any,
            tmTable: Object.fromEntries((tmTable as any[]).map((r: any) => [r.lift, r.tmDisplay || 0])) as any
        };
        // include variants for persistence
        (condensed as any).variants = state.variants;
        condensed.deadliftRepStyle = state.deadliftRepStyle;
        // include rotation mapping (controlled)
        (condensed as any).rotation = rotation;
        (condensed as any).startDate = startDateISO;
        // Guard against infinite loops: only push when condensed actually changes
        const fingerprint = JSON.stringify(condensed);
        if (fingerprint !== lastPushedRef.current) {
            lastPushedRef.current = fingerprint;
            setStep1(condensed);

            // Also sync into the outer ProgramWizard state when available so step validation advances
            try {
                const liftsFromTm = Object.fromEntries((tmTable as any[]).map((r: any) => [r.lift, { tm: r.tmDisplay || 0 }])) as any;
                const roundingObj = { increment: state.rounding.increment, mode: state.rounding.strategy } as any;
                // Only call if parent provided updater
                (typeof (updateData) === 'function') && updateData({
                    step1: condensed,
                    units: state.units,
                    tmPct: condensed.tmPct,
                    rounding: roundingObj,
                    lifts: liftsFromTm
                });
            } catch { /* no-op */ }
        }

        // Debounced persistence (skip during tests / SSR)
        const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
        let handle: any;
        if (!isTest && lastPushedRef.current) {
            setSaveStatus('saving');
            handle = setTimeout(async () => {
                try {
                    if (disableCloudSaveRef.current) { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 1200); return; }
                    const userId = await getCurrentUserId();
                    if (!userId) { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 1200); return; }
                    const payload = {
                        user_id: userId,
                        step: 1,
                        state: { ...state, rotation, startDate: startDateISO }, // full UI state for potential future migrations
                        condensed: JSON.parse(lastPushedRef.current),
                        updated_at: new Date().toISOString()
                    };
                    // Upsert into table program_builder_state (create instruction in README if table missing)
                    const { error } = await supabase.from('program_builder_state').upsert(payload, { onConflict: 'user_id,step' });
                    if (error) {
                        // If table is missing in local dev, avoid spamming network with retries
                        if ((error as any)?.code === '42P01' /* Postgres undefined_table */ || (error as any)?.status === 404) {
                            disableCloudSaveRef.current = true;
                        }
                        throw error;
                    }
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus('idle'), 1200);
                } catch (err) {
                    // Non-fatal
                    if (import.meta.env.DEV) console.warn('Step1 persist failed', err);
                    setSaveStatus('error');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                }
            }, 600); // 600ms debounce
        }
        return () => handle && clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, rotation]);

    // Initial load: attempt to hydrate from Supabase if empty (client side only)
    React.useEffect(() => {
        let active = true;
        const run = async () => {
            const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
            if (isTest) return;
            // Only hydrate if all 1RMs are zero (fresh state)
            const allZero = Object.values(state.lifts).every((l: any) => (l.oneRM ?? l.weight ?? l.manualTM ?? 0) === 0);
            if (!allZero) return;
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const { data, error } = await supabase.from('program_builder_state').select('*').eq('user_id', userId).eq('step', 1).single();
                if (error || !data) return;
                if (data.state && active) {
                    const { rotation: r, startDate, ...rest } = data.state as any;
                    setState((s) => ({ ...s, ...rest }));
                    if (r && typeof r === 'object') setRotation(r as RotationAssignments);
                    if (typeof startDate === 'string') setStartDateISO(startDate);
                } else if (data.condensed && active) {
                    const r = (data.condensed as any)?.rotation;
                    if (r && typeof r === 'object') setRotation(r as RotationAssignments);
                    const sd = (data.condensed as any)?.startDate;
                    if (typeof sd === 'string') setStartDateISO(sd);
                }
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Hydrate step1 failed', e);
            }
        };
        run();
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // compute once per render
    const resNow: any = step1_fundamentals(state as any);
    const tmTable: any[] = Array.isArray(resNow?.tmTable) ? resNow.tmTable : [];
    const tmReadyCount = React.useMemo(() => (tmTable as any[]).filter((r: any) => (r.tmDisplay ?? 0) > 0).length, [tmTable]);

    // Enforce valid selections at all times (one per toggle group)
    React.useEffect(() => {
        setState(prev => {
            let changed = false;
            let units: 'lb' | 'kg' = (prev.units === 'kg' || prev.units === 'lb') ? prev.units : 'lb';
            if (units !== prev.units) changed = true;
            let tmPct: 0.85 | 0.90 = (prev.tmPct === 0.85 ? 0.85 : 0.90);
            if (tmPct !== prev.tmPct) changed = true;
            const prevStrategy = (prev.rounding as any)?.strategy;
            const strategy: any = (prevStrategy === 'down' || prevStrategy === 'up' || prevStrategy === 'nearest') ? prevStrategy : 'nearest';
            if (strategy !== prev.rounding.strategy) changed = true;
            const deadliftRepStyle: any = (prev as any).deadliftRepStyle === 'dead_stop' || (prev as any).deadliftRepStyle === 'touch_and_go' ? (prev as any).deadliftRepStyle : 'touch_and_go';
            if (deadliftRepStyle !== (prev as any).deadliftRepStyle) changed = true;
            if (!changed) return prev;
            // adjust increment if current value illegal for unit
            let increment = prev.rounding.increment;
            if (units === 'lb' && (increment !== 5 && increment !== 2.5)) increment = 5;
            if (units === 'kg' && (increment !== 2.5 && increment !== 1.0)) increment = 2.5;
            return { ...prev, units, tmPct, deadliftRepStyle, rounding: { ...prev.rounding, strategy, increment } } as any;
        });
    }, []);

    const onUnits = (units: 'lb' | 'kg') => {
        setState(s => ({
            ...s,
            units,
            rounding: {
                ...s.rounding,
                // keep increment valid per unit; flip to sensible default if impossible
                increment:
                    units === 'lb'
                        ? (s.rounding.increment === 1 ? 2.5 : s.rounding.increment) // 1.0 lb not valid
                        : (s.rounding.increment === 5 ? 2.5 : s.rounding.increment)  // prefer 2.5kg default
            }
        }));
        // Also sync rounding increment default into V2 context based on canonical units
        try {
            const u = units === 'kg' ? CANON_UNITS.KG : CANON_UNITS.LBS;
            const inc = u === CANON_UNITS.KG ? 2.5 : 5;
            setRoundingIncrement(dispatch, inc);
        } catch {}
    };

    const onTmPct = (pct: 0.85 | 0.90) => {
        setState(s => ({ ...s, tmPct: pct }));
        // Update V2 tmPctChoice which also adjusts minReps criteria
        try { setTmPctChoice(dispatch, pct === 0.90 ? 90 : 85); } catch {}
    };

    const onToggleMicro = (checked: boolean) => {
        setState(s => ({
            ...s,
            rounding: {
                ...s.rounding,
                increment: s.units === 'lb'
                    ? (checked ? 2.5 : 5)
                    : (checked ? 1.0 : 2.5)
            }
        }));
    };

    type LiftKey = 'squat' | 'bench' | 'deadlift' | 'press';

    const setTested1RM = (lift: LiftKey, oneRM: number) => setState(s => ({ ...s, lifts: { ...s.lifts, [lift]: { ...s.lifts[lift], method: 'tested', oneRM } } }));
    const setRepCalc = (lift: LiftKey, weight: number, reps: number) => setState(s => ({ ...s, lifts: { ...s.lifts, [lift]: { ...s.lifts[lift], method: 'reps', weight, reps } } }));
    const setManualTM = (lift: LiftKey, manualTM: number) => setState(s => ({ ...s, lifts: { ...s.lifts, [lift]: { ...s.lifts[lift], method: 'manual', manualTM } } }));
    const setMethod = (lift: LiftKey, method: 'tested' | 'reps' | 'manual') => setState(s => ({ ...s, lifts: { ...s.lifts, [lift]: { ...s.lifts[lift], method } } }));

    // (removed) legacy stacked-button method selector; radios are used per-lift now.

    const onNext = () => {
        if ((tmTable as any[]).some((r: any) => (r.tmDisplay ?? 0) <= 0)) return; // guard
        if (saveProgramDraft) {
            saveProgramDraft({
                step1: state,
                tmTable,
                meta: { units: state.units, rounding: state.rounding, tmPct: state.tmPct }
            });
        }
        if (goToStep) goToStep(2); else if (navigate) navigate('/build/step2');
    };

    const tmLookup = React.useMemo(() => Object.fromEntries((tmTable as any[]).map((r: any) => [r.lift, r.tmDisplay ?? '—'])), [tmTable]);

    // Variant options per lift (MVP list; codes stable for persistence)
    const VARIANT_OPTIONS: Record<LiftKey, { code: string; label: string }[]> = {
        squat: [
            { code: 'back_squat', label: 'Back Squat' },
            { code: 'front_squat', label: 'Front Squat' },
            { code: 'safety_bar_squat', label: 'Safety Bar' }
        ],
        bench: [
            { code: 'bench_press', label: 'Flat Bench' },
            { code: 'close_grip_bench', label: 'Close Grip' },
            { code: 'incline_bench', label: 'Incline' }
        ],
        deadlift: [
            { code: 'conventional_deadlift', label: 'Conventional' },
            { code: 'sumo_deadlift', label: 'Sumo' },
            { code: 'trap_bar_deadlift', label: 'Trap Bar' }
        ],
        press: [
            { code: 'overhead_press', label: 'Overhead Press' },
            { code: 'push_press', label: 'Push Press' },
            { code: 'log_press', label: 'Log Press' }
        ]
    };

    const setVariant = (lift: LiftKey, code: string) => setState(s => {
        const next = {
            squat: s.variants?.squat || 'back_squat',
            bench: s.variants?.bench || 'bench_press',
            deadlift: s.variants?.deadlift || 'conventional_deadlift',
            press: s.variants?.press || 'overhead_press'
        };
        next[lift] = code;
        return { ...s, variants: next };
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 px-6 py-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <BuilderProgress current={1} />
                <header className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-100">Step 1 · Program Fundamentals</h1>
                        <span aria-live="polite" className="text-xs inline-flex items-center gap-1 text-gray-400">
                            {saveStatus === 'saving' && (<>
                                <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> Saving…
                            </>)}
                            {saveStatus === 'saved' && (<>
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Saved
                            </>)}
                            {saveStatus === 'error' && (<>
                                <span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Saved locally
                            </>)}
                        </span>
                    </div>
                    {/* Controls in separate containers laid out to fill space */}
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
                            {/* Units */}
                            <div className="bg-gray-800/60 border border-gray-700 p-3 rounded-md h-full">
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Units</div>
                                <div className="mt-2 grid grid-cols-[max-content,1fr] gap-3 items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <Pill variant="red" active={state.units === 'lb'} onClick={() => onUnits('lb')}>LBS</Pill>
                                        <Pill variant="red" active={state.units === 'kg'} onClick={() => onUnits('kg')}>KG</Pill>
                                    </div>
                                    <p className="text-xs text-gray-300/90 leading-relaxed min-w-0">
                                        Sets the display and rounding system for all weights. Switching converts how
                                        values are shown, not your saved lifts.
                                    </p>
                                </div>
                            </div>
                            {/* TM % */}
                            <div className="bg-gray-800/60 border border-gray-700 p-3 rounded-md h-full">
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">TM %</div>
                                <div className="mt-2 grid grid-cols-[max-content,1fr] gap-3 items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <Pill variant="red" active={state.tmPct === 0.90} onClick={() => onTmPct(0.90)}>90%</Pill>
                                        <Pill variant="red" active={state.tmPct === 0.85} onClick={() => onTmPct(0.85)}>85%</Pill>
                                    </div>
                                    <p className="text-xs text-gray-300/90 leading-relaxed min-w-0">
                                        Training Max is the percentage of your true max used to calculate working sets.
                                        90% is the classic 5/3/1 choice; 85% is often better for older or newer clients.
                                    </p>
                                </div>
                            </div>
                            {/* Microplates */}
                            <div className="bg-gray-800/60 border border-gray-700 p-3 rounded-md h-full">
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Microplates</div>
                                <div className="mt-2 grid grid-cols-[max-content,1fr] gap-3 items-start">
                                    <div className="flex items-start">
                                        <Switch
                                            checked={state.rounding.increment === (state.units === 'lb' ? 2.5 : 1.0)}
                                            onCheckedChange={onToggleMicro}
                                            label="Use microplates"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-gray-400">LB inc: {state.units === 'lb' ? '2.5 / 5' : '—'} · KG inc: {state.units === 'kg' ? '1.0 / 2.5' : '—'}</p>
                                        <p className="mt-1 text-xs text-gray-300/90 leading-relaxed">Enable smaller jumps for finer progress between weeks.</p>
                                    </div>
                                </div>
                            </div>
                            {/* Rounding */}
                            <div className="bg-gray-800/60 border border-gray-700 p-3 rounded-md h-full">
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Rounding</div>
                                <div className="mt-2 grid grid-cols-[max-content,1fr] gap-3 items-start">
                                    <div className="flex flex-col gap-1.5">
                                        {(['nearest', 'down', 'up'] as const).map(r => (
                                            <Pill key={r} variant="red" active={state.rounding.strategy === r} onClick={() => setState(s => ({ ...s, rounding: { ...s.rounding, strategy: r as any } }))}>{r}</Pill>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-300/90 leading-relaxed min-w-0">
                                        <p>Choose how we round target weights to a loadable plate increment.</p>
                                        <ul className="mt-1 list-disc pl-4 space-y-1">
                                            <li><span className="font-semibold">Nearest</span>: Round to the closest loadable weight. Balanced and recommended.</li>
                                            <li><span className="font-semibold">Down</span>: Always round down (never overshoot). Good for conservative or fatigued weeks.</li>
                                            <li><span className="font-semibold">Up</span>: Always round up (slightly harder). Use when you want a small push.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* (global method selection removed; each lift has its own) */}

                {/* Exercise cards (2x2 responsive grid) */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(['press', 'bench', 'squat', 'deadlift'] as LiftId[]).map((id) => {
                            const title = id === 'press' ? 'Overhead Press' : id.charAt(0).toUpperCase() + id.slice(1);
                            const tm = tmLookup[id];
                            const isComplete = typeof tm === 'number' && tm > 0;
                            const liftState: any = state.lifts[id];
                            const currentVariant = state.variants ? state.variants[id as LiftId] : undefined;
                            const method = liftState.method;
                            return (
                                <div key={id} className="exercise-card bg-gray-800/60 border border-gray-700 p-5 rounded-[10px]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {isComplete && <span className="text-white text-2xl">✓</span>}
                                            <h3 className="capitalize">{title}</h3>
                                        </div>
                                        <div className="text-[0.9rem] font-bold">
                                            <span className={`inline-block px-2 py-1 rounded-md border ${isComplete ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-700 border-gray-700 text-gray-200'}`}>
                                                TM: {typeof tm === 'number' ? tm : '---'} {state.units}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Variant selector (keep light) */}
                                    <label className="block mt-2 text-[11px] text-gray-300" aria-label={`Select ${title} variant`}>
                                        <span className="text-gray-400">Use Variant?</span>
                                        <div className="mt-1 flex items-center gap-3 text-[11px]">
                                            <label className="inline-flex items-center gap-1">
                                                <input type="radio" name={`variant-mode-${id}`} value="base" checked={!currentVariant || currentVariant === VARIANT_OPTIONS[id as LiftKey][0].code} onChange={() => setVariant(id as LiftKey, VARIANT_OPTIONS[id as LiftKey][0].code)} aria-label={`${title} base variant`} />
                                                <span className="text-gray-300">Base</span>
                                            </label>
                                            <label className="inline-flex items-center gap-1">
                                                <input type="radio" name={`variant-mode-${id}`} value="variant" checked={!!currentVariant && currentVariant !== VARIANT_OPTIONS[id as LiftKey][0].code} onChange={() => { const list = VARIANT_OPTIONS[id as LiftKey]; setVariant(id as LiftKey, list[1]?.code || list[0].code); }} aria-label={`${title} choose alternate variant`} />
                                                <span className="text-gray-300">Variant</span>
                                            </label>
                                            {currentVariant && currentVariant !== VARIANT_OPTIONS[id as LiftKey][0].code && (
                                                <select className="ml-2 flex-1 rounded-md border border-gray-700 bg-gray-800/60 px-2 py-1 text-[11px] text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/40" value={currentVariant} data-testid={`variant-${id}`} onChange={e => setVariant(id as LiftKey, e.target.value)} aria-label={`${title} variant options`}>
                                                    {VARIANT_OPTIONS[id as LiftKey].filter((_, i) => i > 0).map(opt => (
                                                        <option key={opt.code} value={opt.code}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </label>

                                    {/* Per-lift method selection (radio row) */}
                                    <div className="mt-3 text-sm">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name={`method-${id}`} value="tested" checked={method === 'tested'} onChange={() => setMethod(id as any, 'tested')} />
                                                <span>Tested 1RM</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name={`method-${id}`} value="reps" checked={method === 'reps'} onChange={() => setMethod(id as any, 'reps')} />
                                                <span>Reps × Weight</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name={`method-${id}`} value="manual" checked={method === 'manual'} onChange={() => setMethod(id as any, 'manual')} />
                                                <span>Direct TM</span>
                                            </label>
                                        </div>
                                    </div>
                                    {method === 'tested' && (
                                        <label className="block text-[11px] font-medium text-gray-300 mt-3">
                                            Enter 1RM ({state.units})
                                            <Input className="exercise-input" aria-label={`${title} tested one rep max in ${state.units}`} value={(liftState.oneRM ?? 0) === 0 ? '' : liftState.oneRM} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTested1RM(id as any, +e.target.value || 0)} />
                                        </label>
                                    )}
                                    {method === 'reps' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mt-3">
                                            <label className="font-medium text-gray-300">
                                                Weight ({state.units})
                                                <Input className="exercise-input" aria-label={`${title} reps method weight in ${state.units}`} value={(liftState.weight ?? 0) === 0 ? '' : liftState.weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepCalc(id as any, +e.target.value || 0, liftState.reps || 0)} />
                                            </label>
                                            <label className="font-medium text-gray-300">
                                                Reps
                                                <Input className="exercise-input" aria-label={`${title} reps method reps`} value={(liftState.reps ?? 0) === 0 ? '' : liftState.reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepCalc(id as any, liftState.weight || 0, +e.target.value || 0)} />
                                            </label>
                                        </div>
                                    )}
                                    {method === 'manual' && (
                                        <label className="block text-[11px] font-medium text-gray-300 mt-3">
                                            Training Max ({state.units})
                                            <Input className="exercise-input" aria-label={`${title} direct training max in ${state.units}`} value={(liftState.manualTM ?? 0) === 0 ? '' : liftState.manualTM} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualTM(id as any, +e.target.value || 0)} />
                                        </label>
                                    )}

                                    {/* Deadlift-only style */}
                                    {id === 'deadlift' && (
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <label className="mr-3">Style:</label>
                                            <label className="mr-4"><input type="radio" name="deadliftStyle" checked={(state as any).deadliftRepStyle === 'dead_stop'} onChange={() => setState(s => ({ ...(s as any), deadliftRepStyle: 'dead_stop' }))} />{' '}Dead Stop</label>
                                            <label><input type="radio" name="deadliftStyle" checked={(state as any).deadliftRepStyle === 'touch_and_go'} onChange={() => setState(s => ({ ...(s as any), deadliftRepStyle: 'touch_and_go' }))} />{' '}Touch & Go</label>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Progress bar & status */}
                <section className="bg-gray-800/60 border border-gray-700 p-4 rounded-md mt-8">
                    <div className="bg-gray-800 h-2 rounded overflow-hidden">
                        <div className="progress-bar-fill" style={{ background: '#ef4444', height: '100%', width: `${(tmReadyCount / 4) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 text-[0.8rem]">
                        {(['press', 'bench', 'squat', 'deadlift'] as LiftId[]).map((id) => {
                            const label = id === 'press' ? 'OHP' : id.charAt(0).toUpperCase() + id.slice(1);
                            const tm = tmLookup[id];
                            const done = typeof tm === 'number' && tm > 0;
                            return (
                                <span
                                    key={id}
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-transparent ${done ? 'text-white' : 'text-gray-400'} border-gray-700`}
                                >
                                    {done ? '✓' : '○'} {label}: {typeof tm === 'number' ? tm : '---'}
                                </span>
                            );
                        })}
                    </div>
                </section>

                {/* Schedule & Rotation */}
                <section>
                    <SchedulePanel />
                    {/* Calendar planner is now inside SchedulePanel to avoid duplication */}
                </section>

                {/* Continue button */}
                <div className="pt-2">
                    <button onClick={onNext} data-testid="step1-next" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', background: tmReadyCount === 4 ? '#ef4444' : '#f59e0b', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', marginTop: '2rem' }}>
                        {tmReadyCount === 4 ? 'Continue to Template →' : `Continue → (${tmReadyCount} of 4 lifts entered)`}
                    </button>
                </div>
            </div>
        </div>
    );
}
