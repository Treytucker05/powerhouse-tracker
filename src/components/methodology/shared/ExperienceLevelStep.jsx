import React, { useState } from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import { User, TrendingUp, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const ExperienceLevelStep = () => {
    const { state, actions } = useNASM();
    const [experienceData, setExperienceData] = useState({
        level: state.experienceLevel || '',
        trainingAge: state.trainingAge || '',
        recoveryCapacity: state.recoveryCapacity || '',
        specificExperience: {
            resistance: '',
            cardio: '',
            flexibility: '',
            balance: '',
            corrective: ''
        },
        exerciseFrequency: '',
        currentFitnessLevel: ''
    });

    const experienceLevels = [
        {
            id: 'beginner',
            name: 'Beginner',
            description: 'New to structured exercise or returning after extended break',
            trainingAge: '< 6 months',
            considerations: [
                'Focus on movement quality and basic patterns',
                'Emphasis on Phase 1 OPT (Stabilization)',
                'Conservative progression approach',
                'Extensive education on proper form'
            ],
            nasmRecommendation: 'Extended Phase 1 focus with movement education'
        },
        {
            id: 'intermediate',
            name: 'Intermediate',
            description: 'Consistent training experience with good movement foundation',
            trainingAge: '6 months - 2 years',
            considerations: [
                'Can progress through Phase 1-3 systematically',
                'Moderate training loads and complexity',
                'Some experience with various exercise modalities',
                'Understanding of basic training principles'
            ],
            nasmRecommendation: 'Standard OPT progression based on assessment'
        },
        {
            id: 'advanced',
            name: 'Advanced',
            description: 'Extensive training background with multiple methodologies',
            trainingAge: '2+ years',
            considerations: [
                'Can handle higher training volumes and intensity',
                'May progress to Phase 4-5 if appropriate',
                'Complex movement patterns and advanced techniques',
                'Self-awareness of training responses'
            ],
            nasmRecommendation: 'Assessment-based phase selection, may skip Phase 1'
        }
    ];

    const recoveryOptions = [
        {
            id: 'excellent',
            name: 'Excellent',
            description: 'Recover quickly, minimal fatigue between sessions',
            implications: 'Can handle higher frequency and volume'
        },
        {
            id: 'good',
            name: 'Good',
            description: 'Generally recover well with adequate rest',
            implications: 'Standard recovery protocols'
        },
        {
            id: 'moderate',
            name: 'Moderate',
            description: 'Sometimes feel fatigued, need adequate recovery',
            implications: 'Conservative progression, extra recovery time'
        },
        {
            id: 'poor',
            name: 'Poor',
            description: 'Often feel tired, slow to recover from exercise',
            implications: 'Extended recovery periods, lower initial volume'
        }
    ];

    const handleLevelSelect = (levelId) => {
        const selectedLevel = experienceLevels.find(level => level.id === levelId);
        setExperienceData(prev => ({
            ...prev,
            level: levelId
        }));
    };

    const handleInputChange = (field, value) => {
        setExperienceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSpecificExperienceChange = (area, value) => {
        setExperienceData(prev => ({
            ...prev,
            specificExperience: {
                ...prev.specificExperience,
                [area]: value
            }
        }));
    };

    const isComplete = () => {
        return experienceData.level &&
            experienceData.trainingAge &&
            experienceData.recoveryCapacity &&
            experienceData.exerciseFrequency &&
            experienceData.currentFitnessLevel;
    };

    const handleContinue = () => {
        if (isComplete()) {
            actions.setExperienceLevel(
                experienceData.level,
                experienceData.trainingAge,
                experienceData.recoveryCapacity
            );

            // Include all experience data in the context
            actions.setExperienceData && actions.setExperienceData(experienceData);

            actions.setCurrentStep(4, 'timeline');
        }
    };

    const getSelectedLevel = () => {
        return experienceLevels.find(level => level.id === experienceData.level);
    };

    const getNASMImplications = () => {
        const selectedLevel = getSelectedLevel();
        if (!selectedLevel) return null;

        return {
            level: selectedLevel,
            phaseRecommendation: getPhaseRecommendation(selectedLevel.id),
            considerations: selectedLevel.considerations,
            nasmRecommendation: selectedLevel.nasmRecommendation
        };
    };

    const getPhaseRecommendation = (levelId) => {
        switch (levelId) {
            case 'beginner':
                return 'Start with Phase 1 (Stabilization) for 6-8 weeks minimum';
            case 'intermediate':
                return 'Begin with Phase 1, progress based on movement assessment';
            case 'advanced':
                return 'Assessment-dependent, may begin with Phase 2 or higher';
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                    </div>
                    <User className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">Experience Level Assessment</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Your exercise background determines your starting point in the NASM OPT Model and progression strategy.
                </p>
            </div>

            {/* Current Goal Context */}
            {state.goalFramework && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 text-center">
                    <div className="text-blue-300 font-medium mb-1">Selected Goal</div>
                    <div className="text-white text-lg">{state.goalFramework.name}</div>
                    <div className="text-blue-200 text-sm mt-1">
                        OPT Phases: {state.goalFramework.phases.map(p => `Phase ${p}`).join(', ')}
                    </div>
                </div>
            )}

            {/* Experience Level Selection */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Select Your Experience Level</h3>

                <div className="grid grid-cols-1 gap-4">
                    {experienceLevels.map((level) => (
                        <div
                            key={level.id}
                            className={`cursor-pointer transition-all duration-200 rounded-lg border-2 p-6 ${experienceData.level === level.id
                                    ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20'
                                    : 'border-gray-600 bg-gray-700 hover:border-blue-400'
                                }`}
                            onClick={() => handleLevelSelect(level.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="text-xl font-bold text-white">{level.name}</h4>
                                    <p className="text-gray-300 mt-1">{level.description}</p>
                                    <div className="text-blue-400 text-sm mt-2">
                                        Typical Training Age: {level.trainingAge}
                                    </div>
                                </div>
                                {experienceData.level === level.id && (
                                    <CheckCircle className="h-6 w-6 text-green-400" />
                                )}
                            </div>

                            <div className="bg-gray-800 rounded p-4 mt-4">
                                <div className="text-blue-300 font-medium mb-2">NASM Considerations:</div>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    {level.considerations.map((consideration, index) => (
                                        <li key={index}>• {consideration}</li>
                                    ))}
                                </ul>
                                <div className="mt-3 p-3 bg-blue-900/30 rounded">
                                    <div className="text-blue-200 text-sm font-medium">
                                        Recommendation: {level.nasmRecommendation}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Information */}
            {experienceData.level && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Additional Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-blue-300 font-medium mb-2">Specific Training Age</label>
                                <input
                                    type="text"
                                    value={experienceData.trainingAge}
                                    onChange={(e) => handleInputChange('trainingAge', e.target.value)}
                                    placeholder="e.g., 1 year, 6 months, etc."
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-blue-300 font-medium mb-2">Current Exercise Frequency</label>
                                <select
                                    value={experienceData.exerciseFrequency}
                                    onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select frequency...</option>
                                    <option value="rarely">Rarely (less than 1x/week)</option>
                                    <option value="1-2-times">1-2 times per week</option>
                                    <option value="3-4-times">3-4 times per week</option>
                                    <option value="5-6-times">5-6 times per week</option>
                                    <option value="daily">Daily or more</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-blue-300 font-medium mb-2">Current Fitness Level</label>
                                <select
                                    value={experienceData.currentFitnessLevel}
                                    onChange={(e) => handleInputChange('currentFitnessLevel', e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select fitness level...</option>
                                    <option value="low">Low (easily winded, limited strength)</option>
                                    <option value="below-average">Below Average (some fitness, needs improvement)</option>
                                    <option value="average">Average (decent fitness for daily activities)</option>
                                    <option value="above-average">Above Average (good fitness, active lifestyle)</option>
                                    <option value="high">High (very fit, athletic capabilities)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-blue-300 font-medium mb-3">Recovery Capacity</label>
                            <div className="space-y-3">
                                {recoveryOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`cursor-pointer p-4 rounded-lg border transition-colors ${experienceData.recoveryCapacity === option.id
                                                ? 'border-blue-500 bg-blue-900/30'
                                                : 'border-gray-600 bg-gray-800 hover:border-blue-400'
                                            }`}
                                        onClick={() => handleInputChange('recoveryCapacity', option.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-medium">{option.name}</div>
                                                <div className="text-gray-300 text-sm mt-1">{option.description}</div>
                                                <div className="text-blue-400 text-xs mt-2">{option.implications}</div>
                                            </div>
                                            {experienceData.recoveryCapacity === option.id && (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NASM Implications */}
            {getNASMImplications() && (
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-xl font-bold text-yellow-300">NASM OPT Implications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-yellow-200 font-medium mb-2">Recommended Starting Point</h4>
                            <p className="text-yellow-100">{getPhaseRecommendation(experienceData.level)}</p>
                        </div>

                        <div>
                            <h4 className="text-yellow-200 font-medium mb-2">Assessment Focus</h4>
                            <p className="text-yellow-100">
                                {experienceData.level === 'beginner' && 'Emphasis on movement quality and basic patterns'}
                                {experienceData.level === 'intermediate' && 'Balanced assessment of all movement patterns'}
                                {experienceData.level === 'advanced' && 'Focus on advanced movement patterns and performance'}
                            </p>
                        </div>
                    </div>

                    {experienceData.recoveryCapacity === 'poor' && (
                        <div className="mt-4 p-4 bg-red-900/30 border border-red-600 rounded">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                <span className="text-red-300 font-medium">Recovery Consideration</span>
                            </div>
                            <p className="text-red-200 text-sm">
                                Poor recovery capacity suggests starting with lower volume and longer rest periods.
                                Extended Phase 1 duration recommended.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
                <button
                    onClick={() => actions.setCurrentStep(2, 'goal-selection')}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                    ← Back to Goals
                </button>

                <button
                    onClick={handleContinue}
                    disabled={!isComplete()}
                    className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${isComplete()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Continue to Timeline
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>

            {/* Progress */}
            <div className="text-center text-sm text-gray-400">
                Step 3 of 8: Experience Level Assessment
            </div>
        </div>
    );
};

export default ExperienceLevelStep;
