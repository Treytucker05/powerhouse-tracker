/**
 * Legacy Migration Utilities
 * Handles migration from src 7-step methodology to tracker-ui-good 5-component framework
 * Includes Bryant Periodization integration support
 */

// Bryant Periodization constants from research pages 101-129
export const BRYANT_CONSTANTS = {
    PHA_MAX_DURATION: 6, // weeks - maximum PHA circuit duration
    PHA_MIN_DURATION: 4, // weeks - minimum PHA circuit duration
    CLUSTER_INTRA_REST: 15, // seconds - rest between cluster reps
    CLUSTER_INTER_REST: 180, // seconds - rest between cluster sets
    STRONGMAN_TIME_CAP: 60, // seconds - maximum time for strongman events
    STRONGMAN_DISTANCE_STANDARD: 150, // feet - standard strongman distance
    TACTICAL_RECOVERY_RATIO: 1.5 // work:rest ratio for tactical applications
};

// Bryant Periodization model definition
export const BRYANT_HYBRID_MODEL = {
    id: 'bryant_hybrid',
    name: 'Bryant Hybrid Periodization',
    description: 'Combines PHA circuits, cluster sets, and strongman events with duration caps',
    duration: '4-6 weeks per phase',
    bestFor: 'Law enforcement, military, tactical athletes, advanced general population',
    phases: ['PHA Circuit', 'Cluster Development', 'Strongman Application', 'Tactical Integration'],
    advantages: ['Real-world application', 'High metabolic demand', 'Functional strength'],
    disadvantages: ['Requires experience', 'Equipment intensive', 'High fatigue'],
    icon: '🎯',
    color: 'tactical',
    durationCap: BRYANT_CONSTANTS.PHA_MAX_DURATION,
    specialFeatures: {
        phaCircuits: true,
        clusterSets: true,
        strongmanEvents: true,
        tacticalApplication: true
    }
};

/**
 * Migrates legacy program data from src 7-step methodology
 * @param {Object} legacyData - Data from src implementation
 * @returns {Object} - Transformed data for tracker-ui-good 5-component framework
 */
export function migrateLegacyProgramData(legacyData) {
    if (!legacyData) return null;

    try {
        const migratedData = {
            // Map 7-step methodology to 5-component framework
            goals: mapLegacyGoals(legacyData.goals),
            model: mapLegacyModel(legacyData.model),
            blocks: mapLegacyBlocks(legacyData.blocks),
            results: mapLegacyResults(legacyData.results),
            metadata: {
                migrationDate: new Date().toISOString(),
                sourceVersion: '7-step',
                targetVersion: '5-component',
                bryantIntegrated: checkBryantFeatures(legacyData)
            }
        };

        console.log('Legacy data migrated successfully:', migratedData);
        return migratedData;
    } catch (error) {
        console.error('Migration failed:', error);
        return null;
    }
}

/**
 * Maps legacy goals to 5-component framework
 */
function mapLegacyGoals(legacyGoals) {
    if (!legacyGoals) return null;

    return {
        primaryGoal: legacyGoals.primaryGoal || 'hypertrophy',
        trainingDays: legacyGoals.trainingDays || 4,
        duration: legacyGoals.duration || 12,
        experience: legacyGoals.experience || 'intermediate',
        bryantFeatures: extractBryantFeatures(legacyGoals)
    };
}

/**
 * Maps legacy model to 5-component framework
 */
function mapLegacyModel(legacyModel) {
    if (!legacyModel) return null;

    // Check if this is a Bryant-integrated model
    const isBryantModel = legacyModel.type === 'bryant_hybrid' ||
        legacyModel.features?.includes('phaCircuits') ||
        legacyModel.features?.includes('clusterSets') ||
        legacyModel.features?.includes('strongmanEvents');

    return {
        periodizationModel: isBryantModel ? 'bryant_hybrid' : (legacyModel.periodization || 'linear'),
        trainingModel: legacyModel.trainingModel || 'traditional',
        bryantIntegrated: isBryantModel,
        specialFeatures: legacyModel.features || []
    };
}

/**
 * Maps legacy blocks to 5-component framework
 */
function mapLegacyBlocks(legacyBlocks) {
    if (!legacyBlocks) return null;

    return legacyBlocks.map(block => ({
        id: block.id,
        name: block.name,
        duration: Math.min(block.duration, BRYANT_CONSTANTS.PHA_MAX_DURATION), // Apply Bryant caps
        phase: block.phase,
        bryantMethods: extractBryantMethods(block),
        parameters: block.parameters
    }));
}

/**
 * Maps legacy results to 5-component framework
 */
