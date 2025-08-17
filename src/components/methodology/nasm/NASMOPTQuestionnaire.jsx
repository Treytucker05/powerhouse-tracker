import React, { useState } from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import { Target, CheckCircle, ArrowRight, AlertTriangle, FileText } from 'lucide-react';

const NASMOPTQuestionnaire = () => {
    const { state, actions } = useNASM();
    const [questionnaireData, setQuestionnaireData] = useState({
        trainingReadiness: {
            previousExperience: '',
            injuryHistory: '',
            currentPain: '',
            medicalClearance: ''
        },
        movementGoals: {
            primaryGoal: state.primaryGoal || '',
            specificMovements: '',
            functionalNeeds: '',
            performanceTargets: ''
        },
        optPreferences: {
            stabilityFocus: '',
            strengthPriority: '',
            powerInterest: '',
            cardioPreference: ''
        },
        lifestyle_factors: {
            trainingFrequency: '',
            sessionDuration: '',
            intensityPreference: '',
            equipmentAccess: ''
        },
        corrective_priorities: {
            postureAwareness: '',
            movementLimitations: '',
            compensationPatterns: '',
            previousCorrectiveWork: ''
        }
    });

    const [currentSection, setCurrentSection] = useState('trainingReadiness');
    const [isComplete, setIsComplete] = useState(false);

    const sections = [
        { id: 'trainingReadiness', name: 'Training Readiness', icon: FileText },
        { id: 'movementGoals', name: 'Movement Goals', icon: Target },
        { id: 'optPreferences', name: 'OPT Preferences', icon: CheckCircle },
        { id: 'lifestyle_factors', name: 'Lifestyle Factors', icon: ArrowRight },
        { id: 'corrective_priorities', name: 'Corrective Priorities', icon: AlertTriangle }
    ];

    const handleInputChange = (section, field, value) => {
        setQuestionnaireData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const isCurrentSectionComplete = () => {
        const section = questionnaireData[currentSection];
        return Object.values(section).every(value => value.trim() !== '');
    };

    const isAllComplete = () => {
        return sections.every(section => {
            return Object.values(questionnaireData[section.id]).every(value => value.trim() !== '');
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
                actions.setOPTQuestionnaire(questionnaireData);
            }
        }
    };

    const handleContinue = () => {
        if (isComplete) {
            // Move to Movement Screen (existing NASM assessment)
            actions.setCurrentStep(5, 'movement-screen');
        }
    };

    const getPhaseRecommendation = () => {
        const { goalFramework } = state;
        if (!goalFramework) return null;

        return {
            recommendedPhase: goalFramework.phases[0],
            rationale: `Based on your goal of "${goalFramework.name}", we recommend starting with Phase ${goalFramework.phases[0]}.`
        };
    };

    const renderTrainingReadiness = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Training Readiness Assessment</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Previous Exercise Experience</label>
                    <textarea
                        value={questionnaireData.trainingReadiness.previousExperience}
                        onChange={(e) => handleInputChange('trainingReadiness', 'previousExperience', e.target.value)}
                        placeholder="Describe your exercise background, types of training, and duration of experience..."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Injury History & Concerns</label>
                    <textarea
                        value={questionnaireData.trainingReadiness.injuryHistory}
                        onChange={(e) => handleInputChange('trainingReadiness', 'injuryHistory', e.target.value)}
                        placeholder="Any past injuries that affected your training? Recurring issues or concerns?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Current Pain or Discomfort</label>
                    <textarea
                        value={questionnaireData.trainingReadiness.currentPain}
                        onChange={(e) => handleInputChange('trainingReadiness', 'currentPain', e.target.value)}
                        placeholder="Any current areas of pain, stiffness, or discomfort that might affect exercise?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Medical Clearance Status</label>
                    <select
                        value={questionnaireData.trainingReadiness.medicalClearance}
                        onChange={(e) => handleInputChange('trainingReadiness', 'medicalClearance', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select clearance status...</option>
                        <option value="cleared">Cleared for all activities</option>
                        <option value="restrictions">Cleared with restrictions</option>
                        <option value="pending">Medical clearance pending</option>
                        <option value="not-required">No medical clearance required</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderMovementGoals = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Movement & Performance Goals</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Specific Movement Improvements</label>
                    <textarea
                        value={questionnaireData.movementGoals.specificMovements}
                        onChange={(e) => handleInputChange('movementGoals', 'specificMovements', e.target.value)}
                        placeholder="What specific movements would you like to improve? (e.g., squatting, overhead reaching, balance)"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Functional Movement Needs</label>
                    <textarea
                        value={questionnaireData.movementGoals.functionalNeeds}
                        onChange={(e) => handleInputChange('movementGoals', 'functionalNeeds', e.target.value)}
                        placeholder="What daily activities or sports movements are important to you?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Performance Targets</label>
                    <textarea
                        value={questionnaireData.movementGoals.performanceTargets}
                        onChange={(e) => handleInputChange('movementGoals', 'performanceTargets', e.target.value)}
                        placeholder="Any specific performance goals or milestones you want to achieve?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>

            {state.goalFramework && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">Your Selected Goal</h4>
                    <p className="text-blue-200">{state.goalFramework.name}: {state.goalFramework.description}</p>
                </div>
            )}
        </div>
    );

    const renderOPTPreferences = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">OPT Model Training Preferences</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Stability Training Focus</label>
                    <select
                        value={questionnaireData.optPreferences.stabilityFocus}
                        onChange={(e) => handleInputChange('optPreferences', 'stabilityFocus', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select stability focus...</option>
                        <option value="high-priority">High Priority (significant stability needs)</option>
                        <option value="moderate-priority">Moderate Priority (some stability work needed)</option>
                        <option value="low-priority">Low Priority (good existing stability)</option>
                        <option value="maintenance">Maintenance Only (focus on other areas)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Strength Training Priority</label>
                    <select
                        value={questionnaireData.optPreferences.strengthPriority}
                        onChange={(e) => handleInputChange('optPreferences', 'strengthPriority', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select strength priority...</option>
                        <option value="primary-focus">Primary Focus (main training goal)</option>
                        <option value="important">Important (significant component)</option>
                        <option value="moderate">Moderate (balanced approach)</option>
                        <option value="minimal">Minimal (maintenance only)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Power/Explosive Training Interest</label>
                    <select
                        value={questionnaireData.optPreferences.powerInterest}
                        onChange={(e) => handleInputChange('optPreferences', 'powerInterest', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select power training interest...</option>
                        <option value="very-interested">Very Interested (athletic performance focus)</option>
                        <option value="somewhat-interested">Somewhat Interested (functional power)</option>
                        <option value="not-interested">Not Interested (avoid plyometrics)</option>
                        <option value="future-consideration">Future Consideration (after building base)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Cardiorespiratory Training Preference</label>
                    <select
                        value={questionnaireData.optPreferences.cardioPreference}
                        onChange={(e) => handleInputChange('optPreferences', 'cardioPreference', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select cardio preference...</option>
                        <option value="stage-1">Stage 1 Focus (aerobic base building)</option>
                        <option value="stage-2">Stage 2 Focus (aerobic + anaerobic threshold)</option>
                        <option value="stage-3">Stage 3 Focus (anaerobic intervals)</option>
                        <option value="mixed-approach">Mixed Approach (variety of all stages)</option>
                        <option value="minimal-cardio">Minimal Cardio (strength focus)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderLifestyleFactors = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Training Lifestyle Factors</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Preferred Training Frequency</label>
                    <select
                        value={questionnaireData.lifestyle_factors.trainingFrequency}
                        onChange={(e) => handleInputChange('lifestyle_factors', 'trainingFrequency', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select training frequency...</option>
                        <option value="2-days">2 days per week</option>
                        <option value="3-days">3 days per week</option>
                        <option value="4-days">4 days per week</option>
                        <option value="5-days">5 days per week</option>
                        <option value="6-plus-days">6+ days per week</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Session Duration Preference</label>
                    <select
                        value={questionnaireData.lifestyle_factors.sessionDuration}
                        onChange={(e) => handleInputChange('lifestyle_factors', 'sessionDuration', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select session duration...</option>
                        <option value="30-minutes">30 minutes or less</option>
                        <option value="45-minutes">30-45 minutes</option>
                        <option value="60-minutes">45-60 minutes</option>
                        <option value="75-minutes">60-75 minutes</option>
                        <option value="90-plus-minutes">90+ minutes</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Training Intensity Preference</label>
                    <select
                        value={questionnaireData.lifestyle_factors.intensityPreference}
                        onChange={(e) => handleInputChange('lifestyle_factors', 'intensityPreference', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select intensity preference...</option>
                        <option value="low-moderate">Low to Moderate (comfortable, sustainable)</option>
                        <option value="moderate">Moderate (somewhat challenging)</option>
                        <option value="moderate-high">Moderate to High (challenging but manageable)</option>
                        <option value="high-intensity">High Intensity (very challenging)</option>
                        <option value="variable">Variable (depends on the day)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Equipment Access</label>
                    <textarea
                        value={questionnaireData.lifestyle_factors.equipmentAccess}
                        onChange={(e) => handleInputChange('lifestyle_factors', 'equipmentAccess', e.target.value)}
                        placeholder="What equipment do you have access to? (gym, home equipment, bodyweight only, etc.)"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );

    const renderCorrectivePriorities = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Corrective Exercise Priorities</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-blue-300 font-medium mb-2">Posture Awareness</label>
                    <textarea
                        value={questionnaireData.corrective_priorities.postureAwareness}
                        onChange={(e) => handleInputChange('corrective_priorities', 'postureAwareness', e.target.value)}
                        placeholder="Any concerns about your posture or alignment? (forward head, rounded shoulders, etc.)"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Movement Limitations</label>
                    <textarea
                        value={questionnaireData.corrective_priorities.movementLimitations}
                        onChange={(e) => handleInputChange('corrective_priorities', 'movementLimitations', e.target.value)}
                        placeholder="Any movements that feel limited, uncomfortable, or difficult?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Compensation Patterns</label>
                    <textarea
                        value={questionnaireData.corrective_priorities.compensationPatterns}
                        onChange={(e) => handleInputChange('corrective_priorities', 'compensationPatterns', e.target.value)}
                        placeholder="Any movement patterns you've been told need correction or that feel 'off'?"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-blue-300 font-medium mb-2">Previous Corrective Work</label>
                    <textarea
                        value={questionnaireData.corrective_priorities.previousCorrectiveWork}
                        onChange={(e) => handleInputChange('corrective_priorities', 'previousCorrectiveWork', e.target.value)}
                        placeholder="Any previous corrective exercise experience? Physical therapy, movement assessments, etc."
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                    />
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
                    <FileText className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">OPT Model Questionnaire</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    NASM-specific assessment to determine optimal OPT Model phase and training approach.
                </p>
            </div>

            {/* Goal Context */}
            {state.goalFramework && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 text-center">
                    <div className="text-blue-300 font-medium mb-1">Training Goal</div>
                    <div className="text-white text-lg">{state.goalFramework.name}</div>
                    <div className="text-blue-200 text-sm mt-1">{state.goalFramework.description}</div>
                </div>
            )}

            {/* Section Navigation */}
            <div className="flex justify-center">
                <div className="flex bg-gray-800 rounded-lg p-1 flex-wrap">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setCurrentSection(section.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${currentSection === section.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{section.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Section Content */}
            <div className="bg-gray-700 rounded-lg p-6">
                {currentSection === 'trainingReadiness' && renderTrainingReadiness()}
                {currentSection === 'movementGoals' && renderMovementGoals()}
                {currentSection === 'optPreferences' && renderOPTPreferences()}
                {currentSection === 'lifestyle_factors' && renderLifestyleFactors()}
                {currentSection === 'corrective_priorities' && renderCorrectivePriorities()}
            </div>

            {/* Phase Recommendation */}
            {getPhaseRecommendation() && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <h4 className="text-green-300 font-medium mb-2">Recommended Starting Phase</h4>
                    <div className="text-green-200">
                        Phase {getPhaseRecommendation().recommendedPhase}: {getPhaseRecommendation().rationale}
                    </div>
                </div>
            )}

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
                        Continue to Movement Screen
                        <ArrowRight className="h-5 w-5" />
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
                Step 5B of 8: OPT Questionnaire - Section {sections.findIndex(s => s.id === currentSection) + 1} of {sections.length}
            </div>
        </div>
    );
};

export default NASMOPTQuestionnaire;
