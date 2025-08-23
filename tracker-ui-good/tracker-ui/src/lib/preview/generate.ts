import type { CalEvent, Weekday } from "@/types/calendar";

export type PreviewMode = "simple" | "full";
export interface DayPreview { day: Weekday; items: { label: string; minutes: number; }[]; total: number; }
export interface WeekPreview { weekIndex: number; phase: string; days: DayPreview[]; weeklyTotal: number; }

export function generateFromCalendar(events: CalEvent[]): WeekPreview[] {
    const weeks = new Map<number, { phase: string; byDay: Map<Weekday, { label: string; minutes: number }[]> }>();
    const order: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (const ev of events) {
        if (!weeks.has(ev.weekIndex)) weeks.set(ev.weekIndex, { phase: ev.phase, byDay: new Map() });
        const w = weeks.get(ev.weekIndex)!;
        if (!w.byDay.has(ev.day)) w.byDay.set(ev.day, []);
        const sessionLabel = ev.type === "SESSION"
            ? (ev.phase === 'Deload' ? 'Deload: Main (light) + Optional' : ev.phase === 'TMTest' ? '7th Week Test/Deload' : 'Main + Supplemental')
            : ev.meta.label || "";
        w.byDay.get(ev.day)!.push({ label: sessionLabel, minutes: ev.meta.minutes || 0 });
    }
    const out: WeekPreview[] = [];
    Array.from(weeks.entries()).sort((a, b) => a[0] - b[0]).forEach(([idx, w]) => {
        const days: DayPreview[] = order.map(d => {
            const items = (w.byDay.get(d as Weekday) || []).sort((a, b) => a.label.localeCompare(b.label));
            const total = items.reduce((m, i) => m + i.minutes, 0);
            return { day: d as Weekday, items, total };
        });
        const weeklyTotal = days.reduce((m, d) => m + d.total, 0);
        out.push({ weekIndex: idx, phase: w.phase, days, weeklyTotal });
    });
    return out;
}
