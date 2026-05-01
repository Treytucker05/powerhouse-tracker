import { useEffect, useMemo, useState } from "react";
import { loadCsv } from "@/lib/loadCsv";
import DataStatusBanner from "@/components/ui/DataStatusBanner";
import { getDataHealth } from "@/lib/data/ensureData";

type SupRow = {
    Template: string;
    Phase: string;
    MainPattern?: string;
    SupplementalScheme?: string;
    SupplementalSetsReps?: string;
    SupplementalPercentSchedule?: string;
    AssistancePerCategoryMin?: string;
    AssistancePerCategoryMax?: string;
    HardConditioningMax?: string;
    EasyConditioningMin?: string;
    JumpsThrowsDefault?: string;
    CycleMin?: string;
    CycleMax?: string;
    CompatibleAnchors?: string;
    TMRecommendation?: string;
    Notes?: string;
};

type Canon = { template: string; phase: string; };

function csvSkeleton(t: Canon) {
    // Handy "copy & paste" line for supplemental.csv
    return [
        t.template,
        t.phase,
        "",              // MainPattern
        "",              // SupplementalScheme
        "",              // SupplementalSetsReps
        "",              // SupplementalPercentSchedule
        "25", "50",       // AssistancePerCategory Min/Max (placeholder)
        "2", "3",         // HardCondMax, EasyCondMin (placeholder)
        "10",            // JumpsThrowsDefault
        "1", "2",         // CycleMin/Max
        "",              // CompatibleAnchors
        "85",            // TMRecommendation
        ""               // Notes
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
}

export default function DataCoveragePage() {
    const [sup, setSup] = useState<SupRow[]>([]);
    const [canon, setCanon] = useState<Canon[]>([]);
    const [q, setQ] = useState("");
    const [health, setHealth] = useState<{ seventhWeek: boolean; tmRules: boolean; jokerRules: boolean } | null>(null);

    useEffect(() => {
        let mounted = true;
        loadCsv<SupRow>(`${import.meta.env.BASE_URL}methodology/extraction/supplemental.csv`)
            .then(rows => { if (mounted) setSup(rows); })
            .catch(() => { if (mounted) setSup([]); });

        // Fetch canonical list from public/docs
        fetch(`${import.meta.env.BASE_URL}docs/templates_index.jsonc`)
            .then(r => r.text())
            .then(txt => {
                const json = JSON.parse(txt.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//gm, ""));
                if (mounted) setCanon(json);
            })
            .catch(() => { if (mounted) setCanon([]); });

        getDataHealth().then(h => { if (mounted) setHealth(h); }).catch(() => { });
        return () => { mounted = false; }
    }, []);

    const coverage = useMemo(() => {
        const key = (t: string, p: string) => `${t}__${p}`.toLowerCase();
        const have = new Set(sup.map(r => key(r.Template || "", r.Phase || "")));
        const items = canon.map(c => {
            const present = have.has(key(c.template, c.phase));
            let partial = false;
            if (present) {
                const row = sup.find(r => (r.Template || "").toLowerCase() === c.template.toLowerCase() && (r.Phase || "").toLowerCase() === c.phase.toLowerCase());
                if (row) {
                    const req = ["MainPattern", "SupplementalScheme", "SupplementalSetsReps", "SupplementalPercentSchedule", "AssistancePerCategoryMin", "AssistancePerCategoryMax", "HardConditioningMax", "EasyConditioningMin", "JumpsThrowsDefault", "CycleMin", "CycleMax", "TMRecommendation"];
                    partial = req.some(k => !(row as any)[k] || String((row as any)[k]).trim() === "");
                }
            }
            return { ...c, status: present ? (partial ? "Partial" : "Complete") : "Missing" };
        });
        return items.filter(i => (q ? (i.template.toLowerCase().includes(q.toLowerCase()) || i.phase.toLowerCase().includes(q.toLowerCase())) : true));
    }, [canon, sup, q]);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-6">
            <h1 className="text-2xl font-bold text-[#ef4444]">Data Coverage — Templates</h1>
            <p className="text-gray-300 text-sm mb-3">Checks <code>supplemental.csv</code> against <code>docs/templates_index.jsonc</code>. Copy CSV skeletons for any missing ones.</p>
            <DataStatusBanner health={health} />
            <div className="mb-3">
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="w-full sm:w-80 bg-[#0b1220] border border-gray-700 rounded p-2 text-sm" />
            </div>
            <div className="overflow-auto border border-gray-700 rounded">
                <table className="w-full text-sm">
                    <thead className="bg-[#0b1220]">
                        <tr>
                            <th className="px-3 py-2 text-left">Template</th>
                            <th className="px-3 py-2">Phase</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coverage.map((c: any, i: number) => (
                            <tr key={i} className="border-t border-gray-800">
                                <td className="px-3 py-2">{c.template}</td>
                                <td className="px-3 py-2 text-center">{c.phase}</td>
                                <td className={`px-3 py-2 text-center ${c.status === "Complete" ? "text-green-400" : c.status === "Partial" ? "text-yellow-300" : "text-red-400"}`}>{c.status}</td>
                                <td className="px-3 py-2 text-center">
                                    {c.status !== "Complete" && (
                                        <button
                                            className="px-3 py-1 rounded bg-[#1f2937] hover:bg-[#ef4444]"
                                            onClick={() => {
                                                const line = csvSkeleton({ template: c.template, phase: c.phase });
                                                navigator.clipboard.writeText(line);
                                                alert("CSV skeleton copied to clipboard. Paste into supplemental.csv.");
                                            }}
                                        >
                                            Copy CSV Skeleton
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {coverage.length === 0 && (
                            <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">No items.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Skeleton fields are placeholders — replace with book‑accurate values.</p>
        </div>
    );
}
