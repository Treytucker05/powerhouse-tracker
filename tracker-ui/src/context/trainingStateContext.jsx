import React, { useReducer, useEffect, useContext } from 'react';
import { TrainingStateContext } from './TrainingStateContext.js';
import { TRAINING_ACTIONS } from './trainingActions';

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
  
  // Expanded Training Aggregates
  volumeTotals: {
    daily: {
      sets: 0,
      tonnage: 0,
      volumeLoad: 0,
      duration: 0,
      avgRIR: 0,
      muscleBreakdown: {}
    },
    weekly: {
      sets: 0,
      tonnage: 0,
      volumeLoad: 0,
      duration: 0,
      avgRIR: 0,
      muscleBreakdown: {},
      sessions: 0
    },
    block: {
      sets: 0,
      tonnage: 0,
      volumeLoad: 0,
      duration: 0,
      avgRIR: 0,
      muscleBreakdown: {},
      sessions: 0,
      weeks: 0
    },
    program: {
      sets: 0,
      tonnage: 0,
      volumeLoad: 0,
      duration: 0,
      avgRIR: 0,
      muscleBreakdown: {},
      sessions: 0,
      weeks: 0,
      blocks: 0
    }
  },
  
  // Body Metrics & Health Data
  bodyMetrics: {
    current: {
      weight: null,
      bodyFat: null,
      muscleMass: null,
      measurements: {
        chest: null,
        waist: null,
        arms: null,
        thighs: null,
        shoulders: null
      },
      vitals: {
        restingHR: null,
        bloodPressure: { systolic: null, diastolic: null },
        sleep: { duration: 0, quality: 0 },
        stress: 0
      }
    },
    daily: {
      weight: null,
      steps: 0,
      calories: 0,
      water: 0,
      heartRate: { avg: null, max: null, resting: null },
      recovery: 0
    },
    history: {
      weight: [],
      bodyFat: [],
      measurements: {},
      vitals: {}
    }
  },
  
  // Performance Metrics & 1RMs
  performanceMetrics: {
    oneRepMax: {
      squat: null,
      bench: null,
      deadlift: null,
      overheadPress: null,
      pullUp: null,
      dip: null,
      lastUpdated: null
    },
    strengthRatios: {
      squatToBench: 0,
      deadliftToSquat: 0,
      pushToPull: 0
    },
    volumeProgression: {
      weekly: [],
      monthly: [],
      blocks: []
    },
    intensityMetrics: {
      avgRPE: 0,
      avgRIR: 0,
      volumeAtIntensity: {},
      peakIntensity: 0
    },
    performanceTests: {
      maxPushUps: null,
      maxPullUps: null,
      plankTime: null,
      vo2Max: null,
      lastTested: null
    }
  },
  
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
  }
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

// Enhanced selector hooks for expanded data model
export function useVolumeTotals() {
  const { state } = useTrainingState();
  return {
    daily: state.volumeTotals.daily,
    weekly: state.volumeTotals.weekly,
    block: state.volumeTotals.block,
    program: state.volumeTotals.program,
    
    // Computed values
    dailyProgress: state.volumeTotals.daily.sets / (state.volumeTotals.weekly.sets / 7) || 0,
    weeklyProgress: state.volumeTotals.weekly.sets / (state.volumeTotals.block.sets / 4) || 0,
    blockProgress: state.volumeTotals.block.sets / (state.volumeTotals.program.sets / 4) || 0
  };
}

export function useBodyMetrics() {
  const { state } = useTrainingState();
  return {
    current: state.bodyMetrics.current,
    daily: state.bodyMetrics.daily,
    history: state.bodyMetrics.history,
    
    // Computed trends
    weightTrend: computeTrend(state.bodyMetrics.history.weight),
    bodyFatTrend: computeTrend(state.bodyMetrics.history.bodyFat),
    
    // Health score calculation
    healthScore: calculateHealthScore(state.bodyMetrics),
    
    // Daily targets vs actual
    dailyTargets: {
      steps: { target: 10000, actual: state.bodyMetrics.daily.steps },
      water: { target: 3500, actual: state.bodyMetrics.daily.water },
      calories: { target: 2200, actual: state.bodyMetrics.daily.calories }
    }
  };
}

