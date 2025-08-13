import React, { useState, useEffect } from 'react';
import {
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Lock,
    Unlock,
    BarChart3,
    Zap,
    Activity,
    Users,
    Calendar,
    Settings,
    Calculator
} from 'lucide-react';
import { useAssessment } from '../../../hooks/useAssessment';

const SpecificityTab = ({ onDataUpdate, gainerType, biomotorData }) => {
    const {
        assessSpecificity,
        determineOptimalSpectrum,
        checkModalityCompatibility,
        generateAdaptationSequence,
        calculateTrainingVariables,
        validatePhaseProgression,
        saveSpecificityAssessment
    } = useAssessment();

    const [specificityData, setSpecificityData] = useState({
        preferredModalities: [],
        currentSpectrum: 'broad',
        competitionLifts: false,
        trainingAge: 'beginner',
        goals: [],
        currentPhase: 'hypertrophy'
    });

    const [assessment, setAssessment] = useState(null);
    const [trainingVariables, setTrainingVariables] = useState(null);
    const [showCompatibilityDetails, setShowCompatibilityDetails] = useState(false);

    // Available modalities for selection
    const availableModalities = [
        { id: 'strength', label: 'Strength Training', icon: Target },
        { id: 'endurance', label: 'Endurance/Cardio', icon: Activity },
        { id: 'power', label: 'Power/Explosive', icon: Zap },
        { id: 'flexibility', label: 'Flexibility/Mobility', icon: Users },
        { id: 'bodybuilding', label: 'Bodybuilding/Hypertrophy', icon: TrendingUp },
        { id: 'powerlifting', label: 'Powerlifting/Competition', icon: BarChart3 }
    ];

    // Training spectrum options
    const spectrumOptions = [
        {
            value: 'broad',
            label: 'Broad Spectrum',
            description: 'Hypertrophy focus (6-12 reps, 60-75% 1RM)',
            benefits: ['Muscle growth', 'General strength', 'Movement learning', 'Work capacity'],
            suitableFor: ['Beginners', 'Off-season', 'Muscle building goals']
        },
        {
            value: 'moderate',
            label: 'Moderate Spectrum',
            description: 'Strength focus (3-6 reps, 75-85% 1RM)',
            benefits: ['Strength gains', 'Power development', 'Neural adaptations', 'Skill refinement'],
            suitableFor: ['Intermediate', 'Strength goals', 'Pre-competition']
        },
        {
            value: 'narrow',
            label: 'Narrow Spectrum',
            description: 'Competition specific (1-3 reps, 85-100% 1RM)',
            benefits: ['Peak strength', 'Competition preparation', 'Neural efficiency', 'Skill mastery'],
            suitableFor: ['Advanced', 'Competition prep', 'Peaking phase']
        }
    ];

    // Update assessment when data changes
    useEffect(() => {
        if (assessSpecificity && specificityData.preferredModalities.length > 0) {
            try {
                const newAssessment = assessSpecificity(
                    specificityData,
                    specificityData.goals,
                    biomotorData
                );
                setAssessment(newAssessment);

                // Calculate training variables
                if (calculateTrainingVariables) {
                    const variables = calculateTrainingVariables(
                        specificityData,
                        gainerType,
                        biomotorData
                    );
                    setTrainingVariables(variables);
                }
            } catch (error) {
                console.warn('Specificity assessment error:', error);
            }
        }
    }, [specificityData, gainerType, biomotorData, assessSpecificity, calculateTrainingVariables]);

    const handleModalityToggle = (modalityId) => {
        setSpecificityData(prev => ({
            ...prev,
            preferredModalities: prev.preferredModalities.includes(modalityId)
                ? prev.preferredModalities.filter(id => id !== modalityId)
                : [...prev.preferredModalities, modalityId]
        }));
    };

    const handleSpectrumChange = (spectrum) => {
        setSpecificityData(prev => ({
            ...prev,
            currentSpectrum: spectrum
        }));
    };

    const handleSave = async () => {
        try {
            const saveData = {
                ...specificityData,
                assessment,
                trainingVariables,
                completedAt: new Date().toISOString()
            };

            if (saveSpecificityAssessment) {
                const result = await saveSpecificityAssessment(saveData);
                if (result.success && onDataUpdate) {
                    onDataUpdate(saveData);
                }
            } else if (onDataUpdate) {
                onDataUpdate(saveData);
            }
        } catch (error) {
            console.error('Error saving specificity assessment:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Training Specificity Assessment</h2>
                    <p className="text-gray-400">Scientific Principles of Strength Training Integration</p>
                </div>

                {assessment && (
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Optimal Spectrum</div>
                        <div className="text-lg font-bold text-blue-400 capitalize">
                            {assessment.optimalSpectrum.type}
                        </div>
                        <div className="text-sm text-gray-300">{assessment.optimalSpectrum.focus}</div>
                    </div>
                )}
            </div>

            {/* Modality Selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferred Training Modalities
                </h3>
                <p className="text-gray-400 mb-4">
                    Select your preferred training methods. The system will check for compatibility conflicts.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableModalities.map((modality) => (
                        <button
                            key={modality.id}
                            onClick={() => handleModalityToggle(modality.id)}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${specificityData.preferredModalities.includes(modality.id)
                                    ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                                }`}
                        >
                            <modality.icon className="h-5 w-5" />
                            <span className="font-medium">{modality.label}</span>
                            {specificityData.preferredModalities.includes(modality.id) && (
                                <CheckCircle className="h-4 w-4 ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compatibility Warnings */}
            {assessment?.compatibilityWarnings && assessment.compatibilityWarnings.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Modality Compatibility Warnings
                        </h3>
                        <button
                            onClick={() => setShowCompatibilityDetails(!showCompatibilityDetails)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {showCompatibilityDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {assessment.compatibilityWarnings.map((warning, index) => (
                            <div
                                key={index}
                                className={`rounded-lg p-4 border ${warning.severity === 'high' ? 'border-red-600 bg-red-900/20' :
                                        warning.severity === 'medium' ? 'border-yellow-600 bg-yellow-900/20' :
                                            'border-orange-600 bg-orange-900/20'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className={`h-4 w-4 ${warning.severity === 'high' ? 'text-red-400' :
                                            warning.severity === 'medium' ? 'text-yellow-400' :
                                                'text-orange-400'
                                        }`} />
                                    <span className="font-medium text-white">{warning.title}</span>
                                    <span className={`px-2 py-1 text-xs rounded uppercase ${warning.severity === 'high' ? 'bg-red-900 text-red-300' :
                                            warning.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-orange-900 text-orange-300'
                                        }`}>
                                        {warning.severity}
                                    </span>
                                </div>

                                <p className="text-gray-300 mb-3">{warning.description}</p>

                                {showCompatibilityDetails && (
                                    <>
                                        <div className="mb-3">
                                            <h5 className="font-medium text-white mb-2">Scientific Mechanisms:</h5>
                                            <ul className="space-y-1">
                                                {warning.mechanisms.map((mechanism, i) => (
                                                    <li key={i} className="text-sm text-gray-300">• {mechanism}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-white mb-2">Recommendations:</h5>
                                            <ul className="space-y-1">
                                                {warning.suggestions.map((suggestion, i) => (
                                                    <li key={i} className="text-sm text-green-300">✓ {suggestion}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Training Spectrum Selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Training Spectrum (Broad → Narrow)
                </h3>

                {assessment?.optimalSpectrum && (
                    <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="font-medium text-white">Recommended Spectrum</span>
                        </div>
                        <div className="text-blue-300 capitalize font-medium">
                            {assessment.optimalSpectrum.type} - {assessment.optimalSpectrum.focus}
                        </div>
                        <div className="text-sm text-gray-300">
                            {assessment.optimalSpectrum.repRange} reps at {assessment.optimalSpectrum.intensity} 1RM
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {assessment.optimalSpectrum.rationale}
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {spectrumOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${specificityData.currentSpectrum === option.value
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                }`}
                            onClick={() => handleSpectrumChange(option.value)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white">{option.label}</h4>
                                {specificityData.currentSpectrum === option.value && (
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                )}
                            </div>

                            <p className="text-gray-300 text-sm mb-3">{option.description}</p>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Benefits:</span>
                                    <ul className="text-gray-300 mt-1">
                                        {option.benefits.map((benefit, i) => (
                                            <li key={i}>• {benefit}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="text-gray-400">Suitable for:</span>
                                    <ul className="text-gray-300 mt-1">
                                        {option.suitableFor.map((suitable, i) => (
                                            <li key={i}>• {suitable}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Variables */}
            {trainingVariables && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Calculated Training Variables
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Volume</h4>
                            <div className="text-2xl font-bold text-blue-400">
                                {trainingVariables.volume.setsPerWeek}
                            </div>
                            <div className="text-sm text-gray-400">sets/week</div>
                            <div className="text-sm text-gray-300 mt-1">
                                {trainingVariables.volume.repsPerSet} reps/set
                            </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Intensity</h4>
                            <div className="text-2xl font-bold text-green-400">
                                {trainingVariables.intensity.percentage}%
                            </div>
                            <div className="text-sm text-gray-400">of 1RM</div>
                            <div className="text-sm text-gray-300 mt-1">
                                {trainingVariables.intensity.relative} intensity
                            </div>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Frequency</h4>
                            <div className="text-2xl font-bold text-yellow-400">
                                {trainingVariables.frequency.sessionsPerWeek}
                            </div>
                            <div className="text-sm text-gray-400">sessions/week</div>
                            <div className="text-sm text-gray-300 mt-1">
                                {trainingVariables.frequency.daysOff} rest days
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Directed Adaptation Sequence */}
            {assessment?.adaptationSequence && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Directed Adaptation Sequence
                    </h3>

                    <div className="space-y-4">
                        {assessment.adaptationSequence.map((phase, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${phase.unlocked
                                        ? 'border-green-600 bg-green-900/20'
                                        : 'border-gray-600 bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    {phase.unlocked ? (
                                        <Unlock className="h-4 w-4 text-green-400" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-gray-500" />
                                    )}
                                    <span className="font-medium text-white">
                                        Phase {index + 1}: {phase.block}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        ({phase.duration})
                                    </span>
                                </div>

                                <p className="text-gray-300 mb-2">{phase.focus}</p>

                                {phase.spectrum && (
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Spectrum:</span>
                                            <span className="text-white ml-2 capitalize">{phase.spectrum}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Intensity:</span>
                                            <span className="text-white ml-2">{phase.intensity}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Volume:</span>
                                            <span className="text-white ml-2 capitalize">{phase.volume}</span>
                                        </div>
                                        {phase.exercises && (
                                            <div>
                                                <span className="text-gray-400">Exercises:</span>
                                                <span className="text-white ml-2">{phase.exercises}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {phase.prerequisite && (
                                    <div className="mt-2 text-sm text-yellow-300">
                                        📋 {phase.prerequisite}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <CheckCircle className="h-4 w-4" />
                    Save Specificity Assessment
                </button>
            </div>
        </div>
    );
};

export default SpecificityTab;
