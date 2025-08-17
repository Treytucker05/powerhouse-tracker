import React, { useState } from 'react';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges.js';
import {
    ProgramProvider, useProgramContext
} from '../contexts/ProgramContext';
import PageLayout, { PageSection } from '../layout/PageLayout';
import './StreamlinedProgram.css';

// Import streamlined step components (reordered for methodology-first workflow)
import SystemRecommendationStep from '../components/program/tabs/SystemRecommendationStep'; // Now Step 1
import PrimaryGoalStep from '../components/program/tabs/PrimaryGoalStep'; // Now Step 2
import ExperienceLevelStep from '../components/program/tabs/ExperienceLevelStep'; // Now Step 3
import TimelineStep from '../components/program/tabs/TimelineStep'; // Now Step 4
import InjuryScreeningStep from '../components/program/tabs/InjuryScreeningStep'; // Now Step 6

// Methodology-specific assessment components (Now Step 5)
import PHAHealthScreenStep from '../components/program/tabs/PHAHealthScreenStep';
import GainerTypeStep from '../components/program/tabs/GainerTypeStep';
import VolumeLandmarksTab from '../components/program/tabs/VolumeLandmarksTab';
import TrainingMaxStep from '../components/program/tabs/TrainingMaxStep';
import MovementAssessmentStep from '../components/program/tabs/MovementAssessmentStep';
import NASMMovementAssessmentStep from '../components/program/tabs/NASMMovementAssessmentStep'; // NASM-specific assessment

// Program architecture components (Now Steps 7-8)
import PeriodizationStep from '../components/program/tabs/PeriodizationStep';
import ProgramDesignStep from '../components/program/tabs/ProgramDesignStep';
import ImplementationStep from '../components/program/tabs/ImplementationStep';

// NASM-specific complete workflow
import NASMProgramWorkflow from '../components/program/NASMProgramWorkflow';

/**
 * StreamlinedProgramDesign - METHODOLOGY-FIRST Workflow Implementation
 * 
 * NEW SIMPLIFIED METHODOLOGY-FIRST WORKFLOW:
 * Phase 1: Choose Methodology (Step 1)
 * Phase 2: User Info (Steps 2-4: Goals, Experience, Timeline)  
 * Phase 3: Assessments (Steps 5-6: Methodology Assessment, Injury Screen)
 * Phase 4: Program Design (Steps 7-8: Periodization, Implementation)
 */

