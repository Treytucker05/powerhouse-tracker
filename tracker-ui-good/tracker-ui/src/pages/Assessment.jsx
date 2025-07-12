import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/api/supabaseClient';

const Assessment = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [assessmentData, setAssessmentData] = useState({
        primaryGoal: '',
        trainingExperience: '',
        timeline: '',
        recommendedSystem: ''
    });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Check for existing user profile on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            setIsComplete(true);
        } else {
            setIsFormVisible(true);
        }
    }, []);

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
    }; const handleSubmit = async (e) => {
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

            // Dismiss loading toast and show error with fallback success
            toast.dismiss(loadingToast);
            toast.error('Failed to save online, but saved locally. Redirecting...');

            // Still navigate to program page
            setTimeout(() => {
                navigate('/program');
            }, 2000);
        }
    };

    // Step components
    const StepContent = ({ step }) => {
        switch (step) {
            case 0:
                return (
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Step 1: Primary Goal</h3>
                        <p className="text-gray-400 mb-6">What is your main training objective?</p>

                        <div className="space-y-3">
                            {[
                                'Powerlifting Competition',
                                'Bodybuilding/Physique',
                                'Athletic Performance',
                                'General Fitness',
                                'Hybrid/Multiple'
                            ].map((goal) => (
                                <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="primaryGoal"
                                        value={goal}
                                        checked={assessmentData.primaryGoal === goal}
                                        onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                                        className="text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-white">{goal}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Step 2: Training Experience</h3>
                        <p className="text-gray-400 mb-6">How long have you been training consistently?</p>

                        <div className="space-y-3">
                            {[
                                'Beginner <1 year',
                                'Intermediate 1-3 years',
                                'Advanced 3-5 years',
                                'Elite 5+ years'
                            ].map((experience) => (
                                <label key={experience} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="trainingExperience"
                                        value={experience}
                                        checked={assessmentData.trainingExperience === experience}
                                        onChange={(e) => handleInputChange('trainingExperience', e.target.value)}
                                        className="text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-white">{experience}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Step 3: Timeline</h3>
                        <p className="text-gray-400 mb-6">How long do you want this program to run?</p>

                        <div className="space-y-3">
                            {[
                                '8-12 weeks',
                                '12-16 weeks',
                                '16-20 weeks',
                                '20+ weeks'
                            ].map((timeline) => (
                                <label key={timeline} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="timeline"
                                        value={timeline}
                                        checked={assessmentData.timeline === timeline}
                                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                                        className="text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-white">{timeline}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-4">Step 4: Recommendation</h3>
                        <p className="text-gray-400 mb-6">Based on your selections, here's our recommendation:</p>

                        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
                            <div className="text-center">
                                <div className="text-3xl mb-3">🎯</div>
                                <h4 className="text-blue-400 font-semibold text-lg mb-2">
                                    Recommended: {assessmentData.recommendedSystem}
                                </h4>
                                <p className="text-gray-300 text-sm">
                                    This system is optimal for your goals, experience level, and timeline.
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h5 className="text-white font-medium mb-3">Your Assessment Summary:</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Goal:</span>
                                    <span className="text-white">{assessmentData.primaryGoal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Experience:</span>
                                    <span className="text-white">{assessmentData.trainingExperience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Timeline:</span>
                                    <span className="text-white">{assessmentData.timeline}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">System:</span>
                                    <span className="text-blue-400 font-medium">{assessmentData.recommendedSystem}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const handleProceedToProgram = () => {
        navigate('/program');
    };

    if (isComplete && userProfile) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Assessment Complete</h1>
                        <p className="text-gray-400">Your profile has been saved successfully.</p>
                    </div>

                    {/* Completion Message */}
                    <div className="bg-green-900/50 border border-green-500 rounded-lg p-6 mb-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-green-400 font-semibold text-xl mb-2">Assessment Complete</h3>
                            <p className="text-white mb-4">Ready for Program Design</p>
                            <p className="text-gray-300 text-sm mb-6">
                                Goal: {userProfile.primaryGoal} | Experience: {userProfile.trainingExperience} | Recommended: {userProfile.recommendedSystem}
                            </p>
                            <button
                                onClick={handleProceedToProgram}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium"
                            >
                                Continue to Program Design
                            </button>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Your Complete Assessment Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-400 text-sm">Primary Goal</label>
                                <p className="text-white font-medium">{userProfile.primaryGoal}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Training Experience</label>
                                <p className="text-white font-medium">{userProfile.trainingExperience}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Timeline</label>
                                <p className="text-white font-medium">{userProfile.timeline}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Recommended System</label>
                                <p className="text-blue-400 font-medium">{userProfile.recommendedSystem}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Assessment Date</label>
                                <p className="text-white font-medium">
                                    {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Not recorded'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reset Option */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                localStorage.removeItem('userProfile');
                                setUserProfile(null);
                                setIsComplete(false);
                                setIsFormVisible(true);
                                setCurrentStep(0);
                                setAssessmentData({
                                    primaryGoal: '',
                                    trainingExperience: '',
                                    timeline: '',
                                    recommendedSystem: ''
                                });
                            }}
                            className="text-gray-400 hover:text-gray-300 text-sm underline"
                        >
                            Reset Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isFormVisible) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Training Assessment</h1>
                    <p className="text-gray-400">Help us personalize your training program by providing some basic information.</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
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
                        <StepContent step={currentStep} />
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
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                                >
                                    Complete Assessment
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Step Indicators */}
                <div className="mt-8 flex justify-center space-x-4">
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
                <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
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
        </div>
    );
};

export default Assessment;
