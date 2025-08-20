import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/context/BuilderState';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { TEMPLATES as templates, SCHEMES as schemes, TEMPLATE_DETAILS, TEMPLATE_META, getSchemeDescriptor } from '@/lib/builder/templates';
import BuilderProgress from './BuilderProgress';

// --- Detailed Workout Definitions (UI only, not final programming engine) ---
// Each template maps to 4 training days (classic) with main lift emphasis ordering.
// We derive main lift order from standard 4-day 5/3/1 rotation: Press, Deadlift, Bench, Squat OR user preference later.
// For now keep fixed order for preview.
// Template/meta now imported from shared module

function renderTemplateMeta(id: string) {
    const meta = TEMPLATE_META[id];
    if (!meta) return null;
    return (
        <>
            <div className="flex flex-wrap gap-1 mb-1">
                <span className="px-2 py-0.5 rounded bg-gray-700/60 text-[10px]">Time: {meta.time}</span>
                <span className="px-2 py-0.5 rounded bg-gray-700/60 text-[10px]">Difficulty: {meta.difficulty}</span>
                {meta.focus.map(f => <span key={f} className="px-2 py-0.5 rounded bg-gray-800/70 border border-gray-700 text-[10px]">{f}</span>)}
            </div>
            <div className="text-[10px] leading-relaxed text-gray-400">
                <div><span className="text-gray-300">Best For:</span> {meta.suitability}</div>
                {meta.caution && <div className="mt-0.5 text-yellow-500/80"><span className="text-gray-400">Note:</span> {meta.caution}</div>}
            </div>
        </>
    );
}

