import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  trainingAge: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: 'strength' | 'hypertrophy' | 'powerlifting' | 'general';
  daysPerWeek: number;
  sessionLength: number;
  priorityMuscles: string[];
  volumeTolerance: 'low' | 'moderate' | 'high';
  recoveryCapacity: number;
  dietPhase: 'cut' | 'bulk' | 'maintain';
  totalWeeks?: number;
  specialization?: {
    enabled: boolean;
    focusMuscles: string[];
    intensityLevel: 'moderate' | 'high';
  };
}

export interface Phase {
  id: string;
  title: string;
  type: 'accum' | 'deload' | 'maintain' | 'cut';
  lengthWeeks: number;
  diet: string;
  focus?: string[];
  volumeModifier: number;
  description?: string;
}

export interface MacroPlan {
  id: string;
  totalWeeks: number;
  phases: Phase[];
  createdAt: Date;
  planType: 'linear' | 'specialization';
}

export interface MacrocycleState {
  userProfile: Partial<UserProfile>;
  currentPlan: MacroPlan | null;
  wizardStep: number;
  isComplete: boolean;
  setProfile: (p: Partial<UserProfile>) => void;
  setPlan: (plan: MacroPlan) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetMacro: () => void;
}

interface TrainingState {
  macrocycle: MacrocycleState;
}

export const useTrainingState = create<TrainingState>()(
  persist(
    (set, get) => ({
      macrocycle: {
        userProfile: {},
        currentPlan: null,
        wizardStep: 1,
        isComplete: false,
        setProfile: (profile) =>
          set((state) => ({
            macrocycle: {
              ...state.macrocycle,
              userProfile: { ...state.macrocycle.userProfile, ...profile },
            },
          })),
        setPlan: (plan) =>
          set((state) => ({
            macrocycle: { ...state.macrocycle, currentPlan: plan },
          })),
        nextStep: () =>
          set((state) => ({
            macrocycle: {
              ...state.macrocycle,
              wizardStep: Math.min(state.macrocycle.wizardStep + 1, 5),
              isComplete: state.macrocycle.wizardStep === 4,
            },
          })),
        prevStep: () =>
          set((state) => ({
            macrocycle: {
              ...state.macrocycle,
              wizardStep: Math.max(state.macrocycle.wizardStep - 1, 1),
            },
          })),
        resetMacro: () =>
          set((state) => ({
            macrocycle: {
              userProfile: {},
              currentPlan: null,
              wizardStep: 1,
              isComplete: false,
              setProfile: state.macrocycle.setProfile,
              setPlan: state.macrocycle.setPlan,
              nextStep: state.macrocycle.nextStep,
              prevStep: state.macrocycle.prevStep,
              resetMacro: state.macrocycle.resetMacro,
            },
          })),
      },
    }),
    {
      name: 'ph-macro',
      partialize: (state) => ({ macrocycle: state.macrocycle }),
    }
  )
);
