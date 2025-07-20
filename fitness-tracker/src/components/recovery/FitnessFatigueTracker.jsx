import React, { useState, useEffect } from 'react';
import { useRecoveryMonitor } from '../../hooks/useRecoveryMonitor';
import { useProgramContext } from '../../contexts/ProgramContext';

/**
 * FitnessFatigueTracker Component
 * 
 * Implements Bryant's Fitness-Fatigue Model with:
 * - Real-time fitness and fatigue tracking
 * - Net readiness calculation
 * - Automated deload recommendations
 * - Visual progress indicators
 */

const FitnessFatigueTracker = () => {
    const { recoveryData, monitorRecovery, autoDeloadCheck } = useRecoveryMonitor();
    const { state } = useProgramContext();
    const [currentWeek, setCurrentWeek] = useState(1);
    const [fatigueInputs, setFatigueInputs] = useState({
        fuel: 3,
        nervous: 3,
        messengers: 3,
        tissues: 3
    });

    // Calculate current recovery status
    const recoveryStatus = monitorRecovery(currentWeek, fatigueInputs);
    const { fitnessScore, fatigueScore, netReadiness } = recoveryData;

    // Determine readiness status
    const getReadinessStatus = (readiness) => {
        if (readiness >= 80) return { status: 'excellent', color: 'text-green-400', bg: 'bg-green-900/20' };
        if (readiness >= 65) return { status: 'good', color: 'text-blue-400', bg: 'bg-blue-900/20' };
        if (readiness >= 50) return { status: 'moderate', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
        if (readiness >= 35) return { status: 'low', color: 'text-orange-400', bg: 'bg-orange-900/20' };
        return { status: 'poor', color: 'text-red-400', bg: 'bg-red-900/20' };
    };

    const readinessInfo = getReadinessStatus(netReadiness);

    // Handle fatigue input changes
    const handleFatigueChange = (category, value) => {
        setFatigueInputs(prev => ({
            ...prev,
            [category]: parseInt(value)
        }));
    };

    // Deload recommendation component
    const DeloadRecommendation = ({ recommendation }) => {
        if (!recommendation.recommended) return null;

        return (
            <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-lg font-semibold text-orange-400">
                        Deload Recommended
                    </h4>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-300 mb-2">
                            <strong>Type:</strong> {recommendation.type}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                            <strong>Duration:</strong> {recommendation.duration}
                        </p>
                        <p className="text-sm text-gray-300">
                            <strong>Volume Reduction:</strong> {Math.round((1 - recommendation.volumeReduction) * 100)}%
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400 mb-2">
                            {recommendation.reasoning}
                        </p>

                        <div className="space-y-1">
                            {recommendation.recommendations?.slice(0, 3).map((rec, index) => (
                                <p key={index} className="text-xs text-gray-300">
                                    • {rec}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Progress bar component
    const ProgressBar = ({ value, max, label, color }) => (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300">{label}</span>
                <span className="text-sm font-medium text-white">{value}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                />
            </div>
        </div>
    );

    // Fatigue input slider
    const FatigueSlider = ({ category, value, onChange }) => {
        const labels = {
            fuel: { title: 'Fuel (Energy)', desc: 'Overall energy levels and motivation' },
            nervous: { title: 'Nervous System', desc: 'Mental fatigue and coordination' },
            messengers: { title: 'Hormonal', desc: 'Hormonal stress and recovery' },
            tissues: { title: 'Tissue Damage', desc: 'Muscle soreness and joint stiffness' }
        };

        const getColor = (val) => {
            if (val <= 3) return 'text-green-400';
            if (val <= 6) return 'text-yellow-400';
            return 'text-red-400';
        };

        return (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h5 className="text-sm font-medium text-white">{labels[category].title}</h5>
                        <p className="text-xs text-gray-400">{labels[category].desc}</p>
                    </div>
                    <span className={`text-sm font-bold ${getColor(value)}`}>
                        {value}/10
                    </span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(category, e.target.value)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Excellent</span>
                    <span>Moderate</span>
                    <span>Poor</span>
                </div>
            </div>
        );
    };

    return (
        <div className="fitness-fatigue-model space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Training Readiness Dashboard
                </h3>
                <p className="text-gray-400">
                    Fitness-Fatigue Model • Week {currentWeek}
                </p>
            </div>

            {/* Main Readiness Display */}
            <div className={`${readinessInfo.bg} border border-gray-600 rounded-lg p-6 text-center`}>
                <div className="mb-4">
                    <div className="text-6xl font-bold text-white mb-2">
                        {netReadiness}%
                    </div>
                    <div className={`text-lg font-medium ${readinessInfo.color}`}>
                        {readinessInfo.status.toUpperCase()} READINESS
                    </div>
                </div>

                {/* Fitness vs Fatigue Breakdown */}
                <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-400 mb-2">
                            💪 FITNESS LEVEL
                        </h4>
                        <div className="text-2xl font-bold text-white">
                            {fitnessScore}%
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Long-term training adaptations
                        </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-red-400 mb-2">
                            😴 FATIGUE LEVEL
                        </h4>
                        <div className="text-2xl font-bold text-white">
                            {fatigueScore}%
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Accumulated training stress
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Progress Bars */}
            <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Detailed Tracking</h4>

                <ProgressBar
                    value={fitnessScore}
                    max={100}
                    label="Fitness Development"
                    color="bg-blue-600"
                />
                <ProgressBar
                    value={fatigueScore}
                    max={100}
                    label="Fatigue Accumulation"
                    color="bg-red-600"
                />
                <ProgressBar
                    value={netReadiness}
                    max={100}
                    label="Net Training Readiness"
                    color="bg-green-600"
                />
            </div>

            {/* Weekly Settings */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Week Selector */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Current Week</h4>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                            -
                        </button>
                        <span className="text-white font-medium px-4">Week {currentWeek}</span>
                        <button
                            onClick={() => setCurrentWeek(currentWeek + 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Recovery Capacity */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Recovery Status</h4>
                    <div className="text-sm text-gray-300">
                        <p><strong>Capacity:</strong> {recoveryStatus.recoveryCapacity}</p>
                        <p><strong>Next Deload:</strong> {recoveryStatus.deloadRecommendation.nextScheduled || 'As needed'}</p>
                    </div>
                </div>
            </div>

            {/* Fatigue Assessment Input */}
            <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">
                    Daily Fatigue Assessment
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                    Rate your current state (1 = Excellent, 10 = Very Poor)
                </p>

                <div className="space-y-4">
                    {Object.keys(fatigueInputs).map(category => (
                        <FatigueSlider
                            key={category}
                            category={category}
                            value={fatigueInputs[category]}
                            onChange={handleFatigueChange}
                        />
                    ))}
                </div>
            </div>

            {/* Deload Recommendation */}
            <DeloadRecommendation recommendation={recoveryStatus.deloadRecommendation} />

            {/* Recommendations */}
            <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">
                    Current Recommendations
                </h4>
                <div className="space-y-2">
                    {recoveryStatus.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <p className="text-sm text-gray-300">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FitnessFatigueTracker;
