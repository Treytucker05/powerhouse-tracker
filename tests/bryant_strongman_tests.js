// Bryant Strongman Implementation Test Suite
// Tests strongman calculations, hybrid phase integration, and tactical applications

import { calcSetsReps } from '../src/utils/programLogic.js';
import { addExerciseCategory } from '../src/utils/exerciseSelection.js';

// ===========================================
// 1. STRONGMAN CALCULATION TESTS
// ===========================================

describe('Bryant Strongman Calculations', () => {

    test('Distance-based strongman volume calculation', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'strength',
            microcycleWeek: 1,
            targetIntensity: 85,
            strongmanConfig: {
                distance: 150,
                rest: 90,
                loadFactor: 1.3,
                timeBased: false
            }
        });

        // Expected: distance 150ft / 5 = 30 estimated reps
        expect(result.estimatedReps).toBe(30);
        expect(result.volume).toBe(30 * 1.3 * 3); // reps * load_factor * events
        expect(result.volume).toBe(117);
        expect(result.bryantCompliant).toBe(true);
    });

    test('Time-based strongman volume calculation', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'power',
            microcycleWeek: 2,
            targetIntensity: 90,
            strongmanConfig: {
                duration: 60,
                rest: 120,
                loadFactor: 1.5,
                timeBased: true
            }
        });

        // Expected: duration 60s / 2 = 30 estimated reps
        expect(result.estimatedReps).toBe(30);
        expect(result.volume).toBe(30 * 1.5 * 2); // reps * load_factor * events
        expect(result.volume).toBe(90);
        expect(result.workToRestRatio).toBe('1:2'); // 60s work : 120s rest
    });

    test('Tactical strongman conversion to rep equivalents', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'tactical',
            microcycleWeek: 3,
            targetIntensity: 80,
            strongmanConfig: {
                distance: 200,
                rest: 90,
                loadFactor: 1.4,
                timeBased: false,
                tacticalApplication: true
            }
        });

        expect(result.estimatedReps).toBe(40); // 200ft / 5
        expect(result.repEquivalent).toBe(56); // 40 * 1.4 rep equivalent
        expect(result.tacticalRange).toBe('Endurance Range'); // 40 reps = endurance
        expect(result.bryantCompliant).toBe(true);
    });

});

// ===========================================
// 2. EXERCISE SELECTION TESTS
// ===========================================

describe('Strongman Exercise Categories', () => {

    test('Add farmers walk exercise with strongman config', () => {
        const exercise = addExerciseCategory('farmers_walk', 'strongman');

        expect(exercise.category).toBe('strongman');
        expect(exercise.strongmanConfig).toBeDefined();
        expect(exercise.strongmanConfig.distance).toBe(150);
        expect(exercise.strongmanConfig.duration).toBe(30);
        expect(exercise.strongmanConfig.rest).toBe(90);
        expect(exercise.muscleGroups).toContain('full_body');
        expect(exercise.equipment).toContain('farmers_handles');
    });

    test('Add tire flip exercise with power metrics', () => {
        const exercise = addExerciseCategory('tire_flip', 'strongman');

        expect(exercise.strongmanConfig.distance).toBe(100);
        expect(exercise.strongmanConfig.loadFactor).toBe(1.5);
        expect(exercise.powerRating).toBe('explosive');
        expect(exercise.bryantCompliant).toBe(true);
    });

    test('Add atlas stones with tactical application', () => {
        const exercise = addExerciseCategory('atlas_stones', 'strongman');

        expect(exercise.strongmanConfig.distance).toBe(50);
        expect(exercise.strongmanConfig.loadFactor).toBe(1.8);
        expect(exercise.tacticalApplication).toBe(true);
        expect(exercise.equipment).toContain('atlas_stones');
    });

});

// ===========================================
// 3. HYBRID PHASE INTEGRATION TESTS
// ===========================================

