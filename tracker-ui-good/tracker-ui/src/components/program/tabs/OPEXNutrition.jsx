import React, { useState, useEffect } from 'react';
import {
    Heart,
    Sun,
    Droplets,
    Moon,
    Activity,
    Apple,
    Scale,
    Clock,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Lock,
    Unlock,
    BarChart3,
    Calendar
} from 'lucide-react';
import { useAssessment } from '../../../hooks/useAssessment';

const OPEXNutrition = ({ onDataUpdate }) => {
    const {
        assessBLGs,
        assessFuel,
        assessPersonalization,
        calculateTDEE,
        calculateMacros,
        saveNutritionAssessment
    } = useAssessment();

    // Use safe context access similar to GoalsAndNeeds
    const [activeTab, setActiveTab] = useState('consultation');
    const [blgsData, setBLGsData] = useState({
        workHours: 8,
        restQuality: 5,
        bodyWeight: 70,
        waterIntake: 35,
        sleepHours: 7,
        fallAsleepTime: 15,
        sleepQuality: 5,
        sunExposure: 15,
        outdoorTime: 20,
        bowelMovements: 1,
        bowelQuality: 3,
        dailyMovement: 30,
        recoveryActivities: false,
        mindfulEating: false,
        chewingTime: 15,
        lifeFullness: 5,
        stressBucket: 5
    });

    const [fuelData, setFuelData] = useState({
        processedMeals: 3,
        wholeFoods: 5,
        mealConsistency: 5,
        nutritionAwareness: 5,
        activity: 'sustain',
        chronotype: 'normal',
        goals: [],
        stats: {
            weight: 70,
            height: 175,
            age: 30,
            gender: 'male',
            bodyFat: 15,
            activityLevel: 'moderately_active'
        }
    });

    const [personData, setPersonData] = useState({
        age: 30,
        lifeStage: 'growth',
        fastingExperience: false,
        aversions: [],
        symptoms: [],
        goals: []
    });

    // Calculate BLGs assessment
    const [blgsAssessment, setBLGsAssessment] = useState(null);
    const [fuelAssessment, setFuelAssessment] = useState(null);
    const [personAssessment, setPersonAssessment] = useState(null);

    useEffect(() => {
        if (assessBLGs && blgsData) {
            try {
                const assessment = assessBLGs(blgsData);
                setBLGsAssessment(assessment);
            } catch (error) {
                console.warn('BLGs assessment error:', error);
            }
        }
    }, [blgsData, assessBLGs]);

    useEffect(() => {
        if (blgsAssessment && assessFuel) {
            try {
                // Mock gainer type and biomotor data for now
                const mockGainerType = { type: 'Fast Gainer' };
                const mockBiomotor = { strength: 6, power: 5, endurance: 7 };

                const assessment = assessFuel(
                    fuelData,
                    blgsAssessment.percentage,
                    mockGainerType,
                    mockBiomotor
                );
                setFuelAssessment(assessment);
            } catch (error) {
                console.warn('Fuel assessment error:', error);
            }
        }
    }, [fuelData, blgsAssessment, assessFuel]);

    useEffect(() => {
        if (blgsAssessment && fuelAssessment && !fuelAssessment.blocked && assessPersonalization) {
            try {
                const assessment = assessPersonalization(
                    personData,
                    blgsAssessment.percentage,
                    fuelAssessment.profile
                );
                setPersonAssessment(assessment);
            } catch (error) {
                console.warn('Personalization assessment error:', error);
            }
        }
    }, [personData, blgsAssessment, fuelAssessment, assessPersonalization]);

    const tabs = [
        {
            id: 'consultation',
            label: 'BLGs Consultation',
            icon: Heart,
            unlocked: true
        },
        {
            id: 'fuel',
            label: 'Fuel Assessment',
            icon: Apple,
            unlocked: blgsAssessment?.percentage >= 55
        },
        {
            id: 'person',
            label: 'Personalization',
            icon: Target,
            unlocked: blgsAssessment?.percentage >= 70 && fuelAssessment?.profile && ['Optimal', 'Highest'].includes(fuelAssessment.profile)
        }
    ];

    const handleSave = async () => {
        try {
            const nutritionData = {
                blgs: blgsAssessment,
                fuel: fuelAssessment,
                person: personAssessment,
                completedAt: new Date().toISOString()
            };

            if (saveNutritionAssessment) {
                const result = await saveNutritionAssessment(nutritionData);
                if (result.success && onDataUpdate) {
                    onDataUpdate(nutritionData);
                }
            } else if (onDataUpdate) {
                onDataUpdate(nutritionData);
            }
        } catch (error) {
            console.error('Error saving nutrition assessment:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">OPEX Nutrition Assessment</h2>
                    <p className="text-gray-400">Master the hierarchy: Consultation → Fuel → Person</p>
                </div>

                {blgsAssessment && (
                    <div className="text-right">
                        <div className="text-sm text-gray-400">BLGs Score</div>
                        <div className={`text-2xl font-bold ${blgsAssessment.percentage >= 85 ? 'text-green-500' :
                            blgsAssessment.percentage >= 70 ? 'text-yellow-500' :
                                blgsAssessment.percentage >= 55 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            {Math.round(blgsAssessment.percentage)}%
                        </div>
                        <div className="text-sm text-gray-300">{blgsAssessment.tier}</div>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">OPEX Hierarchy Progress</span>
                    <span className="text-sm text-gray-400">
                        {tabs.filter(tab => tab.unlocked).length} / {tabs.length} unlocked
                    </span>
                </div>
                <div className="flex space-x-2">
                    {tabs.map((tab, index) => (
                        <div
                            key={tab.id}
                            className={`flex-1 h-2 rounded ${tab.unlocked ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => tab.unlocked && setActiveTab(tab.id)}
                        disabled={!tab.unlocked}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : tab.unlocked
                                ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                                : 'text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {tab.unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'consultation' && (
                <BLGsConsultationTab
                    data={blgsData}
                    setData={setBLGsData}
                    assessment={blgsAssessment}
                />
            )}

            {activeTab === 'fuel' && (
                <FuelAssessmentTab
                    data={fuelData}
                    setData={setFuelData}
                    assessment={fuelAssessment}
                    blgsScore={blgsAssessment?.percentage}
                />
            )}

            {activeTab === 'person' && (
                <PersonalizationTab
                    data={personData}
                    setData={setPersonData}
                    assessment={personAssessment}
                    prerequisites={{ blgs: blgsAssessment?.percentage, fuel: fuelAssessment?.profile }}
                />
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <CheckCircle className="h-4 w-4" />
                    Save OPEX Assessment
                </button>
            </div>
        </div>
    );
};

// BLGs Consultation Tab Component
const BLGsConsultationTab = ({ data, setData, assessment }) => {
    const blgsRules = [
        {
            key: 'workRest',
            title: '24hr Work/Rest Balance',
            icon: Clock,
            description: 'Maintain healthy work-life boundaries',
            fields: [
                { key: 'workHours', label: 'Work Hours/Day', type: 'number', min: 0, max: 24 },
                { key: 'restQuality', label: 'Rest Quality (1-10)', type: 'range', min: 1, max: 10 }
            ]
        },
        {
            key: 'water',
            title: 'Water = 1/2 Body Weight (oz)',
            icon: Droplets,
            description: 'Optimal hydration for cellular function',
            fields: [
                { key: 'bodyWeight', label: 'Body Weight (kg)', type: 'number', min: 30, max: 200 },
                { key: 'waterIntake', label: 'Daily Water (oz)', type: 'number', min: 0, max: 200 }
            ]
        },
        {
            key: 'sleep',
            title: 'Consistent Sleep/Wake Cycle',
            icon: Moon,
            description: 'Circadian rhythm optimization',
            fields: [
                { key: 'sleepHours', label: 'Sleep Hours', type: 'number', min: 4, max: 12, step: 0.5 },
                { key: 'fallAsleepTime', label: 'Fall Asleep Time (min)', type: 'number', min: 0, max: 120 },
                { key: 'sleepQuality', label: 'Sleep Quality (1-10)', type: 'range', min: 1, max: 10 }
            ]
        },
        {
            key: 'sun',
            title: 'Sun Exposure & Moon Sleep',
            icon: Sun,
            description: 'Natural light regulation',
            fields: [
                { key: 'sunExposure', label: 'Sun Exposure (min/day)', type: 'number', min: 0, max: 120 },
                { key: 'outdoorTime', label: 'Outdoor Time (min/day)', type: 'number', min: 0, max: 480 }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Assessment Overview */}
            {assessment && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">BLGs Assessment Results</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${assessment.tier === 'Mastery' ? 'bg-green-900 text-green-300' :
                            assessment.tier === 'Proficient' ? 'bg-yellow-900 text-yellow-300' :
                                assessment.tier === 'Developing' ? 'bg-orange-900 text-orange-300' :
                                    'bg-red-900 text-red-300'
                            }`}>
                            {assessment.tier}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {Object.entries(assessment.scores).map(([key, score]) => (
                            <div key={key} className="text-center">
                                <div className="text-2xl font-bold text-white">{score.score}</div>
                                <div className="text-sm text-gray-400">/{score.max}</div>
                                <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            </div>
                        ))}
                    </div>

                    {/* Suggestions */}
                    {assessment.suggestions && assessment.suggestions.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-white">Improvement Suggestions</h4>
                            {assessment.suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                        <span className="font-medium text-white">{suggestion.category}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${suggestion.priority === 'High' ? 'bg-red-900 text-red-300' :
                                            suggestion.priority === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-green-900 text-green-300'
                                            }`}>
                                            {suggestion.priority}
                                        </span>
                                    </div>
                                    <ul className="space-y-1">
                                        {suggestion.recommendations.map((rec, i) => (
                                            <li key={i} className="text-sm text-gray-300">• {rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* BLGs Rules Assessment */}
            <div className="grid gap-6">
                {blgsRules.map((rule) => (
                    <div key={rule.key} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <rule.icon className="h-6 w-6 text-blue-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
                                <p className="text-sm text-gray-400">{rule.description}</p>
                            </div>
                            {assessment && assessment.scores && assessment.scores[rule.key] && (
                                <div className="ml-auto text-right">
                                    <div className="text-lg font-bold text-white">
                                        {assessment.scores[rule.key]?.score || 0}/10
                                    </div>
                                    {rule.key === 'water' && assessment.scores.water?.target && (
                                        <div className="text-xs text-gray-400">
                                            Target: {Math.round(assessment.scores.water.target)}oz
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {rule.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {field.label}
                                    </label>
                                    {field.type === 'range' ? (
                                        <div>
                                            <input
                                                type="range"
                                                min={field.min}
                                                max={field.max}
                                                step={field.step || 1}
                                                value={data[field.key]}
                                                onChange={(e) => setData(prev => ({
                                                    ...prev,
                                                    [field.key]: parseFloat(e.target.value)
                                                }))}
                                                className="custom-styled w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-sm text-gray-400 mt-1">
                                                <span>{field.min}</span>
                                                <span className="font-medium text-white">{data[field.key]}</span>
                                                <span>{field.max}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            min={field.min}
                                            max={field.max}
                                            step={field.step || 1}
                                            value={data[field.key]}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                [field.key]: field.type === 'number' ?
                                                    parseFloat(e.target.value) || 0 : e.target.value
                                            }))}
                                            className="custom-styled w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Simplified Fuel Assessment Tab
const FuelAssessmentTab = ({ data, setData, assessment, blgsScore }) => {
    if (assessment?.blocked) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Fuel Assessment Locked</h3>
                <p className="text-gray-400 mb-4">{assessment.message}</p>
                <div className="space-y-2">
                    {assessment.unlockRequirements && assessment.unlockRequirements.map((req, index) => (
                        <div key={index} className="text-sm text-gray-300">• {req}</div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Fuel Quality Assessment</h3>
                <p className="text-gray-400 mb-6">
                    Evaluate your current nutrition profile to determine your fuel tier and unlock advanced protocols.
                </p>

                {/* Basic Fuel Assessment */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Processed Meals per Day
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={data.processedMeals}
                            onChange={(e) => setData(prev => ({
                                ...prev,
                                processedMeals: parseInt(e.target.value)
                            }))}
                            className="custom-styled w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>None</span>
                            <span className="font-medium text-white">{data.processedMeals}</span>
                            <span>All meals</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Whole Food Quality (1-10)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={data.wholeFoods}
                            onChange={(e) => setData(prev => ({
                                ...prev,
                                wholeFoods: parseInt(e.target.value)
                            }))}
                            className="custom-styled w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>Poor</span>
                            <span className="font-medium text-white">{data.wholeFoods}</span>
                            <span>Excellent</span>
                        </div>
                    </div>
                </div>

                {/* Assessment Results */}
                {assessment && !assessment.blocked && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">Current Fuel Profile</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${assessment.profile === 'Highest' ? 'bg-purple-900 text-purple-300' :
                                assessment.profile === 'Optimal' ? 'bg-green-900 text-green-300' :
                                    assessment.profile === 'Adequate' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-red-900 text-red-300'
                                }`}>
                                {assessment.profile}
                            </span>
                        </div>

                        {assessment.tdee && (
                            <div className="text-sm text-gray-300">
                                Estimated TDEE: <span className="font-bold text-white">{assessment.tdee.total}</span> calories
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simplified Personalization Tab
const PersonalizationTab = ({ data, setData, assessment, prerequisites }) => {
    if (assessment?.blocked) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Personalization Locked</h3>
                <p className="text-gray-400 mb-4">{assessment.message}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">BLGs Score:</span> {Math.round(prerequisites.blgs || 0)}%
                        <span className="text-gray-500">(Need 70%+)</span>
                    </div>
                    <div>
                        <span className="font-medium">Fuel Profile:</span> {prerequisites.fuel || 'Not assessed'}
                        <span className="text-gray-500">(Need Optimal+)</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Personalization</h3>
                <p className="text-gray-400 mb-6">
                    Unlock advanced protocols including deloading, elimination testing, and life stage optimization.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Primary Life Goal
                        </label>
                        <textarea
                            value={data.primaryLifeGoal || ''}
                            onChange={(e) => setData(prev => ({
                                ...prev,
                                primaryLifeGoal: e.target.value
                            }))}
                            className="custom-styled w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="What is your highest order goal in life?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cognitive Priorities
                        </label>
                        <div className="grid md:grid-cols-2 gap-2">
                            {['Mental Clarity', 'Focus', 'Memory', 'Creativity', 'Decision Making', 'Stress Resilience'].map((priority) => (
                                <label key={priority} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={data.cognitivePriorities?.includes(priority) || false}
                                        onChange={(e) => {
                                            const priorities = data.cognitivePriorities || [];
                                            if (e.target.checked) {
                                                setData(prev => ({
                                                    ...prev,
                                                    cognitivePriorities: [...priorities, priority]
                                                }));
                                            } else {
                                                setData(prev => ({
                                                    ...prev,
                                                    cognitivePriorities: priorities.filter(p => p !== priority)
                                                }));
                                            }
                                        }}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    {priority}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OPEXNutrition;
