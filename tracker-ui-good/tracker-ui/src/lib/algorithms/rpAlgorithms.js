// Renaissance Periodization Algorithms
// Functions for calculating MEV, MRV, and other RP metrics using precise formulas

import { BASE_VOLUME_LANDMARKS, EXPERIENCE_MULTIPLIERS, DIET_PHASE_MULTIPLIERS } from '../../constants/rpConstants';

/**
 * Calculate Personalized Volume using the precise RP formula
 * @param {string} muscle - The muscle group
 * @param {string} experience - beginner, intermediate, or advanced
 * @param {string} dietPhase - bulk, maintenance, or cut
 * @param {boolean} isSpecialized - Whether this muscle is specialized (+30%)
 * @returns {object} - { mev, mrv, mav, mv }
 */
export const calculatePersonalizedVolume = (muscle, experience, dietPhase = 'maintenance', isSpecialized = false) => {
    const landmarks = BASE_VOLUME_LANDMARKS[muscle];
    if (!landmarks) {
        console.warn(`No landmarks found for muscle: ${muscle}`);
        return { mev: 8, mrv: 20, mav: 14, mv: 6 }; // Default fallback
    }

    const baseMEV = landmarks.mev;
    const baseMRV = landmarks.mrv;
    const baseMAV = landmarks.mav;
    const baseMV = landmarks.mv;

    const expMultiplier = EXPERIENCE_MULTIPLIERS[experience]?.mev || 1.0;
    const dietMultiplier = DIET_PHASE_MULTIPLIERS[dietPhase]?.volumeMultiplier || 1.0;
    const specMultiplier = isSpecialized ? 1.3 : 1.0;  // +30% for specialization

    const personalMEV = Math.round(baseMEV * expMultiplier * dietMultiplier * specMultiplier);
    const personalMRV = Math.round(baseMRV * expMultiplier * dietMultiplier * specMultiplier);
    const personalMAV = Math.round(baseMAV * expMultiplier * dietMultiplier * specMultiplier);
    const personalMV = Math.round(baseMV * expMultiplier * dietMultiplier * specMultiplier);

    return {
        mev: personalMEV,
        mrv: personalMRV,
        mav: personalMAV,
        mv: personalMV,
        frequency: landmarks.frequency,
        maintenance: landmarks.maintenance
    };
};

/**
 * Calculate Minimum Effective Volume (MEV) for a muscle group
 * @param {string} muscle - The muscle group
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {number} - MEV in sets per week
 */
export const calculateMEV = (muscle, trainingExperience = 'intermediate') => {
    const result = calculatePersonalizedVolume(muscle, trainingExperience);
    return result.mev;
};

/**
 * Calculate Maximum Recoverable Volume (MRV) for a muscle group
 * @param {string} muscle - The muscle group
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {number} - MRV in sets per week
 */
export const calculateMRV = (muscle, trainingExperience = 'intermediate') => {
    const result = calculatePersonalizedVolume(muscle, trainingExperience);
    return result.mrv;
};

/**
 * Calculate Maximum Adaptive Volume (MAV) for a muscle group
 * @param {string} muscle - The muscle group
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {number} - MAV in sets per week
 */
export const calculateMAV = (muscle, trainingExperience = 'intermediate') => {
    const landmarks = BASE_VOLUME_LANDMARKS[muscle];
    if (!landmarks) {
        console.warn(`No landmarks found for muscle: ${muscle}`);
        return 16; // Default fallback
    }

    const multipliers = {
        beginner: 0.8,
        intermediate: 1.0,
        advanced: 1.1
    };

    const multiplier = multipliers[trainingExperience] || 1.0;
    return Math.round(landmarks.mav * multiplier);
};

/**
 * Calculate volume progression for a muscle group over a mesocycle
 * @param {string} muscle - The muscle group
 * @param {number} weeks - Number of weeks in the mesocycle
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {Object} - { landmarks: {mev, mrv, mav}, progression: [week1, week2, ...] }
 */
export const calculateVolumeProgression = (muscle, weeks, trainingExperience = 'intermediate') => {
    const mev = calculateMEV(muscle, trainingExperience);
    const mrv = calculateMRV(muscle, trainingExperience);
    const mav = calculateMAV(muscle, trainingExperience);

    const landmarks = { mev, mrv, mav };

    // Linear progression from MEV to MRV
    const progression = [];
    for (let week = 1; week <= weeks; week++) {
        const sets = mev + (mrv - mev) * (week - 1) / (weeks - 1);
        progression.push(Math.round(sets));
    }

    return { landmarks, progression };
};

/**
 * Get all volume recommendations for a given training experience
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {Object} - Object with muscle groups and their MEV/MRV/MAV values
 */
export const getAllVolumeRecommendations = (trainingExperience = 'intermediate') => {
    const muscleGroups = Object.keys(BASE_VOLUME_LANDMARKS);
    const recommendations = {};

    muscleGroups.forEach(muscle => {
        recommendations[muscle] = {
            mev: calculateMEV(muscle, trainingExperience),
            mrv: calculateMRV(muscle, trainingExperience),
            mav: calculateMAV(muscle, trainingExperience)
        };
    });

    return recommendations;
};

