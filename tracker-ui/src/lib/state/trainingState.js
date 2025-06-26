import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultState = {
  currentWeek: 3,
  phase: 'Accumulation',
  systemicFatigue: 0.65,
  muscleVolumes: {
    chest: { current: 14, mev: 10, mrv: 22 },
    back: { current: 18, mev: 12, mrv: 25 },
  },
};

export const useDashboardState = create(
  persist(
    (set) => ({
      ...defaultState,
      refreshDashboard: () => {
        // stub: in real app, fetch from Supabase
        set({ ...defaultState });
      },
    }),
    {
      name: 'dashboard-state',
    }
  )
);
