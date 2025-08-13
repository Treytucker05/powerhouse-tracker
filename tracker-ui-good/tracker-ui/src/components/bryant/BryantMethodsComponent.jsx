/**
 * Bryant Methods Integration Component
 * Handles selection and configuration of Bryant Periodization methods
 * Research source: Pages 101-129
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';
import { BRYANT_CONSTANTS } from '../../utils/legacyMigration';
import { validateModelBryantCompatibility } from '../../data/periodizationModels';

const BryantMethodsComponent = ({ onMethodsChange, selectedMethods = [] }) => {
    const { state, actions } = useProgramContext();
    const [methods, setMethods] = useState(selectedMethods);
    const [validation, setValidation] = useState(null);

    // Bryant method definitions from research
    const bryantMethods = {
        phaCircuits: {
            id: 'phaCircuits',
            name: 'PHA Circuits',
            description: 'Peripheral Heart Action circuits with alternating upper/lower body exercises',
            icon: '🔄',
            duration: `${BRYANT_CONSTANTS.PHA_MIN_DURATION}-${BRYANT_CONSTANTS.PHA_MAX_DURATION} weeks`,
            benefits: ['Improved cardiovascular fitness', 'Enhanced recovery', 'Time efficient'],
            requirements: ['Multiple exercise stations', 'Moderate to high fitness level'],
            contraindications: ['Severe cardiovascular issues', 'Recent injuries'],
            research: 'Pages 101-108: PHA methodology with duration caps',
            configuration: {
                maxDuration: BRYANT_CONSTANTS.PHA_MAX_DURATION,
                minDuration: BRYANT_CONSTANTS.PHA_MIN_DURATION,
                exercisePairs: 'Upper/Lower alternation',
                restProtocol: 'Minimal between exercises, 2-3 min between circuits'
            }
        },
        clusterSets: {
            id: 'clusterSets',
            name: 'Cluster Sets',
            description: 'Short rest periods within sets for maintained power output',
            icon: '⚡',
            duration: 'Integrated within phases',
            benefits: ['Maintained power', 'Higher volume at intensity', 'Reduced fatigue'],
            requirements: ['Timer precision', 'High training experience'],
            contraindications: ['Beginner level', 'Poor work capacity'],
            research: 'Pages 109-116: 15s intra-rest with 3×3-5 structure',
            configuration: {
                intraRest: BRYANT_CONSTANTS.CLUSTER_INTRA_REST,
                interRest: BRYANT_CONSTANTS.CLUSTER_INTER_REST,
                structure: '3×3-5 reps',
                intensity: '85-95% 1RM'
            }
        },
        strongmanEvents: {
            id: 'strongmanEvents',
            name: 'Strongman Events',
            description: 'Functional strength events with time/distance parameters',
            icon: '🏋️',
            duration: 'Event-specific protocols',
            benefits: ['Real-world strength', 'Total body integration', 'Mental toughness'],
            requirements: ['Specialized equipment', 'Movement competency'],
            contraindications: ['Poor movement quality', 'Acute injuries'],
            research: 'Pages 117-124: Time/distance-based with tactical applications',
            configuration: {
                timeCap: BRYANT_CONSTANTS.STRONGMAN_TIME_CAP,
                distanceStandard: BRYANT_CONSTANTS.STRONGMAN_DISTANCE_STANDARD,
                events: ['Farmers Walk', 'Tire Flip', 'Atlas Stones', 'Yoke Walk'],
                scaling: 'Load, time, or distance adjustments'
            }
        },
        tacticalApplications: {
            id: 'tacticalApplications',
            name: 'Tactical Applications',
            description: 'Law enforcement and military-specific training protocols',
            icon: '🎯',
            duration: 'Job-specific cycles',
            benefits: ['Occupational readiness', 'Stress inoculation', 'Team building'],
            requirements: ['Job-specific knowledge', 'High fitness base'],
            contraindications: ['Civilian populations without specific needs'],
            research: 'Pages 125-129: Work:rest ratios and scenario-based training',
            configuration: {
                recoveryRatio: BRYANT_CONSTANTS.TACTICAL_RECOVERY_RATIO,
                scenarios: 'Job-specific movement patterns',
                intensity: 'Variable based on scenario',
                duration: 'Mission-specific timing'
            }
        }
    };

    // Validate method compatibility with current program
    useEffect(() => {
        if (methods.length > 0) {
            const validation = validateModelBryantCompatibility(
                state.selectedTrainingModel || 'linear',
                methods
            );
            setValidation(validation);
        } else {
            setValidation(null);
        }
    }, [methods, state.selectedTrainingModel]);

    // Handle method selection
    const handleMethodToggle = (methodId) => {
        const newMethods = methods.includes(methodId)
            ? methods.filter(m => m !== methodId)
            : [...methods, methodId];

        setMethods(newMethods);

        // Trigger validation and update parent
        if (onMethodsChange) {
            onMethodsChange(newMethods);
        }
    };

    // Calculate total program implications
    const getProgramImplications = () => {
        const implications = {
            durationCaps: false,
            equipmentNeeds: [],
            fitnessRequirements: [],
            contraindications: []
        };

        methods.forEach(methodId => {
            const method = bryantMethods[methodId];
            if (!method) return;

            // Check duration caps
            if (methodId === 'phaCircuits' && state.programData?.duration > BRYANT_CONSTANTS.PHA_MAX_DURATION) {
                implications.durationCaps = true;
            }

            // Aggregate requirements
            implications.equipmentNeeds.push(...(method.requirements || []));
            implications.fitnessRequirements.push(...(method.benefits || []));
            implications.contraindications.push(...(method.contraindications || []));
        });

        // Remove duplicates
        implications.equipmentNeeds = [...new Set(implications.equipmentNeeds)];
        implications.fitnessRequirements = [...new Set(implications.fitnessRequirements)];
        implications.contraindications = [...new Set(implications.contraindications)];

        return implications;
    };

    const implications = getProgramImplications();

    return (
        <div className="bryant-methods-integration space-y-6">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                    <span className="mr-2">📚</span>
                    Bryant Periodization Integration
                </h3>
                <p className="text-gray-300 text-sm">
                    Research-based methods from pages 101-129. Select methods to integrate into your program design.
                    Duration caps and compatibility checks are automatically applied.
                </p>
            </div>

            {/* Method Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(bryantMethods).map(([key, method]) => {
                    const isSelected = methods.includes(key);
                    const isCompatible = !validation || validation.valid || !methods.includes(key);

                    return (
                        <div
                            key={key}
                            className={`
                                border rounded-lg p-4 cursor-pointer transition-all duration-200
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                }
                                ${!isCompatible ? 'border-red-500/50 bg-red-900/10' : ''}
                            `}
                            onClick={() => handleMethodToggle(key)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{method.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-white">{method.name}</h4>
                                        <p className="text-sm text-gray-400">{method.duration}</p>
                                    </div>
                                </div>
                                <div className={`
                                    w-6 h-6 border-2 rounded-full flex items-center justify-center
                                    ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}
                                `}>
                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-3">{method.description}</p>

                            {/* Benefits */}
                            <div className="mb-3">
                                <h5 className="text-xs font-semibold text-green-400 mb-1">Benefits:</h5>
                                <div className="flex flex-wrap gap-1">
                                    {method.benefits.map((benefit, idx) => (
                                        <span key={idx} className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Configuration Preview */}
                            {isSelected && (
                                <div className="bg-gray-900/50 rounded p-2 mt-3">
                                    <h5 className="text-xs font-semibold text-blue-400 mb-1">Configuration:</h5>
                                    {Object.entries(method.configuration).map(([key, value]) => (
                                        <div key={key} className="text-xs text-gray-400 flex justify-between">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Research Reference */}
                            <div className="mt-2 pt-2 border-t border-gray-700">
                                <p className="text-xs text-gray-500 italic">{method.research}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Validation Feedback */}
            {validation && !validation.valid && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold mb-2">⚠️ Compatibility Issues</h4>
                    <p className="text-red-300 text-sm mb-2">{validation.error}</p>
                    {validation.recommendations && (
                        <div>
                            <h5 className="text-red-400 text-sm font-semibold mb-1">Recommendations:</h5>
                            <ul className="text-red-300 text-sm space-y-1">
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
            )}

            {/* Program Implications */}
            {methods.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Program Implications</h4>

                    {implications.durationCaps && (
                        <div className="mb-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                            <div className="flex items-center text-yellow-400 mb-1">
                                <span className="mr-2">⏰</span>
                                <span className="font-semibold">Duration Cap Applied</span>
                            </div>
                            <p className="text-yellow-300 text-sm">
                                Program duration capped at {BRYANT_CONSTANTS.PHA_MAX_DURATION} weeks per Bryant PHA methodology.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {implications.equipmentNeeds.length > 0 && (
                            <div>
                                <h5 className="text-gray-400 font-semibold text-sm mb-2">Equipment Needs:</h5>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    {implications.equipmentNeeds.map((need, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            {need}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {implications.fitnessRequirements.length > 0 && (
                            <div>
                                <h5 className="text-gray-400 font-semibold text-sm mb-2">Fitness Benefits:</h5>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    {implications.fitnessRequirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {implications.contraindications.length > 0 && (
                            <div>
                                <h5 className="text-red-400 font-semibold text-sm mb-2">Contraindications:</h5>
                                <ul className="text-red-300 text-sm space-y-1">
                                    {implications.contraindications.map((contra, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            {contra}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Integration Summary */}
            {methods.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Integration Summary</h4>
                    <p className="text-blue-300 text-sm mb-2">
                        {methods.length} Bryant method{methods.length !== 1 ? 's' : ''} selected for integration:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {methods.map(methodId => (
                            <span key={methodId} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                {bryantMethods[methodId]?.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BryantMethodsComponent;
