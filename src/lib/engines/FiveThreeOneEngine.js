/**
 * 5/3/1 Training System Engine
 * Based on Jim Wendler's 5/3/1 methodology
 */

export class FiveThreeOneEngine {
    // Core lifts from Jim Wendler's system
    coreLlifts = ['squat', 'bench', 'deadlift', 'overhead_press'];

    // Week patterns (Classic 5/3/1)
    weekPatterns = {
        week1: {
            name: 'Week 1',
            sets: [5, 5, 5],
            percentages: [65, 75, 85],
            amrap: true,
            description: '3x5+ (65%, 75%, 85%)'
        },
        week2: {
            name: 'Week 2',
            sets: [3, 3, 3],
            percentages: [70, 80, 90],
            amrap: true,
            description: '3x3+ (70%, 80%, 90%)'
        },
        week3: {
            name: 'Week 3',
            sets: [5, 3, 1],
            percentages: [75, 85, 95],
            amrap: true,
            description: '5/3/1+ (75%, 85%, 95%)'
        },
        week4: {
            name: 'Week 4 (Deload)',
            sets: [5, 5, 5],
            percentages: [40, 50, 60],
            amrap: false,
            description: '3x5 (40%, 50%, 60%)'
        }
    };

    // Assistance work templates
    assistanceTemplates = {
        bbb: {
            name: 'Boring But Big',
            description: '5x10 at 50-60% of main lift',
            exercises: {
                squat: ['squat', 'leg_press', 'lunges'],
                bench: ['bench_press', 'dumbbell_bench', 'incline_press'],
                deadlift: ['deadlift', 'romanian_deadlift', 'stiff_leg_deadlift'],
                overhead_press: ['overhead_press', 'dumbbell_press', 'push_press']
            }
        },
        triumvirate: {
            name: 'The Triumvirate',
            description: 'Two assistance exercises per workout',
            exercises: {
                squat: ['leg_press', 'leg_curls'],
                bench: ['dumbbell_rows', 'dips'],
                deadlift: ['good_mornings', 'hanging_leg_raises'],
                overhead_press: ['dips', 'chin_ups']
            }
        },
        simple: {
            name: "I'm Not Doing Jack Shit",
            description: 'Main lift only, minimal assistance',
            exercises: {
                squat: ['bodyweight_squats'],
                bench: ['push_ups'],
                deadlift: ['planks'],
                overhead_press: ['face_pulls']
            }
        }
    };

    /**
     * Calculate estimated 1RM using Epley formula
     * @param {number} weight - Weight lifted
     * @param {number} reps - Reps completed
     * @returns {number} Estimated 1RM
     */
    calculateEst1RM(weight, reps) {
        if (reps === 1) return weight;
        return Math.round(weight * (1 + reps / 30));
    }

    /**
     * Calculate training max (90% of 1RM)
     * @param {number} oneRM - True or estimated 1RM
     * @returns {number} Training max
     */
    calculateTrainingMax(oneRM) {
        return Math.round(oneRM * 0.9);
    }

    /**
     * Calculate working weight for a given percentage
     * @param {number} trainingMax - Training max weight
     * @param {number} percentage - Percentage to calculate
     * @returns {number} Working weight
     */
    calculateWorkingWeight(trainingMax, percentage) {
        return Math.round((trainingMax * percentage) / 100);
    }

    /**
     * Generate a single workout for a lift
     * @param {string} lift - The main lift
     * @param {string} week - Week pattern (week1, week2, etc.)
     * @param {number} trainingMax - Training max for the lift
     * @param {string} assistanceType - Type of assistance work
     * @returns {object} Complete workout
     */
    generateWorkout(lift, week, trainingMax, assistanceType = 'bbb') {
        const pattern = this.weekPatterns[week];
        const assistance = this.assistanceTemplates[assistanceType];

        // Generate main lift sets
        const mainSets = pattern.sets.map((reps, index) => {
            const percentage = pattern.percentages[index];
            const weight = this.calculateWorkingWeight(trainingMax, percentage);
            const isAmrap = pattern.amrap && index === pattern.sets.length - 1;

            return {
                exercise: lift,
                weight,
                reps: isAmrap ? `${reps}+` : reps,
                percentage,
                isAmrap,
                notes: isAmrap ? 'As Many Reps As Possible' : ''
            };
        });

        // Generate assistance work
        const assistanceExercises = assistance.exercises[lift] || [];
        const assistanceSets = assistanceExercises.map(exercise => {
            if (assistanceType === 'bbb') {
                return {
                    exercise,
                    sets: 5,
                    reps: 10,
                    weight: this.calculateWorkingWeight(trainingMax, 50),
                    notes: '50% of training max'
                };
            } else if (assistanceType === 'triumvirate') {
                return {
                    exercise,
                    sets: 3,
                    reps: '8-12',
                    weight: 'moderate',
                    notes: 'Choose appropriate weight'
                };
            } else {
                return {
                    exercise,
                    sets: 2,
                    reps: '10-15',
                    weight: 'light',
                    notes: 'Recovery/mobility work'
                };
            }
        });

        return {
            lift,
            week,
            pattern: pattern.description,
            mainSets,
            assistanceSets,
            notes: pattern.amrap ? 'Push the final set for max reps' : 'Focus on form and speed'
        };
    }

