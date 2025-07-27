import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, User, Trophy, AlertTriangle, Activity, Zap, Info } from 'lucide-react';
import { useApp } from '../../../context';
import { useAssessment } from '../../../hooks/useAssessment';

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    console.log('🔴 DEBUG: GoalsAndNeeds component is rendering');
    console.log('🔴 DEBUG: Props received:', { assessmentData, onNext, canGoNext });
    console.log('🔴 DEBUG: Current URL:', window.location.pathname);
    console.log('🔴 DEBUG: Stack trace:', new Error().stack);

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
        const fullAssessment = { ...goals, ...enhancedAssessment };
        const result = await saveAssessment(fullAssessment);

        if (result.success) {
            console.log('Assessment saved successfully');
        } else {
            console.error('Failed to save assessment:', result.error);
        }
    };

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
                            onClick={() => window.location.href = '/assessment'}
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
                                                : 'bg-gray-700 text-white border-gray-500 hover:border-gray-400'
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

            {/* Injury Screening */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Injury Screening</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Past Injuries (select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['Lower Back', 'Knee', 'Shoulder', 'Ankle', 'Hip', 'Wrist', 'Neck', 'Elbow', 'Other'].map((injury) => (
                                <label key={injury} className="flex items-center space-x-2 text-gray-300">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-500 bg-red-600 text-blue-600 focus:ring-blue-500"
                                        checked={enhancedAssessment.injuryHistory.pastInjuries.includes(injury)}
                                        onChange={(e) => {
                                            const injuries = enhancedAssessment.injuryHistory.pastInjuries;
                                            if (e.target.checked) {
                                                setEnhancedAssessment(prev => ({
                                                    ...prev,
                                                    injuryHistory: {
                                                        ...prev.injuryHistory,
                                                        pastInjuries: [...injuries, injury]
                                                    }
                                                }));
                                            } else {
                                                setEnhancedAssessment(prev => ({
                                                    ...prev,
                                                    injuryHistory: {
                                                        ...prev.injuryHistory,
                                                        pastInjuries: injuries.filter(i => i !== injury)
                                                    }
                                                }));
                                            }
                                        }}
                                    />
                                    <span className="text-sm">{injury}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Limitations or Pain
                        </label>
                        <textarea
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            rows={3}
                            placeholder="Describe any current pain, limitations, or areas of concern..."
                            value={enhancedAssessment.injuryHistory.currentLimitations}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                injuryHistory: {
                                    ...prev.injuryHistory,
                                    currentLimitations: e.target.value
                                }
                            }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Movement Issues
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="e.g., tight hamstrings, limited shoulder mobility, knee valgus..."
                            value={enhancedAssessment.injuryHistory.movementIssues}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                injuryHistory: {
                                    ...prev.injuryHistory,
                                    movementIssues: e.target.value
                                }
                            }))}
                        />
                    </div>
                </div>
            </div>

            {/* Gainer Type Test */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Gainer Type Assessment</h3>
                    <div className="ml-auto">
                        <Info className="h-4 w-4 text-gray-400" title="Test your response to training volume" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        How many reps can you perform at 80% of your 1RM?
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        className="w-24 px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Reps"
                        onChange={(e) => handleGainerTest(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Test with a compound movement like squat, bench, or deadlift
                    </p>
                </div>

                {enhancedAssessment.gainerType.classification && (
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-2">
                            Classification: {enhancedAssessment.gainerType.classification.type}
                        </h4>
                        <p className="text-sm text-gray-300 mb-3">
                            {enhancedAssessment.gainerType.classification.characteristics}
                        </p>
                        <div className="text-sm text-gray-300">
                            <strong>Training Recommendations:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                {enhancedAssessment.gainerType.recommendations.slice(0, 3).map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Fiber Dominance */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Muscle Fiber Dominance</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['hamstrings', 'quadriceps', 'chest'].map((muscle) => (
                        <div key={muscle} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <h4 className="font-semibold text-white mb-2 capitalize">{muscle}</h4>
                            <select
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                                value={enhancedAssessment.fiberDominance[muscle]}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    fiberDominance: {
                                        ...prev.fiberDominance,
                                        [muscle]: e.target.value
                                    }
                                }))}
                            >
                                <option value="fast">Fast-Twitch Dominant</option>
                                <option value="mixed">Mixed Fiber Type</option>
                                <option value="slow">Slow-Twitch Dominant</option>
                            </select>
                            {enhancedAssessment.fiberDominance[muscle] && (
                                <div className="mt-2">
                                    {(() => {
                                        const rec = getFiberRecommendations(muscle, enhancedAssessment.fiberDominance[muscle]);
                                        return rec ? (
                                            <p className="text-xs text-gray-300">{rec.training}</p>
                                        ) : null;
                                    })()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mileage Assessment */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Training Capacity Assessment</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-2">Age Group</h4>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.ageGroup}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, ageGroup: e.target.value }
                            }))}
                        >
                            <option value="youth">Youth (Under 18)</option>
                            <option value="adult">Adult (18-40)</option>
                            <option value="masters">Masters (40+)</option>
                        </select>
                    </div>

                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-2">Training Experience</h4>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.trainingAge}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, trainingAge: e.target.value }
                            }))}
                        >
                            <option value="beginner">Beginner (0-1 years)</option>
                            <option value="intermediate">Intermediate (1-3 years)</option>
                            <option value="advanced">Advanced (3+ years)</option>
                        </select>
                    </div>

                    <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h4 className="font-semibold text-white mb-2">Recovery Capacity</h4>
                        <select
                            className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white focus:border-blue-500 focus:outline-none"
                            value={enhancedAssessment.mileage.recoveryCapacity}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                mileage: { ...prev.mileage, recoveryCapacity: e.target.value }
                            }))}
                        >
                            <option value="poor">Poor (Slow recovery)</option>
                            <option value="average">Average (Normal recovery)</option>
                            <option value="excellent">Excellent (Fast recovery)</option>
                        </select>
                    </div>
                </div>

                {enhancedAssessment.mileage.ageGroup && enhancedAssessment.mileage.trainingAge && (
                    <div className="mt-4 bg-gray-600 p-4 rounded-lg border border-gray-500">
                        <h5 className="font-semibold text-white mb-2">Capacity Recommendations:</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                            {getMileageRecommendations(
                                enhancedAssessment.mileage.ageGroup,
                                enhancedAssessment.mileage.trainingAge,
                                enhancedAssessment.mileage.recoveryCapacity
                            ).slice(0, 3).map((rec, index) => (
                                <li key={index}>• {rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* SMART Goals */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">SMART Goals Framework</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Specific <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g., Increase bench press 1RM"
                                value={enhancedAssessment.smartGoals.specific}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, specific: e.target.value }
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Measurable <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g., From 225lbs to 275lbs"
                                value={enhancedAssessment.smartGoals.measurable}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, measurable: e.target.value }
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Time-Bound <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-red-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g., Within 16 weeks"
                                value={enhancedAssessment.smartGoals.timeBound}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, timeBound: e.target.value }
                                }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Achievable <span className="text-red-400">*</span>
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
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Relevant <span className="text-red-400">*</span>
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
                </div>

                <div className="mt-4 flex gap-4">
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

