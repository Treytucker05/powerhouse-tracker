/**
 * PHA Health Screening Test Suite
 * Tests Bryant Periodization PHA eligibility assessment
 */

import { useAssessment } from '../hooks/useAssessment';

// Test function to simulate PHA health screening flow
export const testPHAHealthScreening = () => {
    console.log('=== PHA Health Screening Test Suite ===');

    const { assessPHAHealth, integratePHAWithFatigue } = useAssessment();

    // Test Case 1: Contraindicated (High BP + Poor Fitness)
    console.log('\n--- Test Case 1: Contraindicated User ---');
    const contraindicatedData = {
        highBP: true,
        cardiacHistory: false,
        fitness: 'poor'
    };

    const contraindicatedResult = assessPHAHealth(contraindicatedData);
    console.log('Input:', contraindicatedData);
    console.log('Result:', {
        eligibilityStatus: contraindicatedResult.eligibilityStatus,
        eligibilityScore: contraindicatedResult.eligibilityScore,
        contraindications: contraindicatedResult.contraindications.length,
        recommendations: contraindicatedResult.recommendations.length
    });

    // Expected: eligibilityStatus = 'contraindicated', score <= 0
    const test1Pass = contraindicatedResult.eligibilityStatus === 'contraindicated' &&
        contraindicatedResult.eligibilityScore <= 0;
    console.log('✅ Test 1 Pass:', test1Pass);

    // Test Case 2: Eligible User
    console.log('\n--- Test Case 2: Eligible User ---');
    const eligibleData = {
        highBP: false,
        cardiacHistory: false,
        fitness: 'good'
    };

    const eligibleResult = assessPHAHealth(eligibleData);
    console.log('Input:', eligibleData);
    console.log('Result:', {
        eligibilityStatus: eligibleResult.eligibilityStatus,
        eligibilityScore: eligibleResult.eligibilityScore,
        contraindications: eligibleResult.contraindications.length,
        bryantGuidelines: eligibleResult.bryantGuidelines
    });

    // Expected: eligibilityStatus = 'eligible', score > 7
    const test2Pass = eligibleResult.eligibilityStatus === 'eligible' &&
        eligibleResult.eligibilityScore > 7;
    console.log('✅ Test 2 Pass:', test2Pass);

    // Test Case 3: Limited User (Only Poor Fitness)
    console.log('\n--- Test Case 3: Limited User ---');
    const limitedData = {
        highBP: false,
        cardiacHistory: false,
        fitness: 'poor'
    };

    const limitedResult = assessPHAHealth(limitedData);
    console.log('Input:', limitedData);
    console.log('Result:', {
        eligibilityStatus: limitedResult.eligibilityStatus,
        eligibilityScore: limitedResult.eligibilityScore,
        programModifications: limitedResult.programModifications.length
    });

    // Expected: eligibilityStatus = 'limited', score 4-7
    const test3Pass = limitedResult.eligibilityStatus === 'limited' &&
        limitedResult.eligibilityScore >= 4 &&
        limitedResult.eligibilityScore <= 7;
    console.log('✅ Test 3 Pass:', test3Pass);

    // Test Case 4: Fatigue Integration
    console.log('\n--- Test Case 4: Fatigue Integration ---');
    const mockFatigueData = {
        recommendations: ['Get more sleep', 'Reduce training volume'],
        overallState: 'normal'
    };

    const contraindicatedFatigue = integratePHAWithFatigue(mockFatigueData, contraindicatedResult);
    console.log('Contraindicated Integration:', {
        phaEligible: contraindicatedFatigue.phaEligible,
        modifiedRecommendations: contraindicatedFatigue.modifiedRecommendations?.length
    });

    const eligibleFatigue = integratePHAWithFatigue(mockFatigueData, eligibleResult);
    console.log('Eligible Integration:', {
        phaEligible: eligibleFatigue.phaEligible,
        phaSpecificMonitoring: eligibleFatigue.phaSpecificMonitoring?.length
    });

    // Expected: contraindicated = phaEligible false, eligible = phaEligible true
    const test4Pass = contraindicatedFatigue.phaEligible === false &&
        eligibleFatigue.phaEligible === true;
    console.log('✅ Test 4 Pass:', test4Pass);

    // Summary
    console.log('\n=== Test Summary ===');
    const allTestsPass = test1Pass && test2Pass && test3Pass && test4Pass;
    console.log('🎯 All Tests Pass:', allTestsPass);

    return {
        test1Pass,
        test2Pass,
        test3Pass,
        test4Pass,
        allTestsPass,
        results: {
            contraindicated: contraindicatedResult,
            eligible: eligibleResult,
            limited: limitedResult
        }
    };
};

