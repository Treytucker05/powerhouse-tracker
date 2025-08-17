// src/components/program/steps/ProgramPreview531.jsx
import React, { useMemo } from 'react';
import { Download, Printer, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { buildProgram } from '../../../lib/fiveThreeOne/compute531.js';
import { getWarmupsByPolicy } from '../../../lib/fiveThreeOne/warmup.js';
import { calcMainSets } from '../../../lib/fiveThreeOne/compute531.js';
import { getAllStepStatuses } from './_registry/stepRegistry.js';
import { percentOfTM, toDisplayWeight } from '../../../lib/fiveThreeOne/math.js';

export default function ProgramPreview531({ data, updateData }) {
    const stepStatuses = useMemo(() => getAllStepStatuses(data), [data]);
    const program = useMemo(() => {
        try {
            return buildProgram(data);
        } catch (error) {
            console.warn('Program generation error:', error);
            return null;
        }
    }, [data]);

    const completedSteps = Object.values(stepStatuses).filter(status => status === 'complete').length;
    const totalSteps = Object.keys(stepStatuses).length;
    const hasErrors = Object.values(stepStatuses).some(status => status === 'error');

    const handleExport = (format) => {
        if (!program) return;

        switch (format) {
            case 'json': {
                const blob = new Blob([JSON.stringify(program, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `531-program-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                break;
            }
            case 'print': {
                window.print();
                break;
            }
            default:
                break;
        }
    };

    const renderWeek = (week, weekNum) => {
        if (!week?.days) return null;

        return (
            <div key={weekNum} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 text-green-400">Week {weekNum}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {week.days.map((day, dayIdx) => (
                        <div key={dayIdx} className="bg-gray-900 border border-gray-800 rounded p-3">
                            <h5 className="font-medium text-red-400 mb-2">Day {dayIdx + 1} - {day.focus}</h5>

                            {/* Warm-up (computed from policy + TM) */}
                            {(() => {
                                const scheduleDays = data?.schedule?.days || [];
                                const dMeta = scheduleDays[dayIdx];
                                const liftKey = dMeta?.lift; // 'press' | 'deadlift' | 'bench' | 'squat'
                                const tm = data?.trainingMaxes?.[liftKey];
                                const rounding = data?.rounding || { increment: 5, mode: 'nearest' };
                                const pol = data?.warmup?.policy || 'standard';
                                const custom = data?.warmup?.custom || [];
                                const sets = getWarmupsByPolicy(pol, custom, Number(tm), rounding);
                                if (!sets?.length) return null;
                                return (
                                    <div className="mb-3">
                                        <div className="text-sm font-medium text-gray-300 mb-1">Warm‑Up</div>
                                        <div className="text-xs text-gray-400 space-y-1">
                                            {sets.map((s, i) => (
                                                <div key={i}>{s.weight}lb × {s.reps} ({s.pct}%)</div>
                                            ))}
                                            {liftKey === 'deadlift' && data?.warmup?.deadliftRepStyle === 'deadstop' && (
                                                <div className="text-gray-500">Cue: reset each rep (dead‑stop)</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Main Work */}
                            {(() => {
                                const scheduleDays = data?.schedule?.days || [];
                                const dMeta = scheduleDays[dayIdx];
                                const liftKey = dMeta?.lift;
                                const tm = Number(data?.trainingMaxes?.[liftKey]);
                                const rounding = data?.rounding || { increment: 5, mode: 'nearest' };
                                const previewWeek = Number(data?.loading?.previewWeek) || 1;
                                const loadingOpt = Number(data?.loading?.option) || 1;
                                const mainSets = Number.isFinite(tm) ? calcMainSets(tm, loadingOpt, previewWeek, rounding) : [];
                                if (!mainSets.length) return null;
                                return (
                                    <div className="mb-3">
                                        <div className="text-sm font-medium text-gray-300 mb-1">Main Sets</div>
                                        <div className="text-xs text-gray-400 space-y-1">
                                            {mainSets.map((s) => (
                                                <div key={s.set || `${s.pct}-${s.reps}`}>
                                                    {s.pct}% × {s.reps}{s.amrap ? '+' : ''} → {Number.isFinite(s.weight) ? `${s.weight}lb` : '-'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Assistance Work: from Step 5 Assistance Router (per-day), else program fallback */}
                            {(() => {
                                const scheduleDays = data?.schedule?.days || [];
                                const liftKey = scheduleDays[dayIdx]?.lift;
                                const dayKey = liftKey;
                                const items = data?.assistance?.perDay?.[dayKey] || [];
                                const rounding = data?.rounding || { increment: 5, mode: 'nearest' };
                                const lifts = data?.lifts || {};
                                return (
                                    <div className="mb-3">
                                        <div className="text-sm font-medium text-gray-300 mb-1">Assistance</div>
                                        {items.length ? (
                                            <ul className="text-xs text-gray-400 space-y-1">
                                                {items.map((it, i) => (
                                                    <li key={i}>
                                                        {it.name}: {it.sets}×{it.reps}
                                                        {it?.load?.type === 'percentTM' && (
                                                            <> @ {it.load.value}% TM{Number.isFinite(Number(lifts?.[it.load.liftRef]?.tm)) ? (
                                                                <> → <span className="font-mono">
                                                                    {toDisplayWeight(percentOfTM(Number(lifts[it.load.liftRef].tm), Number(it.load.value), rounding?.increment ?? 5))}
                                                                </span></>
                                                            ) : null}</>
                                                        )}
                                                        {it?.load?.type === 'bw' && ' @ BW'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-xs text-gray-500">None</div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Conditioning */}
                            {day.conditioning && (
                                <div>
                                    <div className="text-sm font-medium text-gray-300 mb-1">Conditioning</div>
                                    <div className="text-xs text-gray-400">
                                        {day.conditioning.type}: {day.conditioning.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold">Program Preview</h3>
                        <p className="text-gray-400">
                            {completedSteps}/{totalSteps} steps completed
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasErrors ? (
                            <div className="flex items-center gap-2 text-yellow-400">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Validation errors</span>
                            </div>
                        ) : completedSteps === totalSteps ? (
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>Ready to export</span>
                            </div>
                        ) : (
                            <span className="text-gray-400">In progress...</span>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${hasErrors ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Export Actions */}
            {program && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Export Options</h4>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleExport('json')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            <Download className="w-4 h-4" />
                            Download JSON
                        </button>
                        <button
                            onClick={() => handleExport('print')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                        >
                            <Printer className="w-4 h-4" />
                            Print Program
                        </button>
                        <button
                            disabled
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                            title="Supabase integration coming soon"
                        >
                            <Save className="w-4 h-4" />
                            Save to Cloud
                        </button>
                    </div>
                </div>
            )}

            {/* Program Summary */}
            {program ? (
                <div className="space-y-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Program Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Template:</span> {data.templateChoice?.id || 'Custom'}
                            </div>
                            <div>
                                <span className="text-gray-400">Frequency:</span> {data.schedule?.frequency || '4-day'}
                            </div>
                            <div>
                                <span className="text-gray-400">Training Max %:</span> {data.trainingMaxes?.tmPercent || 90}%
                            </div>
                            <div>
                                <span className="text-gray-400">Loading Option:</span> {data.cycle?.loadingOption || 1}
                            </div>
                        </div>
                    </div>

                    {/* Conditioning (Weekly) */}
                    {(() => {
                        const cond = data?.conditioning || {};
                        const plan = cond?.weeklyPlan || [];
                        return (
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Conditioning (Weekly)</div>
                                {plan.length ? (
                                    <ul className="text-sm text-gray-200">
                                        {plan.map((s, i) => (
                                            <li key={i}>
                                                {s.day}: {String(s.mode).toUpperCase()} — {s.modality}{' '}
                                                {s.prescription && Object.keys(s.prescription).length ? (
                                                    <span className="text-gray-400">
                                                        ({Object.entries(s.prescription).map(([k, v]) => `${k}:${v}`).join(', ')})
                                                    </span>
                                                ) : null}
                                                {s.notes ? <span className="text-gray-500"> — {s.notes}</span> : null}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-500 text-sm">No conditioning scheduled.</div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Training Maxes */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Training Maxes</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {Object.entries(data.trainingMaxes || {}).map(([lift, value]) => {
                                if (lift === 'tmPercent' || lift === 'rounding' || !value) return null;
                                return (
                                    <div key={lift}>
                                        <span className="text-gray-400 capitalize">{lift.replace('_', ' ')}:</span>
                                        <div className="font-medium">{value}lb</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4-Week Cycle Preview */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold">4-Week Cycle</h4>

                        {/* Week 1-3 */}
                        {program.weeks?.slice(0, 3).map((week, idx) => renderWeek(week, idx + 1))}

                        {/* Deload Week */}
                        {program.deloadWeek && renderWeek(program.deloadWeek, 4)}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Program Generation Error</h4>
                    <p className="text-gray-400 mb-4">
                        Unable to generate program preview. Please complete required steps and fix any validation errors.
                    </p>
                    <div className="text-sm text-gray-500">
                        Missing data: Training maxes, template selection, or schedule configuration
                    </div>
                </div>
            )}
        </div>
    );
}
