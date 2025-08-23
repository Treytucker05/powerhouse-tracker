import { useSchedule } from "@/store/scheduleStore";
const LIFTS = ["Squat", "Bench", "Deadlift", "Press"] as const;
type Lift = typeof LIFTS[number];

export default function RotationMapper() {
    const { state } = useSchedule();
    const days = state.days;
    const mapping: Record<string, Lift | undefined> = {} as any;
    days.forEach((d, i) => mapping[d] = LIFTS[i % LIFTS.length]);

    return (
        <div className="mt-4 border border-gray-700 rounded p-4 bg-[#0b1220] text-white">
            <h3 className="text-lg font-semibold text-[#ef4444] mb-2">Lift Rotation Mapper</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {days.map(d => (
                    <div key={d} className="p-2 rounded border border-gray-700">
                        <div className="text-sm font-semibold mb-1">{d}</div>
                        <select className="w-full bg-[#0b1220] border border-gray-700 rounded p-1 text-sm"
                            value={mapping[d] || "Squat"}
                            onChange={() => { /* optional: persist mapping later */ }}
                        >
                            {LIFTS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">Use this to label sessions in Preview/Calendar (optional persistence later).</p>
        </div>
    );
}
