import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCenter } from "@dnd-kit/core";
import { useCalendar } from "../../store/calendarStore";
import { useSchedule } from "../../store/scheduleStore";
import { useSettings } from "../../store/settingsStore";
import { useStep3 } from "../../store/step3Store";
import type { Weekday } from "../../types/calendar";
import { useProgression } from "@/store/progressionStore";
import { PHASE_COLORS } from "@/lib/ui/colors";

const DAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DraggableCard({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className="cursor-grab active:cursor-grabbing select-none"
        >{children}</div>
    );
}
function DroppableDay({ id, children }: { id: Weekday; children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef}
            className={`min-h-[140px] rounded border ${isOver ? "border-[#ef4444]" : "border-gray-700"} p-2 bg-[#0b1220]`}
        >
            {children}
        </div>
    );
}

export default function WeeklyView() {
    const { state: sched } = useSchedule();
    const { state: s3 } = useStep3();
    const cal: any = useCalendar();
    const { bookMode } = useSettings();
    const [toast, setToast] = useState<string>("");
    const { weeks, totalWeeks } = useProgression();
    const { state: calState, setVisibleWeek } = useCalendar() as any;
    const currentWeek = calState.visibleWeek || 0;
    const currentPhase = weeks[currentWeek]?.phase || "Leader";

    // Palette: draggable prototypes to add new conditioning
    const palette = [
        { id: "palette:COND_HARD", label: "Add HARD", minutes: 15 },
        { id: "palette:COND_EASY", label: "Add EASY", minutes: 25 },
    ];

    // Helper: count hard conditioning in week
    const hardCount = useMemo(() => cal.state.events.filter((e: any) => e.type === "COND_HARD" && e.weekIndex === currentWeek).length, [cal.state.events, currentWeek]);
    const hardCap = Number(s3.supplemental?.HardConditioningMax ?? 3);

    const showToast = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(""), 2500);
    };

    const onDragEnd = (e: DragEndEvent) => {
        const over = e.over?.id as Weekday | undefined;
        if (!over) return;
        const id = String(e.active.id);

        // If dragging from palette, create a new conditioning event on drop
        if (id.startsWith("palette:")) {
            const kind = id.includes("HARD") ? "HARD" : "EASY";
            if (kind === "HARD") {
                if (hardCount + 1 > hardCap) {
                    const msg = `Hard conditioning cap exceeded (cap = ${hardCap}).`;
                    if (bookMode === "enforce") { showToast(`Blocked: ${msg}`); return; }
                    else { showToast(`Warning: ${msg}`); }
                }
            }
            cal.add({ id: "", type: kind === "HARD" ? "COND_HARD" : "COND_EASY", day: over, weekIndex: currentWeek, phase: currentPhase, meta: { label: kind === "HARD" ? "Hard Conditioning" : "Easy Conditioning", minutes: kind === "HARD" ? 15 : 25 } } as any);
            return;
        }

        // Moving an existing card
        cal.move(id, over);
    };

    return (
        <div className="mt-4">
            {/* Week nav / ribbon */}
            <div className="flex items-center justify-between mb-2">
                <div className="inline-flex rounded overflow-hidden border border-gray-700">
                    <button disabled={currentWeek <= 0} onClick={() => setVisibleWeek(Math.max(0, currentWeek - 1))}
                        className={`px-2 py-1 text-sm ${currentWeek <= 0 ? "bg-[#0b1220] text-gray-600" : "bg-[#1f2937] hover:bg-[#ef4444]"}`}>◀</button>
                    <span className="px-3 py-1 text-sm bg-[#0b1220]">Week {currentWeek + 1} / {totalWeeks}</span>
                    <button disabled={currentWeek >= totalWeeks - 1} onClick={() => setVisibleWeek(Math.min(totalWeeks - 1, currentWeek + 1))}
                        className={`px-2 py-1 text-sm ${currentWeek >= totalWeeks - 1 ? "bg-[#0b1220] text-gray-600" : "bg-[#1f2937] hover:bg-[#ef4444]"}`}>▶</button>
                </div>
                <span className="px-2 py-1 rounded text-xs border border-gray-700" style={{ backgroundColor: PHASE_COLORS[currentPhase] }}>
                    {currentPhase}
                </span>
            </div>

            {/* Palette & weekly total */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {palette.map(p => (
                        <DraggableCard key={p.id} id={p.id}>
                            <div className="px-3 py-1 rounded border border-gray-700 bg-[#1f2937] text-sm hover:bg-[#ef4444]">
                                {p.label}
                            </div>
                        </DraggableCard>
                    ))}
                </div>
                <div className="text-sm text-gray-300">
                    Weekly total: <span className="font-semibold">{cal.weeklyMinutes()} min</span>
                </div>
            </div>

            {toast && <div className="mb-3 px-3 py-2 rounded bg-[#331a1a] border border-red-700 text-red-300 text-sm">{toast}</div>}

            <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {DAYS.map(day => {
                        const evs = (cal.eventsByDay(day) as any[]).filter(e => e.weekIndex === currentWeek);
                        const total = evs.reduce((m: number, e: any) => m + (e.meta.minutes || 0), 0);
                        const overload = total > 75;
                        return (
                            <div key={day}>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-semibold">{day}</h3>
                                    <span className={`text-xs ${overload ? "text-red-400" : "text-gray-400"}`}>{total} min</span>
                                </div>
                                <DroppableDay id={day}>
                                    <div className="space-y-2">
                                        {evs.map((ev: any) => (
                                            <DraggableCard key={ev.id} id={ev.id}>
                                                <div className="p-2 rounded border border-gray-700 bg-[#0b1220]">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-semibold">
                                                            {ev.type === "SESSION"
                                                                ? (currentPhase === 'Deload' ? 'Deload Session' : currentPhase === 'TMTest' ? '7th Week Session' : 'Training Session')
                                                                : ev.meta.label}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => {
                                                                const m = prompt("Minutes for this item:", String(ev.meta.minutes || 0));
                                                                if (!m) return;
                                                                const val = Number(m);
                                                                if (Number.isNaN(val)) return;
                                                                const next = cal.state.events.map((e: any) => e.id === ev.id ? { ...e, meta: { ...e.meta, minutes: val } } : e);
                                                                cal.replaceAll(next);
                                                            }} className="text-xs text-gray-400 hover:text-gray-200">⋯</button>
                                                            <button onClick={() => cal.remove(ev.id)} className="text-xs text-gray-400 hover:text-red-400">✕</button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                                                        <span>{ev.type === "SESSION" ? (s3.supplemental?.Template || "—") : (ev.type === "COND_HARD" ? "Hard" : "Easy")}<span className="inline-block w-2 h-2 rounded-full ml-2" style={{ backgroundColor: PHASE_COLORS[currentPhase] }} /></span>
                                                        <span>{ev.meta.minutes ?? 0} min</span>
                                                    </div>
                                                </div>
                                            </DraggableCard>
                                        ))}
                                    </div>
                                </DroppableDay>
                                {/* On off-days, hint adding conditioning */}
                                {!sched.days.includes(day) && (
                                    <div className="mt-1 text-[11px] text-gray-500">Tip: drag “Add HARD/EASY” here</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </DndContext>
        </div>
    );
}
