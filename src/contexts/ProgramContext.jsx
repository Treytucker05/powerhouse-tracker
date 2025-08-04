import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useVolumeAlgorithms } from '../hooks/useVolumeAlgorithms';
import { useFatigueAlgorithms } from '../hooks/useFatigueAlgorithms';
import { useIntelligenceAlgorithms } from '../hooks/useIntelligenceAlgorithms';
import { useExerciseAlgorithms } from '../hooks/useExerciseAlgorithms';

// Program state management
const ProgramContext = createContext();

// Action types - Enhanced for methodology-first workflow
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
    SET_BRYANT_CONFIG: 'SET_BRYANT_CONFIG',
    UPDATE_BRYANT_CONFIG: 'UPDATE_BRYANT_CONFIG',
    SET_ALGORITHM_DATA: 'SET_ALGORITHM_DATA',
    UPDATE_ALGORITHM_DATA: 'UPDATE_ALGORITHM_DATA',
    SET_ALGORITHM_CONFIG: 'SET_ALGORITHM_CONFIG',

    // NEW: Methodology-first workflow actions
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    SET_SELECTED_SYSTEM: 'SET_SELECTED_SYSTEM',
    SET_METHODOLOGY_CONTEXT: 'SET_METHODOLOGY_CONTEXT',
    UPDATE_PRIMARY_GOAL: 'UPDATE_PRIMARY_GOAL',
    UPDATE_EXPERIENCE_LEVEL: 'UPDATE_EXPERIENCE_LEVEL',
    UPDATE_TIMELINE: 'UPDATE_TIMELINE',
    UPDATE_METHODOLOGY_ASSESSMENT: 'UPDATE_METHODOLOGY_ASSESSMENT',
    UPDATE_INJURY_SCREEN: 'UPDATE_INJURY_SCREEN',
    VALIDATE_STEP_ACCESS: 'VALIDATE_STEP_ACCESS'
};

