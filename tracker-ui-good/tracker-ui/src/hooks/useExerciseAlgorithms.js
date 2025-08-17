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
                fatigueIndex: 4.0,
                skillRequirement: 3,
                ranges: { strength: [1, 8], hypertrophy: [8, 20], endurance: [15, 50] },
                stimulusRating: 6,
                fatigueCost: 4
            }
        },
        back: {
            deadlift: {
                name: "Deadlift",
                type: "compound",
                primaryMuscles: ["back", "glutes", "hamstrings"],
                secondaryMuscles: ["traps", "forearms", "core"],
                equipment: ["barbell"],
                fatigueIndex: 9.5,
                skillRequirement: 8,
                ranges: { strength: [1, 5], hypertrophy: [5, 8], endurance: [8, 15] },
                stimulusRating: 10,
                fatigueCost: 9
            },
            pull_ups: {
                name: "Pull-ups",
                type: "compound",
                primaryMuscles: ["back"],
                secondaryMuscles: ["biceps", "rear_delts"],
                equipment: ["pull_up_bar"],
                fatigueIndex: 7.0,
                skillRequirement: 6,
                ranges: { strength: [1, 6], hypertrophy: [6, 12], endurance: [10, 25] },
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
                ranges: { strength: [1, 6], hypertrophy: [6, 12], endurance: [10, 20] },
                stimulusRating: 8,
                fatigueCost: 7
            }
        },
        legs: {
            squat: {
                name: "Back Squat",
                type: "compound",
                primaryMuscles: ["quads", "glutes"],
                secondaryMuscles: ["calves", "core"],
                equipment: ["barbell", "squat_rack"],
                fatigueIndex: 9.0,
                skillRequirement: 8,
                ranges: { strength: [1, 5], hypertrophy: [6, 12], endurance: [12, 20] },
                stimulusRating: 10,
                fatigueCost: 8
            },
            bulgarian_split_squat: {
                name: "Bulgarian Split Squat",
                type: "unilateral",
                primaryMuscles: ["quads", "glutes"],
                secondaryMuscles: ["calves", "core"],
                equipment: ["dumbbells", "bench"],
                fatigueIndex: 6.5,
                skillRequirement: 5,
                ranges: { strength: [1, 8], hypertrophy: [8, 15], endurance: [12, 25] },
                stimulusRating: 8,
                fatigueCost: 6
            },
            leg_press: {
                name: "Leg Press",
                type: "compound",
                primaryMuscles: ["quads", "glutes"],
                secondaryMuscles: [],
                equipment: ["leg_press_machine"],
                fatigueIndex: 6.0,
                skillRequirement: 3,
                ranges: { strength: [1, 8], hypertrophy: [8, 15], endurance: [15, 25] },
                stimulusRating: 7,
                fatigueCost: 5
            }
        }
    }), []);

    /**
     * Select optimal exercises based on goals, equipment, and constraints
     */
    const selectOptimalExercises = useCallback((criteria) => {
        const {
            targetMuscles = [],
            goal = 'hypertrophy', // strength, hypertrophy, endurance
            availableEquipment = [],
            experienceLevel = 'intermediate',
            fatigueConstraint = 5, // 1-10 scale
            timeConstraint = 'normal', // short, normal, long
            unilateralPreference = false
        } = criteria;

        const recommendations = [];

        targetMuscles.forEach(muscle => {
            const muscleExercises = exerciseDatabase[muscle.toLowerCase()];
            if (!muscleExercises) return;

            const candidates = Object.entries(muscleExercises)
                .map(([key, exercise]) => ({
                    id: key,
                    ...exercise,
                    score: 0
                }))
                .filter(exercise => {
                    // Filter by equipment availability
                    const hasEquipment = exercise.equipment.every(eq =>
                        availableEquipment.includes(eq) || eq === 'bodyweight'
                    );

                    // Filter by experience level
                    const experienceMap = { beginner: 5, intermediate: 7, advanced: 10 };
                    const skillAppropriate = exercise.skillRequirement <= experienceMap[experienceLevel];

                    return hasEquipment && skillAppropriate;
                });

            // Score exercises based on criteria
            candidates.forEach(exercise => {
                let score = 0;

                // Base stimulus rating (40% weight)
                score += exercise.stimulusRating * 4;

                // Fatigue efficiency (30% weight) - higher rating for lower fatigue cost
                const fatigueEfficiency = 10 - exercise.fatigueCost;
                score += fatigueEfficiency * 3;

                // Goal-specific bonuses (20% weight)
                if (goal === 'strength' && exercise.type === 'compound') {
                    score += 20;
                } else if (goal === 'hypertrophy' && exercise.stimulusRating >= 7) {
                    score += 15;
                } else if (goal === 'endurance' && exercise.fatigueCost <= 6) {
                    score += 10;
                }

                // Unilateral preference (10% weight)
                if (unilateralPreference && exercise.type === 'unilateral') {
                    score += 10;
                } else if (!unilateralPreference && exercise.type === 'compound') {
                    score += 5;
                }

                // Time constraint adjustments
                if (timeConstraint === 'short' && exercise.type === 'compound') {
                    score += 10; // Compound exercises more time-efficient
                }

                exercise.score = Math.round(score);
            });

            // Sort by score and take top candidates
            const topCandidates = candidates
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            recommendations.push({
                muscle,
                exercises: topCandidates,
                primaryRecommendation: topCandidates[0] || null
            });
        });

        const result = {
            recommendations,
            criteria,
            generatedAt: new Date().toISOString()
        };

        setExerciseData(prev => ({ ...prev, recommendations }));
        return result;
    }, [exerciseDatabase]);

    /**
     * Generate optimal rep ranges for specific goals
     */
    const generateRepRanges = useCallback((exercise, goal, experienceLevel = 'intermediate') => {
        if (!exercise || !exercise.ranges) {
            return null;
        }

        const baseRange = exercise.ranges[goal] || exercise.ranges.hypertrophy;

        // Adjust for experience level
        const experienceAdjustments = {
            beginner: { min: +1, max: +3 }, // Higher reps for learning
            intermediate: { min: 0, max: 0 }, // Standard ranges
            advanced: { min: -1, max: +1 }   // Slightly lower reps, more intensity focus
        };

        const adjustment = experienceAdjustments[experienceLevel] || { min: 0, max: 0 };

        return {
            min: Math.max(1, baseRange[0] + adjustment.min),
            max: baseRange[1] + adjustment.max,
            recommended: Math.round((baseRange[0] + baseRange[1]) / 2),
            goal,
            experienceLevel
        };
    }, []);

    /**
     * Calculate session fatigue and suggest exercise order
     */
    const optimizeExerciseOrder = useCallback((selectedExercises) => {
        if (!selectedExercises || selectedExercises.length === 0) {
            return null;
        }

        // Sort by fatigue index (highest first) and exercise type priority
        const optimizedOrder = [...selectedExercises].sort((a, b) => {
            // Compound exercises first
            if (a.type === 'compound' && b.type !== 'compound') return -1;
            if (b.type === 'compound' && a.type !== 'compound') return 1;

            // Then by fatigue index (most fatiguing first)
            return b.fatigueIndex - a.fatigueIndex;
        });

        // Calculate cumulative fatigue
        let cumulativeFatigue = 0;
        const orderWithFatigue = optimizedOrder.map((exercise, index) => {
            cumulativeFatigue += exercise.fatigueIndex;

            return {
                ...exercise,
                order: index + 1,
                cumulativeFatigue: Math.round(cumulativeFatigue * 10) / 10,
                fatigueStatus: cumulativeFatigue < 20 ? 'fresh' :
                    cumulativeFatigue < 35 ? 'moderate' : 'high'
            };
        });

        const result = {
            optimizedOrder: orderWithFatigue,
            totalFatigue: cumulativeFatigue,
            fatigueRating: cumulativeFatigue < 20 ? 'light' :
                cumulativeFatigue < 35 ? 'moderate' :
                    cumulativeFatigue < 50 ? 'high' : 'very_high',
            recommendations: []
        };

        // Add fatigue management recommendations
        if (cumulativeFatigue > 50) {
            result.recommendations.push({
                type: 'fatigue',
                message: 'Very high session fatigue. Consider splitting into multiple sessions.'
            });
        } else if (cumulativeFatigue > 35) {
            result.recommendations.push({
                type: 'fatigue',
                message: 'High session fatigue. Ensure adequate rest between exercises.'
            });
        }

        setExerciseData(prev => ({ ...prev, optimization: result }));
        return result;
    }, []);

    /**
     * Generate weekly program structure
     */
    const generateWeeklyProgram = useCallback((programCriteria) => {
        const {
            trainingDays = 3,
            goal = 'hypertrophy',
            experienceLevel = 'intermediate',
            muscleGroups = ['chest', 'back', 'legs'],
            timePerSession = 60 // minutes
        } = programCriteria;

        const program = {
            totalDays: trainingDays,
            sessions: [],
            weeklyVolume: 0,
            balanceScore: 0
        };

        // Calculate sessions per muscle group
        const sessionsPerMuscle = Math.ceil(trainingDays / muscleGroups.length);

        // Generate sessions
        for (let day = 1; day <= trainingDays; day++) {
            const session = {
                day,
                muscleGroups: [],
                exercises: [],
                estimatedDuration: 0,
                fatigue: 0
            };

            // Distribute muscle groups across days
            const muscleIndex = (day - 1) % muscleGroups.length;
            const primaryMuscle = muscleGroups[muscleIndex];
            session.muscleGroups.push(primaryMuscle);

            // Select exercises for this muscle group
            const exerciseSelection = selectOptimalExercises({
                targetMuscles: [primaryMuscle],
                goal,
                experienceLevel,
                timeConstraint: timePerSession < 45 ? 'short' : 'normal'
            });

            if (exerciseSelection.recommendations.length > 0) {
                const primaryRec = exerciseSelection.recommendations[0].primaryRecommendation;
                if (primaryRec) {
                    session.exercises.push({
                        ...primaryRec,
                        sets: goal === 'strength' ? 5 : goal === 'hypertrophy' ? 4 : 3,
                        repRange: generateRepRanges(primaryRec, goal, experienceLevel)
                    });
                }
            }

            // Estimate session duration (15 minutes per exercise + warmup)
            session.estimatedDuration = (session.exercises.length * 15) + 10;
            session.fatigue = session.exercises.reduce((sum, ex) => sum + ex.fatigueIndex, 0);

            program.sessions.push(session);
            program.weeklyVolume += session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
        }

        // Calculate balance score (how evenly distributed muscle groups are)
        const muscleFrequency = {};
        program.sessions.forEach(session => {
            session.muscleGroups.forEach(muscle => {
                muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
            });
        });

        const frequencies = Object.values(muscleFrequency);
        const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
        const variance = frequencies.reduce((sum, freq) => sum + Math.pow(freq - avgFrequency, 2), 0) / frequencies.length;
        program.balanceScore = Math.max(0, 100 - (variance * 20)); // Higher score = better balance

        const result = {
            program,
            criteria: programCriteria,
            generatedAt: new Date().toISOString()
        };

        setExerciseData(prev => ({ ...prev, program: result.program }));
        return result;
    }, [selectOptimalExercises, generateRepRanges]);

    return {
        exerciseData,
        loading,
        exerciseDatabase,
        selectOptimalExercises,
        generateRepRanges,
        optimizeExerciseOrder,
        generateWeeklyProgram,
        setLoading
    };
};
