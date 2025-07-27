import React, { useState } from 'react';
import { Zap, Target, Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const TrainingMethods = ({ assessmentData, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [customMethod, setCustomMethod] = useState({
        name: '',
        category: '',
        description: '',
        parameters: ''
    });

    const trainingMethods = {
        strength: [
            {
                id: 'traditional_strength',
                name: 'Traditional Strength Training',
                description: 'Standard rep ranges with progressive overload',
                parameters: '3-6 sets, 1-6 reps, 85-95% 1RM',
                benefits: ['Maximal strength', 'Neural adaptations', 'Power development'],
                equipment: ['Barbell', 'Dumbbells', 'Machines']
            },
            {
                id: 'cluster_sets',
                name: 'Cluster Sets',
                description: 'Intra-set rest to maintain intensity',
                parameters: '3-5 sets, 2-4 clusters, 2-4 reps per cluster',
                benefits: ['Higher training intensity', 'Volume with quality', 'Power maintenance'],
                equipment: ['Barbell', 'Dumbbells']
            },
            {
                id: 'accommodating_resistance',
                name: 'Accommodating Resistance',
                description: 'Variable resistance through ROM',
                parameters: '3-6 sets, 1-5 reps, 50-85% + bands/chains',
                benefits: ['Speed-strength', 'Power development', 'Strength curve optimization'],
                equipment: ['Barbell', 'Chains', 'Bands']
            }
        ],
        power: [
            {
                id: 'olympic_lifts',
                name: 'Olympic Lifts',
                description: 'Snatch, clean & jerk variations',
                parameters: '3-6 sets, 1-3 reps, 70-95% 1RM',
                benefits: ['Rate of force development', 'Coordination', 'Athletic power'],
                equipment: ['Olympic barbell', 'Bumper plates', 'Platform']
            },
            {
                id: 'plyometrics',
                name: 'Plyometric Training',
                description: 'Explosive jumping and bounding exercises',
                parameters: '3-5 sets, 3-8 reps, 24-48h recovery',
                benefits: ['Elastic strength', 'Reactive ability', 'Athletic performance'],
                equipment: ['Boxes', 'Hurdles', 'Bodyweight']
            },
            {
                id: 'ballistic_training',
                name: 'Ballistic Training',
                description: 'Explosive throws and jumps with load',
                parameters: '3-6 sets, 3-6 reps, 30-60% 1RM',
                benefits: ['Power output', 'Velocity training', 'Sport-specific'],
                equipment: ['Medicine balls', 'Jump squats', 'Throws']
            }
        ],
        hypertrophy: [
            {
                id: 'traditional_hypertrophy',
                name: 'Traditional Hypertrophy',
                description: 'Moderate intensity, higher volume',
                parameters: '3-5 sets, 6-15 reps, 65-80% 1RM',
                benefits: ['Muscle mass', 'Metabolic stress', 'Volume tolerance'],
                equipment: ['Barbell', 'Dumbbells', 'Machines']
            },
            {
                id: 'intensity_techniques',
                name: 'Intensity Techniques',
                description: 'Drop sets, supersets, rest-pause',
                parameters: 'Variable sets/reps, metabolic focus',
                benefits: ['Metabolic stress', 'Time efficiency', 'Muscle fatigue'],
                equipment: ['Various weights', 'Machines preferred']
            },
            {
                id: 'tempo_training',
                name: 'Tempo Training',
                description: 'Controlled eccentric and isometric phases',
                parameters: '3-4 sets, 6-12 reps, specific tempo',
                benefits: ['Time under tension', 'Muscle damage', 'Control'],
                equipment: ['All equipment types']
            }
        ],
        conditioning: [
            {
                id: 'hiit',
                name: 'High-Intensity Interval Training',
                description: 'Short bursts of high intensity',
                parameters: '4-8 intervals, 15s-4min work, 1:1-1:3 ratio',
                benefits: ['VO2 max', 'Lactate threshold', 'Time efficient'],
                equipment: ['Bike', 'Rower', 'Treadmill', 'Bodyweight']
            },
            {
                id: 'circuit_training',
                name: 'Circuit Training',
                description: 'Multiple exercises in sequence',
                parameters: '3-5 circuits, 6-12 exercises, 30-60s each',
                benefits: ['Work capacity', 'Metabolic conditioning', 'Variety'],
                equipment: ['Mixed equipment', 'Bodyweight']
            },
            {
                id: 'energy_system',
                name: 'Energy System Development',
                description: 'Targeted energy system training',
                parameters: 'Sport-specific intervals and durations',
                benefits: ['Sport specificity', 'Energy system adaptation', 'Performance'],
                equipment: ['Sport-specific equipment']
            }
        ],
        mobility: [
            {
                id: 'dynamic_warmup',
                name: 'Dynamic Warm-up',
                description: 'Movement-based preparation',
                parameters: '10-15 minutes, sport-specific movements',
                benefits: ['Injury prevention', 'Performance readiness', 'Mobility'],
                equipment: ['Minimal equipment']
            },
            {
                id: 'static_stretching',
                name: 'Static Stretching',
                description: 'Held stretches for flexibility',
                parameters: '15-60s holds, 2-4 sets per muscle',
                benefits: ['Flexibility', 'Recovery', 'Range of motion'],
                equipment: ['Bodyweight', 'Straps']
            },
            {
                id: 'myofascial_release',
                name: 'Myofascial Release',
                description: 'Self-massage and tissue work',
                parameters: '30-60s per area, pre/post training',
                benefits: ['Recovery', 'Tissue quality', 'Pain reduction'],
                equipment: ['Foam roller', 'Lacrosse ball', 'Massage tools']
            }
        ]
    };

    const toggleMethod = (methodId) => {
        setSelectedMethods(prev =>
            prev.includes(methodId)
                ? prev.filter(id => id !== methodId)
                : [...prev, methodId]
        );
    };

    const addCustomMethod = () => {
        if (!customMethod.name || !customMethod.category) return;

        const newMethod = {
            id: `custom_${Date.now()}`,
            name: customMethod.name,
            description: customMethod.description,
            parameters: customMethod.parameters,
            benefits: ['Custom method'],
            equipment: ['As specified'],
            isCustom: true
        };

        if (!trainingMethods[customMethod.category]) {
            trainingMethods[customMethod.category] = [];
        }

        trainingMethods[customMethod.category].push(newMethod);
        setSelectedMethods(prev => [...prev, newMethod.id]);

        setCustomMethod({
            name: '',
            category: '',
            description: '',
            parameters: ''
        });
    };

    const getSelectedMethodsData = () => {
        const selected = [];
        Object.values(trainingMethods).flat().forEach(method => {
            if (selectedMethods.includes(method.id)) {
                selected.push(method);
            }
        });
        return selected;
    };

    const getMethodsByCategory = (category) => {
        return trainingMethods[category] || [];
    };

    const isFormValid = () => {
        return selectedMethods.length > 0;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Training Methods & Techniques
                </h3>
                <p className="text-blue-300 text-sm">
                    Select and configure the training methods that will be used throughout your program.
                </p>
            </div>

            {/* Training Method Categories */}
            <div className="space-y-6">
                {Object.entries(trainingMethods).map(([category, methods]) => (
                    <div key={category} className="space-y-3">
                        <h4 className="text-white font-medium capitalize flex items-center gap-2">
                            {category === 'strength' && <Target className="h-4 w-4" />}
                            {category === 'power' && <Zap className="h-4 w-4" />}
                            {category === 'hypertrophy' && <Users className="h-4 w-4" />}
                            {category === 'conditioning' && <Activity className="h-4 w-4" />}
                            {category === 'mobility' && <CheckCircle className="h-4 w-4" />}
                            {category} Training
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {methods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMethods.includes(method.id)
                                            ? 'border-blue-500 bg-blue-900/20'
                                            : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                    onClick={() => toggleMethod(method.id)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="text-white font-medium text-sm">{method.name}</h5>
                                        {selectedMethods.includes(method.id) && (
                                            <CheckCircle className="h-4 w-4 text-blue-400" />
                                        )}
                                    </div>

                                    <p className="text-gray-400 text-xs mb-3">{method.description}</p>

                                    <div className="space-y-2">
                                        <div>
                                            <div className="text-gray-500 text-xs">Parameters:</div>
                                            <div className="text-gray-300 text-xs">{method.parameters}</div>
                                        </div>

                                        <div>
                                            <div className="text-gray-500 text-xs">Benefits:</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {method.benefits.slice(0, 2).map((benefit, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                                                    >
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-gray-500 text-xs">Equipment:</div>
                                            <div className="text-gray-400 text-xs">
                                                {method.equipment.slice(0, 2).join(', ')}
                                                {method.equipment.length > 2 && '...'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Method Creation */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Add Custom Training Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            value={customMethod.name}
                            onChange={(e) => setCustomMethod(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Method name"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <select
                            value={customMethod.category}
                            onChange={(e) => setCustomMethod(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        >
                            <option value="">Select category</option>
                            <option value="strength">Strength</option>
                            <option value="power">Power</option>
                            <option value="hypertrophy">Hypertrophy</option>
                            <option value="conditioning">Conditioning</option>
                            <option value="mobility">Mobility</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <textarea
                            value={customMethod.description}
                            onChange={(e) => setCustomMethod(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Method description"
                            rows="2"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={customMethod.parameters}
                            onChange={(e) => setCustomMethod(prev => ({ ...prev, parameters: e.target.value }))}
                            placeholder="Training parameters"
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                    </div>
                    <div>
                        <button
                            onClick={addCustomMethod}
                            disabled={!customMethod.name || !customMethod.category}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                        >
                            Add Custom Method
                        </button>
                    </div>
                </div>
            </div>

            {/* Selected Methods Summary */}
            {selectedMethods.length > 0 && (
                <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Selected Training Methods ({selectedMethods.length})
                    </h4>
                    <div className="space-y-2">
                        {getSelectedMethodsData().map((method) => (
                            <div key={method.id} className="flex items-center justify-between">
                                <div>
                                    <span className="text-white text-sm font-medium">{method.name}</span>
                                    <span className="text-gray-400 text-xs ml-2">({method.parameters})</span>
                                </div>
                                <button
                                    onClick={() => toggleMethod(method.id)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Validation */}
            {!isFormValid() && (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Method Selection Required</span>
                    </div>
                    <p className="text-yellow-300 text-sm mt-1">
                        Please select at least one training method to proceed.
                    </p>
                </div>
            )}

            {/* Training Method Guidelines */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Training Method Guidelines</h4>
                <div className="text-gray-300 text-sm space-y-1">
                    <p>• Select 3-5 primary methods for a balanced program</p>
                    <p>• Consider equipment availability and experience level</p>
                    <p>• Combine methods strategically for synergistic effects</p>
                    <p>• Progress from simple to complex methods over time</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    Previous: Loading Parameters
                </button>
                <button
                    onClick={onNext}
                    disabled={!canGoNext || !isFormValid()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next: Program Preview
                    <Activity className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default TrainingMethods;
