import React, { useState } from 'react';
import { Layers, RotateCcw, CheckCircle, Target, TrendingUp, Zap } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Mesocycle Item Component
const SortableMesocycleItem = ({ mesocycle, index, onUpdate, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: mesocycle.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getBlockTypeIcon = (type) => {
        switch (type) {
            case 'accumulation': return Target;
            case 'transmutation': return TrendingUp;
            case 'realization': return Zap;
            default: return Layers;
        }
    };

    const getBlockTypeColor = (type) => {
        switch (type) {
            case 'accumulation': return 'bg-blue-500';
            case 'transmutation': return 'bg-yellow-500';
            case 'realization': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const BlockIcon = getBlockTypeIcon(mesocycle.type);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-gray-600 border-2 border-gray-500 rounded-lg p-4 cursor-move hover:border-gray-400 transition-colors ${isDragging ? 'shadow-lg' : 'shadow-sm'
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getBlockTypeColor(mesocycle.type)}`} />
                    <BlockIcon className="h-5 w-5 text-white" />
                    <div>
                        <h4 className="font-medium text-white">{mesocycle.name}</h4>
                        <p className="text-sm text-gray-300 capitalize">{mesocycle.type}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm font-medium text-gray-200">{mesocycle.duration} weeks</p>
                    <p className="text-xs text-gray-400">Week {index * 4 + 1}-{(index + 1) * 4}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-white ml-1 capitalize">{mesocycle.volume}</span>
                </div>
                <div>
                    <span className="text-gray-400">Intensity:</span>
                    <span className="text-white ml-1 capitalize">{mesocycle.intensity}</span>
                </div>
                <div>
                    <span className="text-gray-400">Focus:</span>
                    <span className="text-white ml-1 capitalize">{mesocycle.focus.replace('_', ' ')}</span>
                </div>
                <div>
                    <span className="text-gray-400">Deload:</span>
                    <span className="text-white ml-1">{mesocycle.hasDeload ? 'Yes' : 'No'}</span>
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(mesocycle.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

const MesocyclePlanning = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [mesocycles, setMesocycles] = useState([
        {
            id: 'accumulation-1',
            name: 'Accumulation Block 1',
            type: 'accumulation',
            duration: 4,
            volume: 'high',
            intensity: 'moderate',
            focus: 'base_building',
            hasDeload: true
        },
        {
            id: 'transmutation-1',
            name: 'Transmutation Block 1',
            type: 'transmutation',
            duration: 3,
            volume: 'moderate',
            intensity: 'high',
            focus: 'strength',
            hasDeload: false
        },
        {
            id: 'realization-1',
            name: 'Realization Block 1',
            type: 'realization',
            duration: 2,
            volume: 'low',
            intensity: 'very_high',
            focus: 'peaking',
            hasDeload: false
        }
    ]);

    const [newMesocycle, setNewMesocycle] = useState({
        name: '',
        type: 'accumulation',
        duration: 4,
        volume: 'moderate',
        intensity: 'moderate',
        focus: 'hypertrophy',
        hasDeload: true
    });

    const mesocycleTypes = [
        {
            type: 'accumulation',
            name: 'Accumulation',
            description: 'High volume, moderate intensity, building work capacity',
            characteristics: ['High volume', 'Moderate intensity', 'Base building', 'Work capacity'],
            duration: '4-6 weeks',
            color: 'blue'
        },
        {
            type: 'transmutation',
            name: 'Transmutation',
            description: 'Moderate volume, high intensity, sport-specific adaptations',
            characteristics: ['Moderate volume', 'High intensity', 'Specific training', 'Skill development'],
            duration: '2-4 weeks',
            color: 'yellow'
        },
        {
            type: 'realization',
            name: 'Realization',
            description: 'Low volume, very high intensity, competition/testing',
            characteristics: ['Low volume', 'Very high intensity', 'Peaking', 'Competition'],
            duration: '1-2 weeks',
            color: 'red'
        }
    ];

    const focusOptions = {
        base_building: 'Base Building',
        hypertrophy: 'Hypertrophy',
        strength: 'Strength',
        power: 'Power',
        endurance: 'Endurance',
        sport_specific: 'Sport Specific',
        peaking: 'Peaking',
        recovery: 'Recovery'
    };

    const volumeIntensityOptions = {
        very_low: 'Very Low',
        low: 'Low',
        moderate: 'Moderate',
        high: 'High',
        very_high: 'Very High'
    };

    const addMesocycle = () => {
        if (newMesocycle.name) {
            const mesocycle = {
                ...newMesocycle,
                id: `${newMesocycle.type}-${Date.now()}`
            };
            setMesocycles(prev => [...prev, mesocycle]);
            setNewMesocycle({
                name: '',
                type: 'accumulation',
                duration: 4,
                volume: 'moderate',
                intensity: 'moderate',
                focus: 'hypertrophy',
                hasDeload: true
            });
        }
    };

    const removeMesocycle = (id) => {
        setMesocycles(prev => prev.filter(m => m.id !== id));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setMesocycles((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const getTotalDuration = () => {
        return mesocycles.reduce((total, mesocycle) => total + mesocycle.duration, 0);
    };

    return (
        <div className="space-y-6">
            {/* Mesocycle Theory */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Layers className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Mesocycle Models</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {mesocycleTypes.map((type) => (
                        <div key={type.type} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full bg-${type.color}-500`} />
                                <h4 className="font-semibold text-white">{type.name}</h4>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{type.description}</p>
                            <div className="space-y-1 text-xs text-gray-400">
                                <p><strong>Duration:</strong> {type.duration}</p>
                                <p><strong>Characteristics:</strong></p>
                                <ul className="ml-2 space-y-0.5">
                                    {type.characteristics.map((char, index) => (
                                        <li key={index}>• {char}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Mesocycle */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Add Mesocycle Block</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                    <input
                        type="text"
                        placeholder="Block name"
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.name}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, name: e.target.value }))}
                    />

                    <select
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.type}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, type: e.target.value }))}
                    >
                        {mesocycleTypes.map(type => (
                            <option key={type.type} value={type.type}>{type.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        max="8"
                        placeholder="Weeks"
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.duration}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />

                    <select
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.volume}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, volume: e.target.value }))}
                    >
                        {Object.entries(volumeIntensityOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.intensity}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, intensity: e.target.value }))}
                    >
                        {Object.entries(volumeIntensityOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={newMesocycle.focus}
                        onChange={(e) => setNewMesocycle(prev => ({ ...prev, focus: e.target.value }))}
                    >
                        {Object.entries(focusOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <button
                        onClick={addMesocycle}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        disabled={!newMesocycle.name}
                    >
                        Add Block
                    </button>
                </div>
            </div>

            {/* Mesocycle Sequence */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Mesocycle Sequence</h3>
                    <div className="text-sm text-gray-400">
                        Total Duration: {getTotalDuration()} weeks
                    </div>
                </div>

                {mesocycles.length > 0 ? (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={mesocycles.map(m => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {mesocycles.map((mesocycle, index) => (
                                    <SortableMesocycleItem
                                        key={mesocycle.id}
                                        mesocycle={mesocycle}
                                        index={index}
                                        onRemove={removeMesocycle}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No mesocycles added yet</p>
                        <p className="text-sm">Add training blocks to structure your program</p>
                    </div>
                )}
            </div>

            {/* Sequencing Guidelines */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Sequencing Guidelines</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-blue-400 mb-2">Block Periodization Model (Issurin)</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Accumulation:</strong> High volume, build work capacity</li>
                            <li>• <strong>Transmutation:</strong> Transform to specific qualities</li>
                            <li>• <strong>Realization:</strong> Low volume, peak performance</li>
                            <li>• Sequence can repeat multiple times per year</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-yellow-400 mb-2">Linear Model (Bompa)</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <strong>General Preparation:</strong> Build foundation</li>
                            <li>• <strong>Specific Preparation:</strong> Sport-specific training</li>
                            <li>• <strong>Competition:</strong> Maintain and peak</li>
                            <li>• Progressive intensity increase throughout</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Step 4 of 7: Plan Mesocycles
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Microcycle Design
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MesocyclePlanning;

