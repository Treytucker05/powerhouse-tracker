/**
 * React Hook for Exercise Selection Algorithms
 * Modernized from js/algorithms/exerciseSelection.js
 * Provides intelligent exercise selection and program optimization
 */

import { useState, useCallback, useMemo } from 'react';

export const useExerciseAlgorithms = () => {
    const [exerciseData, setExerciseData] = useState({
        recommendations: [],
        program: null,
        optimization: null
    });

    const [loading, setLoading] = useState(false);

    // Exercise database with biomechanical and fatigue profiles
    const exerciseDatabase = useMemo(() => ({
        chest: {
            barbell_bench_press: {
                name: "Barbell Bench Press",
                type: "compound",
                primaryMuscles: ["chest"],
                secondaryMuscles: ["triceps", "front_delts"],
                equipment: ["barbell", "bench"],
                fatigueIndex: 8.5,
                skillRequirement: 7,
                ranges: { strength: [1, 5], hypertrophy: [6, 12], endurance: [12, 20] },
                stimulusRating: 9,
                fatigueCost: 8
            },
            dumbbell_bench_press: {
                name: "Dumbbell Bench Press",
                type: "compound",
                primaryMuscles: ["chest"],
                secondaryMuscles: ["triceps", "front_delts"],
                equipment: ["dumbbells", "bench"],
                fatigueIndex: 7.5,
                skillRequirement: 6,
                ranges: { strength: [1, 6], hypertrophy: [6, 15], endurance: [12, 25] },
                stimulusRating: 8,
                fatigueCost: 7
            },
            push_ups: {
                name: "Push-ups",
                type: "compound",
                primaryMuscles: ["chest"],
                secondaryMuscles: ["triceps", "front_delts", "core"],
                equipment: ["bodyweight"],
                fatigueIndex: 4,
                skillRequirement: 3,
                ranges: { strength: [5, 15], hypertrophy: [10, 25], endurance: [20, 50] },
                stimulusRating: 6,
                fatigueCost: 4
            },
            incline_dumbbell_press: {
                name: "Incline Dumbbell Press",
                type: "compound",
                primaryMuscles: ["chest", "front_delts"],
                secondaryMuscles: ["triceps"],
                equipment: ["dumbbells", "incline_bench"],
                fatigueIndex: 7,
                skillRequirement: 6,
                ranges: { strength: [1, 6], hypertrophy: [6, 15], endurance: [12, 20] },
                stimulusRating: 8,
                fatigueCost: 7
            }
        },
        back: {
            deadlift: {
                name: "Deadlift",
                type: "compound",
                primaryMuscles: ["back", "glutes", "hamstrings"],
                secondaryMuscles: ["traps", "rhomboids", "core"],
                equipment: ["barbell"],
                fatigueIndex: 9.5,
                skillRequirement: 8,
                ranges: { strength: [1, 5], hypertrophy: [3, 8], endurance: [8, 15] },
                stimulusRating: 10,
                fatigueCost: 9
            },
            pull_ups: {
                name: "Pull-ups",
                type: "compound",
                primaryMuscles: ["back"],
                secondaryMuscles: ["biceps", "rear_delts"],
                equipment: ["pull_up_bar"],
                fatigueIndex: 7,
                skillRequirement: 6,
                ranges: { strength: [1, 8], hypertrophy: [5, 15], endurance: [10, 25] },
                stimulusRating: 9,
                fatigueCost: 6
            },
            barbell_rows: {
                name: "Barbell Rows",
                type: "compound",
                primaryMuscles: ["back"],
                secondaryMuscles: ["biceps", "rear_delts"],
                equipment: ["barbell"],
                fatigueIndex: 7.5,
                skillRequirement: 7,
                ranges: { strength: [1, 6], hypertrophy: [6, 12], endurance: [12, 20] },
                stimulusRating: 8,
                fatigueCost: 7
            }
        },
        legs: {
            squat: {
                name: "Back Squat",
                type: "compound",
                primaryMuscles: ["quads", "glutes"],
                secondaryMuscles: ["hamstrings", "core"],
                equipment: ["barbell", "squat_rack"],
                fatigueIndex: 9,
                skillRequirement: 8,
                ranges: { strength: [1, 5], hypertrophy: [6, 15], endurance: [15, 25] },
                stimulusRating: 9,
                fatigueCost: 8
            },
            romanian_deadlift: {
                name: "Romanian Deadlift",
                type: "compound",
                primaryMuscles: ["hamstrings", "glutes"],
                secondaryMuscles: ["back"],
                equipment: ["barbell"],
                fatigueIndex: 7,
                skillRequirement: 6,
                ranges: { strength: [1, 8], hypertrophy: [8, 15], endurance: [15, 25] },
                stimulusRating: 8,
                fatigueCost: 6
            },
            leg_press: {
                name: "Leg Press",
                type: "compound",
                primaryMuscles: ["quads", "glutes"],
                secondaryMuscles: [],
                equipment: ["leg_press_machine"],
                fatigueIndex: 6,
                skillRequirement: 3,
                ranges: { strength: [3, 10], hypertrophy: [10, 20], endurance: [20, 40] },
                stimulusRating: 7,
                fatigueCost: 5
            }
        }
    }), []);

    /**
     * Select exercises based on goals, equipment, and fatigue constraints
     */
    const selectExercises = useCallback((criteria) => {
        const {
            muscleGroups = [],
            goal = 'hypertrophy',
            equipment = [],
            maxFatigueIndex = 8,
            experienceLevel = 'intermediate',
            sessionType = 'normal'
        } = criteria;

        const selectedExercises = [];
        const fatigueAccumulation = 0;

        muscleGroups.forEach(muscleGroup => {
            const availableExercises = exerciseDatabase[muscleGroup.toLowerCase()] || {};

            // Filter by equipment availability
            const equipmentFiltered = Object.entries(availableExercises).filter(([key, exercise]) => {
                return exercise.equipment.every(req => equipment.includes(req) || req === 'bodyweight');
            });

            // Filter by experience level
            const experienceFiltered = equipmentFiltered.filter(([key, exercise]) => {
                const maxSkill = experienceLevel === 'beginner' ? 5 :
                    experienceLevel === 'intermediate' ? 8 : 10;
                return exercise.skillRequirement <= maxSkill;
            });

            // Sort by stimulus rating and fatigue efficiency
            const prioritized = experienceFiltered.sort(([keyA, exerciseA], [keyB, exerciseB]) => {
                const efficiencyA = exerciseA.stimulusRating / exerciseA.fatigueCost;
                const efficiencyB = exerciseB.stimulusRating / exerciseB.fatigueCost;
                return efficiencyB - efficiencyA;
            });

            // Select primary exercise
            if (prioritized.length > 0) {
                const [primaryKey, primaryExercise] = prioritized[0];
                const repRange = primaryExercise.ranges[goal] || primaryExercise.ranges.hypertrophy;

                selectedExercises.push({
                    id: primaryKey,
                    ...primaryExercise,
                    repRange,
                    role: 'primary',
                    muscleGroup,
                    sets: goal === 'strength' ? 4 : goal === 'hypertrophy' ? 3 : 2
                });

                // Add accessory if session allows
                if (sessionType !== 'minimal' && prioritized.length > 1) {
                    const [accessoryKey, accessoryExercise] = prioritized[1];
                    if (accessoryExercise.fatigueIndex <= maxFatigueIndex) {
                        selectedExercises.push({
                            id: accessoryKey,
                            ...accessoryExercise,
                            repRange: accessoryExercise.ranges[goal] || accessoryExercise.ranges.hypertrophy,
                            role: 'accessory',
                            muscleGroup,
                            sets: 2
                        });
                    }
                }
            }
        });

        setExerciseData(prev => ({
            ...prev,
            recommendations: selectedExercises
        }));

        return selectedExercises;
    }, [exerciseDatabase]);

    /**
     * Optimize exercise order based on fatigue and muscle activation
     */
    const optimizeExerciseOrder = useCallback((exercises) => {
        if (!exercises || exercises.length === 0) {
            return [];
        }

        // Create working copy
        const exercisesCopy = [...exercises];

        // Sort by priority: compound first, then by fatigue index (highest first)
        const optimized = exercisesCopy.sort((a, b) => {
            // Primary exercises first
            if (a.role === 'primary' && b.role !== 'primary') return -1;
            if (b.role === 'primary' && a.role !== 'primary') return 1;

            // Compound exercises first
            if (a.type === 'compound' && b.type !== 'compound') return -1;
            if (b.type === 'compound' && a.type !== 'compound') return 1;

            // Higher fatigue exercises first (when fresh)
            return b.fatigueIndex - a.fatigueIndex;
        });

        setExerciseData(prev => ({
            ...prev,
            optimization: { orderedExercises: optimized }
        }));

        return optimized;
    }, []);

    /**
     * Generate complete workout program
     */
    const generateWorkoutProgram = useCallback((programParams) => {
        const {
            goal = 'hypertrophy',
            daysPerWeek = 4,
            experienceLevel = 'intermediate',
            equipment = ['barbell', 'dumbbells', 'bench'],
            preferences = {}
        } = programParams;

        const program = {
            goal,
            daysPerWeek,
            weeks: 4,
            sessions: []
        };

        // Define muscle group splits based on days per week
        const splits = {
            3: [
                ['chest', 'back'],
                ['legs'],
                ['back', 'chest']
            ],
            4: [
                ['chest', 'back'],
                ['legs'],
                ['chest', 'back'],
                ['legs']
            ],
            5: [
                ['chest'],
                ['back'],
                ['legs'],
                ['chest'],
                ['back']
            ]
        };

        const selectedSplit = splits[daysPerWeek] || splits[4];

        // Generate sessions
        selectedSplit.forEach((muscleGroups, dayIndex) => {
            const sessionExercises = selectExercises({
                muscleGroups,
                goal,
                equipment,
                experienceLevel,
                sessionType: 'normal'
            });

            const optimizedOrder = optimizeExerciseOrder(sessionExercises);

            program.sessions.push({
                day: dayIndex + 1,
                name: `Day ${dayIndex + 1}: ${muscleGroups.join(' & ')}`,
                muscleGroups,
                exercises: optimizedOrder,
                estimatedDuration: optimizedOrder.length * 8 + 15 // Rough estimate
            });
        });

        setExerciseData(prev => ({
            ...prev,
            program
        }));

        return program;
    }, [selectExercises, optimizeExerciseOrder]);

    /**
     * Analyze exercise effectiveness based on user feedback
     */
    const analyzeExerciseEffectiveness = useCallback((exerciseHistory) => {
        if (!exerciseHistory || exerciseHistory.length === 0) {
            return null;
        }

        const analysis = {};

        exerciseHistory.forEach(session => {
            session.exercises?.forEach(exercise => {
                const key = exercise.name;
                if (!analysis[key]) {
                    analysis[key] = {
                        name: exercise.name,
                        sessions: 0,
                        avgStimulus: 0,
                        avgFatigue: 0,
                        progression: 0,
                        effectiveness: 0
                    };
                }

                analysis[key].sessions++;

                // Track stimulus ratings
                if (exercise.stimulusRating) {
                    analysis[key].avgStimulus =
                        (analysis[key].avgStimulus * (analysis[key].sessions - 1) + exercise.stimulusRating) / analysis[key].sessions;
                }

                // Track fatigue
                if (exercise.fatigueCost) {
                    analysis[key].avgFatigue =
                        (analysis[key].avgFatigue * (analysis[key].sessions - 1) + exercise.fatigueCost) / analysis[key].sessions;
                }
            });
        });

        // Calculate effectiveness scores
        Object.values(analysis).forEach(exercise => {
            exercise.effectiveness = exercise.avgStimulus / Math.max(exercise.avgFatigue, 1);
        });

        return analysis;
    }, []);

    return {
        exerciseData,
        exerciseDatabase,
        loading,
        selectExercises,
        optimizeExerciseOrder,
        generateWorkoutProgram,
        analyzeExerciseEffectiveness,
        setLoading
    };
};
