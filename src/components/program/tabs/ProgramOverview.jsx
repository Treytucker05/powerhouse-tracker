import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Target, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const ProgramOverview = ({ assessmentData, onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [overviewData, setOverviewData] = useState({
        programName: 'My Training Program',
        duration: '12',
        trainingDays: '4',
        primaryGoal: 'hypertrophy',
        experienceLevel: 'intermediate',
        equipment: ['Barbell', 'Dumbbells'], // Start with common equipment
        timePerSession: '60'
    });

    const equipmentOptions = [
        'Barbell', 'Dumbbells', 'Kettlebells', 'Cable Machine',
        'Pull-up Bar', 'Resistance Bands', 'Bodyweight Only'
    ];

    useEffect(() => {
        console.log('🚀 ProgramOverview mounted with initial state:', overviewData);
        console.log('✅ Initial form validation:', isFormValid());
    }, []);

    const handleEquipmentChange = (equipment) => {
        setOverviewData(prev => ({
            ...prev,
            equipment: prev.equipment.includes(equipment)
                ? prev.equipment.filter(e => e !== equipment)
                : [...prev.equipment, equipment]
        }));
    };

    const isFormValid = () => {
        const isValid = overviewData.programName.trim() !== '';
        console.log('🔍 Form validation check:', {
            programName: overviewData.programName,
            trimmed: overviewData.programName.trim(),
            length: overviewData.programName.trim().length,
            isValid: isValid,
            overviewData: overviewData
        });
        return isValid;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Program Overview & Setup
                </h3>
                <p className="text-blue-300 text-sm">
                    Define the basic parameters and structure for your training program.
                </p>
            </div>

            {/* Program Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Details */}
                <div className="space-y-4">
                    <h4 className="text-white font-medium">Program Details</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Program Name *
                        </label>
                        <input
                            type="text"
                            value={overviewData.programName}
                            onChange={(e) => setOverviewData(prev => ({ ...prev, programName: e.target.value }))}
                            placeholder="e.g., Strength Building Program"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Duration (weeks)
                            </label>
                            <select
                                value={overviewData.duration}
                                onChange={(e) => setOverviewData(prev => ({ ...prev, duration: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="4">4 weeks</option>
                                <option value="6">6 weeks</option>
                                <option value="8">8 weeks</option>
                                <option value="12">12 weeks</option>
                                <option value="16">16 weeks</option>
                                <option value="24">24 weeks</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Days/Week
                            </label>
                            <select
                                value={overviewData.trainingDays}
                                onChange={(e) => setOverviewData(prev => ({ ...prev, trainingDays: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="2">2 days</option>
                                <option value="3">3 days</option>
                                <option value="4">4 days</option>
                                <option value="5">5 days</option>
                                <option value="6">6 days</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Goal
                        </label>
                        <select
                            value={overviewData.primaryGoal}
                            onChange={(e) => setOverviewData(prev => ({ ...prev, primaryGoal: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="strength">Strength</option>
                            <option value="hypertrophy">Hypertrophy</option>
                            <option value="power">Power</option>
                            <option value="endurance">Endurance</option>
                            <option value="fat_loss">Fat Loss</option>
                            <option value="athletic_performance">Athletic Performance</option>
                        </select>
                    </div>
                </div>

                {/* Athlete Profile */}
                <div className="space-y-4">
                    <h4 className="text-white font-medium">Athlete Profile</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Experience Level
                        </label>
                        <select
                            value={overviewData.experienceLevel}
                            onChange={(e) => setOverviewData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="beginner">Beginner (0-1 years)</option>
                            <option value="intermediate">Intermediate (1-3 years)</option>
                            <option value="advanced">Advanced (3+ years)</option>
                            <option value="elite">Elite/Professional</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time Per Session (minutes)
                        </label>
                        <select
                            value={overviewData.timePerSession}
                            onChange={(e) => setOverviewData(prev => ({ ...prev, timePerSession: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="75">75 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Equipment Selection */}
            <div className="space-y-4">
                <h4 className="text-white font-medium">Available Equipment *</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipmentOptions.map((equipment) => (
                        <label
                            key={equipment}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={overviewData.equipment.includes(equipment)}
                                onChange={() => handleEquipmentChange(equipment)}
                                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-300 text-sm">{equipment}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Program Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Program Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-gray-400">Duration</div>
                        <div className="text-white font-medium">{overviewData.duration} weeks</div>
                    </div>
                    <div>
                        <div className="text-gray-400">Training Frequency</div>
                        <div className="text-white font-medium">{overviewData.trainingDays} days/week</div>
                    </div>
                    <div>
                        <div className="text-gray-400">Total Sessions</div>
                        <div className="text-white font-medium">
                            {parseInt(overviewData.duration) * parseInt(overviewData.trainingDays)} sessions
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Validation Alert */}
            {!isFormValid() && (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Required Fields</span>
                    </div>
                    <p className="text-yellow-300 text-sm mt-1">
                        Please enter a program name to continue.
                    </p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => {
                        console.log('🔘 Next button clicked!');
                        console.log('📊 Button state:', {
                            canGoNext: canGoNext,
                            isFormValid: isFormValid(),
                            disabled: !canGoNext || !isFormValid(),
                            overviewData: overviewData
                        });
                        onNext();
                    }}
                    disabled={!canGoNext || !isFormValid()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next: Block Sequencing
                    <CheckCircle className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default ProgramOverview;
