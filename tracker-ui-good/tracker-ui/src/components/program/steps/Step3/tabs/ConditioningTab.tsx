import React, { useEffect, useMemo, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import { capHardConditioning, minEasyConditioning } from '@/lib/531/rules';
import type { ConditioningRow } from '@/types/step3';
import { useStep3 } from '@/store/step3Store';
import { useEquipment } from '@/store/equipmentStore';
import { useSchedule } from '@/store/scheduleStore';
import type { Weekday } from '@/store/scheduleStore';

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h2>;
}

// Preferred days: Sun–Sat to match planner/calendar later
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ConditioningTab() {
    const { state, actions, dispatch } = useStep3() as any;
    const { selected: globalEquip } = useEquipment();
    const { state: schedule } = useSchedule();
    const [rows, setRows] = useState<ConditioningRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [intensityFilter, setIntensityFilter] = useState<'All' | 'Easy' | 'Hard'>('All');

    // Dynamic limits from supplemental selection
    const hardCapRaw = Number(state.supplemental?.HardConditioningMax);
    const easyMinRaw = Number(state.supplemental?.EasyConditioningMin);
    const maxHard = Number.isFinite(hardCapRaw) ? Math.max(0, Math.min(3, hardCapRaw)) : 3;
    const minEasy = Number.isFinite(easyMinRaw) ? Math.max(0, Math.min(7, easyMinRaw)) : 0;

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const path = `${import.meta.env.BASE_URL}methodology/extraction/conditioning.csv`;
        loadCsv<ConditioningRow>(path)
            .then((data) => {
                if (cancelled) return;
                const clean = (Array.isArray(data) ? data : []).filter(Boolean) as ConditioningRow[];
                setRows(clean);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e?.message || 'Failed to load conditioning CSV');
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const groups = useMemo(() => {
        const filtered = rows.filter(r => {
            const matchSearch = search.trim() ? (
                (r.Activity || '').toLowerCase().includes(search.toLowerCase()) ||
                (r.ModalityGroup || '').toLowerCase().includes(search.toLowerCase())
            ) : true;
            const matchIntensity = intensityFilter === 'All' ? true : (r.Intensity || '').toLowerCase() === intensityFilter.toLowerCase();
            // Optional equipment tag present in Notes: "[EQ: sled, rower]"
            let matchEquip = true;
            if (globalEquip && globalEquip.length > 0) {
                const m = (r.Notes || '').match(/\[EQ:([^\]]+)\]/i);
                if (m) {
                    const tags = m[1].split(/,\s*/).map(s => s.trim());
                    matchEquip = tags.some(t => globalEquip.includes(t));
                }
            }
            return matchSearch && matchIntensity && matchEquip;
        });
        const map = new Map<string, ConditioningRow[]>();
        for (const r of filtered) {
            const g = r.ModalityGroup || 'Other';
            if (!map.has(g)) map.set(g, []);
            map.get(g)!.push(r);
        }
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }, [rows, search, intensityFilter]);

    const selected = new Set(state.conditioning.modalities || []);

    const toggleModality = (name: string) => {
        const next = new Set(state.conditioning.modalities || []);
        if (next.has(name)) next.delete(name); else next.add(name);
        actions.setConditioning({ modalities: Array.from(next) });
    };

    const setHardDays = (n: number) => {
        const requested = Math.max(0, Math.min(7, Math.round(n)));
        const clamped = capHardConditioning(requested, state.supplemental);
        // also respect local UI cap for immediate feedback
        actions.setConditioning({ hardDays: Math.min(clamped, maxHard) });
    };
    const setEasyDays = (n: number) => {
        const requested = Math.max(0, Math.min(7, Math.round(n)));
        const clamped = minEasyConditioning(requested, state.supplemental);
        // also respect local UI min for immediate feedback
        actions.setConditioning({ easyDays: Math.max(clamped, minEasy) });
    };

    const allDays: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // initialize preferredDays from off-days on first mount
    useEffect(() => {
        if (state.conditioning.preferredDays && state.conditioning.preferredDays.length) return;
        const off = allDays.filter(d => !schedule.days.includes(d));
        try {
            dispatch({ type: "SET_CONDITIONING", payload: { preferredDays: off } });
        } catch {
            actions.setConditioning({ preferredDays: off });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const preferredDays = new Set(state.conditioning.preferredDays || []);
    const toggleDay = (d: string) => {
        const next = new Set(state.conditioning.preferredDays || []);
        if (next.has(d)) next.delete(d); else next.add(d);
        actions.setConditioning({ preferredDays: Array.from(next) });
    };

    // 50% Rule banner state
    const hard = state.conditioning.hardDays ?? 0;
    const easy = state.conditioning.easyDays ?? 0;
    const total = hard + easy;
    const violates50 = total > 0 && hard > easy; // more hard than easy
    const allowOver = !!state.conditioning.allowOverage;

    return (
        <div className="space-y-4">
            {/* 50% Rule Banner */}
            <div className={`rounded border p-3 ${violates50 && !allowOver ? 'bg-red-900/20 border-red-700' : total === 0 ? 'bg-yellow-900/20 border-yellow-700' : 'bg-emerald-900/20 border-emerald-700'}`}>
                <div className="text-sm">
                    <span className="font-medium text-gray-100">50% Rule:</span>{' '}
                    <span className="text-gray-200">At least half of your weekly conditioning should be Easy.</span>
                </div>
                <div className="text-xs mt-1 text-gray-300">
                    {violates50 && !allowOver && 'Tip: Add Easy days or reduce Hard days to improve recovery.'}
                    {!violates50 && total > 0 && 'Good balance — keep Easy work ≥ Hard for sustainable progress.'}
                    {total === 0 && 'No conditioning days selected yet.'}
                </div>
                {violates50 && (
                    <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-300">
                        <input type="checkbox" checked={allowOver} onChange={(e) => actions.setConditioning({ allowOverage: e.target.checked })} />
                        Allow overage (I understand recovery will suffer)
                    </label>
                )}
            </div>
            {/* Frequency controls */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Weekly Frequency</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-gray-300 text-sm">Hard days (HIIT)</label>
                            <span className="text-[11px] text-gray-400">Cap: {maxHard}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3].map((v) => {
                                const disabled = v > maxHard;
                                const active = (state.conditioning.hardDays ?? 0) === v;
                                return (
                                    <button
                                        key={v}
                                        disabled={disabled}
                                        onClick={() => setHardDays(v)}
                                        className={`px-2 py-1 rounded border text-sm ${active ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-200 hover:border-red-500'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >{v}</button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-gray-300 text-sm">Easy days</label>
                            <span className="text-[11px] text-gray-400">Min: {minEasy}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => {
                                const belowMin = v < minEasy;
                                const active = (state.conditioning.easyDays ?? 0) === v;
                                return (
                                    <button
                                        key={v}
                                        onClick={() => setEasyDays(v)}
                                        className={`px-2 py-1 rounded border text-sm ${active ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-200 hover:border-emerald-500'} ${belowMin ? 'opacity-50' : ''}`}
                                        title={belowMin ? `Minimum for current template is ${minEasy}` : undefined}
                                    >{v}</button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Preferred days</label>
                        <div className="flex flex-wrap gap-2">
                            {allDays.map(d => {
                                const active = preferredDays.has(d);
                                return (
                                    <button
                                        key={d}
                                        onClick={() => toggleDay(d)}
                                        className={`px-2 py-1 rounded border text-sm ${active ? 'bg-red-600/20 border-red-500 text-red-200' : 'bg-gray-900 border-gray-700 text-gray-300 hover:text-white'}`}
                                        title={schedule.days.includes(d) ? 'Training day' : 'Off-day'}
                                    >{d}</button>
                                );
                            })}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">We default to off-days; adjust as needed.</p>
                    </div>
                </div>
            </div>

            {/* Modality library */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Conditioning Modalities</SectionTitle>
                <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
                    <input
                        placeholder="Search by activity or group…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                    />
                    <select
                        value={intensityFilter}
                        onChange={(e) => setIntensityFilter(e.target.value as any)}
                        className="w-[160px] bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                    >
                        <option>All</option>
                        <option>Easy</option>
                        <option>Hard</option>
                    </select>
                </div>

                {globalEquip.length > 0 && (
                    <div className="mb-2 text-xs text-gray-400">Filtering by your Equipment Profile. <a href="#/tools/equipment" className="text-red-400 underline">Edit</a></div>
                )}
                {loading && <div className="text-gray-400 text-sm">Loading…</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && !error && groups.length === 0 && (
                    <div className="text-gray-400 text-sm">No activities found.</div>
                )}
                {!loading && !error && groups.length > 0 && (
                    <div className="space-y-4">
                        {groups.map(([group, items]) => (
                            <div key={group} className="border border-gray-800 rounded">
                                <div className="px-3 py-2 text-gray-200 bg-gray-900/60 border-b border-gray-800 font-medium">{group}</div>
                                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {items.map((r, idx) => {
                                        const id = `${r.Activity}-${idx}`;
                                        const isChecked = selected.has(r.Activity);
                                        return (
                                            <label key={id} className={`flex items-start gap-2 p-2 rounded border ${isChecked ? 'border-red-500 bg-red-600/10' : 'border-gray-800 bg-[#0b1220] hover:border-gray-700'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleModality(r.Activity)}
                                                    className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                                                />
                                                <div className="text-sm">
                                                    <div className="text-gray-100 flex items-center gap-2">
                                                        <span>{r.Activity}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${r.Intensity?.toLowerCase() === 'hard' ? 'border-red-600 text-red-300' : 'border-emerald-600 text-emerald-300'}`}>{r.Intensity || '—'}</span>
                                                    </div>
                                                    <div className="text-gray-400 text-xs">{r.SuggestedDuration || ''}</div>
                                                    {r.Notes ? <div className="text-gray-500 text-[11px] mt-0.5">{r.Notes}</div> : null}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
