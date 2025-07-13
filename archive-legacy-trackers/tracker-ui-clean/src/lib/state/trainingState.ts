import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MesocycleConfig, WeekPlan } from '../algorithms/mesocycleDesigner';

interface TrainingState {
  mesocycle: {
    config: MesocycleConfig | null;
    weeklyPlan: WeekPlan[];
    setConfig: (c: MesocycleConfig) => void;
    setWeeklyPlan: (w: WeekPlan[]) => void;
  };
}

export const useTrainingState = create<TrainingState>()(
  immer((set) => ({
    mesocycle: {
      config: null,
      weeklyPlan: [],
      setConfig: (c: MesocycleConfig) => set((state) => { 
        state.mesocycle.config = c; 
      }),
      setWeeklyPlan: (w: WeekPlan[]) => set((state) => { 
        state.mesocycle.weeklyPlan = w; 
      }),
    },
  }))
);
