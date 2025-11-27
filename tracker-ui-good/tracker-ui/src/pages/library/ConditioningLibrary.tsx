import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadConditioningLibrary } from "@/lib/data/loadLibraries";
import type { ConditioningRow } from "@/types/step3";

type Row = ConditioningRow;

export default function ConditioningLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<"json" | "csv">("csv");
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        loadConditioningLibrary<Row>()
            .then(({ rows, source }) => { setRows((rows as Row[]).filter(r => (r.display_name || "").trim())); setSource(source); setErr(null); })
            .catch((e) => setErr(e?.message || "Failed to load data"))
            .finally(() => setLoading(false));
    }, []);

    const normalized = useMemo(() => {
        return rows.map((r) => ({
            name: r.display_name || "",
            mode: r.conditioning_mode || "",
            population: r.population || "",
            seasonality: r.seasonality || "",
            tags: r.tags || "",
            book: r.book || "",
            pages: r.pages || "",
            notes: r.notes || "",
            rules: r.rules_markdown || "",
        }));
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = normalized;
        const searched = !q
            ? base
            : base.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q));
        return [...searched].sort((a, b) => a.name.localeCompare(b.name));
    }, [normalized, query]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Conditioning relates to Customize step) */}
                <div className="my-4">
                    <BuilderProgress current={3} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Conditioning Library</h1>
                        <p className="text-gray-400 text-sm">Data source: <span className="font-mono uppercase">{source}</span></p>
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
                        placeholder="Search: activity, intensity, notes…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                {loading && <div className="text-gray-300 text-sm">Loading conditioning…</div>}
                {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No conditioning activities match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Name</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Mode</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Population</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Season</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Tags</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Pages</th>
                                    <th className="px-3 py-2 border-b border-gray-800">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r.name}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.name}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.mode}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.population}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.seasonality}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.tags}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.book ? `${r.book} — ` : ''}{r.pages}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">
                                            {(r.notes || r.rules) ? (
                                                <details>
                                                    <summary className="cursor-pointer select-none text-blue-300">View</summary>
                                                    <div className="mt-2 text-gray-300">
                                                        {r.rules && <div className="prose prose-invert text-xs mb-2 whitespace-pre-wrap">{r.rules}</div>}
                                                        {r.notes && <div className="text-xs whitespace-pre-wrap">{r.notes}</div>}
                                                    </div>
                                                </details>
                                            ) : <span className="text-gray-500">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">Showing {filtered.length} of {rows.length} activities</div>
                )}
            </div>
        </div>
    );
}
