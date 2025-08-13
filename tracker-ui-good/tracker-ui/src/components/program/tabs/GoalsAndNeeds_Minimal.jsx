import React, { useState } from 'react';
import { Target, CheckCircle, AlertTriangle } from 'lucide-react';

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    console.log('GoalsAndNeeds - Component rendering');

    const [primaryGoal, setPrimaryGoal] = useState('');
    const [timeframe, setTimeframe] = useState('1-year');

    const handleSave = () => {
        console.log('Saving assessment data:', { primaryGoal, timeframe });
        // Basic save logic without context for now
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessment & Goals</h2>
                    <p className="text-gray-400">Complete your comprehensive training assessment</p>
                </div>
            </div>

            {/* Basic Goals Form */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-white">Training Goals</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Training Goal
                        </label>
                        <input
                            type="text"
                            value={primaryGoal}
                            onChange={(e) => setPrimaryGoal(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Increase squat 1RM, Complete marathon, Build muscle mass"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Training Timeframe
                        </label>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="3-months">3 Months</option>
                            <option value="6-months">6 Months</option>
                            <option value="1-year">1 Year</option>
                            <option value="2-years">2+ Years</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    Save Assessment
                </button>

                {canGoNext && (
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Next: Macrocycle Structure
                        <CheckCircle className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoalsAndNeeds;
