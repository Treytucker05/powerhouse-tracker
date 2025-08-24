import { create } from 'zustand';
type Sched = { selectedDate: string|null };
export const useSchedule = create<Sched>(()=>({ selectedDate: null }));
export default useSchedule;
