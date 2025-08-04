// Enhanced ProgramContext for Methodology-First Workflow
// This is an update to support the new step order while maintaining all existing functionality

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useApp } from '../context';

// Program state management
const ProgramContext = createContext();

// Action types (enhanced for methodology-first workflow)
export const PROGRAM_ACTIONS = {
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    SET_SELECTED_LEVEL: 'SET_SELECTED_LEVEL',
    SET_PROGRAM_DATA: 'SET_PROGRAM_DATA',
    SET_ASSESSMENT_DATA: 'SET_ASSESSMENT_DATA',
    SET_TRAINING_MODEL: 'SET_TRAINING_MODEL',
    SET_BLOCK_SEQUENCE: 'SET_BLOCK_SEQUENCE',
    SET_BLOCK_PARAMETERS: 'SET_BLOCK_PARAMETERS',
    SET_LOADING_RESULTS: 'SET_LOADING_RESULTS',
    SET_GENERATED_PROGRAM: 'SET_GENERATED_PROGRAM',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    UPDATE_BLOCK_PARAMETER: 'UPDATE_BLOCK_PARAMETER',
    TOGGLE_PERIODIZATION_MODE: 'TOGGLE_PERIODIZATION_MODE',
    SET_BRYANT_INTEGRATED: 'SET_BRYANT_INTEGRATED',
    SET_LEGACY_MIGRATION_STATUS: 'SET_LEGACY_MIGRATION_STATUS',

    // Enhanced streamlined workflow actions for methodology-first
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    SET_SELECTED_SYSTEM: 'SET_SELECTED_SYSTEM', // NOW STEP 1
    UPDATE_PRIMARY_GOAL: 'UPDATE_PRIMARY_GOAL', // NOW STEP 2 (methodology-aware)
    UPDATE_EXPERIENCE_LEVEL: 'UPDATE_EXPERIENCE_LEVEL', // NOW STEP 3
    UPDATE_TIMELINE: 'UPDATE_TIMELINE', // NOW STEP 4
    UPDATE_METHODOLOGY_ASSESSMENT: 'UPDATE_METHODOLOGY_ASSESSMENT', // NOW STEP 5
    UPDATE_INJURY_SCREEN: 'UPDATE_INJURY_SCREEN', // NOW STEP 6

    // New methodology-aware actions
    SET_METHODOLOGY_CONTEXT: 'SET_METHODOLOGY_CONTEXT',
    UPDATE_METHODOLOGY_AWARE_GOALS: 'UPDATE_METHODOLOGY_AWARE_GOALS',
    SET_METHODOLOGY_EXPERIENCE: 'SET_METHODOLOGY_EXPERIENCE',
    SET_METHODOLOGY_TIMELINE: 'SET_METHODOLOGY_TIMELINE',
    UPDATE_METHODOLOGY_INJURY_SCREENING: 'UPDATE_METHODOLOGY_INJURY_SCREENING'
};

