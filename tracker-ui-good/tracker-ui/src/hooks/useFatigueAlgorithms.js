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

        const result = {
            recoveryTime,
            sessionGap,
            recoveryRatio: Math.round(recoveryRatio * 100) / 100,
            recommendation,
            action,
            frequencyAdjustment,
            urgency,
            muscle: muscle || 'general'
        };

        setFatigueData(prev => ({ ...prev, recoveryAnalysis: result }));
        return result;
    }, []);

    /**
     * Calculate comprehensive fatigue score
     */
    const calculateFatigueScore = useCallback((metrics) => {
        const {
            sleepQuality = 7,    // 1-10 scale
            stressLevel = 5,     // 1-10 scale  
            soreness = 3,        // 1-10 scale
            motivation = 7,      // 1-10 scale
            hrv = null,          // Heart rate variability
            restingHR = null     // Resting heart rate
        } = metrics;

        // Base score from subjective metrics (0-100 scale)
        let fatigueScore = 0;

        // Sleep quality (30% weight)
        fatigueScore += (10 - sleepQuality) * 3;

        // Stress level (25% weight) 
        fatigueScore += stressLevel * 2.5;

        // Soreness (25% weight)
        fatigueScore += soreness * 2.5;

        // Motivation (20% weight) - inverted since low motivation = high fatigue
        fatigueScore += (10 - motivation) * 2;

        // Normalize to 0-100
        fatigueScore = Math.min(100, Math.max(0, fatigueScore));

        // Classify fatigue level
        let level = "";
        let recommendation = "";
        let trainingAdjustment = "";

        if (fatigueScore <= 30) {
            level = "Low";
            recommendation = "You're well recovered - can push training intensity";
            trainingAdjustment = "increase_intensity";
        } else if (fatigueScore <= 50) {
            level = "Moderate";
            recommendation = "Normal fatigue levels - maintain current training";
            trainingAdjustment = "maintain";
        } else if (fatigueScore <= 70) {
            level = "High";
            recommendation = "Elevated fatigue - consider reducing volume or intensity";
            trainingAdjustment = "reduce_volume";
        } else {
            level = "Very High";
            recommendation = "High fatigue detected - rest day or deload recommended";
            trainingAdjustment = "deload";
        }

        const result = {
            score: Math.round(fatigueScore),
            level,
            recommendation,
            trainingAdjustment,
            components: {
                sleepImpact: Math.round((10 - sleepQuality) * 3),
                stressImpact: Math.round(stressLevel * 2.5),
                sorenessImpact: Math.round(soreness * 2.5),
                motivationImpact: Math.round((10 - motivation) * 2)
            },
            timestamp: new Date().toISOString()
        };

        setFatigueData(prev => ({ ...prev, fatigueScore: result }));
        return result;
    }, []);

    /**
     * Generate training frequency recommendations
     */
    const generateFrequencyRecommendation = useCallback((muscleGroup, currentFrequency, recoveryMetrics) => {
        const {
            avgSoreness = 3,
            avgRecoveryDays = 2,
            consistentProgress = true,
            recentDeload = false
        } = recoveryMetrics;

        let recommendedFrequency = currentFrequency;
        let reasoning = "";
        let confidence = 0.5;

        // Base frequency recommendations by muscle group
        const frequencyGuidelines = {
            chest: { min: 2, optimal: 2.5, max: 3 },
            back: { min: 2, optimal: 2.5, max: 3 },
            shoulders: { min: 2, optimal: 3, max: 4 },
            arms: { min: 2, optimal: 3, max: 4 },
            legs: { min: 2, optimal: 2.5, max: 3 },
            core: { min: 3, optimal: 4, max: 6 }
        };

        const guidelines = frequencyGuidelines[muscleGroup.toLowerCase()] ||
            { min: 2, optimal: 2.5, max: 3 };

        // Adjust based on recovery metrics
        if (avgSoreness <= 2 && avgRecoveryDays <= 1.5) {
            // Fast recovery - can increase frequency
            recommendedFrequency = Math.min(guidelines.max, currentFrequency + 0.5);
            reasoning = "Fast recovery allows for increased frequency";
            confidence = 0.8;
        } else if (avgSoreness >= 6 || avgRecoveryDays >= 3) {
            // Slow recovery - decrease frequency
            recommendedFrequency = Math.max(guidelines.min, currentFrequency - 0.5);
            reasoning = "Slow recovery requires reduced frequency";
            confidence = 0.9;
        } else if (!consistentProgress && !recentDeload) {
            // Stagnation without recent deload - try frequency adjustment
            recommendedFrequency = currentFrequency > guidelines.optimal ?
                currentFrequency - 0.5 : currentFrequency + 0.5;
            reasoning = "Progress stagnation - adjusting frequency to break plateau";
            confidence = 0.6;
        } else {
            // Maintain current frequency
            recommendedFrequency = currentFrequency;
            reasoning = "Current frequency appears optimal";
            confidence = 0.7;
        }

        const result = {
            muscleGroup,
            currentFrequency,
            recommendedFrequency: Math.round(recommendedFrequency * 2) / 2, // Round to nearest 0.5
            change: Math.round((recommendedFrequency - currentFrequency) * 2) / 2,
            reasoning,
            confidence,
            guidelines,
            recoveryMetrics
        };

        setFatigueData(prev => ({ ...prev, frequencyRecommendation: result }));
        return result;
    }, []);

    /**
     * Detect when deload is needed
     */
    const detectDeloadNeed = useCallback((trainingHistory) => {
        if (!trainingHistory || trainingHistory.length < 3) {
            return { needed: false, reason: "Insufficient data" };
        }

        let fatigueIndicators = 0;
        let progressIndicators = 0;

        // Analyze last 3 weeks
        const recentWeeks = trainingHistory.slice(-3);

        recentWeeks.forEach((week, index) => {
            // Check fatigue indicators
            if (week.avgRPE > 8.5) fatigueIndicators++;
            if (week.avgSoreness > 6) fatigueIndicators++;
            if (week.sleepQuality < 6) fatigueIndicators++;

            // Check progress indicators
            if (index > 0) {
                const prevWeek = recentWeeks[index - 1];
                if (week.totalVolume < prevWeek.totalVolume) progressIndicators++;
                if (week.avgWeight <= prevWeek.avgWeight) progressIndicators++;
            }
        });

        const deloadNeeded = fatigueIndicators >= 4 || progressIndicators >= 3;

        let reason = "";
        if (fatigueIndicators >= 4) {
            reason = "High fatigue accumulation detected";
        } else if (progressIndicators >= 3) {
            reason = "Performance decline indicates overreaching";
        } else {
            reason = "Recovery metrics within normal range";
        }

        return {
            needed: deloadNeeded,
            reason,
            fatigueIndicators,
            progressIndicators,
            confidence: deloadNeeded ? 0.8 : 0.6
        };
    }, []);

    return {
        fatigueData,
        loading,
        analyzeFrequency,
        calculateFatigueScore,
        generateFrequencyRecommendation,
        detectDeloadNeed,
        setLoading
    };
};
