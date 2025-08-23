import React, { useState, useEffect, useCallback } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import { pillClass } from './_shared/pillStyles.js';
import { CheckCircle, Lock, Unlock } from 'lucide-react';

/**
 * Step3CustomizeDesign.jsx
 * UI-first implementation of Step 3 (Customize Design) per FIVETHREEONE_BUILDER_UI_SPEC.md
 * Focus: correct structure, test IDs, unlock gating & state consolidation – NO engine math.
 */

// Data shape contract (stored under step3 in workflow state)
// design = {
//   locked: boolean,
//   schedule: { frequency: '2'|'3'|'4', order: string[] },
//   warmups: { enabled: boolean, scheme: 'standard'|'minimalist'|'jumps_integrated' },
//   approach: 'classic'|'351'|'5spro'|'leader_anchor'|'competition',
//   deload: { enabled: boolean },
//   supplemental: { method: string },
//   assistance: { mode: 'minimal'|'balanced'|'template'|'custom' },
//   conditioning: { intensity: 'minimal'|'standard'|'extensive', targets: string[] }
// }

const DEFAULT_DESIGN = {
    locked: true,
    schedule: { frequency: '4', order: ['press', 'deadlift', 'bench', 'squat'] },
    warmups: { enabled: true, policy: 'standard', custom: [] },
    approach: 'classic',
    deload: { enabled: true },
    supplemental: { method: 'fsl' },
    assistance: { mode: 'minimal' },
    conditioning: { intensity: 'standard', targets: ['2–3 hard', '2–3 easy'] }
};

const APPROACH_CARDS = [
    { id: 'classic', label: 'Classic 5/3/1', desc: 'Standard wave (5/3/1 + deload).' },
    { id: '351', label: '3/5/1 Variation', desc: '3/5/1 ordering for AMRAP focus.' },
    { id: '5spro', label: '5s Pro', desc: 'All sets of 5 – fatigue control.' },
    { id: 'leader_anchor', label: 'Leader / Anchor', desc: 'Phased volume → intensity.' },
    { id: 'competition', label: 'Competition Prep', desc: 'Timeline & peak (placeholder).' }
];

const SUPPLEMENTAL_METHODS = ['fsl', 'ssl', 'bbb', 'bbs', 'widowmakers'];
const ASSISTANCE_MODES = [
    { id: 'minimal', label: 'Minimal', note: '25–50 total reps support' },
    { id: 'balanced', label: 'Balanced', note: '50–100 mixed patterns' },
    { id: 'template', label: 'Template-Based', note: 'Prebuilt Wendler sets' },
    { id: 'custom', label: 'Custom', note: 'Full manual control (future)' }
];
const CONDITIONING_INTENSITIES = [
    { id: 'minimal', label: 'Minimal', note: 'Maintain baseline' },
    { id: 'standard', label: 'Standard', note: 'Balanced performance' },
    { id: 'extensive', label: 'Extensive', note: 'High work capacity' }
];
const CONDITIONING_TARGET_CHIPS = ['2–3 hard', '2–3 easy', '1 speed', 'daily walk'];

// Simple UI-only warm-up policy definitions (percentages of Training Max placeholder)
const WARMUP_POLICIES = {
    standard: {
        label: 'Standard',
        sets: [
            { pct: 40, reps: 5 },
            { pct: 50, reps: 5 },
            { pct: 60, reps: 3 }
        ]
    },
    minimal: {
        label: 'Minimal',
        sets: [
            { pct: 50, reps: 5 },
            { pct: 60, reps: 3 }
        ]
    },
    jumps: {
        label: 'Jumps Integrated',
        sets: [
            { type: 'jumps', desc: '3–5 low‑fatigue jumps / throws' },
            { pct: 40, reps: 5 },
            { pct: 50, reps: 5 },
            { pct: 60, reps: 3 }
        ]
    }
};

