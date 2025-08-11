import React, { useMemo } from 'react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';

export default function Step6ConditioningRecovery({ data, updateData }) {
    const conditioning = data?.conditioning || { sessionsPerWeek: 2, methods: ['prowler', 'hills'] };
    const recovery = data?.recovery || { mobility: true, foamRolling: true, sleepHoursTarget: 7 };

    const toggleMethod = (m) => {
        const set = new Set(conditioning.methods);
        set.has(m) ? set.delete(m) : set.add(m);
        updateData({ conditioning: { ...conditioning, methods: Array.from(set) } });
    };

    const METHODS = useMemo(() => ([
        { id: 'prowler', label: 'Prowler/Sled' },
        { id: 'hills', label: 'Hill Sprints' },
        { id: 'sledDrag', label: 'Sled Drags' },
        { id: 'bikeRow', label: 'Bike/Row Intervals' },
        { id: 'walk', label: 'Walking (LISS)' }
    ]), []);

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Conditioning & Recovery</h3>
                    <StepStatusPill stepId={STEP_IDS.CONDITIONING_RECOVERY} data={data} />
                </div>
                <p className="text-gray-400">Add 2–4 short sessions/week. Keep it out of the way of heavy lifting.</p>
            </header>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <label className="text-sm text-gray-300 block mb-2">Conditioning Sessions / Week</label>
                <input
                    type="number"
                    min={0}
                    max={7}
                    value={conditioning.sessionsPerWeek}
                    onChange={(e) => updateData({ conditioning: { ...conditioning, sessionsPerWeek: Number(e.target.value) } })}
                    className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white w-28"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {METHODS.map(m => (
                        <label key={m.id} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={conditioning.methods.includes(m.id)}
                                onChange={() => toggleMethod(m.id)}
                            />
                            <span>{m.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h4 className="text-white font-medium mb-2">Recovery Habits</h4>
                <div className="flex items-center gap-3 mb-2">
                    <label className="text-gray-300">Daily Mobility</label>
                    <input
                        type="checkbox"
                        checked={!!recovery.mobility}
                        onChange={() => updateData({ recovery: { ...recovery, mobility: !recovery.mobility } })}
                    />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <label className="text-gray-300">Foam Rolling</label>
                    <input
                        type="checkbox"
                        checked={!!recovery.foamRolling}
                        onChange={() => updateData({ recovery: { ...recovery, foamRolling: !recovery.foamRolling } })}
                    />
                </div>
                <div className="mt-2">
                    <label className="text-sm text-gray-300 block mb-1">Sleep Target (hrs/night)</label>
                    <input
                        type="number"
                        min={5}
                        max={10}
                        value={recovery.sleepHoursTarget ?? 7}
                        onChange={(e) => updateData({ recovery: { ...recovery, sleepHoursTarget: Number(e.target.value) } })}
                        className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white w-28"
                    />
                </div>
            </div>
        </div>
    );
}
