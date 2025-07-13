import {
    BASE_VOLUME_LANDMARKS,
    calculateVolumeProgression as rpCalculateVolumeProgression,
    MACROCYCLE_TEMPLATES,
    RIR_SCHEMES,
    calculateIntensityFromRIR,
    PHASE_DURATION_BASE,
    PHASE_DURATION_MODIFIERS
} from '../constants/rpConstants';

/**
 * Calculate volume progression for a specific block and week
 * @param {Object} block - The program block object
 * @param {number} week - The week number (1-based)
 * @returns {number} - The calculated volume (number of sets)
 */
export const calculateVolumeProgression = (block, week) => {
    if (!block || !block.parameters || week < 1) {
        return 0;
    }

    const { parameters, duration, type } = block;
    const { volume } = parameters;

    // If explicit volume is provided, use it
    if (volume && volume.sets) {
        // Apply progression based on block type
        switch (type) {
            case 'accumulation':
                // Linear progression from 80% to 100% of target volume
                const progressionFactor = 0.8 + (0.2 * (week - 1) / (duration - 1));
                return Math.round(volume.sets * progressionFactor);

            case 'intensification':
                // Volume reduces as intensity increases (90% to 70% of target)
                const reductionFactor = 0.9 - (0.2 * (week - 1) / (duration - 1));
                return Math.round(volume.sets * reductionFactor);

            case 'realization':
                // Low volume for peaking (60% to 40% of target)
                const peakingFactor = 0.6 - (0.2 * (week - 1) / (duration - 1));
                return Math.round(volume.sets * peakingFactor);

            default:
                return volume.sets;
        }
    }

    // Fallback to RP volume progression if no explicit volume
    const muscleGroup = block.primaryMuscleGroup || 'chest'; // Default fallback
    const trainingAge = block.trainingAge || 'intermediate';

    const { progression } = rpCalculateVolumeProgression(muscleGroup, duration, trainingAge);
    return progression[week - 1] || progression[progression.length - 1];
};

/**
 * Get methodology defaults based on training methodology and block type
 * @param {string} methodology - The training methodology ('Linear', 'Block', 'Conjugate')
 * @param {string} blockType - The block type ('accumulation', 'intensification', 'realization')
 * @returns {Object} - Default parameters {load: string, time: string, methods: string}
 */
export const getMethodologyDefaults = (methodology, blockType) => {
    const defaults = {
        load: '',
        time: '',
        methods: ''
    };

    // Linear methodology defaults
    if (methodology === 'Linear') {
        switch (blockType) {
            case 'accumulation':
                return {
                    load: '70-80% 1RM',
                    time: '45-60 minutes',
                    methods: 'Progressive overload, compound movements, moderate volume'
                };
            case 'intensification':
                return {
                    load: '80-90% 1RM',
                    time: '60-75 minutes',
                    methods: 'High intensity, reduced volume, main lifts focus'
                };
            case 'realization':
                return {
                    load: '90-100% 1RM',
                    time: '30-45 minutes',
                    methods: 'Peak intensity, minimal volume, competition preparation'
                };
            default:
                return {
                    load: '70-85% 1RM',
                    time: '45-60 minutes',
                    methods: 'Linear progression, compound focus'
                };
        }
    }

    // Block methodology defaults
    if (methodology === 'Block') {
        switch (blockType) {
            case 'accumulation':
                return {
                    load: '65-80% 1RM',
                    time: '60-90 minutes',
                    methods: 'High volume, moderate intensity, hypertrophy focus, accessory work'
                };
            case 'intensification':
                return {
                    load: '80-95% 1RM',
                    time: '45-75 minutes',
                    methods: 'High intensity, moderate volume, strength focus, competition lifts'
                };
            case 'realization':
                return {
                    load: '90-105% 1RM',
                    time: '30-60 minutes',
                    methods: 'Peak intensity, low volume, competition simulation, opener/second/third attempts'
                };
            default:
                return {
                    load: '70-85% 1RM',
                    time: '60-75 minutes',
                    methods: 'Block periodization, targeted adaptations'
                };
        }
    }

    // Conjugate methodology defaults
    if (methodology === 'Conjugate') {
        switch (blockType) {
            case 'accumulation':
                return {
                    load: 'ME: 90-105%, DE: 50-60% + bands/chains',
                    time: '75-120 minutes',
                    methods: 'Max effort + dynamic effort, multiple training qualities, extensive accessory work'
                };
            case 'intensification':
                return {
                    load: 'ME: 95-110%, DE: 55-65% + accommodating resistance',
                    time: '90-135 minutes',
                    methods: 'Intensified max effort work, speed-strength emphasis, targeted weaknesses'
                };
            case 'realization':
                return {
                    load: 'ME: 100-115%, competition commands',
                    time: '60-90 minutes',
                    methods: 'Competition simulation, opener practice, competition timing'
                };
            default:
                return {
                    load: 'ME: 90-105%, DE: 50-60%',
                    time: '90-120 minutes',
                    methods: 'Conjugate method, max effort + dynamic effort, concurrent training'
                };
        }
    }

    // Default fallback
    return {
        load: '70-85% 1RM',
        time: '45-75 minutes',
        methods: 'Progressive overload, compound movements, balanced training'
    };
};

