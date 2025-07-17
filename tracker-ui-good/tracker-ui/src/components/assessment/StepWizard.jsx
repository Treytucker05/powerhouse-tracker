import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/api/supabaseClient';
import { useApp } from '../../context';
import PersonalInfoStep from './PersonalInfoStep';
import TrainingExperienceStep from './TrainingExperienceStep';
import TimelineStep from './TimelineStep';
import RecommendationStep from './RecommendationStep';
// Enhanced Assessment Steps
import InjuryScreeningStep from './InjuryScreeningStep';
import GainerTypeStep from './GainerTypeStep';
import SmartGoalsStep from './SmartGoalsStep';
import VolumeLandmarksStep from './VolumeLandmarksStep';

const StepWizard = ({ setUserProfile }) => {
    const navigate = useNavigate();
    const { updateAssessment } = useApp();
    const [currentStep, setCurrentStep] = useState(0);
    const [assessmentData, setAssessmentData] = useState({
        // Core Assessment (Original 4 steps)
        primaryGoal: '',
        trainingExperience: '',
        timeline: '',
        recommendedSystem: '',

        // Enhanced Assessment Data (From Program Design)
        injuryHistory: {
            pastInjuries: [],
            currentLimitations: '',
            painLevel: 0,
            previousSurgeries: '',
            physicalTherapy: false
        },
        gainerType: {
            reps: null,
            classification: null,
            fiberType: '',
            powerOutput: null
        },
        smartGoals: {
            specific: '',
            measurable: '',
            achievable: '',
            relevant: '',
            timeBound: ''
        },
        volumeLandmarks: {
            benchPress: { current: 0, target: 0 },
            squat: { current: 0, target: 0 },
            deadlift: { current: 0, target: 0 },
            weeklyVolume: 0
        },
        nutrition: {
            currentApproach: '',
            goals: [],
            restrictions: ''
        },
        monitoring: {
            trackingMethods: [],
            recoveryIndicators: [],
            fatigueSignals: []
        }
    });

    // Auto-suggestion system based on inputs
    const generateRecommendation = (goal, experience, timeline) => {
        if (!goal || !experience || !timeline) return '';

        // Beginner recommendations
        if (experience === 'Beginner <1 year') {
            return 'Linear';
        }

        // Competition prep with adequate time
        if (goal === 'Powerlifting Competition' && (timeline === '12-16 weeks' || timeline === '16-20 weeks' || timeline === '20+ weeks')) {
            return 'Block';
        }

        // Advanced powerlifting
        if (experience === 'Advanced 3-5 years' && goal === 'Powerlifting Competition') {
            return 'Conjugate';
        }

        // Elite athletes
        if (experience === 'Elite 5+ years') {
            if (goal === 'Athletic Performance') return 'Conjugate';
            if (goal === 'Powerlifting Competition') return 'Conjugate';
            return 'Block';
        }

        // Bodybuilding/Physique
        if (goal === 'Bodybuilding/Physique') {
            if (experience === 'Intermediate 1-3 years') return 'Linear';
            return 'Block';
        }

        // Athletic Performance
        if (goal === 'Athletic Performance') {
            if (experience === 'Intermediate 1-3 years' || experience === 'Advanced 3-5 years') return 'Block';
            return 'Conjugate';
        }

        // General Fitness
        if (goal === 'General Fitness') {
            return 'Linear';
        }

        // Hybrid/Multiple goals
        if (goal === 'Hybrid/Multiple') {
            if (experience === 'Intermediate 1-3 years' || experience === 'Advanced 3-5 years') return 'Block';
            return 'Conjugate';
        }

        // Default fallback
        return 'Linear';
    };

    // Update recommendation when relevant fields change
    useEffect(() => {
        const recommendation = generateRecommendation(
            assessmentData.primaryGoal,
            assessmentData.trainingExperience,
            assessmentData.timeline
        );
        setAssessmentData(prev => ({ ...prev, recommendedSystem: recommendation }));
    }, [assessmentData.primaryGoal, assessmentData.trainingExperience, assessmentData.timeline]);

    const handleInputChange = (field, value) => {
        // Handle both simple field updates and complex nested object updates
        if (typeof field === 'string') {
            setAssessmentData(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            // For complex updates from step components, field is already the full new data object
            setAssessmentData(field);
        }
    };

    const handleNext = () => {
        if (currentStep < 7) {
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
            case 3: return true; // Injury screening - optional, always can proceed
            case 4: return true; // Gainer type - optional, always can proceed  
            case 5: return true; // SMART goals - optional, always can proceed
            case 6: return true; // Volume landmarks - optional, always can proceed
            case 7: return true; // Final step, always can proceed to submit
            default: return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show loading toast
        const loadingToast = toast.loading('Saving your assessment...');

        // Prepare profile data
        const profileData = {
            ...assessmentData,
            createdAt: new Date().toISOString()
        };

        try {
            // Try to save to Supabase first
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (!authError && user) {
                // User is authenticated, save to Supabase
                const { data, error: insertError } = await supabase
                    .from('user_assessments')
                    .insert({
                        user_id: user.id,
                        primary_goal: assessmentData.primaryGoal,
                        training_experience: assessmentData.trainingExperience,
                        timeline: assessmentData.timeline,
                        recommended_system: assessmentData.recommendedSystem,
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Supabase insert error:', insertError);
                    throw insertError;
                }

                console.log('Assessment saved to Supabase successfully:', data);

                // Save to localStorage as backup
                localStorage.setItem('userProfile', JSON.stringify(profileData));
                setUserProfile(profileData);

                // Save to AppContext for Program Design
                await updateAssessment({
                    primaryGoal: assessmentData.primaryGoal,
                    trainingExperience: assessmentData.trainingExperience,
                    timeline: assessmentData.timeline,
                    recommendedSystem: assessmentData.recommendedSystem,
                    createdAt: profileData.createdAt
                });

                // Dismiss loading toast and show success
                toast.dismiss(loadingToast);
                toast.success('Assessment saved successfully! Redirecting...');

                // Navigate to program page
                setTimeout(() => {
                    navigate('/program');
                }, 1500);

            } else {
                // User not authenticated, fall back to localStorage only
                console.log('User not authenticated, saving to localStorage only');
                localStorage.setItem('userProfile', JSON.stringify(profileData));
                setUserProfile(profileData);

                // Save to AppContext for Program Design
                await updateAssessment({
                    primaryGoal: assessmentData.primaryGoal,
                    trainingExperience: assessmentData.trainingExperience,
                    timeline: assessmentData.timeline,
                    recommendedSystem: assessmentData.recommendedSystem,
                    createdAt: profileData.createdAt
                });

                // Dismiss loading toast and show success
                toast.dismiss(loadingToast);
                toast.success('Assessment completed successfully! Redirecting...');

                // Navigate to program page
                setTimeout(() => {
                    navigate('/program');
                }, 1500);
            }

        } catch (error) {
            // If Supabase fails, fall back to localStorage
            console.error('Error saving to Supabase, falling back to localStorage:', error);

            localStorage.setItem('userProfile', JSON.stringify(profileData));
            setUserProfile(profileData);

            // Save to AppContext for Program Design even on error
            try {
                await updateAssessment({
                    primaryGoal: assessmentData.primaryGoal,
                    trainingExperience: assessmentData.trainingExperience,
                    timeline: assessmentData.timeline,
                    recommendedSystem: assessmentData.recommendedSystem,
                    createdAt: profileData.createdAt
                });
            } catch (contextError) {
                console.error('Failed to save to AppContext:', contextError);
            }

            // Dismiss loading toast and show error with fallback success
            toast.dismiss(loadingToast);
            toast.error('Failed to save online, but saved locally. Redirecting...');

            // Still navigate to program page
            setTimeout(() => {
                navigate('/program');
            }, 2000);
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
                return <InjuryScreeningStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 4:
                return <GainerTypeStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 5:
                return <SmartGoalsStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 6:
                return <VolumeLandmarksStep assessmentData={assessmentData} onInputChange={handleInputChange} />;
            case 7:
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
                    <span className="text-sm text-gray-400">Comprehensive Assessment Progress</span>
                    <span className="text-sm text-blue-400 font-medium">Step {currentStep + 1} of 8</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStep + 1) / 8) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {currentStep === 7 ? 'Ready to submit your complete assessment!' : 'Complete all steps for your personalized program design'}
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
                        {currentStep < 7 ? (
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
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                            >
                                Complete Assessment
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
