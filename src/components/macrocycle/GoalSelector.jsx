import React, { useState } from 'react';
import { Plus, Target, X, Calendar, Clock } from 'lucide-react';

/**
 * GoalSelector - Modal for adding new training goals to the macrocycle
 * 
 * Features:
 * - Goal type selection with visual indicators
 * - Duration and timing configuration
 * - Specific targets input
 * - Priority setting
 * - Integration with existing goals
 */

export const GoalSelector = ({ programGoals, onAddGoal, onClose }) => {
    const [selectedGoalType, setSelectedGoalType] = useState('hypertrophy');
    const [goalData, setGoalData] = useState({
        name: '',
        type: 'hypertrophy',
        duration: 8,
        priority: 'high',
        specificTargets: [],
        startWeek: 1
    });
    const [newTarget, setNewTarget] = useState('');

    const handleGoalTypeChange = (type) => {
        const goalConfig = programGoals[type];
        setSelectedGoalType(type);
        setGoalData(prev => ({
            ...prev,
            type,
            name: goalConfig.name,
            duration: parseInt(goalConfig.typicalDuration.split('-')[0]) || 8
        }));
    };

    const addTarget = () => {
        if (newTarget.trim()) {
            setGoalData(prev => ({
                ...prev,
                specificTargets: [...prev.specificTargets, newTarget.trim()]
            }));
            setNewTarget('');
        }
    };

    const removeTarget = (index) => {
        setGoalData(prev => ({
            ...prev,
            specificTargets: prev.specificTargets.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (goalData.name && goalData.duration > 0) {
            onAddGoal(goalData);
            onClose();
        }
    };

    const selectedGoal = programGoals[selectedGoalType];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-400" />
                            Add Training Goal
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Goal Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Select Goal Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(programGoals).map(([key, goal]) => (
                                    <div
                                        key={key}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedGoalType === key
                                                ? `border-${goal.color}-500 bg-${goal.color}-900/30`
                                                : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                            }`}
                                        onClick={() => handleGoalTypeChange(key)}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-3 h-3 rounded-full bg-${goal.color}-500`}></span>
                                            <span className="text-lg">{goal.icon}</span>
                                            <h4 className="font-semibold text-white">{goal.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 mb-2">{goal.description}</p>
                                        <div className="text-xs text-gray-400">
                                            <p>Duration: {goal.typicalDuration}</p>
                                            <p>Volume: {goal.volumeProfile} • Intensity: {goal.intensityProfile}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Goal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="space-y-4">
                                {/* Goal Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Goal Name
                                    </label>
                                    <input
                                        type="text"
                                        value={goalData.name}
                                        onChange={(e) => setGoalData({ ...goalData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Build Upper Body Mass"
                                        required
                                    />
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Duration (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="52"
                                        value={goalData.duration}
                                        onChange={(e) => setGoalData({ ...goalData, duration: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Recommended: {selectedGoal.typicalDuration}
                                    </p>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={goalData.priority}
                                        onChange={(e) => setGoalData({ ...goalData, priority: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                </div>

                                {/* Start Week */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Start Week
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="52"
                                        value={goalData.startWeek}
                                        onChange={(e) => setGoalData({ ...goalData, startWeek: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                {/* Specific Targets */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Specific Targets
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newTarget}
                                            onChange={(e) => setNewTarget(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g., Increase bench press 1RM"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTarget();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={addTarget}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {goalData.specificTargets.length > 0 && (
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {goalData.specificTargets.map((target, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-gray-600 px-3 py-2 rounded-md"
                                                >
                                                    <span className="text-sm text-gray-300">{target}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTarget(index)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Goal Preview */}
                                <div className="bg-gray-600 p-4 rounded-lg">
                                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full bg-${selectedGoal.color}-500`}></span>
                                        Preview
                                    </h4>
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p><strong>Goal:</strong> {goalData.name || 'Unnamed Goal'}</p>
                                        <p><strong>Type:</strong> {selectedGoal.name}</p>
                                        <p><strong>Duration:</strong> {goalData.duration} weeks</p>
                                        <p><strong>Timeline:</strong> Week {goalData.startWeek} - {goalData.startWeek + goalData.duration - 1}</p>
                                        <p><strong>Priority:</strong> {goalData.priority}</p>
                                        {goalData.specificTargets.length > 0 && (
                                            <p><strong>Targets:</strong> {goalData.specificTargets.length} specific targets</p>
                                        )}
                                    </div>
                                </div>

                                {/* Mesocycle Prediction */}
                                <div className="bg-gray-600 p-4 rounded-lg">
                                    <h4 className="font-medium text-white mb-2">Mesocycle Structure</h4>
                                    <div className="text-sm text-gray-300">
                                        <p>Estimated {Math.ceil(goalData.duration / 3)} mesocycles</p>
                                        <p>Types: {selectedGoal.mesocycleTypes.join(', ')}</p>
                                        <p>Volume: {selectedGoal.volumeProfile}</p>
                                        <p>Intensity: {selectedGoal.intensityProfile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-600">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-300 hover:text-white border border-gray-500 rounded-md hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Target className="h-4 w-4" />
                                Add Goal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
