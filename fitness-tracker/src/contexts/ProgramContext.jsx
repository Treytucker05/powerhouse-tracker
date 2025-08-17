import React, { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * ProgramContext - Enhanced for Bryant Periodization Integration
 * 
 * Manages:
 * - Gainer type classification and volume adjustments
 * - Recovery monitoring and deload scheduling
 * - Fitness-Fatigue model tracking
 * - Personalized volume landmarks
 */

const ProgramContext = createContext();

// Action types
const PROGRAM_ACTIONS = {
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    UPDATE_ASSESSMENT: 'UPDATE_ASSESSMENT',
    UPDATE_GAINER_TYPE: 'UPDATE_GAINER_TYPE',
    UPDATE_RECOVERY_DATA: 'UPDATE_RECOVERY_DATA',
    UPDATE_VOLUME_TRACKING: 'UPDATE_VOLUME_TRACKING',
    SET_PROGRAM_DATA: 'SET_PROGRAM_DATA',
    SET_DELOAD_SCHEDULE: 'SET_DELOAD_SCHEDULE',
    UPDATE_FITNESS_FATIGUE: 'UPDATE_FITNESS_FATIGUE',
    SET_USER_PROFILE: 'SET_USER_PROFILE'
};

// Initial state
const initialState = {
    activeTab: 'goals',
    currentWeek: 1,
    currentProgram: null,

    // User assessment data
    assessmentData: {
        primaryGoal: null,
        trainingExperience: null,
        timeline: null,
        gainerType: null,
        recoveryCapacity: null,
        volumeLandmarks: {}
    },

    // Program configuration
    programData: {
        macrocycleStructure: [],
        mesocycles: [],
        phases: [],
        weeklyVolume: 0,
        gainerTypeApplied: false
    },

    // Recovery monitoring
    recoveryData: {
        fitnessScore: 100,
        fatigueScore: 0,
        netReadiness: 100,
        fatigueAssessment: {
            fuel: 3,
            nervous: 3,
            messengers: 3,
            tissues: 3
        },
        lastDeload: null,
        nextDeload: 4
    },

    // Volume tracking
    volumeTracking: {
        currentVolume: {},
        plannedVolume: {},
        volumeProgression: [],
        deloadWeeks: []
    },

    // User profile
    userProfile: {
        age: 30,
        trainingExperience: 'intermediate',
        sleepHours: 7,
        sleepQuality: 7,
        stressLevel: 5,
        nutrition: 7,
        lifestyle: 'moderate'
    },

    // System state
    loading: false,
    error: null
};

// Reducer function
const programReducer = (state, action) => {
    switch (action.type) {
        case PROGRAM_ACTIONS.SET_ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.payload
            };

        case PROGRAM_ACTIONS.UPDATE_ASSESSMENT:
            return {
                ...state,
                assessmentData: {
                    ...state.assessmentData,
                    ...action.payload
                }
            };

        case PROGRAM_ACTIONS.UPDATE_GAINER_TYPE:
            return {
                ...state,
                assessmentData: {
                    ...state.assessmentData,
                    gainerType: action.payload
                },
                // Auto-update program volumes if program exists
                programData: state.programData.weeklyVolume > 0 ? {
                    ...state.programData,
                    weeklyVolume: Math.round(state.programData.weeklyVolume * action.payload.volumeModifier),
                    gainerTypeApplied: true
                } : state.programData
            };

        case PROGRAM_ACTIONS.UPDATE_RECOVERY_DATA:
            return {
                ...state,
                recoveryData: {
                    ...state.recoveryData,
                    ...action.payload
                }
            };

        case PROGRAM_ACTIONS.UPDATE_FITNESS_FATIGUE:
            const { fitnessScore, fatigueScore } = action.payload;
            return {
                ...state,
                recoveryData: {
                    ...state.recoveryData,
                    fitnessScore,
                    fatigueScore,
                    netReadiness: Math.max(0, fitnessScore - fatigueScore)
                }
            };

        case PROGRAM_ACTIONS.UPDATE_VOLUME_TRACKING:
            return {
                ...state,
                volumeTracking: {
                    ...state.volumeTracking,
                    ...action.payload
                }
            };

        case PROGRAM_ACTIONS.SET_PROGRAM_DATA:
            return {
                ...state,
                programData: {
                    ...state.programData,
                    ...action.payload
                }
            };

        case PROGRAM_ACTIONS.SET_DELOAD_SCHEDULE:
            return {
                ...state,
                recoveryData: {
                    ...state.recoveryData,
                    nextDeload: action.payload.nextWeek,
                    lastDeload: action.payload.lastWeek
                },
                volumeTracking: {
                    ...state.volumeTracking,
                    deloadWeeks: action.payload.deloadWeeks || []
                }
            };

        case PROGRAM_ACTIONS.SET_USER_PROFILE:
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    ...action.payload
                }
            };

        default:
            return state;
    }
};

