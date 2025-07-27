/**
 * ImplementationTracking.jsx - Implementation & Tracking Component
 * Final component in consolidated framework - handles program implementation,
 * progress tracking, analytics, and export functionality
 */

import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../../contexts/ProgramContext';
import { useImplementation } from '../../../../hooks/useImplementation';
import {
    generateWorkoutTemplates,
    createProgressionTracking,
    exportProgramData,
    analyzePerformanceMetrics
} from '../../../../utils/implementationUtils';

const ImplementationTracking = ({ onNext, onPrevious }) => {
    const { state, actions } = useProgramContext();
    const {
        generateProgram,
        saveToDatabase,
        exportProgram,
        trackProgress,
        loading
    } = useImplementation();

    // Implementation state
    const [implementation, setImplementation] = useState({
        // Program Generation
        programGeneration: {
            status: 'pending', // pending, generating, complete, error
            generatedProgram: null,
            workoutTemplates: [],
            progressionSchemes: {}
        },

        // Tracking Configuration
        trackingConfig: {
            metrics: {
                performance: true,
                volume: true,
                subjective: true,
                biometrics: false,
                bryantSpecific: false
            },
            frequency: 'weekly',
            platforms: {
                app: true,
                spreadsheet: false,
                manual: false
            },
            notifications: {
                enabled: true,
                frequency: 'daily',
                types: ['workout_reminder', 'progress_update']
            }
        },

        // Export Options
        exportOptions: {
            formats: {
                pdf: true,
                excel: false,
                json: false,
                app: true
            },
            included: {
                workouts: true,
                progressions: true,
                bryant_methods: true,
                rp_calculations: true,
                recovery_protocols: true
            }
        },

        // Analytics Dashboard
        analytics: {
            enabled: true,
            dashboards: {
                performance: true,
                volume: true,
                recovery: true,
                bryant_specific: false
            },
            reportFrequency: 'weekly'
        }
    });

    // Program summary for review
    const [programSummary, setProgramSummary] = useState({
        phases: [],
        totalWeeks: 0,
        exerciseCount: 0,
        bryantIntegration: false,
        rpIntegration: false,
        estimatedSessionDuration: 0,
        weeklyCommitment: 0
    });

    // Implementation validation
    const [validation, setValidation] = useState({
        isValid: false,
        readyForImplementation: false,
        missingComponents: [],
        warnings: [],
        recommendations: []
    });

    // Load all program data and generate summary
    useEffect(() => {
        generateProgramSummary();
        validateImplementationReadiness();
    }, [state]);

    // Generate comprehensive program summary
    const generateProgramSummary = () => {
        const phases = state.periodizationPlan?.phases || [];
        const bryantEnabled = state.periodizationPlan?.bryantIntegration?.enabled || false;
        const rpEnabled = state.volumeRecoveryPlan?.rpIntegration?.enabled || false;

        // Calculate exercise count
        const exerciseCount = state.exerciseSelection?.movementPatterns
            ? Object.values(state.exerciseSelection.movementPatterns)
                .reduce((sum, pattern) => sum + pattern.selected.length, 0)
            : 0;

        // Estimate session duration
        let sessionDuration = 45; // Base duration
        if (bryantEnabled) sessionDuration += 15; // Bryant methods add time
        if (exerciseCount > 8) sessionDuration += 15; // More exercises = more time

        // Calculate weekly commitment
        const sessionsPerWeek = phases.length > 0 ? 4 : 3; // Default to 4 if phases exist
        const weeklyCommitment = sessionDuration * sessionsPerWeek;

        setProgramSummary({
            phases,
            totalWeeks: state.periodizationPlan?.totalWeeks || 12,
            exerciseCount,
            bryantIntegration: bryantEnabled,
            rpIntegration: rpEnabled,
            estimatedSessionDuration: sessionDuration,
            weeklyCommitment
        });

        // Configure Bryant-specific tracking if enabled
        if (bryantEnabled) {
            setImplementation(prev => ({
                ...prev,
                trackingConfig: {
                    ...prev.trackingConfig,
                    metrics: {
                        ...prev.trackingConfig.metrics,
                        bryantSpecific: true
                    }
                },
                analytics: {
                    ...prev.analytics,
                    dashboards: {
                        ...prev.analytics.dashboards,
                        bryant_specific: true
                    }
                }
            }));
        }
    };

    // Validate implementation readiness
    const validateImplementationReadiness = () => {
        const missingComponents = [];
        const warnings = [];
        const recommendations = [];

        // Check required components
        if (!state.assessmentData) {
            missingComponents.push('Assessment data');
        }

        if (!state.periodizationPlan?.phases?.length) {
            missingComponents.push('Periodization phases');
        }

        if (!state.exerciseSelection?.movementPatterns) {
            missingComponents.push('Exercise selection');
        }

        if (!state.volumeRecoveryPlan) {
            missingComponents.push('Volume and recovery plan');
        }

        // PHA screening check
        if (state.assessmentData?.phaScreening?.cleared === false) {
            warnings.push('PHA screening indicated medical consultation required');
            warnings.push('Implement modified protocols until medical clearance');
        }

        // Bryant method warnings
        if (state.periodizationPlan?.bryantIntegration?.enabled) {
            const bryantMethods = state.periodizationPlan.bryantIntegration.methods;

            if (bryantMethods.some(m => m.method === 'clusterSets')) {
                recommendations.push('Monitor fatigue closely during cluster set phases');
                recommendations.push('Ensure adequate rest periods between cluster sets (15s intra, 3+ min inter)');
            }

            if (bryantMethods.some(m => m.method === 'strongmanEvents')) {
                recommendations.push('Progress strongman events gradually to prevent injury');
                recommendations.push('Focus on technique before increasing intensity');
            }
        }

        // RP volume warnings
        if (state.volumeRecoveryPlan?.validation?.warnings?.length > 0) {
            warnings.push(...state.volumeRecoveryPlan.validation.warnings);
        }

        // Implementation recommendations
        recommendations.push('Start with 80% of calculated weights for first week');
        recommendations.push('Track subjective fatigue and adjust volume accordingly');
        recommendations.push('Take progress photos and measurements weekly');

        const isValid = missingComponents.length === 0;
        const readyForImplementation = isValid && warnings.filter(w => w.includes('medical')).length === 0;

        setValidation({
            isValid,
            readyForImplementation,
            missingComponents,
            warnings,
            recommendations
        });
    };

    // Generate final program
    const handleGenerateProgram = async () => {
        try {
            setImplementation(prev => ({
                ...prev,
                programGeneration: {
                    ...prev.programGeneration,
                    status: 'generating'
                }
            }));

            // Compile all program data
            const programData = {
                assessment: state.assessmentData,
                periodization: state.periodizationPlan,
                exercises: state.exerciseSelection,
                volumeRecovery: state.volumeRecoveryPlan,
                implementation: implementation,
                generatedAt: new Date().toISOString(),
                version: '1.0'
            };

            // Generate workout templates
            const workoutTemplates = await generateWorkoutTemplates(programData);

            // Create progression tracking schemes
            const progressionSchemes = await createProgressionTracking(programData);

            setImplementation(prev => ({
                ...prev,
                programGeneration: {
                    ...prev.programGeneration,
                    status: 'complete',
                    generatedProgram: programData,
                    workoutTemplates,
                    progressionSchemes
                }
            }));

            // Save to context
            actions.setGeneratedProgram({
                ...programData,
                workoutTemplates,
                progressionSchemes
            });

        } catch (error) {
            console.error('Error generating program:', error);
            setImplementation(prev => ({
                ...prev,
                programGeneration: {
                    ...prev.programGeneration,
                    status: 'error'
                }
            }));
            actions.setError('Failed to generate program');
        }
    };

    // Handle export
    const handleExport = async (format) => {
        try {
            const programData = implementation.programGeneration.generatedProgram;
            if (!programData) {
                actions.setError('No program generated to export');
                return;
            }

            await exportProgram(programData, format, implementation.exportOptions);
            actions.setMessage(`Program exported successfully as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export error:', error);
            actions.setError(`Failed to export program as ${format}`);
        }
    };

    // Handle tracking configuration changes
    const handleTrackingConfigChange = (section, field, value) => {
        setImplementation(prev => ({
            ...prev,
            trackingConfig: {
                ...prev.trackingConfig,
                [section]: {
                    ...prev.trackingConfig[section],
                    [field]: value
                }
            }
        }));
    };

    // Handle export option changes
    const handleExportOptionChange = (section, field, value) => {
        setImplementation(prev => ({
            ...prev,
            exportOptions: {
                ...prev.exportOptions,
                [section]: {
                    ...prev.exportOptions[section],
                    [field]: value
                }
            }
        }));
    };

    // Save final implementation
    const handleNext = async () => {
        try {
            actions.setLoading(true);

            // Generate program if not already done
            if (implementation.programGeneration.status !== 'complete') {
                await handleGenerateProgram();
            }

            // Final validation
            if (!validation.readyForImplementation) {
                actions.setError('Program not ready for implementation - please address warnings');
                return;
            }

            // Save complete program to database if available
            if (saveToDatabase) {
                await saveToDatabase({
                    ...implementation.programGeneration.generatedProgram,
                    trackingConfig: implementation.trackingConfig,
                    exportOptions: implementation.exportOptions,
                    analytics: implementation.analytics
                });
            }

            // Mark program as complete
            actions.setProgramComplete(true);

            // Navigate to final step or dashboard
            if (onNext) {
                onNext();
            } else {
                actions.setMessage('Program implementation complete! Ready to begin training.');
            }

        } catch (error) {
            console.error('Error completing implementation:', error);
            actions.setError('Failed to complete program implementation');
        } finally {
            actions.setLoading(false);
        }
    };

    return (
        <div className="implementation-tracking-container space-y-8 p-6">
            {/* Header */}
            <div className="text-center border-b border-gray-600 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Implementation & Tracking</h2>
                <p className="text-gray-400">
                    Finalize your program, configure tracking, and begin implementation
                </p>
            </div>

            {/* Program Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Program Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Overview Stats */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Overview</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Duration:</span>
                                <span className="text-white">{programSummary.totalWeeks} weeks</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Phases:</span>
                                <span className="text-white">{programSummary.phases.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Exercises:</span>
                                <span className="text-white">{programSummary.exerciseCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Session Duration:</span>
                                <span className="text-white">{programSummary.estimatedSessionDuration} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Weekly Commitment:</span>
                                <span className="text-white">{Math.round(programSummary.weeklyCommitment / 60)}h {programSummary.weeklyCommitment % 60}m</span>
                            </div>
                        </div>
                    </div>

                    {/* Integration Features */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Integrations</h4>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className={`mr-2 ${programSummary.bryantIntegration ? 'text-green-400' : 'text-gray-500'}`}>
                                    {programSummary.bryantIntegration ? '✓' : '○'}
                                </span>
                                <span className="text-gray-300">Bryant Periodization</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${programSummary.rpIntegration ? 'text-green-400' : 'text-gray-500'}`}>
                                    {programSummary.rpIntegration ? '✓' : '○'}
                                </span>
                                <span className="text-gray-300">RP Volume Landmarks</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${state.assessmentData?.phaScreening?.cleared ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {state.assessmentData?.phaScreening?.cleared ? '✓' : '⚠'}
                                </span>
                                <span className="text-gray-300">PHA Screening</span>
                            </div>
                        </div>
                    </div>

                    {/* Phase Breakdown */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Phases</h4>
                        <div className="space-y-2 text-sm">
                            {programSummary.phases.slice(0, 4).map((phase, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span className="text-gray-400">{phase.name}:</span>
                                    <span className="text-white">{phase.weeks}w</span>
                                </div>
                            ))}
                            {programSummary.phases.length > 4 && (
                                <div className="text-gray-500 text-xs">
                                    +{programSummary.phases.length - 4} more phases
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Program Generation */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">⚙️</span>
                    Program Generation
                </h3>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-gray-300">
                            Generate your complete training program with all integrated methods
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            Status: <span className="capitalize">{implementation.programGeneration.status}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleGenerateProgram}
                        disabled={!validation.isValid || implementation.programGeneration.status === 'generating'}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {implementation.programGeneration.status === 'generating' ? 'Generating...' : 'Generate Program'}
                    </button>
                </div>

                {implementation.programGeneration.status === 'complete' && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                        <div className="flex items-center mb-2">
                            <span className="mr-2 text-green-400">✓</span>
                            <span className="text-green-400 font-semibold">Program Generated Successfully</span>
                        </div>
                        <div className="text-green-300 text-sm">
                            <div>• {implementation.programGeneration.workoutTemplates.length} workout templates created</div>
                            <div>• Progression schemes configured</div>
                            <div>• Bryant methods integrated</div>
                            <div>• RP volume landmarks applied</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tracking Configuration */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Tracking Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metrics to Track */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Metrics to Track</h4>
                        <div className="space-y-2">
                            {Object.entries(implementation.trackingConfig.metrics).map(([metric, enabled]) => (
                                <label key={metric} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => handleTrackingConfigChange('metrics', metric, e.target.checked)}
                                        className="mr-3"
                                    />
                                    <span className="text-gray-300 capitalize">
                                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tracking Platforms */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Tracking Platforms</h4>
                        <div className="space-y-2">
                            {Object.entries(implementation.trackingConfig.platforms).map(([platform, enabled]) => (
                                <label key={platform} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => handleTrackingConfigChange('platforms', platform, e.target.checked)}
                                        className="mr-3"
                                    />
                                    <span className="text-gray-300 capitalize">{platform}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-300 mb-1">Tracking Frequency</label>
                            <select
                                value={implementation.trackingConfig.frequency}
                                onChange={(e) => handleTrackingConfigChange('frequency', '', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📤</span>
                    Export Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Export Formats */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Export Formats</h4>
                        <div className="space-y-2 mb-4">
                            {Object.entries(implementation.exportOptions.formats).map(([format, enabled]) => (
                                <label key={format} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => handleExportOptionChange('formats', format, e.target.checked)}
                                        className="mr-3"
                                    />
                                    <span className="text-gray-300 uppercase">{format}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {Object.entries(implementation.exportOptions.formats)
                                .filter(([_, enabled]) => enabled)
                                .map(([format, _]) => (
                                    <button
                                        key={format}
                                        onClick={() => handleExport(format)}
                                        disabled={implementation.programGeneration.status !== 'complete'}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Export {format.toUpperCase()}
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    {/* What to Include */}
                    <div className="bg-gray-900/50 rounded p-4">
                        <h4 className="text-white font-medium mb-3">Include in Export</h4>
                        <div className="space-y-2">
                            {Object.entries(implementation.exportOptions.included).map(([item, enabled]) => (
                                <label key={item} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => handleExportOptionChange('included', item, e.target.checked)}
                                        className="mr-3"
                                    />
                                    <span className="text-gray-300 capitalize">
                                        {item.replace(/_/g, ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Results */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">✅</span>
                    Implementation Readiness
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className={`text-2xl font-bold ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                            {validation.isValid ? '✓' : '✗'}
                        </div>
                        <div className="text-gray-400 text-sm">Components Complete</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className={`text-2xl font-bold ${validation.readyForImplementation ? 'text-green-400' : 'text-yellow-400'}`}>
                            {validation.readyForImplementation ? '✓' : '⚠'}
                        </div>
                        <div className="text-gray-400 text-sm">Ready to Start</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-white">
                            {implementation.programGeneration.status === 'complete' ? '✓' : '○'}
                        </div>
                        <div className="text-gray-400 text-sm">Program Generated</div>
                    </div>
                </div>

                {validation.missingComponents.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
                        <h4 className="text-red-400 font-semibold mb-2">❌ Missing Components</h4>
                        <ul className="text-red-300 text-sm space-y-1">
                            {validation.missingComponents.map((component, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    {component}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
                        <h4 className="text-blue-400 font-semibold mb-2">💡 Implementation Recommendations</h4>
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
                    Previous: Volume & Recovery
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading || !validation.readyForImplementation || implementation.programGeneration.status !== 'complete'}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? 'Finalizing...' : 'Complete Implementation'}
                    <span className="ml-2">🚀</span>
                </button>
            </div>
        </div>
    );
};

export default ImplementationTracking;