// Initial state (enhanced for methodology-first workflow)
const initialState = {
    // UI State
    activeTab: 'system-recommendation', // Start with Step 1: Methodology Selection
    selectedLevel: null,

    // METHODOLOGY-FIRST workflow state
    currentStep: 1, // Start with methodology selection

    // Step 1: Methodology Selection (was Step 5)
    selectedSystem: '', // Primary methodology choice
    methodologyContext: null, // Enhanced methodology information

    // Step 2: Methodology-Aware Goals (was Step 1)
    primaryGoal: '',
    methodologyAwareGoals: [], // Goals filtered by methodology
    goalMethodologyMapping: null, // How goal relates to methodology

    // Step 3: Experience Level (enhanced with methodology awareness)
    experienceLevel: null,
    methodologyExperience: null, // Experience with specific methodology

    // Step 4: Timeline (enhanced with methodology-specific planning)
    timeline: null,
    methodologyTimeline: null, // Methodology-specific timeline considerations

    // Step 5: Methodology-Specific Assessment (dynamic)
    methodologyAssessment: {},

    // Step 6: Methodology-Aware Injury Screening (was Step 4)
    injuryScreen: null,
    methodologyInjuryConsiderations: null,

    // Steps 7-8: Architecture (unchanged)

    // Legacy compatibility
    isLoading: false,
    error: null,
    showPreview: false,
    usePeriodization: true,

    // Program Data (unchanged but now methodology-influenced)
    programData: {
        name: '',
        goal: 'hypertrophy',
        duration: 12,
        trainingDays: 4,
        selectedTemplate: null,
        methodology: null // New: methodology reference
    },

    // Assessment Data (now methodology-specific)
    assessmentData: null,
    isLoadingAssessment: true,
    assessmentError: null,

    // Training Configuration (now methodology-aware)
    selectedTrainingModel: '',
    blockSequence: [
        {
            id: 'accumulation',
            name: 'Accumulation',
            duration: 4,
            color: '#10B981',
            phase: 'accumulation',
            description: 'High volume phase for building work capacity and muscle growth'
        },
        {
            id: 'intensification',
            name: 'Intensification',
            duration: 3,
            color: '#F59E0B',
            phase: 'intensification',
            description: 'Moderate volume, higher intensity phase for strength development'
        },
        {
            id: 'realization',
            name: 'Realization',
            duration: 2,
            color: '#EF4444',
            phase: 'realization',
            description: 'Low volume, peak intensity phase for expressing maximum strength'
        },
        {
            id: 'deload',
            name: 'Deload',
            duration: 1,
            color: '#6B7280',
            phase: 'deload',
            description: 'Recovery phase with reduced volume and intensity for adaptation'
        }
    ],

    // Block Parameters (methodology-influenced)
    blockParameters: {
        accumulation: {
            intensity: 70,
            volume: 100,
            frequency: 4,
            focus: 'volume'
        },
        intensification: {
            intensity: 85,
            volume: 75,
            frequency: 4,
            focus: 'intensity'
        },
        realization: {
            intensity: 95,
            volume: 50,
            frequency: 3,
            focus: 'peak'
        },
        deload: {
            intensity: 60,
            volume: 40,
            frequency: 2,
            focus: 'recovery'
        }
    },

    // Enhanced methodology mapping
    methodologyMapping: {
        'NASM': {
            phases: ['Phase 1: Stabilization', 'Phase 2: Strength', 'Phase 3: Power'],
            assessmentTypes: ['Movement Screen', 'Postural Analysis'],
            periodizationStyle: 'OPT Model',
            goalCompatibility: ['corrective', 'general-fitness', 'weight-loss']
        },
        'RP': {
            phases: ['MEV-MAV', 'MAV-MRV', 'Deload'],
            assessmentTypes: ['Volume Landmarks', 'Recovery Capacity'],
            periodizationStyle: 'Volume Progression',
            goalCompatibility: ['hypertrophy', 'body-composition']
        },
        '5/3/1': {
            phases: ['Prep', 'Competition', 'Peak'],
            assessmentTypes: ['1RM Testing', 'Technical Analysis'],
            periodizationStyle: 'Conjugate',
            goalCompatibility: ['strength', 'powerlifting']
        },
        'linear': {
            phases: ['Base', 'Build', 'Peak'],
            assessmentTypes: ['Movement Quality', 'Motor Control'],
            periodizationStyle: 'Linear Progression',
            goalCompatibility: ['general-fitness', 'beginner']
        },
        'josh-bryant': {
            phases: ['Prep', 'Competition', 'Off-season'],
            assessmentTypes: ['PHA Screen', 'Gainer Type'],
            periodizationStyle: 'Block Periodization',
            goalCompatibility: ['strength', 'tactical', 'strongman']
        }
    },

    // Rest of the state remains the same...
    loadingResults: null,
    generatedProgram: null,
    bryantIntegrated: false,
    legacyMigrationStatus: {
        isComplete: false,
        componentsCount: 0,
        lastUpdated: null
    }
};

