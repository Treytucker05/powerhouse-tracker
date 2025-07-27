import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context';

// Import assessment components for integration
import IntegratedPersonalProfile from '../components/program/tabs/IntegratedPersonalProfile';

// Import original 5-tab system components
import ProgramOverview from '../components/program/tabs/ProgramOverview';
import BlockSequencing from '../components/program/tabs/BlockSequencing';
import LoadingParameters from '../components/program/tabs/LoadingParameters';
import TrainingMethods from '../components/program/tabs/TrainingMethods';
import ProgramPreview from '../components/program/tabs/ProgramPreview';

// Import existing program components to integrate
import { ProgramProvider } from '../contexts/ProgramContext';

const Program = () => {
    console.log('🚀 PROGRAM.JSX IS RENDERING - Main Program Page');
    console.log('📍 Current URL:', window.location.pathname);
    console.log('🎯 Component: src/pages/Program.jsx');

    const { assessment, user } = useApp();
    const [activeTab, setActiveTab] = useState('personal-profile');

    const tabs = [
        {
            id: 'personal-profile',
            label: 'Personal Profile',
            component: IntegratedPersonalProfile,
            description: 'Define your training goals, experience, and timeline',
            icon: '�'
        },
        {
            id: 'overview',
            label: 'Program Overview',
            component: ProgramOverview,
            description: 'Program setup and basic configuration',
            icon: '📋'
        },
        {
            id: 'block-sequencing',
            label: 'Block Sequencing',
            component: BlockSequencing,
            description: 'Design your training timeline and block progression',
            icon: '🔄'
        },
        {
            id: 'loading-parameters',
            label: 'Loading Parameters',
            component: LoadingParameters,
            description: 'Set intensity zones and training parameters',
            icon: '⚙️'
        },
        {
            id: 'training-methods',
            label: 'Training Methods',
            component: TrainingMethods,
            description: 'Select and configure training techniques',
            icon: '💪'
        },
        {
            id: 'program-preview',
            label: 'Program Preview',
            component: ProgramPreview,
            description: 'Review and finalize your complete program',
            icon: '👁️'
        }
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const getCurrentTabIndex = () => {
        return tabs.findIndex(tab => tab.id === activeTab);
    };

    const handleNext = () => {
        console.log('🔄 Next button clicked!');
        const currentIndex = getCurrentTabIndex();
        console.log('📍 Current tab index:', currentIndex);
        console.log('📍 Current tab ID:', activeTab);

        if (currentIndex < tabs.length - 1) {
            const nextTab = tabs[currentIndex + 1];
            console.log('➡️ Moving to next tab:', nextTab.id, '-', nextTab.label);
            setActiveTab(nextTab.id);
        } else {
            console.log('⚠️ Already at last tab');
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
                        <h1 className="text-3xl font-bold text-white mb-2">
                            🔴 DEBUG: Program Design System (src/pages/Program.jsx)
                        </h1>
                        <p className="text-gray-300 mb-4">
                            Create comprehensive training programs using the evidence-based 5-step methodology
                        </p>
                        <div className="text-sm text-gray-400 mb-4">
                            <span className="font-semibold">Original 5-Tab System:</span> Overview → Block Sequencing → Loading Parameters → Training Methods → Program Preview
                        </div>

                        {/* Progress Indicator */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-300">Progress</span>
                                <span className="text-sm text-gray-300">
                                    Step {getCurrentTabIndex() + 1} of {tabs.length}
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
                                    <span className="text-lg mb-1">{tab.icon}</span>
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
