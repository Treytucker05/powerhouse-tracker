import React, { useState, useEffect } from 'react';
import { Activity, Heart, Moon, Utensils, Brain, CheckCircle, Info, AlertTriangle, Clock, Zap, Target } from 'lucide-react';

export default function Step17ConditioningRecovery({ data, updateData }) {
    const [conditioningConfig, setConditioningConfig] = useState(data.conditioningConfig || {
        frequency: 2, // minimum 2x per week
        primaryMethod: 'prowler', // prowler, hill_sprints, bike_intervals, rowing
        highIntensity: {
            enabled: true,
            duration: 15,
            exercises: []
        },
        lowIntensity: {
            enabled: true,
            duration: 30,
            exercises: []
        }
    });

    const [recoveryConfig, setRecoveryConfig] = useState(data.recoveryConfig || {
        sleep: {
            targetHours: 8,
            priority: 'high'
        },
        nutrition: {
            proteinFocus: true,
            calorieGoal: 'maintenance', // deficit, maintenance, surplus
            hydration: true
        },
        stressManagement: {
            techniques: [],
            priority: 'medium'
        },
        softTissue: {
            methods: [],
            frequency: 3
        }
    });

    // Normalize nested structures if missing from loaded data
    useEffect(() => {
        setConditioningConfig(prev => {
            const hi = prev?.highIntensity ?? { enabled: true, duration: 15, exercises: [] };
            const li = prev?.lowIntensity ?? { enabled: true, duration: 30, exercises: [] };
            const freq = Math.max(2, Number(prev?.frequency ?? 2));
            const method = prev?.primaryMethod || 'prowler';
            const next = { ...prev, highIntensity: hi, lowIntensity: li, frequency: freq, primaryMethod: method };
            if (JSON.stringify(next) !== JSON.stringify(prev)) {
                updateStepData({ conditioningConfig: next });
            }
            return next;
        });
        setRecoveryConfig(prev => {
            const sleep = prev?.sleep ?? { targetHours: 8, priority: 'high' };
            const stress = prev?.stressManagement ?? { techniques: [], priority: 'medium' };
            const soft = prev?.softTissue ?? { methods: [], frequency: 3 };
            const nutrition = prev?.nutrition ?? { proteinFocus: true, calorieGoal: 'maintenance', hydration: true };
            const next = { ...prev, sleep, stressManagement: stress, softTissue: soft, nutrition };
            if (JSON.stringify(next) !== JSON.stringify(prev)) {
                updateStepData({ recoveryConfig: next });
            }
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Conditioning equipment and methods
    const conditioningMethods = {
        prowler: {
            name: 'Prowler/Sled Work',
            description: 'Primary conditioning method recommended by Wendler',
            equipment: 'Prowler sled or weight sled',
            exercises: ['Prowler pushes', 'Prowler pulls', 'Sled drags', 'Farmers walks with sled'],
            intensity: 'Variable - can be high or low intensity'
        },
        hill_sprints: {
            name: 'Hill Sprints',
            description: 'Minimal equipment alternative for high intensity',
            equipment: 'Hill or incline (6-15% grade)',
            exercises: ['Sprint uphill', 'Walk down recovery', 'Tempo runs uphill'],
            intensity: 'High intensity intervals'
        },
        bike_intervals: {
            name: 'Bike Intervals',
            description: 'Bike-based high intensity work',
            equipment: 'Stationary bike or road bike',
            exercises: ['Tabata intervals', 'Sprint intervals', 'Threshold intervals'],
            intensity: 'High intensity intervals'
        },
        rowing: {
            name: 'Rowing',
            description: 'Full-body conditioning option',
            equipment: 'Rowing machine',
            exercises: ['500m intervals', '2k time trial', 'Steady state rowing'],
            intensity: 'Variable intensity'
        }
    };

    // High intensity conditioning options
    const highIntensityOptions = [
        'Prowler pushes (15-20 minutes)',
        'Hill sprints (10-15 minutes)',
        'Bike intervals (15-20 minutes)',
        'Rower intervals (15-20 minutes)',
        'Kettlebell swings (15 minutes)',
        'Burpees (10-15 minutes)',
        'Mountain climbers (10 minutes)',
        'Battle ropes (15 minutes)'
    ];

    // Low intensity conditioning options
    const lowIntensityOptions = [
        'Walking (30-60 minutes)',
        'Light cycling (30-45 minutes)',
        'Swimming (30-40 minutes)',
        'Easy rowing (30-40 minutes)',
        'Yoga flow (30-45 minutes)',
        'Tai chi (30 minutes)',
        'Light hiking (45-60 minutes)',
        'Stretching routine (20-30 minutes)'
    ];

    // Stress management techniques
    const stressManagementTechniques = [
        { name: 'Deep breathing exercises', description: '5-10 minutes daily' },
        { name: 'Meditation', description: '10-20 minutes daily' },
        { name: 'Journaling', description: '10 minutes before bed' },
        { name: 'Time management', description: 'Planning and prioritization' },
        { name: 'Work-life boundaries', description: 'Clear separation of work/personal time' },
        { name: 'Social support', description: 'Regular contact with friends/family' }
    ];

    // Soft tissue methods
    const softTissueMethods = [
        { name: 'Foam rolling', description: '10-15 minutes post-workout' },
        { name: 'Massage therapy', description: 'Weekly or bi-weekly sessions' },
        { name: 'Stretching routine', description: '15-20 minutes daily' },
        { name: 'Lacrosse ball work', description: 'Target specific tight spots' },
        { name: 'Mobility drills', description: '10 minutes pre-workout' },
        { name: 'Sauna/heat therapy', description: '15-20 minutes post-workout' }
    ];

    const handleConditioningMethodChange = (method) => {
        const next = { ...conditioningConfig, primaryMethod: method };
        setConditioningConfig(next);
        updateStepData({ conditioningConfig: next });
    };

    const handleFrequencyChange = (frequency) => {
        const next = { ...conditioningConfig, frequency };
        setConditioningConfig(next);
        updateStepData({ conditioningConfig: next });
    };

    const handleHighIntensityToggle = (exercise) => {
        const current = (conditioningConfig.highIntensity?.exercises) || [];
        const isSelected = current.includes(exercise);

        const newExercises = isSelected
            ? current.filter(ex => ex !== exercise)
            : [...current, exercise];

        const baseHi = conditioningConfig.highIntensity || { enabled: true, duration: 15, exercises: [] };
        const next = {
            ...conditioningConfig,
            highIntensity: {
                ...baseHi,
                exercises: newExercises
            }
        };
        setConditioningConfig(next);
        updateStepData({ conditioningConfig: next });
    };

    const handleLowIntensityToggle = (exercise) => {
        const current = (conditioningConfig.lowIntensity?.exercises) || [];
        const isSelected = current.includes(exercise);

        const newExercises = isSelected
            ? current.filter(ex => ex !== exercise)
            : [...current, exercise];

        const baseLi = conditioningConfig.lowIntensity || { enabled: true, duration: 30, exercises: [] };
        const next = {
            ...conditioningConfig,
            lowIntensity: {
                ...baseLi,
                exercises: newExercises
            }
        };
        setConditioningConfig(next);
        updateStepData({ conditioningConfig: next });
    };

    const handleStressManagementToggle = (technique) => {
        const current = (recoveryConfig.stressManagement?.techniques) || [];
        const isSelected = current.includes(technique);

        const newTechniques = isSelected
            ? current.filter(t => t !== technique)
            : [...current, technique];

        const next = {
            ...recoveryConfig,
            stressManagement: {
                ...recoveryConfig.stressManagement,
                techniques: newTechniques
            }
        };
        setRecoveryConfig(next);
        updateStepData({ recoveryConfig: next });
    };

    const handleSoftTissueToggle = (method) => {
        const current = (recoveryConfig.softTissue?.methods) || [];
        const isSelected = current.includes(method);

        const newMethods = isSelected
            ? current.filter(m => m !== method)
            : [...current, method];

        const next = {
            ...recoveryConfig,
            softTissue: {
                ...recoveryConfig.softTissue,
                methods: newMethods
            }
        };
        setRecoveryConfig(next);
        updateStepData({ recoveryConfig: next });
    };

    const updateStepData = (updates) => {
        updateData({
            conditioningConfig,
            recoveryConfig,
            ...updates
        });
    };

    const isStepComplete = () => {
        const hiLen = (conditioningConfig.highIntensity?.exercises || []).length;
        const liLen = (conditioningConfig.lowIntensity?.exercises || []).length;
        const hasConditioning = (Number(conditioningConfig.frequency) >= 2) &&
            !!conditioningConfig.primaryMethod &&
            (hiLen > 0 || liLen > 0);

        const sleepTarget = Number(recoveryConfig.sleep?.targetHours ?? 0);
        const stressLen = (recoveryConfig.stressManagement?.techniques || []).length;
        const softLen = (recoveryConfig.softTissue?.methods || []).length;
        const hasRecovery = sleepTarget >= 7 && stressLen > 0 && softLen > 0;

        return hasConditioning && hasRecovery;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 17: Conditioning and Recovery Integration
                </h3>
                <p className="text-gray-400">
                    Essential conditioning work and recovery protocols to support your 5/3/1 training
                </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Conditioning & Recovery Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Conditioning minimum: 2× per week to maintain work capacity</li>
                            <li>• Prowler/sled work is the gold standard for 5/3/1 conditioning</li>
                            <li>• Recovery is not optional - it's where adaptation happens</li>
                            <li>• Sleep is the most important recovery tool you have</li>
                            <li>• Manage life stress to optimize training adaptations</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Conditioning Configuration */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-400" />
                    Conditioning Protocol
                </h4>

                {/* Frequency Selection */}
                <div className="mb-6">
                    <label className="block text-white font-medium mb-3">
                        Weekly Conditioning Frequency (Minimum 2×)
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="2"
                            max="6"
                            value={conditioningConfig.frequency}
                            onChange={(e) => handleFrequencyChange(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {conditioningConfig.frequency}×
                        </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>2× (minimum)</span>
                        <span>6× (high volume)</span>
                    </div>
                </div>

                {/* Primary Method Selection */}
                <div className="mb-6">
                    <h5 className="text-white font-medium mb-3">Primary Conditioning Method</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(conditioningMethods).map(([key, method]) => (
                            <div
                                key={key}
                                onClick={() => handleConditioningMethodChange(key)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${conditioningConfig.primaryMethod === key
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <h6 className="text-white font-medium mb-1">{method.name}</h6>
                                <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                                <p className="text-gray-500 text-xs">Equipment: {method.equipment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* High Intensity Conditioning */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-red-400" />
                    High Intensity Conditioning (15-20 minutes)
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select high-intensity conditioning exercises for maximum time efficiency
                </p>

                {conditioningConfig.highIntensity && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {highIntensityOptions.map((exercise, index) => {
                        const isSelected = (conditioningConfig.highIntensity?.exercises ?? []).includes(exercise);

                        return (
                            <div
                                key={index}
                                onClick={() => handleHighIntensityToggle(exercise)}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">{exercise}</span>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                                </div>
                            </div>
                        );
                    })}
                </div>}
            </div>

            {/* Low Intensity Conditioning */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-400" />
                    Low Intensity Conditioning (20-40 minutes)
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select low-intensity activities for active recovery and aerobic base building
                </p>

                {conditioningConfig.lowIntensity && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lowIntensityOptions.map((exercise, index) => {
                        const isSelected = (conditioningConfig.lowIntensity?.exercises ?? []).includes(exercise);

                        return (
                            <div
                                key={index}
                                onClick={() => handleLowIntensityToggle(exercise)}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">{exercise}</span>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                                </div>
                            </div>
                        );
                    })}
                </div>}
            </div>

            {/* Recovery Protocols */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-red-400" />
                    Recovery Protocols
                </h4>

                {/* Sleep */}
                <div className="mb-6">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Sleep (Most Important!)
                    </h5>
                    <div className="flex items-center space-x-4 mb-2">
                        <label className="text-gray-400">Target Hours:</label>
                        <input
                            type="range"
                            min="6"
                            max="10"
                            value={recoveryConfig.sleep?.targetHours ?? 8}
                            onChange={(e) => {
                                const next = {
                                    ...recoveryConfig,
                                    sleep: { ...recoveryConfig.sleep, targetHours: parseInt(e.target.value) }
                                };
                                setRecoveryConfig(next);
                                updateStepData({ recoveryConfig: next });
                            }}
                            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-medium w-12 text-center">
                            {(recoveryConfig.sleep?.targetHours ?? 8)}h
                        </span>
                    </div>
                    <div className="text-sm text-gray-400">
                        Recommendation: 7-9 hours nightly for optimal recovery
                    </div>
                </div>

                {/* Nutrition */}
                <div className="mb-6">
                    <h5 className="text-white font-medium mb-3 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Nutrition Focus
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                            <h6 className="text-white font-medium mb-1">Protein Priority</h6>
                            <p className="text-gray-400 text-sm">0.8-1.2g per lb bodyweight</p>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                            <h6 className="text-white font-medium mb-1">Adequate Calories</h6>
                            <p className="text-gray-400 text-sm">Support training demands</p>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                            <h6 className="text-white font-medium mb-1">Hydration</h6>
                            <p className="text-gray-400 text-sm">Half bodyweight in ounces daily</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stress Management */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-red-400" />
                    Stress Management Techniques
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select techniques to manage life stress and optimize recovery
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stressManagementTechniques.map((technique, index) => {
                        const isSelected = (recoveryConfig.stressManagement?.techniques || []).includes(technique.name);

                        return (
                            <div
                                key={index}
                                onClick={() => handleStressManagementToggle(technique.name)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-white font-medium">{technique.name}</h6>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                                </div>
                                <p className="text-gray-400 text-sm">{technique.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Soft Tissue Work */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-400" />
                    Soft Tissue Maintenance
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select methods for maintaining tissue quality and mobility
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {softTissueMethods.map((method, index) => {
                        const isSelected = (recoveryConfig.softTissue?.methods || []).includes(method.name);

                        return (
                            <div
                                key={index}
                                onClick={() => handleSoftTissueToggle(method.name)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-white font-medium">{method.name}</h6>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                                </div>
                                <p className="text-gray-400 text-sm">{method.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Critical Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-yellow-200 text-sm">
                        <h5 className="font-medium mb-2">Critical Recovery Guidelines</h5>
                        <ul className="space-y-1 text-xs">
                            <li>• Sleep is non-negotiable - prioritize 7-9 hours nightly</li>
                            <li>• Conditioning supports strength training, not the other way around</li>
                            <li>• Life stress directly impacts training recovery - manage it actively</li>
                            <li>• Consistency beats intensity for long-term conditioning gains</li>
                            <li>• If you can only do one thing, choose sleep over everything else</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 17 Complete! Conditioning and recovery protocols configured for {conditioningConfig.frequency}× weekly conditioning
                            with {recoveryConfig.sleep.targetHours} hours target sleep.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
