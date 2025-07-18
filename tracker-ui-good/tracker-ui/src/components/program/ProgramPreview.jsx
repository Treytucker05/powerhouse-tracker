import React from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';
import { useProgramGeneration } from '../../hooks/useProgramHooks';

const ProgramPreview = () => {
    const { state } = useProgramContext();
    const { generatedProgram, generateProgram, generateProgramStructure, isLoading } = useProgramGeneration();

    const handleGenerateProgram = async () => {
        await generateProgram();
    };

    const programStructure = generateProgramStructure();

    return (
        <div className="space-y-6">
            {/* Program Summary */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Program Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-white">Program Name</h4>
                        <p className="text-gray-300">{state.programData.name || 'Untitled Program'}</p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-white">Duration</h4>
                        <p className="text-gray-300">{state.programData.duration} weeks</p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-white">Training Model</h4>
                        <p className="text-gray-300">{state.selectedTrainingModel || 'Not selected'}</p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-white">Training Days</h4>
                        <p className="text-gray-300">{state.programData.trainingDays} days/week</p>
                    </div>
                </div>
            </div>

            {/* Block Structure Preview */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Block Structure</h3>

                <div className="space-y-4">
                    {programStructure.map((block, index) => (
                        <div key={block.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: state.blockSequence.find(b => b.id === block.id)?.color }}
                                    />
                                    <h4 className="font-medium text-white">{block.name}</h4>
                                    <span className="text-sm text-gray-300">({block.duration} weeks)</span>
                                </div>

                                <div className="text-sm text-gray-200">
                                    Week {calculateWeekStart(programStructure, index)}-{calculateWeekEnd(programStructure, index)}
                                </div>
                            </div>

                            <p className="text-sm text-gray-300 mb-3">{block.description}</p>

                            {block.parameters && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">Loading:</span>
                                        <span className="ml-1 font-medium text-white">{block.parameters.loading || 'TBD'}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Movement:</span>
                                        <span className="ml-1 font-medium text-white">{block.parameters.movement || 'TBD'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Sets:</span>
                                        <span className="ml-1 font-medium text-white">{block.parameters.setsPerExercise || 'TBD'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Reps:</span>
                                        <span className="ml-1 font-medium text-white">{block.parameters.repRange || 'TBD'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Program */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Generate Complete Program</h3>

                    <button
                        onClick={handleGenerateProgram}
                        disabled={isLoading || !state.selectedTrainingModel}
                        className={`px-6 py-2 rounded-md font-medium ${isLoading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : !state.selectedTrainingModel
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-500'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                <span>Generating...</span>
                            </div>
                        ) : (
                            'Generate Program'
                        )}
                    </button>
                </div>

                {!state.selectedTrainingModel && (
                    <p className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-700/50 p-3 rounded-lg">
                        Complete the previous steps to generate your program
                    </p>
                )}

                {generatedProgram && (
                    <div className="mt-4 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                        <h4 className="font-medium text-green-300 mb-2">Program Generated Successfully!</h4>
                        <p className="text-sm text-green-200">
                            Your program "{generatedProgram.name}" has been created with {generatedProgram.blocks?.length} blocks
                            and is ready for implementation.
                        </p>

                        <div className="mt-3 flex space-x-3">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 text-sm">
                                Save Program
                            </button>
                            <button className="px-4 py-2 border border-green-600 text-green-300 rounded-md hover:bg-green-900/30 text-sm">
                                Export to PDF
                            </button>
                            <button className="px-4 py-2 border border-green-600 text-green-300 rounded-md hover:bg-green-900/30 text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Generated Program Details */}
            {generatedProgram && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Program Details</h3>

                    <div className="space-y-6">
                        {generatedProgram.blocks?.map((block, blockIndex) => (
                            <div key={block.id} className="border-l-4 pl-4" style={{ borderColor: block.color }}>
                                <h4 className="font-medium text-white mb-2">{block.name}</h4>

                                {block.workouts && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-300">
                                            {block.workouts.length} workouts across {block.duration} weeks
                                        </p>

                                        {/* Sample workout preview */}
                                        {block.workouts.slice(0, 1).map((workout, workoutIndex) => (
                                            <div key={workout.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                                                <h5 className="font-medium text-white mb-2">
                                                    Sample Workout: Week {workout.week}, Day {workout.day}
                                                </h5>

                                                <div className="space-y-2">
                                                    {workout.exercises?.slice(0, 3).map((exercise, exerciseIndex) => (
                                                        <div key={exercise.id} className="flex justify-between text-sm">
                                                            <span className="text-gray-200">{exercise.name}</span>
                                                            <span className="text-gray-300">
                                                                {exercise.sets} × {exercise.reps} @ {exercise.load}%
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {workout.exercises?.length > 3 && (
                                                        <p className="text-xs text-gray-400">
                                                            + {workout.exercises.length - 3} more exercises
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => actions.setActiveTab('methods')}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                >
                    Back: Training Methods
                </button>

                {generatedProgram && (
                    <button
                        onClick={() => {/* Navigate to program dashboard */ }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Go to Program Dashboard
                    </button>
                )}
            </div>
        </div>
    );
};

// Helper functions
const calculateWeekStart = (blocks, currentIndex) => {
    let weekStart = 1;
    for (let i = 0; i < currentIndex; i++) {
        weekStart += blocks[i].duration;
    }
    return weekStart;
};

const calculateWeekEnd = (blocks, currentIndex) => {
    return calculateWeekStart(blocks, currentIndex) + blocks[currentIndex].duration - 1;
};

export default ProgramPreview;
