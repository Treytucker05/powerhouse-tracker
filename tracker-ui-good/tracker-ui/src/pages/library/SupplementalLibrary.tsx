import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadCsv } from "@/lib/loadCsv";

type Row = Record<string, string>;

export default function SupplementalLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/supplemental.csv`)
            .then((data) => {
                const clean = (data as Row[]).filter(
                    (r) => r && ((r["Scheme"] || r["scheme"]) ?? "").toString().trim().length > 0
                );
                setRows(clean);
                setErr(null);
            })
            .catch((e) => setErr(e?.message || "Failed to load CSV"))
            .finally(() => setLoading(false));
    }, []);

    type Norm = { Scheme: string; SetsReps: string; Percent: string; Notes: string };

    const normalized = useMemo<Norm[]>(() => {
        return rows.map((r) => ({
            Scheme: r["Scheme"] || r["scheme"] || "",
            SetsReps: r["Sets/Reps"] || r["sets/reps"] || r["Sets"] || r["Reps"] || "",
            Percent: r["Percent"] || r["%"] || r["Intensity"] || "",
            Notes: r["Notes"] || r["notes"] || "",
        }));
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = normalized;
        const searched = !q
            ? base
            : base.filter((r) =>
                [r.Scheme, r.SetsReps, r.Percent, r.Notes]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            );
        // Sort by scheme asc, then sets/reps
        return [...searched].sort((a, b) => {
            const s = a.Scheme.localeCompare(b.Scheme);
            return s !== 0 ? s : a.SetsReps.localeCompare(b.SetsReps);
        });
    }, [normalized, query]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Supplemental relates to Customize step) */}
                <div className="my-4">
                    <BuilderProgress current={3} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Supplemental Work Library</h1>
                        <p className="text-gray-400 text-sm">
                            CSV-driven list from <code>supplemental.csv</code>. Use search to filter.
                        </p>
                    </div>
                </div>

                {/* Library quick-nav row with spacing */}
                <div className="my-4">
                    <LibraryButtons />
                </div>

                <div className="mb-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search: scheme, sets/reps, %, notes…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                {loading && <div className="text-gray-300 text-sm">Loading supplemental…</div>}
                {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No supplemental schemes match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Scheme</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Sets/Reps</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Percent</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r.Scheme}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.Scheme}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.SetsReps}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Percent}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">
                        Showing {filtered.length} of {rows.length} schemes
                    </div>
                )}
            </div>
        </div>
    );
}
