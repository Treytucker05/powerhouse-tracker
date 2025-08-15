import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgramV2 } from "../methods/531/contexts/ProgramContextV2.jsx"; // real context (JSX module)

/** ========= Types (from spec) ========= **/
type WeeklyOption = "opt1" | "opt2"; // opt1: 65/75/85, 70/80/90, 75/85/95 ; opt2 per book, p.22
type DeadliftStyle = "dead_stop" | "touch_and_go"; // book p.18–19
type RoundingMode = "up" | "nearest" | "down";
type Units = "lb" | "kg";
type Schedule = "4_day" | "3_day" | "2_day" | "1_day";
type LiftKey = "press" | "bench" | "squat" | "deadlift";

type SetRow = {
    set: 1 | 2 | 3;
    pct_of_tm: number;  // 0.40–0.95
    reps: string;       // "5","3","1" or "5+|3+|1+"
    amrap: boolean;
    load_rounded: number; // derived at render
};

type WeekPlan = { sets: SetRow[] };
type WarmupRow = { pct_of_tm: number; reps: number; load_rounded: number };

type DayPlan = {
    lift: LiftKey;
    warmup: WarmupRow[]; // 40/50/60 x 5/5/3 (book p.30)
    weeks: {
        w1: WeekPlan; w2: WeekPlan; w3: WeekPlan; w4_deload: WeekPlan;
    };
    supplemental?: {
        mode: "bbb" | "fsl" | "ssl" | null;
        sets?: number; reps?: number; pct_of_tm?: number | null;
        load_rounded?: number | null;
    };
    assistance: Array<{
        name: string; sets?: number; reps?: number; bodyweight?: boolean;
        target_min_reps?: number;
    }>;
    conditioning_note?: string;
    // tonnage is computed per week; this field is optional cache
    tonnage?: { main: number; supplemental: number; total: number };
};

type ReviewState = {
    meta: {
        weekly_option: WeeklyOption;
        amrap_last_set: true;
        warmup_preset: "standard_40_50_60";
        units: Units;
        rounding: { mode: RoundingMode; step: number }; // 5 lb | 2.5 kg
        deadlift_rep_style: DeadliftStyle;
        schedule: Schedule;
        progression: { upper_inc: number; lower_inc: number }; // +5/+10 after cycle (book p.24–28)
        template: "bbb" | "triumvirate" | "periodization_bible" | "bodyweight" | "jack_shit";
    };
    tm_by_lift: Record<LiftKey, number>; // Training Max = 90% 1RM (book p.21–22)
    days: Record<LiftKey, DayPlan>;
};

/** ========= Utilities ========= **/
function roundToStep(n: number, step: number, mode: RoundingMode): number {
    const q = n / step;
    if (mode === "up") return Math.ceil(q) * step;
    if (mode === "down") return Math.floor(q) * step;
    return Math.round(q) * step;
}
function loadPct(tm: number, pct: number, step: number, mode: RoundingMode) {
    return roundToStep(tm * pct, step, mode);
}
const LIFT_LABEL: Record<LiftKey, string> = {
    press: "Overhead Press",
    bench: "Bench Press",
    squat: "Back Squat",
    deadlift: "Deadlift",
};

