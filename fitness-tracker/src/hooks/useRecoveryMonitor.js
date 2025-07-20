import { useState, useEffect } from 'react';
import { useProgramContext } from '../contexts/ProgramContext';

/**
 * useRecoveryMonitor Hook
 * 
 * Implements Bryant Periodization recovery monitoring with:
 * - Automated deload detection every 3-6 weeks
 * - Fitness-Fatigue Model tracking
 * - Volume reduction recommendations (60-70%)
 * - Recovery capacity assessment
 */

export const useRecoveryMonitor = () => {
    const { state } = useProgramContext();
    const [recoveryData, setRecoveryData] = useState({
        fitnessScore: 100,
        fatigueScore: 0,
        netReadiness: 100,
        lastDeload: null,
        recoveryCapacity: 'normal'
    });

    // Automated deload checking based on Bryant principles
    const autoDeloadCheck = (weekNumber, fatigueScores = {}) => {
        const { fuel = 0, nervous = 0, messengers = 0, tissues = 0 } = fatigueScores;
        const averageFatigue = (fuel + nervous + messengers + tissues) / 4;

        // Weekly deload schedule (every 4 weeks) or fatigue-triggered
        const scheduledDeload = weekNumber % 4 === 0;
        const fatigueDeload = averageFatigue > 7;
        const chronicallyFatigued = averageFatigue > 5 && weekNumber % 3 === 0;

        if (scheduledDeload || fatigueDeload || chronicallyFatigued) {
            return {
                recommended: true,
                type: scheduledDeload ? 'scheduled' : 'fatigue-triggered',
                volumeReduction: calculateVolumeReduction(averageFatigue),
                duration: getDuration(averageFatigue),
                reasoning: getDeloadReasoning(scheduledDeload, fatigueDeload, averageFatigue),
                recommendations: getRecoveryRecommendations(averageFatigue)
            };
        }

        return {
            recommended: false,
            nextScheduled: Math.ceil(weekNumber / 4) * 4,
            daysUntilNext: (Math.ceil(weekNumber / 4) * 4 - weekNumber) * 7
        };
    };

    // Calculate volume reduction based on fatigue severity
    const calculateVolumeReduction = (averageFatigue) => {
        if (averageFatigue >= 8) return 0.5;  // 50% reduction for severe fatigue
        if (averageFatigue >= 6) return 0.6;  // 60% reduction for high fatigue
        return 0.7; // 70% reduction for standard deload
    };

    // Determine deload duration
    const getDuration = (averageFatigue) => {
        if (averageFatigue >= 8) return '2 weeks';
        if (averageFatigue >= 7) return '10 days';
        return '1 week';
    };

    // Get deload reasoning
    const getDeloadReasoning = (scheduled, fatigueTriggered, avgFatigue) => {
        if (fatigueTriggered && avgFatigue >= 8) {
            return 'Critical fatigue accumulation - immediate recovery needed';
        }
        if (fatigueTriggered) {
            return 'Elevated fatigue detected - preventive deload recommended';
        }
        if (scheduled) {
            return 'Planned 4-week deload cycle for supercompensation';
        }
        return 'Maintenance deload';
    };

    // Recovery recommendations based on fatigue profile
    const getRecoveryRecommendations = (averageFatigue) => {
        const baseRecommendations = [
            'Maintain sleep quality (7-9 hours)',
            'Focus on hydration and nutrition',
            'Light movement and mobility work'
        ];

        if (averageFatigue >= 8) {
            return [
                ...baseRecommendations,
                'Consider complete training break',
                'Stress management techniques',
                'Professional recovery assessment'
            ];
        }

        if (averageFatigue >= 6) {
            return [
                ...baseRecommendations,
                'Reduce training intensity to 50-60%',
                'Increase recovery modalities',
                'Monitor morning HRV if available'
            ];
        }

        return baseRecommendations;
    };

    // Fitness-Fatigue Model calculation
    const calculateFitnessScore = (trainingLoad, timeConstant = 45) => {
        // Fitness builds slowly with consistent training
        // Exponential decay model: Fitness(t) = TrainingLoad * (1 - e^(-t/τ))
        const days = state.currentWeek * 7;
        return Math.min(100, trainingLoad * (1 - Math.exp(-days / timeConstant)));
    };

    const calculateFatigueScore = (recentLoad, timeConstant = 15) => {
        // Fatigue builds quickly, dissipates quickly
        // Exponential decay: Fatigue(t) = RecentLoad * e^(-t/τ)
        const daysSinceLastSession = state.daysSinceLastSession || 1;
        return Math.max(0, recentLoad * Math.exp(-daysSinceLastSession / timeConstant));
    };

    // Recovery capacity assessment
    const assessRecoveryCapacity = (userProfile = {}) => {
        const {
            age = 30,
            trainingExperience = 'intermediate',
            sleepQuality = 7,
            stressLevel = 5,
            nutrition = 7,
            lifestyle = 'moderate'
        } = userProfile;

        let capacityScore = 100;

        // Age factor (decline after 35)
        if (age > 35) capacityScore -= (age - 35) * 1.5;
        if (age > 50) capacityScore -= (age - 50) * 2;

        // Training experience (more experienced = better recovery)
        const experienceModifiers = {
            'beginner': -10,
            'novice': -5,
            'intermediate': 0,
            'advanced': 5,
            'elite': 10
        };
        capacityScore += experienceModifiers[trainingExperience] || 0;

        // Lifestyle factors
        capacityScore += (sleepQuality - 5) * 5; // Sleep heavily weighted
        capacityScore -= (stressLevel - 5) * 3;  // Stress reduces capacity
        capacityScore += (nutrition - 5) * 2;    // Nutrition support

        // Lifestyle modifier
        const lifestyleModifiers = {
            'sedentary': -15,
            'light': -5,
            'moderate': 0,
            'active': 5,
            'very_active': -10 // Overactive can hurt recovery
        };
        capacityScore += lifestyleModifiers[lifestyle] || 0;

        // Classify capacity
        if (capacityScore >= 90) return 'excellent';
        if (capacityScore >= 75) return 'good';
        if (capacityScore >= 60) return 'normal';
        if (capacityScore >= 45) return 'below_average';
        return 'poor';
    };

    // Update recovery data based on current state
    useEffect(() => {
        if (state.currentProgram) {
            const trainingLoad = state.weeklyVolume || 0;
            const recentLoad = state.lastWeekVolume || 0;

            const fitness = calculateFitnessScore(trainingLoad);
            const fatigue = calculateFatigueScore(recentLoad);
            const netReadiness = Math.max(0, fitness - fatigue);

            setRecoveryData(prev => ({
                ...prev,
                fitnessScore: Math.round(fitness),
                fatigueScore: Math.round(fatigue),
                netReadiness: Math.round(netReadiness),
                recoveryCapacity: assessRecoveryCapacity(state.userProfile)
            }));
        }
    }, [state.currentProgram, state.weeklyVolume, state.lastWeekVolume, state.userProfile]);

    // Main recovery monitoring function
    const monitorRecovery = (weekNumber, fatigueScores) => {
        const deloadCheck = autoDeloadCheck(weekNumber, fatigueScores);
        const capacityAssessment = assessRecoveryCapacity(state.userProfile);

        return {
            deloadRecommendation: deloadCheck,
            recoveryCapacity: capacityAssessment,
            fitnessScore: recoveryData.fitnessScore,
            fatigueScore: recoveryData.fatigueScore,
            netReadiness: recoveryData.netReadiness,
            recommendations: deloadCheck.recommended ? deloadCheck.recommendations : [
                'Continue current training program',
                'Monitor fatigue levels daily',
                'Maintain recovery practices'
            ]
        };
    };

    return {
        recoveryData,
        monitorRecovery,
        autoDeloadCheck,
        assessRecoveryCapacity,
        calculateFitnessScore,
        calculateFatigueScore
    };
};
