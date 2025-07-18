import React, { useState } from 'react';
import { useBuilder, type Block } from '../../contexts/MacrocycleBuilderContext';
import { templates, checkCompatibility, Template } from '../../data/templates';

const TemplateSelection: React.FC = () => {
    const { state, dispatch } = useBuilder();
    const { programDetails } = state;
    const [showAllTemplates, setShowAllTemplates] = useState(false);

    // Filter templates based on compatibility
    const getFilteredTemplates = () => {
        if (showAllTemplates) {
            return templates;
        }

        return templates.filter(template => {
            const compatibility = checkCompatibility(template, programDetails);
            return compatibility.isCompatible;
        });
    };

    const filteredTemplates = getFilteredTemplates();
    const allTemplatesCount = templates.length;
    const compatibleTemplatesCount = templates.filter(template =>
        checkCompatibility(template, programDetails).isCompatible
    ).length;

    // Handle template selection
    const handleSelectTemplate = (template: Template) => {
        dispatch({ type: 'SET_TEMPLATE', payload: template.id });

        // Add template blocks to state
        template.blocks.forEach(block => {
            dispatch({
                type: 'ADD_BLOCK',
                payload: {
                    id: `${template.id}-${block.name.toLowerCase().replace(/\s+/g, '-')}`,
                    ...block
                }
            });
        });

        dispatch({ type: 'SET_STEP', payload: 3 });
    };

    // Handle custom build
    const handleBuildCustom = () => {
        dispatch({ type: 'SET_TEMPLATE', payload: 'custom' });

        // Generate default blocks for custom template based on program duration
        const weeks = programDetails.duration;
        const defaultBlocks: Block[] = [];

        if (weeks <= 8) {
            // Simple progression for shorter programs
            defaultBlocks.push({
                id: 'accumulation-custom',
                name: 'Accumulation',
                type: 'accumulation' as const,
                weeks: weeks - 1,
                rirRange: [1, 3] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'deload-custom',
                name: 'Deload',
                type: 'deload' as const,
                weeks: 1,
                rirRange: [3, 4] as [number, number],
                volumeProgression: 'linear' as const
            });
        } else if (weeks <= 12) {
            defaultBlocks.push({
                id: 'accumulation-custom-1',
                name: 'Accumulation 1',
                type: 'accumulation' as const,
                weeks: 6,
                rirRange: [1, 3] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'intensification-custom',
                name: 'Intensification',
                type: 'intensification' as const,
                weeks: weeks - 7,
                rirRange: [0, 2] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'deload-custom',
                name: 'Deload',
                type: 'deload' as const,
                weeks: 1,
                rirRange: [3, 4] as [number, number],
                volumeProgression: 'linear' as const
            });
        } else {
            // Complex progression for longer programs
            const accumulationWeeks = Math.floor(weeks * 0.4);
            const intensificationWeeks = Math.floor(weeks * 0.3);
            const realizationWeeks = Math.floor(weeks * 0.2);
            const deloadWeeks = weeks - accumulationWeeks - intensificationWeeks - realizationWeeks;

            defaultBlocks.push({
                id: 'accumulation-custom',
                name: 'Accumulation',
                type: 'accumulation' as const,
                weeks: accumulationWeeks,
                rirRange: [1, 3] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'intensification-custom',
                name: 'Intensification',
                type: 'intensification' as const,
                weeks: intensificationWeeks,
                rirRange: [0, 2] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'realization-custom',
                name: 'Realization',
                type: 'realization' as const,
                weeks: realizationWeeks,
                rirRange: [0, 1] as [number, number],
                volumeProgression: 'linear' as const
            });
            defaultBlocks.push({
                id: 'deload-custom',
                name: 'Recovery',
                type: 'deload' as const,
                weeks: deloadWeeks,
                rirRange: [3, 4] as [number, number],
                volumeProgression: 'linear' as const
            });
        }

        // Clear existing blocks and add new ones
        dispatch({ type: 'SET_BLOCKS', payload: defaultBlocks });
        dispatch({ type: 'SET_STEP', payload: 3 });
    };

    // Handle back navigation
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 1 });
    };

    // Goal badge colors
    const getGoalBadgeColor = (goal: string) => {
        switch (goal) {
            case 'strength': return 'bg-blue-600';
            case 'hypertrophy': return 'bg-green-600';
            case 'powerlifting': return 'bg-purple-600';
            case 'general': return 'bg-gray-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Choose Your Template</h1>
                    <p className="text-gray-400">Step 2 of 4 - Select a proven program or build your own</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-6">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
                    </div>
                </div>

                {/* Program Summary */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Your Program Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Experience:</span>
                            <p className="capitalize font-medium">{programDetails.trainingExperience}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Diet Phase:</span>
                            <p className="capitalize font-medium">{programDetails.dietPhase}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Duration:</span>
                            <p className="font-medium">{programDetails.duration} weeks</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Training Days:</span>
                            <p className="font-medium">{programDetails.trainingDaysPerWeek} days/week</p>
                        </div>
                    </div>
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-semibold">Templates</h2>
                        <div className="text-sm text-gray-400">
                            {showAllTemplates
                                ? `Showing all ${allTemplatesCount} templates`
                                : `Showing ${compatibleTemplatesCount} compatible templates`
                            }
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAllTemplates(!showAllTemplates)}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                        {showAllTemplates ? 'Show Compatible Only' : 'Show All Templates'}
                    </button>
                </div>

                {/* No Compatible Templates Message */}
                {!showAllTemplates && compatibleTemplatesCount === 0 && (
                    <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 mb-8">
                        <h3 className="text-yellow-200 font-semibold mb-2">No Compatible Templates Found</h3>
                        <p className="text-yellow-300 text-sm mb-4">
                            Based on your program details, no pre-built templates match your requirements exactly.
                            You can either:
                        </p>
                        <ul className="text-yellow-300 text-sm space-y-1 mb-4">
                            <li>• View all templates and use one with adjustments</li>
                            <li>• Build a custom program from scratch</li>
                        </ul>
                        <button
                            onClick={() => setShowAllTemplates(true)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm transition-colors"
                        >
                            Show All Templates
                        </button>
                    </div>
                )}

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredTemplates.map((template) => {
                        const compatibility = checkCompatibility(template, programDetails);

                        return (
                            <div
                                key={template.id}
                                className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
                            >
                                {/* Template Header */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getGoalBadgeColor(template.goal)}`}>
                                            {template.goal.charAt(0).toUpperCase() + template.goal.slice(1)}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                                    {/* Template Stats */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white">{template.duration} weeks</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Training Days:</span>
                                            <span className="text-white">{template.trainingDaysRange[0]}-{template.trainingDaysRange[1]} days/week</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Experience:</span>
                                            <span className="text-white capitalize">{template.experience.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compatibility Status */}
                                <div className="px-6 py-3 bg-gray-800">
                                    {compatibility.isCompatible ? (
                                        <div className="flex items-center text-green-400 text-sm">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">Compatible</span>
                                        </div>
                                    ) : (
                                        <div className="text-yellow-400 text-sm">
                                            <div className="flex items-center mb-1">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">Requires adjustments:</span>
                                            </div>
                                            <ul className="ml-6 text-xs space-y-1">
                                                {compatibility.issues.map((issue, index) => (
                                                    <li key={index} className="text-gray-300">• {issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="p-6 pt-4">
                                    <button
                                        onClick={() => handleSelectTemplate(template)}
                                        className={`w-full py-2 px-4 rounded font-medium transition-colors ${compatibility.isCompatible
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                            }`}
                                    >
                                        {compatibility.isCompatible ? 'Use Template' : 'Use with Adjustments'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Custom Build Option */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-8 text-center mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-4">Build Custom Program</h3>
                    <p className="text-gray-400 mb-6">
                        Create your own macrocycle from scratch with complete control over blocks, timing, and progression.
                    </p>
                    <button
                        onClick={handleBuildCustom}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-8 rounded font-medium transition-colors"
                    >
                        Build Custom Program
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium transition-colors"
                    >
                        ← Back
                    </button>

                    <div className="text-gray-400 text-sm flex items-center">
                        Next: Timeline & Blocks →
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelection;
