import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { roundToIncrement } from '../../../lib/fiveThreeOne/math.js';
import { TrendingUp, Calculator, CheckCircle, Info, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';

export default function Step9CycleProgression({ data = {}, updateData }) {
    const { roundingIncrement } = useSettings();
    // State management with proper fallbacks
    const [newTrainingMaxes, setNewTrainingMaxes] = useState(data?.newTrainingMaxes || {});
    const [progressionDecisions, setProgressionDecisions] = useState(data?.progressionDecisions || {});
    const [cyclePerformance, setCyclePerformance] = useState(data?.cyclePerformance || {});
    const [nextCycleReady, setNextCycleReady] = useState(false);

    // Integration with previous steps - all with safe fallbacks
    const currentTrainingMaxes = data?.trainingMaxes || {};
    const week3Results = data?.week3Results || {};
    const schedule = data?.schedule || { frequency: '4day', liftOrder: ['press', 'deadlift', 'bench', 'squat'] };

    // Standard increment rules
    const incrementRules = {
        press: 5,  // Upper body
        bench: 5,           // Upper body
        squat: 10,          // Lower body
        deadlift: 10        // Lower body
    };

    // Use central rounding helper directly (previously wrapped by local roundToNearest5)
    const round = (weight) => roundToIncrement(weight, roundingIncrement);

    // Calculate new training max with standard increment
    const calculateNewTM = (currentTM, lift) => {
        if (!currentTM) return 0;
        const increment = incrementRules[lift] || 5;
        return round(currentTM + increment);
    };

    // Lift names mapping
    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        press: 'Overhead Press'
    };

    // Get lift category for increment rules
    const getLiftCategory = (lift) => {
        return ['press', 'bench'].includes(lift) ? 'Upper Body' : 'Lower Body';
    };

    // Analyze Week 3 performance for progression recommendations
    const analyzePerformance = (lift) => {
        const week3Data = week3Results[lift];
        if (!week3Data || !week3Data.amrapReps) {
            return { recommendation: 'standard', reason: 'No Week 3 data available' };
        }

        const reps = week3Data.amrapReps;

        if (reps >= 5) {
            return {
                recommendation: 'increase',
                reason: `Excellent performance (${reps} reps at 95%)`,
                color: 'text-green-400'
            };
        } else if (reps >= 3) {
            return {
                recommendation: 'standard',
                reason: `Good performance (${reps} reps at 95%)`,
                color: 'text-blue-400'
            };
        } else if (reps >= 1) {
            return {
                recommendation: 'conservative',
                reason: `Minimum performance (${reps} rep at 95%)`,
                color: 'text-yellow-400'
            };
        } else {
            return {
                recommendation: 'reduce',
                reason: 'Failed to achieve minimum at 95%',
                color: 'text-red-400'
            };
        }
    };

    // Handle manual TM adjustment
    const handleManualTM = (lift, value) => {
        const newTMs = {
            ...newTrainingMaxes,
            [lift]: round(parseInt(value) || 0)
        };
        setNewTrainingMaxes(newTMs);
        updateStepData({ newTrainingMaxes: newTMs });
    };

    // Handle progression decision
    const handleProgressionDecision = (lift, decision) => {
        const currentTM = currentTrainingMaxes[lift] || 0;
        let newTM;

        switch (decision) {
            case 'increase':
                newTM = round(currentTM + (incrementRules[lift] * 1.5)); // 1.5x normal increment
                break;
            case 'standard':
                newTM = calculateNewTM(currentTM, lift);
                break;
            case 'conservative':
                newTM = round(currentTM + (incrementRules[lift] * 0.5)); // Half increment
                break;
            case 'maintain':
                newTM = currentTM;
                break;
            case 'reduce':
                newTM = round(currentTM * 0.9); // 90% of current
                break;
            default:
                newTM = calculateNewTM(currentTM, lift);
        }

        const newDecisions = { ...progressionDecisions, [lift]: decision };
        const newTMs = { ...newTrainingMaxes, [lift]: newTM };

        setProgressionDecisions(newDecisions);
        setNewTrainingMaxes(newTMs);
        updateStepData({
            progressionDecisions: newDecisions,
            newTrainingMaxes: newTMs
        });
    };

    // Initialize new training maxes on component mount
    useEffect(() => {
        const initialized = {};
        let allInitialized = true;

        (schedule?.liftOrder || []).forEach(lift => {
            if (!newTrainingMaxes[lift] && currentTrainingMaxes[lift]) {
                initialized[lift] = calculateNewTM(currentTrainingMaxes[lift], lift);
            } else if (newTrainingMaxes[lift]) {
                initialized[lift] = newTrainingMaxes[lift];
            } else {
                allInitialized = false;
            }
        });

        if (Object.keys(initialized).length > 0) {
            setNewTrainingMaxes(prev => ({ ...prev, ...initialized }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrainingMaxes, schedule?.liftOrder]);

    const updateStepData = (updates) => {
        if (updateData) {
            updateData({
                newTrainingMaxes: newTrainingMaxes || {},
                progressionDecisions: progressionDecisions || {},
                cyclePerformance: cyclePerformance || {},
                nextCycleReady,
                ...updates
            });
        }
    };

    // Check if step is complete
    const isStepComplete = () => {
        const liftOrder = schedule?.liftOrder || [];
        return liftOrder.length > 0 && liftOrder.every(lift =>
            newTrainingMaxes[lift] && newTrainingMaxes[lift] > 0
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 9: Cycle Progression – Increase Training Max
                </h3>
                <p className="text-gray-400">
                    Analyze your cycle performance and set new training maxes for the next 4-week cycle.
                </p>
            </div>

            {/* Philosophy/Info Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Progression Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Slow and steady:</strong> Small, consistent increases build long-term strength</li>
                            <li>• <strong>Performance-based:</strong> Week 3 AMRAP results guide progression decisions</li>
                            <li>• <strong>Conservative approach:</strong> Better to progress too slowly than too quickly</li>
                            <li>• <strong>Individual lifts:</strong> Each lift progresses independently based on performance</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Standard Increment Rules */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Calculator className="w-5 h-5 text-green-400 mr-2" />
                    Standard Increment Rules
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-green-300 font-medium mb-2">Upper Body Lifts</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Overhead Press:</span>
                                <span className="text-white">+5 lbs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Bench Press:</span>
                                <span className="text-white">+5 lbs</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h5 className="text-green-300 font-medium mb-2">Lower Body Lifts</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Squat:</span>
                                <span className="text-white">+10 lbs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Deadlift:</span>
                                <span className="text-white">+10 lbs</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-sm text-gray-400 text-center">
                    All weights automatically rounded to nearest 5 lbs
                </div>
            </div>

            {/* Training Max Progression */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
                    Training Max Progression
                </h4>

                <div className="space-y-4">
                    {(schedule?.liftOrder || []).map((lift, index) => {
                        const currentTM = currentTrainingMaxes[lift] || 0;
                        const newTM = newTrainingMaxes[lift] || calculateNewTM(currentTM, lift);
                        const performance = analyzePerformance(lift);
                        const standardIncrement = incrementRules[lift];

                        return (
                            <div key={lift} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-medium text-white">
                                        {liftNames[lift]}
                                    </h5>
                                    <div className="text-sm text-gray-400">
                                        {getLiftCategory(lift)} (+{standardIncrement} lbs standard)
                                    </div>
                                </div>

                                {/* Current vs New TM */}
                                <div className="grid grid-cols-3 gap-4 mb-4 items-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-400 mb-1">Current TM</div>
                                        <div className="text-xl font-bold text-white">{currentTM} lbs</div>
                                    </div>
                                    <div className="text-center">
                                        <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-400 mb-1">New TM</div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="5"
                                            className="w-20 bg-gray-800 border border-gray-600 text-white text-xl font-bold text-center px-2 py-1 rounded focus:border-red-500 focus:outline-none"
                                            value={newTM || ''}
                                            onChange={(e) => handleManualTM(lift, e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Performance Analysis */}
                                <div className="mb-4 p-3 bg-gray-800 rounded">
                                    <div className="text-sm">
                                        <span className="text-gray-300">Week 3 Performance: </span>
                                        <span className={performance.color}>{performance.reason}</span>
                                    </div>
                                </div>

                                {/* Progression Options */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {[
                                        { key: 'increase', label: '+1.5x', color: 'bg-green-600 hover:bg-green-700' },
                                        { key: 'standard', label: 'Standard', color: 'bg-blue-600 hover:bg-blue-700' },
                                        { key: 'conservative', label: '+0.5x', color: 'bg-yellow-600 hover:bg-yellow-700' },
                                        { key: 'maintain', label: 'Maintain', color: 'bg-gray-600 hover:bg-gray-700' },
                                        { key: 'reduce', label: 'Reduce', color: 'bg-red-600 hover:bg-red-700' }
                                    ].map(option => (
                                        <button
                                            key={option.key}
                                            onClick={() => handleProgressionDecision(lift, option.key)}
                                            className={`px-3 py-2 rounded text-white text-sm font-medium ${option.color} ${progressionDecisions[lift] === option.key ? 'ring-2 ring-white' : ''
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progression Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-300 font-medium mb-2">Progression Decision Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-200 text-sm">
                            <div>
                                <ul className="space-y-1">
                                    <li>• <strong>+1.5x:</strong> 5+ reps at 95% (excellent performance)</li>
                                    <li>• <strong>Standard:</strong> 3-4 reps at 95% (good performance)</li>
                                    <li>• <strong>+0.5x:</strong> 1-2 reps at 95% (minimum performance)</li>
                                </ul>
                            </div>
                            <div>
                                <ul className="space-y-1">
                                    <li>• <strong>Maintain:</strong> Technique focus cycle</li>
                                    <li>• <strong>Reduce:</strong> Failed 95% or missed sessions</li>
                                    <li>• <strong>Remember:</strong> Conservative progression builds long-term strength</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Cycle Preview */}
            {isStepComplete() && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                        <RotateCcw className="w-5 h-5 text-green-400 mr-2" />
                        Next Cycle Preview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(schedule?.liftOrder || []).map(lift => (
                            <div key={lift} className="bg-gray-800 p-3 rounded text-center">
                                <div className="text-sm text-gray-400 mb-1">{liftNames[lift]}</div>
                                <div className="text-lg font-bold text-green-400">
                                    {newTrainingMaxes[lift]} lbs
                                </div>
                                <div className="text-xs text-gray-500">
                                    Week 1 top set: {Math.ceil((newTrainingMaxes[lift] * 0.85) / 5) * 5} lbs
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Training Max Progression Complete! Ready to begin your next 4-week cycle.
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        New training maxes set based on performance. Continue building strength systematically.
                    </div>
                </div>
            )}
        </div>
    );
}
