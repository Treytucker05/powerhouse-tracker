import React, { createContext, useContext, useReducer, useCallback } from 'react';

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
    UPDATE_BLOCK_PARAMETER: 'UPDATE_BLOCK_PARAMETER'
};

// Initial state
const initialState = {
    // UI State
    activeTab: 'overview',
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
    rom: 'Full'
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

        default:
            return state;
    }
}

// Context Provider
export const ProgramProvider = ({ children }) => {
    const [state, dispatch] = useReducer(programReducer, initialState);

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
        setError
    };

    return (
        <ProgramContext.Provider value={{ state, actions }}>
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
export { ProgramProvider };
