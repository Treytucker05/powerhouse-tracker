import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context';

// Import all 15 components to combine into 5 framework tabs
// Core 7-tab system
import GoalsAndNeeds from '../components/program/tabs/GoalsAndNeeds';
import MacrocycleStructure from '../components/program/tabs/MacrocycleStructure';
import MesocyclePlanning from '../components/program/tabs/MesocyclePlanning';
import MicrocycleDesign from '../components/program/tabs/MicrocycleDesign';
import SessionMonitoring from '../components/program/tabs/SessionMonitoring';
import Implementation from '../components/program/tabs/Implementation';
import TrainingBlocks from '../components/program/tabs/TrainingBlocks';

// Enhanced components
import EnhancedAssessmentGoals from '../components/program/tabs/EnhancedAssessmentGoals';
import EnhancedSessionStructure from '../components/program/tabs/EnhancedSessionStructure';
import EnhancedImplementation from '../components/program/tabs/EnhancedImplementation';

// Specialized Tools (8 components)
import ProgramOverview from '../components/program/tabs/ProgramOverview';
import LoadingParameters from '../components/program/tabs/LoadingParameters';
import TrainingMethods from '../components/program/tabs/TrainingMethods';
import OPEXNutrition from '../components/program/tabs/OPEXNutrition';
import Specialty from '../components/program/tabs/Specialty';
import VariableManipulation from '../components/program/tabs/VariableManipulation';
import VolumeLandmarks from '../components/program/tabs/VolumeLandmarks';
import ProgramPreview from '../components/program/tabs/ProgramPreview';

// Import existing program components to integrate
import { ProgramProvider } from '../contexts/ProgramContext';

const Program = () => {
    const { assessment, user } = useApp();
    const [activeTab, setActiveTab] = useState('assessment-screening');

    const tabs = [
        {
            id: 'assessment-screening',
            label: 'Assessment & Screening',
            component: EnhancedAssessmentGoals,
            description: 'Comprehensive athlete profiling, movement screening, and needs analysis with program overview',
            subComponents: ['Assessment', 'Movement Screening', 'Athletic Profile'],
            integratedComponents: ['EnhancedAssessmentGoals', 'ProgramOverview'],
            specializedTools: ['Program Overview']
        },
        {
            id: 'goal-setting',
            label: 'Goal Setting',
            component: GoalsAndNeeds,
            description: 'Define specific, measurable goals with specialty focus and performance targets',
            subComponents: ['SMART Goals', 'Performance Targets', 'Timeline Planning'],
            integratedComponents: ['GoalsAndNeeds', 'Specialty'],
            specializedTools: ['Specialty']
        },
        {
            id: 'periodization',
            label: 'Periodization',
            component: MacrocycleStructure,
            description: 'Complete periodization strategy: macrocycles, training blocks, mesocycles with volume landmarks',
            subComponents: ['Macrocycle Design', 'Training Blocks', 'Mesocycle Planning'],
            integratedComponents: ['MacrocycleStructure', 'TrainingBlocks', 'MesocyclePlanning', 'VolumeLandmarks'],
            specializedTools: ['Volume Landmarks'],
            combinedFeatures: ['periodization-design', 'training-blocks', 'mesocycles', 'volume-landmarks']
        },
        {
            id: 'program-design',
            label: 'Program Design',
            component: EnhancedSessionStructure,
            description: 'Comprehensive program design: sessions, training methods, loading parameters, variable manipulation',
            subComponents: ['Strength Training', 'Cardiovascular', 'Mobility', 'Recovery Protocols'],
            integratedComponents: ['EnhancedSessionStructure', 'MicrocycleDesign', 'LoadingParameters', 'TrainingMethods', 'VariableManipulation'],
            specializedTools: ['Loading Parameters', 'Training Methods', 'Variable Manipulation'],
            combinedFeatures: ['session-structure', 'microcycle-design', 'loading-parameters', 'training-methods', 'variable-manipulation']
        },
        {
            id: 'implementation-monitoring',
            label: 'Implementation & Monitoring',
            component: EnhancedImplementation,
            description: 'Complete implementation with monitoring, recovery tracking, nutrition, and program preview',
            subComponents: ['Program Execution', 'Performance Monitoring', 'Recovery Tracking', 'Progress Analysis', 'Nutrition Planning'],
            integratedComponents: ['EnhancedImplementation', 'Implementation', 'SessionMonitoring', 'OPEXNutrition', 'ProgramPreview'],
            specializedTools: ['OPEX Nutrition', 'Program Preview'],
            combinedFeatures: ['monitoring-recovery', 'implementation', 'session-monitoring', 'nutrition', 'program-preview']
        }
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const getCurrentTabIndex = () => {
        return tabs.findIndex(tab => tab.id === activeTab);
    };

    const handleNext = () => {
        const currentIndex = getCurrentTabIndex();
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = getCurrentTabIndex();
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
        }
    };

    return (
        <ProgramProvider>
            <div className="min-h-screen bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Program Design - Complete Edition</h1>
                        <p className="text-gray-300 mb-4">
                            Design comprehensive training programs using your complete 5-component framework with all 15 legacy features integrated
                        </p>
                        <div className="text-sm text-gray-400 mb-4">
                            <span className="font-semibold">Integrated Components:</span> 7 Core Tabs + 8 Specialized Tools = 15 Total Features
                        </div>

                        {/* Progress Indicator */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-300">Progress</span>
                                <span className="text-sm text-gray-300">
                                    Step {getCurrentTabIndex() + 1} of {tabs.length} - Complete Framework
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((getCurrentTabIndex() + 1) / tabs.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-800 border border-gray-700">{tabs.map((tab, index) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="text-xs py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                                title={tab.description}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-medium">{index + 1}</span>
                                    <span className="text-xs text-center leading-tight">{tab.label}</span>
                                </div>
                            </TabsTrigger>
                        ))}
                        </TabsList>

                        {/* Tab Content */}
                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">{tab.label}</h2>
                                        <p className="text-gray-300 text-sm">{tab.description}</p>
                                    </div>

                                    <tab.component
                                        assessmentData={assessment}
                                        user={user}
                                        onNext={handleNext}
                                        onPrevious={handlePrevious}
                                        canGoNext={getCurrentTabIndex() < tabs.length - 1}
                                        canGoPrevious={getCurrentTabIndex() > 0}
                                    />
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </ProgramProvider>
    );
};

export default Program;
