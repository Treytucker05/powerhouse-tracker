import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import * as EngineModule from '../../../lib/engines/FiveThreeOneEngine.js';

const FiveThreeOneEngine = EngineModule.default ?? EngineModule.FiveThreeOneEngine;

const ScheduleSelectionStep = ({ programData, setProgramData }) => {
    const engine = new FiveThreeOneEngine();

    const handleScheduleSelect = (scheduleKey) => {
        setProgramData(prev => ({
            ...prev,
            schedule: scheduleKey
        }));
    };

    const scheduleOptions = [
        {
            key: 'four_day',
            icon: '4️⃣',
            title: '4 Days Per Week',
            subtitle: 'Standard 5/3/1 Schedule',
            description: 'One main lift per day with full assistance work',
            timeCommitment: '60-90 minutes per session',
            pattern: 'Day 1: OHP • Day 2: Deadlift • Day 3: Bench • Day 4: Squat',
            pros: [
                'Original 5/3/1 schedule',
                'Optimal for strength gains',
                'Full recovery between lifts',
                'Complete assistance work'
            ],
            cons: [
                'Requires 4 gym days',
                'Longer total weekly time'
            ],
            recommended: 'Best for strength goals and those with time'
        },
        {
            key: 'three_day',
            icon: '3️⃣',
            title: '3 Days Per Week',
            subtitle: 'Rolling 6-Week Cycle',
            description: 'Rolling pattern over 6 weeks instead of 4',
            timeCommitment: '75-105 minutes per session',
            pattern: 'Week 1: OHP, DL, Bench • Week 2: Squat, OHP, DL • etc.',
            pros: [
                'Only 3 gym days needed',
                'Good for busy schedules',
                'Still hits all lifts regularly'
            ],
            cons: [
                'More complex planning',
                'Longer cycles',
                'Less frequent lift practice'
            ],
            recommended: 'Good for busy schedules with consistency'
        },
        {
            key: 'two_day',
            icon: '2️⃣',
            title: '2 Days Per Week',
            subtitle: 'Paired Lifts',
            description: 'Two lifts per session, minimal assistance',
            timeCommitment: '90-120 minutes per session',
            pattern: 'Day 1: Squat + Bench • Day 2: Deadlift + OHP',
            pros: [
                'Minimal time commitment',
                'Good for maintenance',
                'Efficient sessions'
            ],
            cons: [
                'Longer sessions',
                'Limited assistance work',
                'Slower progression'
            ],
            recommended: 'For maintenance phases or very busy periods'
        },
        {
            key: 'one_day',
            icon: '1️⃣',
            title: '1 Day Per Week',
            subtitle: 'Temporary/Emergency',
            description: 'Alternating lift pairs, bare minimum',
            timeCommitment: '60-90 minutes per session',
            pattern: 'Week 1: Squat + Bench • Week 2: Deadlift + OHP',
            pros: [
                'Better than nothing',
                'Maintains some strength',
                'Very low time commitment'
            ],
            cons: [
                'Very slow progression',
                'Minimal volume',
                'Not sustainable long-term'
            ],
            recommended: 'Emergency use only - travel, illness, etc.'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Training Schedule</h3>
                <p className="text-gray-300">
                    Select the schedule that fits your availability and goals
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scheduleOptions.map((option) => (
                    <div
                        key={option.key}
                        onClick={() => handleScheduleSelect(option.key)}
                        className={`
                            bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]
                            ${programData.schedule === option.key
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-700 hover:border-gray-600'
                            }
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                    <h4 className="text-lg font-semibold text-white">
                                        {option.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        {option.subtitle}
                                    </p>
                                </div>
                            </div>
                            {programData.schedule === option.key && (
                                <CheckCircle className="w-6 h-6 text-red-500" />
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4">
                            {option.description}
                        </p>

                        {/* Time Commitment */}
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 text-sm font-medium">
                                {option.timeCommitment}
                            </span>
                        </div>

                        {/* Pattern */}
                        <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-300 text-sm font-medium">
                                    Pattern
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                                {option.pattern}
                            </p>
                        </div>

                        {/* Pros and Cons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h6 className="text-green-400 text-sm font-medium mb-2">Pros</h6>
                                <ul className="space-y-1">
                                    {option.pros.map((pro, index) => (
                                        <li key={index} className="text-green-300 text-xs flex items-start gap-1">
                                            <span className="text-green-400 mt-0.5">•</span>
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h6 className="text-red-400 text-sm font-medium mb-2">Cons</h6>
                                <ul className="space-y-1">
                                    {option.cons.map((con, index) => (
                                        <li key={index} className="text-red-300 text-xs flex items-start gap-1">
                                            <span className="text-red-400 mt-0.5">•</span>
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                            <p className="text-blue-300 text-sm">
                                <span className="font-medium">Best for:</span> {option.recommended}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Schedule Summary */}
            {programData.schedule && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-4">
                        Selected Schedule: {engine.scheduleTemplates[programData.schedule].name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl mb-2">
                                {scheduleOptions.find(opt => opt.key === programData.schedule)?.icon}
                            </div>
                            <p className="text-gray-400 text-sm">Schedule Type</p>
                            <p className="text-white font-medium">
                                {engine.scheduleTemplates[programData.schedule].name}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">⏱️</div>
                            <p className="text-gray-400 text-sm">Time Per Session</p>
                            <p className="text-white font-medium">
                                {scheduleOptions.find(opt => opt.key === programData.schedule)?.timeCommitment}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">📅</div>
                            <p className="text-gray-400 text-sm">Weekly Commitment</p>
                            <p className="text-white font-medium">
                                {programData.schedule.replace('_', ' ').replace('day', ' days')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* General Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h5 className="text-yellow-400 font-medium mb-2">📋 Schedule Guidelines</h5>
                <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Choose based on your realistic availability, not ideal goals</li>
                    <li>• 4-day schedule is optimal for strength gains and muscle building</li>
                    <li>• Lower frequency schedules work for maintenance or busy periods</li>
                    <li>• Consistency matters more than perfect schedule choice</li>
                    <li>• You can change schedules between cycles if needed</li>
                </ul>
            </div>
        </div>
    );
};

export default ScheduleSelectionStep;
