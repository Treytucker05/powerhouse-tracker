import { createContext } from 'react';

export const TrainingStateContext = createContext();

// Barrel re-export so both filenames work
export {
  TrainingStateProvider,
  useTrainingState,
} from "./trainingStateContext.jsx";
export { default } from "./trainingStateContext.jsx";
