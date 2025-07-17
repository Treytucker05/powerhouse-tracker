import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, User, Trophy, AlertTriangle, Activity, Zap, Info, Plus, Minus } from 'lucide-react';
import { useApp } from '../../../context';
import { useAssessment } from '../../../hooks/useAssessment';

// Simple Card Component
const Card = ({ children, className = '', header = null }) => (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
        {header && (
            <div className="border-b border-gray-700 pb-3 mb-4">
                {header}
            </div>
        )}
        {children}
    </div>
);

// Simple Button Component
const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    type = 'button'
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
};

// Simple Input Component
const Input = ({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = '',
    required = false,
    error = null
}) => (
    <div className={`space-y-2 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : ''}`}
        />
        {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {error}
            </p>
        )}
    </div>
);

// Simple Select Component
const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    className = '',
    required = false
}) => (
    <div className={`space-y-2 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <select
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Simple Textarea Component
const Textarea = ({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 3,
    className = '',
    required = false
}) => (
    <div className={`space-y-2 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
        )}
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
    </div>
);

// Assessment Tab Navigation
const AssessmentTabs = ({ activeTab, onTabChange, tabs }) => (
    <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-700 rounded-lg">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
            >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
            </button>
        ))}
    </div>
);

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

    // Active tab state
    const [activeTab, setActiveTab] = useState('goals');

    // Goals and basic info
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
        injuryHistory: {
            pastInjuries: [],
            currentLimitations: '',
            movementIssues: '',
            painLevel: 0
        },
        gainerType: {
            reps: null,
            classification: null,
            recommendations: []
        },
        fiberType: {
            dominantType: '',
            recommendations: []
        },
        mileageAssessment: {
            currentVolume: '',
            targetVolume: '',
            recommendations: []
        },
        smartGoals: {
            specific: '',
            measurable: '',
            achievable: '',
            relevant: '',
            timeBound: '',
            validation: null
        }
    });

    // Assessment tabs configuration
    const assessmentTabs = [
        { id: 'goals', label: 'Goals & Priorities', icon: Target },
        { id: 'injury', label: 'Injury Screening', icon: AlertTriangle },
        { id: 'gainer', label: 'Gainer Type', icon: TrendingUp },
        { id: 'fiber', label: 'Fiber Type', icon: Zap },
        { id: 'mileage', label: 'Training Volume', icon: Activity },
        { id: 'smart', label: 'SMART Goals', icon: CheckCircle }
    ];

    // Load existing data
    useEffect(() => {
        if (state.assessment) {
            setEnhancedAssessment(prev => ({
                ...prev,
                ...state.assessment
            }));
        }
    }, [state.assessment]);

    // Handle gainer type test
    const handleGainerTypeTest = () => {
        if (enhancedAssessment.gainerType.reps) {
            const result = classifyGainerType(enhancedAssessment.gainerType.reps);
            setEnhancedAssessment(prev => ({
                ...prev,
                gainerType: {
                    ...prev.gainerType,
                    classification: result.type,
                    recommendations: result.recommendations
                }
            }));
        }
    };

    // Handle fiber type assessment
    const handleFiberTypeAssessment = () => {
        if (enhancedAssessment.fiberType.dominantType) {
            const recommendations = getFiberRecommendations(enhancedAssessment.fiberType.dominantType);
            setEnhancedAssessment(prev => ({
                ...prev,
                fiberType: {
                    ...prev.fiberType,
                    recommendations: recommendations
                }
            }));
        }
    };

    // Handle SMART goals validation
    const handleSMARTValidation = () => {
        const validation = validateSMARTGoals(enhancedAssessment.smartGoals);
        setEnhancedAssessment(prev => ({
            ...prev,
            smartGoals: {
                ...prev.smartGoals,
                validation: validation
            }
        }));
    };

    // Save assessment
    const handleSaveAssessment = async () => {
        const assessmentToSave = {
            ...goals,
            ...enhancedAssessment,
            completedAt: new Date().toISOString()
        };

        await saveAssessment(assessmentToSave);
    };

    // Add injury to list
    const addInjury = () => {
        setEnhancedAssessment(prev => ({
            ...prev,
            injuryHistory: {
                ...prev.injuryHistory,
                pastInjuries: [...prev.injuryHistory.pastInjuries, '']
            }
        }));
    };

    // Remove injury from list
    const removeInjury = (index) => {
        setEnhancedAssessment(prev => ({
            ...prev,
            injuryHistory: {
                ...prev.injuryHistory,
                pastInjuries: prev.injuryHistory.pastInjuries.filter((_, i) => i !== index)
            }
        }));
    };

    // Update injury in list
    const updateInjury = (index, value) => {
        setEnhancedAssessment(prev => ({
            ...prev,
            injuryHistory: {
                ...prev.injuryHistory,
                pastInjuries: prev.injuryHistory.pastInjuries.map((injury, i) =>
                    i === index ? value : injury
                )
            }
        }));
    };

    // Render Goals & Priorities Tab
    const renderGoalsTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Goals & Training Priorities</h3>
            </div>
        }>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Select
                        label="Training Timeframe"
                        value={goals.timeframe}
                        onChange={(e) => setGoals(prev => ({ ...prev, timeframe: e.target.value }))}
                        options={[
                            { value: '3-months', label: '3 Months' },
                            { value: '6-months', label: '6 Months' },
                            { value: '1-year', label: '1 Year' },
                            { value: '2-years', label: '2+ Years' }
                        ]}
                        required
                    />

                    <Input
                        label="Primary Training Goal"
                        value={goals.primaryGoal}
                        onChange={(e) => setGoals(prev => ({ ...prev, primaryGoal: e.target.value }))}
                        placeholder="e.g., Increase squat 1RM, Complete marathon, Build muscle mass"
                        required
                    />

                    <Textarea
                        label="Performance Goals"
                        value={goals.performanceGoals}
                        onChange={(e) => setGoals(prev => ({ ...prev, performanceGoals: e.target.value }))}
                        placeholder="Describe specific performance targets..."
                        rows={3}
                    />
                </div>

                <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-300 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Biomotor Priorities
                    </h4>

                    {Object.entries(goals.biomotorPriorities).map(([key, value]) => (
                        <Select
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={value}
                            onChange={(e) => setGoals(prev => ({
                                ...prev,
                                biomotorPriorities: {
                                    ...prev.biomotorPriorities,
                                    [key]: e.target.value
                                }
                            }))}
                            options={[
                                { value: 'low', label: 'Low Priority' },
                                { value: 'medium', label: 'Medium Priority' },
                                { value: 'high', label: 'High Priority' }
                            ]}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );

    // Render Injury Screening Tab
    const renderInjuryTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Injury History & Screening</h3>
            </div>
        }>
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-300">Past Injuries</label>
                        <Button onClick={addInjury} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Injury
                        </Button>
                    </div>

                    {enhancedAssessment.injuryHistory.pastInjuries.map((injury, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={injury}
                                onChange={(e) => updateInjury(index, e.target.value)}
                                placeholder="e.g., Lower back strain (2023)"
                                className="flex-1"
                            />
                            <Button
                                onClick={() => removeInjury(index)}
                                variant="destructive"
                                size="sm"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Textarea
                    label="Current Limitations"
                    value={enhancedAssessment.injuryHistory.currentLimitations}
                    onChange={(e) => setEnhancedAssessment(prev => ({
                        ...prev,
                        injuryHistory: {
                            ...prev.injuryHistory,
                            currentLimitations: e.target.value
                        }
                    }))}
                    placeholder="Describe any current physical limitations or restrictions..."
                    rows={3}
                />

                <Textarea
                    label="Movement Issues"
                    value={enhancedAssessment.injuryHistory.movementIssues}
                    onChange={(e) => setEnhancedAssessment(prev => ({
                        ...prev,
                        injuryHistory: {
                            ...prev.injuryHistory,
                            movementIssues: e.target.value
                        }
                    }))}
                    placeholder="Note any movement patterns or exercises that cause discomfort..."
                    rows={3}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Pain Level (0-10)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={enhancedAssessment.injuryHistory.painLevel}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            injuryHistory: {
                                ...prev.injuryHistory,
                                painLevel: parseInt(e.target.value)
                            }
                        }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>No Pain</span>
                        <span className="font-medium text-white">{enhancedAssessment.injuryHistory.painLevel}</span>
                        <span>Severe Pain</span>
                    </div>
                </div>
            </div>
        </Card>
    );

    // Render Gainer Type Tab
    const renderGainerTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Gainer Type Assessment</h3>
            </div>
        }>
            <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Rep Max Test Instructions</h4>
                    <p className="text-sm text-gray-300">
                        Perform as many reps as possible with 85% of your 1RM. This will help determine your muscle fiber dominance and optimal training approach.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Input
                            label="Reps Completed at 85% 1RM"
                            type="number"
                            value={enhancedAssessment.gainerType.reps || ''}
                            onChange={(e) => setEnhancedAssessment(prev => ({
                                ...prev,
                                gainerType: {
                                    ...prev.gainerType,
                                    reps: parseInt(e.target.value) || null
                                }
                            }))}
                            placeholder="Enter number of reps"
                        />

                        <Button
                            onClick={handleGainerTypeTest}
                            disabled={!enhancedAssessment.gainerType.reps}
                            className="mt-4"
                        >
                            Classify Gainer Type
                        </Button>
                    </div>

                    {enhancedAssessment.gainerType.classification && (
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-white mb-2">Results</h4>
                            <p className="text-lg font-semibold text-green-400 mb-3">
                                {enhancedAssessment.gainerType.classification}
                            </p>
                            <div className="space-y-2">
                                {enhancedAssessment.gainerType.recommendations.map((rec, index) => (
                                    <p key={index} className="text-sm text-gray-300">• {rec}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    // Render Fiber Type Tab
    const renderFiberTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Muscle Fiber Dominance</h3>
            </div>
        }>
            <div className="space-y-6">
                <Select
                    label="Dominant Fiber Type"
                    value={enhancedAssessment.fiberType.dominantType}
                    onChange={(e) => {
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            fiberType: {
                                ...prev.fiberType,
                                dominantType: e.target.value
                            }
                        }));
                    }}
                    options={[
                        { value: 'type1', label: 'Type I (Slow-Twitch) - Endurance Dominant' },
                        { value: 'type2a', label: 'Type IIa (Fast-Twitch Oxidative) - Balanced' },
                        { value: 'type2x', label: 'Type IIx (Fast-Twitch Glycolytic) - Power Dominant' }
                    ]}
                />

                <Button
                    onClick={handleFiberTypeAssessment}
                    disabled={!enhancedAssessment.fiberType.dominantType}
                >
                    Get Fiber Type Recommendations
                </Button>

                {enhancedAssessment.fiberType.recommendations.length > 0 && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Training Recommendations</h4>
                        <div className="space-y-2">
                            {enhancedAssessment.fiberType.recommendations.map((rec, index) => (
                                <p key={index} className="text-sm text-gray-300">• {rec}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );

    // Render Training Volume Tab
    const renderMileageTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Training Volume Assessment</h3>
            </div>
        }>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Input
                        label="Current Weekly Volume"
                        value={enhancedAssessment.mileageAssessment.currentVolume}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            mileageAssessment: {
                                ...prev.mileageAssessment,
                                currentVolume: e.target.value
                            }
                        }))}
                        placeholder="e.g., 20 miles/week, 4 hours/week"
                    />

                    <Input
                        label="Target Weekly Volume"
                        value={enhancedAssessment.mileageAssessment.targetVolume}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            mileageAssessment: {
                                ...prev.mileageAssessment,
                                targetVolume: e.target.value
                            }
                        }))}
                        placeholder="e.g., 35 miles/week, 6 hours/week"
                    />
                </div>

                {enhancedAssessment.mileageAssessment.recommendations.length > 0 && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Volume Recommendations</h4>
                        <div className="space-y-2">
                            {enhancedAssessment.mileageAssessment.recommendations.map((rec, index) => (
                                <p key={index} className="text-sm text-gray-300">• {rec}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );

    // Render SMART Goals Tab
    const renderSMARTTab = () => (
        <Card header={
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">SMART Goals Framework</h3>
            </div>
        }>
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Specific"
                        value={enhancedAssessment.smartGoals.specific}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            smartGoals: { ...prev.smartGoals, specific: e.target.value }
                        }))}
                        placeholder="What exactly will you accomplish?"
                    />

                    <Input
                        label="Measurable"
                        value={enhancedAssessment.smartGoals.measurable}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            smartGoals: { ...prev.smartGoals, measurable: e.target.value }
                        }))}
                        placeholder="How will you measure progress?"
                    />

                    <Input
                        label="Achievable"
                        value={enhancedAssessment.smartGoals.achievable}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            smartGoals: { ...prev.smartGoals, achievable: e.target.value }
                        }))}
                        placeholder="Is this goal realistic?"
                    />

                    <Input
                        label="Relevant"
                        value={enhancedAssessment.smartGoals.relevant}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            smartGoals: { ...prev.smartGoals, relevant: e.target.value }
                        }))}
                        placeholder="Why is this goal important?"
                    />

                    <Input
                        label="Time-Bound"
                        value={enhancedAssessment.smartGoals.timeBound}
                        onChange={(e) => setEnhancedAssessment(prev => ({
                            ...prev,
                            smartGoals: { ...prev.smartGoals, timeBound: e.target.value }
                        }))}
                        placeholder="When will you achieve this?"
                        className="md:col-span-2"
                    />
                </div>

                <Button onClick={handleSMARTValidation}>
                    Validate SMART Goals
                </Button>

                {enhancedAssessment.smartGoals.validation && (
                    <div className={`rounded-lg p-4 border ${enhancedAssessment.smartGoals.validation.isValid
                            ? 'bg-green-900/20 border-green-700'
                            : 'bg-red-900/20 border-red-700'
                        }`}>
                        <h4 className={`font-medium mb-2 ${enhancedAssessment.smartGoals.validation.isValid
                                ? 'text-green-300'
                                : 'text-red-300'
                            }`}>
                            Validation Results
                        </h4>
                        <p className="text-sm text-gray-300 mb-3">
                            {enhancedAssessment.smartGoals.validation.feedback}
                        </p>
                        {enhancedAssessment.smartGoals.validation.suggestions.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-300 mb-2">Suggestions:</p>
                                <ul className="space-y-1">
                                    {enhancedAssessment.smartGoals.validation.suggestions.map((suggestion, index) => (
                                        <li key={index} className="text-sm text-gray-400">• {suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );

    // Render active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'goals': return renderGoalsTab();
            case 'injury': return renderInjuryTab();
            case 'gainer': return renderGainerTab();
            case 'fiber': return renderFiberTab();
            case 'mileage': return renderMileageTab();
            case 'smart': return renderSMARTTab();
            default: return renderGoalsTab();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessment & Goals</h2>
                    <p className="text-gray-400">Complete your comprehensive training assessment</p>
                </div>
                {suggestions.length > 0 && (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                        <p className="text-sm text-blue-300">
                            <Info className="h-4 w-4 inline mr-1" />
                            AI suggestions available based on your responses
                        </p>
                    </div>
                )}
            </div>

            {/* Assessment Tabs */}
            <AssessmentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={assessmentTabs}
            />

            {/* Tab Content */}
            {renderTabContent()}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <Button
                    onClick={handleSaveAssessment}
                    disabled={loading}
                    variant="secondary"
                >
                    {loading ? 'Saving...' : 'Save Assessment'}
                </Button>

                {canGoNext && (
                    <Button
                        onClick={async () => {
                            await handleSaveAssessment();
                            onNext();
                        }}
                    >
                        Next: Macrocycle Structure
                        <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GoalsAndNeeds;
