import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

/**
 * PHA Health Screen Step Component
 * Step 5 of 12-step workflow - Bryant-specific health screening
 * Based on ACSM guidelines and Bryant Periodization requirements
 */
const PHAHealthScreenStep = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const { state, actions } = useProgramContext();
    const [responses, setResponses] = useState({
        // Cardiovascular Questions
        chestPain: '',
        shortBreath: '',
        dizziness: '',
        heartMurmur: '',
        bloodPressure: '',
        medications: '',

        // Orthopedic Questions
        boneJointProblems: '',
        currentInjuries: '',
        recentSurgery: '',
        chronicPain: '',

        // Bryant-Specific Questions
        tacticalExperience: '',
        intensityTolerance: '',
        equipmentAccess: '',
        trainingEnvironment: ''
    });

    const [riskAssessment, setRiskAssessment] = useState(null);

    // PHA Health Screening Questions based on Bryant requirements
    const phaQuestions = [
        {
            category: 'Cardiovascular Health',
            icon: '❤️',
            questions: [
                {
                    id: 'chestPain',
                    question: 'Have you ever experienced chest pain during or after exercise?',
                    type: 'yesno',
                    risk: 'high'
                },
                {
                    id: 'shortBreath',
                    question: 'Do you experience unusual shortness of breath during mild exertion?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'dizziness',
                    question: 'Have you experienced dizziness or fainting during exercise?',
                    type: 'yesno',
                    risk: 'high'
                },
                {
                    id: 'heartMurmur',
                    question: 'Has a doctor ever told you that you have a heart murmur?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'bloodPressure',
                    question: 'Has a doctor ever told you that your blood pressure is too high?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'medications',
                    question: 'Are you currently taking any medications for heart conditions?',
                    type: 'yesno',
                    risk: 'medium'
                }
            ]
        },
        {
            category: 'Musculoskeletal Health',
            icon: '🦴',
            questions: [
                {
                    id: 'boneJointProblems',
                    question: 'Do you have any bone or joint problems that might worsen with activity?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'currentInjuries',
                    question: 'Do you have any current injuries affecting your movement?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'recentSurgery',
                    question: 'Have you had any surgery in the past 6 months?',
                    type: 'yesno',
                    risk: 'medium'
                },
                {
                    id: 'chronicPain',
                    question: 'Do you experience chronic pain that affects daily activities?',
                    type: 'yesno',
                    risk: 'medium'
                }
            ]
        },
        {
            category: 'Bryant Training Readiness',
            icon: '🎯',
            questions: [
                {
                    id: 'tacticalExperience',
                    question: 'Do you have experience with tactical or military-style training?',
                    type: 'select',
                    options: ['None', 'Some', 'Moderate', 'Extensive'],
                    risk: 'info'
                },
                {
                    id: 'intensityTolerance',
                    question: 'How well do you tolerate high-intensity training?',
                    type: 'select',
                    options: ['Poor', 'Fair', 'Good', 'Excellent'],
                    risk: 'info'
                },
                {
                    id: 'equipmentAccess',
                    question: 'Do you have access to specialized equipment (sleds, ropes, etc.)?',
                    type: 'yesno',
                    risk: 'info'
                },
                {
                    id: 'trainingEnvironment',
                    question: 'What is your primary training environment?',
                    type: 'select',
                    options: ['Home gym', 'Commercial gym', 'Outdoor space', 'Tactical facility'],
                    risk: 'info'
                }
            ]
        }
    ];

    // Assess risk level based on responses
    const assessRisk = () => {
        let highRiskCount = 0;
        let mediumRiskCount = 0;
        let totalAnswered = 0;

        phaQuestions.forEach(category => {
            category.questions.forEach(q => {
                const response = responses[q.id];
                if (response) {
                    totalAnswered++;
                    if (q.type === 'yesno' && response === 'yes') {
                        if (q.risk === 'high') highRiskCount++;
                        else if (q.risk === 'medium') mediumRiskCount++;
                    }
                }
            });
        });

        let riskLevel = 'low';
        let recommendations = [];
        let restrictions = [];

        if (highRiskCount > 0) {
            riskLevel = 'high';
            recommendations.push('Medical clearance required before starting any exercise program');
            recommendations.push('Consult with physician before Bryant-specific training');
            restrictions.push('No high-intensity training until cleared');
            restrictions.push('No tactical applications until medical approval');
        } else if (mediumRiskCount >= 2) {
            riskLevel = 'medium';
            recommendations.push('Consider medical consultation');
            recommendations.push('Start with lower intensity and progress gradually');
            restrictions.push('Modified Bryant protocols may be needed');
        } else {
            riskLevel = 'low';
            recommendations.push('Cleared for Bryant periodization training');
            recommendations.push('Can progress to full intensity protocols');
        }

        // Bryant-specific recommendations
        const tacticalExp = responses.tacticalExperience;
        const intensityTol = responses.intensityTolerance;

        if (tacticalExp === 'None' || intensityTol === 'Poor') {
            recommendations.push('Recommend preparatory phase before Bryant methods');
            recommendations.push('Focus on movement quality and conditioning base');
        } else if (tacticalExp === 'Extensive' && intensityTol === 'Excellent') {
            recommendations.push('Excellent candidate for full Bryant protocols');
            recommendations.push('Can implement advanced tactical applications');
        }

        const assessment = {
            riskLevel,
            recommendations,
            restrictions,
            highRiskCount,
            mediumRiskCount,
            totalAnswered,
            bryantCleared: riskLevel === 'low' && highRiskCount === 0,
            completeness: totalAnswered / phaQuestions.reduce((acc, cat) => acc + cat.questions.length, 0)
        };

        setRiskAssessment(assessment);
        return assessment;
    };

    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleComplete = () => {
        const assessment = assessRisk();

        // Save PHA results to program context
        actions.setProgramData({
            phaHealthScreen: {
                responses,
                assessment,
                completedAt: new Date().toISOString()
            }
        });

        if (onNext) onNext();
    };

    // Check if assessment is complete enough to proceed
    const isComplete = Object.keys(responses).filter(key => responses[key]).length >= 8;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h2 className="text-xl font-bold text-red-400 mb-2">
                    ❤️ PHA Health Screen - Bryant Training Readiness
                </h2>
                <p className="text-red-300 text-sm">
                    Physical Health Assessment to ensure safe participation in Bryant periodization training.
                    This screening is required before beginning high-intensity tactical protocols.
                </p>
            </div>

            {/* Screening Questions */}
            {phaQuestions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.category}
                    </h3>

                    <div className="space-y-4">
                        {category.questions.map((question, questionIndex) => (
                            <div key={question.id} className="bg-gray-700 rounded-lg p-4">
                                <label className="block text-white font-medium mb-2">
                                    {question.question}
                                    {question.risk === 'high' && (
                                        <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">
                                            HIGH RISK
                                        </span>
                                    )}
                                </label>

                                {question.type === 'yesno' ? (
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value="yes"
                                                checked={responses[question.id] === 'yes'}
                                                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-300">Yes</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value="no"
                                                checked={responses[question.id] === 'no'}
                                                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-300">No</span>
                                        </label>
                                    </div>
                                ) : (
                                    <select
                                        value={responses[question.id] || ''}
                                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                                        className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500"
                                    >
                                        <option value="">Select...</option>
                                        {question.options.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option.toLowerCase()}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Risk Assessment Results */}
            {riskAssessment && (
                <div className={`rounded-lg p-4 border ${riskAssessment.riskLevel === 'high'
                        ? 'bg-red-900/20 border-red-500/30'
                        : riskAssessment.riskLevel === 'medium'
                            ? 'bg-yellow-900/20 border-yellow-500/30'
                            : 'bg-green-900/20 border-green-500/30'
                    }`}>
                    <h3 className={`text-lg font-semibold mb-3 ${riskAssessment.riskLevel === 'high'
                            ? 'text-red-400'
                            : riskAssessment.riskLevel === 'medium'
                                ? 'text-yellow-400'
                                : 'text-green-400'
                        }`}>
                        Risk Assessment: {riskAssessment.riskLevel.toUpperCase()} RISK
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <h4 className="font-medium text-white mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {riskAssessment.recommendations.map((rec, index) => (
                                    <li key={index} className="text-gray-300 text-sm">{rec}</li>
                                ))}
                            </ul>
                        </div>

                        {riskAssessment.restrictions.length > 0 && (
                            <div>
                                <h4 className="font-medium text-white mb-2">Restrictions:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {riskAssessment.restrictions.map((restriction, index) => (
                                        <li key={index} className="text-red-300 text-sm">{restriction}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="text-sm text-gray-400">
                            Bryant Training Cleared: {riskAssessment.bryantCleared ? '✅ Yes' : '❌ No'}
                        </div>
                    </div>
                </div>
            )}

            {/* Assess Risk Button */}
            {!riskAssessment && isComplete && (
                <button
                    onClick={assessRisk}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Assess Health Risk
                </button>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous: Injury Screening
                </button>

                <button
                    onClick={handleComplete}
                    disabled={!riskAssessment || !canGoNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next: Gainer Type
                </button>
            </div>
        </div>
    );
};

export default PHAHealthScreenStep;
