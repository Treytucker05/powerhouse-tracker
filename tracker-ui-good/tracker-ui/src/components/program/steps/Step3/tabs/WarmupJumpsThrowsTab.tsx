import React, { useEffect, useMemo, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import type { WarmupRow } from '@/types/step3';
import { useStep3 } from '@/store/step3Store';
import NOVPresetPanel from '../NOVPresetPanel';

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h2>;
}

export default function WarmupJumpsThrowsTab() {
    const { state, actions } = useStep3();
    const [rows, setRows] = useState<WarmupRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const path = `${import.meta.env.BASE_URL}methodology/extraction/warmups.csv`;
        loadCsv<WarmupRow>(path)
            .then((data) => {
                if (cancelled) return;
                setRows(Array.isArray(data) ? data.filter(Boolean) as WarmupRow[] : []);
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e?.message || 'Failed to load warmups CSV');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    // Partition rows
    const mobility = useMemo(() => rows.filter(r => (r.Type || '').toLowerCase() === 'mobility'), [rows]);
    const jumps = useMemo(() => rows.filter(r => (r.Type || '').toLowerCase() === 'jump'), [rows]);
    const throws = useMemo(() => rows.filter(r => (r.Type || '').toLowerCase() === 'throw'), [rows]);

    // Initialize dose from supplemental default once if present
    useEffect(() => {
        const suppDose = Number(state.supplemental?.JumpsThrowsDefault);
        const current = Number(state.warmup.jumpsThrowsDose);
        if (Number.isFinite(suppDose) && suppDose > 0 && (current === 0 || current === 10)) {
            actions.setWarmup({ jumpsThrowsDose: suppDose });
        }
        // run only when supplemental changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.supplemental?.JumpsThrowsDefault]);

    const onMobility = (name: string) => actions.setWarmup({ mobility: name });
    const onJump = (name: string) => actions.setWarmup({ jump: name });
    const onThrow = (name: string) => actions.setWarmup({ throw: name });
    const clamp = (n: number, lo = 0, hi = 200) => Math.max(lo, Math.min(hi, Math.round(n)));
    const onDose = (dose: number) => actions.setWarmup({ jumpsThrowsDose: clamp(dose, 0, 200) });
    const onSplit = (patch: Partial<{ jumpsPerDay: number; throwsPerDay: number }>) => {
        const j = typeof patch.jumpsPerDay === 'number' ? clamp(patch.jumpsPerDay) : state.warmup.jumpsPerDay || 0;
        const t = typeof patch.throwsPerDay === 'number' ? clamp(patch.throwsPerDay) : state.warmup.throwsPerDay || 0;
        // update split
        actions.setWarmup({ ...patch });
        // keep legacy combined field roughly synced for estimator fallbacks
        actions.setWarmup({ jumpsThrowsDose: clamp(j + t) });
    };
    const onNOV = (enabled: boolean) => actions.setWarmup({ novFullPrep: !!enabled });

    return (
        <div className="space-y-4">
            {/* Mobility preset */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Mobility Preset</SectionTitle>
                {loading && <div className="text-gray-400 text-sm">Loading…</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && !error && (
                    <select
                        value={state.warmup.mobility || ''}
                        onChange={(e) => onMobility(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                    >
                        <option value="">— Select mobility preset —</option>
                        {mobility.map((m, i) => (
                            <option key={`${m.Name}-${i}`} value={m.Name}>{m.Name}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* NOV full-body prep toggle */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <div className="flex items-center justify-between">
                    <SectionTitle>N.O.V. Full‑Body Warm‑Up</SectionTitle>
                    <label className="text-sm text-gray-200 flex items-center gap-2">
                        <input type="checkbox" checked={!!state.warmup.novFullPrep} onChange={(e) => onNOV(!!e.target.checked)} /> Enable
                    </label>
                </div>
                {!!state.warmup.novFullPrep && <NOVPresetPanel />}
            </div>

            {/* Jumps */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Jumps</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 items-start">
                    <div>
                        <select
                            value={state.warmup.jump || ''}
                            onChange={(e) => onJump(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100 mb-2"
                        >
                            <option value="">— Select a jump —</option>
                            {jumps.map((j, i) => (
                                <option key={`${j.Name}-${i}`} value={j.Name}>{j.Name}</option>
                            ))}
                        </select>
                        <div className="text-xs text-gray-400">Thread sets between bar warmups; keep reps explosive.</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-300 text-sm mb-1">Jumps (reps)</label>
                            <input
                                type="number"
                                min={0}
                                max={200}
                                value={typeof state.warmup.jumpsPerDay === 'number' ? state.warmup.jumpsPerDay : 20}
                                onChange={(e) => onSplit({ jumpsPerDay: Number(e.target.value) })}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1">Throws (reps)</label>
                            <input
                                type="number"
                                min={0}
                                max={200}
                                value={typeof state.warmup.throwsPerDay === 'number' ? state.warmup.throwsPerDay : 10}
                                onChange={(e) => onSplit({ throwsPerDay: Number(e.target.value) })}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Throws (optional) */}
            <div className="bg-[#0b1220] border border-gray-800 rounded p-4">
                <SectionTitle>Throws (optional)</SectionTitle>
                <select
                    value={state.warmup.throw || ''}
                    onChange={(e) => onThrow(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100 mb-2"
                >
                    <option value="">— Select a throw —</option>
                    {throws.map((t, i) => (
                        <option key={`${t.Name}-${i}`} value={t.Name}>{t.Name}</option>
                    ))}
                </select>
                <div className="text-xs text-gray-400">Thread sets between bar warmups; keep reps explosive.</div>
            </div>
        </div>
    );
}