// Context provider component
export const ProgramProvider = ({ children }) => {
    const [state, dispatch] = useReducer(programReducer, initialState);

    // Action creators
    const actions = {
        setActiveTab: (tab) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_ACTIVE_TAB, payload: tab });
        },

        updateAssessment: (assessmentData) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_ASSESSMENT, payload: assessmentData });
        },

        updateGainerType: (gainerType) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_GAINER_TYPE, payload: gainerType });
        },

        updateRecoveryData: (recoveryData) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_RECOVERY_DATA, payload: recoveryData });
        },

        updateFitnessFatigue: (fitnessScore, fatigueScore) => {
            dispatch({
                type: PROGRAM_ACTIONS.UPDATE_FITNESS_FATIGUE,
                payload: { fitnessScore, fatigueScore }
            });
        },

        updateVolumeTracking: (volumeData) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_VOLUME_TRACKING, payload: volumeData });
        },

        setProgramData: (programData) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_PROGRAM_DATA, payload: programData });
        },

        scheduleDeload: (nextWeek, lastWeek = null, deloadWeeks = []) => {
            dispatch({
                type: PROGRAM_ACTIONS.SET_DELOAD_SCHEDULE,
                payload: { nextWeek, lastWeek, deloadWeeks }
            });
        },

        setUserProfile: (profile) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_USER_PROFILE, payload: profile });
        },

        // Helper function to apply gainer type to existing program
        applyGainerTypeToProgram: (gainerType) => {
            if (!gainerType || !state.programData.weeklyVolume) return;

            const adjustedProgram = {
                ...state.programData,
                weeklyVolume: Math.round(state.programData.weeklyVolume * gainerType.volumeModifier),
                maxRecoverableVolume: Math.round((state.programData.maxRecoverableVolume || state.programData.weeklyVolume * 1.5) * gainerType.mrvModifier),
                gainerTypeApplied: true,
                appliedModifier: gainerType.volumeModifier
            };

            actions.setProgramData(adjustedProgram);
            actions.updateGainerType(gainerType);
        },

        // Helper function to update fatigue and trigger deload check
        updateFatigueAssessment: (fatigueScores) => {
            const averageFatigue = Object.values(fatigueScores).reduce((sum, score) => sum + score, 0) / 4;

            // Update recovery data
            actions.updateRecoveryData({
                fatigueAssessment: fatigueScores,
                averageFatigue
            });

            // Check if deload is needed (simplified logic)
            if (averageFatigue > 7 || state.currentWeek % 4 === 0) {
                const nextDeload = state.currentWeek + (4 - (state.currentWeek % 4));
                actions.scheduleDeload(nextDeload, state.currentWeek);
            }
        }
    };

    // Calculate derived state values
    const derivedState = {
        ...state,
        // Calculate if deload is recommended
        deloadRecommended: state.currentWeek >= state.recoveryData.nextDeload ||
            Object.values(state.recoveryData.fatigueAssessment).some(score => score > 7),

        // Calculate current training phase
        currentPhase: state.programData.phases?.find(phase =>
            state.currentWeek >= phase.weekStart && state.currentWeek <= phase.weekEnd
        ),

        // Calculate volume progression
        currentVolumeMultiplier: state.assessmentData.gainerType?.volumeModifier || 1.0,

        // Calculate readiness status
        readinessStatus: state.recoveryData.netReadiness >= 70 ? 'ready' :
            state.recoveryData.netReadiness >= 50 ? 'moderate' : 'low'
    };

    const contextValue = {
        state: derivedState,
        actions,
        dispatch
    };

    return (
        <ProgramContext.Provider value={contextValue}>
            {children}
        </ProgramContext.Provider>
    );
};

// Custom hook to use program context
export const useProgramContext = () => {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('useProgramContext must be used within a ProgramProvider');
    }
    return context;
};

export default ProgramContext;
