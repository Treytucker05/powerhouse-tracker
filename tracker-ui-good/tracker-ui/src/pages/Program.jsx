import React, { useState } from 'react';
import { ProgramProvider, useProgramContext } from '../contexts/ProgramContext';

// Import legacy components to preserve all functionality
import ProgramOverview from '../components/program/ProgramOverview';
import BlockSequencing from '../components/program/BlockSequencing';
import LoadingParameters from '../components/program/LoadingParameters';
import TrainingMethods from '../components/program/TrainingMethods';
import ProgramPreview from '../components/program/ProgramPreview';

// Import periodization tab components
import GoalsAndNeeds from '../components/program/tabs/GoalsAndNeeds';
import MacrocycleStructure from '../components/program/tabs/MacrocycleStructure';
import PhaseDesign from '../components/program/tabs/PhaseDesign';
import MesocyclePlanning from '../components/program/tabs/MesocyclePlanning';
import MicrocycleDesign from '../components/program/tabs/MicrocycleDesign';
import SessionMonitoring from '../components/program/tabs/SessionMonitoring';
import Implementation from '../components/program/tabs/Implementation';
import OPEXNutrition from '../components/program/tabs/OPEXNutrition';

// Import additional specialized tabs
import MesocycleIntegrationTab from '../components/program/tabs/MesocycleIntegrationTab';
import MonitoringTab from '../components/program/tabs/MonitoringTab';
import SpecificityTab from '../components/program/tabs/SpecificityTab';
import VariableManipulationTab from '../components/program/tabs/VariableManipulationTab';
import VolumeLandmarksTab from '../components/program/tabs/VolumeLandmarksTab';

/**
 * Program.jsx - Complete Program Design System with Comprehensive Functionality
 * 
 * Features:
 * - 7-step evidence-based periodization process
 * - All legacy components integrated
 * - Enhanced navigation and workflow
 * - Comprehensive program building tools
 * - No functionality loss from previous versions
 */

