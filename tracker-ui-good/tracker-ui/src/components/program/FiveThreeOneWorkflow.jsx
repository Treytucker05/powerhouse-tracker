import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Target, Calendar, TrendingUp, Zap, Settings, Play, RefreshCw, RotateCcw } from 'lucide-react';
import * as EngineModule from '../../lib/engines/FiveThreeOneEngine.js';
import { supabase } from '../../lib/api/supabaseClient';
import { syncToSupabase, loadFromSupabase } from '../../context/appHelpers';
import { toast } from 'react-toastify';
import Step1MaxTesting from './steps/Step1MaxTesting';
import ScheduleSelectionStep from './steps/ScheduleSelectionStep';
import Step2CoreLifts from './steps/Step2CoreLifts';
import Step3WarmUp from './steps/Step3WarmUp';
import Step4CycleStructure from './steps/Step4CycleStructure';
import Step5Week1Execution from './steps/Step5Week1Execution';
import Step6Week2Execution from './steps/Step6Week2Execution';
import Step7Week3Execution from './steps/Step7Week3Execution';
import Step8DeloadWeek from './steps/Step8DeloadWeek';
import Step9CycleProgression from './steps/Step9CycleProgression';
import Step10StallingReset from './steps/Step10StallingReset';
import Step12BoringButBig from './steps/Step12BoringButBig';
import Step11AssistanceWork from './steps/Step11AssistanceWork';
import Step13Triumvirate from './steps/Step13Triumvirate';
import Step14PeriodizationBible from './steps/Step14PeriodizationBible';
import Step15Bodyweight from './steps/Step15Bodyweight';
import Step16JackShit from './steps/Step16JackShit';
import Step17ConditioningRecovery from './steps/Step17ConditioningRecovery';
import Step18ProgramCustomization from './steps/Step18ProgramCustomization';

const FiveThreeOneEngine = EngineModule.default ?? EngineModule.FiveThreeOneEngine;

