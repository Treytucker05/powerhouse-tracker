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

// Import 5/3/1 system components
import FiveThreeOneWorkflow from '../components/program/FiveThreeOneWorkflow';

// Import methodology selection
import MethodologySelection from '../components/program/tabs/MethodologySelection';

// Import existing program components to integrate
import { ProgramProvider } from '../contexts/ProgramContext';

const Program = () => {
    console.log('🚀 PROGRAM.JSX IS RENDERING - Main Program Page');
    console.log('📍 Current URL:', window.location.pathname);
    console.log('🎯 Component: src/pages/Program.jsx');

    const { assessment, user } = useApp();
    const [activeTab, setActiveTab] = useState('methodology-selection');
    const [selectedMethodology, setSelectedMethodology] = useState(null);

    // Define methodology-specific workflows
    const getWorkflowForMethodology = (methodology) => {
        switch (methodology?.id) {
            case 'fivethreeone':
                return 'fivethreeone-workflow';
            case 'nasm':
                return 'nasm-workflow';
            case 'rp':
                return 'rp-workflow';
            case 'custom':
            default:
                return 'custom-workflow';
        }
    };

    const tabs = [
        {
            id: 'methodology-selection',
            label: 'Methodology',
            component: MethodologySelection,
            description: 'Choose your training methodology and approach',
            icon: '🎯'
        },
        // 5/3/1 Workflow - Always include but conditionally render
        {
            id: 'fivethreeone-workflow',
            label: '5/3/1 Program',
            component: FiveThreeOneWorkflow,
            description: 'Complete 5/3/1 training system setup',
            icon: '💪',
            visible: selectedMethodology?.id === 'fivethreeone'
        },
        // Custom/Generic Workflow (original 5-tab system) - Always include but conditionally render
        {
            id: 'personal-profile',
            label: 'Personal Profile',
            component: IntegratedPersonalProfile,
            description: 'Define your training goals, experience, and timeline',
            icon: '👤',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        },
        {
            id: 'overview',
            label: 'Program Overview',
            component: ProgramOverview,
            description: 'Program setup and basic configuration',
            icon: '📋',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        },
        {
            id: 'block-sequencing',
            label: 'Block Sequencing',
            component: BlockSequencing,
            description: 'Design your training timeline and block progression',
            icon: '🔄',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        },
        {
            id: 'loading-parameters',
            label: 'Loading Parameters',
            component: LoadingParameters,
            description: 'Set intensity zones and training parameters',
            icon: '⚙️',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        },
        {
            id: 'training-methods',
            label: 'Training Methods',
            component: TrainingMethods,
            description: 'Select and configure training techniques',
            icon: '💪',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        },
        {
            id: 'program-preview',
            label: 'Program Preview',
            component: ProgramPreview,
            description: 'Review and finalize your complete program',
            icon: '👁️',
            visible: selectedMethodology?.id === 'custom' || (!selectedMethodology && activeTab !== 'methodology-selection')
        }
    ];

    // Filter tabs based on visibility
    const visibleTabs = tabs.filter(tab => tab.id === 'methodology-selection' || tab.visible);

    const handleMethodologySelect = (methodology) => {
        setSelectedMethodology(methodology);

        // Auto-advance to the appropriate workflow
        const nextWorkflow = getWorkflowForMethodology(methodology);
        setActiveTab(nextWorkflow);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const getCurrentTabIndex = () => {
        return visibleTabs.findIndex(tab => tab.id === activeTab);
    };

    const handleNext = () => {
        console.log('🔄 Next button clicked!');
        const currentIndex = getCurrentTabIndex();
        console.log('📍 Current tab index:', currentIndex);
        console.log('📍 Current tab ID:', activeTab);

        if (currentIndex < visibleTabs.length - 1) {
            const nextTab = visibleTabs[currentIndex + 1];
            console.log('➡️ Moving to next tab:', nextTab.id, '-', nextTab.label);
            setActiveTab(nextTab.id);
        } else {
            console.log('⚠️ Already at last tab');
        }
    };

    const handlePrevious = () => {
        const currentIndex = getCurrentTabIndex();
        if (currentIndex > 0) {
            setActiveTab(visibleTabs[currentIndex - 1].id);
        }
    };

    return (
        <ProgramProvider>
            <div className="min-h-screen bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {selectedMethodology ?
                                `${selectedMethodology.name} Program Design` :
                                'Program Design System'
                            }
                        </h1>
                        <p className="text-gray-300 mb-4">
                            {selectedMethodology ?
                                selectedMethodology.description :
                                'Choose your training methodology and create comprehensive training programs'
                            }
                        </p>

                        {selectedMethodology && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">{selectedMethodology.icon}</span>
                                <span className="text-sm text-gray-400">
                                    Selected Methodology: <span className="text-white font-medium">{selectedMethodology.name}</span>
                                </span>
                            </div>
                        )}

                        {/* Progress Indicator */}
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-300">Progress</span>
                                <span className="text-sm text-gray-300">
                                    Step {getCurrentTabIndex() + 1} of {visibleTabs.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((getCurrentTabIndex() + 1) / visibleTabs.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className={`grid w-full mb-6 bg-gray-800 border border-gray-700 ${visibleTabs.length <= 2 ? 'grid-cols-2' :
                            visibleTabs.length <= 3 ? 'grid-cols-3' :
                                visibleTabs.length <= 4 ? 'grid-cols-4' :
                                    visibleTabs.length <= 5 ? 'grid-cols-5' :
                                        'grid-cols-6'
                            }`}>
                            {visibleTabs.map((tab, index) => (
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
                        {visibleTabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">{tab.label}</h2>
                                        <p className="text-gray-300 text-sm">{tab.description}</p>
                                    </div>

                                    {/* Render methodology selection with special props */}
                                    {tab.id === 'methodology-selection' ? (
                                        <tab.component
                                            onMethodologySelect={handleMethodologySelect}
                                            selectedMethodology={selectedMethodology}
                                        />
                                    ) : tab.id === 'fivethreeone-workflow' ? (
                                        /* Render 5/3/1 workflow with methodology context */
                                        <tab.component
                                            methodology={selectedMethodology}
                                            assessment={assessment}
                                            user={user}
                                        />
                                    ) : (
                                        /* Render other components with standard props */
                                        <tab.component
                                            assessmentData={assessment}
                                            user={user}
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            canGoNext={getCurrentTabIndex() < visibleTabs.length - 1}
                                            canGoPrevious={getCurrentTabIndex() > 0}
                                        />
                                    )}
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