// Enhanced Program Navigation Component
const ProgramNavigation = () => {
  const { state, actions } = useProgramContext();

  // Complete unified program design system with all functionality
  const unifiedTabs = [
    { id: 'goals', name: 'Assessment & Goals', icon: '🎯', step: 1, description: 'Athlete assessment and goal setting' },
    { id: 'macrocycle', name: 'Periodization Design', icon: '📅', step: 2, description: 'Macrocycle structure and timeline' },
    { id: 'phases', name: 'Training Blocks', icon: '🔄', step: 3, description: 'Phase design and block sequencing' },
    { id: 'mesocycles', name: 'Mesocycles', icon: '📊', step: 4, description: '2-6 week training blocks' },
    { id: 'microcycles', name: 'Session Structure', icon: '📋', step: 5, description: 'Weekly patterns and sessions' },
    { id: 'monitoring', name: 'Monitoring & Recovery', icon: '💪', step: 6, description: 'Progress tracking and recovery' },
    { id: 'implementation', name: 'Implementation', icon: '🚀', step: 7, description: 'Program execution and export' }
  ];

  // Additional specialized tabs available via sub-navigation
  const specializedTabs = [
    { id: 'overview', name: 'Program Overview', icon: '📋', component: ProgramOverview },
    { id: 'loading', name: 'Loading Parameters', icon: '⚖️', component: LoadingParameters },
    { id: 'methods', name: 'Training Methods', icon: '⚡', component: TrainingMethods },
    { id: 'nutrition', name: 'OPEX Nutrition', icon: '🥗', component: OPEXNutrition },
    { id: 'specificity', name: 'Specificity', icon: '🎪', component: SpecificityTab },
    { id: 'variables', name: 'Variable Manipulation', icon: '🔧', component: VariableManipulationTab },
    { id: 'landmarks', name: 'Volume Landmarks', icon: '📏', component: VolumeLandmarksTab },
    { id: 'preview', name: 'Program Preview', icon: '👁️', component: ProgramPreview }
  ];

  const handleTabClick = (tabId) => {
    actions.setActiveTab(tabId);
  };

  const currentTab = unifiedTabs.find(tab => tab.id === state.activeTab) ||
    specializedTabs.find(tab => tab.id === state.activeTab);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      {/* Enhanced Header with Mode Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">Program Design - Complete Edition</h2>
          {currentTab?.step && (
            <div className="text-sm text-gray-400">
              Step {currentTab.step} of 7 - {currentTab.description}
            </div>
          )}
          {currentTab && !currentTab.step && (
            <div className="text-sm text-gray-400">
              Specialized Tool - {currentTab.description || currentTab.name}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400">
            All Functionality Preserved
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-2">Main Workflow</div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {unifiedTabs.map((tab) => (
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
              <span className="bg-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                {tab.step}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Specialized Tools Navigation */}
      <div>
        <div className="text-xs text-gray-400 mb-2">Specialized Tools</div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {specializedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${state.activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgramContent = () => {
  const { state, actions } = useProgramContext();

  // Navigation helpers for main workflow
  const getCurrentTabIndex = () => {
    const mainTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'monitoring', 'implementation'];
    return mainTabs.findIndex(tab => tab === state.activeTab);
  };

  const handleNext = () => {
    const mainTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'monitoring', 'implementation'];
    const currentIndex = getCurrentTabIndex();
    if (currentIndex >= 0 && currentIndex < mainTabs.length - 1) {
      actions.setActiveTab(mainTabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const mainTabs = ['goals', 'macrocycle', 'phases', 'mesocycles', 'microcycles', 'monitoring', 'implementation'];
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      actions.setActiveTab(mainTabs[currentIndex - 1]);
    }
  };

  // Enhanced component rendering with all legacy functionality
  const renderActiveTab = () => {
    const commonProps = {
      assessmentData: state.assessmentData,
      programData: state.programData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: getCurrentTabIndex() >= 0 && getCurrentTabIndex() < 6,
      canGoPrevious: getCurrentTabIndex() > 0
    };

    // Main workflow tabs
    switch (state.activeTab) {
      case 'goals':
        return (
          <div className="space-y-6">
            <GoalsAndNeeds {...commonProps} />
            {/* Enhanced Goals section could include program overview */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Program Overview Integration</h3>
              <ProgramOverview />
            </div>
          </div>
        );

      case 'macrocycle':
        return <MacrocycleStructure {...commonProps} />;

      case 'phases':
        return (
          <div className="space-y-6">
            <PhaseDesign {...commonProps} />
            {/* Enhanced Phases section includes block sequencing */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Block Sequencing</h3>
              <BlockSequencing />
            </div>
          </div>
        );

      case 'mesocycles':
        return (
          <div className="space-y-6">
            <MesocyclePlanning {...commonProps} />
            {/* Enhanced Mesocycles section includes integration tab */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Mesocycle Integration</h3>
              <MesocycleIntegrationTab />
            </div>
          </div>
        );

      case 'microcycles':
        return (
          <div className="space-y-6">
            <MicrocycleDesign {...commonProps} />
            {/* Enhanced Microcycles section includes loading parameters and training methods */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Loading Parameters</h3>
                  <LoadingParameters />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Training Methods</h3>
                  <TrainingMethods />
                </div>
              </div>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <SessionMonitoring {...commonProps} />
            {/* Enhanced Monitoring section includes specialized monitoring tab */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Advanced Monitoring</h3>
              <MonitoringTab />
            </div>
          </div>
        );

      case 'implementation':
        return (
          <div className="space-y-6">
            <Implementation {...commonProps} />
            {/* Enhanced Implementation section includes program preview and export */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Program Preview & Export</h3>
                  <ProgramPreview />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">OPEX Nutrition Integration</h3>
                  <OPEXNutrition />
                </div>
              </div>
            </div>
          </div>
        );

      // Specialized tool tabs
      case 'overview':
        return <ProgramOverview />;
      case 'loading':
        return <LoadingParameters />;
      case 'methods':
        return <TrainingMethods />;
      case 'nutrition':
        return <OPEXNutrition />;
      case 'specificity':
        return <SpecificityTab />;
      case 'variables':
        return <VariableManipulationTab />;
      case 'landmarks':
        return <VolumeLandmarksTab />;
      case 'preview':
        return <ProgramPreview />;

      default:
        // Default to first tab with comprehensive welcome
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Welcome to Complete Program Design
              </h3>
              <p className="text-gray-300 mb-6">
                This system includes all functionality from previous versions plus enhanced integration.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">📚 Main Workflow (7 Steps)</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Follow the evidence-based 7-step periodization process with integrated legacy functionality.
                  </p>
                  <button
                    onClick={() => actions.setActiveTab('goals')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Start Program Design
                  </button>
                </div>

                <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">🔧 Specialized Tools</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Access individual components for specific program design tasks and analysis.
                  </p>
                  <button
                    onClick={() => actions.setActiveTab('overview')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Open Tools
                  </button>
                </div>
              </div>
            </div>

            <GoalsAndNeeds {...commonProps} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <ProgramNavigation />

        {/* Enhanced Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">
              Complete Program Design System
            </h1>
            <div className="text-sm text-gray-400">
              All Legacy + Periodization Features
            </div>
          </div>

          {/* Progress Bar for Main Workflow */}
          {getCurrentTabIndex() >= 0 && (
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Main Workflow Progress</span>
                <span className="text-sm text-gray-300">
                  Step {getCurrentTabIndex() + 1} of 7
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((getCurrentTabIndex() + 1) / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Active Tab Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          {renderActiveTab()}
        </div>
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
