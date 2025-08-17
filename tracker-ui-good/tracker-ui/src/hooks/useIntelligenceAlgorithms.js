/**
 * React Hook for Intelligence/Analytics Algorithms
 * Modernized from js/algorithms/intelligence.js and intelligenceHub.js
 * Provides AI-assisted training optimization and recommendations
 */

import { useState, useCallback, useEffect } from 'react';

export const useIntelligenceAlgorithms = () => {
    const [intelligenceData, setIntelligenceData] = useState({
        kpis: null,
        recommendations: [],
        insights: null,
        confidence: 0.5
    });

    const [loading, setLoading] = useState(false);

    /**
     * Initialize intelligence system with KPIs and baseline metrics
     */
    const initializeIntelligence = useCallback((trainingHistory) => {
        if (!trainingHistory || trainingHistory.length === 0) {
            return null;
        }

        const intelligence = {
            initialized: new Date().toISOString(),
            version: "2.0.0",
            kpis: {
                avgRPE: 0,
                weeklyLoad: 0,
                volumeConsistency: 0,
                progressionRate: 0,
                deloadFrequency: 0,
            },
            baselines: {},
            recommendations: [],
            confidence: 0.5,
        };

        // Calculate baseline KPIs from existing data
        if (trainingHistory.length > 0) {
            // Calculate average RPE/RIR
            let totalRPE = 0;
            let rpeCount = 0;
            let totalVolume = 0;
            let volumePoints = 0;

            trainingHistory.forEach((session) => {
                if (session.exercises && Array.isArray(session.exercises)) {
                    session.exercises.forEach((exercise) => {
                        if (exercise.sets && Array.isArray(exercise.sets)) {
                            exercise.sets.forEach((set) => {
                                if (set.rir !== null && set.rir !== undefined) {
                                    totalRPE += 10 - set.rir; // Convert RIR to RPE
                                    rpeCount++;
                                }
                                if (set.reps && set.weight) {
                                    totalVolume += set.reps * set.weight;
                                    volumePoints++;
                                }
                            });
                        }
                    });
                }
            });

            intelligence.kpis.avgRPE = rpeCount > 0 ? Math.round((totalRPE / rpeCount) * 10) / 10 : 7;
            intelligence.kpis.weeklyLoad = volumePoints > 0 ? Math.round(totalVolume / volumePoints) : 0;
        }

        // Calculate volume consistency
        if (trainingHistory.length >= 4) {
            const weeklyVolumes = trainingHistory.slice(-4).map(session => {
                let volume = 0;
                session.exercises?.forEach(ex => {
                    ex.sets?.forEach(set => {
                        if (set.reps && set.weight) volume += set.reps * set.weight;
                    });
                });
                return volume;
            });

            const avgVolume = weeklyVolumes.reduce((a, b) => a + b, 0) / weeklyVolumes.length;
            const variance = weeklyVolumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / weeklyVolumes.length;
            const stdDev = Math.sqrt(variance);
            intelligence.kpis.volumeConsistency = avgVolume > 0 ? Math.round((1 - (stdDev / avgVolume)) * 100) : 0;
        }

        setIntelligenceData(prev => ({ ...prev, kpis: intelligence.kpis }));
        return intelligence;
    }, []);

    /**
     * Generate intelligent training recommendations
     */
    const generateRecommendations = useCallback((userProfile, recentPerformance, goals) => {
        const recommendations = [];
        let confidence = 0.6;

        // Volume recommendations
        if (recentPerformance?.avgRPE > 8.5) {
            recommendations.push({
                type: 'volume',
                priority: 'high',
                title: 'Reduce Training Volume',
                description: 'High average RPE indicates potential overreaching. Consider reducing sets by 15-20%.',
                action: 'reduce_volume',
                confidence: 0.8
            });
        } else if (recentPerformance?.avgRPE < 6.5) {
            recommendations.push({
                type: 'volume',
                priority: 'medium',
                title: 'Increase Training Intensity',
                description: 'Low RPE suggests room for intensity increase. Consider adding weight or reducing RIR.',
                action: 'increase_intensity',
                confidence: 0.7
            });
        }

        // Frequency recommendations
        if (recentPerformance?.avgRecoveryTime < 24) {
            recommendations.push({
                type: 'frequency',
                priority: 'medium',
                title: 'Consider Increasing Frequency',
                description: 'Fast recovery allows for more frequent training sessions.',
                action: 'increase_frequency',
                confidence: 0.7
            });
        }

        // Exercise selection recommendations
        if (recentPerformance?.plateauWeeks >= 3) {
            recommendations.push({
                type: 'exercise',
                priority: 'high',
                title: 'Exercise Variation Needed',
                description: 'Progress has stalled. Consider changing exercises or rep ranges.',
                action: 'vary_exercises',
                confidence: 0.8
            });
        }

        // Goal-specific recommendations
        if (goals?.primary === 'strength' && recentPerformance?.avgReps > 6) {
            recommendations.push({
                type: 'programming',
                priority: 'medium',
                title: 'Optimize for Strength',
                description: 'For strength goals, consider lower rep ranges (1-5 reps) with heavier weights.',
                action: 'adjust_rep_range',
                confidence: 0.7
            });
        }

        const result = {
            recommendations,
            totalCount: recommendations.length,
            highPriority: recommendations.filter(r => r.priority === 'high').length,
            confidence,
            generatedAt: new Date().toISOString()
        };

        setIntelligenceData(prev => ({ ...prev, recommendations: result.recommendations, confidence }));
        return result;
    }, []);

    /**
     * Analyze training patterns and generate insights
     */
    const analyzeTrainingPatterns = useCallback((trainingHistory, timeframe = 30) => {
        if (!trainingHistory || trainingHistory.length < 3) {
            return null;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeframe);

        const recentSessions = trainingHistory.filter(session =>
            new Date(session.date) >= cutoffDate
        );

        const insights = {
            totalSessions: recentSessions.length,
            avgSessionsPerWeek: Math.round((recentSessions.length / (timeframe / 7)) * 10) / 10,
            patterns: {},
            trends: {},
            warnings: []
        };

        // Analyze session frequency patterns
        const dayOfWeekCount = {};
        recentSessions.forEach(session => {
            const dayOfWeek = new Date(session.date).getDay();
            dayOfWeekCount[dayOfWeek] = (dayOfWeekCount[dayOfWeek] || 0) + 1;
        });

        insights.patterns.preferredDays = Object.entries(dayOfWeekCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([day, count]) => ({
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
                count
            }));

        // Analyze volume trends
        const volumeTrend = [];
        let weekVolume = 0;
        let weekCount = 0;

        recentSessions.forEach((session, index) => {
            let sessionVolume = 0;
            session.exercises?.forEach(ex => {
                ex.sets?.forEach(set => {
                    if (set.reps && set.weight) sessionVolume += set.reps * set.weight;
                });
            });

            weekVolume += sessionVolume;
            weekCount++;

            // Every 7 sessions or at the end, calculate weekly average
            if (weekCount === 7 || index === recentSessions.length - 1) {
                volumeTrend.push(weekVolume / weekCount);
                weekVolume = 0;
                weekCount = 0;
            }
        });

        if (volumeTrend.length >= 2) {
            const trend = volumeTrend[volumeTrend.length - 1] - volumeTrend[0];
            insights.trends.volume = {
                direction: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
                magnitude: Math.abs(trend),
                percentage: volumeTrend[0] > 0 ? Math.round((trend / volumeTrend[0]) * 100) : 0
            };
        }

        // Generate warnings
        if (insights.avgSessionsPerWeek < 2) {
            insights.warnings.push({
                type: 'frequency',
                message: 'Training frequency is below recommended minimum (2-3x per week)'
            });
        }

        if (insights.avgSessionsPerWeek > 6) {
            insights.warnings.push({
                type: 'recovery',
                message: 'High training frequency may impact recovery'
            });
        }

        setIntelligenceData(prev => ({ ...prev, insights }));
        return insights;
    }, []);

    /**
     * Predict plateau and recommend interventions
     */
    const predictPlateau = useCallback((exerciseHistory, muscleGroup) => {
        if (!exerciseHistory || exerciseHistory.length < 6) {
            return null;
        }

        // Analyze last 6 sessions for progress trends
        const recentSessions = exerciseHistory.slice(-6);
        let progressPoints = 0;
        let stagnationPoints = 0;

        for (let i = 1; i < recentSessions.length; i++) {
            const current = recentSessions[i];
            const previous = recentSessions[i - 1];

            // Compare best set performance
            const currentBest = Math.max(...current.sets.map(s => s.weight * s.reps));
            const previousBest = Math.max(...previous.sets.map(s => s.weight * s.reps));

            if (currentBest > previousBest * 1.025) { // 2.5% improvement threshold
                progressPoints++;
            } else if (currentBest <= previousBest) {
                stagnationPoints++;
            }
        }

        const plateauRisk = stagnationPoints / (recentSessions.length - 1);
        const progressRate = progressPoints / (recentSessions.length - 1);

        let recommendation = "";
        let intervention = "";

        if (plateauRisk >= 0.6) {
            recommendation = "High plateau risk detected";
            intervention = "Consider deload week or exercise variation";
        } else if (plateauRisk >= 0.4) {
            recommendation = "Moderate plateau risk";
            intervention = "Monitor closely, may need programming adjustment";
        } else {
            recommendation = "Good progress trajectory";
            intervention = "Continue current programming";
        }

        return {
            plateauRisk: Math.round(plateauRisk * 100),
            progressRate: Math.round(progressRate * 100),
            recommendation,
            intervention,
            confidence: recentSessions.length >= 6 ? 0.8 : 0.6,
            analysisDate: new Date().toISOString()
        };
    }, []);

    return {
        intelligenceData,
        loading,
        initializeIntelligence,
        generateRecommendations,
        analyzeTrainingPatterns,
        predictPlateau,
        setLoading
    };
};
