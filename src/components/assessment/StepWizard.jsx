import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import PersonalInfoStep from './PersonalInfoStep';
import TrainingExperienceStep from './TrainingExperienceStep';
import TimelineStep from './TimelineStep';
import RecommendationStep from './RecommendationStep';

const StepWizard = () => {
    const navigate = useNavigate();
    const { updateAssessment, assessment, loading } = useApp();
    const [currentStep, setCurrentStep] = useState(0);
    const [assessmentData, setAssessmentData] = useState({
        primaryGoal: '',
        trainingExperience: '',
        timeline: '',
        recommendedSystem: ''
    });

    // Initialize with existing assessment data if available
    useEffect(() => {
        if (assessment) {
            setAssessmentData({
                primaryGoal: assessment.primaryGoal || '',
                trainingExperience: assessment.trainingExperience || '',
                timeline: assessment.timeline || '',
                recommendedSystem: assessment.recommendedSystem || ''
            });
        }
    }, [assessment]);

    // Auto-update recommendation when relevant fields change
    useEffect(() => {
        if (assessmentData.primaryGoal && assessmentData.trainingExperience && assessmentData.timeline) {
            // The recommendation will be generated automatically in the context
            const updatedData = { ...assessmentData };
            setAssessmentData(updatedData);
        }
    }, [assessmentData.primaryGoal, assessmentData.trainingExperience, assessmentData.timeline]);

    const handleInputChange = (field, value) => {
        setAssessmentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return assessmentData.primaryGoal;
            case 1: return assessmentData.trainingExperience;
            case 2: return assessmentData.timeline;
            case 3: return true; // Final step, always can proceed to submit
            default: return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateAssessment(assessmentData);
            navigate('/');
        } catch (error) {
            console.error('Failed to save assessment:', error);
        }
    };

    // Conditional rendering of steps
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInfoStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 1:
                return <TrainingExperienceStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 2:
                return <TimelineStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 3:
                return <RecommendationStep assessmentData={assessmentData} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Assessment Progress</span>
                    <span className="text-sm text-blue-400 font-medium">Step {currentStep + 1} of 4</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {currentStep === 3 ? 'Ready to submit!' : 'Complete all steps to get your recommendation'}
                </p>
            </div>

            {/* Multi-Step Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    {renderCurrentStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-lg transition-colors font-medium ${currentStep === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                    >
                        Back
                    </button>

                    <div className="flex space-x-3">
                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className={`px-6 py-3 rounded-lg transition-colors font-medium ${canProceed()
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading.assessment}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
                            >
                                {loading.assessment && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                <span>{loading.assessment ? 'Saving...' : 'Complete Assessment'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-4">
                {[0, 1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={`w-3 h-3 rounded-full transition-colors ${step <= currentStep
                            ? 'bg-blue-500'
                            : 'bg-gray-600'
                            }`}
                    />
                ))}
            </div>

            {/* Information Box */}
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">Assessment Information:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                    <li>• <strong>Step 1:</strong> Primary training goal determines program focus</li>
                    <li>• <strong>Step 2:</strong> Experience level sets appropriate complexity</li>
                    <li>• <strong>Step 3:</strong> Timeline influences periodization structure</li>
                    <li>• <strong>Step 4:</strong> AI-powered system recommendation based on your inputs</li>
                </ul>
                <p className="text-gray-400 text-xs mt-3">All data is saved securely to your account</p>
            </div>
        </div>
    );
};

export default StepWizard;
