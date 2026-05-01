import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Phase } from "@/types/calendar";

export type PRTestType = "TMTest" | "PRTest";
export interface ProgressionPlan {
    leaderCycles: number;   // in cycles (each = 3 weeks)
    anchorCycles: number;   // in cycles (each = 3 weeks)
    includeDeloadBetween: boolean; // Leader -> Deload -> Anchor
    testAfterAnchor: PRTestType;   // TMTest or PRTest week after Anchor
    tmPolicyId?: string;           // from tm_rules.csv
    testProtocolId?: string;       // from seventh_week.csv (Kind=TMTest or PRTest)
}
export interface WeekPhase { weekIndex: number; phase: Phase; }

type Ctx = {
    plan: ProgressionPlan;
    setPlan: (p: Partial<ProgressionPlan>) => void;
    weeks: WeekPhase[];        // derived, ordered from 0..N-1
    totalWeeks: number;
};

const KEY = "progression.v1";
const DEFAULT: ProgressionPlan = {
    leaderCycles: 2,
    anchorCycles: 1,
    includeDeloadBetween: true,
    testAfterAnchor: "TMTest",
    tmPolicyId: "tm_standard",
    testProtocolId: undefined,
};

const CtxObj = createContext<Ctx | null>(null);

function buildWeeks(p: ProgressionPlan): WeekPhase[] {
    const weeks: WeekPhase[] = [];
    let w = 0;
    for (let i = 0; i < p.leaderCycles * 3; i++) weeks.push({ weekIndex: w++, phase: "Leader" });
    if (p.includeDeloadBetween) weeks.push({ weekIndex: w++, phase: "Deload" });
    for (let i = 0; i < p.anchorCycles * 3; i++) weeks.push({ weekIndex: w++, phase: "Anchor" });
    weeks.push({ weekIndex: w++, phase: "TMTest" });
    return weeks;
}

export function ProgressionProvider({ children }: { children: React.ReactNode }) {
    const [plan, setP] = useState<ProgressionPlan>(() => {
        try { return { ...DEFAULT, ...(JSON.parse(sessionStorage.getItem(KEY) || "{}")) }; }
        catch { return DEFAULT; }
    });
    useEffect(() => { sessionStorage.setItem(KEY, JSON.stringify(plan)); }, [plan]);

    const weeks = useMemo(() => buildWeeks(plan), [plan]);
    const totalWeeks = weeks.length;
    const setPlan = (p: Partial<ProgressionPlan>) => setP(prev => ({ ...prev, ...p }));

    return <CtxObj.Provider value={{ plan, setPlan, weeks, totalWeeks }}>{children}</CtxObj.Provider>;
}

export function useProgression() {
    const ctx = useContext(CtxObj);
    if (!ctx) throw new Error("useProgression must be used within ProgressionProvider");
    return ctx;
}
