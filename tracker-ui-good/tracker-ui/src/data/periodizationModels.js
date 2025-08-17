/**
 * Enhanced Periodization Models for Tracker UI Good
 * Includes Bryant Periodization (pages 101-129) integration
 * Unified 5-component framework implementation
 */

import { BRYANT_CONSTANTS, BRYANT_HYBRID_MODEL } from '../utils/legacyMigration';

// Core periodization models with Bryant integration
export const periodizationModels = {
    linear: {
        id: 'linear',
        name: 'Linear Periodization',
        description: 'Traditional progression from high volume/low intensity to low volume/high intensity',
        duration: '12-20 weeks',
        bestFor: 'Beginners, single peak competitions, strength focus',
        phases: ['General Preparation', 'Specific Preparation', 'Competition', 'Transition'],
        advantages: ['Simple to plan', 'Clear progression', 'Good for beginners'],
        disadvantages: ['Limited variety', 'Detraining risk', 'Single peak focus'],
        icon: '📈',
        color: 'blue',
        bryantCompatible: false
    },

    block_periodization: {
        id: 'block_periodization',
        name: 'Block Periodization',
        description: 'Sequential focused blocks with concentrated loads for specific adaptations',
        duration: '8-16 weeks per block',
        bestFor: 'Intermediate to advanced, multiple competitions, sport-specific training',
        phases: ['Accumulation', 'Transmutation', 'Realization'],
        advantages: ['Multiple peaks', 'Concentrated adaptations', 'Reduced interference'],
        disadvantages: ['Complex planning', 'Requires experience', 'Risk of overspecialization'],
        icon: '🎯',
        color: 'purple',
        bryantCompatible: true,
        bryantModifications: {
            maxBlockDuration: BRYANT_CONSTANTS.PHA_MAX_DURATION,
            supportedMethods: ['phaCircuits', 'clusterSets']
        }
    },

    conjugate: {
        id: 'conjugate',
        name: 'Conjugate Method',
        description: 'High frequency varied approach with concurrent development of multiple qualities',
        duration: 'Ongoing weekly cycles',
        bestFor: 'Advanced athletes, powerlifters, year-round training',
        phases: ['Max Effort', 'Dynamic Effort', 'Repetition Method'],
        advantages: ['Concurrent development', 'High variety', 'Reduced staleness'],
        disadvantages: ['Very complex', 'Extensive exercise library needed', 'Not for beginners'],
        icon: '🔄',
        color: 'orange',
        bryantCompatible: true,
        bryantModifications: {
            clusterIntegration: true,
            strongmanEvents: true,
            tacticalApplications: true
        }
    },

    undulating: {
        id: 'undulating',
        name: 'Daily Undulating Periodization',
        description: 'Frequent variation of training variables within weekly microcycles',
        duration: 'Ongoing weekly patterns',
        bestFor: 'Variety seekers, hypertrophy focus, recreational athletes',
        phases: ['High Volume', 'Moderate Intensity', 'High Intensity', 'Recovery'],
        advantages: ['High variety', 'Reduced boredom', 'Flexible scheduling'],
        disadvantages: ['Less specific adaptations', 'Complex tracking', 'Potential overreaching'],
        icon: '🌊',
        color: 'green',
        bryantCompatible: true,
        bryantModifications: {
            phaCircuitIntegration: true,
            durationCaps: BRYANT_CONSTANTS.PHA_MAX_DURATION
        }
    },

    reverse_linear: {
        id: 'reverse_linear',
        name: 'Reverse Linear Periodization',
        description: 'Start high intensity/low volume, progressively build volume for hypertrophy/endurance',
        duration: '12-16 weeks',
        bestFor: 'Advanced athletes, hypertrophy focus, endurance building after strength phase',
        phases: ['Power', 'Hypertrophy', 'Volume'],
        advantages: ['Volume tolerance building', 'Strength maintenance', 'Neural recovery'],
        disadvantages: ['Requires high initial fitness', 'Complex volume management', 'Risk of overuse'],
        icon: '📉',
        color: 'cyan',
        bryantCompatible: false
    },

    // Bryant Hybrid Model - NEW
    bryant_hybrid: {
        ...BRYANT_HYBRID_MODEL,
        bryantCompatible: true,
        bryantNative: true,
        bryantModifications: {
            phaCircuits: {
                maxDuration: BRYANT_CONSTANTS.PHA_MAX_DURATION,
                minDuration: BRYANT_CONSTANTS.PHA_MIN_DURATION,
                description: 'Peripheral Heart Action circuits with duration caps'
            },
            clusterSets: {
                intraRest: BRYANT_CONSTANTS.CLUSTER_INTRA_REST,
                interRest: BRYANT_CONSTANTS.CLUSTER_INTER_REST,
                description: '15s intra-rest, 3×3-5 structure with tactical applications'
            },
            strongmanEvents: {
                timeCap: BRYANT_CONSTANTS.STRONGMAN_TIME_CAP,
                distanceStandard: BRYANT_CONSTANTS.STRONGMAN_DISTANCE_STANDARD,
                description: 'Time/distance-based events for tactical preparation'
            },
            tacticalApplications: {
                recoveryRatio: BRYANT_CONSTANTS.TACTICAL_RECOVERY_RATIO,
                description: 'Law enforcement and military-specific protocols'
            }
        }
    }
};