// Enhanced reducer for methodology-first workflow
const programReducer = (state, action) => {
    switch (action.type) {
        case PROGRAM_ACTIONS.SET_CURRENT_STEP:
            return {
                ...state,
                currentStep: action.payload,
                activeTab: getTabIdFromStep(action.payload)
            };

        case PROGRAM_ACTIONS.SET_SELECTED_SYSTEM:
            return {
                ...state,
                selectedSystem: action.payload,
                methodologyContext: state.methodologyMapping[action.payload] || null,
                // Reset dependent steps when methodology changes
                primaryGoal: '',
                methodologyAwareGoals: getMethodologyGoals(action.payload),
                // Auto-advance to step 2 after methodology selection
                currentStep: state.currentStep === 1 ? 2 : state.currentStep
            };

        case PROGRAM_ACTIONS.UPDATE_PRIMARY_GOAL:
            return {
                ...state,
                primaryGoal: action.payload,
                goalMethodologyMapping: getGoalMethodologyMapping(action.payload, state.selectedSystem)
            };

        case PROGRAM_ACTIONS.UPDATE_EXPERIENCE_LEVEL:
            return {
                ...state,
                experienceLevel: action.payload.level,
                methodologyExperience: action.payload.methodologyExperience
            };

        case PROGRAM_ACTIONS.UPDATE_TIMELINE:
            return {
                ...state,
                timeline: action.payload,
                methodologyTimeline: getMethodologyTimeline(action.payload, state.selectedSystem)
            };

        case PROGRAM_ACTIONS.UPDATE_METHODOLOGY_ASSESSMENT:
            return {
                ...state,
                methodologyAssessment: {
                    ...state.methodologyAssessment,
                    [state.selectedSystem]: action.payload
                }
            };

        case PROGRAM_ACTIONS.UPDATE_INJURY_SCREEN:
            return {
                ...state,
                injuryScreen: action.payload,
                methodologyInjuryConsiderations: getMethodologyInjuryConsiderations(
                    action.payload,
                    state.selectedSystem
                )
            };

        // Keep all existing cases for backward compatibility
        case PROGRAM_ACTIONS.SET_ACTIVE_TAB:
            return { ...state, activeTab: action.payload };

        case PROGRAM_ACTIONS.SET_SELECTED_LEVEL:
            return { ...state, selectedLevel: action.payload };

        case PROGRAM_ACTIONS.SET_PROGRAM_DATA:
            return {
                ...state,
                programData: {
                    ...state.programData,
                    ...action.payload,
                    methodology: state.selectedSystem // Link methodology to program
                }
            };

        case PROGRAM_ACTIONS.SET_ASSESSMENT_DATA:
            return { ...state, assessmentData: action.payload };

        // ... rest of existing cases remain the same

        default:
            return state;
    }
};

// Helper functions for methodology-first workflow
const getTabIdFromStep = (step) => {
    const stepMapping = {
        1: 'system-recommendation',
        2: 'primary-goal',
        3: 'experience-level',
        4: 'timeline',
        '5a': 'methodology-assessment',
        6: 'injury-screening',
        7: 'periodization',
        8: 'implementation'
    };
    return stepMapping[step] || 'system-recommendation';
};

const getMethodologyGoals = (methodology) => {
    const goalMapping = {
        'NASM': ['corrective-exercise', 'general-fitness', 'weight-loss', 'movement-quality'],
        'RP': ['hypertrophy', 'body-composition', 'muscle-gain'],
        '5/3/1': ['strength', 'powerlifting', 'max-strength'],
        'linear': ['general-fitness', 'beginner-strength', 'motor-control'],
        'josh-bryant': ['tactical-fitness', 'strongman', 'power-development']
    };
    return goalMapping[methodology] || [];
};

const getGoalMethodologyMapping = (goal, methodology) => {
    // Return how the goal specifically applies within the methodology
    const mappings = {
        'NASM': {
            'corrective-exercise': { phases: [1], focus: 'stabilization' },
            'general-fitness': { phases: [1, 2, 3], focus: 'balanced' },
            'weight-loss': { phases: [1, 2], focus: 'endurance' }
        },
        'RP': {
            'hypertrophy': { focus: 'MEV-MAV progression', volume: 'high' },
            'body-composition': { focus: 'deficit-surplus cycling', volume: 'moderate' }
        }
        // ... more mappings
    };
    return mappings[methodology]?.[goal] || null;
};

