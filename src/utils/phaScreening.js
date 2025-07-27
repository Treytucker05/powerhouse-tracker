/**
 * PHA (Physical Health Assessment) Screening System
 * Comprehensive health assessment for program design safety
 * Based on ACSM guidelines and Bryant Periodization requirements
 */

import { useState, useEffect } from 'react';

/**
 * Physical Health Assessment (PHA) screening questionnaire
 * Determines if medical clearance is required before starting training program
 * @param {Object} responses - User responses to screening questions
 * @param {Object} options - Screening options and configurations
 * @returns {Object} - PHA screening result with recommendations
 */
export const performPHAScreening = async (responses = {}, options = {}) => {
    const {
        strictMode = true,
        includeBryantSpecific = true,
        generateRecommendations = true,
        saveResults = true
    } = options;

    console.log('🏥 Starting PHA Health Screening...');

    try {
        // 1. Validate input responses
        const validationResult = validatePHAResponses(responses);
        if (!validationResult.valid) {
            return {
                success: false,
                message: 'Invalid screening responses',
                errors: validationResult.errors,
                result: null
            };
        }

        // 2. Process cardiovascular risk factors
        const cardiovascularRisk = assessCardiovascularRisk(responses);

        // 3. Assess orthopedic/musculoskeletal concerns
        const orthopedicRisk = assessOrthopedicRisk(responses);

        // 4. Evaluate metabolic risk factors
        const metabolicRisk = assessMetabolicRisk(responses);

        // 5. Bryant-specific assessments (if enabled)
        let bryantAssessment = null;
        if (includeBryantSpecific) {
            bryantAssessment = assessBryantReadiness(responses);
        }

        // 6. Calculate overall risk level
        const overallRisk = calculateOverallRisk({
            cardiovascularRisk,
            orthopedicRisk,
            metabolicRisk,
            bryantAssessment,
            strictMode
        });

        // 7. Generate recommendations
        let recommendations = [];
        if (generateRecommendations) {
            recommendations = generatePHARecommendations({
                overallRisk,
                cardiovascularRisk,
                orthopedicRisk,
                metabolicRisk,
                bryantAssessment,
                responses
            });
        }

        // 8. Create comprehensive result
        const phaResult = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',

            // Risk assessments
            overallRisk,
            cardiovascularRisk,
            orthopedicRisk,
            metabolicRisk,
            bryantAssessment,

            // Clinical recommendations
            medicalClearanceRequired: overallRisk.level === 'high',
            exerciseTestingRequired: overallRisk.requiresTesting,
            supervisionRequired: overallRisk.requiresSupervision,

            // Training recommendations
            recommendations,
            trainingRestrictions: overallRisk.restrictions || [],
            modificationNeeded: overallRisk.level !== 'low',

            // Program compatibility
            programCompatibility: {
                generalTraining: overallRisk.level !== 'high',
                bryantPeriodization: bryantAssessment?.cleared || false,
                clusterSets: bryantAssessment?.clusterReady || false,
                strongmanEvents: bryantAssessment?.strongmanReady || false,
                tacticalApplications: bryantAssessment?.tacticalReady || false
            },

            // Raw data
            responses,
            validationResult
        };

        // 9. Save results if requested
        if (saveResults) {
            await savePHAResults(phaResult);
        }

        console.log('✅ PHA Screening completed successfully');
        console.log('📊 Risk Level:', overallRisk.level);

        return {
            success: true,
            message: 'PHA screening completed successfully',
            result: phaResult
        };

    } catch (error) {
        console.error('❌ PHA Screening failed:', error);
        return {
            success: false,
            message: `PHA screening failed: ${error.message}`,
            error: error,
            result: null
        };
    }
};

/**
 * Validates PHA screening responses for completeness and format
 * @param {Object} responses - User responses to validate
 * @returns {Object} - Validation result
 */
