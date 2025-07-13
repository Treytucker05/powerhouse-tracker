import { createContext } from 'react';

export const TrainingStateContext = createContext();

// Default/initial state
const initialState = {
  aiInsight: '',   // AI-generated training insights
};

// Simple state tracker hook (if useTracker doesn't exist elsewhere)
const useTracker = (selector) => {
  // This would normally use context or state management
  // For now, return the selector applied to initial state
  return selector ? selector(initialState) : initialState;
};

// AI selector
export const useAI = () => useTracker(s => s.aiInsight ?? '');

// Barrel re-export so both filenames work
export {
  TrainingStateProvider,
} from "./trainingStateContext.jsx";
export { default } from "./trainingStateContext.jsx";

// Export hooks from the separate hooks file
export {
  useTrainingState,
} from "./trainingStateHooks.js";
