import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight } from '../../../lib/fiveThreeOne/math.js';
import { RefreshCw, Heart, CheckCircle, Info, AlertTriangle, Calendar, Pause } from 'lucide-react';

export default function Step8DeloadWeek({ data = {}, updateData }) {
    const { roundingIncrement } = useSettings();
    // State management with proper fallbacks
    const [deloadResults, setDeloadResults] = useState(data?.deloadResults || {});
    const [recoveryMetrics, setRecoveryMetrics] = useState(data?.recoveryMetrics || {});
    const [assistanceReduction, setAssistanceReduction] = useState(data?.assistanceReduction || true);

    // Integration with previous steps - all with safe fallbacks
    const trainingMaxes = data?.trainingMaxes || {};
    const schedule = data?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] };

    // Deload percentages - SAME FOR ALL OPTIONS
    const deloadPercentages = [40, 50, 60];
    const deloadReps = [5, 5, 5]; // NO AMRAP sets

    // Calculate weights with proper rounding
    const calculateWeight = (tm, percentage) => {
        if (!tm) return 0;
        return toDisplayWeight(percentOfTM(tm, percentage, roundingIncrement));
    };

    // Lift names mapping
    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Handle session completion
    const handleSessionComplete = (lift) => {
        const newResults = {
            ...deloadResults,
            [lift]: {
                ...deloadResults[lift],
                completed: true,
                date: new Date().toISOString().split('T')[0]
            }
        };
        setDeloadResults(newResults);
        updateStepData({ deloadResults: newResults });
    };

    // Handle recovery metrics
    const handleRecoveryMetric = (metric, value) => {
        const newMetrics = {
            ...recoveryMetrics,
            [metric]: value
        };
        setRecoveryMetrics(newMetrics);
        updateStepData({ recoveryMetrics: newMetrics });
    };

    // Handle session notes
    const handleNotes = (lift, notes) => {
        const newResults = {
            ...deloadResults,
            [lift]: {
                ...deloadResults[lift],
                notes: notes
            }
        };
        setDeloadResults(newResults);
        updateStepData({ deloadResults: newResults });
    };

    const updateStepData = (updates) => {
        if (updateData) {
            updateData({
                deloadResults: deloadResults || {},
                recoveryMetrics: recoveryMetrics || {},
                assistanceReduction,
                ...updates
            });
        }
    };

    // Check if step is complete
    const isStepComplete = () => {
        const liftOrder = schedule?.liftOrder || [];
        return liftOrder.length > 0 && liftOrder.every(lift =>
            deloadResults[lift]?.completed
        );
    };

    // Recovery assessment
    const getRecoveryStatus = () => {
        const metrics = recoveryMetrics;
        const sleep = parseInt(metrics.sleep) || 0;
        const soreness = parseInt(metrics.soreness) || 5;
        const motivation = parseInt(metrics.motivation) || 5;

        let status = 'good';
        let message = 'Recovery on track';
        let color = 'text-green-400';

        if (sleep < 6 || soreness > 7 || motivation < 4) {
            status = 'poor';
            message = 'Consider extending deload or reducing next cycle TM';
            color = 'text-red-400';
        } else if (sleep < 7 || soreness > 5 || motivation < 6) {
            status = 'moderate';
            message = 'Monitor recovery closely next cycle';
            color = 'text-yellow-400';
        }

        return { status, message, color };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 8: Week 4 – Deload Week
                </h3>
                <p className="text-gray-400">
                    Recovery and regeneration week. Focus on movement quality, not intensity. Under-do rather than overdo.
                </p>
            </div>

            {/* Philosophy/Info Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Deload Week Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Recovery focus:</strong> Allow your body and mind to recover from 3 weeks of progression</li>
                            <li>• <strong>Movement quality:</strong> Perfect your technique with lighter loads</li>
                            <li>• <strong>Under-do principle:</strong> Resist the urge to add weight or extra reps</li>
                            <li>• <strong>Holistic recovery:</strong> Prioritize sleep, nutrition, and stress management</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Deload Percentages Display */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
                    Deload Loading - Light and Easy
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {deloadPercentages.map((percentage, index) => (
                        <div key={index} className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-300">{percentage}%</div>
                            <div className="text-blue-200">
                                {deloadReps[index]} reps
                            </div>
                            <div className="text-sm text-blue-400 mt-1">
                                Set {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-center">
                    <span className="text-blue-300 text-sm font-medium">
                        NO AMRAP SETS - Prescribed reps only
                    </span>
                </div>
            </div>

            {/* Assistance Work Reduction */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Pause className="w-5 h-5 text-yellow-400 mr-2" />
                    Assistance Work Protocol
                </h4>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="assistanceReduction"
                            checked={assistanceReduction}
                            onChange={(e) => {
                                setAssistanceReduction(e.target.checked);
                                updateStepData({ assistanceReduction: e.target.checked });
                            }}
                            className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="assistanceReduction" className="text-white">
                            Reduce assistance work during deload (Recommended)
                        </label>
                    </div>
                    {assistanceReduction && (
                        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded">
                            <ul className="text-yellow-200 text-sm space-y-1">
                                <li>• <strong>Volume:</strong> 50% of normal assistance volume</li>
                                <li>• <strong>Intensity:</strong> Reduce weights by 10-15%</li>
                                <li>• <strong>Focus:</strong> Movement quality and blood flow</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Recovery Metrics Tracking */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Heart className="w-5 h-5 text-red-400 mr-2" />
                    Recovery Monitoring
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Average Sleep (hours/night)
                        </label>
                        <input
                            type="number"
                            min="4"
                            max="12"
                            step="0.5"
                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                            value={recoveryMetrics.sleep || ''}
                            onChange={(e) => handleRecoveryMetric('sleep', e.target.value)}
                            placeholder="7.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Soreness Level (1-10)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                            value={recoveryMetrics.soreness || ''}
                            onChange={(e) => handleRecoveryMetric('soreness', e.target.value)}
                            placeholder="3"
                        />
                        <div className="text-xs text-gray-500 mt-1">1 = No soreness, 10 = Extremely sore</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Motivation Level (1-10)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                            value={recoveryMetrics.motivation || ''}
                            onChange={(e) => handleRecoveryMetric('motivation', e.target.value)}
                            placeholder="8"
                        />
                        <div className="text-xs text-gray-500 mt-1">1 = No motivation, 10 = Highly motivated</div>
                    </div>
                </div>

                {(recoveryMetrics.sleep || recoveryMetrics.soreness || recoveryMetrics.motivation) && (
                    <div className="mt-4 p-3 bg-gray-800 rounded">
                        <div className={`text-sm font-medium ${getRecoveryStatus().color}`}>
                            Recovery Status: {getRecoveryStatus().message}
                        </div>
                    </div>
                )}
            </div>

            {/* Workout Sessions */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                    Deload Workout Sessions
                </h4>

                <div className="space-y-4">
                    {(schedule?.liftOrder || []).map((lift, index) => {
                        const tm = trainingMaxes[lift] || 0;
                        const isCompleted = deloadResults[lift]?.completed;

                        return (
                            <div key={lift} className={`border rounded-lg p-4 ${isCompleted ? 'border-green-500 bg-green-900/10' : 'border-gray-600'
                                }`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-medium text-white flex items-center">
                                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-400 mr-2" />}
                                        Day {index + 1}: {liftNames[lift]}
                                    </h5>
                                    <div className="text-sm text-gray-400">
                                        TM: {tm} lbs
                                    </div>
                                </div>

                                {/* Warm-up sets */}
                                <div className="mb-4">
                                    <h6 className="text-sm font-medium text-gray-300 mb-2">Warm-up Sets:</h6>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="text-white">{calculateWeight(tm, 40)} lbs</div>
                                            <div className="text-gray-400">5 reps</div>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="text-white">{calculateWeight(tm, 50)} lbs</div>
                                            <div className="text-gray-400">5 reps</div>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center">
                                            <div className="text-white">{calculateWeight(tm, 60)} lbs</div>
                                            <div className="text-gray-400">3 reps</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Working sets */}
                                <div className="mb-4">
                                    <h6 className="text-sm font-medium text-gray-300 mb-2">Deload Sets:</h6>
                                    <div className="grid grid-cols-3 gap-2">
                                        {deloadPercentages.map((percentage, setIndex) => (
                                            <div key={setIndex} className="bg-blue-900/20 border border-blue-600 p-3 rounded">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-300">
                                                        {calculateWeight(tm, percentage)} lbs
                                                    </div>
                                                    <div className="text-blue-200">
                                                        {percentage}% × {deloadReps[setIndex]}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Session controls */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <button
                                            onClick={() => handleSessionComplete(lift)}
                                            disabled={isCompleted}
                                            className={`w-full px-4 py-2 rounded font-medium ${isCompleted
                                                ? 'bg-green-600 text-white cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {isCompleted ? 'Session Complete' : 'Mark Complete'}
                                        </button>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={deloadResults[lift]?.notes || ''}
                                            onChange={(e) => handleNotes(lift, e.target.value)}
                                            placeholder="How did you feel? Movement quality?"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Critical Deload Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-300 font-medium mb-2">Deload Week Critical Rules</h4>
                        <ul className="text-yellow-200 text-sm space-y-1">
                            <li>• <strong>NO AMRAP sets:</strong> Stick to prescribed reps only - resist the urge to test</li>
                            <li>• <strong>NO extra weight:</strong> Do not add weight even if it feels easy</li>
                            <li>• <strong>Focus on form:</strong> Use this time to perfect technique and timing</li>
                            <li>• <strong>Listen to your body:</strong> This is recovery time, not testing time</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Deload Week Complete! Ready to begin next cycle with increased training maxes.
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        Recovery week finished. Time to progress your training maxes and start the next 4-week cycle.
                    </div>
                </div>
            )}
        </div>
    );
}
