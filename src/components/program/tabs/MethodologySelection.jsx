import React, { useState } from 'react';
import { Target, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const MethodologySelection = ({ onMethodologySelect, selectedMethodology }) => {
    const methodologies = [
        {
            id: 'fivethreeone',
            name: '5/3/1 Training System',
            description: 'Jim Wendler\'s proven strength training methodology with progressive overload',
            icon: '💪',
            color: 'border-red-500 bg-red-900/20',
            focus: ['Strength Building', 'Progressive Overload', 'AMRAP Sets'],
            experience: ['Beginner', 'Intermediate', 'Advanced'],
            goals: ['Strength', 'Powerlifting', 'General Fitness'],
            timeCommitment: '3-4 days/week, 60-90 minutes',
            features: [
                'Proven progression system with training maxes',
                'Built-in deload weeks for recovery',
                'Customizable assistance work templates',
                'AMRAP sets for auto-regulation'
            ]
        },
        {
            id: 'nasm',
            name: 'NASM OPT Model',
            description: 'Evidence-based training using NASM\'s Optimum Performance Training model',
            icon: '🎯',
            color: 'border-blue-500 bg-blue-900/20',
            focus: ['Movement Quality', 'Corrective Exercise', 'Periodization'],
            experience: ['Beginner', 'Intermediate'],
            goals: ['General Fitness', 'Corrective Exercise', 'Weight Loss'],
            timeCommitment: '3-5 days/week, 45-75 minutes',
            features: [
                'Comprehensive movement assessment',
                'Corrective exercise integration',
                'Systematic phase progression',
                'Evidence-based programming'
            ]
        },
        {
            id: 'rp',
            name: 'Renaissance Periodization',
            description: 'Scientific volume-based training for hypertrophy and body composition',
            icon: '📊',
            color: 'border-green-500 bg-green-900/20',
            focus: ['Hypertrophy', 'Volume Management', 'Body Composition'],
            experience: ['Intermediate', 'Advanced'],
            goals: ['Muscle Building', 'Body Composition', 'Hypertrophy'],
            timeCommitment: '4-6 days/week, 60-120 minutes',
            features: [
                'MEV/MAV/MRV volume landmarks',
                'Scientific hypertrophy protocols',
                'Advanced periodization strategies',
                'Body composition focus'
            ]
        },
        {
            id: 'custom',
            name: 'Custom Program Design',
            description: 'Build a personalized program using our 5-step methodology',
            icon: '⚙️',
            color: 'border-gray-500 bg-gray-700/20',
            focus: ['Flexible Design', 'Custom Goals', 'Methodology Mix'],
            experience: ['All Levels'],
            goals: ['Any Goal', 'Multiple Goals', 'Sport Specific'],
            timeCommitment: 'Variable',
            features: [
                'Flexible program structure',
                'Multiple methodology integration',
                'Custom periodization',
                'Goal-specific adaptations'
            ]
        }
    ];

    const handleMethodologySelect = (methodology) => {
        onMethodologySelect(methodology);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Training Methodology</h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    Select the training system that best matches your goals, experience level, and preferences.
                    Each methodology offers a unique approach to achieving your fitness objectives.
                </p>
            </div>

            {/* Methodology Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {methodologies.map((methodology) => (
                    <div
                        key={methodology.id}
                        onClick={() => handleMethodologySelect(methodology)}
                        className={`
                            cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:scale-105
                            ${selectedMethodology?.id === methodology.id
                                ? methodology.color
                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                            }
                        `}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{methodology.icon}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{methodology.name}</h3>
                                    <p className="text-gray-400 text-sm">{methodology.description}</p>
                                </div>
                            </div>
                            {selectedMethodology?.id === methodology.id && (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            )}
                        </div>

                        {/* Focus Areas */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Focus Areas</h4>
                            <div className="flex flex-wrap gap-2">
                                {methodology.focus.map((focus, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300"
                                    >
                                        {focus}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience & Goals */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-1">Experience</h4>
                                <p className="text-sm text-gray-400">{methodology.experience.join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-1">Best For</h4>
                                <p className="text-sm text-gray-400">{methodology.goals.join(', ')}</p>
                            </div>
                        </div>

                        {/* Time Commitment */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Time Commitment</h4>
                            <p className="text-sm text-gray-400">{methodology.timeCommitment}</p>
                        </div>

                        {/* Key Features */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features</h4>
                            <ul className="space-y-1">
                                {methodology.features.map((feature, index) => (
                                    <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                                        <span className="text-green-400 mt-0.5">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Call to Action */}
                        {selectedMethodology?.id === methodology.id && (
                            <div className="mt-4 pt-4 border-t border-gray-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-400">
                                        Selected - Click Next to continue
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Selection Info */}
            {selectedMethodology && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h4 className="text-green-400 font-medium">Methodology Selected</h4>
                    </div>
                    <p className="text-green-200 text-sm">
                        {selectedMethodology.name} has been selected. This will customize your entire
                        program design experience to match the principles and protocols of this methodology.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MethodologySelection;
