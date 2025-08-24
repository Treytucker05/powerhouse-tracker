import React from 'react';
import { create } from 'zustand';
type Sched = { selectedDate: string | null };
export const useSchedule = create<Sched>(() => ({ selectedDate: null }));
export function ScheduleProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export default useSchedule;
