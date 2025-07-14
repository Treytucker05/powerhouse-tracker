import React from 'react';
import { ProgramProvider, useProgramContext } from '../contexts/ProgramContext';
import ProgramOverview from '../components/program/ProgramOverview';
import BlockSequencing from '../components/program/BlockSequencing';
import LoadingParameters from '../components/program/LoadingParameters';
import TrainingMethods from '../components/program/TrainingMethods';
import ProgramPreview from '../components/program/ProgramPreview';

/**
 * Program.jsx - Complete Program Design System
 * 
 * Fully functional program design interface with all components integrated
 */

// Program Navigation Component
const ProgramNavigation = () => {
  const { state, actions } = useProgramContext();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'sequencing', name: 'Block Sequencing', icon: '🔄' },
    { id: 'parameters', name: 'Loading Parameters', icon: '⚙️' },
    { id: 'methods', name: 'Training Methods', icon: '💪' },
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
      case 'preview':
        return <ProgramPreview />;
      default:
        return (
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Default Tab</h3>
            <p className="text-gray-300">Current tab: {state.activeTab}</p>
          </div>
        );
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
              Complete Program Builder
            </div>
          </div>
        </div>

        {/* Active Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
};

const Program = () => {
  return (
    <ProgramProvider>
      <ProgramContent />
    </ProgramProvider>
  );
};

export default Program;
