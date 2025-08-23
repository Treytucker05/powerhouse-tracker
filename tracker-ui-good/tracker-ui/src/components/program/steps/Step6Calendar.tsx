import CalendarPage from "@/pages/calendar/CalendarPage";
import { useCalendar } from "@/store/calendarStore";
import { useSchedule } from "@/store/scheduleStore";
import { useStep3 } from "@/store/step3Store";
import { useProgression } from "@/store/progressionStore";
import { useFinalPlan } from "@/store/finalPlanStore";
import { useMemo } from "react";
import { toast } from "react-toastify";
import BuilderProgress from "@/components/program/steps/BuilderProgress";

export default function Step6Calendar() {
    const { state: cal } = useCalendar();
    const { state: sched } = useSchedule();
    const { state: s3 } = useStep3();
    const { plan: progPlan, weeks } = useProgression();
    const { locked, save, reset, plan } = useFinalPlan();

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
