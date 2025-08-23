import { useMemo, useState } from "react";
import { useCalendar } from "@/store/calendarStore";
import { useProgression } from "@/store/progressionStore";
import { useStep3 } from "@/store/step3Store";
import { generateFromCalendar } from "@/lib/preview/generate";
import { buildWarmupPlan } from "@/lib/531/warmup";

export default function PreviewPage() {
    const { state: cal } = useCalendar();
    useProgression(); // ensure provider present; also could use totalWeeks if needed
    const { state: s3 } = useStep3();
    const [mode, setMode] = useState<"simple" | "full">("full");

    const weeks = useMemo(() => generateFromCalendar(cal.events), [cal.events]);

    const csv = useMemo(() => {
        const rows = [["Week", "Day", "Phase", "Items", "Minutes"]];
        weeks.forEach(w => {
            w.days.forEach(d => {
                const items = d.items.map(i => i.label).join(" + ");
                rows.push([String(w.weekIndex + 1), d.day, w.phase, items, String(d.total)]);
            });
        });
        return rows.map(r => r.map(x => `"${(x || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    }, [weeks]);

    const downloadCsv = () => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "531-preview.csv"; a.click();
        URL.revokeObjectURL(url);
    };

    const printView = () => window.print();

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-[#ef4444]">Step 4 — Preview & Export</h1>
                <div className="flex gap-2">
                    <button onClick={() => setMode("simple")} className={`px-3 py-1 rounded border border-gray-700 ${mode === "simple" ? "bg-[#ef4444]" : "bg-[#0b1220]"}`}>Simple</button>
                    <button onClick={() => setMode("full")} className={`px-3 py-1 rounded border border-gray-700 ${mode === "full" ? "bg-[#ef4444]" : "bg-[#0b1220]"}`}>Full</button>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <button onClick={downloadCsv} className="px-3 py-2 rounded bg-[#1f2937] hover:bg-[#ef4444] text-sm">Export CSV</button>
                <button onClick={printView} className="px-3 py-2 rounded bg-[#1f2937] hover:bg-[#ef4444] text-sm">Print / PDF</button>
            </div>

            <div className="mt-4 space-y-4">
                {weeks.map(w => (
                    <div key={w.weekIndex} className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">Week {w.weekIndex + 1} — {w.phase}</div>
                            <div className="text-sm text-gray-300">Total: {w.weeklyTotal} min</div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {w.days.map(d => (
                                <div key={d.day} className="p-2 rounded border border-gray-700">
                                    <div className="text-sm font-semibold mb-1">{d.day} — {d.total} min</div>
                                    <ul className="text-xs text-gray-300 space-y-1">
                                        {d.items.map((i, idx) => <li key={idx}>• {i.label} ({i.minutes}m)</li>)}
                                    </ul>
                                    {mode === "full" && d.items.some(i => i.label.includes("Main")) && (
                                        (() => {
                                            const plan = buildWarmupPlan({
                                                mainPattern: (s3.supplemental?.MainPattern as any) || '531',
                                                jumpsThrowsDose: s3.warmup.jumpsThrowsDose || 10,
                                                mobility: s3.warmup.mobility,
                                                jump: s3.warmup.jump,
                                                throw: s3.warmup.throw,
                                                novFullPrep: !!s3.warmup.novFullPrep,
                                            });
                                            return (
                                                <div className="mt-2 text-[11px] text-gray-400">
                                                    <div className="font-semibold text-gray-300">{plan.title}</div>
                                                    <ul className="list-disc list-inside space-y-0.5">
                                                        {plan.lines.map((l, i) => <li key={i}>{l}</li>)}
                                                    </ul>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {weeks.length === 0 && (
                    <div className="p-6 rounded border border-gray-700 bg-[#0b1220] text-gray-300">
                        No calendar plan yet. Complete Step 5, then revisit.
                    </div>
                )}
            </div>
        </div>
    );
}