const validatePHAResponses = (responses) => {
    const validation = {
        valid: true,
        errors: [],
        warnings: [],
        completeness: 0
    };

    // Required fields for basic screening
    const requiredFields = [
        'age',
        'sex',
        'currentActivity',
        'cardiovascularSymptoms',
        'knownDiseases',
        'medications',
        'familyHistory'
    ];

    // Check for required fields
    const providedFields = requiredFields.filter(field =>
        responses[field] !== undefined && responses[field] !== null && responses[field] !== ''
    );

    validation.completeness = (providedFields.length / requiredFields.length) * 100;

    // Check individual field validity
    if (!responses.age || responses.age < 18 || responses.age > 100) {
        validation.errors.push('Age must be between 18 and 100');
        validation.valid = false;
    }

    if (!responses.sex || !['male', 'female', 'other'].includes(responses.sex)) {
        validation.errors.push('Sex must be specified (male/female/other)');
        validation.valid = false;
    }

    if (!responses.currentActivity || !['sedentary', 'light', 'moderate', 'vigorous'].includes(responses.currentActivity)) {
        validation.warnings.push('Current activity level should be specified');
    }

    // Check for incomplete responses
    if (validation.completeness < 80) {
        validation.warnings.push('Screening is incomplete - some questions not answered');
    }

    return validation;
};

/**
 * Assesses cardiovascular risk factors
 * @param {Object} responses - PHA responses
 * @returns {Object} - Cardiovascular risk assessment
 */
const assessCardiovascularRisk = (responses) => {
    const riskFactors = [];
    let riskScore = 0;

    // Age risk factor
    const ageThreshold = responses.sex === 'male' ? 45 : 55;
    if (responses.age >= ageThreshold) {
        riskFactors.push('Age ≥ threshold');
        riskScore += 1;
    }

    // Family history
    if (responses.familyHistory?.cardiovascular) {
        riskFactors.push('Family history of cardiovascular disease');
        riskScore += 1;
    }

    // Smoking
    if (responses.smoking === 'current') {
        riskFactors.push('Current smoker');
        riskScore += 1;
    } else if (responses.smoking === 'quit_recent') {
        riskFactors.push('Recently quit smoking');
        riskScore += 0.5;
    }

    // Physical inactivity
    if (responses.currentActivity === 'sedentary') {
        riskFactors.push('Sedentary lifestyle');
        riskScore += 1;
    }

    // BMI/Obesity
    if (responses.bmi && responses.bmi >= 30) {
        riskFactors.push('Obesity (BMI ≥ 30)');
        riskScore += 1;
    }

    // Hypertension
    if (responses.bloodPressure?.systolic >= 140 || responses.bloodPressure?.diastolic >= 90) {
        riskFactors.push('Hypertension');
        riskScore += 1;
    }

    // Dyslipidemia
    if (responses.cholesterol?.total >= 240 || responses.cholesterol?.hdl < 40) {
        riskFactors.push('Dyslipidemia');
        riskScore += 1;
    }

    // Diabetes
    if (responses.diabetes === 'type1' || responses.diabetes === 'type2') {
        riskFactors.push('Diabetes');
        riskScore += 1;
    }

    // Cardiovascular symptoms
    const symptoms = responses.cardiovascularSymptoms || [];
    if (symptoms.includes('chest_pain') || symptoms.includes('shortness_of_breath')) {
        riskFactors.push('Cardiovascular symptoms present');
        riskScore += 2; // Higher weight for symptoms
    }

    // Determine risk level
    let level = 'low';
    if (riskScore >= 3 || symptoms.length > 0) {
        level = 'high';
    } else if (riskScore >= 2) {
        level = 'moderate';
    }

    return {
        level,
        score: riskScore,
        factors: riskFactors,
        requiresClearing: level === 'high',
        requiresTesting: level === 'high' && responses.age >= 40
    };
};

/**
 * Assesses orthopedic/musculoskeletal risk factors
 * @param {Object} responses - PHA responses
 * @returns {Object} - Orthopedic risk assessment
 */
