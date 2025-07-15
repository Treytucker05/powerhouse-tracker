import React, { useState } from 'react';
import { Calendar, Trophy, RotateCcw, CheckCircle, Target, TrendingUp } from 'lucide-react';

const MacrocycleStructure = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [macrocycle, setMacrocycle] = useState({
        duration: 12,
        peakingPhases: 1,
        competitionDates: [],
        structure: 'block_periodization',
        trainingDays: 4,
        programGoal: 'hypertrophy'
    });

    const [newCompetition, setNewCompetition] = useState({
        name: '',
        date: '',
        priority: 'high'
    });

    // Training models from existing ProgramOverview component
    const periodizationModels = [
        {
            id: 'linear',
            name: 'Linear Periodization',
            description: 'Traditional model: gradual progression from high volume/low intensity to low volume/high intensity',
            duration: '4-12 months',
            bestFor: 'Beginners to intermediate, single peak competitions, strength focus',
            phases: ['General Preparation', 'Specific Preparation', 'Competition', 'Transition'],
            advantages: ['Simple to plan', 'Good for beginners', 'Clear progression'],
            disadvantages: ['Limited variety', 'Detraining of qualities', 'Less suitable for multiple peaks']
        },
        {
            id: 'block_periodization',
            name: 'Block Periodization',
            description: 'Sequential focused training blocks with concentrated loads targeting specific adaptations',
            duration: '2-4 month blocks',
            bestFor: 'Intermediate to advanced athletes, specific sport preparation, multiple competitions',
            phases: ['Accumulation', 'Transmutation', 'Realization'],
            advantages: ['Concentrated adaptations', 'Multiple peaks possible', 'Reduced interference'],
            disadvantages: ['Complex planning', 'Requires experience', 'Risk of overspecialization']
        },
        {
            id: 'conjugate',
            name: 'Conjugate Method',
            description: 'High frequency, varied intensity approach with rotating exercises and concurrent development',
            duration: 'Ongoing weekly cycles',
            bestFor: 'Advanced athletes, powerlifters, year-round training',
            phases: ['Max Effort', 'Dynamic Effort', 'Repetition Method'],
            advantages: ['Concurrent development', 'High variety', 'Reduced staleness'],
            disadvantages: ['Very complex', 'Requires extensive exercise library', 'Not for beginners']
        },
        {
            id: 'daily_undulating',
            name: 'Daily Undulating Periodization (DUP)',
            description: 'Frequent variation in training variables within each week',
            duration: 'Weekly/daily changes',
            bestFor: 'Intermediate athletes, general fitness, hypertrophy and strength',
            phases: ['High Volume', 'High Intensity', 'Moderate'],
            advantages: ['High variety', 'Prevents adaptation plateau', 'Flexible'],
            disadvantages: ['Difficult to track progress', 'May lack focus', 'Planning complexity']
        }
    ];

    const programGoals = [
        { value: 'strength', label: 'Strength', description: 'Maximize force production and 1RM lifts' },
        { value: 'power', label: 'Power', description: 'Develop explosive force and rate of force development' },
        { value: 'hypertrophy', label: 'Hypertrophy', description: 'Increase muscle mass and size' },
        { value: 'endurance', label: 'Endurance', description: 'Improve aerobic capacity and muscular endurance' },
        { value: 'general_fitness', label: 'General Fitness', description: 'Overall health and conditioning' },
        { value: 'sport_specific', label: 'Sport Specific', description: 'Sport-specific performance enhancement' }
    ];

    const addCompetition = () => {
        if (newCompetition.name && newCompetition.date) {
            setMacrocycle(prev => ({
                ...prev,
                competitionDates: [...prev.competitionDates, { ...newCompetition, id: Date.now() }]
            }));
            setNewCompetition({ name: '', date: '', priority: 'high' });
        }
    };

    const removeCompetition = (id) => {
        setMacrocycle(prev => ({
            ...prev,
            competitionDates: prev.competitionDates.filter(comp => comp.id !== id)
        }));
    };

    const selectedModel = periodizationModels.find(model => model.id === macrocycle.structure);

    return (
        <div className="space-y-6">
            {/* Program Configuration */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Program Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Primary Goal</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={macrocycle.programGoal}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, programGoal: e.target.value }))}
                        >
                            {programGoals.map(goal => (
                                <option key={goal.value} value={goal.value}>{goal.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                            {programGoals.find(g => g.value === macrocycle.programGoal)?.description}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Macrocycle Duration</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={macrocycle.duration}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        >
                            <option value={4}>4 months</option>
                            <option value={6}>6 months</option>
                            <option value={8}>8 months</option>
                            <option value={12}>12 months (Annual)</option>
                            <option value={16}>16 months</option>
                            <option value={24}>24 months (Biennial)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Training Days/Week</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={macrocycle.trainingDays}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, trainingDays: parseInt(e.target.value) }))}
                        >
                            <option value={2}>2 days</option>
                            <option value={3}>3 days</option>
                            <option value={4}>4 days</option>
                            <option value={5}>5 days</option>
                            <option value={6}>6 days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Periodization Model Selection */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Periodization Model</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {periodizationModels.map((model) => (
                        <div
                            key={model.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${macrocycle.structure === model.id
                                    ? 'border-blue-500 bg-blue-900/30'
                                    : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setMacrocycle(prev => ({ ...prev, structure: model.id }))}
                        >
                            <h4 className="font-semibold text-white mb-2">{model.name}</h4>
                            <p className="text-sm text-gray-300 mb-3">{model.description}</p>

                            <div className="space-y-2 text-xs">
                                <div>
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white ml-1">{model.duration}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Best for:</span>
                                    <span className="text-white ml-1">{model.bestFor}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Phases:</span>
                                    <span className="text-white ml-1">{model.phases.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Model Details */}
                {selectedModel && (
                    <div className="bg-gray-600 rounded-lg p-4 border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Selected: {selectedModel.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="text-green-400 font-medium mb-2">Advantages:</h5>
                                <ul className="text-gray-300 space-y-1">
                                    {selectedModel.advantages.map((advantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-400">•</span>
                                            {advantage}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-yellow-400 font-medium mb-2">Considerations:</h5>
                                <ul className="text-gray-300 space-y-1">
                                    {selectedModel.disadvantages.map((disadvantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            {disadvantage}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Competition Calendar */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Competition Calendar</h3>
                </div>

                {/* Add Competition Form */}
                <div className="bg-gray-600 rounded-lg p-4 mb-4 border border-gray-500">
                    <h4 className="font-medium text-white mb-3">Add Competition/Peak Event</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Competition name"
                            className="px-3 py-2 bg-gray-700 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            value={newCompetition.name}
                            onChange={(e) => setNewCompetition(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            type="date"
                            className="px-3 py-2 bg-gray-700 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={newCompetition.date}
                            onChange={(e) => setNewCompetition(prev => ({ ...prev, date: e.target.value }))}
                        />
                        <select
                            className="px-3 py-2 bg-gray-700 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={newCompetition.priority}
                            onChange={(e) => setNewCompetition(prev => ({ ...prev, priority: e.target.value }))}
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <button
                            onClick={addCompetition}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={!newCompetition.name || !newCompetition.date}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Competition List */}
                {macrocycle.competitionDates.length > 0 ? (
                    <div className="space-y-2">
                        {macrocycle.competitionDates.map((competition) => (
                            <div key={competition.id} className="flex items-center justify-between bg-gray-600 p-3 rounded-md border border-gray-500">
                                <div>
                                    <h5 className="font-medium text-white">{competition.name}</h5>
                                    <p className="text-sm text-gray-300">
                                        {new Date(competition.date).toLocaleDateString()}
                                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${competition.priority === 'high' ? 'bg-red-900 text-red-200' :
                                                competition.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                                                    'bg-green-900 text-green-200'
                                            }`}>
                                            {competition.priority} priority
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeCompetition(competition.id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No competitions added yet</p>
                        <p className="text-sm">Add competition dates to structure your training phases</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Step 2 of 7: Determine Macrocycle Structure
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Phase Design
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MacrocycleStructure;
