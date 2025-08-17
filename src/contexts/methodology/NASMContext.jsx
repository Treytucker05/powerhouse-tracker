import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { NASM_METHODOLOGY } from '../../methodology/registry';

// NASM-Specific Context for Methodology-First Workflow
const NASMContext = createContext();

// Initial state structure for NASM methodology-first workflow
const initialNASMState = {
    // Step 1: Methodology (pre-selected as NASM)
    methodology: NASM_METHODOLOGY,

    // Step 2: NASM-Specific Goal Selection
    primaryGoal: null,
    goalFramework: null,
    selectedPhases: [],

    // Step 3: Experience Level (universal)
    experienceLevel: null,
    trainingAge: null,
    recoveryCapacity: null,

    // Step 4: Timeline (universal)  
    timeline: null,
    availablePhases: null,

    // Step 5: Complete NASM Assessment
    assessmentData: {
        movementScreen: null,          // Existing NASM movement screen
        optQuestionnaire: null,        // New OPT model questionnaire
        clientConsultation: null,      // New client consultation
        posturalAnalysis: null         // Optional postural analysis
    },
    assessmentCompleted: false,
    assessmentResults: null,
    movementCompensations: [],
    riskLevel: null,

    // Step 6: NASM-Aware Injury Screening
    injuryScreen: null,
    correctiveExerciseNeeds: [],
    contraindicatedMovements: [],
    movementLimitations: [],

    // Step 7: OPT Model Periodization
    selectedOPTPhase: null,
    phaseProgression: null,
    periodizationData: {
        currentPhase: null,
        phaseSequence: [],
        trainingComponents: null
    },

    // Step 8: Implementation
    implementation: null,
    programGenerated: false,

    // Workflow State
    currentStep: 1,
    stepHistory: [],
    workflowPhase: 'goal-selection',
    isComplete: false,

    // Integration with existing system
    legacyCompatibility: {
        selectedSystem: 'NASM',
        preservedData: null
    }
};

// Action types for NASM workflow
const NASM_ACTIONS = {
    // Goal Selection (Step 2)
    SET_PRIMARY_GOAL: 'SET_PRIMARY_GOAL',
    SET_GOAL_FRAMEWORK: 'SET_GOAL_FRAMEWORK',
    SET_SELECTED_PHASES: 'SET_SELECTED_PHASES',

    // Experience Level (Step 3)
    SET_EXPERIENCE_LEVEL: 'SET_EXPERIENCE_LEVEL',
    SET_TRAINING_AGE: 'SET_TRAINING_AGE',
    SET_RECOVERY_CAPACITY: 'SET_RECOVERY_CAPACITY',

    // Timeline (Step 4)
    SET_TIMELINE: 'SET_TIMELINE',
    SET_AVAILABLE_PHASES: 'SET_AVAILABLE_PHASES',

    // Assessment (Step 5)
    SET_MOVEMENT_SCREEN_DATA: 'SET_MOVEMENT_SCREEN_DATA',
    SET_OPT_QUESTIONNAIRE: 'SET_OPT_QUESTIONNAIRE',
    SET_CLIENT_CONSULTATION: 'SET_CLIENT_CONSULTATION',
    SET_POSTURAL_ANALYSIS: 'SET_POSTURAL_ANALYSIS',
    COMPLETE_ASSESSMENT: 'COMPLETE_ASSESSMENT',
    SET_ASSESSMENT_RESULTS: 'SET_ASSESSMENT_RESULTS',

    // Injury Screening (Step 6)
    SET_INJURY_SCREEN: 'SET_INJURY_SCREEN',
    SET_CORRECTIVE_NEEDS: 'SET_CORRECTIVE_NEEDS',
    SET_MOVEMENT_LIMITATIONS: 'SET_MOVEMENT_LIMITATIONS',

    // Periodization (Step 7)
    SET_OPT_PHASE: 'SET_OPT_PHASE',
    SET_PHASE_PROGRESSION: 'SET_PHASE_PROGRESSION',
    SET_PERIODIZATION_DATA: 'SET_PERIODIZATION_DATA',

    // Implementation (Step 8)
    SET_IMPLEMENTATION: 'SET_IMPLEMENTATION',
    GENERATE_PROGRAM: 'GENERATE_PROGRAM',

    // Workflow Navigation
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    SET_WORKFLOW_PHASE: 'SET_WORKFLOW_PHASE',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    SET_COMPLETE: 'SET_COMPLETE',

    // Reset and utilities
    RESET_WORKFLOW: 'RESET_WORKFLOW',
    IMPORT_LEGACY_DATA: 'IMPORT_LEGACY_DATA'
};

