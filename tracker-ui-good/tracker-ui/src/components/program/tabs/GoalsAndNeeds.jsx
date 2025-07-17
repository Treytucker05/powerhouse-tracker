import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, AlertTriangle, TrendingUp, Activity, Zap, Calendar, Apple, BarChart3, Settings, Monitor, Volume2, Clock } from 'lucide-react';
import { useApp } from '../../../context';
import OPEXNutrition from './OPEXNutrition';
import SpecificityTab from './SpecificityTab';
import VariableManipulationTab from './VariableManipulationTab';
import MonitoringTab from './MonitoringTab';
import VolumeLandmarksTab from './VolumeLandmarksTab';
import MesocycleIntegrationTab from './MesocycleIntegrationTab';

const GoalsAndNeeds = ({ assessmentData, onNext, canGoNext }) => {
    console.log('GoalsAndNeeds - Component rendering');

    // Safe context access - but don't block rendering if it fails
    let state, dispatch;
    try {
        const context = useApp();
        state = context?.state;
        dispatch = context?.dispatch;
        console.log('Context loaded successfully:', { hasState: !!state, hasDispatch: !!dispatch });
    } catch (error) {
        console.warn('Context not available, continuing without it:', error);
        state = null;
        dispatch = null;
    }

    // Active tab state for different assessment sections
    const [activeTab, setActiveTab] = useState('goals');
    const [primaryGoal, setPrimaryGoal] = useState('');
    const [timeframe, setTimeframe] = useState('1-year');

    // Enhanced assessment data
    const [enhancedAssessment, setEnhancedAssessment] = useState({
        injuryHistory: { pastInjuries: [], currentLimitations: '', painLevel: 0 },
        gainerType: { reps: null, classification: null },
        fiberType: { dominantType: '', recommendations: [] },
        smartGoals: { specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' }
    });

    // Assessment tabs
    const assessmentTabs = [
        { id: 'goals', label: 'Basic Goals', icon: Target },
        { id: 'injury', label: 'Injury Screening', icon: AlertTriangle },
        { id: 'gainer', label: 'Gainer Type', icon: TrendingUp },
        { id: 'smart', label: 'SMART Goals', icon: CheckCircle },
        { id: 'nutrition', label: 'OPEX Nutrition', icon: Apple },
        { id: 'specificity', label: 'Training Specificity', icon: BarChart3 },
        { id: 'volume-landmarks', label: 'Volume Landmarks', icon: Volume2 },
        { id: 'mesocycle-integration', label: 'Mesocycle Integration', icon: Clock },
        { id: 'overload', label: 'Variable Manipulation', icon: Settings },
        { id: 'monitoring', label: 'Fatigue Monitoring', icon: Monitor }
    ];

    const handleSave = () => {
        const assessmentData = {
            primaryGoal,
            timeframe,
            ...enhancedAssessment,
            completedAt: new Date().toISOString()
        };

        console.log('Saving assessment data:', assessmentData);

        // Save to context if available
        if (dispatch && state) {
            try {
                dispatch({
                    type: 'UPDATE_ASSESSMENT',
                    payload: assessmentData
                });
                console.log('Saved to context successfully');
            } catch (error) {
                console.warn('Failed to save to context:', error);
            }
        }

        // Always save to localStorage as backup
        localStorage.setItem('enhanced_assessment', JSON.stringify(assessmentData));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Assessment & Goals</h2>
                    <p className="text-gray-400">Complete your comprehensive training assessment</p>
                </div>
            </div>

            {/* Assessment Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-700 rounded-lg">
                {assessmentTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'goals' && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-white">Training Goals</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Primary Training Goal
                            </label>
                            <input
                                type="text"
                                value={primaryGoal}
                                onChange={(e) => setPrimaryGoal(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Increase squat 1RM, Complete marathon, Build muscle mass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Timeframe
                            </label>
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="3-months">3 Months</option>
                                <option value="6-months">6 Months</option>
                                <option value="1-year">1 Year</option>
                                <option value="2-years">2+ Years</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Injury Screening Tab */}
            {activeTab === 'injury' && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-white">Injury History & Screening</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Current Limitations
                            </label>
                            <textarea
                                value={enhancedAssessment.injuryHistory.currentLimitations}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    injuryHistory: {
                                        ...prev.injuryHistory,
                                        currentLimitations: e.target.value
                                    }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                placeholder="Describe any current physical limitations or restrictions..."
                                rows={3}
                            />
                        </div>

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
                </div>
            )}

            {/* Gainer Type Tab */}
            {activeTab === 'gainer' && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-white">Gainer Type Assessment</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                            <h4 className="font-medium text-blue-300 mb-2">Rep Max Test Instructions</h4>
                            <p className="text-sm text-gray-300">
                                Perform as many reps as possible with 85% of your 1RM. This will help determine your muscle fiber dominance and optimal training approach.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Reps Completed at 85% 1RM
                            </label>
                            <input
                                type="number"
                                value={enhancedAssessment.gainerType.reps || ''}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    gainerType: {
                                        ...prev.gainerType,
                                        reps: parseInt(e.target.value) || null
                                    }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter number of reps"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* SMART Goals Tab */}
            {activeTab === 'smart' && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-white">SMART Goals Framework</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Specific</label>
                            <input
                                type="text"
                                value={enhancedAssessment.smartGoals.specific}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, specific: e.target.value }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="What exactly will you accomplish?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Measurable</label>
                            <input
                                type="text"
                                value={enhancedAssessment.smartGoals.measurable}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, measurable: e.target.value }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="How will you measure progress?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Achievable</label>
                            <input
                                type="text"
                                value={enhancedAssessment.smartGoals.achievable}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, achievable: e.target.value }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Is this goal realistic?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Time-Bound</label>
                            <input
                                type="text"
                                value={enhancedAssessment.smartGoals.timeBound}
                                onChange={(e) => setEnhancedAssessment(prev => ({
                                    ...prev,
                                    smartGoals: { ...prev.smartGoals, timeBound: e.target.value }
                                }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="When will you achieve this?"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* OPEX Nutrition Tab */}
            {activeTab === 'nutrition' && (
                <OPEXNutrition
                    onDataUpdate={(nutritionData) => {
                        console.log('Nutrition data updated:', nutritionData);
                        // Update enhanced assessment with nutrition data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            nutrition: nutritionData
                        }));
                    }}
                />
            )}

            {/* Training Specificity Tab */}
            {activeTab === 'specificity' && (
                <SpecificityTab
                    gainerType={enhancedAssessment.gainerType}
                    biomotorData={assessmentData?.biomotor}
                    onDataUpdate={(specificityData) => {
                        console.log('Specificity data updated:', specificityData);
                        // Update enhanced assessment with specificity data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            specificity: specificityData
                        }));
                    }}
                />
            )}

            {/* Volume Landmarks Tab */}
            {activeTab === 'volume-landmarks' && (
                <VolumeLandmarksTab
                    gainerType={enhancedAssessment.gainerType}
                    trainingAge={assessmentData?.experience?.years || 1}
                    onDataUpdate={(volumeData) => {
                        console.log('Volume landmarks data updated:', volumeData);
                        // Update enhanced assessment with volume landmark data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            volumeLandmarks: volumeData
                        }));
                    }}
                />
            )}

            {/* Mesocycle Integration Tab */}
            {activeTab === 'mesocycle-integration' && (
                <MesocycleIntegrationTab
                    volumeLandmarks={enhancedAssessment.volumeLandmarks}
                    gainerType={enhancedAssessment.gainerType}
                    trainingGoals={primaryGoal}
                    onDataUpdate={(mesocycleData) => {
                        console.log('Mesocycle data updated:', mesocycleData);
                        // Update enhanced assessment with mesocycle data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            mesocycle: mesocycleData
                        }));
                    }}
                />
            )}

            {/* Variable Manipulation Tab */}
            {activeTab === 'overload' && (
                <VariableManipulationTab
                    gainerType={enhancedAssessment.gainerType}
                    biomotorData={assessmentData?.biomotor}
                    onDataUpdate={(overloadData) => {
                        console.log('Overload data updated:', overloadData);
                        // Update enhanced assessment with overload data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            overload: overloadData
                        }));
                    }}
                />
            )}

            {/* Fatigue Monitoring Tab */}
            {activeTab === 'monitoring' && (
                <MonitoringTab
                    gainerType={enhancedAssessment.gainerType}
                    trainingLoad={enhancedAssessment.overload?.currentLoad}
                    onDataUpdate={(fatigueData) => {
                        console.log('Fatigue data updated:', fatigueData);
                        // Update enhanced assessment with fatigue data
                        setEnhancedAssessment(prev => ({
                            ...prev,
                            fatigue: fatigueData
                        }));
                    }}
                />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    Save Assessment
                </button>

                {canGoNext && (
                    <button
                        onClick={onNext}
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
