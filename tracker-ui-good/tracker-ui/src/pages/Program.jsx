import React, { useState } from 'react';
import { ProgramProvider, useProgramContext } from '../contexts/ProgramContext';

// Import existing components to preserve functionality
import ProgramOverview from '../components/program/ProgramOverview';
import BlockSequencing from '../components/program/BlockSequencing';
import LoadingParameters from '../components/program/LoadingParameters';
import TrainingMethods from '../components/program/TrainingMethods';
import ProgramPreview from '../components/program/ProgramPreview';

// Import new periodization tab components
import GoalsAndNeeds from '../components/program/tabs/GoalsAndNeeds';
import MacrocycleStructure from '../components/program/tabs/MacrocycleStructure';
import PhaseDesign from '../components/program/tabs/PhaseDesign';
import MesocyclePlanning from '../components/program/tabs/MesocyclePlanning';
import MicrocycleDesign from '../components/program/tabs/MicrocycleDesign';
import SessionMonitoring from '../components/program/tabs/SessionMonitoring';
import Implementation from '../components/program/tabs/Implementation';

/**
 * Program.jsx - Complete Program Design System with 7-Step Periodization
 * 
 * Restructured to follow evidence-based periodization methodology:
 * 1. Goals & Needs Assessment
 * 2. Macrocycle Structure
 * 3. Phase Design
 * 4. Mesocycle Planning
 * 5. Microcycle Design
 * 6. Sessions & Monitoring
 * 7. Implementation
 */

// Enhanced Program Navigation Component
const ProgramNavigation = () => {
  const { state, actions } = useProgramContext();

  // New 7-step periodization tabs
  const periodizationTabs = [
    { id: 'goals', name: 'Goals & Needs', icon: '🎯', step: 1 },
    { id: 'macrocycle', name: 'Macrocycle', icon: '📅', step: 2 },
    { id: 'phases', name: 'Phases', icon: '🔄', step: 3 },
    { id: 'mesocycles', name: 'Mesocycles', icon: '📊', step: 4 },
    { id: 'microcycles', name: 'Microcycles', icon: '📋', step: 5 },
    { id: 'sessions', name: 'Sessions', icon: '💪', step: 6 },
    { id: 'implementation', name: 'Implementation', icon: '🚀', step: 7 }
  ];

  // Legacy tabs for existing functionality
  const legacyTabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'sequencing', name: 'Block Sequencing', icon: '🔄' },
    { id: 'parameters', name: 'Loading Parameters', icon: '⚙️' },
    { id: 'methods', name: 'Training Methods', icon: '💪' },
    { id: 'preview', name: 'Program Preview', icon: '👁️' }
  ];

  const handleTabClick = (tabId) => {
    actions.setActiveTab(tabId);
  };

  // Use periodization tabs by default, fallback to legacy if needed
  const activeTabSet = state.usePeriodization !== false ? periodizationTabs : legacyTabs;
  const currentTab = activeTabSet.find(tab => tab.id === state.activeTab);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">Program Design</h2>
          {state.usePeriodization !== false && currentTab?.step && (
            <div className="text-sm text-gray-400">
              Step {currentTab.step} of 7
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => actions.togglePeriodizationMode?.(true)}
            className={`px-3 py-1 rounded text-xs ${state.usePeriodization !== false
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Periodization
          </button>
          <button
            onClick={() => actions.togglePeriodizationMode?.(false)}
            className={`px-3 py-1 rounded text-xs ${state.usePeriodization === false
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Legacy
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        {activeTabSet.map((tab) => (
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
            {tab.step && (
              <span className="bg-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                {tab.step}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProgramContent = () => {
  const { state, actions } = useProgramContext();

  // Navigation helpers for periodization tabs
  const getCurrentTabIndex = () => {
    const periodizationTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'sessions', 'implementation'];
    return periodizationTabs.findIndex(tab => tab === state.activeTab);
  };

  const handleNext = () => {
    const periodizationTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'sessions', 'implementation'];
    const currentIndex = getCurrentTabIndex();
    if (currentIndex >= 0 && currentIndex < periodizationTabs.length - 1) {
      actions.setActiveTab(periodizationTabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const periodizationTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'sessions', 'implementation'];
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      actions.setActiveTab(periodizationTabs[currentIndex - 1]);
    }
  };

  const renderActiveTab = () => {
    // Periodization tabs
    if (state.usePeriodization !== false) {
      switch (state.activeTab) {
        case 'goals':
          return <GoalsAndNeeds
            assessmentData={state.assessmentData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'macrocycle':
          return <MacrocycleStructure
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'phases':
          return <PhaseDesign
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'mesocycles':
          return <MesocyclePlanning
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'microcycles':
          return <MicrocycleDesign
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'sessions':
          return <SessionMonitoring
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={getCurrentTabIndex() < 6}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        case 'implementation':
          return <Implementation
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={false}
            canGoPrevious={getCurrentTabIndex() > 0}
          />;
        default:
          // Default to first periodization tab
          return <GoalsAndNeeds
            assessmentData={state.assessmentData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={true}
            canGoPrevious={false}
          />;
      }
    }

    // Legacy tabs
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
            <h3 className="text-lg font-semibold text-white mb-4">Welcome to Program Design</h3>
            <p className="text-gray-300 mb-4">Choose your program design approach:</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  actions.togglePeriodizationMode?.(true);
                  actions.setActiveTab('goals');
                }}
                className="block w-full text-left p-4 bg-blue-900/30 border border-blue-500 rounded-lg hover:bg-blue-900/50 transition-colors"
              >
                <h4 className="text-white font-medium">📚 Periodization Method (Recommended)</h4>
                <p className="text-gray-300 text-sm">Follow the 7-step evidence-based periodization process</p>
              </button>
              <button
                onClick={() => {
                  actions.togglePeriodizationMode?.(false);
                  actions.setActiveTab('overview');
                }}
                className="block w-full text-left p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <h4 className="text-white font-medium">🔧 Legacy Builder</h4>
                <p className="text-gray-300 text-sm">Use the original program design interface</p>
              </button>
            </div>
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
