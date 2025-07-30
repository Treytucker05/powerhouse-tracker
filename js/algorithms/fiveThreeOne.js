/**
 * 5/3/1 Training System Implementation - STANDALONE
 * Pure Jim Wendler's 5/3/1 methodology without RP integration
 * Based on Wendler's 5/3/1 Manual extracts provided by user
 * 
 * This system operates independently from RP volume algorithms
 * to prevent interference between methodologies
 */

/**
 * 5/3/1 Training Max Calculator
 * Calculates and manages Training Max (90% of 1RM) for main lifts
 */
export class FiveThreeOneSystem {
    constructor() {
        this.trainingMaxes = {
            squat: 0,
            bench: 0,
            deadlift: 0,
            press: 0
        };

        this.currentWave = 1; // Waves 1-4, then reset
        this.currentWeek = 1; // Weeks 1-3 in each wave
        this.deloadWeek = false;

        // Wave percentages for main work sets
        this.wavePercentages = {
            1: { week1: [65, 75, 85], week2: [70, 80, 90], week3: [75, 85, 95] },
            2: { week1: [65, 75, 85], week2: [70, 80, 90], week3: [75, 85, 95] },
            3: { week1: [65, 75, 85], week2: [70, 80, 90], week3: [75, 85, 95] },
            4: { week1: [65, 75, 85], week2: [70, 80, 90], week3: [75, 85, 95] }
        };

        // Deload percentages (every 4th week)
        this.deloadPercentages = [40, 50, 60];

        // AMRAP set indicators (last set of main work)
        this.amrapTargets = {
            week1: 5, // 5+ reps
            week2: 3, // 3+ reps  
            week3: 1  // 1+ reps
        };
    }

    /**
     * Calculate Training Max from 1RM
     * @param {number} oneRM - Current 1RM
     * @returns {number} - Training Max (90% of 1RM)
     */
    calculateTrainingMax(oneRM) {
        return Math.round(oneRM * 0.9);
    }

    /**
     * Set Training Maxes for all main lifts
     * @param {Object} oneRMs - Object with current 1RMs {squat, bench, deadlift, press}
     */
    setTrainingMaxes(oneRMs) {
        Object.keys(oneRMs).forEach(lift => {
            if (oneRMs[lift] && oneRMs[lift] > 0) {
                this.trainingMaxes[lift] = this.calculateTrainingMax(oneRMs[lift]);
            }
        });

        this.logTrainingMaxUpdate();
    }

    /**
     * Get current wave percentages for main work
     * @param {number} wave - Current wave (1-4)
     * @param {number} week - Current week (1-3)
     * @param {boolean} isDeload - Whether this is a deload week
     * @returns {Array} - Array of percentages for main sets
     */
    getMainWorkPercentages(wave = this.currentWave, week = this.currentWeek, isDeload = false) {
        if (isDeload) {
            return this.deloadPercentages;
        }

        const weekKey = `week${week}`;
        return this.wavePercentages[wave][weekKey] || [65, 75, 85];
    }

    /**
     * Calculate working weights for main sets
     * @param {string} lift - Main lift (squat, bench, deadlift, press)
     * @param {number} wave - Current wave
     * @param {number} week - Current week
     * @param {boolean} isDeload - Whether this is a deload week
     * @returns {Object} - Working weights and set structure
     */
    calculateMainWork(lift, wave = this.currentWave, week = this.currentWeek, isDeload = false) {
        const trainingMax = this.trainingMaxes[lift];
        if (!trainingMax || trainingMax <= 0) {
            throw new Error(`Training Max not set for ${lift}`);
        }

        const percentages = this.getMainWorkPercentages(wave, week, isDeload);
        const weights = percentages.map(pct => Math.round(trainingMax * (pct / 100)));

        let setStructure;
        if (isDeload) {
            // Deload: 3x5 at lighter weights
            setStructure = [
                { weight: weights[0], reps: 5, sets: 1, description: `Warmup at ${percentages[0]}%` },
                { weight: weights[1], reps: 5, sets: 1, description: `Work at ${percentages[1]}%` },
                { weight: weights[2], reps: 5, sets: 1, description: `Top set at ${percentages[2]}%` }
            ];
        } else {
            // Regular work: 5/3/1 rep scheme with AMRAP on last set
            const repSchemes = week === 1 ? [5, 5, 5] : week === 2 ? [3, 3, 3] : [5, 3, 1];
            const amrapTarget = this.amrapTargets[`week${week}`];

            setStructure = [
                { weight: weights[0], reps: repSchemes[0], sets: 1, description: `${repSchemes[0]} reps at ${percentages[0]}%` },
                { weight: weights[1], reps: repSchemes[1], sets: 1, description: `${repSchemes[1]} reps at ${percentages[1]}%` },
                { weight: weights[2], reps: `${amrapTarget}+`, sets: 1, description: `${amrapTarget}+ AMRAP at ${percentages[2]}%`, isAMRAP: true }
            ];
        }

        return {
            lift,
            trainingMax,
            wave,
            week,
            isDeload,
            percentages,
            weights,
            setStructure,
            totalSets: setStructure.length
        };
    }

