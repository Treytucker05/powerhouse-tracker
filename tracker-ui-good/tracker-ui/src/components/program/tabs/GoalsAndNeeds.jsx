import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Calendar, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../context';

// Quick Assessment Form Component
const QuickAssessmentForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        primaryGoal: '',
        trainingExperience: '',
        timeline: '',
        recommendedSystem: ''
    });

    const handleInputChange = (field, value) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        // Auto-generate recommendation
        if (updatedData.primaryGoal && updatedData.trainingExperience && updatedData.timeline) {
            updatedData.recommendedSystem = generateRecommendation(updatedData);
        }
    };

    const generateRecommendation = (data) => {
        if (data.primaryGoal === 'Powerlifting Competition') return 'Block Periodization';
        if (data.primaryGoal === 'Bodybuilding/Physique') return 'Volume Progression';
        if (data.primaryGoal === 'Athletic Performance') return 'Conjugate Method';
        return 'Linear Progression';
    };

    const handleSubmit = () => {
        if (formData.primaryGoal && formData.trainingExperience && formData.timeline) {
            // Save to context and localStorage
            localStorage.setItem('userProfile', JSON.stringify(formData));
            onComplete(formData);
        }
    };

    return (
        <div className="space-y-4">
            {/* Primary Goal */}
            <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Primary Training Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Powerlifting Competition', 'Bodybuilding/Physique', 'Athletic Performance', 'General Fitness'].map((goal) => (
                        <label key={goal} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-600 hover:border-blue-500">
                            <input
                                type="radio"
                                name="primaryGoal"
                                value={goal}
                                checked={formData.primaryGoal === goal}
                                onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white text-sm">{goal}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience Level */}
            <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Training Experience</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Beginner (0-1yr)', 'Intermediate (1-3yr)', 'Advanced (3-5yr)', 'Expert (5+yr)'].map((exp) => (
                        <label key={exp} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-600 hover:border-blue-500">
                            <input
                                type="radio"
                                name="trainingExperience"
                                value={exp}
                                checked={formData.trainingExperience === exp}
                                onChange={(e) => handleInputChange('trainingExperience', e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white text-xs">{exp}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Program Timeline</label>
                <div className="grid grid-cols-4 gap-2">
                    {['6 weeks', '8 weeks', '12 weeks', '16 weeks'].map((time) => (
                        <label key={time} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-600 hover:border-blue-500">
                            <input
                                type="radio"
                                name="timeline"
                                value={time}
                                checked={formData.timeline === time}
                                onChange={(e) => handleInputChange('timeline', e.target.value)}
                                className="text-blue-500"
                            />
                            <span className="text-white text-xs">{time}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Recommendation Preview */}
            {formData.recommendedSystem && (
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                    <p className="text-green-400 text-sm">
                        <strong>Recommended:</strong> {formData.recommendedSystem}
                    </p>
                </div>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!formData.primaryGoal || !formData.trainingExperience || !formData.timeline}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
                Complete Setup & Continue
            </button>
        </div>
    );
};

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    console.log('GoalsAndNeeds - Component rendering');

    // Safe context access
    let state, dispatch;
    try {
        const context = useApp();
        state = context?.state;
        dispatch = context?.dispatch;
        console.log('Context loaded successfully:', { hasState: !!state, hasDispatch: !!dispatch });
    } catch (error) {
        console.warn('Context not available, continuing without it:', error);
        state = null;
        dispatch = null;
    }

    // Get assessment data from context or localStorage
    const [assessmentSummary, setAssessmentSummary] = useState(null);

    useEffect(() => {
        // Try to get assessment data from context first
        if (state?.assessment) {
            setAssessmentSummary(state.assessment);
        } else {
            // Fallback to localStorage
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                try {
                    const profile = JSON.parse(savedProfile);
                    setAssessmentSummary(profile);
                } catch (error) {
                    console.warn('Failed to parse saved profile:', error);
                }
            }
        }
    }, [state]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Goals Summary</h2>
                    <p className="text-gray-400">Review your assessment results and set program goals</p>
                </div>
            </div>

            {/* Assessment Summary */}
            {assessmentSummary ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Core Assessment Results */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="h-5 w-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-white">Assessment Summary</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Primary Goal:</span>
                                    <div className="text-white font-medium">{assessmentSummary.primaryGoal || 'Not set'}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Experience:</span>
                                    <div className="text-white font-medium">{assessmentSummary.trainingExperience || 'Not set'}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Timeline:</span>
                                    <div className="text-white font-medium">{assessmentSummary.timeline || 'Not set'}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Recommended System:</span>
                                    <div className="text-green-400 font-medium">{assessmentSummary.recommendedSystem || 'Not set'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Assessment Data */}
                    {(assessmentSummary.gainerType || assessmentSummary.volumeLandmarks) && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h3 className="text-lg font-semibold text-white">Training Profile</h3>
                            </div>

                            <div className="space-y-3 text-sm">
                                {assessmentSummary.gainerType?.classification && (
                                    <div>
                                        <span className="text-gray-400">Gainer Type:</span>
                                        <div className="text-green-400 font-medium">{assessmentSummary.gainerType.classification}</div>
                                    </div>
                                )}

                                {assessmentSummary.volumeLandmarks && (
                                    <div>
                                        <span className="text-gray-400">Volume Preferences:</span>
                                        <div className="text-white font-medium">{assessmentSummary.volumeLandmarks.weeklyVolume} days/week</div>
                                    </div>
                                )}

                                {assessmentSummary.injuryHistory?.currentLimitations && (
                                    <div>
                                        <span className="text-gray-400">Considerations:</span>
                                        <div className="text-yellow-400 font-medium">Has limitations</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* No Assessment Completed - Inline Quick Assessment */
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-blue-400">Quick Assessment Setup</h3>
                    </div>
                    <p className="text-blue-300 mb-6">
                        Let's quickly set up your basic training profile to get started with program design.
                    </p>

                    <QuickAssessmentForm onComplete={(data) => setAssessmentSummary(data)} />
                </div>
            )}

            {/* Program Goals Setup */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-white">Program Design Goals</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Specific Program Objectives
                        </label>
                        <textarea
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="Based on your assessment, define specific objectives for this program design (e.g., 'Increase squat 1RM from 185lbs to 225lbs within 16 weeks using block periodization')"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Priority Movement Pattern
                            </label>
                            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select primary focus</option>
                                <option value="squat">Squat Pattern</option>
                                <option value="bench">Bench Press Pattern</option>
                                <option value="deadlift">Deadlift Pattern</option>
                                <option value="overhead">Overhead Press Pattern</option>
                                <option value="balanced">Balanced Approach</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Program Duration
                            </label>
                            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select duration</option>
                                <option value="4">4 weeks (Microcycle)</option>
                                <option value="8">8 weeks (Mesocycle)</option>
                                <option value="12">12 weeks (Block)</option>
                                <option value="16">16 weeks (Phase)</option>
                                <option value="24">24 weeks (Macrocycle)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-md font-semibold text-blue-400 mb-2">Next Steps</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Review your assessment summary above</li>
                    <li>• Set specific program objectives</li>
                    <li>• Move to Macrocycle Structure to begin periodization</li>
                    <li>• Use your assessment data to guide design decisions</li>
                </ul>
            </div>
        </div>
    );
};

export default GoalsAndNeeds;