// Complete 5/3/1 workflow component
export default function FiveThreeOneWorkflow() {
    const STORAGE_KEY = 'five_three_one_workflow';
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);
    const [programData, setProgramData] = useState({
        // Maxes data
        maxes: {
            squat: null,
            bench: null,
            deadlift: null,
            overhead_press: null
        },
        // Configuration
        schedule: 'four_day',
        percentageOption: 'option1',
        assistanceTemplate: 'bbb',
        assistanceLevel: 'intermediate',
        deadliftStyle: 'touch_and_go',
        includeConditioning: false,
        conditioningType: 'prowler',
        includeWarmup: true,
        microProgression: false,
        roundTo: 5,
        // Generated program
        generatedProgram: null
    });

    // Load any previously saved workflow (local) on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                // Basic shape guard
                if (parsed && typeof parsed === 'object') {
                    setProgramData(prev => ({ ...prev, ...parsed }));
                }
            }
        } catch (e) {
            console.warn('Failed to load saved 5/3/1 workflow from localStorage:', e);
        }
    }, []);

    // If logged in, try to load from Supabase (preferred); falls back to local if absent
    useEffect(() => {
        (async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user?.id) return;

                const cloud = await loadFromSupabase('user_programs', user.id);
                if (cloud?.five_three_one_workflow && typeof cloud.five_three_one_workflow === 'object') {
                    setProgramData(prev => ({ ...prev, ...cloud.five_three_one_workflow }));
                }
            } catch (e) {
                console.log('Cloud load skipped:', e?.message || e);
            }
        })();
    }, []);

    // Lightweight local autosave on edits
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(programData));
        } catch (e) {
            console.warn('Autosave failed (localStorage):', e);
        }
    }, [programData]);

    // Error boundary
    if (error) {
        return (
            <div className="bg-red-900 border border-red-700 rounded-lg p-6">
                <h3 className="text-red-300 font-bold mb-2">Error in 5/3/1 Workflow</h3>
                <p className="text-red-400">{error.message}</p>
                <button
                    onClick={() => setError(null)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>
        );
    }

    const handleStartProgram = useCallback(() => {
        console.log('🎯 Generating Complete 5/3/1 Program...');

        try {
            // Initialize the FiveThreeOneEngine
            const engine = new FiveThreeOneEngine();

            // Validate maxes first
            const validationErrors = engine.validateMaxes(programData.maxes);
            if (validationErrors.length > 0) {
                throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }

            // Generate the complete program with all configuration
            const generatedProgram = engine.generateCycle(
                engine.calculateAllTrainingMaxes(programData.maxes, programData.roundTo),
                {
                    schedule: programData.schedule,
                    percentageOption: programData.percentageOption,
                    assistanceTemplate: programData.assistanceTemplate,
                    assistanceLevel: programData.assistanceLevel,
                    roundTo: programData.roundTo,
                    includeWarmup: programData.includeWarmup
                }
            );

            // Update state with the generated program
            setProgramData(prev => ({
                ...prev,
                generatedProgram: generatedProgram
            }));

            console.log('✅ Generated Complete Program:', generatedProgram);

        } catch (error) {
            console.error('❌ Error generating program:', error);
            setError(error);
        }
    }, [programData.maxes, programData.schedule, programData.percentageOption, programData.assistanceTemplate, programData.assistanceLevel, programData.roundTo, programData.includeWarmup]);

    // Comprehensive steps array with new components
    const steps = useMemo(() => [
        {
            id: 'maxes',
            title: 'Current Maxes',
            description: 'Enter 1RMs or calculate from rep tests',
            icon: Target,
            component: Step1MaxTesting
        },
        {
            id: 'core_lifts',
            title: 'Core Lifts + Frequency',
            description: 'Choose core lifts, equipment, injuries, and weekly frequency',
            icon: Target,
            component: Step2CoreLifts
        },
        {
            id: 'schedule',
            title: 'Training Schedule',
            description: 'Choose 4/3/2/1 day schedule',
            icon: Calendar,
            component: ScheduleSelectionStep
        },
        {
            id: 'warmup',
            title: 'Warm-Up & Mobility',
            description: 'Configure warm-up style and mobility work',
            icon: Calendar,
            component: Step3WarmUp
        },
        {
            id: 'cycle',
            title: '5/3/1 Cycle Structure',
            description: 'Loading option, deadlift style, and multi-cycle preview',
            icon: TrendingUp,
            component: Step4CycleStructure
        },
        {
            id: 'week1',
            title: 'Week 1 – 3×5 Execution',
            description: 'Rep targets, bad day protocol, rests, and cues',
            icon: Play,
            component: Step5Week1Execution
        },
        {
            id: 'week2',
            title: 'Week 2 – 5/3/1 Execution',
            description: 'Heavier week with 3s; log AMRAP and notes',
            icon: TrendingUp,
            component: Step6Week2Execution
        },
        {
            id: 'week3',
            title: 'Week 3 – 1+ Execution',
            description: 'Peak week; log singles and AMRAP',
            icon: TrendingUp,
            component: Step7Week3Execution
        },
        {
            id: 'week4',
            title: 'Week 4 – Deload',
            description: 'Light week to recover; no AMRAP sets',
            icon: RefreshCw,
            component: Step8DeloadWeek
        },
        {
            id: 'progression',
            title: 'Cycle Progression',
            description: 'Set new training maxes for next cycle',
            icon: TrendingUp,
            component: Step9CycleProgression
        },
        {
            id: 'stalling',
            title: 'Stalling & Reset',
            description: 'Detect stalls and apply resets as needed',
            icon: RotateCcw,
            component: Step10StallingReset
        },
        {
            id: 'percentages',
            title: 'BBB Template',
            description: 'Configure Boring But Big assistance (5x10 at 50-70% TM)',
            icon: Zap,
            component: Step12BoringButBig
        },
        {
            id: 'triumvirate',
            title: 'Triumvirate Template',
            description: 'One main lift + one supplemental + one assistance per day (exact manual defaults, editable)',
            icon: Zap,
            component: Step13Triumvirate
        },
        {
            id: 'assistance',
            title: 'Assistance Work – Philosophy & Guidelines',
            description: 'Select assistance exercises by main lift; follow principles for training economy and weak-point training',
            icon: Zap,
            component: Step11AssistanceWork
        },
        {
            id: 'periodization_bible',
            title: 'Periodization Bible Template',
            description: 'High-volume template for advanced lifters with movement pattern selections and volume controls',
            icon: Zap,
            component: Step14PeriodizationBible
        },
        {
            id: 'options',
            title: 'Program Options',
            description: 'Conditioning, warm-up, progression',
            icon: Settings,
            component: 'ProgramOptionsStep'
        },
        {
            id: 'bodyweight',
            title: 'Bodyweight Template',
            description: 'Equipment-free assistance template with progression methods and rep schemes',
            icon: Zap,
            component: Step15Bodyweight
        },
        {
            id: 'jack_shit',
            title: 'Jack Shit Template',
            description: 'Minimalist 5/3/1: main lifts only with optional brief conditioning',
            icon: Zap,
            component: Step16JackShit
        },
        {
            id: 'conditioning_recovery',
            title: 'Conditioning & Recovery Integration',
            description: 'Configure conditioning frequency/methods and essential recovery protocols (sleep, stress, tissue)',
            icon: Zap,
            component: Step17ConditioningRecovery
        },
        {
            id: 'program_customization',
            title: 'Program Customization & Advanced',
            description: 'Goal-based adjustments, PR tracking, auto-regulation, specialization, and visualization options',
            icon: Settings,
            component: Step18ProgramCustomization
        },
        {
            id: 'generate',
            title: 'Program Generation',
            description: 'Generate complete 5/3/1 program',
            icon: Play,
            component: 'ProgramGenerationStep'
        }
    ], []);    // Optimized step handlers
    const handleNext = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, [steps.length]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    }, []);

    const handleStepChange = useCallback((stepIndex) => {
        setCurrentStep(stepIndex);
    }, []);

    const renderStepContent = () => {
        const step = steps[currentStep];
        const StepComponent = step?.component;

        if (typeof StepComponent === 'string') {
            // Nicely formatted placeholder with clear title/description
            return (
                <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                        <h3 className="text-white font-semibold text-lg">
                            {step?.title || 'Upcoming Feature'}
                        </h3>
                        {step?.description && (
                            <p className="text-gray-300 mt-1">
                                {step.description}
                            </p>
                        )}
                    </div>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-300">
                        This step isn’t available yet in this build. You can still review previous steps or continue planning.
                    </div>
                </div>
            );
        }

        if (!StepComponent) return null;

        switch (step.id) {
            case 'maxes':
                return (
                    <Step1MaxTesting
                        data={programData.step1 || {}}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step1: { ...(prev.step1 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'core_lifts':
                return (
                    <Step2CoreLifts
                        data={programData.step2 || {}}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step2: { ...(prev.step2 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'schedule':
                return (
                    <ScheduleSelectionStep
                        programData={programData}
                        setProgramData={setProgramData}
                    />
                );
            case 'warmup':
                return (
                    <Step3WarmUp
                        data={programData.step3 || { trainingMaxes: programData?.step1?.trainingMaxes || {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step3: { ...(prev.step3 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'cycle':
                return (
                    <Step4CycleStructure
                        data={programData.step4 || { trainingMaxes: programData?.step1?.trainingMaxes || {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step4: { ...(prev.step4 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'week1':
                return (
                    <Step5Week1Execution
                        data={programData.step5 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            loadingOption: programData?.step4?.loadingOption || 1
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step5: { ...(prev.step5 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'week2':
                return (
                    <Step6Week2Execution
                        data={programData.step6 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            loadingOption: programData?.step4?.loadingOption || 1,
                            schedule: programData?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] },
                            week1Results: programData?.step5 || {}
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step6: { ...(prev.step6 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'week3':
                return (
                    <Step7Week3Execution
                        data={programData.step7 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            loadingOption: programData?.step4?.loadingOption || 1,
                            schedule: programData?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] },
                            week2Results: programData?.step6?.week2Results || {}
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step7: { ...(prev.step7 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'week4':
                return (
                    <Step8DeloadWeek
                        data={programData.step8 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            schedule: programData?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] }
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step8: { ...(prev.step8 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'progression':
                return (
                    <Step9CycleProgression
                        data={programData.step9 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            week3Results: programData?.step7?.week3Results || {},
                            schedule: programData?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] }
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step9: { ...(prev.step9 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'stalling':
                return (
                    <Step10StallingReset
                        data={programData.step10 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            week3Results: programData?.step7?.week3Results || {},
                            previousCycles: programData?.previousCycles || [],
                            schedule: programData?.schedule || { frequency: '4day', liftOrder: ['overhead_press', 'deadlift', 'bench', 'squat'] }
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step10: { ...(prev.step10 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'percentages':
                return (
                    <Step12BoringButBig
                        data={programData.step12 || {
                            trainingMaxes: programData?.step1?.trainingMaxes || {},
                            bbbConfig: {},
                            bbbPairings: {},
                            bbbIntensity: 'beginner',
                            bbbAdditionalAssistance: []
                        }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step12: { ...(prev.step12 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'triumvirate':
                return (
                    <Step13Triumvirate
                        data={programData.step13 || { triumvirateConfig: {}, triumvirateCustom: {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step13: { ...(prev.step13 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'assistance':
                return (
                    <Step11AssistanceWork
                        data={programData.step11 || { assistanceWork: {}, customExercises: [] }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step11: { ...(prev.step11 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'periodization_bible':
                return (
                    <Step14PeriodizationBible
                        data={programData.step14 || { bibleConfig: {}, bibleExercises: {}, bibleVolumeLevel: 'moderate', bibleExperience: 'intermediate' }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step14: { ...(prev.step14 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'bodyweight':
                return (
                    <Step15Bodyweight
                        data={programData.step15 || { bodyweightConfig: { selectedExercises: { squat: [], bench: [], deadlift: [], overhead_press: [] }, progressionMethod: 'volume', repScheme: 'standard', frequency: 'daily' }, customExercises: {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step15: { ...(prev.step15 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'jack_shit':
                return (
                    <Step16JackShit
                        data={programData.step16 || { jackShitConfig: { sessionDuration: '20-30', conditioningReplacement: false, conditioningType: 'low_impact', conditioningDuration: 15, focusAreas: [], additionalNotes: '' } }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step16: { ...(prev.step16 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'conditioning_recovery':
                return (
                    <Step17ConditioningRecovery
                        data={programData.step17 || { conditioningConfig: {}, recoveryConfig: {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step17: { ...(prev.step17 || {}), ...partial }
                            }))
                        }
                    />
                );
            case 'program_customization':
                return (
                    <Step18ProgramCustomization
                        data={programData.step18 || { customizationConfig: {} }}
                        updateData={(partial) =>
                            setProgramData(prev => ({
                                ...prev,
                                step18: { ...(prev.step18 || {}), ...partial }
                            }))
                        }
                    />
                );
            default:
                return <StepComponent programData={programData} setProgramData={setProgramData} />;
        }
    };

    const isStepValid = useCallback(() => {
        const currentStepId = steps[currentStep]?.id;
        switch (currentStepId) {
            case 'maxes':
                {
                    const tms = programData?.step1?.trainingMaxes;
                    if (!tms) return false;
                    const required = ['squat', 'bench', 'deadlift', 'overhead_press'];
                    return required.every(k => typeof tms[k] === 'number' && tms[k] > 0);
                }
            case 'core_lifts':
                {
                    const s2 = programData?.step2 || {};
                    const lifts = s2.coreLifts;
                    if (!lifts) return false;
                    const allSelected = ['squat', 'bench', 'deadlift', 'overhead_press'].every(k => typeof lifts[k] === 'string' && lifts[k] !== '');
                    const customNamesOk = Object.entries(lifts).every(([k, v]) => v !== 'custom' ? true : !!(s2.customLifts && s2.customLifts[k] && s2.customLifts[k].trim()))
                    const freqOk = typeof s2.trainingFrequency === 'string' && s2.trainingFrequency.length > 0;
                    const schedOk = typeof s2.schedulePattern === 'string' && s2.schedulePattern.length > 0;
                    return allSelected && customNamesOk && freqOk && schedOk;
                }
            case 'schedule':
                return !!programData.schedule;
            case 'warmup':
                return !!programData?.step3?.warmUpStyle;
            case 'cycle':
                {
                    const s4 = programData?.step4 || {};
                    const hasTms = s4.trainingMaxes && Object.keys(s4.trainingMaxes).length > 0;
                    const deadliftOk = typeof s4.deadliftStyle === 'string' && s4.deadliftStyle.length > 0;
                    return !!hasTms && deadliftOk;
                }
            case 'week1':
                {
                    const s5 = programData?.step5 || {};
                    const execOk = typeof s5.executionStrategy === 'string' && s5.executionStrategy.length > 0;
                    const badDayOk = typeof s5.badDayProtocol === 'string' && s5.badDayProtocol.length > 0;
                    return execOk && badDayOk;
                }
            case 'week2':
                {
                    const s6 = programData?.step6 || {};
                    const sched = s6.schedule || { liftOrder: [] };
                    const order = Array.isArray(sched.liftOrder) ? sched.liftOrder : [];
                    if (order.length === 0) return false;
                    const res = s6.week2Results || {};
                    return order.every(l => res?.[l]?.completed);
                }
            case 'week3':
                {
                    const s7 = programData?.step7 || {};
                    const sched = s7.schedule || programData?.schedule || { liftOrder: [] };
                    const order = Array.isArray(sched.liftOrder) ? sched.liftOrder : [];
                    if (order.length === 0) return false;
                    const res = s7.week3Results || {};
                    return order.every(l => res?.[l]?.completed);
                }
            case 'week4':
                {
                    const s8 = programData?.step8 || {};
                    const sched = s8.schedule || programData?.schedule || { liftOrder: [] };
                    const order = Array.isArray(sched.liftOrder) ? sched.liftOrder : [];
                    if (order.length === 0) return false;
                    const res = s8.deloadResults || {};
                    return order.every(l => res?.[l]?.completed);
                }
            case 'progression':
                {
                    const s9 = programData?.step9 || {};
                    const sched = s9.schedule || programData?.schedule || { liftOrder: [] };
                    const order = Array.isArray(sched.liftOrder) ? sched.liftOrder : [];
                    if (order.length === 0) return false;
                    const tms = s9.newTrainingMaxes || {};
                    return order.every(l => typeof tms?.[l] === 'number' && tms?.[l] > 0);
                }
            case 'stalling':
                {
                    const s10 = programData?.step10 || {};
                    const sched = s10.schedule || programData?.schedule || { liftOrder: [] };
                    const order = Array.isArray(sched.liftOrder) ? sched.liftOrder : [];
                    if (order.length === 0) return false;
                    const decisions = s10.resetDecisions || {};
                    return order.every(l => decisions?.[l] !== undefined);
                }
            case 'assistance':
                {
                    const s11 = programData?.step11 || {};
                    const aw = s11.assistanceWork || {};
                    const counts = Object.values(aw).map((list) => (Array.isArray(list) ? list.length : 0));
                    return counts.some((c) => c > 0);
                }
            case 'percentages':
                {
                    const s12 = programData?.step12 || {};
                    const pairs = s12.bbbPairings || {};
                    const intensity = s12.bbbIntensity || 'beginner';
                    const required = ['squat', 'bench', 'deadlift', 'overhead_press'];
                    const allPaired = required.every((k) => typeof pairs[k] === 'string' && pairs[k]);
                    return allPaired && !!intensity;
                }
            case 'triumvirate':
                {
                    const s13 = programData?.step13 || {};
                    const cfg = s13.triumvirateConfig || {};
                    const dayKeys = ['press', 'deadlift', 'bench', 'squat'];
                    if (Object.keys(cfg).length !== 4) return false;
                    return dayKeys.every(d => cfg?.[d]?.supplemental && cfg?.[d]?.assistance);
                }
            case 'periodization_bible':
                {
                    const s14 = programData?.step14 || {};
                    const ex = s14.bibleExercises || {};
                    // Require each day to have minimum 4 exercises selected across categories
                    const dayKeys = ['press', 'deadlift', 'bench', 'squat'];
                    const getTotal = (day) => Object.values(ex[day] || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
                    return dayKeys.every(day => getTotal(day) >= 4);
                }
            case 'bodyweight':
                {
                    const s15 = programData?.step15 || {};
                    const cfg = s15.bodyweightConfig || { selectedExercises: {} };
                    const anySelected = Object.values(cfg.selectedExercises || {}).some(arr => Array.isArray(arr) && arr.length > 0);
                    return anySelected && !!cfg.progressionMethod && !!cfg.repScheme;
                }
            case 'jack_shit':
                {
                    const s16 = programData?.step16 || {};
                    const cfg = s16.jackShitConfig || {};
                    return !!cfg.sessionDuration && !!cfg.conditioningType && Array.isArray(cfg.focusAreas) && cfg.focusAreas.length > 0;
                }
            case 'conditioning_recovery':
                {
                    const s17 = programData?.step17 || {};
                    const cond = s17.conditioningConfig || {};
                    const rec = s17.recoveryConfig || {};
                    const hi = cond?.highIntensity || { exercises: [] };
                    const li = cond?.lowIntensity || { exercises: [] };
                    const hasConditioning = (cond?.frequency ?? 0) >= 2 && !!cond?.primaryMethod && ((hi.exercises?.length || 0) > 0 || (li.exercises?.length || 0) > 0);
                    const sleepTarget = rec?.sleep?.targetHours ?? 0;
                    const hasRecovery = sleepTarget >= 7 && (rec?.stressManagement?.techniques?.length || 0) > 0 && (rec?.softTissue?.methods?.length || 0) > 0;
                    return hasConditioning && hasRecovery;
                }
            case 'program_customization':
                {
                    const s18 = programData?.step18 || {};
                    const cfg = s18.customizationConfig || {};
                    const goalOk = typeof cfg.primaryGoal === 'string' && cfg.primaryGoal.length > 0;
                    const trackingOk = (cfg.repRecordTracking?.enabled) || (cfg.printableSheets?.enabled) || (cfg.progressVisualization?.enabled);
                    return !!goalOk && !!trackingOk;
                }
            // Add validation for other steps as they are implemented
            default:
                return true; // Default to true for unimplemented steps
        }
    }, [currentStep, programData, steps]);

    // Persist the current workflow to the user's Supabase profile row
    const handleSaveToProfile = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.id) {
                toast.info('Saved locally. Log in to sync with your profile.');
                return;
            }

            const payload = {
                program_type: 'five_three_one',
                program_name: '5/3/1 Workflow',
                five_three_one_workflow: programData,
                version: 1
            };

            const result = await syncToSupabase('user_programs', payload, user.id);
            if (result) {
                toast.success('Program saved to your profile.');
            } else {
                toast.info('Saved locally (cloud table unavailable).');
            }
        } catch (e) {
            console.error('Save to profile failed:', e);
            toast.error('Could not save to profile. Data is saved locally.');
        }
    }, [programData]);

    return (
        <div className="space-y-6">
            {/* Sticky Top Step Header */}
            <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur border-b border-gray-800 -mx-6 px-6 py-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-gray-300">
                        Step {currentStep + 1} of {steps.length}
                        <span className="mx-2 text-gray-600">|</span>
                        <span className="text-white font-medium">{steps[currentStep]?.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 max-w-full">
                        {steps.map((s, idx) => (
                            <button
                                key={s.id}
                                onClick={() => handleStepChange(idx)}
                                className={`text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap border ${idx === currentStep
                                    ? 'bg-red-600 text-white border-red-600'
                                    : idx < currentStep
                                        ? 'bg-green-700/30 text-green-300 border-green-700'
                                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                                    }`}
                                title={s.description}
                            >
                                {idx + 1}. {s.title}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Slim progress bar */}
                <div className="mt-2 h-1 w-full bg-gray-800 rounded">
                    <div
                        className="h-1 bg-red-600 rounded"
                        style={{ width: `${Math.round((currentStep / (steps.length - 1)) * 100)}%` }}
                        aria-hidden="true"
                    />
                </div>
            </div>
            {/* Single navigation lives in sticky header above; progress pills removed to avoid duplication */}

            {/* Step Content */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="mb-4">
                    <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
                </div>

                {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveToProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save to Profile
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
