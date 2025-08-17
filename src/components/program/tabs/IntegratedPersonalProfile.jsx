import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import { useApp } from '../../../context';

const IntegratedPersonalProfile = () => {
    const { state, actions } = useProgramContext();
    const { assessment, updateAssessment } = useApp();

    const [formData, setFormData] = useState({
        primaryGoal: assessment?.primaryGoal || state.programData?.goal || '',
        trainingExperience: assessment?.trainingExperience || '',
        timeline: assessment?.timeline || state.programData?.duration || '12'
    });

    useEffect(() => {
        // Update program data when form changes
        if (formData.primaryGoal) {
            actions.setProgramData({ goal: formData.primaryGoal });
        }
    }, [formData, actions]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Update assessment context
        updateAssessment({ [field]: value });
    };

    const handleNext = () => {
        // Save data and move to next tab
        updateAssessment(formData);
        actions.setActiveTab('overview');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Step 1: Personal Profile</h3>
                <p className="text-blue-300 text-sm">
                    Define your primary training goal and basic information
                </p>
            </div>

            {/* Primary Goal Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Primary Training Goal</h4>
                <p className="text-gray-400 mb-6">What is your main training objective?</p>

                <div className="space-y-3">
                    {[
                        { value: 'powerlifting', label: 'Powerlifting Competition', description: 'Maximize squat, bench, deadlift strength' },
                        { value: 'bodybuilding', label: 'Bodybuilding/Physique', description: 'Build muscle mass and aesthetic physique' },
                        { value: 'athletic', label: 'Athletic Performance', description: 'Sport-specific strength and conditioning' },
                        { value: 'general', label: 'General Fitness', description: 'Overall health and wellness' },
                        { value: 'hybrid', label: 'Hybrid/Multiple', description: 'Combination of multiple goals' }
                    ].map((goal) => (
                        <label key={goal.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                            <input
                                type="radio"
                                name="primaryGoal"
                                value={goal.value}
                                checked={formData.primaryGoal === goal.value}
                                onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                                className="mt-1 text-blue-500 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">{goal.label}</span>
                                <p className="text-gray-400 text-sm">{goal.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Training Experience */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Training Experience</h4>
                <p className="text-gray-400 mb-6">How long have you been training consistently?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { value: 'beginner', label: 'Beginner (0-1 year)', description: 'New to structured training' },
                        { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Some training experience' },
                        { value: 'advanced', label: 'Advanced (3-5 years)', description: 'Experienced with various methods' },
                        { value: 'expert', label: 'Expert (5+ years)', description: 'Highly experienced athlete' }
                    ].map((exp) => (
                        <label key={exp.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                            <input
                                type="radio"
                                name="trainingExperience"
                                value={exp.value}
                                checked={formData.trainingExperience === exp.value}
                                onChange={(e) => handleInputChange('trainingExperience', e.target.value)}
                                className="mt-1 text-blue-500 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">{exp.label}</span>
                                <p className="text-gray-400 text-sm">{exp.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Program Timeline</h4>
                <p className="text-gray-400 mb-6">How long do you want your initial program to run?</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { value: '6', label: '6 Weeks', description: 'Short cycle' },
                        { value: '8', label: '8 Weeks', description: 'Standard block' },
                        { value: '12', label: '12 Weeks', description: 'Full phase' },
                        { value: '16', label: '16 Weeks', description: 'Extended cycle' }
                    ].map((time) => (
                        <label key={time.value} className="flex flex-col items-center cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-center">
                            <input
                                type="radio"
                                name="timeline"
                                value={time.value}
                                checked={formData.timeline === time.value}
                                onChange={(e) => handleInputChange('timeline', e.target.value)}
                                className="mb-2 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-white font-medium">{time.label}</span>
                            <span className="text-gray-400 text-xs">{time.description}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Progress Summary */}
            {formData.primaryGoal && formData.trainingExperience && formData.timeline && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Profile Complete</h4>
                    <div className="text-green-300 text-sm space-y-1">
                        <p>• Goal: {formData.primaryGoal}</p>
                        <p>• Experience: {formData.trainingExperience}</p>
                        <p>• Timeline: {formData.timeline} weeks</p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!formData.primaryGoal || !formData.trainingExperience || !formData.timeline}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Next: Program Overview
                </button>
            </div>
        </div>
    );
};

export default IntegratedPersonalProfile;
