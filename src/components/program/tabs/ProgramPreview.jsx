import React, { useState } from 'react';
import { Eye, Download, Calendar, BarChart3, Target, CheckCircle, Play } from 'lucide-react';

const ProgramPreview = ({ assessmentData, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [previewMode, setPreviewMode] = useState('overview'); // overview, weekly, session
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedSession, setSelectedSession] = useState(1);

    // Mock program data for preview
    const programData = {
        name: 'Strength & Power Development Program',
        duration: 12,
        trainingDays: 4,
        totalSessions: 48,
        blocks: [
            { name: 'Accumulation', weeks: '1-4', focus: 'Volume & Work Capacity' },
            { name: 'Intensification', weeks: '5-7', focus: 'Intensity & Strength' },
            { name: 'Realization', weeks: '8-9', focus: 'Performance & Testing' },
            { name: 'Deload', weeks: '10', focus: 'Recovery & Restoration' },
            { name: 'Competition', weeks: '11-12', focus: 'Peak Performance' }
        ],
        weeklyStructure: {
            monday: { type: 'Upper Body Strength', duration: '60 min', exercises: 6 },
            tuesday: { type: 'Lower Body Power', duration: '45 min', exercises: 5 },
            wednesday: { type: 'Rest', duration: 'Active Recovery', exercises: 0 },
            thursday: { type: 'Full Body Conditioning', duration: '50 min', exercises: 8 },
            friday: { type: 'Upper Body Hypertrophy', duration: '65 min', exercises: 7 },
            saturday: { type: 'Lower Body Strength', duration: '55 min', exercises: 6 },
            sunday: { type: 'Rest', duration: 'Complete Rest', exercises: 0 }
        },
        sessionExample: {
            warmup: [
                'Dynamic warm-up routine - 10 minutes',
                'Activation exercises - 5 minutes',
                'Movement preparation - 5 minutes'
            ],
            mainWork: [
                'Back Squat - 4 sets x 3 reps @ 85%',
                'Romanian Deadlift - 3 sets x 6 reps @ 75%',
                'Bulgarian Split Squat - 3 sets x 8 each leg',
                'Walking Lunges - 2 sets x 12 each leg',
                'Single Leg Calf Raise - 3 sets x 12 each leg'
            ],
            accessory: [
                'Glute Ham Raise - 3 sets x 10 reps',
                'Plank variations - 3 sets x 45 seconds'
            ],
            cooldown: [
                'Static stretching - 10 minutes',
                'Foam rolling - 5 minutes'
            ]
        }
    };

    const mockWeeklyData = {
        week1: {
            focus: 'Movement Quality & Base Building',
            volume: 'Moderate',
            intensity: '70-80%',
            sessions: [
                { day: 'Monday', type: 'Upper Strength', exercises: 6, duration: 60 },
                { day: 'Tuesday', type: 'Lower Power', exercises: 5, duration: 45 },
                { day: 'Thursday', type: 'Conditioning', exercises: 8, duration: 50 },
                { day: 'Friday', type: 'Upper Hypertrophy', exercises: 7, duration: 65 }
            ]
        },
        week5: {
            focus: 'Strength Development',
            volume: 'Moderate-High',
            intensity: '80-90%',
            sessions: [
                { day: 'Monday', type: 'Max Strength', exercises: 5, duration: 70 },
                { day: 'Tuesday', type: 'Power Development', exercises: 6, duration: 55 },
                { day: 'Thursday', type: 'Work Capacity', exercises: 7, duration: 45 },
                { day: 'Friday', type: 'Accessory Work', exercises: 8, duration: 60 }
            ]
        },
        week8: {
            focus: 'Peak Performance',
            volume: 'Low-Moderate',
            intensity: '85-95%',
            sessions: [
                { day: 'Monday', type: 'Competition Prep', exercises: 4, duration: 60 },
                { day: 'Tuesday', type: 'Speed-Strength', exercises: 5, duration: 40 },
                { day: 'Thursday', type: 'Technical Work', exercises: 6, duration: 45 },
                { day: 'Friday', type: 'Active Recovery', exercises: 4, duration: 30 }
            ]
        }
    };

    const getWeekData = (week) => {
        if (week <= 4) return mockWeeklyData.week1;
        if (week <= 7) return mockWeeklyData.week5;
        return mockWeeklyData.week8;
    };

    const exportProgram = () => {
        // Mock export functionality
        alert('Program export functionality would be implemented here');
    };

    const startProgram = () => {
        // Mock start program functionality
        alert('Program implementation would start here');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Program Preview & Finalization
                </h3>
                <p className="text-blue-300 text-sm">
                    Review your complete training program before implementation.
                </p>
            </div>

            {/* Preview Mode Selector */}
            <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
                {[
                    { id: 'overview', label: 'Program Overview', icon: BarChart3 },
                    { id: 'weekly', label: 'Weekly Breakdown', icon: Calendar },
                    { id: 'session', label: 'Session Detail', icon: Target }
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setPreviewMode(mode.id)}
                        className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${previewMode === mode.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <mode.icon className="h-4 w-4" />
                        {mode.label}
                    </button>
                ))}
            </div>

            {/* Program Overview */}
            {previewMode === 'overview' && (
                <div className="space-y-6">
                    {/* Program Summary */}
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-white font-medium mb-4">Program Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{programData.duration}</div>
                                <div className="text-gray-400 text-sm">Weeks</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{programData.trainingDays}</div>
                                <div className="text-gray-400 text-sm">Days/Week</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">{programData.totalSessions}</div>
                                <div className="text-gray-400 text-sm">Total Sessions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{programData.blocks.length}</div>
                                <div className="text-gray-400 text-sm">Training Blocks</div>
                            </div>
                        </div>
                    </div>

                    {/* Block Structure */}
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-white font-medium mb-4">Training Block Structure</h4>
                        <div className="space-y-3">
                            {programData.blocks.map((block, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                                    <div>
                                        <div className="text-white font-medium">{block.name}</div>
                                        <div className="text-gray-400 text-sm">{block.focus}</div>
                                    </div>
                                    <div className="text-blue-400 font-medium">
                                        Weeks {block.weeks}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Structure */}
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-white font-medium mb-4">Weekly Training Structure</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {Object.entries(programData.weeklyStructure).map(([day, session]) => (
                                <div key={day} className={`p-3 rounded ${session.type === 'Rest' ? 'bg-gray-600' : 'bg-blue-900/30'
                                    }`}>
                                    <div className="text-white font-medium capitalize">{day}</div>
                                    <div className="text-gray-400 text-sm">{session.type}</div>
                                    <div className="text-gray-500 text-xs">{session.duration}</div>
                                    {session.exercises > 0 && (
                                        <div className="text-blue-400 text-xs">{session.exercises} exercises</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Breakdown */}
            {previewMode === 'weekly' && (
                <div className="space-y-6">
                    {/* Week Selector */}
                    <div className="flex items-center space-x-4">
                        <label className="text-white font-medium">Select Week:</label>
                        <select
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                            {Array.from({ length: programData.duration }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Week {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Week Details */}
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-white font-medium mb-4">Week {selectedWeek} Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-600 p-3 rounded">
                                <div className="text-gray-400 text-sm">Focus</div>
                                <div className="text-white font-medium">{getWeekData(selectedWeek).focus}</div>
                            </div>
                            <div className="bg-gray-600 p-3 rounded">
                                <div className="text-gray-400 text-sm">Volume</div>
                                <div className="text-white font-medium">{getWeekData(selectedWeek).volume}</div>
                            </div>
                            <div className="bg-gray-600 p-3 rounded">
                                <div className="text-gray-400 text-sm">Intensity</div>
                                <div className="text-white font-medium">{getWeekData(selectedWeek).intensity}</div>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="space-y-3">
                            <h5 className="text-white font-medium">Training Sessions</h5>
                            {getWeekData(selectedWeek).sessions.map((session, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                                    <div>
                                        <div className="text-white font-medium">{session.day}</div>
                                        <div className="text-gray-400 text-sm">{session.type}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-blue-400 text-sm">{session.exercises} exercises</div>
                                        <div className="text-gray-500 text-xs">{session.duration} min</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Session Detail */}
            {previewMode === 'session' && (
                <div className="space-y-6">
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-white font-medium mb-4">Sample Training Session</h4>

                        {/* Warm-up */}
                        <div className="mb-6">
                            <h5 className="text-white font-medium mb-2">Warm-up (20 minutes)</h5>
                            <div className="space-y-1">
                                {programData.sessionExample.warmup.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {item}</div>
                                ))}
                            </div>
                        </div>

                        {/* Main Work */}
                        <div className="mb-6">
                            <h5 className="text-white font-medium mb-2">Main Work (30 minutes)</h5>
                            <div className="space-y-1">
                                {programData.sessionExample.mainWork.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {item}</div>
                                ))}
                            </div>
                        </div>

                        {/* Accessory */}
                        <div className="mb-6">
                            <h5 className="text-white font-medium mb-2">Accessory Work (10 minutes)</h5>
                            <div className="space-y-1">
                                {programData.sessionExample.accessory.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {item}</div>
                                ))}
                            </div>
                        </div>

                        {/* Cool-down */}
                        <div>
                            <h5 className="text-white font-medium mb-2">Cool-down (15 minutes)</h5>
                            <div className="space-y-1">
                                {programData.sessionExample.cooldown.map((item, index) => (
                                    <div key={index} className="text-gray-300 text-sm">• {item}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Program Finalization */}
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Program Complete
                </h4>
                <p className="text-green-300 text-sm mb-4">
                    Your training program has been successfully designed and is ready for implementation.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportProgram}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Program
                    </button>
                    <button
                        onClick={startProgram}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Play className="h-4 w-4" />
                        Start Program
                    </button>
                </div>
            </div>

            {/* Program Checklist */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Pre-Implementation Checklist</h4>
                <div className="space-y-2">
                    {[
                        'Program overview reviewed',
                        'Weekly structure confirmed',
                        'Sample sessions understood',
                        'Equipment availability verified',
                        'Assessment baseline established'
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    Previous: Training Methods
                </button>
                <button
                    onClick={startProgram}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    Complete Program
                    <CheckCircle className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default ProgramPreview;
