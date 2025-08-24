export type LiftId = 'squat' | 'bench' | 'deadlift' | 'press';
export type Step1State = { tmPct?: number; units?: 'lb' | 'kg'; rounding?: number; lifts?: Record<LiftId, number>; };
export const step1_fundamentals = (s: Step1State = {}) => {
    const tmPct = s.tmPct ?? 0.9;
    const rounding = s.rounding ?? 5;
    const lifts = s.lifts ?? { squat: 0, bench: 0, deadlift: 0, press: 0 };
    return { tmPct, rounding, lifts };
};
