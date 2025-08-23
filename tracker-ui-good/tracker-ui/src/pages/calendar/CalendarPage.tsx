import { useState, useEffect } from "react";
import WeeklyView from "./WeeklyView";
import YearlyView from "./YearlyView";
import { useCalendar } from "../../store/calendarStore";
import { useSchedule } from "../../store/scheduleStore";
import { useStep3 } from "../../store/step3Store";
import { estimateSessionMinutes } from "../../lib/531/rules";
import type { Weekday } from "../../types/calendar";
import { useProgression } from "@/store/progressionStore";

export default function CalendarPage() {
    const tabItems = ["Weekly", "Yearly"] as const;
    const [tab, setTab] = useState<typeof tabItems[number]>("Weekly");
    const { state: cal, replaceAll } = useCalendar() as any;
    const { state: sched } = useSchedule();
    const { state: s3 } = useStep3();
    const { weeks } = useProgression();

    // Pre-seed once if empty — multi-week using Step 5 progression
    useEffect(() => {
        if (cal.events.length > 0) return;
        const days = sched.days;
        const all: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const off = all.filter(d => !days.includes(d));
        const hardN = s3.conditioning.hardDays || 0;
        const easyN = s3.conditioning.easyDays || 0;
        const pref = s3.conditioning.preferredDays?.length ? (s3.conditioning.preferredDays as Weekday[]) : off;
        const hardPref = pref.filter(d => off.includes(d));
        const hardDays = hardPref.slice(0, hardN);
        const easyDays = hardPref.filter(d => !hardDays.includes(d)).slice(0, easyN);

        const suppSets = parseInt(s3.supplemental?.SupplementalSetsReps.match(/\d+/)?.[0] ?? "0", 10) || 0;
        const sessionMinutes = estimateSessionMinutes({
            mainPattern: (s3.supplemental?.MainPattern as any) || "531",
            supplementalSets: suppSets,
            assistanceTargets: s3.assistance.perCategoryTarget,
            jumpsThrows: s3.warmup.jumpsThrowsDose || 10,
        });

        const EVENTS: any[] = [];
        weeks.forEach(w => {
            days.forEach(d => EVENTS.push({ id: "", type: "SESSION", day: d as Weekday, weekIndex: w.weekIndex, phase: w.phase, meta: { label: "Training Session", minutes: sessionMinutes } }));
            hardDays.forEach(d => EVENTS.push({ id: "", type: "COND_HARD", day: d as Weekday, weekIndex: w.weekIndex, phase: w.phase, meta: { label: "Hard Conditioning", minutes: 15 } }));
            easyDays.forEach(d => EVENTS.push({ id: "", type: "COND_EASY", day: d as Weekday, weekIndex: w.weekIndex, phase: w.phase, meta: { label: "Easy Conditioning", minutes: 25 } }));
        });

        replaceAll(EVENTS as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-[#ef4444]">Calendar</h1>
                <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                    {tabItems.map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 text-sm ${tab === t ? "bg-[#ef4444]" : "bg-[#0b1220] text-gray-200"}`}>{t}</button>
                    ))}
                </div>
            </div>

            {tab === "Weekly" ? <WeeklyView /> : <YearlyView />}
        </div>
    );
}
