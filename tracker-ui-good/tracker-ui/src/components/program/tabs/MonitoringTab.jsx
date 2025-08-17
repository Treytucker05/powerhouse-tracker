import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { useApp } from '../../../context';

const MonitoringTab = () => {
    const { assessFatigue, saveFatigueAssessment } = useAssessment();
    const { state } = useApp();

    const [fatigueData, setFatigueData] = useState({
        fuel: {
            glycogenStores: 5,
            muscleFullness: 5,
            energyLevels: 5,
            postWorkoutFatigue: 5
        },
        nervous: {
            forceOutput: 5,
            techniqueQuality: 5,
            motivation: 5,
            learningRate: 5,
            sleepQuality: 5
        },
        messengers: {
            moodSwings: 5,
            inflammation: 5,
            hormoneSymptoms: 5,
            recoveryRate: 5,
            soreness: 5
        },
        tissues: {
            jointPain: 5,
            muscleTightness: 5,
            tendonIssues: 5,
            overuseSymptoms: 5,
            injuryHistory: 0
        }
    });

    const [lifestyle, setLifestyle] = useState({
        sleep: 7,
        stress: 5,
        nutrition: 5,
        hydration: 5
    });

    const [assessment, setAssessment] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    // Mock training load - in real app this would come from context
    const trainingLoad = {
        weeklyLoad: 800,
        relativeIntensity: 'High',
        sessionsPerWeek: 4
    };

    useEffect(() => {
        const result = assessFatigue(fatigueData, trainingLoad, lifestyle);
        setAssessment(result);

        // Show alert for concerning fatigue states
        setShowAlert(
            result.overallState.state === 'overtraining' ||
            result.overallState.state === 'non_functional_overreaching'
        );
    }, [fatigueData, lifestyle]);

    const handleFatigueChange = (category, field, value) => {
        setFatigueData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: parseInt(value)
            }
        }));
    };

    const handleLifestyleChange = (field, value) => {
        setLifestyle(prev => ({
            ...prev,
            [field]: parseInt(value)
        }));
    };

    const handleSaveAssessment = async () => {
        if (assessment) {
            const result = await saveFatigueAssessment({
                ...fatigueData,
                lifestyle,
                assessment,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                alert('Fatigue assessment saved successfully!');
            } else {
                alert('Error saving assessment: ' + result.error);
            }
        }
    };

    const getFatigueColor = (level) => {
        switch (level) {
            case 'minimal': return 'bg-green-100 text-green-800 border-green-200';
            case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'severe': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStateColor = (state) => {
        switch (state) {
            case 'normal': return 'bg-green-900/50 border-green-600 text-green-400';
            case 'functional_overreaching': return 'bg-blue-900/50 border-blue-600 text-blue-400';
            case 'non_functional_overreaching': return 'bg-yellow-900/50 border-yellow-600 text-yellow-400';
            case 'overtraining': return 'bg-red-900/50 border-red-600 text-red-400';
            default: return 'bg-gray-900/50 border-gray-600 text-gray-400';
        }
    };

    const getScaleLabel = (value, isReverse = false) => {
        const labels = isReverse
            ? ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Very Poor', 'Terrible', 'Critical', 'Severe', 'Emergency']
            : ['Emergency', 'Severe', 'Critical', 'Terrible', 'Very Poor', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        return labels[value - 1] || 'Unknown';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">Fatigue Monitoring</h2>
                <p className="text-gray-300">
                    Track fatigue across four contributor categories: Fuel Stores, Nervous System,
                    Chemical Messengers, and Tissue Structure. Monitor for overreaching and overtraining.
                </p>
            </div>

            {/* Critical Alert */}
            {showAlert && assessment && (
                <div className={`rounded-lg p-4 border ${getStateColor(assessment.overallState.state)}`}>
                    <div className="flex items-start">
                        <div className="text-2xl mr-3">
                            {assessment.overallState.state === 'overtraining' ? '🚨' : '⚠️'}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                {assessment.overallState.state === 'overtraining' ? 'OVERTRAINING DETECTED' : 'OVERREACHING DETECTED'}
                            </h4>
                            <p className="text-sm mb-2">{assessment.overallState.description}</p>
                            <p className="text-sm font-medium">Action Required: {assessment.overallState.action}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fatigue Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fuel Stores */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        ⛽ Fuel Stores
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">
                            Recovery: Hours-Days
                        </span>
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Glycogen Stores: {getScaleLabel(fatigueData.fuel.glycogenStores)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.fuel.glycogenStores}
                                onChange={(e) => handleFatigueChange('fuel', 'glycogenStores', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                1 = Completely depleted, 10 = Fully loaded
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Muscle Fullness: {getScaleLabel(fatigueData.fuel.muscleFullness)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.fuel.muscleFullness}
                                onChange={(e) => handleFatigueChange('fuel', 'muscleFullness', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Energy Levels: {getScaleLabel(fatigueData.fuel.energyLevels)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.fuel.energyLevels}
                                onChange={(e) => handleFatigueChange('fuel', 'energyLevels', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Post-Workout Fatigue: {getScaleLabel(fatigueData.fuel.postWorkoutFatigue, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.fuel.postWorkoutFatigue}
                                onChange={(e) => handleFatigueChange('fuel', 'postWorkoutFatigue', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                1 = No fatigue, 10 = Completely exhausted
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nervous System */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        🧠 Nervous System
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">
                            Recovery: Days-Weeks
                        </span>
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Force Output: {getScaleLabel(fatigueData.nervous.forceOutput)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.nervous.forceOutput}
                                onChange={(e) => handleFatigueChange('nervous', 'forceOutput', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Technique Quality: {getScaleLabel(fatigueData.nervous.techniqueQuality)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.nervous.techniqueQuality}
                                onChange={(e) => handleFatigueChange('nervous', 'techniqueQuality', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Motivation: {getScaleLabel(fatigueData.nervous.motivation)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.nervous.motivation}
                                onChange={(e) => handleFatigueChange('nervous', 'motivation', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Learning Rate: {getScaleLabel(fatigueData.nervous.learningRate)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.nervous.learningRate}
                                onChange={(e) => handleFatigueChange('nervous', 'learningRate', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Quality: {getScaleLabel(fatigueData.nervous.sleepQuality)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.nervous.sleepQuality}
                                onChange={(e) => handleFatigueChange('nervous', 'sleepQuality', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Chemical Messengers */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        🧪 Chemical Messengers
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">
                            Recovery: Weeks
                        </span>
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mood Swings: {getScaleLabel(fatigueData.messengers.moodSwings, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.messengers.moodSwings}
                                onChange={(e) => handleFatigueChange('messengers', 'moodSwings', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Inflammation: {getScaleLabel(fatigueData.messengers.inflammation, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.messengers.inflammation}
                                onChange={(e) => handleFatigueChange('messengers', 'inflammation', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Hormone Symptoms: {getScaleLabel(fatigueData.messengers.hormoneSymptoms, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.messengers.hormoneSymptoms}
                                onChange={(e) => handleFatigueChange('messengers', 'hormoneSymptoms', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recovery Rate: {getScaleLabel(fatigueData.messengers.recoveryRate)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.messengers.recoveryRate}
                                onChange={(e) => handleFatigueChange('messengers', 'recoveryRate', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Chronic Soreness: {getScaleLabel(fatigueData.messengers.soreness, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.messengers.soreness}
                                onChange={(e) => handleFatigueChange('messengers', 'soreness', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Tissue Structure */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        🦴 Tissue Structure
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">
                            Recovery: Weeks-Months
                        </span>
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Joint Pain: {getScaleLabel(fatigueData.tissues.jointPain, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.tissues.jointPain}
                                onChange={(e) => handleFatigueChange('tissues', 'jointPain', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Muscle Tightness: {getScaleLabel(fatigueData.tissues.muscleTightness, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.tissues.muscleTightness}
                                onChange={(e) => handleFatigueChange('tissues', 'muscleTightness', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tendon Issues: {getScaleLabel(fatigueData.tissues.tendonIssues, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.tissues.tendonIssues}
                                onChange={(e) => handleFatigueChange('tissues', 'tendonIssues', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Overuse Symptoms: {getScaleLabel(fatigueData.tissues.overuseSymptoms, true)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={fatigueData.tissues.overuseSymptoms}
                                onChange={(e) => handleFatigueChange('tissues', 'overuseSymptoms', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Injury History: {fatigueData.tissues.injuryHistory} injuries in past year
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                value={fatigueData.tissues.injuryHistory}
                                onChange={(e) => handleFatigueChange('tissues', 'injuryHistory', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Lifestyle Factors</h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Sleep: {lifestyle.sleep} hours
                        </label>
                        <input
                            type="range"
                            min="4"
                            max="12"
                            value={lifestyle.sleep}
                            onChange={(e) => handleLifestyleChange('sleep', e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Stress: {getScaleLabel(lifestyle.stress, true)}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={lifestyle.stress}
                            onChange={(e) => handleLifestyleChange('stress', e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nutrition: {getScaleLabel(lifestyle.nutrition)}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={lifestyle.nutrition}
                            onChange={(e) => handleLifestyleChange('nutrition', e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hydration: {getScaleLabel(lifestyle.hydration)}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={lifestyle.hydration}
                            onChange={(e) => handleLifestyleChange('hydration', e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>
            </div>

            {/* Assessment Results */}
            {assessment && (
                <div className="space-y-4">
                    {/* Overall State */}
                    <div className={`rounded-lg p-4 border ${getStateColor(assessment.overallState.state)}`}>
                        <h4 className="font-semibold mb-2">
                            Overall State: {assessment.overallState.state.replace(/_/g, ' ').toUpperCase()}
                        </h4>
                        <p className="text-sm mb-2">{assessment.overallState.description}</p>
                        <p className="text-sm font-medium">Recommended Action: {assessment.overallState.action}</p>
                    </div>

                    {/* Fatigue Contributors Summary */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-3">Fatigue Contributors</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(assessment.contributors).map(([category, data]) => (
                                <div key={category} className={`p-3 rounded border ${getFatigueColor(data.level)}`}>
                                    <div className="font-medium capitalize">{category}</div>
                                    <div className="text-sm">{data.level.toUpperCase()}</div>
                                    <div className="text-xs">{data.recoveryTime}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Management Strategies */}
                    {assessment.managementStrategies.length > 0 && (
                        <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                            <h4 className="text-blue-400 font-semibold mb-3">Management Strategies</h4>
                            {assessment.managementStrategies.map((strategy, index) => (
                                <div key={index} className="mb-3 last:mb-0">
                                    <div className="text-blue-300 font-medium">{strategy.type.replace(/_/g, ' ').toUpperCase()}</div>
                                    <div className="text-blue-200 text-sm">{strategy.description}</div>
                                    {strategy.duration && (
                                        <div className="text-blue-400 text-xs">Duration: {strategy.duration}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recovery Timeline */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-3">Recovery Timeline</h4>
                        <div className="space-y-2">
                            {Object.entries(assessment.recoveryTimeline).map(([category, data]) => (
                                <div key={category} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300 capitalize">{category}:</span>
                                    <span className="text-gray-400">{data.timeframe}</span>
                                    <span className="text-blue-400">{data.priority}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveAssessment}
                    disabled={!assessment}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Save Fatigue Assessment
                </button>
            </div>
        </div>
    );
};

export default MonitoringTab;
