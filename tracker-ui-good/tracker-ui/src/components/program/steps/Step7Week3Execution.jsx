import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight, e1RM as calcE1RM } from '../../../lib/fiveThreeOne/math.js';
import { Target, CheckCircle, Info, AlertTriangle, Calendar, Zap, Trophy } from 'lucide-react';

export default function Step7Week3Execution({ data = {}, updateData }) {
    const { roundingIncrement } = useSettings();
    // Local state with safe fallbacks
    const [week3Results, setWeek3Results] = useState(data?.week3Results || {});

    // Threaded inputs from prior steps (defensive defaults)
    const trainingMaxes = data?.trainingMaxes || {};
    const loadingOption = data?.loadingOption || 1;
    const schedule = data?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] };
    const week2Results = data?.week2Results || {}; // for PR comparison via e1RM

    // Week 3 percentages and reps
    // Option 1 (default): 75%, 85%, 95% (1+)
    // Option 2 (heavier ramp): 85%, 90%, 95% (1+)
    const week3Percentages = loadingOption === 1 ? [75, 85, 95] : [85, 90, 95];
    const week3Reps = [5, 3, 1]; // Last set is 1+

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Round up to nearest 5 lbs to stay conservative on heavy week
    const calculateWeight = (tm, percentage) => {
        if (!tm) return 0;
        return toDisplayWeight(percentOfTM(tm, percentage, roundingIncrement));
    };

    const updateStepData = (updates) => {
        if (!updateData) return;
        updateData({
            week3Results: week3Results || {},
            ...updates
        });
    };

    const handleAmrapResult = (lift, reps) => {
        const sanitized = Math.max(0, parseInt(reps) || 0);
        const newResults = {
            ...week3Results,
            [lift]: {
                ...week3Results[lift],
                amrapReps: sanitized,
                completed: true,
                date: new Date().toISOString().split('T')[0]
            }
        };
        setWeek3Results(newResults);
        updateStepData({ week3Results: newResults });
    };

    const handleNotes = (lift, notes) => {
        const newResults = {
            ...week3Results,
            [lift]: {
                ...week3Results[lift],
                notes
            }
        };
        setWeek3Results(newResults);
        updateStepData({ week3Results: newResults });
    };

    // Estimated 1RM via Epley
    const e1rm = (weight, reps) => calcE1RM(weight, reps);

    // PR if current e1RM exceeds last week's e1RM
    const isPR = (lift, week3E1RM) => {
        const lastWeekWeight = calculateWeight(trainingMaxes[lift] || 0, 90);
        const lastWeekReps = week2Results?.[lift]?.amrapReps || 0;
        const lastWeekE1RM = e1rm(lastWeekWeight, lastWeekReps);
        return week3E1RM > (lastWeekE1RM || 0);
    };

    const isStepComplete = () => {
        const order = Array.isArray(schedule?.liftOrder) ? schedule.liftOrder : [];
        if (order.length === 0) return false;
        return order.every(l => week3Results?.[l]?.completed);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 7: Week 3 – "1+" Week Execution
                </h3>
                <p className="text-gray-400">
                    Peak intensity week. Execute strong singles and push the final AMRAP set intelligently.
                </p>
            </div>

            {/* Philosophy/Info Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Week 3 Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Intensity:</strong> Heaviest week of the cycle</li>
                            <li>• <strong>Last set:</strong> 95% for 1+ reps — quality over quantity</li>
                            <li>• <strong>Rest:</strong> Take longer rests (3–6 min) before the AMRAP</li>
                            <li>• <strong>Mindset:</strong> Solid single, then push for extra reps if bar speed allows</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Week 3 Percentages Display */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 text-red-400 mr-2" />
                    Week 3 Loading (Option {loadingOption})
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {week3Percentages.map((percentage, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white">{percentage}%</div>
                            <div className="text-gray-400">
                                {week3Reps[index]}{index === 2 ? '+' : ''} reps
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Set {index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout Sessions */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-red-400 mr-2" />
                    Week 3 Workout Sessions
                </h4>

                <div className="space-y-4">
                    {(schedule?.liftOrder || []).map((lift, index) => {
                        const tm = trainingMaxes[lift] || 0;
                        const isCompleted = week3Results[lift]?.completed;
                        const amrapReps = week3Results[lift]?.amrapReps || 0;
                        const amrapWeight = calculateWeight(tm, week3Percentages[2]);
                        const estimated1RM = e1rm(amrapWeight, amrapReps);
                        const gotPR = amrapReps > 0 && isPR(lift, estimated1RM);

                        return (
                            <div key={lift} className={`border rounded-lg p-4 ${isCompleted ? 'border-green-500 bg-green-900/10' : 'border-gray-600'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-medium text-white flex items-center">
                                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-400 mr-2" />}
                                        Day {index + 1}: {liftNames[lift]}
                                    </h5>
                                    <div className="text-sm text-gray-400">TM: {tm} lbs</div>
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
                                        {week3Percentages.map((percentage, setIndex) => (
                                            <div key={setIndex} className={`p-3 rounded ${setIndex === 2 ? 'bg-red-900/30 border border-red-600' : 'bg-gray-800'}`}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-white">{calculateWeight(tm, percentage)} lbs</div>
                                                    <div className="text-gray-400">{percentage}% × {week3Reps[setIndex]}{setIndex === 2 ? '+' : ''}</div>
                                                    {setIndex === 2 && (
                                                        <div className="text-xs text-red-400 mt-1">AMRAP SET</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AMRAP input & notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">AMRAP Reps Achieved</label>
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
                                                <div className={`${isPR(lift, estimated1RM) ? 'text-green-400' : 'text-gray-400'}`}>
                                                    {gotPR && <span className="inline-flex items-center text-green-400"><Trophy className="w-4 h-4 mr-1" /> PR! </span>}
                                                    Estimated 1RM: {estimated1RM} lbs
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Session Notes</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={week3Results[lift]?.notes || ''}
                                            onChange={(e) => handleNotes(lift, e.target.value)}
                                            placeholder="Form cues, RPE, bar speed, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Safety and Mental Prep */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <h4 className="text-yellow-300 font-medium mb-2">Safety Guidelines</h4>
                            <ul className="text-yellow-200 text-sm space-y-1">
                                <li>• Treat the first rep like a meet single: tight brace, perfect setup</li>
                                <li>• Stop the AMRAP when bar speed drops sharply or technique degrades</li>
                                <li>• Rest 3–6 minutes before the last set</li>
                                <li>• Use spotters/safeties as needed</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-900/20 border border-purple-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                            <h4 className="text-purple-300 font-medium mb-2">Mental Prep</h4>
                            <ul className="text-purple-200 text-sm space-y-1">
                                <li>• Visualize a clean single before the set</li>
                                <li>• Use a consistent cue checklist</li>
                                <li>• Commit to bar speed; don’t chase ugly reps</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Week 3 Complete! Deload next or begin next cycle as planned.
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        All AMRAP sets logged. Review e1RMs to guide TM adjustments.
                    </div>
                </div>
            )}
        </div>
    );
}
