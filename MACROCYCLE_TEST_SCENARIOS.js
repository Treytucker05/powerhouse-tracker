// Macrocycle Testing Scenarios
// Test data sets for validating RP research compliance and workflow functionality

export const TEST_SCENARIOS = {
    // Entry Point 1: Navigation from Program Design
    entryPoint1_Beginner: {
        programData: {
            goal: 'hypertrophy',
            duration: 12,
            trainingAge: 'beginner',
            availableDays: 3,
            name: 'Beginner Hypertrophy Program',
            startDate: '2024-01-01',
            recoveryScore: 'poor'
        },
        expectedResults: {
            totalPhases: 3,
            maxPhaseDuration: 6,
            volumeMultiplier: 0.8, // Beginner gets 80% volume
            rirStartsAt: 4,
            deloadTriggers: ['Extended training period'],
            phaseTypes: ['accumulation', 'deload', 'maintenance']
        }
    },

    entryPoint1_Advanced: {
        programData: {
            goal: 'strength',
            duration: 16,
            trainingAge: 'advanced',
            availableDays: 5,
            name: 'Advanced Strength Program',
            startDate: '2024-01-01',
            recoveryScore: 'excellent'
        },
        expectedResults: {
            totalPhases: 4,
            maxPhaseDuration: 8,
            volumeMultiplier: 1.2, // Advanced gets 120% volume
            rirStartsAt: 4,
            deloadTriggers: [],
            phaseTypes: ['accumulation', 'intensification', 'realization', 'deload']
        }
    },

    entryPoint1_Intermediate: {
        programData: {
            goal: 'powerbuilding',
            duration: 20,
            trainingAge: 'intermediate',
            availableDays: 4,
            name: 'Intermediate Powerbuilding Program',
            startDate: '2024-01-01',
            recoveryScore: 'average'
        },
        expectedResults: {
            totalPhases: 5,
            maxPhaseDuration: 8,
            volumeMultiplier: 1.0, // Intermediate gets base volume
            rirStartsAt: 4,
            deloadTriggers: [],
            phaseTypes: ['accumulation', 'deload', 'intensification', 'deload', 'realization']
        }
    },

    // Entry Point 2: Direct navigation (no programData)
    entryPoint2_Default: {
        programData: null, // Will use defaults from component
        expectedDefaults: {
            goal: 'hypertrophy',
            duration: 12,
            trainingAge: 'intermediate',
            availableDays: 4,
            name: 'Custom Macrocycle',
            recoveryScore: 'average'
        }
    },

    // Template Switching Tests
    templateSwitching: {
        templates: [
            { key: 'hypertrophy_12', expectedPhases: 3, totalWeeks: 12 },
            { key: 'strength_16', expectedPhases: 4, totalWeeks: 16 },
            { key: 'powerbuilding_20', expectedPhases: 5, totalWeeks: 20 }
        ]
    },

    // Edge Cases for Validation Testing
    extremeCases: {
        maxVolume: {
            programData: {
                goal: 'hypertrophy',
                duration: 52,
                trainingAge: 'advanced',
                availableDays: 7,
                name: 'Extreme Volume Program',
                startDate: '2024-01-01',
                recoveryScore: 'excellent'
            },
            expectedWarnings: ['Duration exceeds typical macrocycle length']
        },

        minimalProgram: {
            programData: {
                goal: 'strength',
                duration: 8,
                trainingAge: 'beginner',
                availableDays: 2,
                name: 'Minimal Program',
                startDate: '2024-01-01',
                recoveryScore: 'poor'
            },
            expectedWarnings: ['Low training frequency', 'Short program duration']
        },

        recoveryOptimized: {
            programData: {
                goal: 'hypertrophy',
                duration: 16,
                trainingAge: 'advanced',
                availableDays: 4,
                name: 'Recovery Optimized',
                startDate: '2024-01-01',
                recoveryScore: 'poor'
            },
            expectedModifications: ['Extended deload phases', 'Reduced volume progression']
        }
    }
};

