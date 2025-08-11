import React from 'react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import ScheduleSelectionStep from './ScheduleSelectionStep.jsx';

export default function Step3ScheduleWarmup({ data, updateData }) {
    const warmup = data?.warmup || { enabled: true, scheme: '40/50/60 × (5/5/3)' };

    const toggleWarmup = () => {
        updateData({ warmup: { ...warmup, enabled: !warmup.enabled } });
    };

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Schedule & Warm‑up Overview</h3>
                    <StepStatusPill stepId={STEP_IDS.SCHEDULE_WARMUP} data={data} />
                </div>
                <p className="text-gray-400">Pick frequency & lift order; confirm global warm‑up policy.</p>
            </header>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h4 className="text-white font-medium mb-2">Training Schedule & Lift Order</h4>
                <ScheduleSelectionStep data={data} updateData={updateData} />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h4 className="text-white font-medium mb-2">Warm‑up Policy</h4>
                <p className="text-gray-300 text-sm mb-3">
                    Specific warm‑ups before the main sets: <b>40%</b> TM × 5, <b>50%</b> TM × 5, <b>60%</b> TM × 3.
                </p>
                <div className="flex items-center gap-3">
                    <label className="text-gray-300">Enable warm‑ups</label>
                    <input
                        type="checkbox"
                        checked={!!warmup.enabled}
                        onChange={toggleWarmup}
                    />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                    Foam rolling/mobility optional; keep it short so it never robs energy from work sets.
                </p>
            </div>
        </div>
    );
}
