import React, { useState } from 'react';
import { TrendingUp, Clock, Target, RotateCcw, CheckCircle, Activity, Battery } from 'lucide-react';

const PhaseDesign = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [phaseStructure, setPhaseStructure] = useState({
        preparatoryPhase: {
            duration: 16,
            generalPrep: {
                duration: 8,
                focus: 'base_building',
                volume: 'high',
                intensity: 'low'
            },
            specificPrep: {
                duration: 8,
                focus: 'specific_adaptations',
                volume: 'moderate',
                intensity: 'moderate'
            }
        },
        competitivePhase: {
            duration: 8,
            focus: 'peaking',
            volume: 'low',
            intensity: 'high'
        },
        transitionPhase: {
            duration: 4,
            focus: 'recovery',
            volume: 'very_low',
            intensity: 'very_low'
        }
    });

    const phaseTypes = {
        preparatory: {
            name: 'Preparatory Phase',
            icon: TrendingUp,
            description: 'Build foundation and develop general fitness qualities',
            characteristics: [
                'High training volume',
                'Lower intensity',
                'General fitness development',
                'Broad exercise selection',
                'Base building focus'
            ],
            subphases: ['General Preparation', 'Specific Preparation']
        },
        competitive: {
            name: 'Competitive Phase',
            icon: Target,
            description: 'Peak performance and competition preparation',
            characteristics: [
                'Lower training volume',
                'High intensity',
                'Sport-specific training',
                'Skill refinement',
                'Peak performance focus'
            ],
            subphases: ['Pre-competition', 'Competition']
        },
        transition: {
            name: 'Transition Phase',
            icon: Battery,
            description: 'Recovery and regeneration period',
            characteristics: [
                'Very low volume',
                'Very low intensity',
                'Active recovery',
                'Alternative activities',
                'Mental/physical restoration'
            ],
            subphases: ['Active Rest', 'General Activities']
        }
    };

    const focusOptions = {
        base_building: 'Base Building',
        strength_endurance: 'Strength Endurance',
        hypertrophy: 'Hypertrophy',
        max_strength: 'Maximal Strength',
        power: 'Power Development',
        specific_adaptations: 'Specific Adaptations',
        peaking: 'Peaking/Competition',
        recovery: 'Recovery & Regeneration'
    };

    const volumeIntensityOptions = {
        very_low: { label: 'Very Low', color: 'bg-green-100 text-green-800' },
        low: { label: 'Low', color: 'bg-blue-100 text-blue-800' },
        moderate: { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
        high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
        very_high: { label: 'Very High', color: 'bg-red-100 text-red-800' }
    };

    const updatePhase = (phase, subphase, field, value) => {
        setPhaseStructure(prev => ({
            ...prev,
            [phase]: subphase ? {
                ...prev[phase],
                [subphase]: {
                    ...prev[phase][subphase],
                    [field]: value
                }
            } : {
                ...prev[phase],
                [field]: value
            }
        }));
    };

    const getTotalDuration = () => {
        return phaseStructure.preparatoryPhase.duration +
            phaseStructure.competitivePhase.duration +
            phaseStructure.transitionPhase.duration;
    };

    const getPhasePercentage = (phaseDuration) => {
        return ((phaseDuration / getTotalDuration()) * 100).toFixed(1);
    };

    return (
        <div className="space-y-6">
            {/* Phase Overview */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Phase Structure Overview</h3>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Total Macrocycle Duration</span>
                        <span className="text-sm text-white">{getTotalDuration()} weeks</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-4 flex overflow-hidden">
                        <div
                            className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                            style={{ width: `${getPhasePercentage(phaseStructure.preparatoryPhase.duration)}%` }}
                        >
                            Prep
                        </div>
                        <div
                            className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                            style={{ width: `${getPhasePercentage(phaseStructure.competitivePhase.duration)}%` }}
                        >
                            Comp
                        </div>
                        <div
                            className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                            style={{ width: `${getPhasePercentage(phaseStructure.transitionPhase.duration)}%` }}
                        >
                            Trans
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(phaseTypes).map(([key, phase]) => {
                        const PhaseIcon = phase.icon;
                        const duration = key === 'preparatory' ? phaseStructure.preparatoryPhase.duration :
                            key === 'competitive' ? phaseStructure.competitivePhase.duration :
                                phaseStructure.transitionPhase.duration;

                        return (
                            <div key={key} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <PhaseIcon className="h-5 w-5 text-blue-400" />
                                    <h4 className="font-semibold text-white">{phase.name}</h4>
                                </div>
                                <p className="text-sm text-gray-300 mb-3">{phase.description}</p>
                                <div className="text-xs text-gray-400">
                                    <p><strong>Duration:</strong> {duration} weeks ({getPhasePercentage(duration)}%)</p>
                                    <p><strong>Subphases:</strong> {phase.subphases.join(', ')}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Preparatory Phase */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Preparatory Phase</h3>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Duration (weeks)</label>
                    <input
                        type="number"
                        min="4"
                        max="32"
                        className="w-32 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={phaseStructure.preparatoryPhase.duration}
                        onChange={(e) => updatePhase('preparatoryPhase', null, 'duration', parseInt(e.target.value))}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* General Preparation */}
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">General Preparation</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (weeks)</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="16"
                                    className="w-24 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={phaseStructure.preparatoryPhase.generalPrep.duration}
                                    onChange={(e) => updatePhase('preparatoryPhase', 'generalPrep', 'duration', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Primary Focus</label>
                                <select
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={phaseStructure.preparatoryPhase.generalPrep.focus}
                                    onChange={(e) => updatePhase('preparatoryPhase', 'generalPrep', 'focus', e.target.value)}
                                >
                                    {Object.entries(focusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Volume</label>
                                    <select
                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={phaseStructure.preparatoryPhase.generalPrep.volume}
                                        onChange={(e) => updatePhase('preparatoryPhase', 'generalPrep', 'volume', e.target.value)}
                                    >
                                        {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                            <option key={value} value={value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Intensity</label>
                                    <select
                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={phaseStructure.preparatoryPhase.generalPrep.intensity}
                                        onChange={(e) => updatePhase('preparatoryPhase', 'generalPrep', 'intensity', e.target.value)}
                                    >
                                        {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                            <option key={value} value={value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specific Preparation */}
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Specific Preparation</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (weeks)</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="16"
                                    className="w-24 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={phaseStructure.preparatoryPhase.specificPrep.duration}
                                    onChange={(e) => updatePhase('preparatoryPhase', 'specificPrep', 'duration', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Primary Focus</label>
                                <select
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={phaseStructure.preparatoryPhase.specificPrep.focus}
                                    onChange={(e) => updatePhase('preparatoryPhase', 'specificPrep', 'focus', e.target.value)}
                                >
                                    {Object.entries(focusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Volume</label>
                                    <select
                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={phaseStructure.preparatoryPhase.specificPrep.volume}
                                        onChange={(e) => updatePhase('preparatoryPhase', 'specificPrep', 'volume', e.target.value)}
                                    >
                                        {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                            <option key={value} value={value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Intensity</label>
                                    <select
                                        className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={phaseStructure.preparatoryPhase.specificPrep.intensity}
                                        onChange={(e) => updatePhase('preparatoryPhase', 'specificPrep', 'intensity', e.target.value)}
                                    >
                                        {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                            <option key={value} value={value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Competitive Phase */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Competitive Phase</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
                        <input
                            type="number"
                            min="2"
                            max="16"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.competitivePhase.duration}
                            onChange={(e) => updatePhase('competitivePhase', null, 'duration', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Focus</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.competitivePhase.focus}
                            onChange={(e) => updatePhase('competitivePhase', null, 'focus', e.target.value)}
                        >
                            {Object.entries(focusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Volume</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.competitivePhase.volume}
                            onChange={(e) => updatePhase('competitivePhase', null, 'volume', e.target.value)}
                        >
                            {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                <option key={value} value={value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Intensity</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.competitivePhase.intensity}
                            onChange={(e) => updatePhase('competitivePhase', null, 'intensity', e.target.value)}
                        >
                            {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                <option key={value} value={value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Transition Phase */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Battery className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Transition Phase</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
                        <input
                            type="number"
                            min="2"
                            max="8"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.transitionPhase.duration}
                            onChange={(e) => updatePhase('transitionPhase', null, 'duration', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Focus</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.transitionPhase.focus}
                            onChange={(e) => updatePhase('transitionPhase', null, 'focus', e.target.value)}
                        >
                            {Object.entries(focusOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Volume</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.transitionPhase.volume}
                            onChange={(e) => updatePhase('transitionPhase', null, 'volume', e.target.value)}
                        >
                            {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                <option key={value} value={value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Intensity</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={phaseStructure.transitionPhase.intensity}
                            onChange={(e) => updatePhase('transitionPhase', null, 'intensity', e.target.value)}
                        >
                            {Object.entries(volumeIntensityOptions).map(([value, option]) => (
                                <option key={value} value={value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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
                    <div className="text-sm text-gray-400">
                        Step 3 of 7: Divide into Phases
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Mesocycle Planning
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhaseDesign;