const getMethodologyTimeline = (timeline, methodology) => {
    // Return methodology-specific timeline considerations
    if (!timeline || !methodology) return null;

    const considerations = {
        'NASM': {
            minPhase1Duration: 4,
            assessmentFrequency: 4,
            progressionCriteria: 'movement-quality'
        },
        'RP': {
            mesocycleLength: 6,
            deloadFrequency: 4,
            volumeProgression: 'weekly'
        }
        // ... more considerations
    };

    return considerations[methodology] || null;
};

const getMethodologyInjuryConsiderations = (injuryData, methodology) => {
    // Return methodology-specific injury considerations
    if (!injuryData || !methodology) return null;

    const considerations = {
        'NASM': {
            assessmentRequired: true,
            correctiveExercises: true,
            phaseModification: 'extend-phase-1'
        },
        'RP': {
            volumeReduction: true,
            exerciseSubstitution: true,
            loadManagement: 'autoregulation'
        }
        // ... more considerations
    };

    return considerations[methodology] || null;
};

// Enhanced ProgramProvider with methodology-first support
export const ProgramProvider = ({ children }) => {
    const [state, dispatch] = useReducer(programReducer, initialState);
    const { user } = useApp();

    // Enhanced actions for methodology-first workflow
    const actions = {
        // Navigation
        setCurrentStep: useCallback((step) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_CURRENT_STEP, payload: step });
        }, []),

        // Step 1: Methodology Selection
        setSelectedSystem: useCallback((system) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_SELECTED_SYSTEM, payload: system });
        }, []),

        // Step 2: Methodology-Aware Goals
        updatePrimaryGoal: useCallback((goal) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_PRIMARY_GOAL, payload: goal });
        }, []),

        // Step 3: Experience Level
        updateExperienceLevel: useCallback((level, methodologyExperience) => {
            dispatch({
                type: PROGRAM_ACTIONS.UPDATE_EXPERIENCE_LEVEL,
                payload: { level, methodologyExperience }
            });
        }, []),

        // Step 4: Timeline
        updateTimeline: useCallback((timeline) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_TIMELINE, payload: timeline });
        }, []),

        // Step 5: Methodology Assessment
        updateMethodologyAssessment: useCallback((assessmentData) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_METHODOLOGY_ASSESSMENT, payload: assessmentData });
        }, []),

        // Step 6: Injury Screening
        updateInjuryScreen: useCallback((injuryData) => {
            dispatch({ type: PROGRAM_ACTIONS.UPDATE_INJURY_SCREEN, payload: injuryData });
        }, []),

        // Keep all existing actions for backward compatibility
        setActiveTab: useCallback((tab) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_ACTIVE_TAB, payload: tab });
        }, []),

        setSelectedLevel: useCallback((level) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_SELECTED_LEVEL, payload: level });
        }, []),

        setProgramData: useCallback((data) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_PROGRAM_DATA, payload: data });
        }, []),

        setAssessmentData: useCallback((data) => {
            dispatch({ type: PROGRAM_ACTIONS.SET_ASSESSMENT_DATA, payload: data });
        }, [])

        // ... rest of existing actions remain the same
    };

    const value = {
        state,
        dispatch,
        actions,
        user
    };

    return (
        <ProgramContext.Provider value={value}>
            {children}
        </ProgramContext.Provider>
    );
};

// Enhanced hook with methodology-first helpers
export const useProgramContext = () => {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('useProgramContext must be used within a ProgramProvider');
    }

    // Add methodology-specific helpers
    const helpers = {
        // Check if methodology is selected
        hasMethodology: () => !!context.state.selectedSystem,

        // Get methodology-specific information
        getMethodologyInfo: () => context.state.methodologyContext,

        // Get available goals for current methodology
        getAvailableGoals: () => context.state.methodologyAwareGoals,

        // Check if current step is accessible
        isStepAccessible: (step) => {
            if (step === 1) return true; // Methodology selection always accessible
            return !!context.state.selectedSystem; // Other steps require methodology
        },

        // Get methodology-specific timeline considerations
        getTimelineConsiderations: () => context.state.methodologyTimeline,

        // Get methodology-specific injury considerations
        getInjuryConsiderations: () => context.state.methodologyInjuryConsiderations
    };

    return {
        ...context,
        helpers
    };
};

export default ProgramContext;
