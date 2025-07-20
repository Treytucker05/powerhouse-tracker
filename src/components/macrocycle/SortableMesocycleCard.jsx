import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Drag,
    Calendar,
    Clock,
    BarChart3,
    Zap,
    Settings,
    Trash2,
    Edit3,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

/**
 * SortableMesocycleCard - Draggable mesocycle card component
 * 
 * Features:
 * - Drag and drop functionality
 * - Expandable details
 * - Inline editing
 * - Visual feedback for mesocycle type
 */

export const SortableMesocycleCard = ({
    mesocycle,
    mesocycleTypes,
    programGoals,
    index,
    onUpdate,
    onRemove
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...mesocycle });

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

    const mesocycleType = mesocycleTypes[mesocycle.type] || mesocycleTypes.accumulation;
    const goalConfig = programGoals[mesocycle.goalType] || programGoals.hypertrophy;

    const handleSave = () => {
        onUpdate(mesocycle.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...mesocycle });
        setIsEditing(false);
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : 'Not set';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-gray-600 border border-gray-500 rounded-lg transition-all ${isDragging ? 'shadow-2xl ring-2 ring-blue-500' : 'hover:border-gray-400'
                }`}
        >
            {/* Main card header */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        {/* Drag handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="mt-1 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-500 transition-colors"
                        >
                            <Drag className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Mesocycle info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-3 h-3 rounded-full bg-${mesocycleType.color}-500`}></span>
                                <span className="text-lg">{mesocycleType.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-white">{mesocycle.name}</h4>
                                    <p className="text-sm text-gray-300">
                                        Week {mesocycle.startWeek} • {mesocycle.duration} weeks • {mesocycleType.name}
                                    </p>
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Volume:</span>
                                    <span className="text-white ml-2 font-medium">{mesocycle.volume}%</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Intensity:</span>
                                    <span className="text-white ml-2 font-medium">{mesocycle.intensity}%</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Goal:</span>
                                    <span className={`text-${goalConfig.color}-400 ml-2 font-medium`}>
                                        {goalConfig.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
                        >
                            <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={() => onRemove(mesocycle.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`bg-${mesocycleType.color}-500 h-2 rounded-full transition-all`}
                            style={{ width: '0%' }} // This would be based on actual progress
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Start: {formatDate(mesocycle.startDate)}</span>
                        <span>End: {formatDate(mesocycle.endDate)}</span>
                    </div>
                </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-500">
                    <div className="pt-4 space-y-4">
                        {/* Mesocycle characteristics */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Characteristics:</h5>
                            <div className="flex flex-wrap gap-2">
                                {mesocycleType.characteristics.map((char, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Focus and objectives */}
                        {mesocycle.focus && (
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Focus:</h5>
                                <p className="text-sm text-gray-400">{mesocycle.focus}</p>
                            </div>
                        )}

                        {/* Volume and intensity ranges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Volume Range:</h5>
                                <div className="text-sm text-gray-400">
                                    {mesocycleType.volumeRange[0]}% - {mesocycleType.volumeRange[1]}%
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Intensity Range:</h5>
                                <div className="text-sm text-gray-400">
                                    {mesocycleType.intensityRange[0]}% - {mesocycleType.intensityRange[1]}%
                                </div>
                            </div>
                        </div>

                        {/* Progression model */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Progression Model:</h5>
                            <div className="text-sm text-gray-400 capitalize">
                                {mesocycle.progressionModel || 'Linear'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">Edit Mesocycle</h3>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select
                                    value={editData.type}
                                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {Object.entries(mesocycleTypes).map(([key, type]) => (
                                        <option key={key} value={key}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="8"
                                    value={editData.duration}
                                    onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Goal Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Type</label>
                                <select
                                    value={editData.goalType}
                                    onChange={(e) => setEditData({ ...editData, goalType: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                >
                                    {Object.entries(programGoals).map(([key, goal]) => (
                                        <option key={key} value={key}>{goal.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Volume and Intensity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Volume Target (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="20"
                                        max="100"
                                        value={editData.volume}
                                        onChange={(e) => setEditData({ ...editData, volume: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Intensity Target (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="50"
                                        max="100"
                                        value={editData.intensity}
                                        onChange={(e) => setEditData({ ...editData, intensity: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Focus */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Focus</label>
                                <textarea
                                    value={editData.focus}
                                    onChange={(e) => setEditData({ ...editData, focus: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Describe the main focus of this mesocycle..."
                                />
                            </div>

                            {/* Progression Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Progression Model</label>
                                <select
                                    value={editData.progressionModel}
                                    onChange={(e) => setEditData({ ...editData, progressionModel: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="linear">Linear</option>
                                    <option value="undulating">Undulating</option>
                                    <option value="block">Block</option>
                                    <option value="conjugate">Conjugate</option>
                                </select>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-300 hover:text-white border border-gray-500 rounded-md hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
