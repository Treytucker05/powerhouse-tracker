import React, { useEffect, useMemo, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import type { SupplementalRow } from '@/types/step3';
import { useStep3 } from '@/store/step3Store';
import { ASSISTANCE_PRESETS, defaultAssistancePreset, defaultJumpsThrows } from '@/lib/531/rules';
import { buildStep3DefaultsFromSupplemental, diffFromDefaults } from '@/lib/531/defaults';
import { useBuilder } from '@/context/BuilderState';
import { resolveTemplateConfig } from '@/lib/531/templateSchema';

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h2>;
}

export default function SupplementalTab() {
    const { state, actions } = useStep3();
    const { state: builderState } = useBuilder();
    const [rows, setRows] = useState<SupplementalRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    // When a supplemental is already seeded, show a compact confirm view by default
    const [showEditor, setShowEditor] = useState<boolean>(() => !state.supplemental);
    const templateId = (builderState as any)?.step2?.templateId as string | undefined;
    const tplCfg = resolveTemplateConfig(templateId || null);
    const [compatOnly, setCompatOnly] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const path = `${import.meta.env.BASE_URL}methodology/extraction/supplemental.csv`;
        loadCsv<SupplementalRow>(path)
            .then((data) => {
                if (cancelled) return;
                setRows((Array.isArray(data) ? data.filter(Boolean) : []) as SupplementalRow[]);
            })
            .catch((e) => { if (!cancelled) setError(e?.message || 'Failed to load supplemental CSV'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.toLowerCase();
        return rows.filter(r =>
            (r.Template || '').toLowerCase().includes(q) ||
            (r.SupplementalScheme || '').toLowerCase().includes(q) ||
            (r.MainPattern || '').toLowerCase().includes(q)
        );
    }, [rows, search]);

    // Compatibility filter (guided by selected template or current seeded supplemental)
    const compatibleRows = useMemo(() => {
        if (!compatOnly) return filtered;
        const current = state.supplemental;
        const by = (pred: (r: SupplementalRow) => boolean) => filtered.filter(pred);
        if (templateId === '5_s_pro_5x5_fsl') {
            return by(r => r.Phase === 'Leader' && r.MainPattern === '5s PRO' && r.SupplementalScheme === 'FSL');
        }
        if (templateId === '5_s_pro_ssl') {
            return by(r => r.Phase === 'Leader' && r.MainPattern === '5s PRO' && r.SupplementalScheme === 'SSL');
        }
        if (current) {
            // Fallback: keep same Phase and keep leader pattern family
            return by(r => r.Phase === current.Phase && (current.MainPattern ? r.MainPattern === current.MainPattern : true));
        }
        return filtered;
    }, [filtered, compatOnly, templateId, state.supplemental]);

    const onSelect = (idx: number) => {
        const row = filtered[idx];
        if (!row) return;
        actions.setSupplemental(row);
        // Apply default assistance preset and targets from rules
        const preset = defaultAssistancePreset(row);
        const [, top] = ASSISTANCE_PRESETS[preset].perCategory;
        actions.setAssistance({ volumePreset: preset, perCategoryTarget: { Pull: top, Push: top, 'Single-Leg/Core': top, Core: top } });
        // Set default jumps/throws dose
        actions.setWarmup({ jumpsThrowsDose: defaultJumpsThrows(row) });
    };

    const currentTemplate = state.supplemental?.Template;
    const defaults = state.supplemental ? buildStep3DefaultsFromSupplemental(state.supplemental) : undefined;
    const diff = defaults ? diffFromDefaults(state as any, defaults as any) : [];

    const step1 = (builderState as any)?.step1 || {};
    const tmInherited = typeof step1?.tmPct === 'number' ? Math.round(step1.tmPct * 100) + '%' : null;

    return (
        <div className="space-y-4">
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                {/* Confirm view when a Supplemental is already selected */}
                {state.supplemental && (
                    <div className="mb-3 border border-gray-800 rounded p-3 bg-[#0b1220]">
                        <div className="flex items-center justify-between mb-2">
                            <SectionTitle>Selected Supplemental</SectionTitle>
                            <div className="flex items-center gap-2">
                                {diff.length > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-[#1f2937] text-xs text-gray-200" title={diff.join(", ")}>Modified</span>
                                )}
                                {diff.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (defaults) {
                                                if (defaults.assistance) actions.setAssistance(defaults.assistance as any);
                                                if (defaults.warmup) actions.setWarmup(defaults.warmup as any);
                                                if (defaults.conditioning) actions.setConditioning(defaults.conditioning as any);
                                            }
                                        }}
                                        className="px-2 py-0.5 rounded bg-[#1f2937] hover:bg-[#ef4444] text-xs"
                                    >Reapply Defaults</button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-200">
                            <div><span className="text-gray-400">Template:</span> {state.supplemental.Template}</div>
                            <div><span className="text-gray-400">Phase:</span> {state.supplemental.Phase}</div>
                            <div><span className="text-gray-400">Pattern:</span> {state.supplemental.MainPattern}</div>
                            <div><span className="text-gray-400">Scheme:</span> {state.supplemental.SupplementalScheme}</div>
                            <div><span className="text-gray-400">Sets×Reps:</span> {state.supplemental.SupplementalSetsReps}</div>
                            <div><span className="text-gray-400">%:</span> {state.supplemental.SupplementalPercentSchedule}</div>
                            <div><span className="text-gray-400">TM:</span> {tmInherited || state.supplemental.TMRecommendation} {tmInherited && <span className="text-[10px] text-gray-400">(from Step 1)</span>}</div>
                            {state.supplemental.MainPattern === '5s PRO' && state.supplemental.SupplementalScheme === 'SSL' && (
                                <div className="sm:col-span-3 text-[11px] text-gray-300">SSL % by week: 75/80/85% TM. Heavier than FSL — keep assistance modest.</div>
                            )}
                            {state.supplemental.MainPattern === '5s PRO' && state.supplemental.SupplementalScheme === 'FSL' && (
                                <div className="sm:col-span-3 text-[11px] text-gray-300">FSL % by week: 65/70/75% TM. Recovery-friendly — assistance can be 50–100 reps per category.</div>
                            )}
                            {tplCfg?.policiesRow && (
                                <div className="sm:col-span-3 text-[11px] text-gray-400">{tplCfg.policiesRow}</div>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                onClick={() => setShowEditor(s => !s)}
                                className="px-3 py-1 rounded border border-gray-700 text-xs text-gray-200 hover:border-red-500"
                            >{showEditor ? 'Hide alternatives' : 'Edit supplemental…'}</button>
                            <a href="#/build/step3?tab=assistance" className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500">Continue to Assistance →</a>
                        </div>
                        {/* Mini-editor for structured supplemental config */}
                        <div className="mt-4 border border-gray-800 rounded p-3">
                            <div className="text-xs text-gray-300 mb-2">Edit sets×reps and weekly %s (Fixed only). Type switches set policy and guidance.</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-200">
                                <label className="flex items-center justify-between gap-2">
                                    <span className="text-gray-300">Type</span>
                                    <select
                                        value={state.supplementalConfig?.type || (state.supplemental?.SupplementalScheme as any) || 'FSL'}
                                        onChange={(e) => actions.setSupplementalConfig({
                                            type: e.target.value as any,
                                            setsReps: state.supplementalConfig?.setsReps || '5x5',
                                            weeklyPercents: state.supplementalConfig?.weeklyPercents || (state.supplemental?.SupplementalScheme === 'SSL' ? [75, 80, 85] : [65, 70, 75])
                                        })}
                                        className="w-40 bg-gray-900 border border-gray-700 rounded px-2 py-1"
                                    >
                                        {['FSL', 'SSL', 'BBB', 'Fixed'].map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </label>
                                <label className="flex items-center justify-between gap-2">
                                    <span className="text-gray-300">Sets×Reps</span>
                                    <div className="flex gap-2">
                                        {['5x5', '3x5', '5x3'].map(sr => (
                                            <button key={sr} onClick={() => actions.setSupplementalConfig({ type: state.supplementalConfig?.type || (state.supplemental?.SupplementalScheme as any) || 'FSL', setsReps: sr, weeklyPercents: state.supplementalConfig?.weeklyPercents || (state.supplemental?.SupplementalScheme === 'SSL' ? [75, 80, 85] : [65, 70, 75]) })}
                                                className={`px-2 py-1 rounded border text-xs ${((state.supplementalConfig?.setsReps || state.supplemental?.SupplementalSetsReps) || '').replace(/\s/gi, '').toLowerCase() === sr.toLowerCase() ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-200 hover:border-red-500'}`}>{sr}</button>
                                        ))}
                                    </div>
                                </label>
                                <div>
                                    <div className="text-gray-300 mb-1">Weekly %</div>
                                    <div className="flex items-center gap-2">
                                        {(state.supplementalConfig?.weeklyPercents || (state.supplemental?.SupplementalScheme === 'SSL' ? [75, 80, 85] : [65, 70, 75])).map((v, i) => (
                                            <input key={i} type="number" min={40} max={95} step={5}
                                                disabled={(state.supplementalConfig?.type || (state.supplemental?.SupplementalScheme as any) || 'FSL') !== 'Fixed'}
                                                value={Number(v)}
                                                onChange={(e) => {
                                                    const arr = [...(state.supplementalConfig?.weeklyPercents || (state.supplemental?.SupplementalScheme === 'SSL' ? [75, 80, 85] : [65, 70, 75]))];
                                                    arr[i] = Number(e.target.value);
                                                    actions.setSupplementalConfig({ type: state.supplementalConfig?.type || (state.supplemental?.SupplementalScheme as any) || 'FSL', setsReps: state.supplementalConfig?.setsReps || '5x5', weeklyPercents: arr });
                                                }}
                                                className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1" />
                                        ))}
                                    </div>
                                    <div className="mt-1 text-[11px] text-gray-400">Note: Switch to 3×5 if bar speed degrades 1–2 weeks.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table header */}
                <SectionTitle>Pick Supplemental Template</SectionTitle>
                {!state.supplemental && diff.length > 0 && (
                    <div className="mb-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#1f2937] text-xs text-gray-200" title={diff.join(", ")}>Modified</span>
                        <button onClick={() => {
                            if (defaults) {
                                if (defaults.assistance) actions.setAssistance(defaults.assistance as any);
                                if (defaults.warmup) actions.setWarmup(defaults.warmup as any);
                                if (defaults.conditioning) actions.setConditioning(defaults.conditioning as any);
                            }
                        }}
                            className="px-2 py-0.5 rounded bg-[#1f2937] hover:bg-[#ef4444] text-xs">Reapply Defaults</button>
                    </div>
                )}
                <div className="flex flex-col md:flex-row gap-2 md:items-center mb-3">
                    <input
                        placeholder="Search templates…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                    />
                    <label className="inline-flex items-center gap-2 text-xs text-gray-300">
                        <input type="checkbox" checked={compatOnly} onChange={(e) => setCompatOnly(e.target.checked)} />
                        Show compatible only
                    </label>
                </div>
                {/* Hide the table when a Supplemental is selected and editor is hidden */}
                {state.supplemental && !showEditor ? null : (
                    <div className="overflow-x-auto">
                        {loading && <div className="text-gray-400 text-sm">Loading…</div>}
                        {error && <div className="text-red-400 text-sm">{error}</div>}
                        {!loading && !error && (
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-800">
                                        <th className="py-2 pr-2">Template</th>
                                        <th className="py-2 px-2">Phase</th>
                                        <th className="py-2 px-2">Pattern</th>
                                        <th className="py-2 px-2">Scheme</th>
                                        <th className="py-2 px-2">Sets×Reps</th>
                                        <th className="py-2 px-2">%</th>
                                        <th className="py-2 pl-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compatibleRows.map((r, i) => {
                                        const isActive = currentTemplate === r.Template;
                                        return (
                                            <tr key={`${r.Template}-${i}`} className="border-b border-gray-900 hover:bg-gray-900/40">
                                                <td className="py-2 pr-2 text-gray-100">{r.Template}</td>
                                                <td className="py-2 px-2 text-gray-300">{r.Phase}</td>
                                                <td className="py-2 px-2 text-gray-300">{r.MainPattern}</td>
                                                <td className="py-2 px-2 text-gray-300">{r.SupplementalScheme}</td>
                                                <td className="py-2 px-2 text-gray-300">{r.SupplementalSetsReps}</td>
                                                <td className="py-2 px-2 text-gray-300">{r.SupplementalPercentSchedule}</td>
                                                <td className="py-2 pl-2">
                                                    <button
                                                        className={`px-2 py-1 rounded text-xs border ${isActive ? 'border-gray-700 text-gray-400 cursor-default' : 'border-red-600 text-white bg-red-600 hover:bg-red-500'}`}
                                                        disabled={isActive}
                                                        onClick={() => onSelect(i)}
                                                    >{isActive ? 'Selected' : 'Select'}</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                        {!loading && !error && compatibleRows.length === 0 && <div className="text-gray-400 text-sm">No templates match.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