/** ========= Real state adapter (ProgramV2 -> ReviewState) ========= **/
function useReviewStateFromProgram(): ReviewState {
    const { state } = useProgramV2();
    const tms: Record<LiftKey, number> = {
        press: Number(state?.lifts?.press?.tm) || 0,
        bench: Number(state?.lifts?.bench?.tm) || 0,
        squat: Number(state?.lifts?.squat?.tm) || 0,
        deadlift: Number(state?.lifts?.deadlift?.tm) || 0,
    };
    const weekly_option: WeeklyOption = (state?.loadingOption === 2 || state?.loading?.option === 2) ? 'opt2' : 'opt1';
    const roundingModeMap: Record<string, RoundingMode> = { ceil: 'up', floor: 'down', nearest: 'nearest' };
    const units: Units = state?.units === 'kg' ? 'kg' : 'lb';
    const roundingMode = roundingModeMap[state?.rounding] || 'nearest';
    const roundingStep = units === 'kg' ? 2.5 : 5; // TODO: map custom increment if stored separately
    const meta: ReviewState['meta'] = {
        weekly_option,
        amrap_last_set: true,
        warmup_preset: 'standard_40_50_60',
        units,
        rounding: { mode: roundingMode, step: roundingStep },
        deadlift_rep_style: state?.deadliftRepStyle === 'touch_and_go' ? 'touch_and_go' : 'dead_stop',
        schedule: (state?.schedule?.frequency === 3 ? '3_day' : state?.schedule?.frequency === 2 ? '2_day' : state?.schedule?.frequency === 1 ? '1_day' : '4_day'),
        progression: { upper_inc: 5, lower_inc: 10 },
        template: (state?.templateKey === 'bbb50' || state?.templateKey === 'bbb60' || state?.supplemental?.strategy === 'bbb') ? 'bbb' : (state?.templateKey || 'triumvirate') as any,
    };
    const schemeOpt1 = [
        [0.65, 0.75, 0.85],
        [0.70, 0.80, 0.90],
        [0.75, 0.85, 0.95],
        [0.40, 0.50, 0.60],
    ];
    const schemeOpt2 = [
        [0.75, 0.80, 0.85],
        [0.80, 0.85, 0.90],
        [0.85, 0.90, 0.95],
        [0.40, 0.50, 0.60],
    ];
    const scheme = weekly_option === 'opt2' ? schemeOpt2 : schemeOpt1;
    const repPatterns = [
        ['5', '5', '5+'],
        ['3', '3', '3+'],
        ['5', '3', '1+'],
        ['5', '5', '5'],
    ];
    function buildWeeks(): { w1: WeekPlan; w2: WeekPlan; w3: WeekPlan; w4_deload: WeekPlan } {
        function mk(weekIdx: number): WeekPlan {
            return {
                sets: scheme[weekIdx].map((pct, i) => ({
                    set: (i + 1) as 1 | 2 | 3,
                    pct_of_tm: pct,
                    reps: repPatterns[weekIdx][i],
                    amrap: weekIdx < 3 && i === 2,
                    load_rounded: 0,
                })),
            };
        }
        return { w1: mk(0), w2: mk(1), w3: mk(2), w4_deload: mk(3) };
    }
    function buildDay(lift: LiftKey, tm: number): DayPlan {
        return {
            lift,
            warmup: [
                { pct_of_tm: 0.40, reps: 5, load_rounded: 0 },
                { pct_of_tm: 0.50, reps: 5, load_rounded: 0 },
                { pct_of_tm: 0.60, reps: 3, load_rounded: 0 },
            ],
            weeks: buildWeeks(),
            supplemental: state?.supplemental?.strategy === 'bbb' ? {
                mode: 'bbb',
                sets: 5,
                reps: 10,
                pct_of_tm: (Number(state?.supplemental?.percentOfTM) || 50) / 100,
                load_rounded: 0,
            } : { mode: null },
            assistance: [], // TODO: map from template/custom assistance
            conditioning_note: state?.conditioning?.note || 'Prowler pushes or hill sprints 2–3x weekly. Progress gradually.',
        };
    }
    const days: Record<LiftKey, DayPlan> = {
        press: buildDay('press', tms.press),
        deadlift: buildDay('deadlift', tms.deadlift),
        bench: buildDay('bench', tms.bench),
        squat: buildDay('squat', tms.squat),
    };
    return { meta, tm_by_lift: tms, days };
}

/** ========= Page ========= **/
export default function BuilderReviewPage() {
    const state = useReviewStateFromProgram();
    const navigate = useNavigate();

    const scheduleOrder: LiftKey[] = ["press", "deadlift", "bench", "squat"];

    function startCycle(payload: ReviewState) {
        // TODO: integrate with persistActiveCycle for unified active cycle persistence.
        try { localStorage.setItem("ph.activePlan.v2", JSON.stringify(payload)); } catch { /* ignore */ }
        navigate("/train-today");
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 text-neutral-900">
            <HeaderSummary meta={state.meta} />
            <section className="mt-6">
                <TMTable tmByLift={state.tm_by_lift} />
            </section>

            <section className="mt-8 space-y-6">
                {scheduleOrder.map((k) => (
                    <DayCard key={k} lift={k} day={state.days[k]} tm={state.tm_by_lift[k]} meta={state.meta} />
                ))}
            </section>

            <FooterActions
                onBack={() => navigate(-1)}
                onStartCycle={() => startCycle(state)}
            />
        </main>
    );
}

