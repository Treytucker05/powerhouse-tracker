import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
                <h1 className="text-2xl font-semibold">Active 5/3/1 Program</h1>
                <p className="text-sm text-gray-400">
                    Units: <span className="font-mono">{data?.meta?.units || "lbs"}</span> • Loading Option: {" "}
                    <span className="font-mono">{data?.meta?.loadingOption || 1}</span> • Started: {" "}
                    <span className="font-mono">{new Date(data?.meta?.createdAt).toLocaleString()}</span>
                </p>
            </header>

            <div className="flex space-x-2 mb-4">
                {weeks.map((w, i) => (
                    <button
                        key={w.week}
                        onClick={() => setWeekIdx(i)}
                        className={`px-3 py-1 rounded-md border ${i === weekIdx ? "bg-gray-700 border-gray-500" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
                    >
                        Week {w.week}{w.week === 4 ? " (Deload)" : ""}
                    </button>
                ))}
            </div>

            {!week ? (
                <div className="text-gray-400">No week selected.</div>
            ) : (
                <div className="space-y-4">
                    {week.days.map(d => (
                        <div key={d.day} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold mb-2">Day {d.day} — {d.lift}</h3>

                            {Array.isArray(d.warmups) && d.warmups.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Warm-up</h4>
                                    <ul className="text-sm text-gray-300 space-y-0.5">
                                        {d.warmups.map((s, i) => (
                                            <li key={i} className="font-mono">
                                                {s.weight}{s.units} × {s.reps} ({s.percent}%)
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
                                                {s.weight}{s.units} × {s.reps} ({s.percent}%)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {d.supplemental?.type === "bbb" && (
                                <div className="mb-3">
                                    <h4 className="text-sm text-gray-300 mb-1">Supplemental (BBB)</h4>
                                    <div className="text-sm text-gray-300 font-mono">
                                        {d.supplemental.weight}{d.supplemental.units} × {d.supplemental.reps} for {d.supplemental.sets} sets
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
                    onClick={() => { localStorage.removeItem("ph531.activeProgram.v2"); setData(null); }}
                >
                    Clear Active Program
                </button>
            </div>
        </div>
    );
}
