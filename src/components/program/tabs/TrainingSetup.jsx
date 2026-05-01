import React from 'react';
import { Calendar, Dumbbell, Info } from 'lucide-react';
import FiveThreeOneEngine from '../../../lib/engines/FiveThreeOneEngine.js';

export default function TrainingSetup({ data, updateData, assessment }) {
    const engine = new FiveThreeOneEngine();

    const assistanceTemplates = [
        {
            id: 'bbb',
            name: 'Boring But Big',
            description: '5 sets of 10 reps at 50-60% of your training max',
            difficulty: 'Moderate',
            timeCommitment: '60-75 minutes',
            focus: 'Size and Volume',
            details: 'Classic assistance template. After your main work, do 5x10 of the same lift or supplemental movement.',
            pros: ['Proven muscle building', 'Simple to follow', 'Builds work capacity'],
            cons: ['Can be fatiguing', 'Longer workouts', 'Requires good conditioning']
        },
        {
            id: 'triumvirate',
            name: 'The Triumvirate',
            description: 'Two assistance exercises per workout',
            difficulty: 'Easy',
            timeCommitment: '45-60 minutes',
            focus: 'Balanced Development',
            details: 'Classic three-exercise workout: main lift + two assistance movements. Great for beginners.',
            pros: ['Time efficient', 'Well-rounded', 'Easy to recover from'],
            cons: ['Lower volume', 'May lack specialization', 'Slower progress']
        },
        {
            id: 'simple',
            name: "I'm Not Doing Jack Shit",
            description: 'Main lift only with minimal assistance',
            difficulty: 'Easy',
            timeCommitment: '30-45 minutes',
            focus: 'Strength and Simplicity',
            details: 'Just the main lift plus minimal assistance. Perfect when time or energy is limited.',
            pros: ['Very time efficient', 'Low fatigue', 'Focus on main lifts'],
            cons: ['Minimal volume', 'Limited muscle building', 'May create imbalances']
        }
    ];

    const trainingSchedules = [
        {
            days: 3,
            name: '3-Day Schedule',
            description: 'Classic 5/3/1 schedule',
            schedule: [
                'Day 1: Squat + Bench',
                'Day 2: Deadlift',
                'Day 3: Overhead Press + Squat'
            ],
            pros: ['Time efficient', 'Good recovery', 'Sustainable'],
            cons: ['Lower frequency', 'Longer workouts', 'Less specialization']
        },
        {
            days: 4,
            name: '4-Day Schedule',
            description: 'One lift per day',
            schedule: [
                'Day 1: Squat',
                'Day 2: Bench Press',
                'Day 3: Deadlift',
                'Day 4: Overhead Press'
            ],
            pros: ['Higher frequency', 'Focused sessions', 'Shorter workouts'],
            cons: ['More time commitment', 'Requires consistency', 'May need more recovery']
        }
    ];

    const handleTemplateChange = (templateId) => {
        updateData({ assistance_template: templateId });
    };

    const handleScheduleChange = (days) => {
        updateData({ training_days: days });
    };

    const selectedTemplate = assistanceTemplates.find(t => t.id === data.assistance_template);
    const selectedSchedule = trainingSchedules.find(s => s.days === data.training_days);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <Calendar className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Training Setup</h3>
                <p className="text-gray-400">
                    Choose your assistance work template and training schedule
                </p>
            </div>

            {/* Assistance Template Selection */}
            <div>
                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    Assistance Work Template
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {assistanceTemplates.map(template => (
                        <div
                            key={template.id}
                            onClick={() => handleTemplateChange(template.id)}
                            className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                ${data.assistance_template === template.id
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-white">{template.name}</h5>
                                <span className={`text-xs px-2 py-1 rounded ${template.difficulty === 'Easy' ? 'bg-green-700 text-green-200' :
                                    template.difficulty === 'Moderate' ? 'bg-yellow-700 text-yellow-200' :
                                        'bg-red-700 text-red-200'
                                    }`}>
                                    {template.difficulty}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-3">{template.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-gray-300">{template.timeCommitment}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Focus:</span>
                                    <span className="text-gray-300">{template.focus}</span>
                                </div>
                            </div>

                            {data.assistance_template === template.id && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-sm text-gray-300 mb-2">{template.details}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div>
                                            <span className="text-green-400 text-xs font-medium">Pros:</span>
                                            <ul className="text-xs text-gray-400 ml-2">
                                                {template.pros.map((pro, i) => (
                                                    <li key={i}>• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="text-yellow-400 text-xs font-medium">Cons:</span>
                                            <ul className="text-xs text-gray-400 ml-2">
                                                {template.cons.map((con, i) => (
                                                    <li key={i}>• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Schedule Selection */}
            <div>
                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Training Schedule
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainingSchedules.map(schedule => (
                        <div
                            key={schedule.days}
                            onClick={() => handleScheduleChange(schedule.days)}
                            className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                ${data.training_days === schedule.days
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <h5 className="font-medium text-white mb-2">{schedule.name}</h5>
                            <p className="text-gray-400 text-sm mb-3">{schedule.description}</p>

                            <div className="space-y-1 mb-3">
                                {schedule.schedule.map((day, index) => (
                                    <div key={index} className="text-sm text-gray-300">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {data.training_days === schedule.days && (
                                <div className="pt-3 border-t border-gray-700 space-y-2">
                                    <div>
                                        <span className="text-green-400 text-xs font-medium">Pros:</span>
                                        <ul className="text-xs text-gray-400 ml-2">
                                            {schedule.pros.map((pro, i) => (
                                                <li key={i}>• {pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-yellow-400 text-xs font-medium">Cons:</span>
                                        <ul className="text-xs text-gray-400 ml-2">
                                            {schedule.cons.map((con, i) => (
                                                <li key={i}>• {con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Selection Summary */}
            {data.assistance_template && data.training_days && (
                <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Your Training Setup</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-medium text-gray-300 mb-2">Assistance Template</h5>
                            <div className="text-white font-medium">{selectedTemplate?.name}</div>
                            <div className="text-sm text-gray-400">{selectedTemplate?.description}</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Est. workout time: {selectedTemplate?.timeCommitment}
                            </div>
                        </div>

                        <div>
                            <h5 className="font-medium text-gray-300 mb-2">Training Schedule</h5>
                            <div className="text-white font-medium">{selectedSchedule?.name}</div>
                            <div className="text-sm text-gray-400">{selectedSchedule?.description}</div>
                            <div className="text-sm text-gray-400 mt-1">
                                {data.training_days} workouts per week
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5/3/1 Training Info */}
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h5 className="text-blue-300 font-medium mb-2">About 5/3/1 Training</h5>
                        <p className="text-blue-200 text-sm">
                            Jim Wendler designed 5/3/1 to be flexible with assistance work. The main lift follows
                            the 5/3/1 progression, while assistance work helps address weaknesses and build muscle.
                            Choose a template that matches your goals and time availability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
