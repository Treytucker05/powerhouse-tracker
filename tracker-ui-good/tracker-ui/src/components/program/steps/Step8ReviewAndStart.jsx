// src/components/program/steps/Step8ReviewAndStart.jsx
import React, { useMemo, useState } from 'react';
import { Info, CheckCircle, Clipboard, Download, Play, ChevronDown, ChevronRight } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { generateFiveThreeOneProgram } from '../../../lib/fiveThreeOne/generateProgram.js';
import { copyJSON, downloadJSON } from '../../../lib/jsonExport.js';
import { persistActiveCycle } from '../../../lib/fiveThreeOne/persistCycle.js';
import { useProgramV2, selectLogging, setLogging } from '@/methods/531/contexts/ProgramContextV2.jsx';

function Row({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-200 font-medium">{value}</span>
        </div>
    );
}

export default function Step8ReviewAndStart({ data }) {
    const { state: programV2, dispatch } = useProgramV2();
    const logging = selectLogging(programV2);
    const st = data || {};
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [started, setStarted] = useState(false);

    const programJson = useMemo(() => generateFiveThreeOneProgram(st), [st]);

    const cfg = programJson.config;
    const tm = programJson.lifts;

    const onCopy = async () => {
        const ok = await copyJSON(programJson);
        setCopied(ok);
        setTimeout(() => setCopied(false), 1200);
    };

    const onDownload = () => {
        downloadJSON(programJson, `531_program_${new Date().toISOString().slice(0, 10)}.json`);
    };

    const onStart = () => {
        persistActiveCycle(programJson);
        setStarted(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 8: Review & Start</h3>
                    <p className="text-gray-400 text-sm">Confirm settings, export JSON, or start this cycle now.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.FINAL_REVIEW} data={st} />
            </div>

            {/* Info */}
            <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">What happens when you Start?</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>We save a snapshot of your 5/3/1 program as the <b>active cycle</b>.</li>
                            <li>Progress starts at <b>Week 1</b>, day 1 of your schedule.</li>
                            <li>You can print, copy, or download the full plan JSON for records.</li>
                            <li><b>Conditioning:</b> Perform 2–3 weekly sessions (hill sprints, Prowler pushes, loaded carries) separate from lower‑body lifting when possible.</li>
                            <li><b>Recovery:</b> Add at least one rest day after two consecutive training days.</li>
                            <li><b>Guardrails:</b> Keep TM at 85–90% of true max; don’t layer extra random assistance beyond template.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-2">
                    <div className="text-white font-medium mb-1">Training Maxes</div>
                    <Row label="Overhead Press" value={tm.press ? `${tm.press} lb` : '—'} />
                    <Row label="Bench Press" value={tm.bench ? `${tm.bench} lb` : '—'} />
                    <Row label="Squat" value={tm.squat ? `${tm.squat} lb` : '—'} />
                    <Row label="Deadlift" value={tm.deadlift ? `${tm.deadlift} lb` : '—'} />
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-2">
                    <div className="text-white font-medium mb-1">Cycle & Template</div>
                    <Row label="Loading Option" value={`Option ${cfg.loadingOption}`} />
                    <Row label="Rounding" value={`${cfg.roundingIncrement} lb`} />
                    <Row label="Template" value={(cfg.template || '').toString().toUpperCase()} />
                    <Row label="Warm-ups" value={cfg.includeWarmups ? '40/50/60%' : 'Off'} />
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-2">
                    <div className="text-white font-medium mb-1">Schedule</div>
                    <Row label="Frequency" value={cfg.schedule.frequency} />
                    <Row label="Pattern" value={cfg.schedule.pattern} />
                    <Row label="Lift Order" value={cfg.schedule.liftOrder.join(' → ')} />
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-2">
                    <div className="text-white font-medium mb-1">Logging Preferences</div>
                    <label className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Track AMRAP sets</span>
                        <input type="checkbox" checked={!!logging.trackAmrap} onChange={(e) => setLogging(dispatch, { trackAmrap: e.target.checked })} />
                    </label>
                    <label className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">PR Flags</span>
                        <input type="checkbox" checked={!!logging.prFlags} onChange={(e) => setLogging(dispatch, { prFlags: e.target.checked })} />
                    </label>
                    <div className="text-sm">
                        <div className="text-gray-300 mb-1">Est. 1RM Formula</div>
                        <div className="inline-flex border border-gray-700 rounded overflow-hidden">
                            {[{ k: 'wendler', label: 'Wendler' }, { k: 'epley', label: 'Epley' }].map(opt => (
                                <button key={opt.k} onClick={() => setLogging(dispatch, { est1rmFormula: opt.k })}
                                    className={`px-3 py-1 ${logging.est1rmFormula === opt.k ? 'bg-[#ef4444]' : 'bg-[#0b1220] text-gray-200'}`}>{opt.label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* JSON Preview (collapsible) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded">
                <button
                    className="w-full flex items-center justify-between px-4 py-2"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className="text-white font-medium">Program JSON Preview</span>
                    {expanded ? <ChevronDown className="w-5 h-5 text-gray-300" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                </button>
                {expanded && (
                    <pre className="px-4 pb-4 text-xs text-gray-200 overflow-auto">
                        {JSON.stringify(programJson, null, 2)}
                    </pre>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={onCopy}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-600 text-gray-100 hover:bg-gray-800"
                >
                    <Clipboard className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                    onClick={onDownload}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                    <Download className="w-4 h-4" /> Download JSON
                </button>
                <button
                    onClick={onStart}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                    <Play className="w-4 h-4" /> {started ? 'Cycle Started' : 'Start Cycle'}
                </button>
            </div>

            {/* Confirmation */}
            {started && (
                <div className="bg-green-900/20 border border-green-500 rounded p-3 text-green-200 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Active 5/3/1 cycle saved. You can now train from Week 1 Day 1.
                </div>
            )}

            {/* Guardrail Warnings (always visible) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Common Mistakes to Avoid</div>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-300">
                    <li>Adding extra assistance volume “just because” — progress main lifts first.</li>
                    <li>Pushing Training Max too high. Stay conservative; only adjust after consistent AMRAP performance.</li>
                    <li>Skipping conditioning entirely. Short quality sessions improve recovery and work capacity.</li>
                    <li>Stringing 3–4 lifting days in a row — recovery and reps suffer. Insert rest.</li>
                </ul>
            </div>
        </div>
    );
}
