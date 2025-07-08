import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext';
import {
    calculatePersonalizedVolume,
    calculateWeeklyVolume,
    calculateWeeklyRIR,
    calculateVolumeDistribution
} from '../../lib/algorithms/rpAlgorithms';
import { StepProgress } from '../../lib/designSystem.jsx';

interface WeeklyVolume {
    week: number;
    volume: number;
    rir: number;
    phase: string;
}

interface MuscleVolumeProgression {
    muscle: string;
    mev: number;
    mrv: number;
    mav: number;
    frequency: string;
    specialization: boolean;
    weeklyProgression: WeeklyVolume[];
}

const VolumeDistribution: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch, validateCurrentStep, canProceedToNextStep } = useBuilder();
    const { programDetails, blocks, specialization } = state;
    const [volumeProgressions, setVolumeProgressions] = useState<MuscleVolumeProgression[]>([]);
    const [selectedMuscle, setSelectedMuscle] = useState<string>('chest');

    // Calculate volume progressions for all muscles
    useEffect(() => {
        if (programDetails.trainingExperience && programDetails.dietPhase && blocks.length > 0) {
            const muscleGroups = [
                'chest', 'back', 'shoulders',
                'biceps', 'triceps',
                'quads', 'hamstrings', 'glutes',
                'calves', 'abs', 'traps', 'forearms'
            ];

            const progressions = muscleGroups.map(muscle => {
                const isSpecialized = specialization !== 'None' &&
                    ((specialization === 'Chest' && muscle === 'chest') ||
                        (specialization === 'Back' && muscle === 'back') ||
                        (specialization === 'Shoulders' && muscle === 'shoulders') ||
                        (specialization === 'Arms' && (muscle === 'biceps' || muscle === 'triceps')) ||
                        (specialization === 'Legs' && (muscle === 'quads' || muscle === 'hamstrings' || muscle === 'glutes')));

                const personalizedVolume = calculatePersonalizedVolume(
                    muscle,
                    programDetails.trainingExperience,
                    programDetails.dietPhase,
                    isSpecialized
                );

                // Calculate weekly progression for each block
                const weeklyProgression: WeeklyVolume[] = [];
                let currentWeek = 1;

                blocks.forEach(block => {
                    for (let week = 1; week <= block.weeks; week++) {
                        let weeklyVolume: number;
                        let weeklyRIR: number;

                        if (block.type === 'accumulation') {
                            weeklyVolume = calculateWeeklyVolume(
                                personalizedVolume.mev,
                                personalizedVolume.mrv,
                                week,
                                block.weeks
                            );
                            weeklyRIR = calculateWeeklyRIR(week, block.weeks, programDetails.trainingExperience);
                        } else if (block.type === 'intensification') {
                            weeklyVolume = Math.round(personalizedVolume.mav * 0.9); // Slightly below MAV
                            weeklyRIR = Math.max(0, calculateWeeklyRIR(week, block.weeks, programDetails.trainingExperience) - 1);
                        } else if (block.type === 'realization') {
                            weeklyVolume = Math.round(personalizedVolume.mev * 0.7); // Taper volume
                            weeklyRIR = Math.max(0, calculateWeeklyRIR(week, block.weeks, programDetails.trainingExperience) - 2);
                        } else { // deload
                            weeklyVolume = personalizedVolume.mv;
                            weeklyRIR = 4; // Easy deload
                        }

                        weeklyProgression.push({
                            week: currentWeek,
                            volume: weeklyVolume,
                            rir: weeklyRIR,
                            phase: block.type
                        });

                        currentWeek++;
                    }
                });

                return {
                    muscle,
                    mev: personalizedVolume.mev,
                    mrv: personalizedVolume.mrv,
                    mav: personalizedVolume.mav,
                    frequency: personalizedVolume.frequency,
                    specialization: isSpecialized,
                    weeklyProgression
                };
            });

            setVolumeProgressions(progressions);
        }
    }, [programDetails.trainingExperience, programDetails.dietPhase, blocks, specialization]);

    // Handle navigation
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 3 });
        navigate('/program-design/timeline');
    };

    const handleNext = () => {
        if (canProceedToNextStep()) {
            dispatch({ type: 'SET_STEP', payload: 4 });
            navigate('/program-design/review');
        }
    };

    const selectedProgression = volumeProgressions.find(p => p.muscle === selectedMuscle);

    // Get phase color
    const getPhaseColor = (phase: string) => {
        switch (phase) {
            case 'accumulation': return 'bg-blue-500';
            case 'intensification': return 'bg-yellow-500';
            case 'realization': return 'bg-red-500';
            case 'deload': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Volume Distribution</h1>
                    <p className="text-gray-400">Step 3.5 of 4 - Review weekly volume progression</p>

                    {/* Progress Steps - Desktop */}
                    <div className="hidden md:block mt-6">
                        <StepProgress
                            currentStep={3}
                            totalSteps={4}
                            steps={['Details', 'Template', 'Timeline', 'Review']}
                        />
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-4 md:hidden">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '87.5%' }}></div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Muscle Group Selector */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Select Muscle Group</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {volumeProgressions.map((progression) => (
                                <button
                                    key={progression.muscle}
                                    onClick={() => setSelectedMuscle(progression.muscle)}
                                    className={`px-4 py-3 rounded-lg border transition-colors capitalize ${selectedMuscle === progression.muscle
                                            ? 'bg-red-500 border-red-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                                        }`}
                                >
                                    {progression.muscle}
                                    {progression.specialization && (
                                        <span className="block text-xs text-red-300 mt-1">+30%</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Volume Progression Chart */}
                    {selectedProgression && (
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-100 capitalize">
                                    {selectedProgression.muscle} Volume Progression
                                </h2>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">MEV: {selectedProgression.mev} | MRV: {selectedProgression.mrv}</p>
                                    <p className="text-gray-400 text-sm">Frequency: {selectedProgression.frequency}</p>
                                </div>
                            </div>

                            {/* Weekly Volume Chart */}
                            <div className="bg-gray-800 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                    {selectedProgression.weeklyProgression.map((week, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-xs text-gray-400 mb-1">W{week.week}</div>
                                            <div
                                                className={`${getPhaseColor(week.phase)} rounded-lg p-2 text-white font-bold text-sm`}
                                                style={{
                                                    height: `${Math.max(30, (week.volume / selectedProgression.mrv) * 100)}px`,
                                                    minHeight: '30px'
                                                }}
                                            >
                                                {week.volume}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">RIR {week.rir}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Volume Distribution Per Training Day */}
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                                    Volume Distribution Per Training Day
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedProgression.weeklyProgression.slice(0, 4).map((week, index) => {
                                        const distribution = calculateVolumeDistribution(
                                            week.volume,
                                            programDetails.trainingDaysPerWeek,
                                            selectedProgression.frequency
                                        );

                                        return (
                                            <div key={index} className="bg-gray-700 rounded-lg p-4">
                                                <h4 className="text-white font-medium mb-3">Week {week.week} ({week.volume} sets)</h4>
                                                <div className="space-y-2">
                                                    {distribution.map((dayVolume, dayIndex) => (
                                                        <div key={dayIndex} className="flex justify-between items-center">
                                                            <span className="text-gray-300">Day {dayIndex + 1}:</span>
                                                            <span className="text-white font-bold">
                                                                {dayVolume} sets
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Stats */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Program Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-2">Total Volume</h3>
                                <p className="text-3xl font-bold text-blue-400">
                                    {volumeProgressions.reduce((sum, p) => sum + p.weeklyProgression.reduce((weekSum, w) => weekSum + w.volume, 0), 0)}
                                </p>
                                <p className="text-gray-400 text-sm">sets across all weeks</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-2">Specialized Muscles</h3>
                                <p className="text-3xl font-bold text-red-400">
                                    {volumeProgressions.filter(p => p.specialization).length}
                                </p>
                                <p className="text-gray-400 text-sm">muscle groups</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-2">Program Duration</h3>
                                <p className="text-3xl font-bold text-green-400">{programDetails.duration}</p>
                                <p className="text-gray-400 text-sm">weeks</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Timeline
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105"
                        >
                            Next: Review & Generate →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolumeDistribution;