/** ========= Header ========= **/
function HeaderSummary({ meta }: { meta: ReviewState["meta"] }) {
    return (
        <header className="mb-4">
            <h1 className="text-2xl font-semibold">Final Review — 5/3/1 Plan</h1>
            <div className="mt-3 flex flex-wrap gap-2">
                <Badge>Option: {meta.weekly_option === "opt1" ? "1 (65/75/85 ▶︎ 95)" : "2 (75/80/85 ▶︎ 95)"}</Badge>
                <Badge>AMRAP: On (Deload Off)</Badge>
                <Badge>Warm‑up: 40/50/60</Badge>
                <Badge>Units/Rounding: {meta.units}, {meta.rounding.mode} ±{meta.rounding.step}</Badge>
                <Badge>Deadlift: {meta.deadlift_rep_style === "dead_stop" ? "Dead‑stop" : "Touch‑and‑go"}</Badge>
                <Badge>Schedule: 4‑day</Badge>
                <Badge>Next Cycle TM: +{meta.progression.upper_inc} / +{meta.progression.lower_inc}</Badge>
            </div>
        </header>
    );
}

/** ========= TM Table ========= **/
function TMTable({ tmByLift }: { tmByLift: Record<LiftKey, number> }) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Training Maxes (90% of 1RM)</h2>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-4">
                {(["press", "bench", "squat", "deadlift"] as LiftKey[]).map((k) => (
                    <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="font-medium">{LIFT_LABEL[k]}</span>
                        <span className="tabular-nums">{tmByLift[k]}{/* units label kept minimal */}</span>
                    </div>
                ))}
            </div>
            <p className="mt-3 text-xs text-neutral-500">
                All working percentages are based on <strong>Training Max (TM)</strong>, not true 1RM. {/* book p.21–22 */}
            </p>
        </div>
    );
}

