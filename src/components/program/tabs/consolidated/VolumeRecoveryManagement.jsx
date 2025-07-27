/**
 * VolumeRecoveryManagement.jsx - RP Volume & Recovery Management Component
 * Integrates Renaissance Periodization volume calculations with Bryant methods
 * Handles volume landmarks, recovery protocols, and deload strategies
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../../contexts/ProgramContext';
import { useRPCalculations } from '../../../../hooks/useRPCalculations';
import {
    calculateMEV,
    calculateMAV,
    calculateMRV,
    optimizeRecoveryProtocols,
    generateDeloadStrategies
} from '../../../../utils/rpVolumeCalculations';

const VolumeRecoveryManagement = ({ onNext, onPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        calculateVolumeProgression,
        validateRecoveryRequirements,
        loading
    } = useRPCalculations();

    // Volume management state
    const [volumeManagement, setVolumeManagement] = useState({
        // RP Volume Landmarks
        volumeLandmarks: {
            MEV: {}, // Minimum Effective Volume
            MAV: {}, // Maximum Adaptive Volume  
            MRV: {}  // Maximum Recoverable Volume
        },

        // Current Volume Allocation
        currentVolume: {
            weeklyVolume: 0,
            distributionByMuscle: {},
            distributionByMovement: {},
            bryantVolumeAdditions: {}
        },

        // Recovery Protocols
        recoveryProtocols: {
            sleepTargets: {
                duration: 8,
                quality: 'good',
                consistency: 'high'
            },
            nutritionProtocols: {
                protein: 1.6, // g/kg bodyweight
                calories: 'maintenance+200',
                hydration: 'adequate',
                micronutrients: 'complete'
            },
            activeRecovery: {
                frequency: 2, // sessions per week
                duration: 30, // minutes
                intensity: 'low',
                modalities: []
            },
            stressManagement: {
                techniques: [],
                frequency: 'daily',
                duration: 15
            }
        },

        // Deload Strategies
        deloadStrategies: {
            triggers: {
                performanceDecline: true,
                fatigue: true,
                timeBasedDeload: true,
                plannedDeload: true
            },
            deloadTypes: {
                volumeReduction: { enabled: true, reduction: 40 },
                intensityReduction: { enabled: false, reduction: 20 },
                completeRest: { enabled: false, duration: 3 }
            },
            frequency: 'every-4-weeks'
        },

        // Bryant Method Volume Adjustments
        bryantVolumeAdjustments: {
            phaCircuits: {
                volumeContribution: 'low',
                recoveryImpact: 'minimal',
                adjustmentFactor: 0.8
            },
            clusterSets: {
                volumeContribution: 'high',
                recoveryImpact: 'moderate',
                adjustmentFactor: 1.2
            },
            strongmanEvents: {
                volumeContribution: 'moderate',
                recoveryImpact: 'high',
                adjustmentFactor: 1.1
            }
        }
    });

    // Muscle group data for RP calculations
    const [muscleGroups, setMuscleGroups] = useState({
        chest: { mev: 8, mav: 14, mrv: 20, current: 0, priority: 'medium' },
        back: { mev: 10, mav: 16, mrv: 25, current: 0, priority: 'high' },
        shoulders: { mev: 8, mav: 14, mrv: 22, current: 0, priority: 'medium' },
        biceps: { mev: 6, mav: 10, mrv: 16, current: 0, priority: 'low' },
        triceps: { mev: 6, mav: 10, mrv: 18, current: 0, priority: 'low' },
        quads: { mev: 8, mav: 12, mrv: 20, current: 0, priority: 'high' },
        hamstrings: { mev: 6, mav: 10, mrv: 16, current: 0, priority: 'medium' },
        glutes: { mev: 6, mav: 8, mrv: 12, current: 0, priority: 'medium' },
        calves: { mev: 6, mav: 12, mrv: 20, current: 0, priority: 'low' },
        abs: { mev: 0, mav: 6, mrv: 12, current: 0, priority: 'medium' }
    });

    // Validation state
    const [validation, setValidation] = useState({
        isValid: false,
        warnings: [],
        recommendations: [],
        volumeBalance: 0,
        recoveryAdequacy: 0
    });

    // Load exercise selection and calculate initial volumes
    useEffect(() => {
        if (state.exerciseSelection?.movementPatterns) {
            calculateInitialVolumes();
        }

        // Adjust for goal priorities
        if (state.assessmentData?.goalPriorities) {
            adjustVolumeForGoals();
        }

        // Integrate Bryant method volume adjustments
        if (state.periodizationPlan?.bryantIntegration?.enabled) {
            applyBryantVolumeAdjustments();
        }
    }, [state.exerciseSelection, state.assessmentData, state.periodizationPlan]);

    // Calculate initial volume distribution based on exercise selection
    const calculateInitialVolumes = () => {
        const { movementPatterns } = state.exerciseSelection;
        const newVolumes = { ...muscleGroups };

        // Map movement patterns to muscle groups
        const movementToMuscleMap = {
            squat: ['quads', 'glutes'],
            hinge: ['hamstrings', 'glutes', 'back'],
            push: ['chest', 'shoulders', 'triceps'],
            pull: ['back', 'biceps'],
            carry: ['back', 'shoulders', 'abs'],
            rotate: ['abs']
        };

        // Calculate volume distribution
        Object.entries(movementPatterns).forEach(([pattern, data]) => {
            const muscleGroups = movementToMuscleMap[pattern] || [];
            const exerciseCount = data.selected.length;
            const volumePerExercise = 3; // Average sets per exercise

            muscleGroups.forEach(muscle => {
                if (newVolumes[muscle]) {
                    newVolumes[muscle].current += exerciseCount * volumePerExercise;
                }
            });
        });

        setMuscleGroups(newVolumes);
        updateVolumeManagement(newVolumes);
    };

    // Adjust volume based on goal priorities
    const adjustVolumeForGoals = () => {
        const { goalPriorities } = state.assessmentData;
        const adjustments = {};

        // Strength goals - increase compound movement volume
        if (goalPriorities.strength === 'high') {
            adjustments.back = 1.2;
            adjustments.quads = 1.2;
            adjustments.glutes = 1.1;
        }

        // Hypertrophy goals - balanced volume increase
        if (goalPriorities.hypertrophy === 'high') {
            Object.keys(muscleGroups).forEach(muscle => {
                adjustments[muscle] = 1.15;
            });
        }

        // Power goals - reduce volume, increase intensity focus
        if (goalPriorities.power === 'high') {
            Object.keys(muscleGroups).forEach(muscle => {
                adjustments[muscle] = 0.85;
            });
        }

        // Apply adjustments
        setMuscleGroups(prev => {
            const adjusted = { ...prev };
            Object.entries(adjustments).forEach(([muscle, factor]) => {
                if (adjusted[muscle]) {
                    adjusted[muscle].current = Math.round(adjusted[muscle].current * factor);
                }
            });
            return adjusted;
        });
    };

    // Apply Bryant method volume adjustments
    const applyBryantVolumeAdjustments = () => {
        const bryantMethods = state.periodizationPlan.bryantIntegration.methods.map(m => m.method);
        const adjustments = {};

        bryantMethods.forEach(method => {
            const config = volumeManagement.bryantVolumeAdjustments[method];
            if (config) {
                adjustments[method] = config.adjustmentFactor;
            }
        });

        // Apply volume adjustments
        setVolumeManagement(prev => ({
            ...prev,
            bryantVolumeAdditions: adjustments
        }));

        // Adjust muscle group volumes for Bryant methods
        if (bryantMethods.includes('clusterSets')) {
            // Cluster sets allow higher volume tolerance
            setMuscleGroups(prev => {
                const adjusted = { ...prev };
                ['chest', 'back', 'quads'].forEach(muscle => {
                    adjusted[muscle].mrv = Math.round(adjusted[muscle].mrv * 1.15);
                });
                return adjusted;
            });
        }
    };

    // Update volume management calculations
    const updateVolumeManagement = (muscles) => {
        const totalVolume = Object.values(muscles).reduce((sum, muscle) => sum + muscle.current, 0);

        const distributionByMuscle = {};
        Object.entries(muscles).forEach(([muscle, data]) => {
            distributionByMuscle[muscle] = {
                current: data.current,
                percentage: totalVolume > 0 ? ((data.current / totalVolume) * 100).toFixed(1) : 0,
                status: getVolumeStatus(data)
            };
        });

        setVolumeManagement(prev => ({
            ...prev,
            currentVolume: {
                ...prev.currentVolume,
                weeklyVolume: totalVolume,
                distributionByMuscle
            }
        }));

        validateVolumeDistribution(muscles, totalVolume);
    };

    // Get volume status relative to RP landmarks
    const getVolumeStatus = (muscleData) => {
        const { current, mev, mav, mrv } = muscleData;

        if (current < mev) return { status: 'under', color: 'red', label: 'Below MEV' };
        if (current <= mav) return { status: 'optimal', color: 'green', label: 'Optimal' };
        if (current <= mrv) return { status: 'high', color: 'yellow', label: 'High Volume' };
        return { status: 'excessive', color: 'red', label: 'Above MRV' };
    };

    // Validate volume distribution
    const validateVolumeDistribution = (muscles, totalVolume) => {
        const warnings = [];
        const recommendations = [];
        let volumeBalance = 0;
        let isValid = true;

        // Check individual muscle groups
        Object.entries(muscles).forEach(([muscle, data]) => {
            if (data.current < data.mev) {
                warnings.push(`${muscle.charAt(0).toUpperCase() + muscle.slice(1)} below MEV (${data.current}/${data.mev} sets)`);
                isValid = false;
            } else if (data.current > data.mrv) {
                warnings.push(`${muscle.charAt(0).toUpperCase() + muscle.slice(1)} above MRV (${data.current}/${data.mrv} sets)`);
                isValid = false;
            } else if (data.current >= data.mev && data.current <= data.mav) {
                volumeBalance += 20;
            } else {
                volumeBalance += 10;
            }
        });

        // Check total volume
        if (totalVolume < 50) {
            warnings.push('Total weekly volume may be insufficient for adaptation');
        } else if (totalVolume > 150) {
            warnings.push('Total weekly volume may exceed recovery capacity');
        }

        // RP-specific recommendations
        if (volumeBalance >= 160) {
            recommendations.push('Volume distribution optimal for RP progression');
        }

        // Bryant method recommendations
        const bryantMethods = state.periodizationPlan?.bryantIntegration?.methods || [];
        if (bryantMethods.length > 0) {
            bryantMethods.forEach(({ method }) => {
                if (method === 'clusterSets') {
                    recommendations.push('Cluster sets allow 15-20% higher volume tolerance');
                } else if (method === 'strongmanEvents') {
                    recommendations.push('Account for strongman event fatigue in weekly planning');
                }
            });
        }

        // Recovery adequacy assessment
        const recoveryAdequacy = assessRecoveryAdequacy();

        setValidation({
            isValid,
            warnings,
            recommendations,
            volumeBalance: Math.min(volumeBalance, 100),
            recoveryAdequacy
        });
    };

    // Assess recovery adequacy
    const assessRecoveryAdequacy = () => {
        const { recoveryProtocols } = volumeManagement;
        let score = 0;

        // Sleep assessment
        if (recoveryProtocols.sleepTargets.duration >= 7) score += 25;
        if (recoveryProtocols.sleepTargets.quality === 'good') score += 15;

        // Nutrition assessment
        if (recoveryProtocols.nutritionProtocols.protein >= 1.6) score += 20;
        if (recoveryProtocols.nutritionProtocols.calories === 'maintenance+200') score += 15;

        // Active recovery
        if (recoveryProtocols.activeRecovery.frequency >= 2) score += 15;

        // Stress management
        if (recoveryProtocols.stressManagement.techniques.length > 0) score += 10;

        return Math.min(score, 100);
    };

    // Handle muscle group volume adjustment
    const handleVolumeAdjustment = (muscle, newVolume) => {
        const volume = Math.max(0, parseInt(newVolume) || 0);
        setMuscleGroups(prev => ({
            ...prev,
            [muscle]: {
                ...prev[muscle],
                current: volume
            }
        }));
    };

    // Handle recovery protocol updates
    const handleRecoveryUpdate = (category, field, value) => {
        setVolumeManagement(prev => ({
            ...prev,
            recoveryProtocols: {
                ...prev.recoveryProtocols,
                [category]: {
                    ...prev.recoveryProtocols[category],
                    [field]: value
                }
            }
        }));
    };

    // Handle deload configuration
    const handleDeloadConfig = (type, config) => {
        setVolumeManagement(prev => ({
            ...prev,
            deloadStrategies: {
                ...prev.deloadStrategies,
                deloadTypes: {
                    ...prev.deloadStrategies.deloadTypes,
                    [type]: config
                }
            }
        }));
    };

    // Generate volume progression plan
    const generateVolumeProgression = () => {
        const phases = state.periodizationPlan?.phases || [];
        const progressions = [];

        phases.forEach((phase, index) => {
            const baseVolume = Object.values(muscleGroups).reduce((sum, muscle) => sum + muscle.current, 0);
            let phaseVolume;

            switch (phase.focus) {
                case 'movement_quality':
                    phaseVolume = Math.round(baseVolume * 0.7);
                    break;
                case 'muscle_growth':
                    phaseVolume = Math.round(baseVolume * 1.2);
                    break;
                case 'maximal_strength':
                    phaseVolume = Math.round(baseVolume * 0.9);
                    break;
                case 'power_development':
                    phaseVolume = Math.round(baseVolume * 0.6);
                    break;
                default:
                    phaseVolume = baseVolume;
            }

            progressions.push({
                phase: phase.name,
                weeks: `${phase.startWeek}-${phase.endWeek}`,
                volume: phaseVolume,
                progression: calculatePhaseProgression(phase, phaseVolume)
            });
        });

        return progressions;
    };

    // Calculate weekly progression within phase
    const calculatePhaseProgression = (phase, startVolume) => {
        const weeklyProgression = [];
        const weeks = phase.endWeek - phase.startWeek + 1;

        for (let week = 1; week <= weeks; week++) {
            let weekVolume;

            if (week === weeks && weeks >= 4) {
                // Deload week
                weekVolume = Math.round(startVolume * 0.6);
            } else {
                // Progressive increase
                const progressionFactor = 1 + ((week - 1) * 0.05);
                weekVolume = Math.round(startVolume * progressionFactor);
            }

            weeklyProgression.push({
                week: phase.startWeek + week - 1,
                volume: weekVolume,
                intensity: phase.intensity,
                focus: phase.focus
            });
        }

        return weeklyProgression;
    };

    // Save and proceed
    const handleNext = async () => {
        try {
            actions.setLoading(true);

            // Generate final volume and recovery plan
            const finalPlan = {
                ...volumeManagement,
                muscleGroupVolumes: muscleGroups,
                validation,
                volumeProgression: generateVolumeProgression(),
                generatedAt: new Date().toISOString(),
                rpIntegration: {
                    enabled: true,
                    volumeLandmarks: {
                        totalMEV: Object.values(muscleGroups).reduce((sum, m) => sum + m.mev, 0),
                        totalMAV: Object.values(muscleGroups).reduce((sum, m) => sum + m.mav, 0),
                        totalMRV: Object.values(muscleGroups).reduce((sum, m) => sum + m.mrv, 0)
                    }
                }
            };

            // Save to context
            actions.setVolumeRecoveryPlan(finalPlan);

            onNext();
        } catch (error) {
            console.error('Error saving volume/recovery plan:', error);
            actions.setError('Failed to save volume and recovery plan');
        } finally {
            actions.setLoading(false);
        }
    };

    // Re-calculate when muscle groups change
    useEffect(() => {
        updateVolumeManagement(muscleGroups);
    }, [muscleGroups]);

    return (
        <div className="volume-recovery-container space-y-8 p-6">
            {/* Header */}
            <div className="text-center border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Volume & Recovery Management</h2>
                <p className="text-gray-400">
                    Configure volume using RP landmarks and optimize recovery protocols
                </p>
            </div>

            {/* Volume Overview */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Volume Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">{volumeManagement.currentVolume.weeklyVolume}</div>
                        <div className="text-gray-400 text-sm">Weekly Sets</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{validation.volumeBalance}%</div>
                        <div className="text-gray-400 text-sm">Volume Balance</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{validation.recoveryAdequacy}%</div>
                        <div className="text-gray-400 text-sm">Recovery Score</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className={`text-2xl font-bold ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                            {validation.isValid ? '✓' : '⚠'}
                        </div>
                        <div className="text-gray-400 text-sm">Status</div>
                    </div>
                </div>
            </div>

            {/* RP Volume Landmarks */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    RP Volume Landmarks (sets per week)
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="text-left text-white font-medium py-2">Muscle Group</th>
                                <th className="text-center text-gray-400 py-2">MEV</th>
                                <th className="text-center text-gray-400 py-2">Current</th>
                                <th className="text-center text-gray-400 py-2">MAV</th>
                                <th className="text-center text-gray-400 py-2">MRV</th>
                                <th className="text-center text-gray-400 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(muscleGroups).map(([muscle, data]) => {
                                const status = getVolumeStatus(data);
                                return (
                                    <tr key={muscle} className="border-b border-gray-700">
                                        <td className="py-3">
                                            <span className="text-white font-medium capitalize">{muscle}</span>
                                        </td>
                                        <td className="text-center text-gray-400">{data.mev}</td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="30"
                                                value={data.current}
                                                onChange={(e) => handleVolumeAdjustment(muscle, e.target.value)}
                                                className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-center"
                                            />
                                        </td>
                                        <td className="text-center text-gray-400">{data.mav}</td>
                                        <td className="text-center text-gray-400">{data.mrv}</td>
                                        <td className="text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                    status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                    <div className="flex justify-between">
                        <span>MEV: Minimum Effective Volume</span>
                        <span>MAV: Maximum Adaptive Volume</span>
                        <span>MRV: Maximum Recoverable Volume</span>
                    </div>
                </div>
            </div>

            {/* Recovery Protocols */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">🛌</span>
                    Recovery Protocols
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sleep Targets */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Sleep Targets</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Duration (hours)</label>
                                <input
                                    type="number"
                                    min="6"
                                    max="10"
                                    step="0.5"
                                    value={volumeManagement.recoveryProtocols.sleepTargets.duration}
                                    onChange={(e) => handleRecoveryUpdate('sleepTargets', 'duration', parseFloat(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Quality</label>
                                <select
                                    value={volumeManagement.recoveryProtocols.sleepTargets.quality}
                                    onChange={(e) => handleRecoveryUpdate('sleepTargets', 'quality', e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                >
                                    <option value="poor">Poor</option>
                                    <option value="fair">Fair</option>
                                    <option value="good">Good</option>
                                    <option value="excellent">Excellent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Protocols */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Nutrition Protocols</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Protein (g/kg bodyweight)</label>
                                <input
                                    type="number"
                                    min="1.0"
                                    max="3.0"
                                    step="0.1"
                                    value={volumeManagement.recoveryProtocols.nutritionProtocols.protein}
                                    onChange={(e) => handleRecoveryUpdate('nutritionProtocols', 'protein', parseFloat(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Caloric Intake</label>
                                <select
                                    value={volumeManagement.recoveryProtocols.nutritionProtocols.calories}
                                    onChange={(e) => handleRecoveryUpdate('nutritionProtocols', 'calories', e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                >
                                    <option value="maintenance-500">Deficit (-500)</option>
                                    <option value="maintenance-300">Deficit (-300)</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="maintenance+200">Surplus (+200)</option>
                                    <option value="maintenance+500">Surplus (+500)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Recovery */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Active Recovery</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Frequency (sessions/week)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="7"
                                    value={volumeManagement.recoveryProtocols.activeRecovery.frequency}
                                    onChange={(e) => handleRecoveryUpdate('activeRecovery', 'frequency', parseInt(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="15"
                                    max="90"
                                    value={volumeManagement.recoveryProtocols.activeRecovery.duration}
                                    onChange={(e) => handleRecoveryUpdate('activeRecovery', 'duration', parseInt(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stress Management */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Stress Management</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-gray-300 mb-1">Daily Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={volumeManagement.recoveryProtocols.stressManagement.duration}
                                    onChange={(e) => handleRecoveryUpdate('stressManagement', 'duration', parseInt(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deload Strategies */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">⚡</span>
                    Deload Strategies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(volumeManagement.deloadStrategies.deloadTypes).map(([type, config]) => (
                        <div key={type} className="bg-gray-900/50 rounded p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-medium capitalize">
                                    {type.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <input
                                    type="checkbox"
                                    checked={config.enabled}
                                    onChange={(e) => handleDeloadConfig(type, { ...config, enabled: e.target.checked })}
                                    className="rounded"
                                />
                            </div>

                            {config.enabled && (
                                <div className="space-y-2">
                                    {config.reduction !== undefined && (
                                        <div>
                                            <label className="block text-gray-300 mb-1 text-sm">Reduction (%)</label>
                                            <input
                                                type="number"
                                                min="20"
                                                max="70"
                                                value={config.reduction}
                                                onChange={(e) => handleDeloadConfig(type, { ...config, reduction: parseInt(e.target.value) })}
                                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                                            />
                                        </div>
                                    )}
                                    {config.duration !== undefined && (
                                        <div>
                                            <label className="block text-gray-300 mb-1 text-sm">Duration (days)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="7"
                                                value={config.duration}
                                                onChange={(e) => handleDeloadConfig(type, { ...config, duration: parseInt(e.target.value) })}
                                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Volume Progression Preview */}
            {state.periodizationPlan?.phases && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">📈</span>
                        Volume Progression Preview
                    </h3>

                    <div className="space-y-3">
                        {generateVolumeProgression().map((phase, idx) => (
                            <div key={idx} className="bg-gray-900/50 rounded p-3 flex justify-between items-center">
                                <div>
                                    <h4 className="text-white font-medium">{phase.phase}</h4>
                                    <p className="text-gray-400 text-sm">Weeks {phase.weeks}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-medium">{phase.volume} sets/week</div>
                                    <div className="text-gray-400 text-sm">
                                        {Math.round(((phase.volume - volumeManagement.currentVolume.weeklyVolume) / volumeManagement.currentVolume.weeklyVolume) * 100)}% change
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Validation Results */}
            {(validation.warnings.length > 0 || validation.recommendations.length > 0) && (
                <div className="space-y-4">
                    {validation.warnings.length > 0 && (
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Volume Warnings</h4>
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
                            <h4 className="text-blue-400 font-semibold mb-2">💡 RP Recommendations</h4>
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
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                    Previous: Exercise Selection
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading || !validation.isValid}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Calculating...' : 'Next: Implementation'}
                </button>
            </div>
        </div>
    );
};

export default VolumeRecoveryManagement;