/**
 * Calculate intensity progression for a block
 * @param {Object} block - The program block object
 * @param {number} week - The week number (1-based)
 * @returns {Object} - Intensity information {percentage: number, rir: number, description: string}
 */
export const calculateIntensityProgression = (block, week) => {
    if (!block || week < 1) {
        return { percentage: 75, rir: 3, description: '75% 1RM, 3 RIR' };
    }

    const { duration, type } = block;
    const maxWeek = Math.min(week, duration);

    // Get RIR progression for the block duration
    const rirScheme = RIR_SCHEMES[Math.min(duration, 6)] || RIR_SCHEMES[4];
    const targetRIR = rirScheme[maxWeek - 1] || rirScheme[rirScheme.length - 1];

    // Adjust RIR based on block type
    let adjustedRIR = targetRIR;
    switch (type) {
        case 'accumulation':
            adjustedRIR = Math.max(targetRIR, 2); // Never below 2 RIR for volume work
            break;
        case 'intensification':
            adjustedRIR = targetRIR; // Standard progression
            break;
        case 'realization':
            adjustedRIR = Math.max(targetRIR - 0.5, 0); // Slightly more aggressive for peaking
            break;
        default:
            adjustedRIR = targetRIR;
    }

    // Convert RIR to percentage and description
    const intensityDescription = calculateIntensityFromRIR(adjustedRIR);

    // Extract approximate percentage (take middle of range)
    const percentageMatch = intensityDescription.match(/(\d+)-(\d+)%/);
    const percentage = percentageMatch
        ? Math.round((parseInt(percentageMatch[1]) + parseInt(percentageMatch[2])) / 2)
        : 75;

    return {
        percentage,
        rir: adjustedRIR,
        description: `${percentage}% 1RM, ${adjustedRIR} RIR`,
        intensityRange: intensityDescription
    };
};

/**
 * Calculate training frequency for a muscle group based on volume and recovery
 * @param {string} muscleGroup - The target muscle group
 * @param {number} weeklyVolume - Weekly volume in sets
 * @param {string} trainingAge - Training experience level
 * @returns {Object} - Frequency information {sessionsPerWeek: number, setsPerSession: number}
 */
export const calculateTrainingFrequency = (muscleGroup, weeklyVolume, trainingAge = 'intermediate') => {
    const landmarks = BASE_VOLUME_LANDMARKS[muscleGroup];
    if (!landmarks) {
        return { sessionsPerWeek: 2, setsPerSession: Math.round(weeklyVolume / 2) };
    }

    // Parse frequency recommendation (e.g., "2-3x/week")
    const frequencyMatch = landmarks.frequency.match(/(\d+)-?(\d+)?x/);
    const minFreq = frequencyMatch ? parseInt(frequencyMatch[1]) : 2;
    const maxFreq = frequencyMatch && frequencyMatch[2] ? parseInt(frequencyMatch[2]) : minFreq;

    // Determine optimal frequency based on volume and training age
    let optimalFrequency = minFreq;

    if (weeklyVolume >= landmarks.mrv * 0.8) {
        // High volume - use maximum frequency
        optimalFrequency = maxFreq;
    } else if (weeklyVolume >= landmarks.mev * 1.5) {
        // Moderate-high volume - use mid-range frequency
        optimalFrequency = Math.ceil((minFreq + maxFreq) / 2);
    } else {
        // Lower volume - use minimum frequency
        optimalFrequency = minFreq;
    }

    // Adjust for training age
    if (trainingAge === 'beginner' && optimalFrequency > 3) {
        optimalFrequency = Math.min(optimalFrequency, 3); // Cap beginner frequency
    } else if (trainingAge === 'advanced' && weeklyVolume >= landmarks.mev * 2) {
        optimalFrequency = Math.min(optimalFrequency + 1, maxFreq); // Advanced can handle higher frequency
    }

    const setsPerSession = Math.round(weeklyVolume / optimalFrequency);

    return {
        sessionsPerWeek: optimalFrequency,
        setsPerSession,
        totalWeeklyVolume: weeklyVolume,
        recommendation: `${optimalFrequency}x/week, ${setsPerSession} sets per session`
    };
};

/**
 * Generate a complete block structure with calculated parameters
 * @param {Object} blockConfig - Basic block configuration
 * @param {Object} userProfile - User training profile
 * @returns {Object} - Complete block with calculated parameters
 */
