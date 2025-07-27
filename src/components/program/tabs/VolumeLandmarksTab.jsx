import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const VolumeLandmarksTab = () => {
    const [landmarks, setLandmarks] = useState({
        maintenanceVolume: { sets: 8, frequency: 2 },
        minimalEffectiveVolume: { sets: 12, frequency: 2 },
        maximalAdaptiveVolume: { sets: 20, frequency: 3 },
        maximalRecoverableVolume: { sets: 28, frequency: 3 }
    });

    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('chest');

    const muscleGroups = [
        { id: 'chest', name: 'Chest', defaultMV: 8, defaultMEV: 12, defaultMAV: 20, defaultMRV: 28 },
        { id: 'back', name: 'Back', defaultMV: 10, defaultMEV: 14, defaultMAV: 22, defaultMRV: 30 },
        { id: 'shoulders', name: 'Shoulders', defaultMV: 6, defaultMEV: 10, defaultMAV: 18, defaultMRV: 26 },
        { id: 'arms', name: 'Arms', defaultMV: 6, defaultMEV: 8, defaultMAV: 16, defaultMRV: 24 },
        { id: 'legs', name: 'Legs', defaultMV: 8, defaultMEV: 12, defaultMAV: 20, defaultMRV: 28 },
        { id: 'calves', name: 'Calves', defaultMV: 6, defaultMEV: 8, defaultMAV: 16, defaultMRV: 22 }
    ];

    const updateLandmark = (landmark, field, value) => {
        setLandmarks(prev => ({
            ...prev,
            [landmark]: {
                ...prev[landmark],
                [field]: parseInt(value) || 0
            }
        }));
    };

    const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroup);

    const resetToDefaults = () => {
        if (selectedGroup) {
            setLandmarks({
                maintenanceVolume: { sets: selectedGroup.defaultMV, frequency: 2 },
                minimalEffectiveVolume: { sets: selectedGroup.defaultMEV, frequency: 2 },
                maximalAdaptiveVolume: { sets: selectedGroup.defaultMAV, frequency: 3 },
                maximalRecoverableVolume: { sets: selectedGroup.defaultMRV, frequency: 3 }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Volume Landmarks
                </h3>
                <p className="text-blue-300 text-sm">
                    Set muscle-specific volume landmarks for optimal programming and progression
                </p>
            </div>

            {/* Muscle Group Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Muscle Group Selection</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {muscleGroups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedMuscleGroup(group.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedMuscleGroup === group.id
                                    ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                                }`}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Volume Landmarks Configuration */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-white">
                        Volume Landmarks - {selectedGroup?.name}
                    </h4>
                    <button
                        onClick={resetToDefaults}
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                        Reset to Defaults
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Maintenance Volume (MV) */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h5 className="font-semibold text-white">Maintenance Volume (MV)</h5>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Minimum volume needed to maintain current muscle mass and strength
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Weekly Sets
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maintenanceVolume.sets}
                                    onChange={(e) => updateLandmark('maintenanceVolume', 'sets', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Frequency (days/week)
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maintenanceVolume.frequency}
                                    onChange={(e) => updateLandmark('maintenanceVolume', 'frequency', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="1" max="7"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Minimal Effective Volume (MEV) */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <h5 className="font-semibold text-white">Minimal Effective Volume (MEV)</h5>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Minimum volume needed to stimulate meaningful growth adaptations
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Weekly Sets
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.minimalEffectiveVolume.sets}
                                    onChange={(e) => updateLandmark('minimalEffectiveVolume', 'sets', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Frequency (days/week)
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.minimalEffectiveVolume.frequency}
                                    onChange={(e) => updateLandmark('minimalEffectiveVolume', 'frequency', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="1" max="7"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maximal Adaptive Volume (MAV) */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h5 className="font-semibold text-white">Maximal Adaptive Volume (MAV)</h5>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Volume that produces maximal growth without causing excessive fatigue
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Weekly Sets
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maximalAdaptiveVolume.sets}
                                    onChange={(e) => updateLandmark('maximalAdaptiveVolume', 'sets', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Frequency (days/week)
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maximalAdaptiveVolume.frequency}
                                    onChange={(e) => updateLandmark('maximalAdaptiveVolume', 'frequency', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="1" max="7"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maximal Recoverable Volume (MRV) */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <h5 className="font-semibold text-white">Maximal Recoverable Volume (MRV)</h5>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            Maximum volume that can be sustained without compromising recovery
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Weekly Sets
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maximalRecoverableVolume.sets}
                                    onChange={(e) => updateLandmark('maximalRecoverableVolume', 'sets', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Frequency (days/week)
                                </label>
                                <input
                                    type="number"
                                    value={landmarks.maximalRecoverableVolume.frequency}
                                    onChange={(e) => updateLandmark('maximalRecoverableVolume', 'frequency', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                                    min="1" max="7"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volume Progression Visualization */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Volume Progression Overview</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-green-400">MV</span>
                        <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(landmarks.maintenanceVolume.sets / landmarks.maximalRecoverableVolume.sets) * 100}%` }}
                            />
                        </div>
                        <span className="text-white">{landmarks.maintenanceVolume.sets} sets</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-yellow-400">MEV</span>
                        <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${(landmarks.minimalEffectiveVolume.sets / landmarks.maximalRecoverableVolume.sets) * 100}%` }}
                            />
                        </div>
                        <span className="text-white">{landmarks.minimalEffectiveVolume.sets} sets</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-blue-400">MAV</span>
                        <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(landmarks.maximalAdaptiveVolume.sets / landmarks.maximalRecoverableVolume.sets) * 100}%` }}
                            />
                        </div>
                        <span className="text-white">{landmarks.maximalAdaptiveVolume.sets} sets</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-red-400">MRV</span>
                        <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full w-full" />
                        </div>
                        <span className="text-white">{landmarks.maximalRecoverableVolume.sets} sets</span>
                    </div>
                </div>
            </div>

            {/* Programming Recommendations */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-yellow-400 font-semibold">Programming Recommendations</h4>
                </div>
                <div className="text-yellow-300 text-sm space-y-1">
                    <p>• Start training blocks at or near MEV to allow for progression</p>
                    <p>• Progress volume towards MAV throughout the mesocycle</p>
                    <p>• Use MRV as the upper limit - never exceed for extended periods</p>
                    <p>• Deload to MV levels during recovery weeks</p>
                    <p>• Individual variation is significant - adjust based on response</p>
                </div>
            </div>
        </div>
    );
};

export default VolumeLandmarksTab;
