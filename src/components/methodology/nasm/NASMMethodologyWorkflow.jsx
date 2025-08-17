import React from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import {
    Target, Users, User, Calendar, Activity,
    FileText, AlertTriangle, ArrowRight,
    CheckCircle, Clock
} from 'lucide-react';

// Import individual step components
import NASMGoalSelection from './NASMGoalSelection';
import NASMClientConsultation from './NASMClientConsultation';
import NASMOPTQuestionnaire from './NASMOPTQuestionnaire';
import NASMMovementScreenIntegration from './NASMMovementScreenIntegration';

// Import shared components for universal steps
import ExperienceLevelStep from '../../methodology/shared/ExperienceLevelStep';
import TimelineStep from '../../methodology/shared/TimelineStep';
import NASMAwareInjuryScreening from './NASMAwareInjuryScreening';
import NASMOptModelPeriodization from './NASMOptModelPeriodization';
import NASMImplementation from './NASMImplementation';

const NASMMethodologyWorkflow = () => {
    const { state, actions, methodology } = useNASM();

    // Define the 8-step NASM methodology-first workflow
    const nasmWorkflowSteps = [
        {
            id: 1,
            name: 'Goal Selection',
            phase: 'goal-selection',
            icon: Target,
            component: NASMGoalSelection,
            description: 'Select NASM-specific training goals and OPT phases'
        },
        {
            id: 2,
            name: 'Experience Level',
            phase: 'experience-level',
            icon: User,
            component: ExperienceLevelStep,
            description: 'Assess training background and recovery capacity'
        },
        {
            id: 3,
            name: 'Timeline',
            phase: 'timeline',
            icon: Calendar,
            component: TimelineStep,
            description: 'Determine program duration and phase progression'
        },
        {
            id: 4,
            name: 'Client Consultation',
            phase: 'client-consultation',
            icon: Users,
            component: NASMClientConsultation,
            description: 'Comprehensive intake and lifestyle assessment'
        },
        {
            id: 5,
            name: 'OPT Assessment',
            phase: 'opt-assessment',
            icon: FileText,
            component: null, // Multi-step assessment
            description: 'Complete NASM assessment protocol',
            subSteps: [
                {
                    id: '5a',
                    name: 'OPT Questionnaire',
                    phase: 'opt-questionnaire',
                    component: NASMOPTQuestionnaire
                },
                {
                    id: '5b',
                    name: 'Movement Screen',
                    phase: 'movement-screen',
                    component: NASMMovementScreenIntegration
                }
            ]
        },
        {
            id: 6,
            name: 'Injury Screening',
            phase: 'injury-screening',
            icon: AlertTriangle,
            component: NASMAwareInjuryScreening,
            description: 'NASM-aware injury screening and contraindications'
        },
        {
            id: 7,
            name: 'OPT Periodization',
            phase: 'opt-periodization',
            icon: Activity,
            component: NASMOptModelPeriodization,
            description: 'Design OPT Model phase progression'
        },
        {
            id: 8,
            name: 'Implementation',
            phase: 'implementation',
            icon: CheckCircle,
            component: NASMImplementation,
            description: 'Generate NASM program and implementation plan'
        }
    ];

    const getCurrentStep = () => {
        return nasmWorkflowSteps.find(step => step.id === state.currentStep);
    };

    const getCurrentSubStep = () => {
        const currentStep = getCurrentStep();
        if (currentStep?.subSteps) {
            return currentStep.subSteps.find(subStep => subStep.phase === state.workflowPhase);
        }
        return null;
    };

    const getStepStatus = (step) => {
        if (step.id < state.currentStep) {
            return 'complete';
        } else if (step.id === state.currentStep) {
            return 'active';
        } else {
            return 'pending';
        }
    };

    const getStepColor = (status) => {
        switch (status) {
            case 'complete': return 'text-green-400 border-green-500 bg-green-900/20';
            case 'active': return 'text-blue-400 border-blue-500 bg-blue-900/30';
            default: return 'text-gray-400 border-gray-600 bg-gray-800';
        }
    };

    const handleStepNavigation = (stepId, phase) => {
        // Allow navigation to completed steps or current step
        if (stepId <= state.currentStep) {
            actions.setCurrentStep(stepId, phase);
        }
    };

    const renderStepContent = () => {
        const currentStep = getCurrentStep();
        const currentSubStep = getCurrentSubStep();

        // Handle multi-step assessment (Step 5)
        if (currentStep?.id === 5) {
            if (state.workflowPhase === 'opt-questionnaire') {
                return <NASMOPTQuestionnaire />;
            } else if (state.workflowPhase === 'movement-screen') {
                return <NASMMovementScreenIntegration />;
            } else {
                // Default to first sub-step
                return <NASMOPTQuestionnaire />;
            }
        }

        // Handle other steps
        if (currentStep?.component) {
            const StepComponent = currentStep.component;
            return <StepComponent />;
        }

        return (
            <div className="text-center py-12">
                <div className="text-gray-400">Step component not found</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🎯</span>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">NASM OPT Model Workflow</h1>
                                    <p className="text-gray-400">Evidence-based training with movement assessment</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-blue-300 font-medium">Current Step</div>
                                <div className="text-white">{state.currentStep} of 8</div>
                            </div>

                            {state.isComplete && (
                                <div className="flex items-center gap-2 bg-green-900/30 border border-green-600 rounded-lg px-4 py-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-green-300 font-medium">Program Complete</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {nasmWorkflowSteps.map((step, index) => {
                            const status = getStepStatus(step);
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepNavigation(step.id, step.phase)}
                                        disabled={step.id > state.currentStep}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all min-w-[120px] ${getStepColor(status)
                                            } ${step.id > state.currentStep ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <div className="text-center">
                                            <div className="font-medium text-sm">{step.name}</div>
                                            <div className="text-xs opacity-75">Step {step.id}</div>
                                        </div>

                                        {/* Sub-step indicators for Step 5 */}
                                        {step.id === 5 && state.currentStep === 5 && (
                                            <div className="flex gap-1 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${state.workflowPhase === 'opt-questionnaire' ? 'bg-blue-400' : 'bg-gray-500'
                                                    }`} />
                                                <div className={`w-2 h-2 rounded-full ${state.workflowPhase === 'movement-screen' ? 'bg-blue-400' : 'bg-gray-500'
                                                    }`} />
                                            </div>
                                        )}
                                    </button>

                                    {index < nasmWorkflowSteps.length - 1 && (
                                        <ArrowRight className="h-4 w-4 text-gray-600 mx-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                {renderStepContent()}
            </div>

            {/* Footer - Workflow Summary */}
            <div className="bg-gray-800 border-t border-gray-700 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <h3 className="text-white font-medium mb-2">Methodology</h3>
                            <p className="text-gray-400 text-sm">{methodology.name}</p>
                        </div>

                        {state.goalFramework && (
                            <div>
                                <h3 className="text-white font-medium mb-2">Primary Goal</h3>
                                <p className="text-gray-400 text-sm">{state.goalFramework.name}</p>
                            </div>
                        )}

                        {state.selectedOPTPhase && (
                            <div>
                                <h3 className="text-white font-medium mb-2">OPT Phase</h3>
                                <p className="text-gray-400 text-sm">Phase {state.selectedOPTPhase.id}: {state.selectedOPTPhase.name}</p>
                            </div>
                        )}

                        {state.assessmentCompleted && (
                            <div>
                                <h3 className="text-white font-medium mb-2">Assessment Status</h3>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span className="text-green-400 text-sm">Complete</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NASMMethodologyWorkflow;
