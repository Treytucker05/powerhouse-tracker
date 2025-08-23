import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadCsv } from "@/lib/loadCsv";

type Row = Record<string, string>;

export default function SpecialRulesLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/special_rules.csv`)
            .then((data) => {
                const clean = (data as Row[]).filter((r) => (r["Rule"] || r["rule"] || "").trim().length > 0);
                setRows(clean);
                setErr(null);
            })
            .catch((e) => setErr(e?.message || "Failed to load CSV"))
            .finally(() => setLoading(false));
    }, []);

    type Norm = { Rule: string; Description: string; Notes: string };

    const normalized = useMemo<Norm[]>(() => {
        return rows.map((r) => ({
            Rule: r["Rule"] || r["rule"] || r["Name"] || "",
            Description: r["Description"] || r["description"] || r["Details"] || r["details"] || r["Notes"] || "",
            Notes: r["Notes"] || r["notes"] || "",
        }));
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = normalized;
        const searched = !q
            ? base
            : base.filter((r) => [r.Rule, r.Description, r.Notes].join(" ").toLowerCase().includes(q));
        return [...searched].sort((a, b) => a.Rule.localeCompare(b.Rule));
    }, [normalized, query]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Special Rules relates to Customize step) */}
                <div className="my-4">
                    <BuilderProgress current={3} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Special Rules Library</h1>
                        <p className="text-gray-400 text-sm">
                            CSV-driven list from <code>special_rules.csv</code>. Use search to filter.
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
                        placeholder="Search: rule, description, notes…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                {loading && <div className="text-gray-300 text-sm">Loading special rules…</div>}
                {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No special rules match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Rule</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Description</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r.Rule}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.Rule}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Description}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">Showing {filtered.length} of {rows.length} rules</div>
                )}
            </div>
        </div>
    );
}