    /**
     * Linear progression for Training Max increases
     * @param {string} lift - Main lift to progress
     * @param {number} amrapReps - Reps achieved on AMRAP set
     * @returns {Object} - Progression recommendation
     */
    progressTrainingMax(lift, amrapReps) {
        const currentTM = this.trainingMaxes[lift];
        if (!currentTM) {
            return { error: "Training Max not set for " + lift };
        }

        // Upper body progression: +5 lbs
        // Lower body progression: +10 lbs
        const isUpperBody = ['bench', 'press'].includes(lift.toLowerCase());
        const progression = isUpperBody ? 5 : 10;

        // Minimum rep thresholds for progression
        const minRepsForProgression = this.getMinRepsForProgression();

        let recommendation = {
            lift,
            currentTM,
            amrapReps,
            shouldProgress: false,
            newTM: currentTM,
            progressionAmount: 0,
            reasoning: ""
        };

        if (amrapReps >= minRepsForProgression) {
            recommendation.shouldProgress = true;
            recommendation.newTM = currentTM + progression;
            recommendation.progressionAmount = progression;
            recommendation.reasoning = `Strong AMRAP performance (${amrapReps} reps) - increase TM by ${progression}lbs`;

            // Update the training max
            this.trainingMaxes[lift] = recommendation.newTM;
        } else {
            recommendation.reasoning = `Insufficient AMRAP reps (${amrapReps} < ${minRepsForProgression}) - maintain current TM`;
        }

        return recommendation;
    }

    /**
     * Get minimum reps required for Training Max progression
     * Based on current week's AMRAP target
     * @returns {number} - Minimum reps for progression
     */
    getMinRepsForProgression() {
        // Conservative progression thresholds
        switch (this.currentWeek) {
            case 1: return 8;  // 5+ week, need 8+ for progression
            case 2: return 5;  // 3+ week, need 5+ for progression  
            case 3: return 3;  // 1+ week, need 3+ for progression
            default: return 5;
        }
    }

    /**
     * Calculate assistance work volume using pure 5/3/1 principles
     * Uses Wendler's 50-100 rep guidelines, NOT RP volume landmarks
     * @param {Array} categories - Assistance categories [push, pull, single-leg/abs]
     * @param {string} template - Assistance template (BBB, FSL, etc.)
     * @returns {Object} - Assistance work recommendation
     */
    calculateAssistanceWork(categories = ['push', 'pull', 'single-leg'], template = "standard") {
        const assistanceRecommendations = {};

        // Pure 5/3/1 assistance guidelines (50-100 reps per category)
        const repGuidelines = this.get531AssistanceVolume(template);

        categories.forEach(category => {
            assistanceRecommendations[category] = {
                targetReps: repGuidelines[category] || repGuidelines.default,
                repRange: this.getAssistanceRepRange(template),
                intensity: this.getAssistanceIntensity(template),
                exercises: this.getAssistanceExercises(category),
                reasoning: `5/3/1 ${template} template - ${repGuidelines[category] || repGuidelines.default} reps`
            };
        });

        return {
            methodology: "Pure 5/3/1 Assistance",
            template,
            categories: assistanceRecommendations,
            totalTargetReps: Object.values(assistanceRecommendations).reduce((sum, rec) => sum + rec.targetReps, 0),
            guidelines: "Wendler's 50-100 reps per category principle"
        };
    }

    /**
     * Get 5/3/1 specific assistance volume guidelines
     * @param {string} template - Assistance template
     * @returns {Object} - Rep recommendations per category
     */
    get531AssistanceVolume(template) {
        const templates = {
            "standard": {
                push: 75,
                pull: 75,
                "single-leg": 50,
                default: 75
            },
            "BBB": { // Boring But Big
                push: 100,
                pull: 100,
                "single-leg": 75,
                default: 100
            },
            "FSL": { // First Set Last
                push: 50,
                pull: 75,
                "single-leg": 50,
                default: 60
            },
            "joker": {
                push: 50,
                pull: 50,
                "single-leg": 25,
                default: 50
            }
        };

        return templates[template] || templates.standard;
    }

