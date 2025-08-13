import React from 'react';

const PHAHealthStep = ({ assessmentData, onInputChange }) => {
    const handleInputChange = (field, value) => {
        const updatedData = {
            ...assessmentData,
            phaHealthScreen: {
                ...assessmentData.phaHealthScreen,
                [field]: value
            }
        };
        onInputChange(updatedData);
    };

    const phaHealthScreen = assessmentData.phaHealthScreen || {
        highBP: false,
        cardiacHistory: false,
        fitness: 'moderate'
    };

    // Calculate contraindication status
    const isContraindicated = phaHealthScreen.highBP || phaHealthScreen.fitness === 'poor';

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    PHA Health Screening
                </h2>
                <p className="text-gray-400">
                    Peripheral Heart Action (PHA) circuits require cardiovascular readiness.
                    This screening ensures safe participation in high-intensity circuit training.
                </p>
            </div>

            <div className="space-y-6">
                {/* Blood Pressure Status */}
                <div>
                    <label className="block text-white font-medium mb-3">
                        Do you have high blood pressure or take blood pressure medication?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="highBP"
                                checked={phaHealthScreen.highBP === false}
                                onChange={() => handleInputChange('highBP', false)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-300">No, normal blood pressure</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="highBP"
                                checked={phaHealthScreen.highBP === true}
                                onChange={() => handleInputChange('highBP', true)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-300">Yes, high blood pressure</span>
                        </label>
                    </div>
                </div>

                {/* Cardiac History */}
                <div>
                    <label className="block text-white font-medium mb-3">
                        Do you have any history of heart conditions or cardiovascular issues?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="cardiacHistory"
                                checked={phaHealthScreen.cardiacHistory === false}
                                onChange={() => handleInputChange('cardiacHistory', false)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-300">No cardiac history</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="cardiacHistory"
                                checked={phaHealthScreen.cardiacHistory === true}
                                onChange={() => handleInputChange('cardiacHistory', true)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-300">Yes, cardiac history present</span>
                        </label>
                    </div>
                </div>

                {/* Current Fitness Level */}
                <div>
                    <label className="block text-white font-medium mb-3">
                        How would you rate your current cardiovascular fitness?
                    </label>
                    <select
                        value={phaHealthScreen.fitness}
                        onChange={(e) => handleInputChange('fitness', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="poor">Poor - Cannot maintain moderate exercise for 10+ minutes</option>
                        <option value="moderate">Moderate - Can exercise 20-30 minutes continuously</option>
                        <option value="good">Good - Can exercise 45+ minutes at moderate intensity</option>
                    </select>
                </div>

                {/* PHA Eligibility Status */}
                <div className={`p-4 rounded-lg border-l-4 ${isContraindicated
                        ? 'bg-red-900/20 border-red-500'
                        : 'bg-green-900/20 border-green-500'
                    }`}>
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${isContraindicated ? 'bg-red-500' : 'bg-green-500'
                            }`}></div>
                        <h3 className={`font-bold ${isContraindicated ? 'text-red-400' : 'text-green-400'
                            }`}>
                            PHA Circuit Status: {isContraindicated ? 'Contraindicated' : 'Eligible'}
                        </h3>
                    </div>
                    <p className={`mt-2 text-sm ${isContraindicated ? 'text-red-300' : 'text-green-300'
                        }`}>
                        {isContraindicated
                            ? 'High-intensity PHA circuits are not recommended. Alternative conditioning methods will be suggested.'
                            : 'You are cleared for PHA circuit training. High-intensity no-rest circuits can be safely included in your program.'
                        }
                    </p>
                </div>

                {/* Bryant Research Note */}
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">Bryant Periodization Guidelines</h4>
                    <ul className="text-blue-300 text-sm space-y-1">
                        <li>• PHA circuits: 4-6 week blocks maximum</li>
                        <li>• No-rest between exercises (30s max transition)</li>
                        <li>• Mandatory deload after each PHA block</li>
                        <li>• Avoid if high BP or poor cardiovascular fitness</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PHAHealthStep;
