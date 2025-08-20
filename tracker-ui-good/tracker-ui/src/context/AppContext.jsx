import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabaseClient';
import { APP_ACTIONS } from './appActions';
import {
    syncToSupabase,
    syncToLocalStorage,
    loadFromLocalStorage,
    loadFromSupabase,
    batchLoadFromSupabase,
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
    errors: {},
    authRedirectNeeded: false
};

// Centralized auth redirect helper for HashRouter environments.
// Uses hash navigation instead of full path reload to avoid unnecessary network requests.
function goToAuth() {
    try {
        const base = import.meta.env.BASE_URL || '/';
        const target = base.replace(/\/$/, '') + '/#/auth';
        const alreadyOnAuth = location.hash === '#/auth';
        if (!alreadyOnAuth) {
            console.log('[Auth Redirect] Navigating to', target, 'from', location.href);
            // Use replace to avoid polluting history stack with repeated redirects
            location.replace(target);
        }
    } catch (e) {
        console.warn('goToAuth failed:', e);
    }
}

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

        case APP_ACTIONS.SET_AUTH_REDIRECT_NEEDED:
            return {
                ...state,
                authRedirectNeeded: action.payload
            };

        // Volume landmarks actions
        case APP_ACTIONS.UPDATE_VOLUME_LANDMARKS:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    volumeLandmarks: { ...state.assessment?.volumeLandmarks, ...action.payload }
                }
            };

        case APP_ACTIONS.SET_VOLUME_LANDMARKS:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    volumeLandmarks: action.payload
                }
            };

        case APP_ACTIONS.CLEAR_VOLUME_LANDMARKS:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    volumeLandmarks: null
                }
            };

        // Mesocycle integration actions
        case APP_ACTIONS.UPDATE_MESOCYCLE:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    mesocycle: { ...state.assessment?.mesocycle, ...action.payload }
                }
            };

        case APP_ACTIONS.SET_MESOCYCLE:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    mesocycle: action.payload
                }
            };

        case APP_ACTIONS.CLEAR_MESOCYCLE:
            return {
                ...state,
                assessment: {
                    ...state.assessment,
                    mesocycle: null
                }
            };

        default:
            return state;
    }
}

// Provider component
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        let active = true;
        (async () => {
            dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'user', value: true } });
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!active) return;
                if (session?.user) {
                    dispatch({ type: APP_ACTIONS.SET_USER, payload: session.user });
                    await loadUserData(session.user.id);
                } else {
                    loadLocalData();
                }
            } catch (e) {
                console.warn('Initial session fetch failed', e);
                loadLocalData();
            } finally {
                dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key: 'user', value: false } });
            }
        })();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!active) return;
            if (session?.user) {
                dispatch({ type: APP_ACTIONS.SET_USER, payload: session.user });
            } else {
                dispatch({ type: APP_ACTIONS.CLEAR_USER });
            }
        });
        return () => { active = false; subscription.unsubscribe(); };
    }, []);

    // Removed window focus refresh logic – Supabase auto refresh covers most cases.

    // Load user data from Supabase
    const loadUserData = async (userId) => {
        try {
            // Batch load all user data efficiently
            const tableNames = ['user_assessments', 'user_programs', 'user_timelines'];
            const results = await batchLoadFromSupabase(tableNames, userId);

            // Process assessment data
            if (results.user_assessments) {
                dispatch({ type: APP_ACTIONS.SET_ASSESSMENT, payload: results.user_assessments });
            }

            // Process program data
            if (results.user_programs) {
                dispatch({ type: APP_ACTIONS.SAVE_PROGRAM, payload: results.user_programs });
            }

            // Process timeline data
            if (results.user_timelines && results.user_timelines.timeline) {
                dispatch({ type: APP_ACTIONS.SET_TIMELINE, payload: results.user_timelines.timeline });
            }
        } catch (error) {
            console.error('Error loading user data:', error.message || error);
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

    const clearAuthRedirect = () => {
        dispatch({ type: APP_ACTIONS.SET_AUTH_REDIRECT_NEEDED, payload: false });
    };

    // Simple setters used in tests and for potential future direct manipulation needs
    const setAssessment = (assessmentData) => {
        dispatch({ type: APP_ACTIONS.SET_ASSESSMENT, payload: assessmentData });
    };

    const clearAssessment = () => {
        dispatch({ type: APP_ACTIONS.CLEAR_ASSESSMENT });
    };

    const value = {
        // State
        ...state,

        // Actions
        updateAssessment,
        saveProgram,
        updateTimeline,
        clearUserData,
        clearAuthRedirect,
        setAssessment, // exposed for tests / direct use
        clearAssessment,

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

// Utility function for components to handle auth failures
export const handleAuthFailure = (navigate, reason = 'Authentication required') => {
    console.log(`Authentication failed: ${reason}`);

    const currentPath = window.location.pathname;
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/', '/about', '/contact'];

    if (!publicPaths.includes(currentPath)) {
        navigate('/login', {
            replace: true,
            state: {
                message: 'Please log in to continue',
                redirectFrom: currentPath
            }
        });
    }
};

export { AppContext };