export function usePerformanceMetrics() {
  const { state } = useTrainingState();
  return {
    oneRepMax: state.performanceMetrics.oneRepMax,
    strengthRatios: state.performanceMetrics.strengthRatios,
    volumeProgression: state.performanceMetrics.volumeProgression,
    intensityMetrics: state.performanceMetrics.intensityMetrics,
    performanceTests: state.performanceMetrics.performanceTests,
    
    // Computed strength standards
    strengthStandards: calculateStrengthStandards(
      state.performanceMetrics.oneRepMax,
      state.bodyMetrics.current.weight
    ),
    
    // Training efficiency metrics
    efficiencyScore: calculateEfficiencyScore(state.performanceMetrics),
    
    // Progressive overload tracking
    overloadTrend: calculateOverloadTrend(state.performanceMetrics.volumeProgression)
  };
}

// Helper functions for computations
function computeTrend(dataArray) {
  if (!dataArray || dataArray.length < 2) return 'stable';
  
  const recent = dataArray.slice(-5);
  const avg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
  const firstValue = recent[0].value;
  const lastValue = recent[recent.length - 1].value;
  
  const change = ((lastValue - firstValue) / firstValue) * 100;
  
  if (change > 2) return 'increasing';
  if (change < -2) return 'decreasing';
  return 'stable';
}

function calculateHealthScore(bodyMetrics) {
  let score = 0;
  let factors = 0;
  
  // Weight stability (±2% from baseline)
  if (bodyMetrics.current.weight) {
    score += 25;
    factors += 1;
  }
  
  // Sleep quality
  if (bodyMetrics.current.vitals.sleep.quality >= 7) {
    score += 25;
    factors += 1;
  }
  
  // Daily activity
  if (bodyMetrics.daily.steps >= 8000) {
    score += 25;
    factors += 1;
  }
  
  // Hydration
  if (bodyMetrics.daily.water >= 2500) {
    score += 25;
    factors += 1;
  }
  
  return factors > 0 ? Math.round(score / factors) : 0;
}

function calculateStrengthStandards(oneRepMax, bodyWeight) {
  if (!bodyWeight) return {};
  
  return {
    squat: {
      ratio: oneRepMax.squat ? (oneRepMax.squat / bodyWeight).toFixed(2) : null,
      standard: getStrengthStandard(oneRepMax.squat / bodyWeight, 'squat')
    },
    bench: {
      ratio: oneRepMax.bench ? (oneRepMax.bench / bodyWeight).toFixed(2) : null,
      standard: getStrengthStandard(oneRepMax.bench / bodyWeight, 'bench')
    },
    deadlift: {
      ratio: oneRepMax.deadlift ? (oneRepMax.deadlift / bodyWeight).toFixed(2) : null,
      standard: getStrengthStandard(oneRepMax.deadlift / bodyWeight, 'deadlift')
    }
  };
}

function getStrengthStandard(ratio, lift) {
  const standards = {
    squat: { beginner: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 },
    bench: { beginner: 0.75, intermediate: 1.25, advanced: 1.75, elite: 2.25 },
    deadlift: { beginner: 1.25, intermediate: 1.75, advanced: 2.25, elite: 2.75 }
  };
  
  if (!ratio || !standards[lift]) return 'unknown';
  
  const thresholds = standards[lift];
  if (ratio >= thresholds.elite) return 'elite';
  if (ratio >= thresholds.advanced) return 'advanced';
  if (ratio >= thresholds.intermediate) return 'intermediate';
  if (ratio >= thresholds.beginner) return 'beginner';
  return 'novice';
}

function calculateEfficiencyScore(performanceMetrics) {
  // Placeholder - could include volume efficiency, strength gains per session, etc.
  return Math.round(Math.random() * 100); // TODO: Implement proper calculation
}

function calculateOverloadTrend(volumeProgression) {
  // Placeholder - analyze progressive overload over time
  return 'positive'; // TODO: Implement proper calculation
}

export default TrainingStateProvider;