// Reducer for NASM methodology state management
const nasmReducer = (state, action) => {
    switch (action.type) {
        case NASM_ACTIONS.SET_PRIMARY_GOAL:
            return {
                ...state,
                primaryGoal: action.payload.goal,
                goalFramework: action.payload.framework,
                selectedPhases: action.payload.phases || []
            };

        case NASM_ACTIONS.SET_EXPERIENCE_LEVEL:
            return {
                ...state,
                experienceLevel: action.payload.level,
                trainingAge: action.payload.trainingAge,
                recoveryCapacity: action.payload.recoveryCapacity
            };

        case NASM_ACTIONS.SET_TIMELINE:
            return {
                ...state,
                timeline: action.payload.timeline,
                availablePhases: action.payload.availablePhases
            };

        case NASM_ACTIONS.SET_MOVEMENT_SCREEN_DATA:
            return {
                ...state,
                assessmentData: {
                    ...state.assessmentData,
                    movementScreen: action.payload
                }
            };

        case NASM_ACTIONS.SET_OPT_QUESTIONNAIRE:
            return {
                ...state,
                assessmentData: {
                    ...state.assessmentData,
                    optQuestionnaire: action.payload
                }
            };

        case NASM_ACTIONS.SET_CLIENT_CONSULTATION:
            return {
                ...state,
                assessmentData: {
                    ...state.assessmentData,
                    clientConsultation: action.payload
                }
            };

        case NASM_ACTIONS.COMPLETE_ASSESSMENT:
            return {
                ...state,
                assessmentCompleted: true,
                assessmentResults: action.payload.results,
                movementCompensations: action.payload.compensations,
                riskLevel: action.payload.riskLevel
            };

        case NASM_ACTIONS.SET_INJURY_SCREEN:
            return {
                ...state,
                injuryScreen: action.payload.injuryScreen,
                correctiveExerciseNeeds: action.payload.correctiveNeeds || [],
                contraindicatedMovements: action.payload.contraindicatedMovements || [],
                movementLimitations: action.payload.movementLimitations || []
            };

        case NASM_ACTIONS.SET_OPT_PHASE:
            return {
                ...state,
                selectedOPTPhase: action.payload.phase,
                periodizationData: {
                    ...state.periodizationData,
                    currentPhase: action.payload.phase,
                    trainingComponents: action.payload.trainingComponents
                }
            };

        case NASM_ACTIONS.SET_PHASE_PROGRESSION:
            return {
                ...state,
                phaseProgression: action.payload.progression,
                periodizationData: {
                    ...state.periodizationData,
                    phaseSequence: action.payload.phaseSequence
                }
            };

        case NASM_ACTIONS.SET_IMPLEMENTATION:
            return {
                ...state,
                implementation: action.payload
            };

        case NASM_ACTIONS.GENERATE_PROGRAM:
            return {
                ...state,
                programGenerated: true,
                isComplete: true
            };

        case NASM_ACTIONS.SET_CURRENT_STEP:
            return {
                ...state,
                currentStep: action.payload.step,
                workflowPhase: action.payload.phase || state.workflowPhase
            };

        case NASM_ACTIONS.ADD_TO_HISTORY:
            return {
                ...state,
                stepHistory: [...state.stepHistory, action.payload]
            };

        case NASM_ACTIONS.RESET_WORKFLOW:
            return {
                ...initialNASMState,
                methodology: NASM_METHODOLOGY
            };

        case NASM_ACTIONS.IMPORT_LEGACY_DATA:
            return {
                ...state,
                legacyCompatibility: {
                    ...state.legacyCompatibility,
                    preservedData: action.payload
                }
            };

        default:
            return state;
    }
};

