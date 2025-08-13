import React, { useState, useEffect } from 'react';
import {
    Target,
    Activity,
    Users,
    Calendar,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    User,
    Heart,
    Zap,
    Award,
    BarChart3,
    Clock,
    Star,
    ArrowRight
} from 'lucide-react';

/**
 * AssessmentGoals.jsx - Enhanced Opening Tab
 * 
 * Comprehensive assessment and goal-setting functionality:
 * - Athlete Profiling & Demographics
 * - Movement & Performance Assessment
 * - Goal Setting & Prioritization
 * - Training History Analysis
 * - Readiness & Lifestyle Assessment
 */

const AssessmentGoals = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [assessment, setAssessment] = useState({
        profile: {
            name: '',
            age: '',
            gender: '',
            height: '',
            weight: '',
            experience: '',
            primarySport: '',
            injuryHistory: ''
        },
        goals: {
            primary: '',
            timeline: '',
            metrics: [],
            motivation: '',
            priority: []
        },
        movement: {
            squat: { score: 0, notes: '' },
            deadlift: { score: 0, notes: '' },
            press: { score: 0, notes: '' },
            pull: { score: 0, notes: '' },
            mobility: { score: 0, notes: '' }
        },
        lifestyle: {
            sleep: '',
            stress: '',
            nutrition: '',
            recovery: '',
            schedule: ''
        },
        history: {
            currentProgram: '',
            previousExperience: [],
            preferences: [],
            dislikes: []
        }
    });

    const [activeSubTab, setActiveSubTab] = useState('profile');
    const [completionStatus, setCompletionStatus] = useState({
        profile: 0,
        goals: 0,
        movement: 0,
        lifestyle: 0,
        history: 0
    });

    // Goal templates
    const goalTemplates = [
        {
            category: 'Strength',
            options: [
                'Increase 1RM in competition lifts',
                'Build general strength foundation',
                'Improve strength-to-bodyweight ratio',
                'Master compound movement patterns'
            ]
        },
        {
            category: 'Physique',
            options: [
                'Build lean muscle mass',
                'Reduce body fat percentage',
                'Improve muscle definition',
                'Achieve target body composition'
            ]
        },
        {
            category: 'Performance',
            options: [
                'Enhance athletic performance',
                'Improve power output',
                'Increase speed and agility',
                'Boost endurance capacity'
            ]
        },
        {
            category: 'Health',
            options: [
                'Improve overall fitness',
                'Enhance movement quality',
                'Reduce injury risk',
                'Optimize health markers'
            ]
        }
    ];

    // Movement assessment criteria
    const movementTests = [
        {
            name: 'Squat Pattern',
            key: 'squat',
            description: 'Deep squat assessment for lower body mobility and stability',
            criteria: ['Depth', 'Knee tracking', 'Ankle mobility', 'Core stability']
        },
        {
            name: 'Deadlift Pattern',
            key: 'deadlift',
            description: 'Hip hinge pattern assessment for posterior chain function',
            criteria: ['Hip mobility', 'Spinal position', 'Hamstring flexibility', 'Glute activation']
        },
        {
            name: 'Press Pattern',
            key: 'press',
            description: 'Overhead press assessment for shoulder mobility and stability',
            criteria: ['Shoulder mobility', 'Thoracic extension', 'Core stability', 'Wrist position']
        },
        {
            name: 'Pull Pattern',
            key: 'pull',
            description: 'Pulling movement assessment for upper body balance',
            criteria: ['Scapular control', 'Shoulder stability', 'Lat flexibility', 'Postural alignment']
        },
        {
            name: 'General Mobility',
            key: 'mobility',
            description: 'Overall mobility and movement quality assessment',
            criteria: ['Hip flexibility', 'Spinal mobility', 'Shoulder range', 'Ankle dorsiflexion']
        }
    ];

    // Timeline options
    const timelineOptions = [
        { value: '6-weeks', label: '6 Weeks (Short-term focus)' },
        { value: '12-weeks', label: '12 Weeks (Standard cycle)' },
        { value: '6-months', label: '6 Months (Major transformation)' },
        { value: '1-year', label: '1 Year (Long-term development)' },
        { value: 'ongoing', label: 'Ongoing (Lifestyle change)' }
    ];

    useEffect(() => {
        // Calculate completion percentages
        const calculateCompletion = () => {
            const profileCompletion = Object.values(assessment.profile).filter(v => v !== '').length / Object.keys(assessment.profile).length * 100;
            const goalsCompletion = (
                (assessment.goals.primary ? 25 : 0) +
                (assessment.goals.timeline ? 25 : 0) +
                (assessment.goals.metrics.length > 0 ? 25 : 0) +
                (assessment.goals.motivation ? 25 : 0)
            );
            const movementCompletion = Object.values(assessment.movement).filter(m => m.score > 0).length / Object.keys(assessment.movement).length * 100;
            const lifestyleCompletion = Object.values(assessment.lifestyle).filter(v => v !== '').length / Object.keys(assessment.lifestyle).length * 100;
            const historyCompletion = (
                (assessment.history.currentProgram ? 50 : 0) +
                (assessment.history.previousExperience.length > 0 ? 50 : 0)
            );

            setCompletionStatus({
                profile: Math.round(profileCompletion),
                goals: Math.round(goalsCompletion),
                movement: Math.round(movementCompletion),
                lifestyle: Math.round(lifestyleCompletion),
                history: Math.round(historyCompletion)
            });
        };

        calculateCompletion();
    }, [assessment]);

    const updateAssessment = (section, field, value) => {
        setAssessment(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateMovementScore = (test, score, notes) => {
        setAssessment(prev => ({
            ...prev,
            movement: {
                ...prev.movement,
                [test]: { score, notes }
            }
        }));
    };

    const addGoalMetric = (metric) => {
        setAssessment(prev => ({
            ...prev,
            goals: {
                ...prev.goals,
                metrics: [...prev.goals.metrics, metric]
            }
        }));
    };

    const removeGoalMetric = (index) => {
        setAssessment(prev => ({
            ...prev,
            goals: {
                ...prev.goals,
                metrics: prev.goals.metrics.filter((_, i) => i !== index)
            }
        }));
    };

    const renderAthleteProfile = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    Athlete Profile & Demographics
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white">Basic Information</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={assessment.profile.name}
                                onChange={(e) => updateAssessment('profile', 'name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                                <input
                                    type="number"
                                    value={assessment.profile.age}
                                    onChange={(e) => updateAssessment('profile', 'age', e.target.value)}
                                    placeholder="Years"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                                <select
                                    value={assessment.profile.gender}
                                    onChange={(e) => updateAssessment('profile', 'gender', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={assessment.profile.height}
                                    onChange={(e) => updateAssessment('profile', 'height', e.target.value)}
                                    placeholder="170"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={assessment.profile.weight}
                                    onChange={(e) => updateAssessment('profile', 'weight', e.target.value)}
                                    placeholder="70"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Training Background */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white">Training Background</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Training Experience</label>
                            <select
                                value={assessment.profile.experience}
                                onChange={(e) => updateAssessment('profile', 'experience', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select experience level</option>
                                <option value="beginner">Beginner (0-1 years)</option>
                                <option value="novice">Novice (1-2 years)</option>
                                <option value="intermediate">Intermediate (2-5 years)</option>
                                <option value="advanced">Advanced (5+ years)</option>
                                <option value="elite">Elite/Competitive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Primary Sport/Activity</label>
                            <input
                                type="text"
                                value={assessment.profile.primarySport}
                                onChange={(e) => updateAssessment('profile', 'primarySport', e.target.value)}
                                placeholder="Powerlifting, CrossFit, General Fitness, etc."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Injury History</label>
                            <textarea
                                value={assessment.profile.injuryHistory}
                                onChange={(e) => updateAssessment('profile', 'injuryHistory', e.target.value)}
                                placeholder="Describe any relevant injuries, limitations, or areas of concern..."
                                rows="4"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Completion indicator */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Profile Completion</span>
                        <span className="text-blue-400">{completionStatus.profile}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionStatus.profile}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGoalSetting = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-400" />
                    Goal Setting & Prioritization
                </h3>

                {/* Primary Goal */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Primary Training Goal</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        {goalTemplates.map((category) => (
                            <div key={category.category} className="bg-gray-700 rounded-lg p-4">
                                <h5 className="font-medium text-white mb-2">{category.category}</h5>
                                <div className="space-y-2">
                                    {category.options.map((option) => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="primaryGoal"
                                                value={option}
                                                checked={assessment.goals.primary === option}
                                                onChange={(e) => updateAssessment('goals', 'primary', e.target.value)}
                                                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-300">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Goal Timeline</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        {timelineOptions.map((option) => (
                            <label key={option.value} className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                                <input
                                    type="radio"
                                    name="timeline"
                                    value={option.value}
                                    checked={assessment.goals.timeline === option.value}
                                    onChange={(e) => updateAssessment('goals', 'timeline', e.target.value)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-300">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Specific Metrics */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Specific Metrics to Track</h4>
                    <div className="space-y-3">
                        {assessment.goals.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                                <span className="text-gray-300">{metric}</span>
                                <button
                                    onClick={() => removeGoalMetric(index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* Add metric options */}
                        <div className="grid md:grid-cols-3 gap-2">
                            {['1RM Squat', '1RM Bench', '1RM Deadlift', 'Body Weight', 'Body Fat %', 'Muscle Mass'].map((metric) => (
                                <button
                                    key={metric}
                                    onClick={() => addGoalMetric(metric)}
                                    disabled={assessment.goals.metrics.includes(metric)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {metric}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Motivation */}
                <div>
                    <h4 className="font-medium text-white mb-3">What motivates you?</h4>
                    <textarea
                        value={assessment.goals.motivation}
                        onChange={(e) => updateAssessment('goals', 'motivation', e.target.value)}
                        placeholder="Describe what drives you to achieve these goals. This helps us understand your 'why' and keep you motivated throughout the program..."
                        rows="4"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Completion indicator */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Goals Completion</span>
                        <span className="text-green-400">{completionStatus.goals}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionStatus.goals}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMovementAssessment = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Movement & Performance Assessment
                </h3>

                <div className="space-y-6">
                    {movementTests.map((test) => (
                        <div key={test.key} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h4 className="font-medium text-white">{test.name}</h4>
                                    <p className="text-sm text-gray-400">{test.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Score:</span>
                                    <span className={`text-lg font-bold ${assessment.movement[test.key].score >= 8 ? 'text-green-400' :
                                            assessment.movement[test.key].score >= 6 ? 'text-yellow-400' :
                                                assessment.movement[test.key].score > 0 ? 'text-red-400' :
                                                    'text-gray-400'
                                        }`}>
                                        {assessment.movement[test.key].score || '-'}/10
                                    </span>
                                </div>
                            </div>

                            {/* Criteria checklist */}
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Assessment Criteria:</h5>
                                <div className="grid md:grid-cols-2 gap-2">
                                    {test.criteria.map((criteria, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-400">
                                            <CheckCircle className="h-3 w-3 text-gray-500 mr-2" />
                                            {criteria}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Score input */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Score (1-10)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={assessment.movement[test.key].score || ''}
                                        onChange={(e) => updateMovementScore(test.key, parseInt(e.target.value) || 0, assessment.movement[test.key].notes)}
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="text-xs text-gray-400 mt-1">
                                        8-10: Excellent | 6-7: Good | 4-5: Fair | 1-3: Needs work
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                                    <textarea
                                        value={assessment.movement[test.key].notes}
                                        onChange={(e) => updateMovementScore(test.key, assessment.movement[test.key].score, e.target.value)}
                                        placeholder="Observations, limitations, compensations..."
                                        rows="3"
                                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Overall Movement Quality */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Overall Movement Quality</h4>
                    <div className="grid md:grid-cols-5 gap-4 text-center">
                        {movementTests.map((test) => (
                            <div key={test.key}>
                                <div className="text-sm text-gray-400 mb-1">{test.name.split(' ')[0]}</div>
                                <div className={`text-2xl font-bold ${assessment.movement[test.key].score >= 8 ? 'text-green-400' :
                                        assessment.movement[test.key].score >= 6 ? 'text-yellow-400' :
                                            assessment.movement[test.key].score > 0 ? 'text-red-400' :
                                                'text-gray-400'
                                    }`}>
                                    {assessment.movement[test.key].score || '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completion indicator */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Movement Assessment Completion</span>
                        <span className="text-purple-400">{completionStatus.movement}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionStatus.movement}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLifestyleAssessment = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    Lifestyle & Readiness Assessment
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Recovery Factors */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white">Recovery & Lifestyle</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Sleep Quality</label>
                            <select
                                value={assessment.lifestyle.sleep}
                                onChange={(e) => updateAssessment('lifestyle', 'sleep', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select sleep quality</option>
                                <option value="excellent">Excellent (8+ hours, high quality)</option>
                                <option value="good">Good (7-8 hours, decent quality)</option>
                                <option value="fair">Fair (6-7 hours, some issues)</option>
                                <option value="poor">Poor (less than 6 hours or very poor quality)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Stress Level</label>
                            <select
                                value={assessment.lifestyle.stress}
                                onChange={(e) => updateAssessment('lifestyle', 'stress', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select stress level</option>
                                <option value="low">Low (minimal work/life stress)</option>
                                <option value="moderate">Moderate (manageable stress)</option>
                                <option value="high">High (significant stress)</option>
                                <option value="very-high">Very High (overwhelming stress)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nutrition Habits</label>
                            <select
                                value={assessment.lifestyle.nutrition}
                                onChange={(e) => updateAssessment('lifestyle', 'nutrition', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select nutrition habits</option>
                                <option value="excellent">Excellent (well-planned, consistent)</option>
                                <option value="good">Good (generally healthy choices)</option>
                                <option value="inconsistent">Inconsistent (varies day to day)</option>
                                <option value="poor">Poor (irregular or unhealthy patterns)</option>
                            </select>
                        </div>
                    </div>

                    {/* Schedule & Availability */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white">Training Schedule</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Recovery Methods</label>
                            <select
                                value={assessment.lifestyle.recovery}
                                onChange={(e) => updateAssessment('lifestyle', 'recovery', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select recovery practices</option>
                                <option value="comprehensive">Comprehensive (massage, stretching, etc.)</option>
                                <option value="moderate">Moderate (some active recovery)</option>
                                <option value="minimal">Minimal (just rest days)</option>
                                <option value="none">None (no specific practices)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Available Training Time</label>
                            <textarea
                                value={assessment.lifestyle.schedule}
                                onChange={(e) => updateAssessment('lifestyle', 'schedule', e.target.value)}
                                placeholder="Describe your weekly schedule, preferred training days/times, any constraints..."
                                rows="5"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Readiness indicators */}
                <div className="bg-gray-700 rounded-lg p-4 mt-6">
                    <h4 className="font-medium text-white mb-3">Current Readiness Indicators</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">
                                {assessment.lifestyle.sleep ? (assessment.lifestyle.sleep === 'excellent' ? '9' : assessment.lifestyle.sleep === 'good' ? '7' : assessment.lifestyle.sleep === 'fair' ? '5' : '3') : '-'}/10
                            </div>
                            <div className="text-sm text-gray-400">Sleep</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                                {assessment.lifestyle.stress ? (assessment.lifestyle.stress === 'low' ? '9' : assessment.lifestyle.stress === 'moderate' ? '6' : assessment.lifestyle.stress === 'high' ? '4' : '2') : '-'}/10
                            </div>
                            <div className="text-sm text-gray-400">Stress (inverted)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">
                                {assessment.lifestyle.nutrition ? (assessment.lifestyle.nutrition === 'excellent' ? '9' : assessment.lifestyle.nutrition === 'good' ? '7' : assessment.lifestyle.nutrition === 'inconsistent' ? '5' : '3') : '-'}/10
                            </div>
                            <div className="text-sm text-gray-400">Nutrition</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-purple-400">
                                {assessment.lifestyle.recovery ? (assessment.lifestyle.recovery === 'comprehensive' ? '9' : assessment.lifestyle.recovery === 'moderate' ? '6' : assessment.lifestyle.recovery === 'minimal' ? '4' : '2') : '-'}/10
                            </div>
                            <div className="text-sm text-gray-400">Recovery</div>
                        </div>
                    </div>
                </div>

                {/* Completion indicator */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Lifestyle Assessment Completion</span>
                        <span className="text-red-400">{completionStatus.lifestyle}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionStatus.lifestyle}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTrainingHistory = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-400" />
                    Training History & Preferences
                </h3>

                <div className="space-y-6">
                    {/* Current Program */}
                    <div>
                        <h4 className="font-medium text-white mb-3">Current Training Program</h4>
                        <textarea
                            value={assessment.history.currentProgram}
                            onChange={(e) => updateAssessment('history', 'currentProgram', e.target.value)}
                            placeholder="Describe your current training routine, frequency, exercises, and how long you've been following it..."
                            rows="4"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Training Preferences */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-white mb-3">Training Preferences</h4>
                            <div className="space-y-2">
                                {['Free weights', 'Machines', 'Bodyweight', 'Cardio equipment', 'Group classes', 'Home workouts'].map((preference) => (
                                    <label key={preference} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={assessment.history.preferences.includes(preference)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAssessment(prev => ({
                                                        ...prev,
                                                        history: {
                                                            ...prev.history,
                                                            preferences: [...prev.history.preferences, preference]
                                                        }
                                                    }));
                                                } else {
                                                    setAssessment(prev => ({
                                                        ...prev,
                                                        history: {
                                                            ...prev.history,
                                                            preferences: prev.history.preferences.filter(p => p !== preference)
                                                        }
                                                    }));
                                                }
                                            }}
                                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">{preference}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-white mb-3">Training Dislikes</h4>
                            <div className="space-y-2">
                                {['Long cardio sessions', 'High rep work', 'Olympic lifts', 'Early morning training', 'Late evening training', 'Crowded gyms'].map((dislike) => (
                                    <label key={dislike} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={assessment.history.dislikes.includes(dislike)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAssessment(prev => ({
                                                        ...prev,
                                                        history: {
                                                            ...prev.history,
                                                            dislikes: [...prev.history.dislikes, dislike]
                                                        }
                                                    }));
                                                } else {
                                                    setAssessment(prev => ({
                                                        ...prev,
                                                        history: {
                                                            ...prev.history,
                                                            dislikes: prev.history.dislikes.filter(d => d !== dislike)
                                                        }
                                                    }));
                                                }
                                            }}
                                            className="rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-300">{dislike}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completion indicator */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Training History Completion</span>
                        <span className="text-orange-400">{completionStatus.history}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionStatus.history}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Calculate overall completion
    const overallCompletion = Math.round(
        (completionStatus.profile + completionStatus.goals + completionStatus.movement + completionStatus.lifestyle + completionStatus.history) / 5
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessment & Goal Setting</h2>
                    <p className="text-gray-400">Complete your comprehensive training assessment to create a personalized program</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{overallCompletion}%</div>
                    <div className="text-sm text-gray-400">Complete</div>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                {[
                    { id: 'profile', label: 'Profile', icon: User, color: 'blue' },
                    { id: 'goals', label: 'Goals', icon: Target, color: 'green' },
                    { id: 'movement', label: 'Movement', icon: Activity, color: 'purple' },
                    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, color: 'red' },
                    { id: 'history', label: 'History', icon: Clock, color: 'orange' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === tab.id
                                ? `bg-${tab.color}-600 text-white`
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <div className={`text-xs px-1.5 py-0.5 rounded-full ${completionStatus[tab.id] === 100 ? 'bg-green-500 text-white' :
                                completionStatus[tab.id] > 0 ? 'bg-yellow-500 text-black' :
                                    'bg-gray-500 text-gray-300'
                            }`}>
                            {completionStatus[tab.id]}%
                        </div>
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            {activeSubTab === 'profile' && renderAthleteProfile()}
            {activeSubTab === 'goals' && renderGoalSetting()}
            {activeSubTab === 'movement' && renderMovementAssessment()}
            {activeSubTab === 'lifestyle' && renderLifestyleAssessment()}
            {activeSubTab === 'history' && renderTrainingHistory()}

            {/* Overall Progress Summary */}
            {overallCompletion > 50 && (
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-blue-400" />
                        <div>
                            <h3 className="text-lg font-bold text-blue-300">Assessment Progress</h3>
                            <p className="text-blue-200">Great progress! Your assessment is {overallCompletion}% complete.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {Object.entries(completionStatus).map(([section, completion]) => (
                            <div key={section} className="text-center">
                                <div className={`text-xl font-bold ${completion === 100 ? 'text-green-400' :
                                        completion >= 75 ? 'text-blue-400' :
                                            completion >= 50 ? 'text-yellow-400' :
                                                completion > 0 ? 'text-orange-400' :
                                                    'text-gray-400'
                                    }`}>
                                    {completion}%
                                </div>
                                <div className="text-xs text-gray-300 capitalize">{section}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    <span className="text-sm text-gray-400">Step 1 of 5: Foundation Assessment</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Complete assessment to proceed
                    </div>
                    {canGoNext && overallCompletion >= 70 && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Continue to Exercise Selection
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                    {overallCompletion < 70 && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <AlertCircle className="h-4 w-4" />
                            Complete at least 70% to continue
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentGoals;
