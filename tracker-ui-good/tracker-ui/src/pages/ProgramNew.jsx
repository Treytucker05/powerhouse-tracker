import React from 'react';
import { ProgramProvider, useProgramContext } from '../contexts/ProgramContext';
import ProgramOverview from '../components/program/ProgramOverview';
import BlockSequencing from '../components/program/BlockSequencing';
import LoadingParameters from '../components/program/LoadingParameters';
import TrainingMethods from '../components/program/TrainingMethods';
import ProgramPreview from '../components/program/ProgramPreview';

// Program Navigation Component
const ProgramNavigation = () => {
    const { state, actions } = useProgramContext();

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📋' },
        { id: 'sequencing', name: 'Block Sequencing', icon: '🔄' },
        { id: 'parameters', name: 'Loading Parameters', icon: '⚙️' },
        { id: 'methods', name: 'Training Methods', icon: '💪' },
        { id: 'energy', name: 'Energy Systems', icon: '⚡' },
        { id: 'recovery', name: 'Recovery Config', icon: '😴' },
        { id: 'individual', name: 'Individual Considerations', icon: '👤' },
        { id: 'tech', name: 'Tech Integration', icon: '📱' },
        { id: 'preview', name: 'Program Preview', icon: '👁️' }
    ];

    const handleTabClick = (tabId) => {
        actions.setActiveTab(tabId);
    };

    return (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${state.activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Main Program Content Component
const ProgramContent = () => {
    const { state } = useProgramContext();

    const renderActiveTab = () => {
        switch (state.activeTab) {
            case 'overview':
                return <ProgramOverview />;
            case 'sequencing':
                return <BlockSequencing />;
            case 'parameters':
                return <LoadingParameters />;
            case 'methods':
                return <TrainingMethods />;
            case 'energy':
                return <div className="p-6">Energy Systems component (to be implemented)</div>;
            case 'recovery':
                return <div className="p-6">Recovery Config component (to be implemented)</div>;
            case 'individual':
                return <div className="p-6">Individual Considerations component (to be implemented)</div>;
            case 'tech':
                return <div className="p-6">Tech Integration component (to be implemented)</div>;
            case 'preview':
                return <ProgramPreview />;
            default:
                return <ProgramOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <ProgramNavigation />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-white">Program Design</h1>
                        <div className="text-sm text-gray-400">
                            Step {getStepNumber(state.activeTab)} of 9
                        </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(getStepNumber(state.activeTab) / 9) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Active Tab Content */}
                {renderActiveTab()}
            </div>
        </div>
    );
};

// Main Program Component with Provider
const Program = () => {
    return (
        <ProgramProvider>
            <ProgramContent />
        </ProgramProvider>
    );
};

// Helper function to get step number
const getStepNumber = (activeTab) => {
    const stepMap = {
        overview: 1,
        sequencing: 2,
        parameters: 3,
        methods: 4,
        energy: 5,
        recovery: 6,
        individual: 7,
        tech: 8,
        preview: 9
    };
    return stepMap[activeTab] || 1;
};

export default Program;
