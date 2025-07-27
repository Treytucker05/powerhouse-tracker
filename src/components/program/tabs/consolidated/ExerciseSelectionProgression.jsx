/**
 * ExerciseSelectionProgression.jsx - Bryant Exercise Selection & Progression Component
 * Implements research-backed exercise selection with Bryant method integration
 * Handles PHA circuits, cluster sets, strongman events, and tactical progressions
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../../contexts/ProgramContext';
import { useExerciseLibrary } from '../../../../hooks/useExerciseLibrary';
import {
    generatePHACircuits,
    createClusterSetProgression,
    selectStrongmanEvents,
    buildTacticalProgressions
} from '../../../../utils/bryantExerciseUtils';

const ExerciseSelectionProgression = ({ onNext, onPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        exerciseLibrary,
        filterExercises,
        validateExerciseSelection,
        loading
    } = useExerciseLibrary();

    // Exercise selection state
    const [exerciseSelection, setExerciseSelection] = useState({
        // Core Movement Patterns
        movementPatterns: {
            squat: { selected: [], priority: 'high' },
            hinge: { selected: [], priority: 'high' },
            push: { selected: [], priority: 'high' },
            pull: { selected: [], priority: 'high' },
            carry: { selected: [], priority: 'medium' },
            rotate: { selected: [], priority: 'medium' }
        },

        // Bryant-Specific Selections
        bryantExercises: {
            phaCircuits: [],
            clusterSetExercises: [],
            strongmanEvents: [],
            tacticalMovements: []
        },

        // Exercise Categories
        primaryLifts: [],
        accessoryWork: [],
        conditioning: [],

        // Progression Schemes
        progressionSchemes: {
            linear: [],
            doubleProgression: [],
            autoregulated: [],
            percentageBased: []
        },

        // Equipment Considerations
        availableEquipment: [],
        equipmentLimitations: []
    });

    // Progression configurations
    const [progressionConfig, setProgressionConfig] = useState({
        // Primary Lift Progressions
        primaryProgression: {
            type: 'percentage',
            startingPercentage: 75,
            increment: 2.5,
            deloadThreshold: 3
        },

        // Accessory Progressions
        accessoryProgression: {
            type: 'double',
            repRanges: { lower: 8, upper: 12 },
            weightIncrement: 5,
            volumeProgression: 'moderate'
        },

        // Bryant Method Progressions
        bryantProgressions: {
            phaCircuits: {
                weeklyIncrease: 'time',
                progressionRate: 10, // seconds
                intensityProgression: 'volume'
            },
            clusterSets: {
                loadProgression: 'percentage',
                volumeProgression: 'sets',
                restPeriodAdjustment: 'static'
            }
        }
    });

    // Validation state
    const [validation, setValidation] = useState({
        isValid: false,
        warnings: [],
        recommendations: [],
        bryantCompatibility: null,
        balanceScore: 0
    });

    // Load periodization data and configure exercises
    useEffect(() => {
        if (state.periodizationPlan?.bryantIntegration?.enabled) {
            const bryantMethods = state.periodizationPlan.bryantIntegration.methods;
            configureBryantExercises(bryantMethods);
        }

        // Load equipment availability from assessment
        if (state.assessmentData?.bryantReadiness?.equipmentAccess) {
            setExerciseSelection(prev => ({
                ...prev,
                availableEquipment: state.assessmentData.bryantReadiness.equipmentAccess
            }));
        }
    }, [state.periodizationPlan, state.assessmentData]);

    // Configure Bryant-specific exercises based on selected methods
    const configureBryantExercises = (bryantMethods) => {
        bryantMethods.forEach(({ method, config }) => {
            switch (method) {
                case 'phaCircuits':
                    generatePHACircuitOptions();
                    break;
                case 'clusterSets':
                    generateClusterSetOptions();
                    break;
                case 'strongmanEvents':
                    generateStrongmanOptions();
                    break;
                case 'tacticalApplications':
                    generateTacticalOptions();
                    break;
            }
        });
    };

    // Generate PHA Circuit exercise options
    const generatePHACircuitOptions = () => {
        const phaExercises = {
            upper: [
                { name: 'Push-ups', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Pull-ups', equipment: 'bar', difficulty: 'intermediate' },
                { name: 'Dumbbell Press', equipment: 'dumbbells', difficulty: 'beginner' },
                { name: 'Barbell Rows', equipment: 'barbell', difficulty: 'intermediate' },
                { name: 'Dips', equipment: 'bodyweight', difficulty: 'intermediate' }
            ],
            lower: [
                { name: 'Bodyweight Squats', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Lunges', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Goblet Squats', equipment: 'dumbbell', difficulty: 'beginner' },
                { name: 'Romanian Deadlifts', equipment: 'barbell', difficulty: 'intermediate' },
                { name: 'Step-ups', equipment: 'box', difficulty: 'beginner' }
            ],
            core: [
                { name: 'Plank', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Mountain Climbers', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Russian Twists', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Dead Bug', equipment: 'bodyweight', difficulty: 'beginner' },
                { name: 'Bear Crawl', equipment: 'bodyweight', difficulty: 'intermediate' }
            ]
        };

        // Generate 4-6 week PHA circuit progressions
        const circuits = [];
        for (let week = 1; week <= 6; week++) {
            circuits.push({
                week,
                circuit: [
                    phaExercises.upper[week % phaExercises.upper.length],
                    phaExercises.lower[week % phaExercises.lower.length],
                    phaExercises.upper[(week + 1) % phaExercises.upper.length],
                    phaExercises.lower[(week + 1) % phaExercises.lower.length],
                    phaExercises.core[week % phaExercises.core.length]
                ],
                duration: Math.min(15 + (week * 2), 30), // Progressive time increase
                rounds: Math.min(2 + Math.floor(week / 2), 5) // Progressive round increase
            });
        }

        setExerciseSelection(prev => ({
            ...prev,
            bryantExercises: {
                ...prev.bryantExercises,
                phaCircuits: circuits
            }
        }));
    };

    // Generate Cluster Set exercise options
    const generateClusterSetOptions = () => {
        const clusterExercises = [
            {
                name: 'Barbell Back Squat',
                pattern: 'squat',
                clusterScheme: '3×3+3+3',
                restIntra: 15,
                restInter: 180,
                intensityRange: '85-90%',
                volume: 'high'
            },
            {
                name: 'Bench Press',
                pattern: 'push',
                clusterScheme: '4×3+3+2',
                restIntra: 15,
                restInter: 200,
                intensityRange: '80-85%',
                volume: 'moderate'
            },
            {
                name: 'Deadlift',
                pattern: 'hinge',
                clusterScheme: '3×2+2+2',
                restIntra: 20,
                restInter: 240,
                intensityRange: '85-92%',
                volume: 'moderate'
            },
            {
                name: 'Weighted Pull-ups',
                pattern: 'pull',
                clusterScheme: '3×3+3+2',
                restIntra: 15,
                restInter: 180,
                intensityRange: '80-85%',
                volume: 'moderate'
            }
        ];

        setExerciseSelection(prev => ({
            ...prev,
            bryantExercises: {
                ...prev.bryantExercises,
                clusterSetExercises: clusterExercises
            }
        }));
    };

    // Generate Strongman event options
    const generateStrongmanOptions = () => {
        const strongmanEvents = [
            {
                name: 'Farmer\'s Walk',
                category: 'carry',
                equipment: 'farmer handles or dumbbells',
                progression: 'distance',
                startingDistance: 40, // yards
                weeklyIncrease: 10,
                alternativeProgression: 'weight'
            },
            {
                name: 'Tire Flip',
                category: 'power',
                equipment: 'tire',
                progression: 'reps',
                startingReps: 10,
                weeklyIncrease: 2,
                alternativeProgression: 'tire_size'
            },
            {
                name: 'Sled Push/Pull',
                category: 'conditioning',
                equipment: 'sled',
                progression: 'weight',
                startingWeight: '1x bodyweight',
                weeklyIncrease: 10, // lbs
                alternativeProgression: 'distance'
            },
            {
                name: 'Atlas Stone Lift',
                category: 'strength',
                equipment: 'atlas stone or sandbag',
                progression: 'weight',
                startingWeight: '50% bodyweight',
                weeklyIncrease: 5,
                alternativeProgression: 'height'
            },
            {
                name: 'Log Press',
                category: 'press',
                equipment: 'log or barbell',
                progression: 'weight',
                startingWeight: '70% bench press',
                weeklyIncrease: 5,
                alternativeProgression: 'reps'
            }
        ];

        setExerciseSelection(prev => ({
            ...prev,
            bryantExercises: {
                ...prev.bryantExercises,
                strongmanEvents: strongmanEvents
            }
        }));
    };

    // Generate Tactical movement options
    const generateTacticalOptions = () => {
        const tacticalMovements = [
            {
                name: 'Combat Conditioning Circuit',
                category: 'conditioning',
                movements: ['Burpees', 'Mountain Climbers', 'Bear Crawls', 'Army Crawls'],
                duration: 300, // 5 minutes
                progression: 'density'
            },
            {
                name: 'Loaded March',
                category: 'endurance',
                equipment: 'weighted vest or ruck',
                distance: 1, // miles
                weight: 35, // lbs
                progression: 'distance_weight'
            },
            {
                name: 'Obstacle Course Training',
                category: 'agility',
                movements: ['Rope Climb', 'Wall Climb', 'Low Crawl', 'Sprint'],
                progression: 'time'
            },
            {
                name: 'Tactical Breathing Under Load',
                category: 'work_capacity',
                equipment: 'weighted vest',
                weight: 20, // lbs
                exercises: ['Squats', 'Push-ups', 'Planks'],
                progression: 'breathing_efficiency'
            }
        ];

        setExerciseSelection(prev => ({
            ...prev,
            bryantExercises: {
                ...prev.bryantExercises,
                tacticalMovements: tacticalMovements
            }
        }));
    };

    // Handle movement pattern exercise selection
    const handleMovementPatternSelection = (pattern, exercise, action = 'toggle') => {
        setExerciseSelection(prev => {
            const currentSelected = prev.movementPatterns[pattern].selected;
            let newSelected;

            if (action === 'toggle') {
                newSelected = currentSelected.includes(exercise)
                    ? currentSelected.filter(ex => ex !== exercise)
                    : [...currentSelected, exercise];
            } else if (action === 'add') {
                newSelected = currentSelected.includes(exercise)
                    ? currentSelected
                    : [...currentSelected, exercise];
            } else if (action === 'remove') {
                newSelected = currentSelected.filter(ex => ex !== exercise);
            }

            return {
                ...prev,
                movementPatterns: {
                    ...prev.movementPatterns,
                    [pattern]: {
                        ...prev.movementPatterns[pattern],
                        selected: newSelected
                    }
                }
            };
        });
    };

    // Handle progression scheme assignment
    const handleProgressionAssignment = (exercise, scheme) => {
        setExerciseSelection(prev => ({
            ...prev,
            progressionSchemes: {
                ...prev.progressionSchemes,
                [scheme]: [...(prev.progressionSchemes[scheme] || []), exercise]
            }
        }));
    };

    // Validate exercise selection
    useEffect(() => {
        validateSelection();
    }, [exerciseSelection]);

    const validateSelection = () => {
        const warnings = [];
        const recommendations = [];
        let balanceScore = 0;
        let isValid = true;

        // Check movement pattern balance
        const patternCounts = Object.entries(exerciseSelection.movementPatterns)
            .map(([pattern, data]) => ({ pattern, count: data.selected.length, priority: data.priority }));

        patternCounts.forEach(({ pattern, count, priority }) => {
            if (priority === 'high' && count === 0) {
                warnings.push(`No exercises selected for ${pattern} pattern (high priority)`);
                isValid = false;
            } else if (priority === 'high' && count >= 1) {
                balanceScore += 20;
            } else if (count >= 1) {
                balanceScore += 10;
            }
        });

        // Check Bryant method integration
        const bryantMethodsEnabled = state.periodizationPlan?.bryantIntegration?.enabled || false;
        if (bryantMethodsEnabled) {
            const { bryantExercises } = exerciseSelection;

            if (bryantExercises.phaCircuits.length > 0) {
                recommendations.push('PHA circuits configured for cardiovascular adaptation phase');
                balanceScore += 15;
            }

            if (bryantExercises.clusterSetExercises.length > 0) {
                recommendations.push('Cluster sets configured for volume tolerance enhancement');
                balanceScore += 15;
            }

            if (bryantExercises.strongmanEvents.length > 0) {
                recommendations.push('Strongman events integrated for functional strength');
                balanceScore += 10;
            }
        }

        // Check exercise variety
        const totalExercises = Object.values(exerciseSelection.movementPatterns)
            .reduce((sum, pattern) => sum + pattern.selected.length, 0);

        if (totalExercises < 6) {
            warnings.push('Minimum 6 exercises recommended for balanced program');
            isValid = false;
        } else if (totalExercises > 20) {
            warnings.push('Exercise selection may be too extensive - consider reducing');
        }

        // Equipment validation
        if (exerciseSelection.availableEquipment.length === 0) {
            warnings.push('No equipment specified - may limit exercise selection');
        }

        setValidation({
            isValid,
            warnings,
            recommendations,
            bryantCompatibility: bryantMethodsEnabled ? 'integrated' : 'not_applicable',
            balanceScore: Math.min(balanceScore, 100)
        });
    };

    // Save and proceed
    const handleNext = async () => {
        try {
            actions.setLoading(true);

            // Compile final exercise selection
            const finalSelection = {
                ...exerciseSelection,
                progressionConfig,
                validation,
                generatedAt: new Date().toISOString(),
                totalExercises: Object.values(exerciseSelection.movementPatterns)
                    .reduce((sum, pattern) => sum + pattern.selected.length, 0)
            };

            // Save to context
            actions.setExerciseSelection(finalSelection);

            // Generate exercise progressions for each phase
            if (state.periodizationPlan?.phases) {
                const phaseProgressions = state.periodizationPlan.phases.map(phase =>
                    generatePhaseProgression(phase, finalSelection)
                );
                actions.setPhaseProgressions(phaseProgressions);
            }

            onNext();
        } catch (error) {
            console.error('Error saving exercise selection:', error);
            actions.setError('Failed to save exercise selection');
        } finally {
            actions.setLoading(false);
        }
    };

    // Generate progression for specific phase
    const generatePhaseProgression = (phase, exercises) => {
        const phaseExercises = {};

        // Map exercises to phase focus
        switch (phase.focus) {
            case 'movement_quality':
                phaseExercises.primary = exercises.movementPatterns.squat.selected.slice(0, 1)
                    .concat(exercises.movementPatterns.hinge.selected.slice(0, 1))
                    .concat(exercises.movementPatterns.push.selected.slice(0, 1))
                    .concat(exercises.movementPatterns.pull.selected.slice(0, 1));
                break;
            case 'muscle_growth':
                phaseExercises.primary = Object.values(exercises.movementPatterns)
                    .flatMap(pattern => pattern.selected);
                break;
            case 'maximal_strength':
                phaseExercises.primary = exercises.primaryLifts;
                phaseExercises.accessory = exercises.accessoryWork.slice(0, 6);
                break;
            default:
                phaseExercises.primary = Object.values(exercises.movementPatterns)
                    .flatMap(pattern => pattern.selected.slice(0, 2));
        }

        // Add Bryant exercises if applicable
        if (phase.bryantMethods.includes('phaCircuits')) {
            phaseExercises.phaCircuits = exercises.bryantExercises.phaCircuits;
        }
        if (phase.bryantMethods.includes('clusterSets')) {
            phaseExercises.clusterSets = exercises.bryantExercises.clusterSetExercises;
        }

        return {
            phase: phase.name,
            weeks: `${phase.startWeek}-${phase.endWeek}`,
            exercises: phaseExercises,
            progression: generateProgressionScheme(phase.focus, progressionConfig)
        };
    };

    // Generate progression scheme based on phase focus
    const generateProgressionScheme = (focus, config) => {
        switch (focus) {
            case 'movement_quality':
                return {
                    type: 'skill',
                    progression: 'complexity',
                    load: '50-65%',
                    volume: 'moderate'
                };
            case 'muscle_growth':
                return {
                    type: 'volume',
                    progression: 'double',
                    load: '65-80%',
                    volume: 'high'
                };
            case 'maximal_strength':
                return {
                    type: 'intensity',
                    progression: 'percentage',
                    load: '80-95%',
                    volume: 'moderate'
                };
            case 'power_development':
                return {
                    type: 'speed',
                    progression: 'velocity',
                    load: '30-60%',
                    volume: 'low'
                };
            default:
                return config.primaryProgression;
        }
    };

    // Movement patterns for selection
    const movementPatterns = {
        squat: {
            name: 'Squat Pattern',
            exercises: ['Back Squat', 'Front Squat', 'Goblet Squat', 'Bulgarian Split Squat', 'Pistol Squat']
        },
        hinge: {
            name: 'Hip Hinge',
            exercises: ['Deadlift', 'Romanian Deadlift', 'Sumo Deadlift', 'Hip Thrust', 'Good Morning']
        },
        push: {
            name: 'Push Pattern',
            exercises: ['Bench Press', 'Overhead Press', 'Push-ups', 'Dumbbell Press', 'Dips']
        },
        pull: {
            name: 'Pull Pattern',
            exercises: ['Pull-ups', 'Barbell Rows', 'T-Bar Rows', 'Lat Pulldowns', 'Face Pulls']
        },
        carry: {
            name: 'Carry/Locomotion',
            exercises: ['Farmer\'s Walk', 'Suitcase Carry', 'Front Carry', 'Overhead Carry', 'Bear Crawl']
        },
        rotate: {
            name: 'Rotation/Core',
            exercises: ['Russian Twists', 'Pallof Press', 'Wood Chops', 'Turkish Get-up', 'Dead Bug']
        }
    };

    return (
        <div className="exercise-selection-container space-y-8 p-6">
            {/* Header */}
            <div className="text-center border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Exercise Selection & Progression</h2>
                <p className="text-gray-400">
                    Select exercises for each movement pattern and configure Bryant method progressions
                </p>
            </div>

            {/* Movement Pattern Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🏋️</span>
                    Movement Pattern Selection
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(movementPatterns).map(([patternKey, pattern]) => (
                        <div key={patternKey} className="bg-gray-900/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-white font-medium">{pattern.name}</h4>
                                <span className={`px-2 py-1 rounded text-xs ${exerciseSelection.movementPatterns[patternKey].priority === 'high'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {exerciseSelection.movementPatterns[patternKey].priority} priority
                                </span>
                            </div>

                            <div className="space-y-2">
                                {pattern.exercises.map(exercise => (
                                    <label key={exercise} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={exerciseSelection.movementPatterns[patternKey].selected.includes(exercise)}
                                            onChange={() => handleMovementPatternSelection(patternKey, exercise)}
                                            className="mr-3"
                                        />
                                        <span className="text-gray-300">{exercise}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-3 text-sm text-gray-400">
                                Selected: {exerciseSelection.movementPatterns[patternKey].selected.length} exercises
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bryant Method Exercise Configuration */}
            {state.periodizationPlan?.bryantIntegration?.enabled && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Bryant Method Exercise Configuration
                    </h3>

                    {/* PHA Circuits */}
                    {exerciseSelection.bryantExercises.phaCircuits.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-white mb-3">PHA Circuits (6-week progression)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exerciseSelection.bryantExercises.phaCircuits.slice(0, 4).map((circuit, idx) => (
                                    <div key={idx} className="bg-gray-900/30 rounded p-3">
                                        <h5 className="text-white font-medium mb-2">Week {circuit.week}</h5>
                                        <div className="text-sm text-gray-300 space-y-1">
                                            {circuit.circuit.map((exercise, exerciseIdx) => (
                                                <div key={exerciseIdx}>• {exercise.name}</div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            Duration: {circuit.duration}s | Rounds: {circuit.rounds}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cluster Sets */}
                    {exerciseSelection.bryantExercises.clusterSetExercises.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-white mb-3">Cluster Set Exercises</h4>
                            <div className="space-y-3">
                                {exerciseSelection.bryantExercises.clusterSetExercises.map((exercise, idx) => (
                                    <div key={idx} className="bg-gray-900/30 rounded p-3 flex justify-between items-center">
                                        <div>
                                            <h5 className="text-white font-medium">{exercise.name}</h5>
                                            <p className="text-sm text-gray-300">
                                                Scheme: {exercise.clusterScheme} | Rest: {exercise.restIntra}s / {exercise.restInter}s
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">Intensity</div>
                                            <div className="text-white">{exercise.intensityRange}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strongman Events */}
                    {exerciseSelection.bryantExercises.strongmanEvents.length > 0 && (
                        <div>
                            <h4 className="text-lg font-medium text-white mb-3">Strongman Events</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exerciseSelection.bryantExercises.strongmanEvents.map((event, idx) => (
                                    <div key={idx} className="bg-gray-900/30 rounded p-3">
                                        <h5 className="text-white font-medium">{event.name}</h5>
                                        <div className="text-sm text-gray-300 mt-1">
                                            <div>Category: {event.category}</div>
                                            <div>Progression: {event.progression}</div>
                                            <div>Equipment: {event.equipment}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Progression Configuration */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📈</span>
                    Progression Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Lift Progression */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Primary Lifts</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Progression Type</label>
                                <select
                                    value={progressionConfig.primaryProgression.type}
                                    onChange={(e) => setProgressionConfig(prev => ({
                                        ...prev,
                                        primaryProgression: { ...prev.primaryProgression, type: e.target.value }
                                    }))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                >
                                    <option value="percentage">Percentage-based</option>
                                    <option value="linear">Linear Progression</option>
                                    <option value="autoregulated">Autoregulated</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Starting Percentage</label>
                                <input
                                    type="number"
                                    min="60"
                                    max="90"
                                    value={progressionConfig.primaryProgression.startingPercentage}
                                    onChange={(e) => setProgressionConfig(prev => ({
                                        ...prev,
                                        primaryProgression: { ...prev.primaryProgression, startingPercentage: parseInt(e.target.value) }
                                    }))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Accessory Progression */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Accessory Work</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Progression Type</label>
                                <select
                                    value={progressionConfig.accessoryProgression.type}
                                    onChange={(e) => setProgressionConfig(prev => ({
                                        ...prev,
                                        accessoryProgression: { ...prev.accessoryProgression, type: e.target.value }
                                    }))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                >
                                    <option value="double">Double Progression</option>
                                    <option value="linear">Linear Progression</option>
                                    <option value="volume">Volume Progression</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-gray-300 mb-1">Min Reps</label>
                                    <input
                                        type="number"
                                        min="6"
                                        max="15"
                                        value={progressionConfig.accessoryProgression.repRanges.lower}
                                        onChange={(e) => setProgressionConfig(prev => ({
                                            ...prev,
                                            accessoryProgression: {
                                                ...prev.accessoryProgression,
                                                repRanges: { ...prev.accessoryProgression.repRanges, lower: parseInt(e.target.value) }
                                            }
                                        }))}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Max Reps</label>
                                    <input
                                        type="number"
                                        min="8"
                                        max="20"
                                        value={progressionConfig.accessoryProgression.repRanges.upper}
                                        onChange={(e) => setProgressionConfig(prev => ({
                                            ...prev,
                                            accessoryProgression: {
                                                ...prev.accessoryProgression,
                                                repRanges: { ...prev.accessoryProgression.repRanges, upper: parseInt(e.target.value) }
                                            }
                                        }))}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Results */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">✅</span>
                    Selection Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">{validation.balanceScore}</div>
                        <div className="text-gray-400 text-sm">Balance Score</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">
                            {Object.values(exerciseSelection.movementPatterns).reduce((sum, pattern) => sum + pattern.selected.length, 0)}
                        </div>
                        <div className="text-gray-400 text-sm">Total Exercises</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className={`text-2xl font-bold ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                            {validation.isValid ? '✓' : '✗'}
                        </div>
                        <div className="text-gray-400 text-sm">Validation</div>
                    </div>
                </div>

                {validation.warnings.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3 mb-4">
                        <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Warnings</h4>
                        <ul className="text-yellow-300 text-sm space-y-1">
                            {validation.warnings.map((warning, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {validation.recommendations.length > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                        <h4 className="text-blue-400 font-semibold mb-2">💡 Recommendations</h4>
                        <ul className="text-blue-300 text-sm space-y-1">
                            {validation.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                    Previous: Periodization
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading || !validation.isValid}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Next: Volume & Recovery'}
                </button>
            </div>
        </div>
    );
};

export default ExerciseSelectionProgression;
