import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { TRAINING_ACTIONS } from './trainingActions';

// Create the context
const TrainingStateContext = createContext();

// Training state initial values
const initialState = {
  // User Profile
  currentPreset: null,
  experienceLevel: null,
  programDays: null,
  programSplit: null,
  sessionTime: null,
  
  // Volume Landmarks
  volumeLandmarks: {
    chest: { mv: 0, mev: 0, mav: 0, mrv: 0 },
    back: { mv: 0, mev: 0, mav: 0, mrv: 0 },
    shoulders: { mv: 0, mev: 0, mav: 0, mrv: 0 },
    arms: { mv: 0, mev: 0, mav: 0, mrv: 0 },
    legs: { mv: 0, mev: 0, mav: 0, mrv: 0 },
    abs: { mv: 0, mev: 0, mav: 0, mrv: 0 }
  },
  
  // Mesocycle Planning
  currentMesocycle: {
    length: null,
    currentWeek: 1,
    startDate: null,
    endDate: null,
    phase: 'accumulation',
    trainingGoal: null
  },
  
  // Weekly Programming
  weeklyProgram: {
    sessions: [],
    currentSession: null,
    plannedVolume: {},
    actualVolume: {},
    weeklyProgress: {}
  },
  
  // Daily Execution
  currentWorkout: {
    sessionId: null,
    startTime: null,
    exercises: [],
    currentExercise: null,
    isActive: false,
    completedSets: []
  },
  
  // Historical Data
  loggedSets: [],
  loggedSessions: [],
  fatigueScore: 0,
  mrvTable: {},
  
  // Deload Analysis
  deloadData: {
    lastAnalysis: null,
    fatigueSigns: [],
    recommendedAction: null,
    nextDeloadWeek: null
  },
  
  // Intelligence Layer
  intelligence: {
    isInitialized: false,
    optimizedLandmarks: {},
    adaptiveRecommendations: {},
    performanceMetrics: {},
    lastOptimization: null
  },
  
  // Data Export/Import
  dataManagement: {
    lastExport: null,
    lastBackup: null,
    autoBackupEnabled: false,
    exportHistory: []
  },
  
  // UI State
  ui: {
    activePhase: 1,
    currentView: 'setup',
    sidebarCollapsed: false,
    notifications: []
  },
  
  // AI Insights
  aiInsight: 'Welcome to PowerHouse Tracker! Track your progress and optimize your gains. 💪'
};

// Reducer function
function trainingStateReducer(state, action) {
  switch (action.type) {
    case TRAINING_ACTIONS.SET_PRESET:
      return {
        ...state,
        currentPreset: action.payload.preset,
        volumeLandmarks: action.payload.landmarks || state.volumeLandmarks
      };
      
    case TRAINING_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload
      };
      
    case TRAINING_ACTIONS.UPDATE_VOLUME_LANDMARKS:
      return {
        ...state,
        volumeLandmarks: {
          ...state.volumeLandmarks,
          ...action.payload
        }
      };
      
    case TRAINING_ACTIONS.SAVE_VOLUME_LANDMARKS:
      return {
        ...state,
        volumeLandmarks: action.payload,
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            { id: Date.now(), type: 'success', message: 'Volume landmarks saved successfully' }
          ]
        }
      };
      
    case TRAINING_ACTIONS.SETUP_MESOCYCLE:
      return {
        ...state,
        currentMesocycle: {
          ...state.currentMesocycle,
          ...action.payload,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + (action.payload.length * 7 * 24 * 60 * 60 * 1000)).toISOString()
        }
      };
      
    case TRAINING_ACTIONS.START_WORKOUT:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          sessionId: action.payload.sessionId,
          startTime: new Date().toISOString(),
          isActive: true,
          exercises: action.payload.exercises || []
        }
      };
        case TRAINING_ACTIONS.LOG_SET:
      // Emit volume:updated event for other components to listen
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('volume:updated', { 
          detail: { setData: action.payload } 
        }))
      }, 0)
      
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          completedSets: [
            ...state.currentWorkout.completedSets,
            action.payload
          ]
        }
      };
      
    case TRAINING_ACTIONS.UNDO_SET:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          completedSets: state.currentWorkout.completedSets.slice(0, -1)
        }
      };
      
    case TRAINING_ACTIONS.FINISH_WORKOUT:
      return {
        ...state,
        currentWorkout: {
          ...initialState.currentWorkout,
          sessionId: null,
          startTime: null,
          isActive: false
        },
        weeklyProgram: {
          ...state.weeklyProgram,
          actualVolume: {
            ...state.weeklyProgram.actualVolume,
            ...action.payload.completedVolume
          }
        }
      };
      
    case TRAINING_ACTIONS.ANALYZE_DELOAD:
      return {
        ...state,
        deloadData: {
          ...state.deloadData,
          lastAnalysis: new Date().toISOString(),
          ...action.payload
        }
      };
      
    case TRAINING_ACTIONS.INITIALIZE_INTELLIGENCE:
      return {
        ...state,
        intelligence: {
          ...state.intelligence,
          isInitialized: true,
          ...action.payload
        }
      };
      
    case TRAINING_ACTIONS.SET_ACTIVE_PHASE:
      return {
        ...state,
        ui: {
          ...state.ui,
          activePhase: action.payload
        }
      };
      
    case TRAINING_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            { id: Date.now(), ...action.payload }
          ]
        }
      };
      
    case TRAINING_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };
      
    case TRAINING_ACTIONS.UPDATE_STATE:
      return {
        ...state,
        ...action.payload
      };
      
    case TRAINING_ACTIONS.SEED_MOCK_DATA:
      return {
        ...state,
        loggedSets: action.payload.loggedSets,
        loggedSessions: action.payload.loggedSessions || state.loggedSessions,
        volumeLandmarks: {
          ...state.volumeLandmarks,
          ...action.payload.volumeLandmarks
        },
        mrvTable: {
          ...state.mrvTable,
          ...action.payload.mrvTable
        },
        fatigueScore: action.payload.fatigueScore || state.fatigueScore,
        cycleData: action.payload.cycleData || state.cycleData,
        currentMesocycle: {
          ...state.currentMesocycle,
          ...action.payload.currentMesocycle
        }
      };
      
    case TRAINING_ACTIONS.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
}

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

// Hook for accessing training state
export function useTrainingState() {
  return useContext(TrainingStateContext);
}

// ─── AI Insight selector (prevents build error) ───
export const useAI = () => {
  const state = useTrainingState();
  return state?.aiInsight ?? '';
};

export default TrainingStateProvider;
