import React from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import { Target, CheckCircle, ArrowRight, Clock, Star } from 'lucide-react';

const NASMGoalSelection = () => {
    const { state, actions, methodology } = useNASM();
    const { availableGoals } = methodology;

    const handleGoalSelect = (goal) => {
        const goalFramework = {
            id: goal.id,
            name: goal.name,
            focus: goal.focus,
            phases: goal.phases,
            priority: goal.priority,
            description: goal.description
        };

        actions.setPrimaryGoal(goal.id, goalFramework, goal.phases);
    };

    const handleContinue = () => {
        if (state.primaryGoal) {
            actions.setCurrentStep(3, 'experience-level');
        }
    };

    const getGoalPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-900/20';
            case 'medium': return 'border-yellow-500 bg-yellow-900/20';
            default: return 'border-blue-500 bg-blue-900/20';
        }
    };

    const getPhaseInfo = (phases) => {
        const phaseNames = phases.map(phaseNum => {
            const phase = methodology.optPhases[`phase${phaseNum}`];
            return phase ? phase.name : `Phase ${phaseNum}`;
        });
        return phaseNames.join(' → ');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                    </div>
                    <Target className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">NASM Training Goals</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Select your primary training goal. This will determine your OPT Model phase progression and assessment focus.
                </p>
            </div>

            {/* Methodology Badge */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🎯</span>
                    <span className="text-blue-300 font-semibold">NASM OPT Model</span>
                </div>
                <p className="text-blue-200 text-sm">
                    Evidence-based training with comprehensive movement assessment and corrective exercise focus
                </p>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableGoals.map((goal) => (
                    <div
                        key={goal.id}
                        className={`relative cursor-pointer transition-all duration-200 rounded-lg border-2 p-6 hover:scale-105 ${state.primaryGoal === goal.id
                                ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20'
                                : `${getGoalPriorityColor(goal.priority)} hover:border-opacity-70`
                            }`}
                        onClick={() => handleGoalSelect(goal)}
                    >
                        {/* Goal Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                                {goal.priority === 'high' && (
                                    <Star className="h-5 w-5 text-yellow-400" />
                                )}
                            </div>
                            {state.primaryGoal === goal.id && (
                                <CheckCircle className="h-6 w-6 text-green-400" />
                            )}
                        </div>

                        {/* Goal Description */}
                        <p className="text-gray-300 mb-4">{goal.description}</p>

                        {/* OPT Phases */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-300 font-medium">OPT Phases:</span>
                            </div>
                            <div className="bg-gray-800 rounded p-3">
                                <div className="text-blue-200 text-sm font-medium mb-1">
                                    {getPhaseInfo(goal.phases)}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {goal.phases.map((phaseNum) => (
                                        <span
                                            key={phaseNum}
                                            className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                                        >
                                            Phase {phaseNum}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Goal Focus */}
                        <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="text-sm text-gray-400">
                                <span className="font-medium">Focus:</span> {goal.focus.replace('-', ' ')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Goal Summary */}
            {state.primaryGoal && state.goalFramework && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <h3 className="text-xl font-bold text-green-300">Selected Goal</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-green-200 font-medium mb-1">Primary Goal</div>
                            <div className="text-white">{state.goalFramework.name}</div>
                        </div>
                        <div>
                            <div className="text-green-200 font-medium mb-1">Training Focus</div>
                            <div className="text-white">{state.goalFramework.focus.replace('-', ' ')}</div>
                        </div>
                        <div>
                            <div className="text-green-200 font-medium mb-1">OPT Phases</div>
                            <div className="text-white">
                                {state.goalFramework.phases.map(p => `Phase ${p}`).join(', ')}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-green-900/30 rounded-lg">
                        <div className="text-green-200 font-medium mb-2">What This Means:</div>
                        <div className="text-green-100 text-sm">
                            {state.goalFramework.description}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
                <button
                    onClick={() => actions.setCurrentStep(1, 'methodology-selection')}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                    ← Back to Methodology
                </button>

                <button
                    onClick={handleContinue}
                    disabled={!state.primaryGoal}
                    className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${state.primaryGoal
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Continue to Experience Level
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="text-center text-sm text-gray-400">
                Step 2 of 8: NASM Goal Selection
            </div>
        </div>
    );
};

export default NASMGoalSelection;
