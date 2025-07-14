import React from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';

const TrainingMethods = () => {
    const { state, actions } = useProgramContext();

    const trainingMethods = [
        {
            id: 'max_effort',
            name: 'Max Effort Method',
            description: 'Work up to 1-3RM loads to develop maximal strength',
            bestFor: 'Strength development, neural adaptations',
            intensity: '90-100%',
            volume: 'Low',
            recovery: '72-96 hours'
        },
        {
            id: 'repeated_effort',
            name: 'Repeated Effort Method',
            description: 'Multiple reps at submaximal loads to muscular failure',
            bestFor: 'Hypertrophy, muscular endurance',
            intensity: '60-85%',
            volume: 'High',
            recovery: '48-72 hours'
        },
        {
            id: 'dynamic_effort',
            name: 'Dynamic Effort Method',
            description: 'Light loads moved with maximal velocity',
            bestFor: 'Power development, rate of force development',
            intensity: '50-70%',
            volume: 'Moderate',
            recovery: '24-48 hours'
        },
        {
            id: 'contrast',
            name: 'Contrast Method',
            description: 'Alternating heavy and light loads within the same session',
            bestFor: 'Power, strength-speed adaptation',
            intensity: 'Variable',
            volume: 'Moderate',
            recovery: '48-72 hours'
        }
    ];

    const strengthFocusRatios = [
        {
            id: 'max_strength',
            name: 'Max Strength Focus',
            description: '70% Max Effort, 20% Repeated Effort, 10% Dynamic Effort',
            ratios: { max_effort: 70, repeated_effort: 20, dynamic_effort: 10 }
        },
        {
            id: 'hypertrophy',
            name: 'Hypertrophy Focus',
            description: '20% Max Effort, 70% Repeated Effort, 10% Dynamic Effort',
            ratios: { max_effort: 20, repeated_effort: 70, dynamic_effort: 10 }
        },
        {
            id: 'power',
            name: 'Power Focus',
            description: '30% Max Effort, 20% Repeated Effort, 50% Dynamic Effort',
            ratios: { max_effort: 30, repeated_effort: 20, dynamic_effort: 50 }
        },
        {
            id: 'balanced',
            name: 'Balanced Approach',
            description: '40% Max Effort, 40% Repeated Effort, 20% Dynamic Effort',
            ratios: { max_effort: 40, repeated_effort: 40, dynamic_effort: 20 }
        }
    ];

    const handleMethodSelect = (methodId) => {
        actions.setProgramData({ selectedTrainingMethod: methodId });
    };

    const handleSFRSelect = (sfrId) => {
        actions.setProgramData({ methodSFR: sfrId });
    };

    return (
        <div className="space-y-6">
            {/* Training Methods Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Training Method</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainingMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${state.programData.selectedTrainingMethod === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => handleMethodSelect(method.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Best for:</span>
                                            <p className="text-gray-700">{method.bestFor}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Intensity:</span>
                                            <p className="text-gray-700">{method.intensity}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Volume:</span>
                                            <p className="text-gray-700">{method.volume}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Recovery:</span>
                                            <p className="text-gray-700">{method.recovery}</p>
                                        </div>
                                    </div>
                                </div>

                                {state.programData.selectedTrainingMethod === method.id && (
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
            </div>

            {/* Strength-Focus Ratios */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength-Focus Ratio (SFR)</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Define the distribution of training methods throughout your program for optimal adaptation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strengthFocusRatios.map((sfr) => (
                        <div
                            key={sfr.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${state.programData.methodSFR === sfr.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => handleSFRSelect(sfr.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{sfr.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{sfr.description}</p>

                                    {/* Visual ratio representation */}
                                    <div className="mt-3">
                                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                                            <div
                                                className="bg-red-500 h-full"
                                                style={{ width: `${sfr.ratios.max_effort}%` }}
                                                title={`Max Effort: ${sfr.ratios.max_effort}%`}
                                            />
                                            <div
                                                className="bg-blue-500 h-full"
                                                style={{ width: `${sfr.ratios.repeated_effort}%` }}
                                                title={`Repeated Effort: ${sfr.ratios.repeated_effort}%`}
                                            />
                                            <div
                                                className="bg-green-500 h-full"
                                                style={{ width: `${sfr.ratios.dynamic_effort}%` }}
                                                title={`Dynamic Effort: ${sfr.ratios.dynamic_effort}%`}
                                            />
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                                            <span>Max: {sfr.ratios.max_effort}%</span>
                                            <span>Repeated: {sfr.ratios.repeated_effort}%</span>
                                            <span>Dynamic: {sfr.ratios.dynamic_effort}%</span>
                                        </div>
                                    </div>
                                </div>

                                {state.programData.methodSFR === sfr.id && (
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
            </div>

            {/* Method Implementation Guidelines */}
            {state.programData.selectedTrainingMethod && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Guidelines</h3>

                    <div className="space-y-4">
                        {getImplementationGuidelines(state.programData.selectedTrainingMethod).map((guideline, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                <p className="text-sm text-gray-700">{guideline}</p>
                            </div>
                        ))}
                    </div>

                    {/* Exercise Examples */}
                    <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Recommended Exercises</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getExerciseExamples(state.programData.selectedTrainingMethod).map((category, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <h5 className="font-medium text-gray-800 mb-2">{category.name}</h5>
                                    <ul className="space-y-1">
                                        {category.exercises.map((exercise, exIndex) => (
                                            <li key={exIndex} className="text-sm text-gray-600">• {exercise}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => actions.setActiveTab('parameters')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Back: Loading Parameters
                </button>

                <button
                    onClick={() => actions.setActiveTab('energy')}
                    disabled={!state.programData.selectedTrainingMethod}
                    className={`px-6 py-2 rounded-md font-medium ${state.programData.selectedTrainingMethod
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Next: Energy Systems
                </button>
            </div>
        </div>
    );
};

// Helper functions
const getImplementationGuidelines = (methodId) => {
    const guidelines = {
        max_effort: [
            'Work up to a 1-3RM each session',
            'Allow 72-96 hours recovery between max effort sessions',
            'Rotate exercises every 1-3 weeks to prevent accommodation',
            'Follow max effort work with supplemental and accessory exercises',
            'Monitor fatigue closely and adjust intensity as needed'
        ],
        repeated_effort: [
            'Perform sets to muscular failure or 1-2 reps in reserve',
            'Use moderate to high volume (15-25 sets per muscle group per week)',
            'Progress through increased reps, sets, or load over time',
            'Allow 48-72 hours between training same muscle groups',
            'Focus on time under tension and muscle activation'
        ],
        dynamic_effort: [
            'Move light loads (50-70% 1RM) with maximal velocity',
            'Use short rest periods (45-60 seconds) between sets',
            'Perform 6-10 sets of 1-3 reps for strength-speed',
            'Monitor bar speed to ensure quality of movement',
            'Can be performed frequently due to low fatigue impact'
        ],
        contrast: [
            'Alternate between heavy (85-95%) and light (30-50%) loads',
            'Allow 3-5 minutes rest between contrast pairs',
            'Use 2-4 contrast pairs per exercise',
            'Focus on explosive intent during light load sets',
            'Ideal for advanced athletes seeking power development'
        ]
    };

    return guidelines[methodId] || [];
};

const getExerciseExamples = (methodId) => {
    const exercises = {
        max_effort: [
            {
                name: 'Lower Body',
                exercises: ['Box Squat variations', 'Deadlift variations', 'Good morning variations', 'Single leg squats']
            },
            {
                name: 'Upper Body',
                exercises: ['Bench press variations', 'Overhead press variations', 'Row variations', 'Weighted pull-ups']
            }
        ],
        repeated_effort: [
            {
                name: 'Lower Body',
                exercises: ['Bulgarian split squats', 'Walking lunges', 'Step-ups', 'Leg press', 'Hack squats']
            },
            {
                name: 'Upper Body',
                exercises: ['Dumbbell press', 'Cable rows', 'Lat pulldowns', 'Dips', 'Push-ups']
            }
        ],
        dynamic_effort: [
            {
                name: 'Lower Body',
                exercises: ['Speed squats', 'Jump squats', 'Box jumps', 'Broad jumps', 'Speed deadlifts']
            },
            {
                name: 'Upper Body',
                exercises: ['Speed bench', 'Medicine ball throws', 'Plyometric push-ups', 'Band-assisted throws']
            }
        ],
        contrast: [
            {
                name: 'Lower Body Pairs',
                exercises: ['Heavy squat + Jump squat', 'Heavy deadlift + Broad jump', 'Heavy lunge + Split jump']
            },
            {
                name: 'Upper Body Pairs',
                exercises: ['Heavy bench + Med ball throw', 'Heavy row + Explosive row', 'Heavy press + Push press']
            }
        ]
    };

    return exercises[methodId] || [];
};

export default TrainingMethods;
