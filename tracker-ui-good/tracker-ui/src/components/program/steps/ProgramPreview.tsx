import React from 'react';
import { useBuilder } from '@/context/BuilderState';
import { useNavigate } from 'react-router-dom';
import BuilderProgress from './BuilderProgress';

// Step 4: Preview & Export (scaffold)
// Focus: Provide a read-only style preview of generated program structure with week tabs and day cards.
// Future: Integrate real calculation & export modal.

const WEEKS = [1, 2, 3, 4];

const ProgramPreview: React.FC = () => {
    const navigate = useNavigate();
    const { step1, step2, step3 } = useBuilder();
    const [activeWeek, setActiveWeek] = React.useState(1);

    // Derived placeholder days — using schedule length if set, else 4.
    const scheduleLen = (step3 as any)?.schedule?.length; // placeholder until schedule fully implemented
    const dayCount = scheduleLen || 4;
    const days = Array.from({ length: dayCount }, (_, i) => i + 1);

    return (
        <div data-testid="step4-preview-root" className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <div className="px-8 pt-6"><BuilderProgress current={4} /></div>
            <header className="px-8 pt-4 pb-4 border-b border-gray-800 flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Preview & Export</h1>
                <p className="text-sm text-gray-400">Review generated weeks & days. Export coming soon.</p>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] -mt-2">
                        <button onClick={() => navigate('/build/step1')} className="px-2 py-1 rounded border border-gray-700 hover:border-gray-500 hover:bg-gray-800/60">Fundamentals</button>
                        <button onClick={() => navigate('/build/step2')} className="px-2 py-1 rounded border border-gray-700 hover:border-gray-500 hover:bg-gray-800/60">Template</button>
                        <button onClick={() => navigate('/build/step3')} className="px-2 py-1 rounded border border-gray-700 hover:border-gray-500 hover:bg-gray-800/60">Customize</button>
                        <span className="text-gray-600">|</span>
                        <button onClick={() => navigate('/build/step5')} className="px-2 py-1 rounded border border-red-600/60 text-red-200 border hover:bg-red-600/10">Skip to Progression</button>
                    </div>
                    <div>
                        <div data-testid="week-tabs" className="flex flex-wrap gap-2 mb-4">
                            {WEEKS.map(w => (
                                <button
                                    key={w}
                                    data-testid={`week-tab-${w}`}
                                    onClick={() => setActiveWeek(w)}
                                    className={`px-3 py-1.5 rounded border text-xs font-medium transition ${activeWeek === w ? 'border-red-500 bg-red-600/10 text-red-200' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-300'}`}
                                >Week {w}</button>
                            ))}
                        </div>
                        <div data-testid="week-content" className="grid gap-4">
                            {days.map(d => (
                                <div key={d} data-testid={`day-card-${activeWeek}-${d}`} className="rounded-md border border-gray-800 bg-gray-800/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">Week {activeWeek} · Day {d}</span>
                                        <span className="text-[10px] uppercase tracking-wide text-gray-500">Placeholder</span>
                                    </div>
                                    <ul className="text-xs space-y-1 text-gray-300 ml-1">
                                        <li><span className="text-gray-400">Primary:</span> (calc pending)</li>
                                        <li><span className="text-gray-400">Supplemental:</span> (pending)</li>
                                        <li><span className="text-gray-400">Assistance:</span> (pending)</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button onClick={() => navigate('/build/step3')} data-testid="back-step3" className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                        <button onClick={() => navigate('/build/step5')} data-testid="next-step5" className="px-4 py-2 rounded border border-red-500 text-sm hover:bg-red-600/10">Next: Progression</button>
                        <button data-testid="export-json" disabled className="px-4 py-2 rounded border border-gray-700 text-sm text-gray-500 cursor-not-allowed">Export JSON (soon)</button>
                    </div>
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Summary</h3>
                        <ul className="text-xs space-y-1 text-gray-300">
                            <li data-testid="summary-fundamentals"><span className="text-gray-400">Units:</span> {step1?.units || 'n/a'} · TM% {step1?.tmPct || 90}</li>
                            <li data-testid="summary-template"><span className="text-gray-400">Template:</span> {step2?.templateId || 'none'} · <span className="text-gray-400">Scheme:</span> {step2?.schemeId || 'none'}</li>
                            <li data-testid="summary-schedule"><span className="text-gray-400">Schedule Days:</span> {dayCount}</li>
                            <li data-testid="summary-deload"><span className="text-gray-400">Deload:</span> {step3?.deload ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProgramPreview;
