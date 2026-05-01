// Re-export TSX implementation so extensionless imports get correct API
import React, { createContext, useContext, useMemo, useState } from "react";
import type { CalEvent, Weekday, Phase, EventType } from "../types/calendar";

type State = { events: CalEvent[]; history: CalEvent[][]; visibleWeek: number };
export type CalendarCtx = {
    state: State;
    add: (e: CalEvent) => void;
    move: (id: string, nextDay: Weekday) => void;
    remove: (id: string) => void;
    replaceAll: (events: CalEvent[]) => void;
    undo: () => void;
    eventsByDay: (day: Weekday) => CalEvent[];
    weeklyMinutes: () => number;
    setVisibleWeek: (n: number) => void;
};

const KEY = "calendar.v1";
const CalendarCtxObj = createContext<CalendarCtx | null>(null);

function uid(prefix = "e") {
    return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const [events, setEvents] = useState<CalEvent[]>(() => {
        try {
            const parsed = JSON.parse(sessionStorage.getItem(KEY) || "{}");
            return Array.isArray(parsed) ? parsed : (parsed?.events || []);
        } catch {
            return [];
        }
    });
    const [history, setHistory] = useState<CalEvent[][]>([]);
    const [visibleWeek, setVisibleWeek] = useState<number>(() => {
        try { return JSON.parse(sessionStorage.getItem(KEY) || "{}").visibleWeek ?? 0; } catch { return 0; }
    });

    const pushHistory = (prev: CalEvent[]) => setHistory((h) => [...h.slice(-19), prev]); // keep last 20

    const add = (e: CalEvent) => {
        pushHistory(events);
        const next = [...events, { ...e, id: e.id || uid() }];
        setEvents(next);
        sessionStorage.setItem(KEY, JSON.stringify({ events: next, visibleWeek }));
    };
    const move = (id: string, nextDay: Weekday) => {
        pushHistory(events);
        const next = events.map((ev) => (ev.id === id ? { ...ev, day: nextDay } : ev));
        setEvents(next);
        sessionStorage.setItem(KEY, JSON.stringify({ events: next, visibleWeek }));
    };
    const remove = (id: string) => {
        pushHistory(events);
        const next = events.filter((ev) => ev.id !== id);
        setEvents(next);
        sessionStorage.setItem(KEY, JSON.stringify({ events: next, visibleWeek }));
    };
    const replaceAll = (evs: CalEvent[]) => {
        pushHistory(events);
        setEvents(evs);
        sessionStorage.setItem(KEY, JSON.stringify({ events: evs, visibleWeek }));
    };
    const undo = () => {
        const last = history[history.length - 1];
        if (!last) return;
        setHistory((h) => h.slice(0, -1));
        setEvents(last);
        sessionStorage.setItem(KEY, JSON.stringify({ events: last, visibleWeek }));
    };
    const eventsByDay = (day: Weekday) =>
        events
            .filter((e) => e.day === day)
            .sort((a, b) => {
                const rank = (t: EventType) => (t === "SESSION" ? 0 : t === "COND_HARD" ? 1 : t === "COND_EASY" ? 2 : 3);
                return rank(a.type) - rank(b.type);
            });
    const weeklyMinutes = () => events.reduce((sum, ev) => sum + (ev.meta.minutes || 0), 0);

    // persist visibleWeek updates
    React.useEffect(() => {
        try { sessionStorage.setItem(KEY, JSON.stringify({ events, visibleWeek })); } catch { }
    }, [events, visibleWeek]);

    const value = useMemo<CalendarCtx>(
        () => ({ state: { events, history, visibleWeek }, add, move, remove, replaceAll, undo, eventsByDay, weeklyMinutes, setVisibleWeek }),
        [events, history, visibleWeek]
    );

    return React.createElement(CalendarCtxObj.Provider, { value }, children);
}

export function useCalendar() {
    const ctx = useContext(CalendarCtxObj);
    if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
    return ctx;
}

export function makeSession(day: Weekday, label: string, minutes: number, phase: Phase = "Leader"): CalEvent {
    return { id: "", type: "SESSION", day, weekIndex: 0, phase, meta: { label, minutes } };
}
export function makeCond(day: Weekday, kind: "HARD" | "EASY", minutes: number, phase: Phase = "Leader"): CalEvent {
    return {
        id: "",
        type: kind === "HARD" ? "COND_HARD" : "COND_EASY",
        day,
        weekIndex: 0,
        phase,
        meta: { label: kind === "HARD" ? "Hard Conditioning" : "Easy Conditioning", minutes },
    };
}
