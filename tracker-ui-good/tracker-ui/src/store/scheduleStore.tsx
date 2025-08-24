import React from 'react';
import { create } from 'zustand';

export type DaysPerWeek = 2 | 3 | 4;
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type RotationPreset =
    | '4D: SQ-BP-DL-PR'
    | '3D: SQ/BP • DL/PR • SQ/PR'
    | '2D: SQ/BP • DL/PR';

type ScheduleState = {
    // legacy consumer shape expects a nested `state`
    state: { daysPerWeek: DaysPerWeek; days: Weekday[]; rotation: RotationPreset };
    // top-level fields (new shape)
    daysPerWeek: DaysPerWeek;
    days: Weekday[];
    rotation: RotationPreset;
    // actions
    setDaysPerWeek: (d: DaysPerWeek) => void;
    toggleDay: (d: Weekday) => void;
    setRotation: (r: RotationPreset) => void;
    setDays: (days: Weekday[]) => void;
};

const ALL_DAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function defaultDays(n: DaysPerWeek): Weekday[] {
    if (n === 2) return ['Mon', 'Thu'];
    if (n === 3) return ['Mon', 'Wed', 'Fri'];
    return ['Mon', 'Tue', 'Thu', 'Fri'];
}

export const useSchedule = create<ScheduleState>((set, get) => ({
    state: { daysPerWeek: 4, days: defaultDays(4), rotation: '4D: SQ-BP-DL-PR' },
    daysPerWeek: 4,
    days: defaultDays(4),
    rotation: '4D: SQ-BP-DL-PR',

        setDaysPerWeek: (d) => set((state) => {
        let days = [...state.days];
        if (days.length > d) {
            // trim while preserving earlier-in-week preference
            const pref = [...ALL_DAYS];
            days = days.sort((a, b) => pref.indexOf(a) - pref.indexOf(b)).slice(0, d);
        } else if (days.length < d) {
            // add next available weekdays
            for (const wd of ALL_DAYS) {
                if (days.includes(wd)) continue;
                days.push(wd);
                if (days.length >= d) break;
            }
        }
        const next = { daysPerWeek: d as DaysPerWeek, days };
        return { ...next, state: { daysPerWeek: next.daysPerWeek, days: next.days, rotation: state.rotation } } as unknown as ScheduleState;
    }),

        toggleDay: (day) => set((state) => {
        const exists = state.days.includes(day);
        if (exists) {
                const days = state.days.filter((d) => d !== day) as Weekday[];
                return { days, state: { daysPerWeek: state.daysPerWeek, days, rotation: state.rotation } } as unknown as ScheduleState;
        } else {
            const next = [...state.days, day];
            // keep sorted by week order
            const sorted = next.sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
            // cap to daysPerWeek
                const days = sorted.slice(0, state.daysPerWeek) as Weekday[];
                return { days, state: { daysPerWeek: state.daysPerWeek, days, rotation: state.rotation } } as unknown as ScheduleState;
        }
    }),

        setRotation: (r) => set((s) => ({ rotation: r, state: { daysPerWeek: s.daysPerWeek, days: s.days, rotation: r } })),
        setDays: (days) => set((s) => ({ days, state: { daysPerWeek: s.daysPerWeek, days, rotation: s.rotation } })),
}));

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export default useSchedule;
