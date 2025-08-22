import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatWeight, normalizeUnits } from "@/lib/units";

export default function Program531ActiveV2() {
    const [data, setData] = useState(null);
    const [weekIdx, setWeekIdx] = useState(0);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("ph531.activeProgram.v2");
            if (raw) setData(JSON.parse(raw));
        } catch (e) {
            console.error("Failed to load active program:", e);
        }
    }, []);

    const weeks = data?.weeks || [];
    const week = useMemo(() => weeks[weekIdx] || null, [weeks, weekIdx]);
    const totalWeeks = weeks.length || 0;
    const headerRef = useRef(null);
    const [statusMsg, setStatusMsg] = useState("");

    useEffect(() => {
        // Announce week change and move focus to header
        if (weeks.length > 0) {
            setStatusMsg(`Showing week ${weekIdx + 1}`);
            if (headerRef.current && typeof headerRef.current.focus === 'function') {
                headerRef.current.focus();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekIdx, weeks.length]);

    const jumpToDay = (dayNum) => {
        const anchorId = `day-${week?.week || weekIdx + 1}-${dayNum}`;
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (!data) {
        return (
            <div className="max-w-5xl mx-auto p-6 text-gray-200">
                <h1 className="text-2xl font-semibold mb-2">No Active 5/3/1 Program</h1>
                <p className="text-gray-400 mb-6">
                    You haven’t started a cycle yet. Build one in the 5/3/1 builder.
                </p>
                <Link to="/builder/531/v2" className="inline-block px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white">
                    Go to 5/3/1 Builder
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 text-gray-200">
            <header className="mb-6">
                <h1 ref={headerRef} tabIndex={-1} className="text-2xl font-semibold">Active 5/3/1 Program</h1>
                <p className="text-sm text-gray-400">
                    Units: <span className="font-mono">{normalizeUnits(data?.meta?.units || 'lbs')}</span> • Loading Option: {" "}
                    <span className="font-mono">{data?.meta?.loadingOption || 1}</span> • Started: {" "}
                    <span className="font-mono">{new Date(data?.meta?.createdAt).toLocaleString()}</span>
                </p>
                <div aria-live="polite" className="sr-only">{statusMsg}</div>
                {week && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                            Week {week.week} of {totalWeeks || 4}
                        </span>
                        {week.isDeload && (
                            <span className="px-2 py-0.5 rounded bg-yellow-900/40 border border-yellow-700 text-yellow-300">
                                Deload
                            </span>
                        )}
                        <span className="text-gray-500">•</span>
                        <span>{week.days?.length || 0} planned days</span>
                    </div>
                )}
            </header>

            <div className="flex flex-wrap gap-2 mb-3">
                {weeks.map((w, i) => (
                    <button
                        key={w.week}
                        onClick={() => setWeekIdx(i)}
                        aria-current={i === weekIdx ? 'page' : undefined}
                        className={`px-3 py-1 rounded-md border ${i === weekIdx ? "bg-gray-700 border-gray-500" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
                    >
                        Week {w.week}{w.week === 4 ? " (Deload)" : ""}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 mb-5">
                <button
                    className="px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs"
                    onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}
                    disabled={weekIdx === 0}
                >
                    ◀ Prev week
                </button>
                <button
                    className="px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs"
                    onClick={() => setWeekIdx((i) => Math.min((weeks.length || 1) - 1, i + 1))}
                    disabled={weekIdx >= (weeks.length || 1) - 1}
                >
                    Next week ▶
                </button>
                {!!week?.days?.length && (
                    <div className="ml-2 flex items-center gap-1 text-xs text-gray-300">
                        <span className="text-gray-400">Jump to day:</span>
                        {week.days.map((d) => (
                            <button
                                key={`jump-${d.day}`}
                                className="px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 font-mono"
                                onClick={() => { jumpToDay(d.day); setStatusMsg(`Jumped to day ${d.day}`); }}
                            >
                                {d.day}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {!week ? (
                <div className="text-gray-400">No week selected.</div>
            ) : (
                <div className="space-y-4">
                    {week.days.map(d => (
                        <div key={d.day} id={`day-${week.week}-${d.day}`} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold mb-2">Day {d.day} — {d.lift}</h3>

                            {d.repStyle && (
                                <div className="mb-2 text-xs text-gray-300 flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-gray-700/50 border border-gray-600/60">Rep style</span>
                                    <span className="font-mono text-gray-200">{d.repStyle === 'touch_and_go' ? 'Touch-and-go' : 'Dead-stop'}</span>
                                </div>
                            )}

                            {Array.isArray(d.warmups) && d.warmups.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Warm-up</h4>
                                    <ul className="text-sm text-gray-300 space-y-0.5">
                                        {d.warmups.map((s, i) => (
                                            <li key={i} className="font-mono">
                                                {formatWeight(s.weight, s.units)} × {s.reps} ({s.percent}%)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {d.main?.sets?.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Main Sets</h4>
                                    <ul className="text-sm text-gray-300 space-y-0.5">
                                        {d.main.sets.map((s, i) => (
                                            <li key={i} className="font-mono">
                                                {formatWeight(s.weight, s.units)} × {s.reps} ({s.percent}%)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {d.supplemental?.type === "bbb" && (
                                <div className="mb-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Supplemental (BBB)</h4>
                                    <div className="text-sm text-gray-300 font-mono">
                                        {formatWeight(d.supplemental.weight, d.supplemental.units)} × {d.supplemental.reps} for {d.supplemental.sets} sets
                                        {" "}(pairing: {d.supplemental.pairing}, lift: {d.supplemental.liftKey})
                                    </div>
                                </div>
                            )}

                            {d.assistance?.mode && (
                                <div>
                                    <h4 className="text-sm text-gray-300 mb-1">Assistance</h4>
                                    {d.assistance.mode !== "custom" ? (
                                        <div className="text-sm text-gray-300">Mode: {d.assistance.mode}</div>
                                    ) : (
                                        <ul className="text-sm text-gray-300 space-y-0.5">
                                            {(d.assistance.custom || []).map((a, i) => (
                                                <li key={i} className="font-mono">{a.name}: {a.sets}×{a.reps}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            {d.conditioning && (
                                <div className="mt-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Conditioning</h4>
                                    <div className="text-xs text-gray-400 flex flex-wrap gap-2 items-center">
                                        <span className="px-1.5 py-0.5 rounded bg-gray-700/40 border border-gray-600/60 text-gray-200">
                                            {d.conditioning.type || (d.conditioning.mode === 'hiit' ? 'HIIT' : d.conditioning.mode === 'liss' ? 'LISS' : 'Cond')}
                                        </span>
                                        {d.conditioning.modality && <span className="text-gray-300">{String(d.conditioning.modality).replace(/_/g, ' ')}</span>}
                                        {d.conditioning.minutes && <span className="text-gray-400">{d.conditioning.minutes} min</span>}
                                        {d.conditioning.intensity && <span className="text-gray-400">@ {d.conditioning.intensity}</span>}
                                    </div>
                                    {d.conditioning.notes && <div className="text-[11px] text-gray-500 mt-1 italic">{d.conditioning.notes}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 flex items-center gap-3">
                <Link to="/builder/531/v2" className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600">
                    Edit / Rebuild
                </Link>
                <button
                    className="px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-red-300"
                    onClick={() => { localStorage.removeItem("ph531.activeProgram.v2"); setData(null); setStatusMsg("Active program cleared"); }}
                >
                    Clear Active Program
                </button>
            </div>
        </div>
    );
}
