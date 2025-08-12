/**
 * ProgramWizard531V2.jsx - New V2 5/3/1 Wizard Shell
 * Clean, minimal wizard with step navigation and V2 context integration
 */

import React, { useState, useCallback } from 'react';
import { ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useProgramV2 } from "../contexts/ProgramContextV2.jsx";
import { buildMainSetsForLift, buildWarmupSets, roundToIncrement } from "../engines/FiveThreeOneEngine.v2.js";
import Step1Fundamentals from './steps/Step1Fundamentals.jsx';
import Step2TemplateOrCustom from './steps/Step2TemplateOrCustom.jsx';
import Step3DesignCustom from './steps/Step3DesignCustom.jsx';
import Step4ReviewExport from './steps/Step4ReviewExport.jsx';

const STEPS = [
    { id: 'fundamentals', title: 'Fundamentals', description: 'Units, rounding, TM%, 1RM/rep tests' },
    { id: 'template', title: 'Template / Custom', description: 'Select template or continue custom' },
    { id: 'design', title: 'Design (if Custom)', description: 'Custom schedule, warm-ups, supplemental, assistance' },
    { id: 'review', title: 'Review & Export', description: 'Cycle preview, export & print' }
];

function WizardShell() {
    const [stepIndex, setStepIndex] = useState(0);
    const [stepValidation, setStepValidation] = useState({ fundamentals: false, design: false, review: false });
    const navigate = useNavigate();
    const { state } = useProgramV2();
    function humanLiftName(key) {
        return key === "overhead_press" ? "Press" : key[0].toUpperCase() + key.slice(1);
    }
    function oppositeOf(liftKey) {
        if (liftKey === "overhead_press") return "bench";
        if (liftKey === "bench") return "overhead_press";
        if (liftKey === "squat") return "deadlift";
        if (liftKey === "deadlift") return "squat";
        return liftKey;
    }

    function handleStartCycle() {
        const {
            units = "lbs",
            rounding = { increment: 5, mode: "nearest" },
            loadingOption = 1,
            trainingMaxes = {},
            schedule = {},
            supplemental = { strategy: "none" },
            assistance = { mode: "minimal" },
            flowMode,
            templateKey,
        } = state || {};

        const tmKeys = ["squat", "bench", "deadlift", "overhead_press"];
        const tmOk = tmKeys.every(k => Number(trainingMaxes?.[k]) > 0);
        if (!tmOk) return;

        const freq = Number(schedule?.frequency || 4);
        const defaultDays = ["overhead_press", "deadlift", "bench", "squat"];
        const days = Array.isArray(schedule?.days) && schedule.days.length === freq
            ? schedule.days
            : defaultDays.slice(0, freq);

        const weeks = [];
        for (let w = 0; w < 4; w++) {
            const daysOut = days.map((liftKey, idx) => {
                const tm = Number(trainingMaxes?.[liftKey] || 0);

                const warmups = buildWarmupSets({
                    includeWarmups: !!schedule?.includeWarmups,
                    warmupScheme: schedule?.warmupScheme,
                    tm,
                    roundingIncrement: rounding.increment,
                    roundingMode: rounding.mode,
                    units
                });

                const main = buildMainSetsForLift({
                    tm,
                    weekIndex: w,
                    option: loadingOption || 1,
                    roundingIncrement: rounding.increment,
                    roundingMode: rounding.mode,
                    units
                });

                let supplementalOut = null;
                if (supplemental?.strategy === "bbb") {
                    const pairing = supplemental?.pairing || "same";
                    const bbbLiftKey = pairing === "opposite" ? oppositeOf(liftKey) : liftKey;
                    const bbbTm = Number(trainingMaxes?.[bbbLiftKey] || 0);
                    const pct = Number(supplemental?.percentOfTM || 50);
                    const raw = bbbTm * (pct / 100);
                    const weight = roundToIncrement(raw, rounding.increment, rounding.mode);
                    supplementalOut = {
                        type: "bbb",
                        pairing,
                        liftKey: bbbLiftKey,
                        sets: 5,
                        reps: 10,
                        percentOfTM: pct,
                        weight,
                        units
                    };
                }

                let assistanceOut = { mode: assistance?.mode || "minimal" };
                if (assistanceOut.mode === "custom" && assistance?.customPlan?.[liftKey]) {
                    assistanceOut.custom = assistance.customPlan[liftKey].map(item => ({
                        name: item.name,
                        sets: item.sets,
                        reps: item.reps
                    }));
                }

                return {
                    day: idx + 1,
                    liftKey,
                    lift: humanLiftName(liftKey),
                    warmups,
                    main,
                    supplemental: supplementalOut,
                    assistance: assistanceOut
                };
            });
            weeks.push({ week: w + 1, days: daysOut });
        }

        const payload = {
            meta: {
                createdAt: new Date().toISOString(),
                templateKey: templateKey || null,
                flowMode: flowMode || "custom",
                units,
                loadingOption
            },
            trainingMaxes,
            rounding,
            schedule: {
                frequency: freq,
                days,
                includeWarmups: !!schedule?.includeWarmups,
                warmupScheme: schedule?.warmupScheme || null
            },
            supplemental: supplemental || { strategy: "none" },
            assistance: assistance || { mode: "minimal" },
            weeks
        };

        try {
            localStorage.setItem("ph531.activeProgram.v2", JSON.stringify(payload));
            navigate("/program/531/active");
        } catch (e) {
            console.error("Failed to save active program:", e);
        }
    }

    const markComplete = (id) => setStepValidation(prev => ({ ...prev, [id]: true }));

    const currentStep = STEPS[stepIndex];
    const canGoNext = (() => {
        if (currentStep.id === 'fundamentals') return stepValidation.fundamentals;
        if (currentStep.id === 'design') return stepValidation.design; // only when valid custom design
        if (currentStep.id === 'review') return stepValidation.review; // enables final action
        return false;
    })() && stepIndex < STEPS.length - 1;
    const canGoBack = stepIndex > 0;

    const handleStepValidation = useCallback((stepId, isValid) => {
        setStepValidation(prev => {
            const prevVal = prev[stepId];
            if (prevVal === isValid) return prev; // guard: no state update if unchanged
            return { ...prev, [stepId]: isValid };
        });
    }, []);

    const handleNext = () => {
        if (canGoNext) {
            setStepIndex(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (canGoBack) {
            setStepIndex(prev => prev - 1);
        }
    };

    const handleStepClick = (index) => {
        // Allow clicking on current or previous steps only
        if (index <= stepIndex) {
            setStepIndex(index);
        }
    };

    const renderStepContent = () => {
        switch (stepIndex) {
            case 0:
                return (
                    <Step1Fundamentals
                        onValidChange={useCallback((isValid) => handleStepValidation('fundamentals', isValid), [handleStepValidation])}
                    />
                );
            case 1:
                return (
                    <Step2TemplateOrCustom
                        onChoose={(mode) => {
                            markComplete('template');
                            if (mode === 'custom') {
                                setStepIndex(2); // go to design
                            }
                        }}
                        onAutoNext={() => {
                            // Jump straight to review (index 3)
                            setStepIndex(3);
                        }}
                    />
                );
            case 2:
                return (
                    <Step3DesignCustom onValidChange={(ok) => handleStepValidation('design', ok)} />
                );
            case 3:
                return (
                    <Step4ReviewExport onReadyChange={(ok) => handleStepValidation('review', ok)} />
                );
            default:
                return <div className="text-red-400">Unknown step</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">5/3/1 Program Builder V2</h1>
                    <p className="text-gray-400">Jim Wendler's proven strength training methodology</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Navigation */}
                    <aside className="lg:col-span-3">
                        <nav className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wide">
                                Steps
                            </h3>
                            <ol className="space-y-1">
                                {STEPS.map((step, index) => {
                                    const isCurrent = index === stepIndex;
                                    const isCompleted = stepValidation[step.id];
                                    const isPast = index < stepIndex;
                                    const isAccessible = index <= stepIndex;

                                    return (
                                        <li key={step.id}>
                                            <button
                                                onClick={() => handleStepClick(index)}
                                                disabled={!isAccessible}
                                                className={`w-full text-left px-3 py-3 rounded transition-colors ${isCurrent
                                                    ? 'bg-red-600/20 border border-red-500/50 text-white'
                                                    : isAccessible
                                                        ? 'hover:bg-gray-700/50 border border-transparent text-gray-300'
                                                        : 'opacity-40 cursor-not-allowed border border-transparent text-gray-500'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs uppercase tracking-wide text-gray-400">
                                                        Step {index + 1}
                                                    </span>
                                                    {(isCompleted || isPast) && (
                                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    )}
                                                </div>
                                                <div className="font-medium">{step.title}</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {step.description}
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="space-y-6">
                            {/* Step Content */}
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                                <button
                                    onClick={handleBack}
                                    disabled={!canGoBack}
                                    className={`px-6 py-2 rounded-lg border font-medium transition-colors ${canGoBack
                                        ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                                        : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    ← Back
                                </button>

                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <span>Step {stepIndex + 1} of {STEPS.length}</span>
                                </div>

                                {stepIndex === 0 && (
                                    <button
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                        className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 ${canGoNext
                                            ? 'border-red-500 bg-red-600/10 text-red-400 hover:bg-red-600/20'
                                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {stepIndex === 2 && (
                                    <button
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                        className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 ${canGoNext
                                            ? 'border-red-500 bg-red-600/10 text-red-400 hover:bg-red-600/20'
                                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {stepIndex === 3 && (
                                    <button
                                        onClick={handleStartCycle}
                                        disabled={!stepValidation.review}
                                        className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 ${stepValidation.review
                                            ? 'border-green-500 bg-green-600/10 text-green-400 hover:bg-green-600/20'
                                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>Start Cycle</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {!(stepIndex === 0 || stepIndex === 2 || stepIndex === 3) && <div className="w-[96px]" />}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function ProgramWizard531V2() { return <WizardShell />; }
