import React, { useEffect, useMemo, useState } from "react";
import { LibraryButtons } from "@/components/program/steps/LibraryButtons";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { loadJumpsThrowsRows } from "@/lib/data/loadConditioningAndJumps";
import type { JumpsThrowsRow } from "@/types/step3";

export default function JumpsThrowsLibrary() {
  const [rows, setRows] = useState<JumpsThrowsRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    loadJumpsThrowsRows()
      .then((data) => { setRows(data.filter(r => (r.display_name||"").trim())); setErr(null); })
      .catch((e) => setErr(e?.message || "Failed to load CSV"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = rows.map(r => ({
      name: r.display_name || "",
      mode: r.conditioning_mode || "",
      population: r.population || "",
      equipment: r.equipment || "",
      book: r.book || "",
      pages: r.pages || "",
      notes: r.notes || "",
      tags: r.tags || ""
    }));
    const searched = !q ? base : base.filter(r => Object.values(r).join(" ").toLowerCase().includes(q));
    return [...searched].sort((a,b) => a.name.localeCompare(b.name));
  }, [rows, query]);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="my-4"><BuilderProgress current={3} /></div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Jumps & Throws Library</h1>
            <p className="text-gray-400 text-sm">CSV-driven list from <code>jumps_throws.csv</code>. Use search to filter.</p>
          </div>
        </div>
        <div className="my-4"><LibraryButtons /></div>
        <div className="mb-4">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search…"
            className="w-full md:w-96 bg-[#0f1020] text-white placeholder-gray-400 border border-gray-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-600"/>
        </div>
        {loading && <div className="text-gray-300 text-sm">Loading jumps/throws…</div>}
        {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
        {!loading && !err && (
          <div className="overflow-x-auto rounded border border-gray-800">
            <table className="min-w-full text-sm">
              <thead className="bg-[#121331]">
                <tr className="text-left">
                  <th className="px-3 py-2 border-b border-gray-800">Name</th>
                  <th className="px-3 py-2 border-b border-gray-800">Mode</th>
                  <th className="px-3 py-2 border-b border-gray-800">Population</th>
                  <th className="px-3 py-2 border-b border-gray-800">Equipment</th>
                  <th className="px-3 py-2 border-b border-gray-800">Pages</th>
                  <th className="px-3 py-2 border-b border-gray-800">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.name}-${i}`} className="odd:bg-[#10112a] even:bg-[#0e0f25]">
                    <td className="px-3 py-2 border-b border-gray-900 font-medium">{r.name}</td>
                    <td className="px-3 py-2 border-b border-gray-900">{r.mode}</td>
                    <td className="px-3 py-2 border-b border-gray-900">{r.population}</td>
                    <td className="px-3 py-2 border-b border-gray-900">{r.equipment}</td>
                    <td className="px-3 py-2 border-b border-gray-900">{r.book ? `${r.book} — `: ''}{r.pages}</td>
                    <td className="px-3 py-2 border-b border-gray-900">{r.tags}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !err && (<div className="mt-3 text-gray-400 text-xs">Showing {filtered.length} items</div>)}
      </div>
    </div>
  );
}
