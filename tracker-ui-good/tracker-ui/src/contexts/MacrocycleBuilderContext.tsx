import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { debug, error as logError } from "../utils/logger";

// Types
export interface ProgramDetails {
    name: string;
    trainingExperience: 'beginner' | 'intermediate' | 'advanced' | '';
    dietPhase: 'bulk' | 'maintenance' | 'cut' | '';
    duration: number;
    trainingDaysPerWeek: number;
    startDate: string;
}

export interface Block {
    id: string;
    name: string;
    type: 'accumulation' | 'intensification' | 'realization' | 'deload';
    weeks: number;
    rirRange: [number, number];
    volumeProgression: 'linear' | 'undulating' | 'block';
}

export interface MacrocycleBuilderState {
    currentStep: number;
    programDetails: ProgramDetails;
    blocks: Block[];
    selectedTemplate: string;
    specialization: string;
    isValid: boolean;
}

// Action Types
export type MacrocycleBuilderAction =
    | { type: 'UPDATE_PROGRAM_DETAILS'; payload: Partial<ProgramDetails> }
    | { type: 'SET_STEP'; payload: number }
    | { type: 'ADD_BLOCK'; payload: Block }
    | { type: 'UPDATE_BLOCK'; payload: { id: string; updates: Partial<Block> } }
    | { type: 'REMOVE_BLOCK'; payload: string }
    | { type: 'SET_TEMPLATE'; payload: string }
    | { type: 'SET_BLOCKS'; payload: Block[] }
    | { type: 'SET_SPECIALIZATION'; payload: string }
    | { type: 'RESET_BUILDER' }
    | { type: 'HYDRATE_STATE'; payload: MacrocycleBuilderState };

// Initial State
const initialState: MacrocycleBuilderState = {
    currentStep: 1,
    programDetails: {
        name: '',
        trainingExperience: '',
        dietPhase: '',
        duration: 12,
        trainingDaysPerWeek: 4,
        startDate: '',
    },
    blocks: [],
    selectedTemplate: '',
    specialization: 'None',
    isValid: false,
};

// Validation Functions
const validateProgramDetails = (details: ProgramDetails): boolean => {
    return !!(
        details.name.trim().length >= 3 &&
        details.name.trim().length <= 50 &&
        details.trainingExperience &&
        details.dietPhase &&
        details.duration >= 8 &&
        details.duration <= 24 &&
        details.trainingDaysPerWeek >= 3 &&
        details.trainingDaysPerWeek <= 6
    );
};

const validateCurrentStep = (state: MacrocycleBuilderState): boolean => {
    switch (state.currentStep) {
        case 1:
            return validateProgramDetails(state.programDetails);
        case 2:
            return !!state.selectedTemplate;
        case 3:
            return state.blocks.length > 0;
        case 3.5:
            return state.blocks.length > 0; // Volume distribution requires blocks
        case 4:
            return true; // Review step
        default:
            return false;
    }
};

// Reducer
const macrocycleBuilderReducer = (
    state: MacrocycleBuilderState,
    action: MacrocycleBuilderAction
): MacrocycleBuilderState => {
    let newState: MacrocycleBuilderState;

    switch (action.type) {
        case 'UPDATE_PROGRAM_DETAILS':
            newState = {
                ...state,
                programDetails: {
                    ...state.programDetails,
                    ...action.payload,
                },
            };
            break;

        case 'SET_STEP':
            newState = {
                ...state,
                currentStep: action.payload,
            };
            break;

        case 'ADD_BLOCK':
            newState = {
                ...state,
                blocks: [...state.blocks, action.payload],
            };
            break;

        case 'UPDATE_BLOCK':
            newState = {
                ...state,
                blocks: state.blocks.map(block =>
                    block.id === action.payload.id
                        ? { ...block, ...action.payload.updates }
                        : block
                ),
            };
            break;

        case 'REMOVE_BLOCK':
            newState = {
                ...state,
                blocks: state.blocks.filter(block => block.id !== action.payload),
            };
            break;

        case 'SET_TEMPLATE':
            newState = {
                ...state,
                selectedTemplate: action.payload,
            };
            break;

        case 'SET_BLOCKS':
            newState = {
                ...state,
                blocks: action.payload,
            };
            break;

        case 'SET_SPECIALIZATION':
            newState = {
                ...state,
                specialization: action.payload,
            };
            break;

        case 'RESET_BUILDER':
            newState = { ...initialState };
            break;

        case 'HYDRATE_STATE':
            newState = action.payload;
            break;

        default:
            return state;
    }

    // Update validation
    newState.isValid = validateCurrentStep(newState);

    return newState;
};

// Context
interface MacrocycleBuilderContextType {
    state: MacrocycleBuilderState;
    dispatch: React.Dispatch<MacrocycleBuilderAction>;
    validateCurrentStep: () => boolean;
    canProceedToNextStep: () => boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
}

const MacrocycleBuilderContext = createContext<MacrocycleBuilderContextType | undefined>(undefined);

// Provider Component
interface MacrocycleBuilderProviderProps {
    children: ReactNode;
}

export const MacrocycleBuilderProvider: React.FC<MacrocycleBuilderProviderProps> = ({ children }) => {
    debug("🟢 MacrocycleBuilderProvider rendering...");

    const [state, dispatch] = useReducer(macrocycleBuilderReducer, initialState);

    debug("🟢 MacrocycleBuilderProvider state:", state);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('macrocycleBuilderState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                dispatch({ type: 'HYDRATE_STATE', payload: parsed });
            } catch (error) {
                logError("Failed to parse saved macrocycle builder state:", error);
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('macrocycleBuilderState', JSON.stringify(state));
    }, [state]);

    // Helper functions
    const validateCurrentStepFn = (): boolean => {
        return validateCurrentStep(state);
    };

    const canProceedToNextStep = (): boolean => {
        return validateCurrentStepFn() && state.currentStep < 4;
    };

    const goToNextStep = (): void => {
        if (canProceedToNextStep()) {
            dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
        }
    };

    const goToPreviousStep = (): void => {
        if (state.currentStep > 1) {
            dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
        }
    };

    const contextValue: MacrocycleBuilderContextType = {
        state,
        dispatch,
        validateCurrentStep: validateCurrentStepFn,
        canProceedToNextStep,
        goToNextStep,
        goToPreviousStep,
    };

    return (
        <MacrocycleBuilderContext.Provider value={contextValue}>
            {children}
        </MacrocycleBuilderContext.Provider>
    );
};

// Custom hook to use the context
export const useBuilder = (): MacrocycleBuilderContextType => {
    debug("🟢 useBuilder hook called...");

    const context = useContext(MacrocycleBuilderContext);
    if (context === undefined) {
        logError("🚨 useBuilder: Context is undefined! Must be used within a MacrocycleBuilderProvider");
        throw new Error("useBuilder must be used within a MacrocycleBuilderProvider");
    }

    debug("🟢 useBuilder context:", context);
    return context;
};

export default MacrocycleBuilderContext;
