import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext';
import { calculateMEV, calculateMRV } from '../../lib/algorithms/rpAlgorithms';

const TimelineBlocks: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch, validateCurrentStep, canProceedToNextStep } = useBuilder();
    const { programDetails } = state;

    // Calculate number of blocks based on duration
    const calculateBlocks = () => {
        const weeks = programDetails.duration;
        const blocks = [];

        if (weeks <= 8) {
            blocks.push({ type: 'accumulation', weeks: weeks - 1, name: 'Accumulation' });
            blocks.push({ type: 'deload', weeks: 1, name: 'Deload' });
        } else if (weeks <= 12) {
            blocks.push({ type: 'accumulation', weeks: 6, name: 'Accumulation 1' });
            blocks.push({ type: 'intensification', weeks: weeks - 7, name: 'Intensification' });
            blocks.push({ type: 'deload', weeks: 1, name: 'Deload' });
        } else {
            // For longer programs, add realization phase
            const accumulationWeeks = Math.floor(weeks * 0.4);
            const intensificationWeeks = Math.floor(weeks * 0.3);
            const realizationWeeks = Math.floor(weeks * 0.2);
            const deloadWeeks = weeks - accumulationWeeks - intensificationWeeks - realizationWeeks;

            blocks.push({ type: 'accumulation', weeks: accumulationWeeks, name: 'Accumulation' });
            blocks.push({ type: 'intensification', weeks: intensificationWeeks, name: 'Intensification' });
            blocks.push({ type: 'realization', weeks: realizationWeeks, name: 'Realization' });
            blocks.push({ type: 'deload', weeks: deloadWeeks, name: 'Recovery' });
        }

        return blocks;
    };

    const blocks = calculateBlocks();

    // Update blocks in state when component mounts or duration changes
    useEffect(() => {
        dispatch({ type: 'SET_BLOCKS', payload: blocks });
    }, [programDetails.duration, dispatch]);

    // Handle next button click
    const handleNext = () => {
        if (canProceedToNextStep()) {
            console.log('🔄 Proceeding to volume distribution...');
            dispatch({ type: 'SET_STEP', payload: 3.5 });

            setTimeout(() => {
                console.log('🔄 Navigating to volume distribution...');
                navigate('/program-design/volume-distribution');
            }, 0);
        }
    };

    // Handle back button click
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 2 });
        navigate('/program-design/template');
    };

    // Form validation
    const isFormValid = validateCurrentStep();

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Timeline & Blocks</h1>
                    <p className="text-gray-400">Step 3 of 4 - Configure your training phases</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-6">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Program Overview */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Program Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Program Name</p>
                                <p className="text-white font-semibold">{programDetails.name}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Duration</p>
                                <p className="text-white font-semibold">{programDetails.duration} weeks</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Experience</p>
                                <p className="text-white font-semibold capitalize">{programDetails.trainingExperience}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-400 text-sm">Training Days</p>
                                <p className="text-white font-semibold">{programDetails.trainingDaysPerWeek} days/week</p>
                            </div>
                        </div>
                    </div>

                    {/* Phase Structure */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">Phase Structure</h2>
                            <p className="text-gray-400">
                                Based on your {programDetails.duration}-week program, here's the recommended phase breakdown:
                            </p>
                        </div>

                        {/* Timeline visualization */}
                        <div className="bg-gray-800 rounded-lg p-6 mb-6">
                            <div className="relative" style={{ height: '120px' }}>
                                {/* Timeline bar */}
                                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 rounded-full transform -translate-y-1/2" />

                                {/* Blocks */}
                                <div className="relative h-full">
                                    {blocks.map((block, index) => {
                                        const position = blocks.slice(0, index).reduce((acc, b) => acc + b.weeks, 0);
                                        const width = (block.weeks / programDetails.duration) * 100;

                                        return (
                                            <div
                                                key={index}
                                                className="absolute transform -translate-x-1/2"
                                                style={{ left: `${(position / programDetails.duration) * 100 + width / 2}%`, top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${block.type === 'accumulation' ? 'bg-blue-500' :
                                                            block.type === 'intensification' ? 'bg-yellow-500' :
                                                                block.type === 'realization' ? 'bg-red-500' :
                                                                    'bg-gray-500'
                                                            }`}
                                                    />
                                                    <div className="mt-3 text-center">
                                                        <p className="text-sm font-medium text-gray-200 whitespace-nowrap">{block.name}</p>
                                                        <p className="text-xs text-gray-400">{block.weeks} weeks</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Block details */}
                        <div className="space-y-4">
                            {blocks.map((block, index) => {
                                const startWeek = blocks.slice(0, index).reduce((acc, b) => acc + b.weeks, 0) + 1;
                                const endWeek = blocks.slice(0, index + 1).reduce((acc, b) => acc + b.weeks, 0);

                                return (
                                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={`w-4 h-4 rounded-full ${block.type === 'accumulation' ? 'bg-blue-500' :
                                                        block.type === 'intensification' ? 'bg-yellow-500' :
                                                            block.type === 'realization' ? 'bg-red-500' :
                                                                'bg-gray-500'
                                                        }`}
                                                />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-100">{block.name}</h3>
                                                    <p className="text-sm text-gray-400">Weeks {startWeek} - {endWeek}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400">Volume Focus</p>
                                                <p className="text-lg font-medium text-gray-200">
                                                    {block.type === 'accumulation' ? 'MEV → MRV' :
                                                        block.type === 'intensification' ? 'MAV → MEV' :
                                                            block.type === 'realization' ? 'Taper' :
                                                                'Recovery'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Block description */}
                                        <div className="mt-3 text-sm text-gray-400">
                                            {block.type === 'accumulation' && 'Build volume progressively from MEV to MRV. Focus on hypertrophy adaptations.'}
                                            {block.type === 'intensification' && 'Maintain volume around MAV while increasing intensity. Strength focus.'}
                                            {block.type === 'realization' && 'Taper volume to realize strength gains. Peak performance phase.'}
                                            {block.type === 'deload' && 'Reduce volume and intensity to promote recovery and supercompensation.'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specialization options */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4">
                            Specialization Focus (Optional)
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Choose a muscle group to prioritize during accumulation phases. This will increase volume by 30% for the selected muscle while maintaining others.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'None'].map((muscle) => (
                                <button
                                    key={muscle}
                                    onClick={() => dispatch({ type: 'SET_SPECIALIZATION', payload: muscle })}
                                    className={`px-4 py-3 rounded-lg border transition-colors ${state.specialization === muscle
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                                        }`}
                                >
                                    {muscle}
                                </button>
                            ))}
                        </div>

                        {state.specialization && state.specialization !== 'None' && (
                            <div className="mt-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                                <p className="text-red-200 font-medium">
                                    {state.specialization} Specialization Selected
                                </p>
                                <p className="text-red-300/70 text-sm mt-1">
                                    {state.specialization} will receive +30% volume during accumulation phases while other muscle groups maintain standard volumes.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Templates
                        </button>

                        <div className="flex items-center space-x-4">
                            {!isFormValid && (
                                <p className="text-yellow-400 text-sm">
                                    Review your selections to continue
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!isFormValid}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${isFormValid
                                    ? 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next: Volume Distribution →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineBlocks;
