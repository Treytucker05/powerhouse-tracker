import React, { useEffect, useMemo, useState } from "react";
import { useProgression } from "@/store/progressionStore";
import { ProgressionProvider } from "@/store/progressionStore";
import { useSettings } from "@/store/settingsStore";
import { useStep3 } from "@/store/step3Store";
import { PHASE_COLORS } from "@/lib/ui/colors";
import { getDataHealth, loadSeventhWeekCsv, loadTMPoliciesCsv } from "@/lib/data/ensureData";
import DataStatusBanner from "@/components/ui/DataStatusBanner";
import type { SeventhWeekRow, TMRuleRow } from "@/types/step3";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { useProgramV2, selectAssistanceTargets, setAssistanceTargets } from "@/methods/531/contexts/ProgramContextV2.jsx";

function Step5ProgressionInner() {
    const { plan, setPlan, weeks, totalWeeks } = useProgression();
    const { bookMode } = useSettings();
    const { state: s3 } = useStep3();
    const { state: programV2, dispatch: programDispatch } = useProgramV2();
    const [health, setHealth] = useState<{ seventhWeek: boolean; tmRules: boolean; jokerRules: boolean } | null>(null);
    const [tmPolicies, setTmPolicies] = useState<TMRuleRow[]>([]);
    const [protocols, setProtocols] = useState<SeventhWeekRow[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const h = await getDataHealth();
            if (!mounted) return;
            setHealth(h);
            if (h.tmRules) {
                try { const rows = await loadTMPoliciesCsv(); if (mounted) setTmPolicies(rows); } catch { }
            }
            if (h.seventhWeek) {
                try { const rows = await loadSeventhWeekCsv(); if (mounted) setProtocols(rows); } catch { }
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Enforcement checks
    const violations = useMemo(() => {
        const v: string[] = [];
        // Deload between Leader->Anchor recommended
        if (!plan.includeDeloadBetween) v.push("Deload is disabled between Leader and Anchor.");
        // Jokers in Leader (if selected anchor includes Jokers, OK; but MainPattern must be 3/5/1 for Jokers anyway on Anchor)
        const mp = (s3 as any).supplemental?.MainPattern;
        const anchor = (s3 as any).supplemental?.Template || "Anchor";
        if (String(anchor || '').toLowerCase().includes("joker") && mp !== "3/5/1") {
            v.push("Jokers selected but scheme is not 3/5/1.");
        }
        return v;
    }, [plan, s3]);

    const blocked = bookMode === "enforce" && violations.length > 0;

    return (
        <>
            <div className="px-8 pt-6"><BuilderProgress current={5} /></div>
            <div className="bg-[#1a1a2e] text-white p-4 rounded border border-gray-700">
                <h2 className="text-xl font-bold text-[#ef4444] mb-2">Step 5 — Progression</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                        <div className="text-sm text-gray-300 mb-1">Leader cycles (×3 weeks)</div>
                        <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                            {[1, 2, 3].map(c => (
                                <button key={c} onClick={() => setPlan({ leaderCycles: c })}
                                    className={`px-3 py-1 text-sm ${plan.leaderCycles === c ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-300 mb-1">Anchor cycles (×3 weeks)</div>
                        <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                            {[1, 2].map(c => (
                                <button key={c} onClick={() => setPlan({ anchorCycles: c })}
                                    className={`px-3 py-1 text-sm ${plan.anchorCycles === c ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-300">Deload between Leader → Anchor</span>
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={plan.includeDeloadBetween} onChange={(e) => setPlan({ includeDeloadBetween: e.target.checked })} />
                                <span className="text-sm">{plan.includeDeloadBetween ? "On" : "Off"}</span>
                            </label>
                        </div>
                        <div className="mt-3 text-sm text-gray-300 mb-1">After Anchor</div>
                        <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                            {["TMTest", "PRTest"].map(t => (
                                <button key={t} onClick={() => setPlan({ testAfterAnchor: t as any })}
                                    className={`px-3 py-1 text-sm ${plan.testAfterAnchor === t ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>
                                    {t === "TMTest" ? "7th Week TM‑Test" : "7th Week PR‑Test"}
                                </button>
                            ))}
                        </div>
                        {/* TM Policy selector */}
                        <div className="mt-4">
                            <div className="text-sm text-gray-300 mb-1">Training Max Policy</div>
                            <select
                                className="w-full bg-[#0b1220] border border-gray-700 rounded px-2 py-1 text-sm"
                                value={plan.tmPolicyId || ""}
                                onChange={(e) => setPlan({ tmPolicyId: e.target.value || undefined })}
                            >
                                <option value="">Auto (standard)</option>
                                {tmPolicies.map(p => (
                                    <option key={p.PolicyId} value={p.PolicyId}>
                                        {p.Name} ({p.StartTMPercent}% start)
                                    </option>
                                ))}
                            </select>
                            <div className="text-[11px] text-gray-400 mt-1">Policies sourced from tm_rules.csv</div>
                        </div>

                        {/* 7th Week protocol selector */}
                        <div className="mt-4">
                            <div className="text-sm text-gray-300 mb-1">7th Week Protocol</div>
                            <select
                                className="w-full bg-[#0b1220] border border-gray-700 rounded px-2 py-1 text-sm"
                                value={plan.testProtocolId || ""}
                                onChange={(e) => setPlan({ testProtocolId: e.target.value || undefined })}
                            >
                                <option value="">Auto based on selection ({plan.testAfterAnchor})</option>
                                {protocols
                                    .filter(p => p.Kind === plan.testAfterAnchor || (plan.testAfterAnchor === 'TMTest' && p.Kind === 'Deload'))
                                    .map(p => (
                                        <option key={p.ProtocolId} value={p.ProtocolId}>
                                            {p.Name} — {p.Percentages}
                                        </option>
                                    ))}
                            </select>
                            <div className="text-[11px] text-gray-400 mt-1">Protocols from seventh_week.csv</div>
                        </div>

                        {/* Assistance targets (ProgramContextV2) */}
                        <div className="mt-5 border-t border-gray-800 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-300">Assistance Targets (per day)</div>
                                <div className="flex items-center gap-1">
                                    {[50, 75, 100].map(v => (
                                        <button key={v} onClick={() => setAssistanceTargets(programDispatch, { push: v, pull: v, core: v })}
                                            className="px-2 py-0.5 rounded border border-gray-700 text-[11px] hover:border-red-500">{v}</button>
                                    ))}
                                </div>
                            </div>
                            {(() => {
                                const t = selectAssistanceTargets(programV2);
                                const setField = (k: 'push' | 'pull' | 'core') => (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const val = Math.max(0, Math.min(300, Number(e.target.value || 0)));
                                    setAssistanceTargets(programDispatch, { [k]: val } as any);
                                };
                                const Field = ({ label, k }: { label: string; k: 'push' | 'pull' | 'core' }) => (
                                    <label className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-xs text-gray-400 w-28">{label}</span>
                                        <input type="number" min={0} max={300} step={5} value={t[k]}
                                            onChange={setField(k)}
                                            className="w-28 bg-[#0b1220] border border-gray-700 rounded px-2 py-1 text-sm" />
                                    </label>
                                );
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Field label="Push (reps)" k="push" />
                                        <Field label="Pull (reps)" k="pull" />
                                        <Field label="Core (reps)" k="core" />
                                    </div>
                                );
                            })()}
                            <div className="mt-1 text-[11px] text-gray-400">Set your daily rep targets. Quick‑set chips apply to all three.</div>
                        </div>
                    </div>

                    <div className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                        <div className="text-sm text-gray-300 mb-2">Phase timeline preview ({totalWeeks} weeks)</div>
                        <div className="flex flex-wrap gap-1">
                            {weeks.map(w => (
                                <span key={w.weekIndex}
                                    className="px-2 py-1 rounded text-xs"
                                    style={{ backgroundColor: PHASE_COLORS[w.phase] }}
                                    title={`Week ${w.weekIndex + 1}: ${w.phase}`}
                                >
                                    {w.weekIndex + 1}
                                </span>
                            ))}
                        </div>
                        {violations.length > 0 && (
                            <ul className={`mt-3 text-xs list-disc pl-5 ${bookMode === "enforce" ? "text-red-400" : "text-yellow-300"}`}>
                                {violations.map((v, i) => <li key={i}>{v}</li>)}
                            </ul>
                        )}
                        {blocked && <div className="mt-2 text-sm text-red-400">Book‑Mode Enforce: resolve the above before continuing.</div>}
                        <DataStatusBanner health={health} />
                    </div>
                </div>
            </div>
        </>
    );
}

class LocalBoundary extends React.Component<{ onError?: (e: any) => void; children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any) { this.props.onError?.(error); }
    render() { return this.state.hasError ? null : this.props.children; }
}

export default function Step5Progression() {
    const [wrap, setWrap] = useState(false);
    const key = wrap ? "with-provider" : "no-provider";
    return (
        <LocalBoundary key={key} onError={(e) => {
            // If useProgression threw (provider missing), re-render wrapped with provider
            if (String(e?.message || '').includes('useProgression')) setWrap(true);
        }}>
            {wrap ? (
                <ProgressionProvider>
                    <Step5ProgressionInner />
                </ProgressionProvider>
            ) : (
                <Step5ProgressionInner />
            )}
        </LocalBoundary>
    );
}
