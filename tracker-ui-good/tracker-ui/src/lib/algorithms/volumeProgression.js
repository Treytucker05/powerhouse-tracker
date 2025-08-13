// Volume Progression Calculator for RP Macrocycle Implementation
// Handles MEV -> MRV progression, specialization redistribution, and phase transitions

import { BASE_VOLUME_LANDMARKS, EXPERIENCE_MULTIPLIERS, DIET_PHASE_MULTIPLIERS } from '../../constants/rpConstants';
import { calculatePersonalizedVolume } from './rpAlgorithms';

/**
 * Calculate complete volume progression for a macrocycle
 * @param {Object} programDetails - Program configuration
 * @param {Array} blocks - Array of training blocks
 * @param {Array} specializationMuscles - Array of specialized muscle groups
 * @returns {Object} Complete volume progression data
 */
export const calculateMacrocycleVolumeProgression = (programDetails, blocks, specializationMuscles = []) => {
    const muscleGroups = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'traps'];

    // Calculate base volumes for all muscle groups
    const baseVolumes = {};
    muscleGroups.forEach(muscle => {
        const isSpecialized = specializationMuscles.includes(muscle);
        baseVolumes[muscle] = calculatePersonalizedVolume(
            muscle,
            programDetails.trainingExperience,
            programDetails.dietPhase,
            isSpecialized
        );
    });

    // Apply specialization redistribution
    const redistributedVolumes = applySpecializationRedistribution(baseVolumes, specializationMuscles);

    // Calculate week-by-week progression
    const weeklyProgression = calculateWeeklyProgression(redistributedVolumes, blocks, programDetails);

    // Calculate systemic load
    const systemicLoad = calculateSystemicLoad(weeklyProgression);

    return {
        baseVolumes: redistributedVolumes,
        weeklyProgression,
        systemicLoad,
        totalWeeks: blocks.reduce((sum, block) => sum + block.weeks, 0),
        totalSets: calculateTotalSets(weeklyProgression),
        specializationMuscles,
        recommendations: generateRecommendations(weeklyProgression, systemicLoad)
    };
};

/**
 * Apply specialization redistribution logic
 * Priority muscles get +30% volume, others reduced to maintain systemic MRV
 */
const applySpecializationRedistribution = (baseVolumes, specializationMuscles) => {
    if (specializationMuscles.length === 0) return baseVolumes;

    const redistributed = { ...baseVolumes };
    const muscleGroups = Object.keys(baseVolumes);

    // Calculate systemic MRV baseline
    const baseSystemicMRV = muscleGroups.reduce((sum, muscle) => sum + baseVolumes[muscle].mrv, 0);

    // Calculate specialized volume increase
    const specializationIncrease = specializationMuscles.reduce((sum, muscle) => {
        return sum + (baseVolumes[muscle].mrv * 0.3); // 30% increase
    }, 0);

    // Apply specialization boost
    specializationMuscles.forEach(muscle => {
        redistributed[muscle] = {
            ...redistributed[muscle],
            mev: Math.round(redistributed[muscle].mev * 1.3),
            mrv: Math.round(redistributed[muscle].mrv * 1.3),
            mav: Math.round(redistributed[muscle].mav * 1.3),
            specialization: true
        };
    });

    // Reduce non-specialized muscles to maintain systemic capacity
    const nonSpecializedMuscles = muscleGroups.filter(muscle => !specializationMuscles.includes(muscle));
    const reductionFactor = Math.max(0.7, 1 - (specializationIncrease / baseSystemicMRV) * 0.8);

    nonSpecializedMuscles.forEach(muscle => {
        redistributed[muscle] = {
            ...redistributed[muscle],
            mev: Math.round(redistributed[muscle].mev * reductionFactor),
            mrv: Math.round(redistributed[muscle].mrv * reductionFactor),
            mav: Math.round(redistributed[muscle].mav * reductionFactor),
            specialization: false
        };
    });

    return redistributed;
};

/**
 * Calculate week-by-week volume progression for each muscle group
 */
const calculateWeeklyProgression = (volumes, blocks, programDetails) => {
    const progression = {};
    const muscleGroups = Object.keys(volumes);

    // Initialize progression structure
    muscleGroups.forEach(muscle => {
        progression[muscle] = [];
    });

    let currentWeek = 1;

    // Process each block
    blocks.forEach((block, blockIndex) => {
        for (let weekInBlock = 1; weekInBlock <= block.weeks; weekInBlock++) {
            muscleGroups.forEach(muscle => {
                const muscleVolume = volumes[muscle];
                const weeklyData = calculateWeeklyVolume(
                    muscleVolume,
                    block,
                    weekInBlock,
                    currentWeek,
                    programDetails
                );

                progression[muscle].push({
                    week: currentWeek,
                    blockIndex,
                    blockType: block.type,
                    weekInBlock,
                    ...weeklyData
                });
            });

            currentWeek++;
        }
    });

    return progression;
};

/**
 * Calculate volume for a specific week within a block
 */