// Enhanced Program Navigation with Methodology-First Workflow
const StreamlinedProgramNavigation = () => {
    const { state, actions } = useProgramContext();
    const [pendingChanges, setPendingChanges] = useState(false);
    useUnsavedChanges(!!pendingChanges);

    // METHODOLOGY-FIRST 4-PHASE Workflow: Methodology → User Info → Assessments → Program Design
    const streamlinedTabs = [
        // PHASE 1: METHODOLOGY FOUNDATION
        {
            id: 'system-recommendation',
            name: 'Choose Methodology',
            icon: '🏛️',
            step: 1,
            phase: 'Methodology Foundation',
            description: 'Select your training methodology and approach',
            features: ['System Selection', 'Methodology Overview', 'Approach Comparison']
        },

        // PHASE 2: USER INFO
        {
            id: 'primary-goal',
            name: 'Training Goals',
            icon: '🎯',
            step: 2,
            phase: 'User Info',
            description: 'Training focus and objectives (methodology-specific)',
            features: ['Methodology-Aware Goals', 'Goal-System Integration']
        },
        {
            id: 'experience-level',
            name: 'Experience Level',
            icon: '📈',
            step: 3,
            phase: 'User Info',
            description: 'Program complexity level and methodology experience',
            features: ['Experience Assessment', 'Recovery Capacity', 'Methodology Background']
        },
        {
            id: 'timeline',
            name: 'Timeline',
            icon: '⏱️',
            step: 4,
            phase: 'User Info',
            description: 'Program duration and methodology-specific periodization',
            features: ['Duration Selection', 'Methodology Phases', 'Deload Scheduling']
        },

        // PHASE 3: ASSESSMENTS
        // Methodology-specific assessment tabs will be inserted here dynamically

        {
            id: 'injury-screening',
            name: 'Injury Screening',
            icon: '🏥',
            step: 6,
            phase: 'Assessments',
            description: 'Safety assessment with methodology-specific considerations',
            features: ['Injury History', 'Movement Screen', 'Methodology Modifications']
        },

        // PHASE 4: PROGRAM DESIGN
        {
            id: 'periodization',
            name: 'Periodization',
            icon: '📅',
            step: 7,
            phase: 'Program Design',
            description: 'Methodology-specific periodization strategy and planning',
            features: ['Methodology Periodization', 'Phase Planning', 'Progression Strategy']
        },
        {
            id: 'implementation',
            name: 'Implementation',
            icon: '📊',
            step: 8,
            phase: 'Program Design',
            description: 'Complete implementation with methodology-specific monitoring',
            features: ['Implementation Plan', 'Progress Monitoring', 'Methodology Tracking']
        }
    ];

    // Dynamic methodology-specific tabs for PHASE 3: ASSESSMENTS (Step 5)
    const getMethodologySpecificTabs = (selectedSystem) => {
        const methodologyTabs = {
            'josh-bryant': [
                {
                    id: 'pha-health-screen',
                    name: 'PHA Health Screen',
                    icon: '❤️',
                    step: 5,
                    phase: 'Assessments',
                    description: 'Physical Activity Readiness for tactical/strongman training'
                },
                {
                    id: 'gainer-type',
                    name: 'Gainer Type',
                    icon: '🧬',
                    step: 5,
                    phase: 'Assessments',
                    description: 'Fiber type assessment for Bryant-specific programming'
                }
            ],
            'RP': [
                {
                    id: 'volume-landmarks',
                    name: 'Volume Landmarks',
                    icon: '📊',
                    step: 5,
                    phase: 'Assessments',
                    description: 'Current training volume and MEV/MAV/MRV establishment'
                }
            ],
            '5/3/1': [
                {
                    id: 'training-max',
                    name: 'Training Max Assessment',
                    icon: '💪',
                    step: 5,
                    phase: 'Assessments',
                    description: 'Current 1RM testing and Training Max establishment'
                }
            ],
            'linear': [
                {
                    id: 'movement-assessment',
                    name: 'Movement Assessment',
                    icon: '🏃',
                    step: 5,
                    phase: 'Assessments',
                    description: 'Movement quality baseline for motor control focus'
                }
            ],
            'NASM': [
                {
                    id: 'nasm-movement-screen',
                    name: 'NASM Movement Screen',
                    icon: '🎯',
                    step: 5,
                    phase: 'Assessments',
                    description: 'NASM movement assessment and muscle imbalance analysis'
                }
            ]
        };

        return methodologyTabs[selectedSystem] || [];
    };

    // Get current methodology-specific tabs ONLY if we're at or past assessment phase (step 5+)
    const currentMethodologyTabs = (state.currentStep >= 5) ? getMethodologySpecificTabs(state.selectedSystem) : [];

    // Combine all tabs in NEW 4-PHASE ORDER: Methodology → User Info → Assessments → Program Design
    const allTabs = [
        // PHASE 1: Methodology Foundation
        ...streamlinedTabs.filter(tab => tab.phase === 'Methodology Foundation'),

        // PHASE 2: User Info
        ...streamlinedTabs.filter(tab => tab.phase === 'User Info'),

        // PHASE 3: Assessments (methodology-specific + injury screening) - only show if at assessment phase
        ...currentMethodologyTabs,
        ...(state.currentStep >= 6 ? streamlinedTabs.filter(tab => tab.phase === 'Assessments' && tab.step === 6) : []),

        // PHASE 4: Program Design - only show if at program design phase
        ...(state.currentStep >= 7 ? streamlinedTabs.filter(tab => tab.phase === 'Program Design') : [])
    ];

    return (
        <div className="program-navigation">
            <PageSection title="Workflow Progress">
                <p className="text-gray-300 mb-6">
                    NEW 4-Phase Workflow: Choose Methodology → User Info → Assessments → Program Design
                </p>

                {/* Progress indicator */}
                <div className="progress-phases mb-6">
                    <div className="flex justify-between">
                        <div className="phase-indicator">
                            <span className="phase-number">Phase 1</span>
                            <span className="phase-name">Choose Methodology</span>
                            <span className="phase-steps">System Selection</span>
                        </div>
                        <div className="phase-indicator">
                            <span className="phase-number">Phase 2</span>
                            <span className="phase-name">User Info</span>
                            <span className="phase-steps">Goals, Experience, Timeline</span>
                        </div>
                        <div className="phase-indicator">
                            <span className="phase-number">Phase 3</span>
                            <span className="phase-name">Assessments</span>
                            <span className="phase-steps">Methodology & Safety</span>
                        </div>
                        <div className="phase-indicator">
                            <span className="phase-number">Phase 4</span>
                            <span className="phase-name">Program Design</span>
                            <span className="phase-steps">Periodization & Implementation</span>
                        </div>
                    </div>
                </div>

                {/* Methodology Context Display */}
                {state.selectedSystem && (
                    <div className="methodology-context mb-4">
                        <div className="selected-methodology">
                            <span className="methodology-label">Selected Methodology:</span>
                            <span className="methodology-name">{state.selectedSystem}</span>
                        </div>
                    </div>
                )}
            </PageSection>

            {/* Tab Navigation - Grouped by Phases */}
            <PageSection title="Program Steps">
                {/* Phase 1: Choose Methodology */}
                <div className="phase-section">
                    <div className="phase-separator" data-phase="Phase 1: Choose Methodology"></div>
                    {allTabs
                        .filter(tab => tab.phase === 'Methodology Foundation')
                        .map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`tab-item ${state.currentStep === tab.step ? 'active' : ''}`}
                                onClick={() => actions.setCurrentStep(tab.step)}
                            >
                                <div className="tab-header">
                                    <span className="tab-icon">{tab.icon}</span>
                                    <div className="tab-info">
                                        <div className="tab-title">
                                            <span className="tab-step">Step {tab.step}</span>
                                            <span className="tab-name">{tab.name}</span>
                                        </div>
                                        <div className="tab-phase">{tab.phase}</div>
                                    </div>
                                </div>
                                <div className="tab-description">{tab.description}</div>
                                {tab.features && (
                                    <div className="tab-features">
                                        {tab.features.map(feature => (
                                            <span key={feature} className="feature-tag">{feature}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                {/* Phase 2: User Info */}
                {state.selectedSystem && (
                    <div className="phase-section">
                        <div className="phase-separator" data-phase="Phase 2: User Info"></div>
                        {allTabs
                            .filter(tab => tab.phase === 'User Info')
                            .map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`tab-item ${state.currentStep === tab.step ? 'active' : ''}`}
                                    onClick={() => actions.setCurrentStep(tab.step)}
                                >
                                    <div className="tab-header">
                                        <span className="tab-icon">{tab.icon}</span>
                                        <div className="tab-info">
                                            <div className="tab-title">
                                                <span className="tab-step">Step {tab.step}</span>
                                                <span className="tab-name">{tab.name}</span>
                                            </div>
                                            <div className="tab-phase">{tab.phase}</div>
                                        </div>
                                    </div>
                                    <div className="tab-description">{tab.description}</div>
                                    {tab.features && (
                                        <div className="tab-features">
                                            {tab.features.map(feature => (
                                                <span key={feature} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {/* Phase 3: Assessments */}
                {state.selectedSystem && (
                    <div className="phase-section">
                        <div className="phase-separator" data-phase="Phase 3: Assessments"></div>
                        {allTabs
                            .filter(tab => tab.phase === 'Assessments')
                            .map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`tab-item ${state.currentStep === tab.step ? 'active' : ''}`}
                                    onClick={() => actions.setCurrentStep(tab.step)}
                                >
                                    <div className="tab-header">
                                        <span className="tab-icon">{tab.icon}</span>
                                        <div className="tab-info">
                                            <div className="tab-title">
                                                <span className="tab-step">Step {tab.step}</span>
                                                <span className="tab-name">{tab.name}</span>
                                            </div>
                                            <div className="tab-phase">{tab.phase}</div>
                                        </div>
                                    </div>
                                    <div className="tab-description">{tab.description}</div>
                                    {tab.features && (
                                        <div className="tab-features">
                                            {tab.features.map(feature => (
                                                <span key={feature} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {/* Phase 4: Program Design */}
                {state.selectedSystem && (
                    <div className="phase-section">
                        <div className="phase-separator" data-phase="Phase 4: Program Design"></div>
                        {allTabs
                            .filter(tab => tab.phase === 'Program Design')
                            .map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`tab-item ${state.currentStep === tab.step ? 'active' : ''}`}
                                    onClick={() => actions.setCurrentStep(tab.step)}
                                >
                                    <div className="tab-header">
                                        <span className="tab-icon">{tab.icon}</span>
                                        <div className="tab-info">
                                            <div className="tab-title">
                                                <span className="tab-step">Step {tab.step}</span>
                                                <span className="tab-name">{tab.name}</span>
                                            </div>
                                            <div className="tab-phase">{tab.phase}</div>
                                        </div>
                                    </div>
                                    <div className="tab-description">{tab.description}</div>
                                    {tab.features && (
                                        <div className="tab-features">
                                            {tab.features.map(feature => (
                                                <span key={feature} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </PageSection>
        </div>
    );
};

// Main Program Component with Step Rendering (REORDERED)
const StreamlinedProgramContent = () => {
    const { state } = useProgramContext();

    const renderCurrentStep = () => {
        switch (state.currentStep) {
            // PHASE 1: METHODOLOGY SELECTION
            case 1:
                return <SystemRecommendationStep />;

            // PHASE 2: USER INFO
            case 2:
                return <PrimaryGoalStep />;

            case 3:
                return <ExperienceLevelStep />;

            case 4:
                return <TimelineStep />;

            // PHASE 3: ASSESSMENTS - Methodology-Specific Assessment
            case 5:
                if (state.selectedSystem === 'josh-bryant') {
                    return <PHAHealthScreenStep />;
                } else if (state.selectedSystem === 'RP') {
                    return <VolumeLandmarksTab />;
                } else if (state.selectedSystem === '5/3/1') {
                    return <TrainingMaxStep />;
                } else if (state.selectedSystem === 'linear') {
                    return <MovementAssessmentStep />;
                } else if (state.selectedSystem === 'NASM') {
                    return <NASMMovementAssessmentStep />; // NASM-specific assessment with full protocol
                }
                return <div>Please select a methodology first</div>;

            case 6:
                return <InjuryScreeningStep />;

            // PHASE 4: PROGRAM DESIGN
            case 7:
                return <PeriodizationStep />;

            case 8:
                return <ImplementationStep />;

            default:
                // Start with methodology selection
                return <SystemRecommendationStep />;
        }
    };

    return (
        <div className="program-content">
            <div className="step-container">
                {/* Show methodology context in step content */}
                {state.selectedSystem && state.currentStep > 1 && (
                    <div className="step-methodology-context">
                        <div className="methodology-badge">
                            <span className="methodology-icon">🏛️</span>
                            <span className="methodology-text">
                                {state.selectedSystem} Methodology
                            </span>
                        </div>
                    </div>
                )}

                {renderCurrentStep()}
            </div>
        </div>
    );
};

// Main Program Page Component
const StreamlinedProgram = () => {
    return (
        <ProgramProvider>
            <StreamlinedProgramRouter />
        </ProgramProvider>
    );
};

// Router component to determine which workflow to use
const StreamlinedProgramRouter = () => {
    const { state } = useProgramContext();

    // If NASM is selected, use the dedicated NASM workflow
    if (state.selectedSystem === 'NASM') {
        return <NASMProgramWorkflow />;
    }

    // Otherwise use the standard streamlined workflow with PageLayout
    return (
        <PageLayout
            title="Streamlined Program"
            subtitle="Design and manage training programs"
            breadcrumbs={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Programs', to: '/programs' },
                { label: 'Streamlined Program' }
            ]}
            glass
        >
            <div className="program-page streamlined-workflow methodology-first">
                <div className="program-container">
                    <StreamlinedProgramNavigation />
                    <StreamlinedProgramContent />
                </div>
            </div>
        </PageLayout>
    );
};

export default StreamlinedProgram;
