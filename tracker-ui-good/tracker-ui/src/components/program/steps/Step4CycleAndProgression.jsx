import React from 'react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import Step4CycleStructure from './Step4CycleStructure.jsx';
import Step9CycleProgression from './Step9CycleProgression.jsx';
import Step10StallingReset from './Step10StallingReset.jsx';

export default function Step4CycleAndProgression({ data, updateData }) {
    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Cycle Structure & Loading</h3>
                    <StepStatusPill stepId={STEP_IDS.CYCLE_AND_PROGRESSION} data={data} />
                </div>
                <p className="text-gray-400">Choose loading option; confirm deload (40/50/60×5), progression (+5/+10), and reset policy.</p>
            </header>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <Step4CycleStructure data={data} updateData={updateData} />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <Step9CycleProgression data={data} updateData={updateData} />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <Step10StallingReset data={data} updateData={updateData} />
            </div>
        </div>
    );
}
