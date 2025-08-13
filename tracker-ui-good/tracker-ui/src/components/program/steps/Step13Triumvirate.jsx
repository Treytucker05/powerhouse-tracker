import React, { useState, useEffect } from 'react';
import { Users, Target, Info, CheckCircle, AlertTriangle, Trophy, Edit3 } from 'lucide-react';

export default function Step13Triumvirate({ data, updateData }) {
    const [triumvirateConfig, setTriumvirateConfig] = useState(data.triumvirateConfig || {});
    const [customExercises, setCustomExercises] = useState(data.triumvirateCustom || {});
    const [editingDay, setEditingDay] = useState(null);

    // Exact manual specifications for each day
    const standardTriumvirate = {
        press: {
            mainLift: 'overhead_press',
            supplemental: { name: 'Dips', sets: 5, reps: '15 or to failure', category: 'tricep_chest' },
            assistance: { name: 'Chin-ups', sets: 5, reps: 10, category: 'lat_strength' }
        },
        deadlift: {
            mainLift: 'deadlift',
            supplemental: { name: 'Good Mornings', sets: 5, reps: 10, category: 'posterior_chain' },
            assistance: { name: 'Hanging Leg Raises', sets: 5, reps: 15, category: 'core' }
        },
        bench: {
            mainLift: 'bench',
            supplemental: { name: 'DB Rows', sets: 5, reps: 10, category: 'upper_back' },
            assistance: { name: 'Dips', sets: 5, reps: 15, category: 'tricep_chest' }
        },
        squat: {
            mainLift: 'squat',
            supplemental: { name: 'Leg Curls', sets: 5, reps: 10, category: 'hamstring' },
            assistance: { name: 'Leg Raises', sets: 5, reps: 15, category: 'core' }
        }
    };

    // Alternative exercise options for customization
    const exerciseAlternatives = {
        tricep_chest: [
            { name: 'Dips', reps: '15 or failure' },
            { name: 'Close-Grip Bench', reps: '8-12' },
            { name: 'Push-ups', reps: '15-25' },
            { name: 'Tricep Extensions', reps: '10-15' }
        ],
        lat_strength: [
            { name: 'Chin-ups', reps: '8-12' },
            { name: 'Pull-ups', reps: '8-12' },
            { name: 'Lat Pulldowns', reps: '10-15' },
            { name: 'Assisted Chin-ups', reps: '8-12' }
        ],
        posterior_chain: [
            { name: 'Good Mornings', reps: '8-12' },
            { name: 'Romanian Deadlifts', reps: '8-12' },
            { name: 'Back Extensions', reps: '12-20' },
            { name: 'Glute-Ham Raises', reps: '8-15' }
        ],
        upper_back: [
            { name: 'DB Rows', reps: '8-12' },
            { name: 'Barbell Rows', reps: '8-12' },
            { name: 'Cable Rows', reps: '10-15' },
            { name: 'T-Bar Rows', reps: '8-12' }
        ],
        hamstring: [
            { name: 'Leg Curls', reps: '10-15' },
            { name: 'Romanian Deadlifts', reps: '8-12' },
            { name: 'Glute-Ham Raises', reps: '8-15' },
            { name: 'Stiff-Leg Deadlifts', reps: '10-15' }
        ],
        core: [
            { name: 'Hanging Leg Raises', reps: '10-20' },
            { name: 'Leg Raises', reps: '15-25' },
            { name: 'Planks', reps: '30-60 sec' },
            { name: 'Ab Wheel', reps: '8-15' }
        ]
    };

    const liftNames = {
        overhead_press: 'Overhead Press',
        deadlift: 'Deadlift',
        bench: 'Bench Press',
        squat: 'Squat'
    };

    const dayNames = {
        press: 'Press Day',
        deadlift: 'Deadlift Day',
        bench: 'Bench Day',
        squat: 'Squat Day'
    };

    // Initialize with standard template
    useEffect(() => {
        if (Object.keys(triumvirateConfig).length === 0) {
            setTriumvirateConfig(standardTriumvirate);
            updateStepData({ triumvirateConfig: standardTriumvirate });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExerciseChange = (day, exerciseType, exercise) => {
        const newConfig = {
            ...triumvirateConfig,
            [day]: {
                ...triumvirateConfig[day],
                [exerciseType]: {
                    ...exercise,
                    sets: exerciseType === 'supplemental' ? 5 : 5,
                    category: exercise.category || triumvirateConfig[day][exerciseType].category
                }
            }
        };

        setTriumvirateConfig(newConfig);
        updateStepData({ triumvirateConfig: newConfig });
    };

    const resetToStandard = () => {
        setTriumvirateConfig(standardTriumvirate);
        setCustomExercises({});
        updateStepData({
            triumvirateConfig: standardTriumvirate,
            triumvirateCustom: {}
        });
    };

    const updateStepData = (updates) => {
        updateData({
            triumvirateConfig,
            triumvirateCustom: customExercises,
            ...updates
        });
    };

    const isStepComplete = () => {
        return Object.keys(triumvirateConfig).length === 4 &&
            Object.values(triumvirateConfig).every(day =>
                day.supplemental && day.assistance
            );
    };

    const getProgressionTip = (exerciseName) => {
        if (exerciseName.toLowerCase().includes('dip')) {
            return "Add weight when all sets completed with bodyweight";
        } else if (exerciseName.toLowerCase().includes('chin') || exerciseName.toLowerCase().includes('pull')) {
            return "Add weight or reps when all sets completed";
        } else {
            return "Add weight when all sets/reps completed";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 13: "Triumvirate" Template
                </h3>
                <p className="text-gray-400">
                    Simple 3-exercise template: one main lift, one supplemental exercise, one assistance exercise per day.
                </p>
            </div>

            {/* Triumvirate Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Triumvirate Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Rule of Three:</strong> Exactly 3 exercises per session - no more, no less</li>
                            <li>• <strong>Simple progression:</strong> Add weight when all sets completed successfully</li>
                            <li>• <strong>Quality focus:</strong> Perfect form over heavy weight on assistance</li>
                            <li>• <strong>Time efficient:</strong> Complete workouts in 45-60 minutes</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Standard Template Overview */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-red-400" />
                        <h4 className="text-lg font-medium text-white">Standard Triumvirate Template</h4>
                    </div>
                    <button
                        onClick={resetToStandard}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        Reset to Standard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(triumvirateConfig).map(([day, config]) => (
                        <div key={day} className="bg-gray-800 p-4 rounded border border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="text-white font-medium">{dayNames[day]}</h5>
                                <button
                                    onClick={() => setEditingDay(editingDay === day ? null : day)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Main Lift */}
                                <div className="pb-2 border-b border-gray-700">
                                    <div className="flex justify-between">
                                        <span className="text-red-400 font-medium">Main Lift:</span>
                                        <span className="text-white">{liftNames[config.mainLift]}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">5/3/1 Protocol</span>
                                </div>

                                {/* Supplemental Exercise */}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-yellow-400 font-medium">Supplemental:</span>
                                        {editingDay === day ? (
                                            <select
                                                value={config.supplemental.name}
                                                onChange={(e) => {
                                                    const selectedEx = exerciseAlternatives[config.supplemental.category]
                                                        .find(ex => ex.name === e.target.value);
                                                    handleExerciseChange(day, 'supplemental', selectedEx);
                                                }}
                                                className="text-sm px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded focus:border-red-500"
                                            >
                                                {exerciseAlternatives[config.supplemental.category]?.map(ex => (
                                                    <option key={ex.name} value={ex.name}>{ex.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-white">{config.supplemental.name}</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {config.supplemental.sets} sets × {config.supplemental.reps}
                                    </div>
                                </div>

                                {/* Assistance Exercise */}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-green-400 font-medium">Assistance:</span>
                                        {editingDay === day ? (
                                            <select
                                                value={config.assistance.name}
                                                onChange={(e) => {
                                                    const selectedEx = exerciseAlternatives[config.assistance.category]
                                                        .find(ex => ex.name === e.target.value);
                                                    handleExerciseChange(day, 'assistance', selectedEx);
                                                }}
                                                className="text-sm px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded focus:border-red-500"
                                            >
                                                {exerciseAlternatives[config.assistance.category]?.map(ex => (
                                                    <option key={ex.name} value={ex.name}>{ex.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-white">{config.assistance.name}</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {config.assistance.sets} sets × {config.assistance.reps}
                                    </div>
                                </div>
                            </div>

                            {/* Progression Tip */}
                            {editingDay !== day && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="text-xs text-blue-300">
                                        <Trophy className="w-3 h-3 inline mr-1" />
                                        {getProgressionTip(config.supplemental.name)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progression Rules */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-medium text-white">Progression Rules</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded">
                        <h5 className="text-yellow-400 font-medium mb-2">Supplemental Exercises</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Complete all prescribed sets and reps</li>
                            <li>• Add weight when successful</li>
                            <li>• Focus on strict form</li>
                            <li>• Rest 2-3 minutes between sets</li>
                        </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded">
                        <h5 className="text-green-400 font-medium mb-2">Assistance Exercises</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Bodyweight exercises: add reps or weight</li>
                            <li>• Weighted exercises: add weight gradually</li>
                            <li>• Don't train to failure</li>
                            <li>• Rest 1-2 minutes between sets</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Exercise Categories Info */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Exercise Categories & Alternatives</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(exerciseAlternatives).map(([category, exercises]) => (
                        <div key={category} className="bg-gray-800 p-3 rounded">
                            <h5 className="text-red-400 font-medium mb-2 capitalize">
                                {category.replace('_', ' ')}
                            </h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                                {exercises.map((exercise, index) => (
                                    <li key={index}>
                                        <span className="font-medium">{exercise.name}</span>
                                        <span className="text-gray-400 ml-2">({exercise.reps})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Template Benefits */}
            <div className="bg-green-900/20 border border-green-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Trophy className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                        <h4 className="text-green-300 font-medium mb-2">Why Triumvirate Works</h4>
                        <ul className="text-green-200 text-sm space-y-1">
                            <li>• <strong>Simplicity:</strong> Easy to follow and track progress</li>
                            <li>• <strong>Balance:</strong> Covers all movement patterns efficiently</li>
                            <li>• <strong>Sustainability:</strong> Low volume prevents burnout</li>
                            <li>• <strong>Proven:</strong> Jim Wendler's personal favorite for consistency</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Warnings */}
            {editingDay && (
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 text-sm">
                            <strong>Customization Note:</strong> The standard Triumvirate is carefully balanced.
                            Only modify exercises if you have specific equipment limitations or injuries.
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
                            Step 13 Complete! Triumvirate template configured with 3 exercises per day.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
