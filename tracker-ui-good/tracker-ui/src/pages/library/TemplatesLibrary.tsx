import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadTemplatesLibrary } from "@/lib/data/loadLibraries";

type Row = Record<string, string>;

export default function TemplatesLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [source, setSource] = useState<"json" | "csv">("csv");
    const [query, setQuery] = useState("");
    const [tagFilters, setTagFilters] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const { getTagMeta, listAllTags } = useTagCatalog();

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const { rows, source } = await loadTemplatesLibrary<Row>();
                const sorted = [...rows].sort((a, b) => {
                    const ca = String((a as any).category || '').toLowerCase();
                    const cb = String((b as any).category || '').toLowerCase();
                    if (ca !== cb) return ca < cb ? -1 : 1;
                    const ta = String((a["Template Name"] || (a as any).display_name || "")).toLowerCase();
                    const tb = String((b["Template Name"] || (b as any).display_name || "")).toLowerCase();
                    return ta < tb ? -1 : ta > tb ? 1 : 0;
                });
                setRows(sorted);
                setSource(source);
                setErr(null);
            } catch (e: any) {
                setErr(e?.message || "Failed to load library data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const applyText = (list: Row[]) => list.filter((r) => {
            const disp = (r as any).__display || {};
            const hay = [
                r["Template Name"],
                r["Book"],
                disp.mainWork || r["Main Work"],
                disp.supplemental || r["Supplemental"],
                disp.assistance || r["Assistance"],
                disp.conditioning || r["Conditioning"],
                disp.leaderAnchor || r["Leader/Anchor"],
                disp.notes || r["Notes"],
                disp.tags || (r as any).__tags,
                // Include tag labels for free-text search
                ...String(disp.tags || (r as any).__tags || "")
                    .split("|")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((key) => getTagMeta(key)?.label || ""),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return q ? hay.includes(q) : true;
        });
        const withText = applyText(rows);
        if (!tagFilters.length) return withText;
        return withText.filter((r) => {
            const disp = (r as any).__display || {};
            const tags = String(disp.tags || (r as any).__tags || "")
                .split("|")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);
            // AND logic: every selected tag must be present (normalized)
            return tagFilters.every((t) => tags.includes(t));
        });
    }, [rows, query, tagFilters]);

    const allTags = useMemo(() => listAllTags(), [listAllTags]);
    const GROUP_ORDER = ["Template", "Scheme", "Supplemental", "Assistance", "Season", "Population", "Conditioning", "Meta"] as const;
    const grouped = useMemo(() => {
        const map = new Map<string, { label: string; items: ReturnType<typeof listAllTags> }>();
        for (const g of GROUP_ORDER) map.set(g, { label: g, items: [] as any });
        for (const t of allTags) {
            const g = GROUP_ORDER.includes(t.group as any) ? t.group : "Meta";
            map.get(g)!.items.push(t);
        }
        return GROUP_ORDER.map(g => map.get(g)!).filter(Boolean);
    }, [allTags]);
    function toggleTag(key: string) {
        const k = String(key).trim().toLowerCase();
        setTagFilters(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    }

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Step progress bar (Templates aligns to Step 2) with spacing above/below */}
                <div className="my-4">
                    <BuilderProgress current={2} />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Templates Library</h1>
                        <p className="text-gray-400 text-sm">
                            Data source: <span className="font-mono uppercase">{source}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/build/step2"
                            className="px-3 py-2 rounded bg-[#ef4444] text-white text-sm hover:opacity-90"
                        >
                            ← Back to Step 2
                        </Link>
                    </div>
                </div>

                {/* Library quick-nav row with spacing above/below */}
                <div className="my-4">
                    <LibraryButtons />
                </div>

                <div className="mb-4 space-y-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search: template, book, main work, supplemental…"
                        className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"
                    />
                    {/* Tags facet */}
                    <div className="bg-[#0f1020] border border-gray-700 rounded p-3">
                        <div className="text-xs text-gray-400 mb-2">Tags</div>
                        <div className="space-y-2">
                            {grouped.map(group => (
                                <div key={group.label}>
                                    <div className="text-[11px] text-gray-400 mb-1">{group.label}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map(tag => {
                                            const active = tagFilters.includes(String(tag.key).toLowerCase());
                                            return (
                                                <button
                                                    key={tag.key}
                                                    onClick={() => toggleTag(tag.key)}
                                                    className={`px-2 py-1 rounded border text-xs bg-white/5 border-white/10 ${active ? 'ring-2 ring-offset-0 ring-indigo-500' : ''}`}
                                                    title={tag.description || tag.label}
                                                >
                                                    {tag.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {tagFilters.length > 0 && (
                            <div className="mt-2 text-[11px] text-gray-400">Filtering by: {tagFilters.map(t => getTagMeta(t)?.label || t).join(', ')}</div>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="text-gray-300 text-sm">Loading templates…</div>
                )}
                {err && (
                    <div className="text-red-400 text-sm mb-3">Error: {err}</div>
                )}
                {!loading && !err && filtered.length === 0 && (
                    <div className="text-gray-300 text-sm">No templates match your search.</div>
                )}

                {!loading && !err && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded border border-gray-800">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#121331]">
                                <tr className="text-left">
                                    <th className="px-3 py-2 border-b border-gray-800">Template Name</th>
                                    <th className="px-3 py-2 border-b border-gray-800 hidden md:table-cell">Source</th>
                                    <th className="px-3 py-2 border-b border-gray-800 text-right hidden md:table-cell">Pages</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Main Work</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Supplemental</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Assistance</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Conditioning</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Leader/Anchor</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Notes</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Info</th>
                                    <th className="px-3 py-2 border-b border-gray-800">Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr key={`${r["Template Name"]}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                                        <td className="px-3 py-2 border-b border-gray-900 font-medium">{r["Template Name"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900 hidden md:table-cell">{(r as any).__source_book || r["Book"] || ""}</td>
                                        <td className="px-3 py-2 border-b border-gray-900 text-right hidden md:table-cell">{(r as any).__source_pages || r["Page"] || ""}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.mainWork || r["Main Work"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.supplemental || r["Supplemental"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.assistance || r["Assistance"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.conditioning || r["Conditioning"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.leaderAnchor || r["Leader/Anchor"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.notes || (r as any).ui_notes || r["Notes"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">
                                            <TagChips chips={((r as any).__display?.infoChips || []) as any} />
                                        </td>
                                        <td className="px-3 py-2 border-b border-gray-900">
                                            <TagChips chips={((r as any).__display?.tagChips || []) as any} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !err && (
                    <div className="mt-3 text-gray-400 text-xs">
                        Showing {filtered.length} of {rows.length} templates
                    </div>
                )}
            </div>
        </div>
    );
}
