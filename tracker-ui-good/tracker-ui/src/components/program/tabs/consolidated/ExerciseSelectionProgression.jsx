import React, { useState, useEffect } from 'react';
import {
    Target,
    TrendingUp,
    BarChart3,
    Settings,
    CheckCircle,
    RotateCcw,
    Activity,
    Zap,
    Users,
    Clock,
    AlertCircle
} from 'lucide-react';
import { useAssessment } from '../../../../hooks/useAssessment';

/**
 * ExerciseSelectionProgression.jsx - Consolidated Tab
 * 
 * Combines SpecificityTab + VariableManipulationTab functionality:
 * - Exercise Selection & Specificity Assessment
 * - Training Variable Manipulation (Volume, Intensity, Frequency)
 * - Movement Pattern Analysis
 * - Progressive Overload Planning
 */

const ExerciseSelectionProgression = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const { saveSpecificityAssessment } = useAssessment();

    // State for Exercise Selection (from SpecificityTab)
    const [exerciseSelection, setExerciseSelection] = useState({
        primaryMovements: [],
        accessoryExercises: [],
        modalityPreferences: [],
        equipmentAvailable: [],
        specificitySpectrum: 'balanced' // general, balanced, specific
    });

    // State for Variable Manipulation (from VariableManipulationTab)
    const [trainingVariables, setTrainingVariables] = useState({
        volume: {
            weeklyVolume: 16, // total weekly sets
            volumeDistribution: 'even', // even, ascending, descending
            deloadFrequency: 4 // weeks
        },
        intensity: {
            primaryIntensityZone: '70-85', // 60-70, 70-85, 85-95, 95+
            intensityVariation: 'moderate',
            autoregulation: true
        },
        frequency: {
            sessionsPerWeek: 4,
            movementFrequency: 2, // times per week per movement
            restDays: 2
        }
    });

    // Assessment results
    const [assessment, setAssessment] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState('exercise-selection');

    // Available exercise categories
    const exerciseCategories = [
        {
            category: 'Primary Movements',
            exercises: [
                { id: 'squat', name: 'Squat Variations', pattern: 'knee-dominant', specificity: 'high' },
                { id: 'deadlift', name: 'Deadlift Variations', pattern: 'hip-dominant', specificity: 'high' },
                { id: 'bench', name: 'Bench Press Variations', pattern: 'horizontal-push', specificity: 'high' },
                { id: 'row', name: 'Row Variations', pattern: 'horizontal-pull', specificity: 'high' },
                { id: 'press', name: 'Overhead Press', pattern: 'vertical-push', specificity: 'medium' },
                { id: 'pullup', name: 'Pull-up/Chin-up', pattern: 'vertical-pull', specificity: 'medium' }
            ]
        },
        {
            category: 'Accessory Movements',
            exercises: [
                { id: 'unilateral', name: 'Unilateral Work', pattern: 'single-limb', specificity: 'medium' },
                { id: 'core', name: 'Core Training', pattern: 'stabilization', specificity: 'low' },
                { id: 'mobility', name: 'Mobility Work', pattern: 'movement-prep', specificity: 'low' },
                { id: 'conditioning', name: 'Conditioning', pattern: 'energy-system', specificity: 'variable' }
            ]
        }
    ];

    // Training modalities
    const trainingModalities = [
        { id: 'powerlifting', name: 'Powerlifting', icon: Activity, compatibility: ['strength', 'competition'] },
        { id: 'bodybuilding', name: 'Bodybuilding', icon: Users, compatibility: ['hypertrophy', 'physique'] },
        { id: 'general', name: 'General Fitness', icon: Target, compatibility: ['health', 'balanced'] },
        { id: 'athletic', name: 'Athletic Performance', icon: Zap, compatibility: ['sport', 'power'] }
    ];

    // Volume-Intensity relationships
    const volumeIntensityProfiles = {
        'high-volume-low': {
            name: 'High Volume, Lower Intensity',
            description: 'More sets at 60-75% 1RM',
            weeklyVolume: 20,
            primaryIntensity: '60-75',
            bestFor: 'Hypertrophy, General Fitness'
        },
        'moderate-moderate': {
            name: 'Moderate Volume, Moderate Intensity',
            description: 'Balanced approach at 70-85% 1RM',
            weeklyVolume: 16,
            primaryIntensity: '70-85',
            bestFor: 'Strength, Balanced Development'
        },
        'low-volume-high': {
            name: 'Lower Volume, High Intensity',
            description: 'Fewer sets at 85%+ 1RM',
            weeklyVolume: 12,
            primaryIntensity: '85-95',
            bestFor: 'Strength, Powerlifting'
        }
    };

    // Effect calculations
    useEffect(() => {
        calculateExerciseAssessment();
    }, [exerciseSelection, trainingVariables]);

    const calculateExerciseAssessment = () => {
        // Simulate assessment calculation
        const totalExercises = exerciseSelection.primaryMovements.length + exerciseSelection.accessoryExercises.length;
        const specificityScore = calculateSpecificityScore();
        const volumeScore = calculateVolumeScore();

        setAssessment({
            totalExercises,
            specificityScore,
            volumeScore,
            recommendations: generateRecommendations(specificityScore, volumeScore),
            compatibilityWarnings: checkCompatibilityWarnings()
        });
    };

    const calculateSpecificityScore = () => {
        const primaryCount = exerciseSelection.primaryMovements.length;
        const accessoryCount = exerciseSelection.accessoryExercises.length;

        if (primaryCount >= 4 && accessoryCount >= 2) return 'Optimal';
        if (primaryCount >= 3 && accessoryCount >= 1) return 'Good';
        if (primaryCount >= 2) return 'Adequate';
        return 'Needs Improvement';
    };

    const calculateVolumeScore = () => {
        const { weeklyVolume } = trainingVariables.volume;
        const { sessionsPerWeek } = trainingVariables.frequency;

        const setsPerSession = weeklyVolume / sessionsPerWeek;

        if (setsPerSession >= 3 && setsPerSession <= 6 && weeklyVolume >= 12 && weeklyVolume <= 20) {
            return 'Optimal';
        } else if (weeklyVolume >= 10 && weeklyVolume <= 24) {
            return 'Good';
        } else {
            return 'Needs Adjustment';
        }
    };

    const generateRecommendations = (specificityScore, volumeScore) => {
        const recommendations = [];

        if (specificityScore === 'Needs Improvement') {
            recommendations.push('Add more primary movement patterns to your program');
        }

        if (volumeScore === 'Needs Adjustment') {
            recommendations.push('Adjust weekly volume to 12-20 sets for optimal results');
        }

        if (trainingVariables.frequency.sessionsPerWeek < 3) {
            recommendations.push('Consider increasing training frequency to at least 3 sessions per week');
        }

        return recommendations;
    };

    const checkCompatibilityWarnings = () => {
        const warnings = [];

        if (trainingVariables.volume.weeklyVolume > 20 && trainingVariables.intensity.primaryIntensityZone === '85-95') {
            warnings.push('High volume with high intensity may lead to overreaching');
        }

        if (trainingVariables.frequency.sessionsPerWeek > 5 && trainingVariables.frequency.restDays < 2) {
            warnings.push('Consider adding more rest days for recovery');
        }

        return warnings;
    };

    const handleExerciseToggle = (category, exerciseId) => {
        const categoryKey = category === 'Primary Movements' ? 'primaryMovements' : 'accessoryExercises';

        setExerciseSelection(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey].includes(exerciseId)
                ? prev[categoryKey].filter(id => id !== exerciseId)
                : [...prev[categoryKey], exerciseId]
        }));
    };

    const handleVariableChange = (category, variable, value) => {
        setTrainingVariables(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [variable]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            const saveData = {
                exerciseSelection,
                trainingVariables,
                assessment,
                completedAt: new Date().toISOString()
            };

            if (saveSpecificityAssessment) {
                const result = await saveSpecificityAssessment(saveData);
                if (result.success) {
                    console.log('Exercise selection and progression data saved');
                }
            }
        } catch (error) {
            console.error('Error saving exercise selection data:', error);
        }
    };

    const renderExerciseSelection = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    Exercise Selection & Specificity
                </h3>

                {exerciseCategories.map((category) => (
                    <div key={category.category} className="mb-6">
                        <h4 className="font-medium text-white mb-3">{category.category}</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {category.exercises.map((exercise) => {
                                const categoryKey = category.category === 'Primary Movements' ? 'primaryMovements' : 'accessoryExercises';
                                const isSelected = exerciseSelection[categoryKey].includes(exercise.id);

                                return (
                                    <button
                                        key={exercise.id}
                                        onClick={() => handleExerciseToggle(category.category, exercise.id)}
                                        className={`p-3 rounded-lg border-2 text-left transition-colors ${isSelected
                                                ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="font-medium">{exercise.name}</div>
                                        <div className="text-sm text-gray-400">{exercise.pattern}</div>
                                        <div className={`text-xs px-2 py-1 rounded mt-1 ${exercise.specificity === 'high' ? 'bg-red-900 text-red-300' :
                                                exercise.specificity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-green-900 text-green-300'
                                            }`}>
                                            {exercise.specificity} specificity
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Training Modality Selection */}
                <div className="mt-6">
                    <h4 className="font-medium text-white mb-3">Training Modality</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {trainingModalities.map((modality) => (
                            <button
                                key={modality.id}
                                onClick={() => setExerciseSelection(prev => ({
                                    ...prev,
                                    modalityPreferences: prev.modalityPreferences.includes(modality.id)
                                        ? prev.modalityPreferences.filter(id => id !== modality.id)
                                        : [...prev.modalityPreferences, modality.id]
                                }))}
                                className={`p-3 rounded-lg border-2 text-center transition-colors ${exerciseSelection.modalityPreferences.includes(modality.id)
                                        ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                                    }`}
                            >
                                <modality.icon className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium text-sm">{modality.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderVariableManipulation = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-400" />
                    Training Variable Manipulation
                </h3>

                {/* Volume Programming */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Volume Programming</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Weekly Volume (Total Sets)
                            </label>
                            <input
                                type="range"
                                min="8"
                                max="28"
                                step="2"
                                value={trainingVariables.volume.weeklyVolume}
                                onChange={(e) => handleVariableChange('volume', 'weeklyVolume', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-1">
                                <span>Low (8)</span>
                                <span className="font-medium text-white">{trainingVariables.volume.weeklyVolume}</span>
                                <span>High (28)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Volume Distribution
                            </label>
                            <select
                                value={trainingVariables.volume.volumeDistribution}
                                onChange={(e) => handleVariableChange('volume', 'volumeDistribution', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="even">Even Distribution</option>
                                <option value="ascending">Ascending (Volume Increase)</option>
                                <option value="descending">Descending (Volume Decrease)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deload Frequency (weeks)
                            </label>
                            <select
                                value={trainingVariables.volume.deloadFrequency}
                                onChange={(e) => handleVariableChange('volume', 'deloadFrequency', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={3}>Every 3 Weeks</option>
                                <option value={4}>Every 4 Weeks</option>
                                <option value={5}>Every 5 Weeks</option>
                                <option value={6}>Every 6 Weeks</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Intensity Programming */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Intensity Programming</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Primary Intensity Zone (% 1RM)
                            </label>
                            <select
                                value={trainingVariables.intensity.primaryIntensityZone}
                                onChange={(e) => handleVariableChange('intensity', 'primaryIntensityZone', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="60-70">60-70% (Hypertrophy Focus)</option>
                                <option value="70-85">70-85% (Strength Focus)</option>
                                <option value="85-95">85-95% (Max Strength)</option>
                                <option value="95+">95%+ (Peak/Test)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Intensity Variation
                            </label>
                            <select
                                value={trainingVariables.intensity.intensityVariation}
                                onChange={(e) => handleVariableChange('intensity', 'intensityVariation', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low Variation</option>
                                <option value="moderate">Moderate Variation</option>
                                <option value="high">High Variation</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={trainingVariables.intensity.autoregulation}
                                    onChange={(e) => handleVariableChange('intensity', 'autoregulation', e.target.checked)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-300">Enable RPE/RIR Autoregulation</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Frequency Programming */}
                <div>
                    <h4 className="font-medium text-white mb-3">Frequency Programming</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sessions per Week
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="7"
                                step="1"
                                value={trainingVariables.frequency.sessionsPerWeek}
                                onChange={(e) => handleVariableChange('frequency', 'sessionsPerWeek', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-1">
                                <span>2</span>
                                <span className="font-medium text-white">{trainingVariables.frequency.sessionsPerWeek}</span>
                                <span>7</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Movement Frequency
                            </label>
                            <select
                                value={trainingVariables.frequency.movementFrequency}
                                onChange={(e) => handleVariableChange('frequency', 'movementFrequency', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>1x per week</option>
                                <option value={2}>2x per week</option>
                                <option value={3}>3x per week</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rest Days per Week
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={trainingVariables.frequency.restDays}
                                onChange={(e) => handleVariableChange('frequency', 'restDays', parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Volume-Intensity Profiles */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="font-medium text-white mb-4">Recommended Training Profiles</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(volumeIntensityProfiles).map(([key, profile]) => (
                        <div key={key} className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-white mb-2">{profile.name}</h5>
                            <p className="text-sm text-gray-300 mb-3">{profile.description}</p>
                            <div className="text-xs text-gray-400 space-y-1">
                                <div>Volume: {profile.weeklyVolume} sets/week</div>
                                <div>Intensity: {profile.primaryIntensity}% 1RM</div>
                                <div>Best for: {profile.bestFor}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAssessmentSummary = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Program Assessment Summary
                </h3>

                {assessment && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white">{assessment.totalExercises}</div>
                            <div className="text-sm text-gray-400">Total Exercises</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                            <div className={`text-2xl font-bold ${assessment.specificityScore === 'Optimal' ? 'text-green-400' :
                                    assessment.specificityScore === 'Good' ? 'text-yellow-400' :
                                        'text-red-400'
                                }`}>
                                {assessment.specificityScore}
                            </div>
                            <div className="text-sm text-gray-400">Exercise Selection</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                            <div className={`text-2xl font-bold ${assessment.volumeScore === 'Optimal' ? 'text-green-400' :
                                    assessment.volumeScore === 'Good' ? 'text-yellow-400' :
                                        'text-red-400'
                                }`}>
                                {assessment.volumeScore}
                            </div>
                            <div className="text-sm text-gray-400">Volume Distribution</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white">{trainingVariables.frequency.sessionsPerWeek}</div>
                            <div className="text-sm text-gray-400">Sessions/Week</div>
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {assessment?.recommendations?.length > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-300 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                            {assessment.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-blue-200 flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Warnings */}
                {assessment?.compatibilityWarnings?.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-300 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Compatibility Warnings
                        </h4>
                        <ul className="space-y-1">
                            {assessment.compatibilityWarnings.map((warning, index) => (
                                <li key={index} className="text-sm text-yellow-200 flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">⚠</span>
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Exercise Selection & Progression</h2>
                    <p className="text-gray-400">Choose exercises and configure training variables for optimal progression</p>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                {[
                    { id: 'exercise-selection', label: 'Exercise Selection', icon: Target },
                    { id: 'variables', label: 'Training Variables', icon: Settings },
                    { id: 'summary', label: 'Assessment Summary', icon: BarChart3 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            {activeSubTab === 'exercise-selection' && renderExerciseSelection()}
            {activeSubTab === 'variables' && renderVariableManipulation()}
            {activeSubTab === 'summary' && renderAssessmentSummary()}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                    >
                        Save Progress
                    </button>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Volume & Recovery
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseSelectionProgression;
