import React, { useState } from 'react';
import { Activity, CheckSquare, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import OverheadSquatAssessment from './assessments/OverheadSquatAssessment';
import SingleLegSquatAssessment from './assessments/SingleLegSquatAssessment';
import PushPullAssessment from './assessments/PushPullAssessment';
import AssessmentResults from './results/AssessmentResults';
import { analyzeCompleteNASMAssessment } from './shared/nasmMuscleLookup';

const NASMAssessmentDashboard = ({ onComplete, initialData = {} }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [assessmentData, setAssessmentData] = useState({
        overheadSquat: {
            frontView: {
                feet: { feetTurnOut: false, notes: '' },
                knees: { kneesMoveinward: false, notes: '' }
            },
            sideView: {
                lphc: {
                    excessiveForwardLean: false,
                    lowBackArches: false,
                    notes: ''
                },
                upperBody: { armsFallForward: false, notes: '' }
            }
        },
        singleLegSquat: {
            rightLeg: { kneeValgus: false, notes: '' },
            leftLeg: { kneeValgus: false, notes: '' }
        },
        pushPull: {
            pushing: {
                lphc: { lowBackArches: false, notes: '' },
                shoulders: { shoulderElevation: false, notes: '' },
                head: { headMigratesForward: false, notes: '' }
            },
            pulling: {
                lphc: { lowBackArches: false, notes: '' },
                shoulders: { shoulderElevation: false, notes: '' },
                head: { headProtrudesForward: false, notes: '' }
            }
        },
        ...initialData
    });

    const assessmentSteps = [
        {
            id: 1,
            name: 'Overhead Squat',
            component: OverheadSquatAssessment,
            description: 'NASM overhead squat assessment - 5 reps from front and side view',
            icon: Activity
        },
        {
            id: 2,
            name: 'Single-Leg Squat',
            component: SingleLegSquatAssessment,
            description: 'Single-leg squat assessment - bilateral movement screening',
            icon: CheckSquare
        },
        {
            id: 3,
            name: 'Push/Pull Assessment',
            component: PushPullAssessment,
            description: 'Pushing and pulling movement patterns assessment',
            icon: Eye
        },
        {
            id: 4,
            name: 'Results & Analysis',
            component: AssessmentResults,
            description: 'NASM analysis with muscle imbalance identification',
            icon: Activity
        }
    ];

    const handleStepData = (stepData) => {
        setAssessmentData(prev => ({ ...prev, ...stepData }));
    };

    const handleNext = () => {
        if (currentStep < assessmentSteps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Analyze complete assessment using NASM protocols
        const analysis = analyzeCompleteNASMAssessment(assessmentData);

        const completeResults = {
            assessmentDate: new Date(),
            rawData: assessmentData,
            analysis: analysis,
            nasmCompliant: true
        };

        onComplete(completeResults);
    };

    const CurrentStepComponent = assessmentSteps[currentStep - 1].component;
    const currentStepInfo = assessmentSteps[currentStep - 1];

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                    <h3 className="text-xl font-semibold text-white">NASM Movement Assessment</h3>
                    <p className="text-gray-400">Professional movement screening based on NASM-CPT protocols</p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                        Step {currentStep} of {assessmentSteps.length}: {currentStepInfo.name}
                    </span>
                    <span className="text-sm text-gray-400">
                        {Math.round((currentStep / assessmentSteps.length) * 100)}% Complete
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / assessmentSteps.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {assessmentSteps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${step.id === currentStep
                                    ? 'bg-blue-600 text-white'
                                    : step.id < currentStep
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-700 text-gray-300'
                                }`}
                        >
                            <StepIcon className="h-4 w-4" />
                            <span>{step.name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Current Step Description */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-md font-semibold text-white mb-2">{currentStepInfo.name}</h4>
                <p className="text-gray-300 text-sm">{currentStepInfo.description}</p>
            </div>

            {/* Assessment Content */}
            <div className="mb-6">
                <CurrentStepComponent
                    data={assessmentData}
                    onDataChange={handleStepData}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirstStep={currentStep === 1}
                    isLastStep={currentStep === assessmentSteps.length}
                    onComplete={handleComplete}
                />
            </div>

            {/* Navigation Buttons */}
            {currentStep < assessmentSteps.length && (
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${currentStep === 1
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-600 text-white hover:bg-gray-500'
                            }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500"
                    >
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Complete Button for Results Step */}
            {currentStep === assessmentSteps.length && (
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevious}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <button
                        onClick={handleComplete}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-500"
                    >
                        <CheckSquare className="h-4 w-4" />
                        Complete Assessment
                    </button>
                </div>
            )}
        </div>
    );
};

export default NASMAssessmentDashboard;
