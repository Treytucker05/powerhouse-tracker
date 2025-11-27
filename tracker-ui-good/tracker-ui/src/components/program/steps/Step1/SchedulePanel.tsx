import { useEffect } from "react";
import { useSchedule, type DaysPerWeek, type RotationPreset, type Weekday } from "@/store/scheduleStore";

const WD: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROTATIONS: RotationPreset[] = [
    "4D: SQ-BP-DL-PR",
    "3D: SQ/BP • DL/PR • SQ/PR",
    "2D: SQ/BP • DL/PR",
];

export default function SchedulePanel() {
    const { state, setDaysPerWeek, toggleDay, setRotation, setDays } = useSchedule();

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
                <div className="inline-flex rounded overflow-hidden border border-gray-700">
                    {[2, 3, 4].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDaysPerWeek(d as DaysPerWeek)}
                            className={`px-3 py-1 text-sm ${state.daysPerWeek === d ? "bg-[#ef4444] text-white" : "bg-[#0b1220] text-gray-200"}`}
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

            <div className="mb-2">
                <div className="text-sm text-gray-300 mb-1">Rotation preset</div>
                <select
                    value={state.rotation}
                    onChange={(e) => setRotation(e.target.value as RotationPreset)}
                    className="bg-[#0b1220] border border-gray-700 rounded p-2 text-sm w-full"
                >
                    {ROTATIONS.map(r =>
                        <option key={r} value={r}>{r}</option>
                    )}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                    This labels days for Step-5/Calendar (e.g., 4D: Mon=Squat, Tue=Bench, Thu=Deadlift, Fri=Press).
                </p>
            </div>
        </div>
    );
}
