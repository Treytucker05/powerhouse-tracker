import React, { useEffect, useState } from 'react';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext';
import { calculateMEV, calculateMRV } from '../../lib/algorithms/rpAlgorithms';

// Block templates with enhanced parameters
const blockTemplates = {
    accumulation: {
        name: 'Accumulation',
        description: 'Volume accumulation phase (MEV → MRV)',
        volumeProgression: 'linear' as const,
        intensityRange: [65, 75] as [number, number],
        rirRange: [1, 4] as [number, number],
        primaryFocus: 'Volume & work capacity',
        color: 'bg-blue-500',
        icon: '📈'
    },
    intensification: {
        name: 'Intensification',
        description: 'Strength & density focus',
        volumeProgression: 'undulating' as const,
        intensityRange: [75, 85] as [number, number],
        rirRange: [1, 3] as [number, number],
        primaryFocus: 'Strength & power',
        color: 'bg-yellow-500',
        icon: '⚡'
    },
    realization: {
        name: 'Realization',
        description: 'Peak performance & taper',
        volumeProgression: 'block' as const,
        intensityRange: [85, 95] as [number, number],
        rirRange: [0, 2] as [number, number],
        primaryFocus: 'Peak strength & skill',
        color: 'bg-red-500',
        icon: '🎯'
    },
    deload: {
        name: 'Deload',
        description: 'Recovery & restoration',
        volumeProgression: 'linear' as const,
        intensityRange: [50, 65] as [number, number],
        rirRange: [3, 4] as [number, number],
        primaryFocus: 'Recovery & mobility',
        color: 'bg-gray-500',
        icon: '🔄'
    }
};

// Import the Block type from context
import type { Block } from '../../contexts/MacrocycleBuilderContext';

