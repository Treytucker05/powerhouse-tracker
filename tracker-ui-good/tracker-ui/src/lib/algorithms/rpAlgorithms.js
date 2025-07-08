// Renaissance Periodization Algorithms
// Functions for calculating MEV, MRV, and other RP metrics

import { BASE_VOLUME_LANDMARKS } from '../../constants/rpConstants';

/**
 * Calculate Minimum Effective Volume (MEV) for a muscle group
 * @param {string} muscle - The muscle group
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {number} - MEV in sets per week
 */
export const calculateMEV = (muscle, trainingExperience = 'intermediate') => {
    const landmarks = BASE_VOLUME_LANDMARKS[muscle];
    if (!landmarks) {
        console.warn(`No landmarks found for muscle: ${muscle}`);
        return 8; // Default fallback
    }

    const multipliers = {
        beginner: 0.7,
        intermediate: 1.0,
        advanced: 1.3
    };

    const multiplier = multipliers[trainingExperience] || 1.0;
    return Math.round(landmarks.mev * multiplier);
};

/**
 * Calculate Maximum Recoverable Volume (MRV) for a muscle group
 * @param {string} muscle - The muscle group
 * @param {string} trainingExperience - beginner, intermediate, or advanced
 * @returns {number} - MRV in sets per week
 */
export const calculateMRV = (muscle, trainingExperience = 'intermediate') => {
    const landmarks = BASE_VOLUME_LANDMARKS[muscle];
    if (!landmarks) {
        console.warn(`No landmarks found for muscle: ${muscle}`);
        return 20; // Default fallback
    }

    const multipliers = {
        beginner: 0.8,
        intermediate: 1.0,
        advanced: 1.1
    };

    const multiplier = multipliers[trainingExperience] || 1.0;
    return Math.round(landmarks.mrv * multiplier);
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
