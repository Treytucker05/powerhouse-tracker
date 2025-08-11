import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Target, Calendar, TrendingUp, Zap } from 'lucide-react';

// Import step components
import MaxTesting from './tabs/MaxTesting';
import TrainingSetup from './tabs/TrainingSetup';
import CycleConfiguration from './tabs/CycleConfiguration';
import ProgramGeneration from './tabs/ProgramGeneration';

export default function FiveThreeOneWorkflow() {
    const { assessment, saveProgramData, loading } = useApp();
    const [currentStep, setCurrentStep] = useState(0);
    const [programData, setProgramData] = useState({
        programType: '531',
        squat_max: null,
        bench_max: null,
        deadlift_max: null,
        ohp_max: null,
        assistance_template: 'bbb', // Default to Boring But Big
        training_days: 4,
        cycle_length: 4, // 4-week cycles
        progression_rates: { upper: 5, lower: 10 }, // +5lbs upper, +10lbs lower
        generatedProgram: null
    });

    // Workflow steps configuration
    const steps = [
        {
            id: 'maxes',
            title: 'Current Maxes',
            description: 'Enter or test your 1RM for main lifts',
            icon: Target,
            component: MaxTesting,
            required: ['squat_max', 'bench_max', 'deadlift_max', 'ohp_max']
        },
        {
            id: 'setup',
            title: 'Training Setup',
            description: 'Choose assistance work and schedule',
            icon: Calendar,
            component: TrainingSetup,
            required: ['assistance_template', 'training_days']
        },
        {
            id: 'cycle',
            title: 'Cycle Settings',
            description: 'Configure progression and cycle length',
            icon: TrendingUp,
            component: CycleConfiguration,
            required: ['cycle_length', 'progression_rates']
        },
        {
            id: 'generate',
            title: 'Program Generation',
            description: 'Generate your 5/3/1 program',
            icon: CheckCircle,
            component: ProgramGeneration,
            required: []
        }
    ];

    // Check if step is completed
    const isStepCompleted = (stepIndex) => {
        const step = steps[stepIndex];
        return step.required.every(field => {
            const value = programData[field];
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
            return value !== null && value !== undefined && value !== '';
        });
    };

    // Check if we can proceed to next step
    const canProceed = () => {
        return isStepCompleted(currentStep);
    };

    // Update program data
    const updateProgramData = (updates) => {
        setProgramData(prev => ({ ...prev, ...updates }));
    };

    // Navigate between steps
    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    const nextStep = () => {
        if (canProceed() && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Save program to database
    const handleSaveProgram = async () => {
        try {
            await saveProgramData({
                ...programData,
                assessmentId: assessment?.id,
                status: 'active',
                createdAt: new Date().toISOString()
            });

            // Could redirect or show success message
            console.log('5/3/1 Program saved successfully');
        } catch (error) {
            console.error('Failed to save 5/3/1 program:', error);
        }
    };

    // Get current step component
    const CurrentStepComponent = steps[currentStep]?.component;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Progress Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">5/3/1 Program Design</h2>
                    <div className="text-sm text-gray-400">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                {/* Progress Pills */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = isStepCompleted(index);
                        const isAccessible = index <= currentStep || isCompleted;

                        return (
                            <button
                                key={step.id}
                                onClick={() => isAccessible && goToStep(index)}
                                disabled={!isAccessible}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200
                                    ${isActive
                                        ? 'bg-red-600 border-red-500 text-white'
                                        : isCompleted
                                            ? 'bg-green-600 border-green-500 text-white'
                                            : isAccessible
                                                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-medium">{step.title}</div>
                                    <div className="text-xs opacity-75">{step.description}</div>
                                </div>
                                {isCompleted && !isActive && (
                                    <CheckCircle className="w-5 h-5 text-green-300" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Step Content */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                {CurrentStepComponent && (
                    <CurrentStepComponent
                        data={programData}
                        updateData={updateProgramData}
                        assessment={assessment}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
                        ${currentStep === 0
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-500'
                        }
                    `}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex gap-3">
                    {currentStep === steps.length - 1 ? (
                        <button
                            onClick={handleSaveProgram}
                            disabled={loading.program || !canProceed()}
                            className={`
                                flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors
                                ${loading.program || !canProceed()
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }
                            `}
                        >
                            {loading.program ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Generate Program
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
                                ${!canProceed()
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }
                            `}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Debug Info (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-900 border border-gray-600 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Debug Info:</h4>
                    <pre className="text-xs text-gray-400 overflow-auto">
                        {JSON.stringify(programData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
