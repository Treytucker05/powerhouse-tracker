import React, { useState, useEffect, useRef } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/context/BuilderState';
import { SCHEMES as schemes, getSchemeDescriptor } from '@/lib/builder/templates';
import { PERCENT_SCHEMES } from '@/lib/fiveThreeOne/compute531.js';
import { WENDLER_531_BOOK_SUGGESTIONS as BOOK } from '@/lib/531-book-suggestions';
import BuilderProgress from './BuilderProgress';
import { WorkoutPreview } from './WorkoutPreview';

// Feature flag: expose future Leader/Anchor-era items when enabled
const ENABLE_FUTURE_FEATURES = false;

// Map book-sourced approaches to our internal step3.approach ids
const approaches = BOOK.approaches
    .filter(a => ENABLE_FUTURE_FEATURES || !a.future)
    .map(a => ({ id: a.id.replace('classic_531', 'classic531').replace('three_five_one', '351').replace('fives_pro', '5spro').replace('competition_prep', 'comp_prep'), label: a.label, description: a.description }));

// Gate SSL/BBS (future) per book notes; maintain existing id shapes used in state (widowmakers plural kept for compatibility)
const supplementalOptions = BOOK.supplemental
    .filter(s => ENABLE_FUTURE_FEATURES || !s.future)
    .map(s => (s.id === 'widowmaker' ? 'widowmakers' : s.id));
const assistanceModes = ['minimal', 'balanced', 'template', 'custom'];
const conditioningPlans = ['minimal', 'standard', 'extensive'];

// Template-driven default mappings (approximate placeholders)
const TEMPLATE_DEFAULTS: Record<string, Partial<ReturnType<typeof defaultStep3>>> = {
    bbb: { scheduleFrequency: 4, supplemental: 'bbb', assistanceMode: 'balanced', warmupsEnabled: true, warmupScheme: 'standard', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    triumvirate: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'minimal' },
    periodization_bible: { scheduleFrequency: 4, supplemental: 'ssl', assistanceMode: 'balanced', warmupsEnabled: true, warmupScheme: 'standard', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    bodyweight: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    jackshit: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'minimal' }
};

const defaultStep3 = () => ({
    scheduleFrequency: 4 as 2 | 3 | 4,
    warmupsEnabled: true,
    warmupScheme: 'standard',
    approach: 'classic531',
    deload: true,
    supplemental: 'bbb',
    assistanceMode: 'balanced',
    conditioningPlan: 'standard',
    customNotes: ''
});