const TimelineBlocks: React.FC = () => {
    const { state, dispatch, validateCurrentStep, canProceedToNextStep } = useBuilder();
    const { programDetails } = state;
    const [selectedSpecialization, setSelectedSpecialization] = useState<string[]>([]);

    // Muscle groups for specialization selection
    const muscleGroups = [
        'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
        'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'traps'
    ];

    // Enhanced block calculation with template integration
    const calculateBlocks = (): Block[] => {
        const weeks = programDetails.duration;
        const blocks: Block[] = [];

        if (weeks <= 8) {
            blocks.push({
                id: 'accumulation-1',
                type: 'accumulation',
                weeks: weeks - 1,
                ...blockTemplates.accumulation
            });
            blocks.push({
                id: 'deload-1',
                type: 'deload',
                weeks: 1,
                ...blockTemplates.deload
            });
        } else if (weeks <= 12) {
            blocks.push({
                id: 'accumulation-1',
                type: 'accumulation',
                weeks: 6,
                ...blockTemplates.accumulation,
                name: 'Accumulation 1'
            });
            blocks.push({
                id: 'intensification-1',
                type: 'intensification',
                weeks: weeks - 7,
                ...blockTemplates.intensification
            });
            blocks.push({
                id: 'deload-1',
                type: 'deload',
                weeks: 1,
                ...blockTemplates.deload
            });
        } else {
            // For longer programs, add realization phase
            const accumulationWeeks = Math.floor(weeks * 0.4);
            const intensificationWeeks = Math.floor(weeks * 0.3);
            const realizationWeeks = Math.floor(weeks * 0.2);
            const deloadWeeks = weeks - accumulationWeeks - intensificationWeeks - realizationWeeks;

            blocks.push({
                id: 'accumulation-1',
                type: 'accumulation',
                weeks: accumulationWeeks,
                ...blockTemplates.accumulation
            });
            blocks.push({
                id: 'intensification-1',
                type: 'intensification',
                weeks: intensificationWeeks,
                ...blockTemplates.intensification
            });
            blocks.push({
                id: 'realization-1',
                type: 'realization',
                weeks: realizationWeeks,
                ...blockTemplates.realization
            });
            blocks.push({
                id: 'deload-1',
                type: 'deload',
                weeks: deloadWeeks,
                ...blockTemplates.deload,
                name: 'Recovery'
            });
        }

        return blocks;
    };

    const blocks = calculateBlocks();

    // Update blocks in state when component mounts or duration changes
    useEffect(() => {
        dispatch({ type: 'SET_BLOCKS', payload: blocks });
    }, [programDetails.duration, dispatch]);

    // Handle specialization selection
    const handleSpecializationChange = (muscle: string) => {
        if (selectedSpecialization.includes(muscle)) {
            setSelectedSpecialization(prev => prev.filter(m => m !== muscle));
        } else if (selectedSpecialization.length < 2) {
            setSelectedSpecialization(prev => [...prev, muscle]);
        }
    };

    // Update specialization in state
    useEffect(() => {
        dispatch({ type: 'SET_SPECIALIZATION', payload: selectedSpecialization.join(', ') });
    }, [selectedSpecialization, dispatch]);

    // Handle next button click
    const handleNext = () => {
        if (canProceedToNextStep()) {
            console.log('🔄 Proceeding to volume distribution...');
            dispatch({ type: 'SET_STEP', payload: 3.5 });
        }
    };

    // Handle back button click
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 2 });
    };

    // Form validation
    const isFormValid = validateCurrentStep();

    // Handle block duration changes
    const handleBlockWeeksChange = (blockIndex: number, newWeeks: number) => {
        const updatedBlocks = blocks.map((block, index) => {
            if (index === blockIndex) {
                return { ...block, weeks: Math.max(1, Math.min(8, newWeeks)) };
            }
            return block;
        });

        // Update the blocks in state
        dispatch({ type: 'SET_BLOCKS', payload: updatedBlocks });
    };

    // Handle block removal
    const handleRemoveBlock = (blockIndex: number) => {
        const updatedBlocks = blocks.filter((_, index) => index !== blockIndex);
        dispatch({ type: 'SET_BLOCKS', payload: updatedBlocks });
    };

    // Handle adding a new block
    const handleAddBlock = () => {
        const newBlock = {
            id: `new-block-${Date.now()}`,
            name: 'New Block',
            type: 'accumulation' as const,
            weeks: 4,
            rirRange: [1, 3] as [number, number],
            volumeProgression: 'linear' as const
        };
        dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    };

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

                        {/* Enhanced Block details */}
                        <div className="space-y-4">
                            {blocks.map((block, index) => {
                                const startWeek = blocks.slice(0, index).reduce((acc, b) => acc + b.weeks, 0) + 1;
                                const endWeek = blocks.slice(0, index + 1).reduce((acc, b) => acc + b.weeks, 0);
                                const template = blockTemplates[block.type];

                                return (
                                    <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-6 h-6 rounded-full ${template.color} flex items-center justify-center text-white text-sm font-bold`}>
                                                    {template.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{block.name}</h3>
                                                    <p className="text-sm text-gray-400">{template.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <p className="text-white font-semibold">Weeks {startWeek}-{endWeek}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <button
                                                            onClick={() => handleBlockWeeksChange(index, block.weeks - 1)}
                                                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-sm text-gray-400">{block.weeks} weeks</span>
                                                        <button
                                                            onClick={() => handleBlockWeeksChange(index, block.weeks + 1)}
                                                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveBlock(index)}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                    title="Remove block"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>

                                        {/* Phase Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                            <div className="bg-gray-900 rounded-lg p-3">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">Intensity Range</p>
                                                <p className="text-white font-semibold">{template.intensityRange[0]}-{template.intensityRange[1]}%</p>
                                            </div>
                                            <div className="bg-gray-900 rounded-lg p-3">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">RIR Range</p>
                                                <p className="text-white font-semibold">{block.rirRange[0]}-{block.rirRange[1]} RIR</p>
                                            </div>
                                            <div className="bg-gray-900 rounded-lg p-3">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">Volume Pattern</p>
                                                <p className="text-white font-semibold capitalize">{block.volumeProgression}</p>
                                            </div>
                                            <div className="bg-gray-900 rounded-lg p-3">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">Primary Focus</p>
                                                <p className="text-white font-semibold">{template.primaryFocus}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specialization Selection */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">Specialization Focus</h2>
                            <p className="text-gray-400">
                                Select up to 2 muscle groups to prioritize. These will receive 30% extra volume while others are reduced to maintain systemic MRV.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {muscleGroups.map((muscle) => (
                                <button
                                    key={muscle}
                                    onClick={() => handleSpecializationChange(muscle)}
                                    disabled={!selectedSpecialization.includes(muscle) && selectedSpecialization.length >= 2}
                                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedSpecialization.includes(muscle)
                                        ? 'border-red-500 bg-red-500/20 text-red-300'
                                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                                        } ${!selectedSpecialization.includes(muscle) && selectedSpecialization.length >= 2
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'cursor-pointer'
                                        }`}
                                >
                                    <div className="text-center">
                                        <p className="text-sm font-medium capitalize">{muscle}</p>
                                        {selectedSpecialization.includes(muscle) && (
                                            <p className="text-xs text-red-400 mt-1">+30% volume</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedSpecialization.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                                <p className="text-blue-300 text-sm">
                                    <strong>Selected:</strong> {selectedSpecialization.join(', ')} will receive priority volume.
                                    Other muscle groups will be reduced to maintain recovery capacity.
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

                    {/* Add Block Button */}
                    <div className="mt-4">
                        <button
                            onClick={handleAddBlock}
                            className="w-full bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg p-4 transition-colors"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-gray-400 text-xl">+</span>
                                <span className="text-gray-400">Add New Block</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineBlocks;
