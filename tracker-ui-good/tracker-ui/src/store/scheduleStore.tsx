import React from 'react';
import { create } from 'zustand';

export type DaysPerWeek = 2 | 3 | 4;
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type RotationPreset =
	| '4D: SQ-BP-DL-PR'
	| '3D: SQ/BP • DL/PR • SQ/PR'
	| '2D: SQ/BP • DL/PR';

type ScheduleState = {
	daysPerWeek: DaysPerWeek;
	days: Weekday[];
	rotation: RotationPreset;
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
		return { daysPerWeek: d, days };
	}),

	toggleDay: (day) => set((state) => {
		const exists = state.days.includes(day);
		if (exists) {
			return { days: state.days.filter((d) => d !== day) } as Partial<ScheduleState> as ScheduleState;
		} else {
			const next = [...state.days, day];
			// keep sorted by week order
			const sorted = next.sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
			// cap to daysPerWeek
			return { days: sorted.slice(0, state.daysPerWeek) } as Partial<ScheduleState> as ScheduleState;
		}
	}),

	setRotation: (r) => set({ rotation: r }),
	setDays: (days) => set({ days }),
}));

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

export default useSchedule;
