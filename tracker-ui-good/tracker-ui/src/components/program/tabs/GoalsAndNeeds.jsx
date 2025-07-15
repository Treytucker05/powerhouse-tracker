import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, User, Trophy } from 'lucide-react';

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    const [goals, setGoals] = useState({
        timeframe: '1-year',
        primaryGoal: assessmentData?.primaryGoal || '',
        sportDemands: [],
        biomotorPriorities: {
            strength: 'medium',
            power: 'medium',
            endurance: 'medium',
            speed: 'medium',
            agility: 'medium',
            flexibility: 'medium'
        },
        trainingHistory: assessmentData?.trainingExperience || '',
        performanceGoals: ''
    });

    const biomotorAbilities = [
        { key: 'strength', label: 'Strength', description: 'Maximum force production' },
        { key: 'power', label: 'Power', description: 'Rate of force development' },
        { key: 'endurance', label: 'Endurance', description: 'Aerobic capacity & muscular endurance' },
        { key: 'speed', label: 'Speed', description: 'Movement velocity' },
        { key: 'agility', label: 'Agility', description: 'Change of direction ability' },
        { key: 'flexibility', label: 'Flexibility', description: 'Range of motion & mobility' }
    ];

    const timeframes = [
        { value: '6-month', label: '6 Months', description: 'Short-term focus & specific adaptations' },
        { value: '1-year', label: '1 Year', description: 'Annual periodization cycle' },
        { value: '2-year', label: '2 Years', description: 'Olympic/collegiate cycle' },
        { value: '4-year', label: '4 Years', description: 'Long-term athlete development' }
    ];

    const experienceLevels = [
        { value: 'novice', label: 'Novice', description: '< 1 year training experience' },
        { value: 'intermediate', label: 'Intermediate', description: '1-3 years training experience' },
        { value: 'advanced', label: 'Advanced', description: '3+ years training experience' },
        { value: 'elite', label: 'Elite', description: 'Competitive/professional level' }
    ];

    const handleBiomotorChange = (ability, priority) => {
        setGoals(prev => ({
            ...prev,
            biomotorPriorities: {
                ...prev.biomotorPriorities,
                [ability]: priority
            }
        }));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Assessment Summary</h3>
                </div>

                {assessmentData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Experience Level</h4>
                            <p className="text-gray-300">{assessmentData.trainingExperience || 'Not assessed'}</p>
                        </div>
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Primary Goal</h4>
                            <p className="text-gray-300">{assessmentData.primaryGoal || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Recommended System</h4>
                            <p className="text-blue-400">{assessmentData.recommendedSystem || 'To be determined'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-600 rounded-lg">
                        <p className="text-gray-300 mb-4">No assessment data available</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => window.location.href = '/assessment'}
                        >
                            Complete Assessment First
                        </button>
                    </div>
                )}
            </div>

            {/* Training Timeframe */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Training Timeframe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {timeframes.map((timeframe) => (
                        <div
                            key={timeframe.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${goals.timeframe === timeframe.value
                                    ? 'border-blue-500 bg-blue-900/30'
                                    : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setGoals(prev => ({ ...prev, timeframe: timeframe.value }))}
                        >
                            <h4 className="font-semibold text-white mb-1">{timeframe.label}</h4>
                            <p className="text-sm text-gray-300">{timeframe.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Goals */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Long-term Performance Goals</h3>
                </div>

                <textarea
                    className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Describe your long-term performance objectives (e.g., compete in powerlifting meet, improve 1RM squat by 50lbs, complete marathon under 4 hours)..."
                    value={goals.performanceGoals}
                    onChange={(e) => setGoals(prev => ({ ...prev, performanceGoals: e.target.value }))}
                />
            </div>

            {/* Biomotor Ability Priorities */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Biomotor Ability Priorities</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                    Prioritize the physical qualities most important for your goals and sport demands.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {biomotorAbilities.map((ability) => (
                        <div key={ability.key} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white">{ability.label}</h4>
                                    <p className="text-sm text-gray-300">{ability.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    {['low', 'medium', 'high'].map((priority) => (
                                        <button
                                            key={priority}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${goals.biomotorPriorities[ability.key] === priority
                                                    ? getPriorityColor(priority)
                                                    : 'bg-gray-700 text-gray-400 border-gray-500 hover:border-gray-400'
                                                }`}
                                            onClick={() => handleBiomotorChange(ability.key, priority)}
                                        >
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                    Step 1 of 7: Assess Needs and Set Goals
                </div>

                {canGoNext && (
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Next: Macrocycle Structure
                        <CheckCircle className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoalsAndNeeds;

