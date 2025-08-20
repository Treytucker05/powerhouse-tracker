import React from 'react';
import { useBuilder } from '@/context/BuilderState';
import { useNavigate } from 'react-router-dom';
import BuilderProgress from './BuilderProgress';

// Step 5 placeholder: Progression / Cycle Advancement Planning
// Future: allow editing per-cycle TM increases, custom deload rules, anchor vs leader logic, export.

const ProgramProgression: React.FC = () => {
    const navigate = useNavigate();
    const { step1, step2, step3 } = useBuilder();

    return (
        <div data-testid="step5-progression-root" className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <div className="px-8 pt-6"><BuilderProgress current={5} /></div>
            <header className="px-8 pt-4 pb-4 border-b border-gray-800 space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Progression Planning</h1>
                <p className="text-sm text-gray-400 max-w-xl">Configure how your Training Max advances across cycles and finalize export. This is a scaffold; deeper progression logic (leader/anchor, custom jumps) will arrive next.</p>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-2 text-sm">Cycle Increments</h2>
                        <p className="text-xs text-gray-400 mb-2">Default 5 lb upper / 10 lb lower (2.5 / 5 kg). Editable controls will be added here.</p>
                        <ul className="text-xs space-y-1 text-gray-300 list-disc pl-5">
                            <li>Current Units: {step1?.units || 'n/a'}</li>
                            <li>TM %: {step1?.tmPct ? Math.round(step1.tmPct * 100) : 90}%</li>
                            <li>Template: {step2?.templateId || '—'} | Scheme: {step2?.schemeId || '—'}</li>
                            <li>Deload Week: {step3?.deload ? 'Enabled' : 'Disabled'}</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-2 text-sm">Next Steps</h2>
                        <ol className="text-xs text-gray-300 space-y-1 list-decimal pl-5">
                            <li>Add adjustable TM increment controls per lift.</li>
                            <li>Integrate leader/anchor cycle pattern selection.</li>
                            <li>Generate final microcycle schedule preview with applied increments.</li>
                            <li>Enable export to active program.</li>
                        </ol>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button onClick={() => navigate('/build/step4')} data-testid="back-step4" className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                        <button disabled className="px-4 py-2 rounded border border-gray-700 text-sm text-gray-500 cursor-not-allowed">Finish (coming soon)</button>
                    </div>
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Summary</h3>
                        <ul className="text-xs space-y-1 text-gray-300">
                            <li><span className="text-gray-400">Units:</span> {step1?.units || 'n/a'} · TM% {step1?.tmPct ? Math.round(step1.tmPct * 100) : 90}</li>
                            <li><span className="text-gray-400">Template:</span> {step2?.templateId || 'none'} · <span className="text-gray-400">Scheme:</span> {step2?.schemeId || 'none'}</li>
                            <li><span className="text-gray-400">Deload:</span> {step3?.deload ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProgramProgression;