    /**
     * Get assistance exercise rep ranges for 5/3/1 templates
     * @param {string} template - Template name
     * @returns {string} - Rep range recommendation
     */
    getAssistanceRepRange(template) {
        const ranges = {
            "standard": "10-15",
            "BBB": "10",
            "FSL": "8-12",
            "joker": "5-10"
        };
        return ranges[template] || "10-15";
    }

    /**
     * Get assistance exercise intensity for 5/3/1 templates
     * @param {string} template - Template name
     * @returns {string} - Intensity description
     */
    getAssistanceIntensity(template) {
        const intensities = {
            "standard": "Moderate - 2-3 RIR",
            "BBB": "Light-Moderate - 3-4 RIR",
            "FSL": "Moderate-Hard - 1-2 RIR",
            "joker": "Hard - 0-1 RIR"
        };
        return intensities[template] || "Moderate - 2-3 RIR";
    }

    /**
     * Track 5/3/1 progression using Wendler's specific criteria
     * NO RP stimulus scoring - uses 5/3/1 performance indicators
     * @param {Object} sessionData - Training session performance
     * @returns {Object} - 5/3/1 specific progression assessment
     */
    trackProgression(sessionData) {
        const { exercise, week, reps, weight, rpe } = sessionData;
        const trainingMax = this.getTrainingMax(exercise);
        const expectedPercentage = this.getWeekPercentage(week);
        const expectedWeight = Math.round(trainingMax * expectedPercentage);

        // 5/3/1 specific performance markers
        const performance = this.assess531Performance(week, reps, weight, expectedWeight, rpe);
        const progressionRecommendation = this.get531ProgressionRecommendation(performance, exercise);

        return {
            methodology: "5/3/1 Progression Tracking",
            exercise,
            week,
            performance: {
                actualReps: reps,
                actualWeight: weight,
                expectedWeight,
                repTarget: this.getRepTarget(week),
                overTarget: reps > this.getRepTarget(week),
                qualityScore: performance.qualityScore,
                indicators: performance.indicators
            },
            progression: progressionRecommendation,
            nextCycle: this.calculateNextCycleMax(exercise, performance),
            reasoning: performance.reasoning
        };
    }

    /**
     * Assess 5/3/1 performance using Wendler's criteria
     * @param {number} week - Week number (1, 2, or 3)
     * @param {number} actualReps - Reps performed
     * @param {number} actualWeight - Weight used
     * @param {number} expectedWeight - Expected weight for week
     * @param {number} rpe - Rate of Perceived Exertion
     * @returns {Object} - Performance assessment
     */
    assess531Performance(week, actualReps, actualWeight, expectedWeight, rpe) {
        const repTarget = this.getRepTarget(week);
        const repsDifference = actualReps - repTarget;

        let qualityScore = 0;
        let indicators = [];
        let reasoning = "";

        // 5/3/1 specific performance indicators
        if (actualReps >= repTarget + 3) {
            qualityScore = 3; // Excellent
            indicators.push("Strong progression");
            reasoning = "Exceeded rep target by 3+, excellent progress";
        } else if (actualReps >= repTarget + 1) {
            qualityScore = 2; // Good
            indicators.push("Good progression");
            reasoning = "Beat rep target, solid progress";
        } else if (actualReps === repTarget) {
            qualityScore = 1; // Adequate
            indicators.push("Met minimum");
            reasoning = "Met minimum reps, acceptable";
        } else {
            qualityScore = 0; // Poor
            indicators.push("Failed minimum");
            reasoning = "Failed to meet minimum reps, review training max";
        }

        // RPE considerations for 5/3/1
        if (rpe && rpe > 9) {
            indicators.push("High effort");
            if (qualityScore > 0) qualityScore -= 0.5;
        } else if (rpe && rpe < 7) {
            indicators.push("Conservative effort");
        }

        return {
            qualityScore,
            indicators,
            reasoning,
            repsDifference
        };
    }

