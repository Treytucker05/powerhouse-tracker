import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';
import { useAssessment } from '../../hooks/useAssessment';
import FitnessFatigueTracker from '../recovery/FitnessFatigueTracker';

/**
 * Enhanced GoalsAndNeeds Component
 * 
 * Integrates Bryant Periodization with:
 * - Gainer type classification and auto-volume adjustment
 * - Personalized volume landmark calculations
 * - Recovery capacity assessment
 */

const EnhancedGoalsAndNeeds = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        classifyGainerType,
        applyGainerTypeToProgram,
        calculatePersonalizedVolume,
        assessRecoveryCapacity
    } = useAssessment();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        primaryGoal: '',
        trainingExperience: '',
        timeline: '',
        gainerTestReps: '',
        recoveryProfile: {
            age: 30,
            sleepHours: 7,
            sleepQuality: 7,
            stressLevel: 5,
            nutrition: 7,
            lifestyle: 'moderate'
        }
    });

    // Handle gainer type test completion
    const handleGainerTest = () => {
        if (!formData.gainerTestReps) return;

        const gainerType = classifyGainerType(parseInt(formData.gainerTestReps));
        if (gainerType) {
            actions.updateGainerType(gainerType);

            // If we have an existing program, apply the modifier
            if (state.programData.weeklyVolume > 0) {
                actions.applyGainerTypeToProgram(gainerType);
            }

            setCurrentStep(3); // Move to recovery assessment
        }
    };

    // Handle recovery capacity assessment
    const handleRecoveryAssessment = () => {
        const recoveryData = assessRecoveryCapacity(formData.recoveryProfile);
        actions.updateRecoveryData({ recoveryCapacity: recoveryData });
        actions.setUserProfile(formData.recoveryProfile);

        setCurrentStep(4); // Move to volume calculation
    };

    // Calculate and display personalized volumes
    const calculateVolumes = () => {
        if (!state.assessmentData.gainerType || !formData.trainingExperience) return {};

        const muscleGroups = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes'];
        const volumes = {};

        muscleGroups.forEach(muscle => {
            volumes[muscle] = calculatePersonalizedVolume(
                muscle,
                state.assessmentData.gainerType,
                formData.trainingExperience
            );
        });

        return volumes;
    };

    // Save assessment data
    const handleSaveAssessment = () => {
        const volumes = calculateVolumes();

        const assessmentData = {
            ...formData,
            gainerType: state.assessmentData.gainerType,
            recoveryCapacity: state.recoveryData.recoveryCapacity,
            personalizedVolumes: volumes,
            completedAt: new Date().toISOString()
        };

        actions.updateAssessment(assessmentData);

        if (onNext) onNext();
    };

    // Step 1: Basic Goals and Experience
    const renderBasicGoals = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                    Primary Training Goal
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                    {[
                        { id: 'powerlifting', name: 'Powerlifting', desc: 'Max strength in squat, bench, deadlift' },
                        { id: 'bodybuilding', name: 'Bodybuilding', desc: 'Muscle size and physique' },
                        { id: 'athletic', name: 'Athletic Performance', desc: 'Sport-specific performance' },
                        { id: 'general', name: 'General Fitness', desc: 'Overall health and wellness' }
                    ].map(goal => (
                        <button
                            key={goal.id}
                            onClick={() => setFormData(prev => ({ ...prev, primaryGoal: goal.id }))}
                            className={`p-4 border rounded-lg text-left transition-colors ${formData.primaryGoal === goal.id
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            <h4 className="font-medium text-white">{goal.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">{goal.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                    Training Experience
                </h3>
                <div className="grid gap-2">
                    {[
                        { id: 'beginner', name: 'Beginner', desc: 'Less than 1 year consistent training' },
                        { id: 'novice', name: 'Novice', desc: '1-2 years of training' },
                        { id: 'intermediate', name: 'Intermediate', desc: '2-5 years of training' },
                        { id: 'advanced', name: 'Advanced', desc: '5+ years of consistent training' },
                        { id: 'elite', name: 'Elite', desc: 'Competitive athlete level' }
                    ].map(level => (
                        <button
                            key={level.id}
                            onClick={() => setFormData(prev => ({ ...prev, trainingExperience: level.id }))}
                            className={`p-3 border rounded-lg text-left transition-colors ${formData.trainingExperience === level.id
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            <span className="font-medium text-white">{level.name}</span>
                            <span className="text-sm text-gray-400 ml-2">- {level.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-md"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.primaryGoal || !formData.trainingExperience}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                >
                    Next: Gainer Type Test
                </button>
            </div>
        </div>
    );

    // Step 2: Gainer Type Classification
    const renderGainerTest = () => (
        <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                    🧪 Gainer Type Classification Test
                </h3>
                <p className="text-gray-300 mb-4">
                    This test determines your optimal training volume using the Bryant Periodization methodology.
                </p>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-white mb-2">Test Instructions:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                        <li>Choose a major compound exercise (bench press, squat, or deadlift)</li>
                        <li>Find your current 1-rep max (1RM) or use a recent heavy single</li>
                        <li>Calculate 80% of your 1RM</li>
                        <li>Perform as many reps as possible at 80% 1RM with perfect form</li>
                        <li>Rest 2-3 minutes, then enter your rep count below</li>
                    </ol>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reps completed at 80% 1RM:
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="25"
                        value={formData.gainerTestReps}
                        onChange={(e) => setFormData(prev => ({ ...prev, gainerTestReps: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        placeholder="Enter number of reps"
                    />
                </div>

                {formData.gainerTestReps && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Preview Classification:</h4>
                        {(() => {
                            const preview = classifyGainerType(parseInt(formData.gainerTestReps));
                            return preview ? (
                                <div>
                                    <p className="text-blue-400 font-medium">{preview.type}</p>
                                    <p className="text-sm text-gray-300">{preview.characteristics}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Volume Modifier: {Math.round((preview.volumeModifier - 1) * 100)}%
                                    </p>
                                </div>
                            ) : null;
                        })()}
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                    Back
                </button>
                <button
                    onClick={handleGainerTest}
                    disabled={!formData.gainerTestReps}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                >
                    Classify Gainer Type
                </button>
            </div>
        </div>
    );

    // Step 3: Recovery Assessment
    const renderRecoveryAssessment = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                    🏋️ Recovery Capacity Assessment
                </h3>
                <p className="text-gray-300 mb-6">
                    Your recovery capacity affects how much training volume you can handle.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Age
                        </label>
                        <input
                            type="number"
                            min="15"
                            max="80"
                            value={formData.recoveryProfile.age}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                recoveryProfile: { ...prev.recoveryProfile, age: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Average Sleep (hours)
                        </label>
                        <input
                            type="number"
                            min="4"
                            max="12"
                            step="0.5"
                            value={formData.recoveryProfile.sleepHours}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                recoveryProfile: { ...prev.recoveryProfile, sleepHours: parseFloat(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sleep Quality (1-10)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.recoveryProfile.sleepQuality}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                recoveryProfile: { ...prev.recoveryProfile, sleepQuality: parseInt(e.target.value) }
                            }))}
                            className="w-full"
                        />
                        <div className="text-center text-sm text-gray-400">
                            {formData.recoveryProfile.sleepQuality}/10
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Stress Level (1-10)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.recoveryProfile.stressLevel}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                recoveryProfile: { ...prev.recoveryProfile, stressLevel: parseInt(e.target.value) }
                            }))}
                            className="w-full"
                        />
                        <div className="text-center text-sm text-gray-400">
                            {formData.recoveryProfile.stressLevel}/10
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                    Back
                </button>
                <button
                    onClick={handleRecoveryAssessment}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Assess Recovery
                </button>
            </div>
        </div>
    );

    // Step 4: Results and Volume Calculation
    const renderResults = () => {
        const volumes = calculateVolumes();

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                        📊 Your Personalized Assessment Results
                    </h3>
                </div>

                {/* Gainer Type Results */}
                {state.assessmentData.gainerType && (
                    <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-3">
                            Gainer Classification: {state.assessmentData.gainerType.type}
                        </h4>
                        <p className="text-gray-300 mb-4">
                            {state.assessmentData.gainerType.characteristics}
                        </p>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-gray-400">Volume Modifier</p>
                                <p className="text-xl font-bold text-white">
                                    {Math.round((state.assessmentData.gainerType.volumeModifier - 1) * 100)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Frequency</p>
                                <p className="text-xl font-bold text-white">
                                    {state.assessmentData.gainerType.frequencyRecommendation}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Intensity</p>
                                <p className="text-xl font-bold text-white">
                                    {state.assessmentData.gainerType.intensityPreference}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Volume Landmarks */}
                {Object.keys(volumes).length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Personalized Volume Landmarks (sets/week)
                        </h4>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(volumes).map(([muscle, landmark]) => (
                                <div key={muscle} className="bg-gray-700 rounded-lg p-4">
                                    <h5 className="font-medium text-white capitalize mb-2">{muscle}</h5>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">MEV:</span>
                                            <span className="text-green-400">{landmark.MEV}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">MRV:</span>
                                            <span className="text-blue-400">{landmark.MRV}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">MAV:</span>
                                            <span className="text-red-400">{landmark.MAV}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recovery Assessment */}
                {state.recoveryData.recoveryCapacity && (
                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-3">
                            Recovery Capacity: {state.recoveryData.recoveryCapacity.classification}
                        </h4>
                        <p className="text-gray-300 mb-4">
                            Score: {state.recoveryData.recoveryCapacity.score}/100
                        </p>

                        <div className="space-y-2">
                            {state.recoveryData.recoveryCapacity.recommendations?.slice(0, 3).map((rec, index) => (
                                <p key={index} className="text-sm text-gray-300 flex items-start">
                                    <span className="text-green-400 mr-2">•</span>
                                    {rec}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSaveAssessment}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                        Save Assessment & Continue
                    </button>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Assessment Progress</span>
                    <span className="text-sm text-gray-400">{currentStep}/4</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step content */}
            {currentStep === 1 && renderBasicGoals()}
            {currentStep === 2 && renderGainerTest()}
            {currentStep === 3 && renderRecoveryAssessment()}
            {currentStep === 4 && renderResults()}

            {/* Optional Fitness-Fatigue tracker for completed assessments */}
            {currentStep === 4 && state.assessmentData.gainerType && (
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Optional: Fitness-Fatigue Monitoring
                    </h3>
                    <FitnessFatigueTracker />
                </div>
            )}
        </div>
    );
};

export default EnhancedGoalsAndNeeds;