// Initial state - Enhanced for methodology-first workflow
const initialState = {
    // UI State - CHANGED: Start with methodology selection
    activeTab: 'system-recommendation', // Start with Step 1: Methodology Selection
    selectedLevel: null,
    isLoading: false,
    error: null,
    showPreview: false,

    // NEW: Methodology-first workflow state
    currentStep: 1, // Start with methodology selection
    selectedSystem: '', // Primary methodology choice (Step 1)
    methodologyContext: null, // Enhanced methodology information

    // NEW: Step validation tracking
    stepValidation: {
        1: false, // Methodology Selection
        2: false, // Primary Goal
        3: false, // Experience Level
        4: false, // Timeline
        5: false, // Assessment
        6: false, // Injury Screen
        7: false, // Periodization
        8: false  // Implementation
    },

    // NEW: Methodology-aware state
    primaryGoal: '',
    methodologyAwareGoals: [], // Goals filtered by methodology
    goalMethodologyMapping: null, // How goal relates to methodology
    experienceLevel: null,
    methodologyExperience: null, // Experience with specific methodology
    timeline: null,
    methodologyTimeline: null, // Methodology-specific timeline considerations
    methodologyAssessment: {}, // Dynamic assessment data by methodology
    injuryScreen: null,
    methodologyInjuryConsiderations: null,

    // Program Data - ENHANCED: Now methodology-aware
    programData: {
        name: '',
        goal: 'hypertrophy',
        duration: 12,
        trainingDays: 4,
        selectedTemplate: null,
        methodology: null // NEW: methodology reference
    },

    // Assessment Data
    assessmentData: null,
    isLoadingAssessment: true,
    assessmentError: null,

    // Bryant Integration Data
    bryantConfig: {
        clusterSets: null,
        strongmanEvents: [],
        tacticalMission: null,
        tacticalReadiness: null
    },

    // Training Configuration
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

    // Block Parameters
    blockParameters: {
        accumulation: { loading: 60, movement: 'Bilateral', loadingResults: null },
        intensification: { loading: 75, movement: 'Unilateral', loadingResults: null },
        realization: { loading: 85, movement: 'Bilateral', loadingResults: null },
        deload: { loading: 40, movement: 'Bilateral', loadingResults: null }
    },
    activeBlockTab: 'accumulation',

    // Training Methods
    selectedTrainingMethod: '',
    methodSFR: '',

    // Energy Systems
    selectedEnergySystem: '',
    energySystemNote: '',

    // Recovery/Deload
    selectedDeloadType: '',
    deloadProtocol: '',

    // Individual Considerations
    trainingAge: '',
    chronotype: '',
    chronotypeNote: '',

    // Tech Integration
    selectedTechIntegration: '',
    techNote: '',

    // Results
    loadingResults: null,
    generatedProgram: null,

    // Exercise Parameters
    selectedExercise: '',
    tempo: '3010',
    rom: 'Full',

    // Algorithm Integration Data
    algorithmData: {
        volumeMetrics: null,
        fatigueAnalysis: null,
        intelligenceRecommendations: null,
        exerciseSelections: null,
        lastCalculated: null
    },

    // Algorithm Configuration
    algorithmConfig: {
        autoCalculate: true,
        updateFrequency: 'session', // session, weekly, manual
        enableRecommendations: true
    },

    // NEW: Methodology mapping for intelligent workflow
    methodologyMapping: {
        'NASM': {
            phases: ['Phase 1: Stabilization', 'Phase 2: Strength', 'Phase 3: Power'],
            assessmentTypes: ['Movement Screen', 'Postural Analysis'],
            periodizationStyle: 'OPT Model',
            goalCompatibility: ['corrective', 'general-fitness', 'weight-loss'],
            requiredAssessments: ['movement-screen', 'postural-assessment'],
            timelineConsiderations: {
                minPhase1Duration: 4,
                assessmentFrequency: 4,
                progressionCriteria: 'movement-quality'
            }
        },
        'RP': {
            phases: ['MEV-MAV', 'MAV-MRV', 'Deload'],
            assessmentTypes: ['Volume Landmarks', 'Recovery Capacity'],
            periodizationStyle: 'Volume Progression',
            goalCompatibility: ['hypertrophy', 'body-composition'],
            requiredAssessments: ['volume-landmarks', 'recovery-assessment'],
            timelineConsiderations: {
                mesocycleLength: 6,
                deloadFrequency: 4,
                volumeProgression: 'weekly'
            }
        },
        '5/3/1': {
            phases: ['Prep', 'Competition', 'Peak'],
            assessmentTypes: ['1RM Testing', 'Technical Analysis'],
            periodizationStyle: 'Conjugate',
            goalCompatibility: ['strength', 'powerlifting'],
            requiredAssessments: ['1rm-testing', 'technical-analysis'],
            timelineConsiderations: {
                cycleLength: 4,
                peakingDuration: 2,
                deloadWeek: 4
            }
        },
        'linear': {
            phases: ['Base', 'Build', 'Peak'],
            assessmentTypes: ['Movement Quality', 'Motor Control'],
            periodizationStyle: 'Linear Progression',
            goalCompatibility: ['general-fitness', 'beginner'],
            requiredAssessments: ['movement-quality', 'fitness-baseline'],
            timelineConsiderations: {
                progressionRate: 'weekly',
                plateauManagement: 'deload',
                minDuration: 8
            }
        },
        'josh-bryant': {
            phases: ['Prep', 'Competition', 'Off-season'],
            assessmentTypes: ['PHA Screen', 'Gainer Type'],
            periodizationStyle: 'Block Periodization',
            goalCompatibility: ['strength', 'tactical', 'strongman'],
            requiredAssessments: ['pha-screen', 'gainer-assessment'],
            timelineConsiderations: {
                blockLength: 4,
                intensityPhases: 3,
                competitionPrep: 8
            }
        }
    }
};

