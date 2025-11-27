import React, { useEffect, useMemo, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import type { AssistanceRow, Step3Selection } from '@/types/step3';
import { ASSISTANCE_PRESETS } from '@/lib/531/rules';
import { useStep3 } from '@/store/step3Store';
import { useEquipment } from '@/store/equipmentStore';
import { deriveTemplateTargets } from '@/lib/531/defaults';

type Preset = Step3Selection['assistance']['volumePreset'];
const CAT_KEYS: Array<'Pull' | 'Push' | 'Single-Leg/Core' | 'Core'> = ['Pull', 'Push', 'Single-Leg/Core', 'Core'];
const PRESET_TARGETS: Record<Preset, number> = {
    Minimal: ASSISTANCE_PRESETS.Minimal.perCategory[1],
    Standard: ASSISTANCE_PRESETS.Standard.perCategory[1],
    Loaded: ASSISTANCE_PRESETS.Loaded.perCategory[1],
};

function classNames(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(' ');
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h2>;
}

function Meter({ label, current, target }: { label: string; current: number; target: number }) {
    const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, target)) * 100)));
    return (
        <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-300">
                <span>{label}</span>
                <span>
                    {current}/{target}
                </span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
                <div className="h-2 bg-red-500 rounded" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function AssistanceTab() {
    const { state, actions } = useStep3();
    const { selected: globalEquip } = useEquipment();
    const [rows, setRows] = useState<AssistanceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [visibleCats, setVisibleCats] = useState<Record<string, boolean>>({ Pull: true, Push: true, 'Single-Leg/Core': true, Core: true });
    const [equipSel, setEquipSel] = useState<Record<string, boolean>>({});
    const [difficulty, setDifficulty] = useState<string>('All');
    const [backStress, setBackStress] = useState<string>('All');
    const [hideHighBackStress, setHideHighBackStress] = useState<boolean>(false);

    // Load CSV
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const path = `${import.meta.env.BASE_URL}methodology/extraction/assistance_exercises.csv`;
        loadCsv<AssistanceRow>(path)
            .then((data) => {
                if (cancelled) return;
                setRows(Array.isArray(data) ? data.filter(Boolean) as AssistanceRow[] : []);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e?.message || 'Failed to load assistance CSV');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    // Derive equipment universe
    const equipmentAll = useMemo(() => {
        const set = new Set<string>();
        rows.forEach((r) => {
            const parts = (r.Equipment || '').split(/,\s*/).filter(Boolean);
            parts.forEach((p) => set.add(p));
        });
        return Array.from(set).sort();
    }, [rows]);

    // Default preset from supplemental (only once if fresh)
    useEffect(() => {
        const supp = state.supplemental;
        const picksEmpty = CAT_KEYS.every((k) => (state.assistance.picks[k]?.length || 0) === 0);
        if (!supp || !picksEmpty) return;
        let desired: Preset = 'Standard';
        const scheme = (supp.SupplementalScheme || '').toLowerCase();
        if (scheme.includes('bbb') || scheme.includes('bbs')) desired = 'Standard';
        else if (scheme.includes('pr')) desired = 'Loaded';
        // If perCategoryTarget already equals INITIAL defaults, apply our targets
        const currentTargets = state.assistance.perCategoryTarget || {};
        const looksDefault = CAT_KEYS.every((k) => (currentTargets[k] ?? 25) === 25);
        if (looksDefault) {
            const target = PRESET_TARGETS[desired];
            const perCategoryTarget: Record<string, number> = {};
            CAT_KEYS.forEach((k) => { perCategoryTarget[k] = target; });
            actions.setAssistance({ volumePreset: desired, perCategoryTarget });
        }
    }, [state.supplemental]);

    // When in Template mode, derive targets from supplemental selection
    useEffect(() => {
        if (state.assistance.mode !== 'Template') return;
        const supp = state.supplemental;
        if (!supp) return;
        const derived = deriveTemplateTargets(supp);
        const prev = state.assistance.perCategoryTarget || {};
        const changed = CAT_KEYS.some((k) => (prev[k] ?? 0) !== (derived[k] ?? 0));
        if (changed) actions.setAssistance({ perCategoryTarget: derived });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.assistance.mode, state.supplemental]);

    // Filtered data by category
    const filteredByCat = useMemo(() => {
        const matchesEquip = (row: AssistanceRow) => {
            const active = (globalEquip && globalEquip.length > 0) ? globalEquip : Object.keys(equipSel).filter((k) => equipSel[k]);
            if (active.length === 0) return true;
            const parts = (row.Equipment || '').split(/,\s*/).filter(Boolean);
            return active.some((a) => parts.includes(a));
        };
        const matchesDifficulty = (row: AssistanceRow) => difficulty === 'All' || (row.Difficulty || '') === difficulty;
        const matchesBack = (row: AssistanceRow) => {
            const flag = (row.BackStressFlag || '');
            if (hideHighBackStress && flag === 'High') return false;
            return backStress === 'All' || flag === backStress;
        };
        const out: Record<string, AssistanceRow[]> = { Pull: [], Push: [], 'Single-Leg/Core': [], Core: [] };
        rows.forEach((r) => {
            if (!visibleCats[r.Category as string]) return;
            if (!matchesEquip(r) || !matchesDifficulty(r) || !matchesBack(r)) return;
            const cat = (r.Category as any) as 'Pull' | 'Push' | 'Single-Leg/Core' | 'Core';
            if (CAT_KEYS.includes(cat)) out[cat].push(r);
        });
        return out;
    }, [rows, visibleCats, equipSel, difficulty, backStress, hideHighBackStress]);

    // Add pick
    const addPick = (cat: 'Pull' | 'Push' | 'Single-Leg/Core' | 'Core', name: string) => {
        const prev = state.assistance.picks[cat] || [];
        if (prev.includes(name)) return;
        const picks = { ...state.assistance.picks, [cat]: [...prev, name] } as Step3Selection['assistance']['picks'];
        actions.setAssistancePicks(picks);
    };

    // Preset change
    const onPresetChange = (preset: Preset) => {
        const target = PRESET_TARGETS[preset];
        const perCategoryTarget: Record<string, number> = {};
        CAT_KEYS.forEach((k) => { perCategoryTarget[k] = target; });
        actions.setAssistance({ volumePreset: preset, perCategoryTarget });
    };

    // Custom numeric update
    const updateCustomTarget = (cat: 'Pull' | 'Push' | 'Single-Leg/Core' | 'Core', val: number) => {
        const clamped = Math.max(0, Math.min(120, Math.round(val)));
        const prev = (state.assistance.perCategoryTarget || {}) as Record<string, number>;
        actions.setAssistance({ perCategoryTarget: { ...prev, [cat]: clamped } });
    };

    // Current meters
    const meters = useMemo(() => {
        const current = (arr?: string[]) => (Array.isArray(arr) ? arr.length * 10 : 0);
        const targets = state.assistance.perCategoryTarget || {};
        return CAT_KEYS.map((k) => ({
            key: k,
            current: current(state.assistance.picks[k]),
            target: targets[k] ?? PRESET_TARGETS[state.assistance.volumePreset || 'Standard'],
        }));
    }, [state.assistance]);

    return (
        <div className="space-y-4">
            {/* Assistance Mode */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Assistance Mode</SectionTitle>
                <div className="flex flex-wrap gap-2">
                    {(['Template', 'Preset', 'Custom'] as Array<'Template' | 'Preset' | 'Custom'>).map((m) => {
                        const active = state.assistance.mode === m;
                        return (
                            <button
                                key={m}
                                className={classNames(
                                    'px-3 py-1 rounded border text-sm',
                                    active ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-200 hover:border-red-500'
                                )}
                                onClick={() => actions.setAssistanceMode(m)}
                            >
                                {m}
                            </button>
                        );
                    })}
                </div>
                {state.assistance.mode === 'Template' && (
                    <div className="mt-2 text-xs text-gray-300">
                        {state.supplemental ? (
                            <span>Targets derived from your Supplemental selection.</span>
                        ) : (
                            <span className="text-yellow-300">Select a Supplemental scheme to derive targets.</span>
                        )}
                    </div>
                )}
            </div>

            {/* Volume Presets (only in Preset mode) */}
            {state.assistance.mode === 'Preset' && (
                <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                    <SectionTitle>Volume Presets</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                        {(['Minimal', 'Standard', 'Loaded'] as Preset[]).map((p) => {
                            const active = state.assistance.volumePreset === p;
                            return (
                                <button
                                    key={p}
                                    className={classNames(
                                        'px-3 py-1 rounded border text-sm',
                                        active ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-200 hover:border-red-500'
                                    )}
                                    onClick={() => onPresetChange(p)}
                                >
                                    {p} {p === 'Minimal' && '(0–25)'}{p === 'Standard' && '(25–50)'}{p === 'Loaded' && '(50–100)'}
                                </button>
                            );
                        })}
                    </div>
                    {/* Hint pills */}
                    {state.supplemental && /(bbb|bbs)/i.test(state.supplemental.SupplementalScheme || '') && (
                        <div className="mt-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-200">BBB → prioritize Lats/Abs</span>
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Filters</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-200">
                    <div>
                        <div className="text-gray-400 mb-1">Categories</div>
                        <div className="flex flex-col gap-1">
                            {CAT_KEYS.map((k) => (
                                <label key={k} className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!visibleCats[k]}
                                        onChange={(e) => setVisibleCats((s) => ({ ...s, [k]: e.target.checked }))}
                                    />
                                    <span>{k}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-400 mb-1">Equipment</div>
                        <div className="max-h-28 overflow-auto pr-1 border border-gray-800 rounded">
                            <div className="p-2 space-y-1">
                                {equipmentAll.map((eq) => (
                                    <label key={eq} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={!!equipSel[eq]}
                                            onChange={(e) => setEquipSel((s) => ({ ...s, [eq]: e.target.checked }))}
                                        />
                                        <span>{eq}</span>
                                    </label>
                                ))}
                                {equipmentAll.length === 0 && <div className="text-gray-500 text-xs">No equipment data</div>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-400 mb-1">Difficulty</div>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1"
                        >
                            {['All', 'Easy', 'Medium', 'Hard', 'None'].map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className="text-gray-400 mb-1">Back Stress</div>
                        <select
                            value={backStress}
                            onChange={(e) => setBackStress(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 mb-2"
                        >
                            {['All', 'Low', 'Medium', 'High'].map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                        <label className="inline-flex items-center gap-2 text-xs text-gray-300">
                            <input type="checkbox" checked={hideHighBackStress} onChange={(e) => setHideHighBackStress(e.target.checked)} />
                            Hide High (e.g., on Deadlift day)
                        </label>
                    </div>
                </div>
            </div>

            {/* Per-category meters */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Per-category volume</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meters.map((m) => (
                        <Meter key={m.key} label={m.key} current={m.current} target={m.target} />
                    ))}
                </div>
                {state.assistance.mode === 'Custom' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-200">
                        {CAT_KEYS.map((k) => (
                            <label key={k} className="flex items-center justify-between gap-3">
                                <span className="text-gray-300">{k}</span>
                                <input
                                    type="number"
                                    min={0}
                                    max={120}
                                    step={5}
                                    value={(state.assistance.perCategoryTarget?.[k] ?? 50)}
                                    onChange={(e) => updateCustomTarget(k, Number(e.target.value))}
                                    className="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-right"
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Tables by category */}
            <div className="space-y-6">
                {CAT_KEYS.map((cat) => (
                    visibleCats[cat] && (
                        <div key={cat} className="bg-[#0b1220] border border-gray-800 rounded p-4">
                            <SectionTitle>{cat}</SectionTitle>
                            {loading && <div className="text-gray-400 text-sm">Loading…</div>}
                            {error && <div className="text-red-400 text-sm">{error}</div>}
                            {!loading && !error && (
                                <div className="overflow-x-auto">
                                    {globalEquip.length > 0 && (
                                        <div className="mb-2 text-xs text-gray-400">Filtering by your Equipment Profile. <a href="#/tools/equipment" className="text-red-400 underline">Edit</a></div>
                                    )}
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-400 border-b border-gray-800">
                                                <th className="py-2 pr-2">Exercise</th>
                                                <th className="py-2 px-2">Equip</th>
                                                <th className="py-2 px-2">Diff</th>
                                                <th className="py-2 px-2">Back</th>
                                                <th className="py-2 pl-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filteredByCat[cat] || []).map((r, idx) => {
                                                const added = (state.assistance.picks[cat] || []).includes(r.Exercise);
                                                return (
                                                    <tr key={`${r.Exercise}-${idx}`} className="border-b border-gray-900 hover:bg-gray-900/40">
                                                        <td className="py-2 pr-2 text-gray-100">{r.Exercise}</td>
                                                        <td className="py-2 px-2 text-gray-300">{r.Equipment}</td>
                                                        <td className="py-2 px-2 text-gray-300">{r.Difficulty}</td>
                                                        <td className="py-2 px-2 text-gray-300">{r.BackStressFlag}</td>
                                                        <td className="py-2 pl-2">
                                                            <button
                                                                className={classNames(
                                                                    'px-2 py-1 rounded text-xs border',
                                                                    added ? 'border-gray-700 text-gray-400 cursor-not-allowed' : 'border-red-600 text-white bg-red-600 hover:bg-red-500'
                                                                )}
                                                                disabled={added}
                                                                onClick={() => addPick(cat, r.Exercise)}
                                                            >
                                                                {added ? 'Added' : 'Add'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {(filteredByCat[cat] || []).length === 0 && (
                                        <div className="text-gray-400 text-sm">No matches for current filters.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
