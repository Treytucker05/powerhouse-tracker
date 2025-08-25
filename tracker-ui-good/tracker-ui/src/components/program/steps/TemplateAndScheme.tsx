import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/context/BuilderState';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { TEMPLATES as TEMPLATE_DEFS, TEMPLATE_DETAILS, TEMPLATE_META, templateLabel } from '@/lib/builder/templates';
import BuilderProgress from './BuilderProgress';
import { loadCsv } from '@/lib/loadCsv';
import type { TemplateCsv } from '@/types/templates';
import type { SupplementalRow } from '@/types/step3';

function fitMeter(row: SupplementalRow) {
    const sets = parseInt(String(row.SupplementalSetsReps || "").match(/\d+/)?.[0] ?? "0", 10) || 0;
    const time = Math.min(5, Math.round(sets / 2) + (Number((row as any).AssistancePerCategoryMax || 0) > 75 ? 2 : 0));
    const hypertrophy = Math.min(5, Math.round(sets / 2) + (row.SupplementalScheme === "BBB" ? 2 : 0));
    const strength = row.Phase === "Anchor" && row.MainPattern !== "5s PRO" ? 4 : 2;
    const cond = Math.min(5, (Number((row as any).HardConditioningMax || 0) >= 3 ? 4 : 2));
    return { strength, hypertrophy, time, cond };
}
// Removed inline WorkoutPreview to avoid duplication with Step 4 comprehensive preview

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

