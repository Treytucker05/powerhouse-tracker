import React from 'react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';

export default function Step7AdvancedOptions({ data, updateData }) {
    const advanced = data?.advanced || {
        amrapRPECutoff: 9,
        deadliftStyle: 'dead-stop',
        equipment: { belt: true, sleeves: false, wraps: false, chalk: true, straps: false, chains: false, bands: false },
        prTracking: true
    };

    const setEquip = (k, v) => {
        updateData({ advanced: { ...advanced, equipment: { ...advanced.equipment, [k]: v } } });
    };

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Advanced Customization (Optional)</h3>
                    <StepStatusPill stepId={STEP_IDS.ADVANCED_OPTIONS} data={data} />
                </div>
                <p className="text-gray-400">Cap AMRAP intensity, set deadlift style, and confirm equipment/PR policies.</p>
            </header>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <label className="text-sm text-gray-300 block mb-2">AMRAP RPE Cutoff</label>
                <input
                    type="range"
                    min={7} max={10} step={1}
                    value={advanced.amrapRPECutoff}
                    onChange={(e) => updateData({ advanced: { ...advanced, amrapRPECutoff: Number(e.target.value) } })}
                    className="w-full"
                />
                <div className="text-gray-300 text-sm mt-1">Stop "+" sets around RPE {advanced.amrapRPECutoff} to keep reps crisp.</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <label className="text-sm text-gray-300 block mb-2">Deadlift Rep Style</label>
                <div className="flex gap-3">
                    {['dead-stop', 'touch-and-go'].map(s => (
                        <button
                            key={s}
                            onClick={() => updateData({ advanced: { ...advanced, deadliftStyle: s } })}
                            className={`px-3 py-1 rounded border ${advanced.deadliftStyle === s ? 'border-red-500 text-white' : 'border-gray-600 text-gray-300'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <p className="text-gray-400 text-xs mt-2">Pick the style you can keep tight and consistent.</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h4 className="text-white font-medium mb-2">Equipment Flags</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(advanced.equipment).map(([k, v]) => (
                        <label key={k} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={!!v}
                                onChange={() => setEquip(k, !v)}
                            />
                            <span>{k}</span>
                        </label>
                    ))}
                </div>
                {(advanced.equipment.chains || advanced.equipment.bands) && (
                    <div className="text-yellow-300 text-sm mt-2">
                        Heads up: Chains/Bands require separate TM handling; keep them off unless you know the protocol.
                    </div>
                )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <label className="text-sm text-gray-300 block mb-2">PR Tracking</label>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={!!advanced.prTracking}
                        onChange={() => updateData({ advanced: { ...advanced, prTracking: !advanced.prTracking } })}
                    />
                    <span className="text-gray-300">Auto‑detect rep PRs and estimate 1RMs on "+" sets.</span>
                </div>
            </div>
        </div>
    );
}
