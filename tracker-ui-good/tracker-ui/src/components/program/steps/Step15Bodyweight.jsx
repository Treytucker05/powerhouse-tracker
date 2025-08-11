import React, { useState, useEffect } from 'react';
import { Weight, Zap, Clock, TrendingUp, CheckCircle, Info, AlertTriangle, Plus, Minus } from 'lucide-react';

export default function Step15Bodyweight({ data, updateData }) {
    const [bodyweightConfig, setBodyweightConfig] = useState(data.bodyweightConfig || {
        selectedExercises: {
            squat: [],
            bench: [],
            deadlift: [],
            overhead_press: []
        },
        progressionMethod: 'volume', // volume, difficulty, density, load
        repScheme: 'standard', // standard, cluster, time_based
        frequency: 'daily' // daily, session_based
    });

    const [customExercises, setCustomExercises] = useState(data.customExercises || {});

    // Bodyweight exercise options per main lift
    const bodyweightExercises = {
        squat: [
            { name: 'Bodyweight Squats', difficulty: 'beginner', category: 'squat_pattern' },
            { name: 'Jump Squats', difficulty: 'intermediate', category: 'power' },
            { name: 'Single-Leg Squats (Pistol)', difficulty: 'advanced', category: 'unilateral' },
            { name: 'Bulgarian Split Squats', difficulty: 'intermediate', category: 'unilateral' },
            { name: 'Walking Lunges', difficulty: 'beginner', category: 'unilateral' },
            { name: 'Reverse Lunges', difficulty: 'beginner', category: 'unilateral' },
            { name: 'Lateral Lunges', difficulty: 'intermediate', category: 'unilateral' },
            { name: 'Cossack Squats', difficulty: 'advanced', category: 'mobility' }
        ],
        bench: [
            { name: 'Push-ups', difficulty: 'beginner', category: 'push' },
            { name: 'Incline Push-ups', difficulty: 'beginner', category: 'push' },
            { name: 'Decline Push-ups', difficulty: 'intermediate', category: 'push' },
            { name: 'Diamond Push-ups', difficulty: 'intermediate', category: 'tricep_focus' },
            { name: 'Wide-Grip Push-ups', difficulty: 'beginner', category: 'chest_focus' },
            { name: 'One-Arm Push-ups', difficulty: 'advanced', category: 'unilateral' },
            { name: 'Handstand Push-ups', difficulty: 'advanced', category: 'overhead' },
            { name: 'Archer Push-ups', difficulty: 'advanced', category: 'unilateral' }
        ],
        deadlift: [
            { name: 'Single-Leg Deadlifts', difficulty: 'intermediate', category: 'hip_hinge' },
            { name: 'Good Mornings (bodyweight)', difficulty: 'beginner', category: 'hip_hinge' },
            { name: 'Glute Bridges', difficulty: 'beginner', category: 'glute_activation' },
            { name: 'Single-Leg Glute Bridges', difficulty: 'intermediate', category: 'unilateral' },
            { name: 'Jump Squats', difficulty: 'intermediate', category: 'power' },
            { name: 'Broad Jumps', difficulty: 'intermediate', category: 'power' },
            { name: 'Wall Sits', difficulty: 'beginner', category: 'isometric' }
        ],
        overhead_press: [
            { name: 'Pike Push-ups', difficulty: 'intermediate', category: 'overhead' },
            { name: 'Handstand Push-ups', difficulty: 'advanced', category: 'overhead' },
            { name: 'Dips (chair/bench)', difficulty: 'intermediate', category: 'tricep_focus' },
            { name: 'Pull-ups', difficulty: 'intermediate', category: 'pull' },
            { name: 'Chin-ups', difficulty: 'beginner', category: 'pull' },
            { name: 'Assisted Pull-ups', difficulty: 'beginner', category: 'pull' },
            { name: 'Inverted Rows', difficulty: 'beginner', category: 'pull' },
            { name: 'Face Pulls (resistance band)', difficulty: 'beginner', category: 'rear_delt' }
        ]
    };

    // Core bodyweight exercises for all programs
    const coreExercises = [
        { name: 'Planks', difficulty: 'beginner', category: 'core' },
        { name: 'Side Planks', difficulty: 'beginner', category: 'core' },
        { name: 'Mountain Climbers', difficulty: 'intermediate', category: 'core' },
        { name: 'Dead Bug', difficulty: 'beginner', category: 'core' },
        { name: 'Bird Dog', difficulty: 'beginner', category: 'core' },
        { name: 'Hollow Body Hold', difficulty: 'intermediate', category: 'core' }
    ];

    const progressionMethods = {
        volume: {
            name: 'Volume Progression',
            description: 'Increase total reps per session',
            example: 'Week 1: 50 push-ups → Week 2: 60 push-ups'
        },
        difficulty: {
            name: 'Difficulty Progression',
            description: 'Progress to harder variations',
            example: 'Push-ups → Decline Push-ups → One-Arm Push-ups'
        },
        density: {
            name: 'Density Progression',
            description: 'Same work in less time',
            example: 'Complete 100 reps in 15 min → 100 reps in 12 min'
        },
        load: {
            name: 'Load Progression',
            description: 'Add weight via vest or backpack',
            example: 'Bodyweight → +10lbs vest → +20lbs vest'
        }
    };

    const repSchemes = {
        standard: {
            name: 'Standard Sets',
            description: 'Traditional set/rep scheme',
            example: '3 sets × 15 reps'
        },
        cluster: {
            name: 'Cluster Sets',
            description: 'Break large numbers into smaller sets',
            example: '100 total reps = 10 sets × 10 reps'
        },
        time_based: {
            name: 'Time-Based',
            description: 'Work for time rather than reps',
            example: '3 sets × 30 seconds work'
        }
    };

    const handleExerciseToggle = (lift, exercise) => {
        const currentSelected = bodyweightConfig.selectedExercises[lift] || [];
        const isSelected = currentSelected.some(ex => ex.name === exercise.name);

        let newSelected;
        if (isSelected) {
            newSelected = currentSelected.filter(ex => ex.name !== exercise.name);
        } else {
            newSelected = [...currentSelected, exercise];
        }

        setBodyweightConfig(prev => ({
            ...prev,
            selectedExercises: {
                ...prev.selectedExercises,
                [lift]: newSelected
            }
        }));

        updateStepData({
            bodyweightConfig: {
                ...bodyweightConfig,
                selectedExercises: {
                    ...bodyweightConfig.selectedExercises,
                    [lift]: newSelected
                }
            }
        });
    };

    const handleProgressionChange = (method) => {
        setBodyweightConfig(prev => ({
            ...prev,
            progressionMethod: method
        }));
        updateStepData({ bodyweightConfig: { ...bodyweightConfig, progressionMethod: method } });
    };

    const handleRepSchemeChange = (scheme) => {
        setBodyweightConfig(prev => ({
            ...prev,
            repScheme: scheme
        }));
        updateStepData({ bodyweightConfig: { ...bodyweightConfig, repScheme: scheme } });
    };

    const updateStepData = (updates) => {
        updateData({
            bodyweightConfig: updates.bodyweightConfig || bodyweightConfig,
            customExercises,
            ...updates
        });
    };

    const isStepComplete = () => {
        const hasExercisesSelected = Object.values(bodyweightConfig.selectedExercises).some(
            exercises => exercises.length > 0
        );
        return hasExercisesSelected && bodyweightConfig.progressionMethod && bodyweightConfig.repScheme;
    };

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-900/20 border-green-600';
            case 'intermediate': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
            case 'advanced': return 'text-red-400 bg-red-900/20 border-red-600';
            default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 15: "Bodyweight" Template
                </h3>
                <p className="text-gray-400">
                    Equipment-free assistance work using bodyweight movements for when you can't access weights
                </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Bodyweight Training Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Perfect for travel, home workouts, or minimal equipment scenarios</li>
                            <li>• Focus on movement quality and progressive overload through volume or difficulty</li>
                            <li>• Use multiple progression methods to continue advancing</li>
                            <li>• Can supplement or replace traditional assistance work</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Progression Method Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
                    Progression Method
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(progressionMethods).map(([key, method]) => (
                        <div
                            key={key}
                            onClick={() => handleProgressionChange(key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${bodyweightConfig.progressionMethod === key
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <h5 className="text-white font-medium mb-1">{method.name}</h5>
                            <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                            <p className="text-gray-500 text-xs italic">{method.example}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rep Scheme Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-red-400" />
                    Rep Scheme
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(repSchemes).map(([key, scheme]) => (
                        <div
                            key={key}
                            onClick={() => handleRepSchemeChange(key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${bodyweightConfig.repScheme === key
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <h5 className="text-white font-medium mb-1">{scheme.name}</h5>
                            <p className="text-gray-400 text-sm mb-2">{scheme.description}</p>
                            <p className="text-gray-500 text-xs italic">{scheme.example}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exercise Selection by Lift */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Weight className="w-5 h-5 mr-2 text-red-400" />
                    Exercise Selection by Main Lift
                </h4>

                {Object.entries(bodyweightExercises).map(([lift, exercises]) => (
                    <div key={lift} className="mb-6 last:mb-0">
                        <h5 className="text-white font-medium mb-3 flex items-center">
                            {liftNames[lift]} Assistance
                            <span className="ml-2 text-sm text-gray-400">
                                ({bodyweightConfig.selectedExercises[lift]?.length || 0} selected)
                            </span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {exercises.map((exercise, index) => {
                                const isSelected = bodyweightConfig.selectedExercises[lift]?.some(
                                    ex => ex.name === exercise.name
                                );

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleExerciseToggle(lift, exercise)}
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-red-500 bg-red-900/20'
                                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-white text-sm font-medium">
                                                {exercise.name}
                                            </span>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(exercise.difficulty)}`}>
                                            {exercise.difficulty}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Core Exercise Recommendations */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-red-400" />
                    Core Exercise Recommendations
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    These core exercises complement any bodyweight program and should be included 2-3 times per week.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {coreExercises.map((exercise, index) => (
                        <div key={index} className="p-3 rounded-lg bg-gray-800 border border-gray-600">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-medium">{exercise.name}</span>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(exercise.difficulty)}`}>
                                {exercise.difficulty}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Implementation Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-yellow-200 text-sm">
                        <h5 className="font-medium mb-1">Implementation Guidelines</h5>
                        <ul className="space-y-1 text-xs">
                            <li>• Perform bodyweight work AFTER your main 5/3/1 lift</li>
                            <li>• Start with easier variations and progress systematically</li>
                            <li>• Quality over quantity - perfect form is essential</li>
                            <li>• Track your progression just like weighted exercises</li>
                            <li>• Can be done daily with proper volume management</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 15 Complete! Bodyweight template configured with {Object.values(bodyweightConfig.selectedExercises).flat().length} exercises selected.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
