import React from 'react';
import { Volume2, Target, TrendingUp, BarChart3 } from 'lucide-react';

const VolumeLandmarksStep = ({ assessmentData, onInputChange }) => {
    const handleNestedChange = (section, field, subfield, value) => {
        const newData = {
            ...assessmentData,
            [section]: {
                ...assessmentData[section],
                [field]: {
                    ...assessmentData[section][field],
                    [subfield]: parseFloat(value) || 0
                }
            }
        };
        onInputChange(newData);
    };

    const handleWeeklyVolumeChange = (value) => {
        const newData = {
            ...assessmentData,
            volumeLandmarks: {
                ...assessmentData.volumeLandmarks,
                weeklyVolume: parseFloat(value) || 0
            }
        };
        onInputChange(newData);
    };

    const calculateIncrease = (current, target) => {
        if (current && target && current > 0) {
            return ((target - current) / current * 100).toFixed(1);
        }
        return 0;
    };

    const getIncreaseColor = (increase) => {
        if (increase <= 10) return 'text-green-400';
        if (increase <= 25) return 'text-yellow-400';
        return 'text-red-400';
    };

    const lifts = [
        { key: 'benchPress', label: 'Bench Press', icon: Target },
        { key: 'squat', label: 'Squat', icon: TrendingUp },
        { key: 'deadlift', label: 'Deadlift', icon: BarChart3 }
    ];

    const totalCurrent = Object.values(assessmentData.volumeLandmarks)
        .filter(item => typeof item === 'object' && item.current)
        .reduce((sum, item) => sum + item.current, 0);

    const totalTarget = Object.values(assessmentData.volumeLandmarks)
        .filter(item => typeof item === 'object' && item.target)
        .reduce((sum, item) => sum + item.target, 0);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <Volume2 className="h-6 w-6 text-purple-500" />
                <div>
                    <h3 className="text-xl font-semibold text-white">Volume Landmarks</h3>
                    <p className="text-gray-400">Set your current maxes and target goals for the big 3 lifts</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Big 3 Lifts */}
                {lifts.map((lift) => {
                    const IconComponent = lift.icon;
                    const current = assessmentData.volumeLandmarks[lift.key]?.current || 0;
                    const target = assessmentData.volumeLandmarks[lift.key]?.target || 0;
                    const increase = calculateIncrease(current, target);

                    return (
                        <div key={lift.key} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconComponent className="h-5 w-5 text-blue-400" />
                                <h4 className="text-md font-semibold text-white">{lift.label}</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Current Max */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Current 1RM (lbs)
                                    </label>
                                    <input
                                        type="number"
                                        value={current || ''}
                                        onChange={(e) => handleNestedChange('volumeLandmarks', lift.key, 'current', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Current max"
                                    />
                                </div>

                                {/* Target Max */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Target 1RM (lbs)
                                    </label>
                                    <input
                                        type="number"
                                        value={target || ''}
                                        onChange={(e) => handleNestedChange('volumeLandmarks', lift.key, 'target', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Target max"
                                    />
                                </div>

                                {/* Increase Percentage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Increase
                                    </label>
                                    <div className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md">
                                        <span className={`font-medium ${getIncreaseColor(increase)}`}>
                                            {increase > 0 ? `+${increase}%` : 'Set targets'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {current > 0 && target > 0 && (
                                <div className="mt-3">
                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Weekly Volume */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-3">Training Volume</h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preferred Weekly Training Days
                        </label>
                        <select
                            value={assessmentData.volumeLandmarks.weeklyVolume || ''}
                            onChange={(e) => handleWeeklyVolumeChange(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select training frequency</option>
                            <option value="3">3 days/week</option>
                            <option value="4">4 days/week</option>
                            <option value="5">5 days/week</option>
                            <option value="6">6 days/week</option>
                        </select>
                    </div>
                </div>

                {/* Summary */}
                {totalCurrent > 0 && totalTarget > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-blue-400 mb-3">Powerlifting Total Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-gray-300">Current Total</div>
                                <div className="text-xl font-bold text-white">{totalCurrent} lbs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-300">Target Total</div>
                                <div className="text-xl font-bold text-green-400">{totalTarget} lbs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-300">Total Increase</div>
                                <div className="text-xl font-bold text-blue-400">+{totalTarget - totalCurrent} lbs</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Guidelines */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">Volume Landmark Guidelines</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                        <li>• <span className="text-green-400">Conservative (5-10% increase):</span> Sustainable, lower injury risk</li>
                        <li>• <span className="text-yellow-400">Moderate (10-25% increase):</span> Challenging but achievable</li>
                        <li>• <span className="text-red-400">Aggressive (25%+ increase):</span> High risk, requires perfect programming</li>
                        <li>• Consider your timeline when setting targets</li>
                        <li>• Beginners can often achieve higher percentage increases</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VolumeLandmarksStep;
