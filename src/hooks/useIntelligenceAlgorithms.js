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
                if (session.exercises) {
                    session.exercises.forEach((exercise) => {
                        if (exercise.sets) {
                            exercise.sets.forEach((set) => {
                                if (set.rpe || set.rir) {
                                    totalRPE += set.rpe || (10 - set.rir);
                                    rpeCount++;
                                }
                                totalVolume += set.reps * set.weight;
                                volumePoints++;
                            });
                        }
                    });
                }
            });

            intelligence.kpis.avgRPE = rpeCount > 0 ? totalRPE / rpeCount : 0;
            intelligence.kpis.weeklyLoad = volumePoints > 0 ? totalVolume / volumePoints : 0;
        }

        setIntelligenceData(prev => ({ ...prev, kpis: intelligence.kpis }));
        return intelligence;
    }, []);

    /**
     * Generate intelligent training recommendations
     */
    const generateRecommendations = useCallback((currentProgram, trainingHistory, goals) => {
        const recommendations = [];
        let confidence = 0.5;

        if (!currentProgram || !trainingHistory) {
            return { recommendations, confidence };
        }

        // Volume optimization recommendations
        if (trainingHistory.length >= 4) {
            const recentSessions = trainingHistory.slice(-4);
            const avgRIR = recentSessions.reduce((sum, session) => {
                const sessionRIR = session.exercises?.reduce((exerciseSum, exercise) => {
                    return exerciseSum + (exercise.sets?.reduce((setSum, set) => {
                        return setSum + (set.rir || 2);
                    }, 0) || 0);
                }, 0) || 0;
                return sum + sessionRIR;
            }, 0) / (recentSessions.length * 10); // Rough average

            if (avgRIR > 3) {
                recommendations.push({
                    type: "volume",
                    priority: "medium",
                    action: "increase",
                    message: "Consider adding 2-3 sets per muscle group",
                    reasoning: "RIR consistently high - room for more volume",
                    confidence: 0.7
                });
            } else if (avgRIR < 1) {
                recommendations.push({
                    type: "volume",
                    priority: "high",
                    action: "decrease",
                    message: "Reduce volume by 15-20%",
                    reasoning: "RIR too low consistently - risk of overreaching",
                    confidence: 0.8
                });
            }
        }

        // Frequency optimization
        const muscleFrequencies = {};
        if (trainingHistory.length >= 7) {
            trainingHistory.slice(-7).forEach(session => {
                session.exercises?.forEach(exercise => {
                    const muscle = exercise.primaryMuscle || 'unknown';
                    muscleFrequencies[muscle] = (muscleFrequencies[muscle] || 0) + 1;
                });
            });

            Object.entries(muscleFrequencies).forEach(([muscle, frequency]) => {
                if (frequency < 2) {
                    recommendations.push({
                        type: "frequency",
                        priority: "medium",
                        action: "increase",
                        message: `Increase ${muscle} frequency to 2x/week minimum`,
                        reasoning: "Muscle trained only once per week",
                        confidence: 0.6
                    });
                }
            });
        }

        // Exercise variety recommendations
        if (currentProgram.exercises) {
            const exerciseTypes = {};
            currentProgram.exercises.forEach(exercise => {
                const type = exercise.type || 'unknown';
                exerciseTypes[type] = (exerciseTypes[type] || 0) + 1;
            });

            const compoundRatio = (exerciseTypes.compound || 0) / (currentProgram.exercises.length || 1);
            if (compoundRatio < 0.6) {
                recommendations.push({
                    type: "exercise_selection",
                    priority: "medium",
                    action: "modify",
                    message: "Add more compound movements",
                    reasoning: "Program lacks sufficient compound exercises",
                    confidence: 0.7
                });
            }
        }

        // Calculate overall confidence
        confidence = recommendations.length > 0
            ? recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length
            : 0.5;

        setIntelligenceData(prev => ({
            ...prev,
            recommendations,
            confidence
        }));

        return { recommendations, confidence };
    }, []);

    /**
     * Analyze training patterns and insights
     */
    const analyzeTrainingPatterns = useCallback((trainingHistory) => {
        if (!trainingHistory || trainingHistory.length < 7) {
            return null;
        }

        const patterns = {
            consistency: 0,
            progression: 0,
            recovery: 0,
            adherence: 0
        };

        // Consistency analysis (how regular are training sessions)
        const sessionDates = trainingHistory.map(session => new Date(session.date));
        sessionDates.sort((a, b) => a - b);

        const intervals = [];
        for (let i = 1; i < sessionDates.length; i++) {
            const days = (sessionDates[i] - sessionDates[i - 1]) / (1000 * 60 * 60 * 24);
            intervals.push(days);
        }

        const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        const intervalVariance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        patterns.consistency = Math.max(0, 1 - (intervalVariance / 10)); // Normalize to 0-1

        // Progression analysis (are weights/reps increasing)
        const exerciseProgress = {};
        trainingHistory.forEach(session => {
            session.exercises?.forEach(exercise => {
                const key = exercise.name;
                if (!exerciseProgress[key]) exerciseProgress[key] = [];

                const maxWeight = exercise.sets?.reduce((max, set) =>
                    Math.max(max, set.weight || 0), 0) || 0;
                exerciseProgress[key].push(maxWeight);
            });
        });

        let progressingExercises = 0;
        let totalExercises = 0;

        Object.values(exerciseProgress).forEach(weights => {
            if (weights.length >= 3) {
                totalExercises++;
                const recent = weights.slice(-3);
                const isProgressing = recent[2] > recent[0];
                if (isProgressing) progressingExercises++;
            }
        });

        patterns.progression = totalExercises > 0 ? progressingExercises / totalExercises : 0;

        // Recovery analysis (based on RIR trends)
        const rirTrends = [];
        trainingHistory.forEach(session => {
            const sessionRIR = session.exercises?.reduce((sum, exercise) => {
                return sum + (exercise.sets?.reduce((setSum, set) => {
                    return setSum + (set.rir || 2);
                }, 0) || 0);
            }, 0) || 0;
            rirTrends.push(sessionRIR);
        });

        // Check if RIR is stable (good recovery) vs declining (poor recovery)
        const recentRIR = rirTrends.slice(-3);
        const earlierRIR = rirTrends.slice(-6, -3);
        const recentAvg = recentRIR.reduce((sum, rir) => sum + rir, 0) / recentRIR.length;
        const earlierAvg = earlierRIR.reduce((sum, rir) => sum + rir, 0) / earlierRIR.length;

        patterns.recovery = recentAvg >= earlierAvg ? 0.8 : 0.4; // Simplified recovery score

        // Adherence (planned vs actual sessions)
        const plannedSessionsPerWeek = 4; // This should come from program
        const actualSessionsPerWeek = trainingHistory.length / (trainingHistory.length / 7);
        patterns.adherence = Math.min(1, actualSessionsPerWeek / plannedSessionsPerWeek);

        const insights = {
            patterns,
            summary: {
                strongPoints: [],
                weakPoints: [],
                suggestions: []
            }
        };

        // Generate insights based on patterns
        if (patterns.consistency > 0.8) {
            insights.summary.strongPoints.push("Excellent training consistency");
        } else if (patterns.consistency < 0.5) {
            insights.summary.weakPoints.push("Irregular training schedule");
            insights.summary.suggestions.push("Try to maintain more consistent training days");
        }

        if (patterns.progression > 0.7) {
            insights.summary.strongPoints.push("Good progression across exercises");
        } else if (patterns.progression < 0.3) {
            insights.summary.weakPoints.push("Limited progression in exercises");
            insights.summary.suggestions.push("Consider deload or technique focus");
        }

        if (patterns.recovery < 0.6) {
            insights.summary.weakPoints.push("Potential recovery issues");
            insights.summary.suggestions.push("Monitor sleep and nutrition more closely");
        }

        setIntelligenceData(prev => ({ ...prev, insights }));
        return insights;
    }, []);

    return {
        intelligenceData,
        loading,
        initializeIntelligence,
        generateRecommendations,
        analyzeTrainingPatterns,
        setLoading
    };
};
