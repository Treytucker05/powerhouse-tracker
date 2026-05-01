import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadWarmupsLibrary } from "@/lib/data/loadLibraries";

type Row = Record<string, string>;
const CANONICAL_FILE = "warmups.csv";

export default function WarmupsLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [loadedFile] = useState<string | null>(CANONICAL_FILE);
    const [source, setSource] = useState<"json" | "csv">("csv");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        (async () => {
            try {
                const { rows, source } = await loadWarmupsLibrary<Row>();
                if (cancelled) return;
                const clean = (rows as Row[]).filter((r) => {
                    const proto = r["Protocol"] || r["protocol"] || r["Warmup"] || r["Name"] || "";
                    return proto.trim().length > 0;
                });
                setRows(clean);
                setSource(source);
                setErr(null);
            } catch (e: any) {
                setErr(e?.message || "Failed to load data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    type Norm = { Protocol: string; Description: string; Loading: string };

    const normalized = useMemo<Norm[]>(() => {
        return rows.map((r) => ({
            Protocol: r["Protocol"] || r["protocol"] || r["Warmup"] || r["Name"] || "",
            Description: r["Description"] || r["description"] || r["Notes"] || r["details"] || "",
            Loading:
                r["Percentages/Loading"] ||
                r["Percentages"] ||
                r["Loading"] ||
                r["Scheme"] ||
                r["Sets/Reps"] ||
                "",
        }));
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = normalized;
        const searched = !q
            ? base
            : base.filter((r) => [r.Protocol, r.Description, r.Loading].join(" ").toLowerCase().includes(q));
        return [...searched].sort((a, b) => a.Protocol.localeCompare(b.Protocol));
    }, [normalized, query]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Warm-ups relates to Customize step) */}
                <div className="my-4">
                    <BuilderProgress current={3} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Warm-ups Library</h1>
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
                        placeholder="Search: protocol, description, loading…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                {loading && <div className="text-gray-300 text-sm">Loading warm-ups…</div>}
                {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No warm-ups match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Protocol</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Description</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Percentages/Loading</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r.Protocol}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.Protocol}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Description}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{r.Loading}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">Showing {filtered.length} of {normalized.length} warm-ups</div>
                )}
            </div>
        </div>
    );
}
