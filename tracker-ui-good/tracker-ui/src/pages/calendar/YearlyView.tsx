import { useProgression } from "@/store/progressionStore";
import { PHASE_COLORS } from "@/lib/ui/colors";
import { useCalendar } from "@/store/calendarStore";

export default function YearlyView() {
    const { weeks, totalWeeks } = useProgression();
    const { state, setVisibleWeek } = useCalendar();

    return (
        <div className="mt-6 p-3 border border-gray-700 rounded bg-[#0b1220] text-gray-200">
            <div className="text-sm mb-2">Phase bands (click a week to jump to Weekly)</div>
            <div className="flex flex-wrap gap-1">
                {weeks.map(w => (
                    <button key={w.weekIndex}
                        onClick={() => setVisibleWeek(w.weekIndex)}
                        className={`px-2 py-1 rounded text-xs border ${state.visibleWeek === w.weekIndex ? "border-[#ef4444]" : "border-gray-700"}`}
                        style={{ backgroundColor: PHASE_COLORS[w.phase] }}
                        title={`Week ${w.weekIndex + 1}: ${w.phase}`}
                    >
                        {w.weekIndex + 1}
                    </button>
                ))}
            </div>
            <div className="mt-2 text-xs text-gray-400">{totalWeeks} weeks total</div>
        </div>
    );
}
