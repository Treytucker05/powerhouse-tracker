import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type DaysPerWeek = 2 | 3 | 4;

export type RotationPreset =
    | "4D: SQ-BP-DL-PR"
    | "3D: SQ/BP • DL/PR • SQ/PR"
    | "2D: SQ/BP • DL/PR";

export interface ScheduleState {
    daysPerWeek: DaysPerWeek;
    days: Weekday[];          // which days of week are training days
    rotation: RotationPreset; // label; consumer decides mapping
}

type Ctx = {
    state: ScheduleState;
    setDaysPerWeek: (d: DaysPerWeek) => void;
    toggleDay: (d: Weekday) => void;
    setRotation: (r: RotationPreset) => void;
    setDays: (days: Weekday[]) => void;
};

const KEY = "schedule.v1";
const DEFAULT: ScheduleState = {
    daysPerWeek: 3,
    days: ["Mon", "Wed", "Fri"],
    rotation: "3D: SQ/BP • DL/PR • SQ/PR",
};

const ScheduleCtx = createContext<Ctx | null>(null);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ScheduleState>(() => {
        try { return { ...DEFAULT, ...(JSON.parse(sessionStorage.getItem(KEY) || "{}")) }; }
        catch { return DEFAULT; }
    });

    useEffect(() => { sessionStorage.setItem(KEY, JSON.stringify(state)); }, [state]);

    const api = useMemo<Ctx>(() => ({
        state,
        setDaysPerWeek: (d) => setState(s => ({ ...s, daysPerWeek: d })),
        toggleDay: (d) => setState(s => {
            const has = s.days.includes(d);
            let next = has ? s.days.filter(x => x !== d) : [...s.days, d];
            // keep sorted by weekday order
            const order: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            next = next.sort((a, b) => order.indexOf(a) - order.indexOf(b));
            return { ...s, days: next };
        }),
        setRotation: (r) => setState(s => ({ ...s, rotation: r })),
        setDays: (days) => setState(s => ({ ...s, days })),
    }), [state]);

    return <ScheduleCtx.Provider value={api}>{children}</ScheduleCtx.Provider>;
}

export function useSchedule() {
    const ctx = useContext(ScheduleCtx);
    if (!ctx) throw new Error("useSchedule must be used within ScheduleProvider");
    return ctx;
}
