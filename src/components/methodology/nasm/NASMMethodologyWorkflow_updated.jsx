import React from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import {
    Target, Users, User, Calendar, Activity,
    FileText, AlertTriangle, ArrowRight,
    CheckCircle, Clock, UserIcon
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

    const getStepButtonClass = (status) => {
        switch (status) {
            case 'complete':
                return 'nav-button bg-green-800 text-green-100 hover:bg-green-700';
            case 'active':
                return 'nav-button bg-blue-600 text-white hover:bg-blue-700';
            default:
                return 'nav-button bg-gray-600 text-gray-300 hover:bg-gray-500';
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

    const currentStepConfig = getCurrentStep();

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    {currentStepConfig?.icon ? (
                                        <currentStepConfig.icon className="w-6 h-6 text-white" />
                                    ) : (
                                        <UserIcon className="w-6 h-6 text-white" />
                                    )}
                                </div>
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

            <div className="flex min-h-screen">
                {/* Left Sidebar - Phase Navigation */}
                <div className="w-80 bg-gray-800 border-r border-gray-700">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Phase Navigation</h2>
                        <div className="space-y-2">
                            {nasmWorkflowSteps.map((step) => {
                                const status = getStepStatus(step);
                                const Icon = step.icon;

                                return (
                                    <div key={step.id}>
                                        <button
                                            onClick={() => handleStepNavigation(step.id, step.phase)}
                                            disabled={step.id > state.currentStep}
                                            className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition-all ${getStepButtonClass(status)} ${step.id > state.currentStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <Icon className="h-5 w-5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{step.name}</div>
                                                <div className="text-xs opacity-75">Step {step.id}</div>
                                            </div>
                                        </button>

                                        {/* Sub-step indicators for Step 5 */}
                                        {step.id === 5 && state.currentStep === 5 && step.subSteps && (
                                            <div className="ml-8 mt-2 space-y-1">
                                                {step.subSteps.map((subStep) => {
                                                    const isActive = state.workflowPhase === subStep.phase;
                                                    return (
                                                        <button
                                                            key={subStep.id}
                                                            onClick={() => handleStepNavigation(step.id, subStep.phase)}
                                                            className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 transition-all ${isActive
                                                                    ? 'nav-button bg-blue-500 text-white'
                                                                    : 'nav-button bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                }`}
                                                        >
                                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-500'}`} />
                                                            {subStep.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {renderStepContent()}
                </div>
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
