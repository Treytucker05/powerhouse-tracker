import React from 'react';
import { TrendingUp, Settings, RotateCcw, Info } from 'lucide-react';

export default function CycleConfiguration({ data, updateData, assessment }) {

    const cycleLengths = [
        {
            weeks: 4,
            name: 'Standard 4-Week Cycle',
            description: 'Classic 5/3/1 progression: Week 1 (5+), Week 2 (3+), Week 3 (1+), Week 4 (Deload)',
            recommended: true,
            pros: ['Proven progression', 'Built-in deload', 'Sustainable'],
            cons: ['Slower progress', 'Fixed structure']
        },
        {
            weeks: 3,
            name: '3-Week Wave',
            description: 'Faster progression without built-in deload: Week 1 (5+), Week 2 (3+), Week 3 (1+)',
            recommended: false,
            pros: ['Faster progression', 'More flexible', 'Higher intensity'],
            cons: ['No built-in deload', 'Requires fatigue management', 'Advanced option']
        }
    ];

    const progressionPresets = [
        {
            id: 'standard',
            name: 'Standard Progression',
            upper: 5,
            lower: 10,
            description: 'Conservative progression recommended by Jim Wendler',
            recommended: true
        },
        {
            id: 'aggressive',
            name: 'Aggressive Progression',
            upper: 10,
            lower: 15,
            description: 'Faster progression for beginners or returning lifters',
            recommended: false
        },
        {
            id: 'conservative',
            name: 'Conservative Progression',
            upper: 2.5,
            lower: 5,
            description: 'Slower progression for advanced lifters or when cutting',
            recommended: false
        }
    ];

    const deloadOptions = [
        {
            id: 'standard',
            name: 'Standard Deload',
            description: '40%, 50%, 60% for 5 reps each (no AMRAP)',
            recommended: true
        },
        {
            id: 'light',
            name: 'Light Deload',
            description: '30%, 40%, 50% for 5 reps each',
            recommended: false
        },
        {
            id: 'skip',
            name: 'Skip Deload',
            description: 'No deload week (not recommended for beginners)',
            recommended: false
        }
    ];

    const handleCycleLengthChange = (weeks) => {
        updateData({ cycle_length: weeks });
    };

    const handleProgressionChange = (preset) => {
        updateData({
            progression_rates: { upper: preset.upper, lower: preset.lower },
            progression_type: preset.id
        });
    };

    const handleCustomProgressionChange = (type, value) => {
        const rates = { ...data.progression_rates };
        rates[type] = parseFloat(value) || 0;
        updateData({
            progression_rates: rates,
            progression_type: 'custom'
        });
    };

    const handleDeloadChange = (deloadType) => {
        updateData({ deload_type: deloadType });
    };

    const selectedCycle = cycleLengths.find(c => c.weeks === data.cycle_length);
    const selectedProgression = progressionPresets.find(p => p.id === data.progression_type);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <TrendingUp className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Cycle Configuration</h3>
                <p className="text-gray-400">
                    Configure your progression parameters and cycle structure
                </p>
            </div>

            {/* Cycle Length Selection */}
            <div>
                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Cycle Length
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cycleLengths.map(cycle => (
                        <div
                            key={cycle.weeks}
                            onClick={() => handleCycleLengthChange(cycle.weeks)}
                            className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                ${data.cycle_length === cycle.weeks
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-white">{cycle.name}</h5>
                                {cycle.recommended && (
                                    <span className="text-xs px-2 py-1 rounded bg-green-700 text-green-200">
                                        Recommended
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm mb-3">{cycle.description}</p>

                            {data.cycle_length === cycle.weeks && (
                                <div className="pt-3 border-t border-gray-700 space-y-2">
                                    <div>
                                        <span className="text-green-400 text-xs font-medium">Pros:</span>
                                        <ul className="text-xs text-gray-400 ml-2">
                                            {cycle.pros.map((pro, i) => (
                                                <li key={i}>• {pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-yellow-400 text-xs font-medium">Cons:</span>
                                        <ul className="text-xs text-gray-400 ml-2">
                                            {cycle.cons.map((con, i) => (
                                                <li key={i}>• {con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progression Rate Selection */}
            <div>
                <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Progression Rates
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {progressionPresets.map(preset => (
                        <div
                            key={preset.id}
                            onClick={() => handleProgressionChange(preset)}
                            className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                ${data.progression_type === preset.id
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-white">{preset.name}</h5>
                                {preset.recommended && (
                                    <span className="text-xs px-2 py-1 rounded bg-green-700 text-green-200">
                                        Recommended
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 mb-2">
                                <div className="text-sm text-gray-300">
                                    Upper body: +{preset.upper} lbs
                                </div>
                                <div className="text-sm text-gray-300">
                                    Lower body: +{preset.lower} lbs
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm">{preset.description}</p>
                        </div>
                    ))}
                </div>

                {/* Custom Progression */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-3">Custom Progression</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Upper Body Progression (lbs)
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                placeholder="5"
                                value={data.progression_rates?.upper || ''}
                                onChange={(e) => handleCustomProgressionChange('upper', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">Bench Press, Overhead Press</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Lower Body Progression (lbs)
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                placeholder="10"
                                value={data.progression_rates?.lower || ''}
                                onChange={(e) => handleCustomProgressionChange('lower', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">Squat, Deadlift</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deload Configuration (only for 4-week cycles) */}
            {data.cycle_length === 4 && (
                <div>
                    <h4 className="text-lg font-medium text-white mb-4">Deload Week Configuration</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {deloadOptions.map(option => (
                            <div
                                key={option.id}
                                onClick={() => handleDeloadChange(option.id)}
                                className={`
                                    cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                    ${data.deload_type === option.id
                                        ? 'border-red-500 bg-red-900/20'
                                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-medium text-white">{option.name}</h5>
                                    {option.recommended && (
                                        <span className="text-xs px-2 py-1 rounded bg-green-700 text-green-200">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm">{option.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Configuration Summary */}
            {data.cycle_length && data.progression_rates && (
                <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Configuration Summary</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-medium text-gray-300 mb-2">Cycle Structure</h5>
                            <div className="text-white font-medium">{selectedCycle?.name}</div>
                            <div className="text-sm text-gray-400">{data.cycle_length} weeks per cycle</div>
                            {data.cycle_length === 4 && data.deload_type && (
                                <div className="text-sm text-gray-400">
                                    Deload: {deloadOptions.find(d => d.id === data.deload_type)?.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <h5 className="font-medium text-gray-300 mb-2">Progression Rates</h5>
                            <div className="text-white">
                                Upper: +{data.progression_rates.upper} lbs per cycle
                            </div>
                            <div className="text-white">
                                Lower: +{data.progression_rates.lower} lbs per cycle
                            </div>
                            {selectedProgression && (
                                <div className="text-sm text-gray-400">{selectedProgression.name}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h5 className="text-blue-300 font-medium mb-2">About Progression</h5>
                        <p className="text-blue-200 text-sm">
                            5/3/1 uses slow, steady progression to build long-term strength. After each cycle,
                            you add weight to your training max. Upper body lifts progress slower than lower body
                            lifts. The standard progression has been proven effective for lifters at all levels.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
