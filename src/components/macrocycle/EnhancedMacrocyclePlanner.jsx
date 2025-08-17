import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
    Calendar,
    Target,
    TrendingUp,
    Plus,
    Settings,
    Eye,
    ChevronLeft,
    ChevronRight,
    Drag,
    Clock,
    BarChart3,
    Zap,
    Trophy,
    Activity,
    CheckCircle,
    RotateCcw
} from 'lucide-react';
import { SortableMesocycleCard } from './SortableMesocycleCard';
import { MacrocycleCalendar } from './MacrocycleCalendar';
import { GoalSelector } from './GoalSelector';

/**
 * EnhancedMacrocyclePlanner - Advanced macrocycle planning with multiple goals and calendar view
 * 
 * Features:
 * - Multiple program goals over extended timeline
 * - Drag-and-drop mesocycle planning
 * - Calendar visualization
 * - Goal-specific mesocycle configuration
 * - Timeline management
 */

const EnhancedMacrocyclePlanner = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [macrocycle, setMacrocycle] = useState({
        name: 'Annual Training Plan 2025',
        duration: 52, // weeks
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        goals: [],
        mesocycles: [],
        competitions: []
    });

    const [activeView, setActiveView] = useState('timeline'); // timeline, calendar, goals
    const [selectedMesocycle, setSelectedMesocycle] = useState(null);
    const [showGoalSelector, setShowGoalSelector] = useState(false);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    // Program goals with characteristics
    const programGoals = {
        strength: {
            name: 'Strength Development',
            color: 'red',
            icon: '💪',
            description: 'Maximize force production and 1RM capabilities',
            typicalDuration: '12-16 weeks',
            mesocycleTypes: ['accumulation', 'intensification', 'realization'],
            volumeProfile: 'moderate',
            intensityProfile: 'high'
        },
        hypertrophy: {
            name: 'Muscle Hypertrophy',
            color: 'blue',
            icon: '🔥',
            description: 'Increase muscle mass and size',
            typicalDuration: '8-12 weeks',
            mesocycleTypes: ['accumulation', 'intensification'],
            volumeProfile: 'high',
            intensityProfile: 'moderate'
        },
        power: {
            name: 'Power Development',
            color: 'yellow',
            icon: '⚡',
            description: 'Explosive force and rate of force development',
            typicalDuration: '6-8 weeks',
            mesocycleTypes: ['intensification', 'realization'],
            volumeProfile: 'moderate',
            intensityProfile: 'high'
        },
        endurance: {
            name: 'Muscular Endurance',
            color: 'green',
            icon: '🏃',
            description: 'Improve work capacity and endurance',
            typicalDuration: '8-12 weeks',
            mesocycleTypes: ['accumulation'],
            volumeProfile: 'high',
            intensityProfile: 'low'
        },
        conditioning: {
            name: 'General Conditioning',
            color: 'purple',
            icon: '🔄',
            description: 'Overall fitness and conditioning',
            typicalDuration: '6-10 weeks',
            mesocycleTypes: ['accumulation', 'intensification'],
            volumeProfile: 'moderate',
            intensityProfile: 'moderate'
        },
        sport_specific: {
            name: 'Sport-Specific',
            color: 'orange',
            icon: '🎯',
            description: 'Sport-specific performance enhancement',
            typicalDuration: '8-16 weeks',
            mesocycleTypes: ['accumulation', 'intensification', 'realization'],
            volumeProfile: 'varies',
            intensityProfile: 'varies'
        },
        maintenance: {
            name: 'Maintenance',
            color: 'gray',
            icon: '🔧',
            description: 'Maintain current fitness levels',
            typicalDuration: '4-8 weeks',
            mesocycleTypes: ['restoration'],
            volumeProfile: 'low',
            intensityProfile: 'low'
        }
    };

    // Mesocycle types with enhanced characteristics
    const mesocycleTypes = {
        accumulation: {
            name: 'Accumulation',
            description: 'High volume, moderate intensity, base building',
            color: 'blue',
            icon: '📈',
            characteristics: ['High volume', 'Moderate intensity', 'Work capacity', 'Base building'],
            typicalDuration: '3-4 weeks',
            volumeRange: [80, 100],
            intensityRange: [65, 80]
        },
        intensification: {
            name: 'Intensification',
            description: 'Moderate volume, high intensity, strength/power focus',
            color: 'orange',
            icon: '🔥',
            characteristics: ['Moderate volume', 'High intensity', 'Neural adaptation', 'Skill refinement'],
            typicalDuration: '2-3 weeks',
            volumeRange: [60, 80],
            intensityRange: [80, 95]
        },
        realization: {
            name: 'Realization',
            description: 'Low volume, very high intensity, competition prep',
            color: 'red',
            icon: '🏆',
            characteristics: ['Low volume', 'Very high intensity', 'Peak performance', 'Competition specific'],
            typicalDuration: '1-2 weeks',
            volumeRange: [30, 60],
            intensityRange: [90, 100]
        },
        restoration: {
            name: 'Restoration',
            description: 'Very low volume, low intensity, recovery focus',
            color: 'green',
            icon: '🌿',
            characteristics: ['Very low volume', 'Low intensity', 'Active recovery', 'Regeneration'],
            typicalDuration: '1 week',
            volumeRange: [20, 50],
            intensityRange: [50, 70]
        }
    };

    // Initialize with sample data
    useEffect(() => {
        initializeSampleMacrocycle();
    }, []);

    const initializeSampleMacrocycle = () => {
        const startDate = new Date();
        const sampleGoals = [
            {
                id: 'goal-1',
                type: 'hypertrophy',
                name: 'Muscle Building Phase',
                startWeek: 1,
                duration: 12,
                priority: 'high',
                specificTargets: ['Upper body mass', 'Lower body strength']
            },
            {
                id: 'goal-2',
                type: 'strength',
                name: 'Strength Development',
                startWeek: 13,
                duration: 10,
                priority: 'high',
                specificTargets: ['Squat 1RM', 'Bench Press 1RM', 'Deadlift 1RM']
            },
            {
                id: 'goal-3',
                type: 'power',
                name: 'Power & Athletic Performance',
                startWeek: 23,
                duration: 6,
                priority: 'medium',
                specificTargets: ['Vertical jump', 'Sprint speed', 'Agility']
            },
            {
                id: 'goal-4',
                type: 'maintenance',
                name: 'Active Recovery',
                startWeek: 29,
                duration: 4,
                priority: 'low',
                specificTargets: ['Recovery', 'Movement quality', 'Mental break']
            }
        ];

        const sampleMesocycles = generateMesocyclesFromGoals(sampleGoals, startDate);

        setMacrocycle(prev => ({
            ...prev,
            startDate,
            goals: sampleGoals,
            mesocycles: sampleMesocycles,
            competitions: [
                {
                    id: 'comp-1',
                    name: 'Local Powerlifting Meet',
                    date: new Date(startDate.getTime() + 140 * 24 * 60 * 60 * 1000), // ~20 weeks
                    type: 'powerlifting',
                    priority: 'high'
                },
                {
                    id: 'comp-2',
                    name: 'Athletic Performance Test',
                    date: new Date(startDate.getTime() + 175 * 24 * 60 * 60 * 1000), // ~25 weeks
                    type: 'athletic',
                    priority: 'medium'
                }
            ]
        }));
    };

    const generateMesocyclesFromGoals = (goals, startDate) => {
        const mesocycles = [];
        let mesoId = 1;

        goals.forEach(goal => {
            const goalConfig = programGoals[goal.type];
            const mesocycleCount = Math.ceil(goal.duration / 3); // Typical 3-4 week mesocycles

            for (let i = 0; i < mesocycleCount; i++) {
                const startWeek = goal.startWeek + (i * 3);
                const duration = Math.min(4, goal.startWeek + goal.duration - startWeek);

                if (duration > 0) {
                    const mesoType = selectMesocycleType(goalConfig.mesocycleTypes, i, mesocycleCount);

                    mesocycles.push({
                        id: `meso-${mesoId++}`,
                        name: `${goal.name} - Block ${i + 1}`,
                        goalId: goal.id,
                        goalType: goal.type,
                        type: mesoType,
                        startWeek,
                        duration,
                        startDate: new Date(startDate.getTime() + (startWeek - 1) * 7 * 24 * 60 * 60 * 1000),
                        endDate: new Date(startDate.getTime() + (startWeek + duration - 2) * 7 * 24 * 60 * 60 * 1000),
                        volume: calculateVolumeTarget(goalConfig, mesoType),
                        intensity: calculateIntensityTarget(goalConfig, mesoType),
                        focus: goalConfig.description,
                        exercises: [],
                        progressionModel: 'linear'
                    });
                }
            }
        });

        return mesocycles.sort((a, b) => a.startWeek - b.startWeek);
    };

    const selectMesocycleType = (availableTypes, blockIndex, totalBlocks) => {
        if (totalBlocks === 1) return availableTypes[0] || 'accumulation';

        if (availableTypes.includes('accumulation') && blockIndex < totalBlocks - 1) {
            return 'accumulation';
        }
        if (availableTypes.includes('intensification') && blockIndex === totalBlocks - 1) {
            return 'intensification';
        }
        if (availableTypes.includes('realization') && blockIndex === totalBlocks - 1) {
            return 'realization';
        }

        return availableTypes[blockIndex % availableTypes.length] || 'accumulation';
    };

    const calculateVolumeTarget = (goalConfig, mesoType) => {
        const mesoConfig = mesocycleTypes[mesoType];
        const baseVolume = (mesoConfig.volumeRange[0] + mesoConfig.volumeRange[1]) / 2;

        // Adjust based on goal type
        const goalMultiplier = {
            hypertrophy: 1.2,
            strength: 0.9,
            power: 0.8,
            endurance: 1.3,
            conditioning: 1.0,
            sport_specific: 1.0,
            maintenance: 0.6
        }[goalConfig] || 1.0;

        return Math.round(baseVolume * goalMultiplier);
    };

    const calculateIntensityTarget = (goalConfig, mesoType) => {
        const mesoConfig = mesocycleTypes[mesoType];
        const baseIntensity = (mesoConfig.intensityRange[0] + mesoConfig.intensityRange[1]) / 2;

        // Adjust based on goal type
        const goalMultiplier = {
            hypertrophy: 0.9,
            strength: 1.1,
            power: 1.0,
            endurance: 0.8,
            conditioning: 0.9,
            sport_specific: 1.0,
            maintenance: 0.7
        }[goalConfig] || 1.0;

        return Math.round(baseIntensity * goalMultiplier);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setMacrocycle(prev => ({
            ...prev,
            mesocycles: reorderMesocycles(prev.mesocycles, active.id, over.id)
        }));
    };

    const reorderMesocycles = (mesocycles, activeId, overId) => {
        const oldIndex = mesocycles.findIndex(m => m.id === activeId);
        const newIndex = mesocycles.findIndex(m => m.id === overId);

        if (oldIndex === -1 || newIndex === -1) return mesocycles;

        const newMesocycles = [...mesocycles];
        const [movedItem] = newMesocycles.splice(oldIndex, 1);
        newMesocycles.splice(newIndex, 0, movedItem);

        // Recalculate start weeks based on new order
        let currentWeek = 1;
        return newMesocycles.map(meso => ({
            ...meso,
            startWeek: currentWeek,
            startDate: new Date(macrocycle.startDate.getTime() + (currentWeek - 1) * 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(macrocycle.startDate.getTime() + (currentWeek + meso.duration - 2) * 7 * 24 * 60 * 60 * 1000)
        }));
    };

    const addNewGoal = (goalData) => {
        const newGoal = {
            id: `goal-${Date.now()}`,
            ...goalData,
            startWeek: macrocycle.goals.length > 0
                ? Math.max(...macrocycle.goals.map(g => g.startWeek + g.duration)) + 1
                : 1
        };

        const newMesocycles = generateMesocyclesFromGoals([newGoal], macrocycle.startDate);

        setMacrocycle(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal],
            mesocycles: [...prev.mesocycles, ...newMesocycles].sort((a, b) => a.startWeek - b.startWeek)
        }));
    };

    const addNewMesocycle = (mesoData) => {
        const newMesocycle = {
            id: `meso-${Date.now()}`,
            name: mesoData.name || 'New Mesocycle',
            goalId: null,
            goalType: mesoData.goalType || 'hypertrophy',
            type: mesoData.type || 'accumulation',
            startWeek: macrocycle.mesocycles.length > 0
                ? Math.max(...macrocycle.mesocycles.map(m => m.startWeek + m.duration)) + 1
                : 1,
            duration: mesoData.duration || 3,
            volume: mesoData.volume || 75,
            intensity: mesoData.intensity || 75,
            focus: mesoData.focus || '',
            exercises: [],
            progressionModel: 'linear'
        };

        // Calculate dates
        const startDate = new Date(macrocycle.startDate.getTime() + (newMesocycle.startWeek - 1) * 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + (newMesocycle.duration - 1) * 7 * 24 * 60 * 60 * 1000);

        newMesocycle.startDate = startDate;
        newMesocycle.endDate = endDate;

        setMacrocycle(prev => ({
            ...prev,
            mesocycles: [...prev.mesocycles, newMesocycle].sort((a, b) => a.startWeek - b.startWeek)
        }));
    };

    const removeMesocycle = (mesoId) => {
        setMacrocycle(prev => ({
            ...prev,
            mesocycles: prev.mesocycles.filter(m => m.id !== mesoId)
        }));
    };

    const updateMesocycle = (mesoId, updates) => {
        setMacrocycle(prev => ({
            ...prev,
            mesocycles: prev.mesocycles.map(m =>
                m.id === mesoId ? { ...m, ...updates } : m
            )
        }));
    };

    const getTotalDuration = () => {
        return macrocycle.mesocycles.reduce((total, meso) =>
            Math.max(total, meso.startWeek + meso.duration - 1), 0
        );
    };

    const getGoalProgress = () => {
        return macrocycle.goals.map(goal => ({
            ...goal,
            mesocycles: macrocycle.mesocycles.filter(m => m.goalId === goal.id),
            completed: 0, // This would be calculated based on actual progress
            remaining: goal.duration
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header with view switcher */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-blue-400" />
                        <div>
                            <h2 className="text-xl font-semibold text-white">{macrocycle.name}</h2>
                            <p className="text-sm text-gray-300">
                                {macrocycle.goals.length} goals • {macrocycle.mesocycles.length} mesocycles • {getTotalDuration()} weeks total
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveView('timeline')}
                            className={`px-4 py-2 rounded-md transition-colors ${activeView === 'timeline'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            <TrendingUp className="h-4 w-4 mr-2 inline" />
                            Timeline
                        </button>
                        <button
                            onClick={() => setActiveView('calendar')}
                            className={`px-4 py-2 rounded-md transition-colors ${activeView === 'calendar'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            <Calendar className="h-4 w-4 mr-2 inline" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setActiveView('goals')}
                            className={`px-4 py-2 rounded-md transition-colors ${activeView === 'goals'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            <Target className="h-4 w-4 mr-2 inline" />
                            Goals
                        </button>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-600 p-3 rounded-md">
                        <div className="text-2xl font-bold text-white">{getTotalDuration()}</div>
                        <div className="text-sm text-gray-300">Total Weeks</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-md">
                        <div className="text-2xl font-bold text-blue-400">{macrocycle.goals.length}</div>
                        <div className="text-sm text-gray-300">Active Goals</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-md">
                        <div className="text-2xl font-bold text-green-400">{macrocycle.mesocycles.length}</div>
                        <div className="text-sm text-gray-300">Mesocycles</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-md">
                        <div className="text-2xl font-bold text-yellow-400">{macrocycle.competitions.length}</div>
                        <div className="text-sm text-gray-300">Competitions</div>
                    </div>
                </div>
            </div>

            {/* View-specific content */}
            {activeView === 'timeline' && (
                <TimelineView
                    macrocycle={macrocycle}
                    mesocycleTypes={mesocycleTypes}
                    programGoals={programGoals}
                    onDragEnd={handleDragEnd}
                    onAddMesocycle={addNewMesocycle}
                    onUpdateMesocycle={updateMesocycle}
                    onRemoveMesocycle={removeMesocycle}
                    sensors={sensors}
                />
            )}

            {activeView === 'calendar' && (
                <MacrocycleCalendar
                    macrocycle={macrocycle}
                    mesocycleTypes={mesocycleTypes}
                    programGoals={programGoals}
                    onUpdateMesocycle={updateMesocycle}
                />
            )}

            {activeView === 'goals' && (
                <GoalsView
                    macrocycle={macrocycle}
                    programGoals={programGoals}
                    goalProgress={getGoalProgress()}
                    onAddGoal={addNewGoal}
                    onShowGoalSelector={() => setShowGoalSelector(true)}
                />
            )}

            {/* Goal Selector Modal */}
            {showGoalSelector && (
                <GoalSelector
                    programGoals={programGoals}
                    onAddGoal={addNewGoal}
                    onClose={() => setShowGoalSelector(false)}
                />
            )}

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
                        Enhanced Macrocycle Planning
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

// Timeline View Component
const TimelineView = ({ macrocycle, mesocycleTypes, programGoals, onDragEnd, onAddMesocycle, onUpdateMesocycle, onRemoveMesocycle, sensors }) => {
    return (
        <div className="space-y-6">
            {/* Add new mesocycle button */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Mesocycle Timeline</h3>
                    <button
                        onClick={() => onAddMesocycle({})}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Mesocycle
                    </button>
                </div>

                {/* Draggable mesocycle list */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={macrocycle.mesocycles.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {macrocycle.mesocycles.map((mesocycle, index) => (
                                <SortableMesocycleCard
                                    key={mesocycle.id}
                                    mesocycle={mesocycle}
                                    mesocycleTypes={mesocycleTypes}
                                    programGoals={programGoals}
                                    index={index}
                                    onUpdate={onUpdateMesocycle}
                                    onRemove={onRemoveMesocycle}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {macrocycle.mesocycles.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No mesocycles added yet</p>
                        <p className="text-sm">Add mesocycles to structure your training plan</p>
                    </div>
                )}
            </div>

            {/* Mesocycle type reference */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Mesocycle Types Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(mesocycleTypes).map(([key, type]) => (
                        <div key={key} className="bg-gray-600 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-3 h-3 rounded-full bg-${type.color}-500`}></span>
                                <span className="text-lg">{type.icon}</span>
                                <h4 className="font-semibold text-white">{type.name}</h4>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{type.description}</p>
                            <div className="space-y-1 text-xs text-gray-400">
                                <p><strong>Duration:</strong> {type.typicalDuration}</p>
                                <p><strong>Volume:</strong> {type.volumeRange[0]}-{type.volumeRange[1]}%</p>
                                <p><strong>Intensity:</strong> {type.intensityRange[0]}-{type.intensityRange[1]}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Goals View Component
const GoalsView = ({ macrocycle, programGoals, goalProgress, onAddGoal, onShowGoalSelector }) => {
    return (
        <div className="space-y-6">
            {/* Add new goal button */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Training Goals</h3>
                    <button
                        onClick={onShowGoalSelector}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Goal
                    </button>
                </div>

                {/* Goals list */}
                <div className="space-y-4">
                    {goalProgress.map(goal => {
                        const goalConfig = programGoals[goal.type];
                        return (
                            <div key={goal.id} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-4 h-4 rounded-full bg-${goalConfig.color}-500`}></span>
                                        <span className="text-2xl">{goalConfig.icon}</span>
                                        <div>
                                            <h4 className="font-semibold text-white">{goal.name}</h4>
                                            <p className="text-sm text-gray-300">{goalConfig.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-white">Week {goal.startWeek}-{goal.startWeek + goal.duration - 1}</div>
                                        <div className="text-xs text-gray-400">{goal.duration} weeks</div>
                                    </div>
                                </div>

                                {/* Goal progress */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-300">Progress</span>
                                        <span className="text-gray-300">{goal.completed}/{goal.duration} weeks</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`bg-${goalConfig.color}-500 h-2 rounded-full transition-all`}
                                            style={{ width: `${(goal.completed / goal.duration) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Specific targets */}
                                {goal.specificTargets && (
                                    <div className="mb-3">
                                        <h5 className="text-sm font-medium text-gray-300 mb-2">Specific Targets:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {goal.specificTargets.map((target, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">
                                                    {target}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Associated mesocycles */}
                                <div>
                                    <h5 className="text-sm font-medium text-gray-300 mb-2">
                                        Mesocycles ({goal.mesocycles.length}):
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {goal.mesocycles.map(meso => (
                                            <div key={meso.id} className="text-xs bg-gray-700 p-2 rounded">
                                                <div className="font-medium text-white">{meso.name}</div>
                                                <div className="text-gray-400">Week {meso.startWeek} • {meso.duration}w • {meso.type}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {macrocycle.goals.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No goals set yet</p>
                        <p className="text-sm">Add training goals to structure your macrocycle</p>
                    </div>
                )}
            </div>

            {/* Goal types reference */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Available Goal Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(programGoals).map(([key, goal]) => (
                        <div key={key} className="bg-gray-600 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-3 h-3 rounded-full bg-${goal.color}-500`}></span>
                                <span className="text-lg">{goal.icon}</span>
                                <h4 className="font-semibold text-white">{goal.name}</h4>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">{goal.description}</p>
                            <div className="space-y-1 text-xs text-gray-400">
                                <p><strong>Duration:</strong> {goal.typicalDuration}</p>
                                <p><strong>Volume:</strong> {goal.volumeProfile}</p>
                                <p><strong>Intensity:</strong> {goal.intensityProfile}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnhancedMacrocyclePlanner;
