import React, { useState } from 'react';
import { Settings, TrendingUp, BarChart3, Target, AlertCircle } from 'lucide-react';

const LoadingParameters = ({ assessmentData, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [loadingConfig, setLoadingConfig] = useState({
        intensityZones: {
            recovery: { min: 50, max: 65, rpe: '4-5', purpose: 'Active recovery, technique work' },
            aerobic: { min: 65, max: 75, rpe: '5-6', purpose: 'Base building, fat oxidation' },
            tempo: { min: 75, max: 85, rpe: '6-7', purpose: 'Lactate threshold, work capacity' },
            threshold: { min: 85, max: 95, rpe: '7-8', purpose: 'VO2 max, anaerobic power' },
            maximal: { min: 95, max: 100, rpe: '9-10', purpose: 'Peak power, neuromuscular' }
        },
        strengthParameters: {
            hypertrophy: { intensity: '65-85', reps: '6-15', sets: '3-5', rest: '1-3 min' },
            strength: { intensity: '85-95', reps: '1-5', sets: '3-6', rest: '3-5 min' },
            power: { intensity: '30-85', reps: '1-6', sets: '3-6', rest: '2-5 min' },
            endurance: { intensity: '40-70', reps: '12+', sets: '2-4', rest: '30-90 sec' }
        },
        progressionModel: 'linear',
        autoregulation: false,
        rpeTargets: {
            week1: 7,
            week2: 8,
            week3: 9,
            week4: 6
        }
    });

    const [customParameters, setCustomParameters] = useState({
        name: '',
        intensity: '',
        reps: '',
        sets: '',
        rest: '',
        purpose: ''
    });

    const progressionModels = [
        { id: 'linear', name: 'Linear Progression', description: 'Gradual increase in intensity over time' },
        { id: 'undulating', name: 'Daily Undulating', description: 'Vary intensity daily within training blocks' },
        { id: 'block', name: 'Block Periodization', description: 'Concentrated training blocks' },
        { id: 'conjugate', name: 'Conjugate Method', description: 'Train multiple qualities simultaneously' }
    ];

    const updateIntensityZone = (zone, parameter, value) => {
        setLoadingConfig(prev => ({
            ...prev,
            intensityZones: {
                ...prev.intensityZones,
                [zone]: {
                    ...prev.intensityZones[zone],
                    [parameter]: value
                }
            }
        }));
    };

    const updateStrengthParameter = (type, parameter, value) => {
        setLoadingConfig(prev => ({
            ...prev,
            strengthParameters: {
                ...prev.strengthParameters,
                [type]: {
                    ...prev.strengthParameters[type],
                    [parameter]: value
                }
            }
        }));
    };

    const addCustomParameter = () => {
        if (!customParameters.name) return;

        const newParameters = {
            ...loadingConfig.strengthParameters,
            [customParameters.name.toLowerCase().replace(/\s+/g, '_')]: {
                intensity: customParameters.intensity,
                reps: customParameters.reps,
                sets: customParameters.sets,
                rest: customParameters.rest,
                purpose: customParameters.purpose
            }
        };

        setLoadingConfig(prev => ({
            ...prev,
            strengthParameters: newParameters
        }));

        setCustomParameters({
            name: '',
            intensity: '',
            reps: '',
            sets: '',
            rest: '',
            purpose: ''
        });
    };

    const updateRPETarget = (week, value) => {
        setLoadingConfig(prev => ({
            ...prev,
            rpeTargets: {
                ...prev.rpeTargets,
                [week]: parseInt(value)
            }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Loading Parameters & Training Zones
                </h3>
                <p className="text-blue-300 text-sm">
                    Define intensity zones, rep ranges, and progression models for your training program.
                </p>
            </div>

            {/* Progression Model Selection */}
            <div className="space-y-4">
                <h4 className="text-white font-medium">Progression Model</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progressionModels.map((model) => (
                        <div
                            key={model.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${loadingConfig.progressionModel === model.id
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onClick={() => setLoadingConfig(prev => ({ ...prev, progressionModel: model.id }))}
                        >
                            <div className="text-white font-medium">{model.name}</div>
                            <div className="text-gray-400 text-sm mt-1">{model.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Intensity Zones */}
            <div className="space-y-4">
                <h4 className="text-white font-medium">Training Intensity Zones</h4>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600 rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-white text-sm font-medium">Zone</th>
                                <th className="px-4 py-2 text-left text-white text-sm font-medium">Intensity %</th>
                                <th className="px-4 py-2 text-left text-white text-sm font-medium">RPE</th>
                                <th className="px-4 py-2 text-left text-white text-sm font-medium">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(loadingConfig.intensityZones).map(([zone, params]) => (
                                <tr key={zone} className="border-t border-gray-600">
                                    <td className="px-4 py-2 text-white font-medium capitalize">{zone}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                value={params.min}
                                                onChange={(e) => updateIntensityZone(zone, 'min', parseInt(e.target.value))}
                                                className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                                min="0"
                                                max="100"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="number"
                                                value={params.max}
                                                onChange={(e) => updateIntensityZone(zone, 'max', parseInt(e.target.value))}
                                                className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-gray-300">{params.rpe}</td>
                                    <td className="px-4 py-2 text-gray-400 text-sm">{params.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strength Training Parameters */}
            <div className="space-y-4">
                <h4 className="text-white font-medium">Strength Training Parameters</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(loadingConfig.strengthParameters).map(([type, params]) => (
                        <div key={type} className="bg-gray-700 rounded-lg p-4">
                            <h5 className="text-white font-medium capitalize mb-3">{type}</h5>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Intensity (%1RM)</label>
                                    <input
                                        type="text"
                                        value={params.intensity}
                                        onChange={(e) => updateStrengthParameter(type, 'intensity', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                        placeholder="e.g., 65-85"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Reps</label>
                                        <input
                                            type="text"
                                            value={params.reps}
                                            onChange={(e) => updateStrengthParameter(type, 'reps', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                            placeholder="e.g., 6-15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Sets</label>
                                        <input
                                            type="text"
                                            value={params.sets}
                                            onChange={(e) => updateStrengthParameter(type, 'sets', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                            placeholder="e.g., 3-5"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Rest Period</label>
                                    <input
                                        type="text"
                                        value={params.rest}
                                        onChange={(e) => updateStrengthParameter(type, 'rest', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                        placeholder="e.g., 1-3 min"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Parameter Creation */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Add Custom Training Parameter</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            value={customParameters.name}
                            onChange={(e) => setCustomParameters(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Parameter name"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={customParameters.intensity}
                            onChange={(e) => setCustomParameters(prev => ({ ...prev, intensity: e.target.value }))}
                            placeholder="Intensity range"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={customParameters.reps}
                            onChange={(e) => setCustomParameters(prev => ({ ...prev, reps: e.target.value }))}
                            placeholder="Rep range"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={customParameters.sets}
                            onChange={(e) => setCustomParameters(prev => ({ ...prev, sets: e.target.value }))}
                            placeholder="Set range"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={customParameters.rest}
                            onChange={(e) => setCustomParameters(prev => ({ ...prev, rest: e.target.value }))}
                            placeholder="Rest period"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <button
                            onClick={addCustomParameter}
                            disabled={!customParameters.name}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                        >
                            Add Parameter
                        </button>
                    </div>
                </div>
            </div>

            {/* RPE Progression */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">RPE Progression</h4>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={loadingConfig.autoregulation}
                            onChange={(e) => setLoadingConfig(prev => ({ ...prev, autoregulation: e.target.checked }))}
                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-300 text-sm">Enable Autoregulation</span>
                    </label>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(loadingConfig.rpeTargets).map(([week, rpe]) => (
                        <div key={week} className="bg-gray-700 rounded-lg p-3">
                            <div className="text-center">
                                <div className="text-gray-400 text-sm mb-2 capitalize">{week}</div>
                                <select
                                    value={rpe}
                                    onChange={(e) => updateRPETarget(week, e.target.value)}
                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                >
                                    {[5, 6, 7, 8, 9, 10].map(rpeValue => (
                                        <option key={rpeValue} value={rpeValue}>
                                            RPE {rpeValue}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Loading Parameters Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-gray-400">Progression Model</div>
                        <div className="text-white font-medium capitalize">{loadingConfig.progressionModel}</div>
                    </div>
                    <div>
                        <div className="text-gray-400">Training Parameters</div>
                        <div className="text-white font-medium">
                            {Object.keys(loadingConfig.strengthParameters).length} configured
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-400">Autoregulation</div>
                        <div className="text-white font-medium">
                            {loadingConfig.autoregulation ? 'Enabled' : 'Disabled'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    Previous: Block Sequencing
                </button>
                <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next: Training Methods
                    <Target className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default LoadingParameters;