export default function DesignCustomize() {
    const { step1, step2, step3, setStep3, setStep2 } = useBuilder();
    const navigate = useNavigate();
    const [locked, setLocked] = useState(false); // "Use Template Defaults" lock
    const [hasUserCustomizations, setHasUserCustomizations] = useState(false); // Track if user has made manual changes
    const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null); // Track which template defaults were last applied

    const setField = (field: string, value: any) => {
        setStep3({ [field]: value } as any);
        setHasUserCustomizations(true); // Mark that user has made customizations
    };

    // Normalize when schedule frequency changes: enforce canonical week lengths for 2- & 3-day; ensure 4-day order.
    useEffect(() => {
        const freq = step3.scheduleFrequency || 4;
        const canonical4 = ['press', 'deadlift', 'bench', 'squat'];
        if (freq === 4) {
            if (!step3.liftOrder || step3.liftOrder.length !== 4) {
                setStep3({ liftOrder: canonical4 } as any);
            }
            if (!step3.liftRotation || step3.liftRotation.length !== 1 || step3.liftRotation[0].length !== 4) {
                setStep3({ liftRotation: [canonical4] } as any);
            }
            return;
        }
        const pattern3: string[][] = [['press', 'deadlift', 'bench'], ['squat', 'press', 'deadlift']];
        const pattern2: string[][] = [['press', 'deadlift'], ['bench', 'squat']];
        const canonical = freq === 3 ? pattern3 : pattern2;
        const current = step3.liftRotation || [];
        let needs = false;
        // Build new rotation enforcing week array lengths === freq
        const next = [0, 1].map(i => {
            const existingWeek = current[i] || [];
            if (existingWeek.length !== freq) {
                needs = true; return canonical[i];
            }
            return existingWeek.slice(0, freq);
        });
        if (current.length !== 2) needs = true;
        if (needs) setStep3({ liftRotation: next, liftOrder: next[0] } as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step3.scheduleFrequency]);

    // Auto-apply template defaults when template is selected for the first time
    // or when template changes and user hasn't made manual customizations
    useEffect(() => {
        if (!step2.templateId) return;

        // Apply defaults if:
        // 1. No template defaults have been applied yet (first time selection)
        // 2. Template changed and user hasn't made manual customizations
        // 3. User explicitly wants to use template defaults (locked mode)
        const shouldApplyDefaults = (
            appliedTemplateId !== step2.templateId && // Template changed or first selection
            (!hasUserCustomizations || locked) // User hasn't customized OR lock is enabled
        );

        if (shouldApplyDefaults) {
            const defaults = TEMPLATE_DEFAULTS[step2.templateId];
            if (defaults) {
                setStep3({ ...defaults } as any);
                setAppliedTemplateId(step2.templateId);
                // Reset customization flag if we're applying due to lock mode
                if (locked) {
                    setHasUserCustomizations(false);
                }
            }
        }
    }, [step2.templateId, hasUserCustomizations, locked, appliedTemplateId, setStep3]);

    const manualApply = () => {
        if (!step2.templateId) return;
        const defaults = TEMPLATE_DEFAULTS[step2.templateId];
        if (defaults) {
            setStep3({ ...defaults } as any);
            setAppliedTemplateId(step2.templateId);
            setHasUserCustomizations(false); // Reset customization tracking since we just applied defaults
        }
    };

    // Debounced persistence for Step3
    useEffect(() => {
        const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
        if (isTest) return;
        const handle = setTimeout(async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const payload = { user_id: userId, step: 3, state: step3, updated_at: new Date().toISOString() };
                await supabase.from('program_builder_state').upsert(payload, { onConflict: 'user_id,step' });
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Persist step3 failed', e);
            }
        }, 600);
        return () => clearTimeout(handle);
    }, [step3]);

    // Hydrate Step3
    useEffect(() => {
        let active = true;
        const run = async () => {
            const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
            if (isTest) return;
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const { data } = await supabase.from('program_builder_state').select('*').eq('user_id', userId).eq('step', 3).single();
                if (data?.state && active) {
                    setStep3(data.state);
                }
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Hydrate step3 failed', e);
            }
        };
        run();
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Simple readiness heuristic for user feedback
    const readiness = React.useMemo(() => {
        const tmValues = Object.values(step1.tmTable || {});
        const hasAllTMs = tmValues.length === 4 && tmValues.every(v => (v || 0) > 0);
        const hasSchedule = !!step3.scheduleFrequency;
        const hasScheme = !!step2.schemeId;
        const score = [hasAllTMs, hasSchedule, hasScheme].filter(Boolean).length;
        const status = score === 3 ? 'ready' : 'incomplete';
        const messages: string[] = [];
        if (!hasAllTMs) messages.push('Enter all Training Maxes in Step 1');
        if (!hasSchedule) messages.push('Choose schedule frequency');
        if (!hasScheme) messages.push('Select core loading scheme');
        return { status, messages };
    }, [step1.tmTable, step3.scheduleFrequency, step2.schemeId]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" data-testid="step3-container">
            <div className="px-8 pt-6"><BuilderProgress current={3} /></div>
            <header className="px-8 pt-8 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Customize Design</h1>
                    <p className="text-sm text-gray-400">Adjust schedule, warm-ups, supplemental & conditioning.</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm flex items-center gap-2">
                        <input type="checkbox" checked={locked} onChange={e => setLocked(e.target.checked)} />
                        <span>Use Template Defaults (lock)</span>
                    </label>
                    <button
                        type="button"
                        disabled={!step2.templateId}
                        onClick={manualApply}
                        className={`text-xs px-3 py-1 rounded border ${step2.templateId ? 'border-red-500 text-red-200 hover:bg-red-600/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >Apply Now</button>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    {step2.templateId && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-xs text-gray-400">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-gray-300 font-semibold">Template:</span>
                                <span className="px-2 py-0.5 rounded bg-gray-700/50 border border-gray-600 text-[10px] font-mono">{step2.templateId}</span>
                                {locked && <span className="px-2 py-0.5 rounded bg-red-600/70 text-white text-[10px]">Locked</span>}
                                {appliedTemplateId === step2.templateId && !hasUserCustomizations && (
                                    <span className="px-2 py-0.5 rounded bg-green-600/70 text-white text-[10px]">Defaults Applied</span>
                                )}
                                {hasUserCustomizations && (
                                    <span className="px-2 py-0.5 rounded bg-blue-600/70 text-white text-[10px]">Customized</span>
                                )}
                            </div>
                            <p className="leading-relaxed">
                                {appliedTemplateId === step2.templateId ? (
                                    hasUserCustomizations ?
                                        'Template defaults were applied and then customized. Use lock or Apply Now to revert to template defaults.' :
                                        'Template defaults are currently applied. Make changes to customize or enable lock to maintain defaults.'
                                ) : (
                                    'Template defaults are available. Enable lock or click Apply Now to load them.'
                                )}
                            </p>
                        </div>
                    )}
                    {/* Schedule */}
                    <div data-testid="schedule-editor" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Schedule</h2>
                        <div className="flex gap-3 text-sm">
                            {[2, 3, 4].map(freq => {
                                const selected = step3.scheduleFrequency === freq;
                                return (
                                    <button
                                        key={freq}
                                        data-testid={`schedule-btn-${freq}`}
                                        disabled={locked}
                                        onClick={() => {
                                            if (locked || step3.scheduleFrequency === freq) return;
                                            const canonical4 = ['press', 'deadlift', 'bench', 'squat'];
                                            if (freq === 4) {
                                                setStep3({ scheduleFrequency: freq as any, liftOrder: canonical4, liftRotation: [canonical4] } as any);
                                            } else if (freq === 3) {
                                                const pattern3 = [['press', 'deadlift', 'bench'], ['squat', 'press', 'deadlift']];
                                                setStep3({ scheduleFrequency: freq as any, liftRotation: pattern3, liftOrder: pattern3[0] } as any);
                                            } else { // 2-day
                                                const pattern2 = [['press', 'deadlift'], ['bench', 'squat']];
                                                setStep3({ scheduleFrequency: freq as any, liftRotation: pattern2, liftOrder: pattern2[0] } as any);
                                            }
                                        }}
                                        className={`px-3 py-1 rounded border transition focus:outline-none focus:ring-2 focus:ring-red-500/40 ${selected ? 'border-red-500 bg-gray-700 text-red-200' : 'border-gray-600 hover:bg-gray-700 text-gray-300'} ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        aria-pressed={selected}
                                        aria-label={`${freq}-Day schedule`}
                                    >{freq}-Day</button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 mb-2">Select training frequency; reorder primary lifts below.</p>
                        {(step3.scheduleFrequency === 4) && (
                            <LiftOrderEditor order={step3.liftOrder || ['press', 'deadlift', 'bench', 'squat']} setOrder={(o: string[]) => setField('liftOrder', o)} locked={locked} />
                        )}
                        {(step3.scheduleFrequency === 3 || step3.scheduleFrequency === 2) && (
                            <LiftRotationEditor
                                freq={step3.scheduleFrequency as 2 | 3}
                                rotation={step3.liftRotation || []}
                                setRotation={(r: string[][]) => setStep3({ liftRotation: r, liftOrder: r[0] } as any)}
                                locked={locked}
                            />
                        )}
                        {!locked && (() => {
                            const freq = step3.scheduleFrequency || 4;
                            const c4 = ['press', 'deadlift', 'bench', 'squat'];
                            const c3 = [['press', 'deadlift', 'bench'], ['squat', 'press', 'deadlift']];
                            const c2 = [['press', 'deadlift'], ['bench', 'squat']];
                            let needsFix = false;
                            if (freq === 4) {
                                const cur = step3.liftOrder || c4;
                                needsFix = cur.length !== c4.length || !c4.every((l, i) => cur[i] === l);
                            } else if (freq === 3) {
                                const rot = step3.liftRotation || [];
                                needsFix = rot.length !== 2 || rot[0].join(',') !== c3[0].join(',') || rot[1].join(',') !== c3[1].join(',');
                            } else if (freq === 2) {
                                const rot = step3.liftRotation || [];
                                needsFix = rot.length !== 2 || rot[0].join(',') !== c2[0].join(',') || rot[1].join(',') !== c2[1].join(',');
                            }
                            if (!needsFix) return null;
                            return (
                                <button
                                    type="button"
                                    data-testid="auto-correct-all"
                                    onClick={() => {
                                        if (freq === 4) setStep3({ liftOrder: c4 } as any);
                                        else if (freq === 3) setStep3({ liftRotation: c3, liftOrder: c3[0] } as any);
                                        else setStep3({ liftRotation: c2, liftOrder: c2[0] } as any);
                                    }}
                                    className="mt-3 text-[10px] px-2 py-1 rounded border border-emerald-600 text-emerald-300 hover:bg-emerald-600/10"
                                >Auto-Correct Order</button>
                            );
                        })()}
                    </div>
                    {/* Warmups */}
                    {/* ================= WARM-UPS (Detailed) ================= */}
                    {/* Spec Mapping: PROGRAM_BUILDER_SPEC_COMPARISON.md → Step 3 Warm-ups row (Diff/Gaps: auto loads, full prep checklist, policy depth). */}
                    <div data-testid="warmup-chooser" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <h2 className="font-semibold">Warm-ups</h2>
                            {/* Future: tooltip/popover describing rationale */}
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                disabled={locked}
                                checked={!!step3.warmupsEnabled}
                                onChange={e => setField('warmupsEnabled', e.target.checked)}
                            />
                            <span>Enable Warm-ups</span>
                        </label>
                        {/* Policy Buttons (cards) */}
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Warm-up Policy">
                            {[
                                { id: 'standard', label: 'Standard' },
                                { id: 'minimalist', label: 'Minimalist' },
                                { id: 'jumps_integrated', label: 'Jumps Integrated' },
                                { id: 'custom', label: 'Custom' }
                            ].map(p => {
                                const warmupId = p.id === 'standard' ? 'percent_ramp' : (p.id === 'jumps_integrated' ? 'jumps_throws_plus_percent' : undefined);
                                const meta = warmupId ? BOOK.warmups.find(w => w.id === warmupId) : undefined;
                                const note = meta?.description || (p.id === 'minimalist' ? 'Fast 2‑set variant of percent ramp' : p.id === 'custom' ? 'Define rows' : '40/50/60 × 5/5/3');
                                const active = step3.warmupScheme === p.id;
                                const disabled = locked || !step3.warmupsEnabled;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        data-testid={`warmup-policy-${p.id}`}
                                        disabled={disabled}
                                        aria-pressed={active}
                                        onClick={() => !disabled && setField('warmupScheme', p.id as any)}
                                        className={`px-3 py-2 rounded border text-xs font-semibold tracking-wide transition ${active ? 'border-red-500 bg-red-700/30 text-red-200 ring-2 ring-red-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        title={note}
                                    >{p.label}</button>
                                );
                            })}
                        </div>
                        {/* NOV Full Body Prep Toggle */}
                        <div className="mt-1 flex items-center gap-3" data-testid="nov-prep-toggle">
                            <label className="flex items-center gap-2 text-xs font-medium">
                                <input
                                    type="checkbox"
                                    disabled={locked || !step3.warmupsEnabled}
                                    checked={!!(step3 as any).novFullPrep}
                                    onChange={e => setField('novFullPrep', e.target.checked)}
                                />
                                <span>N.O.V. Full‑Body Warm‑Up (Foam + Stretch + Rope)</span>
                            </label>
                            {(step3 as any).novFullPrep && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-700/40 border border-indigo-500 text-indigo-200">Active</span>}
                        </div>
                        {/* Deadlift rep style moved to Step 1 (variant / lift fundamentals) */}
                        {/* Policy Explainers */}
                        <div className="text-[11px] text-gray-400 space-y-1">
                            {step3.warmupScheme === 'standard' && <div><span className="text-gray-300 font-medium">Standard:</span> Progressive 3-set ramp maximizing rehearsal without fatigue.</div>}
                            {step3.warmupScheme === 'minimalist' && <div><span className="text-gray-300 font-medium">Minimalist:</span> Fast 2-set primer; rely on first work set for final groove.</div>}
                            {step3.warmupScheme === 'jumps_integrated' && <div><span className="text-gray-300 font-medium">Jumps Integrated:</span> 3–5 low‑fatigue jumps or throws then quick ramp (Standard or Minimalist variant).</div>}
                            {step3.warmupScheme === 'custom' && <div><span className="text-gray-300 font-medium">Custom:</span> Define exact % TM & reps below – keep total warm-up volume efficient (≈12–20 ramp reps).</div>}
                            {(step3 as any).novFullPrep && (
                                <div className="mt-2 border border-indigo-700/40 rounded bg-indigo-900/20 p-2 text-indigo-200 space-y-1" data-testid="nov-prep-details">
                                    <div className="text-[10px] uppercase tracking-wide font-semibold text-indigo-300">N.O.V. Full‑Body Sequence</div>
                                    <ol className="list-decimal ml-4 space-y-1 text-[11px]">
                                        <li><span className="font-medium">Foam Roll</span> – 30–50 passes each: IT Band, Hamstrings, Quads, Lower Back, Upper Back, Piriformis (PVC optional).</li>
                                        <li><span className="font-medium">Stretch</span> – 3–5 × 10s each: Hamstrings/Low Back, Hip Flexors/Quads, Shoulders/Chest.</li>
                                        <li><span className="font-medium">Jump Rope</span> (rest only as needed): 100 double-leg → 50 left → 50 right → 100 alternating → 50 high-knees → 100 double-leg.</li>
                                    </ol>
                                    <div className="text-[10px] text-indigo-300/70">Session Flow: N.O.V. Prep → Barbell Ramp Sets → 5/3/1 Work → Conditioning.</div>
                                </div>
                            )}
                            {!step3.warmupsEnabled && <div className="text-amber-400">Disabled – ensure at least empty bar prep before working sets.</div>}
                            <div className="text-[10px] text-gray-500 italic">Goal: arrive at first work set neurologically primed, not fatigued.</div>
                        </div>
                        {/* Custom Warm-up Editor */}
                        {step3.warmupsEnabled && step3.warmupScheme === 'custom' && (
                            <WarmupCustomEditor
                                locked={locked}
                                rows={(step3 as any).customWarmups || []}
                                setRows={(rows) => setField('customWarmups', rows)}
                            />
                        )}
                        {/* Preview */}
                        {step3.warmupsEnabled && (
                            <WarmupPreview
                                scheme={step3.warmupScheme as any}
                                customRows={(step3 as any).customWarmups || []}
                            />
                        )}
                        {/* TODO(engine): integrate TM-based absolute load calculation + rounding once percent engine wired. */}
                    </div>
                    {/* Approach */}
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Programming Approach</h2>
                        <div className="flex flex-wrap gap-2">
                            {approaches.map(a => (
                                <button
                                    key={a.id}
                                    data-testid={`approach-${a.id}`}
                                    disabled={locked}
                                    onClick={() => setField('approach', a.id)}
                                    className={`px-3 py-1 rounded border text-xs ${step3.approach === a.id ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}
                                    title={a.description}
                                >{a.label}</button>
                            ))}
                        </div>
                        {(() => {
                            const mapToCatalog: Record<string, string> = {
                                classic531: 'classic_531',
                                '351': 'three_five_one',
                                '5spro': 'fives_pro',
                                comp_prep: 'competition_prep'
                            };
                            const approachKey = String(step3.approach || '');
                            const catalogId = (mapToCatalog as Record<string, string>)[approachKey] || approachKey;
                            const meta = BOOK.approaches.find(a => a.id === catalogId);
                            if (!meta) return null;
                            const suggestions: string[] = [];
                            if (catalogId === 'classic_531') {
                                suggestions.push('Deload each cycle (Week 4).');
                                suggestions.push('Use PR sets on Weeks 1–3.');
                            } else if (catalogId === 'three_five_one') {
                                suggestions.push('6‑week wave: run 3x3 then 3x5.');
                                suggestions.push('Plan a deload after two cycles.');
                            } else if (catalogId === 'fives_pro') {
                                suggestions.push('Pair main work with FSL or SSL supplemental.');
                                suggestions.push('AMRAPs off for main sets (sets of 5).');
                            } else if (catalogId === 'competition_prep') {
                                suggestions.push('Include controlled singles in training.');
                                suggestions.push('Adjust PR logic to peak for a meet.');
                            }
                            return (
                                <div className="mt-3 border border-gray-700 rounded bg-gray-900/40 p-3 text-xs">
                                    <div className="font-semibold text-gray-200 mb-1">About: {meta.label}</div>
                                    <div className="text-gray-300 mb-2">{meta.description}</div>
                                    {suggestions.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-1 text-gray-300">
                                            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    )}
                                    {meta.source && (
                                        <div className="mt-2 text-[10px] text-gray-500">Source: {meta.source}</div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                    {/* Deload */}
                    <div data-testid="deload-toggle" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <span className="font-semibold">Deload Week</span>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" disabled={locked} checked={!!step3.deload} onChange={e => setField('deload', e.target.checked)} /> Enabled
                        </label>
                    </div>
                    {/* Supplemental */}
                    <div data-testid="supplemental-picker" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Supplemental</h2>
                        <div className="flex flex-wrap gap-2">
                            {supplementalOptions.map(opt => {
                                const meta = BOOK.supplemental.find(s => s.id === (opt === 'widowmakers' ? 'widowmaker' : opt));
                                const label = meta?.label || opt.toUpperCase();
                                const tip = meta?.description || '';
                                return (
                                    <button
                                        key={opt}
                                        disabled={locked}
                                        onClick={() => setField('supplemental', opt)}
                                        className={`px-3 py-1 rounded border text-xs ${step3.supplemental === opt ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}
                                        title={tip}
                                    >{label}</button>
                                );
                            })}
                        </div>
                        {(() => {
                            const selId = step3.supplemental === 'widowmakers' ? 'widowmaker' : step3.supplemental;
                            const meta = BOOK.supplemental.find(s => s.id === (selId as any));
                            if (!meta) return null;
                            return (
                                <div className="mt-3 border border-gray-700 rounded bg-gray-900/40 p-3 text-xs" data-testid="supplemental-details">
                                    <div className="font-semibold text-gray-200 mb-1">About: {meta.label}</div>
                                    <div className="text-gray-300 mb-2">{meta.description}</div>
                                    <div className="grid sm:grid-cols-2 gap-2 mb-1">
                                        <div className="text-[11px] text-gray-400"><span className="text-gray-300 font-medium">Default TM:</span> {meta.defaultTM}</div>
                                        <div className="text-[11px] text-gray-400"><span className="text-gray-300 font-medium">Loading:</span> {meta.defaultLoading}</div>
                                    </div>
                                    {meta.typicalCombos && meta.typicalCombos.length > 0 && (
                                        <div className="text-[11px] text-gray-400"><span className="text-gray-300 font-medium">Typical Pairing:</span> {meta.typicalCombos.join(' · ')}</div>
                                    )}
                                    {meta.source && <div className="mt-2 text-[10px] text-gray-500">Source: {meta.source}</div>}
                                </div>
                            );
                        })()}
                    </div>
                    {/* Assistance */}
                    <div data-testid="assistance-picker" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Assistance</h2>
                        <div className="flex flex-wrap gap-2">
                            {assistanceModes.map(m => {
                                const meta = BOOK.assistance.find(a => a.id === m as any);
                                const isTemplateChoice = m === 'template';
                                const disabled = locked || (isTemplateChoice && !step2.templateId);
                                return (
                                    <button
                                        key={m}
                                        disabled={disabled}
                                        onClick={() => setField('assistanceMode', m)}
                                        className={`px-3 py-1 rounded border text-xs ${step3.assistanceMode === m ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        title={isTemplateChoice && !step2.templateId ? 'Select a template first' : (meta?.notes || '')}
                                        data-testid={`assistance-mode-${m}`}
                                    >{meta?.label || m}</button>
                                );
                            })}
                        </div>
                        {(() => {
                            const meta = BOOK.assistance.find(a => a.id === (step3.assistanceMode as any));
                            if (!meta) return null;
                            return (
                                <div className="mt-3 border border-gray-700 rounded bg-gray-900/40 p-3 text-xs" data-testid="assistance-details">
                                    <div className="font-semibold text-gray-200 mb-1">Targets: {meta.label}</div>
                                    <ul className="text-gray-300 space-y-1">
                                        <li><span className="text-gray-400">Push:</span> {meta.pushReps}</li>
                                        <li><span className="text-gray-400">Pull:</span> {meta.pullReps}</li>
                                        <li><span className="text-gray-400">Single-leg/Core:</span> {meta.singleLegCoreReps}</li>
                                    </ul>
                                    {meta.notes && <div className="mt-2 text-[11px] text-gray-400">{meta.notes}</div>}
                                    {step3.assistanceMode === 'template' && (
                                        <div className="mt-1 text-[10px] text-amber-300">{!step2?.templateId ? 'Select a template to enable template‑driven assistance.' : 'Follows template assistance (varies with '}{(() => {
                                            const sId = step3.supplemental === 'widowmakers' ? 'widowmaker' : step3.supplemental;
                                            const sMeta = BOOK.supplemental.find(s => s.id === (sId as any));
                                            return sMeta?.label || 'selection';
                                        })()}{step2?.templateId ? ` · ${step2.templateId}` : ''}{step2?.templateId ? ').' : ''}</div>
                                    )}
                                    {meta.source && <div className="mt-2 text-[10px] text-gray-500">Source: {meta.source}</div>}
                                    {step3.assistanceMode === 'custom' && (
                                        <div className="mt-2 text-[11px] text-gray-400">Custom picker coming soon – you’ll set push/pull/SL‑core targets per day.</div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                    {/* Conditioning */}
                    {/* Schemes (moved from Step 2) */}
                    <div data-testid="scheme-selector" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Core Scheme & AMRAP</h2>
                        <div className="grid sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Select 531 scheme">
                            {schemes.map(s => {
                                const selected = step2.schemeId === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setStep2({ schemeId: s.id })}
                                        className={`text-left rounded-md border p-3 text-xs transition ${selected ? 'border-red-500 bg-red-700/20 shadow-sm' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`}
                                        data-testid={`scheme-${s.id}`}
                                    >
                                        <div className="font-semibold mb-0.5 flex items-center gap-1">
                                            <span>{s.title}</span>
                                            {selected && <span className="text-[9px] px-1 py-0.5 rounded bg-red-600 text-white">Selected</span>}
                                        </div>
                                        <div className="text-[10px] text-gray-400">AMRAP: {s.amrap}</div>
                                        {selected && (
                                            <div className="mt-1 text-[10px] font-mono bg-red-900/30 border border-red-600/30 rounded px-2 py-1" data-testid={`scheme-descriptor-inline-${s.id}`}>{getSchemeDescriptor(s.id)}</div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Main Set Option selector (Option 1 vs Option 2) */}
                        <div className="mt-4" data-testid="main-set-option-selector">
                            <h3 className="font-semibold mb-2 text-sm">Main Set Option</h3>
                            <div className="flex gap-2 text-xs">
                                {[1, 2].map(opt => {
                                    const meta = BOOK.mainSetOptions.find(m => m.id === (opt === 1 ? 'option1' : 'option2'));
                                    const selected = (step3 as any).mainSetOption === opt || (!step3.mainSetOption && opt === 1);
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => setStep3({ mainSetOption: opt } as any)}
                                            className={`px-3 py-1 rounded border transition ${selected ? 'border-red-500 bg-gray-700 text-red-200' : 'border-gray-600 hover:bg-gray-700 text-gray-300'}`}
                                            data-testid={`main-set-opt-${opt}`}
                                            title={meta?.description || undefined}
                                        >{meta?.label || `Option ${opt}`}</button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">{BOOK.mainSetOptions.find(m => m.id === ((step3.mainSetOption || 1) === 1 ? 'option1' : 'option2'))?.description || 'Select base percentage pattern for Week 1–3 main work.'}</p>
                            {/* Percent Table Preview */}
                            <MainSetPercentPreview option={step3.mainSetOption || 1} tms={step1.tmTable} rounding={step1.rounding} scheduleFreq={step3.scheduleFrequency || 4} />
                        </div>
                    </div>
                    <div data-testid="conditioning-planner" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Conditioning</h2>
                        <div className="flex flex-wrap gap-2">
                            {conditioningPlans.map(cp => {
                                const meta = BOOK.conditioning.find(c => c.id === cp as any);
                                const label = meta?.label || cp;
                                const tip = meta ? `${meta.hardDaysPerWeek} hard / ${meta.easyDaysPerWeek} easy. ${meta.notes || ''}` : '';
                                const active = step3.conditioningPlan === cp;
                                return (
                                    <button
                                        key={cp}
                                        disabled={locked}
                                        onClick={() => setField('conditioningPlan', cp)}
                                        className={`px-3 py-1 rounded border text-xs transition ${active ? 'border-red-500 bg-red-700/30 text-red-200 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700 text-gray-300'} ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        title={tip}
                                    >{label}</button>
                                );
                            })}
                        </div>
                        {(() => {
                            const meta = BOOK.conditioning.find(c => c.id === (step3.conditioningPlan as any));
                            if (!meta) return null;
                            return (
                                <div className="mt-3 border border-gray-700 rounded bg-gray-900/40 p-3 text-xs" data-testid="conditioning-details">
                                    <div className="font-semibold text-gray-200 mb-1">About: {meta.label}</div>
                                    <div className="grid sm:grid-cols-2 gap-2 mb-1 text-[11px] text-gray-400">
                                        <div><span className="text-gray-300 font-medium">Hard Days / Week:</span> {meta.hardDaysPerWeek}</div>
                                        <div><span className="text-gray-300 font-medium">Easy Days / Week:</span> {meta.easyDaysPerWeek}</div>
                                    </div>
                                    {meta.notes && (
                                        <div className="text-[11px] text-gray-400">{meta.notes}</div>
                                    )}
                                    {meta.source && <div className="mt-2 text-[10px] text-gray-500">Source: {meta.source}</div>}
                                </div>
                            );
                        })()}
                    </div>
                    {/* Notes */}
                    <div data-testid="custom-notes" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Notes & Rationale</h2>
                        <textarea
                            value={step3.customNotes || ''}
                            onChange={e => setField('customNotes', e.target.value.slice(0, 800))}
                            placeholder="Add optional context: goals for this cycle, recovery considerations, constraints..."
                            className="w-full h-32 text-sm rounded border border-gray-700 bg-gray-900/60 p-2 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                        <div className="text-[10px] text-gray-500 mt-1 flex justify-between"><span>Private to you (saved with export)</span><span>{(step3.customNotes?.length || 0)}/800</span></div>
                    </div>
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Live Summary</h3>
                        <ul className="text-xs space-y-1">
                            <li>Schedule: {step3.scheduleFrequency}-day</li>
                            <li>Warm-ups: {step3.warmupsEnabled ? step3.warmupScheme : 'off'}</li>
                            {(step3 as any).novFullPrep && <li>N.O.V. Prep: <span className="text-indigo-300">on</span></li>}
                            <li>Approach: {(() => {
                                const a = approaches.find(x => x.id === step3.approach);
                                return a ? a.label : step3.approach;
                            })()}</li>
                            <li>Deload: {step3.deload ? 'on' : 'off'}</li>
                            <li>Supplemental: {(() => {
                                const selId = step3.supplemental === 'widowmakers' ? 'widowmaker' : step3.supplemental;
                                const meta = BOOK.supplemental.find(s => s.id === (selId as any));
                                return meta?.label || step3.supplemental;
                            })()}</li>
                            <li>Assistance: {(() => {
                                const meta = BOOK.assistance.find(a => a.id === (step3.assistanceMode as any));
                                return meta?.label || step3.assistanceMode;
                            })()}</li>
                            <li>Conditioning: {(() => {
                                const meta = BOOK.conditioning.find(c => c.id === (step3.conditioningPlan as any));
                                return meta?.label || step3.conditioningPlan;
                            })()}</li>
                            <li>Scheme: {step2.schemeId || '(none)'}</li>
                            <li>Main Set Opt: {step3.mainSetOption || 1}</li>
                            {(() => {
                                const variants = (step1 as any)?.variants || {};
                                const baseMap: Record<string, string> = {
                                    press: 'overhead_press', bench: 'bench_press', squat: 'back_squat', deadlift: 'conventional_deadlift'
                                };
                                const nonBase = Object.entries(variants).filter(([k, v]) => baseMap[k] && baseMap[k] !== v);
                                if (!nonBase.length) return null;
                                return <li data-testid="summary-variant-badge">Variants: <span className="text-amber-300">{nonBase.length} customized</span></li>;
                            })()}
                            {step3.customNotes && <li>Notes: {step3.customNotes.slice(0, 40)}{(step3.customNotes || '').length > 40 ? '…' : ''}</li>}
                        </ul>
                    </div>

                    {/* Enhanced Workout Preview for selected template */}
                    {step2.templateId && (
                        <WorkoutPreview templateId={step2.templateId} expanded={true} />
                    )}

                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm" data-testid="readiness-box">
                        <h3 className="font-semibold mb-2">Generation Readiness</h3>
                        {readiness.status === 'ready' ? (
                            <p className="text-xs text-emerald-400">All core inputs set. Proceed to Step 4 to preview.</p>
                        ) : (
                            <ul className="text-xs list-disc pl-4 space-y-1 text-amber-400">
                                {readiness.messages.map(m => <li key={m}>{m}</li>)}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
            <footer className="px-8 py-4 border-t border-gray-800 flex items-center justify-end gap-4">
                <button onClick={() => navigate('/build/step2')} className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                <button onClick={() => navigate('/build/step4')} className="px-4 py-2 rounded border border-red-500 text-sm hover:bg-red-600/10">Next</button>
            </footer>
        </div>
    );
}

// Lightweight pointer-based reorder list (no external dnd lib)
interface LiftOrderEditorProps { order: string[]; setOrder: (order: string[]) => void; locked: boolean; }
const LIFT_LABELS: Record<string, string> = { press: 'Press', deadlift: 'Deadlift', bench: 'Bench', squat: 'Squat' };
function LiftOrderEditor({ order, setOrder, locked }: LiftOrderEditorProps) {
    const dragItem = useRef<string | null>(null);
    const overItem = useRef<string | null>(null);

    const commit = () => {
        if (dragItem.current && overItem.current && dragItem.current !== overItem.current) {
            const newOrder = [...order];
            const fromIdx = newOrder.indexOf(dragItem.current);
            const toIdx = newOrder.indexOf(overItem.current);
            if (fromIdx > -1 && toIdx > -1) {
                newOrder.splice(toIdx, 0, ...newOrder.splice(fromIdx, 1));
                setOrder(newOrder);
            }
        }
        dragItem.current = null; overItem.current = null;
    };

    // Restrict reorder permutations to maintain Press before Bench and Deadlift before Squat if both present
    const validateOrder = (candidate: string[]) => {
        const idx = (id: string) => candidate.indexOf(id);
        if (idx('press') > -1 && idx('bench') > -1 && idx('press') > idx('bench')) return false;
        if (idx('deadlift') > -1 && idx('squat') > -1 && idx('deadlift') > idx('squat')) return false;
        return true;
    };

    return (
        <div className="mt-2">
            <ul className="flex flex-wrap gap-2">
                {order.map(id => {
                    const label = LIFT_LABELS[id] || id;
                    return (
                        <li key={id}
                            draggable={!locked}
                            onDragStart={() => { if (!locked) dragItem.current = id; }}
                            onDragEnter={() => { if (!locked) overItem.current = id; }}
                            onDragEnd={() => {
                                const prev = [...order];
                                commit();
                                if (!validateOrder(order)) {
                                    // revert if invalid pattern
                                    setOrder(prev);
                                }
                            }}
                            onDragOver={e => e.preventDefault()}
                            className={`select-none px-3 py-1 rounded border text-xs cursor-move ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-move'} border-gray-600 bg-gray-700/60`}
                            aria-label={`Lift ${label}`}
                        >{label}</li>
                    );
                })}
            </ul>
            {!locked && <p className="text-[10px] text-gray-500 mt-1">Drag to reorder lifts (affects weekly ordering in generation).</p>}
        </div>
    );
}

// ---------------- Warm-up Helpers (UI-only) ----------------
interface WarmupRow { pct: number; reps: number }
interface WarmupCustomEditorProps { locked: boolean; rows: WarmupRow[]; setRows: (rows: WarmupRow[]) => void }
function WarmupCustomEditor({ locked, rows, setRows }: WarmupCustomEditorProps) {
    const update = (i: number, field: keyof WarmupRow, value: number) => {
        const next = [...rows];
        next[i] = { ...next[i], [field]: value } as WarmupRow;
        setRows(next);
    };
    const add = () => setRows([...(rows || []), { pct: 40, reps: 5 }]);
    const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
    const reset = () => setRows([]);
    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded p-3 space-y-2" data-testid="warmup-custom-editor">
            <div className="text-[11px] text-gray-400">Define ramp (% TM & reps). Keep bar speed fast; bias fewer total reps if supplemental volume is high.</div>
            <div className="space-y-2">
                {rows.map((r, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-end" data-testid={`warmup-row-${i}`}>
                        <div className="col-span-5">
                            <label className="text-[10px] uppercase tracking-wide text-gray-500">% TM</label>
                            <input
                                type="number"
                                min={20}
                                max={90}
                                step={5}
                                value={r.pct}
                                onChange={e => update(i, 'pct', Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                data-testid={`warmup-row-${i}-pct`}
                            />
                        </div>
                        <div className="col-span-5">
                            <label className="text-[10px] uppercase tracking-wide text-gray-500">Reps</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                step={1}
                                value={r.reps}
                                onChange={e => update(i, 'reps', Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                data-testid={`warmup-row-${i}-reps`}
                            />
                        </div>
                        <div className="col-span-2 flex items-end">
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                disabled={locked}
                                className="px-2 py-1 text-xs rounded border border-gray-700 hover:bg-red-900/30 text-gray-300"
                                data-testid={`warmup-row-${i}-remove`}
                            >✕</button>
                        </div>
                    </div>
                ))}
                <div className="flex gap-2">
                    <button type="button" onClick={add} disabled={locked} className="px-3 py-1.5 rounded border border-gray-700 hover:bg-gray-800/60 text-xs text-gray-200" data-testid="warmup-add-row">Add Row</button>
                    {!!rows.length && <button type="button" onClick={reset} disabled={locked} className="px-3 py-1.5 rounded border border-red-600/60 hover:bg-red-900/40 text-xs text-red-300" data-testid="warmup-reset-rows">Reset</button>}
                </div>
            </div>
        </div>
    );
}

interface WarmupPreviewProps { scheme: string; customRows: WarmupRow[] }
function WarmupPreview({ scheme, customRows }: WarmupPreviewProps) {
    const sets = React.useMemo(() => {
        if (scheme === 'custom') return customRows;
        if (scheme === 'minimalist') return [{ pct: 40, reps: 5 }, { pct: 55, reps: 3 }];
        if (scheme === 'jumps_integrated') return [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 3 }]; // placeholder + jumps annotation
        return [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 3 }];
    }, [scheme, customRows]);
    return (
        <div data-testid="warmup-preview" className="mt-1 border border-gray-700 rounded bg-gray-900/40 divide-y divide-gray-800">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-gray-400">
                <span>Warm-up Preview</span>
            </div>
            <div className="p-3 text-[11px] text-gray-300 space-y-1">
                {scheme === 'jumps_integrated' && (
                    <div className="text-amber-300" data-testid="warmup-set-line">3–5 Jumps/Throws</div>
                )}
                {sets.map((s, i) => (
                    <div key={i} data-testid="warmup-set-line" className="flex items-center gap-2">
                        <span className="inline-block w-10 text-right font-mono">{s.pct}%</span>
                        <span className="text-gray-500">×</span>
                        <span className="font-mono w-4">{s.reps}</span>
                    </div>
                ))}
                <div className="pt-1 text-[10px] text-gray-500">Percentages reference Training Max; absolute load calc pending engine integration.</div>
            </div>
        </div>
    );
}

interface LiftRotationEditorProps { freq: 2 | 3; rotation: string[][]; setRotation: (r: string[][]) => void; locked: boolean; }
function LiftRotationEditor({ freq, rotation, setRotation, locked }: LiftRotationEditorProps) {
    const fallback = freq === 3 ? [['press', 'deadlift', 'bench'], ['squat', 'press', 'deadlift']] : [['press', 'deadlift'], ['bench', 'squat']];
    // Ensure weeks reflect current frequency length: trim if too long, pad (using fallback pattern) if too short
    const base = rotation.length >= 2 ? rotation : fallback;
    const weeks = base.map((w, idx) => {
        let copy = [...w];
        if (copy.length > freq) copy = copy.slice(0, freq);
        if (copy.length < freq) {
            const source = fallback[idx] || [];
            source.forEach(l => { if (copy.length < freq && !copy.includes(l)) copy.push(l); });
        }
        return copy;
    });
    const allLifts = ['press', 'deadlift', 'bench', 'squat'];

    const updateSlot = (weekIdx: number, slotIdx: number, value: string) => {
        const copy = weeks.map(w => [...w]);
        copy[weekIdx][slotIdx] = value;
        setRotation(copy);
    };

    // Warnings
    const cat = (l: string) => (l === 'press' || l === 'bench') ? 'upper' : 'lower';
    const warnings: string[] = [];
    // Missing coverage
    const flat = weeks.flat();
    allLifts.forEach(l => { if (!flat.includes(l)) warnings.push(`Rotation missing ${l}`); });
    weeks.forEach((week, wIdx) => {
        for (let i = 0; i < week.length - 1; i++) {
            if (cat(week[i]) === cat(week[i + 1])) warnings.push(`Week ${wIdx + 1} has back-to-back ${cat(week[i])} lifts (${week[i]} -> ${week[i + 1]})`);
        }
    });

    const applyAutoBalance = () => {
        if (locked) return;
        const balanced = freq === 3
            ? [['press', 'deadlift', 'bench'], ['squat', 'press', 'deadlift']]
            : [['press', 'deadlift'], ['bench', 'squat']];
        setRotation(balanced as string[][]);
    };

    return (
        <div className="space-y-3 mt-2" data-testid="lift-rotation-editor">
            {weeks.map((week, idx) => (
                <div key={idx} className="border border-gray-700 rounded p-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-2 flex items-center justify-between">
                        <span>Week {idx + 1}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {week.map((lift, i) => (
                            <select
                                key={i}
                                data-testid={`rotation-week-${idx}-slot-${i}`}
                                disabled={locked}
                                value={lift}
                                onChange={e => updateSlot(idx, i, e.target.value)}
                                className="bg-gray-900/60 border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            >
                                {allLifts.map(l => <option key={l} value={l}>{LIFT_LABELS[l]}</option>)}
                            </select>
                        ))}
                    </div>
                </div>
            ))}
            <p className="text-[10px] text-gray-500">Edit which main lifts appear each week. Coverage of all four is recommended over the rotation.</p>
            {warnings.length > 0 && (
                <div className="space-y-1">
                    <ul className="text-[10px] text-amber-400 list-disc pl-4 space-y-0.5" data-testid="rotation-warnings">
                        {warnings.map(w => <li key={w}>{w}</li>)}
                    </ul>
                    {!locked && <button type="button" data-testid="rotation-autobalance" onClick={applyAutoBalance} className="mt-1 text-[10px] px-2 py-1 rounded border border-emerald-600 text-emerald-300 hover:bg-emerald-600/10">Auto-Correct Rotation</button>}
                </div>
            )}
        </div>
    );
}

interface MainSetPercentPreviewProps { option: 1 | 2; tms: Record<string, number>; rounding: number; scheduleFreq: number; }
const LIFT_NAMES: Record<string, string> = { press: 'Press', deadlift: 'Deadlift', bench: 'Bench', squat: 'Squat' };
function MainSetPercentPreview({ option, tms, rounding, scheduleFreq }: MainSetPercentPreviewProps) {
    const scheme = PERCENT_SCHEMES[option] as Record<1 | 2 | 3 | 4, { pct: number; reps: string }[]>;
    if (!scheme) return null;
    const lifts = ['press', 'deadlift', 'bench', 'squat'];
    const roundTo = (w: number) => {
        if (!rounding) return Math.round(w);
        return Math.round(w / rounding) * rounding;
    };
    return (
        <div className="mt-4 border border-gray-700 rounded-md overflow-hidden" data-testid="main-set-percent-preview">
            <div className="bg-gray-900/60 px-3 py-2 text-[11px] uppercase tracking-wide text-gray-400 flex items-center justify-between">
                <span>Percent Pattern (Option {option})</span>
                <span className="text-gray-500">Schedule: {scheduleFreq}-Day</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                    <thead className="bg-gray-800/70">
                        <tr>
                            <th className="px-2 py-1 text-left">Week</th>
                            {lifts.map(l => <th key={l} className="px-2 py-1 text-left font-normal">{LIFT_NAMES[l]}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map((week) => (
                            <tr key={week} className="border-t border-gray-700/60">
                                <td className="px-2 py-1 text-gray-400">{week}</td>
                                {lifts.map(lift => {
                                    const tm = tms[lift] || 0;
                                    const wk = (week as 1 | 2 | 3 | 4);
                                    const sets = scheme[wk] || [];
                                    const cells = sets.map((s: { pct: number; reps: string }, i: number) => {
                                        const pctNum = s.pct;
                                        const load = tm ? roundTo(tm * pctNum / 100) : '-';
                                        const plus = typeof s.reps === 'string' && s.reps.includes('+');
                                        return <div key={i} className={`flex items-center justify-between gap-1 ${plus ? 'text-red-300' : 'text-gray-300'}`}>
                                            <span>{pctNum}%</span>
                                            <span className="text-gray-500">{load}</span>
                                        </div>;
                                    });
                                    return <td key={lift} className="px-2 py-1 align-top space-y-0.5">{cells}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-3 py-1.5 bg-gray-900/50 text-[10px] text-gray-500">Loads use current TMs (Step 1) rounded to {rounding}.</div>
        </div>
    );
}
