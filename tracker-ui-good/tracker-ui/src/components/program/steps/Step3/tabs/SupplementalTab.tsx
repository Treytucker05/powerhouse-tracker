import React, { useEffect, useMemo, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import type { SupplementalRow } from '@/types/step3';
import { useStep3 } from '@/store/step3Store';
import { ASSISTANCE_PRESETS, defaultAssistancePreset, defaultJumpsThrows } from '@/lib/531/rules';
import { buildStep3DefaultsFromSupplemental, diffFromDefaults } from '@/lib/531/defaults';

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h2>;
}

export default function SupplementalTab() {
    const { state, actions } = useStep3();
    const [rows, setRows] = useState<SupplementalRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

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

    return (
        <div className="space-y-4">
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Pick Supplemental Template</SectionTitle>
                {diff.length > 0 && (
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
                </div>
                {loading && <div className="text-gray-400 text-sm">Loading…</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && !error && (
                    <div className="overflow-x-auto">
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
                                {filtered.map((r, i) => {
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
                        {filtered.length === 0 && <div className="text-gray-400 text-sm">No templates match.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