// RP Research Compliance Checks
export const RP_COMPLIANCE_TESTS = {
    volumeLandmarks2024: {
        chest: { mev: 6, mrv: 24, mav: 16 },
        back: { mev: 10, mrv: 25, mav: 18 },
        shoulders: { mev: 8, mrv: 24, mav: 16 },
        quads: { mev: 8, mrv: 20, mav: 18 }
    },

    rirProgressionRules: {
        startsAt: 4, // Must start at 4 RIR, not 4.5
        compoundModifier: 0.5, // +0.5 RIR for compound exercises
        maxWeeks: 6, // RIR schemes shouldn't exceed 6 weeks
        endAt: 0 // Should progress to 0 RIR by final week
    },

    phaseDurationConstraints: {
        accumulation: { min: 4, max: 12, optimal: 6 },
        intensification: { min: 3, max: 8, optimal: 5 },
        realization: { min: 1, max: 4, optimal: 2 },
        deload: { min: 1, max: 2, optimal: 1 }
    },

    deloadTriggers: {
        volumeThreshold: 0.95, // 95% of MRV
        fatigueScore: 8, // Out of 10
        performanceDrop: 10, // 10% drop
        weeksSinceDeload: 6, // 6 weeks maximum
        sleepQuality: 3, // Poor sleep (1-10 scale)
        motivationLevel: 3, // Low motivation
        jointPain: 7 // High joint pain
    }
};

// Test Execution Functions
export const executeTestScenario = (scenarioName, programData) => {
    console.group(`🧪 Testing Scenario: ${scenarioName}`);
    console.log('📊 Input Program Data:', programData);

    // This will be called from the component to validate results
    return {
        scenario: scenarioName,
        input: programData,
        timestamp: new Date().toISOString()
    };
};

export const validateRPCompliance = (mesocycles, expectedResults) => {
    const compliance = {
        volumeLandmarks: true,
        rirProgression: true,
        phaseDurations: true,
        deloadLogic: true,
        warnings: []
    };

    console.group('🔬 RP Research Compliance Check');

    // Check volume landmarks
    mesocycles.forEach((phase, index) => {
        if (phase.volumeLandmarks) {
            Object.entries(phase.volumeLandmarks).forEach(([muscle, landmarks]) => {
                const expected = RP_COMPLIANCE_TESTS.volumeLandmarks2024[muscle];
                if (expected) {
                    if (landmarks.mev < expected.mev * 0.7 || landmarks.mev > expected.mev * 1.3) {
                        compliance.volumeLandmarks = false;
                        compliance.warnings.push(`${muscle} MEV (${landmarks.mev}) outside expected range`);
                    }
                }
            });
        }
    });

    // Check RIR progression
    mesocycles.forEach((phase, index) => {
        if (phase.rirProgression && phase.rirProgression.length > 0) {
            const firstWeek = phase.rirProgression[0];
            if (firstWeek.targetRIR < 4) {
                compliance.rirProgression = false;
                compliance.warnings.push(`Phase ${index + 1} RIR starts below 4 (${firstWeek.targetRIR})`);
            }
        }
    });

    // Check phase durations
    mesocycles.forEach((phase, index) => {
        const constraints = RP_COMPLIANCE_TESTS.phaseDurationConstraints[phase.blockType];
        if (constraints) {
            if (phase.weeks < constraints.min || phase.weeks > constraints.max) {
                compliance.phaseDurations = false;
                compliance.warnings.push(`Phase ${index + 1} duration (${phase.weeks}w) outside RP constraints`);
            }
        }
    });

    console.log('✅ Compliance Results:', compliance);
    console.groupEnd();

    return compliance;
};

// Performance Testing
export const performanceTests = {
    generationTime: {
        threshold: 100, // milliseconds
        test: (startTime, endTime) => {
            const duration = endTime - startTime;
            return {
                passed: duration < performanceTests.generationTime.threshold,
                duration,
                threshold: performanceTests.generationTime.threshold
            };
        }
    },

    recalculationTime: {
        threshold: 50, // milliseconds for template switching
        test: (startTime, endTime) => {
            const duration = endTime - startTime;
            return {
                passed: duration < performanceTests.recalculationTime.threshold,
                duration,
                threshold: performanceTests.recalculationTime.threshold
            };
        }
    }
};

export default {
    TEST_SCENARIOS,
    RP_COMPLIANCE_TESTS,
    executeTestScenario,
    validateRPCompliance,
    performanceTests
};