const assessOrthopedicRisk = (responses) => {
    const concerns = [];
    let riskScore = 0;

    // Current injuries
    if (responses.currentInjuries && responses.currentInjuries.length > 0) {
        concerns.push('Current injuries present');
        riskScore += responses.currentInjuries.length;
    }

    // Injury history
    if (responses.injuryHistory && responses.injuryHistory.length > 0) {
        concerns.push('Previous injury history');
        riskScore += responses.injuryHistory.length * 0.5;
    }

    // Pain levels
    if (responses.currentPain && Object.values(responses.currentPain).some(pain => pain >= 3)) {
        concerns.push('Current pain levels ≥ 3/10');
        riskScore += 1;
    }

    // Movement limitations
    if (responses.movementLimitations && responses.movementLimitations.length > 0) {
        concerns.push('Movement limitations present');
        riskScore += responses.movementLimitations.length * 0.5;
    }

    // Surgical history
    if (responses.surgicalHistory && responses.surgicalHistory.length > 0) {
        concerns.push('Previous surgical history');
        riskScore += responses.surgicalHistory.length * 0.3;
    }

    // Determine risk level
    let level = 'low';
    if (riskScore >= 3) {
        level = 'high';
    } else if (riskScore >= 1.5) {
        level = 'moderate';
    }

    return {
        level,
        score: riskScore,
        concerns,
        requiresAssessment: level !== 'low',
        restrictions: generateOrthopedicRestrictions(responses)
    };
};

/**
 * Assesses metabolic risk factors
 * @param {Object} responses - PHA responses
 * @returns {Object} - Metabolic risk assessment
 */
const assessMetabolicRisk = (responses) => {
    const factors = [];
    let riskScore = 0;

    // Diabetes
    if (responses.diabetes !== 'none') {
        factors.push('Diabetes diagnosis');
        riskScore += responses.diabetes === 'type1' ? 2 : 1;
    }

    // Thyroid disorders
    if (responses.thyroidDisorder) {
        factors.push('Thyroid disorder');
        riskScore += 0.5;
    }

    // Medications affecting metabolism
    if (responses.medications && responses.medications.includes('insulin')) {
        factors.push('Insulin medication');
        riskScore += 1;
    }

    // Energy levels
    if (responses.energyLevels === 'very_low' || responses.energyLevels === 'low') {
        factors.push('Low energy levels');
        riskScore += 0.5;
    }

    // Sleep quality
    if (responses.sleepQuality === 'poor' || responses.sleepQuality === 'very_poor') {
        factors.push('Poor sleep quality');
        riskScore += 0.5;
    }

    // Determine risk level
    let level = 'low';
    if (riskScore >= 2) {
        level = 'high';
    } else if (riskScore >= 1) {
        level = 'moderate';
    }

    return {
        level,
        score: riskScore,
        factors,
        requiresMonitoring: level !== 'low'
    };
};

/**
 * Assesses readiness for Bryant Periodization specific methods
 * @param {Object} responses - PHA responses
 * @returns {Object} - Bryant-specific assessment
 */
const assessBryantReadiness = (responses) => {
    const assessment = {
        cleared: true,
        clusterReady: true,
        strongmanReady: true,
        tacticalReady: true,
        restrictions: [],
        requirements: []
    };

    // Experience requirements
    if (responses.experienceLevel === 'beginner' || responses.trainingAge < 1) {
        assessment.clusterReady = false;
        assessment.strongmanReady = false;
        assessment.restrictions.push('Minimum 1 year training experience required for advanced methods');
    }

    // Cardiovascular requirements for high-intensity methods
    if (responses.cardiovascularSymptoms?.length > 0) {
        assessment.strongmanReady = false;
        assessment.tacticalReady = false;
        assessment.restrictions.push('Cardiovascular symptoms exclude high-intensity methods');
    }

    // Orthopedic requirements
    if (responses.currentInjuries?.length > 0) {
        const hasSpinalInjury = responses.currentInjuries.some(injury =>
            injury.includes('back') || injury.includes('spine')
        );
        if (hasSpinalInjury) {
            assessment.strongmanReady = false;
            assessment.restrictions.push('Spinal injuries exclude strongman events');
        }
    }

    // Age considerations
    if (responses.age >= 55) {
        assessment.requirements.push('Medical clearance recommended for intensive methods');
    }

    // Movement quality requirements
    if (responses.movementScreen && responses.movementScreen.totalScore < 14) {
        assessment.clusterReady = false;
        assessment.restrictions.push('Movement screen score too low for cluster sets');
    }

    // Overall clearance
    assessment.cleared = assessment.clusterReady || assessment.strongmanReady || assessment.tacticalReady;

    return assessment;
};

