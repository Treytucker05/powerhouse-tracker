import React, { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Step1MaxTesting({ data, updateData }) {
    const [testingMethod, setTestingMethod] = useState(data.testingMethod || 'estimate');
    const [oneRMs, setOneRMs] = useState(data.oneRMs || {
        squat: '',
        bench: '',
        deadlift: '',
        overhead_press: ''
    });
    const [repTests, setRepTests] = useState(data.repTests || {
        squat: { weight: '', reps: '' },
        bench: { weight: '', reps: '' },
        deadlift: { weight: '', reps: '' },
        overhead_press: { weight: '', reps: '' }
    });
    const [trainingMaxes, setTrainingMaxes] = useState(data.trainingMaxes || {});

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Wendler's formula: Estimated 1RM = Weight × Reps × 0.0333 + Weight
    const calculateEst1RM = (weight, reps) => {
        if (!weight || !reps || reps < 1) return 0;
        const w = parseFloat(weight);
        const r = parseInt(reps);
        if (r === 1) return w;
        return Math.round(w * r * 0.0333 + w);
    };

    // Training Max = 90% of 1RM
    const calculateTrainingMax = (oneRM) => {
        if (!oneRM) return 0;
        return Math.round(oneRM * 0.9 / 5) * 5; // Round to nearest 5 lbs
    };

    const handleOneRMChange = (lift, value) => {
        const newOneRMs = { ...oneRMs, [lift]: value };
        setOneRMs(newOneRMs);

        // Calculate training maxes
        const newTrainingMaxes = {};
        Object.keys(newOneRMs).forEach(liftKey => {
            if (newOneRMs[liftKey]) {
                newTrainingMaxes[liftKey] = calculateTrainingMax(parseFloat(newOneRMs[liftKey]));
            }
        });
        setTrainingMaxes(newTrainingMaxes);

        updateData({
            testingMethod,
            oneRMs: newOneRMs,
            repTests,
            trainingMaxes: newTrainingMaxes
        });
    };

    const handleRepTestChange = (lift, field, value) => {
        const newRepTests = {
            ...repTests,
            [lift]: { ...repTests[lift], [field]: value }
        };
        setRepTests(newRepTests);

        // Calculate estimated 1RMs and training maxes
        const newOneRMs = { ...oneRMs };
        const newTrainingMaxes = {};

        Object.keys(newRepTests).forEach(liftKey => {
            const test = newRepTests[liftKey];
            if (test.weight && test.reps) {
                const est1RM = calculateEst1RM(test.weight, test.reps);
                newOneRMs[liftKey] = est1RM.toString();
                newTrainingMaxes[liftKey] = calculateTrainingMax(est1RM);
            }
        });

        setOneRMs(newOneRMs);
        setTrainingMaxes(newTrainingMaxes);

        updateData({
            testingMethod,
            oneRMs: newOneRMs,
            repTests: newRepTests,
            trainingMaxes: newTrainingMaxes
        });
    };

    const isStepComplete = () => {
        return Object.values(trainingMaxes).every(tm => tm > 0);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 1: Establish One-Rep Maxes and Training Max
                </h3>
                <p className="text-gray-400">
                    Determine your current 1RM for each lift and calculate Training Max (90% of 1RM).
                </p>
            </div>

            {/* Core Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">5/3/1 Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Start too light:</strong> Training Max = 90% of 1RM</li>
                            <li>• <strong>Leave your ego at the door:</strong> Conservative TMs enable long-term progress</li>
                            <li>• <strong>You should get 5+ reps</strong> with your Training Max</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Testing Method Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Testing Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => setTestingMethod('known')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${testingMethod === 'known'
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                            }`}
                    >
                        <div className="flex items-center mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-white font-medium">Known 1RM</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            I know my current 1RM for each lift
                        </p>
                    </div>

                    <div
                        onClick={() => setTestingMethod('estimate')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${testingMethod === 'estimate'
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                            }`}
                    >
                        <div className="flex items-center mb-2">
                            <Calculator className="w-5 h-5 text-blue-400 mr-2" />
                            <span className="text-white font-medium">Estimate from Rep Test</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Calculate 1RM using Wendler's formula
                        </p>
                    </div>
                </div>
            </div>

            {/* Known 1RM Input */}
            {testingMethod === 'known' && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Enter Your Current 1RMs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(liftNames).map(([lift, name]) => (
                            <div key={lift} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    {name} 1RM (lbs)
                                </label>
                                <input
                                    type="number"
                                    value={oneRMs[lift]}
                                    onChange={(e) => handleOneRMChange(lift, e.target.value)}
                                    placeholder="e.g., 315"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-red-500 focus:ring-red-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rep Test Input */}
            {testingMethod === 'estimate' && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Rep Test Calculator</h4>
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                        <p className="text-blue-200 text-sm">
                            <strong>Wendler's Formula:</strong> Estimated 1RM = Weight × Reps × 0.0333 + Weight
                        </p>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(liftNames).map(([lift, name]) => (
                            <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                                <h5 className="text-white font-medium mb-3">{name}</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Weight (lbs)
                                        </label>
                                        <input
                                            type="number"
                                            value={repTests[lift].weight}
                                            onChange={(e) => handleRepTestChange(lift, 'weight', e.target.value)}
                                            placeholder="e.g., 275"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Reps
                                        </label>
                                        <input
                                            type="number"
                                            value={repTests[lift].reps}
                                            onChange={(e) => handleRepTestChange(lift, 'reps', e.target.value)}
                                            placeholder="e.g., 5"
                                            min="1"
                                            max="20"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Estimated 1RM
                                        </label>
                                        <div className="px-3 py-2 bg-gray-600 rounded-md text-white font-medium">
                                            {repTests[lift].weight && repTests[lift].reps
                                                ? `${calculateEst1RM(repTests[lift].weight, repTests[lift].reps)} lbs`
                                                : '---'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Training Maxes Display */}
            {Object.keys(trainingMaxes).length > 0 && (
                <div className="bg-green-900/20 border border-green-600 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">
                        Your Training Maxes (90% of 1RM)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(trainingMaxes).map(([lift, tm]) => (
                            <div key={lift} className="bg-gray-800 p-4 rounded-lg text-center">
                                <div className="text-green-400 font-medium">{liftNames[lift]}</div>
                                <div className="text-2xl font-bold text-white">{tm} lbs</div>
                                <div className="text-gray-400 text-sm">Training Max</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <div className="text-yellow-200 text-sm">
                                <strong>Validation:</strong> You should be able to perform 5+ reps with your Training Max.
                                If not, reduce the TM until you can get at least 5 strong reps.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 1 Complete! Training Maxes calculated for all lifts.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
