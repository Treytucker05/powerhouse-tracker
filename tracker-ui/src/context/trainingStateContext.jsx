import { createContext, useContext, useReducer } from 'react';

const TrainingStateContext = createContext();

const initialState = {
  currentMesocycle: {
    block: 1,
    weeks: 4,
    currentWeek: 1,
    focus: 'volume',
    phase: 'accumulation'
  },
  weeklyVolume: {},
  volumeLandmarks: {},
  workouts: [],
  activeSession: null
};

function trainingStateReducer(state, action) {
  switch (action.type) {
    case 'SETUP_MESOCYCLE':
      return {
        ...state,
        currentMesocycle: { ...action.payload, currentWeek: 1, block: (state.currentMesocycle?.block || 0) + 1 }
      };
    case 'UPDATE_WEEKLY_VOLUME':
      return {
        ...state,
        weeklyVolume: { ...state.weeklyVolume, ...action.payload }
      };
    case 'SET_VOLUME_LANDMARKS':
      return {
        ...state,
        volumeLandmarks: { ...state.volumeLandmarks, ...action.payload }
      };
    case 'START_SESSION':
      return {
        ...state,
        activeSession: action.payload
      };
    case 'END_SESSION':
      return {
        ...state,
        activeSession: null,
        workouts: [...state.workouts, action.payload]
      };
    default:
      return state;
  }
}

export function TrainingStateProvider({ children }) {
  const [state, dispatch] = useReducer(trainingStateReducer, initialState);

  const setupMesocycle = (config) => {
    dispatch({ type: 'SETUP_MESOCYCLE', payload: config });
  };

  const updateWeeklyVolume = (volumeData) => {
    dispatch({ type: 'UPDATE_WEEKLY_VOLUME', payload: volumeData });
  };

  const setVolumeLandmarks = (landmarks) => {
    dispatch({ type: 'SET_VOLUME_LANDMARKS', payload: landmarks });
  };

  const startSession = (sessionData) => {
    dispatch({ type: 'START_SESSION', payload: sessionData });
  };

  const endSession = (workoutData) => {
    dispatch({ type: 'END_SESSION', payload: workoutData });
  };

  const value = {
    state,
    setupMesocycle,
    updateWeeklyVolume,
    setVolumeLandmarks,
    startSession,
    endSession
  };

  return (
    <TrainingStateContext.Provider value={value}>
      {children}
    </TrainingStateContext.Provider>
  );
}

export function useTrainingState() {
  const context = useContext(TrainingStateContext);
  if (!context) {
    throw new Error('useTrainingState must be used within a TrainingStateProvider');
  }
  return context;
}

export { TrainingStateContext };
