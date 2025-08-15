import React, { useState, useMemo, useEffect } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS, getTemplatePreset } from '../../../../lib/templates/531.presets.v2.js';
import { getTemplateSpec, TEMPLATE_SPECS } from '../../../../lib/templates/531.templateSpecs.js';
import { CheckCircle2, Info, X } from 'lucide-react';
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
    const [expandedTemplate, setExpandedTemplate] = useState(null); // new inline expansion key

    const templateCards = useMemo(() => Object.values(TEMPLATE_SPECS).map(spec => ({
        key: spec.key,
        title: spec.name,
        blurb: spec.blurb,
        detail: spec.recovery,
        spec
    })), []);

    function handleSelectTemplate(key) {
        setSelectedTemplate(key);
        setExpandedTemplate(prev => prev === key ? null : key);
    }

    // Local BBB variant state (only used when BBB expanded)
    const [bbbVariant, setBbbVariant] = useState('standard'); // 'standard' | 'challenge'
    const [bbbPairing, setBbbPairing] = useState('same'); // 'same' | 'opposite'
    const [bbbStartPercent, setBbbStartPercent] = useState(50); // 30|40|50|60 (standard path)
    const [bbbProgressTo, setBbbProgressTo] = useState(60); // target escalation for standard

    // Assistance editing state per template key -> map of Lift -> array of movements
    const [assistEdit, setAssistEdit] = useState({});
    const [openPicker, setOpenPicker] = useState(null); // { templateKey, lift, index } or null

    function initAssistanceForTemplate(templateKey, assistancePreview) {
        setAssistEdit(prev => {
            if (prev[templateKey]) return prev; // already initialized
            const mapped = {};
            assistancePreview.forEach(ap => {
                const limit = templateKey === TEMPLATE_KEYS.BBB ? 1 : 2;
                mapped[ap.lift] = (ap.items || []).slice(0, limit).map(it => ({
                    name: it.name,
                    sets: it.sets || 3,
                    reps: it.reps || 10,
                    block: it.block || null
                }));
            });
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
            arr.push({ name: '', sets: 3, reps: 10, block: null });
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
        if (!key) return;
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
        if (!preset) return;
        const spec = getTemplateSpec(key);
        // Inject custom assistance if user edited
        if (assistEdit[key]) {
            const plan = assistEdit[key];
            preset.assistance = {
                mode: 'custom',
                customPlan: plan
            };
        }
        dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
        dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
        if (spec) {
            dispatch({ type: 'SET_TEMPLATE_SPEC', payload: spec });
            if (spec.assistanceHint) dispatch({ type: 'SET_ASSISTANCE_HINT', payload: spec.assistanceHint });
        }
        dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
        onChoose && onChoose('template');
        onAutoNext && onAutoNext();
        setExpandedTemplate(null);
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

    function repSchemeDescriptor(templateKey, variant, row, blockAlias) {
        if (!templateKey) return '';
        const key = templateKey.toLowerCase();
        const blk = blockAlias || mapBlockAlias(row?.block);
        if (key === TEMPLATE_KEYS.BBB) {
            if (variant === 'challenge') return `5×10 @ 30% TM (Cycle 1 of 30/45/60)`; // could evolve with cycle context
            return `5×10 @ ${bbbStartPercent}% TM` + (bbbProgressTo && bbbProgressTo !== bbbStartPercent ? ` (progress toward ${bbbProgressTo}%)` : '');
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
        <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 2 — Template or Custom</h2>
                <p className="text-gray-400">Select a proven Wendler template for instant configuration or continue with a fully custom build.</p>
            </div>

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
                        <h3 className="text-lg font-semibold text-white mb-3">Templates</h3>
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
                                    const variantRecovery = isBBBVariant ? 'High supplemental volume – start lighter (50%) and progress cautiously (60–70% later cycles). Favor easy conditioning (LISS) and cap assistance at 25–50 quality reps per movement. Deload Week 4.' : spec?.recovery;
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
                                                    <h6 className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300">BBB Variants</h6>
                                                    <div className="flex flex-wrap gap-3 items-center">
                                                        <label className="inline-flex items-center gap-1 text-[11px]">
                                                            <input
                                                                type="radio"
                                                                name="bbbVariant"
                                                                value="standard"
                                                                checked={bbbVariant === 'standard'}
                                                                onChange={() => setBbbVariant('standard')}
                                                            />
                                                            <span>Standard (50→60%)</span>
                                                        </label>
                                                        <label className="inline-flex items-center gap-1 text-[11px]">
                                                            <input
                                                                type="radio"
                                                                name="bbbVariant"
                                                                value="challenge"
                                                                checked={bbbVariant === 'challenge'}
                                                                onChange={() => setBbbVariant('challenge')}
                                                            />
                                                            <span>3‑Month Challenge (30/45/60)</span>
                                                        </label>
                                                    </div>
                                                    {bbbVariant === 'standard' && (
                                                        <div className="grid sm:grid-cols-3 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="block text-[10px] uppercase text-gray-400">Start %</label>
                                                                <select value={bbbStartPercent} onChange={e => setBbbStartPercent(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                    {[30, 40, 50, 60].map(p => <option key={p} value={p}>{p}%</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="block text-[10px] uppercase text-gray-400">Progress To</label>
                                                                <select value={bbbProgressTo} onChange={e => setBbbProgressTo(Number(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                    {[50, 55, 60, 65, 70].map(p => <option key={p} value={p}>{p}%</option>)}
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
                                                    )}
                                                    {bbbVariant === 'challenge' && (
                                                        <div className="space-y-2 text-[11px] text-gray-300">
                                                            <p><span className="font-semibold text-indigo-300">Cycle % Progression:</span> 30% (Cycle 1) → 45% (Cycle 2) → 60% (Cycle 3). Keep assistance minimal. Opposite pairing optional but usually same-lift for practice.</p>
                                                            <div className="flex items-center gap-2">
                                                                <label className="block text-[10px] uppercase text-gray-400">Pairing</label>
                                                                <select value={bbbPairing} onChange={e => setBbbPairing(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[11px] text-white">
                                                                    <option value="same">Same Lift</option>
                                                                    <option value="opposite">Opposite Lift</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="text-[10px] text-gray-400 leading-snug">
                                                        <p><strong className="text-gray-300">Guidance:</strong> Standard path: begin lighter (50%) and add volume only when recovery is solid—creeping toward {bbbProgressTo}% in later cycles. 3‑Month Challenge is aggressive; ensure nutrition and sleep, and reduce extra conditioning.</p>
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
                                                <p className="leading-snug">Main work: 40% ×5, 50% ×5, 60% ×5 of Training Max (no AMRAP). Keep supplemental volume <span className="text-gray-100 font-medium">off</span> (BBB paused) and perform only light, restorative assistance (pulls, easy core) if desired.</p>
                                                <p className="leading-snug text-gray-400">Goal: Reduce fatigue, maintain groove, prepare for next cycle.</p>
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
                                                                        <button type="button" onClick={() => { ensureRow(); }} className="text-[10px] px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-700 text-gray-200 border border-gray-600">Add</button>
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
                                                                                    onClick={() => setOpenPicker({ templateKey: card.key, lift: liftName, index: idx })}
                                                                                >{r.name || 'Select Movement'}</button>
                                                                                <label className="flex items-center gap-1 basis-[15%] text-[10px] text-gray-400">
                                                                                    <span className="uppercase tracking-wide">Sets</span>
                                                                                    <input type="number" min={1} max={10} value={r.sets} onChange={e => updateAssist(card.key, liftName, idx, { sets: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-600 rounded px-1 py-1 text-[10px] text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                                                                                </label>
                                                                                <label className="flex items-center gap-1 basis-[15%] text-[10px] text-gray-400">
                                                                                    <span className="uppercase tracking-wide">Reps</span>
                                                                                    <input type="number" min={1} max={50} value={r.reps} onChange={e => updateAssist(card.key, liftName, idx, { reps: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-600 rounded px-1 py-1 text-[10px] text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                                                                                </label>
                                                                                <button type="button" onClick={() => removeAssistRow(card.key, liftName, idx)} className="basis-[10%] text-right text-[12px] font-bold text-red-400 hover:text-red-300" aria-label="Remove assistance movement">✕</button>
                                                                            </div>
                                                                            {/* Rep scheme descriptor */}
                                                                            {(() => {
                                                                                const scheme = repSchemeDescriptor(card.key, bbbVariant, r, mapBlockAlias(r.block));
                                                                                if (!scheme) return null;
                                                                                return <div className="text-[10px] text-gray-500 mt-1 pl-1">Scheme: {scheme}</div>;
                                                                            })()}
                                                                            {openPicker && openPicker.templateKey === card.key && openPicker.lift === liftName && openPicker.index === idx && (
                                                                                <div className="relative z-30 mb-2">
                                                                                    <AssistanceCatalogPicker
                                                                                        equipment={state.equipment || []}
                                                                                        onPick={(x) => { updateAssist(card.key, liftName, openPicker.index, { name: x.name, block: x.block, sets: rows[openPicker.index].sets || (x.sets || 3), reps: rows[openPicker.index].reps || (Number(x.reps) || 10) }); setOpenPicker(null); }}
                                                                                        onClose={() => setOpenPicker(null)}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {showAdd && rows.length > 0 && (
                                                                    <button type="button" onClick={() => addAssistRow(card.key, liftName, limit)} className="text-[10px] px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-700 text-gray-200 border border-gray-600">+ Add Movement</button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="mt-3 text-[10px] text-gray-500 leading-snug">Adjust assistance now to skip the Design step. BBB variants typically keep assistance to ONE simple movement (25–50 quality reps total). 3‑Month Challenge: favor the low end (20–30 reps). Jack Shit: leave blank or add one easy core / pull if very fresh.</p>
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
                                            'relative rounded-lg border group transition p-4 flex flex-col justify-between outline-none',
                                            expanded ? 'border-indigo-500 bg-indigo-600/5 ring-2 ring-indigo-400' : (active ? 'border-indigo-500 bg-indigo-600/10' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500')
                                        ].join(' ')}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm leading-snug pr-6">{card.title}</h4>
                                                {active && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {orderedBadges.map(b => (
                                                    <span key={b.key} className={badgeClasses(b.label, b.value)} title={b.tip}>{b.value}</span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400 leading-snug mb-3 flex-1">{card.blurb}</p>
                                            <ToggleButton
                                                on={expanded}
                                                className="mt-auto self-start text-xs"
                                                onClick={() => handleSelectTemplate(card.key)}
                                            >{expanded ? 'Expanded' : (active ? 'Selected – View' : 'Select')}</ToggleButton>
                                        </div>
                                        {expanded && expandedContent}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom build card */}
                    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Want Full Control?</h3>
                        <p className="text-sm text-gray-400 mb-4">Skip presets and design every layer yourself: supplemental strategy, assistance volume, conditioning, and advanced options.</p>
                        <ToggleButton on={false} onClick={chooseCustom} className="text-xs px-5">Customize Manually →</ToggleButton>
                    </div>
                </div>

            </div>
            {/* Modal removed: inline expansion now handles details */}
        </div>
    );
}