// Reducer function - Enhanced for methodology-first workflow
function programReducer(state, action) {
    switch (action.type) {
        // NEW: Methodology-first workflow actions
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
                methodologyAwareGoals: getMethodologyGoals(action.payload, state.methodologyMapping),
                stepValidation: {
                    ...state.stepValidation,
                    1: !!action.payload, // Methodology selection completed
                    // Reset subsequent validations when methodology changes
                    2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false
                },
                // Update program data with methodology
                programData: {
                    ...state.programData,
                    methodology: action.payload
                },
                // Auto-advance to step 2 after methodology selection
                currentStep: action.payload ? 2 : 1
            };

        case PROGRAM_ACTIONS.SET_METHODOLOGY_CONTEXT:
            return {
                ...state,
                methodologyContext: action.payload
            };

        case PROGRAM_ACTIONS.UPDATE_PRIMARY_GOAL:
            return {
                ...state,
                primaryGoal: action.payload,
                goalMethodologyMapping: getGoalMethodologyMapping(action.payload, state.selectedSystem, state.methodologyMapping),
                stepValidation: {
                    ...state.stepValidation,
                    2: !!action.payload
                },
                programData: {
                    ...state.programData,
                    goal: action.payload
                }
            };

        case PROGRAM_ACTIONS.UPDATE_EXPERIENCE_LEVEL:
            return {
                ...state,
                experienceLevel: action.payload.level,
                methodologyExperience: action.payload.methodologyExperience,
                stepValidation: {
                    ...state.stepValidation,
                    3: !!action.payload.level
                }
            };

        case PROGRAM_ACTIONS.UPDATE_TIMELINE:
            return {
                ...state,
                timeline: action.payload,
                methodologyTimeline: getMethodologyTimeline(action.payload, state.selectedSystem, state.methodologyMapping),
                stepValidation: {
                    ...state.stepValidation,
                    4: !!action.payload
                },
                programData: {
                    ...state.programData,
                    duration: action.payload.duration || state.programData.duration,
                    trainingDays: action.payload.trainingDays || state.programData.trainingDays
                }
            };

        case PROGRAM_ACTIONS.UPDATE_METHODOLOGY_ASSESSMENT:
            return {
                ...state,
                methodologyAssessment: {
                    ...state.methodologyAssessment,
                    [state.selectedSystem]: action.payload
                },
                stepValidation: {
                    ...state.stepValidation,
                    5: !!action.payload && Object.keys(action.payload).length > 0
                }
            };

        case PROGRAM_ACTIONS.UPDATE_INJURY_SCREEN:
            return {
                ...state,
                injuryScreen: action.payload,
                methodologyInjuryConsiderations: getMethodologyInjuryConsiderations(
                    action.payload,
                    state.selectedSystem,
                    state.methodologyMapping
                ),
                stepValidation: {
                    ...state.stepValidation,
                    6: !!action.payload
                }
            };

        case PROGRAM_ACTIONS.VALIDATE_STEP_ACCESS:
            // Validate if user can access a specific step
            const { step } = action.payload;
            if (step === 1) return state; // Step 1 always accessible

            // Check if methodology is selected for steps 2+
            if (!state.selectedSystem) {
                return {
                    ...state,
                    error: 'Please select a methodology before proceeding to other steps.'
                };
            }

            return state;

        // Existing actions with methodology awareness
        case PROGRAM_ACTIONS.SET_ACTIVE_TAB:
            // Validate tab access based on methodology-first workflow
            const tabStep = getStepFromTabId(action.payload);
            if (tabStep > 1 && !state.selectedSystem) {
                return {
                    ...state,
                    error: 'Please select a methodology first.',
                    activeTab: 'system-recommendation'
                };
            }
            return { ...state, activeTab: action.payload, error: null };

        case PROGRAM_ACTIONS.SET_PROGRAM_DATA:
            return {
                ...state,
                programData: {
                    ...state.programData,
                    ...action.payload,
                    methodology: action.payload.methodology || state.selectedSystem
                }
            };

        case PROGRAM_ACTIONS.SET_SELECTED_LEVEL:
            return { ...state, selectedLevel: action.payload };

        case PROGRAM_ACTIONS.SET_ASSESSMENT_DATA:
            return { ...state, assessmentData: action.payload };

        case PROGRAM_ACTIONS.SET_TRAINING_MODEL:
            return { ...state, selectedTrainingModel: action.payload };

        case PROGRAM_ACTIONS.SET_BLOCK_SEQUENCE:
            return { ...state, blockSequence: action.payload };

        case PROGRAM_ACTIONS.SET_BLOCK_PARAMETERS:
            return { ...state, blockParameters: action.payload };

        case PROGRAM_ACTIONS.UPDATE_BLOCK_PARAMETER:
            return {
                ...state,
                blockParameters: {
                    ...state.blockParameters,
                    [action.payload.blockId]: {
                        ...state.blockParameters[action.payload.blockId],
                        ...action.payload.updates
                    }
                }
            };

        case PROGRAM_ACTIONS.SET_LOADING_RESULTS:
            return { ...state, loadingResults: action.payload };

        case PROGRAM_ACTIONS.SET_GENERATED_PROGRAM:
            return { ...state, generatedProgram: action.payload };

        case PROGRAM_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case PROGRAM_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };

        case PROGRAM_ACTIONS.SET_BRYANT_CONFIG:
            return { ...state, bryantConfig: action.payload };

        case PROGRAM_ACTIONS.UPDATE_BRYANT_CONFIG:
            return {
                ...state,
                bryantConfig: {
                    ...state.bryantConfig,
                    ...action.payload
                }
            };

        case PROGRAM_ACTIONS.SET_ALGORITHM_DATA:
            return { ...state, algorithmData: action.payload };

        case PROGRAM_ACTIONS.UPDATE_ALGORITHM_DATA:
            return {
                ...state,
                algorithmData: {
                    ...state.algorithmData,
                    ...action.payload,
                    lastCalculated: new Date().toISOString()
                }
            };

        case PROGRAM_ACTIONS.SET_ALGORITHM_CONFIG:
            return { ...state, algorithmConfig: { ...state.algorithmConfig, ...action.payload } };

        default:
            return state;
    }
}

