// src/components/program/ProgramWizard531.jsx
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { CheckCircle, AlertTriangle, MinusCircle, RefreshCw, Wand2 } from 'lucide-react';
import {
    getOrderedSteps,
    getStepById,
    getFirstStepId,
    getNextStepId,
    getPrevStepId,
    DEFAULT_WIZARD_STATE,
    STEP_IDS,
    getAllStepStatuses,
    getStepStatuses,
    getStepRequirements,
    canAdvanceToStep
} from './steps/_registry/stepRegistry.js';
import { loadWizardState, saveWizardState, clearWizardState } from '../../lib/wizardStore';

function deepMerge(target, updates) {
    if (updates === null || typeof updates !== 'object') return updates;
    const out = Array.isArray(target) ? [...target] : { ...target };
    for (const k of Object.keys(updates)) {
        const src = target && typeof target === 'object' ? target[k] : undefined;
        const val = updates[k];
        out[k] = (src && typeof src === 'object' && !Array.isArray(src) && val && typeof val === 'object' && !Array.isArray(val))
            ? deepMerge(src, val)
            : val;
    }
    return out;
}

// Fill only missing/nullish fields from defaults (does not overwrite existing user input)
function isObject(v) {
    return v && typeof v === 'object' && !Array.isArray(v);
}
function deepMergeMissing(target, defaults) {
    const t = isObject(target) ? target : {};
    const out = Array.isArray(t) ? [...t] : { ...t };
    for (const key of Object.keys(defaults || {})) {
        const dVal = defaults[key];
        const tVal = out[key];
        if (tVal === undefined || tVal === null) {
            out[key] = isObject(dVal) ? deepMergeMissing({}, dVal) : dVal;
        } else if (isObject(tVal) && isObject(dVal)) {
            out[key] = deepMergeMissing(tVal, dVal);
        }
    }
    return out;
}

export default function ProgramWizard531() {
    const [state, setState] = useState(() => loadWizardState() ?? DEFAULT_WIZARD_STATE);
    const steps = useMemo(() => getOrderedSteps(state), [state]);
    const stepStatuses = useMemo(() => getAllStepStatuses(state), [state]);
    const [currentId, setCurrentId] = useState(() => getFirstStepId(state) || STEP_IDS.PROGRAM_FUNDAMENTALS);

    // Persist state
    useEffect(() => { saveWizardState(state); }, [state]);

    // If visibility rules change (e.g., selecting a template), keep current step valid
    useEffect(() => {
        const stillValid = steps.find(s => s.id === currentId);
        if (!stillValid) {
            setCurrentId(getFirstStepId(state) || STEP_IDS.PROGRAM_FUNDAMENTALS);
        }
    }, [steps, currentId, state]);

    const currentStep = getStepById(currentId);
    const CurrentComp = currentStep?.component;

    const updateData = (updates) => {
        setState(prev => deepMerge(prev, updates));
    };

    const nextId = getNextStepId(currentId, state);
    const prevId = getPrevStepId(currentId, state);
    const canAdvanceToNext = nextId ? canAdvanceToStep(nextId, state) : false;

    const statuses = useMemo(() => getStepStatuses(state), [state]);

    const gotoPreview = () => setCurrentId(STEP_IDS.REVIEW_EXPORT);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'complete':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'incomplete':
            default:
                return <MinusCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="border-b border-gray-800 bg-gray-950/70 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">5/3/1 Program Builder</h1>
                        <p className="text-gray-400 text-sm">Seven steps from inputs → full program preview/export.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={gotoPreview}
                            className="px-3 py-1 rounded border border-gray-700 hover:border-green-500"
                            title="Jump to Program Preview"
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setState(DEFAULT_WIZARD_STATE)}
                            className="px-3 py-1 rounded border border-gray-700 hover:border-yellow-500"
                            title="Reset to defaults"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => clearWizardState()}
                            className="px-3 py-1 rounded border border-gray-700 hover:border-red-500"
                            title="Clear saved draft"
                        >
                            Clear Draft
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="lg:col-span-3">
                    <nav className="bg-gray-800/50 border border-gray-800 rounded-lg p-3">
                        <ol className="space-y-1">
                            {steps.map((st, idx) => {
                                const isActive = st.id === currentId;
                                const status = stepStatuses[st.id] || 'incomplete';
                                const canAccess = canAdvanceToStep(st.id, state);

                                return (
                                    <li key={st.id}>
                                        <button
                                            onClick={() => canAccess && setCurrentId(st.id)}
                                            disabled={!canAccess}
                                            className={`w-full text-left px-3 py-2 rounded transition ${isActive
                                                ? 'bg-gray-700 border border-red-500 text-white'
                                                : canAccess
                                                    ? 'hover:bg-gray-800 border border-transparent'
                                                    : 'opacity-50 cursor-not-allowed border border-transparent'
                                                }`}
                                        >
                                            <div className="text-xs uppercase tracking-wide text-gray-400">{st.group || 'Step'}</div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{idx + 1}. {st.title}</span>
                                                {getStatusIcon(status)}
                                            </div>
                                            <div className="text-gray-400 text-xs">{st.description}</div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </aside>

                {/* Main */}
                <main className="lg:col-span-9 space-y-4">
                    <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-1">{currentStep?.title}</h2>
                        <p className="text-gray-400 mb-4">{currentStep?.description}</p>

                        {/* Use Defaults Bar */}
                        <div className="mb-4 bg-gray-900/50 border border-gray-700 rounded p-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm text-gray-300">
                                Quick setup: apply Wendler‑recommended defaults (TM% 90, rounding 5 lb/2.5 kg, 4‑day split, Option 1, +5/+10).
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setState(prev => deepMergeMissing(prev || {}, DEFAULT_WIZARD_STATE));
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500 rounded hover:bg-blue-600/10"
                                    title="Fill in missing fields with sensible defaults"
                                >
                                    <Wand2 className="w-4 h-4" />
                                    Apply Defaults (Safe)
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Reset the entire wizard to defaults? This will clear current entries.')) {
                                            setState(DEFAULT_WIZARD_STATE);
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-1 border border-red-500 rounded hover:bg-red-600/10"
                                    title="WARNING: Clears the current config"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reset All
                                </button>
                            </div>
                        </div>

                        <Suspense fallback={<div className="text-gray-400">Loading step…</div>}>
                            {CurrentComp ? <CurrentComp data={state} updateData={updateData} /> : <div>Step not found.</div>}
                        </Suspense>
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            disabled={!prevId}
                            onClick={() => setCurrentId(prevId)}
                            className={`px-4 py-2 rounded border ${prevId ? 'border-gray-700 hover:border-gray-500' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                        >
                            ← Back
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={gotoPreview}
                                className="px-4 py-2 rounded border border-gray-700 hover:border-green-500"
                                title="Jump to Program Preview"
                            >
                                Preview
                            </button>
                            <button
                                disabled={!nextId || !canAdvanceToNext}
                                onClick={() => setCurrentId(nextId)}
                                className={`px-4 py-2 rounded border ${nextId && canAdvanceToNext
                                    ? 'border-red-500 hover:bg-red-600/10'
                                    : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                                title={!canAdvanceToNext ? 'Complete current step to proceed' : ''}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
