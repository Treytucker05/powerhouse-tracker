import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useVolumeAlgorithms } from '../tracker-ui-good/tracker-ui/src/hooks/useVolumeAlgorithms';
import { useFatigueAlgorithms } from '../tracker-ui-good/tracker-ui/src/hooks/useFatigueAlgorithms';
import { useIntelligenceAlgorithms } from '../tracker-ui-good/tracker-ui/src/hooks/useIntelligenceAlgorithms';
import { useExerciseAlgorithms } from '../tracker-ui-good/tracker-ui/src/hooks/useExerciseAlgorithms';

// Program state management
const ProgramContext = createContext();

// Action types
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
    SET_ALGORITHM_CONFIG: 'SET_ALGORITHM_CONFIG'
};

// Initial state
const initialState = {
    // UI State
    activeTab: 'personal-profile', // Start with integrated assessment
    selectedLevel: null,
    isLoading: false,
    error: null,
    showPreview: false,

    // Program Data
    programData: {
        name: '',
        goal: 'hypertrophy',
        duration: 12,
        trainingDays: 4,
        selectedTemplate: null
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
    }
};

// Reducer function
function programReducer(state, action) {
    switch (action.type) {
        case PROGRAM_ACTIONS.SET_ACTIVE_TAB:
            return { ...state, activeTab: action.payload };

        case PROGRAM_ACTIONS.SET_SELECTED_LEVEL:
            return { ...state, selectedLevel: action.payload };

        case PROGRAM_ACTIONS.SET_PROGRAM_DATA:
            return { ...state, programData: { ...state.programData, ...action.payload } };

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

    // Advanced algorithm integration functions
    const calculateVolumeProgression = useCallback(async (sessionData) => {
        if (!sessionData) return null;

        try {
            const volumeProgression = volumeAlgorithms.generateVolumeProgression({
                currentVolume: sessionData.volume,
                targetWeeks: state.programData.duration,
                goal: state.programData.goal,
                experienceLevel: state.assessmentData?.experienceLevel || 'intermediate'
            });

            updateAlgorithmData({ volumeMetrics: volumeProgression });
            return volumeProgression;
        } catch (error) {
            console.error('Volume calculation error:', error);
            return null;
        }
    }, [volumeAlgorithms, state.programData, state.assessmentData, updateAlgorithmData]);

    const analyzeFatigueStatus = useCallback(async (trainingData) => {
        if (!trainingData) return null;

        try {
            const fatigueAnalysis = fatigueAlgorithms.calculateFatigueScore({
                volume: trainingData.volume,
                intensity: trainingData.intensity,
                frequency: trainingData.frequency,
                sleepQuality: trainingData.sleepQuality || 7,
                stressLevel: trainingData.stressLevel || 5
            });

            updateAlgorithmData({ fatigueAnalysis });
            return fatigueAnalysis;
        } catch (error) {
            console.error('Fatigue analysis error:', error);
            return null;
        }
    }, [fatigueAlgorithms, updateAlgorithmData]);

    const generateIntelligentRecommendations = useCallback(async () => {
        try {
            const recommendations = intelligenceAlgorithms.generateRecommendations({
                programData: state.programData,
                assessmentData: state.assessmentData,
                volumeData: state.algorithmData.volumeMetrics,
                fatigueData: state.algorithmData.fatigueAnalysis,
                bryantConfig: state.bryantConfig
            });

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
            const exerciseSelection = exerciseAlgorithms.selectOptimalExercises({
                targetMuscles: criteria.targetMuscles || [],
                goal: state.programData.goal,
                availableEquipment: criteria.equipment || [],
                experienceLevel: state.assessmentData?.experienceLevel || 'intermediate',
                fatigueConstraint: state.algorithmData.fatigueAnalysis?.currentLevel || 5,
                timeConstraint: criteria.timeConstraint || 'normal'
            });

            const optimizedOrder = exerciseAlgorithms.optimizeExerciseOrder(
                exerciseSelection.recommendations.map(r => r.primaryRecommendation).filter(Boolean)
            );

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
        // Advanced algorithm functions
        calculateVolumeProgression,
        analyzeFatigueStatus,
        generateIntelligentRecommendations,
        optimizeExerciseSelection,
        generateOptimizedProgram
    };

    // Enhanced context value with algorithm capabilities
    const contextValue = {
        state,
        actions,
        // Direct algorithm hook access for advanced use cases
        algorithms: {
            volume: volumeAlgorithms,
            fatigue: fatigueAlgorithms,
            intelligence: intelligenceAlgorithms,
            exercise: exerciseAlgorithms
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
