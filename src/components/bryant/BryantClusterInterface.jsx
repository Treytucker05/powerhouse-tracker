/**
 * Bryant Cluster Sets Interface
 * Advanced UI for configuring and monitoring cluster set training
 * Integrates with Bryant Periodization methodology (Pages 101-129)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Clock, Target, BarChart3, Play, Pause, RotateCcw } from 'lucide-react';

const BryantClusterInterface = ({
    onClusterConfigUpdate,
    initialConfig = null,
    exerciseData = null,
    sessionActive = false
}) => {
    // Cluster configuration state
    const [clusterConfig, setClusterConfig] = useState({
        exerciseName: '',
        clusterType: 'strength', // strength, power, hypertrophy
        clustersPerSet: 3,
        repsPerCluster: 3,
        intraRestTime: 15, // seconds between mini-sets
        interSetRest: 180, // seconds between full sets
        targetSets: 4,
        loadPercentage: 85,
        totalVolume: 0,
        effectiveVolume: 0,
        bryantCompliant: true
    });

    const [activeCluster, setActiveCluster] = useState(null);
    const [timerState, setTimerState] = useState({
        isRunning: false,
        timeRemaining: 0,
        timerType: 'rest' // 'rest' or 'intra'
    });
    const [performanceData, setPerformanceData] = useState([]);
    const [validationStatus, setValidationStatus] = useState({
        isValid: true,
        warnings: [],
        errors: []
    });

    // Bryant cluster presets based on research
    const bryantPresets = {
        strength: {
            name: 'Strength Development',
            clustersPerSet: 3,
            repsPerCluster: 3,
            intraRestTime: 15,
            interSetRest: 180,
            loadPercentage: 85,
            description: 'Optimal for maximum strength development',
            researchNotes: 'Bryant methodology: 3x3 clusters @ 85-90% 1RM'
        },
        power: {
            name: 'Power Development',
            clustersPerSet: 4,
            repsPerCluster: 2,
            intraRestTime: 20,
            interSetRest: 240,
            loadPercentage: 70,
            description: 'Maximizes power output and velocity',
            researchNotes: 'Bryant methodology: 4x2 clusters @ 70-80% 1RM'
        },
        hypertrophy: {
            name: 'Hypertrophy Focus',
            clustersPerSet: 3,
            repsPerCluster: 5,
            intraRestTime: 10,
            interSetRest: 120,
            loadPercentage: 75,
            description: 'Volume-focused cluster approach',
            researchNotes: 'Bryant methodology: 3x5 clusters @ 75-80% 1RM'
        },
        tactical: {
            name: 'Tactical Application',
            clustersPerSet: 5,
            repsPerCluster: 3,
            intraRestTime: 15,
            interSetRest: 90,
            loadPercentage: 80,
            description: 'Operational readiness and endurance',
            researchNotes: 'Bryant methodology: Extended clusters for tactical demands'
        }
    };

    // Initialize configuration
    useEffect(() => {
        if (initialConfig) {
            setClusterConfig(prev => ({ ...prev, ...initialConfig }));
        }
    }, [initialConfig]);

    // Calculate volume metrics when config changes
    useEffect(() => {
        calculateVolumeMetrics();
        validateConfiguration();
    }, [clusterConfig.clustersPerSet, clusterConfig.repsPerCluster, clusterConfig.targetSets, clusterConfig.intraRestTime]);

    // Calculate total and effective volume
    const calculateVolumeMetrics = useCallback(() => {
        const totalReps = clusterConfig.clustersPerSet * clusterConfig.repsPerCluster * clusterConfig.targetSets;
        const fatigueReduction = clusterConfig.intraRestTime / 60; // Rest time impact
        const effectiveReps = Math.round(totalReps * (1 - (fatigueReduction * 0.1))); // 10% reduction per minute

        setClusterConfig(prev => ({
            ...prev,
            totalVolume: totalReps,
            effectiveVolume: effectiveReps
        }));
    }, [clusterConfig.clustersPerSet, clusterConfig.repsPerCluster, clusterConfig.targetSets, clusterConfig.intraRestTime]);

    // Validate Bryant compliance
    const validateConfiguration = useCallback(() => {
        const validation = { isValid: true, warnings: [], errors: [] };

        // Bryant methodology validation rules
        if (clusterConfig.intraRestTime < 10) {
            validation.warnings.push('Intra-set rest below 10s may not provide adequate recovery');
        }
        if (clusterConfig.intraRestTime > 30) {
            validation.warnings.push('Intra-set rest above 30s may reduce cluster set benefits');
        }
        if (clusterConfig.clustersPerSet < 2) {
            validation.errors.push('Minimum 2 clusters per set required for Bryant methodology');
            validation.isValid = false;
        }
        if (clusterConfig.clustersPerSet > 6) {
            validation.warnings.push('More than 6 clusters may lead to excessive fatigue');
        }
        if (clusterConfig.loadPercentage < 60 || clusterConfig.loadPercentage > 95) {
            validation.warnings.push('Load percentage outside optimal Bryant range (60-95%)');
        }

        setValidationStatus(validation);
    }, [clusterConfig]);

    // Apply Bryant preset
    const applyPreset = (presetKey) => {
        const preset = bryantPresets[presetKey];
        setClusterConfig(prev => ({
            ...prev,
            clusterType: presetKey,
            clustersPerSet: preset.clustersPerSet,
            repsPerCluster: preset.repsPerCluster,
            intraRestTime: preset.intraRestTime,
            interSetRest: preset.interSetRest,
            loadPercentage: preset.loadPercentage
        }));
    };

    // Timer management
    const startTimer = (duration, type = 'rest') => {
        setTimerState({
            isRunning: true,
            timeRemaining: duration,
            timerType: type
        });
    };

    const stopTimer = () => {
        setTimerState(prev => ({ ...prev, isRunning: false }));
    };

    const resetTimer = () => {
        setTimerState({
            isRunning: false,
            timeRemaining: 0,
            timerType: 'rest'
        });
    };

    // Timer countdown effect
    useEffect(() => {
        let interval;
        if (timerState.isRunning && timerState.timeRemaining > 0) {
            interval = setInterval(() => {
                setTimerState(prev => ({
                    ...prev,
                    timeRemaining: prev.timeRemaining - 1
                }));
            }, 1000);
        } else if (timerState.timeRemaining === 0) {
            setTimerState(prev => ({ ...prev, isRunning: false }));
            // Timer completed - could trigger notification
        }
        return () => clearInterval(interval);
    }, [timerState.isRunning, timerState.timeRemaining]);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle configuration updates
    const updateConfig = (field, value) => {
        setClusterConfig(prev => {
            const updated = { ...prev, [field]: value };
            if (onClusterConfigUpdate) {
                onClusterConfigUpdate(updated);
            }
            return updated;
        });
    };

    return (
        <div className="bryant-cluster-interface bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-400" />
                        Bryant Cluster Sets
                    </h2>
                    <p className="text-gray-400 text-sm">Advanced cluster training configuration</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-semibold text-white">
                        {clusterConfig.totalVolume} Total Reps
                    </div>
                    <div className="text-sm text-gray-400">
                        {clusterConfig.effectiveVolume} Effective Volume
                    </div>
                </div>
            </div>

            {/* Validation Status */}
            {!validationStatus.isValid && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Configuration Issues
                    </div>
                    {validationStatus.errors.map((error, index) => (
                        <p key={index} className="text-red-300 text-sm mt-1">• {error}</p>
                    ))}
                </div>
            )}

            {/* Warnings */}
            {validationStatus.warnings.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-400 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Recommendations
                    </div>
                    {validationStatus.warnings.map((warning, index) => (
                        <p key={index} className="text-yellow-300 text-sm mt-1">• {warning}</p>
                    ))}
                </div>
            )}

            {/* Bryant Presets */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Bryant Methodology Presets</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(bryantPresets).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`p-3 rounded-lg border transition-colors ${clusterConfig.clusterType === key
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <div className="font-medium text-sm">{preset.name}</div>
                            <div className="text-xs opacity-75 mt-1">
                                {preset.clustersPerSet}×{preset.repsPerCluster} @ {preset.loadPercentage}%
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Exercise Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Exercise</label>
                    <input
                        type="text"
                        value={clusterConfig.exerciseName}
                        onChange={(e) => updateConfig('exerciseName', e.target.value)}
                        placeholder="Enter exercise name"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Clusters per Set */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Clusters per Set</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="2"
                            max="6"
                            value={clusterConfig.clustersPerSet}
                            onChange={(e) => updateConfig('clustersPerSet', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-8 text-center">
                            {clusterConfig.clustersPerSet}
                        </span>
                    </div>
                </div>

                {/* Reps per Cluster */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Reps per Cluster</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={clusterConfig.repsPerCluster}
                            onChange={(e) => updateConfig('repsPerCluster', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-8 text-center">
                            {clusterConfig.repsPerCluster}
                        </span>
                    </div>
                </div>

                {/* Intra-Set Rest */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Intra-Set Rest (seconds)</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="5"
                            max="45"
                            step="5"
                            value={clusterConfig.intraRestTime}
                            onChange={(e) => updateConfig('intraRestTime', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {clusterConfig.intraRestTime}s
                        </span>
                    </div>
                </div>

                {/* Inter-Set Rest */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Inter-Set Rest (seconds)</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="60"
                            max="300"
                            step="30"
                            value={clusterConfig.interSetRest}
                            onChange={(e) => updateConfig('interSetRest', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {formatTime(clusterConfig.interSetRest)}
                        </span>
                    </div>
                </div>

                {/* Load Percentage */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Load Percentage</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="60"
                            max="95"
                            value={clusterConfig.loadPercentage}
                            onChange={(e) => updateConfig('loadPercentage', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {clusterConfig.loadPercentage}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Session Timer */}
            {sessionActive && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-blue-400" />
                            <div>
                                <div className="text-white font-medium">
                                    {timerState.timerType === 'intra' ? 'Intra-Set Rest' : 'Inter-Set Rest'}
                                </div>
                                <div className="text-2xl font-mono text-blue-400">
                                    {formatTime(timerState.timeRemaining)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => startTimer(clusterConfig.intraRestTime, 'intra')}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Intra
                            </button>
                            <button
                                onClick={() => startTimer(clusterConfig.interSetRest, 'rest')}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Inter
                            </button>
                            <button
                                onClick={stopTimer}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Pause className="h-4 w-4" />
                            </button>
                            <button
                                onClick={resetTimer}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Volume Analysis */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Volume Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {clusterConfig.clustersPerSet}×{clusterConfig.repsPerCluster}
                        </div>
                        <div className="text-sm text-gray-400">Cluster Structure</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{clusterConfig.targetSets}</div>
                        <div className="text-sm text-gray-400">Total Sets</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{clusterConfig.totalVolume}</div>
                        <div className="text-sm text-gray-400">Total Reps</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{clusterConfig.effectiveVolume}</div>
                        <div className="text-sm text-gray-400">Effective Volume</div>
                    </div>
                </div>
            </div>

            {/* Research Notes */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Bryant Methodology Notes</h4>
                <p className="text-blue-300 text-sm">
                    {bryantPresets[clusterConfig.clusterType]?.researchNotes ||
                        "Cluster sets allow for higher training loads by providing brief rest periods between mini-sets, maintaining power output while accumulating volume."}
                </p>
            </div>
        </div>
    );
};

export default BryantClusterInterface;