// NASM Context Provider
export const NASMProvider = ({ children }) => {
    const [state, dispatch] = useReducer(nasmReducer, initialNASMState);

    // Action creators for easier use
    const actions = {
        // Step 2: Goal Selection
        setPrimaryGoal: useCallback((goal, framework, phases) => {
            dispatch({
                type: NASM_ACTIONS.SET_PRIMARY_GOAL,
                payload: { goal, framework, phases }
            });
        }, []),

        // Step 3: Experience Level
        setExperienceLevel: useCallback((level, trainingAge, recoveryCapacity) => {
            dispatch({
                type: NASM_ACTIONS.SET_EXPERIENCE_LEVEL,
                payload: { level, trainingAge, recoveryCapacity }
            });
        }, []),

        // Step 4: Timeline
        setTimeline: useCallback((timeline, availablePhases) => {
            dispatch({
                type: NASM_ACTIONS.SET_TIMELINE,
                payload: { timeline, availablePhases }
            });
        }, []),

        // Step 5: Assessment
        setMovementScreenData: useCallback((data) => {
            dispatch({
                type: NASM_ACTIONS.SET_MOVEMENT_SCREEN_DATA,
                payload: data
            });
        }, []),

        setOPTQuestionnaire: useCallback((data) => {
            dispatch({
                type: NASM_ACTIONS.SET_OPT_QUESTIONNAIRE,
                payload: data
            });
        }, []),

        setClientConsultation: useCallback((data) => {
            dispatch({
                type: NASM_ACTIONS.SET_CLIENT_CONSULTATION,
                payload: data
            });
        }, []),

        completeAssessment: useCallback((results, compensations, riskLevel) => {
            dispatch({
                type: NASM_ACTIONS.COMPLETE_ASSESSMENT,
                payload: { results, compensations, riskLevel }
            });
        }, []),

        // Step 6: Injury Screening
        setInjuryScreen: useCallback((injuryScreen, correctiveNeeds, contraindicatedMovements, movementLimitations) => {
            dispatch({
                type: NASM_ACTIONS.SET_INJURY_SCREEN,
                payload: { injuryScreen, correctiveNeeds, contraindicatedMovements, movementLimitations }
            });
        }, []),

        // Step 7: Periodization
        setOPTPhase: useCallback((phase, trainingComponents) => {
            dispatch({
                type: NASM_ACTIONS.SET_OPT_PHASE,
                payload: { phase, trainingComponents }
            });
        }, []),

        setPhaseProgression: useCallback((progression, phaseSequence) => {
            dispatch({
                type: NASM_ACTIONS.SET_PHASE_PROGRESSION,
                payload: { progression, phaseSequence }
            });
        }, []),

        // Step 8: Implementation
        setImplementation: useCallback((implementation) => {
            dispatch({
                type: NASM_ACTIONS.SET_IMPLEMENTATION,
                payload: implementation
            });
        }, []),

        generateProgram: useCallback(() => {
            dispatch({
                type: NASM_ACTIONS.GENERATE_PROGRAM
            });
        }, []),

        // Navigation
        setCurrentStep: useCallback((step, phase) => {
            dispatch({
                type: NASM_ACTIONS.SET_CURRENT_STEP,
                payload: { step, phase }
            });

            // Add to history
            dispatch({
                type: NASM_ACTIONS.ADD_TO_HISTORY,
                payload: { step, phase, timestamp: new Date().toISOString() }
            });
        }, []),

        // Utilities
        resetWorkflow: useCallback(() => {
            dispatch({
                type: NASM_ACTIONS.RESET_WORKFLOW
            });
        }, []),

        importLegacyData: useCallback((legacyData) => {
            dispatch({
                type: NASM_ACTIONS.IMPORT_LEGACY_DATA,
                payload: legacyData
            });
        }, [])
    };

    const value = {
        state,
        dispatch,
        actions,
        methodology: NASM_METHODOLOGY
    };

    return (
        <NASMContext.Provider value={value}>
            {children}
        </NASMContext.Provider>
    );
};

// Hook for using NASM context
export const useNASM = () => {
    const context = useContext(NASMContext);
    if (!context) {
        throw new Error('useNASM must be used within a NASMProvider');
    }
    return context;
};

export { NASM_ACTIONS };
export default NASMContext;
