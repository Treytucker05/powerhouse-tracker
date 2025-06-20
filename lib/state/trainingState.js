import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

function core(set) {
  return {
    user: { experienceLevel: 'intermediate' },
    volumeData: {},
    performanceHistory: {},
    updateVolume: (m, s) => set(state => ({ volumeData: { ...state.volumeData, [m]: s } })),
    recordPerformance: (m, sc) => set(s => ({ performanceHistory: { ...s.performanceHistory, [m]: [...(s.performanceHistory[m] || []), sc] } })),
    setUserLevel: lvl => set(s => ({ user: { ...s.user, experienceLevel: lvl } }))
  };
}

export const useTrainingState = create(
  import.meta.env.PROD
    ? persist(core, { name: 'powerhouse-training-state' })
    : devtools(persist(core, { name: 'powerhouse-training-state' }))
);