/**
 * Calculates overall risk level from all assessments
 * @param {Object} assessments - All risk assessments
 * @returns {Object} - Overall risk assessment
 */
const calculateOverallRisk = (assessments) => {
    const { cardiovascularRisk, orthopedicRisk, metabolicRisk, bryantAssessment, strictMode } = assessments;

    // Risk level hierarchy
    const riskLevels = { low: 0, moderate: 1, high: 2 };

    const maxRisk = Math.max(
        riskLevels[cardiovascularRisk.level],
        riskLevels[orthopedicRisk.level],
        riskLevels[metabolicRisk.level]
    );

    const levelNames = ['low', 'moderate', 'high'];
    const overallLevel = levelNames[maxRisk];

    // Determine requirements
    const requiresClearing = cardiovascularRisk.requiresClearing || overallLevel === 'high';
    const requiresTesting = cardiovascularRisk.requiresTesting;
    const requiresSupervision = overallLevel === 'high' || (strictMode && overallLevel === 'moderate');

    // Compile restrictions
    const restrictions = [
        ...orthopedicRisk.restrictions,
        ...(bryantAssessment?.restrictions || [])
    ];

    return {
        level: overallLevel,
        requiresClearing,
        requiresTesting,
        requiresSupervision,
        restrictions: [...new Set(restrictions)], // Remove duplicates
        summary: generateRiskSummary(overallLevel, assessments)
    };
};

/**
 * Generates training restrictions based on orthopedic concerns
 * @param {Object} responses - PHA responses
 * @returns {Array} - Array of training restrictions
 */
const generateOrthopedicRestrictions = (responses) => {
    const restrictions = [];

    if (responses.currentInjuries) {
        responses.currentInjuries.forEach(injury => {
            if (injury.includes('shoulder')) {
                restrictions.push('Overhead movements contraindicated');
            }
            if (injury.includes('knee')) {
                restrictions.push('Deep knee flexion activities limited');
            }
            if (injury.includes('back') || injury.includes('spine')) {
                restrictions.push('Spinal loading exercises require modification');
            }
        });
    }

    return restrictions;
};

/**
 * Generates comprehensive PHA recommendations
 * @param {Object} assessmentData - All assessment data
 * @returns {Array} - Array of recommendations
 */
const generatePHARecommendations = (assessmentData) => {
    const recommendations = [];
    const { overallRisk, cardiovascularRisk, orthopedicRisk, metabolicRisk, bryantAssessment } = assessmentData;

    // Medical recommendations
    if (overallRisk.requiresClearing) {
        recommendations.push({
            category: 'medical',
            priority: 'high',
            text: 'Obtain medical clearance before beginning exercise program'
        });
    }

    if (overallRisk.requiresTesting) {
        recommendations.push({
            category: 'medical',
            priority: 'high',
            text: 'Exercise stress testing recommended before high-intensity exercise'
        });
    }

    // Training recommendations
    if (overallRisk.level === 'moderate') {
        recommendations.push({
            category: 'training',
            priority: 'medium',
            text: 'Begin with conservative training loads and progress gradually'
        });
    }

    if (orthopedicRisk.level !== 'low') {
        recommendations.push({
            category: 'training',
            priority: 'medium',
            text: 'Implement comprehensive warm-up and movement preparation'
        });
    }

    // Bryant-specific recommendations
    if (bryantAssessment && !bryantAssessment.cleared) {
        recommendations.push({
            category: 'training',
            priority: 'medium',
            text: 'Focus on foundational training before advanced periodization methods'
        });
    }

    if (bryantAssessment && !bryantAssessment.clusterReady) {
        recommendations.push({
            category: 'training',
            priority: 'low',
            text: 'Develop movement competency before implementing cluster sets'
        });
    }

    return recommendations;
};