// Template comparison component
function TemplateComparisonTable({ templateIds, templates, onRemove, onSelect }: {
    templateIds: string[],
    templates: any[],
    onRemove: (id: string) => void,
    onSelect: (id: string) => void
}) {
    // Local helper: map template name to id
    const nameToId = (name?: string) => {
        const s = String(name || '').trim().toLowerCase();
        switch (s) {
            case 'boring but big': return 'bbb';
            case 'triumvirate': return 'triumvirate';
            case 'periodization bible': return 'periodization_bible';
            case 'bodyweight': return 'bodyweight';
            case 'jack sh*t':
            case 'jack shit': return 'jackshit';
            default:
                return s.replace(/[^a-z0-9]+/g, '_');
        }
    };

    // Build rows by matching selected ids to CSV rows
    const rows = (templateIds || []).map(id => {
        const row = (templates || []).find((t: any) => {
            const key = String(t['Template Name'] ?? t.Template ?? t.display_name ?? '').trim();
            if (!key) return false;
            return nameToId(key) === id;
        });
        const def = TEMPLATE_DEFS.find(d => d.id === id);
        const title = (row?.['Template Name'] as string) || (row as any)?.display_name || def?.title || id;
        return { id, title, row };
    }).filter(Boolean);

    if (!rows.length) {
        return (
            <div className="text-center py-8" data-testid="comparison-empty">
                <div className="text-gray-400 text-sm">
                    <div className="mb-2">📊 Template Comparison</div>
                    <p>Click on template cards to add them to comparison (max 3)</p>
                </div>
            </div>
        );
    }

    const get = (r: any, key: string) => {
        if (!r) return '—';
        return (r[key] ?? '—') as string;
    };

    return (
        <div className="overflow-x-auto" data-testid="comparison-table">
            <table className="w-full border border-gray-700 rounded-lg">
                <thead>
                    <tr className="bg-gray-800/60">
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Template</th>
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Main Work</th>
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Supplemental</th>
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Assistance</th>
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Conditioning</th>
                        <th className="text-left p-3 border-b border-gray-700 text-sm font-medium">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ id, title, row }) => (
                        <tr key={id} className="odd:bg-gray-900/40">
                            <td className="p-3 border-b border-gray-800 align-top text-sm">
                                <div className="space-y-2">
                                    <div className="font-medium">{title}</div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelect(id)}
                                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded text-white transition"
                                        >
                                            Select
                                        </button>
                                        <button
                                            onClick={() => onRemove(id)}
                                            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded text-white transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 border-b border-gray-800 align-top text-xs">{get(row, 'Main Work')}</td>
                            <td className="p-3 border-b border-gray-800 align-top text-xs">{get(row, 'Supplemental')}</td>
                            <td className="p-3 border-b border-gray-800 align-top text-xs">{get(row, 'Assistance')}</td>
                            <td className="p-3 border-b border-gray-800 align-top text-xs">{get(row, 'Conditioning')}</td>
                            <td className="p-3 border-b border-gray-800 align-top text-xs">{get(row, 'Notes')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Provide a simple main-lift set notation based on scheme selection (preview only)
// scheme descriptor moved to shared module if needed later

export default function TemplateAndScheme() {
    // Align with BuilderState context API: returns { state, setState }
    const { state: builderState, setState: setBuilderState } = useBuilder();
    const step2 = (builderState as any)?.step2 || {};
    const setStep2 = (u: any) => setBuilderState({ step2: { ...((builderState as any)?.step2 || {}), ...u } });
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [difficultyFilter, setDifficultyFilter] = React.useState<string>('');
    const [focusFilter, setFocusFilter] = React.useState<string>('');
    const [compareMode, setCompareMode] = React.useState(false);
    const [compareTemplates, setCompareTemplates] = React.useState<string[]>([]);
    const detailsRef = React.useRef<HTMLDivElement | null>(null);
    const prevExpanded = React.useRef<string | null>(null);

    // Map CSV template names to internal IDs
    const nameToId = (name: string) => {
        const s = name.trim().toLowerCase();
        switch (s) {
            case 'boring but big': return 'bbb';
            case 'triumvirate': return 'triumvirate';
            case 'periodization bible': return 'periodization_bible';
            case 'bodyweight': return 'bodyweight';
            case 'jack sh*t':
            case 'jack shit': return 'jackshit';
            default:
                return s.replace(/[^a-z0-9]+/g, '_');
        }
    };

    // Load templates from CSV (master + additions)
    const [csvTemplates, setCsvTemplates] = useState<TemplateCsv[]>([]);
    useEffect(() => {
        let active = true;
        const MASTER_URL = `${import.meta.env.BASE_URL}methodology/extraction/templates_master.csv`;
        const ADDITIONS_URL = `${import.meta.env.BASE_URL}methodology/extraction/templates_additions.csv`;
        (async () => {
            try {
                const master = await loadCsv<TemplateCsv>(MASTER_URL).catch(() => []);
                const additions = await loadCsv<TemplateCsv>(ADDITIONS_URL).catch(() => []);

                // Normalize additions ids and fields
                const addById = new Map<string, TemplateCsv>();
                (additions || []).forEach((r: TemplateCsv) => {
                    const id = String(r.id || '').trim();
                    if (!id) return;
                    addById.set(id, r);
                });

                // Map master into a common shape with synthetic id
                const norm = (master || []).map((row: any) => {
                    const name: string = String(row['Template Name'] ?? row.Template ?? '').trim();
                    const id = name
                        ? name.toLowerCase()
                            .replace(/^(jack sh\*t|jack shit)$/, 'jackshit')
                            .replace(/[^a-z0-9]+/g, '-')
                        : '';
                    return { ...(row as TemplateCsv), id } as TemplateCsv;
                });

                // Merge: prefer additions (have source_book) on duplicate ids
                const mergedById = new Map<string, TemplateCsv>();
                norm.forEach(r => { if (r.id) mergedById.set(r.id, r); });
                addById.forEach((v, k) => { mergedById.set(k, v); });

                // Stable sort: category → display_name (fallback to title)
                const merged = Array.from(mergedById.values()).sort((a, b) => {
                    const ca = String((a as any).category || '').toLowerCase();
                    const cb = String((b as any).category || '').toLowerCase();
                    if (ca !== cb) return ca < cb ? -1 : 1;
                    const ta = String((a as any).display_name || (a as any)['Template Name'] || '').toLowerCase();
                    const tb = String((b as any).display_name || (b as any)['Template Name'] || '').toLowerCase();
                    return ta < tb ? -1 : ta > tb ? 1 : 0;
                });
                if (active) setCsvTemplates(merged);
            } catch {
                if (active) setCsvTemplates([]);
            }
        })();
        return () => { active = false; };
    }, []);

    // Debug effect removed to avoid duplicate fetch/log noise

    // Build UI list from CSV rows
    const availableTemplates = React.useMemo(() => {
        function toTitle(row: TemplateCsv): string {
            const name = String((row as any)['Template Name'] ?? (row as any).Template ?? '').trim();
            return name || String(row.display_name || '').trim() || '';
        }
        function toId(row: TemplateCsv): string {
            const name = toTitle(row);
            return name
                ? name.toLowerCase().replace(/^(jack sh\*t|jack shit)$/, 'jackshit').replace(/[^a-z0-9]+/g, '_')
                : String(row.id || '').trim();
        }

        return (csvTemplates || [])
            .map((row: TemplateCsv) => {
                const name = toTitle(row);
                const id = toId(row);
                const def = TEMPLATE_DEFS.find(d => d.id === id);
                const desc = def?.desc || String((row as any).Notes ?? (row as any).Description ?? row.notes ?? '').trim();
                // Prefer additions fields when present
                const mainWork = (row as any)['Main Work'] ?? '';
                const supplemental = (row as any)['Supplemental'] ?? row.supplemental ?? '';
                const assistance = (row as any)['Assistance'] ?? row.assistance_guideline ?? '';
                const conditioning = (row as any)['Conditioning'] ?? row.conditioning_guideline ?? '';
                const notes = (row as any)['Notes'] ?? row.notes ?? '';
                const leaderAnchor = (row as any)['Leader/Anchor'] ?? row.leader_anchor ?? '';
                return {
                    id,
                    title: name || templateLabel(id),
                    desc,
                    mainWork,
                    supplemental,
                    assistance,
                    conditioning,
                    notes,
                    leaderAnchor,
                    difficulty: 'All',
                    focus: 'General',
                };
            })
            .filter((t: any, i: number, a: any[]) => a.findIndex(x => x.id === t.id) === i);
    }, [csvTemplates]);

    // Currently selected template's CSV row (for details panel)
    const selectedCsv = React.useMemo(() => {
        if (!expanded) return null;
        const match = (csvTemplates || []).find((t: any) => {
            const key = String(t['Template Name'] ?? t.Template ?? t.display_name ?? '').trim();
            if (!key) return false;
            return nameToId(key) === expanded;
        });
        return match || null;
    }, [csvTemplates, expanded]);

    // Selected template CSV row for Selection Summary
    // Helper to safely resolve a template id from multiple shapes
    const getTemplateId = (t: any) => t?.templateId ?? t?.template?.id ?? t?.template ?? null;
    const selectedTemplateId = getTemplateId(step2);

    const selectedCsvForSummary = React.useMemo(() => {
        if (!selectedTemplateId) return null;
        const match = (csvTemplates || []).find((t: any) => {
            const key = String(t['Template Name'] ?? t.Template ?? t.display_name ?? '').trim();
            if (!key) return false;
            return nameToId(key) === selectedTemplateId;
        });
        return match || null;
    }, [csvTemplates, selectedTemplateId]);

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
    const canNext = !!selectedTemplateId;

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
        return availableTemplates.filter(template => {
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
    }, [searchQuery, difficultyFilter, focusFilter, availableTemplates]);

    // Get unique filter options
    const difficulties = React.useMemo(() => {
        const allDifficulties = availableTemplates
            .map(t => (TEMPLATE_META as any)[t.id]?.difficulty)
            .filter(Boolean) as string[];
        return [...new Set(allDifficulties)];
    }, [availableTemplates]);

    const focusOptions = React.useMemo(() => {
        const allFocus = availableTemplates.flatMap(t => (TEMPLATE_META as any)[t.id]?.focus || []) as string[];
        return [...new Set(allFocus)];
    }, [availableTemplates]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" data-testid="step2-container">
            <div className="px-8 pt-6"><BuilderProgress current={2} /></div>
            <header className="px-8 pt-8 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Step 2 · Select Template</h1>
                    <p className="text-sm text-gray-400">Choose the structural template. You'll fine‑tune scheme & loading in Step 3.</p>
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

                        {/* Scheme chips (lightweight inline UI) */}
                        <div className="mt-2 text-sm">
                            <span className="mr-2">Scheme:</span>
                            {(["5/3/1", "3/5/1", "5s PRO"] as const).map(m => (
                                <button key={m} onClick={() => {/* integrate with step2 state when ready */ }}
                                    className="px-2 py-1 mr-1 rounded border border-gray-700 bg-[#0b1220] hover:bg-[#ef4444]">{m}</button>
                            ))}
                        </div>

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
                                Showing {filteredTemplates.length} of {availableTemplates.length} templates
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
                                const isSelected = selectedTemplateId === t.id;
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
                                                {/* Leader/Anchor badge */}
                                                {(() => {
                                                    const raw = String((t as any).leaderAnchor || '').toLowerCase();
                                                    if (!raw) return null;
                                                    const isLeader = /leader/.test(raw) && !/anchor/.test(raw);
                                                    const isAnchor = /anchor/.test(raw) && !/leader/.test(raw);
                                                    const isBoth = /leader/.test(raw) && /anchor/.test(raw);
                                                    const label = isBoth ? 'Leader/Anchor' : isLeader ? 'Leader' : isAnchor ? 'Anchor' : (t as any).leaderAnchor;
                                                    const cls = isAnchor
                                                        ? 'border border-red-500 text-red-400'
                                                        : 'border border-gray-500 text-gray-300';
                                                    return <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
                                                })()}
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
                                            templates={csvTemplates}
                                            onRemove={removeFromComparison}
                                            onSelect={(id) => setStep2({ templateId: id, template: id })}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold mb-2 text-sm">Template Details</h3>
                                        {!expanded && !selectedTemplateId && (
                                            <p className="text-xs text-gray-500">Select a template card above to view its details.</p>
                                        )}
                                        {expanded && !selectedTemplateId && (
                                            <div className="text-xs text-amber-300">Template selection invalid. Please reselect.</div>
                                        )}
                                        {expanded && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-medium">{availableTemplates.find(t => t.id === expanded)?.title || TEMPLATE_DEFS.find(t => t.id === expanded)?.title || templateLabel(expanded)}</h4>
                                                    {selectedTemplateId === expanded && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/70 text-white">Selected</span>}
                                                </div>
                                                {/* CSV-backed details */}
                                                {selectedCsv ? (
                                                    <div className="space-y-1 text-xs text-gray-300">
                                                        <p><strong className="text-gray-400">Main Work:</strong> {(selectedCsv as any).ui_main || selectedCsv['Main Work'] || '—'}</p>
                                                        <p><strong className="text-gray-400">Supplemental:</strong> {(selectedCsv as any).ui_supplemental || selectedCsv['Supplemental'] || '—'}</p>
                                                        <p><strong className="text-gray-400">Assistance:</strong> {(selectedCsv as any).ui_assistance || selectedCsv['Assistance'] || '—'}</p>
                                                        <p><strong className="text-gray-400">Conditioning:</strong> {(selectedCsv as any).ui_conditioning || selectedCsv['Conditioning'] || '—'}</p>
                                                        <p><strong className="text-gray-400">Notes:</strong> {(selectedCsv as any).ui_notes || selectedCsv['Notes'] || (selectedCsv as any).notes || '—'}</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-500">No details available.</div>
                                                )}
                                                <div className="flex gap-2 pt-1">
                                                    {selectedTemplateId !== expanded && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setStep2({ templateId: expanded, template: expanded })}
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
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm" data-testid="selection-summary">
                        <h3 className="font-semibold mb-2">Selection Summary</h3>
                        {!selectedTemplateId ? (
                            <div className="text-xs text-gray-500">Choose a template first.</div>
                        ) : !selectedCsvForSummary ? (
                            <div className="text-xs text-gray-500">No template selected.</div>
                        ) : (
                            <div className="text-sm text-gray-300 space-y-1">
                                <p><strong className="text-gray-400">Template:</strong> {selectedCsvForSummary['Template Name'] || '(none)'}</p>
                                <p><strong className="text-gray-400">Main Work:</strong> {selectedCsvForSummary['Main Work'] || '—'}</p>
                                <p><strong className="text-gray-400">Supplemental:</strong> {selectedCsvForSummary['Supplemental'] || '—'}</p>
                                <p><strong className="text-gray-400">Assistance:</strong> {selectedCsvForSummary['Assistance'] || '—'}</p>
                                <p><strong className="text-gray-400">Conditioning:</strong> {selectedCsvForSummary['Conditioning'] || '—'}</p>
                                <p><strong className="text-gray-400">Notes:</strong> {selectedCsvForSummary['Notes'] || '—'}</p>
                                {/* Fit Meter */}
                                {(() => {
                                    try {
                                        const fit = fitMeter(selectedCsvForSummary as unknown as SupplementalRow);
                                        return (
                                            <div className="mt-2 text-xs text-gray-300 flex flex-wrap gap-2">
                                                <span>Strength ★{"★".repeat(fit.strength)}{"☆".repeat(5 - fit.strength)}</span>
                                                <span>Hypertrophy ★{"★".repeat(fit.hypertrophy)}{"☆".repeat(5 - fit.hypertrophy)}</span>
                                                <span>Time ★{"★".repeat(fit.time)}{"☆".repeat(5 - fit.time)}</span>
                                                <span>Cond Headroom ★{"★".repeat(fit.cond)}{"☆".repeat(5 - fit.cond)}</span>
                                            </div>
                                        );
                                    } catch { return null; }
                                })()}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            try { sessionStorage.setItem('applyTemplateDefaults', '1'); } catch { }
                                            navigate('/build/step3?tab=assistance');
                                        }}
                                        className="mt-2 text-xs px-3 py-1.5 rounded border border-gray-600 hover:border-red-500 text-gray-200"
                                    >Start with Template Defaults → Step 3</button>
                                </div>
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
