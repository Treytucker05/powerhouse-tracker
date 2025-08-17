import React, { useState } from 'react';
import { Dumbbell, Target, Info, CheckCircle, AlertTriangle, Plus, Minus } from 'lucide-react';

export default function Step11AssistanceWork({ data = {}, updateData }) {
    const [selectedAssistance, setSelectedAssistance] = useState(data.assistanceWork || {});
    const [customExercises, setCustomExercises] = useState(data.customExercises || []);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', targetLift: '', category: '' });

    // Top assistance movements per main lift from the manual
    const assistanceMovements = {
        squat: [
            { name: 'Good Mornings', description: 'Posterior chain strength', priority: 1 },
            { name: 'Lunges', description: 'Unilateral leg strength', priority: 2 },
            { name: 'Step-ups', description: 'Single-leg power', priority: 3 },
            { name: 'Leg Press', description: 'High-volume quad work', priority: 4 },
            { name: 'Leg Curls', description: 'Hamstring isolation', priority: 5 }
        ],
        bench: [
            { name: 'Dips', description: 'Tricep and chest strength', priority: 1 },
            { name: 'DB Bench Press', description: 'Stabilizer recruitment', priority: 2 },
            { name: 'Push-ups', description: 'Bodyweight volume', priority: 3 },
            { name: 'Close-Grip Bench', description: 'Tricep focus', priority: 4 },
            { name: 'DB Rows', description: 'Upper back balance', priority: 5 }
        ],
        deadlift: [
            { name: 'Good Mornings', description: 'Hip hinge pattern', priority: 1 },
            { name: 'Glute-Ham Raises', description: 'Posterior chain', priority: 2 },
            { name: 'Romanian Deadlifts', description: 'Hamstring strength', priority: 3 },
            { name: 'Rack Pulls', description: 'Top-end strength', priority: 4 },
            { name: 'Kroc Rows', description: 'Single-arm pulling', priority: 5 }
        ],
        overhead_press: [
            { name: 'Dips', description: 'Tricep strength', priority: 1 },
            { name: 'Push Press', description: 'Explosive overhead', priority: 2 },
            { name: 'DB Shoulder Press', description: 'Stabilizer work', priority: 3 },
            { name: 'Chin-ups', description: 'Lat strength', priority: 4 },
            { name: 'Face Pulls', description: 'Rear delt health', priority: 5 }
        ]
    };

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    const updateStepData = (assistanceData, nextCustomExercises = customExercises) => {
        setSelectedAssistance(assistanceData);
        setCustomExercises(nextCustomExercises);
        updateData?.({
            assistanceWork: assistanceData,
            customExercises: nextCustomExercises
        });
    };

    const handleExerciseToggle = (lift, exercise) => {
        const currentSelections = selectedAssistance[lift] || [];
        const isSelected = currentSelections.some(ex => ex.name === exercise.name);

        let newSelections;
        if (isSelected) {
            newSelections = currentSelections.filter(ex => ex.name !== exercise.name);
        } else {
            newSelections = [...currentSelections, exercise];
        }

        updateStepData({
            ...selectedAssistance,
            [lift]: newSelections
        });
    };

    const addCustomExercise = () => {
        if (newExercise.name && newExercise.targetLift) {
            const exercise = {
                ...newExercise,
                priority: 6,
                custom: true
            };

            const currentSelections = selectedAssistance[newExercise.targetLift] || [];
            const nextAssist = {
                ...selectedAssistance,
                [newExercise.targetLift]: [...currentSelections, exercise]
            };

            const nextCustom = [...customExercises, exercise];
            updateStepData(nextAssist, nextCustom);

            setNewExercise({ name: '', targetLift: '', category: '' });
            setShowCustomForm(false);
        }
    };

    const isStepComplete = () => {
        return Object.keys(selectedAssistance).length > 0 &&
            Object.values(selectedAssistance).some(exercises => (exercises || []).length > 0);
    };

    const getTotalExercises = () => {
        return Object.values(selectedAssistance).reduce((total, exercises) => total + ((exercises || []).length), 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 11: Assistance Work Philosophy and Guidelines
                </h3>
                <p className="text-gray-400">
                    Select assistance exercises to support your main lifts. Focus on compound movements that address weak points.
                </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Assistance Work Principles</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Main lifts first:</strong> Assistance never interferes with 5/3/1 performance</li>
                            <li>• <strong>Training economy:</strong> Focus on compound, high-value movements</li>
                            <li>• <strong>Address weaknesses:</strong> Choose exercises that target your limiting factors</li>
                            <li>• <strong>Progressive overload:</strong> Track and progress assistance work systematically</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Kroc Rows Special Note */}
            <div className="bg-purple-900/20 border border-purple-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                        <h4 className="text-purple-300 font-medium mb-2">Kroc Rows Specification</h4>
                        <div className="text-purple-200 text-sm space-y-1">
                            <p><strong>Definition:</strong> High-rep single-arm dumbbell rows</p>
                            <p><strong>Protocol:</strong> 1 hard set × 20-40 reps per arm</p>
                            <p><strong>Weight:</strong> Heavy enough to challenge in target rep range</p>
                            <p><strong>Rest:</strong> 2-3 minutes between arms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercise Selection by Lift */}
            <div className="space-y-6">
                {Object.entries(assistanceMovements).map(([lift, exercises]) => (
                    <div key={lift} className="bg-gray-700 p-6 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Dumbbell className="w-6 h-6 text-red-400" />
                            <h4 className="text-lg font-medium text-white">
                                {liftNames[lift]} Assistance
                            </h4>
                            <span className="text-sm text-gray-400">
                                ({(selectedAssistance[lift] || []).length} selected)
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {exercises.map((exercise) => {
                                const isSelected = (selectedAssistance[lift] || []).some(ex => ex.name === exercise.name);
                                return (
                                    <div
                                        key={exercise.name}
                                        onClick={() => handleExerciseToggle(lift, exercise)}
                                        className={`p-4 rounded border-2 cursor-pointer transition-colors ${isSelected
                                                ? 'border-red-500 bg-red-900/20'
                                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h5 className={`font-medium ${isSelected ? 'text-red-300' : 'text-white'}`}>
                                                    {exercise.name}
                                                </h5>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {exercise.description}
                                                </p>
                                                <span className="text-xs text-gray-500 mt-2 block">
                                                    Priority #{exercise.priority}
                                                </span>
                                            </div>
                                            <div className={`w-5 h-5 rounded border-2 ${isSelected
                                                    ? 'bg-red-500 border-red-500'
                                                    : 'border-gray-400'
                                                }`}>
                                                {isSelected && (
                                                    <CheckCircle className="w-full h-full text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Custom Exercise Button */}
                        <button
                            onClick={() => {
                                setNewExercise({ ...newExercise, targetLift: lift });
                                setShowCustomForm(true);
                            }}
                            className="mt-3 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Custom Exercise</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Custom Exercise Form */}
            {showCustomForm && (
                <div className="bg-gray-700 p-6 rounded-lg border border-blue-500">
                    <h4 className="text-lg font-medium text-white mb-4">Add Custom Exercise</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Exercise Name
                            </label>
                            <input
                                type="text"
                                value={newExercise.name}
                                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:border-red-500 focus:outline-none"
                                placeholder="e.g., Bulgarian Split Squats"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Target Main Lift
                            </label>
                            <select
                                value={newExercise.targetLift}
                                onChange={(e) => setNewExercise({ ...newExercise, targetLift: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:border-red-500 focus:outline-none"
                            >
                                <option value="">Select target lift</option>
                                {Object.entries(liftNames).map(([key, name]) => (
                                    <option key={key} value={key}>{name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category/Description
                            </label>
                            <input
                                type="text"
                                value={newExercise.category}
                                onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:border-red-500 focus:outline-none"
                                placeholder="e.g., Unilateral quad strength"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={addCustomExercise}
                                disabled={!newExercise.name || !newExercise.targetLift}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Add Exercise
                            </button>
                            <button
                                onClick={() => {
                                    setShowCustomForm(false);
                                    setNewExercise({ name: '', targetLift: '', category: '' });
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Selection Summary */}
            {getTotalExercises() > 0 && (
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Selection Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedAssistance).map(([lift, exercises]) => (
                            (exercises || []).length > 0 && (
                                <div key={lift}>
                                    <h5 className="text-red-400 font-medium mb-2">{liftNames[lift]}</h5>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {(exercises || []).map((exercise, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>{exercise.name}</span>
                                                {exercise.custom && (
                                                    <span className="text-blue-400 text-xs">Custom</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {getTotalExercises() > 15 && (
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 text-sm">
                            <strong>High Exercise Volume Warning:</strong> You've selected {getTotalExercises()} assistance exercises.
                            Consider focusing on 2-3 key exercises per main lift for better recovery and progression.
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
                            Step 11 Complete! Selected {getTotalExercises()} assistance exercises across your main lifts.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
