import React, { useState } from 'react';
import { Target, Calculator, AlertCircle } from 'lucide-react';
import FiveThreeOneEngine from '../../../lib/engines/FiveThreeOneEngine.js';

export default function MaxTesting({ data, updateData, assessment }) {
    const [testMode, setTestMode] = useState('enter'); // 'enter' or 'calculate'
    const [repTest, setRepTest] = useState({
        lift: 'squat',
        weight: '',
        reps: ''
    });

    const engine = new FiveThreeOneEngine();

    const lifts = [
        { key: 'squat_max', label: 'Squat', placeholder: 'e.g., 315' },
        { key: 'bench_max', label: 'Bench Press', placeholder: 'e.g., 225' },
        { key: 'deadlift_max', label: 'Deadlift', placeholder: 'e.g., 405' },
        { key: 'ohp_max', label: 'Overhead Press', placeholder: 'e.g., 135' }
    ];

    const handleMaxChange = (lift, value) => {
        const numValue = value === '' ? null : parseInt(value);
        updateData({ [lift]: numValue });
    };

    const calculateEstimate = () => {
        if (repTest.weight && repTest.reps) {
            const estimate = engine.calculateEst1RM(parseInt(repTest.weight), parseInt(repTest.reps));
            const liftKey = repTest.lift + '_max';
            updateData({ [liftKey]: estimate });
            setRepTest({ lift: repTest.lift, weight: '', reps: '' });
        }
    };

    // Calculate training maxes for display
    const getTrainingMaxes = () => {
        const trainingMaxes = {};
        lifts.forEach(lift => {
            if (data[lift.key]) {
                trainingMaxes[lift.key] = engine.calculateTrainingMax(data[lift.key]);
            }
        });
        return trainingMaxes;
    };

    const trainingMaxes = getTrainingMaxes();
    const validation = engine.validateMaxes({
        squat: data.squat_max,
        bench: data.bench_max,
        deadlift: data.deadlift_max,
        overhead_press: data.ohp_max
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <Target className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Current Max Testing</h3>
                <p className="text-gray-400">
                    Enter your current 1RM for each main lift, or calculate from recent rep maxes
                </p>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-4 justify-center mb-6">
                <button
                    onClick={() => setTestMode('enter')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${testMode === 'enter'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Enter Known 1RMs
                </button>
                <button
                    onClick={() => setTestMode('calculate')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${testMode === 'calculate'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    Calculate from Reps
                </button>
            </div>

            {testMode === 'enter' ? (
                /* Direct Entry Mode */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lifts.map(lift => (
                        <div key={lift.key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                {lift.label} 1RM (lbs)
                            </label>
                            <input
                                type="number"
                                placeholder={lift.placeholder}
                                value={data[lift.key] || ''}
                                onChange={(e) => handleMaxChange(lift.key, e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                            {data[lift.key] && (
                                <div className="text-sm text-gray-400">
                                    Training Max: {trainingMaxes[lift.key]} lbs (90%)
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* Calculator Mode */
                <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-medium text-white">1RM Calculator</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Lift
                            </label>
                            <select
                                value={repTest.lift}
                                onChange={(e) => setRepTest(prev => ({ ...prev, lift: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            >
                                <option value="squat">Squat</option>
                                <option value="bench">Bench Press</option>
                                <option value="deadlift">Deadlift</option>
                                <option value="ohp">Overhead Press</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Weight (lbs)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 275"
                                value={repTest.weight}
                                onChange={(e) => setRepTest(prev => ({ ...prev, weight: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Reps
                            </label>
                            <input
                                type="number"
                                placeholder="e.g., 5"
                                value={repTest.reps}
                                onChange={(e) => setRepTest(prev => ({ ...prev, reps: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={calculateEstimate}
                                disabled={!repTest.weight || !repTest.reps}
                                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${repTest.weight && repTest.reps
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Calculate
                            </button>
                        </div>
                    </div>

                    {repTest.weight && repTest.reps && (
                        <div className="text-sm text-gray-300 bg-gray-800 rounded p-3">
                            <strong>Estimated 1RM:</strong> {engine.calculateEst1RM(parseInt(repTest.weight), parseInt(repTest.reps))} lbs
                            <br />
                            <span className="text-gray-400">Using Epley Formula: Weight × (1 + reps/30)</span>
                        </div>
                    )}
                </div>
            )}

            {/* Current Maxes Summary */}
            {Object.values(data).some(val => val) && (
                <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Current Maxes Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lifts.map(lift => {
                            const max = data[lift.key];
                            const trainingMax = max ? trainingMaxes[lift.key] : null;

                            return (
                                <div key={lift.key} className="flex justify-between items-center py-2 border-b border-gray-600">
                                    <span className="text-gray-300">{lift.label}</span>
                                    <div className="text-right">
                                        {max ? (
                                            <>
                                                <div className="text-white font-medium">{max} lbs</div>
                                                <div className="text-sm text-gray-400">TM: {trainingMax} lbs</div>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Not set</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Validation Messages */}
            {validation.warnings.length > 0 && (
                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <h5 className="text-yellow-300 font-medium mb-2">Warnings:</h5>
                            <ul className="text-yellow-200 text-sm space-y-1">
                                {validation.warnings.map((warning, index) => (
                                    <li key={index}>• {warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {validation.errors.length > 0 && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                            <h5 className="text-red-300 font-medium mb-2">Required:</h5>
                            <ul className="text-red-200 text-sm space-y-1">
                                {validation.errors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* 5/3/1 Info */}
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <h5 className="text-blue-300 font-medium mb-2">About Training Maxes</h5>
                <p className="text-blue-200 text-sm">
                    5/3/1 uses 90% of your true 1RM as your "training max" to ensure you can complete all prescribed reps
                    and maintain proper form. All percentages in your program will be based on these training maxes.
                </p>
            </div>
        </div>
    );
}
