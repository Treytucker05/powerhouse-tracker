import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadCsv } from "@/lib/loadCsv";

type Row = Record<string, string>;

export default function AssistanceLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/assistance_exercises.csv`)
            .then((data) => {
                const clean = (data as Row[]).filter(
                    (r) => r && (r["Exercise"] || "").trim().length > 0
                );
                setRows(clean);
                setErr(null);
            })
            .catch((e) => setErr(e?.message || "Failed to load CSV"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = rows.map((r) => ({
            Category: r["Category"] || r["category"] || "",
            Exercise: r["Exercise"] || r["exercise"] || "",
            Equipment: r["Equipment"] || r["equipment"] || "",
            Notes: r["Notes"] || r["notes"] || "",
        }));
        const searched = !q
            ? base
            : base.filter((r) =>
                [r.Category, r.Exercise, r.Equipment, r.Notes]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            );
        // Simple stable sort: Category asc, then Exercise asc
        return [...searched].sort((a, b) => {
            const cat = a.Category.localeCompare(b.Category);
            return cat !== 0 ? cat : a.Exercise.localeCompare(b.Exercise);
        });
    }, [rows, query]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Assistance relates to Customize step) */}
                <div className="my-4">
                    <BuilderProgress current={3} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Assistance Library</h1>
                        <p className="text-gray-400 text-sm">
                            CSV-driven list from <code>assistance_exercises.csv</code>. Use search to filter.
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
                        placeholder="Search: category, exercise, equipment, notes…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                {loading && (
                    <div className="text-gray-300 text-sm">Loading assistance…</div>
                )}
                {err && (
                    <div className="text-red-400 text-sm mb-3">Error: {err}</div>
                )}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No assistance exercises match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Category</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Exercise</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Equipment</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r.Exercise}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.Category}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Exercise}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Equipment}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">
                        Showing {filtered.length} of {rows.length} exercises
                    </div>
                )}
            </div>
        </div>
    );
}
