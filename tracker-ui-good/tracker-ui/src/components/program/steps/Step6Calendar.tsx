import CalendarPage from "@/pages/calendar/CalendarPage";
import { useCalendar } from "@/store/calendarStore";
import { useSchedule } from "@/store/scheduleStore";
import { useStep3 } from "@/store/step3Store";
import { useProgression } from "@/store/progressionStore";
import { useFinalPlan } from "@/store/finalPlanStore";
import { useMemo } from "react";
import { toast } from "react-toastify";
import BuilderProgress from "@/components/program/steps/BuilderProgress";
import { useProgramV2, selectPhasePlan, setPhasePlan, selectSeventhWeek, setSeventhWeek } from "@/methods/531/contexts/ProgramContextV2.jsx";

export default function Step6Calendar() {
    const { state: cal } = useCalendar();
    const { state: sched } = useSchedule();
    const { state: s3 } = useStep3();
    const { plan: progPlan, weeks } = useProgression();
    const { locked, save, reset, plan } = useFinalPlan();

    const { state: program, dispatch } = useProgramV2();
    const phasePlan = selectPhasePlan(program);
    const seventh = selectSeventhWeek(program);

    const snapshot = useMemo(() => ({
        schedule: sched,
        step3: s3,
        progression: { plan: progPlan, weeks },
        calendar: { events: cal.events }
    }), [sched, s3, progPlan, weeks, cal.events]);

    return (
        <>
            <div className="px-8 pt-6"><BuilderProgress current={6} /></div>
            <div className="bg-[#1a1a2e] min-h-screen text-white">
                <div className="px-6 py-3 border-b border-gray-700 bg-[#0b1220]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                            <div className="text-gray-300 mb-1">Phase Pattern</div>
                            <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                                {["2+1", "3+1"].map(p => (
                                    <button key={p} onClick={() => setPhasePlan(dispatch, { pattern: p as any })}
                                        className={`px-3 py-1 ${phasePlan?.pattern === p ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>{p}</button>
                                ))}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">Pattern controls the number of Leader cycles before Anchor.</div>
                        </div>
                        <div className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                            <div className="text-gray-300 mb-1">7th‑Week Mode</div>
                            <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                                {[{ k: 'deload', label: 'Deload' }, { k: 'tm_test', label: 'TM‑Test' }].map(opt => (
                                    <button key={opt.k} onClick={() => setSeventhWeek(dispatch, { mode: opt.k as any })}
                                        className={`px-3 py-1 ${seventh?.mode === opt.k ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>{opt.label}</button>
                                ))}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">Choose a recovery/test protocol for the 7th week.</div>
                        </div>
                        <div className="p-3 rounded border border-gray-700 bg-[#0b1220]">
                            <div className="text-gray-300 mb-1">7th‑Week Criteria</div>
                            <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                                {[{ k: 'afterLeader', label: 'After Leader' }, { k: 'every7th', label: 'Every 7th' }].map(opt => (
                                    <button key={opt.k} onClick={() => setSeventhWeek(dispatch, { criteria: opt.k as any })}
                                        className={`px-3 py-1 ${seventh?.criteria === opt.k ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>{opt.label}</button>
                                ))}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">When to insert the 7th week deload/test.</div>
                        </div>
                    </div>
                </div>
                {locked && (
                    <div className="sticky top-0 z-10 bg-[#0b1220] border-b border-gray-700 p-3 text-sm text-emerald-300">
                        <div className="max-w-7xl mx-auto flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                                <span>
                                    Plan Locked — saved {plan?.createdAt ? new Date(plan.createdAt).toLocaleString() : 'this session'}.
                                </span>
                                <span
                                    className="text-emerald-300/80"
                                    title={`Rotation: ${plan?.schedule?.rotation ?? '-'} • Test: ${plan?.progression?.plan?.testAfterAnchor ?? '-'}`}
                                >
                                    Template: {plan?.step3?.supplemental?.Template || 'Custom'} • Days/wk: {plan?.schedule?.daysPerWeek ?? '-'} • Weeks: {plan?.progression?.weeks?.length ?? '-'}
                                </span>
                            </div>
                            <div className="text-emerald-300/80">Steps 1–5 are read-only.</div>
                        </div>
                    </div>
                )}
                <CalendarPage />
                <div className="sticky bottom-0 w-full bg-[#0b1220] border-t border-gray-700 p-3 flex justify-between">
                    {locked ? (
                        <button onClick={() => {
                            if (window.confirm("Reset final plan and unlock Steps 1–5? This will clear the saved snapshot.")) {
                                reset();
                                toast.info("Final plan reset. Steps 1–5 are unlocked.");
                            }
                        }} className="px-3 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-800">
                            Reset Final Plan
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={() => {
                            if (locked) return;
                            save(snapshot as any);
                            toast.success("Final plan saved. Steps 1–5 are now locked.");
                        }}
                        disabled={locked}
                        className={`px-4 py-2 rounded font-semibold ${locked ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#ef4444] text-white"}`}
                    >
                        {locked ? "Plan Saved" : "Finish & Save Plan"}
                    </button>
                </div>
            </div>
        </>
    );
}
