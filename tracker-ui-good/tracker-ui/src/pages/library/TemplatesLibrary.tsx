import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadCsv } from "@/lib/loadCsv";
import type { TemplateCsv } from "@/types/templates";
import { useTagCatalog } from "@/ui/tags/useTagCatalog";
import { getTagStyle } from "@/ui/tags/colors";
import { withDerived } from "@/lib/templates/display";

type Row = Record<string, string>;

export default function TemplatesLibrary() {
    const [rows, setRows] = useState<Row[]>([]);
    const [query, setQuery] = useState("");
    const [tagFilters, setTagFilters] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const { getTagMeta, listAllTags } = useTagCatalog();

    useEffect(() => {
        setLoading(true);
        const MASTER_URL = `${import.meta.env.BASE_URL}methodology/extraction/templates_master.csv`;
        const ADDITIONS_URL = `${import.meta.env.BASE_URL}methodology/extraction/templates_additions.csv`;
        (async () => {
            try {
                const master = await loadCsv<Row>(MASTER_URL).catch(() => [] as Row[]);
                const additions = await loadCsv<TemplateCsv>(ADDITIONS_URL).catch(() => [] as TemplateCsv[]);

                // Filter empty master rows
                const cleanMaster = (master as Row[]).filter(
                    (r) => r && r["Template Name"] && r["Template Name"].trim().length > 0
                );

                // Merge additions: map to master-like display with extra columns
                const mappedAdds: Row[] = (additions || []).map((r) => ({
                    "Template Name": (r.display_name || "").trim(),
                    "Book": (r.source_book || "").trim(),
                    "Page": (r.source_pages || "").trim(),
                    "Main Work": (r.core_scheme || "").trim(),
                    "Supplemental": (r.supplemental || "").trim(),
                    "Assistance": (r.assistance_guideline || "").trim(),
                    "Conditioning": (r.conditioning_guideline || "").trim(),
                    "Leader/Anchor": (r.leader_anchor || "").trim(),
                    "Notes": (r.notes || "").trim(),
                    category: (r as any).category || "",
                    __id: (r.id || "").trim(),
                    __source_book: (r.source_book || "").trim(),
                    __source_pages: (r.source_pages || "").trim(),
                    __tags: String((r as any).tags || "").trim(),
                }));

                // De-dupe by kebab id when available, otherwise by normalized name
                const idFrom = (row: Row) => {
                    if ((row as any).__id) return String((row as any).__id);
                    const name = String(row["Template Name"] || "").toLowerCase().trim();
                    return name
                        .replace(/^(jack sh\*t|jack shit)$/, 'jackshit')
                        .replace(/[^a-z0-9]+/g, '-');
                };
                const byId = new Map<string, Row>();
                cleanMaster.forEach((r) => {
                    const id = idFrom(r);
                    if (id) byId.set(id, r);
                });
                mappedAdds.forEach((r) => {
                    const id = idFrom(r);
                    if (!id) return;
                    byId.set(id, r); // prefer additions
                });
                const merged = Array.from(byId.values()).sort((a, b) => {
                    const ca = String((a as any).category || '').toLowerCase();
                    const cb = String((b as any).category || '').toLowerCase();
                    if (ca !== cb) return ca < cb ? -1 : 1;
                    const ta = String((a["Template Name"] || (a as any).display_name || "")).toLowerCase();
                    const tb = String((b["Template Name"] || (b as any).display_name || "")).toLowerCase();
                    return ta < tb ? -1 : ta > tb ? 1 : 0;
                });

                // attach derived display fields
                const withDisplay = merged.map((r) => withDerived(r as any));
                setRows(withDisplay as any);
                setErr(null);
            } catch (e: any) {
                setErr(e?.message || "Failed to load CSV");
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
                            CSV-driven list from <code>templates_master.csv</code>. Use search to filter.
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
                                            const style = getTagStyle(tag.group);
                                            const active = tagFilters.includes(String(tag.key).toLowerCase());
                                            return (
                                                <button
                                                    key={tag.key}
                                                    onClick={() => toggleTag(tag.key)}
                                                    className={`px-2 py-1 rounded border text-xs ${style.pill} ${style.text} ${style.border} ${active ? 'ring-2 ring-offset-0 ring-indigo-500' : ''}`}
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
                                        <td className="px-3 py-2 border-b border-gray-900">{(r as any).__display?.notes || r["Notes"]}</td>
                                        <td className="px-3 py-2 border-b border-gray-900">
                                            <div className="flex flex-wrap gap-1">
                                                {String((r as any).__display?.tags || (r as any).__tags || "")
                                                    .split("|")
                                                    .map((t) => t.trim())
                                                    .filter(Boolean)
                                                    .map((key) => {
                                                        const meta = getTagMeta(key);
                                                        const style = getTagStyle(meta.group);
                                                        return (
                                                            <span key={key} className={`px-1.5 py-0.5 rounded border text-[10px] ${style.pill} ${style.text} ${style.border}`} title={meta?.description || key}>
                                                                {meta?.label || key}
                                                            </span>
                                                        );
                                                    })}
                                            </div>
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