/**
 * Calculate Weekly Volume Progression within a mesocycle
 * @param {number} mev - Minimum Effective Volume
 * @param {number} mrv - Maximum Recoverable Volume
 * @param {number} currentWeek - Current week number (1-indexed)
 * @param {number} totalWeeks - Total weeks in mesocycle
 * @returns {number} - Target volume for the week
 */
export const calculateWeeklyVolume = (mev, mrv, currentWeek, totalWeeks) => {
    const volumeIncrease = (mrv - mev) / (totalWeeks - 1);
    const weeklyVolume = mev + (volumeIncrease * (currentWeek - 1));
    return Math.round(weeklyVolume);
};

/**
 * Calculate RIR Progression Pattern
 * @param {number} weekNumber - Current week number (1-indexed)
 * @param {number} totalWeeks - Total weeks in mesocycle
 * @param {string} experienceLevel - beginner, intermediate, or advanced
 * @returns {number} - Target RIR for the week
 */
export const calculateWeeklyRIR = (weekNumber, totalWeeks, experienceLevel) => {
    const startingRIR = EXPERIENCE_MULTIPLIERS[experienceLevel]?.rirStart || 3;
    const rirDecrease = startingRIR / (totalWeeks - 1);
    const weeklyRIR = Math.max(0, startingRIR - (rirDecrease * (weekNumber - 1)));
    return Math.round(weeklyRIR);
};

/**
 * MEV Stimulus Assessment based on subjective feedback
 * @param {object} feedback - { pump: 0-3, mindMuscle: 0-3, disruption: 0-3 }
 * @returns {object} - Assessment with status, action, and adjustment
 */
export const assessMEVStimulus = (feedback) => {
    const { pump, mindMuscle, disruption } = feedback;
    const totalScore = pump + mindMuscle + disruption; // Each 0-3, total 0-9

    if (totalScore <= 3) {
        return {
            status: 'BELOW_MEV',
            action: 'ADD_SETS',
            adjustment: 3,
            message: 'Insufficient stimulus - add 3 sets next week'
        };
    } else if (totalScore <= 6) {
        return {
            status: 'AT_MEV',
            action: 'ADD_SETS',
            adjustment: 1,
            message: 'Good stimulus - add 1 set next week'
        };
    } else {
        return {
            status: 'ABOVE_MEV',
            action: 'MAINTAIN',
            adjustment: 0,
            message: 'Excellent stimulus - maintain current volume'
        };
    }
};

/**
 * Performance-Based Volume Adjustment
 * @param {number} soreness - Soreness level (0-3: none to extreme)
 * @param {number} performance - Performance level (0-3: exceeded to failed)
 * @returns {object} - Adjustment recommendation
 */
export const calculateVolumeAdjustment = (soreness, performance) => {
    const adjustmentMatrix = {
        '0,0': { sets: +3, action: 'Significantly under-stimulated' },
        '0,1': { sets: +2, action: 'Room for more volume' },
        '1,1': { sets: +1, action: 'Optimal progression' },
        '1,2': { sets: +1, action: 'Slight increase ok' },
        '2,2': { sets: 0, action: 'Maintain current volume' },
        '2,3': { sets: -1, action: 'Slight reduction needed' },
        '3,3': { sets: -2, action: 'Deload required' }
    };

    return adjustmentMatrix[`${soreness},${performance}`] || { sets: 0, action: 'Maintain' };
};

/**
 * Calculate volume distribution across training days
 * @param {number} weeklyVolume - Total weekly volume
 * @param {number} trainingDays - Number of training days per week
 * @param {string} frequency - Optimal frequency from landmarks
 * @returns {array} - Volume distribution per day
 */
export const calculateVolumeDistribution = (weeklyVolume, trainingDays, frequency) => {
    // Parse frequency string to get optimal sessions per week
    const frequencyMatch = frequency.match(/(\d+(?:\.\d+)?)-?(\d+)?/);
    const minFreq = parseFloat(frequencyMatch[1]);
    const maxFreq = frequencyMatch[2] ? parseFloat(frequencyMatch[2]) : minFreq;

    const optimalSessions = Math.min(trainingDays, Math.round((minFreq + maxFreq) / 2));
    const volumePerSession = Math.round(weeklyVolume / optimalSessions);

    const distribution = new Array(trainingDays).fill(0);

    // Distribute volume across optimal number of sessions
    for (let i = 0; i < optimalSessions; i++) {
        distribution[i] = volumePerSession;
    }

    // Adjust for rounding
    const totalDistributed = distribution.reduce((sum, vol) => sum + vol, 0);
    const difference = weeklyVolume - totalDistributed;
    if (difference > 0) {
        distribution[0] += difference;
    }

    return distribution;
};
