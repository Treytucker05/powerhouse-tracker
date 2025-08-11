// src/components/program/steps/Step2TemplateGallery.jsx
import React from 'react';
import { Info, CheckCircle, AlertTriangle, Dumbbell, Layers, Activity } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry';
import { TEMPLATE_IDS } from '../../../lib/fiveThreeOne/assistanceRules.js';

const TILES = [
    { id: TEMPLATE_IDS.BBB, title: 'Boring But Big', blurb: 'Main 5/3/1 + 5×10 supplemental. Simple, high volume, great for muscle.', color: 'border-red-500' },
    { id: TEMPLATE_IDS.TRIUMVIRATE, title: 'Triumvirate', blurb: 'Exactly 3 lifts: main + 2 big accessories. Quality over quantity.', color: 'border-amber-500' },
    { id: TEMPLATE_IDS.PERIODIZATION_BIBLE, title: 'Periodization Bible', blurb: 'High volume bodybuilding-style categories for complete development.', color: 'border-blue-500' },
    { id: TEMPLATE_IDS.BODYWEIGHT, title: 'Bodyweight', blurb: 'All assistance is bodyweight. Minimum total reps per movement.', color: 'border-green-500' },
    { id: TEMPLATE_IDS.JACK_SHIT, title: '"I’m Not Doing Jack Shit"', blurb: 'Main 5/3/1 only. No assistance. Use sparingly.', color: 'border-gray-500' },
];

export default function Step2TemplateGallery({ data, updateData }) {
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });
    const cfg = st.templateConfig || { bbbPair: 'same', bbbPercent: 60, bwTarget: 75 };

    const choose = (id) => set({ template: id });

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 2: Choose Assistance Template</h3>
                    <p className="text-gray-400 text-sm">This choice drives your supplemental and accessory work. You can customize in the next step.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.TEMPLATE_GALLERY} data={st} />
            </div>

            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Guidance</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li><b>BBB</b>: best simple hypertrophy. Start at 50–60% TM for the 5×10; advance if recovery is solid.</li>
                            <li><b>Triumvirate</b>: lean sessions; two big accessories matched to the main lift.</li>
                            <li><b>Periodization Bible</b>: most comprehensive; 3+ categories per day, higher volume.</li>
                            <li><b>Bodyweight</b>: joint-friendly; hit minimum total reps (≥75) per exercise.</li>
                            <li><b>Jack Shit</b>: main work only; good for time crunches or poor recovery weeks.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Template tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TILES.map(t => {
                    const active = st.template === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => choose(t.id)}
                            className={`text-left bg-gray-900/60 border ${t.color} rounded p-4 hover:bg-gray-900 transition ${active ? 'ring-2 ring-red-500' : ''}`}
                        >
                            <div className="text-white font-semibold">{t.title}</div>
                            <div className="text-sm text-gray-300 mt-1">{t.blurb}</div>
                            {active && (
                                <div className="mt-3 inline-flex items-center gap-2 text-green-300 bg-green-900/20 border border-green-700 px-2 py-1 rounded">
                                    <CheckCircle className="w-4 h-4" />
                                    Selected
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Quick options for templates that need them */}
            {st.template === TEMPLATE_IDS.BBB && (
                <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                    <div className="text-white font-medium mb-3">BBB Options</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-300 mb-1">Pairing</label>
                            <select
                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                value={cfg.bbbPair || 'same'}
                                onChange={(e) => updateData({ ...st, templateConfig: { ...cfg, bbbPair: e.target.value } })}
                            >
                                <option value="same">Same main lift (e.g., Squat → Squat 5×10)</option>
                                <option value="opposite">Opposite lift (e.g., Squat → Deadlift 5×10)</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-300 mb-1">BBB % of TM</label>
                            <input
                                type="number" min="40" max="75" step="5"
                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                value={cfg.bbbPercent ?? 60}
                                onChange={(e) => updateData({ ...st, templateConfig: { ...cfg, bbbPercent: Number(e.target.value) || 60 } })}
                            />
                            <span className="text-xs text-gray-500 mt-1">Start 50–60%. Increase only if recovery is solid.</span>
                        </div>
                    </div>
                </div>
            )}

            {st.template === TEMPLATE_IDS.BODYWEIGHT && (
                <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                    <div className="text-white font-medium mb-3">Bodyweight Options</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-300 mb-1">Target reps per movement</label>
                            <input
                                type="number" min="50" max="200" step="5"
                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                value={cfg.bwTarget ?? 75}
                                onChange={(e) => updateData({ ...st, templateConfig: { ...cfg, bwTarget: Number(e.target.value) || 75 } })}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Gentle warning */}
            {!st.template && (
                <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 rounded p-3 text-sm">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        Select a template to continue.
                    </div>
                </div>
            )}
        </div>
    );
}
