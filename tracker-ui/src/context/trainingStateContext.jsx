import React, { createContext, useReducer, useEffect } from 'react';
import { TRAINING_ACTIONS } from './trainingActions';
import { initialState, trainingStateReducer } from './trainingStateReducer';

// Create the context
const TrainingStateContext = createContext();

// Provider component
export function TrainingStateProvider({ children }) {
  const [state, dispatch] = useReducer(trainingStateReducer, initialState);

  // Sync with localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('powerhouse-training-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: TRAINING_ACTIONS.UPDATE_STATE, payload: parsed });
      } catch (error) {
        console.error('Failed to parse saved training state:', error);
      }
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('powerhouse-training-state', JSON.stringify(state));
  }, [state]);

  // Sync with legacy global state for backward compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.trainingState = state;
    }
  }, [state]);

  const value = {
    state,
    dispatch,

    // Convenience action creators
    setPreset: (preset, landmarks) => dispatch({
      type: TRAINING_ACTIONS.SET_PRESET,
      payload: { preset, landmarks }
    }),

    updateProfile: (profile) => dispatch({
      type: TRAINING_ACTIONS.UPDATE_PROFILE,
      payload: profile
    }),

    updateVolumeLandmarks: (landmarks) => dispatch({
      type: TRAINING_ACTIONS.UPDATE_VOLUME_LANDMARKS,
      payload: landmarks
    }),

    saveVolumeLandmarks: (landmarks) => dispatch({
      type: TRAINING_ACTIONS.SAVE_VOLUME_LANDMARKS,
      payload: landmarks
    }),

    setupMesocycle: (config) => dispatch({
      type: TRAINING_ACTIONS.SETUP_MESOCYCLE,
      payload: config
    }),

    startWorkout: (sessionId, exercises) => dispatch({
      type: TRAINING_ACTIONS.START_WORKOUT,
      payload: { sessionId, exercises }
    }),

    logSet: (setData) => dispatch({
      type: TRAINING_ACTIONS.LOG_SET,
      payload: setData
    }),

    undoSet: () => dispatch({
      type: TRAINING_ACTIONS.UNDO_SET
    }),

    finishWorkout: (completedVolume) => dispatch({
      type: TRAINING_ACTIONS.FINISH_WORKOUT,
      payload: { completedVolume }
    }),

    analyzeDeload: (analysis) => dispatch({
      type: TRAINING_ACTIONS.ANALYZE_DELOAD,
      payload: analysis
    }),

    initializeIntelligence: (config) => dispatch({
      type: TRAINING_ACTIONS.INITIALIZE_INTELLIGENCE,
      payload: config
    }),

    setActivePhase: (phase) => dispatch({
      type: TRAINING_ACTIONS.SET_ACTIVE_PHASE,
      payload: phase
    }),

    addNotification: (notification) => dispatch({
      type: TRAINING_ACTIONS.ADD_NOTIFICATION,
      payload: notification
    }),

    removeNotification: (id) => dispatch({
      type: TRAINING_ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    }),

    seedMockData: (mockData) => dispatch({
      type: TRAINING_ACTIONS.SEED_MOCK_DATA,
      payload: mockData
    })
  };

  return (
    <TrainingStateContext.Provider value={value}>
      {children}
    </TrainingStateContext.Provider>
  );
}

export default TrainingStateProvider;
