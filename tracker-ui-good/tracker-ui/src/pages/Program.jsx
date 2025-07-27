import React, { useState } from 'react';
import {
  ProgramProvider, useProgramContext
} from '../contexts/ProgramContext';

// Legacy migration utilities
import {
  migrateLegacyProgramData,
  validateBryantIntegration,
  generateMigrationReport
} from '../utils/legacyMigration';

// Enhanced periodization models with Bryant integration
import {
  periodizationModels,
  getBryantCompatibleModels,
  validateModelBryantCompatibility
} from '../data/periodizationModels';

// Import legacy components to preserve all functionality
import ProgramOverview from '../components/program/ProgramOverview';
import BlockSequencing from '../components/program/BlockSequencing';
import LoadingParameters from '../components/program/LoadingParameters';
import TrainingMethods from '../components/program/TrainingMethods';
import ProgramPreview from '../components/program/ProgramPreview';

// Import assessment step components
import PrimaryGoalStep from '../components/program/tabs/PrimaryGoalStep';
import ExperienceLevelStep from '../components/program/tabs/ExperienceLevelStep';
import PHAHealthScreenStep from '../components/program/tabs/PHAHealthScreenStep';
import GainerTypeStep from '../components/program/tabs/GainerTypeStep';
import BryantTacticalInterface from '../components/program/tabs/BryantTacticalInterface';

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

  // 12-Step Complete Workflow (Assessment → Periodization → Design → Implementation)
  const unifiedTabs = [
    // PHASE 1: COMPREHENSIVE ASSESSMENT (Steps 1-9)
    {
      id: 'primary-goal',
      name: 'Primary Goal',
      icon: '🎯',
      step: 1,
      phase: 'Assessment',
      description: 'Training focus and objectives - Goal selection and training focus definition',
      integratedFeatures: ['Goal Selection', 'Training Focus', 'Objective Framework']
    },
    {
      id: 'experience-level',
      name: 'Experience Level',
      icon: '📈',
      step: 2,
      phase: 'Assessment',
      description: 'Program complexity level - Training experience and program recommendations',
      integratedFeatures: ['Experience Assessment', 'Complexity Recommendations', 'Exercise Guidelines']
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: '⏱️',
      step: 3,
      phase: 'Assessment',
      description: 'Program duration and periodization structure selection',
      integratedFeatures: ['Duration Selection', 'Timeline Planning', 'Periodization Framework']
    },
    {
      id: 'injury-screening',
      name: 'Injury Screening',
      icon: '🏥',
      step: 4,
      phase: 'Assessment',
      description: 'Safety assessment and movement limitations identification',
      integratedFeatures: ['Injury Assessment', 'Movement Limitations', 'Exercise Contraindications']
    },
    {
      id: 'pha-health-screen',
      name: 'PHA Health Screen',
      icon: '❤️',
      step: 5,
      phase: 'Assessment',
      description: 'Physical Activity Readiness and health risk stratification',
      integratedFeatures: ['PAR-Q Assessment', 'Health Risk Stratification', 'Medical Clearance']
    },
    {
      id: 'gainer-type',
      name: 'Gainer Type',
      icon: '🧬',
      step: 6,
      phase: 'Assessment',
      description: 'Fiber type assessment and rep range optimization',
      integratedFeatures: ['Fiber Type Assessment', 'Rep Range Optimization', 'Volume Tolerance']
    },
    {
      id: 'smart-goals',
      name: 'SMART Goals',
      icon: '📝',
      step: 7,
      phase: 'Assessment',
      description: 'Specific measurable targets and progress tracking setup',
      integratedFeatures: ['Goal Definition', 'Measurable Targets', 'Progress Tracking']
    },
    {
      id: 'volume-landmarks',
      name: 'Volume Landmarks',
      icon: '📊',
      step: 8,
      phase: 'Assessment',
      description: 'Current training volume and MEV/MAV/MRV establishment',
      integratedFeatures: ['Volume Assessment', 'MEV/MAV/MRV', 'Recovery Capacity']
    },
    {
      id: 'system-recommendation',
      name: 'System Recommendation',
      icon: '🤖',
      step: 9,
      phase: 'Assessment',
      description: 'AI-powered program selection and customization parameters',
      integratedFeatures: ['System Recommendation', 'Template Selection', 'Assessment Summary']
    },
    // PHASE 2: PROGRAM ARCHITECTURE (Steps 10-12)
    {
      id: 'periodization',
      name: 'Periodization',
      icon: '📅',
      step: 10,
      phase: 'Architecture',
      description: 'Complete periodization strategy: macrocycles, block sequencing, mesocycles with volume landmarks',
      integratedFeatures: ['Periodization Design', 'Block Sequencing', 'Training Blocks', 'Mesocycles', 'Volume Landmarks']
    },
    {
      id: 'program-design',
      name: 'Program Design',
      icon: '⚙️',
      step: 11,
      phase: 'Architecture',
      description: 'Comprehensive program design: sessions, training methods, loading parameters, variable manipulation',
      integratedFeatures: ['Session Structure', 'Loading Parameters', 'Training Methods', 'Variable Manipulation']
    },
    {
      id: 'implementation-monitoring',
      name: 'Implementation & Monitoring',
      icon: '📊',
      step: 12,
      phase: 'Architecture',
      description: 'Complete implementation with monitoring, recovery tracking, nutrition, and program preview',
      integratedFeatures: ['Monitoring & Recovery', 'Implementation', 'OPEX Nutrition', 'Program Preview']
    }
  ];

  const handleTabClick = (tabId) => {
    actions.setActiveTab(tabId);
  };

  const currentTab = unifiedTabs.find(tab => tab.id === state.activeTab);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      {/* Enhanced Header with Mode Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">Program Design - Complete 12-Step Workflow</h2>
          {currentTab?.step && (
            <div className="text-sm text-gray-400">
              Step {currentTab.step} of 12 - {currentTab.description}
            </div>
          )}
          {currentTab?.phase && (
            <div className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
              Phase: {currentTab.phase}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400">
            Assessment → Periodization → Design → Implementation
          </div>
        </div>
      </div>

      {/* Main Tab Navigation - Multi-Row Layout */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-2">Main Workflow</div>

        {/* Phase 1: Assessment Steps (1-9) */}
        <div className="mb-3">
          <div className="text-xs text-blue-400 mb-2 flex items-center">
            <span className="bg-blue-900 px-2 py-0.5 rounded text-xs mr-2">Phase: Assessment</span>
            Steps 1-9: Comprehensive Assessment
          </div>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-9">
            {unifiedTabs.filter(tab => tab.phase === 'Assessment').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs font-medium ${state.activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                title={tab.description}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-center leading-tight">{tab.name}</span>
                <span className="bg-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                  {tab.step}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase 2: Architecture Steps (10-12) */}
        <div>
          <div className="text-xs text-green-400 mb-2 flex items-center">
            <span className="bg-green-900 px-2 py-0.5 rounded text-xs mr-2">Phase: Architecture</span>
            Steps 10-12: Program Design & Implementation
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {unifiedTabs.filter(tab => tab.phase === 'Architecture').map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium ${state.activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                title={tab.description}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
                <span className="bg-green-800 text-xs px-1.5 py-0.5 rounded-full ml-auto">
                  {tab.step}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note: Specialized tools are now integrated within the main framework tabs */}
    </div>
  );
};

const ProgramContent = () => {
  const { state, actions } = useProgramContext();

  // 12-Step tab configuration for navigation
  const unifiedTabs = [
    // PHASE 1: COMPREHENSIVE ASSESSMENT (Steps 1-9)
    { id: 'primary-goal', name: 'Primary Goal', icon: '🎯', step: 1, phase: 'Assessment' },
    { id: 'experience-level', name: 'Experience Level', icon: '📈', step: 2, phase: 'Assessment' },
    { id: 'timeline', name: 'Timeline', icon: '⏱️', step: 3, phase: 'Assessment' },
    { id: 'injury-screening', name: 'Injury Screening', icon: '🏥', step: 4, phase: 'Assessment' },
    { id: 'pha-health-screen', name: 'PHA Health Screen', icon: '❤️', step: 5, phase: 'Assessment' },
    { id: 'gainer-type', name: 'Gainer Type', icon: '🧬', step: 6, phase: 'Assessment' },
    { id: 'smart-goals', name: 'SMART Goals', icon: '📝', step: 7, phase: 'Assessment' },
    { id: 'volume-landmarks', name: 'Volume Landmarks', icon: '📊', step: 8, phase: 'Assessment' },
    { id: 'system-recommendation', name: 'System Recommendation', icon: '🤖', step: 9, phase: 'Assessment' },
    // PHASE 2: PROGRAM ARCHITECTURE (Steps 10-12)
    { id: 'periodization', name: 'Periodization', icon: '📅', step: 10, phase: 'Architecture' },
    { id: 'program-design', name: 'Program Design', icon: '⚙️', step: 11, phase: 'Architecture' },
    { id: 'implementation-monitoring', name: 'Implementation & Monitoring', icon: '📊', step: 12, phase: 'Architecture' }
  ];

  // Legacy migration functionality
  const migrateFromSrc = async () => {
    try {
      actions.setLoading(true);
      actions.setLegacyMigrationStatus('migrating', null);

      // Check for legacy data in localStorage or specific src paths
      const legacyData = await loadLegacyProgramData();

      if (!legacyData) {
        actions.setLegacyMigrationStatus('no-legacy-data', null);
        return;
      }

      // Perform migration
      const migratedData = migrateLegacyProgramData(legacyData);

      if (!migratedData) {
        actions.setLegacyMigrationStatus('failed', null);
        return;
      }

      // Update context with migrated data
      if (migratedData.goals) {
        actions.setProgramData(migratedData.goals);
      }

      // Set Bryant integration if detected
      if (migratedData.metadata?.bryantIntegrated) {
        const bryantFeatures = migratedData.goals?.bryantFeatures || [];
        const validation = validateBryantIntegration(migratedData.goals);
        actions.setBryantIntegrated(true, bryantFeatures, validation);
      }

      // Generate and store migration report
      const report = generateMigrationReport(migratedData);
      actions.setLegacyMigrationStatus('completed', report);

      console.log('Migration completed successfully:', report);

    } catch (error) {
      console.error('Migration failed:', error);
      actions.setLegacyMigrationStatus('failed', { error: error.message });
      actions.setError('Migration failed: ' + error.message);
    } finally {
      actions.setLoading(false);
    }
  };

  // Load legacy data from various sources
  const loadLegacyProgramData = async () => {
    // Check localStorage for legacy data
    const legacyKeys = ['programData', 'assessmentData', 'periodizationSettings'];
    let legacyData = null;

    for (const key of legacyKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          legacyData = { ...legacyData, [key]: parsed };
        } catch (error) {
          console.warn(`Failed to parse legacy data for ${key}:`, error);
        }
      }
    }

    // TODO: Add checks for file-based legacy data if needed
    // This could include reading from specific directories or API endpoints

    return legacyData;
  };

  // Bryant Periodization integration handler
  const integrateBryantMethods = (methods = []) => {
    const validation = validateBryantIntegration({
      bryantFeatures: methods,
      ...state.programData
    });

    // Validate model compatibility
    const modelValidation = validateModelBryantCompatibility(
      state.selectedTrainingModel,
      methods
    );

    if (!modelValidation.valid) {
      actions.setError(`Model incompatibility: ${modelValidation.error}`);
      return;
    }

    actions.setBryantIntegrated(true, methods, validation);

    // Update available periodization models
    const compatibleModels = getBryantCompatibleModels(methods);
    console.log('Bryant methods integrated:', methods, 'Compatible models:', Object.keys(compatibleModels));
  };

  // Navigation helpers for 12-step workflow
  const getCurrentTabIndex = () => {
    return unifiedTabs.findIndex(tab => tab.id === state.activeTab);
  };

  const handleNext = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex >= 0 && currentIndex < unifiedTabs.length - 1) {
      const nextTab = unifiedTabs[currentIndex + 1];
      actions.setActiveTab(nextTab.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      const previousTab = unifiedTabs[currentIndex - 1];
      actions.setActiveTab(previousTab.id);
    }
  };

  // Enhanced component rendering with all legacy functionality
  const renderActiveTab = () => {
    const commonProps = {
      assessmentData: state.assessmentData,
      programData: state.programData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: getCurrentTabIndex() >= 0 && getCurrentTabIndex() < unifiedTabs.length - 1,
      canGoPrevious: getCurrentTabIndex() > 0
    };

    // 12-Step Complete Workflow tabs
    switch (state.activeTab) {
      // PHASE 1: COMPREHENSIVE ASSESSMENT (Steps 1-9)
      case 'primary-goal':
        return <PrimaryGoalStep {...commonProps} />;

      case 'experience-level':
        return <ExperienceLevelStep {...commonProps} />;

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">⏱️ Step 3: Timeline (Coming Soon)</h3>
              <p className="text-blue-300 text-sm">Program duration and periodization structure selection</p>
            </div>
          </div>
        );

      case 'injury-screening':
        return (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">🏥 Step 4: Injury Screening (Coming Soon)</h3>
              <p className="text-blue-300 text-sm">Safety assessment and movement limitations identification</p>
            </div>
          </div>
        );

      case 'pha-health-screen':
        return <PHAHealthScreenStep {...commonProps} />;

      case 'gainer-type':
        return <GainerTypeStep {...commonProps} />;

      case 'smart-goals':
        return (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">📝 Step 7: SMART Goals (Coming Soon)</h3>
              <p className="text-blue-300 text-sm">Specific measurable targets and progress tracking setup</p>
            </div>
          </div>
        );

      case 'volume-landmarks':
        return (
          <div className="space-y-6">
            <VolumeLandmarksTab {...commonProps} />
          </div>
        );

      case 'system-recommendation':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 System Recommendation & Tactical Applications</h3>
              <p className="text-gray-400 mb-6">AI-powered program selection with specialized tactical training applications</p>

              {/* Basic Recommendations */}
              <div className="mb-6">
                <RecommendationStep {...commonProps} />
              </div>

              {/* Tactical Specialization Option */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-md font-semibold text-white mb-4">Tactical/Occupational Specialization</h4>
                <p className="text-gray-400 text-sm mb-4">
                  For military, law enforcement, firefighters, and tactical athletes requiring operational readiness
                </p>
                <BryantTacticalInterface
                  onMissionUpdate={(mission) => {
                    actions.setAssessmentData({
                      ...state.assessmentData,
                      tacticalMission: mission
                    });
                  }}
                  onAssessmentComplete={(assessment) => {
                    actions.setAssessmentData({
                      ...state.assessmentData,
                      tacticalReadiness: assessment
                    });
                  }}
                  experienceLevel={state.assessmentData?.trainingExperience || 'intermediate'}
                  unit={state.assessmentData?.tacticalUnit || 'individual'}
                  environment={state.assessmentData?.operationalEnvironment || 'urban'}
                />
              </div>
            </div>
          </div>
        );

      // PHASE 2: PROGRAM ARCHITECTURE (Steps 10-12)
      case 'periodization':
        return (
          <div className="space-y-6">
            <MacrocycleStructure {...commonProps} />
            <PhaseDesign {...commonProps} />
            {/* Integrated: Block Sequencing */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Block Sequencing & Timeline</h3>
              <BlockSequencing {...commonProps} />
            </div>
            <MesocyclePlanning {...commonProps} />
            {/* Integrated: Volume Landmarks */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Volume Landmarks Integration</h3>
              <VolumeLandmarksTab />
            </div>
          </div>
        );

      case 'program-design':
        return (
          <div className="space-y-6">
            <MicrocycleDesign {...commonProps} />
            {/* Integrated: Loading Parameters, Training Methods, Variable Manipulation */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Loading Parameters</h3>
                  <LoadingParameters />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Training Methods</h3>
                  <TrainingMethods />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Variable Manipulation</h3>
                  <VariableManipulationTab />
                </div>
              </div>
            </div>
          </div>
        );

      case 'implementation-monitoring':
        return (
          <div className="space-y-6">
            <SessionMonitoring {...commonProps} />
            <Implementation {...commonProps} />
            {/* Integrated: OPEX Nutrition, Program Preview */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">OPEX Nutrition</h3>
                  <OPEXNutrition />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Program Preview</h3>
                  <ProgramPreview />
                </div>
              </div>
            </div>
          </div>
        );

      // Legacy tab support for backwards compatibility
      case 'goals':
        return (
          <div className="space-y-6">
            <GoalsAndNeeds {...commonProps} />
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                ℹ️ Legacy tab redirected to new Assessment & Screening framework
              </p>
            </div>
          </div>
        );
      case 'macrocycle':
      case 'phases':
      case 'mesocycles':
        // Redirect to new Periodization tab
        actions.setActiveTab('periodization');
        return null;
      case 'microcycles':
        // Redirect to new Program Design tab  
        actions.setActiveTab('program-design');
        return null;
      case 'monitoring':
      case 'implementation':
        // Redirect to new Implementation & Monitoring tab
        actions.setActiveTab('implementation-monitoring');
        return null;

      // Specialized tool tabs redirect to their integrated framework tabs
      case 'overview':
        actions.setActiveTab('assessment-screening');
        return null;
      case 'loading':
      case 'methods':
      case 'variables':
        actions.setActiveTab('program-design');
        return null;
      case 'nutrition':
      case 'preview':
        actions.setActiveTab('implementation-monitoring');
        return null;
      case 'specificity':
        actions.setActiveTab('goal-setting');
        return null;
      case 'landmarks':
        actions.setActiveTab('periodization');
        return null;

      default:
        // Default to first tab of 5-component framework
        actions.setActiveTab('assessment-screening');
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Welcome to Enhanced Program Design - 5-Component Framework
              </h3>
              <p className="text-gray-300 mb-6">
                All 15 features (7 core tabs + 8 specialized tools) are now integrated into 5 streamlined components for optimal workflow.
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">🎯 Assessment & Screening</h4>
                  <p className="text-sm text-gray-300">Comprehensive athlete profiling + Program Overview</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">🎯 Goal Setting</h4>
                  <p className="text-sm text-gray-300">SMART goals + Specialty focus</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">📅 Periodization</h4>
                  <p className="text-sm text-gray-300">Macrocycles + Training Blocks + Mesocycles + Volume Landmarks</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">⚙️ Program Design</h4>
                  <p className="text-sm text-gray-300">Sessions + Loading + Methods + Variables</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">🚀 Implementation</h4>
                  <p className="text-sm text-gray-300">Monitoring + Recovery + Nutrition + Preview</p>
                </div>
              </div>

              <p className="text-blue-400 text-sm">
                Click "Assessment & Screening" above to start with your enhanced 5-component framework!
              </p>
            </div>
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
                <span className="text-sm text-gray-300">12-Step Workflow Progress</span>
                <span className="text-sm text-gray-300">
                  Step {getCurrentTabIndex() + 1} of {unifiedTabs.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((getCurrentTabIndex() + 1) / unifiedTabs.length) * 100}%` }}
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