function renderTemplateDetail(id: string) {
    const meta = TEMPLATE_META[id];
    const cfg = TEMPLATE_DETAILS[id];
    if (!cfg) return null;
    return (
        <div className="space-y-3">
            <div className="text-[11px] text-gray-300 leading-snug">{cfg.blurb}</div>
            {meta && (
                <div className="space-y-1">
                    {renderTemplateMeta(id)}
                </div>
            )}
            <div className="border border-gray-700 rounded-md divide-y divide-gray-800 overflow-hidden">
                {cfg.days.map(d => (
                    <div key={d.day} className="p-2 text-[10px] space-y-1 bg-gray-900/40">
                        <div className="flex items-center justify-between">
                            <span className="uppercase tracking-wide text-gray-500">Day {d.day}</span>
                            <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300 font-mono text-[10px]">{d.primary}</span>
                        </div>
                        <ul className="space-y-0.5">
                            {d.supplemental && <li><span className="text-gray-400">Supplemental:</span> {d.supplemental}{d.supplementalNote ? ` (${d.supplementalNote})` : ''}</li>}
                            {d.assistance && d.assistance.map((a, i) => (<li key={i}><span className="text-gray-400">Assist:</span> {a}</li>))}
                        </ul>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-gray-500">Click "Use This Template" to lock it in and proceed to scheme selection.</p>
        </div>
    );
}

// Provide a simple main-lift set notation based on scheme selection (preview only)
// scheme descriptor moved to shared module if needed later

export default function TemplateAndScheme() {
    const { step2, setStep2 } = useBuilder();
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState<string | null>(null);
    const detailsRef = React.useRef<HTMLDivElement | null>(null);
    const prevExpanded = React.useRef<string | null>(null);

    const onTemplate = (id: string) => {
        // Toggle expansion only; selection now happens via the detail panel action button
        setExpanded(prev => (prev === id ? null : id));
    };

    // When a template becomes expanded, scroll Template Details panel into view.
    React.useEffect(() => {
        if (expanded && expanded !== prevExpanded.current && detailsRef.current) {
            // smooth scroll; fallback to instant if unsupported
            try {
                detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch {
                detailsRef.current.scrollIntoView();
            }
        }
        prevExpanded.current = expanded;
    }, [expanded]);
    const onScheme = (id: string) => setStep2({ schemeId: id });

    const canNext = !!step2.templateId && !!step2.schemeId;

    // Persist Step2 (template + scheme) debounced
    React.useEffect(() => {
        const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
        if (isTest) return;
        const handle = setTimeout(async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const payload = { user_id: userId, step: 2, state: step2, updated_at: new Date().toISOString() };
                await supabase.from('program_builder_state').upsert(payload, { onConflict: 'user_id,step' });
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Persist step2 failed', e);
            }
        }, 500);
        return () => clearTimeout(handle);
    }, [step2]);

    // Hydrate Step2 on mount (always attempt; remote wins only if has data)
    React.useEffect(() => {
        let active = true;
        const run = async () => {
            const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
            if (isTest) return;
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const { data } = await supabase.from('program_builder_state').select('*').eq('user_id', userId).eq('step', 2).single();
                if (data?.state && active) {
                    setStep2(data.state);
                }
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Hydrate step2 failed', e);
            }
        };
        run();
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" data-testid="step2-container">
            <div className="px-8 pt-6"><BuilderProgress current={2} /></div>
            <header className="px-8 pt-8 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Template & Core Scheme</h1>
                    <p className="text-sm text-gray-400">Choose a template then pick the loading / AMRAP scheme.</p>
                </div>
                <div data-testid="selection-summary" className="text-xs text-gray-300">
                    <div>Template: {step2.templateId || '—'}</div>
                    <div>Scheme: {step2.schemeId || '—'}</div>
                    {step2.schemeId && (
                        <div className="mt-1">AMRAP: {schemes.find(s => s.id === step2.schemeId)?.amrap}</div>
                    )}
                    {step2.schemeId && (
                        <div className="mt-2 text-[11px] font-mono tracking-tight inline-block px-2 py-1 rounded bg-red-700/30 border border-red-500/50 text-red-100 shadow-sm" data-testid="scheme-descriptor">
                            Wave Pattern: {getSchemeDescriptor(step2.schemeId)}
                        </div>
                    )}
                </div>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Templates</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map(t => {
                                const isSelected = step2.templateId === t.id;
                                const isExpanded = expanded === t.id;
                                const meta = (TEMPLATE_META as any)[t.id];
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        data-testid={`template-${t.id}`}
                                        onClick={() => onTemplate(t.id)}
                                        className={`text-left rounded-lg border p-4 transition h-full flex flex-col ${isSelected ? 'border-red-500 bg-gray-800' : isExpanded ? 'border-indigo-500 bg-gray-800/70' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium mb-1 flex items-center gap-2">
                                                <span>{t.title}</span>
                                                {isSelected && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/70 text-white">Selected</span>}
                                                {!isSelected && isExpanded && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/60 text-white">Viewing</span>}
                                            </div>
                                            <p className="text-xs text-gray-300 leading-snug mb-2">{t.desc}</p>
                                            {meta && (
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="px-2 py-0.5 rounded bg-gray-700/60 text-[10px]">{meta.time}</span>
                                                        <span className="px-2 py-0.5 rounded bg-gray-700/60 text-[10px]">Diff: {meta.difficulty}</span>
                                                        {meta.focus.slice(0, 2).map((f: string) => (
                                                            <span key={f} className="px-2 py-0.5 rounded bg-gray-800/70 border border-gray-700 text-[10px]">{f}</span>
                                                        ))}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 leading-snug line-clamp-2">Best: {meta.suitability}</div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-5" ref={detailsRef} data-testid="template-details-panel">
                            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-2 text-sm">Template Details</h3>
                                {!expanded && <p className="text-xs text-gray-500">Select a template card above to view its full structure, focus and guidance.</p>}
                                {expanded && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-medium">{templates.find(t => t.id === expanded)?.title}</h4>
                                            {step2.templateId === expanded && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/70 text-white">Selected</span>}
                                        </div>
                                        {renderTemplateDetail(expanded)}
                                        <div className="flex gap-2 pt-1">
                                            {step2.templateId !== expanded && (
                                                <button
                                                    type="button"
                                                    onClick={() => setStep2({ templateId: expanded })}
                                                    className="text-xs px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium"
                                                >Use This Template</button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setExpanded(null)}
                                                className="text-xs px-3 py-1.5 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
                                            >Close</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Schemes</h2>
                        <div className="grid sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Choose loading / AMRAP scheme">
                            {schemes.map(s => {
                                const selected = step2.schemeId === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        data-testid={`scheme-${s.id}`}
                                        onClick={() => onScheme(s.id)}
                                        className={`relative text-left rounded-lg border p-4 transition focus:outline-none focus:ring-2 focus:ring-red-500/50 ${selected ? 'border-red-400 bg-red-700/15 ring-1 ring-red-500/40 shadow-sm' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`}
                                    >
                                        <div className="font-medium mb-1 flex items-center gap-2">
                                            <span>{s.title}</span>
                                            {selected && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white">Selected</span>}
                                        </div>
                                        <div className="text-xs text-gray-300 mb-1">AMRAP: {s.amrap}</div>
                                        {selected && (
                                            <div className="mt-1 text-[10px] leading-snug text-red-100 font-mono px-2 py-1 rounded bg-red-900/40 border border-red-600/40" data-testid={`scheme-descriptor-inline-${s.id}`}>
                                                {getSchemeDescriptor(s.id)}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* Cycle overview removed per latest request; detail now lives in the side panel */}
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Selection Summary</h3>
                        <p className="text-xs text-gray-400 mb-2">These choices determine default assistance, deload policy and AMRAP flags.</p>
                        <ul className="text-xs space-y-1">
                            <li>Template: <span className="font-mono">{step2.templateId || '—'}</span></li>
                            <li>Scheme: <span className="font-mono">{step2.schemeId || '—'}</span></li>
                            {step2.schemeId && (
                                <li>AMRAP: <span className="font-mono">{schemes.find(s => s.id === step2.schemeId)?.amrap}</span></li>
                            )}
                        </ul>
                        {step2.templateId && (
                            <div className="mt-3 text-[11px] text-gray-400 space-y-1">
                                {renderTemplateMeta(step2.templateId)}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
            <footer className="px-8 py-4 border-t border-gray-800 flex items-center justify-end gap-4">
                <button onClick={() => navigate('/build/step1')} className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                <button data-testid="step2-next" disabled={!canNext} onClick={() => navigate('/build/step3')} className={`px-4 py-2 rounded border text-sm ${canNext ? 'border-red-500 hover:bg-red-600/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}>Next</button>
            </footer>
        </div>
    );
}
