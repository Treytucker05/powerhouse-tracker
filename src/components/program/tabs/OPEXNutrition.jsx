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

const OPEXNutrition = ({ onDataUpdate }) => {
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
        hydrationQuality: 5,
        exerciseHours: 5,
        stressLevel: 5,
        emergencyStressors: false,
        primaryStressor: '',
        stressManagement: ''
    });

    const [fuelData, setFuelData] = useState({
        currentNutrition: '',
        specificActions: '',
        mentalEnergyChanges: '',
        bodyChanges: '',
        performanceChanges: '',
        hungerPatterns: '',
        foodRelationship: '',
        eatingWhen: '',
        stressEating: '',
        socialEating: '',
        foodPreparation: '',
        supplementation: '',
        hydrationHabits: '',
        foodQuality: '',
        eliminationFoods: ''
    });

    const [personalizationData, setPersonalizationData] = useState({
        primaryGoals: [],
        secondaryGoals: [],
        bodyComposition: '',
        performanceMetrics: '',
        bloodwork: '',
        gutHealth: '',
        hormoneHealth: '',
        stressResponse: '',
        sleepOptimization: '',
        nutritionPreferences: '',
        foodAllergies: '',
        supplementNeeds: '',
        lifestyleFactors: ''
    });

    const [results, setResults] = useState({
        blgsScore: 0,
        fuelAssessment: '',
        personalizationLevel: '',
        recommendations: [],
        tdee: 0,
        macros: { protein: 0, carbs: 0, fats: 0 },
        timeline: ''
    });

    const [showResults, setShowResults] = useState(false);

    // BLGs Assessment Functions
    const assessBLGs = (data) => {
        let score = 0;
        let maxScore = 100;

        // Sleep Quality (20 points)
        if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 5;
        if (data.fallAsleepTime <= 15) score += 5;
        if (data.sleepQuality >= 4) score += 5;
        if (data.restQuality >= 4) score += 5;

        // Sunlight & Movement (20 points)
        if (data.sunExposure >= 10) score += 5;
        if (data.outdoorTime >= 15) score += 5;
        if (data.dailyMovement >= 30) score += 5;
        if (data.recoveryActivities) score += 5;

        // Gut Health (15 points)
        if (data.bowelMovements >= 1) score += 5;
        if (data.bowelQuality >= 3) score += 5;
        if (data.mindfulEating) score += 5;

        // Hydration (10 points)
        if (data.waterIntake >= 30) score += 5;
        if (data.hydrationQuality >= 4) score += 5;

        // Stress & Life Balance (15 points)
        if (data.lifeFullness >= 4) score += 5;
        if (data.stressLevel <= 6) score += 5;
        if (!data.emergencyStressors) score += 5;

        // Work-Life Balance (10 points)
        if (data.workHours <= 9) score += 5;
        if (data.exerciseHours >= 3) score += 5;

        // Body Weight Management (10 points)
        if (data.bodyWeight > 0) score += 10; // Basic check

        return Math.round((score / maxScore) * 100);
    };

    const assessFuel = (data) => {
        let assessment = 'Needs Assessment';
        let factors = [];

        // Analyze current nutrition patterns
        if (data.currentNutrition.toLowerCase().includes('processed')) {
            factors.push('High processed food intake detected');
        }
        if (data.hungerPatterns.toLowerCase().includes('irregular')) {
            factors.push('Irregular hunger patterns');
        }
        if (data.stressEating === 'yes') {
            factors.push('Stress eating patterns identified');
        }
        if (data.foodRelationship.toLowerCase().includes('difficult')) {
            factors.push('Challenging relationship with food');
        }

        if (factors.length === 0) {
            assessment = 'Good Foundation';
        } else if (factors.length <= 2) {
            assessment = 'Moderate Optimization Needed';
        } else {
            assessment = 'Significant Optimization Needed';
        }

        return { assessment, factors };
    };

    const assessPersonalization = (data) => {
        let level = 'Basic';
        let features = [];

        if (data.primaryGoals.length > 2) features.push('Multiple goal tracking');
        if (data.bloodwork) features.push('Biomarker optimization');
        if (data.hormoneHealth) features.push('Hormone optimization');
        if (data.gutHealth) features.push('Gut health protocols');
        if (data.performanceMetrics) features.push('Performance tracking');

        if (features.length >= 4) {
            level = 'Advanced';
        } else if (features.length >= 2) {
            level = 'Intermediate';
        }

        return { level, features };
    };

    const calculateTDEE = (weight, activityLevel = 1.5) => {
        // Simplified TDEE calculation
        const bmr = weight * 22; // Rough estimate
        return Math.round(bmr * activityLevel);
    };

    const calculateMacros = (tdee, goal = 'maintenance') => {
        let protein, carbs, fats;

        switch (goal) {
            case 'fat_loss':
                protein = Math.round((tdee * 0.3) / 4);
                fats = Math.round((tdee * 0.25) / 9);
                carbs = Math.round((tdee * 0.45) / 4);
                break;
            case 'muscle_gain':
                protein = Math.round((tdee * 0.25) / 4);
                fats = Math.round((tdee * 0.25) / 9);
                carbs = Math.round((tdee * 0.5) / 4);
                break;
            default: // maintenance
                protein = Math.round((tdee * 0.2) / 4);
                fats = Math.round((tdee * 0.3) / 9);
                carbs = Math.round((tdee * 0.5) / 4);
        }

        return { protein, carbs, fats };
    };

    const runCompleteAssessment = () => {
        const blgsScore = assessBLGs(blgsData);
        const fuelAssessment = assessFuel(fuelData);
        const personalizationLevel = assessPersonalization(personalizationData);

        const tdee = calculateTDEE(blgsData.bodyWeight, 1.5);
        const macros = calculateMacros(tdee, 'maintenance');

        const newResults = {
            blgsScore,
            fuelAssessment: fuelAssessment.assessment,
            fuelFactors: fuelAssessment.factors,
            personalizationLevel: personalizationLevel.level,
            personalizationFeatures: personalizationLevel.features,
            tdee,
            macros,
            recommendations: generateRecommendations(blgsScore, fuelAssessment, personalizationLevel),
            timeline: generateTimeline(blgsScore)
        };

        setResults(newResults);
        setShowResults(true);

        if (onDataUpdate) {
            onDataUpdate(newResults);
        }
    };

    const generateRecommendations = (blgsScore, fuelAssessment, personalizationLevel) => {
        const recommendations = [];

        if (blgsScore < 60) {
            recommendations.push('Focus on BLGs optimization first');
            recommendations.push('Establish consistent sleep schedule');
            recommendations.push('Increase daily movement and sunlight');
        }

        if (fuelAssessment.factors.length > 0) {
            recommendations.push('Address identified fuel optimization areas');
            recommendations.push('Work on stress eating patterns');
        }

        if (personalizationLevel.level === 'Basic') {
            recommendations.push('Start with fundamental nutrition principles');
        } else {
            recommendations.push('Implement advanced tracking and optimization');
        }

        return recommendations;
    };

    const generateTimeline = (blgsScore) => {
        if (blgsScore < 50) return '12-16 weeks for initial optimization';
        if (blgsScore < 70) return '8-12 weeks for moderate improvements';
        return '4-8 weeks for fine-tuning';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">OPEX Nutrition Assessment</h2>
                    <p className="text-gray-400">Comprehensive lifestyle and nutrition evaluation</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                {[
                    { id: 'consultation', label: 'BLGs Assessment', icon: Heart },
                    { id: 'fuel', label: 'Fuel Assessment', icon: Apple },
                    { id: 'personalization', label: 'Personalization', icon: Target },
                    { id: 'results', label: 'Results', icon: BarChart3 }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'consultation' && (
                <div className="space-y-6">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="text-blue-400 font-semibold mb-2">BLGs Assessment</h3>
                        <p className="text-blue-300 text-sm">
                            Assess your foundational lifestyle factors: Body care, Lifestyle, Grounding, and Sleep
                        </p>
                    </div>

                    {/* Sleep Assessment */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Moon className="w-5 h-5 mr-2" />
                            Sleep & Rest
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Sleep Hours per Night
                                </label>
                                <input
                                    type="number"
                                    value={blgsData.sleepHours}
                                    onChange={(e) => setBLGsData({ ...blgsData, sleepHours: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    min="0" max="12"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Time to Fall Asleep (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={blgsData.fallAsleepTime}
                                    onChange={(e) => setBLGsData({ ...blgsData, fallAsleepTime: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Complete Assessment Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={runCompleteAssessment}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Complete BLGs Assessment
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'fuel' && (
                <div className="space-y-6">
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <h3 className="text-green-400 font-semibold mb-2">Fuel Assessment</h3>
                        <p className="text-green-300 text-sm">
                            Evaluate your current nutrition patterns and relationship with food
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Nutrition Patterns</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Nutrition Approach
                                </label>
                                <textarea
                                    value={fuelData.currentNutrition}
                                    onChange={(e) => setFuelData({ ...fuelData, currentNutrition: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    rows="3"
                                    placeholder="Describe your current eating patterns..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'personalization' && (
                <div className="space-y-6">
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <h3 className="text-purple-400 font-semibold mb-2">Personalization Level</h3>
                        <p className="text-purple-300 text-sm">
                            Determine your specific needs and optimization opportunities
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Goals & Preferences</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Primary Goals (select all that apply)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['Fat Loss', 'Muscle Gain', 'Performance', 'Health', 'Energy', 'Recovery'].map(goal => (
                                        <label key={goal} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={personalizationData.primaryGoals.includes(goal)}
                                                onChange={(e) => {
                                                    const goals = e.target.checked
                                                        ? [...personalizationData.primaryGoals, goal]
                                                        : personalizationData.primaryGoals.filter(g => g !== goal);
                                                    setPersonalizationData({ ...personalizationData, primaryGoals: goals });
                                                }}
                                                className="rounded border-gray-600 bg-gray-700 text-blue-600"
                                            />
                                            <span className="text-gray-300 text-sm">{goal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'results' && showResults && (
                <div className="space-y-6">
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                        <h3 className="text-yellow-400 font-semibold mb-2">Assessment Results</h3>
                        <p className="text-yellow-300 text-sm">
                            Your personalized nutrition and lifestyle recommendations
                        </p>
                    </div>

                    {/* BLGs Score */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">BLGs Score</h4>
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl font-bold text-blue-400">{results.blgsScore}%</div>
                            <div className="flex-1">
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${results.blgsScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
                        <ul className="space-y-2">
                            {results.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Expected Timeline</h4>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-300">{results.timeline}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OPEXNutrition;
