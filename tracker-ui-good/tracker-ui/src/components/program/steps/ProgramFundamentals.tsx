import * as React from 'react';
import { useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import { step1_fundamentals } from '@/lib/step1';
import type { Step1State, LiftId } from '@/lib/step1/types';
import { useBuilder } from '@/context/BuilderState';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import BuilderProgress from './BuilderProgress';
// Lightweight local UI primitives (placeholder until design system integration)
type PillVariant = 'indigo' | 'emerald' | 'amber' | 'neutral';
type PillProps = React.PropsWithChildren<{ active?: boolean; onClick?: () => void; label?: string; variant?: PillVariant }>;
const variantStyles: Record<PillVariant, { active: string; inactive: string; focus: string }> = {
    indigo: {
        active: 'bg-indigo-600/25 text-indigo-200 border-indigo-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-indigo-500 hover:text-indigo-200',
        focus: 'focus:ring-indigo-500/60'
    },
    emerald: {
        active: 'bg-emerald-600/20 text-emerald-200 border-emerald-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-emerald-500 hover:text-emerald-200',
        focus: 'focus:ring-emerald-500/60'
    },
    amber: {
        active: 'bg-amber-600/25 text-amber-200 border-amber-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-amber-500 hover:text-amber-200',
        focus: 'focus:ring-amber-500/60'
    },
    neutral: {
        active: 'bg-gray-700 text-gray-100 border-gray-400 shadow-sm',
        inactive: 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-gray-200',
        focus: 'focus:ring-gray-500/60'
    }
};
const Pill = ({ active, onClick, children, variant = 'neutral' }: PillProps) => {
    const v = variantStyles[variant];
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 text-[11px] rounded-md border transition select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${v.focus} ${active ? v.active : v.inactive}`}
        >
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
            className={`mt-1 w-full rounded-md border border-gray-700 bg-gray-900/60 px-2 py-1 text-sm text-gray-100 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 ${props.className || ''}`.trim()}
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
}

export default function ProgramFundamentals({ goToStep, saveProgramDraft }: Props) {
    // Some legacy tests mount without a Router; detect and fallback
    let navigate: ReturnType<typeof useNavigate> | null = null;
    try {
        // presence of navigation context provider indicates router
        // calling useNavigate inside try still throws if no router; catch below
        navigate = useNavigate();
    } catch (e) {
        navigate = null;
    }
    const { step1, setStep1 } = useBuilder();
    // Adapt builder's Step1 meta shape to this component's richer state shape; keep internal but sync outward.
    const [state, setState] = React.useState<LocalStep1>(() => {
        // Derive initial lift method/values from builder meta (if any) so data persists without waiting on Supabase hydration.
        const deriveLift = (key: string) => {
            const input = (step1?.inputs || {})[key] || {} as any;
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
        return {
            ...defaultStep1State,
            units: step1?.units || 'lb',
            tmPct: (step1?.tmPct === 0.85 ? 0.85 : 0.90),
            rounding: { strategy: 'nearest', increment: step1?.rounding || 5 },
            lifts: {
                squat: deriveLift('squat'),
                bench: deriveLift('bench'),
                deadlift: deriveLift('deadlift'),
                press: deriveLift('press'),
            },
            variants: {
                squat: step1?.variants?.squat || 'back_squat',
                bench: step1?.variants?.bench || 'bench_press',
                deadlift: step1?.variants?.deadlift || 'conventional_deadlift',
                press: step1?.variants?.press || 'overhead_press'
            },
            deadliftRepStyle: (step1 as any)?.deadliftRepStyle || 'touch_and_go'
        };
    });

    // If builder meta later gains values (e.g., restored from localStorage) while internal lifts are still empty, sync once.
    React.useEffect(() => {
        setState(prev => {
            const allEmpty = Object.values(prev.lifts).every((l: any) => (l.oneRM ?? l.weight ?? l.manualTM ?? 0) === 0);
            if (!allEmpty) return prev;
            const hasAny = Object.values(step1.inputs || {}).some((i: any) => (i?.oneRm || i?.manualTm || (i?.repCalcWeight && i?.repCalcReps)));
            if (!hasAny) return prev;
            const deriveLift = (key: string) => {
                const input = (step1?.inputs || {})[key] || {} as any;
                if (input.manualTm && input.manualTm > 0) return { method: 'manual', manualTM: input.manualTm } as any;
                if (input.repCalcWeight && input.repCalcReps) return { method: 'reps', weight: input.repCalcWeight, reps: input.repCalcReps } as any;
                if (input.oneRm && input.oneRm > 0) return { method: 'tested', oneRM: input.oneRm } as any;
                return { method: 'tested', oneRM: 0 } as any;
            };
            return {
                ...prev,
                lifts: {
                    squat: deriveLift('squat'),
                    bench: deriveLift('bench'),
                    deadlift: deriveLift('deadlift'),
                    press: deriveLift('press'),
                },
                variants: {
                    squat: step1?.variants?.squat || prev.variants?.squat || 'back_squat',
                    bench: step1?.variants?.bench || prev.variants?.bench || 'bench_press',
                    deadlift: step1?.variants?.deadlift || prev.variants?.deadlift || 'conventional_deadlift',
                    press: step1?.variants?.press || prev.variants?.press || 'overhead_press'
                },
                deadliftRepStyle: (step1 as any)?.deadliftRepStyle || prev.deadliftRepStyle || 'touch_and_go'
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step1.inputs]);

    // Push condensed snapshot back to builder meta on every calc change & debounce persist
    React.useEffect(() => {
        const { tmTable } = step1_fundamentals(state);
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
            tmTable: Object.fromEntries(tmTable.map(r => [r.lift, r.tmDisplay || 0])) as any
        };
        // include variants for persistence
        (condensed as any).variants = state.variants;
        condensed.deadliftRepStyle = state.deadliftRepStyle;
        setStep1(condensed);

        // Debounced persistence (skip during tests / SSR)
        const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
        let handle: any;
        if (!isTest) {
            handle = setTimeout(async () => {
                try {
                    const userId = await getCurrentUserId();
                    if (!userId) return;
                    const payload = {
                        user_id: userId,
                        step: 1,
                        state: state, // full UI state for potential future migrations
                        condensed,
                        updated_at: new Date().toISOString()
                    };
                    // Upsert into table program_builder_state (create instruction in README if table missing)
                    await supabase.from('program_builder_state').upsert(payload, { onConflict: 'user_id,step' });
                } catch (err) {
                    // Non-fatal
                    if (import.meta.env.DEV) console.warn('Step1 persist failed', err);
                }
            }, 600); // 600ms debounce
        }
        return () => handle && clearTimeout(handle);
    }, [state, setStep1]);

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
                    setState((s) => ({ ...s, ...data.state }));
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
    const { tmTable, helper } = step1_fundamentals(state);

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
    };

    const onTmPct = (pct: 0.85 | 0.90) => setState(s => ({ ...s, tmPct: pct }));

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

    // Unified vertical red stacked buttons selector as requested
    const renderMethodSelector = (_variant: any, lift: LiftKey, method: string) => {
        const change = (m: 'tested' | 'reps' | 'manual') => setMethod(lift, m);
        const base = 'w-full text-[12px] tracking-wide font-medium px-3 py-2 rounded-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900';
        const activeCls = 'bg-red-700 text-white shadow-sm';
        const inactiveCls = 'bg-red-800 text-red-100 hover:bg-red-700/90';
        return (
            <div className="flex flex-col gap-2">
                <button type="button" onClick={() => change('tested')} aria-pressed={method === 'tested'} className={`${base} ${method === 'tested' ? activeCls : inactiveCls}`}>Tested 1RM</button>
                <button type="button" onClick={() => change('reps')} aria-pressed={method === 'reps'} className={`${base} ${method === 'reps' ? activeCls : inactiveCls}`}>Reps x Weight</button>
                <button type="button" onClick={() => change('manual')} aria-pressed={method === 'manual'} className={`${base} ${method === 'manual' ? activeCls : inactiveCls}`}>Direct TM</button>
            </div>
        );
    };

    const onNext = () => {
        if (tmTable.some(r => (r.tmDisplay ?? 0) <= 0)) return; // guard
        if (saveProgramDraft) {
            saveProgramDraft({
                step1: state,
                tmTable,
                meta: { units: state.units, rounding: state.rounding, tmPct: state.tmPct }
            });
        }
        if (goToStep) goToStep(2); else if (navigate) navigate('/build/step2');
    };

    const tmLookup = React.useMemo(() => Object.fromEntries(tmTable.map(r => [r.lift, r.tmDisplay ?? '—'])), [tmTable]);

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
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Step 1 · Program Fundamentals</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-gray-400">Units</span>
                            <div className="flex gap-1.5">
                                <Pill active={state.units === 'lb'} onClick={() => onUnits('lb')}>LBS</Pill>
                                <Pill active={state.units === 'kg'} onClick={() => onUnits('kg')}>KG</Pill>
                            </div>
                        </label>

                        <label className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-gray-400">TM %</span>
                            <div className="flex gap-1.5">
                                <Pill active={state.tmPct === 0.90} onClick={() => onTmPct(0.90)}>90%</Pill>
                                <Pill active={state.tmPct === 0.85} onClick={() => onTmPct(0.85)}>85%</Pill>
                            </div>
                        </label>

                        <label className="flex items-center gap-3">
                            <Switch
                                checked={state.rounding.increment === (state.units === 'lb' ? 2.5 : 1.0)}
                                onCheckedChange={onToggleMicro}
                                label="Use microplates"
                            />
                            <HelperText>
                                LB increments: {state.units === 'lb' ? '2.5 / 5' : '—'} · KG increments: {state.units === 'kg' ? '1.0 / 2.5' : '—'}
                            </HelperText>
                        </label>
                        <label className="flex items-center gap-2">
                            <span className="text-xs uppercase tracking-wide text-gray-400">Rounding</span>
                            <div className="flex gap-1.5">
                                {(['nearest', 'down', 'up'] as const).map(r => (
                                    <Pill key={r} active={state.rounding.strategy === r} onClick={() => setState(s => ({ ...s, rounding: { ...s.rounding, strategy: r as any, increment: s.rounding.increment } }))}>{r}</Pill>
                                ))}
                            </div>
                        </label>
                    </div>
                </header>

                {/* TM Info Boxes */}
                <section className="grid sm:grid-cols-3 gap-4">
                    <div className="rounded-md border border-red-600/30 bg-gradient-to-br from-red-900/40 via-red-800/20 to-red-900/10 p-4 text-[11px] leading-relaxed shadow-sm">
                        <h4 className="text-xs font-semibold mb-1 tracking-wide text-red-300">Training Max</h4>
                        <p className="text-red-100/80">Use <span className="font-mono text-red-200">{Math.round(state.tmPct * 100)}%</span> of a real or estimated 1RM. Drop to 85% if recovery or technique is off.</p>
                    </div>
                    <div className="rounded-md border border-indigo-600/30 bg-gradient-to-br from-indigo-900/40 via-indigo-800/20 to-indigo-900/10 p-4 text-[11px] leading-relaxed shadow-sm">
                        <h4 className="text-xs font-semibold mb-1 tracking-wide text-indigo-300">Cycle Increments</h4>
                        <p className="text-indigo-100/80">Each new cycle: <span className="font-mono">+5 lb (upper) / +10 lb (lower)</span> or <span className="font-mono">+2.5 / +5 kg</span>.</p>
                    </div>
                    <div className="rounded-md border border-cyan-600/30 bg-gradient-to-br from-cyan-900/40 via-cyan-800/20 to-cyan-900/10 p-4 text-[11px] leading-relaxed shadow-sm">
                        <h4 className="text-xs font-semibold mb-1 tracking-wide text-cyan-300">Rounding & Microplates</h4>
                        <p className="text-cyan-100/80">Increment {state.rounding.increment}{state.units}. Microplates {state.rounding.increment < (state.units === 'lb' ? 5 : 2.5) ? 'enabled' : 'off'}.</p>
                        <p className="text-cyan-200/60 italic mt-1">{helper.roundingHint}</p>
                    </div>
                </section>
                <section className="rounded-md border border-gray-800 bg-gray-800/40 p-4 text-[11px] leading-relaxed text-gray-300">
                    <strong className="block mb-1 text-gray-200">How to enter Training Max</strong>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><span className="text-gray-200">Tested 1RM:</span> Enter a recent single. We multiply by TM%.</li>
                        <li><span className="text-gray-200">Reps x Weight:</span> Enter any multi‑rep PR (e.g. 5 reps @ 200). We estimate 1RM and apply TM%.</li>
                        <li><span className="text-gray-200">Direct TM:</span> Override and enter the exact Training Max you want to use.</li>
                    </ul>
                    <p className="mt-2 text-[10px] text-gray-400">Pick ONE method per lift. Switching methods preserves prior values so you can compare.</p>
                </section>

                {/* One-RM Inputs */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(['press', 'bench', 'squat', 'deadlift'] as LiftId[]).map((id, idx) => {
                        const tmVal = tmLookup[id];
                        const title = id === 'press' ? 'Overhead Press' : id;
                        const liftState: any = state.lifts[id];
                        const method = liftState.method;
                        const variant = 'stacked';
                        const currentVariant = state.variants ? state.variants[id as LiftId] : undefined;
                        return (
                            <div key={id} className="relative border border-gray-800/70 bg-gray-800/50 backdrop-blur rounded-md p-4 shadow-sm flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-300 font-semibold">{title}</div>
                                    <div className="text-[10px] px-2 py-1 rounded bg-gray-900/70 border border-gray-700 font-mono text-gray-200" aria-label={`${title} training max`}>
                                        {tmVal}
                                    </div>
                                </div>
                                <label className="block text-[10px] text-gray-400">
                                    Use Variant?
                                    <div className="mt-1 flex items-center gap-3 text-[11px]">
                                        <label className="inline-flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name={`variant-mode-${id}`}
                                                value="base"
                                                checked={!currentVariant || currentVariant === VARIANT_OPTIONS[id as LiftKey][0].code}
                                                onChange={() => setVariant(id as LiftKey, VARIANT_OPTIONS[id as LiftKey][0].code)}
                                            />
                                            <span className="text-gray-300">Base</span>
                                        </label>
                                        <label className="inline-flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name={`variant-mode-${id}`}
                                                value="variant"
                                                checked={!!currentVariant && currentVariant !== VARIANT_OPTIONS[id as LiftKey][0].code}
                                                onChange={() => {
                                                    // if switching to variant and currently base, pick second option as default
                                                    const list = VARIANT_OPTIONS[id as LiftKey];
                                                    setVariant(id as LiftKey, list[1]?.code || list[0].code);
                                                }}
                                            />
                                            <span className="text-gray-300">Variant</span>
                                        </label>
                                        {currentVariant && currentVariant !== VARIANT_OPTIONS[id as LiftKey][0].code && (
                                            <select
                                                className="ml-2 flex-1 rounded-md border border-gray-700 bg-gray-900/60 px-2 py-1 text-[11px] text-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
                                                value={currentVariant}
                                                data-testid={`variant-${id}`}
                                                onChange={e => setVariant(id as LiftKey, e.target.value)}
                                            >
                                                {VARIANT_OPTIONS[id as LiftKey].filter((_, i) => i > 0).map(opt => (
                                                    <option key={opt.code} value={opt.code}>{opt.label}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </label>
                                {renderMethodSelector(variant, id, method)}
                                {method === 'tested' && (
                                    <label className="block text-[11px] font-medium text-gray-300">
                                        Enter 1RM ({state.units})
                                        <Input value={(liftState.oneRM ?? 0) === 0 ? '' : liftState.oneRM} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTested1RM(id, +e.target.value || 0)} />
                                    </label>
                                )}
                                {method === 'reps' && (
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                        <label className="font-medium text-gray-300">
                                            Weight ({state.units})
                                            <Input value={(liftState.weight ?? 0) === 0 ? '' : liftState.weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepCalc(id, +e.target.value || 0, liftState.reps || 0)} />
                                        </label>
                                        <label className="font-medium text-gray-300">
                                            Reps
                                            <Input value={(liftState.reps ?? 0) === 0 ? '' : liftState.reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepCalc(id, liftState.weight || 0, +e.target.value || 0)} />
                                        </label>
                                    </div>
                                )}
                                {method === 'manual' && (
                                    <label className="block text-[11px] font-medium text-gray-300">
                                        Training Max ({state.units})
                                        <Input value={(liftState.manualTM ?? 0) === 0 ? '' : liftState.manualTM} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualTM(id, +e.target.value || 0)} />
                                    </label>
                                )}
                                {/* Deadlift Rep Style (belongs in fundamentals – global technical preference) */}
                                {id === 'deadlift' && (
                                    <div className="flex flex-col gap-1 mt-1" data-testid="deadlift-rep-style-picker">
                                        <div className="text-[10px] uppercase tracking-wide text-gray-500">Rep Style</div>
                                        <div className="flex gap-2">
                                            {(['dead_stop', 'touch_and_go'] as const).map(style => {
                                                const active = (state as any).deadliftRepStyle === style || ((state as any).deadliftRepStyle == null && style === 'touch_and_go');
                                                return (
                                                    <button
                                                        key={style}
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() => setState(s => ({ ...(s as any), deadliftRepStyle: style }))}
                                                        data-testid={`deadlift-style-${style}`}
                                                        className={`px-2.5 py-1 rounded border text-[10px] font-medium ${active ? 'border-red-500 bg-red-700/30 text-red-200' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                                                    >{style === 'dead_stop' ? 'Dead Stop' : 'Touch & Go'}</button>
                                                );
                                            })}
                                        </div>
                                        <div className="text-[10px] text-gray-500">Sets expectation for main & supplemental pulling tempo.</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>

                {/* (Legacy combined TM tips replaced by info boxes above) */}

                {/* TM Table */}
                <section>
                    <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-900/40">
                        <table className="w-full text-xs border-collapse">
                            <thead className="bg-gray-800/70">
                                <tr className="text-left">
                                    <th className="py-2 pl-3 pr-4 font-semibold text-gray-300">Lift</th>
                                    <th className="py-2 pr-4 font-semibold text-gray-300">1RM ({state.units})</th>
                                    <th className="py-2 pr-4 font-semibold text-gray-300">TM {Math.round(state.tmPct * 100)}%</th>
                                    <th className="py-2 pr-4 font-semibold text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {tmTable.map(row => {
                                    const liftInput = state.lifts[row.lift];
                                    let baseVal: number | string = '—';
                                    if (liftInput) {
                                        switch (liftInput.method) {
                                            case 'tested':
                                                baseVal = liftInput.oneRM;
                                                break;
                                            case 'reps':
                                                baseVal = liftInput.weight;
                                                break;
                                            case 'manual':
                                                baseVal = liftInput.manualTM;
                                                break;
                                        }
                                    }
                                    return (
                                        <tr key={row.lift} className="hover:bg-gray-800/30 transition">
                                            <td className="py-2 pl-3 pr-4 capitalize text-gray-200">{
                                                (() => {
                                                    const code = state.variants?.[row.lift];
                                                    if (!code) return (row.lift === 'press' ? 'Overhead Press' : row.lift);
                                                    const list = VARIANT_OPTIONS[row.lift as LiftKey];
                                                    const found = list.find(o => o.code === code);
                                                    return found ? found.label : code.replace(/_/g, ' ');
                                                })()
                                            }</td>
                                            <td className="py-2 pr-4 text-gray-300">{baseVal}</td>
                                            <td className="py-2 pr-4 font-mono text-gray-100">{row.tmDisplay ?? '—'}</td>
                                            <td className={`py-2 pr-4 text-[10px] ${row.warnings.length ? 'text-amber-400' : 'text-emerald-400'}`}>{row.warnings.length ? row.warnings.join(', ') : 'OK'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="pt-2">
                    <Button onClick={onNext} className="w-full" data-testid="step1-next" disabled={tmTable.some(r => (r.tmDisplay ?? 0) <= 0)}>Next</Button>
                </div>
            </div>
        </div>
    );
}
