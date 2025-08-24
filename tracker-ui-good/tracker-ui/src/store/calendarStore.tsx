import { create } from 'zustand';
type Day = { date: string; items?: string[] };
type CalendarState = { days: Day[]; add:(d:Day)=>void; };
export const useCalendar = create<CalendarState>((set)=>({
	days: [], add:(d)=>set(s=>({ days:[...s.days,d] }))
}));
export default useCalendar;