// Context Provider
export const ProgramProvider = ({ children }) => {
    const [state, dispatch] = useReducer(programReducer, initialState);

    // Initialize algorithm hooks
    const volumeAlgorithms = useVolumeAlgorithms();
    const fatigueAlgorithms = useFatigueAlgorithms();
    const intelligenceAlgorithms = useIntelligenceAlgorithms();
    const exerciseAlgorithms = useExerciseAlgorithms();

    // Action creators - simplified without nested useCallback
    const setActiveTab = useCallback((tab) => dispatch({ type: PROGRAM_ACTIONS.SET_ACTIVE_TAB, payload: tab }), []);
    const setSelectedLevel = useCallback((level) => dispatch({ type: PROGRAM_ACTIONS.SET_SELECTED_LEVEL, payload: level }), []);
    const setProgramData = useCallback((data) => dispatch({ type: PROGRAM_ACTIONS.SET_PROGRAM_DATA, payload: data }), []);
    const setAssessmentData = useCallback((data) => dispatch({ type: PROGRAM_ACTIONS.SET_ASSESSMENT_DATA, payload: data }), []);
    const setTrainingModel = useCallback((model) => dispatch({ type: PROGRAM_ACTIONS.SET_TRAINING_MODEL, payload: model }), []);
    const setBlockSequence = useCallback((sequence) => dispatch({ type: PROGRAM_ACTIONS.SET_BLOCK_SEQUENCE, payload: sequence }), []);
    const setBlockParameters = useCallback((params) => dispatch({ type: PROGRAM_ACTIONS.SET_BLOCK_PARAMETERS, payload: params }), []);
    const updateBlockParameter = useCallback((blockId, updates) => dispatch({
        type: PROGRAM_ACTIONS.UPDATE_BLOCK_PARAMETER,
        payload: { blockId, updates }
    }), []);
    const setLoadingResults = useCallback((results) => dispatch({ type: PROGRAM_ACTIONS.SET_LOADING_RESULTS, payload: results }), []);
    const setGeneratedProgram = useCallback((program) => dispatch({ type: PROGRAM_ACTIONS.SET_GENERATED_PROGRAM, payload: program }), []);
    const setLoading = useCallback((loading) => dispatch({ type: PROGRAM_ACTIONS.SET_LOADING, payload: loading }), []);
    const setError = useCallback((error) => dispatch({ type: PROGRAM_ACTIONS.SET_ERROR, payload: error }), []);
    const setBryantConfig = useCallback((config) => dispatch({ type: PROGRAM_ACTIONS.SET_BRYANT_CONFIG, payload: config }), []);
    const updateBryantConfig = useCallback((updates) => dispatch({ type: PROGRAM_ACTIONS.UPDATE_BRYANT_CONFIG, payload: updates }), []);

    // Algorithm action creators
    const setAlgorithmData = useCallback((data) => dispatch({ type: PROGRAM_ACTIONS.SET_ALGORITHM_DATA, payload: data }), []);
    const updateAlgorithmData = useCallback((updates) => dispatch({ type: PROGRAM_ACTIONS.UPDATE_ALGORITHM_DATA, payload: updates }), []);
    const setAlgorithmConfig = useCallback((config) => dispatch({ type: PROGRAM_ACTIONS.SET_ALGORITHM_CONFIG, payload: config }), []);

    // NEW: Methodology-first workflow action creators
    const setCurrentStep = useCallback((step) => dispatch({ type: PROGRAM_ACTIONS.SET_CURRENT_STEP, payload: step }), []);
    const setSelectedSystem = useCallback((system) => dispatch({ type: PROGRAM_ACTIONS.SET_SELECTED_SYSTEM, payload: system }), []);
    const setMethodologyContext = useCallback((context) => dispatch({ type: PROGRAM_ACTIONS.SET_METHODOLOGY_CONTEXT, payload: context }), []);
    const updatePrimaryGoal = useCallback((goal) => dispatch({ type: PROGRAM_ACTIONS.UPDATE_PRIMARY_GOAL, payload: goal }), []);
    const updateExperienceLevel = useCallback((level, methodologyExperience) => dispatch({
        type: PROGRAM_ACTIONS.UPDATE_EXPERIENCE_LEVEL,
        payload: { level, methodologyExperience }
    }), []);
    const updateTimeline = useCallback((timeline) => dispatch({ type: PROGRAM_ACTIONS.UPDATE_TIMELINE, payload: timeline }), []);
    const updateMethodologyAssessment = useCallback((assessmentData) => dispatch({
        type: PROGRAM_ACTIONS.UPDATE_METHODOLOGY_ASSESSMENT,
        payload: assessmentData
    }), []);
    const updateInjuryScreen = useCallback((injuryData) => dispatch({
        type: PROGRAM_ACTIONS.UPDATE_INJURY_SCREEN,
        payload: injuryData
    }), []);
    const validateStepAccess = useCallback((step) => dispatch({
        type: PROGRAM_ACTIONS.VALIDATE_STEP_ACCESS,
        payload: { step }
    }), []);

    // Advanced algorithm integration functions
    const calculateVolumeProgression = useCallback(async (sessionData) => {
        if (!sessionData) return null;

        try {
            const volumeProgression = volumeAlgorithms.generateVolumeProgression(
                sessionData.volume || 10,
                state.programData.targetVolume || 20,
                state.programData.duration || 4
            );

            updateAlgorithmData({ volumeMetrics: volumeProgression });
            return volumeProgression;
        } catch (error) {
            console.error('Volume calculation error:', error);
            return null;
        }
    }, [volumeAlgorithms, state.programData, updateAlgorithmData]);

    const analyzeFatigueStatus = useCallback(async (trainingData) => {
        if (!trainingData) return null;

        try {
            const fatigueAnalysis = fatigueAlgorithms.calculateFatigueScore([{
                totalSets: trainingData.volume || 10,
                avgRIR: (10 - (trainingData.intensity || 75) / 10),
                duration: 60,
                completed: true
            }]);

            updateAlgorithmData({ fatigueAnalysis });
            return fatigueAnalysis;
        } catch (error) {
            console.error('Fatigue analysis error:', error);
            return null;
        }
    }, [fatigueAlgorithms, updateAlgorithmData]);

    const generateIntelligentRecommendations = useCallback(async () => {
        try {
            const { recommendations } = intelligenceAlgorithms.generateRecommendations(
                state.programData,
                [], // training history - would come from actual data
                state.assessmentData?.goals || []
            );

            updateAlgorithmData({ intelligenceRecommendations: recommendations });
            return recommendations;
        } catch (error) {
            console.error('Intelligence recommendations error:', error);
            return null;
        }
    }, [intelligenceAlgorithms, state, updateAlgorithmData]);

    const optimizeExerciseSelection = useCallback(async (criteria) => {
        if (!criteria) return null;

        try {
            const exerciseSelection = exerciseAlgorithms.selectExercises({
                muscleGroups: criteria.targetMuscles || [],
                goal: state.programData.goal || 'hypertrophy',
                equipment: criteria.equipment || [],
                experienceLevel: state.assessmentData?.experienceLevel || 'intermediate',
                maxFatigueIndex: 8,
                sessionType: criteria.timeConstraint === 'minimal' ? 'minimal' : 'normal'
            });

            const optimizedOrder = exerciseAlgorithms.optimizeExerciseOrder(exerciseSelection);

            updateAlgorithmData({
                exerciseSelections: {
                    recommendations: exerciseSelection,
                    optimizedOrder
                }
            });

            return { exerciseSelection, optimizedOrder };
        } catch (error) {
            console.error('Exercise optimization error:', error);
            return null;
        }
    }, [exerciseAlgorithms, state, updateAlgorithmData]);

    // Integrated program generation with all algorithms
    const generateOptimizedProgram = useCallback(async () => {
        setLoading(true);
        try {
            // Step 1: Calculate volume progression
            const volumeProgression = await calculateVolumeProgression({
                volume: state.blockParameters.accumulation.loading,
                ...state.programData
            });

            // Step 2: Analyze fatigue patterns
            const fatigueAnalysis = await analyzeFatigueStatus({
                volume: volumeProgression?.weeklyVolume || 16,
                intensity: 75,
                frequency: state.programData.trainingDays,
                sleepQuality: 7,
                stressLevel: 5
            });

            // Step 3: Generate exercise selections
            const exerciseOptimization = await optimizeExerciseSelection({
                targetMuscles: ['chest', 'back', 'legs'],
                equipment: ['barbell', 'dumbbells', 'bench'],
                timeConstraint: 'normal'
            });

            // Step 4: Generate intelligent recommendations
            const recommendations = await generateIntelligentRecommendations();

            // Step 5: Create comprehensive program
            const optimizedProgram = {
                id: `program_${Date.now()}`,
                name: state.programData.name || 'Optimized Training Program',
                duration: state.programData.duration,
                goal: state.programData.goal,
                volumeProgression,
                fatigueManagement: fatigueAnalysis,
                exerciseSelection: exerciseOptimization,
                recommendations,
                blockSequence: state.blockSequence,
                bryantIntegration: state.bryantConfig,
                generatedAt: new Date().toISOString()
            };

            setGeneratedProgram(optimizedProgram);
            return optimizedProgram;

        } catch (error) {
            setError(`Program generation failed: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [
        calculateVolumeProgression,
        analyzeFatigueStatus,
        optimizeExerciseSelection,
        generateIntelligentRecommendations,
        state,
        setLoading,
        setGeneratedProgram,
        setError
    ]);

    const actions = {
        setActiveTab,
        setSelectedLevel,
        setProgramData,
        setAssessmentData,
        setTrainingModel,
        setBlockSequence,
        setBlockParameters,
        updateBlockParameter,
        setLoadingResults,
        setGeneratedProgram,
        setLoading,
        setError,
        setBryantConfig,
        updateBryantConfig,
        // Algorithm actions
        setAlgorithmData,
        updateAlgorithmData,
        setAlgorithmConfig,
        // NEW: Methodology-first workflow actions
        setCurrentStep,
        setSelectedSystem,
        setMethodologyContext,
        updatePrimaryGoal,
        updateExperienceLevel,
        updateTimeline,
        updateMethodologyAssessment,
        updateInjuryScreen,
        validateStepAccess,
        // Advanced algorithm functions
        calculateVolumeProgression,
        analyzeFatigueStatus,
        generateIntelligentRecommendations,
        optimizeExerciseSelection,
        generateOptimizedProgram
    };

    // Enhanced context value with algorithm capabilities and methodology-first helpers
    const contextValue = {
        state,
        actions,
        // Direct algorithm hook access for advanced use cases
        algorithms: {
            volume: volumeAlgorithms,
            fatigue: fatigueAlgorithms,
            intelligence: intelligenceAlgorithms,
            exercise: exerciseAlgorithms
        },
        // NEW: Methodology-first workflow helpers
        helpers: {
            // Check if methodology is selected
            hasMethodology: () => !!state.selectedSystem,

            // Get methodology-specific information
            getMethodologyInfo: () => state.methodologyContext,

            // Get available goals for current methodology
            getAvailableGoals: () => state.methodologyAwareGoals,

            // Check if current step is accessible
            isStepAccessible: (step) => {
                if (step === 1) return true; // Methodology selection always accessible
                return !!state.selectedSystem; // Other steps require methodology
            },

            // Check if step is completed
            isStepCompleted: (step) => state.stepValidation[step] || false,

            // Get next incomplete step
            getNextIncompleteStep: () => {
                for (let i = 1; i <= 8; i++) {
                    if (!state.stepValidation[i]) return i;
                }
                return 8; // All complete, return last step
            },

            // Get methodology-specific timeline considerations
            getTimelineConsiderations: () => state.methodologyTimeline,

            // Get methodology-specific injury considerations
            getInjuryConsiderations: () => state.methodologyInjuryConsiderations,

            // Check if workflow is ready for program generation
            isWorkflowComplete: () => {
                const requiredSteps = [1, 2, 3, 4]; // Minimum required steps
                return requiredSteps.every(step => state.stepValidation[step]);
            },

            // Get workflow completion percentage
            getCompletionPercentage: () => {
                const completedSteps = Object.values(state.stepValidation).filter(Boolean).length;
                return Math.round((completedSteps / 8) * 100);
            },

            // Get methodology-specific required assessments
            getRequiredAssessments: () => {
                if (!state.methodologyContext) return [];
                return state.methodologyContext.requiredAssessments || [];
            },

            // Check if goal is compatible with methodology
            isGoalCompatible: (goal) => {
                if (!state.methodologyContext) return false;
                return state.methodologyContext.goalCompatibility.includes(goal);
            }
        }
    };

    return (
        <ProgramContext.Provider value={contextValue}>
            {children}
        </ProgramContext.Provider>
    );
};

// Custom hook to use the context
export const useProgramContext = () => {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error('useProgramContext must be used within a ProgramProvider');
    }
    return context;
};

export default ProgramProvider;

// Helper functions for methodology-first workflow
const getTabIdFromStep = (step) => {
    const stepMapping = {
        1: 'system-recommendation',
        2: 'primary-goal',
        3: 'experience-level',
        4: 'timeline',
        5: 'methodology-assessment',
        6: 'injury-screening',
        7: 'periodization',
        8: 'implementation'
    };
    return stepMapping[step] || 'system-recommendation';
};

const getStepFromTabId = (tabId) => {
    const tabMapping = {
        'system-recommendation': 1,
        'primary-goal': 2,
        'experience-level': 3,
        'timeline': 4,
        'methodology-assessment': 5,
        'injury-screening': 6,
        'periodization': 7,
        'implementation': 8
    };
    return tabMapping[tabId] || 1;
};

const getMethodologyGoals = (methodology, methodologyMapping) => {
    if (!methodology || !methodologyMapping[methodology]) return [];
    return methodologyMapping[methodology].goalCompatibility || [];
};

const getGoalMethodologyMapping = (goal, methodology, methodologyMapping) => {
    if (!goal || !methodology || !methodologyMapping[methodology]) return null;

    const methodologyInfo = methodologyMapping[methodology];
    const isCompatible = methodologyInfo.goalCompatibility.includes(goal);

    return {
        isCompatible,
        phases: methodologyInfo.phases,
        periodizationStyle: methodologyInfo.periodizationStyle,
        requiredAssessments: methodologyInfo.requiredAssessments,
        timelineConsiderations: methodologyInfo.timelineConsiderations
    };
};

const getMethodologyTimeline = (timeline, methodology, methodologyMapping) => {
    if (!timeline || !methodology || !methodologyMapping[methodology]) return null;

    const considerations = methodologyMapping[methodology].timelineConsiderations;

    return {
        ...considerations,
        userTimeline: timeline,
        adjustedDuration: Math.max(timeline.duration || 8, considerations.minDuration || 4),
        recommendedFrequency: considerations.assessmentFrequency || 4
    };
};

const getMethodologyInjuryConsiderations = (injuryData, methodology, methodologyMapping) => {
    if (!injuryData || !methodology || !methodologyMapping[methodology]) return null;

    const methodologyInfo = methodologyMapping[methodology];

    // Methodology-specific injury considerations
    const considerations = {
        'NASM': {
            assessmentRequired: true,
            correctiveExercises: true,
            phaseModification: 'extend-phase-1',
            focus: 'movement-quality'
        },
        'RP': {
            volumeReduction: true,
            exerciseSubstitution: true,
            loadManagement: 'autoregulation',
            focus: 'volume-management'
        },
        '5/3/1': {
            intensityModification: true,
            accessoryFocus: true,
            loadManagement: 'percentage-reduction',
            focus: 'strength-preservation'
        },
        'linear': {
            progressionSlowing: true,
            movementModification: true,
            loadManagement: 'conservative',
            focus: 'gradual-adaptation'
        },
        'josh-bryant': {
            tacticalModification: true,
            strengthMaintenance: true,
            loadManagement: 'autoregulation',
            focus: 'readiness-optimization'
        }
    };

    return considerations[methodology] || null;
};
