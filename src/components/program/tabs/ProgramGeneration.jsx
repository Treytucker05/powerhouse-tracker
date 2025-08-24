import React, { useState, useEffect } from 'react';
import { Download, Play, Calendar, Target, Dumbbell, CheckCircle, Info, Eye } from 'lucide-react';
import FiveThreeOneEngine from '../../../lib/engines/FiveThreeOneEngine.js';

export default function ProgramGeneration({ data, updateData, assessment, onComplete }) {
    const [programs, setPrograms] = useState([]);
    const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedWeek, setExpandedWeek] = useState(null);

    useEffect(() => {
        generatePrograms();
    }, [data]);

    const generatePrograms = async () => {
        setIsGenerating(true);

        try {
            // Generate multiple program options (e.g., next 3 cycles)
            const cycleCount = 3;
            const generatedPrograms = [];

            for (let cycleNum = 1; cycleNum <= cycleCount; cycleNum++) {
                const program = FiveThreeOneEngine.generateCycle(
                    data.maxes,
                    data.assistance_template,
                    data.schedule_type,
                    {
                        cycle_length: data.cycle_length,
                        progression_rates: data.progression_rates,
                        deload_type: data.deload_type,
                        cycle_number: cycleNum
                    }
                );

                program.cycle_number = cycleNum;
                program.start_date = getStartDate(cycleNum);
                program.end_date = getEndDate(cycleNum);
                generatedPrograms.push(program);
            }

            setPrograms(generatedPrograms);
        } catch (error) {
            console.error('Error generating programs:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getStartDate = (cycleNum) => {
        const today = new Date();
        const weeksOffset = (cycleNum - 1) * data.cycle_length;
        const startDate = new Date(today.getTime() + weeksOffset * 7 * 24 * 60 * 60 * 1000);
        return startDate.toLocaleDateString();
    };

    const getEndDate = (cycleNum) => {
        const today = new Date();
        const weeksOffset = cycleNum * data.cycle_length - 1;
        const endDate = new Date(today.getTime() + weeksOffset * 7 * 24 * 60 * 60 * 1000);
        return endDate.toLocaleDateString();
    };

    const handleStartProgram = () => {
        const selectedProgram = programs[selectedProgramIndex];
        updateData({ selected_program: selectedProgram });
        onComplete();
    };

    const toggleWeekExpansion = (weekIndex) => {
        setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex);
    };

    const selectedProgram = programs[selectedProgramIndex];

    if (isGenerating) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-medium text-white mb-2">Generating Your Programs</h3>
                <p className="text-gray-400">Creating personalized 5/3/1 cycles based on your configuration...</p>
            </div>
        );
    }

    if (!programs.length) {
        return (
            <div className="text-center py-12">
                <Target className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Unable to Generate Programs</h3>
                <p className="text-gray-400">Please check your configuration and try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <Target className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Your 5/3/1 Program</h3>
                <p className="text-gray-400">
                    Review and select your training cycle to begin
                </p>
            </div>

            {/* Program Selector */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {programs.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedProgramIndex(index)}
                        className={`
                            px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${selectedProgramIndex === index
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }
                        `}
                    >
                        Cycle {index + 1}
                    </button>
                ))}
            </div>

            {selectedProgram && (
                <>
                    {/* Program Overview */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <h4 className="font-medium text-white">Duration</h4>
                                <p className="text-gray-300">{data.cycle_length} weeks</p>
                                <p className="text-sm text-gray-400">
                                    {selectedProgram.start_date} - {selectedProgram.end_date}
                                </p>
                            </div>

                            <div className="text-center">
                                <Dumbbell className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <h4 className="font-medium text-white">Template</h4>
                                <p className="text-gray-300">{data.assistance_template}</p>
                                <p className="text-sm text-gray-400">{data.schedule_type} schedule</p>
                            </div>

                            <div className="text-center">
                                <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <h4 className="font-medium text-white">Focus</h4>
                                <p className="text-gray-300">Strength Building</p>
                                <p className="text-sm text-gray-400">Progressive overload</p>
                            </div>
                        </div>
                    </div>

                    {/* Training Maxes for This Cycle */}
                    <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-white mb-4">Training Maxes - Cycle {selectedProgram.cycle_number}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(selectedProgram.training_maxes).map(([lift, tm]) => (
                                <div key={lift} className="text-center">
                                    <div className="text-sm text-gray-400 uppercase tracking-wide">{lift}</div>
                                    <div className="text-2xl font-bold text-white">{tm}</div>
                                    <div className="text-sm text-gray-400">lbs</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Breakdown */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Weekly Breakdown</h4>

                        {selectedProgram.weeks.map((week, weekIndex) => (
                            <div
                                key={weekIndex}
                                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleWeekExpansion(weekIndex)}
                                    className="w-full p-4 text-left hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h5 className="font-medium text-white">
                                                Week {weekIndex + 1} - {week.name}
                                            </h5>
                                            <p className="text-sm text-gray-400">{week.description}</p>
                                        </div>
                                        <Eye className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedWeek === weekIndex ? 'rotate-180' : ''
                                            }`} />
                                    </div>
                                </button>

                                {expandedWeek === weekIndex && (
                                    <div className="px-4 pb-4 border-t border-gray-700">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                            {week.days.map((day, dayIndex) => (
                                                <div key={dayIndex} className="bg-gray-900 rounded-lg p-4">
                                                    <h6 className="font-medium text-white mb-3">
                                                        Day {dayIndex + 1}: {day.main_lift.toUpperCase()}
                                                    </h6>

                                                    {/* Main Work */}
                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-300 mb-2">Main Work</div>
                                                        {day.main_work.map((set, setIndex) => (
                                                            <div key={setIndex} className="flex justify-between text-sm">
                                                                <span className="text-gray-400">
                                                                    {set.reps}{set.amrap ? '+' : ''} reps
                                                                </span>
                                                                <span className="text-white font-medium">
                                                                    {set.weight} lbs
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Assistance Work */}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-300 mb-2">Assistance</div>
                                                        {day.assistance.map((exercise, exIndex) => (
                                                            <div key={exIndex} className="text-sm text-gray-400">
                                                                {exercise.name}: {exercise.sets}x{exercise.reps}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Key Program Features */}
                    <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                                <h5 className="text-blue-300 font-medium mb-2">Program Features</h5>
                                <ul className="text-blue-200 text-sm space-y-1">
                                    <li>• Progressive overload with AMRAP (As Many Reps As Possible) sets</li>
                                    <li>• {data.assistance_template} assistance template for balanced development</li>
                                    <li>• {data.schedule_type} training schedule for optimal recovery</li>
                                    {data.cycle_length === 4 && (
                                        <li>• Built-in deload week for recovery and adaptation</li>
                                    )}
                                    <li>• Automatic progression based on your specified rates</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleStartProgram}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Start This Program
                        </button>

                        <button
                            onClick={() => {
                                // Could implement export functionality here
                                console.log('Export program:', selectedProgram);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Export Program
                        </button>
                    </div>
                </>
            )}

            {/* Success Indicator */}
            <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                        <h5 className="text-green-300 font-medium">Program Generated Successfully</h5>
                        <p className="text-green-200 text-sm">
                            Your personalized 5/3/1 program is ready. Review the details above and start when ready.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
