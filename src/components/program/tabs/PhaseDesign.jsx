import React, { useState } from 'react';
import { Calendar, Target, TrendingUp, RotateCcw } from 'lucide-react';

const PhaseDesign = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [phases, setPhases] = useState([
        {
            id: 1,
            name: 'Accumulation',
            duration: 4,
            volumeEmphasis: 'high',
            intensityEmphasis: 'moderate',
            focus: 'Build work capacity and volume tolerance',
            color: '#10B981'
        },
        {
            id: 2,
            name: 'Intensification',
            duration: 3,
            volumeEmphasis: 'moderate',
            intensityEmphasis: 'high',
            focus: 'Increase training intensity and specificity',
            color: '#F59E0B'
        },
        {
            id: 3,
            name: 'Realization',
            duration: 2,
            volumeEmphasis: 'low',
            intensityEmphasis: 'very_high',
            focus: 'Peak performance and testing',
            color: '#EF4444'
        },
        {
            id: 4,
            name: 'Deload',
            duration: 1,
            volumeEmphasis: 'very_low',
            intensityEmphasis: 'low',
            focus: 'Recovery and regeneration',
            color: '#6B7280'
        }
    ]);

    const volumeOptions = [
        { value: 'very_low', label: 'Very Low', description: '40-60% of normal' },
        { value: 'low', label: 'Low', description: '60-75% of normal' },
        { value: 'moderate', label: 'Moderate', description: '75-85% of normal' },
        { value: 'high', label: 'High', description: '85-100% of normal' },
        { value: 'very_high', label: 'Very High', description: '100%+ of normal' }
    ];

    const intensityOptions = [
        { value: 'low', label: 'Low', description: '50-70% 1RM' },
        { value: 'moderate', label: 'Moderate', description: '70-80% 1RM' },
        { value: 'high', label: 'High', description: '80-90% 1RM' },
        { value: 'very_high', label: 'Very High', description: '90%+ 1RM' }
    ];

    const updatePhase = (id, field, value) => {
        setPhases(prev => prev.map(phase =>
            phase.id === id ? { ...phase, [field]: value } : phase
        ));
    };

    const getTotalDuration = () => {
        return phases.reduce((total, phase) => total + phase.duration, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Phase Design
                </h3>
                <p className="text-blue-300 text-sm">
                    Design and configure training phases for your periodization model
                </p>
            </div>

            {/* Phase Overview */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Training Phases</h4>
                    <div className="text-white">
                        <span className="text-2xl font-bold">{getTotalDuration()}</span>
                        <span className="text-gray-400 text-sm ml-1">weeks total</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {phases.map((phase, index) => (
                        <div key={phase.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                {/* Phase Name and Color */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: phase.color }}
                                        />
                                        <div>
                                            <input
                                                type="text"
                                                value={phase.name}
                                                onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                                                className="bg-transparent text-white font-medium border-none outline-none"
                                            />
                                            <div className="text-sm text-gray-400">Phase {index + 1}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Duration</label>
                                    <input
                                        type="number"
                                        value={phase.duration}
                                        onChange={(e) => updatePhase(phase.id, 'duration', parseInt(e.target.value) || 1)}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                        min="1"
                                    />
                                    <span className="text-xs text-gray-400">weeks</span>
                                </div>

                                {/* Volume Emphasis */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Volume</label>
                                    <select
                                        value={phase.volumeEmphasis}
                                        onChange={(e) => updatePhase(phase.id, 'volumeEmphasis', e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                    >
                                        {volumeOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Intensity Emphasis */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Intensity</label>
                                    <select
                                        value={phase.intensityEmphasis}
                                        onChange={(e) => updatePhase(phase.id, 'intensityEmphasis', e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                    >
                                        {intensityOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Focus */}
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Focus</label>
                                    <input
                                        type="text"
                                        value={phase.focus}
                                        onChange={(e) => updatePhase(phase.id, 'focus', e.target.value)}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                        placeholder="Phase focus..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Phase Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Volume Guidelines */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Volume Guidelines
                    </h4>
                    <div className="space-y-3">
                        {volumeOptions.map(option => (
                            <div key={option.value} className="flex justify-between items-center">
                                <span className="text-gray-300">{option.label}</span>
                                <span className="text-gray-400 text-sm">{option.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Intensity Guidelines */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-red-400" />
                        Intensity Guidelines
                    </h4>
                    <div className="space-y-3">
                        {intensityOptions.map(option => (
                            <div key={option.value} className="flex justify-between items-center">
                                <span className="text-gray-300">{option.label}</span>
                                <span className="text-gray-400 text-sm">{option.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Phase Timeline Visualization */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Phase Timeline</h4>
                <div className="flex rounded-lg overflow-hidden h-12">
                    {phases.map((phase) => (
                        <div
                            key={phase.id}
                            className="flex items-center justify-center text-white font-medium relative"
                            style={{
                                backgroundColor: phase.color,
                                flex: phase.duration,
                                minWidth: '60px'
                            }}
                        >
                            <span className="text-sm">{phase.name}</span>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs opacity-75">
                                {phase.duration}w
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2 text-sm text-gray-400 text-center">
                    Total Program Duration: {getTotalDuration()} weeks
                </div>
            </div>

            {/* Programming Notes */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Phase Design Principles</h4>
                <div className="text-yellow-300 text-sm space-y-1">
                    <p>• Accumulation: High volume, moderate intensity - build work capacity</p>
                    <p>• Intensification: Moderate volume, high intensity - develop strength/power</p>
                    <p>• Realization: Low volume, very high intensity - peak and test</p>
                    <p>• Deload: Very low volume and intensity - recovery and adaptation</p>
                    <p>• Phases should progress logically from general to specific</p>
                </div>
            </div>
        </div>
    );
};

export default PhaseDesign;
