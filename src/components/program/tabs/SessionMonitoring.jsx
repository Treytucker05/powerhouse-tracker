import React, { useState } from 'react';
import { Activity, RotateCcw, CheckCircle, Monitor, Target, Heart } from 'lucide-react';

const SessionMonitoring = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [sessionStructure, setSessionStructure] = useState({
        warmupDuration: 15,
        mainWorkDuration: 45,
        cooldownDuration: 10,
        exerciseSelection: 'compound_focused',
        trainingMethods: ['linear_progression', 'rpe_autoregulation']
    });

    const [monitoringProtocols, setMonitoringProtocols] = useState({
        subjective: ['rpe', 'readiness_scale', 'sleep_quality'],
        objective: ['heart_rate_variability', 'jump_performance', 'velocity_tracking'],
        frequency: 'daily'
    });

    const [exerciseLibrary, setExerciseLibrary] = useState([
        {
            name: 'Squat',
            category: 'lower_body',
            type: 'compound',
            muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
            equipment: 'barbell'
        },
        {
            name: 'Deadlift',
            category: 'posterior_chain',
            type: 'compound',
            muscleGroups: ['hamstrings', 'glutes', 'erector_spinae'],
            equipment: 'barbell'
        },
        {
            name: 'Bench Press',
            category: 'upper_body',
            type: 'compound',
            muscleGroups: ['pectorals', 'anterior_deltoids', 'triceps'],
            equipment: 'barbell'
        }
    ]);

    const trainingMethods = [
        {
            id: 'linear_progression',
            name: 'Linear Progression',
            description: 'Gradual increase in weight, sets, or reps over time',
            application: 'Beginner to intermediate strength development',
            example: 'Week 1: 3×8 @ 70%, Week 2: 3×8 @ 72.5%, Week 3: 3×8 @ 75%'
        },
        {
            id: 'rpe_autoregulation',
            name: 'RPE Autoregulation',
            description: 'Adjust loads based on perceived exertion ratings',
            application: 'Intermediate to advanced, fatigue management',
            example: 'Work up to RPE 8 for prescribed reps, adjust load daily'
        },
        {
            id: 'percentage_based',
            name: 'Percentage-Based',
            description: 'Loads prescribed as percentage of 1RM',
            application: 'Intermediate to advanced, precise load prescription',
            example: '5×3 @ 85% 1RM, test 1RM every 4-6 weeks'
        },
        {
            id: 'velocity_based',
            name: 'Velocity-Based Training',
            description: 'Use bar velocity to guide load selection',
            application: 'Advanced athletes, power development',
            example: 'Perform sets until velocity drops 10% from best set'
        },
        {
            id: 'cluster_training',
            name: 'Cluster Training',
            description: 'Rest periods within sets to maintain power output',
            application: 'Power and strength development',
            example: '5×(3×1) with 15s intra-set rest, 3min between clusters'
        },
        {
            id: 'accommodating_resistance',
            name: 'Accommodating Resistance',
            description: 'Variable resistance using bands or chains',
            application: 'Advanced strength and power development',
            example: 'Squat with 20% band tension at top, 60% straight weight'
        }
    ];

    const monitoringTools = {
        subjective: [
            { id: 'rpe', name: 'Rate of Perceived Exertion (RPE)', scale: '1-10', description: 'Overall session difficulty' },
            { id: 'readiness_scale', name: 'Readiness Scale', scale: '1-10', description: 'Feeling of preparedness' },
            { id: 'sleep_quality', name: 'Sleep Quality', scale: '1-5', description: 'Quality of previous night sleep' },
            { id: 'motivation', name: 'Motivation Level', scale: '1-10', description: 'Desire to train' },
            { id: 'stress_level', name: 'Stress Level', scale: '1-10', description: 'General life stress' }
        ],
        objective: [
            { id: 'heart_rate_variability', name: 'Heart Rate Variability (HRV)', unit: 'ms', description: 'Autonomic nervous system status' },
            { id: 'resting_heart_rate', name: 'Resting Heart Rate', unit: 'bpm', description: 'Morning resting HR' },
            { id: 'jump_performance', name: 'Countermovement Jump', unit: 'cm', description: 'Neuromuscular readiness' },
            { id: 'velocity_tracking', name: 'Bar Velocity', unit: 'm/s', description: 'Movement quality and fatigue' },
            { id: 'grip_strength', name: 'Grip Strength', unit: 'kg', description: 'General strength indicator' }
        ]
    };

    const sessionTemplate = {
        warmup: [
            'General movement preparation (5-8 minutes)',
            'Dynamic stretching and mobility',
            'Movement pattern rehearsal',
            'Activation exercises',
            'Ramping sets with main exercises'
        ],
        mainWork: [
            'Primary compound movements',
            'Secondary/accessory exercises',
            'Isolation work (if applicable)',
            'Power/explosive work (if applicable)'
        ],
        cooldown: [
            'Static stretching',
            'Foam rolling/self-massage',
            'Breathing exercises',
            'Recovery modalities'
        ]
    };

    const toggleTrainingMethod = (methodId) => {
        setSessionStructure(prev => ({
            ...prev,
            trainingMethods: prev.trainingMethods.includes(methodId)
                ? prev.trainingMethods.filter(id => id !== methodId)
                : [...prev.trainingMethods, methodId]
        }));
    };

    const toggleMonitoringTool = (category, toolId) => {
        setMonitoringProtocols(prev => ({
            ...prev,
            [category]: prev[category].includes(toolId)
                ? prev[category].filter(id => id !== toolId)
                : [...prev[category], toolId]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Session Structure */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Session Structure</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Warm-up</h4>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
                            <input
                                type="number"
                                min="5"
                                max="30"
                                className="w-20 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                value={sessionStructure.warmupDuration}
                                onChange={(e) => setSessionStructure(prev => ({ ...prev, warmupDuration: parseInt(e.target.value) }))}
                            />
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                            {sessionTemplate.warmup.map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Main Work</h4>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
                            <input
                                type="number"
                                min="20"
                                max="90"
                                className="w-20 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                value={sessionStructure.mainWorkDuration}
                                onChange={(e) => setSessionStructure(prev => ({ ...prev, mainWorkDuration: parseInt(e.target.value) }))}
                            />
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                            {sessionTemplate.mainWork.map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Cool-down</h4>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
                            <input
                                type="number"
                                min="5"
                                max="20"
                                className="w-20 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                value={sessionStructure.cooldownDuration}
                                onChange={(e) => setSessionStructure(prev => ({ ...prev, cooldownDuration: parseInt(e.target.value) }))}
                            />
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1">
                            {sessionTemplate.cooldown.map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-4 text-center text-gray-400">
                    <strong>Total Session Time: {sessionStructure.warmupDuration + sessionStructure.mainWorkDuration + sessionStructure.cooldownDuration} minutes</strong>
                </div>
            </div>

            {/* Training Methods */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Training Methods</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {trainingMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${sessionStructure.trainingMethods.includes(method.id)
                                    ? 'border-blue-500 bg-blue-900/30'
                                    : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => toggleTrainingMethod(method.id)}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-white">{method.name}</h4>
                                {sessionStructure.trainingMethods.includes(method.id) && (
                                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{method.description}</p>
                            <div className="text-xs text-gray-400">
                                <p><strong>Application:</strong> {method.application}</p>
                                <p><strong>Example:</strong> {method.example}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monitoring Protocols */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Monitor className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Monitoring Protocols</h3>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monitoring Frequency</label>
                    <select
                        className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        value={monitoringProtocols.frequency}
                        onChange={(e) => setMonitoringProtocols(prev => ({ ...prev, frequency: e.target.value }))}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi_weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subjective Monitoring */}
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Subjective Monitoring</h4>
                        <div className="space-y-2">
                            {monitoringTools.subjective.map((tool) => (
                                <div
                                    key={tool.id}
                                    className={`p-3 border rounded cursor-pointer transition-colors ${monitoringProtocols.subjective.includes(tool.id)
                                            ? 'border-green-500 bg-green-900/30'
                                            : 'border-gray-500 hover:border-gray-400'
                                        }`}
                                    onClick={() => toggleMonitoringTool('subjective', tool.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h5 className="text-sm font-medium text-white">{tool.name}</h5>
                                            <p className="text-xs text-gray-300">{tool.description}</p>
                                            <p className="text-xs text-gray-400">Scale: {tool.scale}</p>
                                        </div>
                                        {monitoringProtocols.subjective.includes(tool.id) && (
                                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Objective Monitoring */}
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-3">Objective Monitoring</h4>
                        <div className="space-y-2">
                            {monitoringTools.objective.map((tool) => (
                                <div
                                    key={tool.id}
                                    className={`p-3 border rounded cursor-pointer transition-colors ${monitoringProtocols.objective.includes(tool.id)
                                            ? 'border-blue-500 bg-blue-900/30'
                                            : 'border-gray-500 hover:border-gray-400'
                                        }`}
                                    onClick={() => toggleMonitoringTool('objective', tool.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h5 className="text-sm font-medium text-white">{tool.name}</h5>
                                            <p className="text-xs text-gray-300">{tool.description}</p>
                                            <p className="text-xs text-gray-400">Unit: {tool.unit}</p>
                                        </div>
                                        {monitoringProtocols.objective.includes(tool.id) && (
                                            <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fatigue Management */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Fatigue Management Guidelines</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-red-400 mb-2">Warning Signs of Overtraining</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Decreased performance despite consistent training</li>
                            <li>• Elevated resting heart rate (>5-10 bpm above baseline)</li>
                            <li>• Poor sleep quality or insomnia</li>
                            <li>• Decreased motivation to train</li>
                            <li>• Increased susceptibility to illness</li>
                            <li>• Persistent muscle soreness</li>
                            <li>• Mood disturbances (irritability, depression)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-green-400 mb-2">Recovery Strategies</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Planned deload weeks (reduce volume 40-60%)</li>
                            <li>• Adequate sleep (7-9 hours per night)</li>
                            <li>• Proper nutrition and hydration</li>
                            <li>• Active recovery (light movement, walking)</li>
                            <li>• Stress management techniques</li>
                            <li>• Regular massage or self-massage</li>
                            <li>• Monitor and adjust training based on readiness</li>
                        </ul>
                    </div>
                </div>
            </div>

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
                        Step 6 of 7: Sessions and Monitoring
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

export default SessionMonitoring;