    /**
     * Get 5/3/1 progression recommendation
     * @param {Object} performance - Performance assessment
     * @param {string} exercise - Exercise name
     * @returns {Object} - Progression recommendation
     */
    get531ProgressionRecommendation(performance, exercise) {
        const { qualityScore } = performance;
        const isUpperBody = this.isUpperBodyExercise(exercise);
        const standardProgression = isUpperBody ? 5 : 10; // lbs

        if (qualityScore >= 2.5) {
            return {
                action: "Progress normally",
                weightIncrease: standardProgression,
                reasoning: "Strong performance, standard progression"
            };
        } else if (qualityScore >= 1) {
            return {
                action: "Progress normally",
                weightIncrease: standardProgression,
                reasoning: "Adequate performance, continue progression"
            };
        } else {
            return {
                action: "Reset training max",
                weightIncrease: 0,
                resetPercentage: 90,
                reasoning: "Failed minimum reps, reset to 90% of current TM"
            };
        }
    }

    /**
     * Calculate next cycle training max
     * @param {string} exercise - Exercise name
     * @param {Object} performance - Performance data
     * @returns {number} - New training max
     */
    calculateNextCycleMax(exercise, performance) {
        const currentTM = this.getTrainingMax(exercise);
        const progression = this.get531ProgressionRecommendation(performance, exercise);

        if (progression.action === "Reset training max") {
            return Math.round(currentTM * (progression.resetPercentage / 100));
        } else {
            return currentTM + progression.weightIncrease;
        }
    }

    /**
     * Get rep target for 5/3/1 week
     * @param {number} week - Week number
     * @returns {number} - Minimum rep target
     */
    getRepTarget(week) {
        const targets = {
            1: 5, // 5s week
            2: 3, // 3s week  
            3: 1  // 1s week
        };
        return targets[week] || 5;
    }

    /**
     * Check if exercise is upper body for progression purposes
     * @param {string} exercise - Exercise name
     * @returns {boolean} - True if upper body
     */
    isUpperBodyExercise(exercise) {
        const upperBodyExercises = [
            'bench press', 'overhead press', 'press', 'bench',
            'incline', 'dumbbell press', 'dips'
        ];

        const exerciseLower = exercise.toLowerCase();
        return upperBodyExercises.some(pattern => exerciseLower.includes(pattern));
    }

    /**
     * Get stored training max for exercise
     * @param {string} exercise - Exercise name
     * @returns {number} - Current training max
     */
    getTrainingMax(exercise) {
        // This would integrate with your data storage system
        // For now, return a placeholder that can be replaced with actual storage
        return this.trainingMaxes[exercise] || 225; // Default placeholder
    }

    /**
     * Set training max for exercise
     * @param {string} exercise - Exercise name
     * @param {number} trainingMax - New training max
     */
    setTrainingMax(exercise, trainingMax) {
        this.trainingMaxes[exercise] = trainingMax;
        // This would save to your data storage system
    }

    /**
     * Generate complete 5/3/1 training cycle
     * @param {Object} exercises - Main exercises with training maxes
     * @param {string} template - Assistance template
     * @returns {Object} - Complete 4-week cycle
     */
    generateTrainingCycle(exercises, template = "standard") {
        const cycle = {
            methodology: "Jim Wendler's 5/3/1",
            template,
            weeks: {},
            exercises: Object.keys(exercises),
            deloadWeek: 4
        };

        // Generate 3 weeks + deload
        for (let week = 1; week <= 4; week++) {
            cycle.weeks[week] = {};

            Object.entries(exercises).forEach(([exercise, trainingMax]) => {
                if (week === 4) {
                    // Deload week
                    cycle.weeks[week][exercise] = this.generateDeloadWorkout(exercise, trainingMax);
                } else {
                    // Regular 5/3/1 week
                    cycle.weeks[week][exercise] = this.generateMainWorkout(exercise, trainingMax, week);
                }
            });

            // Add assistance work
            cycle.weeks[week].assistance = this.calculateAssistanceWork(['push', 'pull', 'single-leg'], template);
        }

        return cycle;
    }

    /**
     * Generate deload workout for week 4
     * @param {string} exercise - Exercise name
     * @param {number} trainingMax - Training max
     * @returns {Object} - Deload workout
     */
    generateDeloadWorkout(exercise, trainingMax) {
        return {
            sets: [
                {
                    percentage: 40,
                    weight: Math.round(trainingMax * 0.40),
                    reps: 5,
                    type: "warmup"
                },
                {
                    percentage: 50,
                    weight: Math.round(trainingMax * 0.50),
                    reps: 5,
                    type: "warmup"
                },
                {
                    percentage: 60,
                    weight: Math.round(trainingMax * 0.60),
                    reps: 5,
                    type: "work"
                }
            ],
            notes: "Deload week - focus on form and recovery",
            totalVolume: "Light recovery work"
        };
    }

