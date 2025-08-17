import React, { useState, useMemo, useEffect } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS, getTemplatePreset } from '../../../../lib/templates/531.presets.v2.js';
import { getTemplateSpec, TEMPLATE_SPECS } from '../../../../lib/templates/531.templateSpecs.js';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import ToggleButton from '../ToggleButton.jsx';
import { normalizeAssistance } from '../../assistance/index.js';
import AssistanceCatalogPicker from '../assistance/AssistanceCatalogPicker.jsx';
import { buildWarmupSets, buildMainSetsForLift } from '../..';

/**
 * Step2TemplateOrCustom.jsx
 * Choose a built-in template (auto-config + jump to review) or continue custom design.
 */
export default function Step2TemplateOrCustom({ onChoose, onAutoNext }) {
    const ctx = useProgramV2();
    const { state, dispatch } = ctx;
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [expandedTemplate, setExpandedTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const templateCards = useMemo(() => Object.values(TEMPLATE_SPECS).map(spec => ({
        key: spec.key,
        title: spec.name,
        blurb: spec.blurb,
        detail: spec.recovery,
        spec
    })), []);

    function logTemplate(stage, payload) {
        try {
            if (typeof window !== 'undefined' && window.localStorage?.getItem('debug.531.template') === 'off') return;
            // eslint-disable-next-line no-console
            console.info('[531:TEMPLATE_SYNC] Step2', stage, payload);
        } catch { /* ignore */ }
    }

    function handleSelectTemplate(key) {
        setSelectedTemplate(key);
        setExpandedTemplate(prev => prev === key ? null : key);
        setErrors([]);
        logTemplate('select', { key });

        // Validate template requirements
        const validation = validateTemplateRequirements(key, state);
        if (!validation.isValid) {
            setErrors(validation.errors);
        }
    }

    function validateTemplateRequirements(templateKey, currentState) {
        const errors = [];

        if (!currentState?.lifts) {
            errors.push('Complete Step 1 (Training Maxes) before selecting a template');
            return { isValid: false, errors };
        }

        const lifts = ['press', 'bench', 'squat', 'deadlift'];
        const missingTMs = lifts.filter(lift => !currentState.lifts[lift]?.tm || currentState.lifts[lift].tm <= 0);

        if (missingTMs.length > 0) {
            errors.push(`Missing training maxes for: ${missingTMs.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}`);
        }

        return { isValid: errors.length === 0, errors };
    }

    // Local BBB variant state (book-accurate BBB only)
    const [bbbVariant, setBbbVariant] = useState('standard'); // always standard (book-accurate)
    const [bbbPairing, setBbbPairing] = useState('same'); // 'same' | 'opposite'
    const [bbbStartPercent, setBbbStartPercent] = useState(50); // 50|55|60 (book range)
    const [bbbProgressTo, setBbbProgressTo] = useState(60); // target escalation within book range

    // Assistance editing state per template key -> map of Lift -> array of movements
    const [assistEdit, setAssistEdit] = useState({});
    const [openPicker, setOpenPicker] = useState(null); // { templateKey, lift, index } or null

    // Book-accurate BBB assistance defaults based on Wendler's "opposite movement pattern" guidance
    function getBBBAssistanceDefaults() {
        return {
            'Press': [{ name: 'Chin-up', sets: 5, reps: 10, block: 'Pull' }],
            'Bench': [{ name: 'DB Row', sets: 5, reps: 10, block: 'Pull' }],
            'Squat': [{ name: 'Leg Curl', sets: 5, reps: 10, block: 'Single-Leg' }],
            'Deadlift': [{ name: 'Hanging Leg Raise', sets: 5, reps: 15, block: 'Core' }]
        };
    }

    function initAssistanceForTemplate(templateKey, assistancePreview) {
        setAssistEdit(prev => {
            if (prev[templateKey]) return prev; // already initialized
            const mapped = {};

            // Pre-populate BBB with book-accurate assistance defaults
            if (templateKey === TEMPLATE_KEYS.BBB) {
                const bbbDefaults = getBBBAssistanceDefaults();
                assistancePreview.forEach(ap => {
                    const liftDefaults = bbbDefaults[ap.lift] || [];
                    mapped[ap.lift] = liftDefaults.length > 0 ? liftDefaults :
                        [{ name: '', sets: 5, reps: 10, block: null }]; // Empty slot with BBB defaults
                });
            } else {
                // Other templates use their existing logic
                assistancePreview.forEach(ap => {
                    const limit = templateKey === TEMPLATE_KEYS.BBB ? 1 : 2;
                    mapped[ap.lift] = (ap.items || []).slice(0, limit).map(it => ({
                        name: it.name,
                        sets: it.sets || 3,
                        reps: it.reps || 10,
                        block: it.block || null
                    }));
                });
            }
            return { ...prev, [templateKey]: mapped };
        });
    }

    // Initialize assistance editing structure once when a template is first expanded
    useEffect(() => {
        if (!expandedTemplate) return;
        if (assistEdit[expandedTemplate]) return; // already done
        const spec = getTemplateSpec(expandedTemplate);
        if (!spec) return;
        const lifts = ['Press', 'Deadlift', 'Bench', 'Squat'];
        const assistancePreview = lifts.map(l => ({ lift: l, items: normalizeAssistance(spec.key, l, state) }));
        initAssistanceForTemplate(expandedTemplate, assistancePreview);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedTemplate, state]);

    function updateAssist(templateKey, lift, idx, patch) {
        setAssistEdit(prev => {
            const tpl = { ...(prev[templateKey] || {}) };
            const arr = [...(tpl[lift] || [])];
            if (idx >= 0 && idx < arr.length) arr[idx] = { ...arr[idx], ...patch };
            tpl[lift] = arr;
            return { ...prev, [templateKey]: tpl };
        });
    }
    function addAssistRow(templateKey, lift, limit) {
        setAssistEdit(prev => {
            const tpl = { ...(prev[templateKey] || {}) };
            const arr = [...(tpl[lift] || [])];
            if (arr.length >= limit) return prev;

            // Use BBB defaults (5x10) vs standard defaults (3x10)
            const defaultSets = templateKey === TEMPLATE_KEYS.BBB ? 5 : 3;
            const defaultReps = 10;

            arr.push({ name: '', sets: defaultSets, reps: defaultReps, block: null });
            tpl[lift] = arr;
            return { ...prev, [templateKey]: tpl };
        });
    }
    function removeAssistRow(templateKey, lift, idx) {
        setAssistEdit(prev => {
            const tpl = { ...(prev[templateKey] || {}) };
            const arr = [...(tpl[lift] || [])];
            arr.splice(idx, 1);
            tpl[lift] = arr;
            return { ...prev, [templateKey]: tpl };
        });
    }

    function applyTemplate(templateKeyOverride) {
        const key = templateKeyOverride || selectedTemplate;
        if (!key || errors.length > 0) return;

        setIsLoading(true);
        setErrors([]);

        try {
            const opts = {};
            if (key === TEMPLATE_KEYS.BBB) {
                opts.bbb = {
                    variant: bbbVariant,
                    pairing: bbbPairing,
                    startPercent: bbbVariant === 'standard' ? bbbStartPercent : 30,
                    progressTo: bbbVariant === 'standard' ? bbbProgressTo : 60
                };
            }

            const preset = getTemplatePreset(key, ctx, opts);
            if (!preset) {
                throw new Error(`Template ${key} configuration not found`);
            }

            const spec = getTemplateSpec(key);

            // For BBB template, ensure all required fields are properly set
            if (key === TEMPLATE_KEYS.BBB) {
                // Ensure supplemental has percentage set
                preset.supplemental = {
                    ...preset.supplemental,
                    percentOfTM: bbbStartPercent,
                    percentage: bbbStartPercent, // Also set percentage field for compatibility
                    strategy: 'bbb',
                    sets: 5,
                    reps: 10,
                    pairing: bbbPairing
                };
                
                // Ensure assistance is in template mode unless user customized
                if (!assistEdit[key]) {
                    preset.assistance = {
                        mode: 'template',
                        templateId: key
                    };
                } else {
                    // User has customized - use custom mode
                    const plan = assistEdit[key];
                    preset.assistance = {
                        mode: 'custom',
                        customPlan: plan
                    };
                }
            } else {
                // Inject custom assistance if user edited (for non-BBB templates)
                if (assistEdit[key]) {
                    const plan = assistEdit[key];
                    preset.assistance = {
                        mode: 'custom',
                        customPlan: plan
                    };
                }
            }

            dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
            dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
            logTemplate('apply', { key: preset.key, schedule: preset.schedule, assistanceMode: preset.assistance?.mode, hasCustomAssist: !!assistEdit[key] });

            if (spec) {
                dispatch({ type: 'SET_TEMPLATE_SPEC', payload: spec });
                if (spec.assistanceHint) dispatch({ type: 'SET_ASSISTANCE_HINT', payload: spec.assistanceHint });
            }

            // Ensure we're in template mode
            dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
            dispatch({ type: 'SET_ASSIST_MODE', payload: preset.assistance?.mode || 'template' });

            setTimeout(() => {
                setIsLoading(false);
                // post-dispatch state snapshot
                try {
                    const st = ctx.state;
                    logTemplate('postDispatchState', { order: st?.schedule?.order, days: st?.schedule?.days });
                } catch { /* ignore */ }

                onChoose && onChoose('template');
                onAutoNext && onAutoNext();
                setExpandedTemplate(null);
            }, 300);

        } catch (error) {
            console.error('Template application error:', error);
            setErrors([error.message]);
            setIsLoading(false);
        }
    }

    function chooseCustom() {
        onChoose && onChoose('custom');
    }

    // Map an exercise block to a normalized movement pattern
    function mapBlockAlias(block) {
        if (!block) return '';
        const b = block.toLowerCase();
        if (/(chin|pull|row|face|lat)/.test(b)) return 'Pull';
        if (/(press|push|dip|triceps|bench|pushup)/.test(b)) return 'Push';
        if (/(single|split|lunge|step|pistol|cossack)/.test(b)) return 'Single-Leg';
        if (/(ab|core|plank|wheel|crunch|pallof|situp|side_plank|hanging|windshield)/.test(b)) return 'Core';
        if (/(back ext|good|rdl|ghr|ham|glute|hip|posterior|swing|reverse_hyper)/.test(b)) return 'Posterior';
        if (/(curl)/.test(b)) return 'Arms';
        return block;
    }

    function repSchemeDescriptor(templateKey, variant, row, blockAlias, isMainLiftSupplemental = false) {
        if (!templateKey) return '';
        const key = templateKey.toLowerCase();
        const blk = blockAlias || mapBlockAlias(row?.block);

        if (key === TEMPLATE_KEYS.BBB) {
            // Only show percentages for BBB supplemental work (same lift), not assistance
            if (isMainLiftSupplemental) {
                return `5×10 @ ${bbbStartPercent}% TM` + (bbbProgressTo && bbbProgressTo !== bbbStartPercent ? ` (progress toward ${bbbProgressTo}%)` : '');
            } else {
                // BBB assistance exercises just show fixed reps
                return '5×10';
            }
        }
        if (key === TEMPLATE_KEYS.TRIUMVIRATE) {
            if (blk === 'Pull') return '5×10';
            if (blk === 'Push') return '5×15';
            if (blk === 'Posterior') return '5×12';
            if (blk === 'Core') return '5×15';
            if (blk === 'Single-Leg') return '5×15-10';
            return '5×10';
        }
        if (key === TEMPLATE_KEYS.BODYWEIGHT) return 'Multiple sets to reach 75–100 reps';
        if (key === TEMPLATE_KEYS.PERIODIZATION_BIBLE) return '5×10-20';
        if (key === TEMPLATE_KEYS.JACK_SHIT) return 'None';
        return '';
    }

    return (
        <div className="space-y-6 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="text-white text-sm">Configuring template...</span>
                    </div>
                </div>
            )}

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 2 — Template or Custom</h2>
                <p className="text-gray-400">Select a proven Wendler template for instant configuration or continue with a fully custom build.</p>
            </div>

            {errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-red-400 mt-0.5">⚠️</div>
                        <div>
                            <h4 className="text-red-300 font-medium mb-2">Template Selection Issues</h4>
                            <ul className="space-y-1">
                                {errors.map((error, idx) => (
                                    <li key={idx} className="text-red-200 text-sm">• {error}</li>
                                ))}
                            </ul>
                            <div className="mt-3 text-xs text-red-300">
                                💡 Complete Step 1 (Training Maxes) before selecting a template
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 flex space-x-3">
                <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <div className="text-sm text-blue-100">
                    Applying a template will auto-configure schedule, supplemental, and assistance settings. Beginners typically start with <span className="font-semibold text-white">Triumvirate</span> or <span className="font-semibold text-white">Bodyweight Assistance</span>. Intermediate lifters chasing size may choose <span className="font-semibold text-white">Boring But Big</span>. Adjust after 1–2 cycles based on recovery.
                </div>
            </div>

            {/* Mode selection */}
            <div className="grid grid-cols-1 gap-6">
                {/* Template selection area */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Choose a Proven Template</h3>
                        <p className="text-sm text-gray-400 mb-4">Each template provides complete configuration based on Jim Wendler's proven methodologies. Click to expand details and configure.</p>
                        <div className="flex flex-col gap-4">
                            {templateCards.map(card => {
                                const active = selectedTemplate === card.key;
                                const expanded = expandedTemplate === card.key;
                                const spec = card.spec;
                                // Build expanded content data only if expanded
                                let expandedContent = null;
                                if (expanded) {
                                    const units = state?.units === 'kg' ? 'kg' : 'lbs';
                                    const roundingMode = typeof state?.rounding === 'string' ? state?.rounding : (state?.rounding?.mode || 'nearest');
                                    const roundingIncrement = typeof state?.rounding === 'object' ? (state?.rounding.increment || 5) : (units === 'kg' ? 2.5 : 5);
                                    const exampleLift = 'Bench';
                                    const tmBench = state?.lifts?.bench?.tm || 0;
                                    const warmupScheme = state?.schedule?.warmupScheme || { percentages: [40, 50, 60], reps: [5, 5, 3] };
                                    const includeWarmups = state?.schedule?.includeWarmups !== false;
                                    const loadingOption = state?.loadingOption || state?.loading?.option || 1;
                                    const weekIndex = 0;
                                    const warmups = includeWarmups ? buildWarmupSets({ includeWarmups: true, warmupScheme, tm: tmBench, roundingIncrement, roundingMode, units }) : [];
                                    const main = buildMainSetsForLift({ tm: tmBench, weekIndex, option: loadingOption, roundingIncrement, roundingMode, units }).sets;
                                    // assistance initialization now handled by useEffect
                                    const editing = assistEdit[card.key] || {};
                                    const configComplete = ['Press', 'Deadlift', 'Bench', 'Squat'].every(l => (editing[l] || []).length > 0);
                                    // Variant naming logic (BBB % + Jack Shit) mirroring modal
                                    let dynamicName = spec?.name;
                                    if (spec?.key === 'bbb') {
                                        const supp = state?.supplemental;
                                        if (supp?.strategy === 'bbb' && (supp?.pairing === 'same' || !supp?.pairing)) {
                                            if (supp?.percentOfTM === 50) dynamicName = 'BBB 50% (Same-Lift Start)';
                                            else if (supp?.percentOfTM === 60) dynamicName = 'BBB 60% (Same-Lift)';
                                        }
                                    }
                                    const isBBBVariant = /^BBB (50% \(Same-Lift Start\)|60% \(Same-Lift\))$/.test(dynamicName || '');
                                    const isJackShit = spec?.key === 'jack_shit';
                                    const suppPct = state?.supplemental?.percentOfTM;
                                    const variantStructure = isBBBVariant ? [
                                        'Main 5/3/1 sets (Week 1–3 AMRAP, Week 4 deload)',
                                        `Supplemental: 5×10 @ ${suppPct || 50}% TM (same lift)`,
                                        'Assistance: ONE movement (classic BBB) – e.g. chins, dips, rows, back raises, abs'
                                    ] : spec?.structure;
                                    const variantRecovery = isBBBVariant ? 'High supplemental volume – start lighter (50%) and progress cautiously to 60% over time. Favor easy conditioning (LISS) and cap assistance at 25–50 quality reps per movement. Deload Week 4.' : spec?.recovery;
                                    const jackShitStructure = [
                                        'Main 5/3/1 sets only (Week 1–3 AMRAP, Week 4 deload)',
                                        'Optional: 1–2 easy assistance movements (chins / dips / core)'
                                    ];
                                    const jackShitRecovery = 'Extremely low systemic stress. Ideal when time, equipment, or recovery is limited, or when re‑establishing training momentum.';
                                    expandedContent = (
                                        <div className="mt-4 border-t border-gray-700 pt-4 space-y-6 transition-all duration-300">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="text-sm font-semibold text-white flex items-center gap-2">{isJackShit ? 'Jack Shit' : (dynamicName || spec?.name)} <span className="px-1.5 py-0.5 rounded bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-[10px] uppercase tracking-wide">Details</span></h5>
                                                    <p className="text-xs text-indigo-200 mt-1 leading-snug">{isBBBVariant ? `High‑volume BBB same‑lift at ${suppPct || 50}% TM. Start light (50%)—only increase when recovery is solid.` : isJackShit ? 'Bare‑bones 5/3/1: main work only. Add a little optional assistance if fresh.' : spec?.blurb}</p>
                                                    {spec?.who && <p className="text-[11px] text-gray-400 mt-2"><span className="font-semibold text-gray-300">Who This Is For:</span> {spec.who}</p>}
                                                </div>
                                                <button onClick={() => setExpandedTemplate(null)} className="text-gray-500 hover:text-gray-300" aria-label="Collapse template"><X className="w-4 h-4" /></button>
                                            </div>
                                            {/* BBB Variant Controls */}
                                            {spec.key === 'bbb' && (
                                                <section className="bg-gray-800/60 border border-gray-700 rounded p-3 space-y-4 text-xs">
                                                    <h6 className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300">BBB Configuration</h6>
                                                    <div className="text-[11px] text-gray-300 space-y-2">
                                                        <p><span className="font-semibold text-indigo-300">Book-Accurate BBB:</span> Start at 50% of Training Max and work up to 60% over several cycles. Keep assistance minimal (1-2 exercises, 25-50 reps total).</p>
                                                    </div>
                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] uppercase text-gray-400">Start %</label>
                                                            <select value={bbbStartPercent} onChange={e => setBbbStartPercent(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                {[50, 55, 60].map(p => <option key={p} value={p}>{p}%</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] uppercase text-gray-400">Progress To</label>
                                                            <select value={bbbProgressTo} onChange={e => setBbbProgressTo(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                {[55, 60].map(p => <option key={p} value={p}>{p}%</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="block text-[10px] uppercase text-gray-400">Pairing</label>
                                                            <select value={bbbPairing} onChange={e => setBbbPairing(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                <option value="same">Same Lift</option>
                                                                <option value="opposite">Opposite Lift</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 leading-snug">
                                                        <p><strong className="text-gray-300">Book Guidance:</strong> Begin at 50% and only increase when recovery is solid. Most lifters should stay at 50-60% range as described in the original 5/3/1 manual.</p>
                                                    </div>
                                                </section>
                                            )}
                                            <section className="grid md:grid-cols-3 gap-4 text-xs">
                                                <div className="bg-gray-800/60 rounded p-3">
                                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Session Time</div>
                                                    <div className="text-gray-200">{isJackShit ? 'Very short (10–25 min)' : (isBBBVariant ? 'Moderate (45–60 min)' : spec?.time)}</div>
                                                </div>
                                                <div className="bg-gray-800/60 rounded p-3 md:col-span-2">
                                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Recovery</div>
                                                    <div className="text-gray-300 leading-snug text-[11px]">{isJackShit ? jackShitRecovery : variantRecovery}</div>
                                                </div>
                                            </section>
                                            <section>
                                                <h6 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Structure</h6>
                                                <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                                                    {(isJackShit ? jackShitStructure : variantStructure)?.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </section>
                                            {spec.assistanceHint && !isJackShit && (
                                                <section className="space-y-3">
                                                    <h6 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Assistance Guidance</h6>
                                                    <p className="text-[11px] text-gray-300 leading-snug">{isBBBVariant ? 'Choose ONE assistance movement only (book example). 25–50 quality reps. Keep it simple (e.g., chins, dips, rows, back raises, ab wheel). Progress load or reps slowly once recovery is rock solid.' : spec.assistanceHint.intent}</p>
                                                    {spec.assistanceHint.examples && Object.keys(spec.assistanceHint.examples).length > 0 && (
                                                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
                                                            {Object.entries(spec.assistanceHint.examples).map(([lift, arr]) => (
                                                                <div key={lift} className="bg-gray-800/50 rounded p-2">
                                                                    <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{lift}</div>
                                                                    <ul className="text-[11px] text-gray-300 space-y-0.5">
                                                                        {arr.map((ex, i) => <li key={i}>{ex}</li>)}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </section>
                                            )}
                                            {isJackShit && (
                                                <section className="space-y-2">
                                                    <h6 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Guidance</h6>
                                                    <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                                                        <li>Main 5/3/1 work only; optionally add chins / dips / core if very fresh.</li>
                                                        <li>Use when life stress or time is high, or re‑starting after a layoff.</li>
                                                        <li>Great base for layering conditioning or mobility.</li>
                                                    </ul>
                                                </section>
                                            )}
                                            <section className="bg-gray-800/50 border border-gray-700 rounded p-3 text-[11px] text-gray-300 space-y-1">
                                                <h6 className="text-[10px] font-semibold uppercase tracking-wide text-indigo-300">Week 4 Deload</h6>
                                                <p className="leading-snug">Main work: 40% ×5, 50% ×5, 60% ×5 of Training Max (no AMRAP). Cut back on everything - reduce or skip supplemental work and keep assistance light and restorative (easy pulls, core work) if desired.</p>
                                                <p className="leading-snug text-gray-400">Goal: "If you're deloading, DELOAD" - reduce all volume and intensity to prepare for the next cycle.</p>
                                            </section>
                                            <section>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h6 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Assistance Configuration</h6>
                                                    {configComplete && <span className="text-[10px] px-2 py-0.5 rounded bg-green-600/20 border border-green-500/40 text-green-300">✓ Configured</span>}
                                                </div>
                                                <div className="mb-4 text-[11px] text-gray-400 leading-snug bg-gray-800/40 border border-gray-700 rounded p-3">
                                                    <strong className="text-gray-300">Guidance:</strong> Balance push / pull / single‑leg / core patterns. Pick movements that complement the main lift without duplicating its stress. Favor high quality reps over fatigue.
                                                </div>
                                                {(() => {
                                                    // pattern recommendation map
                                                    return null; // placeholder to show structure if needed later
                                                })()}
                                                <div className="space-y-4">
                                                    {['Press', 'Deadlift', 'Bench', 'Squat'].map(liftName => {
                                                        const rows = editing[liftName] || [];
                                                        const limit = card.key === TEMPLATE_KEYS.BBB ? 1 : 2;
                                                        const showAdd = rows.length < limit;
                                                        const ensureRow = () => { if (rows.length === 0) addAssistRow(card.key, liftName, limit); };
                                                        const recommended = {
                                                            Press: ['Pull'],
                                                            Deadlift: ['Core', 'Single-Leg'],
                                                            Bench: ['Pull'],
                                                            Squat: ['Posterior', 'Pull', 'Core', 'Single-Leg']
                                                        };
                                                        const usedPatterns = new Set(rows.map(r => mapBlockAlias(r.block)).filter(Boolean));
                                                        const needed = (recommended[liftName] || []);
                                                        const matches = needed.length ? needed.some(n => usedPatterns.has(n)) : true;
                                                        const warn = rows.length && !matches;
                                                        const warnMsg = warn ? (liftName === 'Press' || liftName === 'Bench' ? 'Consider a Pull movement for shoulder balance.' : liftName === 'Deadlift' ? 'Add Core or Single‑Leg for balance.' : 'Add posterior chain or upper back assistance.') : null;
                                                        return (
                                                            <div key={liftName} className="rounded-lg border border-gray-700 bg-gray-900/60 p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="text-xs font-semibold tracking-wide uppercase text-indigo-300">{liftName}</h4>
                                                                    {showAdd && rows.length === 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                ensureRow();
                                                                            }}
                                                                            className="text-[10px] px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-700 text-gray-200 border border-gray-600"
                                                                        >Add</button>
                                                                    )}
                                                                </div>
                                                                {warn && (
                                                                    <div className="mb-2 text-[10px] flex items-center gap-2 text-amber-300 bg-amber-600/10 border border-amber-500/40 rounded px-2 py-1">
                                                                        <span className="font-medium">Pattern Tip:</span> {warnMsg}
                                                                    </div>
                                                                )}
                                                                {rows.length === 0 && (
                                                                    <p className="text-[11px] text-gray-500 italic mb-1">No assistance selected.</p>
                                                                )}
                                                                {rows.map((r, idx) => {
                                                                    const empty = !r.name;
                                                                    return (
                                                                        <div key={idx} className={`relative mb-2 last:mb-0`}>
                                                                            <div className="flex items-center gap-3 mb-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className={`flex-shrink-0 flex-1 basis-[60%] text-left text-[11px] px-3 py-2 rounded border ${empty ? 'bg-gray-800/40 border-amber-500/40 text-amber-200' : 'bg-gray-900/70 border-gray-600 text-gray-100 hover:bg-gray-700/70'} truncate`}
                                                                                    title={r.name || 'Pick assistance movement'}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setOpenPicker({ templateKey: card.key, lift: liftName, index: idx });
                                                                                    }}
                                                                                >{r.name || 'Select Movement'}</button>
                                                                                <label className="flex items-center gap-1 basis-[15%] text-[10px] text-gray-400">
                                                                                    <span className="uppercase tracking-wide">Sets</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        min={1}
                                                                                        max={10}
                                                                                        value={r.sets}
                                                                                        onChange={e => updateAssist(card.key, liftName, idx, { sets: Number(e.target.value) })}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="w-full bg-gray-900 border border-gray-600 rounded px-1 py-1 text-[10px] text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                                                    />
                                                                                </label>
                                                                                <label className="flex items-center gap-1 basis-[15%] text-[10px] text-gray-400">
                                                                                    <span className="uppercase tracking-wide">Reps</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        min={1}
                                                                                        max={50}
                                                                                        value={r.reps}
                                                                                        onChange={e => updateAssist(card.key, liftName, idx, { reps: Number(e.target.value) })}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="w-full bg-gray-900 border border-gray-600 rounded px-1 py-1 text-[10px] text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                                                    />
                                                                                </label>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        removeAssistRow(card.key, liftName, idx);
                                                                                    }}
                                                                                    className="basis-[10%] text-right text-[12px] font-bold text-red-400 hover:text-red-300"
                                                                                    aria-label="Remove assistance movement"
                                                                                >✕</button>
                                                                            </div>
                                                                            {/* Rep scheme descriptor */}
                                                                            {(() => {
                                                                                const scheme = repSchemeDescriptor(card.key, bbbVariant, r, mapBlockAlias(r.block), false); // assistance exercises are never main lift supplemental
                                                                                if (!scheme) return null;
                                                                                return <div className="text-[10px] text-gray-500 mt-1 pl-1">Scheme: {scheme}</div>;
                                                                            })()}
                                                                            {openPicker && openPicker.templateKey === card.key && openPicker.lift === liftName && openPicker.index === idx && (
                                                                                <div
                                                                                    className="relative z-30 mb-2"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    <AssistanceCatalogPicker
                                                                                        equipment={state.equipment || []}
                                                                                        onPick={(x) => {
                                                                                            updateAssist(card.key, liftName, openPicker.index, {
                                                                                                name: x.name,
                                                                                                block: x.block,
                                                                                                sets: rows[openPicker.index].sets || (x.sets || 5), // Default 5 sets for BBB assistance 
                                                                                                reps: rows[openPicker.index].reps || (Number(x.reps) || 10) // Default 10 reps for BBB assistance
                                                                                            });
                                                                                            // Keep modal open for easier multi-selection
                                                                                        }}
                                                                                        onClose={() => setOpenPicker(null)}
                                                                                        keepOpen={true}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {showAdd && rows.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            addAssistRow(card.key, liftName, limit);
                                                                        }}
                                                                        className="text-[10px] px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-700 text-gray-200 border border-gray-600"
                                                                    >+ Add Movement</button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="mt-3 text-[10px] text-gray-500 leading-snug">Adjust assistance now to skip the Design step. BBB keeps assistance to ONE simple movement (25–50 quality reps total). Jack Shit: leave blank or add one easy core / pull if very fresh.</p>
                                            </section>
                                            <section>
                                                <h6 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Example Day (Week 1 – {exampleLift})</h6>
                                                <div className="overflow-x-auto text-[11px]">
                                                    <table className="min-w-full text-left border-separate border-spacing-y-1">
                                                        <thead>
                                                            <tr className="text-gray-500">
                                                                <th className="pr-4 font-medium">Block</th>
                                                                <th className="pr-4 font-medium">Details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {includeWarmups && warmups.map((w, i) => (
                                                                <tr key={i}>
                                                                    <td className="pr-4 text-gray-400">Warm-up</td>
                                                                    <td className="pr-4 font-mono">{w.percent}% x {w.reps} @ {w.weight}{units}</td>
                                                                </tr>
                                                            ))}
                                                            {main.map((m, i) => (
                                                                <tr key={i}>
                                                                    <td className="pr-4 text-gray-400">Main</td>
                                                                    <td className="pr-4 font-mono">{m.percent}% x {m.reps} @ {m.weight}{units}</td>
                                                                </tr>
                                                            ))}
                                                            {(editing[exampleLift] || []).map((a, i) => (
                                                                <tr key={i}>
                                                                    <td className="pr-4 text-gray-400">Assist</td>
                                                                    <td className="pr-4 font-mono">{a.name || '—'} {a.sets}x{a.reps}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </section>
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                                <div className="text-[11px] text-gray-500">Review details then apply to auto-configure your cycle (assistance saved).</div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => applyTemplate(card.key)}
                                                        type="button"
                                                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500 text-indigo-200 text-xs font-medium hover:bg-indigo-600/30"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Use This Template</span>
                                                    </button>
                                                    <button onClick={() => setExpandedTemplate(null)} type="button" className="text-[11px] text-gray-500 hover:text-gray-300">Collapse</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                const badge = spec?.metaBadges || {};
                                function badgeClasses(label, value) {
                                    const base = 'px-2 py-0.5 rounded text-[10px] font-medium tracking-wide';
                                    // Difficulty coloring priority
                                    if (label === 'difficulty') {
                                        if (value === 'Beginner Friendly') return base + ' bg-green-600/20 text-green-300 border border-green-500/40';
                                        if (value === 'Intermediate') return base + ' bg-blue-600/20 text-blue-300 border border-blue-500/40';
                                        if (value === 'Advanced') return base + ' bg-amber-600/20 text-amber-300 border border-amber-500/40';
                                    }
                                    if (label === 'time') return base + ' bg-gray-700/60 text-gray-300 border border-gray-600';
                                    if (label === 'focus') return base + ' bg-indigo-600/20 text-indigo-300 border border-indigo-500/40';
                                    return base + ' bg-gray-700/60 text-gray-300 border border-gray-600';
                                }
                                const orderedBadges = [
                                    { key: 'time', label: 'time', value: badge.time, tip: badge.time === '60-90 min' ? 'Longer workouts due to higher volume supplemental work.' : (badge.time === '45-60 min' ? 'Standard full 5/3/1 training session length.' : 'Short, minimalist session focusing only on main work.') },
                                    { key: 'difficulty', label: 'difficulty', value: badge.difficulty, tip: badge.difficulty === 'Advanced' ? 'Higher total volume and recovery demand.' : (badge.difficulty === 'Intermediate' ? 'Moderate volume; balanced recovery demand.' : 'Simple, low stress structure.') },
                                    { key: 'focus', label: 'focus', value: badge.focus, tip: badge.focus }
                                ].filter(b => b.value).slice(0, 3);
                                return (
                                    <div
                                        key={card.key}
                                        className={[
                                            'relative rounded-lg border group transition-all duration-200 p-6 flex flex-col justify-between outline-none cursor-pointer',
                                            expanded ? 'border-indigo-500 bg-indigo-600/10 ring-2 ring-indigo-400 shadow-lg' : (active ? 'border-green-500 bg-green-600/10 ring-1 ring-green-400' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60')
                                        ].join(' ')}
                                        onClick={() => handleSelectTemplate(card.key)}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-bold text-white text-base leading-snug pr-6">{card.title}</h4>
                                                {active && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {orderedBadges.map(b => (
                                                    <span key={b.key} className={badgeClasses(b.label, b.value)} title={b.tip}>{b.value}</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">{card.blurb}</p>

                                            {/* Template benefits/key features */}
                                            <div className="mb-4">
                                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Key Features</h5>
                                                <ul className="text-xs text-gray-400 space-y-1">
                                                    {spec?.structure?.slice(0, 3).map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-indigo-400 mt-0.5">•</span>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex items-center gap-3 mt-auto">
                                                <ToggleButton
                                                    on={expanded}
                                                    className="text-sm px-4 py-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectTemplate(card.key);
                                                    }}
                                                >{expanded ? 'Collapse Details' : (active ? 'View Details' : 'Select & Configure')}</ToggleButton>

                                                {active && !expanded && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            applyTemplate(card.key);
                                                        }}
                                                        disabled={errors.length > 0}
                                                        className="text-sm px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                                    >
                                                        Use This Template →
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {expanded && expandedContent}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom build card */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/50 rounded-lg p-6 hover:border-blue-600/70 transition-all duration-200">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-600/20 rounded-lg p-3 flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-2">Want Full Control?</h3>
                                <p className="text-sm text-gray-300 mb-4 leading-relaxed">Skip presets and design every layer yourself: supplemental strategy, assistance volume, conditioning, and advanced options. Perfect for experienced lifters with specific needs.</p>

                                <div className="mb-4">
                                    <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">You'll Configure</h5>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span>Training schedule (3-day, 4-day splits)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span>Supplemental work (BBB, FSL, etc.)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span>Assistance exercises & volume</span>
                                        </li>
                                    </ul>
                                </div>

                                <ToggleButton
                                    on={false}
                                    onClick={chooseCustom}
                                    className="text-sm px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500"
                                >
                                    Continue with Custom Design →
                                </ToggleButton>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Navigation - More Prominent */}
                    <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-600/20 rounded-lg p-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-white">Ready to Continue?</h4>
                        </div>

                        <div className="space-y-4">
                            {selectedTemplate ? (
                                <div className="space-y-4">
                                    {/* Template Selected State */}
                                    <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <span className="text-green-300 font-semibold">
                                                Template Selected: {TEMPLATE_SPECS[selectedTemplate]?.name}
                                            </span>
                                        </div>
                                        <p className="text-green-200 text-sm leading-relaxed">
                                            This template will automatically configure your schedule, supplemental work, and assistance exercises
                                            based on Jim Wendler's proven methodology. You can review and adjust everything before generating your program.
                                        </p>
                                    </div>

                                    {errors.length > 0 && (
                                        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                                <span className="text-red-300 font-medium">Issues to Fix</span>
                                            </div>
                                            <ul className="text-red-200 text-sm space-y-1">
                                                {errors.map((error, idx) => (
                                                    <li key={idx}>• {error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <ToggleButton
                                            on={true}
                                            disabled={errors.length > 0}
                                            onClick={() => applyTemplate(selectedTemplate)}
                                            className="text-base px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {errors.length > 0 ? 'Fix Issues Above First' : `Use ${TEMPLATE_SPECS[selectedTemplate]?.name} Template →`}
                                        </ToggleButton>

                                        {!errors.length && (
                                            <span className="text-xs text-gray-400">
                                                Will jump to Step 4 (Review & Export)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* No Template Selected State */}
                                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Info className="w-5 h-5 text-blue-400" />
                                            <span className="text-blue-300 font-semibold">Choose Your Path</span>
                                        </div>
                                        <p className="text-blue-200 text-sm leading-relaxed">
                                            Select a proven template above for instant configuration, or continue with custom design
                                            to build your program step-by-step with full control over every detail.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <ToggleButton
                                            on={false}
                                            onClick={chooseCustom}
                                            className="text-base px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500"
                                        >
                                            Continue with Custom Design →
                                        </ToggleButton>

                                        <span className="text-xs text-gray-400">
                                            Will proceed to Step 3 (Design Custom)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            {/* Modal removed: inline expansion now handles details */}
        </div>
    );
}