const calculateWeeklyVolume = (muscleVolume, block, weekInBlock, globalWeek, programDetails) => {
    const { mev, mrv, mav, mv } = muscleVolume;
    let volume, rir, intensity;

    switch (block.type) {
        case 'accumulation':
            // Linear progression from MEV to MRV
            const accumulationProgress = (weekInBlock - 1) / Math.max(block.weeks - 1, 1);
            volume = Math.round(mev + (mrv - mev) * accumulationProgress);
            rir = calculateRIR(weekInBlock, block.weeks, programDetails.trainingExperience, 'accumulation');
            intensity = 65 + (accumulationProgress * 10); // 65-75%
            break;

        case 'intensification':
            // Maintain MAV, focus on intensity
            volume = Math.round(mav * 0.85); // Slightly below MAV
            rir = calculateRIR(weekInBlock, block.weeks, programDetails.trainingExperience, 'intensification');
            intensity = 75 + (weekInBlock - 1) / (block.weeks - 1) * 10; // 75-85%
            break;

        case 'realization':
            // Taper volume, peak intensity
            const realizationProgress = (weekInBlock - 1) / Math.max(block.weeks - 1, 1);
            volume = Math.round(mev * (1 - realizationProgress * 0.3)); // Taper to 70% of MEV
            rir = Math.max(0, calculateRIR(weekInBlock, block.weeks, programDetails.trainingExperience, 'realization'));
            intensity = 85 + (realizationProgress * 10); // 85-95%
            break;

        case 'deload':
            // Recovery phase
            volume = Math.round(mv * 0.8); // Below maintenance
            rir = 4; // Easy deload
            intensity = 50 + (weekInBlock - 1) / (block.weeks - 1) * 15; // 50-65%
            break;

        default:
            volume = mev;
            rir = 3;
            intensity = 70;
    }

    return {
        volume: Math.max(0, volume),
        rir,
        intensity: Math.round(intensity),
        sets: volume, // Sets per week
        frequency: muscleVolume.frequency || 2
    };
};

/**
 * Calculate RIR progression within a block
 */
const calculateRIR = (weekInBlock, totalWeeks, experience, blockType) => {
    const baseRIR = {
        beginner: 4,
        intermediate: 3,
        advanced: 2
    }[experience] || 3;

    const blockModifier = {
        accumulation: 0,
        intensification: -1,
        realization: -2,
        deload: 2
    }[blockType] || 0;

    const weeklyReduction = Math.floor((weekInBlock - 1) / Math.max(totalWeeks - 1, 1) * 2);

    return Math.max(0, baseRIR + blockModifier - weeklyReduction);
};

/**
 * Calculate systemic training load
 */
const calculateSystemicLoad = (weeklyProgression) => {
    const muscleGroups = Object.keys(weeklyProgression);
    const systemicLoad = [];

    if (muscleGroups.length === 0) return systemicLoad;

    const totalWeeks = weeklyProgression[muscleGroups[0]].length;

    for (let week = 0; week < totalWeeks; week++) {
        let totalSets = 0;
        let averageRIR = 0;
        let averageIntensity = 0;

        muscleGroups.forEach(muscle => {
            const weekData = weeklyProgression[muscle][week];
            totalSets += weekData.volume;
            averageRIR += weekData.rir;
            averageIntensity += weekData.intensity;
        });

        averageRIR /= muscleGroups.length;
        averageIntensity /= muscleGroups.length;

        // Calculate load score (higher = more demanding)
        const loadScore = (totalSets * (100 - averageRIR * 10) * averageIntensity) / 10000;

        systemicLoad.push({
            week: week + 1,
            totalSets,
            averageRIR: Math.round(averageRIR * 10) / 10,
            averageIntensity: Math.round(averageIntensity),
            loadScore: Math.round(loadScore * 100) / 100,
            category: categorizeLoad(loadScore)
        });
    }

    return systemicLoad;
};

/**
 * Categorize training load
 */
const categorizeLoad = (loadScore) => {
    if (loadScore < 20) return 'light';
    if (loadScore < 40) return 'moderate';
    if (loadScore < 60) return 'hard';
    if (loadScore < 80) return 'very-hard';
    return 'extreme';
};

/**
 * Calculate total sets across entire macrocycle
 */
const calculateTotalSets = (weeklyProgression) => {
    const muscleGroups = Object.keys(weeklyProgression);

    return muscleGroups.reduce((total, muscle) => {
        return total + weeklyProgression[muscle].reduce((muscleTotal, week) => {
            return muscleTotal + week.volume;
        }, 0);
    }, 0);
};

/**
 * Generate programming recommendations
 */
const generateRecommendations = (weeklyProgression, systemicLoad) => {
    const recommendations = [];

    // Check for excessive load
    const extremeWeeks = systemicLoad.filter(week => week.category === 'extreme');
    if (extremeWeeks.length > 0) {
        recommendations.push({
            type: 'warning',
            title: 'High Systemic Load',
            message: `Weeks ${extremeWeeks.map(w => w.week).join(', ')} show extreme training load. Consider deload placement.`
        });
    }

    // Check deload frequency
    const totalWeeks = systemicLoad.length;
    const deloadWeeks = systemicLoad.filter(week => week.category === 'light').length;
    if (totalWeeks > 8 && deloadWeeks === 0) {
        recommendations.push({
            type: 'error',
            title: 'Missing Deload',
            message: 'Programs longer than 8 weeks should include at least one deload week.'
        });
    }

    // Check specialization balance
    const muscleGroups = Object.keys(weeklyProgression);
    const specializedMuscles = muscleGroups.filter(muscle =>
        weeklyProgression[muscle].some(week => week.volume > 25)
    );

    if (specializedMuscles.length > 3) {
        recommendations.push({
            type: 'warning',
            title: 'Excessive Specialization',
            message: 'More than 3 specialized muscle groups may exceed recovery capacity.'
        });
    }

    return recommendations;
};

export {
    calculateWeeklyProgression,
    applySpecializationRedistribution,
    calculateSystemicLoad,
    calculateTotalSets,
    generateRecommendations
};
