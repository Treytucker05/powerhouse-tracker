import { useState, useEffect } from 'react';
import { useApp } from '../context';
import { APP_ACTIONS } from '../context/appActions';
// Note: Adjust this import path based on your Supabase client location
// import { supabase } from '../lib/supabaseClient';

export const useAssessment = () => {
    const { state, dispatch } = useApp();
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Gainer type classification based on reps at 80% 1RM
    const classifyGainerType = (reps) => {
        if (!reps || reps < 1) return null;

        const repsNum = parseInt(reps);

        if (repsNum <= 3) {
            return {
                type: 'Very Fast Gainer',
                characteristics: 'High neural efficiency, low fatigue resistance',
                recommendations: [
                    'Very low volume training (8-12 sets per week)',
                    'Heavy loads (85-95% 1RM)',
                    'Low rep ranges (1-3 reps)',
                    'Long rest periods (3-5 minutes)',
                    'Focus on neural adaptations'
                ]
            };
        } else if (repsNum <= 8) {
            return {
                type: 'Fast Gainer',
                characteristics: 'Good neural drive, moderate fatigue resistance',
                recommendations: [
                    'Low-moderate volume (12-16 sets per week)',
                    'Moderate-heavy loads (80-90% 1RM)',
                    'Low-moderate reps (3-6 reps)',
                    'Adequate rest (2-3 minutes)',
                    'Balance neural and hypertrophy work'
                ]
            };
        } else if (repsNum <= 15) {
            return {
                type: 'Slow Gainer',
                characteristics: 'Lower neural efficiency, higher fatigue resistance',
                recommendations: [
                    'Higher volume training (16-24 sets per week)',
                    'Moderate loads (70-85% 1RM)',
                    'Higher rep ranges (6-12+ reps)',
                    'Shorter rest periods (1-2 minutes)',
                    'Focus on hypertrophy and work capacity'
                ]
            };
        } else {
            return {
                type: 'Very Slow Gainer',
                characteristics: 'Low neural efficiency, very high fatigue resistance',
                recommendations: [
                    'Very high volume (20-30 sets per week)',
                    'Light-moderate loads (60-80% 1RM)',
                    'High rep ranges (12-20+ reps)',
                    'Short rest periods (30-90 seconds)',
                    'Emphasize metabolic stress and volume'
                ]
            };
        }
    };

    // Fiber dominance recommendations
    const getFiberRecommendations = (muscleGroup, fiberType) => {
        const recommendations = {
            hamstrings: {
                fast: {
                    description: 'Fast-twitch dominant - responds to explosive movements',
                    training: 'Use <8 reps, explosive exercises, plyometrics, heavy RDLs'
                },
                slow: {
                    description: 'Slow-twitch dominant - responds to endurance work',
                    training: 'Use 12+ reps, time under tension, higher frequency'
                },
                mixed: {
                    description: 'Balanced fiber composition',
                    training: 'Use varied rep ranges 6-15, mix power and endurance work'
                }
            },
            quadriceps: {
                fast: {
                    description: 'Power-dominant, explosive capability',
                    training: 'Use <6 reps, jump squats, heavy squats, explosive movements'
                },
                slow: {
                    description: 'Endurance-dominant, fatigue resistant',
                    training: 'Use 15+ reps, high frequency, cycling-based movements'
                },
                mixed: {
                    description: 'Balanced power and endurance',
                    training: 'Use 8-12 reps, varied intensities, balanced approach'
                }
            },
            chest: {
                fast: {
                    description: 'Power-oriented, responds to heavy pressing',
                    training: 'Use <6 reps, explosive bench press, plyometric push-ups'
                },
                slow: {
                    description: 'Endurance-oriented, high fatigue resistance',
                    training: 'Use 12+ reps, high volume, time under tension'
                },
                mixed: {
                    description: 'Balanced pressing capability',
                    training: 'Use 6-12 reps, varied exercises, progressive overload'
                }
            }
        };

        return recommendations[muscleGroup]?.[fiberType] || null;
    };

    // Mileage/capacity recommendations
    const getMileageRecommendations = (ageGroup, trainingAge, recoveryCapacity) => {
        const recommendations = [];

        // Age-based recommendations
        if (ageGroup === 'youth') {
            recommendations.push('Focus on movement quality and skill development');
            recommendations.push('Avoid early specialization');
            recommendations.push('Emphasize fun and variety in training');
        } else if (ageGroup === 'masters') {
            recommendations.push('Prioritize recovery and injury prevention');
            recommendations.push('Longer warm-ups and cool-downs needed');
            recommendations.push('Consider joint-friendly exercise variations');
        }

        // Training age recommendations
        if (trainingAge === 'beginner') {
            recommendations.push('Start with basic movement patterns');
            recommendations.push('Focus on consistency over intensity');
            recommendations.push('Allow adequate adaptation time');
        } else if (trainingAge === 'advanced') {
            recommendations.push('Can handle higher training loads');
            recommendations.push('Benefit from periodization strategies');
            recommendations.push('May need varied stimuli to progress');
        }

        // Recovery capacity recommendations
        if (recoveryCapacity === 'poor') {
            recommendations.push('Reduce training frequency');
            recommendations.push('Emphasize sleep and stress management');
            recommendations.push('Consider lower volume approaches');
        } else if (recoveryCapacity === 'excellent') {
            recommendations.push('Can handle higher training frequencies');
            recommendations.push('May benefit from daily training');
            recommendations.push('Good candidate for high-volume approaches');
        }

        return recommendations;
    };

    // SMART goals validation
    const validateSMARTGoals = (goals) => {
        const validation = {
            specific: {
                valid: goals.specific && goals.specific.length > 10,
                message: 'Goal should be specific and detailed (10+ characters)'
            },
            measurable: {
                valid: goals.measurable && goals.measurable.length > 5,
                message: 'Include specific numbers or metrics'
            },
            achievable: {
                valid: goals.achievable && goals.achievable.length > 10,
                message: 'Explain why this goal is realistic'
            },
            relevant: {
                valid: goals.relevant && goals.relevant.length > 10,
                message: 'Explain how this aligns with your priorities'
            },
            timeBound: {
                valid: goals.timeBound && goals.timeBound.length > 5,
                message: 'Include a specific deadline or timeframe'
            }
        };

        const allValid = Object.values(validation).every(v => v.valid);

        return { validation, allValid };
    };

    // Generate comprehensive suggestions
    const generateSuggestions = (assessmentData) => {
        const newSuggestions = [];

        // Gainer type suggestions
        if (assessmentData.gainerType?.reps) {
            const classification = classifyGainerType(assessmentData.gainerType.reps);
            if (classification) {
                newSuggestions.push(`${classification.type}: ${classification.characteristics}`);
                newSuggestions.push(...classification.recommendations.slice(0, 2));
            }
        }

        // Fiber dominance suggestions
        Object.entries(assessmentData.fiberDominance || {}).forEach(([muscle, fiber]) => {
            const rec = getFiberRecommendations(muscle, fiber);
            if (rec) {
                newSuggestions.push(`${muscle}: ${rec.training}`);
            }
        });

        // Biomotor priorities
        const highPriorities = Object.entries(assessmentData.biomotorPriorities || {})
            .filter(([_, priority]) => priority === 'high')
            .map(([ability]) => ability);

        if (highPriorities.length > 0) {
            newSuggestions.push(`High priority: ${highPriorities.join(', ')}`);
        }

        setSuggestions(newSuggestions);
    };

    // Save assessment to Supabase
    const saveAssessment = async (assessmentData) => {
        setLoading(true);
        try {
            // TODO: Uncomment and adjust when Supabase client is properly configured
            /*
            const { data, error } = await supabase
              .from('user_assessments')
              .upsert([{
                user_id: state.user?.id,
                enhanced_assessment: assessmentData,
                updated_at: new Date().toISOString()
              }], {
                onConflict: 'user_id'
              })
              .select()
              .single();
      
            if (error) throw error;
            */

            // For now, just update AppContext
            dispatch({
                type: APP_ACTIONS.UPDATE_ASSESSMENT,
                payload: {
                    ...state?.assessment,
                    enhancedAssessment: assessmentData
                }
            });

            return { success: true, data: assessmentData };
        } catch (error) {
            console.error('Error saving assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // OPEX NUTRITION INTEGRATION

    // BLGs (Biological Laws of Genetics) Assessment
    const assessBLGs = (blgsData) => {
        const scores = {};
        let totalScore = 0;
        let maxScore = 0;

        // 1. Work/Rest Balance (24hr cycle)
        const workRestScore = blgsData.workHours <= 8 && blgsData.restQuality >= 7 ? 10 :
            blgsData.workHours <= 10 && blgsData.restQuality >= 5 ? 7 :
                blgsData.workHours <= 12 && blgsData.restQuality >= 3 ? 4 : 2;
        scores.workRest = { score: workRestScore, max: 10 };

        // 2. Water Intake (1/2 BW in oz)
        const waterTarget = blgsData.bodyWeight * 0.5;
        const waterScore = blgsData.waterIntake >= waterTarget ? 10 :
            blgsData.waterIntake >= waterTarget * 0.8 ? 7 :
                blgsData.waterIntake >= waterTarget * 0.6 ? 4 : 2;
        scores.water = { score: waterScore, max: 10, target: waterTarget };

        // 3. Sleep Consistency & Quality
        const sleepScore = (blgsData.sleepHours >= 7 && blgsData.sleepHours <= 9) &&
            blgsData.fallAsleepTime <= 15 && blgsData.sleepQuality >= 7 ? 10 :
            (blgsData.sleepHours >= 6 && blgsData.sleepHours <= 10) &&
                blgsData.fallAsleepTime <= 20 && blgsData.sleepQuality >= 5 ? 7 : 4;
        scores.sleep = { score: sleepScore, max: 10 };

        // 4. Sun Exposure & Circadian Rhythm
        const sunScore = blgsData.sunExposure >= 15 && blgsData.outdoorTime >= 20 ? 10 :
            blgsData.sunExposure >= 10 && blgsData.outdoorTime >= 15 ? 7 : 4;
        scores.sun = { score: sunScore, max: 10 };

        // 5. Digestion & Elimination
        const digestionScore = blgsData.bowelMovements >= 1 && blgsData.bowelQuality >= 3 ? 10 :
            blgsData.bowelMovements >= 0.7 && blgsData.bowelQuality >= 2 ? 7 : 4;
        scores.digestion = { score: digestionScore, max: 10 };

        // 6. Daily Movement & Recovery
        const movementScore = blgsData.dailyMovement >= 30 && blgsData.recoveryActivities ? 10 :
            blgsData.dailyMovement >= 20 ? 7 : 4;
        scores.movement = { score: movementScore, max: 10 };

        // 7. Mindful Eating (Sit & Chew)
        const eatingScore = blgsData.mindfulEating && blgsData.chewingTime >= 20 ? 10 :
            blgsData.mindfulEating && blgsData.chewingTime >= 15 ? 7 : 4;
        scores.eating = { score: eatingScore, max: 10 };

        // 8. Mortality Acceptance & Life Fulfillment
        const mortalityScore = blgsData.lifeFullness >= 7 && blgsData.stressBucket <= 3 ? 10 :
            blgsData.lifeFullness >= 5 && blgsData.stressBucket <= 5 ? 7 : 4;
        scores.mortality = { score: mortalityScore, max: 10 };

        // Calculate totals
        Object.values(scores).forEach(item => {
            totalScore += item.score;
            maxScore += item.max;
        });

        const percentage = (totalScore / maxScore) * 100;
        const tier = percentage >= 85 ? 'Mastery' :
            percentage >= 70 ? 'Proficient' :
                percentage >= 55 ? 'Developing' : 'Foundation';

        return {
            scores,
            totalScore,
            maxScore,
            percentage,
            tier,
            suggestions: generateBLGsSuggestions(scores, blgsData)
        };
    };

    // Generate BLGs improvement suggestions
    const generateBLGsSuggestions = (scores, blgsData) => {
        const suggestions = [];

        if (scores.sleep.score < 7) {
            suggestions.push({
                category: 'Sleep',
                priority: 'High',
                recommendations: [
                    'Limit caffeine after 2 PM',
                    'Create dark, cool environment (65-68°F)',
                    'Establish consistent bedtime routine',
                    'Consider magnesium supplementation',
                    'Journal or stretch before bed'
                ]
            });
        }

        if (scores.water.score < 7) {
            suggestions.push({
                category: 'Hydration',
                priority: 'High',
                recommendations: [
                    `Target ${scores.water.target}oz daily (${Math.round(scores.water.target / 8)} glasses)`,
                    'Drink 16-20oz upon waking',
                    'Add electrolytes if sweating heavily',
                    'Track intake with marked water bottle'
                ]
            });
        }

        if (scores.digestion.score < 7) {
            suggestions.push({
                category: 'Digestion',
                priority: 'Medium',
                recommendations: [
                    'Increase fiber intake (25-35g daily)',
                    'Chew each bite 20-30 times',
                    'Sit while eating, avoid distractions',
                    'Consider probiotic foods (kefir, sauerkraut)',
                    'Stay hydrated throughout day'
                ]
            });
        }

        if (scores.sun.score < 7) {
            suggestions.push({
                category: 'Circadian Health',
                priority: 'Medium',
                recommendations: [
                    'Get 15-20 minutes morning sunlight',
                    'Take outdoor breaks every 2 hours',
                    'Limit blue light 2 hours before bed',
                    'Consider light therapy lamp in winter'
                ]
            });
        }

        return suggestions;
    };

    // Fuel Assessment (OPEX Nutrition Hierarchy)
    const assessFuel = (fuelData, blgsScore, gainerType, biomotorData) => {
        // Prerequisite check - BLGs must be above foundation level
        if (blgsScore < 55) {
            return {
                blocked: true,
                message: 'Complete BLGs foundation (55%+) before Fuel assessment',
                unlockRequirements: ['Improve sleep consistency', 'Increase water intake', 'Establish daily movement']
            };
        }

        // Determine fuel profile based on current habits
        const profile = determineFuelProfile(fuelData);

        // Calculate TDEE using multiple methods
        const tdee = calculateTDEE(fuelData.stats);

        // Generate macro recommendations based on gainer type and goals
        const macros = calculateMacros(fuelData.stats, gainerType, biomotorData, fuelData.goals);

        // Activity-based timing recommendations
        const timing = getTimingRecommendations(fuelData.activity, fuelData.chronotype);

        return {
            profile,
            tdee,
            macros,
            timing,
            suggestions: generateFuelSuggestions(profile, macros, gainerType),
            progression: getFuelProgression(profile)
        };
    };

    // Determine fuel profile (Inadequate → Adequate → Optimal → Highest)
    const determineFuelProfile = (fuelData) => {
        const processedFoodScore = 10 - (fuelData.processedMeals || 0); // Lower is better
        const wholeFoodScore = fuelData.wholeFoods || 0;
        const consistencyScore = fuelData.mealConsistency || 0;
        const awarenessScore = fuelData.nutritionAwareness || 0;

        const totalScore = (processedFoodScore + wholeFoodScore + consistencyScore + awarenessScore) / 4;

        if (totalScore >= 9) return 'Highest';
        if (totalScore >= 7) return 'Optimal';
        if (totalScore >= 5) return 'Adequate';
        return 'Inadequate';
    };

    // TDEE Calculation (BMR + TEF + NEAT + EEE)
    const calculateTDEE = (stats) => {
        // BMR using Mifflin-St Jeor equation
        const bmr = stats.gender === 'male'
            ? (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age) + 5
            : (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age) - 161;

        // Alternative: Weight in kg * 20 for active individuals
        const bmrAlternative = stats.weight * 20;

        // Use the higher of the two for active athletes
        const finalBMR = Math.max(bmr, bmrAlternative);

        // Thermic Effect of Food (10% of total intake)
        const tef = finalBMR * 0.1;

        // NEAT (Non-Exercise Activity Thermogenesis) + EEE (Exercise Energy Expenditure)
        const activityMultipliers = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            extremely_active: 1.9
        };

        const neat = (finalBMR * activityMultipliers[stats.activityLevel]) - finalBMR;

        return {
            bmr: Math.round(finalBMR),
            tef: Math.round(tef),
            neat: Math.round(neat),
            total: Math.round(finalBMR + tef + neat)
        };
    };

    // Macro calculations based on gainer type and biomotor priorities
    const calculateMacros = (stats, gainerType, biomotorData, goals) => {
        const leanMass = stats.weight * (1 - (stats.bodyFat || 15) / 100);

        // Protein recommendations (0.5-1.3g/lb lean mass)
        let proteinMultiplier = 0.8; // Base

        // Adjust for gainer type
        if (gainerType?.type === 'Very Fast Gainer' || gainerType?.type === 'Fast Gainer') {
            proteinMultiplier = 0.6; // Lower protein needs
        } else if (gainerType?.type === 'Slow Gainer' || gainerType?.type === 'Very Slow Gainer') {
            proteinMultiplier = 1.1; // Higher protein needs
        }

        // Adjust for biomotor priorities
        if (biomotorData?.strength >= 8) proteinMultiplier += 0.2;
        if (biomotorData?.endurance >= 8) proteinMultiplier += 0.1;

        const proteinGrams = Math.round(leanMass * proteinMultiplier);
        const proteinCals = proteinGrams * 4;

        // Carbohydrate recommendations (50-250g based on energy needs and digestion)
        let carbGrams = 150; // Base

        if (biomotorData?.endurance >= 7) carbGrams = 200;
        if (biomotorData?.power >= 7) carbGrams = 175;
        if (goals?.includes('fat_loss')) carbGrams = 100;
        if (gainerType?.type.includes('Fast')) carbGrams -= 25;

        const carbCals = carbGrams * 4;

        // Fat recommendations (30-100g for hormones and satiety)
        const remainingCals = stats.tdee - proteinCals - carbCals;
        const fatGrams = Math.round(remainingCals / 9);
        const fatCals = fatGrams * 9;

        return {
            protein: { grams: proteinGrams, calories: proteinCals, percentage: Math.round((proteinCals / stats.tdee) * 100) },
            carbs: { grams: carbGrams, calories: carbCals, percentage: Math.round((carbCals / stats.tdee) * 100) },
            fats: { grams: fatGrams, calories: fatCals, percentage: Math.round((fatCals / stats.tdee) * 100) }
        };
    };

    // Timing recommendations based on circadian rhythms
    const getTimingRecommendations = (activity, chronotype = 'normal') => {
        const baseRecommendations = {
            morning: 'Higher protein and fats to stabilize blood sugar',
            midday: 'Balanced macros with quality carbohydrates',
            evening: 'Lighter meals, emphasize proteins and vegetables',
            preWorkout: 'Small carbs 30-60min before (if needed)',
            postWorkout: 'Protein + carbs within 2 hours'
        };

        // Activity-specific modifications
        if (activity === 'gain') {
            baseRecommendations.postWorkout = 'Protein + carbs + fats for maximum recovery';
            baseRecommendations.midday = 'Largest meal of the day with all macros';
        } else if (activity === 'pain') {
            baseRecommendations.preWorkout = 'Small easily digestible carbs only';
            baseRecommendations.postWorkout = 'Focus on anti-inflammatory foods';
        } else if (activity === 'sustain') {
            baseRecommendations.overall = 'Consistent macro distribution throughout day';
        }

        // Chronotype adjustments
        if (chronotype === 'night_owl') {
            baseRecommendations.morning = 'Later breakfast, focus on protein';
            baseRecommendations.evening = 'Can handle larger evening meals';
        } else if (chronotype === 'early_bird') {
            baseRecommendations.morning = 'Larger breakfast with all macros';
            baseRecommendations.evening = 'Very light dinner, early cutoff';
        }

        return baseRecommendations;
    };

    // Person/Personalization Assessment (Unlocked after BLGs + Fuel mastery)
    const assessPersonalization = (personData, blgsScore, fuelTier) => {
        // Check prerequisites
        if (blgsScore < 70 || !['Optimal', 'Highest'].includes(fuelTier)) {
            return {
                blocked: true,
                message: 'Complete BLGs (70%+) and achieve Optimal Fuel before Personalization',
                unlockRequirements: ['Master sleep and stress management', 'Establish consistent nutrition habits']
            };
        }

        // Deloading protocols (earned through mastery)
        const deloadingOptions = generateDeloadingProtocols(personData);

        // Elimination/reintroduction protocols
        const eliminationPlan = generate21DayElimination(personData.aversions, personData.symptoms);

        // Life stage adaptations
        const lifeStageAdaptations = getLifeStageRecommendations(personData.age, personData.lifeStage);

        return {
            deloading: deloadingOptions,
            elimination: eliminationPlan,
            adaptations: lifeStageAdaptations,
            recommendations: generatePersonalizationRecommendations(personData)
        };
    };

    // Generate deloading protocols
    const generateDeloadingProtocols = (personData) => {
        return {
            intermittentFasting: {
                available: personData.fastingExperience || false,
                protocols: [
                    { name: '16:8', schedule: '5PM - 10AM fast', frequency: 'Daily' },
                    { name: '18:6', schedule: '4PM - 10AM fast', frequency: '5 days/week' },
                    { name: '24hr', schedule: 'Dinner to dinner', frequency: '1x/week' }
                ]
            },
            proteinDeload: {
                schedule: '10-15g protein for 3 days',
                frequency: 'Monthly',
                timing: 'During deload weeks'
            },
            seasonal: {
                winter: 'Warming foods: soups, stews, root vegetables',
                spring: 'Detoxifying: leafy greens, liver support',
                summer: 'Cooling: raw foods, fruits, lighter proteins',
                fall: 'Grounding: squashes, nuts, heavier proteins'
            }
        };
    };

    // 21-day elimination protocol
    const generate21DayElimination = (aversions, symptoms) => {
        const commonTriggers = ['gluten', 'dairy', 'eggs', 'soy', 'nuts', 'nightshades', 'shellfish'];
        const personalTriggers = aversions || [];

        return {
            phase1: {
                duration: '21 days',
                eliminate: [...commonTriggers, ...personalTriggers],
                focus: 'Baseline establishment',
                tracking: ['Energy levels', 'Digestion', 'Sleep quality', 'Mood', 'Inflammation']
            },
            phase2: {
                duration: '14 days',
                reintroduce: 'One food every 3 days',
                tracking: 'Same metrics + specific reactions',
                method: 'Single food in multiple meals over 2 days'
            },
            phase3: {
                duration: 'Ongoing',
                maintain: 'Personalized food list',
                retest: 'Quarterly for tolerance changes'
            }
        };
    };

    // Save OPEX nutrition assessment
    const saveNutritionAssessment = async (nutritionData) => {
        setLoading(true);
        try {
            // Update AppContext with nutrition data
            dispatch({
                type: APP_ACTIONS.UPDATE_NUTRITION_ASSESSMENT,
                payload: {
                    macrocycle: {
                        ...state?.macrocycle,
                        nutrition: nutritionData
                    }
                }
            });

            // TODO: Save to Supabase
            /*
            const { data, error } = await supabase
                .from('programs')
                .upsert([{
                    user_id: state.user?.id,
                    macrocycle: {
                        ...state?.macrocycle,
                        nutrition: nutritionData
                    },
                    updated_at: new Date().toISOString()
                }], {
                    onConflict: 'user_id'
                });
            */

            return { success: true, data: nutritionData };
        } catch (error) {
            console.error('Error saving nutrition assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for nutrition assessment
    const generateFuelSuggestions = (profile, macros, gainerType) => {
        const suggestions = [];

        if (profile === 'Inadequate') {
            suggestions.push({
                priority: 'High',
                category: 'Food Quality',
                recommendations: [
                    'Replace processed foods with whole foods',
                    'Focus on single-ingredient foods',
                    'Meal prep 2-3 days in advance',
                    'Start with 80/20 rule: 80% whole foods'
                ]
            });
        }

        if (profile === 'Adequate') {
            suggestions.push({
                priority: 'Medium',
                category: 'Consistency',
                recommendations: [
                    'Track food intake for awareness',
                    'Establish regular meal timing',
                    'Focus on nutrient-dense choices',
                    'Add variety within food groups'
                ]
            });
        }

        // Gainer type specific suggestions
        if (gainerType?.type === 'Fast Gainer') {
            suggestions.push({
                priority: 'Medium',
                category: 'Macro Distribution',
                recommendations: [
                    'Lower protein requirements (0.6-0.8g/lb)',
                    'Moderate carbohydrate intake',
                    'Focus on meal timing over quantity',
                    'Prioritize nutrient density'
                ]
            });
        } else if (gainerType?.type === 'Slow Gainer') {
            suggestions.push({
                priority: 'Medium',
                category: 'Macro Distribution',
                recommendations: [
                    'Higher protein needs (1.0-1.3g/lb)',
                    'More frequent meals',
                    'Focus on volume and variety',
                    'Consider protein timing around workouts'
                ]
            });
        }

        return suggestions;
    };

    const getFuelProgression = (currentProfile) => {
        const progressionMap = {
            'Inadequate': {
                next: 'Adequate',
                focus: 'Reduce processed foods, increase whole foods',
                timeline: '4-6 weeks',
                milestones: ['3 whole food meals daily', '80% unprocessed foods', 'Consistent meal timing']
            },
            'Adequate': {
                next: 'Optimal',
                focus: 'Optimize nutrient density and timing',
                timeline: '6-8 weeks',
                milestones: ['Track macros consistently', 'Meal prep routine', 'Individual tolerance awareness']
            },
            'Optimal': {
                next: 'Highest',
                focus: 'Personalization and bio-individuality',
                timeline: '8-12 weeks',
                milestones: ['Perfect macro distribution', 'Elimination protocol complete', 'Advanced strategies']
            },
            'Highest': {
                next: 'Mastery',
                focus: 'Intuitive eating and advanced protocols',
                timeline: 'Ongoing',
                milestones: ['Deloading protocols', 'Seasonal adaptations', 'Life stage optimization']
            }
        };

        return progressionMap[currentProfile];
    };

    const getLifeStageRecommendations = (age, lifeStage) => {
        const recommendations = {
            youth: {
                focus: 'Growth and development',
                priorities: ['Adequate calories for growth', 'Variety for nutrient exposure', 'Healthy relationship with food'],
                adjustments: ['Higher carbohydrate needs', 'Focus on calcium and iron', 'Regular meal timing']
            },
            growth: {
                focus: 'Peak performance and muscle building',
                priorities: ['Optimize recovery', 'Support training demands', 'Build metabolic flexibility'],
                adjustments: ['Higher protein needs', 'Carb timing around training', 'Adequate calories']
            },
            peak: {
                focus: 'Performance optimization',
                priorities: ['Precision nutrition', 'Advanced protocols', 'Competitive advantage'],
                adjustments: ['Periodized nutrition', 'Supplement strategies', 'Recovery optimization']
            },
            entropy: {
                focus: 'Health span and longevity',
                priorities: ['Metabolic health', 'Inflammation reduction', 'Cognitive function'],
                adjustments: ['Reduce overall calories', 'Increase protein percentage', 'Focus on nutrient density']
            }
        };

        return recommendations[lifeStage] || recommendations.growth;
    };

    const generatePersonalizationRecommendations = (personData) => {
        const recommendations = [];

        // Age-based recommendations
        if (personData.age > 40) {
            recommendations.push({
                category: 'Metabolic Health',
                priority: 'High',
                items: [
                    'Consider time-restricted eating',
                    'Focus on anti-inflammatory foods',
                    'Monitor blood glucose response',
                    'Prioritize sleep and stress management'
                ]
            });
        }

        // Goal-based recommendations
        if (personData.goals?.includes('longevity')) {
            recommendations.push({
                category: 'Longevity',
                priority: 'High',
                items: [
                    'Emphasize polyphenol-rich foods',
                    'Practice caloric restriction mimetics',
                    'Include fasting protocols',
                    'Focus on micronutrient density'
                ]
            });
        }

        if (personData.goals?.includes('cognitive')) {
            recommendations.push({
                category: 'Brain Health',
                priority: 'High',
                items: [
                    'Include omega-3 fatty acids',
                    'Maintain stable blood sugar',
                    'Consider ketogenic periods',
                    'Hydration optimization'
                ]
            });
        }

        return recommendations;
    };

    return {
        classifyGainerType,
        getFiberRecommendations,
        getMileageRecommendations,
        validateSMARTGoals,
        generateSuggestions,
        saveAssessment,
        suggestions,
        loading,
        assessBLGs,
        assessFuel,
        assessPersonalization,
        calculateTDEE,
        calculateMacros,
        saveNutritionAssessment
    };
};
