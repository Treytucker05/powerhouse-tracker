import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    CheckIcon,
    ChevronDownIcon,
    UserIcon,
    MagnifyingGlassIcon,
    CogIcon,
    PlayIcon
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgramContext } from '../../contexts/ProgramContext';
import { nasmStepConfig, nasmPhases, getNASMStep, getNextNASMStep, getPreviousNASMStep } from '../../config/nasmStepConfig';
import PageLayout, { PageSection } from '../../layout/PageLayout';
import '../../styles/GlobalNASMStyles.css';

// Import NASM step components
import NASMIntakeStep from './tabs/NASMIntakeStep';
import NASMVitalsStep from './tabs/NASMVitalsStep';
import NASMStaticPostureStep from './tabs/NASMStaticPostureStep';
import NASMMovementAssessmentStep from './tabs/NASMMovementAssessmentStep';
import NASMOPTPhaseStep from './tabs/NASMOPTPhaseStep';

/**
 * NASMProgramWorkflow - Complete 17-Step NASM OPT Program Design
 * 
 * Implements the exact NASM OPT Model workflow:
 * Foundation (Steps 1-2): Intake & Vitals
 * Assessment (Steps 3-6): Posture, Movement, Compensation Mapping, Performance
 * Programming (Steps 7-12): Phase Selection, Exercise Prescription
 * Implementation (Steps 13-17): Program Structure, Progression, Monitoring
 */

