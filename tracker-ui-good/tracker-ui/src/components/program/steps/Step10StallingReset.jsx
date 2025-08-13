import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { roundToIncrement } from '../../../lib/fiveThreeOne/math.js';
import { AlertTriangle, RotateCcw, TrendingDown, CheckCircle, Info, Target, RefreshCw } from 'lucide-react';

export default function Step10StallingReset({ data = {}, updateData }) {
    const { roundingIncrement } = useSettings();
    // State management with proper fallbacks
    const [stallAnalysis, setStallAnalysis] = useState(data?.stallAnalysis || {});
    const [resetDecisions, setResetDecisions] = useState(data?.resetDecisions || {});
    const [resetTrainingMaxes, setResetTrainingMaxes] = useState(data?.resetTrainingMaxes || {});
    const [stallHistory, setStallHistory] = useState(data?.stallHistory || {});

    // Integration with previous steps - all with safe fallbacks
    const currentTrainingMaxes = data?.trainingMaxes || {};
    const week3Results = data?.week3Results || {};
    const previousCycles = data?.previousCycles || [];
    const schedule = data?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] };

    // Reset percentages
    const resetPercentages = {
        first_reset: 90,    // 90% of current TM
        second_reset: 85,   // 85% of current TM
        third_reset: 80     // 80% of current TM (rare)
    };

    // Calculate proper rounding to nearest 5 lbs
    const roundToNearest5 = (weight) => roundToIncrement(weight, roundingIncrement);

    // Calculate reset training max
    const calculateResetTM = (currentTM, resetType = 'first_reset') => {
        if (!currentTM) return 0;
        const percentage = resetPercentages[resetType];
        return roundToNearest5(currentTM * (percentage / 100));
    };

    // Lift names mapping
    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Analyze if lift is stalled based on Week 3 performance
    const analyzeStall = (lift) => {
        const week3Data = week3Results[lift];
        const currentTM = currentTrainingMaxes[lift];

        if (!week3Data || week3Data.amrapReps === undefined) {
            return {
                isStalled: false,
                reason: 'No performance data available',
                severity: 'none',
                color: 'text-gray-400'
            };
        }

        const reps = week3Data.amrapReps;

        if (reps === 0) {
            return {
                isStalled: true,
                reason: 'Failed to complete minimum rep at 95%',
                severity: 'critical',
                recommendation: 'Immediate reset required',
                color: 'text-red-400'
            };
        } else if (reps === 1) {
            // Check if this is a pattern
            const stallCount = stallHistory[lift]?.consecutiveMinimums || 0;
            if (stallCount >= 1) {
                return {
                    isStalled: true,
                    reason: `Multiple cycles at minimum (${stallCount + 1} cycles)`,
                    severity: 'moderate',
                    recommendation: 'Consider reset to rebuild',
                    color: 'text-yellow-400'
                };
            } else {
                return {
                    isStalled: false,
                    reason: 'Single minimum performance - monitor next cycle',
                    severity: 'warning',
                    recommendation: 'Continue with conservative progression',
                    color: 'text-yellow-400'
                };
            }
        } else {
            return {
                isStalled: false,
                reason: `Good performance (${reps} reps at 95%)`,
                severity: 'none',
                recommendation: 'Continue normal progression',
                color: 'text-green-400'
            };
        }
    };

    // Handle reset decision
    const handleResetDecision = (lift, resetType) => {
        const currentTM = currentTrainingMaxes[lift] || 0;
        const newTM = calculateResetTM(currentTM, resetType);

        const newResetDecisions = { ...resetDecisions, [lift]: resetType };
        const newResetTMs = { ...resetTrainingMaxes, [lift]: newTM };

        setResetDecisions(newResetDecisions);
        setResetTrainingMaxes(newResetTMs);
        updateStepData({
            resetDecisions: newResetDecisions,
            resetTrainingMaxes: newResetTMs
        });
    };

    // Handle manual reset TM
    const handleManualResetTM = (lift, value) => {
        const newTM = roundToNearest5(parseInt(value) || 0);
        const newResetTMs = { ...resetTrainingMaxes, [lift]: newTM };
        setResetTrainingMaxes(newResetTMs);
        updateStepData({ resetTrainingMaxes: newResetTMs });
    };

    // Mark lift as not needing reset
    const handleNoReset = (lift) => {
        const newResetDecisions = { ...resetDecisions, [lift]: 'no_reset' };
        setResetDecisions(newResetDecisions);
        updateStepData({ resetDecisions: newResetDecisions });
    };

    const updateStepData = (updates) => {
        if (updateData) {
            updateData({
                stallAnalysis: stallAnalysis || {},
                resetDecisions: resetDecisions || {},
                resetTrainingMaxes: resetTrainingMaxes || {},
                stallHistory: stallHistory || {},
                ...updates
            });
        }
    };

    // Check if step is complete (decisions made for all lifts)
    const isStepComplete = () => {
        const liftOrder = schedule?.liftOrder || [];
        return liftOrder.length > 0 && liftOrder.every(lift =>
            resetDecisions[lift] !== undefined
        );
    };

    // Get number of lifts requiring reset
    const getResetCount = () => {
        return Object.values(resetDecisions).filter(decision =>
            decision !== 'no_reset' && decision !== undefined
        ).length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 10: Stalling and Reset Rules
                </h3>
                <p className="text-gray-400">
                    Identify stalled lifts and implement strategic resets to break through plateaus and continue progress.
                </p>
            </div>

            {/* Philosophy/Info Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Reset Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Strategic tool:</strong> Resets aren't failures - they're planned steps back to jump forward</li>
                            <li>• <strong>Break plateaus:</strong> Lower training max allows volume and technique work</li>
                            <li>• <strong>Rebuild momentum:</strong> Success breeds success - get back to hitting rep PRs</li>
                            <li>• <strong>Individual approach:</strong> Each lift resets independently based on performance</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reset Guidelines */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 text-yellow-400 mr-2" />
                    When to Reset - Official Guidelines
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-900/20 border border-red-600 p-4 rounded">
                        <h5 className="text-red-300 font-medium mb-2">Immediate Reset</h5>
                        <ul className="text-red-200 text-sm space-y-1">
                            <li>• Failed 95% (0 reps)</li>
                            <li>• Missed multiple sessions</li>
                            <li>• Form breakdown at 95%</li>
                        </ul>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded">
                        <h5 className="text-yellow-300 font-medium mb-2">Consider Reset</h5>
                        <ul className="text-yellow-200 text-sm space-y-1">
                            <li>• 2+ cycles at 1 rep minimum</li>
                            <li>• Consistently grinding reps</li>
                            <li>• Loss of bar speed</li>
                        </ul>
                    </div>
                    <div className="bg-green-900/20 border border-green-600 p-4 rounded">
                        <h5 className="text-green-300 font-medium mb-2">Continue Progress</h5>
                        <ul className="text-green-200 text-sm space-y-1">
                            <li>• 3+ reps at 95%</li>
                            <li>• Good bar speed</li>
                            <li>• Consistent performance</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reset Percentage Options */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
                    Reset Percentage Options
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-blue-300">90%</div>
                        <div className="text-blue-200 text-sm">First Reset</div>
                        <div className="text-gray-400 text-xs mt-1">Most common</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-yellow-300">85%</div>
                        <div className="text-yellow-200 text-sm">Second Reset</div>
                        <div className="text-gray-400 text-xs mt-1">Multiple stalls</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-red-300">80%</div>
                        <div className="text-red-200 text-sm">Third Reset</div>
                        <div className="text-gray-400 text-xs mt-1">Rare/injury</div>
                    </div>
                </div>
            </div>

            {/* Stall Analysis and Reset Decisions */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
                    Lift Analysis and Reset Decisions
                </h4>

                <div className="space-y-4">
                    {(schedule?.liftOrder || []).map((lift) => {
                        const currentTM = currentTrainingMaxes[lift] || 0;
                        const analysis = analyzeStall(lift);
                        const resetDecision = resetDecisions[lift];
                        const resetTM = resetTrainingMaxes[lift] || calculateResetTM(currentTM, 'first_reset');

                        return (
                            <div key={lift} className={`border rounded-lg p-4 ${analysis.isStalled ? 'border-red-500 bg-red-900/10' : 'border-gray-600'
                                }`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-medium text-white">
                                        {liftNames[lift]}
                                    </h5>
                                    <div className="text-sm text-gray-400">
                                        Current TM: {currentTM} lbs
                                    </div>
                                </div>

                                {/* Performance Analysis */}
                                <div className="mb-4 p-3 bg-gray-800 rounded">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-gray-300 text-sm">Analysis: </span>
                                            <span className={`text-sm ${analysis.color}`}>{analysis.reason}</span>
                                        </div>
                                        {analysis.isStalled && (
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                    {analysis.recommendation && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            Recommendation: {analysis.recommendation}
                                        </div>
                                    )}
                                </div>

                                {/* Reset Decision Buttons */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                    <button
                                        onClick={() => handleResetDecision(lift, 'first_reset')}
                                        className={`px-3 py-2 rounded text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 ${resetDecision === 'first_reset' ? 'ring-2 ring-white' : ''
                                            }`}
                                    >
                                        90% Reset
                                    </button>
                                    <button
                                        onClick={() => handleResetDecision(lift, 'second_reset')}
                                        className={`px-3 py-2 rounded text-white text-sm font-medium bg-yellow-600 hover:bg-yellow-700 ${resetDecision === 'second_reset' ? 'ring-2 ring-white' : ''
                                            }`}
                                    >
                                        85% Reset
                                    </button>
                                    <button
                                        onClick={() => handleResetDecision(lift, 'third_reset')}
                                        className={`px-3 py-2 rounded text-white text-sm font-medium bg-red-600 hover:bg-red-700 ${resetDecision === 'third_reset' ? 'ring-2 ring-white' : ''
                                            }`}
                                    >
                                        80% Reset
                                    </button>
                                    <button
                                        onClick={() => handleNoReset(lift)}
                                        className={`px-3 py-2 rounded text-white text-sm font-medium bg-green-600 hover:bg-green-700 ${resetDecision === 'no_reset' ? 'ring-2 ring-white' : ''
                                            }`}
                                    >
                                        No Reset
                                    </button>
                                </div>

                                {/* Reset TM Input (if reset selected) */}
                                {resetDecision && resetDecision !== 'no_reset' && (
                                    <div className="grid grid-cols-2 gap-4 p-3 bg-blue-900/20 border border-blue-600 rounded">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-300 mb-2">
                                                New Training Max
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5"
                                                className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={resetTM || ''}
                                                onChange={(e) => handleManualResetTM(lift, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="text-sm text-blue-200">
                                                <div>Original: {currentTM} lbs</div>
                                                <div>Reduction: {currentTM ? Math.round(((currentTM - resetTM) / currentTM) * 100) : 0}%</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reset Strategy Information */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <RotateCcw className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-300 font-medium mb-2">Reset Strategy - What to Expect</h4>
                        <ul className="text-yellow-200 text-sm space-y-1">
                            <li>• <strong>First 2-3 weeks:</strong> Weights will feel very easy - this is intentional</li>
                            <li>• <strong>Volume opportunity:</strong> Use lighter loads to perfect technique and add assistance work</li>
                            <li>• <strong>Rebuild confidence:</strong> Hit rep PRs again and regain momentum</li>
                            <li>• <strong>Progressive return:</strong> You'll surpass your previous best within 2-3 cycles</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reset Summary */}
            {getResetCount() > 0 && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Reset Summary</h4>
                    <div className="text-sm text-gray-300">
                        <span className="font-medium">{getResetCount()}</span> lift(s) scheduled for reset.
                        This will help break through plateaus and rebuild momentum.
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Stall Analysis Complete! Reset decisions made for all lifts.
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        {getResetCount() === 0
                            ? "No resets needed - continue with normal progression."
                            : "Strategic resets will help break plateaus and rebuild momentum."
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
