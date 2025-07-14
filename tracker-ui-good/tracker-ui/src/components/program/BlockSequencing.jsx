import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProgramContext } from '../../contexts/ProgramContext';

// Sortable Block Item Component
const SortableBlockItem = ({ block, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white border-2 border-gray-200 rounded-lg p-4 cursor-move hover:border-gray-300 transition-colors ${isDragging ? 'shadow-lg' : 'shadow-sm'
                }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: block.color }}
                    />
                    <div>
                        <h4 className="font-medium text-gray-900">{block.name}</h4>
                        <p className="text-sm text-gray-600">{block.duration} weeks</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Week {getWeekRange(index)}</p>
                    <p className="text-xs text-gray-500 capitalize">{block.phase}</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{block.description}</p>

            {/* Duration Controls */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Duration:</span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle duration decrease
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                    >
                        -
                    </button>
                    <span className="text-sm font-medium">{block.duration}w</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle duration increase
                        }}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

// Calendar View Component
const CalendarView = ({ blocks }) => {
    const weeks = [];
    let currentWeek = 1;

    blocks.forEach((block, blockIndex) => {
        for (let i = 0; i < block.duration; i++) {
            weeks.push({
                weekNumber: currentWeek,
                blockId: block.id,
                blockName: block.name,
                blockColor: block.color,
                phase: block.phase,
                weekInBlock: i + 1
            });
            currentWeek++;
        }
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-4">Program Calendar</h4>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {weeks.map((week, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-lg border-2 border-gray-200 p-2 text-center"
                        style={{
                            backgroundColor: `${week.blockColor}20`,
                            borderColor: week.blockColor
                        }}
                    >
                        <div className="text-xs font-medium text-gray-700">W{week.weekNumber}</div>
                        <div className="text-xs text-gray-600 mt-1">{week.blockName}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Total Duration: {weeks.length} weeks
            </div>
        </div>
    );
};

// Block Templates
const blockTemplates = [
    {
        id: 'hypertrophy',
        name: 'Hypertrophy Focus',
        blocks: [
            { id: 'acc1', name: 'Accumulation 1', duration: 4, color: '#10B981', phase: 'accumulation' },
            { id: 'int1', name: 'Intensification 1', duration: 3, color: '#F59E0B', phase: 'intensification' },
            { id: 'real1', name: 'Realization 1', duration: 1, color: '#EF4444', phase: 'realization' },
            { id: 'deload1', name: 'Deload 1', duration: 1, color: '#6B7280', phase: 'deload' }
        ]
    },
    {
        id: 'strength',
        name: 'Strength Focus',
        blocks: [
            { id: 'acc1', name: 'Accumulation', duration: 3, color: '#10B981', phase: 'accumulation' },
            { id: 'int1', name: 'Intensification 1', duration: 3, color: '#F59E0B', phase: 'intensification' },
            { id: 'int2', name: 'Intensification 2', duration: 3, color: '#F59E0B', phase: 'intensification' },
            { id: 'real1', name: 'Realization', duration: 2, color: '#EF4444', phase: 'realization' },
            { id: 'deload1', name: 'Deload', duration: 1, color: '#6B7280', phase: 'deload' }
        ]
    }
];

const BlockSequencing = () => {
    const { state, actions } = useProgramContext();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = state.blockSequence.findIndex(block => block.id === active.id);
            const newIndex = state.blockSequence.findIndex(block => block.id === over.id);

            const newSequence = arrayMove(state.blockSequence, oldIndex, newIndex);
            actions.setBlockSequence(newSequence);
        }
    };

    const handleTemplateSelect = (template) => {
        const newBlocks = template.blocks.map(block => ({
            ...block,
            description: getBlockDescription(block.phase)
        }));
        actions.setBlockSequence(newBlocks);
    };

    const addBlock = (phase) => {
        const newBlock = {
            id: `${phase}-${Date.now()}`,
            name: `${phase.charAt(0).toUpperCase() + phase.slice(1)} Block`,
            duration: phase === 'deload' ? 1 : 3,
            color: getPhaseColor(phase),
            phase,
            description: getBlockDescription(phase)
        };

        actions.setBlockSequence([...state.blockSequence, newBlock]);
    };

    const removeBlock = (blockId) => {
        const newSequence = state.blockSequence.filter(block => block.id !== blockId);
        actions.setBlockSequence(newSequence);
    };

    return (
        <div className="space-y-6">
            {/* Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Templates</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blockTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                            onClick={() => handleTemplateSelect(template)}
                        >
                            <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                            <div className="flex space-x-1">
                                {template.blocks.map((block, index) => (
                                    <div
                                        key={index}
                                        className="h-2 rounded-full"
                                        style={{
                                            backgroundColor: block.color,
                                            width: `${(block.duration / template.blocks.reduce((sum, b) => sum + b.duration, 0)) * 100}%`
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {template.blocks.reduce((sum, block) => sum + block.duration, 0)} weeks total
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Block Sequence */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Block Sequence</h3>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => addBlock('accumulation')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                            + Accumulation
                        </button>
                        <button
                            onClick={() => addBlock('intensification')}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                            + Intensification
                        </button>
                        <button
                            onClick={() => addBlock('realization')}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                            + Realization
                        </button>
                        <button
                            onClick={() => addBlock('deload')}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                            + Deload
                        </button>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={state.blockSequence.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {state.blockSequence.map((block, index) => (
                                <SortableBlockItem
                                    key={block.id}
                                    block={block}
                                    index={index}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {state.blockSequence.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No blocks added yet. Select a template or add blocks manually.</p>
                    </div>
                )}
            </div>

            {/* Calendar View */}
            {state.blockSequence.length > 0 && (
                <CalendarView blocks={state.blockSequence} />
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => actions.setActiveTab('overview')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Back: Overview
                </button>

                <button
                    onClick={() => actions.setActiveTab('parameters')}
                    disabled={state.blockSequence.length === 0}
                    className={`px-6 py-2 rounded-md font-medium ${state.blockSequence.length > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Next: Loading Parameters
                </button>
            </div>
        </div>
    );
};

// Helper functions
const getWeekRange = (blockIndex) => {
    // This would calculate the actual week range based on previous blocks
    return `${blockIndex * 3 + 1}-${(blockIndex + 1) * 3}`;
};

const getPhaseColor = (phase) => {
    const colors = {
        accumulation: '#10B981',
        intensification: '#F59E0B',
        realization: '#EF4444',
        deload: '#6B7280'
    };
    return colors[phase] || '#6B7280';
};

const getBlockDescription = (phase) => {
    const descriptions = {
        accumulation: 'High volume phase for building work capacity and muscle growth',
        intensification: 'Moderate volume, higher intensity phase for strength development',
        realization: 'Low volume, peak intensity phase for expressing maximum strength',
        deload: 'Recovery phase with reduced volume and intensity for adaptation'
    };
    return descriptions[phase] || '';
};

export default BlockSequencing;
