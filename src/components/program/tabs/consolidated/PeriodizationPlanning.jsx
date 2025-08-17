/**
 * PeriodizationPlanning.jsx - Bryant Periodization Integration Component
 * Implements research-backed periodization planning with Bryant methods
 * Handles PHA circuits, cluster sets, and tactical applications
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../../contexts/ProgramContext';
import { useBryantPeriodization } from '../../../../hooks/useBryantPeriodization';
import { calculateBryantPhases } from '../../../../utils/bryantCalculations';

const PeriodizationPlanning = ({ onNext, onPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        generateBryantMacrocycle,
        optimizePHACircuits,
        calculateClusterProgression,
        loading
    } = useBryantPeriodization();

    // Periodization state
    const [periodization, setPeriodization] = useState({
        // Macrocycle Structure
        totalWeeks: parseInt(state.programData?.timeframe?.split('-')[0]) || 12,
        phases: [],

        // Bryant Method Configuration
        bryantMethods: {
            phaCircuits: {
                enabled: false,
                weeks: 4,
                progression: 'volume',
                circuits: []
            },
            clusterSets: {
                enabled: false,
                weeks: 6,
                restPeriods: { intra: 15, inter: 180 },
                progression: []
            },
            strongmanEvents: {
                enabled: false,
                weeks: 4,
                events: [],
                progressionType: 'time'
            },
            tacticalApplications: {
                enabled: false,
                weeks: 8,
                protocols: [],
                specificRequirements: []
            }
        },

        // Phase Distribution
        phaseDistribution: {
            anatomicalAdaptation: 2,
            hypertrophy: 4,
            strength: 4,
            power: 2
        },

        // Periodization Model
        model: 'linear', // linear, undulating, block, tactical

        // Volume Progression
        volumeProgression: {
            startingVolume: 100,
            peakVolume: 130,
            deloadVolume: 70,
            progressionType: 'gradual'
        }
    });

    // Validation and recommendations
    const [validation, setValidation] = useState({
        isValid: false,
        warnings: [],
        recommendations: [],
        bryantCompatibility: null
    });

    // Load assessment data and configure Bryant methods
    useEffect(() => {
        if (state.assessmentData?.bryantReadiness?.preferredMethods) {
            const methods = state.assessmentData.bryantReadiness.preferredMethods;

            setPeriodization(prev => ({
                ...prev,
                bryantMethods: {
                    ...prev.bryantMethods,
                    phaCircuits: {
                        ...prev.bryantMethods.phaCircuits,
                        enabled: methods.includes('phaCircuits')
                    },
                    clusterSets: {
                        ...prev.bryantMethods.clusterSets,
                        enabled: methods.includes('clusterSets')
                    },
                    strongmanEvents: {
                        ...prev.bryantMethods.strongmanEvents,
                        enabled: methods.includes('strongmanEvents')
                    },
                    tacticalApplications: {
                        ...prev.bryantMethods.tacticalApplications,
                        enabled: methods.includes('tacticalApplications')
                    }
                }
            }));
        }

        // Set periodization model based on goals
        if (state.assessmentData?.goalPriorities) {
            const { goalPriorities } = state.assessmentData;

            if (goalPriorities.tactical === 'high') {
                setPeriodization(prev => ({ ...prev, model: 'tactical' }));
            } else if (goalPriorities.power === 'high') {
                setPeriodization(prev => ({ ...prev, model: 'block' }));
            } else if (goalPriorities.strength === 'high' && goalPriorities.hypertrophy === 'high') {
                setPeriodization(prev => ({ ...prev, model: 'undulating' }));
            }
        }
    }, [state.assessmentData]);

    // Generate periodization phases
    useEffect(() => {
        if (periodization.totalWeeks > 0) {
            const phases = generatePeriodizationPhases();
            setPeriodization(prev => ({ ...prev, phases }));
            validatePeriodization(phases);
        }
    }, [
        periodization.totalWeeks,
        periodization.model,
        periodization.phaseDistribution,
        periodization.bryantMethods
    ]);

    // Generate periodization phases based on model and Bryant methods
    const generatePeriodizationPhases = () => {
        const { totalWeeks, model, phaseDistribution, bryantMethods } = periodization;
        const phases = [];

        switch (model) {
            case 'linear':
                phases.push(...generateLinearPhases(totalWeeks, phaseDistribution, bryantMethods));
                break;
            case 'undulating':
                phases.push(...generateUndulatingPhases(totalWeeks, bryantMethods));
                break;
            case 'block':
                phases.push(...generateBlockPhases(totalWeeks, bryantMethods));
                break;
            case 'tactical':
                phases.push(...generateTacticalPhases(totalWeeks, bryantMethods));
                break;
            default:
                phases.push(...generateLinearPhases(totalWeeks, phaseDistribution, bryantMethods));
        }

        return phases;
    };

    // Linear periodization with Bryant integration
    const generateLinearPhases = (totalWeeks, distribution, bryantMethods) => {
        const phases = [];
        let currentWeek = 1;

        // Anatomical Adaptation (with PHA if enabled)
        if (distribution.anatomicalAdaptation > 0) {
            phases.push({
                name: 'Anatomical Adaptation',
                weeks: distribution.anatomicalAdaptation,
                startWeek: currentWeek,
                endWeek: currentWeek + distribution.anatomicalAdaptation - 1,
                focus: 'movement_quality',
                intensity: '50-65%',
                volume: 'moderate',
                bryantMethods: bryantMethods.phaCircuits.enabled ? ['phaCircuits'] : [],
                description: bryantMethods.phaCircuits.enabled
                    ? 'Movement preparation with PHA circuits for cardiovascular adaptation'
                    : 'Basic movement patterns and technique development'
            });
            currentWeek += distribution.anatomicalAdaptation;
        }

        // Hypertrophy Phase
        if (distribution.hypertrophy > 0) {
            phases.push({
                name: 'Hypertrophy',
                weeks: distribution.hypertrophy,
                startWeek: currentWeek,
                endWeek: currentWeek + distribution.hypertrophy - 1,
                focus: 'muscle_growth',
                intensity: '65-80%',
                volume: 'high',
                bryantMethods: bryantMethods.clusterSets.enabled ? ['clusterSets'] : [],
                description: bryantMethods.clusterSets.enabled
                    ? 'Muscle hypertrophy with Bryant cluster sets for enhanced volume tolerance'
                    : 'Traditional hypertrophy training with progressive overload'
            });
            currentWeek += distribution.hypertrophy;
        }

        // Strength Phase
        if (distribution.strength > 0) {
            phases.push({
                name: 'Strength',
                weeks: distribution.strength,
                startWeek: currentWeek,
                endWeek: currentWeek + distribution.strength - 1,
                focus: 'maximal_strength',
                intensity: '80-95%',
                volume: 'moderate',
                bryantMethods: getBryantMethodsForStrength(bryantMethods),
                description: 'Maximal strength development with progressive intensity'
            });
            currentWeek += distribution.strength;
        }

        // Power Phase
        if (distribution.power > 0) {
            phases.push({
                name: 'Power',
                weeks: distribution.power,
                startWeek: currentWeek,
                endWeek: currentWeek + distribution.power - 1,
                focus: 'power_development',
                intensity: '30-60%',
                volume: 'low',
                bryantMethods: getBryantMethodsForPower(bryantMethods),
                description: 'Explosive power development and rate of force development'
            });
        }

        return phases;
    };

    // Tactical periodization model
    const generateTacticalPhases = (totalWeeks, bryantMethods) => {
        const phases = [];
        const phaseLength = Math.floor(totalWeeks / 3);

        // Base Building Phase
        phases.push({
            name: 'Base Building',
            weeks: phaseLength,
            startWeek: 1,
            endWeek: phaseLength,
            focus: 'aerobic_base',
            intensity: '60-75%',
            volume: 'high',
            bryantMethods: bryantMethods.phaCircuits.enabled ? ['phaCircuits'] : [],
            description: 'Aerobic base development with work capacity emphasis'
        });

        // Strength Endurance Phase
        phases.push({
            name: 'Strength Endurance',
            weeks: phaseLength,
            startWeek: phaseLength + 1,
            endWeek: phaseLength * 2,
            focus: 'strength_endurance',
            intensity: '70-85%',
            volume: 'moderate-high',
            bryantMethods: bryantMethods.clusterSets.enabled ? ['clusterSets'] : [],
            description: 'Strength endurance with cluster sets for fatigue resistance'
        });

        // Tactical Application Phase
        phases.push({
            name: 'Tactical Application',
            weeks: totalWeeks - (phaseLength * 2),
            startWeek: (phaseLength * 2) + 1,
            endWeek: totalWeeks,
            focus: 'tactical_performance',
            intensity: 'variable',
            volume: 'moderate',
            bryantMethods: bryantMethods.strongmanEvents.enabled || bryantMethods.tacticalApplications.enabled
                ? ['strongmanEvents', 'tacticalApplications'].filter(method =>
                    bryantMethods[method.replace('Events', 'Events').replace('Applications', 'Applications')].enabled
                )
                : [],
            description: 'Tactical-specific training with strongman events and specialized protocols'
        });

        return phases;
    };

    // Get Bryant methods appropriate for strength phase
    const getBryantMethodsForStrength = (bryantMethods) => {
        const methods = [];
        if (bryantMethods.clusterSets.enabled) methods.push('clusterSets');
        if (bryantMethods.strongmanEvents.enabled) methods.push('strongmanEvents');
        return methods;
    };

    // Get Bryant methods appropriate for power phase
    const getBryantMethodsForPower = (bryantMethods) => {
        const methods = [];
        if (bryantMethods.clusterSets.enabled) methods.push('clusterSets');
        if (bryantMethods.strongmanEvents.enabled) methods.push('strongmanEvents');
        if (bryantMethods.tacticalApplications.enabled) methods.push('tacticalApplications');
        return methods;
    };

    // Validate periodization plan
    const validatePeriodization = (phases) => {
        const warnings = [];
        const recommendations = [];
        let isValid = true;

        // Check phase distribution
        if (phases.length < 2) {
            warnings.push('Minimum 2 phases recommended for effective periodization');
            isValid = false;
        }

        // Check Bryant method integration
        const enabledMethods = Object.entries(periodization.bryantMethods)
            .filter(([_, config]) => config.enabled)
            .map(([method, _]) => method);

        if (enabledMethods.length > 0) {
            recommendations.push(`Bryant methods integrated: ${enabledMethods.join(', ')}`);

            // PHA Circuits validation
            if (periodization.bryantMethods.phaCircuits.enabled) {
                const phaPhases = phases.filter(phase => phase.bryantMethods.includes('phaCircuits'));
                if (phaPhases.length === 0) {
                    warnings.push('PHA circuits selected but not integrated into any phase');
                } else {
                    recommendations.push('PHA circuits will enhance cardiovascular adaptation');
                }
            }

            // Cluster Sets validation
            if (periodization.bryantMethods.clusterSets.enabled) {
                const clusterPhases = phases.filter(phase => phase.bryantMethods.includes('clusterSets'));
                if (clusterPhases.length === 0) {
                    warnings.push('Cluster sets selected but not integrated into any phase');
                } else {
                    recommendations.push('Cluster sets will allow higher training volumes');
                }
            }
        }

        // Check goal alignment
        if (state.assessmentData?.goalPriorities) {
            const { goalPriorities } = state.assessmentData;

            if (goalPriorities.tactical === 'high' && periodization.model !== 'tactical') {
                recommendations.push('Consider tactical periodization model for tactical goals');
            }

            if (goalPriorities.power === 'high') {
                const powerPhases = phases.filter(phase => phase.focus === 'power_development');
                if (powerPhases.length === 0) {
                    warnings.push('Power goal selected but no power development phase planned');
                }
            }
        }

        setValidation({
            isValid,
            warnings,
            recommendations,
            bryantCompatibility: enabledMethods.length > 0 ? 'integrated' : 'none'
        });
    };

    // Handle periodization model change
    const handleModelChange = (newModel) => {
        setPeriodization(prev => ({ ...prev, model: newModel }));
    };

    // Handle phase distribution change
    const handlePhaseDistributionChange = (phase, weeks) => {
        const newWeeks = Math.max(0, parseInt(weeks) || 0);
        setPeriodization(prev => ({
            ...prev,
            phaseDistribution: {
                ...prev.phaseDistribution,
                [phase]: newWeeks
            }
        }));
    };

    // Handle Bryant method configuration
    const handleBryantMethodConfig = (method, config) => {
        setPeriodization(prev => ({
            ...prev,
            bryantMethods: {
                ...prev.bryantMethods,
                [method]: {
                    ...prev.bryantMethods[method],
                    ...config
                }
            }
        }));
    };

    // Save and proceed
    const handleNext = async () => {
        try {
            actions.setLoading(true);

            // Generate final periodization plan
            const finalPlan = {
                ...periodization,
                validation,
                generatedAt: new Date().toISOString(),
                bryantIntegration: {
                    enabled: Object.values(periodization.bryantMethods).some(m => m.enabled),
                    methods: Object.entries(periodization.bryantMethods)
                        .filter(([_, config]) => config.enabled)
                        .map(([method, config]) => ({ method, config }))
                }
            };

            // Save to context
            actions.setPeriodizationPlan(finalPlan);

            // Generate Bryant-specific calculations if methods enabled
            if (finalPlan.bryantIntegration.enabled) {
                const bryantCalculations = await calculateBryantPhases(finalPlan);
                actions.setBryantCalculations(bryantCalculations);
            }

            onNext();
        } catch (error) {
            console.error('Error saving periodization plan:', error);
            actions.setError('Failed to save periodization plan');
        } finally {
            actions.setLoading(false);
        }
    };

    // Periodization models
    const periodizationModels = [
        { value: 'linear', label: 'Linear', description: 'Progressive intensity increase' },
        { value: 'undulating', label: 'Undulating', description: 'Variable intensity patterns' },
        { value: 'block', label: 'Block', description: 'Concentrated training blocks' },
        { value: 'tactical', label: 'Tactical', description: 'Bryant tactical protocols' }
    ];

    return (
        <div className="periodization-planning-container space-y-8 p-6">
            {/* Header */}
            <div className="text-center border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Periodization Planning</h2>
                <p className="text-gray-400">
                    Design your training phases with Bryant Periodization integration
                </p>
            </div>

            {/* Periodization Model Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Periodization Model
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {periodizationModels.map(model => (
                        <div
                            key={model.value}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${periodization.model === model.value
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onClick={() => handleModelChange(model.value)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-medium">{model.label}</h4>
                                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${periodization.model === model.value
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-500'
                                    }`}>
                                    {periodization.model === model.value && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">{model.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Phase Distribution */}
            {periodization.model === 'linear' && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">⏱️</span>
                        Phase Distribution ({periodization.totalWeeks} weeks total)
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(periodization.phaseDistribution).map(([phase, weeks]) => (
                            <div key={phase} className="bg-gray-900/50 rounded-lg p-4">
                                <label className="block text-white font-medium mb-2 capitalize">
                                    {phase.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={periodization.totalWeeks}
                                    value={weeks}
                                    onChange={(e) => handlePhaseDistributionChange(phase, e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                                <p className="text-gray-400 text-xs mt-1">weeks</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-right">
                        <span className="text-gray-400">
                            Total: {Object.values(periodization.phaseDistribution).reduce((a, b) => a + b, 0)} / {periodization.totalWeeks} weeks
                        </span>
                    </div>
                </div>
            )}

            {/* Bryant Method Configuration */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Bryant Method Configuration
                </h3>

                {Object.entries(periodization.bryantMethods).map(([method, config]) => (
                    config.enabled && (
                        <div key={method} className="bg-gray-900/50 rounded-lg p-4 mb-4">
                            <h4 className="text-white font-medium mb-3 capitalize">
                                {method.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>

                            {method === 'phaCircuits' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1">Duration (weeks)</label>
                                        <input
                                            type="number"
                                            min="2"
                                            max="8"
                                            value={config.weeks}
                                            onChange={(e) => handleBryantMethodConfig(method, { weeks: parseInt(e.target.value) })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Progression</label>
                                        <select
                                            value={config.progression}
                                            onChange={(e) => handleBryantMethodConfig(method, { progression: e.target.value })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                        >
                                            <option value="volume">Volume</option>
                                            <option value="intensity">Intensity</option>
                                            <option value="density">Density</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {method === 'clusterSets' && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1">Intra-set Rest (s)</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="30"
                                            value={config.restPeriods.intra}
                                            onChange={(e) => handleBryantMethodConfig(method, {
                                                restPeriods: { ...config.restPeriods, intra: parseInt(e.target.value) }
                                            })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Inter-set Rest (s)</label>
                                        <input
                                            type="number"
                                            min="120"
                                            max="300"
                                            value={config.restPeriods.inter}
                                            onChange={(e) => handleBryantMethodConfig(method, {
                                                restPeriods: { ...config.restPeriods, inter: parseInt(e.target.value) }
                                            })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Duration (weeks)</label>
                                        <input
                                            type="number"
                                            min="4"
                                            max="8"
                                            value={config.weeks}
                                            onChange={(e) => handleBryantMethodConfig(method, { weeks: parseInt(e.target.value) })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>

            {/* Generated Phases Preview */}
            {periodization.phases.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">📋</span>
                        Periodization Plan Preview
                    </h3>

                    <div className="space-y-4">
                        {periodization.phases.map((phase, index) => (
                            <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-medium">{phase.name}</h4>
                                    <span className="text-gray-400 text-sm">
                                        Weeks {phase.startWeek}-{phase.endWeek} ({phase.weeks} weeks)
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{phase.description}</p>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Intensity: <span className="text-white">{phase.intensity}</span>
                                    </span>
                                    <span className="text-gray-400">
                                        Volume: <span className="text-white">{phase.volume}</span>
                                    </span>
                                    {phase.bryantMethods.length > 0 && (
                                        <span className="text-blue-400">
                                            Bryant: {phase.bryantMethods.join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Validation Results */}
            {validation.warnings.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Validation Warnings</h4>
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
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
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

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                    Previous: Assessment
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading || !validation.isValid}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Generating...' : 'Next: Exercise Selection'}
                </button>
            </div>
        </div>
    );
};

export default PeriodizationPlanning;
