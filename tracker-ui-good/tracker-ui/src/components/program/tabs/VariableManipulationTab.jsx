import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { useApp } from '../../../context';

const VariableManipulationTab = () => {
    const { assessOverload, calculateMRVByPhase, saveOverloadAssessment } = useAssessment();
    const { state } = useApp();

    const [overloadData, setOverloadData] = useState({
        volume: { sets: 12, reps: 8 },
        intensity: 75,
        frequency: 3,
        exerciseSelection: { specific: 80, nonSpecific: 20 },
        failureProximity: 3, // RIR
        baseline: {
            oneRM: 0,
            repMaxes: {}
        }
    });

    const [currentPhase, setCurrentPhase] = useState('hypertrophy');
    const [assessment, setAssessment] = useState(null);
    const [showMRVWarning, setShowMRVWarning] = useState(false);

    const gainerType = state?.assessment?.gainerType || { type: 'Fast Gainer' };

    useEffect(() => {
        if (overloadData.volume.sets && overloadData.intensity && overloadData.frequency) {
            const result = assessOverload(overloadData, gainerType, currentPhase);
            setAssessment(result);

            // Check if approaching or exceeding MRV
            const currentMRV = result.mrvByPhase[currentPhase]?.sets || 15;
            setShowMRVWarning(overloadData.volume.sets >= currentMRV * 0.9);
        }
    }, [overloadData, currentPhase, gainerType]);

    const handleVolumeChange = (field, value) => {
        setOverloadData(prev => ({
            ...prev,
            volume: { ...prev.volume, [field]: parseInt(value) }
        }));
    };

    const handleIntensityChange = (value) => {
        setOverloadData(prev => ({ ...prev, intensity: parseInt(value) }));
    };

    const handleFrequencyChange = (value) => {
        setOverloadData(prev => ({ ...prev, frequency: parseInt(value) }));
    };

    const handleExerciseRatioChange = (field, value) => {
        const numValue = parseInt(value);
        const otherField = field === 'specific' ? 'nonSpecific' : 'specific';
        const otherValue = 100 - numValue;

        setOverloadData(prev => ({
            ...prev,
            exerciseSelection: {
                [field]: numValue,
                [otherField]: otherValue
            }
        }));
    };

    const handleFailureProximityChange = (value) => {
        setOverloadData(prev => ({ ...prev, failureProximity: parseInt(value) }));
    };

    const handleSaveAssessment = async () => {
        if (assessment) {
            const result = await saveOverloadAssessment({
                ...overloadData,
                assessment,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                alert('Overload assessment saved successfully!');
            } else {
                alert('Error saving assessment: ' + result.error);
            }
        }
    };

    const getDisruptionColor = (level) => {
        switch (level) {
            case 'minimal': return 'bg-green-100 text-green-800 border-green-200';
            case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'excessive': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRIRDescription = (rir) => {
        if (rir <= 1) return 'Very close to failure - maximum stimulus, high fatigue';
        if (rir <= 3) return 'Close to failure - high stimulus, moderate fatigue';
        if (rir <= 5) return 'Moderate effort - good stimulus, manageable fatigue';
        return 'Conservative effort - lower stimulus, minimal fatigue';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">Variable Manipulation</h2>
                <p className="text-gray-300">
                    Optimize overload through systematic manipulation of training variables.
                    Monitor homeostatic disruption to stay within Maximum Recoverable Volume (MRV).
                </p>
            </div>

            {/* Phase Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    Training Phase
                </label>
                <select
                    value={currentPhase}
                    onChange={(e) => setCurrentPhase(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                >
                    <option value="hypertrophy">Hypertrophy (Highest MRV)</option>
                    <option value="strength">Strength (Moderate MRV)</option>
                    <option value="peaking">Peaking (Lowest MRV)</option>
                    <option value="activeRecovery">Active Recovery (Deload)</option>
                </select>
            </div>

            {/* Training Variables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Control */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Volume</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sets per Week: {overloadData.volume.sets}
                            </label>
                            <input
                                type="range"
                                min="6"
                                max="30"
                                value={overloadData.volume.sets}
                                onChange={(e) => handleVolumeChange('sets', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            {assessment?.mrvByPhase[currentPhase] && (
                                <div className="text-xs text-gray-400 mt-1">
                                    MRV for {currentPhase}: {assessment.mrvByPhase[currentPhase].sets} sets
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Reps per Set: {overloadData.volume.reps}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={overloadData.volume.reps}
                                onChange={(e) => handleVolumeChange('reps', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Intensity Control */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Intensity</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            % 1RM: {overloadData.intensity}%
                        </label>
                        <input
                            type="range"
                            min="40"
                            max="105"
                            value={overloadData.intensity}
                            onChange={(e) => handleIntensityChange(e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                            {overloadData.intensity >= 90 ? 'Very High Intensity' :
                                overloadData.intensity >= 80 ? 'High Intensity' :
                                    overloadData.intensity >= 70 ? 'Moderate Intensity' : 'Low Intensity'}
                        </div>
                    </div>
                </div>

                {/* Frequency Control */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Frequency</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sessions per Week: {overloadData.frequency}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={overloadData.frequency}
                            onChange={(e) => handleFrequencyChange(e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                            {overloadData.frequency >= 6 ? 'Very High Frequency' :
                                overloadData.frequency >= 4 ? 'High Frequency' :
                                    overloadData.frequency >= 3 ? 'Moderate Frequency' : 'Low Frequency'}
                        </div>
                    </div>
                </div>

                {/* Exercise Selection */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Exercise Selection</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Specific Training: {overloadData.exerciseSelection.specific}%
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                value={overloadData.exerciseSelection.specific}
                                onChange={(e) => handleExerciseRatioChange('specific', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                Non-specific: {overloadData.exerciseSelection.nonSpecific}%
                            </div>
                        </div>

                        {overloadData.exerciseSelection.specific < 80 && (
                            <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-3">
                                <div className="text-yellow-400 text-sm">
                                    ⚠️ Consider increasing specific training to 80%+ for better recovery allocation
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Failure Proximity */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Proximity to Failure</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reps in Reserve (RIR): {overloadData.failureProximity}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="8"
                        value={overloadData.failureProximity}
                        onChange={(e) => handleFailureProximityChange(e.target.value)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                        {getRIRDescription(overloadData.failureProximity)}
                    </div>
                </div>
            </div>

            {/* MRV Warning */}
            {showMRVWarning && assessment?.mrvByPhase[currentPhase] && (
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="text-red-400 mr-3">🚨</div>
                        <div>
                            <h4 className="text-red-400 font-semibold mb-2">Approaching MRV Limit</h4>
                            <p className="text-red-300 text-sm mb-2">
                                Current volume ({overloadData.volume.sets} sets) is approaching your Maximum Recoverable Volume
                                for {currentPhase} phase ({assessment.mrvByPhase[currentPhase].sets} sets).
                            </p>
                            <p className="text-red-300 text-sm">
                                Consider implementing deload protocols or reducing non-specific training volume.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Assessment Results */}
            {assessment && (
                <div className="space-y-4">
                    {/* Homeostatic Disruption */}
                    <div className={`rounded-lg p-4 border ${getDisruptionColor(assessment.disruptionLevel.level)}`}>
                        <h4 className="font-semibold mb-2">
                            Homeostatic Disruption: {assessment.disruptionLevel.level.toUpperCase()}
                        </h4>
                        <p className="text-sm mb-3">{assessment.disruptionLevel.description}</p>
                        <div className="text-xs">
                            <strong>Recovery Time:</strong> {assessment.disruptionLevel.recoveryTime}
                        </div>
                        <div className="text-xs mt-1">
                            <strong>Disruption Score:</strong> {assessment.disruptionLevel.score}/30
                        </div>
                    </div>

                    {/* Current Load Summary */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-3">Current Training Load</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Weekly Load:</span>
                                <span className="text-white ml-2">{assessment.currentLoad.weeklyLoad}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Sets/Session:</span>
                                <span className="text-white ml-2">{assessment.currentLoad.setsPerSession}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Sessions/Week:</span>
                                <span className="text-white ml-2">{assessment.currentLoad.sessionsPerWeek}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Relative Intensity:</span>
                                <span className="text-white ml-2">{assessment.currentLoad.relativeIntensity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Optimization Suggestions */}
                    {assessment.optimizations.length > 0 && (
                        <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                            <h4 className="text-blue-400 font-semibold mb-3">Optimization Opportunities</h4>
                            {assessment.optimizations.map((opt, index) => (
                                <div key={index} className="mb-3 last:mb-0">
                                    <div className="text-blue-300 font-medium text-sm">{opt.category}</div>
                                    <div className="text-blue-200 text-sm">{opt.solution}</div>
                                    <div className="text-blue-400 text-xs mt-1">{opt.example}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveAssessment}
                    disabled={!assessment}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Save Overload Assessment
                </button>
            </div>
        </div>
    );
};

export default VariableManipulationTab;
