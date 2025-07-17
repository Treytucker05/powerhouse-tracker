import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/api/supabaseClient';
import { useApp } from '../context';
import { APP_ACTIONS } from '../context/appActions';
import StepWizard from '../components/assessment/StepWizard';

const Assessment = () => {
    const navigate = useNavigate();
    const { assessment, updateAssessment, dispatch } = useApp();
    const [userProfile, setUserProfile] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Check for existing user profile on mount
    useEffect(() => {
        const loadExistingAssessment = () => {
            let existingProfile = null;

            // First check AppContext
            if (assessment) {
                existingProfile = assessment;
                console.log('Found assessment in AppContext:', existingProfile);
            } else {
                // Fallback to localStorage
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);
                    existingProfile = profile;
                    console.log('Found assessment in localStorage:', existingProfile);

                    // Sync to AppContext
                    updateAssessment({
                        primaryGoal: profile.primaryGoal,
                        trainingExperience: profile.trainingExperience,
                        timeline: profile.timeline,
                        recommendedSystem: profile.recommendedSystem,
                        createdAt: profile.createdAt
                    });
                }
            }

            if (existingProfile) {
                setUserProfile(existingProfile);
                setIsComplete(true);
            } else {
                setIsFormVisible(true);
            }
        };

        loadExistingAssessment();
    }, [assessment, updateAssessment]);

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
                                // Clear localStorage
                                localStorage.removeItem('userProfile');
                                localStorage.removeItem('enhanced_assessment');

                                // Clear AppContext assessment using proper action
                                dispatch({ type: APP_ACTIONS.CLEAR_ASSESSMENT });

                                // Reset local state
                                setUserProfile(null);
                                setIsComplete(false);
                                setIsFormVisible(true);

                                // Show success message
                                toast.success('Assessment cleared successfully');
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

                {/* StepWizard Component */}
                <StepWizard setUserProfile={setUserProfile} />
            </div>
        </div>
    );
};

export default Assessment;
