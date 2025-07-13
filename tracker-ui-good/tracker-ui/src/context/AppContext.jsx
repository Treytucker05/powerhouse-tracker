import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/api/supabaseClient';
import { APP_ACTIONS } from './appActions';
import { 
  syncToSupabase, 
  syncToLocalStorage, 
  loadFromLocalStorage, 
  loadFromSupabase, 
  generateRecommendation 
} from './appHelpers';

// Create context
const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  assessment: null,
  currentProgram: null,
  timeline: [],
  loading: {
    user: false,
    assessment: false,
    program: false,
    timeline: false
  },
  errors: {}
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case APP_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: { ...state.loading, user: false }
      };

    case APP_ACTIONS.CLEAR_USER:
      return {
        ...state,
        user: null,
        assessment: null,
        currentProgram: null,
        timeline: [],
        loading: { ...state.loading, user: false }
      };

    case APP_ACTIONS.UPDATE_ASSESSMENT:
      return {
        ...state,
        assessment: { ...state.assessment, ...action.payload },
        loading: { ...state.loading, assessment: false }
      };

    case APP_ACTIONS.SET_ASSESSMENT:
      return {
        ...state,
        assessment: action.payload,
        loading: { ...state.loading, assessment: false }
      };

    case APP_ACTIONS.CLEAR_ASSESSMENT:
      return {
        ...state,
        assessment: null,
        loading: { ...state.loading, assessment: false }
      };

    case APP_ACTIONS.SAVE_PROGRAM:
      return {
        ...state,
        currentProgram: action.payload,
        loading: { ...state.loading, program: false }
      };

    case APP_ACTIONS.UPDATE_PROGRAM:
      return {
        ...state,
        currentProgram: { ...state.currentProgram, ...action.payload },
        loading: { ...state.loading, program: false }
      };

    case APP_ACTIONS.CLEAR_PROGRAM:
      return {
        ...state,
        currentProgram: null,
        loading: { ...state.loading, program: false }
      };

    case APP_ACTIONS.SET_TIMELINE:
      return {
        ...state,
        timeline: action.payload,
        loading: { ...state.loading, timeline: false }
      };

    case APP_ACTIONS.ADD_TIMELINE_EVENT:
      return {
        ...state,
        timeline: [...state.timeline, action.payload],
        loading: { ...state.loading, timeline: false }
      };

    case APP_ACTIONS.UPDATE_TIMELINE_EVENT:
      return {
        ...state,
        timeline: state.timeline.map(event => 
          event.id === action.payload.id ? { ...event, ...action.payload } : event
        ),
        loading: { ...state.loading, timeline: false }
      };

    case APP_ACTIONS.REMOVE_TIMELINE_EVENT:
      return {
        ...state,
        timeline: state.timeline.filter(event => event.id !== action.payload),
        loading: { ...state.loading, timeline: false }
      };

    case APP_ACTIONS.CLEAR_TIMELINE:
      return {
        ...state,
        timeline: [],
        loading: { ...state.loading, timeline: false }
      };

    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };

    case APP_ACTIONS.CLEAR_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: false }
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.error }
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: null }
      };

    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'user', value: true } });
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          dispatch({ type: APP_ACTIONS.CLEAR_USER });
          return;
        }

        if (user) {
          dispatch({ type: APP_ACTIONS.SET_USER, payload: user });
          await loadUserData(user.id);
        } else {
          loadLocalData();
          dispatch({ type: APP_ACTIONS.CLEAR_USER });
        }
      } catch (error) {
        console.error('User initialization error:', error);
        loadLocalData();
        dispatch({ type: APP_ACTIONS.CLEAR_USER });
      }
    };

    initializeUser();
  }, []);

  // Load user data from Supabase
  const loadUserData = async (userId) => {
    try {
      // Load assessment
      const assessment = await loadFromSupabase('user_assessments', userId);
      if (assessment) {
        dispatch({ type: APP_ACTIONS.SET_ASSESSMENT, payload: assessment });
      }

      // Load program
      const program = await loadFromSupabase('user_programs', userId);
      if (program) {
        dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: program });
      }

      // Load timeline
      const timelineData = await loadFromSupabase('user_timelines', userId);
      if (timelineData && timelineData.timeline) {
        dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: timelineData.timeline });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      loadLocalData();
    }
  };

  // Load data from localStorage
  const loadLocalData = () => {
    const assessment = loadFromLocalStorage('userProfile');
    if (assessment) {
      dispatch({ type: APP_ACTIONS.SET_ASSESSMENT, payload: assessment });
    }

    const program = loadFromLocalStorage('currentProgram');
    if (program) {
      dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: program });
    }

    const timeline = loadFromLocalStorage('userTimeline');
    if (timeline) {
      dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: timeline });
    }
  };

  // Action creators
  const updateAssessment = async (assessmentData) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'assessment', value: true } });
    
    try {
      // Generate recommendation if we have enough data
      let finalAssessmentData = { ...assessmentData };
      if (assessmentData.primaryGoal && assessmentData.trainingExperience && assessmentData.timeline) {
        finalAssessmentData.recommendedSystem = generateRecommendation(
          assessmentData.primaryGoal,
          assessmentData.trainingExperience,
          assessmentData.timeline
        );
      }

      finalAssessmentData.createdAt = new Date().toISOString();

      // Update state
      dispatch({ type: APP_ACTIONS.SET_ASSESSMENT, payload: finalAssessmentData });

      // Sync to storage
      if (state.user) {
        const supabaseData = {
          primary_goal: finalAssessmentData.primaryGoal,
          training_experience: finalAssessmentData.trainingExperience,
          timeline: finalAssessmentData.timeline,
          recommended_system: finalAssessmentData.recommendedSystem,
          created_at: finalAssessmentData.createdAt
        };
        
        await syncToSupabase('user_assessments', supabaseData, state.user.id);
      }

      syncToLocalStorage('userProfile', finalAssessmentData);
      toast.success('Assessment saved successfully!');
      return finalAssessmentData;
    } catch (error) {
      console.error('Error updating assessment:', error);
      dispatch({ type: APP_ACTIONS.SET_ERROR, payload: { key: 'assessment', error: error.message } });
      toast.error('Failed to save assessment');
      throw error;
    }
  };

  const saveProgram = async (programData) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'program', value: true } });
    
    try {
      const finalProgramData = {
        ...programData,
        createdAt: programData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: finalProgramData });

      if (state.user) {
        await syncToSupabase('user_programs', finalProgramData, state.user.id);
      }

      syncToLocalStorage('currentProgram', finalProgramData);
      toast.success('Program saved successfully!');
      return finalProgramData;
    } catch (error) {
      console.error('Error saving program:', error);
      dispatch({ type: APP_ACTIONS.SET_ERROR, payload: { key: 'program', error: error.message } });
      toast.error('Failed to save program');
      throw error;
    }
  };

  const updateTimeline = async (timelineData) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'timeline', value: true } });
    
    try {
      dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: timelineData });

      if (state.user) {
        await syncToSupabase('user_timelines', { timeline: timelineData }, state.user.id);
      }

      syncToLocalStorage('userTimeline', timelineData);
      return timelineData;
    } catch (error) {
      console.error('Error updating timeline:', error);
      dispatch({ type: APP_ACTIONS.SET_ERROR, payload: { key: 'timeline', error: error.message } });
      throw error;
    }
  };

  const clearUserData = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_USER });
    localStorage.removeItem('userProfile');
    localStorage.removeItem('currentProgram');
    localStorage.removeItem('userTimeline');
  };

  const value = {
    // State
    ...state,
    
    // Actions
    updateAssessment,
    saveProgram,
    updateTimeline,
    clearUserData,
    
    // Direct dispatch for advanced usage
    dispatch,
    
    // Utility actions
    setLoading: (key, value) => dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key, value } }),
    clearLoading: (key) => dispatch({ type: APP_ACTIONS.CLEAR_LOADING, payload: key }),
    setError: (key, error) => dispatch({ type: APP_ACTIONS.SET_ERROR, payload: { key, error } }),
    clearError: (key) => dispatch({ type: APP_ACTIONS.CLEAR_ERROR, payload: key })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { AppContext };
