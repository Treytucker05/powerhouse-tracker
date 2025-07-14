import React from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';
import { useAssessmentData } from '../../hooks/useProgramHooks';

const ProgramOverview = () => {
    const { state, actions } = useProgramContext();
    const { assessmentData, isLoading } = useAssessmentData();

    const trainingModels = [
        {
            id: 'conjugate',
            name: 'Conjugate',
            description: 'High frequency, varied intensity approach with rotating exercises',
            bestFor: 'Advanced athletes, powerlifters'
        },
        {
            id: 'block_periodization',
            name: 'Block Periodization',
            description: 'Sequential focused training blocks with specific adaptations',
            bestFor: 'Intermediate to advanced, specific sport preparation'
        },
        {
            id: 'daily_undulating',
            name: 'Daily Undulating Periodization',
            description: 'Varying intensity and volume within each training week',
            bestFor: 'Intermediate athletes, general strength and hypertrophy'
        },
        {
            id: 'linear',
            name: 'Linear Periodization',
            description: 'Progressive increase in intensity with decreased volume over time',
            bestFor: 'Beginners to intermediate, strength focus'
        }
    ];

    const handleModelSelect = (modelId) => {
        actions.setTrainingModel(modelId);
    };

    const handleProgramDataChange = (field, value) => {
        actions.setProgramData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Program Basic Information */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Program Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Program Name
                        </label>
                        <input
                            type="text"
                            value={state.programData.name}
                            onChange={(e) => handleProgramDataChange('name', e.target.value)}
                            placeholder="Enter program name"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-black placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: '#f9fafb !important',
                                color: '#000000 !important',
                                WebkitTextFillColor: '#000000 !important',
                                WebkitBoxShadow: '0 0 0 1000px #f9fafb inset !important',
                                border: '1px solid #d1d5db !important',
                                borderRadius: '6px !important'
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Goal
                        </label>
                        <select
                            value={state.programData.goal}
                            onChange={(e) => handleProgramDataChange('goal', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-black placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: '#f9fafb !important',
                                color: '#000000 !important',
                                WebkitTextFillColor: '#000000 !important',
                                border: '1px solid #d1d5db !important',
                                borderRadius: '6px !important'
                            }}
                        >
                            <option value="strength">Strength</option>
                            <option value="hypertrophy">Hypertrophy</option>
                            <option value="power">Power</option>
                            <option value="endurance">Endurance</option>
                            <option value="general_fitness">General Fitness</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Duration (weeks)
                        </label>
                        <input
                            type="number"
                            min="4"
                            max="52"
                            value={state.programData.duration}
                            onChange={(e) => handleProgramDataChange('duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-black placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: '#f9fafb !important',
                                color: '#000000 !important',
                                WebkitTextFillColor: '#000000 !important',
                                WebkitBoxShadow: '0 0 0 1000px #f9fafb inset !important',
                                border: '1px solid #d1d5db !important',
                                borderRadius: '6px !important'
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Training Days per Week
                        </label>
                        <select
                            value={state.programData.trainingDays}
                            onChange={(e) => handleProgramDataChange('trainingDays', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-black placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                                backgroundColor: '#f9fafb !important',
                                color: '#000000 !important',
                                WebkitTextFillColor: '#000000 !important',
                                border: '1px solid #d1d5db !important',
                                borderRadius: '6px !important'
                            }}
                        >
                            <option value={2}>2 Days</option>
                            <option value={3}>3 Days</option>
                            <option value={4}>4 Days</option>
                            <option value={5}>5 Days</option>
                            <option value={6}>6 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assessment Data Display */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Data</h3>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-400">Loading assessment data...</span>
                    </div>
                ) : assessmentData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white">Experience Level</h4>
                            <p className="text-gray-300">{assessmentData.experience_level}</p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white">Mobility Score</h4>
                            <p className="text-gray-300">{assessmentData.mobility_score}/10</p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white">Stability Score</h4>
                            <p className="text-gray-300">{assessmentData.stability_score}/10</p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white">Strength Score</h4>
                            <p className="text-gray-300">{assessmentData.strength_score}/10</p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg md:col-span-2">
                            <h4 className="font-medium text-white">Training History</h4>
                            <p className="text-gray-300">{assessmentData.training_history}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No assessment data available</p>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Complete Assessment
                        </button>
                    </div>
                )}
            </div>

            {/* Training Model Selection */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Training Model</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainingModels.map((model) => (
                        <div
                            key={model.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${state.selectedTrainingModel === model.id
                                ? 'border-blue-500 bg-blue-900/30'
                                : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onClick={() => handleModelSelect(model.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-white">{model.name}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{model.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">Best for: {model.bestFor}</p>
                                </div>

                                {state.selectedTrainingModel === model.id && (
                                    <div className="ml-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!state.selectedTrainingModel && (
                    <p className="text-sm text-gray-400 mt-4">
                        Select a training model to continue with program design
                    </p>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
                <button
                    onClick={() => actions.setActiveTab('sequencing')}
                    disabled={!state.selectedTrainingModel}
                    className={`px-6 py-2 rounded-md font-medium ${state.selectedTrainingModel
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Next: Block Sequencing
                </button>
            </div>
        </div>
    );
};

export default ProgramOverview;
