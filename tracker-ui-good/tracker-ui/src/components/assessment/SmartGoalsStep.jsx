import React from 'react';
import { CheckCircle, Target, Calendar, TrendingUp } from 'lucide-react';

const SmartGoalsStep = ({ assessmentData, onInputChange }) => {
    const handleNestedChange = (section, field, value) => {
        const newData = {
            ...assessmentData,
            [section]: {
                ...assessmentData[section],
                [field]: value
            }
        };
        onInputChange(newData);
    };

    const smartCriteria = [
        {
            key: 'specific',
            label: 'Specific',
            icon: Target,
            color: 'blue',
            placeholder: 'What exactly do you want to achieve? (e.g., "Increase my bench press max")',
            description: 'Clear, well-defined goal'
        },
        {
            key: 'measurable',
            label: 'Measurable',
            icon: TrendingUp,
            color: 'green',
            placeholder: 'How will you measure progress? (e.g., "From 185lbs to 225lbs")',
            description: 'Quantifiable progress metrics'
        },
        {
            key: 'achievable',
            label: 'Achievable',
            icon: CheckCircle,
            color: 'yellow',
            placeholder: 'Is this realistic given your experience? (e.g., "40lb increase is realistic")',
            description: 'Realistic and attainable'
        },
        {
            key: 'relevant',
            label: 'Relevant',
            icon: Target,
            color: 'purple',
            placeholder: 'Why is this important to you? (e.g., "For powerlifting competition")',
            description: 'Meaningful to your life/goals'
        },
        {
            key: 'timeBound',
            label: 'Time-Bound',
            icon: Calendar,
            color: 'red',
            placeholder: 'When will you achieve this? (e.g., "Within 16 weeks")',
            description: 'Specific deadline or timeframe'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'border-blue-500/30 bg-blue-900/20 text-blue-400',
            green: 'border-green-500/30 bg-green-900/20 text-green-400',
            yellow: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-400',
            purple: 'border-purple-500/30 bg-purple-900/20 text-purple-400',
            red: 'border-red-500/30 bg-red-900/20 text-red-400'
        };
        return colors[color] || colors.blue;
    };

    const calculateCompleteness = () => {
        const goals = assessmentData.smartGoals;
        const completed = Object.values(goals).filter(value => value && value.trim().length > 0).length;
        return (completed / 5) * 100;
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="text-xl font-semibold text-white">SMART Goals Framework</h3>
                    <p className="text-gray-400">Define clear, actionable goals using the SMART criteria</p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Goal Completion</span>
                    <span className="text-sm text-green-400 font-medium">{Math.round(calculateCompleteness())}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateCompleteness()}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                {smartCriteria.map((criterion) => {
                    const IconComponent = criterion.icon;
                    return (
                        <div
                            key={criterion.key}
                            className={`border rounded-lg p-4 ${getColorClasses(criterion.color)}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <IconComponent className="h-4 w-4" />
                                <h4 className="font-semibold">{criterion.label}</h4>
                                <span className="text-xs opacity-75">({criterion.description})</span>
                            </div>

                            <textarea
                                value={assessmentData.smartGoals[criterion.key]}
                                onChange={(e) => handleNestedChange('smartGoals', criterion.key, e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                placeholder={criterion.placeholder}
                                rows={2}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Goal Summary */}
            {calculateCompleteness() > 80 && (
                <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-green-400 mb-3">Your SMART Goal Summary</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>
                            <strong>Goal:</strong> {assessmentData.smartGoals.specific}
                        </p>
                        <p>
                            <strong>Target:</strong> {assessmentData.smartGoals.measurable}
                        </p>
                        <p>
                            <strong>Timeline:</strong> {assessmentData.smartGoals.timeBound}
                        </p>
                        <p>
                            <strong>Motivation:</strong> {assessmentData.smartGoals.relevant}
                        </p>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h4 className="text-md font-semibold text-white mb-2">SMART Goal Tips</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Be specific about what you want to achieve</li>
                    <li>• Use numbers to make goals measurable</li>
                    <li>• Set challenging but realistic targets</li>
                    <li>• Connect goals to your bigger why</li>
                    <li>• Set deadlines to create urgency</li>
                </ul>
            </div>
        </div>
    );
};

export default SmartGoalsStep;
