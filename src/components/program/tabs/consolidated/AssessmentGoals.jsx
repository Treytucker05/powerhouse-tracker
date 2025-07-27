/**
 * AssessmentGoals.jsx - Consolidated Assessment & Goal Setting Component
 * Combines assessment screening, goal prioritization, and Bryant PHA integration
 * Part of 5-component unified framework
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../../contexts/ProgramContext';
import { useAssessment } from '../../../../hooks/useAssessment';
import { validateBryantIntegration } from '../../../../utils/legacyMigration';

const AssessmentGoals = ({ onNext, onPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        assessFiberType,
        analyzeTrainingAge,
        validateSMARTGoals,
        saveAssessment,
        loading
    } = useAssessment();

    // Consolidated assessment state
    const [assessment, setAssessment] = useState({
        // Basic Assessment
        trainingExperience: state.assessmentData?.trainingExperience || '',
        currentFitnessLevel: state.assessmentData?.currentFitnessLevel || '',

        // Goal Setting
        primaryGoal: state.programData?.goal || 'hypertrophy',
        secondaryGoals: [],
        timeframe: '12-weeks',
        specificOutcomes: '',

        // PHA Health Screening
        phaScreening: {
            bloodPressure: { systolic: '', diastolic: '', status: 'unknown' },
            restingHeartRate: '',
            cardiovascularHistory: [],
            currentMedications: [],
            recentInjuries: [],
            cleared: null,
            riskScore: 0
        },

        // Bryant Integration Readiness
        bryantReadiness: {
            fitnessLevel: 'intermediate',
            equipmentAccess: [],
            tacticalBackground: false,
            preferredMethods: []
        },

        // Goal Prioritization
        goalPriorities: {
            strength: 'medium',
            hypertrophy: 'high',
            endurance: 'low',
            power: 'medium',
            mobility: 'medium',
            tactical: 'low'
        }
    });

    // Validation state
    const [validationResults, setValidationResults] = useState({
        phaCleared: true, // Default to true to allow navigation
        bryantCompatible: null,
        goalConflicts: [],
        recommendations: []
    });

    // Load existing assessment data
    useEffect(() => {
        if (state.assessmentData) {
            setAssessment(prev => ({
                ...prev,
                ...state.assessmentData
            }));
        }
    }, [state.assessmentData]);

    // PHA Health Screening Logic
    const performPHAScreening = (healthData) => {
        const riskFactors = {
            highBP: healthData.bloodPressure.systolic > 140 || healthData.bloodPressure.diastolic > 90,
            elevatedHR: healthData.restingHeartRate > 100,
            cardiacHistory: healthData.cardiovascularHistory.length > 0,
            medications: healthData.currentMedications.some(med =>
                ['beta-blockers', 'blood-thinners', 'heart-medication'].includes(med.toLowerCase())
            ),
            recentInjury: healthData.recentInjuries.some(injury =>
                injury.date && (new Date() - new Date(injury.date)) < (30 * 24 * 60 * 60 * 1000) // 30 days
            )
        };

        const riskCount = Object.values(riskFactors).filter(Boolean).length;
        const riskScore = riskCount * 20; // 0-100 scale

        return {
            cleared: riskScore < 40,
            riskScore,
            riskFactors,
            recommendations: generatePHARecommendations(riskFactors, riskScore)
        };
    };

    const generatePHARecommendations = (riskFactors, riskScore) => {
        const recommendations = [];

        if (riskFactors.highBP) {
            recommendations.push('Consult physician before beginning high-intensity training');
            recommendations.push('Monitor blood pressure regularly during exercise');
        }

        if (riskFactors.elevatedHR) {
            recommendations.push('Start with low-intensity aerobic exercise');
            recommendations.push('Gradually progress intensity based on heart rate response');
        }

        if (riskFactors.cardiacHistory) {
            recommendations.push('Require medical clearance before program participation');
            recommendations.push('Consider cardiac rehabilitation program');
        }

        if (riskScore >= 60) {
            recommendations.push('High-risk classification - medical supervision recommended');
            recommendations.push('Avoid Bryant cluster sets and high-intensity methods initially');
        } else if (riskScore >= 40) {
            recommendations.push('Moderate-risk classification - proceed with caution');
            recommendations.push('Modified Bryant protocols may be appropriate');
        } else {
            recommendations.push('Low-risk classification - cleared for all training methods');
            recommendations.push('Bryant periodization methods appropriate');
        }

        return recommendations;
    };

    // Goal Analysis & Prioritization
    const analyzeGoalCompatibility = () => {
        const { goalPriorities, primaryGoal, bryantReadiness } = assessment;
        const conflicts = [];
        const recommendations = [];

        // Check goal conflicts
        if (goalPriorities.strength === 'high' && goalPriorities.endurance === 'high') {
            conflicts.push('High strength and endurance goals may interfere with each other');
            recommendations.push('Consider periodized approach - focus on one quality per phase');
        }

        if (goalPriorities.power === 'high' && goalPriorities.hypertrophy === 'high') {
            recommendations.push('Bryant cluster sets excellent for both power and hypertrophy');
        }

        if (goalPriorities.tactical === 'high') {
            recommendations.push('Bryant strongman events and tactical protocols recommended');
            recommendations.push('Consider tactical periodization model');
        }

        // Bryant compatibility check
        if (bryantReadiness.fitnessLevel === 'beginner' && goalPriorities.tactical === 'high') {
            conflicts.push('Beginner fitness level may not support advanced tactical methods');
            recommendations.push('Build base fitness before implementing tactical protocols');
        }

        return { conflicts, recommendations };
    };

    // Handle assessment updates
    const handleAssessmentChange = (section, field, value) => {
        setAssessment(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));

        // Re-validate if PHA screening data changed
        if (section === 'phaScreening') {
            const phaResults = performPHAScreening({
                ...assessment.phaScreening,
                [field]: value
            });

            setValidationResults(prev => ({
                ...prev,
                phaCleared: phaResults.cleared,
                recommendations: phaResults.recommendations
            }));
        }
    };

    // Handle goal priority changes
    const handleGoalPriorityChange = (goal, priority) => {
        setAssessment(prev => ({
            ...prev,
            goalPriorities: {
                ...prev.goalPriorities,
                [goal]: priority
            }
        }));

        // Re-analyze compatibility
        const analysis = analyzeGoalCompatibility();
        setValidationResults(prev => ({
            ...prev,
            goalConflicts: analysis.conflicts,
            recommendations: [...prev.recommendations, ...analysis.recommendations]
        }));
    };

    // Handle Bryant method selection
    const handleBryantMethodToggle = (method) => {
        const currentMethods = assessment.bryantReadiness.preferredMethods;
        const newMethods = currentMethods.includes(method)
            ? currentMethods.filter(m => m !== method)
            : [...currentMethods, method];

        setAssessment(prev => ({
            ...prev,
            bryantReadiness: {
                ...prev.bryantReadiness,
                preferredMethods: newMethods
            }
        }));

        // Validate Bryant compatibility
        const validation = validateBryantIntegration({
            bryantFeatures: newMethods,
            ...state.programData
        });

        setValidationResults(prev => ({
            ...prev,
            bryantCompatible: validation.isValid,
            recommendations: [...prev.recommendations, ...validation.recommendations]
        }));
    };

    // Save and proceed
    const handleNext = async () => {
        console.log('🔘 AssessmentGoals Next button clicked!');
        console.log('📊 Validation state:', validationResults);
        console.log('🏥 Assessment data:', assessment);

        try {
            actions.setLoading(true);

            // Perform final PHA screening
            const phaResults = performPHAScreening(assessment.phaScreening);

            // Update assessment with results
            const finalAssessment = {
                ...assessment,
                phaScreening: {
                    ...assessment.phaScreening,
                    ...phaResults
                },
                validationResults
            };

            // Save to context
            actions.setAssessmentData(finalAssessment);
            actions.setProgramData({
                goal: assessment.primaryGoal,
                timeframe: assessment.timeframe
            });

            // Set Bryant integration if methods selected
            if (assessment.bryantReadiness.preferredMethods.length > 0) {
                actions.setBryantIntegrated(
                    true,
                    assessment.bryantReadiness.preferredMethods,
                    validationResults
                );
            }

            // Save to database if available
            if (saveAssessment) {
                await saveAssessment(finalAssessment);
            }

            console.log('✅ Assessment saved, calling onNext()');
            onNext();
        } catch (error) {
            console.error('Error saving assessment:', error);
            actions.setError('Failed to save assessment data');
        } finally {
            actions.setLoading(false);
        }
    };

    // Priority options
    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'gray' },
        { value: 'medium', label: 'Medium', color: 'yellow' },
        { value: 'high', label: 'High', color: 'green' }
    ];

    // Bryant methods available
    const bryantMethods = [
        { id: 'phaCircuits', name: 'PHA Circuits', description: '4-6 week peripheral heart action protocols' },
        { id: 'clusterSets', name: 'Cluster Sets', description: '15s intra-rest, 3×3-5 structure' },
        { id: 'strongmanEvents', name: 'Strongman Events', description: 'Time/distance-based functional training' },
        { id: 'tacticalApplications', name: 'Tactical Applications', description: 'Law enforcement/military protocols' }
    ];

    return (
        <div className="assessment-goals-container space-y-8 p-6">
            {/* Header */}
            <div className="text-center border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Assessment & Goal Setting</h2>
                <p className="text-gray-400">
                    Complete your fitness assessment, set training goals, and configure Bryant Periodization methods
                </p>
            </div>

            {/* PHA Health Screening */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🏥</span>
                    PHA Health Screening
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blood Pressure */}
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">Blood Pressure</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Systolic"
                                value={assessment.phaScreening.bloodPressure.systolic}
                                onChange={(e) => handleAssessmentChange('phaScreening', 'bloodPressure', {
                                    ...assessment.phaScreening.bloodPressure,
                                    systolic: e.target.value
                                })}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                            <span className="text-gray-400 flex items-center">/</span>
                            <input
                                type="number"
                                placeholder="Diastolic"
                                value={assessment.phaScreening.bloodPressure.diastolic}
                                onChange={(e) => handleAssessmentChange('phaScreening', 'bloodPressure', {
                                    ...assessment.phaScreening.bloodPressure,
                                    diastolic: e.target.value
                                })}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                    </div>

                    {/* Resting Heart Rate */}
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">Resting Heart Rate (BPM)</label>
                        <input
                            type="number"
                            value={assessment.phaScreening.restingHeartRate}
                            onChange={(e) => handleAssessmentChange('phaScreening', 'restingHeartRate', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            placeholder="e.g., 65"
                        />
                    </div>
                </div>

                {/* PHA Results */}
                {validationResults.phaCleared !== null && (
                    <div className={`mt-4 p-4 rounded-lg border ${validationResults.phaCleared
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-red-900/20 border-red-500/30'
                        }`}>
                        <div className="flex items-center mb-2">
                            <span className="mr-2">
                                {validationResults.phaCleared ? '✅' : '⚠️'}
                            </span>
                            <span className={`font-semibold ${validationResults.phaCleared ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {validationResults.phaCleared
                                    ? 'Cleared for Training'
                                    : 'Medical Consultation Recommended'
                                }
                            </span>
                        </div>
                        {validationResults.recommendations.length > 0 && (
                            <ul className="text-sm space-y-1">
                                {validationResults.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Goal Setting & Prioritization */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Goal Setting & Prioritization
                </h3>

                {/* Primary Goal */}
                <div className="mb-6">
                    <label className="block text-gray-300 font-medium mb-2">Primary Training Goal</label>
                    <select
                        value={assessment.primaryGoal}
                        onChange={(e) => setAssessment(prev => ({ ...prev, primaryGoal: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                        <option value="strength">Strength Development</option>
                        <option value="hypertrophy">Muscle Hypertrophy</option>
                        <option value="power">Power Development</option>
                        <option value="endurance">Muscular Endurance</option>
                        <option value="tactical">Tactical Fitness</option>
                    </select>
                </div>

                {/* Goal Priorities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(assessment.goalPriorities).map(([goal, priority]) => (
                        <div key={goal} className="bg-gray-900/50 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2 capitalize">{goal}</h4>
                            <div className="flex gap-1">
                                {priorityOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleGoalPriorityChange(goal, option.value)}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${priority === option.value
                                            ? `bg-${option.color}-500 text-white`
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bryant Method Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Bryant Periodization Methods
                </h3>
                <p className="text-gray-400 mb-4">
                    Select Bryant methods you'd like to integrate (based on research pages 101-129)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bryantMethods.map(method => (
                        <div
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${assessment.bryantReadiness.preferredMethods.includes(method.id)
                                ? 'border-blue-500 bg-blue-900/20'
                                : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onClick={() => handleBryantMethodToggle(method.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-medium">{method.name}</h4>
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${assessment.bryantReadiness.preferredMethods.includes(method.id)
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-500'
                                    }`}>
                                    {assessment.bryantReadiness.preferredMethods.includes(method.id) && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Goal Conflicts & Recommendations */}
            {validationResults.goalConflicts.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Goal Analysis</h4>
                    <ul className="text-yellow-300 text-sm space-y-1">
                        {validationResults.goalConflicts.map((conflict, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                {conflict}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <button
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading || validationResults.phaCleared === false}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Next: Periodization'}
                </button>
            </div>
        </div>
    );
};

export default AssessmentGoals;