// Program goals enhanced with Bryant compatibility
export const programGoals = {
    strength: {
        name: 'Strength Development',
        color: 'red',
        icon: '💪',
        description: 'Maximize force production and 1RM capabilities',
        typicalDuration: '12-16 weeks',
        mesocycleTypes: ['accumulation', 'intensification', 'realization'],
        volumeProfile: 'moderate',
        intensityProfile: 'high',
        recommendedModels: ['linear', 'block_periodization'],
        bryantCompatible: true,
        bryantMethods: ['clusterSets', 'strongmanEvents']
    },

    hypertrophy: {
        name: 'Muscle Hypertrophy',
        color: 'blue',
        icon: '🔥',
        description: 'Increase muscle mass and size',
        typicalDuration: '8-12 weeks',
        mesocycleTypes: ['accumulation', 'intensification'],
        volumeProfile: 'high',
        intensityProfile: 'moderate',
        recommendedModels: ['undulating', 'block_periodization'],
        bryantCompatible: true,
        bryantMethods: ['phaCircuits', 'clusterSets']
    },

    power: {
        name: 'Power Development',
        color: 'yellow',
        icon: '⚡',
        description: 'Increase rate of force development and explosive capabilities',
        typicalDuration: '6-10 weeks',
        mesocycleTypes: ['intensification', 'realization'],
        volumeProfile: 'low',
        intensityProfile: 'high',
        recommendedModels: ['conjugate', 'block_periodization'],
        bryantCompatible: true,
        bryantMethods: ['clusterSets', 'strongmanEvents']
    },

    endurance: {
        name: 'Muscular Endurance',
        color: 'green',
        icon: '🏃',
        description: 'Improve ability to sustain submaximal efforts',
        typicalDuration: '8-16 weeks',
        mesocycleTypes: ['accumulation'],
        volumeProfile: 'high',
        intensityProfile: 'low',
        recommendedModels: ['reverse_linear', 'undulating'],
        bryantCompatible: true,
        bryantMethods: ['phaCircuits', 'tacticalApplications']
    },

    // NEW: Tactical fitness goal
    tactical: {
        name: 'Tactical Fitness',
        color: 'tactical',
        icon: '🎯',
        description: 'Law enforcement, military, and first responder preparation',
        typicalDuration: '6-12 weeks',
        mesocycleTypes: ['accumulation', 'intensification', 'tactical_application'],
        volumeProfile: 'moderate-high',
        intensityProfile: 'varied',
        recommendedModels: ['bryant_hybrid', 'conjugate'],
        bryantCompatible: true,
        bryantNative: true,
        bryantMethods: ['phaCircuits', 'clusterSets', 'strongmanEvents', 'tacticalApplications']
    }
};