    /**
     * Export 5/3/1 system for use in main application
     * @returns {Object} - Complete 5/3/1 system interface
     */
    getSystemInterface() {
        return {
            name: "5/3/1 Method",
            methodology: "Jim Wendler's 5/3/1",
            calculateWorkout: this.calculateWorkout.bind(this),
            calculateTrainingMax: this.calculateTrainingMax.bind(this),
            generateTrainingCycle: this.generateTrainingCycle.bind(this),
            trackProgression: this.trackProgression.bind(this),
            calculateAssistanceWork: this.calculateAssistanceWork.bind(this),
            isStandalone: true,
            compatibleWith: [], // Not compatible with RP systems
            description: "Pure 5/3/1 implementation based on Jim Wendler's methodology"
        };
    }
    /**
     * Get assistance exercises for each category
     * @param {string} category - Exercise category
     * @returns {Array} - Recommended exercises
     */
    getAssistanceExercises(category) {
        const exercises = {
            push: ['Push-ups', 'Dips', 'Tricep Extensions', 'Close-Grip Bench', 'Dumbbell Press'],
            pull: ['Pull-ups', 'Rows', 'Lat Pulldowns', 'Face Pulls', 'Curls'],
            'single-leg': ['Lunges', 'Step-ups', 'Bulgarian Split Squats', 'Single-Leg RDL'],
            abs: ['Planks', 'Hanging Knee Raises', 'Russian Twists', 'Mountain Climbers']
        };
        return exercises[category] || exercises.push;
    }

    /**
     * Generate main workout for regular 5/3/1 week
     * @param {string} exercise - Exercise name
     * @param {number} trainingMax - Training max
     * @param {number} week - Week number (1-3)
     * @returns {Object} - Main workout
     */
    generateMainWorkout(exercise, trainingMax, week) {
        const percentages = this.getMainWorkPercentages(1, week, false);
        const repSchemes = week === 1 ? [5, 5, 5] : week === 2 ? [3, 3, 3] : [5, 3, 1];
        const amrapTarget = this.amrapTargets[`week${week}`];

        return {
            sets: [
                {
                    percentage: percentages[0],
                    weight: Math.round(trainingMax * (percentages[0] / 100)),
                    reps: repSchemes[0],
                    type: "work"
                },
                {
                    percentage: percentages[1],
                    weight: Math.round(trainingMax * (percentages[1] / 100)),
                    reps: repSchemes[1],
                    type: "work"
                },
                {
                    percentage: percentages[2],
                    weight: Math.round(trainingMax * (percentages[2] / 100)),
                    reps: `${amrapTarget}+`,
                    type: "amrap",
                    target: amrapTarget
                }
            ],
            notes: `Week ${week} - ${week === 1 ? '5s' : week === 2 ? '3s' : '1s'} week`,
            totalVolume: "Main work + AMRAP"
        };
    }

    /**
     * Get week percentage for tracking
     * @param {number} week - Week number
     * @returns {number} - Top set percentage
     */
    getWeekPercentage(week) {
        const topSetPercentages = {
            1: 0.85, // 85% for 5s week
            2: 0.90, // 90% for 3s week
            3: 0.95  // 95% for 1s week
        };
        return topSetPercentages[week] || 0.85;
    }

    /**
     * Log training max updates
     */
    logTrainingMaxUpdate() {
        console.log('5/3/1 Training Maxes Updated:', this.trainingMaxes);
    }

    /**
     * Calculate workout for a specific lift and week
     * @param {string} lift - Main lift
     * @param {number} week - Week number
     * @param {boolean} isDeload - Whether this is deload week
     * @returns {Object} - Complete workout
     */
    calculateWorkout(lift, week = this.currentWeek, isDeload = false) {
        const mainWork = this.calculateMainWork(lift, this.currentWave, week, isDeload);
        const assistance = this.calculateAssistanceWork(['push', 'pull', 'single-leg'], 'standard');

        return {
            methodology: "5/3/1",
            lift,
            week,
            isDeload,
            mainWork,
            assistance,
            notes: isDeload ? "Deload week - focus on recovery" : `Week ${week} - focus on quality reps`
        };
    }
}

// Export the 5/3/1 system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FiveThreeOneSystem;
} else if (typeof window !== 'undefined') {
    window.FiveThreeOneSystem = FiveThreeOneSystem;
}
