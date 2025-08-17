import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import { nasmExperienceMapping } from '../../assessment/nasm/shared/nasmOPTModel';

const ExperienceLevelStep = () => {
    const { state, actions } = useProgramContext();
    const [selectedExperience, setSelectedExperience] = useState(state.assessmentData?.trainingExperience || '');

    // Check if NASM is selected methodology
    const isNASMSelected = state.selectedSystem === 'NASM';

    const experienceLevels = [
        {
            id: 'beginner',
            name: 'Beginner',
            duration: '0-1 year',
            icon: '🌱',
            description: 'New to structured training',
            characteristics: [
                'Learning basic movement patterns',
                'Building foundational strength',
                'High adaptation potential',
                'Needs simple programming'
            ],
            recommendations: [
                'Full-body routines 3x/week',
                'Focus on compound movements',
                'Linear progression',
                'Emphasis on form and technique'
            ],
            complexity: 'Low',
            volume: 'Low-Moderate',
            nasmMapping: isNASMSelected ? nasmExperienceMapping.beginner : null
        },
        {
            id: 'intermediate',
            name: 'Intermediate',
            duration: '1-3 years',
            icon: '📈',
            description: 'Some training experience',
            characteristics: [
                'Familiar with basic exercises',
                'Can handle moderate volume',
                'Understands training principles',
                'Needs progression variety'
            ],
            recommendations: [
                'Upper/lower or push/pull/legs',
                'Periodization introduction',
                'Progressive overload focus',
                'Exercise variation'
            ],
            complexity: 'Moderate',
            volume: 'Moderate',
            nasmMapping: isNASMSelected ? nasmExperienceMapping.intermediate : null
        },
        {
            id: 'advanced',
            name: 'Advanced',
            duration: '3-5 years',
            icon: '🏆',
            description: 'Experienced with various methods',
            characteristics: [
                'Mastered movement patterns',
                'Handles high training volumes',
                'Understands periodization',
                'Needs specialized programming'
            ],
            recommendations: [
                'Body part splits or specialization',
                'Advanced periodization models',
                'Intensity techniques',
                'Precise load management'
            ],
            complexity: 'High',
            volume: 'High',
            nasmMapping: isNASMSelected ? nasmExperienceMapping.advanced : null
        },
        {
            id: 'expert',
            name: 'Expert/Elite',
            duration: '5+ years',
            icon: '👑',
            description: 'Highly experienced athlete',
            characteristics: [
                'Elite-level performance',
                'Maximum volume tolerance',
                'Advanced technique mastery',
                'Competition experience'
            ],
            recommendations: [
                'Highly specialized programs',
                'Competition periodization',
                'Advanced recovery methods',
                'Individual optimization'
            ],
            complexity: 'Very High',
            volume: 'Very High'
        }
    ];

    const handleExperienceSelect = (experienceId) => {
        setSelectedExperience(experienceId);
        actions.setAssessmentData({
            ...state.assessmentData,
            trainingExperience: experienceId
        });
    };

    const handleNext = () => {
        if (selectedExperience) {
            // For streamlined workflow
            if (actions.setCurrentStep) {
                actions.setCurrentStep(3);
            } else {
                // Legacy workflow
                actions.setActiveTab('timeline');
            }
        }
    };

    const handlePrevious = () => {
        // For streamlined workflow
        if (actions.setCurrentStep) {
            actions.setCurrentStep(1);
        } else {
            // Legacy workflow
            actions.setActiveTab('primary-goal');
        }
    };

    const selectedLevel = experienceLevels.find(level => level.id === selectedExperience);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    📈 Step 2: Experience Level
                </h3>
                <p className="text-blue-300 text-sm">
                    Your training experience determines program complexity and appropriate training methods.
                </p>
            </div>

            {/* Experience Level Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">How long have you been training consistently?</h4>
                <p className="text-gray-400 mb-6">
                    Select the level that best describes your training experience. This affects exercise selection,
                    program complexity, and training volume.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experienceLevels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => handleExperienceSelect(level.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${selectedExperience === level.id
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{level.icon}</div>
                                <div className="flex-1">
                                    <h5 className="text-white font-semibold mb-1">{level.name}</h5>
                                    <p className="text-blue-400 text-sm mb-1">{level.duration}</p>
                                    <p className="text-gray-300 text-sm mb-2">{level.description}</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-yellow-400">Complexity: {level.complexity}</span>
                                        <span className="text-green-400">Volume: {level.volume}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detailed Information */}
            {selectedLevel && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                        {selectedLevel.name} Level Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="text-blue-400 font-medium mb-3">Characteristics</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                                {selectedLevel.characteristics.map((char, index) => (
                                    <li key={index}>• {char}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-green-400 font-medium mb-3">Programming Recommendations</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                                {selectedLevel.recommendations.map((rec, index) => (
                                    <li key={index}>• {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Experience Guidelines */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Training Experience Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="text-blue-400 font-medium mb-2">Program Complexity</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Beginner:</strong> Simple, linear progressions</li>
                            <li>• <strong>Intermediate:</strong> Basic periodization</li>
                            <li>• <strong>Advanced:</strong> Complex periodization models</li>
                            <li>• <strong>Expert:</strong> Highly specialized programs</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-yellow-400 font-medium mb-2">Volume Tolerance</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Beginner:</strong> 8-12 sets per week per muscle</li>
                            <li>• <strong>Intermediate:</strong> 12-16 sets per week per muscle</li>
                            <li>• <strong>Advanced:</strong> 16-22 sets per week per muscle</li>
                            <li>• <strong>Expert:</strong> 20+ sets per week per muscle</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Experience Summary */}
            {selectedExperience && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Experience Level Selected</h4>
                    <div className="text-green-300 text-sm space-y-1">
                        <p><strong>Level:</strong> {selectedLevel.name} ({selectedLevel.duration})</p>
                        <p><strong>Complexity:</strong> {selectedLevel.complexity}</p>
                        <p><strong>Volume Tolerance:</strong> {selectedLevel.volume}</p>

                        {/* NASM-specific experience mapping */}
                        {isNASMSelected && selectedLevel.nasmMapping && (
                            <div className="mt-3 pt-3 border-t border-green-500/30">
                                <p className="text-green-400 font-medium">NASM OPT Approach:</p>
                                <p><strong>Starting Phase:</strong> {selectedLevel.nasmMapping.startingPhase}</p>
                                <p><strong>Phase 1 Duration:</strong> {selectedLevel.nasmMapping.duration}</p>
                                <p><strong>Progression:</strong> {selectedLevel.nasmMapping.progression}</p>
                                <p><strong>Assessment Frequency:</strong> {selectedLevel.nasmMapping.assessmentFrequency}</p>
                                <p><strong>Modifications:</strong> {selectedLevel.nasmMapping.modifications}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={handlePrevious}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Previous: Primary Goal
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedExperience}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Next: Timeline
                </button>
            </div>
        </div>
    );
};

export default ExperienceLevelStep;