/**
 * Generates risk summary text
 * @param {string} overallLevel - Overall risk level
 * @param {Object} assessments - All assessments
 * @returns {string} - Risk summary
 */
const generateRiskSummary = (overallLevel, assessments) => {
    switch (overallLevel) {
        case 'low':
            return 'Low risk for exercise participation. Standard exercise guidelines apply.';
        case 'moderate':
            return 'Moderate risk identified. Exercise participation with some restrictions recommended.';
        case 'high':
            return 'High risk for exercise participation. Medical clearance required before exercise.';
        default:
            return 'Risk assessment incomplete.';
    }
};

/**
 * Saves PHA results to localStorage and optionally to database
 * @param {Object} phaResult - PHA screening result
 * @returns {Promise} - Save operation promise
 */
const savePHAResults = async (phaResult) => {
    try {
        // Save to localStorage
        localStorage.setItem('phaScreeningResult', JSON.stringify(phaResult));
        localStorage.setItem('phaScreeningCompleted', 'true');
        localStorage.setItem('phaScreeningDate', phaResult.timestamp);

        console.log('✅ PHA results saved to localStorage');

        // TODO: Save to Supabase database when available
        // const { error } = await supabase
        //     .from('health_assessments')
        //     .insert([{
        //         user_id: userId,
        //         assessment_type: 'pha_screening',
        //         assessment_data: phaResult,
        //         created_at: phaResult.timestamp
        //     }]);

        return { success: true };

    } catch (error) {
        console.error('❌ Failed to save PHA results:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Hook for using PHA screening functionality in React components
 * @returns {Object} - PHA screening hook utilities
 */
export const usePHAScreening = () => {
    const [screeningStatus, setScreeningStatus] = useState('idle');
    const [screeningResult, setScreeningResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load existing screening result on mount
    useEffect(() => {
        const existingResult = localStorage.getItem('phaScreeningResult');
        if (existingResult) {
            try {
                setScreeningResult(JSON.parse(existingResult));
                setScreeningStatus('completed');
            } catch (error) {
                console.error('Failed to load existing PHA result:', error);
            }
        }
    }, []);

    const executeScreening = async (responses, options = {}) => {
        setIsLoading(true);
        setScreeningStatus('running');

        try {
            const result = await performPHAScreening(responses, options);
            setScreeningResult(result.result);
            setScreeningStatus(result.success ? 'completed' : 'failed');
            return result;
        } catch (error) {
            setScreeningStatus('failed');
            setScreeningResult(null);
            return {
                success: false,
                message: error.message,
                error
            };
        } finally {
            setIsLoading(false);
        }
    };

    const resetScreening = () => {
        setScreeningStatus('idle');
        setScreeningResult(null);
        setIsLoading(false);
        localStorage.removeItem('phaScreeningResult');
        localStorage.removeItem('phaScreeningCompleted');
        localStorage.removeItem('phaScreeningDate');
    };

    const getScreeningStatus = () => {
        if (!screeningResult) return 'not_started';
        if (screeningResult.overallRisk.level === 'high') return 'medical_clearance_required';
        if (screeningResult.overallRisk.level === 'moderate') return 'proceed_with_caution';
        return 'cleared_for_exercise';
    };

    return {
        screeningStatus,
        screeningResult,
        isLoading,
        executeScreening,
        resetScreening,
        getScreeningStatus,
        isCleared: screeningResult?.programCompatibility?.generalTraining || false,
        isBryantReady: screeningResult?.programCompatibility?.bryantPeriodization || false
    };
};

export default {
    performPHAScreening,
    usePHAScreening
};
