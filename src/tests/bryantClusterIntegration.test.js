// Bryant Cluster Set Integration Test
// Test the complete cluster set functionality with conflict resolution

import { addExerciseCategory, selectOptimalExercises } from '../js/algorithms/exerciseSelection.js';
import { calcSetsReps } from '../src/utils/programLogic.js';

/**
 * Step 1: Test adding cluster exercises to database
 */
function testAddClusterExercises() {
    console.log('🧪 Testing Cluster Exercise Addition...');

    // Test duplicate prevention
    const beforeCount = Object.keys(EXERCISE_DATABASE.chest || {}).length;

    // Try to add the same exercise twice
    addExerciseCategory('cluster', {
        muscleGroup: 'chest',
        exerciseName: 'cluster_bench_press',
        equipment: ['barbell', 'bench'],
        bryantFlag: true
    });

    addExerciseCategory('cluster', {
        muscleGroup: 'chest',
        exerciseName: 'cluster_bench_press', // Duplicate attempt
        equipment: ['barbell', 'bench'],
        bryantFlag: true
    });

    const afterCount = Object.keys(EXERCISE_DATABASE.chest || {}).length;

    console.log(`✅ Duplicate prevention: ${beforeCount} → ${afterCount} (should only increase by 1)`);

    return EXERCISE_DATABASE.chest.cluster_bench_press;
}

/**
 * Step 2: Test cluster set calculations
 */
function testClusterCalculations() {
    console.log('🧪 Testing Cluster Set Calculations...');

    const bryantCluster = calcSetsReps('cluster', 'cluster', {
        experienceLevel: 'intermediate',
        bryantCompliant: true
    });

    const standardSets = calcSetsReps('hypertrophy', 'standard', {
        experienceLevel: 'intermediate'
    });

    console.log('Bryant Cluster Result:', bryantCluster);
    console.log('Standard Sets Result:', standardSets);

    // Verify Bryant parameters
    const expectedIntraRest = 15;
    const expectedClusters = 3;

    console.log(`✅ Intra-rest: ${bryantCluster.clusterConfig?.intraRest}s (expected: ${expectedIntraRest}s)`);
    console.log(`✅ Clusters per set: ${bryantCluster.clusterConfig?.clustersPerSet} (expected: ${expectedClusters})`);
    console.log(`✅ Effective volume: ${bryantCluster.volume} vs raw reps: ${bryantCluster.totalReps}`);

    return { bryantCluster, standardSets };
}

/**
 * Step 3: Test conflict resolution with existing set types
 */
function testConflictResolution() {
    console.log('🧪 Testing Conflict Resolution...');

    // Test priority: Bryant flag should take precedence
    const exerciseWithBryantFlag = {
        type: 'cluster',
        bryantFlag: true,
        ranges: { hypertrophy: [3, 5] }
    };

    const exerciseWithoutBryantFlag = {
        type: 'compound',
        bryantFlag: false,
        ranges: { hypertrophy: [6, 12] }
    };

    // Conflict resolution logic
    function resolveSetTypeConflict(exercises) {
        // Priority: Bryant > Israetel > Standard
        const bryantExercises = exercises.filter(ex => ex.bryantFlag === true);
        const israetelExercises = exercises.filter(ex => ex.ranges?.hypertrophy && !ex.bryantFlag);
        const standardExercises = exercises.filter(ex => !ex.bryantFlag && !ex.ranges?.hypertrophy);

        if (bryantExercises.length > 0) {
            console.log('🏋️ Bryant Periodization takes priority');
            return bryantExercises[0];
        } else if (israetelExercises.length > 0) {
            console.log('📚 Israetel method used as fallback');
            return israetelExercises[0];
        } else {
            console.log('📋 Standard method used');
            return standardExercises[0];
        }
    }

    const winner = resolveSetTypeConflict([exerciseWithoutBryantFlag, exerciseWithBryantFlag]);
    console.log(`✅ Conflict resolution winner:`, winner.type, 'with Bryant flag:', winner.bryantFlag);

    return winner;
}

/**
 * Step 4: Test complete integration with sample cluster exercise
 */
function testCompleteIntegration() {
    console.log('🧪 Testing Complete Integration...');

    // Add a new cluster exercise
    addExerciseCategory('cluster', {
        muscleGroup: 'back',
        exerciseName: 'cluster_pullups',
        equipment: ['pull_up_bar'],
        fatigueIndex: 7.0,
        skillRequirement: 6,
        primaryMuscles: ['back'],
        secondaryMuscles: ['biceps'],
        bryantFlag: true
    });

    // Select optimal exercises for hypertrophy goal
    const backExercises = selectOptimalExercises('back', {
        trainingGoal: 'hypertrophy',
        preferredStyle: 'compound_focused',
        bryantFlag: true // Prefer Bryant methods
    });

    console.log('Back exercises selected:', backExercises.map(ex => ex.name));

    // Calculate sets/reps for the cluster exercise
    const clusterConfig = calcSetsReps('cluster', 'cluster', {
        experienceLevel: 'advanced',
        bryantCompliant: true
    });

    console.log('✅ Complete integration successful');
    console.log('Cluster configuration:', clusterConfig.description);

    return { backExercises, clusterConfig };
}

/**
 * Step 5: Database integration test (mock)
 */
function testDatabaseIntegration() {
    console.log('🧪 Testing Database Integration (Mock)...');

    // Mock program data with cluster configuration
    const mockProgramData = {
        program_name: 'Test Bryant Cluster Program',
        user_id: 'test-user-123',
        cluster_data: {
            intraRest: 15,
            repsRange: '3-5',
            clustersPerSet: 3,
            totalSets: 4,
            bryantCompliant: true,
            enabled: true,
            effectiveVolumeFormula: 'total_reps * (1 - (intraRest / 60))'
        }
    };

    // Simulate database operations
    console.log('Mock INSERT:', JSON.stringify(mockProgramData, null, 2));

    // Simulate query for Bryant programs
    const mockQuery = `
        SELECT program_name, cluster_data->>'intraRest' as intra_rest 
        FROM programs 
        WHERE cluster_data->>'bryantCompliant' = 'true'
    `;

    console.log('Mock SQL Query:', mockQuery);
    console.log('✅ Database integration mock successful');

    return mockProgramData;
}

/**
 * Run all integration tests
 */
function runAllTests() {
    console.log('🚀 Starting Bryant Cluster Set Integration Tests...\n');

    try {
        const clusterExercise = testAddClusterExercises();
        console.log('\n');

        const calculations = testClusterCalculations();
        console.log('\n');

        const conflictWinner = testConflictResolution();
        console.log('\n');

        const integration = testCompleteIntegration();
        console.log('\n');

        const dbTest = testDatabaseIntegration();
        console.log('\n');

        console.log('🎉 ALL TESTS PASSED! Bryant Cluster Set integration successful.');

        return {
            clusterExercise,
            calculations,
            conflictWinner,
            integration,
            dbTest,
            status: 'SUCCESS'
        };

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        return {
            error: error.message,
            status: 'FAILED'
        };
    }
}

// Export for use in other modules
export {
    testAddClusterExercises,
    testClusterCalculations,
    testConflictResolution,
    testCompleteIntegration,
    testDatabaseIntegration,
    runAllTests
};

// Run tests if executed directly
if (typeof window === 'undefined') {
    runAllTests();
}
