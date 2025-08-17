import React, { useState, useMemo } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { nextTM, passedAmrapWk3, LIFTS } from '../../calc.js';
import { advanceCycleSelective } from '../../progression.js';
import {
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
    Calculator, BarChart3, Target, Info, Clock, Zap
} from 'lucide-react';

// Enhanced estimation functions for intelligent progression
function estimateOneRM(weight, reps) {
    if (!weight || !reps || reps <= 0) return 0;
    // Epley formula: 1RM = weight * (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
}

function calculateProgressionRecommendation(lift, currentTM, recentPerformance, units, userProfile = {}) {
    const { experience = 'intermediate', size = 'average', postReset = false } = userProfile;

    // Base increments per Wendler
    const upper = ["bench", "press"].includes(lift);
    const standardInc = units === "kg" ? (upper ? 2.5 : 5) : (upper ? 5 : 10);
    const conservativeInc = units === "kg" ? (upper ? 1.25 : 2.5) : (upper ? 2.5 : 5);

    // Recommendation logic based on profile and performance
    let recommendedInc = standardInc;
    let reason = "Standard progression";

    if (experience === 'advanced' || size === 'smaller' || postReset) {
        recommendedInc = conservativeInc;
        reason = experience === 'advanced' ? "Advanced lifter - conservative approach" :
            size === 'smaller' ? "Smaller increments for smaller lifters" :
                "Post-reset - rebuild carefully";
    }

    // Performance-based adjustment
    if (recentPerformance) {
        const { trend, stallRisk } = recentPerformance;
        if (stallRisk === 'high') {
            recommendedInc = 0; // Hold TM
            reason = "High stall risk - hold current TM";
        } else if (trend === 'declining') {
            recommendedInc = conservativeInc;
            reason = "Declining performance - use conservative increment";
        }
    }

    return { recommendedInc, reason, standardInc, conservativeInc };
}

function analyzePerformanceHistory(history, lift) {
    if (!history || history.length < 2) {
        return { trend: 'unknown', stallRisk: 'low', estimatedMax: null };
    }

    // Get last 3 cycles of data for this lift
    const recentCycles = history.slice(-3);
    const performances = recentCycles
        .map(cycle => cycle.amrapWk3?.[lift])
        .filter(reps => reps != null);

    if (performances.length < 2) {
        return { trend: 'unknown', stallRisk: 'low', estimatedMax: null };
    }

    // Analyze trend
    const recent = performances.slice(-2);
    const trend = recent[1] > recent[0] ? 'improving' :
        recent[1] < recent[0] ? 'declining' : 'stable';

    // Assess stall risk
    const missedMinimum = performances.some(reps => reps < 1);
    const decliningPattern = performances.length >= 3 &&
        performances[2] < performances[1] && performances[1] < performances[0];

    const stallRisk = missedMinimum || decliningPattern ? 'high' :
        trend === 'declining' ? 'medium' : 'low';

    return { trend, stallRisk, performances };
}

function calculateResetRecommendation(currentTM, estimatedMax) {
    if (!estimatedMax) return null;

    const recommendedTM = Math.round(estimatedMax * 0.9);
    const shouldReset = recommendedTM < currentTM * 0.95; // Reset if new TM significantly lower

    return {
        shouldReset,
        currentTM,
        estimatedMax,
        recommendedTM,
        difference: currentTM - recommendedTM
    };
}

