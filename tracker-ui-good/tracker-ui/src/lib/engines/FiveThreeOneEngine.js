/**
 * Complete 5/3/1 Training System Engine
 * Based on Jim Wendler's 5/3/1 methodology
 */

class FiveThreeOneEngine {
    constructor() {
        // Both percentage options from manual
        this.percentageSchemes = {
            option1: {
                week1: { sets: [5, 5, 5], percentages: [65, 75, 85], amrap: true },
                week2: { sets: [3, 3, 3], percentages: [70, 80, 90], amrap: true },
                week3: { sets: [5, 3, 1], percentages: [75, 85, 95], amrap: true },
                week4: { sets: [5, 5, 5], percentages: [40, 50, 60], amrap: false }
            },
            option2: {
                week1: { sets: [5, 5, 5], percentages: [75, 80, 85], amrap: true },
                week2: { sets: [3, 3, 3], percentages: [80, 85, 90], amrap: true },
                week3: { sets: [5, 3, 1], percentages: [75, 85, 95], amrap: true },
                week4: { sets: [5, 5, 5], percentages: [40, 50, 60], amrap: false }
            }
        };

        // All assistance templates from manual
        this.assistanceTemplates = {
            bbb: {
                name: "Boring But Big",
                description: "Same lift 5x10 after main work",
                loads: { beginner: 30, intermediate: 40, advanced: 50 }
            },
            triumvirate: {
                name: "Triumvirate",
                description: "3 exercises total per day"
            },
            jackshit: {
                name: "I'm Not Doing Jack Shit",
                description: "Main lift only"
            },
            periodization_bible: {
                name: "Periodization Bible",
                description: "3 categories x 5x10-20 each"
            },
            bodyweight: {
                name: "Bodyweight Template",
                description: "≥75 reps per exercise",
                targetReps: 75
            }
        };

        // Schedule templates
        this.scheduleTemplates = {
            four_day: {
                name: "4 Days/Week (Standard)",
                description: "One main lift per day",
                pattern: ['press', 'deadlift', 'bench', 'squat'],
                deload: true
            },
            three_day: {
                name: "3 Days/Week (Rolling)",
                description: "6-week rolling cycle",
                pattern: "rolling",
                deload: "week_5"
            },
            two_day: {
                name: "2 Days/Week",
                description: "Paired lifts",
                pattern: [['squat', 'bench'], ['deadlift', 'press']],
                deload: false
            }
        };
    }

    // Calculate Estimated 1RM using Epley formula
    calculateEst1RM(weight, reps) {
        if (reps === 1) return weight;
        return Math.round(weight * (1 + reps / 30));
    }

    // Calculate Training Max (90% of 1RM)
    calculateTrainingMax(oneRepMax, roundTo = 5) {
        const trainingMax = oneRepMax * 0.9;
        return Math.round(trainingMax / roundTo) * roundTo;
    }

    // Calculate all training maxes
    calculateAllTrainingMaxes(maxes, roundTo = 5) {
        const trainingMaxes = {};
        for (const [lift, max] of Object.entries(maxes)) {
            if (max) {
                trainingMaxes[lift] = this.calculateTrainingMax(max, roundTo);
            }
        }
        return trainingMaxes;
    }

    // Generate main work for a specific week and lift
    generateMainWork(lift, trainingMax, week, percentageOption = 'option1', roundTo = 5) {
        const scheme = this.percentageSchemes[percentageOption][`week${week}`];
        const mainWork = [];

        for (let i = 0; i < scheme.sets.length; i++) {
            const percentage = scheme.percentages[i];
            const weight = Math.round((trainingMax * (percentage / 100)) / roundTo) * roundTo;
            const isLastSet = i === scheme.sets.length - 1;

            mainWork.push({
                sets: 1,
                reps: scheme.sets[i],
                weight: weight,
                percentage: percentage,
                amrap: scheme.amrap && isLastSet,
                notes: scheme.amrap && isLastSet ? `${scheme.sets[i]}+ reps (AMRAP)` : `${scheme.sets[i]} reps`
            });
        }

        return mainWork;
    }

    // Generate assistance work for a lift
    generateAssistanceWork(lift, trainingMax, template, level = 'intermediate') {
        const assistanceTemplate = this.assistanceTemplates[template];

        if (!assistanceTemplate || template === 'jackshit') {
            return [];
        }

        if (template === 'bbb') {
            const percentage = assistanceTemplate.loads[level];
            const weight = Math.round(trainingMax * (percentage / 100) / 5) * 5;
            return [{
                exercise: lift,
                sets: 5,
                reps: 10,
                load: weight,
                notes: `${percentage}% of Training Max`
            }];
        }

        return [];
    }

    // Generate a complete 4-week cycle
    generateCycle(trainingMaxes, config = {}) {
        const {
            schedule = 'four_day',
            percentageOption = 'option1',
            assistanceTemplate = 'bbb',
            assistanceLevel = 'intermediate',
            roundTo = 5,
            includeWarmup = true
        } = config;

        const scheduleTemplate = this.scheduleTemplates[schedule];
        const weeks = [];

        for (let week = 1; week <= 4; week++) {
            const weekData = {
                week: week,
                name: week === 4 ? 'Deload Week' : `Week ${week}`,
                description: week === 4 ? 'Recovery and form focus' : this.getWeekDescription(week, percentageOption),
                days: []
            };

            if (schedule === 'four_day') {
                scheduleTemplate.pattern.forEach((lift, dayIndex) => {
                    if (trainingMaxes[lift]) {
                        const mainWork = this.generateMainWork(lift, trainingMaxes[lift], week, percentageOption, roundTo);
                        const assistanceWork = this.generateAssistanceWork(lift, trainingMaxes[lift], assistanceTemplate, assistanceLevel);

                        weekData.days.push({
                            day: dayIndex + 1,
                            focus: lift,
                            mainWork: mainWork,
                            assistanceWork: assistanceWork
                        });
                    }
                });
            }

            weeks.push(weekData);
        }

        return {
            program: '5/3/1',
            schedule: scheduleTemplate.name,
            percentageOption: percentageOption,
            assistanceTemplate: this.assistanceTemplates[assistanceTemplate].name,
            weeks: weeks,
            progressionNotes: this.getProgressionNotes()
        };
    }

    // Get week description based on percentage scheme
    getWeekDescription(week, percentageOption) {
        const scheme = this.percentageSchemes[percentageOption][`week${week}`];
        const percentages = scheme.percentages.join('%, ') + '%';
        const sets = scheme.sets.join(', ');
        return `${sets} reps at ${percentages} + AMRAP final set`;
    }

    // Get progression notes
    getProgressionNotes() {
        return [
            "Add 5 lbs to upper body TM after successful cycle",
            "Add 10 lbs to lower body TM after successful cycle",
            "Successful cycle = getting required reps on all AMRAP sets",
            "If you miss reps, repeat cycle with same weights",
            "Deload week is mandatory - do not skip",
            "Track all AMRAP sets for progression decisions"
        ];
    }

    // Validate maxes
    validateMaxes(maxes) {
        const errors = [];
        const requiredLifts = ['squat', 'bench', 'deadlift', 'press'];

        requiredLifts.forEach(lift => {
            if (!maxes[lift] || maxes[lift] <= 0) {
                errors.push(`${lift.replace('_', ' ')} max is required`);
            }
        });

        return errors;
    }
}

export default FiveThreeOneEngine;
export { FiveThreeOneEngine };