// Enhanced mesocycle types with Bryant integration
export const mesocycleTypes = {
    accumulation: {
        name: 'Accumulation',
        color: '#10B981',
        description: 'High volume phase for building work capacity',
        loadingRange: '60-75%',
        volumeEmphasis: 'high',
        bryantMethods: ['phaCircuits'],
        durationCap: BRYANT_CONSTANTS.PHA_MAX_DURATION
    },

    intensification: {
        name: 'Intensification',
        color: '#F59E0B',
        description: 'Moderate volume, higher intensity for strength',
        loadingRange: '75-85%',
        volumeEmphasis: 'moderate',
        bryantMethods: ['clusterSets'],
        durationCap: BRYANT_CONSTANTS.PHA_MAX_DURATION
    },

    realization: {
        name: 'Realization',
        color: '#EF4444',
        description: 'Low volume, peak intensity for expression',
        loadingRange: '85-100%',
        volumeEmphasis: 'low',
        bryantMethods: ['strongmanEvents'],
        durationCap: BRYANT_CONSTANTS.PHA_MAX_DURATION
    },

    deload: {
        name: 'Deload',
        color: '#6B7280',
        description: 'Recovery phase with reduced stress',
        loadingRange: '40-60%',
        volumeEmphasis: 'low',
        bryantMethods: [],
        durationCap: 2 // Always short for deload
    },

    // NEW: Tactical application mesocycle
    tactical_application: {
        name: 'Tactical Application',
        color: '#8B5CF6',
        description: 'Real-world scenario preparation with job-specific demands',
        loadingRange: '70-90%',
        volumeEmphasis: 'variable',
        bryantMethods: ['tacticalApplications', 'strongmanEvents'],
        bryantNative: true,
        durationCap: BRYANT_CONSTANTS.PHA_MAX_DURATION
    }
};

/**
 * Get periodization models compatible with Bryant methods
 * @param {Array} bryantFeatures - Array of Bryant features being used
 * @returns {Object} - Filtered periodization models
 */
export function getBryantCompatibleModels(bryantFeatures = []) {
    if (bryantFeatures.length === 0) {
        return periodizationModels;
    }

    const compatibleModels = {};

    Object.entries(periodizationModels).forEach(([key, model]) => {
        if (model.bryantCompatible) {
            compatibleModels[key] = model;
        }
    });

    return compatibleModels;
}

/**
 * Get recommended Bryant methods for a specific goal
 * @param {string} goalType - The program goal type
 * @returns {Array} - Array of recommended Bryant methods
 */
export function getRecommendedBryantMethods(goalType) {
    const goal = programGoals[goalType];
    return goal?.bryantMethods || [];
}

/**
 * Validate periodization model selection with Bryant integration
 * @param {string} modelId - Selected periodization model
 * @param {Array} bryantFeatures - Selected Bryant features
 * @returns {Object} - Validation result
 */
export function validateModelBryantCompatibility(modelId, bryantFeatures = []) {
    const model = periodizationModels[modelId];

    if (!model) {
        return { valid: false, error: 'Invalid periodization model' };
    }

    if (bryantFeatures.length === 0) {
        return { valid: true };
    }

    if (!model.bryantCompatible) {
        return {
            valid: false,
            error: `${model.name} is not compatible with Bryant Periodization methods`,
            recommendations: ['Consider block periodization or conjugate method']
        };
    }

    // Check specific method compatibility
    const incompatibleMethods = [];
    const modelMods = model.bryantModifications || {};

    bryantFeatures.forEach(feature => {
        if (!modelMods[feature] && !model.bryantNative) {
            incompatibleMethods.push(feature);
        }
    });

    if (incompatibleMethods.length > 0) {
        return {
            valid: false,
            error: `Incompatible Bryant methods: ${incompatibleMethods.join(', ')}`,
            recommendations: ['Consider Bryant Hybrid model for full method integration']
        };
    }

    return { valid: true };
}

export default {
    periodizationModels,
    programGoals,
    mesocycleTypes,
    getBryantCompatibleModels,
    getRecommendedBryantMethods,
    validateModelBryantCompatibility
};