function mapLegacyResults(legacyResults) {
    if (!legacyResults) return null;

    return {
        program: legacyResults.program,
        bryantAnalysis: analyzeBryantCompliance(legacyResults),
        migrationNotes: legacyResults.notes || []
    };
}

/**
 * Extracts Bryant Periodization features from legacy data
 */
function extractBryantFeatures(data) {
    const features = [];

    if (data.phaCircuits) features.push('phaCircuits');
    if (data.clusterSets) features.push('clusterSets');
    if (data.strongmanEvents) features.push('strongmanEvents');
    if (data.tacticalApplication) features.push('tacticalApplication');

    return features;
}

/**
 * Extracts Bryant methods from block data
 */
function extractBryantMethods(block) {
    const methods = {};

    if (block.exercises) {
        methods.hasPHA = block.exercises.some(ex => ex.type === 'pha_circuit');
        methods.hasClusters = block.exercises.some(ex => ex.setStructure === 'cluster');
        methods.hasStrongman = block.exercises.some(ex => ex.category === 'strongman');
    }

    return methods;
}

/**
 * Checks if legacy data contains Bryant features
 */
function checkBryantFeatures(data) {
    return !!(
        data.model?.features?.includes('phaCircuits') ||
        data.model?.features?.includes('clusterSets') ||
        data.model?.features?.includes('strongmanEvents') ||
        data.goals?.bryantMethods
    );
}

/**
 * Analyzes Bryant Periodization compliance
 */
function analyzeBryantCompliance(results) {
    if (!results) return null;

    const analysis = {
        durationCompliant: true,
        methodsIntegrated: [],
        recommendations: []
    };

    // Check duration caps
    if (results.program?.duration > BRYANT_CONSTANTS.PHA_MAX_DURATION) {
        analysis.durationCompliant = false;
        analysis.recommendations.push('Consider breaking into shorter phases per Bryant methodology');
    }

    // Check method integration
    if (results.program?.exercises) {
        results.program.exercises.forEach(exercise => {
            if (exercise.type === 'pha_circuit') analysis.methodsIntegrated.push('PHA Circuits');
            if (exercise.setStructure === 'cluster') analysis.methodsIntegrated.push('Cluster Sets');
            if (exercise.category === 'strongman') analysis.methodsIntegrated.push('Strongman Events');
        });
    }

    return analysis;
}

/**
 * Validates Bryant Periodization integration requirements
 * @param {Object} programData - Current program data
 * @returns {Object} - Validation results with recommendations
 */
export function validateBryantIntegration(programData) {
    const validation = {
        isValid: true,
        errors: [],
        warnings: [],
        recommendations: []
    };

    // Check duration caps
    if (programData.duration > BRYANT_CONSTANTS.PHA_MAX_DURATION) {
        validation.warnings.push(`Duration ${programData.duration} weeks exceeds Bryant PHA limit of ${BRYANT_CONSTANTS.PHA_MAX_DURATION} weeks`);
        validation.recommendations.push('Consider phase subdivision per Bryant methodology');
    }

    // Check method compatibility
    if (programData.bryantFeatures) {
        if (programData.bryantFeatures.includes('phaCircuits') && !programData.bryantFeatures.includes('clusterSets')) {
            validation.recommendations.push('Consider adding cluster sets to complement PHA circuits');
        }

        if (programData.bryantFeatures.includes('strongmanEvents') && programData.trainingDays < 3) {
            validation.warnings.push('Strongman events typically require 3+ training days per week');
        }
    }

    // Check tactical application requirements
    if (programData.bryantFeatures?.includes('tacticalApplication')) {
        if (!programData.bryantFeatures.includes('strongmanEvents')) {
            validation.recommendations.push('Tactical applications benefit from strongman event integration');
        }
    }

    return validation;
}

/**
 * Generates migration report for legacy data
 * @param {Object} migrationResult - Result of migration process
 * @returns {Object} - Detailed migration report
 */
export function generateMigrationReport(migrationResult) {
    return {
        success: !!migrationResult,
        timestamp: new Date().toISOString(),
        sourceFramework: '7-step methodology',
        targetFramework: '5-component framework',
        bryantIntegrated: migrationResult?.metadata?.bryantIntegrated || false,
        featuresPreserved: migrationResult ? Object.keys(migrationResult).length : 0,
        recommendations: migrationResult?.metadata?.bryantIntegrated ? [
            'Review Bryant duration caps',
            'Validate method integration',
            'Test tactical applications'
        ] : []
    };
}

export default {
    migrateLegacyProgramData,
    validateBryantIntegration,
    generateMigrationReport,
    BRYANT_CONSTANTS,
    BRYANT_HYBRID_MODEL
};
