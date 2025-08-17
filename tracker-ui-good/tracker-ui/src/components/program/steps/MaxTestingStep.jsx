import React, { useState } from 'react';
import { Calculator, Target, TrendingUp } from 'lucide-react';
import * as EngineModule from '../../../lib/engines/FiveThreeOneEngine.js';
const FiveThreeOneEngine = EngineModule.default ?? EngineModule.FiveThreeOneEngine;
console.log('FiveThreeOneEngine resolved:', FiveThreeOneEngine);
console.log('FiveThreeOneEngine module keys:', Object.keys(EngineModule));

const MaxTestingStep = ({ programData, setProgramData }) => {
    const [repTestData, setRepTestData] = useState({
        squat: { weight: '', reps: '' },
        bench: { weight: '', reps: '' },
        deadlift: { weight: '', reps: '' },
        overhead_press: { weight: '', reps: '' }
    });
    const [calculatorMode, setCalculatorMode] = useState({
        squat: 'direct',
        bench: 'direct',
        deadlift: 'direct',
        overhead_press: 'direct'
    });

    const engine = new FiveThreeOneEngine();

    const liftDisplayNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    const handleDirectMaxChange = (lift, value) => {
        setProgramData(prev => ({
            ...prev,
            maxes: {
                ...prev.maxes,
                [lift]: parseInt(value) || null
            }
        }));
    };

    const handleRepTestChange = (lift, field, value) => {
        setRepTestData(prev => ({
            ...prev,
            [lift]: {
                ...prev[lift],
                [field]: value
            }
        }));

        // Auto-calculate 1RM if both weight and reps are provided
        if (field === 'reps' || field === 'weight') {
            const testData = { ...repTestData[lift], [field]: value };
            if (testData.weight && testData.reps) {
                const calculated1RM = engine.calculateEst1RM(parseInt(testData.weight), parseInt(testData.reps));
                setProgramData(prev => ({
                    ...prev,
                    maxes: {
                        ...prev.maxes,
                        [lift]: calculated1RM
                    }
                }));
            }
        }
    };

    const toggleCalculatorMode = (lift) => {
        setCalculatorMode(prev => ({
            ...prev,
            [lift]: prev[lift] === 'direct' ? 'calculate' : 'direct'
        }));

        // Clear the lift data when switching modes
        if (calculatorMode[lift] === 'direct') {
            setRepTestData(prev => ({
                ...prev,
                [lift]: { weight: '', reps: '' }
            }));
        } else {
            setProgramData(prev => ({
                ...prev,
                maxes: {
                    ...prev.maxes,
                    [lift]: null
                }
            }));
        }
    };

    const getTrainingMax = (oneRepMax) => {
        return oneRepMax ? engine.calculateTrainingMax(oneRepMax) : 0;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enter Your Current Maxes</h3>
                <p className="text-gray-300">
                    Enter your 1RM directly or calculate from a recent rep test
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.keys(liftDisplayNames).map((lift) => (
                    <div key={lift} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-red-500" />
                                {liftDisplayNames[lift]}
                            </h4>
                            <button
                                onClick={() => toggleCalculatorMode(lift)}
                                className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors ${calculatorMode[lift] === 'calculate'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                            >
                                <Calculator className="w-4 h-4" />
                                {calculatorMode[lift] === 'calculate' ? 'Calculator' : 'Direct'}
                            </button>
                        </div>

                        {calculatorMode[lift] === 'direct' ? (
                            // Direct 1RM Entry
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Current 1RM (lbs)
                                    </label>
                                    <input
                                        type="number"
                                        value={programData.maxes[lift] || ''}
                                        onChange={(e) => handleDirectMaxChange(lift, e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-3 text-lg font-semibold"
                                        placeholder="Enter weight"
                                    />
                                </div>
                                {programData.maxes[lift] && (
                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                        <p className="text-green-400 text-sm font-medium">
                                            Training Max: {getTrainingMax(programData.maxes[lift])} lbs (90%)
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Rep Test Calculator
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Weight (lbs)
                                        </label>
                                        <input
                                            type="number"
                                            value={repTestData[lift].weight}
                                            onChange={(e) => handleRepTestChange(lift, 'weight', e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                                            placeholder="Weight"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Reps
                                        </label>
                                        <input
                                            type="number"
                                            value={repTestData[lift].reps}
                                            onChange={(e) => handleRepTestChange(lift, 'reps', e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                                            placeholder="Reps"
                                            min="1"
                                            max="20"
                                        />
                                    </div>
                                </div>

                                {programData.maxes[lift] && (
                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
                                            <TrendingUp className="w-4 h-4" />
                                            Calculated Results
                                        </div>
                                        <p className="text-blue-300 text-sm">
                                            Estimated 1RM: <span className="font-semibold">{programData.maxes[lift]} lbs</span>
                                        </p>
                                        <p className="text-blue-300 text-sm">
                                            Training Max: <span className="font-semibold">{getTrainingMax(programData.maxes[lift])} lbs</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary Section */}
            {Object.values(programData.maxes).some(max => max) && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-4">Training Max Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(liftDisplayNames).map(([lift, name]) => (
                            programData.maxes[lift] && (
                                <div key={lift} className="text-center">
                                    <p className="text-gray-400 text-sm">{name}</p>
                                    <p className="text-white font-semibold text-lg">
                                        {getTrainingMax(programData.maxes[lift])} lbs
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        (90% of {programData.maxes[lift]} lbs)
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h5 className="text-yellow-400 font-medium mb-2">💡 Max Testing Tips</h5>
                <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Use your most recent true 1RM (within last 6 months)</li>
                    <li>• Rep calculator works best with 3-8 reps</li>
                    <li>• Training maxes are 90% of 1RM for sustainable progression</li>
                    <li>• Conservative estimates are better than aggressive ones</li>
                </ul>
            </div>
        </div>
    );
};

export default MaxTestingStep;