describe('Hybrid Phase Integration', () => {

    test('Weeks 1-4 strongman phase calculations', () => {
        const result = calcSetsReps({
            exerciseType: 'hybrid',
            phase: 'strongman_phase',
            microcycleWeek: 2, // Week 2 of 8-week cycle
            targetIntensity: 85,
            strongmanConfig: {
                distance: 150,
                rest: 90,
                loadFactor: 1.3,
                phaseWeeks: '1-4'
            }
        });

        expect(result.currentPhase).toBe('Strongman Phase (60%)');
        expect(result.phaseEmphasis).toBe('power_output');
        expect(result.estimatedReps).toBe(30);
        expect(result.volume).toBe(117); // 30 * 1.3 * 3
    });

    test('Weeks 5-8 tempo phase calculations', () => {
        const result = calcSetsReps({
            exerciseType: 'hybrid',
            phase: 'tempo_phase',
            microcycleWeek: 6, // Week 6 of 8-week cycle
            targetIntensity: 70,
            clusterConfig: {
                intraRest: 15,
                clustersPerSet: 3,
                bryantCompliant: true,
                phaseWeeks: '5-8'
            }
        });

        expect(result.currentPhase).toBe('Tempo Phase (40%)');
        expect(result.phaseEmphasis).toBe('time_under_tension');
        expect(result.sets).toBe(3);
        expect(result.reps).toBe(5);
        expect(result.intraRest).toBe(15);
    });

    test('Phase transition conflict resolution', () => {
        const result = calcSetsReps({
            exerciseType: 'hybrid',
            phase: 'transition',
            microcycleWeek: 4, // End of strongman phase
            targetIntensity: 80,
            strongmanConfig: {
                distance: 150,
                loadFactor: 1.3
            },
            clusterConfig: {
                intraRest: 15,
                clustersPerSet: 3
            }
        });

        // Should prioritize strongman in weeks 1-4
        expect(result.primaryMethod).toBe('strongman');
        expect(result.secondaryMethod).toBe('cluster');
        expect(result.conversionFormula).toBe('estimated_reps * load_factor');
        expect(result.repEquivalent).toBe(39); // 30 * 1.3
    });

});

// ===========================================
// 4. BRYANT COMPLIANCE TESTS
// ===========================================

describe('Bryant Compliance Validation', () => {

    test('Bryant strongman compliance check', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'strength',
            microcycleWeek: 1,
            targetIntensity: 85,
            strongmanConfig: {
                distance: 150,
                rest: 90,
                loadFactor: 1.3,
                bryantCompliant: true
            }
        });

        expect(result.bryantCompliant).toBe(true);
        expect(result.complianceCheck.restPeriods).toBe('adequate'); // 90s rest
        expect(result.complianceCheck.loadProgression).toBe('valid');
        expect(result.complianceCheck.volumeCalculation).toBe('correct');
    });

    test('Non-Bryant strongman method', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'strength',
            microcycleWeek: 1,
            targetIntensity: 85,
            strongmanConfig: {
                distance: 150,
                rest: 60, // Too short for Bryant compliance
                loadFactor: 1.3,
                bryantCompliant: false
            }
        });

        expect(result.bryantCompliant).toBe(false);
        expect(result.complianceCheck.restPeriods).toBe('insufficient');
        expect(result.warnings).toContain('Rest periods below Bryant minimum');
    });

});

// ===========================================
// 5. TACTICAL APPLICATION TESTS
// ===========================================