export const generateBlockStructure = (blockConfig, userProfile = {}) => {
    const {
        type = 'accumulation',
        duration = 4,
        primaryGoal = 'hypertrophy',
        methodology = 'Block'
    } = blockConfig;

    const {
        trainingAge = 'intermediate',
        primaryMuscleGroups = ['chest', 'back', 'legs']
    } = userProfile;

    // Get methodology defaults
    const methodDefaults = getMethodologyDefaults(methodology, type);

    // Calculate volume for primary muscle groups
    const muscleGroupVolumes = {};
    primaryMuscleGroups.forEach(muscle => {
        const landmarks = BASE_VOLUME_LANDMARKS[muscle];
        if (landmarks) {
            // Base volume on block type and training age
            let baseVolume = landmarks.mev;

            if (type === 'accumulation') {
                baseVolume = Math.round(landmarks.mev * 1.3); // 30% above MEV
            } else if (type === 'intensification') {
                baseVolume = landmarks.mev; // At MEV level
            } else if (type === 'realization') {
                baseVolume = Math.round(landmarks.mev * 0.7); // Below MEV
            }

            muscleGroupVolumes[muscle] = {
                weeklyVolume: baseVolume,
                frequency: calculateTrainingFrequency(muscle, baseVolume, trainingAge)
            };
        }
    });

    return {
        id: `block_${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
        type,
        duration,
        parameters: {
            load: methodDefaults.load,
            time: methodDefaults.time,
            methods: methodDefaults.methods,
            volume: {
                sets: Math.round(Object.values(muscleGroupVolumes).reduce((sum, mv) => sum + mv.weeklyVolume, 0) / primaryMuscleGroups.length),
                repsMin: type === 'realization' ? 1 : type === 'intensification' ? 3 : 6,
                repsMax: type === 'realization' ? 3 : type === 'intensification' ? 6 : 12
            },
            intensity: {
                percentage: type === 'realization' ? 90 : type === 'intensification' ? 85 : 75,
                rir: type === 'realization' ? 1 : type === 'intensification' ? 2 : 3
            },
            frequency: Math.round(Object.values(muscleGroupVolumes).reduce((sum, mv) => sum + mv.frequency.sessionsPerWeek, 0) / primaryMuscleGroups.length)
        },
        muscleGroupVolumes,
        methodology,
        primaryGoal,
        trainingAge,
        order: 1,
        description: `${duration}-week ${type} block focusing on ${primaryGoal} using ${methodology} methodology`
    };
};

/**
 * Validate block parameters and suggest corrections
 * @param {Object} block - The block to validate
 * @returns {Object} - Validation result with errors and suggestions
 */
export const validateBlockParameters = (block) => {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!block || !block.parameters) {
        errors.push('Block parameters are required');
        return { isValid: false, errors, warnings, suggestions };
    }

    const { parameters, type, duration } = block;
    const { volume, intensity } = parameters;

    // Volume validation
    if (volume && volume.sets) {
        if (volume.sets < 1) {
            errors.push('Volume must be at least 1 set');
        } else if (volume.sets > 50) {
            warnings.push('Very high volume (>50 sets) - consider splitting across more sessions');
        }

        // Rep range validation
        if (volume.repsMin && volume.repsMax) {
            if (volume.repsMin > volume.repsMax) {
                errors.push('Minimum reps cannot be greater than maximum reps');
            }

            // Type-specific rep range suggestions
            if (type === 'realization' && volume.repsMax > 5) {
                suggestions.push('Consider lower rep ranges (1-5) for realization blocks');
            } else if (type === 'accumulation' && volume.repsMax < 8) {
                suggestions.push('Consider higher rep ranges (8-15) for accumulation blocks');
            }
        }
    }

    // Intensity validation
    if (intensity) {
        if (intensity.percentage && (intensity.percentage < 30 || intensity.percentage > 110)) {
            errors.push('Intensity percentage should be between 30% and 110%');
        }

        if (intensity.rir && (intensity.rir < 0 || intensity.rir > 5)) {
            warnings.push('RIR values outside 0-5 range are uncommon');
        }

        // Type-specific intensity suggestions
        if (type === 'realization' && intensity.percentage < 85) {
            suggestions.push('Consider higher intensities (85%+) for realization blocks');
        } else if (type === 'accumulation' && intensity.percentage > 85) {
            suggestions.push('Consider moderate intensities (65-80%) for accumulation blocks');
        }
    }

    // Duration validation
    if (duration < 1 || duration > 12) {
        warnings.push('Block duration outside typical range (1-12 weeks)');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
    };
};

export default {
    calculateVolumeProgression,
    getMethodologyDefaults,
    calculateIntensityProgression,
    calculateTrainingFrequency,
    generateBlockStructure,
    validateBlockParameters
};
