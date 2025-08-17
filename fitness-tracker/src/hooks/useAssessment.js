import { useState, useEffect } from 'react';
import { useProgramContext } from '../contexts/ProgramContext';
// import { supabase } from '../lib/supabaseClient';

/**
 * Enhanced useAssessment Hook
 * 
 * Integrates Bryant Periodization principles with:
 * - Gainer type classification with volume modifiers
 * - Automatic volume adjustments based on classification
 * - Enhanced recovery capacity assessment
 * - MRV calculations with individualization
 */

export const useAssessment = () => {
    const { state, actions } = useProgramContext();
    const [loading, setLoading] = useState(false);
    const [assessmentData, setAssessmentData] = useState({});

    // Enhanced Gainer type classification with volume modifiers
    const classifyGainerType = (reps) => {
        if (!reps || reps < 1) return null;

        const repsNum = parseInt(reps);
        let classification = {};

        if (repsNum <= 3) {
            classification = {
                type: 'Very Fast Gainer',
                characteristics: 'Extreme neural efficiency, very low fatigue resistance',
                volumeModifier: 0.6, // 40% less volume
                mrvModifier: 0.7,
                frequencyRecommendation: 'low', // 2-3x per week
                intensityPreference: 'very_high', // 90-100% 1RM
                restPeriods: 'very_long' // 4-6 minutes
            };
        } else if (repsNum <= 8) {
            classification = {
                type: 'Fast Gainer',
                characteristics: 'High neural efficiency, low fatigue resistance',
                volumeModifier: 0.8, // Bryant: Exactly 80% volume (0.8x)
                mrvModifier: 0.8,    // Bryant: MRV also 80% (0.8x)
                frequencyRecommendation: 'moderate', // 3-4x per week
                intensityPreference: 'high', // 85-95% 1RM
                restPeriods: 'long' // 3-5 minutes
            };
        } else if (repsNum <= 12) {
            classification = {
                type: 'Average Gainer',
                characteristics: 'Balanced neural and metabolic capabilities',
                volumeModifier: 1.0, // Standard volume
                mrvModifier: 1.0,
                frequencyRecommendation: 'moderate', // 3-5x per week
                intensityPreference: 'moderate', // 75-85% 1RM
                restPeriods: 'moderate' // 2-3 minutes
            };
        } else if (repsNum <= 15) {
            classification = {
                type: 'Slow Gainer',
                characteristics: 'Good fatigue resistance, moderate neural efficiency',
                volumeModifier: 1.3, // Bryant: Exactly 130% volume (1.3x)
                mrvModifier: 1.3,    // Bryant: MRV also 130% (1.3x)
                frequencyRecommendation: 'high', // 4-6x per week
                intensityPreference: 'moderate', // 70-80% 1RM
                restPeriods: 'short' // 1-2 minutes
            };
        } else {
            classification = {
                type: 'Very Slow Gainer',
                characteristics: 'High fatigue resistance, lower neural efficiency',
                volumeModifier: 1.5, // 50% more volume
                mrvModifier: 1.4,
                frequencyRecommendation: 'very_high', // 5-7x per week
                intensityPreference: 'low_moderate', // 65-75% 1RM
                restPeriods: 'very_short' // 30-90 seconds
            };
        }

        return {
            ...classification,
            repsAt80Percent: repsNum,
            testDate: new Date().toISOString(),
            recommendations: generateGainerRecommendations(classification)
        };
    };

    // Generate specific recommendations based on gainer type
    const generateGainerRecommendations = (classification) => {
        const base = {
            'Very Fast Gainer': [
                'Prioritize neural adaptations over hypertrophy',
                'Use cluster sets to maintain power output',
                'Extended rest periods between sets',
                'Lower training frequency (2-3x/week)',
                'Focus on compound movements'
            ],
            'Fast Gainer': [
                'Balance strength and size goals',
                'Moderate volume with high intensity',
                'Quality over quantity approach',
                'Good recovery between sessions'
            ],
            'Average Gainer': [
                'Flexible programming approach',
                'Can handle variety in training',
                'Standard periodization models work well',
                'Monitor fatigue for adjustments'
            ],
            'Slow Gainer': [
                'Higher volume tolerance',
                'Can handle more frequent training',
                'Benefits from metabolic stress',
                'Shorter rest periods effective'
            ],
            'Very Slow Gainer': [
                'Very high volume training',
                'Frequent training sessions',
                'Focus on metabolic adaptations',
                'Minimal rest between sets'
            ]
        };

        return base[classification.type] || [];
    };

    // Apply gainer type to program volume calculations
    const applyGainerTypeToProgram = (gainerType, baseProgram) => {
        if (!gainerType || !baseProgram) return baseProgram;

        const { volumeModifier, mrvModifier, frequencyRecommendation } = gainerType;

        return {
            ...baseProgram,
            weeklyVolume: Math.round(baseProgram.weeklyVolume * volumeModifier),
            maxRecoverableVolume: Math.round(baseProgram.maxRecoverableVolume * mrvModifier),
            recommendedFrequency: frequencyRecommendation,
            volumeProgression: baseProgram.volumeProgression.map(week => ({
                ...week,
                volume: Math.round(week.volume * volumeModifier)
            })),
            gainerTypeApplied: true,
            modifier: volumeModifier
        };
    };

    // Calculate personalized volume landmarks (MEV/MRV/MAV) - Bryant Periodization
    const calculatePersonalizedVolume = (muscleGroup, gainerType, trainingExperience) => {
        // Base volumes per muscle group (Israetel recommendations)
        const baseMEV = {
            chest: 8, back: 10, shoulders: 8, biceps: 6, triceps: 6,
            quads: 10, hamstrings: 6, glutes: 6, calves: 8, abs: 0
        };

        const baseMRV = {
            chest: 18, back: 25, shoulders: 16, biceps: 20, triceps: 18,
            quads: 20, hamstrings: 16, glutes: 16, calves: 20, abs: 25
        };

        if (!baseMEV[muscleGroup] || !gainerType) {
            return { MEV: baseMEV[muscleGroup], MRV: baseMRV[muscleGroup], MAV: baseMRV[muscleGroup] * 1.2 };
        }

        const { volumeModifier, mrvModifier } = gainerType;

        // Experience modifier (Bryant: More experienced = higher capacity)
        const experienceModifiers = {
            'beginner': 0.7,     // 70% of base - learning movement patterns
            'novice': 0.85,      // 85% of base - building consistency
            'intermediate': 1.0,  // 100% of base - standard reference
            'advanced': 1.15,    // 115% of base - enhanced recovery
            'elite': 1.3         // 130% of base - professional capacity
        };

        const expMod = experienceModifiers[trainingExperience] || 1.0;

        // Bryant's exact formula: Base × GainerModifier × ExperienceModifier
        const personalizedMEV = Math.round(baseMEV[muscleGroup] * volumeModifier * expMod);
        const personalizedMRV = Math.round(baseMRV[muscleGroup] * mrvModifier * expMod);
        const personalizedMAV = Math.round(personalizedMRV * 1.2); // MAV = MRV × 1.2

        // Ensure logical progression: MEV < MRV < MAV
        const finalMEV = Math.max(1, personalizedMEV);
        const finalMRV = Math.max(finalMEV + 2, personalizedMRV);
        const finalMAV = Math.max(finalMRV + 2, personalizedMAV);

        return {
            MEV: finalMEV,
            MRV: finalMRV,
            MAV: finalMAV,
            // Additional Bryant metadata
            gainerModifier: mrvModifier,
            experienceModifier: expMod,
            baseValues: { MEV: baseMEV[muscleGroup], MRV: baseMRV[muscleGroup] }
        };
    };

    // Enhanced recovery capacity assessment
    const assessRecoveryCapacity = (profile) => {
        const {
            age = 30,
            trainingExperience = 'intermediate',
            sleepHours = 7,
            sleepQuality = 7,
            stressLevel = 5,
            nutrition = 7,
            hydration = 7,
            lifestyle = 'moderate',
            gainerType = null
        } = profile;

        let recoveryScore = 100;

        // Age impact (non-linear decline)
        if (age > 30) recoveryScore -= Math.pow(age - 30, 1.3) * 0.8;

        // Training experience (experienced athletes recover better)
        const expBonus = {
            'beginner': -15, 'novice': -10, 'intermediate': 0,
            'advanced': 10, 'elite': 15
        };
        recoveryScore += expBonus[trainingExperience] || 0;

        // Sleep (heavily weighted)
        recoveryScore += (sleepHours - 6) * 8; // Hours
        recoveryScore += (sleepQuality - 5) * 6; // Quality

        // Stress (major recovery inhibitor)
        recoveryScore -= (stressLevel - 5) * 8;

        // Nutrition and hydration
        recoveryScore += (nutrition - 5) * 4;
        recoveryScore += (hydration - 5) * 3;

        // Lifestyle activity level
        const lifestyleImpact = {
            'sedentary': -10, 'light': -5, 'moderate': 0,
            'active': 5, 'very_active': -5 // Too much non-training activity hurts
        };
        recoveryScore += lifestyleImpact[lifestyle] || 0;

        // Gainer type impact on recovery
        if (gainerType) {
            const gainerRecovery = {
                'Very Fast Gainer': 10, // Recover quickly but need it more
                'Fast Gainer': 5,
                'Average Gainer': 0,
                'Slow Gainer': -5,
                'Very Slow Gainer': -10 // Take longer to recover
            };
            recoveryScore += gainerRecovery[gainerType.type] || 0;
        }

        // Classify recovery capacity
        const capacity = Math.max(0, Math.min(100, recoveryScore));

        let classification;
        if (capacity >= 85) classification = 'excellent';
        else if (capacity >= 70) classification = 'good';
        else if (capacity >= 55) classification = 'average';
        else if (capacity >= 40) classification = 'below_average';
        else classification = 'poor';

        return {
            score: Math.round(capacity),
            classification,
            factors: {
                age: age > 30 ? 'limiting' : 'neutral',
                experience: trainingExperience,
                sleep: sleepHours >= 7 && sleepQuality >= 7 ? 'good' : 'limiting',
                stress: stressLevel <= 5 ? 'manageable' : 'high',
                lifestyle: lifestyle
            },
            recommendations: getRecoveryRecommendations(classification, profile)
        };
    };

    // Get recovery recommendations based on capacity
    const getRecoveryRecommendations = (classification, profile) => {
        const base = [
            'Maintain consistent sleep schedule',
            'Stay hydrated throughout the day',
            'Manage stress through proven techniques'
        ];

        const specific = {
            'excellent': [
                'You can handle higher training loads',
                'Consider advanced periodization models',
                'Monitor for overconfidence in recovery'
            ],
            'good': [
                'Standard training progression appropriate',
                'Maintain current recovery practices',
                'Watch for early fatigue signs'
            ],
            'average': [
                'Be conservative with volume increases',
                'Prioritize sleep and nutrition',
                'Consider deload weeks more frequently'
            ],
            'below_average': [
                'Reduce training volume by 20-30%',
                'Focus heavily on recovery optimization',
                'Consider consulting a sleep specialist'
            ],
            'poor': [
                'Significant lifestyle modifications needed',
                'Very conservative training approach',
                'Professional assessment recommended'
            ]
        };

        return [...base, ...specific[classification]];
    };

    // Save assessment data to database
    const saveAssessment = async (assessmentData) => {
        setLoading(true);
        try {
            // Prepare data for Supabase
            const dataToSave = {
                ...assessmentData,
                user_id: state.user?.id,
                created_at: new Date().toISOString(),
                gainer_classification: assessmentData.gainerType,
                recovery_assessment: assessmentData.recoveryCapacity
            };

            // Uncomment when Supabase is configured
            // const { data, error } = await supabase
            //     .from('assessments')
            //     .insert([dataToSave])
            //     .select();

            // if (error) throw error;

            // For now, save to local state
            setAssessmentData(dataToSave);
            actions.updateAssessment(dataToSave);

            return { success: true, data: dataToSave };
        } catch (error) {
            console.error('Error saving assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        assessmentData,
        classifyGainerType,
        applyGainerTypeToProgram,
        calculatePersonalizedVolume,
        assessRecoveryCapacity,
        saveAssessment,
        generateGainerRecommendations
    };
};