describe('Tactical Applications', () => {

    test('Tactical strongman program design', () => {
        const result = calcSetsReps({
            exerciseType: 'strongman',
            phase: 'tactical',
            microcycleWeek: 1,
            targetIntensity: 80,
            strongmanConfig: {
                distance: 200,
                rest: 120,
                loadFactor: 1.4,
                tacticalApplication: true
            }
        });

        expect(result.tacticalApplication).toBe(true);
        expect(result.estimatedReps).toBe(40); // 200ft / 5
        expect(result.tacticalRange).toBe('Endurance Range'); // 40 reps
        expect(result.applicationNotes).toContain('tactical conditioning');
    });

    test('Tactical equipment requirements', () => {
        const farmersWalk = addExerciseCategory('farmers_walk', 'strongman');
        const tireFlip = addExerciseCategory('tire_flip', 'strongman');

        expect(farmersWalk.tacticalApplication).toBe(true);
        expect(farmersWalk.equipment).toContain('farmers_handles');
        expect(tireFlip.tacticalApplication).toBe(true);
        expect(tireFlip.equipment).toContain('tire');
    });

});

// ===========================================
// 6. INTEGRATION TEST SCENARIOS
// ===========================================

describe('Integration Test Scenarios', () => {

    test('Complete strongman workout calculation', () => {
        const exercises = [
            { name: 'farmers_walk', distance: 150, events: 3 },
            { name: 'tire_flip', distance: 100, events: 2 },
            { name: 'atlas_stones', distance: 50, events: 4 }
        ];

        let totalVolume = 0;
        let totalRepEquivalent = 0;

        exercises.forEach(exercise => {
            const result = calcSetsReps({
                exerciseType: 'strongman',
                phase: 'tactical',
                microcycleWeek: 1,
                targetIntensity: 80,
                strongmanConfig: {
                    distance: exercise.distance,
                    rest: 90,
                    loadFactor: 1.3,
                    tacticalApplication: true
                }
            });

            totalVolume += result.volume;
            totalRepEquivalent += result.repEquivalent;
        });

        expect(totalVolume).toBeGreaterThan(200); // Combined workout volume
        expect(totalRepEquivalent).toBeGreaterThan(100); // Combined rep equivalent
    });

    test('8-week hybrid program progression', () => {
        const weeks = Array.from({ length: 8 }, (_, i) => i + 1);

        weeks.forEach(week => {
            const result = calcSetsReps({
                exerciseType: 'hybrid',
                phase: week <= 4 ? 'strongman_phase' : 'tempo_phase',
                microcycleWeek: week,
                targetIntensity: 80,
                strongmanConfig: week <= 4 ? {
                    distance: 150,
                    rest: 90,
                    loadFactor: 1.3
                } : null,
                clusterConfig: week > 4 ? {
                    intraRest: 15,
                    clustersPerSet: 3,
                    bryantCompliant: true
                } : null
            });

            if (week <= 4) {
                expect(result.currentPhase).toBe('Strongman Phase (60%)');
                expect(result.estimatedReps).toBe(30);
            } else {
                expect(result.currentPhase).toBe('Tempo Phase (40%)');
                expect(result.intraRest).toBe(15);
            }
        });
    });

});

// ===========================================
// 7. ERROR HANDLING TESTS
// ===========================================

describe('Error Handling', () => {

    test('Invalid strongman configuration', () => {
        expect(() => {
            calcSetsReps({
                exerciseType: 'strongman',
                phase: 'strength',
                strongmanConfig: {
                    distance: -50, // Invalid negative distance
                    rest: 30 // Invalid short rest
                }
            });
        }).toThrow('Invalid strongman configuration');
    });

    test('Missing strongman config for strongman exercise type', () => {
        expect(() => {
            calcSetsReps({
                exerciseType: 'strongman',
                phase: 'strength'
                // Missing strongmanConfig
            });
        }).toThrow('Strongman configuration required');
    });

});

console.log('🏋️ Bryant Strongman Implementation Test Suite Complete');
console.log('✅ Expected Results:');
console.log('- Distance-based: 150ft = 30 estimated reps, volume = 117');
console.log('- Time-based: 60s = 30 estimated reps, volume = 90');
console.log('- Tactical: 200ft = 40 reps = Endurance Range');
console.log('- Hybrid: Weeks 1-4 strongman, 5-8 tempo');
console.log('- Bryant compliance: 90s+ rest, proper load factors');
