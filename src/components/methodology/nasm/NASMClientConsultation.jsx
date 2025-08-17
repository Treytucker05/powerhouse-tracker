import React, { useState } from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import { CheckCircle, AlertTriangle, ArrowRight, ClipboardList, FileText, Users } from 'lucide-react';

const NASMClientConsultation = () => {
    const { state, actions } = useNASM();
    const [consultationData, setConsultationData] = useState({
        personalInfo: {
            fitnessGoals: '',
            currentActivityLevel: '',
            exercisePreferences: '',
            timeAvailability: ''
        },
        healthHistory: {
            currentInjuries: '',
            pastInjuries: '',
            medications: '',
            healthConditions: '',
            surgeries: ''
        },
        lifestyle: {
            stressLevel: '',
            sleepQuality: '',
            nutritionHabits: '',
            workDemands: '',
            familySupport: ''
        },
        motivationFactors: {
            intrinsicMotivators: [],
            extrinsicMotivators: [],
            barriers: [],
            successMeasures: []
        }
    });

    const [currentSection, setCurrentSection] = useState('personalInfo');
    const [isComplete, setIsComplete] = useState(false);

    const sections = [
        { id: 'personalInfo', name: 'Personal Info', icon: Users },
        { id: 'healthHistory', name: 'Health History', icon: FileText },
        { id: 'lifestyle', name: 'Lifestyle', icon: ClipboardList },
        { id: 'motivationFactors', name: 'Motivation', icon: CheckCircle }
    ];

    const handleInputChange = (section, field, value) => {
        setConsultationData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, field, values) => {
        setConsultationData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: values
            }
        }));
    };

    const isCurrentSectionComplete = () => {
        const section = consultationData[currentSection];
        if (currentSection === 'motivationFactors') {
            return section.intrinsicMotivators.length > 0 && section.successMeasures.length > 0;
        }
        return Object.values(section).every(value =>
            typeof value === 'string' ? value.trim() !== '' : true
        );
    };

    const isAllComplete = () => {
        return sections.every(section => {
            if (section.id === 'motivationFactors') {
                const motiv = consultationData[section.id];
                return motiv.intrinsicMotivators.length > 0 && motiv.successMeasures.length > 0;
            }
            return Object.values(consultationData[section.id]).every(value =>
                typeof value === 'string' ? value.trim() !== '' : true
            );
        });
    };

    const handleSectionComplete = () => {
        const currentIndex = sections.findIndex(s => s.id === currentSection);
        if (currentIndex < sections.length - 1) {
            setCurrentSection(sections[currentIndex + 1].id);
        } else {
            const allComplete = isAllComplete();
            setIsComplete(allComplete);
            if (allComplete) {
                actions.setClientConsultation(consultationData);
            }
        }
    };

    const handleContinue = () => {
        if (isComplete) {
            // Move to next step in NASM workflow (OPT Questionnaire)
            actions.setCurrentStep(5, 'opt-questionnaire');
        }
    };

    const motivationOptions = {
        intrinsic: [
            'Personal satisfaction',
            'Health improvement',
            'Self-confidence',
            'Stress relief',
            'Energy increase',
            'Mental clarity',
            'Physical capability',
            'Longevity'
        ],
        extrinsic: [
            'Weight loss goals',
            'Athletic performance',
            'Physical appearance',
            'Social recognition',
            'Competition preparation',
            'Medical requirements',
            'Professional demands',
            'Family expectations'
        ],
        barriers: [
            'Time constraints',
            'Financial limitations',
            'Lack of knowledge',
            'Fear of injury',
            'Past failures',
            'Social pressure',
            'Work demands',
            'Family obligations'
        ],
        measures: [
            'Weight changes',
            'Strength increases',
            'Energy levels',
            'Sleep quality',
            'Stress reduction',
            'Movement quality',
            'Pain reduction',
            'Daily function improvement'
        ]
    };

    const renderPersonalInfo = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Personal Information & Goals</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Primary Fitness Goals</label>
                    <textarea
                        value={consultationData.personalInfo.fitnessGoals}
                        onChange={(e) => handleInputChange('personalInfo', 'fitnessGoals', e.target.value)}
                        placeholder="Describe your main fitness objectives and what you hope to achieve..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Current Activity Level</label>
                    <select
                        value={consultationData.personalInfo.currentActivityLevel}
                        onChange={(e) => handleInputChange('personalInfo', 'currentActivityLevel', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select activity level...</option>
                        <option value="sedentary">Sedentary (little to no exercise)</option>
                        <option value="lightly-active">Lightly Active (1-3 days/week)</option>
                        <option value="moderately-active">Moderately Active (3-5 days/week)</option>
                        <option value="very-active">Very Active (6-7 days/week)</option>
                        <option value="extremely-active">Extremely Active (2x/day, intense training)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Exercise Preferences</label>
                    <textarea
                        value={consultationData.personalInfo.exercisePreferences}
                        onChange={(e) => handleInputChange('personalInfo', 'exercisePreferences', e.target.value)}
                        placeholder="What types of exercise do you enjoy? Any dislikes or concerns?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Time Availability</label>
                    <textarea
                        value={consultationData.personalInfo.timeAvailability}
                        onChange={(e) => handleInputChange('personalInfo', 'timeAvailability', e.target.value)}
                        placeholder="How much time can you dedicate to exercise? Include frequency and duration preferences..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );

    const renderHealthHistory = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Health History</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Current Injuries or Pain</label>
                    <textarea
                        value={consultationData.healthHistory.currentInjuries}
                        onChange={(e) => handleInputChange('healthHistory', 'currentInjuries', e.target.value)}
                        placeholder="Any current injuries, pain, or areas of concern?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Past Injuries or Surgeries</label>
                    <textarea
                        value={consultationData.healthHistory.pastInjuries}
                        onChange={(e) => handleInputChange('healthHistory', 'pastInjuries', e.target.value)}
                        placeholder="Previous injuries, surgeries, or rehabilitation history..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Current Medications</label>
                    <textarea
                        value={consultationData.healthHistory.medications}
                        onChange={(e) => handleInputChange('healthHistory', 'medications', e.target.value)}
                        placeholder="List any medications, supplements, or medical treatments..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Health Conditions</label>
                    <textarea
                        value={consultationData.healthHistory.healthConditions}
                        onChange={(e) => handleInputChange('healthHistory', 'healthConditions', e.target.value)}
                        placeholder="Any chronic conditions, medical diagnoses, or health concerns?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );

    const renderLifestyle = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Lifestyle Factors</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Stress Level</label>
                    <select
                        value={consultationData.lifestyle.stressLevel}
                        onChange={(e) => handleInputChange('lifestyle', 'stressLevel', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select stress level...</option>
                        <option value="low">Low (well-managed, minimal daily stress)</option>
                        <option value="moderate">Moderate (some daily stress, manageable)</option>
                        <option value="high">High (significant daily stress, challenging to manage)</option>
                        <option value="very-high">Very High (overwhelming stress, affecting daily life)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Sleep Quality</label>
                    <select
                        value={consultationData.lifestyle.sleepQuality}
                        onChange={(e) => handleInputChange('lifestyle', 'sleepQuality', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select sleep quality...</option>
                        <option value="excellent">Excellent (7-9 hours, restful, consistent)</option>
                        <option value="good">Good (6-8 hours, mostly restful)</option>
                        <option value="fair">Fair (5-7 hours, some sleep issues)</option>
                        <option value="poor">Poor (less than 6 hours, frequent disruptions)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Nutrition Habits</label>
                    <textarea
                        value={consultationData.lifestyle.nutritionHabits}
                        onChange={(e) => handleInputChange('lifestyle', 'nutritionHabits', e.target.value)}
                        placeholder="Describe your current eating patterns, meal frequency, food preferences..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Work/Life Demands</label>
                    <textarea
                        value={consultationData.lifestyle.workDemands}
                        onChange={(e) => handleInputChange('lifestyle', 'workDemands', e.target.value)}
                        placeholder="Describe your work schedule, physical demands, travel requirements..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );

    const renderMotivationFactors = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Motivation & Success Factors</h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-blue-300 font-medium mb-3">What motivates you internally? (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {motivationOptions.intrinsic.map((option) => (
                            <label key={option} className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consultationData.motivationFactors.intrinsicMotivators.includes(option)}
                                    onChange={(e) => {
                                        const current = consultationData.motivationFactors.intrinsicMotivators;
                                        const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter(item => item !== option);
                                        handleArrayChange('motivationFactors', 'intrinsicMotivators', updated);
                                    }}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-white text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-3">External motivators (Select any that apply)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {motivationOptions.extrinsic.map((option) => (
                            <label key={option} className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consultationData.motivationFactors.extrinsicMotivators.includes(option)}
                                    onChange={(e) => {
                                        const current = consultationData.motivationFactors.extrinsicMotivators;
                                        const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter(item => item !== option);
                                        handleArrayChange('motivationFactors', 'extrinsicMotivators', updated);
                                    }}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-white text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-3">Potential barriers (Select any concerns)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {motivationOptions.barriers.map((option) => (
                            <label key={option} className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consultationData.motivationFactors.barriers.includes(option)}
                                    onChange={(e) => {
                                        const current = consultationData.motivationFactors.barriers;
                                        const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter(item => item !== option);
                                        handleArrayChange('motivationFactors', 'barriers', updated);
                                    }}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <span className="text-white text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-3">How will you measure success? (Select primary measures)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {motivationOptions.measures.map((option) => (
                            <label key={option} className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consultationData.motivationFactors.successMeasures.includes(option)}
                                    onChange={(e) => {
                                        const current = consultationData.motivationFactors.successMeasures;
                                        const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter(item => item !== option);
                                        handleArrayChange('motivationFactors', 'successMeasures', updated);
                                    }}
                                    className="text-green-600 focus:ring-green-500"
                                />
                                <span className="text-white text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">5</span>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">Client Consultation</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Comprehensive intake to understand your background, goals, and lifestyle factors for personalized program design.
                </p>
            </div>

            {/* Section Navigation */}
            <div className="flex justify-center">
                <div className="flex bg-gray-800 rounded-lg p-1">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setCurrentSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentSection === section.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{section.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Section Content */}
            <div className="bg-gray-700 rounded-lg p-6">
                {currentSection === 'personalInfo' && renderPersonalInfo()}
                {currentSection === 'healthHistory' && renderHealthHistory()}
                {currentSection === 'lifestyle' && renderLifestyle()}
                {currentSection === 'motivationFactors' && renderMotivationFactors()}
            </div>

            {/* Section Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === currentSection);
                        if (currentIndex > 0) {
                            setCurrentSection(sections[currentIndex - 1].id);
                        }
                    }}
                    disabled={sections.findIndex(s => s.id === currentSection) === 0}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous Section
                </button>

                {sections.findIndex(s => s.id === currentSection) === sections.length - 1 ? (
                    <button
                        onClick={handleContinue}
                        disabled={!isAllComplete()}
                        className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${isAllComplete()
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Complete Consultation
                        <CheckCircle className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSectionComplete}
                        disabled={!isCurrentSectionComplete()}
                        className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${isCurrentSectionComplete()
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Next Section
                        <ArrowRight className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Progress */}
            <div className="text-center text-sm text-gray-400">
                Step 5A of 8: Client Consultation - Section {sections.findIndex(s => s.id === currentSection) + 1} of {sections.length}
            </div>
        </div>
    );
};

export default NASMClientConsultation;
