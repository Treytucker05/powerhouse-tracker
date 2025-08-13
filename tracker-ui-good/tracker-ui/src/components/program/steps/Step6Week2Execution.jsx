import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight } from '../../../lib/fiveThreeOne/math.js';
import { Target, TrendingUp, CheckCircle, Info, AlertTriangle, Calendar, Zap } from 'lucide-react';

export default function Step6Week2Execution({ data = {}, updateData }) {
    const { roundingIncrement } = useSettings();
    // State management with proper fallbacks
    const [week2Results, setWeek2Results] = useState(data?.week2Results || {});
    const [currentSession, setCurrentSession] = useState(data?.currentSession || null);

    // Integration with previous steps - all with safe fallbacks
    const trainingMaxes = data?.trainingMaxes || {};
    const loadingOption = data?.loadingOption || 1;
    const schedule = data?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] };

    // Week 2 percentages based on loading option
    const week2Percentages = loadingOption === 1
        ? [70, 80, 90]  // Option 1 (Default)
        : [80, 85, 90]; // Option 2 (Higher Intensity)

    const week2Reps = [3, 3, 3]; // 3+ on last set

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

    // Handle AMRAP result input
    const handleAmrapResult = (lift, reps) => {
        const newResults = {
            ...week2Results,
            [lift]: {
                ...week2Results[lift],
                amrapReps: parseInt(reps) || 0,
                completed: true,
                date: new Date().toISOString().split('T')[0]
            }
        };
        setWeek2Results(newResults);
        updateStepData({ week2Results: newResults });
    };

    // Handle session notes
    const handleNotes = (lift, notes) => {
        const newResults = {
            ...week2Results,
            [lift]: {
                ...week2Results[lift],
                notes: notes
            }
        };
        setWeek2Results(newResults);
        updateStepData({ week2Results: newResults });
    };

    const updateStepData = (updates) => {
        if (updateData) {
            updateData({
                week2Results: week2Results || {},
                currentSession: currentSession || null,
                ...updates
            });
        }
    };

    // Calculate estimated 1RM from AMRAP
    const calculateEstimated1RM = (weight, reps) => {
        if (!weight || !reps) return 0;
        return Math.round(weight * reps * 0.0333 + weight);
    };

    // Check if step is complete
    const isStepComplete = () => {
        const liftOrder = schedule?.liftOrder || [];
        return liftOrder.length > 0 && liftOrder.every(lift =>
            week2Results[lift]?.completed
        );
    };

    // Check for PRs
    const isPR = (lift, reps) => {
        const week1Results = data?.week1Results || {};
        const week1Reps = week1Results[lift]?.amrapReps || 0;
        return reps > week1Reps;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 6: Week 2 – "5/3/1" Week Execution
                </h3>
                <p className="text-gray-400">
                    Higher intensity week with 3-rep sets. Focus on explosive movement and push the AMRAP set.
                </p>
            </div>

            {/* Philosophy/Info Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Week 2 Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Intensity focus:</strong> Higher percentages with lower reps</li>
                            <li>• <strong>AMRAP target:</strong> Aim for 5+ reps on the 90% set</li>
                            <li>• <strong>Bar speed:</strong> Keep all reps explosive and controlled</li>
                            <li>• <strong>Recovery:</strong> Longer rest between sets (3-5 minutes)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Week 2 Percentages Display */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 text-red-400 mr-2" />
                    Week 2 Loading (Option {loadingOption})
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {week2Percentages.map((percentage, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{percentage}%</div>
                            <div className="text-gray-400">
                                {week2Reps[index]}{index === 2 ? '+' : ''} reps
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Set {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout Sessions */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-red-400 mr-2" />
                    Week 2 Workout Sessions
                </h4>

                <div className="space-y-4">
                    {(schedule?.liftOrder || []).map((lift, index) => {
                        const tm = trainingMaxes[lift] || 0;
                        const isCompleted = week2Results[lift]?.completed;
                        const amrapReps = week2Results[lift]?.amrapReps || 0;
                        const amrapWeight = calculateWeight(tm, week2Percentages[2]);
                        const estimated1RM = calculateEstimated1RM(amrapWeight, amrapReps);

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
                                    <h6 className="text-sm font-medium text-gray-300 mb-2">Working Sets:</h6>
                                    <div className="grid grid-cols-3 gap-2">
                                        {week2Percentages.map((percentage, setIndex) => (
                                            <div key={setIndex} className={`p-3 rounded ${setIndex === 2 ? 'bg-red-900/30 border border-red-600' : 'bg-gray-800'
                                                }`}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-white">
                                                        {calculateWeight(tm, percentage)} lbs
                                                    </div>
                                                    <div className="text-gray-400">
                                                        {percentage}% × {week2Reps[setIndex]}{setIndex === 2 ? '+' : ''}
                                                    </div>
                                                    {setIndex === 2 && (
                                                        <div className="text-xs text-red-400 mt-1">
                                                            AMRAP SET
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AMRAP input */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            AMRAP Reps Achieved
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={amrapReps || ''}
                                            onChange={(e) => handleAmrapResult(lift, e.target.value)}
                                            placeholder="Enter reps completed"
                                        />
                                        {amrapReps > 0 && (
                                            <div className="mt-2 text-sm">
                                                <div className={`${isPR(lift, amrapReps) ? 'text-green-400' : 'text-gray-400'}`}>
                                                    {isPR(lift, amrapReps) && <span className="text-green-400">🎉 PR! </span>}
                                                    Estimated 1RM: {estimated1RM} lbs
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Session Notes
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={week2Results[lift]?.notes || ''}
                                            onChange={(e) => handleNotes(lift, e.target.value)}
                                            placeholder="Form cues, RPE, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Performance Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-300 font-medium mb-2">Week 2 Performance Guidelines</h4>
                        <ul className="text-yellow-200 text-sm space-y-1">
                            <li>• <strong>Minimum target:</strong> 3 reps on AMRAP set (meeting the base requirement)</li>
                            <li>• <strong>Good performance:</strong> 5+ reps on AMRAP set</li>
                            <li>• <strong>Excellent performance:</strong> 7+ reps (indicates room for TM increase)</li>
                            <li>• <strong>Stop when:</strong> Bar speed slows significantly or form breaks down</li>
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
                            Week 2 Complete! Ready to move to Week 3 – the heaviest week of the cycle.
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        All AMRAP sets logged. Review your performance and prepare for the intensity of Week 3.
                    </div>
                </div>
            )}
        </div>
    );
}
