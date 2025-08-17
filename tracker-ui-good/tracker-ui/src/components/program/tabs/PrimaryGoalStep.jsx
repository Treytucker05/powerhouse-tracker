import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import { nasmGoalPathways } from '../../assessment/nasm/shared/nasmOPTModel';

const PrimaryGoalStep = () => {
    const { state, actions } = useProgramContext();
    const [selectedGoal, setSelectedGoal] = useState(state.programData?.goal || '');

    // Check if NASM is selected methodology to provide NASM-specific goals
    const isNASMSelected = state.selectedSystem === 'NASM';

    const goals = [
        {
            id: 'bodybuilding',
            name: 'Bodybuilding/Physique',
            icon: '💪',
            description: 'Build muscle mass and aesthetic physique',
            details: 'Focus on hypertrophy, muscle symmetry, and body composition',
            repRanges: '6-15 reps',
            focus: 'Muscle growth, aesthetics',
            nasmPathway: isNASMSelected ? nasmGoalPathways.hypertrophy : null
        },
        {
            id: 'powerlifting',
            name: 'Powerlifting/Strength',
            icon: '🏋️',
            description: 'Maximize squat, bench, deadlift strength',
            details: 'Competition preparation and maximal strength development',
            repRanges: '1-6 reps',
            focus: 'Maximal strength, competition',
            nasmPathway: isNASMSelected ? nasmGoalPathways.max_strength : null
        },
        {
            id: 'athletic',
            name: 'Athletic Performance',
            icon: '⚡',
            description: 'Sport-specific strength and conditioning',
            details: 'Power, speed, agility, and sport-specific movements',
            repRanges: '1-8 reps',
            focus: 'Power, speed, athleticism',
            nasmPathway: isNASMSelected ? nasmGoalPathways.sports_performance : null
        },
        {
            id: 'general',
            name: 'General Fitness',
            icon: '🏃',
            description: 'Overall health and wellness',
            details: 'Balanced approach to strength, cardio, and mobility',
            repRanges: '8-15 reps',
            focus: 'Health, longevity, balance',
            nasmPathway: isNASMSelected ? nasmGoalPathways.general_fitness : null
        },
        {
            id: 'endurance',
            name: 'Endurance/Conditioning',
            icon: '🏃‍♂️',
            description: 'Cardiovascular fitness and endurance',
            details: 'Aerobic capacity, muscular endurance, work capacity',
            repRanges: '12-20+ reps',
            focus: 'Endurance, work capacity',
            nasmPathway: isNASMSelected ? nasmGoalPathways.general_fitness : null
        },
        {
            id: 'fat_loss',
            name: 'Fat Loss/Weight Management',
            icon: '🔥',
            description: 'Body fat reduction and weight management',
            details: 'Maximize caloric expenditure while preserving lean mass',
            repRanges: '12-20 reps',
            focus: 'Fat loss, body composition',
            nasmPathway: isNASMSelected ? nasmGoalPathways.fat_loss : null
        },
        {
            id: 'hybrid',
            name: 'Hybrid/Multiple Goals',
            icon: '🎯',
            description: 'Combination of multiple training objectives',
            details: 'Balanced approach combining strength, size, and conditioning',
            repRanges: 'Variable',
            focus: 'Multiple objectives',
            nasmPathway: isNASMSelected ? nasmGoalPathways.general_fitness : null
        },
        {
            id: 'motor_control',
            name: 'Motor Control/Movement Quality',
            icon: '🧘',
            description: 'Movement quality and motor control development',
            details: 'Focus on perfect movement patterns, stability, and coordination',
            repRanges: '8-15 reps',
            focus: 'Movement quality, coordination',
            nasmPathway: isNASMSelected ? nasmGoalPathways.general_fitness : null
        }
    ];

    const handleGoalSelect = (goalId) => {
        setSelectedGoal(goalId);
        // Update both the legacy and new context structures
        actions.setProgramData({ goal: goalId });
        if (actions.updatePrimaryGoal) {
            actions.updatePrimaryGoal(goalId);
        }
    };

    // NEW: Population modification handler
    const handlePopulationSelect = (populationType) => {
        actions.setPopulationType(populationType === state.populationType ? null : populationType);
    };

    const handleNext = () => {
        if (selectedGoal) {
            // For streamlined workflow
            if (actions.setCurrentStep) {
                actions.setCurrentStep(2);
            } else {
                // Legacy workflow
                actions.setActiveTab('experience-level');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    🎯 Step 1: Primary Goal
                </h3>
                <p className="text-blue-300 text-sm">
                    Define your main training objective. This will guide all subsequent program decisions.
                </p>
            </div>

            {/* Goal Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">What is your primary training goal?</h4>
                <p className="text-gray-400 mb-6">
                    Select the goal that best represents your main training focus. This will determine your program structure,
                    rep ranges, and training methods.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => handleGoalSelect(goal.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${selectedGoal === goal.id
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{goal.icon}</div>
                                <div className="flex-1">
                                    <h5 className="text-white font-semibold mb-1">{goal.name}</h5>
                                    <p className="text-gray-300 text-sm mb-2">{goal.description}</p>
                                    <p className="text-gray-400 text-xs mb-2">{goal.details}</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-400">Rep Ranges: {goal.repRanges}</span>
                                        <span className="text-green-400">Focus: {goal.focus}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Goal Summary */}
            {selectedGoal && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Goal Selected</h4>
                    <div className="text-green-300 text-sm space-y-1">
                        <p><strong>Primary Goal:</strong> {goals.find(g => g.id === selectedGoal)?.name}</p>
                        <p><strong>Focus:</strong> {goals.find(g => g.id === selectedGoal)?.focus}</p>
                        <p><strong>Rep Ranges:</strong> {goals.find(g => g.id === selectedGoal)?.repRanges}</p>

                        {/* NASM-specific pathway information */}
                        {isNASMSelected && goals.find(g => g.id === selectedGoal)?.nasmPathway && (
                            <div className="mt-3 pt-3 border-t border-green-500/30">
                                <p className="text-green-400 font-medium">NASM OPT Pathway:</p>
                                <p><strong>Pathway:</strong> {goals.find(g => g.id === selectedGoal)?.nasmPathway.name}</p>
                                <p><strong>Phases:</strong> {goals.find(g => g.id === selectedGoal)?.nasmPathway.phases.join(' → ')}</p>
                                <p><strong>Timeline:</strong> {goals.find(g => g.id === selectedGoal)?.nasmPathway.timeline}</p>
                                <p><strong>Expected Outcomes:</strong> {goals.find(g => g.id === selectedGoal)?.nasmPathway.expectedOutcomes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NEW: Population Considerations */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Special Population Considerations</h4>
                <p className="text-gray-400 mb-6">
                    Select any special considerations that apply to ensure safe and effective assessment modifications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handlePopulationSelect('pregnancy')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${state.populationType === 'pregnancy'
                                ? 'border-pink-500 bg-pink-900/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            }`}
                    >
                        <div className="text-2xl mb-2">🤰</div>
                        <h5 className="text-white font-semibold mb-1">Pregnancy</h5>
                        <p className="text-gray-300 text-sm">
                            Prenatal/postnatal modifications
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            Assessment adaptations for safety
                        </p>
                    </button>

                    <button
                        onClick={() => handlePopulationSelect('elderly')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${state.populationType === 'elderly'
                                ? 'border-purple-500 bg-purple-900/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            }`}
                    >
                        <div className="text-2xl mb-2">👴</div>
                        <h5 className="text-white font-semibold mb-1">Elderly (65+)</h5>
                        <p className="text-gray-300 text-sm">
                            Age-related considerations
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            Balance and mobility focus
                        </p>
                    </button>

                    <button
                        onClick={() => handlePopulationSelect('injury')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${state.populationType === 'injury'
                                ? 'border-orange-500 bg-orange-900/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            }`}
                    >
                        <div className="text-2xl mb-2">🩹</div>
                        <h5 className="text-white font-semibold mb-1">Injury History</h5>
                        <p className="text-gray-300 text-sm">
                            Previous injury considerations
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            Modified movement patterns
                        </p>
                    </button>
                </div>

                {/* Population-Specific Information */}
                {state.populationType && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <h5 className="text-blue-400 font-semibold mb-2">Assessment Modifications for {state.populationType === 'pregnancy' ? 'Pregnancy' : state.populationType === 'elderly' ? 'Elderly' : 'Injury History'}</h5>
                        {state.populationType === 'pregnancy' && (
                            <div className="text-blue-300 text-sm">
                                <p>• Overhead Squat: Reduce depth, use chair support if needed</p>
                                <p>• Single-Leg Squat: Shallow range, seated/supported position</p>
                                <p>• Push/Pull: Emphasize scapular stability, avoid heavy overhead</p>
                                <p>• Monitor for excessive lordosis and diastasis recti</p>
                            </div>
                        )}
                        {state.populationType === 'elderly' && (
                            <div className="text-blue-300 text-sm">
                                <p>• Overhead Squat: Chair-supported squat, elevated heels if needed</p>
                                <p>• Single-Leg Squat: Start with balance only, progress carefully</p>
                                <p>• Push/Pull: Seated positions if balance concerns</p>
                                <p>• Focus on fall prevention and functional movements</p>
                            </div>
                        )}
                        {state.populationType === 'injury' && (
                            <div className="text-blue-300 text-sm">
                                <p>• Assess pain-free range of motion only</p>
                                <p>• Modify assessments based on injury location</p>
                                <p>• Use unilateral variations if appropriate</p>
                                <p>• Start with functional baseline movements</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Training Focus Guidelines */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Training Focus Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="text-blue-400 font-medium mb-2">Strength-Focused Goals</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Powerlifting:</strong> Max strength, 1-6 reps, competition prep</li>
                            <li>• <strong>Athletic:</strong> Power development, 1-8 reps, explosive training</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-green-400 font-medium mb-2">Hypertrophy-Focused Goals</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Bodybuilding:</strong> Muscle growth, 6-15 reps, aesthetic focus</li>
                            <li>• <strong>General Fitness:</strong> Balanced approach, 8-15 reps</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-yellow-400 font-medium mb-2">Endurance-Focused Goals</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Conditioning:</strong> Work capacity, 12-20+ reps</li>
                            <li>• <strong>Endurance:</strong> Aerobic capacity, high volume</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-purple-400 font-medium mb-2">Hybrid Goals</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• <strong>Multiple Objectives:</strong> Variable rep ranges</li>
                            <li>• <strong>Balanced Training:</strong> Strength + size + conditioning</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    disabled
                    className="bg-gray-600 text-gray-400 px-6 py-2 rounded-lg cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selectedGoal}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Continue to Experience Level →
                </button>
            </div>
        </div>
    );
};

export default PrimaryGoalStep;
