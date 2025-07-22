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
    RotateCcw,
    Layers
} from 'lucide-react';
import { SortableMesocycleCard } from './SortableMesocycleCard';
import { MacrocycleCalendar } from './MacrocycleCalendar';
import { GoalSelector } from './GoalSelector';

/**
 * UnifiedMacrocyclePlanner - Complete periodization system merging all features
 * 
 * Features:
 * - Multi-goal macrocycle planning
 * - Traditional periodization models integrated
 * - Drag-and-drop mesocycle management
 * - Calendar visualization
 * - Microcycle patterns and deload protocols
 * - Competition planning and peaking
 * - All-in-one interface eliminating dual systems
 */

const UnifiedMacrocyclePlanner = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [macrocycle, setMacrocycle] = useState({
        name: 'Training Macrocycle 2025',
        duration: 52,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        goals: [],
        mesocycles: [],
        competitions: [],
        periodizationModel: 'block_periodization'
    });

    const [activeView, setActiveView] = useState('planning'); // planning, calendar, analysis
    const [selectedMesocycle, setSelectedMesocycle] = useState(null);
    const [showGoalSelector, setShowGoalSelector] = useState(false);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    // Comprehensive periodization models (merged from both systems)
    const periodizationModels = {
        linear: {
            id: 'linear',
            name: 'Linear Periodization',
            description: 'Traditional progression from high volume/low intensity to low volume/high intensity',
            duration: '12-20 weeks',
            bestFor: 'Beginners, single peak competitions, strength focus',
            phases: ['General Preparation', 'Specific Preparation', 'Competition', 'Transition'],
            advantages: ['Simple to plan', 'Clear progression', 'Good for beginners'],
            disadvantages: ['Limited variety', 'Detraining risk', 'Single peak focus'],
            icon: '📈',
            color: 'blue'
        },
        block_periodization: {
            id: 'block_periodization',
            name: 'Block Periodization',
            description: 'Sequential focused blocks with concentrated loads for specific adaptations',
            duration: '8-16 weeks per block',
            bestFor: 'Intermediate to advanced, multiple competitions, sport-specific training',
            phases: ['Accumulation', 'Transmutation', 'Realization'],
            advantages: ['Multiple peaks', 'Concentrated adaptations', 'Reduced interference'],
            disadvantages: ['Complex planning', 'Requires experience', 'Risk of overspecialization'],
            icon: '🎯',
            color: 'purple'
        },
        conjugate: {
            id: 'conjugate',
            name: 'Conjugate Method',
            description: 'High frequency varied approach with concurrent development of multiple qualities',
            duration: 'Ongoing weekly cycles',
            bestFor: 'Advanced athletes, powerlifters, year-round training',
            phases: ['Max Effort', 'Dynamic Effort', 'Repetition Method'],
            advantages: ['Concurrent development', 'High variety', 'Reduced staleness'],
            disadvantages: ['Very complex', 'Extensive exercise library needed', 'Not for beginners'],
            icon: '🔄',
            color: 'orange'
        },
        undulating: {
            id: 'undulating',
            name: 'Daily Undulating Periodization',
            description: 'Frequent variation of training variables within weekly microcycles',
            duration: 'Ongoing weekly patterns',
            bestFor: 'Variety seekers, hypertrophy focus, recreational athletes',
            phases: ['High Volume', 'Moderate Intensity', 'High Intensity', 'Recovery'],
            advantages: ['High variety', 'Reduced boredom', 'Flexible scheduling'],
            disadvantages: ['Less specific adaptations', 'Complex tracking', 'Potential overreaching'],
            icon: '🌊',
            color: 'green'
        },
        reverse_linear: {
            id: 'reverse_linear',
            name: 'Reverse Linear Periodization',
            description: 'Start high intensity/low volume, progressively build volume for hypertrophy/endurance',
            duration: '12-16 weeks',
            bestFor: 'Advanced athletes, hypertrophy focus, endurance building after strength phase',
            phases: ['Power', 'Hypertrophy', 'Volume'],
            advantages: ['Volume tolerance building', 'Strength maintenance', 'Neural recovery'],
            disadvantages: ['Requires high initial fitness', 'Complex volume management', 'Risk of overuse'],
            icon: '📉',
            color: 'cyan'
        }
    };

    // Program goals with enhanced characteristics (merged from both systems)
    const programGoals = {
        strength: {
            name: 'Strength Development',
            color: 'red',
            icon: '💪',
            description: 'Maximize force production and 1RM capabilities',
            typicalDuration: '12-16 weeks',
            mesocycleTypes: ['accumulation', 'intensification', 'realization'],
            volumeProfile: 'moderate',
            intensityProfile: 'high',
            recommendedModels: ['linear', 'block_periodization']
        },
        hypertrophy: {
            name: 'Muscle Hypertrophy',
            color: 'blue',
            icon: '🔥',
            description: 'Increase muscle mass and size',
            typicalDuration: '8-12 weeks',
            mesocycleTypes: ['accumulation', 'intensification'],
            volumeProfile: 'high',
            intensityProfile: 'moderate',
            recommendedModels: ['undulating', 'block_periodization']
        },
        power: {
            name: 'Power Development',
            color: 'yellow',
            icon: '⚡',
            description: 'Explosive force and rate of force development',
            typicalDuration: '6-8 weeks',
            mesocycleTypes: ['intensification', 'realization'],
            volumeProfile: 'moderate',
            intensityProfile: 'high',
            recommendedModels: ['block_periodization', 'conjugate']
        },
        endurance: {
            name: 'Muscular Endurance',
            color: 'green',
            icon: '🏃',
            description: 'Improve work capacity and endurance',
            typicalDuration: '8-12 weeks',
            mesocycleTypes: ['accumulation'],
            volumeProfile: 'high',
            intensityProfile: 'low',
            recommendedModels: ['linear', 'block_periodization']
        },
        conditioning: {
            name: 'General Conditioning',
            color: 'purple',
            icon: '🔄',
            description: 'Overall fitness and conditioning',
            typicalDuration: '6-10 weeks',
            mesocycleTypes: ['accumulation', 'intensification'],
            volumeProfile: 'moderate',
            intensityProfile: 'moderate',
            recommendedModels: ['undulating', 'conjugate']
        },
        sport_specific: {
            name: 'Sport-Specific Performance',
            color: 'orange',
            icon: '🎯',
            description: 'Sport-specific performance enhancement',
            typicalDuration: '8-16 weeks',
            mesocycleTypes: ['accumulation', 'intensification', 'realization'],
            volumeProfile: 'varies',
            intensityProfile: 'varies',
            recommendedModels: ['block_periodization', 'conjugate']
        },
        maintenance: {
            name: 'Maintenance Phase',
            color: 'gray',
            icon: '🔧',
            description: 'Maintain current fitness levels',
            typicalDuration: '4-8 weeks',
            mesocycleTypes: ['restoration'],
            volumeProfile: 'low',
            intensityProfile: 'low',
            recommendedModels: ['linear', 'undulating']
        }
    };

    // Mesocycle types (enhanced from both systems)
    const mesocycleTypes = {
        accumulation: {
            name: 'Accumulation',
            description: 'High volume, moderate intensity, base building phase',
            color: 'blue',
            icon: '📈',
            characteristics: ['High volume (80-100%)', 'Moderate intensity (65-80%)', 'Work capacity focus', 'Base building'],
            typicalDuration: '3-4 weeks',
            volumeRange: [80, 100],
            intensityRange: [65, 80],
            deloadType: 'volume'
        },
        intensification: {
            name: 'Intensification',
            description: 'Moderate volume, high intensity, strength/power development',
            color: 'orange',
            icon: '🔥',
            characteristics: ['Moderate volume (60-80%)', 'High intensity (80-95%)', 'Neural adaptation', 'Skill refinement'],
            typicalDuration: '2-3 weeks',
            volumeRange: [60, 80],
            intensityRange: [80, 95],
            deloadType: 'volume'
        },
        realization: {
            name: 'Realization',
            description: 'Low volume, very high intensity, performance realization',
            color: 'red',
            icon: '🏆',
            characteristics: ['Low volume (30-60%)', 'Very high intensity (90-100%)', 'Peak performance', 'Competition specific'],
            typicalDuration: '1-2 weeks',
            volumeRange: [30, 60],
            intensityRange: [90, 100],
            deloadType: 'complete'
        },
        restoration: {
            name: 'Restoration',
            description: 'Very low volume, low intensity, active recovery',
            color: 'green',
            icon: '🌿',
            characteristics: ['Very low volume (20-50%)', 'Low intensity (50-70%)', 'Active recovery', 'Regeneration focus'],
            typicalDuration: '1 week',
            volumeRange: [20, 50],
            intensityRange: [50, 70],
            deloadType: 'complete'
        }
    };

    // Microcycle patterns (from legacy system)
    const microcyclePatterns = {
        linear: {
            name: 'Linear Progression',
            pattern: [100, 100, 100, 100, 100, 100, 0],
            description: 'Consistent daily load distribution'
        },
        undulating: {
            name: 'Daily Undulating',
            pattern: [100, 70, 100, 70, 100, 70, 0],
            description: 'Alternating high and low intensity days'
        },
        ascending: {
            name: 'Ascending Load',
            pattern: [60, 70, 80, 90, 100, 50, 0],
            description: 'Progressive load increase through week'
        },
        conjugate: {
            name: 'Conjugate Method',
            pattern: [100, 80, 100, 80, 0, 0, 0],
            description: 'Max effort and dynamic effort alternation'
        }
    };

    // Deload protocols (from legacy system)
    const deloadProtocols = {
        volume: {
            name: 'Volume Deload',
            description: 'Reduce training volume by 40-50% while maintaining intensity',
            volumeReduction: 50,
            intensityMaintained: true
        },
        intensity: {
            name: 'Intensity Deload',
            description: 'Reduce training intensity by 20-30% while maintaining volume',
            intensityReduction: 25,
            volumeMaintained: true
        },
        complete: {
            name: 'Complete Deload',
            description: 'Significant reduction in both volume and intensity',
            volumeReduction: 60,
            intensityReduction: 30
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
                specificTargets: ['Upper body mass', 'Lower body strength'],
                periodizationModel: 'undulating'
            },
            {
                id: 'goal-2',
                type: 'strength',
                name: 'Strength Development',
                startWeek: 13,
                duration: 10,
                priority: 'high',
                specificTargets: ['Squat 1RM', 'Bench Press 1RM', 'Deadlift 1RM'],
                periodizationModel: 'block_periodization'
            }
        ];

        const sampleMesocycles = generateMesocyclesFromGoals(sampleGoals, startDate, macrocycle.periodizationModel);

        setMacrocycle(prev => ({
            ...prev,
            startDate,
            goals: sampleGoals,
            mesocycles: sampleMesocycles,
            competitions: [
                {
                    id: 'comp-1',
                    name: 'Local Powerlifting Meet',
                    date: new Date(startDate.getTime() + 140 * 24 * 60 * 60 * 1000),
                    type: 'powerlifting',
                    priority: 'high'
                }
            ]
        }));
    };

    const generateMesocyclesFromGoals = (goals, startDate, periodizationModel = 'linear') => {
        const mesocycles = [];
        let mesoId = 1;

        // Debug logging for reverse linear testing
        console.log(`🔍 Generating mesocycles with ${periodizationModel} model`);

        goals.forEach(goal => {
            const goalConfig = programGoals[goal.type];
            const mesocycleCount = Math.ceil(goal.duration / 3);

            console.log(`📊 Goal: ${goal.name}, Blocks: ${mesocycleCount}, Model: ${periodizationModel}`);

            for (let i = 0; i < mesocycleCount; i++) {
                const startWeek = goal.startWeek + (i * 3);
                const duration = Math.min(4, goal.startWeek + goal.duration - startWeek);

                if (duration > 0) {
                    const mesoType = selectMesocycleType(goalConfig.mesocycleTypes, i, mesocycleCount, periodizationModel);
                    const volume = calculateVolumeTarget(goalConfig, mesoType, periodizationModel, i, mesocycleCount);
                    const intensity = calculateIntensityTarget(goalConfig, mesoType, periodizationModel, i, mesocycleCount);

                    // Debug reverse linear progression
                    if (periodizationModel === 'reverse_linear') {
                        console.log(`🔄 Block ${i + 1}/${mesocycleCount}: ${mesoType} | Vol: ${volume}% | Int: ${intensity}%`);
                    }

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
                        volume: volume,
                        intensity: intensity,
                        focus: goalConfig.description,
                        exercises: [],
                        progressionModel: periodizationModel === 'reverse_linear' ? 'reverse_linear' : 'linear',
                        microcyclePattern: 'linear',
                        deloadProtocol: mesocycleTypes[mesoType].deloadType
                    });
                }
            }
        });

        return mesocycles.sort((a, b) => a.startWeek - b.startWeek);
    };

    const selectMesocycleType = (availableTypes, blockIndex, totalBlocks, periodizationModel = 'linear') => {
        if (totalBlocks === 1) return availableTypes[0] || 'accumulation';

        // Reverse linear periodization: Start with high intensity, end with high volume
        if (periodizationModel === 'reverse_linear') {
            if (blockIndex === 0) return 'realization'; // Start with power/intensity
            if (blockIndex === Math.floor(totalBlocks / 2)) return 'intensification'; // Middle hypertrophy
            if (blockIndex >= totalBlocks - 2) return 'accumulation'; // End with volume
            return 'intensification'; // Default to hypertrophy range
        }

        // Traditional linear and block periodization logic
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

    const calculateVolumeTarget = (goalConfig, mesoType, periodizationModel = 'linear', blockIndex = 0, totalBlocks = 1) => {
        const mesoConfig = mesocycleTypes[mesoType];
        const baseVolume = (mesoConfig.volumeRange[0] + mesoConfig.volumeRange[1]) / 2;

        const goalMultiplier = {
            hypertrophy: 1.2,
            strength: 0.9,
            power: 0.8,
            endurance: 1.3,
            conditioning: 1.0,
            sport_specific: 1.0,
            maintenance: 0.6
        }[goalConfig] || 1.0;

        let progressionMultiplier = 1.0;

        // Reverse linear: Start low volume, progressively increase
        if (periodizationModel === 'reverse_linear' && totalBlocks > 1) {
            const progressionFactor = blockIndex / (totalBlocks - 1); // 0 to 1
            progressionMultiplier = 0.6 + (0.8 * progressionFactor); // 60% to 140% progression
        }

        return Math.round(baseVolume * goalMultiplier * progressionMultiplier);
    };

    const calculateIntensityTarget = (goalConfig, mesoType, periodizationModel = 'linear', blockIndex = 0, totalBlocks = 1) => {
        const mesoConfig = mesocycleTypes[mesoType];
        const baseIntensity = (mesoConfig.intensityRange[0] + mesoConfig.intensityRange[1]) / 2;

        const goalMultiplier = {
            hypertrophy: 0.9,
            strength: 1.1,
            power: 1.0,
            endurance: 0.8,
            conditioning: 0.9,
            sport_specific: 1.0,
            maintenance: 0.7
        }[goalConfig] || 1.0;

        let progressionMultiplier = 1.0;

        // Reverse linear: Start high intensity, gradually decrease
        if (periodizationModel === 'reverse_linear' && totalBlocks > 1) {
            const progressionFactor = blockIndex / (totalBlocks - 1); // 0 to 1
            progressionMultiplier = 1.2 - (0.4 * progressionFactor); // 120% to 80% progression
        }

        return Math.round(baseIntensity * goalMultiplier * progressionMultiplier);
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

        const newMesocycles = generateMesocyclesFromGoals([newGoal], macrocycle.startDate, macrocycle.periodizationModel);

        setMacrocycle(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal],
            mesocycles: [...prev.mesocycles, ...newMesocycles].sort((a, b) => a.startWeek - b.startWeek)
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

    const removeMesocycle = (mesoId) => {
        setMacrocycle(prev => ({
            ...prev,
            mesocycles: prev.mesocycles.filter(m => m.id !== mesoId)
        }));
    };

    const getTotalDuration = () => {
        return macrocycle.mesocycles.reduce((total, meso) =>
            Math.max(total, meso.startWeek + meso.duration - 1), 0
        );
    };

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Unified Header */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Layers className="h-6 w-6 text-blue-400" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Unified Macrocycle Planner</h1>
                                <p className="text-sm text-gray-300">
                                    Complete periodization system with multi-goal planning, calendar view, and advanced features
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveView('planning')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeView === 'planning'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                <TrendingUp className="h-4 w-4 mr-2 inline" />
                                Planning
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
                                onClick={() => setActiveView('analysis')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeView === 'analysis'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4 mr-2 inline" />
                                Analysis
                            </button>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-gray-600 p-3 rounded-md">
                            <div className="text-2xl font-bold text-white">{getTotalDuration()}</div>
                            <div className="text-sm text-gray-300">Total Weeks</div>
                        </div>
                        <div className="bg-gray-600 p-3 rounded-md">
                            <div className="text-2xl font-bold text-blue-400">{macrocycle.goals.length}</div>
                            <div className="text-sm text-gray-300">Training Goals</div>
                        </div>
                        <div className="bg-gray-600 p-3 rounded-md">
                            <div className="text-2xl font-bold text-green-400">{macrocycle.mesocycles.length}</div>
                            <div className="text-sm text-gray-300">Mesocycles</div>
                        </div>
                        <div className="bg-gray-600 p-3 rounded-md">
                            <div className="text-2xl font-bold text-yellow-400">{macrocycle.competitions.length}</div>
                            <div className="text-sm text-gray-300">Competitions</div>
                        </div>
                        <div className="bg-gray-600 p-3 rounded-md">
                            <div className="text-2xl font-bold text-purple-400">
                                {periodizationModels[macrocycle.periodizationModel]?.icon || '🎯'}
                            </div>
                            <div className="text-sm text-gray-300">
                                {periodizationModels[macrocycle.periodizationModel]?.name || 'Model'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Content */}
                {activeView === 'planning' && (
                    <PlanningView
                        macrocycle={macrocycle}
                        setMacrocycle={setMacrocycle}
                        mesocycleTypes={mesocycleTypes}
                        programGoals={programGoals}
                        periodizationModels={periodizationModels}
                        microcyclePatterns={microcyclePatterns}
                        deloadProtocols={deloadProtocols}
                        onDragEnd={handleDragEnd}
                        onAddGoal={addNewGoal}
                        onUpdateMesocycle={updateMesocycle}
                        onRemoveMesocycle={removeMesocycle}
                        onShowGoalSelector={() => setShowGoalSelector(true)}
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

                {activeView === 'analysis' && (
                    <AnalysisView
                        macrocycle={macrocycle}
                        mesocycleTypes={mesocycleTypes}
                        programGoals={programGoals}
                        periodizationModels={periodizationModels}
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
                            Unified Macrocycle Planning System
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
        </div>
    );
};

// Planning View Component
const PlanningView = ({
    macrocycle, setMacrocycle, mesocycleTypes, programGoals, periodizationModels,
    microcyclePatterns, deloadProtocols, onDragEnd, onAddGoal, onUpdateMesocycle,
    onRemoveMesocycle, onShowGoalSelector, sensors
}) => {
    return (
        <div className="space-y-6">
            {/* Periodization Model Selection */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Periodization Strategy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(periodizationModels).map(([key, model]) => (
                        <div
                            key={key}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${macrocycle.periodizationModel === key
                                ? `border-${model.color}-500 bg-${model.color}-900/30`
                                : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setMacrocycle(prev => ({ ...prev, periodizationModel: key }))}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{model.icon}</span>
                                <h3 className="font-semibold text-white">{model.name}</h3>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{model.description}</p>
                            <div className="text-xs text-gray-400 space-y-1">
                                <p><strong>Duration:</strong> {model.duration}</p>
                                <p><strong>Best for:</strong> {model.bestFor}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Goals Management */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-400" />
                        Training Goals ({macrocycle.goals.length})
                    </h2>
                    <button
                        onClick={onShowGoalSelector}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Goal
                    </button>
                </div>

                {macrocycle.goals.length > 0 ? (
                    <div className="space-y-3">
                        {macrocycle.goals.map(goal => {
                            const goalConfig = programGoals[goal.type];
                            return (
                                <div key={goal.id} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-4 h-4 rounded-full bg-${goalConfig.color}-500`}></span>
                                            <span className="text-2xl">{goalConfig.icon}</span>
                                            <div>
                                                <h3 className="font-semibold text-white">{goal.name}</h3>
                                                <p className="text-sm text-gray-300">{goalConfig.description}</p>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Week {goal.startWeek}-{goal.startWeek + goal.duration - 1} • {goal.duration} weeks
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${goal.priority === 'high' ? 'bg-red-900 text-red-300' :
                                            goal.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-green-900 text-green-300'
                                            }`}>
                                            {goal.priority} priority
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No training goals set yet</p>
                        <p className="text-sm">Add goals to structure your macrocycle</p>
                    </div>
                )}
            </div>

            {/* Mesocycle Timeline */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Mesocycle Timeline ({macrocycle.mesocycles.length} blocks)
                </h2>

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
                    <div className="text-center py-8 text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No mesocycles generated yet</p>
                        <p className="text-sm">Add training goals to automatically generate mesocycles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Analysis View Component
const AnalysisView = ({ macrocycle, mesocycleTypes, programGoals, periodizationModels }) => {
    const currentModel = periodizationModels[macrocycle.periodizationModel];

    return (
        <div className="space-y-6">
            {/* Periodization Analysis */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Periodization Analysis
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-white mb-3">Current Model: {currentModel?.name}</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-300">{currentModel?.description}</p>
                            <div className="bg-gray-600 p-3 rounded">
                                <h4 className="font-medium text-blue-400 mb-2">Phases</h4>
                                <div className="space-y-1">
                                    {currentModel?.phases.map((phase, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-300">
                                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                                                {index + 1}
                                            </span>
                                            {phase}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-3">Model Characteristics</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-green-400 mb-2">Advantages</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {currentModel?.advantages.map((advantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">✓</span>
                                            {advantage}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-red-400 mb-2">Considerations</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {currentModel?.disadvantages.map((disadvantage, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-red-400 mt-1">!</span>
                                            {disadvantage}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volume and Intensity Distribution */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Volume & Intensity Distribution
                </h2>

                <div className="space-y-4">
                    {macrocycle.mesocycles.map((meso, index) => {
                        const mesoType = mesocycleTypes[meso.type];
                        return (
                            <div key={meso.id} className="bg-gray-600 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">{meso.name}</span>
                                    <span className={`px-2 py-1 rounded text-xs bg-${mesoType.color}-900 text-${mesoType.color}-300`}>
                                        {mesoType.name}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-300 mb-1">Volume: {meso.volume}%</div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${meso.volume}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-300 mb-1">Intensity: {meso.intensity}%</div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{ width: `${meso.intensity}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UnifiedMacrocyclePlanner;
