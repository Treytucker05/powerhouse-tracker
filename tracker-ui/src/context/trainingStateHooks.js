// Training state hooks and utilities
import { useContext } from 'react';
import { TrainingStateContext } from './trainingStateContext';

// Hook for accessing training state
export function useTrainingState() {
    return useContext(TrainingStateContext);
}

// AI Insight selector (prevents build error)
export const useAI = () => {
    const state = useTrainingState();
    return state?.aiInsight ?? '';
};
