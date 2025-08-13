/**
 * Bryant Strongman Events Interface
 * Comprehensive UI for planning and executing strongman training events
 * Integrates with calculate_strongman_volume() SQL function and Bryant methodology
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Timer, MapPin, Target, Calculator, Play, AlertTriangle, CheckCircle } from 'lucide-react';

const BryantStrongmanInterface = ({
    onEventUpdate,
    onSessionComplete,
    experienceLevel = 'intermediate',
    availableEquipment = []
}) => {
    // Strongman event state
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [sessionConfig, setSessionConfig] = useState({
        totalEvents: 3,
        sessionType: 'strength', // strength, conditioning, tactical
        experienceLevel: experienceLevel,
        targetVolume: 300
    });
    const [activeEvent, setActiveEvent] = useState(null);
    const [volumeCalculations, setVolumeCalculations] = useState([]);
    const [sessionSummary, setSessionSummary] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Bryant strongman event library
    const strongmanEvents = {
        farmers_walk: {
            name: 'Farmers Walk',
            category: 'carrying',
            difficulty: 'beginner',
            equipment: ['dumbbells', 'farmers_handles'],
            primaryMuscles: ['traps', 'forearms', 'core'],
            secondaryMuscles: ['quads', 'glutes', 'calves'],
            tacticalRelevance: 'high',
            description: 'Carry heavy implements for distance or time',
            safetyNotes: 'Maintain upright posture, avoid forward lean',
            defaultConfig: {
                distance: 150,
                duration: 30,
                loadFactor: 1.3,
                restBetween: 90
            },
            bryantNotes: 'Excellent for grip strength and postural endurance'
        },
        tire_flip: {
            name: 'Tire Flip',
            category: 'explosive',
            difficulty: 'intermediate',
            equipment: ['tire'],
            primaryMuscles: ['quads', 'glutes', 'back'],
            secondaryMuscles: ['shoulders', 'triceps', 'core'],
            tacticalRelevance: 'high',
            description: 'Flip heavy tire for distance or repetitions',
            safetyNotes: 'Keep back neutral, drive through legs',
            defaultConfig: {
                distance: 100,
                duration: 45,
                loadFactor: 1.5,
                restBetween: 120
            },
            bryantNotes: 'Develops explosive power and functional strength'
        },
        atlas_stones: {
            name: 'Atlas Stones',
            category: 'lifting',
            difficulty: 'advanced',
            equipment: ['atlas_stones', 'platform'],
            primaryMuscles: ['back', 'glutes'],
            secondaryMuscles: ['biceps', 'core', 'quads'],
            tacticalRelevance: 'medium',
            description: 'Lift and load stones to platforms',
            safetyNotes: 'Use proper lifting technique, tacky for grip',
            defaultConfig: {
                distance: 0,
                duration: 60,
                loadFactor: 1.8,
                restBetween: 180
            },
            bryantNotes: 'Ultimate test of lifting strength and technique'
        },
        yoke_walk: {
            name: 'Yoke Walk',
            category: 'carrying',
            difficulty: 'intermediate',
            equipment: ['yoke'],
            primaryMuscles: ['traps', 'core', 'legs'],
            secondaryMuscles: ['back', 'shoulders'],
            tacticalRelevance: 'high',
            description: 'Walk with heavy yoke on shoulders',
            safetyNotes: 'Maintain tight core, control the weight',
            defaultConfig: {
                distance: 100,
                duration: 25,
                loadFactor: 1.4,
                restBetween: 120
            },
            bryantNotes: 'Builds structural strength and stability'
        },
        log_press: {
            name: 'Log Press',
            category: 'pressing',
            difficulty: 'advanced',
            equipment: ['log'],
            primaryMuscles: ['shoulders', 'triceps'],
            secondaryMuscles: ['core', 'upper_back'],
            tacticalRelevance: 'medium',
            description: 'Press log overhead for maximum reps or weight',
            safetyNotes: 'Clean efficiently, press with power',
            defaultConfig: {
                distance: 0,
                duration: 45,
                loadFactor: 1.6,
                restBetween: 180
            },
            bryantNotes: 'Develops overhead strength and power'
        },
        sled_push: {
            name: 'Sled Push',
            category: 'pushing',
            difficulty: 'beginner',
            equipment: ['sled'],
            primaryMuscles: ['quads', 'glutes'],
            secondaryMuscles: ['calves', 'core'],
            tacticalRelevance: 'high',
            description: 'Push weighted sled for distance',
            safetyNotes: 'Low body position, drive through legs',
            defaultConfig: {
                distance: 150,
                duration: 30,
                loadFactor: 1.3,
                restBetween: 90
            },
            bryantNotes: 'Excellent for leg drive and conditioning'
        },
        sled_pull: {
            name: 'Sled Pull',
            category: 'pulling',
            difficulty: 'beginner',
            equipment: ['sled', 'rope'],
            primaryMuscles: ['back', 'biceps'],
            secondaryMuscles: ['core', 'legs'],
            tacticalRelevance: 'high',
            description: 'Pull weighted sled with rope',
            safetyNotes: 'Lean back, use whole body',
            defaultConfig: {
                distance: 150,
                duration: 35,
                loadFactor: 1.25,
                restBetween: 90
            },
            bryantNotes: 'Develops pulling strength and endurance'
        },
        sandbag_carry: {
            name: 'Sandbag Carry',
            category: 'carrying',
            difficulty: 'beginner',
            equipment: ['sandbag'],
            primaryMuscles: ['core', 'arms'],
            secondaryMuscles: ['back', 'legs'],
            tacticalRelevance: 'high',
            description: 'Carry sandbag in various positions',
            safetyNotes: 'Secure grip, maintain posture',
            defaultConfig: {
                distance: 100,
                duration: 30,
                loadFactor: 1.25,
                restBetween: 75
            },
            bryantNotes: 'Functional carrying strength and stability'
        }
    };

    // Filter events by available equipment and experience level
    const getAvailableEvents = useCallback(() => {
        return Object.entries(strongmanEvents).filter(([key, event]) => {
            // Check equipment availability
            const hasEquipment = event.equipment.some(eq =>
                availableEquipment.includes(eq) || availableEquipment.length === 0
            );

            // Check experience level appropriateness
            const experienceMatch =
                experienceLevel === 'advanced' ||
                (experienceLevel === 'intermediate' && event.difficulty !== 'advanced') ||
                (experienceLevel === 'beginner' && event.difficulty === 'beginner');

            return hasEquipment && experienceMatch;
        });
    }, [availableEquipment, experienceLevel]);

    // Calculate strongman volume using core utilities
    const calculateEventVolume = useCallback(async (eventType, config) => {
        setIsCalculating(true);
        try {
            // Use the global CoreUtilities function
            const result = await window.CoreUtilities?.database?.calculateStrongmanVolume(
                eventType,
                {
                    distance: config.distance,
                    duration: config.duration,
                    events: 1,
                    loadFactor: config.loadFactor,
                    bodyweight: 200, // Could be made configurable
                    experienceLevel: sessionConfig.experienceLevel
                }
            );

            if (result?.success) {
                return result.data;
            } else {
                console.warn('Volume calculation failed, using fallback');
                return calculateFallbackVolume(eventType, config);
            }
        } catch (error) {
            console.error('Error calculating volume:', error);
            return calculateFallbackVolume(eventType, config);
        } finally {
            setIsCalculating(false);
        }
    }, [sessionConfig.experienceLevel]);

    // Fallback volume calculation
    const calculateFallbackVolume = (eventType, config) => {
        const event = strongmanEvents[eventType];
        if (!event) return null;

        const baseReps = config.distance ? config.distance / 5 : config.duration / 3;
        const volume = baseReps * config.loadFactor;

        return {
            event_name: event.name,
            estimated_reps: Math.round(baseReps * 100) / 100,
            total_volume: Math.round(volume * 100) / 100,
            tactical_application: event.tacticalRelevance === 'high',
            bryant_compliant: true
        };
    };

    // Add event to session
    const addEvent = (eventType) => {
        const event = strongmanEvents[eventType];
        if (!event) return;

        const eventConfig = {
            id: Date.now(),
            type: eventType,
            name: event.name,
            config: { ...event.defaultConfig },
            completed: false,
            volume: null
        };

        setSelectedEvents(prev => [...prev, eventConfig]);
    };

    // Remove event from session
    const removeEvent = (eventId) => {
        setSelectedEvents(prev => prev.filter(event => event.id !== eventId));
    };

    // Update event configuration
    const updateEventConfig = async (eventId, field, value) => {
        setSelectedEvents(prev =>
            prev.map(event => {
                if (event.id === eventId) {
                    const updatedConfig = { ...event.config, [field]: value };
                    return { ...event, config: updatedConfig };
                }
                return event;
            })
        );

        // Recalculate volume for this event
        const event = selectedEvents.find(e => e.id === eventId);
        if (event) {
            const volume = await calculateEventVolume(event.type, {
                ...event.config,
                [field]: value
            });

            setVolumeCalculations(prev => ({
                ...prev,
                [eventId]: volume
            }));
        }
    };

    // Calculate total session volume
    const calculateSessionVolume = useCallback(async () => {
        if (selectedEvents.length === 0) return;

        setIsCalculating(true);
        try {
            const eventCalculations = {};
            let totalVolume = 0;
            let tacticalVolume = 0;

            for (const event of selectedEvents) {
                const volume = await calculateEventVolume(event.type, event.config);
                if (volume) {
                    eventCalculations[event.id] = volume;
                    totalVolume += volume.total_volume;
                    if (volume.tactical_application) {
                        tacticalVolume += volume.total_volume;
                    }
                }
            }

            setVolumeCalculations(eventCalculations);

            const tacticalPercentage = totalVolume > 0 ? (tacticalVolume / totalVolume) * 100 : 0;

            setSessionSummary({
                totalVolume,
                tacticalVolume,
                tacticalPercentage,
                eventCount: selectedEvents.length,
                bryantCompliant: true
            });

        } catch (error) {
            console.error('Error calculating session volume:', error);
        } finally {
            setIsCalculating(false);
        }
    }, [selectedEvents, calculateEventVolume]);

    // Recalculate when events change
    useEffect(() => {
        if (selectedEvents.length > 0) {
            calculateSessionVolume();
        }
    }, [selectedEvents, calculateSessionVolume]);

    // Get recommendations based on session type
    const getSessionRecommendations = () => {
        const recommendations = [];

        if (sessionConfig.sessionType === 'tactical' && sessionSummary?.tacticalPercentage < 70) {
            recommendations.push('Consider adding more tactical-relevant events for tactical training');
        }

        if (selectedEvents.length < 2) {
            recommendations.push('Add at least 2-3 events for a complete strongman session');
        }

        if (sessionSummary?.totalVolume > 500 && experienceLevel === 'beginner') {
            recommendations.push('Total volume may be too high for beginner level');
        }

        return recommendations;
    };

    return (
        <div className="bryant-strongman-interface bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Truck className="h-5 w-5 text-orange-400" />
                        Bryant Strongman Events
                    </h2>
                    <p className="text-gray-400 text-sm">Tactical and functional strength development</p>
                </div>
                {sessionSummary && (
                    <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                            {Math.round(sessionSummary.totalVolume)} Volume
                        </div>
                        <div className="text-sm text-gray-400">
                            {Math.round(sessionSummary.tacticalPercentage)}% Tactical
                        </div>
                    </div>
                )}
            </div>

            {/* Session Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Session Type</label>
                    <select
                        value={sessionConfig.sessionType}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, sessionType: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="strength">Strength Development</option>
                        <option value="conditioning">Conditioning</option>
                        <option value="tactical">Tactical Application</option>
                        <option value="hybrid">Hybrid Training</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Experience Level</label>
                    <select
                        value={sessionConfig.experienceLevel}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, experienceLevel: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Target Events</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="1"
                            max="6"
                            value={sessionConfig.totalEvents}
                            onChange={(e) => setSessionConfig(prev => ({ ...prev, totalEvents: parseInt(e.target.value) }))}
                            className="flex-1"
                        />
                        <span className="text-white font-medium w-8 text-center">
                            {sessionConfig.totalEvents}
                        </span>
                    </div>
                </div>
            </div>

            {/* Available Events */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Available Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getAvailableEvents().map(([eventType, event]) => (
                        <div
                            key={eventType}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white">{event.name}</h4>
                                <div className="flex items-center gap-1">
                                    {event.tacticalRelevance === 'high' && (
                                        <Target className="h-4 w-4 text-green-400" title="High Tactical Relevance" />
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${event.difficulty === 'beginner' ? 'bg-green-900 text-green-300' :
                                            event.difficulty === 'intermediate' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-red-900 text-red-300'
                                        }`}>
                                        {event.difficulty}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    {event.equipment.join(', ')}
                                </div>
                                <button
                                    onClick={() => addEvent(eventType)}
                                    disabled={selectedEvents.some(e => e.type === eventType)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {selectedEvents.some(e => e.type === eventType) ? 'Added' : 'Add'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Events */}
            {selectedEvents.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white">Session Events</h3>
                    <div className="space-y-3">
                        {selectedEvents.map((event) => {
                            const eventData = strongmanEvents[event.type];
                            const volume = volumeCalculations[event.id];

                            return (
                                <div key={event.id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-white flex items-center gap-2">
                                            {event.name}
                                            {volume?.tactical_application && (
                                                <Target className="h-4 w-4 text-green-400" />
                                            )}
                                        </h4>
                                        <button
                                            onClick={() => removeEvent(event.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                        {eventData.defaultConfig.distance > 0 && (
                                            <div className="space-y-1">
                                                <label className="block text-xs text-gray-400">Distance (ft)</label>
                                                <input
                                                    type="number"
                                                    value={event.config.distance}
                                                    onChange={(e) => updateEventConfig(event.id, 'distance', parseInt(e.target.value))}
                                                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <label className="block text-xs text-gray-400">Duration (s)</label>
                                            <input
                                                type="number"
                                                value={event.config.duration}
                                                onChange={(e) => updateEventConfig(event.id, 'duration', parseInt(e.target.value))}
                                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs text-gray-400">Load Factor</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={event.config.loadFactor}
                                                onChange={(e) => updateEventConfig(event.id, 'loadFactor', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs text-gray-400">Rest (s)</label>
                                            <input
                                                type="number"
                                                value={event.config.restBetween}
                                                onChange={(e) => updateEventConfig(event.id, 'restBetween', parseInt(e.target.value))}
                                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {volume && (
                                        <div className="flex items-center justify-between bg-gray-600 rounded p-2">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-white">
                                                        {volume.estimated_reps}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Est. Reps</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-blue-400">
                                                        {volume.total_volume}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Volume</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {volume.tactical_application && (
                                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                                                        Tactical
                                                    </span>
                                                )}
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-2 text-xs text-blue-300 bg-blue-900/20 p-2 rounded">
                                        {eventData.bryantNotes}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Session Summary */}
            {sessionSummary && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Session Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                                {sessionSummary.eventCount}
                            </div>
                            <div className="text-sm text-gray-400">Events</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                {Math.round(sessionSummary.totalVolume)}
                            </div>
                            <div className="text-sm text-gray-400">Total Volume</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {Math.round(sessionSummary.tacticalPercentage)}%
                            </div>
                            <div className="text-sm text-gray-400">Tactical</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                                {sessionSummary.bryantCompliant ? 'Yes' : 'No'}
                            </div>
                            <div className="text-sm text-gray-400">Bryant Compliant</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {getSessionRecommendations().length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Recommendations
                    </h4>
                    <ul className="space-y-1">
                        {getSessionRecommendations().map((rec, index) => (
                            <li key={index} className="text-yellow-300 text-sm">• {rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={calculateSessionVolume}
                    disabled={selectedEvents.length === 0 || isCalculating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Calculator className="h-4 w-4" />
                    {isCalculating ? 'Calculating...' : 'Recalculate Volume'}
                </button>
                {selectedEvents.length > 0 && onSessionComplete && (
                    <button
                        onClick={() => onSessionComplete({
                            events: selectedEvents,
                            summary: sessionSummary,
                            calculations: volumeCalculations
                        })}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Play className="h-4 w-4" />
                        Start Session
                    </button>
                )}
            </div>
        </div>
    );
};

export default BryantStrongmanInterface;
