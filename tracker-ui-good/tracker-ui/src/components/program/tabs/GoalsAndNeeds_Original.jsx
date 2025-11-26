import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, User, Trophy, AlertTriangle, Activity, Zap, Info, Plus, Minus } from 'lucide-react';
import { useApp } from '../../../context';
import { useAssessment } from '../../../hooks/useAssessment';

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    const { state, dispatch } = useApp();
    const {
        classifyGainerType,
        getFiberRecommendations,
        getMileageRecommendations,
        validateSMARTGoals,
        generateSuggestions,
        saveAssessment,
        suggestions,
        loading
    } = useAssessment();

    const [goals, setGoals] = useState({
        timeframe: '1-year',
        primaryGoal: assessmentData?.primaryGoal || '',
        sportDemands: [],
        biomotorPriorities: {
            strength: 'medium',
            power: 'medium',
            endurance: 'medium',
            speed: 'medium',
            agility: 'medium',
            flexibility: 'medium'
        },
        trainingHistory: assessmentData?.trainingExperience || '',
        performanceGoals: ''
    });

    // Enhanced assessment data
    const [enhancedAssessment, setEnhancedAssessment] = useState({
        // Injury Screening
        injuryHistory: {
            pastInjuries: [],
            currentLimitations: '',
            movementIssues: '',
            painLevel: 0
        },

        // Gainer Type Test
        gainerType: {
            reps: null,
            classification: null,
            recommendations: []
        },

        // Fiber Dominance
        fiberDominance: {
            hamstrings: 'mixed',
            quadriceps: 'mixed',
            chest: 'mixed'
        },

        // Mileage Assessment
        mileage: {
            ageGroup: 'adult',
            trainingAge: 'intermediate',
            recoveryCapacity: 'average'
        },

        // SMART Goals
        smartGoals: {
            specific: '',
            measurable: '',
            achievable: '',
            relevant: '',
            timeBound: '',
            validated: false
        }
    });

    const biomotorAbilities = [
        { key: 'strength', label: 'Strength', description: 'Maximum force production' },
        { key: 'power', label: 'Power', description: 'Rate of force development' },
        { key: 'endurance', label: 'Endurance', description: 'Aerobic capacity & muscular endurance' },
        { key: 'speed', label: 'Speed', description: 'Movement velocity' },
        { key: 'agility', label: 'Agility', description: 'Change of direction ability' },
        { key: 'flexibility', label: 'Flexibility', description: 'Range of motion & mobility' }
    ];

    const timeframes = [
        { value: '6-month', label: '6 Months', description: 'Short-term focus & specific adaptations' },
        { value: '1-year', label: '1 Year', description: 'Annual periodization cycle' },
        { value: '2-year', label: '2 Years', description: 'Olympic/collegiate cycle' },
        { value: '4-year', label: '4 Years', description: 'Long-term athlete development' }
    ];

    const experienceLevels = [
        { value: 'novice', label: 'Novice', description: '< 1 year training experience' },
        { value: 'intermediate', label: 'Intermediate', description: '1-3 years training experience' },
        { value: 'advanced', label: 'Advanced', description: '3+ years training experience' },
        { value: 'elite', label: 'Elite', description: 'Competitive/professional level' }
    ];

    const commonInjuries = [
        'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Elbows', 'Wrists',
        'Hip', 'Knees', 'Ankles', 'Hamstrings', 'Quadriceps', 'Calves'
    ];

    useEffect(() => {
        generateSuggestions({ ...goals, ...enhancedAssessment });
    }, [goals, enhancedAssessment]);

    const handleGainerTest = (reps) => {
        const classification = classifyGainerType(reps);
        setEnhancedAssessment(prev => ({
            ...prev,
            gainerType: {
                reps: parseInt(reps),
                classification,
                recommendations: classification?.recommendations || []
            }
        }));
    };

    const handleSMARTValidation = () => {
        const { validation, allValid } = validateSMARTGoals(enhancedAssessment.smartGoals);
        setEnhancedAssessment(prev => ({
            ...prev,
            smartGoals: {
                ...prev.smartGoals,
                validated: allValid,
                validation
            }
        }));
    };

    const handleSaveAssessment = async () => {
        const result = await saveAssessment({ ...goals, ...enhancedAssessment });
        if (result.success) {
            console.log('Assessment saved successfully');
        }
    };

    const handleInjuryToggle = (injury) => {
        setEnhancedAssessment(prev => ({
            ...prev,
            injuryHistory: {
                ...prev.injuryHistory,
                pastInjuries: prev.injuryHistory.pastInjuries.includes(injury)
                    ? prev.injuryHistory.pastInjuries.filter(i => i !== injury)
                    : [...prev.injuryHistory.pastInjuries, injury]
            }
        }));
    };

    const handleBiomotorChange = (ability, priority) => {
        setGoals(prev => ({
            ...prev,
            biomotorPriorities: {
                ...prev.biomotorPriorities,
                [ability]: priority
            }
        }));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Assessment Summary</h3>
                </div>

                {assessmentData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Experience Level</h4>
                            <p className="text-gray-300">{assessmentData.trainingExperience || 'Not assessed'}</p>
                        </div>
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Primary Goal</h4>
                            <p className="text-gray-300">{assessmentData.primaryGoal || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-1">Recommended System</h4>
                            <p className="text-blue-400">{assessmentData.recommendedSystem || 'To be determined'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-600 rounded-lg">
                        <p className="text-gray-300 mb-4">No assessment data available</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => window.location.href = `${import.meta.env.BASE_URL}assessment`}
                        >
                            Complete Assessment First
                        </button>
                    </div>
                )}
            </div>

            {/* Training Timeframe */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Training Timeframe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {timeframes.map((timeframe) => (
                        <div
                            key={timeframe.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${goals.timeframe === timeframe.value
                                ? 'border-blue-500 bg-blue-900/30'
                                : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setGoals(prev => ({ ...prev, timeframe: timeframe.value }))}
                        >
                            <h4 className="font-semibold text-white mb-1">{timeframe.label}</h4>
                            <p className="text-sm text-gray-300">{timeframe.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Goals */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Long-term Performance Goals</h3>
                </div>

                <textarea
                    className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Describe your long-term performance objectives (e.g., compete in powerlifting meet, improve 1RM squat by 50lbs, complete marathon under 4 hours)..."
                    value={goals.performanceGoals}
                    onChange={(e) => setGoals(prev => ({ ...prev, performanceGoals: e.target.value }))}
                />
            </div>

            {/* Injury Screening */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Injury Screening</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Past Injuries (check all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {commonInjuries.map((injury) => (
                                <label key={injury} className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={enhancedAssessment.injuryHistory.pastInjuries.includes(injury)}
                                        onChange={() => handleInjuryToggle(injury)}
                                        className="rounded border-gray-500 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-gray-300">{injury}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Limitations
                        </label>
                        <textarea
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            rows={2}
                            placeholder="Describe any current physical limitations..."
                            value={enhancedAssessment.injuryHistory.currentLimitations}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                injuryHistory: { ...prev.injuryHistory, currentLimitations: e.target.value }
                            }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Movement Issues
                        </label>
                        <textarea
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            rows={2}
                            placeholder="Any movement restrictions or pain during exercise..."
                            value={enhancedAssessment.injuryHistory.movementIssues}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                injuryHistory: { ...prev.injuryHistory, movementIssues: e.target.value }
                            }))}
                        />
                    </div>
                </div>
            </div>

            {/* Gainer Type Test */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Gainer Type Assessment</h3>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
                        <h4 className="font-semibold text-blue-200 mb-2">Test Instructions</h4>
                        <p className="text-blue-100 text-sm">
                            How many reps can you perform at 80% of your 1RM? This helps determine your fiber type dominance and optimal training approach.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Reps at 80% 1RM
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="25"
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter number of reps"
                            value={enhancedAssessment.gainerType.reps || ''}
                            onChange={(e) => handleGainerTest(e.target.value)}
                        />
                    </div>

                    {enhancedAssessment.gainerType.classification && (
                        <div className="bg-gray-600 p-4 rounded-lg">
                            <h4 className="font-semibold text-white mb-2">
                                Classification: {enhancedAssessment.gainerType.classification.type}
                            </h4>
                            <p className="text-gray-300 text-sm mb-3">
                                {enhancedAssessment.gainerType.classification.characteristics}
                            </p>
                            <div className="space-y-1">
                                {enhancedAssessment.gainerType.classification.recommendations.slice(0, 3).map((rec, index) => (
                                    <div key={index} className="text-green-400 text-sm flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        {rec}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fiber Dominance Assessment */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Muscle Fiber Dominance</h3>
                </div>

                <div className="space-y-4">
                    {Object.entries(enhancedAssessment.fiberDominance).map(([muscle, dominance]) => (
                        <div key={muscle} className="bg-gray-600 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                {muscle} Fiber Dominance
                            </label>
                            <div className="flex gap-2">
                                {['fast', 'mixed', 'slow'].map((type) => (
                                    <button
                                        key={type}
                                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${dominance === type
                                            ? 'bg-yellow-600 text-white border-yellow-500'
                                            : 'bg-gray-700 text-gray-400 border-gray-500 hover:border-gray-400'
                                            }`}
                                        onClick={() => setEnhancedAssessment(prev => ({
                                            ...prev,
                                            fiberDominance: { ...prev.fiberDominance, [muscle]: type }
                                        }))}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {dominance && (
                                <div className="mt-2 text-sm text-gray-300">
                                    {getFiberRecommendations(muscle, dominance)?.training}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mileage/Capacity Assessment */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Training Capacity Assessment</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Age Group</label>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.ageGroup}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, ageGroup: e.target.value }
                            }))}
                        >
                            <option value="youth">Youth (under 18)</option>
                            <option value="adult">Adult (18-40)</option>
                            <option value="masters">Masters (40+)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Training Experience</label>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.trainingAge}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, trainingAge: e.target.value }
                            }))}
                        >
                            <option value="beginner">Beginner (0-1 year)</option>
                            <option value="intermediate">Intermediate (1-3 years)</option>
                            <option value="advanced">Advanced (3+ years)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Recovery Capacity</label>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.recoveryCapacity}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, recoveryCapacity: e.target.value }
                            }))}
                        >
                            <option value="poor">Poor</option>
                            <option value="average">Average</option>
                            <option value="excellent">Excellent</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 bg-gray-600 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Capacity Recommendations</h4>
                    <div className="space-y-1">
                        {getMileageRecommendations(
                            enhancedAssessment.mileage.ageGroup,
                            enhancedAssessment.mileage.trainingAge,
                            enhancedAssessment.mileage.recoveryCapacity
                        ).slice(0, 3).map((rec, index) => (
                            <div key={index} className="text-purple-300 text-sm flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                {rec}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SMART Goals Framework */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">SMART Goals Framework</h3>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Specific
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                rows={2}
                                placeholder="What exactly do you want to achieve?"
                                value={enhancedAssessment.smartGoals.specific}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, specific: e.target.value }
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Measurable
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                rows={2}
                                placeholder="How will you measure progress?"
                                value={enhancedAssessment.smartGoals.measurable}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, measurable: e.target.value }
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Achievable
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                rows={2}
                                placeholder="Why is this goal realistic?"
                                value={enhancedAssessment.smartGoals.achievable}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, achievable: e.target.value }
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Relevant
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                rows={2}
                                placeholder="How does this align with your priorities?"
                                value={enhancedAssessment.smartGoals.relevant}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, relevant: e.target.value }
                                }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time-bound
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="When will you achieve this goal?"
                            value={enhancedAssessment.smartGoals.timeBound}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                smartGoals: { ...prev.smartGoals, timeBound: e.target.value }
                            }))}
                        />
                    </div>

                    <button
                        onClick={handleSMARTValidation}
                        className={`px-4 py-2 rounded-md text-white transition-colors ${enhancedAssessment.smartGoals.validated
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {enhancedAssessment.smartGoals.validated ? (
                            <>
                                <CheckCircle className="h-4 w-4 inline mr-2" />
                                Goals Validated
                            </>
                        ) : (
                            'Validate SMART Goals'
                        )}
                    </button>
                </div>
            </div>

            {/* Assessment Suggestions */}
            {suggestions.length > 0 && (
                <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-500">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Assessment Insights</h3>
                    </div>
                    <ul className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="text-blue-200 text-sm flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Biomotor Ability Priorities */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Biomotor Ability Priorities</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                    Prioritize the physical qualities most important for your goals and sport demands.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {biomotorAbilities.map((ability) => (
                        <div key={ability.key} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-white">{ability.label}</h4>
                                    <p className="text-sm text-gray-300">{ability.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    {['low', 'medium', 'high'].map((priority) => (
                                        <button
                                            key={priority}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${goals.biomotorPriorities[ability.key] === priority
                                                ? getPriorityColor(priority)
                                                : 'bg-gray-700 text-gray-400 border-gray-500 hover:border-gray-400'
                                                }`}
                                            onClick={() => handleBiomotorChange(ability.key, priority)}
                                        >
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Step 1 of 7: Assess Needs and Set Goals
                    </div>
                    <button
                        onClick={handleSaveAssessment}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Assessment'}
                    </button>
                </div>

                {canGoNext && (
                    <button
                        onClick={async () => {
                            await handleSaveAssessment();
                            onNext();
                        }}
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

