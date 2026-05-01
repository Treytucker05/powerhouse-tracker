import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ScheduleState } from "./scheduleStore";
import type { ProgressionPlan, WeekPhase } from "./progressionStore";
import type { CalEvent } from "@/types/calendar";
import type { Step3Selection } from "@/types/step3";

export type FinalPlanV1 = {
    version: "v1";
    createdAt: number;
    schedule: ScheduleState;
    step3: Step3Selection;
    progression: { plan: ProgressionPlan; weeks: WeekPhase[] };
    calendar: { events: CalEvent[] };
};

type Ctx = {
    locked: boolean;
    plan?: FinalPlanV1 | null;
    save: (snapshot: Omit<FinalPlanV1, "version" | "createdAt">) => void;
    reset: () => void;
};

const KEY = "finalPlan.v1";
const CtxObj = createContext<Ctx | null>(null);

export function FinalPlanProvider({ children }: { children: React.ReactNode }) {
    const [plan, setPlan] = useState<FinalPlanV1 | null>(() => {
        try {
            const raw = sessionStorage.getItem(KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.version === "v1") return parsed as FinalPlanV1;
            return null;
        } catch {
            return null;
        }
    });

    const locked = !!plan;

    useEffect(() => {
        try {
            if (plan) sessionStorage.setItem(KEY, JSON.stringify(plan));
            else sessionStorage.removeItem(KEY);
        } catch { /* ignore quota errors */ }
    }, [plan]);

    const value = useMemo<Ctx>(() => ({
        locked,
        plan,
        save: (snapshot) => {
            const next: FinalPlanV1 = { version: "v1", createdAt: Date.now(), ...snapshot } as FinalPlanV1;
            setPlan(next);
        },
        reset: () => setPlan(null)
    }), [locked, plan]);

    return <CtxObj.Provider value={value}>{children}</CtxObj.Provider>;
}

export function useFinalPlan() {
    const ctx = useContext(CtxObj);
    if (!ctx) throw new Error("useFinalPlan must be used within FinalPlanProvider");
    return ctx;
}