export default function Step3CustomizeDesign({ data, updateData }) {
    const design = { ...DEFAULT_DESIGN, ...(data?.design || {}) };
    // Legacy root-level support (if previous step3 stored schedule or warmup directly on data)
    if (!data?.design) {
        if (data?.schedule && !design.schedule._migrated) {
            design.schedule = { ...design.schedule, ...data.schedule, _migrated: true };
        }
        if (data?.warmup && !design.warmups._migrated) {
            // legacy warmup: { policy, custom, deadliftRepStyle }
            const legacy = data.warmup;
            design.warmups = {
                ...design.warmups,
                policy: legacy.policy || design.warmups.policy,
                custom: legacy.custom || design.warmups.custom,
                _migrated: true
            };
        }
    }
    // Backwards compatibility: if old warmups.scheme exists, map to policy
    if (design.warmups && design.warmups.scheme && !design.warmups.policy) {
        const scheme = design.warmups.scheme;
        design.warmups.policy = scheme === 'minimalist' ? 'minimal' : (scheme === 'jumps_integrated' ? 'jumps' : 'standard');
    }
    const [local, setLocal] = useState(design);
    // Assistance catalog from CSV (debug wire-up)
    const [assistance, setAssistance] = useState([]);
    useEffect(() => {
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/assistance_exercises.csv`).then(setAssistance);
    }, []);

    // Persist outward on change (immediate for now)
    useEffect(() => { updateData({ design: local }); }, [local]);

    const locked = local.locked;
    const setField = (patch) => setLocal(prev => ({ ...prev, ...patch }));
    const updateNested = (key, patch) => setLocal(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

    // Accordion open state (all open by default UI-first; user can collapse)
    const initialOpen = {
        'schedule-editor': true,
        'warmup-chooser': true,
        'approach-section': true,
        'deload-toggle': true,
        'supplemental-picker': true,
        'assistance-picker': true,
        'conditioning-planner': true
    };
    const [open, setOpen] = useState(initialOpen);
    const toggle = useCallback((id) => setOpen(o => ({ ...o, [id]: !o[id] })), []);

    // Custom warm-up row handlers
    const updateCustomRow = (idx, field, value) => {
        setLocal(prev => {
            const rows = [...(prev.warmups.custom || [])];
            rows[idx] = { ...rows[idx], [field]: value };
            return { ...prev, warmups: { ...prev.warmups, custom: rows } };
        });
    };
    const addCustomRow = () => setLocal(prev => ({ ...prev, warmups: { ...prev.warmups, custom: [...(prev.warmups.custom || []), { pct: 50, reps: 5 }] } }));
    const removeCustomRow = (idx) => setLocal(prev => ({ ...prev, warmups: { ...prev.warmups, custom: (prev.warmups.custom || []).filter((_, i) => i !== idx) } }));
    const resetCustomRows = () => setLocal(prev => ({ ...prev, warmups: { ...prev.warmups, custom: [] } }));

    return (
        <div className="space-y-6 step3-viz">
            {assistance.length > 0 && (
                <div className="mb-4 p-3 bg-neutral-900 rounded">
                    <h3 className="font-bold text-white mb-2">Loaded Assistance (CSV)</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {assistance.map((a, i) => (
                            <li key={i}>
                                {a["Exercise"]} — {a["Category"]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Scoped visual styles for Step 3 enhancements */}
            <style>{`
                .step3-viz * { transition: all 0.2s ease; }
                .step3-viz .section:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.2); transform: translateY(-1px); }
                .step3-viz .warm-ups-section { background: rgba(239,68,68,0.05); border-left: 4px solid #ef4444; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
                .step3-viz .supplemental-section { background: rgba(59,130,246,0.05); border-left: 4px solid #3b82f6; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
                .step3-viz .assistance-section { background: rgba(16,185,129,0.05); border-left: 4px solid #10b981; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
                .step3-viz .conditioning-section { background: rgba(251,191,36,0.05); border-left: 4px solid #fbbf24; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
                .step3-viz .core-scheme-section { background: rgba(168,85,247,0.05); border-left: 4px solid #a855f7; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
                .step3-viz .option-selected { background: #ef4444 !important; color: white !important; font-weight: bold; transform: scale(1.05); box-shadow: 0 0 20px rgba(239,68,68,0.3); }
                .step3-viz .option-unselected { background: transparent; border: 1px solid #666; }
                .step3-viz .option-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; }
                .step3-viz .percentage-table { background: #1a1a2e; border: 1px solid #3a3d4a; border-radius: 8px; overflow: hidden; }
                .step3-viz .percentage-table tr:nth-child(odd) { background: rgba(255,255,255,0.02); }
                .step3-viz .percentage-table tr:hover { background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; }
                .step3-viz .percentage-table th { background: #2a2d3a; padding: 1rem; font-weight: 700; text-align: center; border-bottom: 2px solid #ef4444; }
                .step3-viz .percentage-table td { font-family: 'Courier New', monospace; padding: 0.75rem; text-align: center; }
            `}</style>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Step 3: Customize Design</h3>
                    <p className="text-gray-400 text-sm">Template defaults shown. Unlock to adjust training structure.</p>
                </div>
            </div>

            {/* Prominent Template Lock card */}
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
                <div>
                    <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <input type="checkbox" checked={locked} onChange={e => setField({ locked: e.target.checked })} />{' '}Use Template Defaults
                    </label>
                    <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
                        Automatically applies BBB recommended settings. Uncheck to customize.
                    </p>
                </div>
            </div>

            {/* Sections */}
            <Section title="1. Schedule" testId="schedule-editor" open={open['schedule-editor']} onToggle={() => toggle('schedule-editor')}>
                {locked && <ReadOnlyOverlay />}
                <div className="space-y-3">
                    <div className="text-sm text-gray-300 font-medium">Weekly Frequency</div>
                    <div className="flex flex-wrap gap-2">
                        {['2', '3', '4'].map(f => {
                            const active = local.schedule.frequency === f;
                            return (
                                <button key={f} disabled={locked} onClick={() => updateNested('schedule', { frequency: f })} className={`${pillClass(active, locked)} text-sm`}>
                                    {active ? <span className="mr-1">✓</span> : null}
                                    {f}-Day
                                </button>
                            );
                        })}
                    </div>
                    <div className="text-[11px] text-gray-500">Lift order: {local.schedule.order.join(' → ')}</div>
                    <div className="text-[10px] text-gray-500 italic">Drag & drop ordering placeholder (future).</div>
                </div>
            </Section>

            <Section title="2. 🔥 Warm-ups" testId="warmup-chooser" open={open['warmup-chooser']} onToggle={() => toggle('warmup-chooser')}>
                {locked && <ReadOnlyOverlay />}
                <div className="space-y-4 warm-ups-section">
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-gray-200">
                            <input type="checkbox" disabled={locked} checked={local.warmups.enabled} onChange={e => updateNested('warmups', { enabled: e.target.checked })} /> Enable Warm-ups
                        </label>
                        {!local.warmups.enabled && <span className="text-[11px] text-gray-500">Disabled – no ramp sets will be inserted.</span>}
                    </div>
                    {/* Policy selection */}
                    <div role="group" aria-label="Warm-up Policy" className="flex flex-wrap gap-2">
                        {[{ id: 'standard', label: 'standard', note: '40/50/60 × 5/5/3' }, { id: 'minimal', label: 'minimal', note: '50/60 × 5/3' }, { id: 'jumps', label: 'jumps integrated', note: 'add explosive prep' }, { id: 'custom', label: 'custom', note: 'define rows' }].map(p => {
                            const active = local.warmups.policy === p.id;
                            const disabled = locked || !local.warmups.enabled;
                            return (
                                <button key={p.id} type="button" data-testid={`warmup-policy-${p.id}`} data-testid-old={`warmup-scheme-${p.id}`} /* legacy alias */ disabled={disabled} onClick={() => !disabled && updateNested('warmups', { policy: p.id })} aria-pressed={active ? 'true' : 'false'} className={`${pillClass(active, disabled)} font-semibold text-xs tracking-wide`}>
                                    {active ? <span className="mr-1">✓</span> : null}
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                    {/* Custom editor */}
                    {local.warmups.policy === 'custom' && (
                        <div className="bg-gray-950/40 border border-gray-800 rounded p-3 space-y-3" data-testid="warmup-custom-editor">
                            <div className="text-[11px] text-gray-400">Define your exact ramp sets (percent of Training Max & reps).</div>
                            <div className="space-y-2">
                                {(local.warmups.custom || []).map((row, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-2 items-end" data-testid={`warmup-row-${i}`}>
                                        <div className="col-span-5">
                                            <label className="text-[10px] uppercase tracking-wide text-gray-500">% TM</label>
                                            <input type="number" min={20} max={90} step={5} value={row.pct} onChange={e => updateCustomRow(i, 'pct', Number(e.target.value))} data-testid={`warmup-row-${i}-pct`} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                                        </div>
                                        <div className="col-span-5">
                                            <label className="text-[10px] uppercase tracking-wide text-gray-500">Reps</label>
                                            <input type="number" min={1} max={10} step={1} value={row.reps} onChange={e => updateCustomRow(i, 'reps', Number(e.target.value))} data-testid={`warmup-row-${i}-reps`} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white" />
                                        </div>
                                        <div className="col-span-2 flex items-end">
                                            <button type="button" onClick={() => removeCustomRow(i)} data-testid={`warmup-row-${i}-remove`} className="px-2 py-1 text-xs rounded border border-gray-700 hover:bg-red-900/30 text-gray-300">✕</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <button type="button" onClick={addCustomRow} data-testid="warmup-add-row" className="px-3 py-1.5 rounded border border-gray-700 hover:bg-gray-800/60 text-xs text-gray-200">Add Row</button>
                                    {!!(local.warmups.custom || []).length && <button type="button" onClick={resetCustomRows} data-testid="warmup-reset-rows" className="px-3 py-1.5 rounded border border-red-600/60 hover:bg-red-900/40 text-xs text-red-300">Reset</button>}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Deadlift rep style moved to Step 1 (fundamentals) */}
                    <div className="text-[11px] text-gray-400 space-y-1">
                        {local.warmups.policy === 'standard' && <div><span className="text-gray-300 font-medium">Standard:</span> 40/50/60% of Training Max × 5/5/3 before work sets. Broad tissue prep + groove rehearsal.</div>}
                        {local.warmups.policy === 'minimal' && <div><span className="text-gray-300 font-medium">Minimal:</span> 50/60% × 5/3 only – time saving; rely on first work set for final prep.</div>}
                        {local.warmups.policy === 'jumps' && <div><span className="text-gray-300 font-medium">Jumps Integrated:</span> 3–5 low‑fatigue explosive efforts then quick ramp (40/50/60 or 50/60 variant).</div>}
                        {local.warmups.policy === 'custom' && <div><span className="text-gray-300 font-medium">Custom:</span> You define exact ramp – keep total warm-up reps efficient (≈12–20) and low fatigue.</div>}
                        <div className="text-[10px] text-gray-500 italic">Choose the lightest option that still lets the first work set feel fast and crisp.</div>
                    </div>
                    {/* Preview */}
                    <div data-testid="warmup-preview" className="mt-1 border border-gray-800 rounded bg-gray-950/40 divide-y divide-gray-800">
                        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-gray-400 flex justify-between"><span>Warm-up Preview</span><span className="text-gray-600">Deadlift style set in Step 1</span></div>
                        <div className="p-3 text-[11px] text-gray-300 space-y-1">
                            {computeWarmupSets(local.warmups).map((s, idx) => (
                                <div key={idx} data-testid="warmup-set-line" className="flex items-center gap-2">
                                    {s.type === 'jumps' ? (
                                        <span className="text-amber-300">{s.desc}</span>
                                    ) : (
                                        <>
                                            <span className="inline-block w-10 text-right font-mono">{s.pct}%</span>
                                            <span className="text-gray-500">×</span>
                                            <span className="font-mono w-4">{s.reps}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div className="pt-1 text-[10px] text-gray-500">Percentages reference Training Max; placeholder only.</div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="3. 📊 Core Scheme" testId="approach-section" open={open['approach-section']} onToggle={() => toggle('approach-section')}>
                {locked && <ReadOnlyOverlay />}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 core-scheme-section">
                    {APPROACH_CARDS.map(card => {
                        const active = local.approach === card.id;
                        return (
                            <button key={card.id} disabled={locked} onClick={() => setField({ approach: card.id })} data-testid={`approach-${card.id}`} data-selected={active ? 'true' : 'false'} className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'} ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="text-sm font-semibold text-white leading-snug pr-4">{card.label}</div>
                                    {active && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-2 leading-snug">{card.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="4. Deload Policy" testId="deload-toggle" open={open['deload-toggle']} onToggle={() => toggle('deload-toggle')}>
                {locked && <ReadOnlyOverlay />}
                <label className="flex items-center gap-2 text-sm text-gray-200">
                    <input type="checkbox" disabled={locked} checked={local.deload.enabled} onChange={e => updateNested('deload', { enabled: e.target.checked })} /> Include Deload Week
                </label>
                <p className="text-[11px] text-gray-500 mt-1">Defaults from template; adjust if customizing.</p>
            </Section>

            <Section title="5. 💪 Supplemental" testId="supplemental-picker" open={open['supplemental-picker']} onToggle={() => toggle('supplemental-picker')}>
                {locked && <ReadOnlyOverlay />}
                <div className="flex flex-wrap gap-2 supplemental-section">
                    {SUPPLEMENTAL_METHODS.map(m => {
                        const active = local.supplemental.method === m;
                        return (
                            <button key={m} disabled={locked} onClick={() => updateNested('supplemental', { method: m })} className={`${pillClass(active, locked)} text-xs font-medium`}>
                                {active ? <span className="mr-1">✓</span> : null}
                                {m.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 italic">One method per cycle (placeholder explanations).</p>
            </Section>

            <Section title="6. 🎯 Assistance" testId="assistance-picker" open={open['assistance-picker']} onToggle={() => toggle('assistance-picker')}>
                {locked && <ReadOnlyOverlay />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 assistance-section">
                    {ASSISTANCE_MODES.map(mode => {
                        const active = local.assistance.mode === mode.id;
                        return (
                            <button key={mode.id} disabled={locked} onClick={() => updateNested('assistance', { mode: mode.id })} className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'} ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div className="text-sm font-semibold text-white leading-snug pr-4">{mode.label}</div>
                                    {active && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-2 leading-snug">{mode.note}</div>
                            </button>
                        );
                    })}
                </div>
                {local.assistance.mode === 'custom' && <div className="mt-2 text-[11px] text-gray-500">Custom exercise catalog placeholder.</div>}
            </Section>

            <Section title="7. 🏃 Conditioning" testId="conditioning-planner" open={open['conditioning-planner']} onToggle={() => toggle('conditioning-planner')}>
                {locked && <ReadOnlyOverlay />}
                <div className="space-y-4 conditioning-section">
                    <div className="flex flex-wrap gap-2">
                        {CONDITIONING_INTENSITIES.map(ci => {
                            const active = local.conditioning.intensity === ci.id;
                            return (
                                <button key={ci.id} disabled={locked} onClick={() => updateNested('conditioning', { intensity: ci.id })} className={`${pillClass(active, locked)} text-sm`} title={ci.note}>
                                    {active ? <span className="mr-1">✓</span> : null}
                                    {ci.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {CONDITIONING_TARGET_CHIPS.map(ch => {
                            const active = local.conditioning.targets.includes(ch);
                            return (
                                <button key={ch} disabled={locked} onClick={() => toggleTarget(ch, setLocal)} className={`${pillClass(active, locked)} text-xs`}>
                                    {active ? <span className="mr-1">✓</span> : null}
                                    {ch}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">Conditioning supports recovery & work capacity. (Placeholder summary.)</p>
                </div>
            </Section>

            {/* Live Summary (sticky) */}
            <div style={{ position: 'sticky', top: '2rem', background: 'linear-gradient(135deg, #1a1a2e, #2a2d3a)', border: '2px solid #ef4444', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)' }} className="text-[11px] text-gray-300 space-y-1">
                <h3 style={{ borderBottom: '2px solid #ef4444', paddingBottom: '0.5rem' }} className="text-white font-semibold">Live Summary</h3>
                <SummaryLine label="Locked" value={locked ? 'Yes (Template Defaults)' : 'No (Customized)'} />
                <SummaryLine label="Frequency" value={`${local.schedule.frequency}-Day`} />
                <SummaryLine label="Warm-ups" value={local.warmups.enabled ? local.warmups.policy : 'Off'} />
                <SummaryLine label="Approach" value={local.approach} />
                <SummaryLine label="Deload" value={local.deload.enabled ? 'Included' : 'Skipped'} />
                <SummaryLine label="Supplemental" value={local.supplemental.method} />
                <SummaryLine label="Assistance" value={local.assistance.mode} />
                <SummaryLine label="Conditioning" value={`${local.conditioning.intensity} (${local.conditioning.targets.join(', ')})`} />
            </div>
        </div>
    );
}

function Section({ title, children, testId, open = true, onToggle }) {
    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded relative section" data-testid={testId}>
            <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 text-left" data-testid={`${testId}-toggle`} aria-expanded={open ? 'true' : 'false'}>
                <span className="text-white font-medium text-sm">{title}</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${open ? 'border-red-500 text-red-300' : 'border-gray-600 text-gray-400'}`}>{open ? 'Open' : 'Closed'}</span>
            </button>
            {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
        </div>
    );
}

function ReadOnlyOverlay() {
    return (
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center rounded pointer-events-none">
            <div className="px-3 py-1.5 rounded border border-gray-600 text-gray-300 text-xs bg-gray-800/80 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Template Defaults (Read-Only)
            </div>
        </div>
    );
}

function SummaryLine({ label, value }) {
    return <div className="flex items-center gap-2"><span className="text-gray-400 w-28">{label}:</span><span className="text-gray-200 truncate">{value}</span></div>;
}

function toggleTarget(chip, setLocal) {
    setLocal(prev => {
        const has = prev.conditioning.targets.includes(chip);
        return {
            ...prev,
            conditioning: {
                ...prev.conditioning,
                targets: has ? prev.conditioning.targets.filter(c => c !== chip) : [...prev.conditioning.targets, chip]
            }
        };
    });
}

// Compute warm-up sets based on policy or custom rows
function computeWarmupSets(warmups) {
    if (!warmups?.enabled) return [];
    if (warmups.policy === 'custom') {
        return (warmups.custom || []).map(r => ({ pct: r.pct, reps: r.reps }));
    }
    const base = WARMUP_POLICIES[warmups.policy] || WARMUP_POLICIES.standard;
    return base.sets;
}