    /**
     * Generate a complete 4-week cycle
     * @param {object} userMaxes - Object with 1RM for each lift
     * @param {string} assistanceType - Type of assistance work
     * @param {number} trainingDays - Days per week (3 or 4)
     * @returns {object} Complete 4-week program
     */
    generateCycle(userMaxes, assistanceType = 'bbb', trainingDays = 4) {
        // Calculate training maxes
        const trainingMaxes = {};
        this.coreLlifts.forEach(lift => {
            trainingMaxes[lift] = this.calculateTrainingMax(userMaxes[lift]);
        });

        // Define training split
        const splits = {
            3: [
                ['squat', 'bench'],
                ['deadlift'],
                ['overhead_press', 'squat']
            ],
            4: [
                ['squat'],
                ['bench'],
                ['deadlift'],
                ['overhead_press']
            ]
        };

        const weekDays = splits[trainingDays];
        const cycle = {};

        // Generate each week
        Object.keys(this.weekPatterns).forEach(week => {
            cycle[week] = {
                name: this.weekPatterns[week].name,
                workouts: weekDays.map((dayLifts, dayIndex) => {
                    const workouts = dayLifts.map(lift =>
                        this.generateWorkout(lift, week, trainingMaxes[lift], assistanceType)
                    );

                    return {
                        day: dayIndex + 1,
                        lifts: dayLifts,
                        workouts
                    };
                })
            };
        });

        return {
            trainingMaxes,
            cycle,
            assistanceType,
            trainingDays,
            metadata: {
                createdAt: new Date().toISOString(),
                type: '531',
                version: '1.0'
            }
        };
    }

    /**
     * Process AMRAP set results and suggest progression
     * @param {string} lift - The lift performed
     * @param {number} weight - Weight used
     * @param {number} actualReps - Reps completed
     * @param {number} targetReps - Target reps for the set
     * @returns {object} Progression recommendation
     */
    processAmrapResult(lift, weight, actualReps, targetReps) {
        const repsDifference = actualReps - targetReps;

        let recommendation = '';
        let confidence = 'medium';

        if (repsDifference >= 3) {
            recommendation = 'Excellent! Consider increasing training max next cycle.';
            confidence = 'high';
        } else if (repsDifference >= 1) {
            recommendation = 'Good progress. Stay with current training max.';
            confidence = 'medium';
        } else if (repsDifference === 0) {
            recommendation = 'On target. Continue with current progression.';
            confidence = 'medium';
        } else {
            recommendation = 'Consider reducing training max or taking a deload week.';
            confidence = 'low';
        }

        return {
            lift,
            weight,
            actualReps,
            targetReps,
            repsDifference,
            recommendation,
            confidence,
            estimatedMax: this.calculateEst1RM(weight, actualReps)
        };
    }

    /**
     * Progress training maxes for next cycle
     * @param {object} currentMaxes - Current training maxes
     * @param {object} progressionRates - Progression rates per lift category
     * @returns {object} New training maxes
     */
    progressCycle(currentMaxes, progressionRates = { upper: 5, lower: 10 }) {
        const newMaxes = { ...currentMaxes };

        // Upper body lifts progress slower
        newMaxes.bench += progressionRates.upper;
        newMaxes.overhead_press += progressionRates.upper;

        // Lower body lifts progress faster
        newMaxes.squat += progressionRates.lower;
        newMaxes.deadlift += progressionRates.lower;

        return newMaxes;
    }

    /**
     * Validate user input maxes
     * @param {object} maxes - User provided maxes
     * @returns {object} Validation results
     */
    validateMaxes(maxes) {
        const errors = [];
        const warnings = [];

        this.coreLlifts.forEach(lift => {
            const max = maxes[lift];

            if (!max || max <= 0) {
                errors.push(`${lift} max is required and must be greater than 0`);
            } else if (max < 45) {
                warnings.push(`${lift} max seems low. Consider starting with bodyweight exercises.`);
            } else if (max > 800) {
                warnings.push(`${lift} max seems very high. Please double-check the value.`);
            }
        });

        // Sanity check ratios
        if (maxes.deadlift && maxes.squat && maxes.deadlift < maxes.squat) {
            warnings.push('Deadlift is typically higher than squat. Please verify your maxes.');
        }

        if (maxes.squat && maxes.bench && maxes.bench > maxes.squat) {
            warnings.push('Squat is typically higher than bench press. Please verify your maxes.');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}

export default FiveThreeOneEngine;
