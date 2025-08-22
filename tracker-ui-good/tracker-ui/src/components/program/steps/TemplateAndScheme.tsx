import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/context/BuilderState';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { TEMPLATES as templates, TEMPLATE_DETAILS, TEMPLATE_META } from '@/lib/builder/templates';
import BuilderProgress from './BuilderProgress';
import { WorkoutPreview } from './WorkoutPreview';

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

            {/* Add workout preview */}
            <WorkoutPreview templateId={id} expanded={true} />

            <p className="text-[10px] text-gray-500">Click "Use This Template" to lock it in and proceed to scheme selection.</p>
        </div>
    );
}

// Template comparison component
function TemplateComparisonTable({ templateIds, onRemove, onSelect }: {
    templateIds: string[],
    onRemove: (id: string) => void,
    onSelect: (id: string) => void
}) {
    const compareTemplates = templateIds.map(id => templates.find(t => t.id === id)).filter(Boolean);

    if (compareTemplates.length === 0) {
        return (
            <div className="text-center py-8" data-testid="comparison-empty">
                <div className="text-gray-400 text-sm">
                    <div className="mb-2">📊 Template Comparison</div>
                    <p>Click on template cards to add them to comparison (max 3)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto" data-testid="comparison-table">
            <table className="w-full border border-gray-700 rounded-lg">
                <thead>
                    <tr className="bg-gray-800/60">
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Template</th>
                        {compareTemplates.map(template => (
                            <th key={template!.id} className="text-center p-3 border-b border-gray-700 min-w-[200px]">
                                <div className="space-y-2">
                                    <div className="font-medium">{template!.title}</div>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => onSelect(template!.id)}
                                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded text-white transition"
                                        >
                                            Select
                                        </button>
                                        <button
                                            onClick={() => onRemove(template!.id)}
                                            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded text-white transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-3 border-b border-gray-700 text-sm font-medium text-gray-400">Description</td>
                        {compareTemplates.map(template => (
                            <td key={template!.id} className="p-3 border-b border-gray-700 text-xs">
                                {template!.desc}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="p-3 border-b border-gray-700 text-sm font-medium text-gray-400">Session Time</td>
                        {compareTemplates.map(template => {
                            const meta = (TEMPLATE_META as any)[template!.id];
                            return (
                                <td key={template!.id} className="p-3 border-b border-gray-700 text-xs">
                                    {meta?.time || '—'}
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td className="p-3 border-b border-gray-700 text-sm font-medium text-gray-400">Difficulty</td>
                        {compareTemplates.map(template => {
                            const meta = (TEMPLATE_META as any)[template!.id];
                            return (
                                <td key={template!.id} className="p-3 border-b border-gray-700 text-xs">
                                    <span className={`px-2 py-1 rounded text-xs ${meta?.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-200' :
                                        meta?.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-200' :
                                            meta?.difficulty === 'Advanced' ? 'bg-red-600/20 text-red-200' :
                                                'bg-gray-600/20 text-gray-200'
                                        }`}>
                                        {meta?.difficulty || '—'}
                                    </span>
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td className="p-3 border-b border-gray-700 text-sm font-medium text-gray-400">Focus Areas</td>
                        {compareTemplates.map(template => {
                            const meta = (TEMPLATE_META as any)[template!.id];
                            return (
                                <td key={template!.id} className="p-3 border-b border-gray-700 text-xs">
                                    <div className="space-y-1">
                                        {meta?.focus?.map((focus: string, i: number) => (
                                            <div key={i} className="px-2 py-1 bg-blue-600/20 text-blue-200 rounded text-xs">
                                                {focus}
                                            </div>
                                        )) || '—'}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td className="p-3 border-b border-gray-700 text-sm font-medium text-gray-400">Best For</td>
                        {compareTemplates.map(template => {
                            const meta = (TEMPLATE_META as any)[template!.id];
                            return (
                                <td key={template!.id} className="p-3 border-b border-gray-700 text-xs">
                                    {meta?.suitability || '—'}
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td className="p-3 text-sm font-medium text-gray-400">Cautions</td>
                        {compareTemplates.map(template => {
                            const meta = (TEMPLATE_META as any)[template!.id];
                            return (
                                <td key={template!.id} className="p-3 text-xs text-orange-200">
                                    {meta?.caution || '—'}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

// Provide a simple main-lift set notation based on scheme selection (preview only)
// scheme descriptor moved to shared module if needed later

export default function TemplateAndScheme() {
    const { step2, setStep2 } = useBuilder();
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [difficultyFilter, setDifficultyFilter] = React.useState<string>('');
    const [focusFilter, setFocusFilter] = React.useState<string>('');
    const [compareMode, setCompareMode] = React.useState(false);
    const [compareTemplates, setCompareTemplates] = React.useState<string[]>([]);
    const detailsRef = React.useRef<HTMLDivElement | null>(null);
    const prevExpanded = React.useRef<string | null>(null);

    const onTemplate = (id: string) => {
        if (compareMode) {
            // In compare mode, toggle template in comparison list
            setCompareTemplates(prev => {
                if (prev.includes(id)) {
                    return prev.filter(t => t !== id);
                } else if (prev.length < 3) {
                    return [...prev, id];
                }
                return prev; // Max 3 templates
            });
        } else {
            // Normal mode: toggle expansion only; selection happens via detail panel action button
            setExpanded(prev => (prev === id ? null : id));
        }
    };

    const toggleCompareMode = () => {
        setCompareMode(prev => !prev);
        if (compareMode) {
            setCompareTemplates([]);
        }
        setExpanded(null);
    };

    const removeFromComparison = (id: string) => {
        setCompareTemplates(prev => prev.filter(t => t !== id));
    };

    // When a template becomes expanded, scroll Template Details panel into view.
    React.useEffect(() => {
        if (expanded && expanded !== prevExpanded.current && detailsRef.current) {
            // smooth scroll; fallback to instant if unsupported
            try {
                if (typeof detailsRef.current.scrollIntoView === 'function') {
                    detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch { /* ignore in non-browser env */ }
        }
        prevExpanded.current = expanded;
    }, [expanded]);
    // Scheme selection moved to Step 3 (Customize)
    const canNext = !!step2.templateId;

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

    // Filter templates based on search and filter criteria
    const filteredTemplates = React.useMemo(() => {
        return templates.filter(template => {
            const meta = (TEMPLATE_META as any)[template.id];

            // Search query filter (matches title or description)
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = template.title.toLowerCase().includes(query);
                const matchesDesc = template.desc.toLowerCase().includes(query);
                if (!matchesTitle && !matchesDesc) return false;
            }

            // Difficulty filter
            if (difficultyFilter && meta?.difficulty !== difficultyFilter) {
                return false;
            }

            // Focus filter
            if (focusFilter && meta?.focus && !meta.focus.includes(focusFilter)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, difficultyFilter, focusFilter]);

    // Get unique filter options
    const difficulties = React.useMemo(() => {
        const allDifficulties = templates.map(t => (TEMPLATE_META as any)[t.id]?.difficulty).filter(Boolean);
        return [...new Set(allDifficulties)];
    }, []);

    const focusOptions = React.useMemo(() => {
        const allFocus = templates.flatMap(t => (TEMPLATE_META as any)[t.id]?.focus || []);
        return [...new Set(allFocus)];
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" data-testid="step2-container">
            <div className="px-8 pt-6"><BuilderProgress current={2} /></div>
            <header className="px-8 pt-8 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Select Template</h1>
                    <p className="text-sm text-gray-400">Choose the structural template. You'll fine‑tune scheme & loading in Step 3.</p>
                </div>
                <div data-testid="selection-summary" className="text-xs text-gray-300">
                    <div>Template: {step2.templateId || '—'}</div>
                    <div>Scheme: (choose next step)</div>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold">Templates</h2>
                            <button
                                onClick={toggleCompareMode}
                                data-testid="compare-mode-toggle"
                                className={`px-3 py-1.5 text-xs font-medium rounded transition ${compareMode
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {compareMode ? '📊 Exit Compare' : '📊 Compare Templates'}
                            </button>
                        </div>

                        {/* Compare Mode Info */}
                        {compareMode && (
                            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-md" data-testid="compare-mode-info">
                                <div className="text-xs text-blue-200">
                                    <div className="font-medium">Compare Mode Active</div>
                                    <div>Click template cards to add them to comparison ({compareTemplates.length}/3 selected)</div>
                                </div>
                            </div>
                        )}

                        {/* Search and Filter Controls */}
                        <div className="mb-6 space-y-4">
                            {/* Search Input */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    data-testid="template-search"
                                    className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
                                    <select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value)}
                                        data-testid="difficulty-filter"
                                        className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">All Difficulties</option>
                                        {difficulties.map(difficulty => (
                                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-400 mb-1">Focus</label>
                                    <select
                                        value={focusFilter}
                                        onChange={(e) => setFocusFilter(e.target.value)}
                                        data-testid="focus-filter"
                                        className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">All Focus Areas</option>
                                        {focusOptions.map(focus => (
                                            <option key={focus} value={focus}>{focus}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                {(searchQuery || difficultyFilter || focusFilter) && (
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setDifficultyFilter('');
                                                setFocusFilter('');
                                            }}
                                            data-testid="clear-filters"
                                            className="px-3 py-2 text-xs text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500 rounded-md transition"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Results Summary */}
                            <div className="text-xs text-gray-400">
                                Showing {filteredTemplates.length} of {templates.length} templates
                                {(searchQuery || difficultyFilter || focusFilter) && (
                                    <span className="ml-2">
                                        {searchQuery && `• Search: "${searchQuery}"`}
                                        {difficultyFilter && `• Difficulty: ${difficultyFilter}`}
                                        {focusFilter && `• Focus: ${focusFilter}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map(t => {
                                const isSelected = step2.templateId === t.id;
                                const isExpanded = expanded === t.id;
                                const isInComparison = compareTemplates.includes(t.id);
                                const meta = (TEMPLATE_META as any)[t.id];

                                let borderClass = 'border-gray-700 hover:border-gray-500 bg-gray-800/50';
                                if (compareMode) {
                                    borderClass = isInComparison
                                        ? 'border-blue-500 bg-blue-600/10'
                                        : compareTemplates.length >= 3
                                            ? 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
                                            : 'border-gray-700 hover:border-blue-400 bg-gray-800/50';
                                } else {
                                    borderClass = isSelected
                                        ? 'border-red-500 bg-gray-800'
                                        : isExpanded
                                            ? 'border-indigo-500 bg-gray-800/70'
                                            : 'border-gray-700 hover:border-gray-500 bg-gray-800/50';
                                }

                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        data-testid={`template-${t.id}`}
                                        onClick={() => onTemplate(t.id)}
                                        disabled={compareMode && compareTemplates.length >= 3 && !isInComparison}
                                        className={`text-left rounded-lg border p-4 transition h-full flex flex-col ${borderClass}`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium mb-1 flex items-center gap-2">
                                                <span>{t.title}</span>
                                                {compareMode ? (
                                                    isInComparison && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/70 text-white">Compare</span>
                                                ) : (
                                                    <>
                                                        {isSelected && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/70 text-white">Selected</span>}
                                                        {!isSelected && isExpanded && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/60 text-white">Viewing</span>}
                                                    </>
                                                )}
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

                        {/* Empty State */}
                        {filteredTemplates.length === 0 && (
                            <div className="col-span-full text-center py-12" data-testid="no-templates-found">
                                <div className="text-gray-400 text-sm">
                                    <div className="mb-2">🔍 No templates found</div>
                                    <p>Try adjusting your search or filter criteria</p>
                                    {(searchQuery || difficultyFilter || focusFilter) && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setDifficultyFilter('');
                                                setFocusFilter('');
                                            }}
                                            className="mt-3 text-red-400 hover:text-red-300 text-xs underline"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-5" ref={detailsRef} data-testid="template-details-panel">
                            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                                {compareMode ? (
                                    <>
                                        <h3 className="font-semibold mb-4 text-sm">Template Comparison</h3>
                                        <TemplateComparisonTable
                                            templateIds={compareTemplates}
                                            onRemove={removeFromComparison}
                                            onSelect={(id) => setStep2({ templateId: id })}
                                        />
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Scheme selection moved to Step 3 */}
                    {/* Cycle overview removed per latest request; detail now lives in the side panel */}
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Selection Summary</h3>
                        <p className="text-xs text-gray-400 mb-2">These choices determine default assistance, deload policy and AMRAP flags.</p>
                        <ul className="text-xs space-y-1">
                            <li>Template: <span className="font-mono">{step2.templateId || '—'}</span></li>
                            <li>Scheme: <span className="font-mono">(select in Step 3)</span></li>
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
                <button data-testid="step2-next" disabled={!canNext} onClick={() => navigate('/build/step3')} className={`px-4 py-2 rounded border text-sm ${canNext ? 'border-red-500 hover:bg-red-600/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}>Next: Customize</button>
            </footer>
        </div>
    );
}