/** ========= Day Card (collapsible) ========= **/
function DayCard({
    lift, day, tm, meta,
}: { lift: LiftKey; day: DayPlan; tm: number; meta: ReviewState["meta"] }) {

    const rounding = meta.rounding;
    const computedWarmup = day.warmup.map(w => ({
        ...w, load_rounded: loadPct(tm, w.pct_of_tm, rounding.step, rounding.mode),
    }));

    // simple tabs
    type WK = "w1" | "w2" | "w3" | "w4_deload";
    const [wk, setWk] = useState<WK>("w1");

    const weeksArr: { key: WK; label: string }[] = [
        { key: "w1", label: "Week 1" },
        { key: "w2", label: "Week 2" },
        { key: "w3", label: "Week 3" },
        { key: "w4_deload", label: "Deload" },
    ];

    const computedWeek = useMemo(() => {
        const raw = day.weeks[wk];
        return {
            sets: raw.sets.map(s => ({
                ...s,
                load_rounded: loadPct(tm, s.pct_of_tm, rounding.step, rounding.mode),
            })),
        };
    }, [wk, day.weeks, tm, rounding]);

    const supplementalLoad = day.supplemental?.pct_of_tm
        ? loadPct(tm, day.supplemental.pct_of_tm, rounding.step, rounding.mode)
        : day.supplemental?.load_rounded ?? null;

    const tonnage = useMemo(() => {
        const main = computedWeek.sets.reduce((sum, s, i) => {
            // tonnage uses required reps (5/3/1), AMRAP extras are not assumed.
            const r = s.reps.includes("+") ? parseInt(s.reps) : parseInt(s.reps);
            return sum + r * s.load_rounded;
        }, 0);
        const supp = supplementalLoad && day.supplemental?.sets && day.supplemental?.reps
            ? supplementalLoad * day.supplemental.sets * day.supplemental.reps
            : 0;
        return { main, supplemental: supp, total: main + supp };
    }, [computedWeek, supplementalLoad, day.supplemental]);

    return (
        <details className="group rounded-2xl border bg-white p-6 shadow-sm" open>
            <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="text-lg font-semibold">Day — {LIFT_LABEL[lift]}</h3>
                <span className="text-xs text-neutral-500">TM {tm}</span>
            </summary>

            {/* Warm-ups */}
            <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Warm‑up (40/50/60 × 5/5/3)</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left">
                            <th className="py-1 pr-2">Set</th><th className="py-1 pr-2">% of TM</th><th className="py-1 pr-2">Reps</th><th className="py-1">Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {computedWarmup.map((w, idx) => (
                            <tr key={idx} className={idx % 2 ? "bg-neutral-50" : ""}>
                                <td className="py-1 pr-2">{idx + 1}</td>
                                <td className="py-1 pr-2">{Math.round(w.pct_of_tm * 100)}%</td>
                                <td className="py-1 pr-2">{w.reps}</td>
                                <td className="py-1 tabular-nums">{w.load_rounded}{meta.units}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Main Work */}
            <div className="mt-5">
                <div className="mb-2 flex gap-2">
                    {weeksArr.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setWk(t.key)}
                            className={`rounded-full border px-3 py-1 text-xs ${wk === t.key ? "bg-neutral-900 text-white" : "bg-white"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left">
                            <th className="py-1 pr-2">Set</th><th className="py-1 pr-2">% of TM</th><th className="py-1 pr-2">Reps</th><th className="py-1 pr-2">Note</th><th className="py-1">Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {computedWeek.sets.map((s, idx) => (
                            <tr key={idx} className={idx % 2 ? "bg-neutral-50" : ""}>
                                <td className="py-1 pr-2">{s.set}</td>
                                <td className="py-1 pr-2">{Math.round(s.pct_of_tm * 100)}%</td>
                                <td className="py-1 pr-2">{s.reps}</td>
                                <td className="py-1 pr-2">{s.amrap ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs">AMRAP</span> : "—"}</td>
                                <td className="py-1 tabular-nums">{s.load_rounded}{meta.units}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Supplemental */}
            <div className="mt-5">
                <h4 className="mb-1 text-sm font-medium">Supplemental</h4>
                {!day.supplemental || day.supplemental.mode === null ? (
                    <p className="text-sm text-neutral-600">No supplemental today (Jack Shit).</p>
                ) : day.supplemental.mode === "bbb" ? (
                    <p className="text-sm">
                        BBB — <span className="font-medium">{day.supplemental.sets}×{day.supplemental.reps}</span> @{" "}
                        {day.supplemental.pct_of_tm ? `${Math.round(day.supplemental.pct_of_tm * 100)}% TM` : ""}{" "}
                        {supplementalLoad ? <span className="tabular-nums">→ {supplementalLoad}{meta.units}</span> : null}
                    </p>
                ) : (
                    <p className="text-sm">
                        {day.supplemental.mode.toUpperCase()} — {day.supplemental.sets}×{day.supplemental.reps} @ {Math.round((day.supplemental.pct_of_tm ?? 0) * 100)}%
                    </p>
                )}
            </div>

            {/* Assistance */}
            <div className="mt-5">
                <h4 className="mb-1 text-sm font-medium">Assistance</h4>
                <ul className="list-disc pl-5 text-sm">
                    {day.assistance.map((a, i) => (
                        <li key={i}>
                            <span className="font-medium">{a.name}</span>{" "}
                            {a.bodyweight && a.target_min_reps ? (<>— ≥{a.target_min_reps} reps (bodyweight)</>) :
                                a.sets && a.reps ? (<>— {a.sets}×{a.reps}</>) : null}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conditioning */}
            <div className="mt-4 text-sm text-neutral-700">
                <strong>Conditioning:</strong> {day.conditioning_note}
            </div>

            {/* Tonnage */}
            <div className="mt-4 text-sm">
                <span className="mr-3">Tonnage — </span>
                <span className="mr-2">Main: <span className="tabular-nums">{tonnage.main}</span></span>
                <span className="mr-2">Supplemental: <span className="tabular-nums">{tonnage.supplemental}</span></span>
                <span>Total: <span className="tabular-nums">{tonnage.total}</span></span>
            </div>
        </details>
    );
}

/** ========= Small UI bits ========= **/
function Badge({ children }: { children: React.ReactNode }) {
    return <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs">{children}</span>;
}

function FooterActions({ onBack, onStartCycle }: { onBack: () => void; onStartCycle: () => void }) {
    return (
        <footer className="sticky bottom-0 mt-10 flex justify-between gap-3 border-t bg-white/90 p-4 backdrop-blur">
            <button onClick={onBack} className="rounded-lg border px-4 py-2">Back</button>
            <button
                onClick={onStartCycle}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
                Start Cycle
            </button>
        </footer>
    );
}
