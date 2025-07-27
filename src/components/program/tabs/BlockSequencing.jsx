import React, { useState } from 'react';
import { Calendar, Move, ArrowRight, ArrowLeft, Shuffle, Clock } from 'lucide-react';

const BlockSequencing = ({ assessmentData, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [blockSequence, setBlockSequence] = useState([
        { id: 1, name: 'Accumulation', duration: 4, focus: 'Volume & Work Capacity', color: 'bg-blue-600' },
        { id: 2, name: 'Intensification', duration: 3, focus: 'Intensity & Strength', color: 'bg-orange-600' },
        { id: 3, name: 'Realization', duration: 2, focus: 'Performance & Testing', color: 'bg-green-600' },
        { id: 4, name: 'Deload', duration: 1, focus: 'Recovery & Restoration', color: 'bg-gray-600' }
    ]);

    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, block) => {
        setDraggedItem(block);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (!draggedItem) return;

        const draggedIndex = blockSequence.findIndex(block => block.id === draggedItem.id);
        if (draggedIndex === targetIndex) return;

        const newSequence = [...blockSequence];
        const [draggedBlock] = newSequence.splice(draggedIndex, 1);
        newSequence.splice(targetIndex, 0, draggedBlock);

        setBlockSequence(newSequence);
        setDraggedItem(null);
    };

    const updateBlockDuration = (blockId, newDuration) => {
        setBlockSequence(prev =>
            prev.map(block =>
                block.id === blockId
                    ? { ...block, duration: parseInt(newDuration) }
                    : block
            )
        );
    };

    const getTotalDuration = () => {
        return blockSequence.reduce((total, block) => total + block.duration, 0);
    };

    const moveBlock = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blockSequence.length) return;

        const newSequence = [...blockSequence];
        [newSequence[index], newSequence[newIndex]] = [newSequence[newIndex], newSequence[index]];
        setBlockSequence(newSequence);
    };

    const addCustomBlock = () => {
        const newBlock = {
            id: Date.now(),
            name: 'Custom Block',
            duration: 2,
            focus: 'Custom Focus',
            color: 'bg-purple-600'
        };
        setBlockSequence(prev => [...prev, newBlock]);
    };

    const removeBlock = (blockId) => {
        setBlockSequence(prev => prev.filter(block => block.id !== blockId));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Block Sequencing & Timeline
                </h3>
                <p className="text-blue-300 text-sm">
                    Design your training progression by organizing and customizing training blocks.
                </p>
            </div>

            {/* Program Timeline Overview */}
            <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Program Timeline</h4>
                    <div className="text-white">
                        <span className="text-2xl font-bold">{getTotalDuration()}</span>
                        <span className="text-gray-400 text-sm ml-1">weeks total</span>
                    </div>
                </div>

                {/* Visual Timeline */}
                <div className="flex space-x-2 mb-4">
                    {blockSequence.map((block, index) => (
                        <div
                            key={block.id}
                            className={`${block.color} rounded px-3 py-2 text-white text-xs font-medium flex-1 text-center`}
                            style={{ flexBasis: `${(block.duration / getTotalDuration()) * 100}%` }}
                        >
                            <div>{block.name}</div>
                            <div className="opacity-75">{block.duration}w</div>
                        </div>
                    ))}
                </div>

                {/* Week markers */}
                <div className="flex justify-between text-xs text-gray-400 border-t border-gray-600 pt-2">
                    <span>Week 1</span>
                    <span>Week {Math.floor(getTotalDuration() / 2)}</span>
                    <span>Week {getTotalDuration()}</span>
                </div>
            </div>

            {/* Block Configuration */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Training Blocks</h4>
                    <button
                        onClick={addCustomBlock}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                        Add Custom Block
                    </button>
                </div>

                <div className="space-y-3">
                    {blockSequence.map((block, index) => (
                        <div
                            key={block.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-4 cursor-move hover:border-gray-500 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col space-y-1">
                                        <button
                                            onClick={() => moveBlock(index, 'up')}
                                            disabled={index === 0}
                                            className="text-gray-400 hover:text-white disabled:opacity-30"
                                        >
                                            <ArrowLeft className="h-3 w-3 rotate-90" />
                                        </button>
                                        <button
                                            onClick={() => moveBlock(index, 'down')}
                                            disabled={index === blockSequence.length - 1}
                                            className="text-gray-400 hover:text-white disabled:opacity-30"
                                        >
                                            <ArrowRight className="h-3 w-3 rotate-90" />
                                        </button>
                                    </div>

                                    <div className={`w-4 h-4 ${block.color} rounded`}></div>

                                    <div>
                                        <input
                                            type="text"
                                            value={block.name}
                                            onChange={(e) => {
                                                setBlockSequence(prev =>
                                                    prev.map(b =>
                                                        b.id === block.id
                                                            ? { ...b, name: e.target.value }
                                                            : b
                                                    )
                                                );
                                            }}
                                            className="bg-transparent text-white font-medium border-none outline-none focus:bg-gray-600 rounded px-1"
                                        />
                                        <div className="text-gray-400 text-sm">{block.focus}</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <select
                                            value={block.duration}
                                            onChange={(e) => updateBlockDuration(block.id, e.target.value)}
                                            className="bg-gray-600 text-white border border-gray-500 rounded px-2 py-1 text-sm"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 8].map(weeks => (
                                                <option key={weeks} value={weeks}>
                                                    {weeks} week{weeks > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-gray-400 text-sm">
                                        Block {index + 1}
                                    </div>

                                    {blockSequence.length > 1 && (
                                        <button
                                            onClick={() => removeBlock(block.id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Focus Area Input */}
                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={block.focus}
                                    onChange={(e) => {
                                        setBlockSequence(prev =>
                                            prev.map(b =>
                                                b.id === block.id
                                                    ? { ...b, focus: e.target.value }
                                                    : b
                                            )
                                        );
                                    }}
                                    placeholder="Focus area for this block..."
                                    className="w-full bg-gray-600 text-gray-300 text-sm border border-gray-500 rounded px-3 py-1 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Block Templates */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Common Block Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-600 rounded p-3">
                        <div className="text-white font-medium text-sm">Linear Periodization</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Accumulation → Intensification → Realization → Deload
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded p-3">
                        <div className="text-white font-medium text-sm">Block Periodization</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Concentrated training blocks with specific adaptations
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded p-3">
                        <div className="text-white font-medium text-sm">Undulating Model</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Frequent variation in training variables
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded p-3">
                        <div className="text-white font-medium text-sm">Conjugate Method</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Simultaneous development of multiple qualities
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    Previous: Overview
                </button>
                <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next: Loading Parameters
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default BlockSequencing;
