import React, { useState, useEffect } from 'react';
import {
    Calendar,
    TrendingUp,
    Target,
    Clock,
    BarChart3,
    CheckCircle,
    RotateCcw,
    Activity,
    Settings,
    Layers,
    Zap,
    ArrowRight,
    PlayCircle,
    Plus
} from 'lucide-react';
import { EnhancedMacrocyclePlanner } from '../../../../../components/macrocycle/EnhancedMacrocyclePlanner';

/**
 * PeriodizationPlanning.jsx - Enhanced Tab
 * 
 * Comprehensive periodization planning covering:
 * - Macrocycle Structure (annual planning)
 * - Mesocycle Planning (2-6 week blocks)
 * - Microcycle Design (weekly patterns)
 * - Phase Transitions & Deloads
 * - Competition Peaking
 */

const PeriodizationPlanning = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    // Planning mode: 'enhanced' for multi-goal system, 'traditional' for single-goal
    const [planningMode, setPlanningMode] = useState('enhanced');

    // State for comprehensive periodization
    const [periodization, setPeriodization] = useState({
        macrocycle: {
            duration: 52, // weeks
            startDate: new Date(),
            goals: [],
            phases: []
        },
        mesocycles: [],
        microcycles: {
            patterns: [],
            defaultStructure: 'linear'
        },
        competitions: [],
        deloads: {
            frequency: 4, // every 4 weeks
            type: 'volume', // volume, intensity, complete
            duration: 1 // weeks
        }
    });

    const [activeSubTab, setActiveSubTab] = useState('macrocycle');
    const [selectedPhase, setSelectedPhase] = useState(null);

    // Predefined phase templates
    const phaseTemplates = {
        'anatomical-adaptation': {
            name: 'Anatomical Adaptation',
            duration: 4,
            focus: 'Base building, movement quality',
            volume: 'moderate-high',
            intensity: 'low',
            characteristics: ['High volume', 'Low intensity', 'Movement quality focus', 'Connective tissue adaptation']
        },
        'hypertrophy': {
            name: 'Hypertrophy',
            duration: 6,
            focus: 'Muscle mass development',
            volume: 'high',
            intensity: 'moderate',
            characteristics: ['High volume', 'Moderate intensity', 'Time under tension', 'Metabolic stress']
        },
        'strength': {
            name: 'Strength',
            duration: 6,
            focus: 'Maximum strength development',
            volume: 'moderate',
            intensity: 'high',
            characteristics: ['Moderate volume', 'High intensity', 'Neural adaptation', 'Heavy compound movements']
        },
        'power': {
            name: 'Power',
            duration: 4,
            focus: 'Power and rate of force development',
            volume: 'low-moderate',
            intensity: 'high',
            characteristics: ['Explosive movements', 'Speed development', 'Plyometrics', 'Olympic lifts']
        },
        'competition': {
            name: 'Competition/Peak',
            duration: 2,
            focus: 'Competition preparation and peaking',
            volume: 'low',
            intensity: 'very-high',
            characteristics: ['Low volume', 'Very high intensity', 'Competition specificity', 'Peak performance']
        },
        'deload': {
            name: 'Deload/Recovery',
            duration: 1,
            focus: 'Recovery and regeneration',
            volume: 'very-low',
            intensity: 'low',
            characteristics: ['Active recovery', 'Reduced volume', 'Movement quality', 'Stress management']
        }
    };

    // Mesocycle block types
    const mesocycleTypes = {
        'accumulation': {
            name: 'Accumulation',
            focus: 'Volume accumulation',
            duration: 3,
            characteristics: ['High volume', 'Moderate intensity', 'Work capacity', 'Base building']
        },
        'intensification': {
            name: 'Intensification',
            focus: 'Intensity progression',
            duration: 3,
            characteristics: ['Moderate volume', 'High intensity', 'Strength/power focus', 'Neural adaptation']
        },
        'realization': {
            name: 'Realization',
            focus: 'Performance realization',
            duration: 2,
            characteristics: ['Low volume', 'Very high intensity', 'Competition prep', 'Peak performance']
        },
        'restoration': {
            name: 'Restoration',
            focus: 'Recovery and restoration',
            duration: 1,
            characteristics: ['Very low volume', 'Low intensity', 'Active recovery', 'Regeneration']
        }
    };

    // Microcycle patterns
    const microcyclePatterns = {
        'linear': {
            name: 'Linear Progression',
            pattern: [100, 100, 100, 100, 100, 100, 0], // 6 days on, 1 rest
            description: 'Consistent daily load'
        },
        'undulating': {
            name: 'Undulating',
            pattern: [100, 70, 100, 70, 100, 70, 0], // High-low alternating
            description: 'Alternating high and low intensity'
        },
        'ascending': {
            name: 'Ascending Load',
            pattern: [60, 70, 80, 90, 100, 50, 0], // Progressive increase
            description: 'Gradual load increase through week'
        },
        'conjugate': {
            name: 'Conjugate/Westside',
            pattern: [100, 80, 100, 80, 0, 0, 0], // Max effort + dynamic effort
            description: 'Max effort and dynamic effort days'
        }
    };

    // Initialize default structure
    useEffect(() => {
        initializeDefaultPeriodization();
    }, []);

    const initializeDefaultPeriodization = () => {
        const startDate = new Date();
        const phases = [
            { ...phaseTemplates['anatomical-adaptation'], startWeek: 1 },
            { ...phaseTemplates['hypertrophy'], startWeek: 5 },
            { ...phaseTemplates['strength'], startWeek: 11 },
            { ...phaseTemplates['power'], startWeek: 17 },
            { ...phaseTemplates['competition'], startWeek: 21 },
            { ...phaseTemplates['deload'], startWeek: 23 }
        ];

        setPeriodization(prev => ({
            ...prev,
            macrocycle: {
                ...prev.macrocycle,
                startDate,
                phases,
                goals: ['Increase strength', 'Improve body composition', 'Enhance performance']
            }
        }));

        generateMesocycles(phases);
    };

    const generateMesocycles = (phases) => {
        const mesocycles = [];
        let currentWeek = 1;

        phases.forEach((phase, phaseIndex) => {
            const phaseMesocycles = Math.ceil(phase.duration / 3); // 3-week mesocycles typically

            for (let i = 0; i < phaseMesocycles; i++) {
                const remainingWeeks = Math.min(3, phase.duration - (i * 3));

                mesocycles.push({
                    id: `meso-${phaseIndex}-${i}`,
                    name: `${phase.name} Block ${i + 1}`,
                    phase: phase.name,
                    type: 'accumulation', // Default type
                    startWeek: currentWeek,
                    duration: remainingWeeks,
                    volume: calculateMesocycleVolume(phase, i),
                    intensity: calculateMesocycleIntensity(phase, i),
                    focus: phase.focus
                });

                currentWeek += remainingWeeks;
            }
        });

        setPeriodization(prev => ({
            ...prev,
            mesocycles
        }));
    };

    const calculateMesocycleVolume = (phase, blockIndex) => {
        const baseVolume = {
            'anatomical-adaptation': 80,
            'hypertrophy': 90,
            'strength': 70,
            'power': 50,
            'competition': 30,
            'deload': 40
        }[phase.name] || 70;

        // Slight progression through blocks
        return baseVolume + (blockIndex * 5);
    };

    const calculateMesocycleIntensity = (phase, blockIndex) => {
        const baseIntensity = {
            'anatomical-adaptation': 60,
            'hypertrophy': 70,
            'strength': 85,
            'power': 80,
            'competition': 95,
            'deload': 50
        }[phase.name] || 70;

        // Slight progression through blocks
        return Math.min(baseIntensity + (blockIndex * 3), 100);
    };

    const handlePhaseUpdate = (phaseIndex, updates) => {
        setPeriodization(prev => ({
            ...prev,
            macrocycle: {
                ...prev.macrocycle,
                phases: prev.macrocycle.phases.map((phase, index) =>
                    index === phaseIndex ? { ...phase, ...updates } : phase
                )
            }
        }));
    };

    const handleMesocycleUpdate = (mesocycleId, updates) => {
        setPeriodization(prev => ({
            ...prev,
            mesocycles: prev.mesocycles.map(meso =>
                meso.id === mesocycleId ? { ...meso, ...updates } : meso
            )
        }));
    };

    const addCompetition = (date, name, priority) => {
        setPeriodization(prev => ({
            ...prev,
            competitions: [...prev.competitions, { date, name, priority, id: Date.now() }]
        }));
    };

    const renderMacrocyclePlanning = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Annual Training Plan (Macrocycle)
                </h3>

                {/* Macrocycle Overview */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Training Duration (weeks)
                        </label>
                        <input
                            type="number"
                            min="12"
                            max="104"
                            value={periodization.macrocycle.duration}
                            onChange={(e) => setPeriodization(prev => ({
                                ...prev,
                                macrocycle: { ...prev.macrocycle, duration: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={periodization.macrocycle.startDate.toISOString().split('T')[0]}
                            onChange={(e) => setPeriodization(prev => ({
                                ...prev,
                                macrocycle: { ...prev.macrocycle, startDate: new Date(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Goals
                        </label>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                            {periodization.macrocycle.goals.map((goal, index) => (
                                <div key={index} className="text-sm text-gray-300">• {goal}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Phase Timeline */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Training Phases Timeline</h4>
                    <div className="relative">
                        {/* Timeline bar */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-600 rounded"></div>

                        {/* Phase blocks */}
                        <div className="relative space-y-4">
                            {periodization.macrocycle.phases.map((phase, index) => {
                                const widthPercent = (phase.duration / periodization.macrocycle.duration) * 100;
                                const leftPercent = (phase.startWeek - 1) / periodization.macrocycle.duration * 100;

                                return (
                                    <div key={index} className="relative">
                                        <div
                                            className={`absolute h-8 rounded cursor-pointer transition-colors ${selectedPhase === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            style={{
                                                left: `${leftPercent}%`,
                                                width: `${widthPercent}%`,
                                                top: index * 40 + 'px'
                                            }}
                                            onClick={() => setSelectedPhase(selectedPhase === index ? null : index)}
                                        >
                                            <div className="px-2 py-1 text-xs text-white truncate">
                                                {phase.name} ({phase.duration}w)
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Week markers */}
                        <div className="flex justify-between text-xs text-gray-400 mt-2"
                            style={{ marginTop: (periodization.macrocycle.phases.length * 40 + 20) + 'px' }}>
                            <span>Week 1</span>
                            <span>Week {Math.floor(periodization.macrocycle.duration / 4)}</span>
                            <span>Week {Math.floor(periodization.macrocycle.duration / 2)}</span>
                            <span>Week {Math.floor(3 * periodization.macrocycle.duration / 4)}</span>
                            <span>Week {periodization.macrocycle.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Phase Details */}
                {selectedPhase !== null && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">
                            Phase Details: {periodization.macrocycle.phases[selectedPhase].name}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={periodization.macrocycle.phases[selectedPhase].duration}
                                    onChange={(e) => handlePhaseUpdate(selectedPhase, { duration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Focus</label>
                                <input
                                    type="text"
                                    value={periodization.macrocycle.phases[selectedPhase].focus}
                                    onChange={(e) => handlePhaseUpdate(selectedPhase, { focus: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Key Characteristics</label>
                            <div className="flex flex-wrap gap-2">
                                {periodization.macrocycle.phases[selectedPhase].characteristics?.map((char, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Phase Templates */}
                <div className="mt-6">
                    <h4 className="font-medium text-white mb-3">Add Phase Template</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(phaseTemplates).map(([key, template]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    const newPhase = {
                                        ...template,
                                        startWeek: periodization.macrocycle.phases.length > 0 ?
                                            periodization.macrocycle.phases[periodization.macrocycle.phases.length - 1].startWeek +
                                            periodization.macrocycle.phases[periodization.macrocycle.phases.length - 1].duration : 1
                                    };
                                    setPeriodization(prev => ({
                                        ...prev,
                                        macrocycle: {
                                            ...prev.macrocycle,
                                            phases: [...prev.macrocycle.phases, newPhase]
                                        }
                                    }));
                                }}
                                className="p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-left transition-colors"
                            >
                                <div className="font-medium text-white text-sm">{template.name}</div>
                                <div className="text-xs text-gray-400">{template.focus}</div>
                                <div className="text-xs text-gray-500 mt-1">{template.duration} weeks</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMesocyclePlanning = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                    Mesocycle Planning (Training Blocks)
                </h3>

                {/* Mesocycle Overview */}
                <div className="mb-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Block Periodization Principles</h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                        {Object.entries(mesocycleTypes).map(([key, type]) => (
                            <div key={key}>
                                <strong className="text-blue-300">{type.name}</strong>
                                <p className="text-gray-300 text-xs">{type.focus}</p>
                                <p className="text-gray-400 text-xs">{type.duration} weeks typical</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mesocycle Blocks */}
                <div className="space-y-4">
                    {periodization.mesocycles.map((mesocycle, index) => (
                        <div key={mesocycle.id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-white">{mesocycle.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">
                                        Week {mesocycle.startWeek}-{mesocycle.startWeek + mesocycle.duration - 1}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${mesocycle.type === 'accumulation' ? 'bg-blue-900 text-blue-300' :
                                        mesocycle.type === 'intensification' ? 'bg-orange-900 text-orange-300' :
                                            mesocycle.type === 'realization' ? 'bg-purple-900 text-purple-300' :
                                                'bg-green-900 text-green-300'
                                        }`}>
                                        {mesocycleTypes[mesocycle.type]?.name || mesocycle.type}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Block Type</label>
                                    <select
                                        value={mesocycle.type}
                                        onChange={(e) => handleMesocycleUpdate(mesocycle.id, { type: e.target.value })}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        {Object.entries(mesocycleTypes).map(([key, type]) => (
                                            <option key={key} value={key}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Duration (weeks)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={mesocycle.duration}
                                        onChange={(e) => handleMesocycleUpdate(mesocycle.id, { duration: parseInt(e.target.value) })}
                                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Volume (%)</label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="100"
                                        value={mesocycle.volume}
                                        onChange={(e) => handleMesocycleUpdate(mesocycle.id, { volume: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="text-xs text-gray-400 text-center mt-1">{mesocycle.volume}%</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Intensity (%)</label>
                                    <input
                                        type="range"
                                        min="40"
                                        max="100"
                                        value={mesocycle.intensity}
                                        onChange={(e) => handleMesocycleUpdate(mesocycle.id, { intensity: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="text-xs text-gray-400 text-center mt-1">{mesocycle.intensity}%</div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-300 mb-1">Block Focus</label>
                                <input
                                    type="text"
                                    value={mesocycle.focus}
                                    onChange={(e) => handleMesocycleUpdate(mesocycle.id, { focus: e.target.value })}
                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Primary training focus for this block"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMicrocycleDesign = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Microcycle Design (Weekly Patterns)
                </h3>

                {/* Microcycle Patterns */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Weekly Training Patterns</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(microcyclePatterns).map(([key, pattern]) => (
                            <div key={key} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-white">{pattern.name}</h5>
                                    <button
                                        onClick={() => setPeriodization(prev => ({
                                            ...prev,
                                            microcycles: { ...prev.microcycles, defaultStructure: key }
                                        }))}
                                        className={`px-2 py-1 rounded text-xs ${periodization.microcycles.defaultStructure === key
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                            }`}
                                    >
                                        {periodization.microcycles.defaultStructure === key ? 'Active' : 'Select'}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-300 mb-3">{pattern.description}</p>

                                {/* Visual pattern */}
                                <div className="flex gap-1 mb-2">
                                    {pattern.pattern.map((intensity, dayIndex) => (
                                        <div key={dayIndex} className="flex-1 text-center">
                                            <div
                                                className={`h-8 rounded ${intensity === 0 ? 'bg-gray-600' :
                                                    intensity <= 50 ? 'bg-green-600' :
                                                        intensity <= 75 ? 'bg-yellow-600' :
                                                            'bg-red-600'
                                                    }`}
                                                style={{ height: `${Math.max(intensity * 0.4, 8)}px` }}
                                            />
                                            <div className="text-xs text-gray-400 mt-1">
                                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][dayIndex]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deload Configuration */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Deload Protocol
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deload Frequency
                            </label>
                            <select
                                value={periodization.deloads.frequency}
                                onChange={(e) => setPeriodization(prev => ({
                                    ...prev,
                                    deloads: { ...prev.deloads, frequency: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={3}>Every 3 weeks</option>
                                <option value={4}>Every 4 weeks</option>
                                <option value={5}>Every 5 weeks</option>
                                <option value={6}>Every 6 weeks</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deload Type
                            </label>
                            <select
                                value={periodization.deloads.type}
                                onChange={(e) => setPeriodization(prev => ({
                                    ...prev,
                                    deloads: { ...prev.deloads, type: e.target.value }
                                }))}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="volume">Volume Deload (50% volume)</option>
                                <option value="intensity">Intensity Deload (70% intensity)</option>
                                <option value="complete">Complete Deload (Active recovery)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Deload Duration
                            </label>
                            <select
                                value={periodization.deloads.duration}
                                onChange={(e) => setPeriodization(prev => ({
                                    ...prev,
                                    deloads: { ...prev.deloads, duration: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>1 week</option>
                                <option value={2}>2 weeks</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCompetitionPlanning = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-400" />
                    Competition & Peaking Schedule
                </h3>

                {/* Add Competition */}
                <div className="mb-6 bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Add Competition/Peak Date</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                        <input
                            type="date"
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="compDate"
                        />
                        <input
                            type="text"
                            placeholder="Competition name"
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="compName"
                        />
                        <select
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="compPriority"
                        >
                            <option value="A">A Priority (Major)</option>
                            <option value="B">B Priority (Regional)</option>
                            <option value="C">C Priority (Local/Training)</option>
                        </select>
                        <button
                            onClick={() => {
                                const date = document.getElementById('compDate').value;
                                const name = document.getElementById('compName').value;
                                const priority = document.getElementById('compPriority').value;
                                if (date && name) {
                                    addCompetition(new Date(date), name, priority);
                                    document.getElementById('compDate').value = '';
                                    document.getElementById('compName').value = '';
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Competition List */}
                {periodization.competitions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-medium text-white">Scheduled Competitions</h4>
                        {periodization.competitions.map((comp) => {
                            const weeksUntil = Math.ceil((new Date(comp.date) - periodization.macrocycle.startDate) / (1000 * 60 * 60 * 24 * 7));

                            return (
                                <div key={comp.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <h5 className="font-medium text-white">{comp.name}</h5>
                                        <div className="text-sm text-gray-300">
                                            {comp.date.toLocaleDateString()} • Week {weeksUntil} • Priority {comp.priority}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${comp.priority === 'A' ? 'bg-red-900 text-red-300' :
                                            comp.priority === 'B' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-green-900 text-green-300'
                                            }`}>
                                            {comp.priority} Priority
                                        </span>
                                        <button
                                            onClick={() => setPeriodization(prev => ({
                                                ...prev,
                                                competitions: prev.competitions.filter(c => c.id !== comp.id)
                                            }))}
                                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Peaking Strategy */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-3">Peaking Strategy Guidelines</h4>
                    <div className="space-y-2 text-sm text-blue-200">
                        <div><strong>8-12 weeks out:</strong> Begin competition-specific training</div>
                        <div><strong>4-6 weeks out:</strong> Increase training specificity, reduce volume</div>
                        <div><strong>2-3 weeks out:</strong> Significant volume reduction, maintain intensity</div>
                        <div><strong>1 week out:</strong> Minimal volume, openers/competition simulation</div>
                        <div><strong>Competition week:</strong> Light movement, mental preparation</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Periodization Planning</h2>
                    <p className="text-gray-400">Design comprehensive training periodization from annual planning to weekly patterns</p>
                </div>
            </div>

            {/* Enhanced Multi-Goal Planning - Unified System */}
            <EnhancedMacrocyclePlanner
                onMacrocycleChange={(data) => {
                    setPeriodization(prev => ({
                        ...prev,
                        ...data
                    }));
                }}
                initialData={periodization}
            />

            {/* Navigation */}
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === tab.id
                                    ? 'bg-blue-600 text-white'
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
                        Complete periodization structure configured
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Implementation
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeriodizationPlanning;
