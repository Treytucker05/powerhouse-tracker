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

    // Training models
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Program Duration (weeks)
                        </label>
                        <select
                            value={macrocycle.duration}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value={8}>8 weeks</option>
                            <option value={12}>12 weeks</option>
                            <option value={16}>16 weeks</option>
                            <option value={20}>20 weeks</option>
                            <option value={24}>24 weeks</option>
                            <option value={52}>52 weeks (Annual)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Training Days per Week
                        </label>
                        <select
                            value={macrocycle.trainingDays}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, trainingDays: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value={3}>3 days</option>
                            <option value={4}>4 days</option>
                            <option value={5}>5 days</option>
                            <option value={6}>6 days</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Goal
                        </label>
                        <select
                            value={macrocycle.programGoal}
                            onChange={(e) => setMacrocycle(prev => ({ ...prev, programGoal: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            {programGoals.map(goal => (
                                <option key={goal.value} value={goal.value}>{goal.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Periodization Model Selection */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Periodization Model</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {periodizationModels.map(model => (
                        <div
                            key={model.id}
                            onClick={() => setMacrocycle(prev => ({ ...prev, structure: model.id }))}
                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${macrocycle.structure === model.id
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-white">{model.name}</h4>
                                {macrocycle.structure === model.id && (
                                    <CheckCircle className="h-5 w-5 text-blue-400" />
                                )}
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{model.description}</p>
                            <div className="text-xs space-y-1">
                                <div><span className="text-gray-400">Duration:</span> <span className="text-gray-300">{model.duration}</span></div>
                                <div><span className="text-gray-400">Best for:</span> <span className="text-gray-300">{model.bestFor}</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Model Details */}
                {selectedModel && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <h4 className="font-semibold text-white mb-3">{selectedModel.name} - Detailed View</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Phases</h5>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    {selectedModel.phases.map((phase, index) => (
                                        <li key={index}>• {phase}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Advantages</h5>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    {selectedModel.advantages.map((advantage, index) => (
                                        <li key={index}>• {advantage}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Considerations</h5>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    {selectedModel.disadvantages.map((disadvantage, index) => (
                                        <li key={index}>• {disadvantage}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Competition Schedule */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Competition Schedule</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Competition name"
                        value={newCompetition.name}
                        onChange={(e) => setNewCompetition(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="date"
                        value={newCompetition.date}
                        onChange={(e) => setNewCompetition(prev => ({ ...prev, date: e.target.value }))}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    <select
                        value={newCompetition.priority}
                        onChange={(e) => setNewCompetition(prev => ({ ...prev, priority: e.target.value }))}
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                    <button
                        onClick={addCompetition}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Competition
                    </button>
                </div>

                {macrocycle.competitionDates.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Scheduled Competitions</h4>
                        {macrocycle.competitionDates.map(comp => (
                            <div key={comp.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                                <div>
                                    <span className="text-white font-medium">{comp.name}</span>
                                    <span className="text-gray-400 ml-2">{comp.date}</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${comp.priority === 'high' ? 'bg-red-900 text-red-300' :
                                            comp.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-green-900 text-green-300'
                                        }`}>
                                        {comp.priority} priority
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeCompetition(comp.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Macrocycle Summary</h4>
                <div className="text-blue-300 text-sm space-y-1">
                    <p>• {macrocycle.duration}-week {selectedModel?.name} program</p>
                    <p>• {macrocycle.trainingDays} training days per week</p>
                    <p>• Primary goal: {programGoals.find(g => g.value === macrocycle.programGoal)?.label}</p>
                    <p>• {macrocycle.competitionDates.length} competition(s) scheduled</p>
                </div>
            </div>
        </div>
    );
};

export default MacrocycleStructure;
