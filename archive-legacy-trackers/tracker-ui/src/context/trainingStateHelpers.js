import { useContext } from 'react';
import { TrainingStateContext } from './TrainingStateContext';

// Custom hook
export function useTrainingState() {
  const context = useContext(TrainingStateContext);
  if (!context) {
    throw new Error('useTrainingState must be used within a TrainingStateProvider');
  }
  return context;
}
