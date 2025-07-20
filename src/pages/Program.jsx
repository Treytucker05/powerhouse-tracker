import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context';

// Import components for the new unified 7-tab system
import GoalsAndNeeds from '../components/program/tabs/GoalsAndNeeds';
import MacrocycleStructure from '../components/program/tabs/MacrocycleStructure';
import MesocyclePlanning from '../components/program/tabs/MesocyclePlanning';
import MicrocycleDesign from '../components/program/tabs/MicrocycleDesign';
import SessionMonitoring from '../components/program/tabs/SessionMonitoring';
import Implementation from '../components/program/tabs/Implementation';

// Import enhanced components we created
import TrainingBlocks from '../components/program/tabs/TrainingBlocks';

// Import legacy components to preserve all functionality
import EnhancedAssessmentGoals from '../components/program/tabs/EnhancedAssessmentGoals';
import EnhancedSessionStructure from '../components/program/tabs/EnhancedSessionStructure';
import EnhancedImplementation from '../components/program/tabs/EnhancedImplementation';

// Import existing program components to integrate
import { ProgramProvider } from '../contexts/ProgramContext';

const Program = () => {
    const { assessment, user } = useApp();
    const [activeTab, setActiveTab] = useState('assessment');

    const tabs = [
        {
            id: 'assessment',
            label: 'Assessment & Goals',
            component: EnhancedAssessmentGoals,
            description: 'Comprehensive athlete profiling, program overview, and goal setting'
        },
        {
            id: 'periodization',
            label: 'Periodization Design',
            component: MacrocycleStructure,
            description: 'Design macrocycles with multiple goals, periodization models, and calendar view'
        },
        {
            id: 'training-blocks',
            label: 'Training Blocks',
            component: TrainingBlocks,
            description: 'Design phases, mesocycles, and block sequencing with specific training focus'
        },
        {
            id: 'mesocycles',
            label: 'Mesocycles',
            component: MesocyclePlanning,
            description: 'Plan 2-6 week training blocks with specific focus and periodization'
        },
        {
            id: 'session-structure',
            label: 'Session Structure',
            component: EnhancedSessionStructure,
            description: 'Design microcycles, loading parameters, and training methods'
        },
        {
            id: 'monitoring',
            label: 'Monitoring & Recovery',
            component: SessionMonitoring,
            description: 'Session tracking, recovery protocols, and progress monitoring'
        },
        {
            id: 'implementation',
            label: 'Implementation',
            component: EnhancedImplementation,
            description: 'Program execution, preview, nutrition integration, and performance tracking'
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
                            Design comprehensive training programs using our complete 7-step framework with all legacy functionality preserved
                        </p>

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
                        <TabsList className="grid w-full grid-cols-7 mb-6 bg-gray-800 border border-gray-700">{tabs.map((tab, index) => (
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
