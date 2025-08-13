import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Info, CheckCircle, AlertTriangle, Zap, Users } from 'lucide-react';

export default function Step14PeriodizationBible({ data, updateData }) {
    const [bibleConfig, setBibleConfig] = useState(data.bibleConfig || {});
    const [selectedExercises, setSelectedExercises] = useState(data.bibleExercises || {});
    const [volumeLevel, setVolumeLevel] = useState(data.bibleVolumeLevel || 'moderate');
    const [experienceLevel, setExperienceLevel] = useState(data.bibleExperience || 'intermediate');

    // Volume level options
    const volumeOptions = {
        moderate: {
            label: 'Moderate Volume',
            description: 'Good starting point for most lifters',
            exerciseCount: '5-6 exercises per session',
            totalSets: '15-20 sets',
            timeEstimate: '60-75 minutes'
        },
        high: {
            label: 'High Volume',
            description: 'For experienced lifters with good recovery',
            exerciseCount: '6-7 exercises per session',
            totalSets: '20-25 sets',
            timeEstimate: '75-90 minutes'
        },
        extreme: {
            label: 'Extreme Volume',
            description: 'Maximum work capacity development',
            exerciseCount: '7-8 exercises per session',
            totalSets: '25-30 sets',
            timeEstimate: '90+ minutes'
        }
    };

    // Exercise categories by movement pattern
    const exerciseDatabase = {
        push_vertical: {
            name: 'Vertical Push',
            exercises: [
                { name: 'DB Shoulder Press', sets: '5×10-15', intensity: 'moderate' },
                { name: 'Push Press', sets: '3×8-12', intensity: 'high' },
                { name: 'Pike Push-ups', sets: '3×8-15', intensity: 'bodyweight' },
                { name: 'Landmine Press', sets: '4×10-12', intensity: 'moderate' }
            ]
        },
        push_horizontal: {
            name: 'Horizontal Push',
            exercises: [
                { name: 'DB Bench Press', sets: '5×10-15', intensity: 'moderate' },
                { name: 'Incline DB Press', sets: '4×10-12', intensity: 'moderate' },
                { name: 'Push-ups', sets: '3×15-25', intensity: 'bodyweight' },
                { name: 'Dips', sets: '3×10-20', intensity: 'bodyweight' }
            ]
        },
        pull_vertical: {
            name: 'Vertical Pull',
            exercises: [
                { name: 'Chin-ups', sets: '5×8-12', intensity: 'bodyweight' },
                { name: 'Lat Pulldowns', sets: '4×10-15', intensity: 'moderate' },
                { name: 'Pull-ups', sets: '4×6-10', intensity: 'bodyweight' },
                { name: 'Cable Pulldowns', sets: '3×12-15', intensity: 'light' }
            ]
        },
        pull_horizontal: {
            name: 'Horizontal Pull',
            exercises: [
                { name: 'DB Rows', sets: '5×10-15', intensity: 'moderate' },
                { name: 'Barbell Rows', sets: '4×8-12', intensity: 'moderate' },
                { name: 'Cable Rows', sets: '4×12-15', intensity: 'moderate' },
                { name: 'Kroc Rows', sets: '2×20-40', intensity: 'high' }
            ]
        },
        squat_pattern: {
            name: 'Squat Pattern',
            exercises: [
                { name: 'Goblet Squats', sets: '3×15-20', intensity: 'light' },
                { name: 'Bulgarian Split Squats', sets: '3×10-15', intensity: 'moderate' },
                { name: 'Leg Press', sets: '4×15-20', intensity: 'moderate' },
                { name: 'Lunges', sets: '3×12-16', intensity: 'moderate' }
            ]
        },
        hinge_pattern: {
            name: 'Hip Hinge Pattern',
            exercises: [
                { name: 'Romanian Deadlifts', sets: '4×10-12', intensity: 'moderate' },
                { name: 'Good Mornings', sets: '3×10-15', intensity: 'moderate' },
                { name: 'Glute-Ham Raises', sets: '3×8-15', intensity: 'bodyweight' },
                { name: 'Back Extensions', sets: '3×15-20', intensity: 'light' }
            ]
        },
        core: {
            name: 'Core/Abs',
            exercises: [
                { name: 'Hanging Leg Raises', sets: '3×10-20', intensity: 'bodyweight' },
                { name: 'Planks', sets: '3×30-60s', intensity: 'bodyweight' },
                { name: 'Ab Wheel', sets: '3×8-15', intensity: 'bodyweight' },
                { name: 'Russian Twists', sets: '3×20-30', intensity: 'light' }
            ]
        },
        isolation: {
            name: 'Isolation Work',
            exercises: [
                { name: 'Bicep Curls', sets: '2×15-20', intensity: 'light' },
                { name: 'Tricep Extensions', sets: '2×15-20', intensity: 'light' },
                { name: 'Lateral Raises', sets: '2×15-20', intensity: 'light' },
                { name: 'Face Pulls', sets: '2×15-20', intensity: 'light' }
            ]
        }
    };

    // Daily structure based on main lift
    const dailyStructure = {
        press: ['push_vertical', 'pull_horizontal', 'core', 'isolation'],
        deadlift: ['hinge_pattern', 'pull_vertical', 'squat_pattern', 'core'],
        bench: ['push_horizontal', 'pull_horizontal', 'core', 'isolation'],
        squat: ['squat_pattern', 'hinge_pattern', 'pull_vertical', 'core']
    };

    const liftNames = {
        press: 'Press Day',
        deadlift: 'Deadlift Day',
        bench: 'Bench Day',
        squat: 'Squat Day'
    };

    const handleExerciseSelection = (day, category, exercise) => {
        const daySelections = selectedExercises[day] || {};
        const categorySelections = daySelections[category] || [];

        const isSelected = categorySelections.some(ex => ex.name === exercise.name);
        let newSelections;

        if (isSelected) {
            newSelections = categorySelections.filter(ex => ex.name !== exercise.name);
        } else {
            // Limit selections based on volume level
            const maxSelections = getMaxSelectionsPerCategory();
            if (categorySelections.length < maxSelections) {
                newSelections = [...categorySelections, exercise];
            } else {
                return; // Don't add if at limit
            }
        }

        updateStepData({
            bibleExercises: {
                ...selectedExercises,
                [day]: {
                    ...daySelections,
                    [category]: newSelections
                }
            }
        });
    };

    const getMaxSelectionsPerCategory = () => {
        switch (volumeLevel) {
            case 'moderate': return 2;
            case 'high': return 3;
            case 'extreme': return 4;
            default: return 2;
        }
    };

    const getVolumeMultiplier = () => {
        switch (volumeLevel) {
            case 'moderate': return 1.0;
            case 'high': return 1.3;
            case 'extreme': return 1.6;
            default: return 1.0;
        }
    };

    const updateStepData = (updates) => {
        if (updates.bibleExercises) {
            setSelectedExercises(updates.bibleExercises);
        }
        updateData({
            bibleConfig,
            bibleExercises: updates.bibleExercises ?? selectedExercises,
            bibleVolumeLevel: volumeLevel,
            bibleExperience: experienceLevel,
            ...updates
        });
    };

    const getTotalExercisesPerDay = (day) => {
        const daySelections = selectedExercises[day] || {};
        return Object.values(daySelections).reduce((total, exercises) => total + exercises.length, 0);
    };

    const getTotalSetsPerDay = (day) => {
        const daySelections = selectedExercises[day] || {};
        let totalSets = 5; // Main 5/3/1 work

        Object.values(daySelections).forEach(exercises => {
            exercises.forEach(exercise => {
                const setsStr = (exercise.sets || '').split('×')[0] || '0';
                const sets = parseInt(setsStr, 10) || 0;
                totalSets += sets * getVolumeMultiplier();
            });
        });

        return Math.round(totalSets);
    };

    const isStepComplete = () => {
        const days = Object.keys(liftNames);
        // Require at least 4 exercises selected on each day for completion
        return days.every(day => getTotalExercisesPerDay(day) >= 4);
    };

    const getRecoveryWarning = () => {
        const avgSetsPerDay = Object.keys(liftNames).reduce((total, day) =>
            total + getTotalSetsPerDay(day), 0
        ) / 4;

        if (avgSetsPerDay > 25) return { level: 'extreme', message: 'Requires exceptional recovery capacity' };
        if (avgSetsPerDay > 20) return { level: 'high', message: 'Requires good recovery protocols' };
        return { level: 'moderate', message: 'Manageable for most lifters' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 14: "Periodization Bible" Template
                </h3>
                <p className="text-gray-400">
                    High-volume template for advanced lifters focused on maximum work capacity development.
                </p>
            </div>

            {/* Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Periodization Bible Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>High volume approach:</strong> 5-8 exercises per session for maximum adaptation</li>
                            <li>• <strong>Movement patterns:</strong> Cover all fundamental human movements systematically</li>
                            <li>• <strong>Work capacity:</strong> Build ability to handle increasingly larger training loads</li>
                            <li>• <strong>Advanced recovery:</strong> Requires excellent nutrition, sleep, and stress management</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Volume Level Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-medium text-white">Volume Level</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(volumeOptions).map(([level, config]) => (
                        <div
                            key={level}
                            onClick={() => setVolumeLevel(level)}
                            className={`p-4 rounded border-2 cursor-pointer transition-colors ${volumeLevel === level
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <h5 className={`font-medium mb-2 ${volumeLevel === level ? 'text-red-300' : 'text-white'}`}>
                                {config.label}
                            </h5>
                            <div className="text-sm text-gray-400 space-y-1">
                                <p>{config.description}</p>
                                <p>{config.exerciseCount}</p>
                                <p>{config.totalSets}</p>
                                <p className="text-blue-400">{config.timeEstimate}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recovery Warning */}
                <div className={`p-3 rounded border ${getRecoveryWarning().level === 'extreme' ? 'border-red-500 bg-red-900/20' :
                        getRecoveryWarning().level === 'high' ? 'border-yellow-500 bg-yellow-900/20' :
                            'border-green-500 bg-green-900/20'
                    }`}>
                    <div className="text-sm">
                        <span className="font-medium">Recovery Requirement: </span>
                        <span className={
                            getRecoveryWarning().level === 'extreme' ? 'text-red-300' :
                                getRecoveryWarning().level === 'high' ? 'text-yellow-300' :
                                    'text-green-300'
                        }>
                            {getRecoveryWarning().message}
                        </span>
                    </div>
                </div>
            </div>

            {/* Daily Exercise Selection */}
            <div className="space-y-6">
                {Object.entries(liftNames).map(([day, dayName]) => (
                    <div key={day} className="bg-gray-700 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <BookOpen className="w-6 h-6 text-red-400" />
                                <h4 className="text-lg font-medium text-white">{dayName}</h4>
                            </div>
                            <div className="text-sm text-gray-400">
                                {getTotalExercisesPerDay(day)} exercises • {getTotalSetsPerDay(day)} total sets
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Main Lift */}
                            <div className="bg-gray-800 p-3 rounded border-l-4 border-red-500">
                                <div className="flex justify-between items-center">
                                    <span className="text-red-400 font-medium">Main Lift: 5/3/1 Protocol</span>
                                    <span className="text-gray-400 text-sm">3 working sets + warm-up</span>
                                </div>
                            </div>

                            {/* Movement Categories */}
                            {dailyStructure[day].map(category => (
                                <div key={category} className="bg-gray-800 p-4 rounded">
                                    <h5 className="text-white font-medium mb-3">
                                        {exerciseDatabase[category].name}
                                        <span className="text-sm text-gray-400 ml-2">
                                            (Select up to {getMaxSelectionsPerCategory()})
                                        </span>
                                    </h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {exerciseDatabase[category].exercises.map(exercise => {
                                            const isSelected = selectedExercises[day]?.[category]?.some(ex => ex.name === exercise.name);
                                            const categoryCount = selectedExercises[day]?.[category]?.length || 0;
                                            const canSelect = categoryCount < getMaxSelectionsPerCategory();

                                            return (
                                                <div
                                                    key={exercise.name}
                                                    onClick={() => (isSelected || canSelect) && handleExerciseSelection(day, category, exercise)}
                                                    className={`p-3 rounded border cursor-pointer transition-colors text-sm ${isSelected
                                                            ? 'border-red-500 bg-red-900/20 text-red-300'
                                                            : canSelect
                                                                ? 'border-gray-600 bg-gray-700 hover:border-gray-500 text-white'
                                                                : 'border-gray-600 bg-gray-700 opacity-50 cursor-not-allowed text-gray-500'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium">{exercise.name}</div>
                                                            <div className="text-xs text-gray-400">{exercise.sets}</div>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded ${exercise.intensity === 'high' ? 'bg-red-600 text-white' :
                                                                exercise.intensity === 'moderate' ? 'bg-yellow-600 text-white' :
                                                                    exercise.intensity === 'light' ? 'bg-green-600 text-white' :
                                                                        'bg-blue-600 text-white'
                                                            }`}>
                                                            {exercise.intensity}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Volume Summary */}
            {Object.keys(selectedExercises).length > 0 && (
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Weekly Volume Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(liftNames).map(([day, dayName]) => (
                            <div key={day} className="text-center">
                                <div className="text-red-400 font-medium">{dayName}</div>
                                <div className="text-sm text-gray-300">
                                    {getTotalExercisesPerDay(day)} exercises
                                </div>
                                <div className="text-sm text-gray-300">
                                    {getTotalSetsPerDay(day)} sets
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {volumeLevel === 'extreme' && (
                <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="text-red-200 text-sm">
                            <strong>Extreme Volume Warning:</strong> This volume level requires exceptional recovery capacity.
                            Ensure 8+ hours sleep, optimal nutrition, and minimal life stress before attempting.
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(selectedExercises).some(day => getTotalSetsPerDay(day) > 25) && (
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 text-sm">
                            <strong>High Volume Alert:</strong> Some days exceed 25 total sets.
                            Monitor recovery carefully and be prepared to reduce volume if needed.
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 14 Complete! Periodization Bible template configured with {volumeLevel} volume level.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
