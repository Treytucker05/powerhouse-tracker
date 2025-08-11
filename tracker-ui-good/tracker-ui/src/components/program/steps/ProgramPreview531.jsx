// src/components/program/steps/ProgramPreview531.jsx
import React, { useMemo } from 'react';
import { Download, Printer, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { buildProgram } from '../../../lib/fiveThreeOne/compute531.js';
import { getAllStepStatuses } from './_registry/stepRegistry.js';

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

                            {/* Main Work */}
                            {day.mainWork && (
                                <div className="mb-3">
                                    <div className="text-sm font-medium text-gray-300 mb-1">Main Work</div>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        {day.mainWork.sets?.map((set, setIdx) => (
                                            <div key={setIdx}>
                                                {set.weight}lb × {set.reps} {set.isAMRAP ? '(AMRAP)' : ''}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Assistance Work: prefer user's selected assistancePlan if present */}
                            {(() => {
                                const byDay = data?.assistancePlan?.byDay || {};
                                const scheduleDays = data?.schedule?.days || [];
                                const dayId = scheduleDays[dayIdx]?.id;
                                const selected = dayId ? byDay[dayId]?.plan : null;

                                if (selected && (selected.blocks?.length || selected.accessories?.length)) {
                                    return (
                                        <div className="mb-3">
                                            <div className="text-sm font-medium text-gray-300 mb-1">Assistance (Selected)</div>
                                            <div className="text-xs text-gray-400 space-y-2">
                                                {(selected.blocks || []).map((b, bi) => (
                                                    <div key={bi}>
                                                        <div className="text-gray-300">{b.type || b.category || 'Block'}</div>
                                                        <ul className="ml-4 list-disc space-y-1">
                                                            {(b.items || []).map((it, ii) => (
                                                                <li key={ii}>
                                                                    {it.name}
                                                                    {it.sets ? ` — ${it.sets}×${it.reps}` : (it.targetReps ? ` — ≥${it.targetReps} reps` : '')}
                                                                    {it.percentTM ? ` @ ${it.percentTM}% TM` : ''}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                {(selected.accessories || []).length > 0 && (
                                                    <div>
                                                        <div className="text-gray-300">Accessories</div>
                                                        <ul className="ml-4 list-disc space-y-1">
                                                            {(selected.accessories || []).map((it, i) => (
                                                                <li key={i}>{it.name} — {it.sets}×{it.reps}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                // fallback to program-generated assistance if any
                                return (day.assistance?.length > 0) ? (
                                    <div className="mb-3">
                                        <div className="text-sm font-medium text-gray-300 mb-1">Assistance</div>
                                        <div className="text-xs text-gray-400 space-y-1">
                                            {day.assistance.map((exercise, exIdx) => (
                                                <div key={exIdx}>
                                                    {exercise.name}: {exercise.sets}×{exercise.reps}
                                                    {exercise.weight && ` @ ${exercise.weight}lb`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null;
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
