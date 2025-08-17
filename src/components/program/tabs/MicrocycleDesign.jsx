import React, { useState } from 'react';
import { Calendar, RotateCcw, CheckCircle, TrendingUp, Activity, Zap } from 'lucide-react';

const MicrocycleDesign = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [microcycleTemplate, setMicrocycleTemplate] = useState({
        pattern: 'undulating',
        trainingDays: 4,
        loadingPattern: 'heavy_light_medium',
        weeklyStructure: [
            { day: 'Monday', type: 'heavy', focus: 'upper_strength', intensity: 85, volume: 'moderate' },
            { day: 'Tuesday', type: 'light', focus: 'lower_hypertrophy', intensity: 70, volume: 'high' },
            { day: 'Wednesday', type: 'rest', focus: 'recovery', intensity: 0, volume: 'none' },
            { day: 'Thursday', type: 'medium', focus: 'upper_hypertrophy', intensity: 75, volume: 'high' },
            { day: 'Friday', type: 'heavy', focus: 'lower_strength', intensity: 85, volume: 'moderate' },
            { day: 'Saturday', type: 'light', focus: 'conditioning', intensity: 60, volume: 'moderate' },
            { day: 'Sunday', type: 'rest', focus: 'recovery', intensity: 0, volume: 'none' }
        ]
    });

    const [loadingParameters, setLoadingParameters] = useState({
        strength: {
            intensity: { min: 80, max: 95 },
            volume: { sets: '3-5', reps: '1-6' },
            rest: '3-5 minutes'
        },
        hypertrophy: {
            intensity: { min: 65, max: 80 },
            volume: { sets: '3-6', reps: '6-12' },
            rest: '1-3 minutes'
        },
        power: {
            intensity: { min: 30, max: 60 },
            volume: { sets: '3-5', reps: '1-5' },
            rest: '2-5 minutes'
        },
        endurance: {
            intensity: { min: 50, max: 70 },
            volume: { sets: '2-4', reps: '12-20+' },
            rest: '30-90 seconds'
        }
    });

    const microcyclePatterns = [
        {
            pattern: 'linear',
            name: 'Linear Progression',
            description: 'Gradual increase in intensity throughout the week',
            example: 'Light → Medium → Heavy',
            bestFor: 'Beginners, simple progression'
        },
        {
            pattern: 'undulating',
            name: 'Undulating',
            description: 'Daily variation in intensity and volume',
            example: 'Heavy → Light → Medium → Heavy',
            bestFor: 'Intermediate to advanced, variety'
        },
        {
            pattern: 'block',
            name: 'Block Loading',
            description: 'Concentrated loading followed by deload',
            example: '3 weeks high → 1 week low',
            bestFor: 'Advanced athletes, overreaching'
        },
        {
            pattern: 'conjugate',
            name: 'Conjugate',
            description: 'Max effort and dynamic effort days',
            example: 'ME Upper → DE Lower → ME Lower → DE Upper',
            bestFor: 'Powerlifters, advanced athletes'
        },
        {
            pattern: 'bryant_cluster',
            name: 'Bryant Cluster',
            description: 'Cluster sets with 15s intra-set rest for metabolic stress',
            example: '3×(3×4) with 15s rest between mini-sets',
            bestFor: 'Hypertrophy, metabolic conditioning, intermediate to advanced'
        },
        {
            pattern: 'bryant_strongman',
            name: 'Bryant Strongman',
            description: 'Time/distance-based strongman events for tactical conditioning',
            example: '4 events × 150ft farmer\'s walk with 90s rest',
            bestFor: 'Tactical athletes, functional strength, advanced conditioning'
        }
    ];

    const setStructureOptions = {
        standard: {
            name: 'Standard Sets',
            description: 'Traditional straight sets with full rest',
            config: { type: 'standard', rest: '2-5min', structure: 'sets × reps' }
        },
        cluster: {
            name: 'Bryant Cluster Sets',
            description: 'Mini-sets with brief intra-set rest periods',
            config: {
                type: 'cluster',
                intraRest: 15,
                clustersPerSet: 3,
                repsRange: '3-5',
                structure: 'sets × (clusters × reps)',
                bryantCompliant: true,
                effectiveVolumeFormula: 'total_reps * (1 - (intraRest / 60))'
            }
        },
        strongman: {
            name: 'Bryant Strongman Events',
            description: 'Time/distance-based strongman training for tactical application',
            config: {
                type: 'strongman',
                timeBased: true,
                metrics: 'ft/s',
                integration: 'tactical',
                distance: 150,
                duration: 30,
                restBetweenEvents: 90,
                structure: 'events × distance/time',
                bryantCompliant: true,
                volumeFormula: 'estimated_reps * (load / bodyweight_factor) * events',
                tacticalApplication: true,
                effortRange: '30-60s',
                loadFactorRange: '1.2-1.8',
                hybridPhase: 'weeks_1_4',
                conflictResolution: 'rep_equivalent_conversion',
                sampleExercises: ['farmers_walk', 'tire_flip', 'atlas_stones', 'yoke_walk', 'sled_push']
            }
        },
        superset: {
            name: 'Supersets',
            description: 'Back-to-back exercises with no rest',
            config: { type: 'superset', rest: '0s between exercises, 2-3min between pairs' }
        },
        circuit: {
            name: 'Circuit Training',
            description: 'Multiple exercises performed consecutively',
            config: { type: 'circuit', rest: '30s-2min between rounds' }
        }
    };

    const loadingPatterns = [
        { value: 'heavy_light_medium', label: 'Heavy-Light-Medium', description: 'High intensity, recovery, moderate' },
        { value: 'light_medium_heavy', label: 'Light-Medium-Heavy', description: 'Progressive weekly increase' },
        { value: 'heavy_medium_light', label: 'Heavy-Medium-Light', description: 'Decreasing weekly intensity' },
        { value: 'undulating', label: 'Daily Undulating', description: 'Daily variation in load' }
    ];

    const trainingTypes = [
        { value: 'heavy', label: 'Heavy', color: 'bg-red-500', description: '80-95% 1RM, low volume' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: '70-85% 1RM, moderate volume' },
        { value: 'light', label: 'Light', color: 'bg-green-500', description: '50-70% 1RM, high volume' },
        { value: 'rest', label: 'Rest', color: 'bg-gray-500', description: 'Recovery day' }
    ];

    const trainingFocus = {
        upper_strength: 'Upper Body Strength',
        lower_strength: 'Lower Body Strength',
        upper_hypertrophy: 'Upper Body Hypertrophy',
        lower_hypertrophy: 'Lower Body Hypertrophy',
        full_body: 'Full Body',
        power: 'Power Development',
        conditioning: 'Conditioning',
        recovery: 'Recovery/Mobility'
    };

    const updateDaySettings = (dayIndex, field, value) => {
        setMicrocycleTemplate(prev => ({
            ...prev,
            weeklyStructure: prev.weeklyStructure.map((day, index) =>
                index === dayIndex ? { ...day, [field]: value } : day
            )
        }));
    };

    const updateLoadingParameter = (category, parameter, field, value) => {
        setLoadingParameters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [parameter]: field ? { ...prev[category][parameter], [field]: value } : value
            }
        }));
    };

    const getIntensityColor = (intensity) => {
        if (intensity >= 85) return 'text-red-400';
        if (intensity >= 70) return 'text-yellow-400';
        if (intensity >= 50) return 'text-green-400';
        return 'text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Microcycle Pattern Selection */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Microcycle Pattern</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {microcyclePatterns.map((pattern) => (
                        <div
                            key={pattern.pattern}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${microcycleTemplate.pattern === pattern.pattern
                                ? 'border-blue-500 bg-blue-900/30'
                                : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setMicrocycleTemplate(prev => ({ ...prev, pattern: pattern.pattern }))}
                        >
                            <h4 className="font-semibold text-white mb-2">{pattern.name}</h4>
                            <p className="text-sm text-gray-300 mb-2">{pattern.description}</p>
                            <div className="text-xs text-gray-400">
                                <p><strong>Example:</strong> {pattern.example}</p>
                                <p><strong>Best for:</strong> {pattern.bestFor}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Structure */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Weekly Training Structure</h3>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Loading Pattern</label>
                    <select
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={microcycleTemplate.loadingPattern}
                        onChange={(e) => setMicrocycleTemplate(prev => ({ ...prev, loadingPattern: e.target.value }))}
                    >
                        {loadingPatterns.map(pattern => (
                            <option key={pattern.value} value={pattern.value}>
                                {pattern.label} - {pattern.description}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    {microcycleTemplate.weeklyStructure.map((day, index) => (
                        <div key={day.day} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                                <div className="font-medium text-white">
                                    {day.day}
                                </div>

                                <div>
                                    <select
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={day.type}
                                        onChange={(e) => updateDaySettings(index, 'type', e.target.value)}
                                    >
                                        {trainingTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={day.focus}
                                        onChange={(e) => updateDaySettings(index, 'focus', e.target.value)}
                                    >
                                        {Object.entries(trainingFocus).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={day.intensity}
                                        onChange={(e) => updateDaySettings(index, 'intensity', parseInt(e.target.value))}
                                        disabled={day.type === 'rest'}
                                    />
                                    <div className="text-xs text-gray-400 mt-0.5">% 1RM</div>
                                </div>

                                <div>
                                    <select
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={day.volume}
                                        onChange={(e) => updateDaySettings(index, 'volume', e.target.value)}
                                        disabled={day.type === 'rest'}
                                    >
                                        <option value="none">None</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${trainingTypes.find(t => t.value === day.type)?.color || 'bg-gray-500'}`} />
                                    <span className={`text-sm font-medium ${getIntensityColor(day.intensity)}`}>
                                        {day.intensity}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Parameters */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Loading Parameters</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(loadingParameters).map(([category, params]) => (
                        <div key={category} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <h4 className="font-semibold text-white mb-3 capitalize">{category}</h4>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Intensity Range (% 1RM)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-20 px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                            value={params.intensity.min}
                                            onChange={(e) => updateLoadingParameter(category, 'intensity', 'min', parseInt(e.target.value))}
                                        />
                                        <span className="text-gray-300 self-center">-</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-20 px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                            value={params.intensity.max}
                                            onChange={(e) => updateLoadingParameter(category, 'intensity', 'max', parseInt(e.target.value))}
                                        />
                                        <span className="text-gray-400 text-sm self-center">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Sets</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={params.volume.sets}
                                        onChange={(e) => updateLoadingParameter(category, 'volume', 'sets', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Reps</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={params.volume.reps}
                                        onChange={(e) => updateLoadingParameter(category, 'volume', 'reps', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Rest Periods</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                        value={params.rest}
                                        onChange={(e) => updateLoadingParameter(category, 'rest', null, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Guidelines */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Programming Guidelines</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-blue-400 mb-2">Volume Guidelines</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Strength:</strong> 3-5 sets × 1-6 reps @ 80-95% 1RM</li>
                            <li>• <strong>Hypertrophy:</strong> 3-6 sets × 6-12 reps @ 65-80% 1RM</li>
                            <li>• <strong>Power:</strong> 3-5 sets × 1-5 reps @ 30-60% 1RM</li>
                            <li>• <strong>Endurance:</strong> 2-4 sets × 12-20+ reps @ 50-70% 1RM</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-yellow-400 mb-2">Recovery Guidelines</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Between Sets:</strong> Strength 3-5min, Hypertrophy 1-3min</li>
                            <li>• <strong>Between Sessions:</strong> 24-72h depending on intensity</li>
                            <li>• <strong>Deload Week:</strong> Every 3-6 weeks reduce volume by 40-60%</li>
                            <li>• <strong>Sleep:</strong> 7-9 hours for optimal recovery</li>
                        </ul>
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
                        Step 5 of 7: Design Microcycles
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Sessions & Monitoring
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MicrocycleDesign;

