import React, { useState, useMemo } from 'react';
import { useProgramV2 } from '../../../contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS, getTemplatePreset } from '../../../lib/templates/531.presets.v2.js';
import { CheckCircle2, ChevronRight, Info, AlertTriangle } from 'lucide-react';

/**
 * Step2TemplateOrCustom.jsx
 * Choose a built-in template (auto-config + jump to review) or continue custom design.
 */
export default function Step2TemplateOrCustom({ onChoose, onAutoNext }) {
    const ctx = useProgramV2();
    const { state, dispatch } = ctx;
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState(false);

    const templateCards = useMemo(() => ([
        {
            key: TEMPLATE_KEYS.BBB,
            title: 'Boring But Big (BBB)',
            blurb: 'Main lift + 5x10 at 50% TM (can adjust later). Minimal accessories.',
            detail: 'Classic hypertrophy supplemental. Volume block after main sets. Start at 50% TM.'
        },
        {
            key: TEMPLATE_KEYS.TRIUMVIRATE,
            title: 'Triumvirate',
            blurb: 'Main lift + two assistance movements (5 sets each).',
            detail: 'Keeps workouts focused. Two targeted assistance moves per day support the main lift.'
        },
        {
            key: TEMPLATE_KEYS.PERIODIZATION_BIBLE,
            title: 'Periodization Bible',
            blurb: 'Higher assistance volume across 4–5 blocks.',
            detail: 'Layered assistance progression emphasizing multiple movement patterns and rep ranges.'
        },
        {
            key: TEMPLATE_KEYS.BODYWEIGHT,
            title: 'Bodyweight',
            blurb: 'Emphasis on bodyweight accessory work (pulls, pushes, core).',
            detail: 'Great for minimal equipment phases. Focuses on movement quality and relative strength.'
        },
        {
            key: TEMPLATE_KEYS.JACK_SHIT,
            title: 'Jack Shit',
            blurb: 'Main lifts only. No supplemental or assistance.',
            detail: 'Ultra-minimalist phase. Ideal for busy weeks or recovery phases.'
        }
    ]), []);

    function handleSelectTemplate(key) {
        setSelectedTemplate(key);
        setShowTemplatePanel(true);
    }

    function applyTemplate() {
        if (!selectedTemplate) return;
        const preset = getTemplatePreset(selectedTemplate, ctx);
        if (!preset) return;
        dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
        dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
        dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
        onChoose && onChoose('template');
        onAutoNext && onAutoNext();
    }

    function chooseCustom() {
        onChoose && onChoose('custom');
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 2 — Template or Custom</h2>
                <p className="text-gray-400">Select a proven Wendler template for instant configuration or continue with a fully custom build.</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 flex space-x-3">
                <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <div className="text-sm text-blue-100">
                    Applying a template will auto-configure schedule, supplemental, and assistance settings. You can still tweak details later.
                </div>
            </div>

            {/* Mode selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template selection area */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Templates</h3>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {templateCards.map(card => {
                                const active = selectedTemplate === card.key;
                                return (
                                    <div
                                        key={card.key}
                                        className={`relative rounded-lg border cursor-pointer group transition-colors p-4 flex flex-col justify-between ${active ? 'border-red-500 bg-red-600/10' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'}`}
                                        onClick={() => handleSelectTemplate(card.key)}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm leading-snug pr-6">{card.title}</h4>
                                                {active && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                            </div>
                                            <p className="text-xs text-gray-400 leading-snug mb-3">{card.blurb}</p>
                                        </div>
                                        <button
                                            className={`mt-auto text-xs font-medium px-3 py-1.5 rounded border ${active ? 'border-red-500 text-red-300 bg-red-600/20' : 'border-gray-600 text-gray-300 hover:border-gray-500'}`}
                                            type="button"
                                        >
                                            {active ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom build card */}
                    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Want Full Control?</h3>
                        <p className="text-sm text-gray-400 mb-4">Skip presets and design every layer yourself: supplemental strategy, assistance volume, conditioning, and advanced options.</p>
                        <button
                            onClick={chooseCustom}
                            className="px-5 py-2 rounded-lg border border-gray-600 text-gray-200 hover:border-red-500 hover:text-red-300 transition-colors text-sm font-medium"
                            type="button"
                        >
                            Customize Manually →
                        </button>
                    </div>
                </div>

                {/* Detail side panel */}
                <div className="lg:col-span-1">
                    {showTemplatePanel && selectedTemplate ? (
                        <div className="sticky top-4 bg-gray-800/60 border border-gray-700 rounded-lg p-5 space-y-4">
                            {(() => {
                                const card = templateCards.find(c => c.key === selectedTemplate);
                                if (!card) return null;
                                return (
                                    <>
                                        <h4 className="text-white font-semibold text-sm mb-1">{card.title}</h4>
                                        <p className="text-xs text-gray-400 leading-snug mb-2">{card.detail}</p>
                                        <div className="text-xs text-gray-500 mb-4">This will set schedule order, supplemental configuration and assistance mode automatically.</div>
                                        <button
                                            onClick={applyTemplate}
                                            className="w-full px-4 py-2 rounded-lg bg-red-600/20 border border-red-500 text-red-300 text-sm font-medium hover:bg-red-600/30 transition-colors flex items-center justify-center space-x-2"
                                            type="button"
                                        >
                                            <span>Apply Template & Skip to Review</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setShowTemplatePanel(false)}
                                            className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300"
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="bg-gray-800/30 border border-dashed border-gray-700 rounded-lg p-5 text-center text-sm text-gray-500">
                            <p>Select a template to view details & apply.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
