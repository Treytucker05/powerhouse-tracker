/**
 * React Hook for Volume Algorithm Integration
 * Modernized from js/algorithms/volume.js for React applications
 * Implements RP Table 2.2 (MEV Stimulus Estimator) and volume progression
 */

import { useState, useCallback, useEffect } from 'react';

export const useVolumeAlgorithms = () => {
    const [volumeData, setVolumeData] = useState({
        stimulus: null,
        progression: null,
        landmarks: null
    });

    const [loading, setLoading] = useState(false);

    /**
     * RP Table 2.2: MEV Stimulus Estimator
     * Scores stimulus quality based on mind-muscle connection, pump, and workload
     */
    const scoreStimulus = useCallback(({ mmc, pump, disruption }) => {
        // Validate inputs
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
        const clampedMmc = clamp(mmc, 0, 3);
        const clampedPump = clamp(pump, 0, 3);
        const clampedWorkload = clamp(disruption, 0, 3);

        const totalScore = clampedMmc + clampedPump + clampedWorkload;

        let advice, action, setChange;

        if (totalScore <= 3) {
            advice = `Stimulus too low (${totalScore}/9) → Add 2 sets next session`;
            action = "add_sets";
            setChange = 2;
        } else if (totalScore <= 6) {
            advice = `Stimulus adequate (${totalScore}/9) → Keep sets the same`;
            action = "maintain";
            setChange = 0;
        } else {
            advice = `Stimulus excessive (${totalScore}/9) → Remove 1-2 sets next session`;
            action = "reduce_sets";
            setChange = -1;
        }

        const result = {
            score: totalScore,
            advice,
            action,
            setChange,
            breakdown: {
                mmc: clampedMmc,
                pump: clampedPump,
                disruption: clampedWorkload,
            },
        };

        setVolumeData(prev => ({ ...prev, stimulus: result }));
        return result;
    }, []);

    /**
     * Calculate optimal volume landmarks for muscle groups
     */
    const calculateVolumeLandmarks = useCallback((muscleGroup, experience = 'intermediate') => {
        const baseLandmarks = {
            chest: { MEV: 8, MRV: 22, MAV: 25 },
            back: { MEV: 10, MRV: 25, MAV: 28 },
            shoulders: { MEV: 8, MRV: 20, MAV: 24 },
            biceps: { MEV: 6, MRV: 20, MAV: 26 },
            triceps: { MEV: 6, MRV: 18, MAV: 22 },
            quads: { MEV: 8, MRV: 20, MAV: 25 },
            hamstrings: { MEV: 6, MRV: 16, MAV: 20 },
            glutes: { MEV: 6, MRV: 16, MAV: 20 },
            calves: { MEV: 8, MRV: 16, MAV: 20 }
        };

        const experienceModifiers = {
            beginner: 0.7,
            intermediate: 1.0,
            advanced: 1.3
        };

        const modifier = experienceModifiers[experience] || 1.0;
        const base = baseLandmarks[muscleGroup.toLowerCase()];

        if (!base) {
            return null;
        }

        const landmarks = {
            MEV: Math.round(base.MEV * modifier),
            MRV: Math.round(base.MRV * modifier),
            MAV: Math.round(base.MAV * modifier),
            muscleGroup,
            experience
        };

        setVolumeData(prev => ({ ...prev, landmarks }));
        return landmarks;
    }, []);

    /**
     * Generate weekly volume progression
     */
    const generateVolumeProgression = useCallback((startingVolume, targetVolume, weeks) => {
        if (!startingVolume || !targetVolume || !weeks) {
            return null;
        }

        const progression = [];
        const weeklyIncrease = (targetVolume - startingVolume) / weeks;

        for (let week = 1; week <= weeks; week++) {
            const volume = Math.round(startingVolume + (weeklyIncrease * week));
            progression.push({
                week,
                volume,
                percentage: Math.round((volume / targetVolume) * 100)
            });
        }

        const result = {
            progression,
            totalIncrease: targetVolume - startingVolume,
            weeklyIncrease: Math.round(weeklyIncrease),
            startingVolume,
            targetVolume
        };

        setVolumeData(prev => ({ ...prev, progression: result }));
        return result;
    }, []);

    /**
     * Analyze set quality and provide recommendations
     */
    const analyzeSetQuality = useCallback((sets) => {
        if (!sets || !Array.isArray(sets)) {
            return null;
        }

        let totalRIR = 0;
        let qualitySets = 0;
        let overreachingSets = 0;

        sets.forEach(set => {
            if (set.rir !== null && set.rir !== undefined) {
                totalRIR += set.rir;
                if (set.rir >= 1 && set.rir <= 3) {
                    qualitySets++;
                } else if (set.rir === 0) {
                    overreachingSets++;
                }
            }
        });

        const avgRIR = sets.length > 0 ? totalRIR / sets.length : 0;
        const qualityPercentage = sets.length > 0 ? (qualitySets / sets.length) * 100 : 0;

        let recommendation = "";
        if (avgRIR > 4) {
            recommendation = "Consider increasing intensity - too much RIR";
        } else if (avgRIR < 1) {
            recommendation = "Consider backing off intensity - may be overreaching";
        } else {
            recommendation = "Intensity looks appropriate";
        }

        return {
            avgRIR: Math.round(avgRIR * 10) / 10,
            qualitySets,
            overreachingSets,
            qualityPercentage: Math.round(qualityPercentage),
            recommendation,
            totalSets: sets.length
        };
    }, []);

    return {
        volumeData,
        loading,
        scoreStimulus,
        calculateVolumeLandmarks,
        generateVolumeProgression,
        analyzeSetQuality,
        setLoading
    };
};