export default function Step5ProgressionSmart({ onAdvance }) {
    const { state, dispatch } = useProgramV2();
    const [include, setInclude] = useState({ squat: true, bench: true, deadlift: true, press: true });
    const [applied, setApplied] = useState(false);
    const [progressionMode, setProgressionMode] = useState('smart'); // 'smart', 'conservative', 'standard'
    const [userProfile, setUserProfile] = useState({
        experience: 'intermediate',
        size: 'average',
        postReset: false
    });
    const [showAnalytics, setShowAnalytics] = useState(false);

    const lifts = state?.lifts || {};
    const amrap = state?.amrapWk3 || {};
    const units = state?.units || 'lbs';
    const history = state?.history || [];
    const currentCycle = state?.cycle || 1;

    // Performance analysis for each lift
    const liftAnalytics = useMemo(() => {
        const analytics = {};

        LIFTS.forEach(lift => {
            const currentTM = lifts[lift]?.tm || 0;
            const recentAmrap = amrap[lift];
            const performance = analyzePerformanceHistory(history, lift);

            // Estimate current 1RM if we have Week 3 AMRAP data
            let estimatedMax = null;
            if (recentAmrap && currentTM) {
                const week3Weight = Math.round(currentTM * 0.95); // Week 3 top set ~95% TM
                estimatedMax = estimateOneRM(week3Weight, recentAmrap);
            }

            const progression = calculateProgressionRecommendation(
                lift, currentTM, performance, units, userProfile
            );

            const resetInfo = calculateResetRecommendation(currentTM, estimatedMax);

            analytics[lift] = {
                currentTM,
                recentAmrap,
                estimatedMax,
                performance,
                progression,
                resetInfo,
                passed: passedAmrapWk3(recentAmrap, state)
            };
        });

        return analytics;
    }, [lifts, amrap, history, units, userProfile, state]);

    // Calculate final increments based on mode and analytics
    const finalIncrements = useMemo(() => {
        const increments = {};

        LIFTS.forEach(lift => {
            const analytics = liftAnalytics[lift];
            const { standardInc, conservativeInc, recommendedInc } = analytics.progression;

            if (progressionMode === 'conservative') {
                increments[lift] = conservativeInc;
            } else if (progressionMode === 'standard') {
                increments[lift] = standardInc;
            } else { // smart mode
                increments[lift] = recommendedInc;
            }
        });

        return increments;
    }, [liftAnalytics, progressionMode]);

    const handleAdvance = () => {
        if (applied) return;

        // Use custom increments instead of standard progression
        const customState = {
            ...state,
            customIncrements: finalIncrements
        };

        onAdvance(include, customState);
        setApplied(true);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
            case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
            case 'stable': return <BarChart3 className="w-4 h-4 text-blue-400" />;
            default: return <Info className="w-4 h-4 text-gray-400" />;
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            default: return 'text-green-400';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            Smart Progression System
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Intelligent TM advancement based on performance analysis and user profile
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Cycle</div>
                        <div className="text-lg font-semibold text-white">{currentCycle}</div>
                    </div>
                </div>

                {/* User Profile Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-900/40 rounded-lg">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                            Experience Level
                        </label>
                        <select
                            value={userProfile.experience}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-red-500"
                        >
                            <option value="beginner">Beginner (&lt;6 months)</option>
                            <option value="intermediate">Intermediate (6m-2y)</option>
                            <option value="advanced">Advanced (2y+)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                            Body Size
                        </label>
                        <select
                            value={userProfile.size}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-red-500"
                        >
                            <option value="smaller">Smaller (&lt;150 lbs)</option>
                            <option value="average">Average (150-200 lbs)</option>
                            <option value="larger">Larger (&gt;200 lbs)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                            Status
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={userProfile.postReset}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, postReset: e.target.checked }))}
                                className="rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-300">Post-Reset Cycle</span>
                        </label>
                    </div>
                </div>

                {/* Progression Mode Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-200 mb-3">Progression Strategy</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            {
                                id: 'smart',
                                title: 'Smart Recommendation',
                                desc: 'AI-driven based on your profile and performance',
                                icon: <Zap className="w-4 h-4" />
                            },
                            {
                                id: 'conservative',
                                title: 'Conservative',
                                desc: `+${units === 'kg' ? '1.25/2.5 kg' : '2.5/5 lbs'} (half increments)`,
                                icon: <Target className="w-4 h-4" />
                            },
                            {
                                id: 'standard',
                                title: 'Standard Wendler',
                                desc: `+${units === 'kg' ? '2.5/5 kg' : '5/10 lbs'} (book default)`,
                                icon: <Clock className="w-4 h-4" />
                            }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setProgressionMode(mode.id)}
                                className={`text-left p-3 rounded-lg border transition-all ${progressionMode === mode.id
                                        ? 'border-red-500 bg-red-600/10 ring-2 ring-red-600/20'
                                        : 'border-gray-600 bg-gray-900/40 hover:bg-gray-800/60'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {mode.icon}
                                    <span className="font-medium text-white">{mode.title}</span>
                                </div>
                                <div className="text-xs text-gray-400">{mode.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Analytics Toggle */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-white">Performance Analytics</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        {showAnalytics ? 'Hide' : 'Show'} Details
                    </div>
                </button>

                {showAnalytics && (
                    <div className="mt-4 space-y-4">
                        {LIFTS.map(lift => {
                            const analytics = liftAnalytics[lift];
                            return (
                                <div key={lift} className="bg-gray-900/40 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-white capitalize">{lift}</h4>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(analytics.performance.trend)}
                                            <span className="text-sm text-gray-400">
                                                {analytics.performance.trend}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-400">Current TM</div>
                                            <div className="font-mono text-white">
                                                {analytics.currentTM} {units}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Last AMRAP</div>
                                            <div className="font-mono text-white">
                                                {analytics.recentAmrap || '—'} reps
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Est. 1RM</div>
                                            <div className="font-mono text-white">
                                                {analytics.estimatedMax || '—'} {units}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400">Stall Risk</div>
                                            <div className={`font-medium ${getRiskColor(analytics.performance.stallRisk)}`}>
                                                {analytics.performance.stallRisk}
                                            </div>
                                        </div>
                                    </div>

                                    {analytics.resetInfo?.shouldReset && (
                                        <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700/40 rounded flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                                            <div className="text-sm">
                                                <div className="text-yellow-300 font-medium">Reset Recommended</div>
                                                <div className="text-gray-400">
                                                    Use 90% of estimated max: {analytics.resetInfo.recommendedTM} {units}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Training Max Progression */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Training Max Progression</h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {LIFTS.map(lift => {
                        const analytics = liftAnalytics[lift];
                        const increment = finalIncrements[lift];
                        const nextTM = analytics.currentTM + (include[lift] ? increment : 0);

                        return (
                            <label
                                key={lift}
                                className={`flex flex-col rounded-lg border p-4 bg-gray-900/60 cursor-pointer transition-all ${include[lift] ? 'border-red-500/50 ring-2 ring-red-600/20' : 'border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-white capitalize">{lift}</span>
                                    <input
                                        type="checkbox"
                                        checked={include[lift]}
                                        onChange={e => setInclude(prev => ({ ...prev, [lift]: e.target.checked }))}
                                        className="rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                                    />
                                </div>

                                <div className="space-y-2 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Current:</span>
                                        <span className="text-gray-200">{analytics.currentTM} {units}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Increment:</span>
                                        <span className={increment > 0 ? 'text-green-400' : 'text-gray-500'}>
                                            +{increment} {units}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-700 pt-2">
                                        <span className="text-gray-400">Next:</span>
                                        <span className="text-white font-semibold">{nextTM} {units}</span>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className={`flex items-center gap-1 text-xs ${analytics.passed ? 'text-green-400' : 'text-yellow-500'
                                        }`}>
                                        {analytics.passed ? (
                                            <CheckCircle className="w-3 h-3" />
                                        ) : (
                                            <AlertTriangle className="w-3 h-3" />
                                        )}
                                        <span>{analytics.passed ? 'AMRAP passed' : 'Incomplete data'}</span>
                                    </div>
                                    {progressionMode === 'smart' && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            {analytics.progression.reason}
                                        </div>
                                    )}
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            disabled={applied}
                            onClick={handleAdvance}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${applied
                                    ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                                    : 'border-green-500 bg-green-600/10 text-green-300 hover:bg-green-600/20'
                                }`}
                        >
                            {applied ? 'Progression Applied' : 'Apply Smart Progression'}
                        </button>

                        {applied && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Ready for next cycle</span>
                            </div>
                        )}
                    </div>

                    <div className="text-right text-sm text-gray-400">
                        <div>Next cycle: {currentCycle + 1}</div>
                        <div>Selected lifts: {Object.values(include).filter(Boolean).length}/4</div>
                    </div>
                </div>
            </div>

            {/* Educational Notes */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-gray-400 leading-relaxed">
                        <p className="mb-2">
                            <strong className="text-gray-300">Smart Progression Logic:</strong> Advanced lifters and smaller individuals
                            benefit from conservative increments. Post-reset cycles should progress slowly to rebuild properly.
                        </p>
                        <p className="mb-2">
                            <strong className="text-gray-300">Stall Detection:</strong> Missing Week 3 minimums or declining AMRAP
                            performance indicates potential stalling. Consider holding TMs or resetting when appropriate.
                        </p>
                        <p>
                            <strong className="text-gray-300">Reset Guidelines:</strong> When estimated 1RM suggests your TM is too high,
                            use 90% of your true max as the new training max for optimal progress.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
