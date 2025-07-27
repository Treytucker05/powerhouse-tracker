/**
 * React Hook for Fatigue Management Algorithms
 * Modernized from js/algorithms/fatigue.js for React applications
 * Handles recovery monitoring, frequency optimization, and fatigue accumulation
 */

import { useState, useCallback, useEffect } from 'react';

export const useFatigueAlgorithms = () => {
    const [fatigueData, setFatigueData] = useState({
        recoveryAnalysis: null,
        fatigueScore: null,
        frequencyRecommendation: null
    });

    const [loading, setLoading] = useState(false);

    /**
     * Analyze recovery status and frequency optimization
     */
    const analyzeFrequency = useCallback((sorenessRecoveryDays, currentSessionGap, muscle = null) => {
        const recoveryTime = Math.max(0, sorenessRecoveryDays);
        const sessionGap = Math.max(1, currentSessionGap);

        let recommendation = "";
        let action = "";
        let urgency = "normal";
        let frequencyAdjustment = 0;

        // Recovery vs session gap analysis
        const recoveryRatio = recoveryTime / sessionGap;

        if (recoveryRatio < 0.7) {
            // Recovering much faster than session frequency
            recommendation = "You heal early → Add one session per week";
            action = "increase_frequency";
            frequencyAdjustment = 1;
            urgency = "medium";
        } else if (recoveryRatio > 1.3) {
            // Still sore when next session is due
            recommendation = "Recovery lags → Insert an extra rest day";
            action = "decrease_frequency";
            frequencyAdjustment = -1;
            urgency = "high";
        } else {
            // Optimal recovery timing
            recommendation = "Frequency is optimal";
            action = "maintain";
            frequencyAdjustment = 0;
            urgency = "normal";
        }

        const analysis = {
            recoveryTime,
            sessionGap,
            recoveryRatio: Math.round(recoveryRatio * 100) / 100,
            recommendation,
            action,
            urgency,
            frequencyAdjustment
        };

        setFatigueData(prev => ({ ...prev, recoveryAnalysis: analysis }));
        return analysis;
    }, []);

    /**
     * Calculate optimal frequency for muscle group
     */
    const calculateOptimalFrequency = useCallback((muscle, options = {}) => {
        const {
            trainingAge = 'intermediate',
            currentVolume = 10,
            recoveryCapacity = 'normal',
            trainingGoal = 'hypertrophy'
        } = options;

        // Base frequency recommendations by muscle group
        const baseFrequencies = {
            chest: { min: 2, max: 3 },
            back: { min: 2, max: 4 },
            shoulders: { min: 2, max: 3 },
            biceps: { min: 2, max: 3 },
            triceps: { min: 2, max: 3 },
            quads: { min: 2, max: 3 },
            hamstrings: { min: 2, max: 3 },
            glutes: { min: 2, max: 3 },
            calves: { min: 3, max: 5 }
        };

        const base = baseFrequencies[muscle.toLowerCase()] || { min: 2, max: 3 };

        // Adjust for training age
        let frequencyModifier = 1;
        if (trainingAge === 'beginner') frequencyModifier = 0.8;
        if (trainingAge === 'advanced') frequencyModifier = 1.2;

        // Adjust for volume
        let volumeModifier = 1;
        if (currentVolume > 15) volumeModifier = 1.1;
        if (currentVolume < 8) volumeModifier = 0.9;

        // Calculate optimal frequency
        const optimalFreq = Math.round((base.min + base.max) / 2 * frequencyModifier * volumeModifier);
        const recommendedFrequency = Math.max(base.min, Math.min(base.max, optimalFreq));

        // Calculate sets per session
        const setsPerSession = Math.round(currentVolume / recommendedFrequency);

        const result = {
            muscle,
            recommendedFrequency,
            setsPerSession,
            totalWeeklyVolume: currentVolume,
            trainingAge,
            reasoning: `${recommendedFrequency}x/week allows ${setsPerSession} sets per session for optimal recovery`
        };

        setFatigueData(prev => ({ ...prev, frequencyRecommendation: result }));
        return result;
    }, []);

    /**
     * Calculate fatigue accumulation score
     */
    const calculateFatigueScore = useCallback((sessionData) => {
        if (!sessionData || !Array.isArray(sessionData)) {
            return null;
        }

        let totalFatigue = 0;
        let sessionCount = 0;
        let highIntensityDays = 0;
        let consecutiveDays = 0;

        sessionData.forEach((session, index) => {
            if (session.completed) {
                sessionCount++;

                // Volume-based fatigue
                const volumeFatigue = (session.totalSets || 0) * 0.1;

                // Intensity-based fatigue  
                const avgRIR = session.avgRIR || 2;
                const intensityFatigue = avgRIR < 2 ? 2 : (avgRIR < 1 ? 3 : 1);

                // Duration fatigue
                const durationFatigue = (session.duration || 60) / 60;

                const sessionFatigue = volumeFatigue + intensityFatigue + durationFatigue;
                totalFatigue += sessionFatigue;

                // Track high intensity sessions
                if (avgRIR < 2) highIntensityDays++;

                // Track consecutive training days
                if (index > 0 && sessionData[index - 1].completed) {
                    consecutiveDays++;
                }
            }
        });

        // Calculate recovery debt
        const recoveryDebt = consecutiveDays > 2 ? consecutiveDays * 0.5 : 0;

        // Final fatigue score (0-10 scale)
        const fatigueScore = Math.min(10, totalFatigue + recoveryDebt);

        let fatigueLevel = "Low";
        let recommendation = "Continue current training";

        if (fatigueScore > 7) {
            fatigueLevel = "High";
            recommendation = "Consider deload or rest day";
        } else if (fatigueScore > 5) {
            fatigueLevel = "Moderate";
            recommendation = "Monitor closely, reduce intensity if needed";
        }

        const result = {
            fatigueScore: Math.round(fatigueScore * 10) / 10,
            fatigueLevel,
            recommendation,
            breakdown: {
                totalSessions: sessionCount,
                highIntensityDays,
                consecutiveDays,
                recoveryDebt
            }
        };

        setFatigueData(prev => ({ ...prev, fatigueScore: result }));
        return result;
    }, []);

    /**
     * Deload need analysis based on multiple factors
     */
    const analyzeDeloadNeed = useCallback((trainingData) => {
        const factors = {
            fatigueAccumulation: false,
            performanceDecline: false,
            motivationLoss: false,
            plannedDeload: false
        };

        let deloadScore = 0;
        const reasons = [];

        // Check fatigue levels
        if (fatigueData.fatigueScore && fatigueData.fatigueScore.fatigueScore > 7) {
            factors.fatigueAccumulation = true;
            deloadScore += 3;
            reasons.push("High fatigue accumulation");
        }

        // Check for performance decline (if performance data available)
        if (trainingData && trainingData.length > 4) {
            const recent = trainingData.slice(-2);
            const previous = trainingData.slice(-4, -2);

            const recentAvg = recent.reduce((sum, session) => sum + (session.avgRIR || 2), 0) / recent.length;
            const previousAvg = previous.reduce((sum, session) => sum + (session.avgRIR || 2), 0) / previous.length;

            if (recentAvg > previousAvg + 0.5) {
                factors.performanceDecline = true;
                deloadScore += 2;
                reasons.push("Performance decline detected");
            }
        }

        // Planned deload (every 4-6 weeks)
        const weeksSinceLastDeload = 5; // This should come from actual data
        if (weeksSinceLastDeload >= 4) {
            factors.plannedDeload = true;
            deloadScore += 1;
            reasons.push("Scheduled deload week");
        }

        const shouldDeload = deloadScore >= 3;

        return {
            shouldDeload,
            deloadScore,
            factors,
            reasons,
            recommendation: shouldDeload
                ? "Take a deload week: 50% volume, lighter loads"
                : "Continue current programming"
        };
    }, [fatigueData.fatigueScore]);

    return {
        fatigueData,
        loading,
        analyzeFrequency,
        calculateOptimalFrequency,
        calculateFatigueScore,
        analyzeDeloadNeed,
        setLoading
    };
};