const NASMProgramWorkflow = () => {
    const { state, actions } = useProgramContext();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State for tracking completed steps
    const [completedSteps, setCompletedSteps] = useState(new Set());

    // Animation state for smooth transitions
    const [isContentVisible, setIsContentVisible] = useState(true);
    const [animationKey, setAnimationKey] = useState(0);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Accordion state for phase expansion
    const [openPhases, setOpenPhases] = useState(new Set());

    // Get current step from URL params or state, default to step 1
    const urlStep = parseInt(searchParams.get('step')) || null;
    const currentStep = urlStep || state.currentStep || 1;
    const currentStepConfig = getNASMStep(currentStep);

    // Enhanced step navigation with URL routing
    const navigateToStep = (stepId) => {
        // Update URL with step parameter
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('step', stepId.toString());
            return newParams;
        });

        // Update context state
        actions.setCurrentStep(stepId);

        // Close mobile sidebar when navigating
        setMobileSidebarOpen(false);
    };

    // Update completed steps when current step changes
    useEffect(() => {
        if (currentStep > 1) {
            setCompletedSteps(prev => {
                const newCompleted = new Set(prev);
                // Mark all previous steps as completed
                for (let i = 1; i < currentStep; i++) {
                    newCompleted.add(i);
                }
                return newCompleted;
            });
        }
    }, [currentStep]);

    // Update URL when step changes from context
    useEffect(() => {
        if (state.currentStep && !urlStep) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('step', state.currentStep.toString());
                return newParams;
            });
        }
    }, [state.currentStep, urlStep, setSearchParams]);

    // Close mobile sidebar on screen size change
    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 1024;
            setIsDesktop(isLargeScreen);
            if (isLargeScreen) {
                setMobileSidebarOpen(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize current phase as open
    useEffect(() => {
        const currentPhase = getCurrentPhase();
        setOpenPhases(prev => new Set([...prev, currentPhase]));
    }, [currentStep]);

    // Handle step transitions with smooth animations
    useEffect(() => {
        // Trigger fade-out, then fade-in for smooth transition
        setIsContentVisible(false);
        const timer = setTimeout(() => {
            setIsContentVisible(true);
            setAnimationKey(prev => prev + 1); // Force re-render for framer-motion
        }, 150); // Half the transition duration for smooth overlap

        return () => clearTimeout(timer);
    }, [currentStep]);

    // Define all 17 steps with proper titles from nasmStepConfig
    const steps = (nasmStepConfig || []).map(step => ({
        id: step.id,
        title: step.name,
        phase: step.phase
    }));

    // Helper function to get current phase
    const getCurrentPhase = () => {
        if (steps.length === 0) return 'foundation';
        const currentStepData = steps.find(step => step.id === currentStep);
        const phase = currentStepData?.phase || 'Foundation';
        // Convert to lowercase to match our accordion state keys
        return phase.toLowerCase();
    };

    // Group steps by phase
    const stepsByPhase = {
        foundation: steps.filter(step => step.phase === 'Foundation'),
        assessment: steps.filter(step => step.phase === 'Assessment'),
        programming: steps.filter(step => step.phase === 'Programming'),
        implementation: steps.filter(step => step.phase === 'Implementation')
    };

    // Toggle phase accordion
    const togglePhase = (phase) => {
        setOpenPhases(prev => {
            const newOpenPhases = new Set(prev);
            if (newOpenPhases.has(phase)) {
                newOpenPhases.delete(phase);
            } else {
                newOpenPhases.add(phase);
            }
            return newOpenPhases;
        });
    };

    const getPhaseSteps = (phase) => steps.filter(step => step.phase === phase);

    const renderStepComponent = (stepId) => {
        switch (stepId) {
            case 1:
                return <NASMIntakeStep />;
            case 2:
                return <NASMVitalsStep />;
            case 3:
                return <NASMStaticPostureStep />;
            case 4:
                return <NASMMovementAssessmentStep />;
            case 5:
                return <div className="coming-soon p-6 bg-gray-800 rounded-lg">
                    <h3 className="text-white text-xl font-bold mb-4 tracking-wide" style={{ fontFamily: "'Roboto', sans-serif" }}>Step 5: Compensation Mapping</h3>
                    <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Coming soon - Muscle imbalance analysis and corrective strategy</p>
                    <button
                        onClick={() => navigateToStep(6)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                        Skip to Performance Tests →
                    </button>
                </div>;
            case 6:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4 tracking-wide">Step 6: Performance & Capacity Tests</h3>
                    <p className="text-sm text-gray-300 mb-4">Coming soon - Push-up test, Davies test, Shark skill, 1RM estimation</p>
                    <button
                        onClick={() => navigateToStep(7)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to OPT Phase Selection →
                    </button>
                </div>;
            case 7:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4 tracking-wide">Step 7: Choose Starting OPT Phase</h3>
                    <p className="text-sm text-gray-300 mb-4">Coming soon - Phase 1-5 selection based on assessment findings</p>
                    <button
                        onClick={() => navigateToStep(8)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Corrective Warm-up →
                    </button>
                </div>;
            case 8:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4 tracking-wide">Step 8: Corrective Warm-up Block</h3>
                    <p className="text-sm text-gray-300 mb-4">Coming soon - SMR and stretching prescription by phase</p>
                    <button
                        onClick={() => navigateToStep(9)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Core/Balance/Plyo →
                    </button>
                </div>;
            case 9:
                return <NASMOPTPhaseStep />;
            case 10:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 10: SAQ (Speed, Agility, Quickness)</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Sport-specific drill programming</p>
                    <button
                        onClick={() => navigateToStep(11)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Resistance Training →
                    </button>
                </div>;
            case 11:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 11: Resistance Training Block</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Exercise selection, sets, reps, tempo, rest periods</p>
                    <button
                        onClick={() => navigateToStep(12)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Cardio Plan →
                    </button>
                </div>;
            case 12:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 12: Cardiorespiratory Plan (FITTE)</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Heart rate zones and cardio prescription</p>
                    <button
                        onClick={() => navigateToStep(13)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Session Template →
                    </button>
                </div>;
            case 13:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 13: Session Template & Weekly Split</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Microcycle design and session structure</p>
                    <button
                        onClick={() => navigateToStep(14)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Mesocycle →
                    </button>
                </div>;
            case 14:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 14: Monthly Progression Rules (Mesocycle)</h3>
                    <p className="text-gray-300 mb-4">Coming soon - 4-week progression and deload planning</p>
                    <button
                        onClick={() => navigateToStep(15)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Macrocycle →
                    </button>
                </div>;
            case 15:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 15: Annual Plan (Macrocycle)</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Yearly periodization and phase transitions</p>
                    <button
                        onClick={() => navigateToStep(16)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Special Populations →
                    </button>
                </div>;
            case 16:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 16: Special Population/Constraint Modifications</h3>
                    <p className="text-gray-300 mb-4">Coming soon - Population-specific adaptations and equipment constraints</p>
                    <button
                        onClick={() => navigateToStep(17)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Skip to Monitoring →
                    </button>
                </div>;
            case 17:
                return <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-white text-xl font-bold mb-4">Step 17: Monitoring & Reassessment</h3>
                    <p className="text-gray-300 mb-4">Coming soon - KPI tracking and reassessment protocols</p>
                    <div className="mt-6 p-4 bg-green-800 rounded-lg border border-green-600">
                        <h4 className="text-green-100 text-lg font-semibold mb-2">🎉 NASM OPT Program Design Complete!</h4>
                        <p className="text-green-200">You have completed the comprehensive 17-step NASM program design process.</p>
                    </div>
                </div>;
            default:
                return <div>Step not found</div>;
        }
    };

    return (
        <PageLayout
            title="NASM Program Workflow"
            subtitle="Assessment, corrective strategy, and phased programming"
            breadcrumbs={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Programs', to: '/programs' },
                { label: 'NASM Workflow' }
            ]}
            glass
            actions={[
                <span key="progress" className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    Step {currentStep || 1} of 17
                </span>
            ]}
        >
            <div className="workflow-container text-white" style={{ fontFamily: "'Roboto', sans-serif" }}>
                {/* Main Content - Grid Layout with Sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6 pb-20 lg:pb-6">{/* Mobile Progress Indicator */}
                    <div className="w-full bg-gray-700 rounded-full h-2 md:hidden mb-4">
                        <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep || 1) / 17) * 100}%` }}
                        />
                    </div>
                    {/* Vertical Sidebar Navigation */}
                    <PageSection title="Phase Navigation">
                        <motion.div
                            className="order-first"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* Mobile Toggle Button */}
                            <div className="md:hidden mb-4">
                                <button
                                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white font-medium flex items-center justify-between hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-sm text-white tracking-wide">☰ Step Navigation</span>
                                    <motion.div
                                        animate={{ rotate: mobileSidebarOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-red-400"
                                    >
                                        ▼
                                    </motion.div>
                                </button>
                            </div>

                            {/* Vertical Phase Progress Pills */}
                            <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block flex flex-col space-y-2 mb-6`}>
                                {/* Foundation Phase */}
                                <motion.button
                                    onClick={() => togglePhase('foundation')}
                                    className={`px-4 py-3 rounded-md transition-all duration-200 text-left ${currentStep <= 2
                                        ? 'bg-red-600 text-white'
                                        : currentStep > 2
                                            ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                            : 'bg-gray-700 text-white hover:bg-red-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <UserIcon className="w-5 h-5 text-white" />
                                            <div>
                                                <div className="text-xl font-medium text-white tracking-wide" style={{ fontFamily: "'Roboto', sans-serif" }}>Foundation</div>
                                                <small className="text-sm text-gray-300" style={{ fontFamily: "'Roboto', sans-serif" }}>Steps 1-2</small>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {currentStep > 2 && (
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            )}
                                            <motion.div
                                                animate={{ rotate: openPhases.has('foundation') ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDownIcon className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Assessment Phase */}
                                <motion.button
                                    onClick={() => togglePhase('assessment')}
                                    className={`px-4 py-3 rounded-md transition-all duration-200 text-left ${currentStep >= 3 && currentStep <= 6
                                        ? 'bg-red-600 text-white'
                                        : currentStep > 6
                                            ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                            : 'bg-gray-700 text-white hover:bg-red-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                                            <div>
                                                <div className="text-xl font-medium text-white tracking-wide" style={{ fontFamily: "'Roboto', sans-serif" }}>Assessment</div>
                                                <small className="text-sm text-gray-300" style={{ fontFamily: "'Roboto', sans-serif" }}>Steps 3-6</small>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {currentStep > 6 && (
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            )}
                                            <motion.div
                                                animate={{ rotate: openPhases.has('assessment') ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDownIcon className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Programming Phase */}
                                <motion.button
                                    onClick={() => togglePhase('programming')}
                                    className={`px-4 py-3 rounded-md transition-all duration-200 text-left ${currentStep >= 7 && currentStep <= 12
                                        ? 'bg-red-600 text-white'
                                        : currentStep > 12
                                            ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                            : 'bg-gray-700 text-white hover:bg-red-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <CogIcon className="w-5 h-5 text-white" />
                                            <div>
                                                <div className="text-xl font-medium text-white tracking-wide" style={{ fontFamily: "'Roboto', sans-serif" }}>Programming</div>
                                                <small className="text-sm text-gray-300" style={{ fontFamily: "'Roboto', sans-serif" }}>Steps 7-12</small>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {currentStep > 12 && (
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            )}
                                            <motion.div
                                                animate={{ rotate: openPhases.has('programming') ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDownIcon className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Implementation Phase */}
                                <motion.button
                                    onClick={() => togglePhase('implementation')}
                                    className={`px-4 py-3 rounded-md transition-all duration-200 text-left ${currentStep >= 13
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-700 text-white hover:bg-red-600'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <PlayIcon className="w-5 h-5 text-white" />
                                            <div>
                                                <div className="text-xl font-medium text-white tracking-wide" style={{ fontFamily: "'Roboto', sans-serif" }}>Implementation</div>
                                                <small className="text-sm text-gray-300" style={{ fontFamily: "'Roboto', sans-serif" }}>Steps 13-17</small>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {currentStep === 17 && (
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            )}
                                            <motion.div
                                                animate={{ rotate: openPhases.has('implementation') ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDownIcon className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Accordion-style All Steps Navigation */}
                            <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block flex flex-col space-y-2`}>
                                <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>All Steps</h3>

                                {/* Foundation Phase Accordion */}
                                <div className="space-y-1">
                                    <motion.button
                                        onClick={() => togglePhase('foundation')}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-200"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="text-white font-medium text-sm">Foundation (Steps 1-2)</span>
                                        <motion.div
                                            animate={{ rotate: openPhases.has('foundation') ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                                        </motion.div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {openPhases.has('foundation') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-4 space-y-1"
                                            >
                                                {stepsByPhase.foundation.map((step, index) => {
                                                    const isActive = step.id === currentStep;
                                                    const isCompleted = step.id < currentStep;
                                                    return (
                                                        <motion.button
                                                            key={step.id}
                                                            onClick={() => navigateToStep(step.id)}
                                                            className={`w-full px-3 py-2 rounded-md transition-all duration-200 text-left ${isActive
                                                                ? 'bg-red-600 text-white'
                                                                : isCompleted
                                                                    ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                                                    : 'bg-gray-600 text-white hover:bg-red-600'
                                                                }`}
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="text-sm font-medium text-white tracking-wide">Step {step.id}</div>
                                                                    <div className={`text-xs mt-1 ${isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                                                                        {step.title}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    {isCompleted && <span className="text-green-400 text-sm">✓</span>}
                                                                    {isActive && <span className="text-white text-sm">→</span>}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Assessment Phase Accordion */}
                                <div className="space-y-1">
                                    <motion.button
                                        onClick={() => togglePhase('assessment')}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-200"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="text-white font-medium text-sm">Assessment (Steps 3-6)</span>
                                        <motion.div
                                            animate={{ rotate: openPhases.has('assessment') ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                                        </motion.div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {openPhases.has('assessment') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-4 space-y-1"
                                            >
                                                {stepsByPhase.assessment.map((step, index) => {
                                                    const isActive = step.id === currentStep;
                                                    const isCompleted = step.id < currentStep;
                                                    return (
                                                        <motion.button
                                                            key={step.id}
                                                            onClick={() => navigateToStep(step.id)}
                                                            className={`w-full px-3 py-2 rounded-md transition-all duration-200 text-left text-sm ${isActive
                                                                ? 'bg-red-600 text-white'
                                                                : isCompleted
                                                                    ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                                                    : 'bg-gray-600 text-white hover:bg-red-600'
                                                                }`}
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium text-white">Step {step.id}</div>
                                                                    <div className={`text-xs mt-1 ${isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                                                                        {step.title}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    {isCompleted && <span className="text-green-400 text-sm">✓</span>}
                                                                    {isActive && <span className="text-white text-sm">→</span>}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Programming Phase Accordion */}
                                <div className="space-y-1">
                                    <motion.button
                                        onClick={() => togglePhase('programming')}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-200"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="text-white font-medium text-sm">Programming (Steps 7-12)</span>
                                        <motion.div
                                            animate={{ rotate: openPhases.has('programming') ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                                        </motion.div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {openPhases.has('programming') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-4 space-y-1"
                                            >
                                                {stepsByPhase.programming.map((step, index) => {
                                                    const isActive = step.id === currentStep;
                                                    const isCompleted = step.id < currentStep;
                                                    return (
                                                        <motion.button
                                                            key={step.id}
                                                            onClick={() => navigateToStep(step.id)}
                                                            className={`w-full px-3 py-2 rounded-md transition-all duration-200 text-left text-sm ${isActive
                                                                ? 'bg-red-600 text-white'
                                                                : isCompleted
                                                                    ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                                                    : 'bg-gray-600 text-white hover:bg-red-600'
                                                                }`}
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium text-white">Step {step.id}</div>
                                                                    <div className={`text-xs mt-1 ${isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                                                                        {step.title}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    {isCompleted && <span className="text-green-400 text-sm">✓</span>}
                                                                    {isActive && <span className="text-white text-sm">→</span>}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Implementation Phase Accordion */}
                                <div className="space-y-1">
                                    <motion.button
                                        onClick={() => togglePhase('implementation')}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-200"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="text-white font-medium text-sm">Implementation (Steps 13-17)</span>
                                        <motion.div
                                            animate={{ rotate: openPhases.has('implementation') ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                                        </motion.div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {openPhases.has('implementation') && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-4 space-y-1"
                                            >
                                                {stepsByPhase.implementation.map((step, index) => {
                                                    const isActive = step.id === currentStep;
                                                    const isCompleted = step.id < currentStep;
                                                    return (
                                                        <motion.button
                                                            key={step.id}
                                                            onClick={() => navigateToStep(step.id)}
                                                            className={`w-full px-3 py-2 rounded-md transition-all duration-200 text-left text-sm ${isActive
                                                                ? 'bg-red-600 text-white'
                                                                : isCompleted
                                                                    ? 'bg-green-800 text-green-100 hover:bg-green-700'
                                                                    : 'bg-gray-600 text-white hover:bg-red-600'
                                                                }`}
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium text-white">Step {step.id}</div>
                                                                    <div className={`text-xs mt-1 ${isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                                                                        {step.title}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    {isCompleted && <span className="text-green-400 text-sm">✓</span>}
                                                                    {isActive && <span className="text-white text-sm">→</span>}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </PageSection>

                    {/* Main Content Area */}
                    <PageSection title={currentStepConfig ? `Step ${currentStepConfig.id}: ${currentStepConfig.name}` : "Current Step"}>
                        <div className="space-y-4 lg:space-y-6">
                            {/* Current Step Info - Responsive padding and text sizes */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`step-info-${currentStep}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    {currentStepConfig && (
                                        <div className="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700">
                                            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                                                <div
                                                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-white text-lg lg:text-xl flex-shrink-0"
                                                    style={{ backgroundColor: nasmPhases[currentStepConfig.phase]?.color || '#dc2626' }}
                                                >
                                                    {currentStepConfig.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-lg lg:text-xl font-bold text-white mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                                        Step {currentStepConfig.id}: {currentStepConfig.name}
                                                    </h2>
                                                    <p className="text-sm lg:text-base leading-6 text-gray-300" style={{ fontFamily: "'Roboto', sans-serif" }}>{currentStepConfig.description}</p>
                                                </div>
                                            </div>

                                            {/* Requirements & Outputs - Responsive grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <motion.div
                                                    className="bg-gray-900 rounded-lg p-3 lg:p-4"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.1 }}
                                                >
                                                    <h4 className="font-semibold text-red-400 mb-2 text-sm lg:text-base" style={{ fontFamily: "'Roboto', sans-serif" }}>Requires:</h4>
                                                    <ul className="space-y-1">
                                                        {(currentStepConfig.requires || []).map((req, index) => (
                                                            <motion.li
                                                                key={index}
                                                                className="text-sm lg:text-base leading-6 text-gray-300"
                                                                style={{ fontFamily: "'Roboto', sans-serif" }}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                                                            >
                                                                • {req}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                                <motion.div
                                                    className="bg-gray-900 rounded-lg p-3 lg:p-4"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.1 }}
                                                >
                                                    <h4 className="font-semibold text-green-400 mb-2 text-sm lg:text-base" style={{ fontFamily: "'Roboto', sans-serif" }}>Outputs:</h4>
                                                    <ul className="space-y-1">
                                                        {(currentStepConfig.outputs || []).map((output, index) => (
                                                            <motion.li
                                                                key={index}
                                                                className="text-sm lg:text-base leading-6 text-gray-300"
                                                                style={{ fontFamily: "'Roboto', sans-serif" }}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                                                            >
                                                                • {output}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Step Content - Responsive padding */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`step-content-${currentStep}-${animationKey}`}
                                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -30 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                        scale: { duration: 0.3 },
                                        y: { duration: 0.4 }
                                    }}
                                    className={`bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700 transition-opacity duration-300 ease-in-out ${isContentVisible ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    {renderStepComponent(currentStep)}
                                </motion.div>
                            </AnimatePresence>

                            {/* Desktop Navigation Controls - Hidden on mobile */}
                            <motion.div
                                className="hidden md:flex items-center justify-between space-x-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => {
                                        const prevStep = getPreviousNASMStep(currentStep);
                                        if (prevStep) navigateToStep(prevStep.id);
                                    }}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                    whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                                    whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    ← Previous Step
                                </motion.button>

                                <motion.div
                                    className="flex-1 max-w-xs"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <select
                                        value={currentStep}
                                        onChange={(e) => navigateToStep(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                    >
                                        {(nasmStepConfig || []).map(step => (
                                            <option key={step.id} value={step.id}>
                                                Step {step.id}: {step.name}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                <motion.button
                                    onClick={() => {
                                        const nextStep = getNextNASMStep(currentStep);
                                        if (nextStep) navigateToStep(nextStep.id);
                                    }}
                                    disabled={currentStep === 17}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 17
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                    whileHover={{ scale: currentStep === 17 ? 1 : 1.05 }}
                                    whileTap={{ scale: currentStep === 17 ? 1 : 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Next Step →
                                </motion.button>
                            </motion.div>
                        </div>
                    </PageSection>
                </div>

                {/* Fixed Mobile Navigation - Always visible at bottom on mobile */}
                <div className="md:hidden">
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between space-x-4 max-w-screen-xl mx-auto">
                            <motion.button
                                onClick={() => {
                                    const prevStep = getPreviousNASMStep(currentStep);
                                    if (prevStep) navigateToStep(prevStep.id);
                                }}
                                disabled={currentStep === 1}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                whileHover={{ scale: currentStep === 1 ? 1 : 1.02 }}
                                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                ← Previous
                            </motion.button>

                            {/* Mobile Step Indicator */}
                            <div className="flex flex-col items-center px-4">
                                <div className="text-xs text-gray-400 mb-1">Step</div>
                                <div className="text-lg font-bold text-white">{currentStep}/17</div>
                                <div className="w-16 bg-gray-700 rounded-full h-1 mt-1">
                                    <div
                                        className="bg-red-600 h-1 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentStep / 17) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <motion.button
                                onClick={() => {
                                    const nextStep = getNextNASMStep(currentStep);
                                    if (nextStep) navigateToStep(nextStep.id);
                                }}
                                disabled={currentStep === 17}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 17
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                whileHover={{ scale: currentStep === 17 ? 1 : 1.02 }}
                                whileTap={{ scale: currentStep === 17 ? 1 : 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                Next →
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageLayout>
    );
};

export default NASMProgramWorkflow;
