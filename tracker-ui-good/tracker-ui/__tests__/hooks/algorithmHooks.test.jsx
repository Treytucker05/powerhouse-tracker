/**
 * Test validation for migrated algorithm hooks
 * Ensures all hooks are properly accessible from ProgramContext
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useVolumeAlgorithms } from '@/hooks/useVolumeAlgorithms';
import { useFatigueAlgorithms } from '@/hooks/useFatigueAlgorithms';
import { useIntelligenceAlgorithms } from '@/hooks/useIntelligenceAlgorithms';
import { useExerciseAlgorithms } from '@/hooks/useExerciseAlgorithms';

describe('Algorithm Hooks Migration Validation', () => {
    describe('useVolumeAlgorithms', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useVolumeAlgorithms());

            expect(result.current).toHaveProperty('volumeData');
            expect(result.current).toHaveProperty('scoreStimulus');
            expect(result.current).toHaveProperty('calculateVolumeLandmarks');
            expect(result.current).toHaveProperty('generateVolumeProgression');
            expect(result.current).toHaveProperty('analyzeSetQuality');
        });

        it('should calculate stimulus correctly', () => {
            const { result } = renderHook(() => useVolumeAlgorithms());

            const stimulusResult = result.current.scoreStimulus({
                mmc: 2,
                pump: 2,
                disruption: 2
            });

            expect(stimulusResult).toEqual({
                score: 6,
                advice: 'Stimulus adequate (6/9) → Keep sets the same',
                action: 'maintain',
                setChange: 0,
                breakdown: {
                    mmc: 2,
                    pump: 2,
                    disruption: 2
                }
            });
        });

        it('should generate volume progression correctly', () => {
            const { result } = renderHook(() => useVolumeAlgorithms());

            const progression = result.current.generateVolumeProgression(10, 20, 4);

            expect(progression).toEqual({
                startingVolume: 10,
                targetVolume: 20,
                weeklyIncrease: 3,
                totalIncrease: 10,
                progression: [
                    { week: 1, volume: 13, percentage: 65 },
                    { week: 2, volume: 15, percentage: 75 },
                    { week: 3, volume: 18, percentage: 90 },
                    { week: 4, volume: 20, percentage: 100 }
                ]
            });
        });
    });

    describe('useFatigueAlgorithms', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useFatigueAlgorithms());

            expect(result.current).toHaveProperty('fatigueData');
            expect(result.current).toHaveProperty('analyzeFrequency');
            expect(result.current).toHaveProperty('calculateOptimalFrequency');
            expect(result.current).toHaveProperty('calculateFatigueScore');
            expect(result.current).toHaveProperty('analyzeDeloadNeed');
        });

        it('should analyze frequency correctly', () => {
            const { result } = renderHook(() => useFatigueAlgorithms());

            const analysis = result.current.analyzeFrequency(2, 3, 'chest');

            expect(analysis).toHaveProperty('recoveryTime', 2);
            expect(analysis).toHaveProperty('sessionGap', 3);
            expect(analysis).toHaveProperty('recommendation');
            expect(analysis).toHaveProperty('action');
        });
    });

    describe('useIntelligenceAlgorithms', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useIntelligenceAlgorithms());

            expect(result.current).toHaveProperty('intelligenceData');
            expect(result.current).toHaveProperty('generateRecommendations');
            expect(result.current).toHaveProperty('analyzeTrainingPatterns');
        });
    });

    describe('useExerciseAlgorithms', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useExerciseAlgorithms());

            expect(result.current).toHaveProperty('exerciseData');
            expect(result.current).toHaveProperty('exerciseDatabase');
            expect(result.current).toHaveProperty('selectExercises');
            expect(result.current).toHaveProperty('optimizeExerciseOrder');
            expect(result.current).toHaveProperty('generateWorkoutProgram');
        });

        it('should have exercise database with proper structure', () => {
            const { result } = renderHook(() => useExerciseAlgorithms());

            expect(result.current.exerciseDatabase).toHaveProperty('chest');
            expect(result.current.exerciseDatabase).toHaveProperty('back');
            expect(result.current.exerciseDatabase).toHaveProperty('legs');

            // Check chest exercises structure
            const chestExercises = result.current.exerciseDatabase.chest;
            expect(chestExercises).toHaveProperty('barbell_bench_press');

            const benchPress = chestExercises.barbell_bench_press;
            expect(benchPress).toHaveProperty('name');
            expect(benchPress).toHaveProperty('type');
            expect(benchPress).toHaveProperty('primaryMuscles');
            expect(benchPress).toHaveProperty('fatigueIndex');
        });
    });
});
