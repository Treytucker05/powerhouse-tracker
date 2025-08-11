import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { useApp } from '../../../context';
import { Calendar, TrendingUp, RotateCcw, AlertTriangle, CheckCircle, BarChart3, Clock } from 'lucide-react';

const MesocycleIntegrationTab = () => {
    const {
        assessVolumeLandmarks,
        generateWeeklyVolumeProgression,
        generateDeloadProtocol,
        adjustVolumeLandmarks,
        saveVolumeLandmarks
    } = useAssessment();

    const { state } = useApp();

    const [mesocycleData, setMesocycleData] = useState({
        length: 4, // weeks
        currentWeek: 1,
        phase: 'accumulation', // accumulation, intensification, realization
        deloadType: 'volume',
        autoProgression: true,
        progressionRate: 'moderate' // conservative, moderate, aggressive
    });

    const [microAdjustments, setMicroAdjustments] = useState({
        week1: { multiplier: 1.0, notes: 'Baseline week - establish movement patterns' },
        week2: { multiplier: 1.15, notes: 'Progressive overload begins' },
        week3: { multiplier: 1.3, notes: 'Peak volume week - monitor recovery' },
        week4: { multiplier: 0.6, notes: 'Deload week - active recovery' }
    });

    const [performanceFeedback, setPerformanceFeedback] = useState({
        chest: { performance: 'stable', recovery: 'good', soreness: 'moderate', pump: 'good' },
        back: { performance: 'improving', recovery: 'good', soreness: 'moderate', pump: 'excellent' },
        shoulders: { performance: 'stable', recovery: 'fair', soreness: 'high', pump: 'good' },
        quads: { performance: 'improving', recovery: 'excellent', soreness: 'low', pump: 'excellent' }
    });

    const [mesocycleAssessment, setMesocycleAssessment] = useState(null);
    const [showProgressionAlert, setShowProgressionAlert] = useState(false);
    const [deloadRecommendation, setDeloadRecommendation] = useState(null);

    // Mock volume landmarks for demonstration
    const [currentLandmarks, setCurrentLandmarks] = useState({
        chest: { mev: 8, mrv: 22, mav: 15, currentVolume: 16 },
        back: { mev: 10, mrv: 26, mav: 18, currentVolume: 20 },
        shoulders: { mev: 8, mrv: 20, mav: 14, currentVolume: 18 },
        quads: { mev: 10, mrv: 26, mav: 18, currentVolume: 22 }
    });

    useEffect(() => {
        // Generate mesocycle assessment based on current data
        generateMesocycleAssessment();

        // Check for progression adjustments needed
        checkProgressionNeeds();

        // Generate deload recommendations if needed
        if (mesocycleData.currentWeek === mesocycleData.length) {
            generateDeloadRecommendations();
        }
    }, [mesocycleData, microAdjustments, performanceFeedback, currentLandmarks]);

    const generateMesocycleAssessment = () => {
        const assessment = {
            phase: mesocycleData.phase,
            weeklyProgression: [],
            volumeDistribution: {},
            fatigueAccumulation: 'moderate',
            adaptationPotential: 'high',
            recommendations: []
        };

        // Generate weekly progression based on micro adjustments
        for (let week = 1; week <= mesocycleData.length; week++) {
            const weekKey = `week${week}`;
            const adjustment = microAdjustments[weekKey] || { multiplier: 1.0, notes: '' };

            const weekData = {
                week,
                isCurrentWeek: week === mesocycleData.currentWeek,
                multiplier: adjustment.multiplier,
                notes: adjustment.notes,
                muscleVolumes: {},
                totalVolume: 0,
                intensity: getWeeklyIntensity(week, mesocycleData.phase),
                fatigueLevel: getWeeklyFatigueLevel(week, adjustment.multiplier)
            };

            // Calculate volume for each muscle
            Object.entries(currentLandmarks).forEach(([muscle, landmark]) => {
                const baseVolume = landmark.mav;
                const adjustedVolume = Math.round(baseVolume * adjustment.multiplier);

                weekData.muscleVolumes[muscle] = {
                    target: adjustedVolume,
                    mev: landmark.mev,
                    mrv: landmark.mrv,
                    status: getVolumeStatus(adjustedVolume, landmark),
                    progressionFromPrevious: week > 1 ?
                        adjustedVolume - Math.round(baseVolume * (microAdjustments[`week${week - 1}`]?.multiplier || 1.0)) : 0
                };

                weekData.totalVolume += adjustedVolume;
            });

            assessment.weeklyProgression.push(weekData);
        }

        // Generate phase-specific recommendations
        if (mesocycleData.phase === 'accumulation') {
            assessment.recommendations.push({
                type: 'phase_guidance',
                title: 'Accumulation Phase Focus',
                message: 'Build work capacity through volume progression. Focus on technique refinement.',
                reference: 'Accumulation phases emphasize volume over intensity (p.28)'
            });
        }

        setMesocycleAssessment(assessment);
    };

    const getWeeklyIntensity = (week, phase) => {
        const baseIntensities = {
            accumulation: [70, 72, 75, 65], // Moderate intensity, deload week lower
            intensification: [75, 80, 85, 70], // Higher intensity progression
            realization: [85, 90, 95, 75] // Peak intensity for testing
        };

        return baseIntensities[phase][week - 1] || 70;
    };

    const getWeeklyFatigueLevel = (week, multiplier) => {
        if (multiplier <= 0.7) return 'low'; // Deload week
        if (multiplier >= 1.3) return 'high'; // Peak week
        if (week >= 3) return 'moderate-high'; // Later weeks accumulate fatigue
        return 'moderate';
    };

    const getVolumeStatus = (volume, landmark) => {
        if (volume < landmark.mev) return 'below_mev';
        if (volume > landmark.mrv) return 'above_mrv';
        if (volume > landmark.mav * 1.2) return 'above_mav';
        return 'optimal';
    };

    const checkProgressionNeeds = () => {
        // Check if current volumes need adjustment based on performance feedback
        const adjustments = adjustVolumeLandmarks(currentLandmarks, performanceFeedback, mesocycleData.currentWeek);

        const needsAdjustment = Object.values(adjustments).some(adj =>
            Math.abs(adj.newMRV - currentLandmarks[Object.keys(adjustments)[0]]?.mrv) > 2
        );

        setShowProgressionAlert(needsAdjustment);
    };

    const generateDeloadRecommendations = () => {
        const currentVolume = Object.fromEntries(
            Object.entries(currentLandmarks).map(([muscle, landmark]) => [muscle, landmark.currentVolume])
        );

        const deload = generateDeloadProtocol(currentLandmarks, currentVolume, mesocycleData.deloadType);
        setDeloadRecommendation(deload);
    };

    const handleMesocycleChange = (field, value) => {
        setMesocycleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMicroAdjustment = (week, field, value) => {
        setMicroAdjustments(prev => ({
            ...prev,
            [week]: {
                ...prev[week],
                [field]: field === 'multiplier' ? parseFloat(value) : value
            }
        }));
    };

    const handlePerformanceFeedback = (muscle, field, value) => {
        setPerformanceFeedback(prev => ({
            ...prev,
            [muscle]: {
                ...prev[muscle],
                [field]: value
            }
        }));
    };

    const handleAdvanceWeek = () => {
        if (mesocycleData.currentWeek < mesocycleData.length) {
            setMesocycleData(prev => ({
                ...prev,
                currentWeek: prev.currentWeek + 1
            }));
        }
    };

    const handleResetMesocycle = () => {
        setMesocycleData(prev => ({
            ...prev,
            currentWeek: 1
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'below_mev': return 'text-red-400';
            case 'optimal': return 'text-green-400';
            case 'above_mav': return 'text-yellow-400';
            case 'above_mrv': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getFatigueColor = (level) => {
        switch (level) {
            case 'low': return 'text-green-400';
            case 'moderate': return 'text-blue-400';
            case 'moderate-high': return 'text-yellow-400';
            case 'high': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">Mesocycle Integration</h2>
                <p className="text-gray-300 mb-4">
                    "Mesocycles are 2-6 week training blocks that progress volume systematically.
                    Microcycles (weeks) within mesocycles allow fine-tuning based on recovery." - p.25
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-900/50 p-3 rounded border border-blue-600">
                        <div className="text-blue-400 font-semibold">Accumulation</div>
                        <div className="text-blue-200">Volume focus, moderate intensity</div>
                    </div>
                    <div className="bg-green-900/50 p-3 rounded border border-green-600">
                        <div className="text-green-400 font-semibold">Intensification</div>
                        <div className="text-green-200">Intensity focus, reduced volume</div>
                    </div>
                    <div className="bg-purple-900/50 p-3 rounded border border-purple-600">
                        <div className="text-purple-400 font-semibold">Realization</div>
                        <div className="text-purple-200">Peak/test phase, minimal volume</div>
                    </div>
                </div>
            </div>

            {/* Progression Alert */}
            {showProgressionAlert && (
                <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4">
                    <div className="flex items-start">
                        <TrendingUp className="text-yellow-400 mr-3 mt-1" />
                        <div>
                            <h4 className="text-yellow-400 font-semibold mb-2">Volume Adjustment Recommended</h4>
                            <p className="text-yellow-300 text-sm mb-2">
                                Performance feedback suggests volume landmarks need adjustment.
                            </p>
                            <p className="text-yellow-300 text-sm">
                                Review individual muscle feedback and consider updating MRV/MEV values.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mesocycle Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Mesocycle Setup
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mesocycle Length
                            </label>
                            <select
                                value={mesocycleData.length}
                                onChange={(e) => handleMesocycleChange('length', parseInt(e.target.value))}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                            >
                                <option value={3}>3 Weeks + Deload</option>
                                <option value={4}>4 Weeks + Deload</option>
                                <option value={5}>5 Weeks + Deload</option>
                                <option value={6}>6 Weeks + Deload</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Phase
                            </label>
                            <select
                                value={mesocycleData.phase}
                                onChange={(e) => handleMesocycleChange('phase', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                            >
                                <option value="accumulation">Accumulation (Volume Focus)</option>
                                <option value="intensification">Intensification (Intensity Focus)</option>
                                <option value="realization">Realization (Peak/Test)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Current Week: {mesocycleData.currentWeek} / {mesocycleData.length}
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAdvanceWeek}
                                    disabled={mesocycleData.currentWeek >= mesocycleData.length}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Advance Week
                                </button>
                                <button
                                    onClick={handleResetMesocycle}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deload Type
                            </label>
                            <select
                                value={mesocycleData.deloadType}
                                onChange={(e) => handleMesocycleChange('deloadType', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                            >
                                <option value="volume">Volume Deload (50% volume, maintain intensity)</option>
                                <option value="intensity">Intensity Deload (75% intensity, maintain volume)</option>
                                <option value="complete">Complete Rest (minimal training)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Microcycle Adjustments</h3>

                    <div className="space-y-3">
                        {Object.entries(microAdjustments).map(([weekKey, adjustment]) => {
                            const weekNum = parseInt(weekKey.replace('week', ''));
                            const isCurrentWeek = weekNum === mesocycleData.currentWeek;

                            return (
                                <div key={weekKey} className={`p-3 rounded border ${isCurrentWeek ? 'border-blue-500 bg-blue-900/30' : 'border-gray-600'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-medium">
                                            Week {weekNum}
                                            {isCurrentWeek && <span className="text-blue-400 ml-2">(Current)</span>}
                                        </span>
                                        <span className="text-gray-300 text-sm">
                                            {Math.round(adjustment.multiplier * 100)}% base volume
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        <input
                                            type="range"
                                            min="0.4"
                                            max="1.5"
                                            step="0.05"
                                            value={adjustment.multiplier}
                                            onChange={(e) => handleMicroAdjustment(weekKey, 'multiplier', e.target.value)}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={adjustment.notes}
                                        onChange={(e) => handleMicroAdjustment(weekKey, 'notes', e.target.value)}
                                        placeholder="Week notes..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Weekly Progression Overview */}
            {mesocycleAssessment && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Weekly Progression Overview
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left text-gray-300 py-2">Week</th>
                                    <th className="text-center text-gray-300 py-2">Total Volume</th>
                                    <th className="text-center text-gray-300 py-2">Intensity</th>
                                    <th className="text-center text-gray-300 py-2">Fatigue</th>
                                    <th className="text-center text-gray-300 py-2">Chest</th>
                                    <th className="text-center text-gray-300 py-2">Back</th>
                                    <th className="text-center text-gray-300 py-2">Shoulders</th>
                                    <th className="text-center text-gray-300 py-2">Quads</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mesocycleAssessment.weeklyProgression.map(week => (
                                    <tr key={week.week} className={`border-b border-gray-700 ${week.isCurrentWeek ? 'bg-blue-900/30' : ''
                                        }`}>
                                        <td className="py-3 text-white font-medium">
                                            Week {week.week}
                                            {week.isCurrentWeek && <span className="text-blue-400 ml-1">*</span>}
                                        </td>
                                        <td className="text-center py-3 text-white">
                                            {week.totalVolume} sets
                                        </td>
                                        <td className="text-center py-3 text-gray-300">
                                            {week.intensity}%
                                        </td>
                                        <td className={`text-center py-3 ${getFatigueColor(week.fatigueLevel)}`}>
                                            {week.fatigueLevel.replace('-', ' ')}
                                        </td>
                                        {Object.entries(week.muscleVolumes).map(([muscle, data]) => (
                                            <td key={muscle} className={`text-center py-3 ${getStatusColor(data.status)}`}>
                                                {data.target}
                                                {data.progressionFromPrevious !== 0 && (
                                                    <span className="text-xs ml-1">
                                                        ({data.progressionFromPrevious > 0 ? '+' : ''}{data.progressionFromPrevious})
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div><span className="text-green-400">●</span> Optimal Range</div>
                            <div><span className="text-yellow-400">●</span> Above MAV</div>
                            <div><span className="text-red-400">●</span> Below MEV / Above MRV</div>
                            <div><span className="text-blue-400">*</span> Current Week</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Feedback */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Feedback</h3>
                <p className="text-gray-300 text-sm mb-4">
                    "Track performance indicators to adjust volume landmarks dynamically" - p.31
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(performanceFeedback).map(([muscle, feedback]) => (
                        <div key={muscle} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <h4 className="text-white font-medium mb-3 capitalize">{muscle}</h4>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-300 mb-1">Performance Trend</label>
                                    <select
                                        value={feedback.performance}
                                        onChange={(e) => handlePerformanceFeedback(muscle, 'performance', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 custom-styled"
                                    >
                                        <option value="declining">Declining</option>
                                        <option value="stable">Stable</option>
                                        <option value="improving">Improving</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-300 mb-1">Recovery Quality</label>
                                    <select
                                        value={feedback.recovery}
                                        onChange={(e) => handlePerformanceFeedback(muscle, 'recovery', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 custom-styled"
                                    >
                                        <option value="poor">Poor</option>
                                        <option value="fair">Fair</option>
                                        <option value="good">Good</option>
                                        <option value="excellent">Excellent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-300 mb-1">Soreness Level</label>
                                    <select
                                        value={feedback.soreness}
                                        onChange={(e) => handlePerformanceFeedback(muscle, 'soreness', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 custom-styled"
                                    >
                                        <option value="none">None</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                        <option value="excessive">Excessive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-300 mb-1">Muscle Pump</label>
                                    <select
                                        value={feedback.pump}
                                        onChange={(e) => handlePerformanceFeedback(muscle, 'pump', e.target.value)}
                                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 custom-styled"
                                    >
                                        <option value="none">None</option>
                                        <option value="poor">Poor</option>
                                        <option value="good">Good</option>
                                        <option value="excellent">Excellent</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Deload Recommendation */}
            {deloadRecommendation && (
                <div className="bg-purple-900/50 border border-purple-600 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-3 flex items-center">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Deload Protocol Recommendation
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-purple-300 font-medium mb-2">{deloadRecommendation.protocol.name}</h5>
                            <p className="text-purple-200 text-sm mb-2">{deloadRecommendation.protocol.description}</p>
                            <p className="text-purple-400 text-xs">{deloadRecommendation.protocol.reference}</p>
                        </div>

                        <div>
                            <h5 className="text-purple-300 font-medium mb-2">Deload Targets</h5>
                            <div className="space-y-1 text-sm">
                                {Object.entries(deloadRecommendation.deloadTargets).map(([muscle, target]) => (
                                    <div key={muscle} className="flex justify-between text-purple-200">
                                        <span className="capitalize">{muscle}:</span>
                                        <span>{target.targetVolume} sets @ {target.targetIntensity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5 className="text-purple-300 font-medium mb-2">Monitoring Points</h5>
                        <ul className="list-disc list-inside text-purple-200 text-sm space-y-1">
                            {deloadRecommendation.monitoringPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Phase Recommendations */}
            {mesocycleAssessment && (
                <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-3">Phase-Specific Recommendations</h4>
                    {mesocycleAssessment.recommendations.map((rec, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                            <div className="text-blue-300 font-medium">{rec.title}</div>
                            <div className="text-blue-200 text-sm mb-1">{rec.message}</div>
                            <div className="text-blue-400 text-xs">{rec.reference}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => saveVolumeLandmarks({
                        mesocycleData,
                        microAdjustments,
                        performanceFeedback,
                        currentLandmarks,
                        mesocycleAssessment,
                        timestamp: new Date().toISOString()
                    })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Save Mesocycle Plan
                </button>
            </div>
        </div>
    );
};

export default MesocycleIntegrationTab;
