import { useCallback, useEffect } from 'react';
import { useProgramContext } from '../contexts/ProgramContext';
import { toast } from 'react-toastify';

// Hook for managing assessment data
export const useAssessmentData = () => {
    const { state, actions } = useProgramContext();

    useEffect(() => {
        // Only load if we don't already have assessment data
        if (state.assessmentData) return;

        const loadAssessmentData = async () => {
            try {
                actions.setLoading(true);
                // Simulate API call - replace with actual Supabase query
                const mockAssessmentData = {
                    id: 1,
                    movement_screen: 'Completed',
                    experience_level: 'Intermediate',
                    training_history: '2-3 years consistent training',
                    mobility_score: 7.5,
                    stability_score: 8.0,
                    strength_score: 6.5
                };

                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                actions.setAssessmentData(mockAssessmentData);
            } catch (error) {
                console.error('Error loading assessment data:', error);
                actions.setError('Failed to load assessment data');
                toast.error('Failed to load assessment data');
            } finally {
                actions.setLoading(false);
            }
        };

        loadAssessmentData();
    }, [state.assessmentData, actions.setLoading, actions.setAssessmentData, actions.setError]);

    return {
        assessmentData: state.assessmentData,
        isLoading: state.isLoading,
        error: state.error
    };
};

// Hook for managing block parameters
export const useBlockParameters = () => {
    const { state, actions } = useProgramContext();

    const updateBlockParameter = useCallback((blockId, parameter, value) => {
        actions.updateBlockParameter(blockId, { [parameter]: value });
    }, [actions.updateBlockParameter]);

    const calculateLoadingResults = useCallback(async (blockId) => {
        try {
            const blockParams = state.blockParameters[blockId];
            if (!blockParams) return;

            // Simulate calculation
            const results = {
                recommended_load: blockParams.loading,
                volume_load: blockParams.loading * 0.8,
                intensity_zone: blockParams.loading > 80 ? 'High' : blockParams.loading > 60 ? 'Moderate' : 'Low',
                recovery_time: blockParams.loading > 80 ? '72-96h' : '48-72h'
            };

            actions.updateBlockParameter(blockId, { loadingResults: results });
            return results;
        } catch (error) {
            console.error('Error calculating loading results:', error);
            toast.error('Failed to calculate loading parameters');
        }
    }, [state.blockParameters, actions.updateBlockParameter]);

    return {
        blockParameters: state.blockParameters,
        activeBlockTab: state.activeBlockTab,
        updateBlockParameter,
        calculateLoadingResults
    };
};

// Hook for program generation
export const useProgramGeneration = () => {
    const { state, actions } = useProgramContext();

    const generateProgram = useCallback(async () => {
        try {
            actions.setLoading(true);

            // Validate required data
            if (!state.assessmentData) {
                throw new Error('Assessment data is required');
            }

            if (!state.selectedTrainingModel) {
                throw new Error('Training model selection is required');
            }

            // Simulate program generation
            const generatedProgram = {
                id: Date.now(),
                name: state.programData.name || 'Custom Program',
                duration: state.programData.duration,
                blocks: state.blockSequence.map(block => ({
                    ...block,
                    parameters: state.blockParameters[block.id],
                    workouts: generateWorkoutsForBlock(block, state.blockParameters[block.id])
                })),
                metadata: {
                    trainingModel: state.selectedTrainingModel,
                    assessmentData: state.assessmentData,
                    generatedAt: new Date().toISOString()
                }
            };

            actions.setGeneratedProgram(generatedProgram);
            toast.success('Program generated successfully!');

            return generatedProgram;
        } catch (error) {
            console.error('Error generating program:', error);
            actions.setError(error.message);
            toast.error(error.message);
        } finally {
            actions.setLoading(false);
        }
    }, [state.assessmentData, state.selectedTrainingModel, state.programData, state.blockSequence, state.blockParameters, actions.setLoading, actions.setGeneratedProgram, actions.setError]);

    const generateProgramStructure = useCallback(() => {
        if (!Array.isArray(state.blockSequence)) {
            console.warn('Block sequence is not an array:', state.blockSequence);
            return [];
        }

        return state.blockSequence.map(block => ({
            id: block.id,
            name: block.name,
            duration: block.duration,
            phase: block.phase,
            parameters: state.blockParameters?.[block.id] || {},
            description: block.description
        }));
    }, [state.blockSequence, state.blockParameters]);

    return {
        generatedProgram: state.generatedProgram,
        isLoading: state.isLoading,
        error: state.error,
        generateProgram,
        generateProgramStructure
    };
};

// Helper function to generate workouts for a block
const generateWorkoutsForBlock = (block, parameters) => {
    const workoutsPerWeek = 4; // Default training frequency
    const workouts = [];

    for (let week = 1; week <= block.duration; week++) {
        for (let day = 1; day <= workoutsPerWeek; day++) {
            workouts.push({
                id: `${block.id}-w${week}-d${day}`,
                week,
                day,
                exercises: generateExercisesForWorkout(block.phase, parameters),
                intensity: calculateIntensity(block.phase, week, block.duration),
                volume: calculateVolume(block.phase, week, block.duration)
            });
        }
    }

    return workouts;
};

// Helper function to generate exercises
const generateExercisesForWorkout = (phase, parameters) => {
    const baseExercises = [
        'Squat Variation',
        'Hinge Movement',
        'Upper Push',
        'Upper Pull',
        'Single Leg',
        'Core/Stability'
    ];

    return baseExercises.map((exercise, index) => ({
        id: `ex-${index}`,
        name: exercise,
        sets: calculateSets(phase),
        reps: calculateReps(phase, parameters?.loading || 70),
        load: parameters?.loading || 70,
        tempo: '3010',
        rest: calculateRest(phase)
    }));
};

// Helper functions for workout calculations
const calculateIntensity = (phase, week, totalWeeks) => {
    const baseIntensity = {
        accumulation: 65,
        intensification: 80,
        realization: 90,
        deload: 50
    };

    const progression = (week / totalWeeks) * 10;
    return Math.min(baseIntensity[phase] + progression, 95);
};

const calculateVolume = (phase, week, totalWeeks) => {
    const baseVolume = {
        accumulation: 20,
        intensification: 15,
        realization: 10,
        deload: 8
    };

    return baseVolume[phase];
};

const calculateSets = (phase) => {
    const sets = {
        accumulation: 4,
        intensification: 3,
        realization: 2,
        deload: 2
    };

    return sets[phase] || 3;
};

const calculateReps = (phase, loading) => {
    if (loading >= 85) return '1-3';
    if (loading >= 75) return '3-6';
    if (loading >= 65) return '6-10';
    return '10-15';
};

const calculateRest = (phase) => {
    const rest = {
        accumulation: '60-90s',
        intensification: '2-3min',
        realization: '3-5min',
        deload: '60s'
    };

    return rest[phase] || '2min';
};