// Test function for PHAHealthStep component inputs
export const testPHAHealthStepInputs = (assessmentData, onInputChange) => {
    console.log('=== PHAHealthStep Component Test ===');

    // Simulate user inputs
    const testInputs = [
        { field: 'highBP', value: true },
        { field: 'fitness', value: 'poor' },
        { field: 'cardiacHistory', value: false }
    ];

    testInputs.forEach(({ field, value }) => {
        console.log(`Testing input: ${field} = ${value}`);

        // Simulate component's handleInputChange function
        const updatedData = {
            ...assessmentData,
            phaHealthScreen: {
                ...assessmentData.phaHealthScreen,
                [field]: value
            }
        };

        console.log('Updated assessment data:', updatedData.phaHealthScreen);

        // Call the parent's onInputChange (would update StepWizard state)
        onInputChange(updatedData);

        // Check contraindication status
        const isContraindicated = updatedData.phaHealthScreen.highBP ||
            updatedData.phaHealthScreen.fitness === 'poor';
        console.log('Is Contraindicated:', isContraindicated);
        console.log('---');
    });

    return assessmentData;
};

// Debug function for useAssessment PHA integration
export const debugPHAIntegration = () => {
    console.log('=== PHA Integration Debug ===');

    const { assessPHAHealth } = useAssessment();

    // Test all fitness levels
    const fitnessLevels = ['poor', 'moderate', 'good'];
    const bpStatuses = [true, false];
    const cardiacStatuses = [true, false];

    fitnessLevels.forEach(fitness => {
        bpStatuses.forEach(highBP => {
            cardiacStatuses.forEach(cardiacHistory => {
                const testData = { highBP, cardiacHistory, fitness };
                const result = assessPHAHealth(testData);

                console.log(`BP:${highBP}, Cardiac:${cardiacHistory}, Fitness:${fitness} => Status:${result.eligibilityStatus}, Score:${result.eligibilityScore}`);
            });
        });
    });
};

// Mock function to add to EnhancedGoalsAndNeeds.jsx for testing
export const addPHATestFunction = () => {
    // Add this to EnhancedGoalsAndNeeds.jsx around line 80-100
    const testPHAFlow = () => {
        console.log('Testing PHA flow in EnhancedGoalsAndNeeds...');

        // Mock assessment data with PHA screening
        const mockAssessmentData = {
            primaryGoal: 'Athletic Performance',
            trainingExperience: 'Intermediate 1-3 years',
            timeline: '12-16 weeks',
            phaHealthScreen: {
                highBP: true,
                cardiacHistory: false,
                fitness: 'poor'
            }
        };

        // Test PHA assessment
        const { assessPHAHealth } = useAssessment();
        const phaResult = assessPHAHealth(mockAssessmentData.phaHealthScreen);

        console.log('PHA Assessment Result:', {
            status: phaResult.eligibilityStatus,
            score: phaResult.eligibilityScore,
            canUsePHA: phaResult.eligibilityStatus === 'eligible'
        });

        // Mock program adjustment based on PHA result
        if (phaResult.eligibilityStatus === 'contraindicated') {
            console.log('🚫 PHA circuits excluded from program');
            console.log('📝 Recommended alternatives:', phaResult.recommendations);
        } else {
            console.log('✅ PHA circuits can be included');
            console.log('⚙️ Bryant guidelines applied:', phaResult.bryantGuidelines);
        }

        return phaResult;
    };

    // Call this function from a button or useEffect for testing
    return testPHAFlow;
};

export default {
    testPHAHealthScreening,
    testPHAHealthStepInputs,
    debugPHAIntegration,
    addPHATestFunction
};
