import { useState, useEffect } from 'react';
import { useApp } from '../context';
import { APP_ACTIONS } from '../context/appActions';
// Note: Adjust this import path based on your Supabase client location
// import { supabase } from '../lib/supabaseClient';

export const useAssessment = () => {
    // Safe context access
    let state, dispatch;
    try {
        const context = useApp();
        state = context?.state;
        dispatch = context?.dispatch;

        console.log('useAssessment - Context check:', {
            hasContext: !!context,
            hasState: !!state,
            hasDispatch: !!dispatch
        });

    } catch (error) {
        console.error('useAssessment: Error accessing context:', error);
        // Provide fallback values
        state = { assessment: null };
        dispatch = () => console.warn('Dispatch not available');
    }

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

    // Save nutrition assessment
    const saveNutritionAssessment = async (nutritionData) => {
        setLoading(true);
        try {
            // Update context with nutrition data
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        nutrition: nutritionData
                    }
                });
            }

            // Store in localStorage as backup
            localStorage.setItem('nutrition_assessment', JSON.stringify(nutritionData));

            return { success: true, data: nutritionData };
        } catch (error) {
            console.error('Error saving nutrition assessment:', error);
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

        return {
            profile,
            tdee,
            macros,
            suggestions: generateFuelSuggestions(profile, macros, gainerType)
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

        return {
            deloading: deloadingOptions,
            elimination: eliminationPlan,
            recommendations: generatePersonalizationRecommendations(personData)
        };
    };

    // Generate fuel suggestions based on profile and gainer type
    const generateFuelSuggestions = (profile, macros, gainerType) => {
        const suggestions = [];

        if (profile === 'Inadequate') {
            suggestions.push({
                category: 'Foundation Building',
                priority: 'Critical',
                recommendations: [
                    'Focus on whole foods first (80%+ of meals)',
                    'Establish consistent meal timing',
                    'Reduce processed food intake gradually',
                    'Practice mindful eating habits'
                ]
            });
        }

        if (profile === 'Adequate') {
            suggestions.push({
                category: 'Optimization',
                priority: 'High',
                recommendations: [
                    `Target ${macros.protein.grams}g protein daily`,
                    `Aim for ${macros.carbs.grams}g carbohydrates around training`,
                    'Include healthy fats (nuts, oils, avocado)',
                    'Track intake for 2-3 weeks to establish patterns'
                ]
            });
        }

        // Gainer type specific suggestions
        if (gainerType?.type === 'Fast Gainer') {
            suggestions.push({
                category: 'Fast Gainer Protocol',
                priority: 'Medium',
                recommendations: [
                    'Lower carbohydrate intake on rest days',
                    'Focus on protein timing around workouts',
                    'Consider intermittent fasting windows',
                    'Monitor for quick glycemic responses'
                ]
            });
        } else if (gainerType?.type === 'Slow Gainer') {
            suggestions.push({
                category: 'Slow Gainer Protocol',
                priority: 'Medium',
                recommendations: [
                    'Higher carbohydrate intake to support volume',
                    'More frequent meals (4-6 times daily)',
                    'Focus on caloric density',
                    'Consider post-workout carbohydrates'
                ]
            });
        }

        return suggestions;
    };

    // Generate deloading protocols (earned after mastery)
    const generateDeloadingProtocols = (personData) => {
        return {
            carb_cycling: {
                name: 'Carbohydrate Cycling',
                description: 'Strategic carb manipulation for body composition',
                protocol: '3 low days (50-100g), 1 high day (200-300g)',
                benefits: ['Fat loss while maintaining performance', 'Metabolic flexibility'],
                prerequisites: ['Stable fuel habits for 8+ weeks']
            },
            intermittent_fasting: {
                name: 'Intermittent Fasting',
                description: 'Time-restricted eating windows',
                protocol: '16:8 or 18:6 eating windows',
                benefits: ['Simplified meal planning', 'Potential longevity benefits'],
                prerequisites: ['Good relationship with food', 'No eating disorders']
            },
            elimination_diets: {
                name: 'Systematic Elimination',
                description: 'Identify food sensitivities',
                protocol: '21-day elimination → systematic reintroduction',
                benefits: ['Identify trigger foods', 'Optimize digestion'],
                prerequisites: ['BLGs mastery', 'Fuel consistency']
            }
        };
    };

    // Generate 21-day elimination plan
    const generate21DayElimination = (aversions, symptoms) => {
        const commonTriggers = ['gluten', 'dairy', 'sugar', 'alcohol', 'caffeine', 'corn', 'soy'];

        const eliminationPlan = {
            phase1: {
                name: 'Elimination Phase',
                duration: '21 days',
                eliminated_foods: commonTriggers.filter(food => !aversions?.includes(food)),
                allowed_foods: [
                    'Vegetables (except nightshades)',
                    'Fruits (low glycemic)',
                    'Lean proteins',
                    'Nuts and seeds',
                    'Healthy oils'
                ],
                tracking: ['Energy levels', 'Digestion', 'Sleep quality', 'Mood', 'Skin']
            },
            phase2: {
                name: 'Reintroduction Phase',
                duration: '14 days',
                process: 'Add one food group every 3 days',
                order: ['dairy', 'gluten', 'sugar', 'alcohol'],
                monitoring: 'Track symptoms for 72 hours after each reintroduction'
            },
            phase3: {
                name: 'Personalization Phase',
                duration: 'Ongoing',
                outcome: 'Create personalized food guidelines based on responses'
            }
        };

        return eliminationPlan;
    };

    // Generate personalization recommendations
    const generatePersonalizationRecommendations = (personData) => {
        const recommendations = [];

        recommendations.push({
            category: 'Advanced Protocols',
            items: [
                'Experiment with meal timing around training',
                'Test supplement protocols (creatine, caffeine, etc.)',
                'Monitor biomarkers (blood work, HRV)',
                'Adjust based on training phases'
            ]
        });

        recommendations.push({
            category: 'Lifestyle Integration',
            items: [
                'Develop travel nutrition strategies',
                'Create social eating guidelines',
                'Build flexible meal preparation systems',
                'Establish long-term sustainability practices'
            ]
        });

        return recommendations;
    };

    // SCIENTIFIC PRINCIPLES OF STRENGTH TRAINING INTEGRATION

    // 1. SPECIFICITY PRINCIPLE - Broad to Narrow Spectrum Assessment
    const assessSpecificity = (specificityData, goals, biomotorData) => {
        const { preferredModalities, currentSpectrum, competitionLifts, trainingAge } = specificityData;

        // Determine optimal spectrum based on goals and experience
        const optimalSpectrum = determineOptimalSpectrum(goals, trainingAge, biomotorData);

        // Check for modality compatibility conflicts
        const compatibilityWarnings = checkModalityCompatibility(preferredModalities, goals);

        // Generate directed adaptation sequence
        const adaptationSequence = generateAdaptationSequence(goals, trainingAge, currentSpectrum);

        return {
            optimalSpectrum,
            compatibilityWarnings,
            adaptationSequence,
            recommendations: generateSpecificityRecommendations(optimalSpectrum, compatibilityWarnings)
        };
    };

    // Determine optimal training spectrum (broad → narrow)
    const determineOptimalSpectrum = (goals, trainingAge, biomotorData) => {
        // Novices benefit from broad spectrum (hypertrophy/general strength)
        if (trainingAge === 'beginner') {
            return {
                type: 'broad',
                focus: 'hypertrophy',
                repRange: '6-12',
                intensity: '60-75%',
                rationale: 'Build general strength base and muscle mass'
            };
        }

        // Competition-focused athletes need narrow spectrum
        if (goals.some(goal => goal.includes('competition') || goal.includes('powerlifting') || goal.includes('meet'))) {
            return {
                type: 'narrow',
                focus: 'competition_specific',
                repRange: '1-3',
                intensity: '85-100%',
                rationale: 'Practice competition lifts and neurological adaptations'
            };
        }

        // Intermediate athletes - transition based on goals
        if (goals.some(goal => goal.includes('strength') || goal.includes('1RM'))) {
            return {
                type: 'moderate',
                focus: 'strength',
                repRange: '3-6',
                intensity: '75-90%',
                rationale: 'Build maximum strength with some specificity'
            };
        }

        // Default to broad for hypertrophy/general fitness
        return {
            type: 'broad',
            focus: 'hypertrophy',
            repRange: '6-12',
            intensity: '60-80%',
            rationale: 'Maximize muscle growth and general strength'
        };
    };

    // Check for modality compatibility conflicts
    const checkModalityCompatibility = (modalities, goals) => {
        const warnings = [];

        // Strength + Endurance conflict
        if (modalities.includes('endurance') && modalities.includes('strength')) {
            warnings.push({
                type: 'strength_endurance_conflict',
                severity: 'high',
                title: 'Strength/Endurance Interference',
                description: 'Concurrent training can reduce strength gains through:',
                mechanisms: [
                    'Muscle catabolism from excessive cardio',
                    'Accumulated fatigue limiting strength training quality',
                    'Fiber type shifts toward Type I (slow-twitch)',
                    'Reduced protein synthesis signaling'
                ],
                suggestions: [
                    'Limit cardio to 2-3 sessions/week if strength is priority',
                    'Separate strength and cardio by 6+ hours',
                    'Focus on low-impact steady state over HIIT',
                    'Prioritize one quality over the other'
                ]
            });
        }

        // Strength + Flexibility conflict  
        if (modalities.includes('flexibility') && modalities.includes('strength')) {
            warnings.push({
                type: 'strength_flexibility_conflict',
                severity: 'medium',
                title: 'Strength/Flexibility Balance',
                description: 'Excessive flexibility work can compromise:',
                mechanisms: [
                    'Reduced stretch-shortening cycle efficiency',
                    'Decreased joint stability',
                    'Altered muscle activation patterns'
                ],
                suggestions: [
                    'Focus flexibility work post-workout',
                    'Emphasize dynamic over static stretching pre-workout',
                    'Target specific mobility limitations only',
                    'Maintain strength through full ROM'
                ]
            });
        }

        // Strength + Power volume limits
        if (modalities.includes('power') && modalities.includes('strength')) {
            warnings.push({
                type: 'strength_power_volume',
                severity: 'low',
                title: 'Strength/Power Volume Management',
                description: 'High-intensity combination requires careful volume management:',
                mechanisms: [
                    'CNS fatigue accumulation',
                    'Quality degradation with high volumes',
                    'Recovery limitations'
                ],
                suggestions: [
                    'Alternate strength and power emphasis',
                    'Reduce volume when combining both',
                    'Prioritize movement quality over quantity',
                    'Plan adequate recovery between sessions'
                ]
            });
        }

        // Non-specific training for competition goals
        if (goals.some(goal => goal.includes('competition')) && modalities.includes('bodybuilding')) {
            warnings.push({
                type: 'specificity_mismatch',
                severity: 'medium',
                title: 'Competition Specificity Gap',
                description: 'Bodybuilding methods may not transfer to competition performance:',
                mechanisms: [
                    'Different rep ranges and intensities',
                    'Isolation vs. compound movement focus',
                    'Technique practice limitations'
                ],
                suggestions: [
                    'Transition to competition-specific training blocks',
                    'Practice competition lifts regularly',
                    'Reduce isolation work closer to competition',
                    'Focus on strength qualities that transfer'
                ]
            });
        }

        return warnings;
    };

    // Generate directed adaptation sequence 
    const generateAdaptationSequence = (goals, trainingAge, currentSpectrum) => {
        const sequence = [];

        // Novice sequence: Always start broad
        if (trainingAge === 'beginner') {
            sequence.push({
                phase: 'accumulation',
                block: 'hypertrophy',
                duration: '8-12 weeks',
                focus: 'Build muscle mass and movement patterns',
                spectrum: 'broad',
                intensity: '60-75%',
                volume: 'high',
                exercises: 'Compound movements + assistance',
                unlocked: true
            });

            sequence.push({
                phase: 'intensification',
                block: 'general_strength',
                duration: '6-8 weeks',
                focus: 'Increase force production',
                spectrum: 'moderate',
                intensity: '75-85%',
                volume: 'moderate',
                exercises: 'Competition lifts + variations',
                unlocked: false,
                prerequisite: 'Complete hypertrophy block'
            });
        }

        // Intermediate/Advanced sequence based on goals
        if (trainingAge === 'intermediate' || trainingAge === 'advanced') {
            // Competition prep sequence
            if (goals.some(goal => goal.includes('competition') || goal.includes('meet'))) {
                sequence.push({
                    phase: 'accumulation',
                    block: 'volume_block',
                    duration: '4-6 weeks',
                    focus: 'Build work capacity',
                    spectrum: 'moderate',
                    intensity: '70-80%',
                    volume: 'high',
                    unlocked: true
                });

                sequence.push({
                    phase: 'intensification',
                    block: 'strength_block',
                    duration: '4-5 weeks',
                    focus: 'Maximize strength',
                    spectrum: 'narrow',
                    intensity: '80-95%',
                    volume: 'moderate',
                    unlocked: false,
                    prerequisite: 'Complete volume block'
                });

                sequence.push({
                    phase: 'peaking',
                    block: 'competition_prep',
                    duration: '2-3 weeks',
                    focus: 'Peak for competition',
                    spectrum: 'narrow',
                    intensity: '90-105%',
                    volume: 'low',
                    unlocked: false,
                    prerequisite: 'Complete strength block'
                });

                sequence.push({
                    phase: 'deload',
                    block: 'recovery',
                    duration: '1 week',
                    focus: 'Recovery and supercompensation',
                    unlocked: false,
                    prerequisite: 'Complete peaking block'
                });
            }

            // General strength/hypertrophy sequence
            else {
                sequence.push({
                    phase: 'accumulation',
                    block: 'hypertrophy',
                    duration: '6-8 weeks',
                    focus: 'Muscle growth',
                    spectrum: 'broad',
                    intensity: '65-80%',
                    volume: 'high',
                    unlocked: true
                });

                sequence.push({
                    phase: 'intensification',
                    block: 'strength',
                    duration: '4-6 weeks',
                    focus: 'Strength gains',
                    spectrum: 'moderate',
                    intensity: '80-90%',
                    volume: 'moderate',
                    unlocked: false,
                    prerequisite: 'Complete hypertrophy block'
                });
            }
        }

        return sequence;
    };

    // Generate specificity recommendations
    const generateSpecificityRecommendations = (optimalSpectrum, compatibilityWarnings) => {
        const recommendations = [];

        // Spectrum-based recommendations
        if (optimalSpectrum.type === 'broad') {
            recommendations.push({
                category: 'Exercise Selection',
                priority: 'High',
                items: [
                    'Focus on compound movements (squat, bench, deadlift)',
                    'Include assistance exercises for weak points',
                    'Use various rep ranges (6-15) for different adaptations',
                    'Practice movement patterns with lighter loads'
                ]
            });
        } else if (optimalSpectrum.type === 'narrow') {
            recommendations.push({
                category: 'Competition Specificity',
                priority: 'High',
                items: [
                    'Practice exact competition commands and timing',
                    'Use competition equipment and gear',
                    'Focus 80%+ training on competition lifts',
                    'Minimize assistance work to movement prep only'
                ]
            });
        }

        // Compatibility-based recommendations
        compatibilityWarnings.forEach(warning => {
            if (warning.severity === 'high') {
                recommendations.push({
                    category: 'Conflict Resolution',
                    priority: 'Critical',
                    items: warning.suggestions
                });
            }
        });

        return recommendations;
    };

    // Calculate training variables based on principles
    const calculateTrainingVariables = (specificityData, gainerType, biomotorData) => {
        const { spectrum, goals } = specificityData;

        // Base calculations on gainer type (Bryant integration)
        let baseVolume = gainerType?.type === 'Fast Gainer' ? 12 : 18; // sets per week
        let baseIntensity = 75; // % 1RM
        let baseFrequency = 3; // sessions per week

        // Adjust for specificity spectrum
        if (spectrum === 'narrow') {
            baseIntensity += 10; // Higher intensity for competition prep
            baseVolume -= 4; // Lower volume for recovery
            baseFrequency = 4; // Higher frequency for skill practice
        } else if (spectrum === 'broad') {
            baseIntensity -= 5; // Lower intensity for hypertrophy
            baseVolume += 6; // Higher volume for growth
            baseFrequency = 3; // Standard frequency
        }

        // Adjust for biomotor qualities (NSCA integration)
        if (biomotorData?.strength >= 8) {
            baseIntensity += 5; // Advanced athletes can handle more
        }
        if (biomotorData?.endurance >= 7) {
            baseVolume += 2; // Good recovery allows more volume
        }

        return {
            volume: {
                setsPerWeek: baseVolume,
                repsPerSet: spectrum === 'narrow' ? '1-3' : spectrum === 'broad' ? '8-12' : '4-6'
            },
            intensity: {
                percentage: baseIntensity,
                relative: baseIntensity >= 85 ? 'High' : baseIntensity >= 70 ? 'Moderate' : 'Low'
            },
            frequency: {
                sessionsPerWeek: baseFrequency,
                daysOff: 7 - baseFrequency
            }
        };
    };

    // Validate training phase progression
    const validatePhaseProgression = (currentPhase, targetPhase, adaptationSequence) => {
        const currentIndex = adaptationSequence.findIndex(phase => phase.block === currentPhase);
        const targetIndex = adaptationSequence.findIndex(phase => phase.block === targetPhase);

        if (targetIndex <= currentIndex) {
            return { valid: true, message: 'Phase progression is valid' };
        }

        // Check if prerequisites are met
        const requiredPhases = adaptationSequence.slice(currentIndex + 1, targetIndex + 1);
        const unlockedPhases = requiredPhases.filter(phase => phase.unlocked);

        if (unlockedPhases.length < requiredPhases.length) {
            const nextPhase = requiredPhases.find(phase => !phase.unlocked);
            return {
                valid: false,
                message: `Must complete ${nextPhase.prerequisite} before advancing to ${targetPhase}`,
                nextPhase: nextPhase.block
            };
        }

        return { valid: true, message: 'Ready to advance phase' };
    };

    // Save specificity assessment
    const saveSpecificityAssessment = async (specificityData) => {
        setLoading(true);
        try {
            // Update context with specificity data
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        specificity: specificityData
                    }
                });
            }

            // Store in localStorage as backup
            localStorage.setItem('specificity_assessment', JSON.stringify(specificityData));

            return { success: true, data: specificityData };
        } catch (error) {
            console.error('Error saving specificity assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // OVERLOAD PRINCIPLE ASSESSMENT

    // Assess overload based on homeostatic disruption variables
    const assessOverload = (overloadData, gainerType, currentPhase) => {
        const { volume, intensity, frequency, exerciseSelection, failureProximity, baseline } = overloadData;

        // Calculate Maximum Recoverable Volume (MRV) by phase
        const mrvByPhase = calculateMRVByPhase(gainerType, currentPhase);

        // Assess homeostatic disruption level
        const disruptionLevel = calculateHomeostasisDisruption(overloadData);

        // Generate overload progression recommendations
        const progressionPlan = generateOverloadProgression(overloadData, mrvByPhase, gainerType);

        // Check for overload optimization opportunities
        const optimizations = assessOverloadOptimization(overloadData, exerciseSelection);

        return {
            mrvByPhase,
            disruptionLevel,
            progressionPlan,
            optimizations,
            currentLoad: calculateCurrentLoad(volume, intensity, frequency),
            recommendations: generateOverloadRecommendations(disruptionLevel, mrvByPhase, currentPhase)
        };
    };

    // Calculate MRV by training phase
    const calculateMRVByPhase = (gainerType, currentPhase) => {
        // Base MRV from gainer type classification
        const baseMRV = {
            'Very Fast Gainer': { hypertrophy: 10, strength: 8, peaking: 6 },
            'Fast Gainer': { hypertrophy: 14, strength: 12, peaking: 8 },
            'Slow Gainer': { hypertrophy: 20, strength: 16, peaking: 12 },
            'Very Slow Gainer': { hypertrophy: 26, strength: 20, peaking: 14 }
        };

        const gainerMRV = baseMRV[gainerType?.type] || baseMRV['Fast Gainer'];

        return {
            hypertrophy: {
                sets: gainerMRV.hypertrophy,
                repsRange: '8-15',
                intensityRange: '60-75%',
                proximityToFailure: '1-3 RIR',
                description: 'Highest MRV phase - focus on volume accumulation'
            },
            strength: {
                sets: gainerMRV.strength,
                repsRange: '3-6',
                intensityRange: '75-90%',
                proximityToFailure: '2-4 RIR',
                description: 'Moderate MRV - balance intensity and volume'
            },
            peaking: {
                sets: gainerMRV.peaking,
                repsRange: '1-3',
                intensityRange: '90-105%',
                proximityToFailure: '0-1 RIR',
                description: 'Lowest MRV - prioritize intensity and technique'
            },
            activeRecovery: {
                sets: Math.round(gainerMRV.hypertrophy * 0.25),
                repsRange: '5-10',
                intensityRange: '40-60%',
                proximityToFailure: '5+ RIR',
                description: 'Deload phase - maintain movement patterns'
            }
        };
    };

    // Calculate homeostatic disruption level
    const calculateHomeostasisDisruption = (overloadData) => {
        const { volume, intensity, frequency, failureProximity } = overloadData;

        // Volume disruption (sets * reps * weight)
        const volumeDisruption = (volume.sets * volume.reps * intensity) / 100;

        // Intensity disruption (higher % = more neural stress)
        const intensityDisruption = intensity >= 90 ? 3 : intensity >= 80 ? 2 : 1;

        // Frequency disruption (sessions per week)
        const frequencyDisruption = frequency >= 6 ? 3 : frequency >= 4 ? 2 : 1;

        // Failure proximity disruption (lower RIR = higher stress)
        const failureDisruption = failureProximity <= 1 ? 3 : failureProximity <= 3 ? 2 : 1;

        const totalDisruption = volumeDisruption + intensityDisruption + frequencyDisruption + failureDisruption;

        let level, description, recoveryTime;

        if (totalDisruption <= 8) {
            level = 'minimal';
            description = 'Low homeostatic disruption - sustainable long-term';
            recoveryTime = '12-24 hours';
        } else if (totalDisruption <= 15) {
            level = 'moderate';
            description = 'Moderate disruption - drives adaptations effectively';
            recoveryTime = '24-48 hours';
        } else if (totalDisruption <= 22) {
            level = 'high';
            description = 'High disruption - requires careful monitoring';
            recoveryTime = '48-72 hours';
        } else {
            level = 'excessive';
            description = 'Excessive disruption - risk of overreaching/overtraining';
            recoveryTime = '72+ hours';
        }

        return {
            level,
            score: totalDisruption,
            description,
            recoveryTime,
            breakdown: {
                volume: volumeDisruption,
                intensity: intensityDisruption,
                frequency: frequencyDisruption,
                failure: failureDisruption
            }
        };
    };

    // Generate overload progression plan
    const generateOverloadProgression = (currentLoad, mrvByPhase, gainerType) => {
        const progression = [];

        // Step 1: Assess baseline
        progression.push({
            step: 1,
            title: 'Baseline Assessment',
            action: 'Establish current 1RM and rep maxes',
            duration: '1-2 weeks',
            metrics: ['1RM testing', 'Rep max at 70%, 80%, 90%', 'Recovery time between sessions'],
            example: 'Bench Press: Test 1RM, then 8RM at 70%, 5RM at 80%, 3RM at 90%'
        });

        // Step 2: Progressive overload
        const currentPhase = Object.keys(mrvByPhase)[0]; // Default to first phase
        const phaseData = mrvByPhase[currentPhase];

        progression.push({
            step: 2,
            title: 'Variable Manipulation',
            action: 'Systematically increase training variables',
            duration: '4-8 weeks',
            options: [
                {
                    variable: 'Volume',
                    method: 'Add 1 set per week until MRV reached',
                    example: `Week 1: ${phaseData.sets - 2} sets → Week 4: ${phaseData.sets} sets`
                },
                {
                    variable: 'Intensity',
                    method: 'Increase load by 2.5-5% when rep target achieved',
                    example: 'Bench 300lbs 3x8 @70% → 3x8 @75% when 8 reps achieved'
                },
                {
                    variable: 'Frequency',
                    method: 'Add training session when recovery allows',
                    example: '3x/week → 4x/week if performance maintained'
                },
                {
                    variable: 'Exercise Selection',
                    method: 'Prioritize specific movements, minimize non-specific',
                    example: 'Competition lifts 80%, assistance 20%'
                },
                {
                    variable: 'Failure Proximity',
                    method: 'Gradually reduce RIR during intensification',
                    example: '4 RIR → 3 RIR → 2 RIR over mesocycle'
                }
            ]
        });

        // Step 3: Monitor and adjust
        progression.push({
            step: 3,
            title: 'Recovery Monitoring',
            action: 'Track adaptation vs fatigue accumulation',
            duration: 'Ongoing',
            indicators: [
                'Performance maintenance/improvement',
                'Sleep quality and duration',
                'Subjective recovery scores',
                'Heart rate variability (if available)',
                'Fatigue proxy symptoms'
            ],
            adjustments: [
                'Reduce volume if performance declines',
                'Add deload week if multiple proxies indicate overreaching',
                'Increase calories/carbs if fuel stores depleted'
            ]
        });

        return progression;
    };

    // Assess overload optimization opportunities
    const assessOverloadOptimization = (overloadData, exerciseSelection) => {
        const optimizations = [];

        // Check exercise specificity ratio
        const specificRatio = exerciseSelection.specific / (exerciseSelection.specific + exerciseSelection.nonSpecific);

        if (specificRatio < 0.8) {
            optimizations.push({
                category: 'Exercise Selection',
                priority: 'High',
                issue: 'Too much non-specific training reducing recovery for main lifts',
                solution: 'Increase specific movement ratio to 80%+',
                impact: 'Improved recovery capacity for competition lifts',
                example: 'Replace 2 accessory exercises with competition lift variations'
            });
        }

        // Check volume distribution
        if (overloadData.volume.sets > 20) {
            optimizations.push({
                category: 'Volume Management',
                priority: 'Medium',
                issue: 'High volume may be exceeding MRV',
                solution: 'Redistribute volume across more sessions or reduce total',
                impact: 'Better recovery and adaptation quality',
                example: 'Split 24 sets across 4 sessions instead of 3'
            });
        }

        // Check intensity clustering
        if (overloadData.intensity > 85 && overloadData.frequency > 4) {
            optimizations.push({
                category: 'Intensity-Frequency Balance',
                priority: 'High',
                issue: 'High intensity + high frequency = excessive neural stress',
                solution: 'Reduce frequency or implement intensity cycling',
                impact: 'Reduced neural fatigue, maintained strength gains',
                example: 'Alternate heavy (90%) and moderate (75%) sessions'
            });
        }

        return optimizations;
    };

    // Calculate current training load
    const calculateCurrentLoad = (volume, intensity, frequency) => {
        const weeklyLoad = volume.sets * volume.reps * (intensity / 100) * frequency;

        return {
            weeklyLoad: Math.round(weeklyLoad),
            sessionsPerWeek: frequency,
            setsPerSession: Math.round(volume.sets / frequency),
            relativeIntensity: intensity >= 90 ? 'Very High' :
                intensity >= 80 ? 'High' :
                    intensity >= 70 ? 'Moderate' : 'Low'
        };
    };

    // FATIGUE MANAGEMENT ASSESSMENT

    // Assess fatigue across four contributor categories
    const assessFatigue = (fatigueData, trainingLoad, lifestyle) => {
        // Assess each fatigue contributor
        const fuelFatigue = assessFuelFatigue(fatigueData.fuel, trainingLoad);
        const nervousFatigue = assessNervousFatigue(fatigueData.nervous, trainingLoad);
        const messengerFatigue = assessMessengerFatigue(fatigueData.messengers, trainingLoad);
        const tissueFatigue = assessTissueFatigue(fatigueData.tissues, trainingLoad);

        // Determine overall fatigue state
        const overallState = determineFatigueState(fuelFatigue, nervousFatigue, messengerFatigue, tissueFatigue);

        // Generate management strategies
        const managementStrategies = generateFatigueManagement(overallState, lifestyle);

        // Calculate recovery timeline
        const recoveryTimeline = calculateRecoveryTimeline(fuelFatigue, nervousFatigue, messengerFatigue, tissueFatigue);

        return {
            contributors: {
                fuel: fuelFatigue,
                nervous: nervousFatigue,
                messengers: messengerFatigue,
                tissues: tissueFatigue
            },
            overallState,
            managementStrategies,
            recoveryTimeline,
            recommendations: generateFatigueRecommendations(overallState, managementStrategies)
        };
    };

    // Assess fuel store fatigue (ATP/CP, Glucose/Glycogen, Fat)
    const assessFuelFatigue = (fuelData, trainingLoad) => {
        const { glycogenStores, muscleFullness, energyLevels, postWorkoutFatigue } = fuelData;

        // Glycogen depletion score (key for reps < 10)
        const glycogenScore = glycogenStores <= 3 ? 8 : glycogenStores <= 5 ? 5 : glycogenStores <= 7 ? 3 : 1;

        // Training volume impact on fuel depletion
        const volumeImpact = trainingLoad.weeklyLoad > 1000 ? 3 : trainingLoad.weeklyLoad > 500 ? 2 : 1;

        const totalScore = glycogenScore + volumeImpact + (10 - muscleFullness) + (10 - energyLevels);

        let level, description, recoveryTime;

        if (totalScore <= 8) {
            level = 'minimal';
            description = 'Fuel stores adequate, energy levels stable';
            recoveryTime = 'hours';
        } else if (totalScore <= 15) {
            level = 'moderate';
            description = 'Some fuel depletion, manageable with nutrition';
            recoveryTime = '1-2 days';
        } else if (totalScore <= 22) {
            level = 'high';
            description = 'Significant fuel depletion affecting performance';
            recoveryTime = '2-3 days';
        } else {
            level = 'severe';
            description = 'Critical fuel depletion, training quality compromised';
            recoveryTime = '3-7 days';
        }

        return {
            level,
            score: totalScore,
            description,
            recoveryTime,
            proxies: {
                glycogenDepletion: glycogenStores <= 5,
                reducedMuscleFullness: muscleFullness <= 6,
                lowEnergy: energyLevels <= 5,
                prolongedFatigue: postWorkoutFatigue > 4
            }
        };
    };

    // Assess nervous system fatigue
    const assessNervousFatigue = (nervousData, trainingLoad) => {
        const { forceOutput, techniqueQuality, motivation, learningRate, sleepQuality } = nervousData;

        // Volume is primary driver, intensity incremental
        const volumeScore = trainingLoad.weeklyLoad > 1200 ? 6 : trainingLoad.weeklyLoad > 800 ? 4 : 2;
        const intensityScore = trainingLoad.relativeIntensity === 'Very High' ? 4 :
            trainingLoad.relativeIntensity === 'High' ? 2 : 1;

        // Performance indicators
        const performanceScore = (10 - forceOutput) + (10 - techniqueQuality) + (10 - motivation);

        const totalScore = volumeScore + intensityScore + performanceScore + (10 - sleepQuality);

        let level, description, recoveryTime;

        if (totalScore <= 10) {
            level = 'minimal';
            description = 'Neural efficiency maintained, technique stable';
            recoveryTime = 'days';
        } else if (totalScore <= 18) {
            level = 'moderate';
            description = 'Some neural fatigue, minor technique degradation';
            recoveryTime = '3-7 days';
        } else if (totalScore <= 26) {
            level = 'high';
            description = 'Significant neural fatigue, noticeable force reduction';
            recoveryTime = '1-2 weeks';
        } else {
            level = 'severe';
            description = 'Severe neural fatigue, major technique breakdowns';
            recoveryTime = '2-4 weeks';
        }

        return {
            level,
            score: totalScore,
            description,
            recoveryTime,
            proxies: {
                reducedForce: forceOutput <= 6,
                techniqueBreakdown: techniqueQuality <= 6,
                lowMotivation: motivation <= 5,
                poorLearning: learningRate <= 5,
                sleepIssues: sleepQuality <= 6
            }
        };
    };

    // Assess chemical messenger fatigue
    const assessMessengerFatigue = (messengerData, trainingLoad) => {
        const { moodSwings, inflammation, hormoneSymptoms, recoveryRate, soreness } = messengerData;

        // High volume activates AMPK (catabolic) over mTOR (anabolic)
        const volumeScore = trainingLoad.weeklyLoad > 1000 ? 8 : trainingLoad.weeklyLoad > 600 ? 5 : 2;

        // Inflammation and hormonal disruption
        const inflammationScore = inflammation >= 7 ? 6 : inflammation >= 5 ? 3 : 1;
        const hormoneScore = hormoneSymptoms >= 6 ? 4 : hormoneSymptoms >= 4 ? 2 : 1;

        const totalScore = volumeScore + inflammationScore + hormoneScore + moodSwings + (10 - recoveryRate);

        let level, description, recoveryTime;

        if (totalScore <= 12) {
            level = 'minimal';
            description = 'Hormonal balance maintained, normal inflammation';
            recoveryTime = 'weeks';
        } else if (totalScore <= 20) {
            level = 'moderate';
            description = 'Some hormonal disruption, elevated inflammation';
            recoveryTime = '2-3 weeks';
        } else if (totalScore <= 28) {
            level = 'high';
            description = 'Significant hormonal imbalance, chronic inflammation';
            recoveryTime = '4-6 weeks';
        } else {
            level = 'severe';
            description = 'Severe hormonal disruption, systemic inflammation';
            recoveryTime = '6-12 weeks';
        }

        return {
            level,
            score: totalScore,
            description,
            recoveryTime,
            proxies: {
                elevatedInflammation: inflammation >= 6,
                hormoneDisruption: hormoneSymptoms >= 5,
                moodInstability: moodSwings >= 6,
                slowRecovery: recoveryRate <= 5,
                chronicSoreness: soreness >= 7
            }
        };
    };

    // Assess tissue structure fatigue
    const assessTissueFatigue = (tissueData, trainingLoad) => {
        const { jointPain, muscleTightness, tendonIssues, overuseSymptoms, injuryHistory } = tissueData;

        // Accumulated microdamage from training
        const microtraumaScore = (jointPain + muscleTightness + tendonIssues + overuseSymptoms) / 4;

        // Training load impact on tissue stress
        const loadScore = trainingLoad.weeklyLoad > 800 ? 4 : trainingLoad.weeklyLoad > 400 ? 2 : 1;

        // Injury history increases susceptibility
        const historyScore = injuryHistory >= 3 ? 3 : injuryHistory >= 1 ? 2 : 1;

        const totalScore = microtraumaScore + loadScore + historyScore;

        let level, description, recoveryTime;

        if (totalScore <= 8) {
            level = 'minimal';
            description = 'Tissues adapting well, minimal structural stress';
            recoveryTime = 'weeks';
        } else if (totalScore <= 12) {
            level = 'moderate';
            description = 'Some tissue stress, manageable with recovery protocols';
            recoveryTime = '4-8 weeks';
        } else if (totalScore <= 16) {
            level = 'high';
            description = 'Significant tissue stress, injury risk elevated';
            recoveryTime = '2-4 months';
        } else {
            level = 'severe';
            description = 'Critical tissue stress, chronic injury likely';
            recoveryTime = '4-12 months';
        }

        return {
            level,
            score: totalScore,
            description,
            recoveryTime,
            proxies: {
                jointDiscomfort: jointPain >= 6,
                excessiveTightness: muscleTightness >= 7,
                tendonProblems: tendonIssues >= 5,
                overusePattern: overuseSymptoms >= 6,
                injuryProne: injuryHistory >= 2
            }
        };
    };

    // Determine overall fatigue state
    const determineFatigueState = (fuel, nervous, messengers, tissues) => {
        const scores = [fuel.score, nervous.score, messengers.score, tissues.score];
        const maxScore = Math.max(...scores);
        const avgScore = scores.reduce((a, b) => a + b, 0) / 4;

        // Check for overtraining indicators
        const severeCount = [fuel, nervous, messengers, tissues].filter(f => f.level === 'severe').length;
        const highCount = [fuel, nervous, messengers, tissues].filter(f => f.level === 'high').length;

        let state, description, action;

        if (severeCount >= 2 || maxScore > 30) {
            state = 'overtraining';
            description = 'Net-negative state requiring extended recovery';
            action = 'Active rest phase (1/4 normal volume) for 4-8 weeks';
        } else if (severeCount >= 1 || highCount >= 2 || maxScore > 25) {
            state = 'non_functional_overreaching';
            description = 'Accidental overreach affecting performance';
            action = 'Immediate deload (50% volume) for 1-2 weeks';
        } else if (highCount >= 1 || avgScore > 18) {
            state = 'functional_overreaching';
            description = 'Intentional overreach before planned deload';
            action = 'Continue 1-3 weeks then deload';
        } else {
            state = 'normal';
            description = 'At or below MRV, positive adaptations occurring';
            action = 'Continue current training load';
        }

        return {
            state,
            description,
            action,
            riskLevel: severeCount >= 1 ? 'high' : highCount >= 2 ? 'moderate' : 'low'
        };
    };

    // Generate fatigue management strategies
    const generateFatigueManagement = (overallState, lifestyle) => {
        const strategies = [];

        // Light sessions strategy
        if (overallState.state === 'functional_overreaching' || overallState.state === 'non_functional_overreaching') {
            strategies.push({
                type: 'light_sessions',
                description: 'Low volume, high intensity sessions to maintain adaptations',
                protocol: {
                    volume: '50-60% of normal',
                    intensity: '80-90% of normal',
                    frequency: 'Every other planned session'
                },
                benefits: ['Maintains strength', 'Reduces fatigue accumulation', 'Preserves neural patterns'],
                duration: '1-2 weeks'
            });
        }

        // Deload strategy
        if (overallState.state !== 'normal') {
            const deloadIntensity = overallState.state === 'overtraining' ? 25 : 50;
            strategies.push({
                type: 'deload',
                description: `Reduce training volume to ${deloadIntensity}% of normal`,
                protocol: {
                    volume: `${deloadIntensity}% of normal volume`,
                    intensity: 'Maintain or slightly reduce',
                    focus: 'Movement quality and recovery'
                },
                duration: overallState.state === 'overtraining' ? '4-8 weeks' : '1-2 weeks'
            });
        }

        // Active rest strategy
        if (overallState.state === 'overtraining') {
            strategies.push({
                type: 'active_rest',
                description: 'Complete break from intense training',
                protocol: {
                    volume: '25% of normal volume',
                    intensity: '40-60% intensity',
                    activities: ['Light movement', 'Mobility work', 'Recreation']
                },
                duration: '4-12 weeks depending on severity'
            });
        }

        // Recovery enhancement based on lifestyle factors
        if (lifestyle.sleep < 7) {
            strategies.push({
                type: 'sleep_optimization',
                description: 'Prioritize sleep quantity and quality',
                targets: ['7-9 hours nightly', 'Consistent bedtime', 'Dark, cool environment'],
                impact: 'Improves all fatigue categories'
            });
        }

        if (lifestyle.stress >= 7) {
            strategies.push({
                type: 'stress_management',
                description: 'Reduce external stressors that impair recovery',
                methods: ['Meditation', 'Time management', 'Social support', 'Professional help'],
                impact: 'Increases MRV and recovery capacity'
            });
        }

        return strategies;
    };

    // Calculate recovery timeline for each fatigue type
    const calculateRecoveryTimeline = (fuel, nervous, messengers, tissues) => {
        return {
            fuel: {
                timeframe: fuel.recoveryTime,
                priority: 'Immediate',
                methods: ['Increase carbohydrates', 'Post-workout nutrition', 'Hydration']
            },
            nervous: {
                timeframe: nervous.recoveryTime,
                priority: 'Short-term',
                methods: ['Reduce volume/intensity', 'Improve sleep', 'Stress management']
            },
            messengers: {
                timeframe: messengers.recoveryTime,
                priority: 'Medium-term',
                methods: ['Low-volume phases', 'Anti-inflammatory foods', 'Hormone support']
            },
            tissues: {
                timeframe: tissues.recoveryTime,
                priority: 'Long-term',
                methods: ['Active rest', 'Physical therapy', 'Load management']
            }
        };
    };

    // Generate overload recommendations
    const generateOverloadRecommendations = (disruptionLevel, mrvByPhase, currentPhase) => {
        const recommendations = [];

        if (disruptionLevel.level === 'excessive') {
            recommendations.push({
                category: 'Immediate Action',
                priority: 'Critical',
                items: [
                    'Reduce training volume by 30-50%',
                    'Increase rest days to 2-3 per week',
                    'Focus on sleep and nutrition optimization',
                    'Consider medical evaluation if symptoms persist'
                ]
            });
        } else if (disruptionLevel.level === 'high') {
            recommendations.push({
                category: 'Load Management',
                priority: 'High',
                items: [
                    'Monitor daily readiness scores',
                    'Implement planned deload week',
                    'Reduce proximity to failure by 1-2 RIR',
                    'Add light session between hard sessions'
                ]
            });
        }

        // Phase-specific recommendations
        const phaseData = mrvByPhase[currentPhase];
        if (phaseData) {
            recommendations.push({
                category: `${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase Guidelines`,
                priority: 'Medium',
                items: [
                    `Target ${phaseData.sets} sets per week`,
                    `Use ${phaseData.repsRange} rep range`,
                    `Train at ${phaseData.intensityRange} intensity`,
                    `Maintain ${phaseData.proximityToFailure} from failure`
                ]
            });
        }

        return recommendations;
    };

    // Generate fatigue recommendations
    const generateFatigueRecommendations = (overallState, strategies) => {
        const recommendations = [];

        // State-specific recommendations
        if (overallState.state === 'overtraining') {
            recommendations.push({
                category: 'Critical Recovery',
                priority: 'Critical',
                items: [
                    'Implement immediate active rest phase',
                    'Seek medical evaluation for hormonal assessment',
                    'Address sleep, nutrition, and stress comprehensively',
                    'Consider 4-12 week recovery timeline'
                ]
            });
        } else if (overallState.state === 'non_functional_overreaching') {
            recommendations.push({
                category: 'Recovery Protocol',
                priority: 'High',
                items: [
                    'Immediate 50% volume reduction',
                    'Add extra rest day this week',
                    'Focus on stress management and sleep',
                    'Monitor for improvement in 7-14 days'
                ]
            });
        }

        // Strategy-based recommendations
        strategies.forEach(strategy => {
            if (strategy.type === 'light_sessions') {
                recommendations.push({
                    category: 'Light Session Protocol',
                    priority: 'Medium',
                    items: [
                        `Reduce volume to ${strategy.protocol.volume}`,
                        `Maintain ${strategy.protocol.intensity} intensity`,
                        'Focus on movement quality over quantity',
                        'Use these sessions for skill practice'
                    ]
                });
            }
        });

        return recommendations;
    };

    // Save overload assessment
    const saveOverloadAssessment = async (overloadData) => {
        setLoading(true);
        try {
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        overload: overloadData
                    }
                });
            }

            localStorage.setItem('overload_assessment', JSON.stringify(overloadData));
            return { success: true, data: overloadData };
        } catch (error) {
            console.error('Error saving overload assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Save fatigue assessment
    const saveFatigueAssessment = async (fatigueData) => {
        setLoading(true);
        try {
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        fatigue: fatigueData
                    }
                });
            }

            localStorage.setItem('fatigue_assessment', JSON.stringify(fatigueData));
            return { success: true, data: fatigueData };
        } catch (error) {
            console.error('Error saving fatigue assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // BRYANT PERIODIZATION PHA HEALTH SCREENING

    // Assess PHA (Peripheral Heart Action) eligibility based on Bryant research
    const assessPHAHealth = (phaHealthData) => {
        const { highBP, cardiacHistory, fitness } = phaHealthData;

        // Determine contraindication status based on Bryant guidelines
        const contraindications = [];
        let eligibilityScore = 10; // Start with full eligibility

        // High blood pressure contraindication
        if (highBP) {
            contraindications.push({
                factor: 'High Blood Pressure',
                severity: 'critical',
                description: 'PHA circuits create significant cardiovascular stress',
                impact: 'Complete contraindication for no-rest circuits'
            });
            eligibilityScore -= 10; // Complete disqualification
        }

        // Cardiac history contraindication
        if (cardiacHistory) {
            contraindications.push({
                factor: 'Cardiac History',
                severity: 'critical',
                description: 'Previous heart conditions increase risk during high-intensity circuits',
                impact: 'Medical clearance required before PHA participation'
            });
            eligibilityScore -= 8; // Near complete disqualification
        }

        // Poor fitness level contraindication
        if (fitness === 'poor') {
            contraindications.push({
                factor: 'Poor Cardiovascular Fitness',
                severity: 'moderate',
                description: 'Insufficient fitness base for high-intensity no-rest training',
                impact: 'Build fitness base before attempting PHA circuits'
            });
            eligibilityScore -= 6; // Significant concern
        }

        // Determine final eligibility status
        let eligibilityStatus, recommendations;

        if (eligibilityScore <= 0) {
            eligibilityStatus = 'contraindicated';
            recommendations = [
                'PHA circuits are not recommended based on current health status',
                'Focus on traditional strength training with adequate rest periods',
                'Consult healthcare provider before high-intensity training',
                'Consider alternative conditioning methods (steady-state cardio, tempo work)'
            ];
        } else if (eligibilityScore <= 4) {
            eligibilityStatus = 'conditional';
            recommendations = [
                'PHA circuits may be possible with modifications and medical clearance',
                'Start with longer rest periods (30-60 seconds) between exercises',
                'Monitor heart rate and blood pressure responses',
                'Progress gradually over 8-12 weeks before attempting no-rest circuits'
            ];
        } else if (eligibilityScore <= 7) {
            eligibilityStatus = 'limited';
            recommendations = [
                'PHA circuits appropriate with careful progression',
                'Begin with modified circuits (15-30 second rest periods)',
                'Focus on movement quality over intensity initially',
                'Build up to no-rest circuits over 4-6 weeks'
            ];
        } else {
            eligibilityStatus = 'eligible';
            recommendations = [
                'Cleared for full PHA circuit training',
                'Can safely perform no-rest circuits as per Bryant protocols',
                'Follow 4-6 week PHA blocks with mandatory deload',
                'Monitor for signs of overreaching (elevated HR, poor recovery)'
            ];
        }

        // Generate PHA-specific program modifications
        const programModifications = generatePHAModifications(eligibilityStatus, contraindications);

        return {
            eligibilityStatus,
            eligibilityScore,
            contraindications,
            recommendations,
            programModifications,
            bryantGuidelines: {
                maxCycleDuration: '4-6 weeks',
                restBetweenExercises: eligibilityStatus === 'eligible' ? '0 seconds' : '15-30 seconds',
                transitionTime: '30 seconds maximum',
                mandatoryDeload: 'Required after each PHA block',
                progressionRate: '5-10% weekly increases in volume/intensity'
            }
        };
    };

    // Generate PHA program modifications based on eligibility
    const generatePHAModifications = (eligibilityStatus, contraindications) => {
        const modifications = [];

        switch (eligibilityStatus) {
            case 'contraindicated':
                modifications.push({
                    type: 'exercise_selection',
                    change: 'Exclude all PHA circuits from program templates',
                    alternative: 'Use traditional strength training with 2-5 minute rest periods'
                });
                modifications.push({
                    type: 'conditioning',
                    change: 'Avoid high-intensity circuit training',
                    alternative: 'Low-intensity steady-state cardio, walking, swimming'
                });
                break;

            case 'conditional':
                modifications.push({
                    type: 'rest_periods',
                    change: 'Extend rest periods to 30-60 seconds between exercises',
                    alternative: 'Traditional supersets with adequate recovery'
                });
                modifications.push({
                    type: 'intensity_limits',
                    change: 'Limit circuit intensity to 60-75% of maximum effort',
                    alternative: 'Focus on movement quality and technique'
                });
                break;

            case 'limited':
                modifications.push({
                    type: 'progression_timeline',
                    change: 'Extended 6-8 week progression to no-rest circuits',
                    alternative: 'Start with 15-30 second rest, gradually reduce'
                });
                modifications.push({
                    type: 'monitoring',
                    change: 'Enhanced heart rate and recovery monitoring',
                    alternative: 'Use RPE and HR zones to guide intensity'
                });
                break;

            case 'eligible':
                modifications.push({
                    type: 'full_protocols',
                    change: 'Can implement complete Bryant PHA protocols',
                    alternative: 'No modifications needed - follow research guidelines'
                });
                break;
        }

        return modifications;
    };

    // Integration with existing fatigue functions for PHA-specific checks
    const integratePHAWithFatigue = (fatigueData, phaHealthScreen) => {
        // If PHA contraindicated, modify fatigue recommendations
        if (phaHealthScreen?.eligibilityStatus === 'contraindicated') {
            return {
                ...fatigueData,
                phaEligible: false,
                modifiedRecommendations: [
                    ...fatigueData.recommendations,
                    'Avoid high-intensity circuit training due to health contraindications',
                    'Focus on low-impact conditioning methods',
                    'Consider medical evaluation before increasing training intensity'
                ]
            };
        }

        // For eligible users, add PHA-specific fatigue monitoring
        if (phaHealthScreen?.eligibilityStatus === 'eligible') {
            return {
                ...fatigueData,
                phaEligible: true,
                phaSpecificMonitoring: [
                    'Monitor heart rate recovery between circuits',
                    'Track morning heart rate for overreaching signs',
                    'Assess sleep quality after PHA sessions',
                    'Watch for elevated fatigue lasting >48 hours'
                ]
            };
        }

        return fatigueData;
    };

    // Save PHA health screening assessment
    const savePHAHealthAssessment = async (phaHealthData) => {
        setLoading(true);
        try {
            // Update context with PHA health screening data
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        phaHealthScreen: phaHealthData
                    }
                });
            }

            // Store in localStorage as backup
            localStorage.setItem('pha_health_screen', JSON.stringify(phaHealthData));

            return { success: true, data: phaHealthData };
        } catch (error) {
            console.error('Error saving PHA health assessment:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // VOLUME LANDMARKS INTEGRATION ("How Much Should I Train?" Pages 1-50)

    // Calculate Minimum Effective Volume (MEV) per muscle group
    const calculateMEV = (muscleGroup, factors) => {
        const { fiberType, trainingAge, recoveryScore, trainingHistory } = factors;

        // Base MEV values per muscle group per week (from research)
        const baseMEV = {
            chest: 8,      // "Most trainees need 8-10 sets per week minimum" (p.12)
            back: 10,      // "Back can handle slightly more due to fiber composition" (p.14)
            shoulders: 8,  // "Delts respond to moderate volume" (p.16)
            biceps: 6,     // "Arms need less direct work" (p.18)
            triceps: 6,    // "Triceps get stimulus from pressing" (p.18)
            quads: 10,     // "Legs require higher volume for growth" (p.20)
            hamstrings: 8, // "Hamstrings need focused attention" (p.22)
            glutes: 8,     // "Glutes respond well to moderate volume" (p.24)
            calves: 8      // "Calves are stubborn, need consistent work" (p.26)
        };

        let mev = baseMEV[muscleGroup] || 8;

        // Adjust for fiber type - "Fast-twitch muscles need less volume" (p.8)
        if (fiberType === 'fast') {
            mev *= 0.8; // Reduce by 20%
        } else if (fiberType === 'slow') {
            mev *= 1.2; // Increase by 20%
        }

        // Adjust for training age - "Beginners need less to grow" (p.10)
        const ageMultipliers = {
            beginner: 0.7,    // 1-2 years
            intermediate: 1.0, // 2-5 years  
            advanced: 1.3     // 5+ years
        };
        mev *= ageMultipliers[trainingAge] || 1.0;

        // Adjust for recovery capacity - "Poor recovery = lower volume tolerance" (p.11)
        if (recoveryScore <= 3) {
            mev *= 0.8;
        } else if (recoveryScore >= 8) {
            mev *= 1.1;
        }

        return Math.round(mev);
    };

    // Calculate Maximum Recoverable Volume (MRV) per muscle group  
    const calculateMRV = (muscleGroup, factors) => {
        const { fiberType, trainingAge, recoveryScore, stressLevel, sleepQuality, nutritionQuality } = factors;

        // Base MRV values - "The highest volume you can recover from" (p.7)
        const baseMRV = {
            chest: 22,     // "Most can handle 18-26 sets before overreaching" (p.32)
            back: 26,      // "Back tolerates high volume well" (p.34)  
            shoulders: 20, // "Delts are prone to overuse" (p.36)
            biceps: 20,    // "Arms can take more direct work than expected" (p.38)
            triceps: 18,   // "Triceps fatigue from heavy pressing" (p.38)
            quads: 26,     // "Legs have massive capacity" (p.40)
            hamstrings: 20, // "Hamstrings recover slower" (p.42)
            glutes: 22,    // "Glutes can handle good volume" (p.44)
            calves: 26     // "Calves recover quickly" (p.46)
        };

        let mrv = baseMRV[muscleGroup] || 22;

        // Fiber type adjustments - "Fast-twitch = lower MRV" (p.9)
        if (fiberType === 'fast') {
            mrv *= 0.7; // Reduce significantly
        } else if (fiberType === 'slow') {
            mrv *= 1.3; // Increase significantly
        }

        // Training age - "Advanced trainees can handle more" (p.13)
        const ageMultipliers = {
            beginner: 0.8,
            intermediate: 1.0,
            advanced: 1.2
        };
        mrv *= ageMultipliers[trainingAge] || 1.0;

        // Recovery factors compound - "Sleep, stress, nutrition all matter" (p.15)
        const recoveryFactor = (recoveryScore + (10 - stressLevel) + sleepQuality + nutritionQuality) / 40;
        mrv *= (0.7 + (recoveryFactor * 0.6)); // Scale from 0.7x to 1.3x

        return Math.round(mrv);
    };

    // Calculate Maximum Adaptive Volume (MAV) progression
    const calculateMAV = (mev, mrv, weekNumber, mesocycleLength = 4) => {
        // "MAV is the sweet spot for growth - between MEV and MRV" (p.17)
        // "Start closer to MEV, progress towards MRV" (p.19)

        const progressionFactor = (weekNumber - 1) / (mesocycleLength - 1);
        const mavRange = mrv - mev;
        const mav = mev + (mavRange * 0.3) + (mavRange * 0.4 * progressionFactor);

        return Math.round(mav);
    };

    // Generate full volume landmark assessment
    const assessVolumeLandmarks = (muscleGroups, individualFactors, trainingGoals) => {
        const landmarks = {};
        const recommendations = [];

        muscleGroups.forEach(muscle => {
            const factors = individualFactors[muscle] || individualFactors.general || {};

            const mev = calculateMEV(muscle, factors);
            const mrv = calculateMRV(muscle, factors);

            // Validate landmarks - "MEV must be less than MRV" (p.21)
            if (mev >= mrv) {
                recommendations.push({
                    type: 'warning',
                    muscle,
                    message: `MEV (${mev}) >= MRV (${mrv}) - Check recovery factors`,
                    suggestion: 'Improve sleep, nutrition, or stress management'
                });
            }

            landmarks[muscle] = {
                mev,
                mrv,
                mav: calculateMAV(mev, mrv, 1), // Week 1 MAV
                currentVolume: 0,
                status: 'not_started',
                weeklyProgression: generateMAVProgression(mev, mrv, 4)
            };
        });

        return {
            landmarks,
            recommendations,
            summary: generateVolumeSummary(landmarks, trainingGoals)
        };
    };

    // Generate MAV progression across mesocycle
    const generateMAVProgression = (mev, mrv, weeks = 4) => {
        const progression = [];

        for (let week = 1; week <= weeks; week++) {
            const mav = calculateMAV(mev, mrv, week, weeks);

            progression.push({
                week,
                targetMAV: mav,
                minVolume: mev,
                maxVolume: mrv,
                status: week === 1 ? 'current' : 'planned',
                deloadRecommended: week === weeks, // "Deload after mesocycle" (p.23)
                notes: week === 1 ? 'Start conservative near MEV' :
                    week === weeks ? 'Peak week - monitor for overreaching' :
                        'Progressive overload zone'
            });
        }

        return progression;
    };

    // Assess current training status vs landmarks
    const assessCurrentVolume = (currentVolume, landmarks, weekNumber) => {
        const assessment = {};

        Object.entries(currentVolume).forEach(([muscle, volume]) => {
            const landmark = landmarks[muscle];
            if (!landmark) return;

            const targetMAV = landmark.weeklyProgression[weekNumber - 1]?.targetMAV || landmark.mav;

            let status, recommendation, color;

            if (volume < landmark.mev) {
                status = 'below_mev';
                recommendation = `Increase volume by ${landmark.mev - volume} sets minimum`;
                color = 'red';
            } else if (volume >= landmark.mev && volume <= targetMAV) {
                status = 'optimal';
                recommendation = 'Volume in optimal range for adaptation';
                color = 'green';
            } else if (volume > targetMAV && volume <= landmark.mrv) {
                status = 'above_mav';
                recommendation = 'Monitor recovery - approaching MRV';
                color = 'yellow';
            } else {
                status = 'above_mrv';
                recommendation = 'REDUCE VOLUME - Risk of overreaching';
                color = 'red';
            }

            assessment[muscle] = {
                currentVolume: volume,
                targetMAV,
                mev: landmark.mev,
                mrv: landmark.mrv,
                status,
                recommendation,
                color,
                progressionSuggestion: generateProgressionSuggestion(volume, landmark, weekNumber)
            };
        });

        return assessment;
    };

    // Generate progression suggestions
    const generateProgressionSuggestion = (currentVolume, landmark, weekNumber) => {
        const nextWeek = weekNumber + 1;
        const nextTargetMAV = landmark.weeklyProgression[nextWeek - 1]?.targetMAV;

        if (!nextTargetMAV) {
            return 'End of mesocycle - implement deload week';
        }

        const volumeIncrease = nextTargetMAV - currentVolume;

        if (volumeIncrease > 0) {
            return `Next week: Add ${volumeIncrease} sets (target: ${nextTargetMAV})`;
        } else if (volumeIncrease < 0) {
            return `Next week: Reduce ${Math.abs(volumeIncrease)} sets (target: ${nextTargetMAV})`;
        } else {
            return `Next week: Maintain ${currentVolume} sets`;
        }
    };

    // Generate volume summary and insights
    const generateVolumeSummary = (landmarks, trainingGoals) => {
        const totalMEV = Object.values(landmarks).reduce((sum, l) => sum + l.mev, 0);
        const totalMRV = Object.values(landmarks).reduce((sum, l) => sum + l.mrv, 0);
        const averageMAV = Object.values(landmarks).reduce((sum, l) => sum + l.mav, 0);

        const muscleCount = Object.keys(landmarks).length;
        const weeklyTimeEstimate = averageMAV * 3; // ~3 minutes per set

        const insights = [];

        // Goal-specific insights
        if (trainingGoals?.includes('hypertrophy')) {
            insights.push({
                type: 'goal_alignment',
                message: `Hypertrophy focus: Target MAV range ${Math.round(averageMAV * 0.8)}-${Math.round(averageMAV * 1.2)} sets/week`,
                reference: 'Hypertrophy responds best to moderate-high volume (p.25)'
            });
        }

        if (trainingGoals?.includes('strength')) {
            insights.push({
                type: 'goal_alignment',
                message: `Strength focus: Lower volume, higher intensity. Consider ${Math.round(averageMAV * 0.7)} sets/week`,
                reference: 'Strength gains plateau with excessive volume (p.27)'
            });
        }

        // Volume distribution insights
        const highVolumeMuslces = Object.entries(landmarks)
            .filter(([_, l]) => l.mrv > 24)
            .map(([muscle, _]) => muscle);

        if (highVolumeMuslces.length > 0) {
            insights.push({
                type: 'volume_distribution',
                message: `High capacity muscles (${highVolumeMuslces.join(', ')}) can handle more volume`,
                reference: 'Distribute volume based on recovery capacity (p.29)'
            });
        }

        return {
            totalMEV,
            totalMRV,
            averageMAV,
            muscleCount,
            weeklyTimeEstimate,
            insights,
            weeklyProgression: generateWeeklyVolumeProgression(landmarks)
        };
    };

    // Generate weekly volume progression for entire program
    const generateWeeklyVolumeProgression = (landmarks) => {
        const weeks = 4;
        const progression = [];

        for (let week = 1; week <= weeks; week++) {
            const weekData = {
                week,
                totalVolume: 0,
                muscleTargets: {},
                deloadWeek: week === weeks
            };

            Object.entries(landmarks).forEach(([muscle, landmark]) => {
                const weeklyTarget = landmark.weeklyProgression[week - 1];
                weekData.muscleTargets[muscle] = weeklyTarget;
                weekData.totalVolume += weeklyTarget.targetMAV;
            });

            progression.push(weekData);
        }

        return progression;
    };

    // Volume landmark adjustment based on performance feedback
    const adjustVolumeLandmarks = (landmarks, performanceFeedback, weekNumber) => {
        const adjustments = {};

        Object.entries(performanceFeedback).forEach(([muscle, feedback]) => {
            const { performance, recovery, soreness, pump } = feedback;
            const currentLandmark = landmarks[muscle];

            if (!currentLandmark) return;

            let mevAdjustment = 0;
            let mrvAdjustment = 0;
            let reasoning = [];

            // "If performance drops, volume may be too high" (p.31)
            if (performance === 'declining') {
                mrvAdjustment = -2;
                reasoning.push('Performance declining - reduce MRV');
            }

            // "Poor recovery indicates volume above MRV" (p.33)
            if (recovery === 'poor') {
                mrvAdjustment = -3;
                reasoning.push('Poor recovery - significantly reduce MRV');
            }

            // "Excessive soreness = too much volume" (p.35)
            if (soreness === 'excessive') {
                mrvAdjustment = -2;
                reasoning.push('Excessive soreness - reduce volume tolerance');
            }

            // "No pump indicates volume below MEV" (p.37)
            if (pump === 'none') {
                mevAdjustment = 1;
                reasoning.push('No pump - may need more volume for stimulus');
            }

            // "Easy recovery suggests room for more volume" (p.39)
            if (recovery === 'excellent' && performance === 'improving') {
                mrvAdjustment = 2;
                reasoning.push('Excellent recovery - can handle more volume');
            }

            adjustments[muscle] = {
                newMEV: Math.max(4, currentLandmark.mev + mevAdjustment),
                newMRV: Math.max(currentLandmark.mev + 6, currentLandmark.mrv + mrvAdjustment),
                adjustmentReason: reasoning.join('; '),
                confidence: reasoning.length >= 2 ? 'high' : 'medium'
            };
        });

        return adjustments;
    };

    // Deload protocol generator
    const generateDeloadProtocol = (landmarks, currentVolume, deloadType = 'volume') => {
        const deloadOptions = {
            volume: {
                name: 'Volume Deload',
                description: 'Reduce volume by 40-60% while maintaining intensity',
                reference: 'Volume deloads preserve strength adaptations (p.41)'
            },
            intensity: {
                name: 'Intensity Deload',
                description: 'Reduce intensity by 20-30% while maintaining volume',
                reference: 'Intensity deloads allow neural recovery (p.43)'
            },
            complete: {
                name: 'Complete Rest',
                description: 'No training for 3-7 days',
                reference: 'Complete rest for severe overreaching (p.45)'
            }
        };

        const protocol = deloadOptions[deloadType];
        const deloadTargets = {};

        Object.entries(currentVolume).forEach(([muscle, volume]) => {
            const landmark = landmarks[muscle];

            if (deloadType === 'volume') {
                deloadTargets[muscle] = {
                    targetVolume: Math.round(volume * 0.5), // 50% reduction
                    targetIntensity: '85-95%', // Maintain intensity
                    notes: 'Focus on movement quality and neural patterns'
                };
            } else if (deloadType === 'intensity') {
                deloadTargets[muscle] = {
                    targetVolume: volume, // Maintain volume
                    targetIntensity: '60-75%', // Reduce intensity
                    notes: 'Higher reps, focus on muscle connection'
                };
            }
        });

        return {
            protocol,
            deloadTargets,
            duration: '1 week',
            nextPhase: 'Return to progressive overload',
            monitoringPoints: [
                'Sleep quality improvement',
                'Motivation restoration',
                'Reduced muscle soreness',
                'Improved workout performance'
            ]
        };
    };

    // Save volume landmark assessment
    const saveVolumeLandmarks = async (volumeData) => {
        setLoading(true);
        try {
            if (dispatch) {
                dispatch({
                    type: APP_ACTIONS.UPDATE_ASSESSMENT,
                    payload: {
                        ...state?.assessment,
                        volumeLandmarks: volumeData
                    }
                });
            }

            localStorage.setItem('volume_landmarks', JSON.stringify(volumeData));
            return { success: true, data: volumeData };
        } catch (error) {
            console.error('Error saving volume landmarks:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
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
        saveNutritionAssessment,
        assessSpecificity,
        determineOptimalSpectrum,
        checkModalityCompatibility,
        generateAdaptationSequence,
        calculateTrainingVariables,
        validatePhaseProgression,
        saveSpecificityAssessment,
        assessOverload,
        calculateMRVByPhase,
        calculateHomeostasisDisruption,
        generateOverloadProgression,
        assessOverloadOptimization,
        calculateCurrentLoad,
        assessFatigue,
        assessFuelFatigue,
        assessNervousFatigue,
        assessMessengerFatigue,
        assessTissueFatigue,
        determineFatigueState,
        generateFatigueManagement,
        calculateRecoveryTimeline,
        generateOverloadRecommendations,
        generateFatigueRecommendations,
        saveOverloadAssessment,
        saveFatigueAssessment,
        // Volume Landmarks functions
        calculateMEV,
        calculateMRV,
        calculateMAV,
        assessVolumeLandmarks,
        generateMAVProgression,
        assessCurrentVolume,
        generateProgressionSuggestion,
        generateVolumeSummary,
        generateWeeklyVolumeProgression,
        adjustVolumeLandmarks,
        generateDeloadProtocol,
        saveVolumeLandmarks,

        // PHA Health Screening functions (Bryant Periodization)
        assessPHAHealth,
        generatePHAModifications,
        integratePHAWithFatigue,
        savePHAHealthAssessment
    };
};
