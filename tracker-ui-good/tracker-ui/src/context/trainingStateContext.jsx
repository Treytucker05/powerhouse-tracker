import React, { createContext, useContext, useReducer } from 'react';
import { TRAINING_ACTIONS } from './trainingActions';

// Create context
export const TrainingStateContext = createContext();

// Initial state
const initialState = {
  profile: {
    name: '',
    experience: 'intermediate',
    dietPhase: 'maintenance'
  },
  mesocycle: null,
  currentWorkout: null,
  intelligence: {},
  volume: {}
};

// Reducer
function trainingStateReducer(state, action) {
  switch (action.type) {
    case TRAINING_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      };
    default:
      return state;
  }
}

// Provider component
export function TrainingStateProvider({ children }) {
  const [state, dispatch] = useReducer(trainingStateReducer, initialState);

  const value = {
    state,
    dispatch,
    // Add any methods you need here
  };

  return (
    <TrainingStateContext.Provider value={value}>
      {children}
    </TrainingStateContext.Provider>
  );
}

// Custom hook
export function useTrainingState() {
  const context = useContext(TrainingStateContext);
  if (!context) {
    throw new Error('useTrainingState must be used within a TrainingStateProvider');
  }
  return context;
}
