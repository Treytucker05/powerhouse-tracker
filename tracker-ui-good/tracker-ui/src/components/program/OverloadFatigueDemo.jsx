import React from 'react';
import { useAssessment } from '../hooks/useAssessment';

const OverloadFatigueDemo = () => {
    const {
        assessOverload,
        assessFatigue,
        calculateMRVByPhase,
        determineFatigueState
    } = useAssessment();

    // Demo: Overload Assessment Test
    const testOverloadAssessment = () => {
        const overloadData = {
            volume: { sets: 18, reps: 8 },
            intensity: 80,
            frequency: 4,
            exerciseSelection: { specific: 85, nonSpecific: 15 },
            failureProximity: 2, // 2 RIR
            baseline: { oneRM: 300 }
        };

        const gainerType = { type: 'Fast Gainer' };
        const currentPhase = 'hypertrophy';

        const result = assessOverload(overloadData, gainerType, currentPhase);

        console.log('=== OVERLOAD ASSESSMENT DEMO ===');
        console.log('Input:', overloadData);
        console.log('Gainer Type:', gainerType.type);
        console.log('Phase:', currentPhase);
        console.log('\nResults:');
        console.log('MRV by Phase:', result.mrvByPhase);
        console.log('Disruption Level:', result.disruptionLevel);
        console.log('Current Load:', result.currentLoad);
        console.log('Optimizations:', result.optimizations);

        return result;
    };

    // Demo: Fatigue Assessment Test
    const testFatigueAssessment = () => {
        const fatigueData = {
            fuel: {
                glycogenStores: 4,
                muscleFullness: 5,
                energyLevels: 6,
                postWorkoutFatigue: 7
            },
            nervous: {
                forceOutput: 6,
                techniqueQuality: 7,
                motivation: 5,
                learningRate: 6,
                sleepQuality: 5
            },
            messengers: {
                moodSwings: 6,
                inflammation: 7,
                hormoneSymptoms: 5,
                recoveryRate: 4,
                soreness: 8
            },
            tissues: {
                jointPain: 3,
                muscleTightness: 6,
                tendonIssues: 2,
                overuseSymptoms: 4,
                injuryHistory: 1
            }
        };

        const trainingLoad = {
            weeklyLoad: 900,
            relativeIntensity: 'High',
            sessionsPerWeek: 4
        };

        const lifestyle = {
            sleep: 6,
            stress: 7,
            nutrition: 7,
            hydration: 8
        };

        const result = assessFatigue(fatigueData, trainingLoad, lifestyle);

        console.log('\n=== FATIGUE ASSESSMENT DEMO ===');
        console.log('Input:', fatigueData);
        console.log('Training Load:', trainingLoad);
        console.log('Lifestyle:', lifestyle);
        console.log('\nResults:');
        console.log('Contributors:', result.contributors);
        console.log('Overall State:', result.overallState);
        console.log('Management Strategies:', result.managementStrategies);
        console.log('Recovery Timeline:', result.recoveryTimeline);

        return result;
    };

    // Demo: MRV Calculation Test
    const testMRVCalculation = () => {
        const gainerTypes = ['Very Fast Gainer', 'Fast Gainer', 'Slow Gainer', 'Very Slow Gainer'];
        const phases = ['hypertrophy', 'strength', 'peaking', 'activeRecovery'];

        console.log('\n=== MRV CALCULATION DEMO ===');

        gainerTypes.forEach(gainerType => {
            console.log(`\n${gainerType}:`);
            const mrvData = calculateMRVByPhase({ type: gainerType }, 'hypertrophy');
            phases.forEach(phase => {
                if (mrvData[phase]) {
                    console.log(`  ${phase}: ${mrvData[phase].sets} sets (${mrvData[phase].repsRange} reps @ ${mrvData[phase].intensityRange})`);
                }
            });
        });
    };

    // Demo: Integration Example
    const testIntegration = () => {
        console.log('\n=== INTEGRATION EXAMPLE ===');
        console.log('Scenario: Advanced athlete showing signs of overreaching');

        // Step 1: Assess current overload
        const overloadResult = testOverloadAssessment();

        // Step 2: Assess fatigue state
        const fatigueResult = testFatigueAssessment();

        // Step 3: Generate recommendations
        console.log('\n--- INTEGRATED RECOMMENDATIONS ---');

        if (fatigueResult.overallState.state === 'non_functional_overreaching') {
            console.log('🚨 IMMEDIATE ACTION REQUIRED:');
            console.log('- Reduce volume by 50% immediately');
            console.log('- Implement light sessions protocol');
            console.log('- Focus on sleep and stress management');
        }

        if (overloadResult.disruptionLevel.level === 'excessive') {
            console.log('⚠️ OVERLOAD WARNING:');
            console.log('- Current training exceeds recovery capacity');
            console.log('- Consider deload week');
            console.log('- Optimize exercise selection for specificity');
        }

        // Step 4: Suggest phase progression
        console.log('\n--- PHASE PROGRESSION SUGGESTIONS ---');
        console.log('Current phase: Hypertrophy');
        console.log('Recommended next phase: Active Recovery');
        console.log('Timeline: 1 week deload, then return to strength phase');
    };

    return (
        <div className="space-y-6 p-6 bg-gray-900 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Overload & Fatigue Assessment Demo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={testOverloadAssessment}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                    Test Overload Assessment
                </button>

                <button
                    onClick={testFatigueAssessment}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                    Test Fatigue Assessment
                </button>

                <button
                    onClick={testMRVCalculation}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                >
                    Test MRV Calculation
                </button>

                <button
                    onClick={testIntegration}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                    Test Full Integration
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Demo Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                    <li>Click each button to run the corresponding test</li>
                    <li>Open browser console (F12) to see detailed output</li>
                    <li>Tests demonstrate the integration of Scientific Principles concepts</li>
                    <li>Use these examples to understand the assessment algorithms</li>
                </ol>
            </div>

            <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Key Features Demonstrated:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-200">
                    <li><strong>Overload Assessment:</strong> MRV calculation, homeostatic disruption, variable optimization</li>
                    <li><strong>Fatigue Monitoring:</strong> 4-category assessment (fuel, nervous, messengers, tissues)</li>
                    <li><strong>State Detection:</strong> Normal, functional overreaching, non-functional overreaching, overtraining</li>
                    <li><strong>Recovery Strategies:</strong> Light sessions, deloads, active rest protocols</li>
                    <li><strong>Gainer Type Integration:</strong> MRV adjustments based on Bryant classification</li>
                </ul>
            </div>
        </div>
    );
};

export default OverloadFatigueDemo;
