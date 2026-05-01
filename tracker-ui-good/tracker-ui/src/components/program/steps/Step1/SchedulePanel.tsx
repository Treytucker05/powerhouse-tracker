import { useEffect } from "react";
import { useSchedule, type DaysPerWeek, type Weekday } from "@/store/scheduleStore";
import Step1CalendarPlanner from "./Step1CalendarPlanner";

const WD: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Rotation preset UI removed per requirements

export default function SchedulePanel() {
    const { state, setDaysPerWeek, toggleDay, setDays } = useSchedule();

    // keep selected day count in sync with daysPerWeek (helpful nudge)
    useEffect(() => {
        if (state.days.length === state.daysPerWeek) return;
        if (state.days.length > state.daysPerWeek) {
            // trim from weekend inward
            const pref = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const keep = state.days.slice(0, state.daysPerWeek).sort((a, b) => pref.indexOf(a as any) - pref.indexOf(b as any));
            setDays(keep as Weekday[]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.daysPerWeek]);

    return (
        <div className="mt-4 border border-gray-700 rounded p-4 bg-[#0b1220] text-white">
            <h3 className="text-lg font-semibold text-[#ef4444] mb-2">Schedule & Rotation</h3>

            <div className="mb-3">
                <div className="text-sm text-gray-300 mb-1">Days per week</div>
                <div className="flex flex-wrap gap-2">
                    {[2, 3, 4].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDaysPerWeek(d as DaysPerWeek)}
                            className={`px-2 py-1 rounded border ${state.daysPerWeek === d ? "border-[#ef4444] bg-[#1f2937]" : "border-gray-700 bg-[#0b1220]"}`}
                        >
                            {d} days
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <div className="text-sm text-gray-300 mb-1">Pick training days</div>
                <div className="flex flex-wrap gap-2">
                    {WD.map(day => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-2 py-1 rounded border ${state.days.includes(day) ? "border-[#ef4444] bg-[#1f2937]" : "border-gray-700 bg-[#0b1220]"}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">Select exactly {state.daysPerWeek} day{state.daysPerWeek > 1 ? "s" : ""}. We’ll pre-seed Conditioning on off-days by default.</p>
            </div>

            {/* Rotation preset dropdown removed */}
            {/* Inline merged calendar planner */}
            <div className="mt-4">
                <Step1CalendarPlanner embedded />
            </div>
        </div>
    );
}
