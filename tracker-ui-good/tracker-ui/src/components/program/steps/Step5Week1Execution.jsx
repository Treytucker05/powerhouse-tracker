import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Info, BarChart3, Clock, Zap } from 'lucide-react';

export default function Step5Week1Execution({ data, updateData }) {
    const [executionStrategy, setExecutionStrategy] = useState(data.executionStrategy || '');
    const [repTargets, setRepTargets] = useState(data.repTargets || {
        conservative: 8,
        moderate: 10,
        aggressive: 12
    });
    const [badDayProtocol, setBadDayProtocol] = useState(data.badDayProtocol || 'minimum_reps');
    const [restPeriods, setRestPeriods] = useState(data.restPeriods || {
        between_sets: 3,
        before_amrap: 5
    });
    const [formCues, setFormCues] = useState(data.formCues || {
        squat: [],
        bench: [],
        deadlift: [],
        overhead_press: []
    });
    const [trainingMaxes, setTrainingMaxes] = useState(data.trainingMaxes || {});
    const [loadingOption, setLoadingOption] = useState(data.loadingOption || 1);
    const [calculatedWeights, setCalculatedWeights] = useState({});

    const executionStrategies = {
        'conservative': {
            name: 'Conservative Approach',
            description: 'Focus on perfect form and controlled progression',
            repTarget: '8-10 reps on 5+ set',
            characteristics: [
                'Stop 2-3 reps short of failure',
                'Prioritize form over rep count',
                'Better for beginners or technique focus',
                'Sustainable long-term approach'
            ],
            rpeTarget: '7-8 RPE on AMRAP set',
            bestFor: 'Beginners, form development, injury recovery'
        },
        'moderate': {
            name: 'Moderate Approach (Recommended)',
            description: 'Balanced aggression with smart stopping point',
            repTarget: '10-12 reps on 5+ set',
            characteristics: [
                'Push until bar speed slows noticeably',
                'Stop when form begins to degrade',
                'Good balance of intensity and safety',
                'Most sustainable for long-term progress'
            ],
            rpeTarget: '8-9 RPE on AMRAP set',
            bestFor: 'Most lifters, standard progression'
        },
        'aggressive': {
            name: 'Aggressive Approach',
            description: 'Push harder for maximum rep PRs',
            repTarget: '12+ reps on 5+ set',
            characteristics: [
                'Push close to technical failure',
                'Accept some form breakdown',
                'Higher fatigue and recovery demands',
                'Risk/reward approach'
            ],
            rpeTarget: '9-9.5 RPE on AMRAP set',
            bestFor: 'Experienced lifters, short-term peaks'
        }
    };

    const badDayProtocols = {
        'minimum_reps': {
            name: 'Minimum Reps Only',
            description: 'Do prescribed reps, skip the "+"',
            protocol: 'Complete 65%×5, 75%×5, 85%×5 (no AMRAP)',
            philosophy: 'Live to fight another day',
            when: 'Low energy, poor sleep, high stress'
        },
        'reduced_intensity': {
            name: 'Reduced Intensity',
            description: 'Drop all percentages by 10%',
            protocol: 'Complete 55%×5, 65%×5, 75%×5+',
            philosophy: 'Maintain movement patterns with less stress',
            when: 'Feeling weak but not terrible'
        },
        'skip_session': {
            name: 'Skip Session',
            description: 'Rest completely and return next day',
            protocol: 'Full rest, resume normal schedule',
            philosophy: 'Recovery is part of training',
            when: 'Illness, extreme fatigue, injury risk'
        }
    };

    const formCueOptions = {
        squat: [
            'Big breath and brace before descent',
            'Knees track over toes',
            'Chest up, eyes forward',
            'Drive through heels',
            'Hip hinge to initiate',
            'Maintain neutral spine',
            'Full depth below parallel',
            'Drive floor apart with feet'
        ],
        bench: [
            'Retract and depress shoulder blades',
            'Arch back, feet firmly planted',
            'Bar path over mid-chest',
            'Control the descent',
            'Pause briefly at chest',
            'Drive through legs',
            'Press bar back over shoulders',
            'Maintain tight core'
        ],
        deadlift: [
            'Bar over mid-foot',
            'Neutral spine throughout',
            'Shoulders over the bar',
            'Big breath and brace',
            'Leg drive to start',
            'Hips and shoulders rise together',
            'Finish with hips, not back',
            'Control the descent'
        ],
        overhead_press: [
            'Feet shoulder-width apart',
            'Grip just outside shoulders',
            'Big breath and brace core',
            'Bar starts at shoulder level',
            'Press straight up',
            'Push head through at top',
            'Lock out overhead',
            'Control the descent'
        ]
    };

    const performanceIndicators = {
        excellent: { min: 12, color: 'green', message: 'Excellent! TM is well-calibrated' },
        good: { min: 10, color: 'blue', message: 'Good performance, progressing well' },
        acceptable: { min: 8, color: 'yellow', message: 'Acceptable, monitor next week' },
        concerning: { min: 6, color: 'orange', message: 'Low reps, consider TM adjustment' },
        poor: { min: 0, color: 'red', message: 'Very low reps, TM likely too high' }
    };

    // Calculate Week 1 weights
    const calculateWeek1Weights = (tm, option) => {
        const percentages = option === 1
            ? [{ percent: 65, reps: 5 }, { percent: 75, reps: 5 }, { percent: 85, reps: '5+' }]
            : [{ percent: 75, reps: 5 }, { percent: 80, reps: 5 }, { percent: 85, reps: '5+' }];

        return percentages.map(set => ({
            ...set,
            weight: Math.round((tm * set.percent / 100) / 5) * 5
        }));
    };

    // Update calculated weights when TMs change
    useEffect(() => {
        if (Object.keys(trainingMaxes).length > 0) {
            const newWeights = {};
            Object.entries(trainingMaxes).forEach(([lift, tm]) => {
                newWeights[lift] = calculateWeek1Weights(tm, loadingOption);
            });
            setCalculatedWeights(newWeights);
        }
    }, [trainingMaxes, loadingOption]);

    // Get data from previous steps
    useEffect(() => {
        if (data.trainingMaxes) setTrainingMaxes(data.trainingMaxes);
        if (data.loadingOption) setLoadingOption(data.loadingOption);
    }, [data.trainingMaxes, data.loadingOption]);

    const handleExecutionStrategyChange = (strategy) => {
        setExecutionStrategy(strategy);
        updateStepData({ executionStrategy: strategy });
    };

    const handleBadDayProtocolChange = (protocol) => {
        setBadDayProtocol(protocol);
        updateStepData({ badDayProtocol: protocol });
    };

    const handleRestPeriodChange = (type, minutes) => {
        const newRestPeriods = { ...restPeriods, [type]: minutes };
        setRestPeriods(newRestPeriods);
        updateStepData({ restPeriods: newRestPeriods });
    };

    const handleFormCueToggle = (lift, cue) => {
        const currentCues = formCues[lift] || [];
        const newCues = currentCues.includes(cue)
            ? currentCues.filter(c => c !== cue)
            : [...currentCues, cue];

        const newFormCues = { ...formCues, [lift]: newCues };
        setFormCues(newFormCues);
        updateStepData({ formCues: newFormCues });
    };

    const updateStepData = (updates) => {
        updateData({
            executionStrategy,
            repTargets,
            badDayProtocol,
            restPeriods,
            formCues,
            trainingMaxes,
            loadingOption,
            ...updates
        });
    };

    const isStepComplete = () => {
        return executionStrategy !== '' && badDayProtocol !== '';
    };

    const getPerformanceLevel = (reps) => {
        if (reps >= performanceIndicators.excellent.min) return 'excellent';
        if (reps >= performanceIndicators.good.min) return 'good';
        if (reps >= performanceIndicators.acceptable.min) return 'acceptable';
        if (reps >= performanceIndicators.concerning.min) return 'concerning';
        return 'poor';
    };

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 5: Week 1 – "3×5" Week Execution
                </h3>
                <p className="text-gray-400">
                    Configure your approach to the volume-focused first week of each cycle.
                </p>
            </div>

            {/* Week 1 Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Week 1 Focus: Volume</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Goal:</strong> Set rep PRs on the 85% AMRAP set</li>
                            <li>• <strong>Intensity:</strong> Manageable weights, focus on bar speed</li>
                            <li>• <strong>Volume:</strong> Highest rep counts of the cycle</li>
                            <li>• <strong>Technique:</strong> Perfect time to reinforce movement patterns</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Execution Strategy Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Choose Your Execution Strategy</h4>
                <div className="space-y-4">
                    {Object.entries(executionStrategies).map(([strategy, details]) => (
                        <div
                            key={strategy}
                            onClick={() => handleExecutionStrategyChange(strategy)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${executionStrategy === strategy
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <Target className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-white font-medium">{details.name}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{details.description}</p>
                                    <div className="text-sm text-green-400 mb-2">
                                        <strong>Target:</strong> {details.repTarget}
                                    </div>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div><strong>RPE:</strong> {details.rpeTarget}</div>
                                        <div><strong>Best for:</strong> {details.bestFor}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {details.characteristics.map((char, index) => (
                                    <div key={index} className="text-gray-300 text-sm flex items-center">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full mr-2"></div>
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Week 1 Weight Display */}
            {Object.keys(calculatedWeights).length > 0 && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Week 1 Working Weights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(calculatedWeights).map(([lift, weights]) => (
                            <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                                <h5 className="text-white font-medium mb-3">{liftNames[lift]}</h5>
                                <div className="space-y-2">
                                    {weights.map((set, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-300">
                                                Set {index + 1} ({set.percent}%)
                                            </span>
                                            <span className="text-white font-medium">
                                                {set.weight} lbs × {set.reps}
                                                {String(set.reps).includes('+') && (
                                                    <span className="text-red-400 ml-1">AMRAP</span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rest Period Configuration */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Rest Period Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Between Sets 1 & 2 (minutes)
                            </label>
                            <select
                                value={restPeriods.between_sets}
                                onChange={(e) => handleRestPeriodChange('between_sets', parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-red-500"
                            >
                                <option value={2}>2 minutes</option>
                                <option value={3}>3 minutes</option>
                                <option value={4}>4 minutes</option>
                                <option value={5}>5 minutes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Before AMRAP Set (minutes)
                            </label>
                            <select
                                value={restPeriods.before_amrap}
                                onChange={(e) => handleRestPeriodChange('before_amrap', parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-red-500"
                            >
                                <option value={3}>3 minutes</option>
                                <option value={4}>4 minutes</option>
                                <option value={5}>5 minutes</option>
                                <option value={6}>6 minutes</option>
                                <option value={7}>7 minutes</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-300 font-medium">Rest Guidelines</span>
                        </div>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• First two sets: Moderate rest</li>
                            <li>• AMRAP set: Full recovery</li>
                            <li>• Adjust based on conditioning</li>
                            <li>• Quality over speed</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bad Day Protocol */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Bad Day Protocol</h4>
                <div className="space-y-3">
                    {Object.entries(badDayProtocols).map(([protocol, details]) => (
                        <div
                            key={protocol}
                            onClick={() => handleBadDayProtocolChange(protocol)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${badDayProtocol === protocol
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center mb-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                                <span className="text-white font-medium">{details.name}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{details.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                                <div><strong>Protocol:</strong> {details.protocol}</div>
                                <div><strong>Philosophy:</strong> {details.philosophy}</div>
                                <div><strong>When to use:</strong> {details.when}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Performance Indicators (85% AMRAP Set)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(performanceIndicators).map(([level, details]) => (
                        <div key={level} className={`bg-${details.color}-900/20 border border-${details.color}-600 p-4 rounded-lg`}>
                            <div className="flex items-center mb-2">
                                <BarChart3 className={`w-4 h-4 text-${details.color}-400 mr-2`} />
                                <span className={`text-${details.color}-300 font-medium capitalize`}>{level}</span>
                            </div>
                            <div className={`text-${details.color}-200 text-sm mb-2`}>
                                {details.min === 0 ? '5 or fewer reps' : `${details.min}+ reps`}
                            </div>
                            <div className={`text-${details.color}-200 text-xs`}>
                                {details.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Cues Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Key Form Cues to Focus On</h4>
                <div className="space-y-6">
                    {Object.entries(liftNames).map(([lift, name]) => (
                        <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                            <h5 className="text-white font-medium mb-3">{name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {formCueOptions[lift].map((cue, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`${lift}_cue_${index}`}
                                            checked={formCues[lift]?.includes(cue) || false}
                                            onChange={() => handleFormCueToggle(lift, cue)}
                                            className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor={`${lift}_cue_${index}`} className="text-gray-300 text-sm">
                                            {cue}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 5 Complete! Week 1 execution strategy configured.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
