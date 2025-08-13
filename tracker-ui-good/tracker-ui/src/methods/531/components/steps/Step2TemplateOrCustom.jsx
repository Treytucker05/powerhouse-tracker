import React, { useState, useMemo } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS, getTemplatePreset } from '../../../../lib/templates/531.presets.v2.js';
import { getTemplateSpec, TEMPLATE_SPECS } from '../../../../lib/templates/531.templateSpecs.js';
import { CheckCircle2, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import ToggleButton from '../ToggleButton.jsx';
import TemplateExplainerModal from '../../components/TemplateExplainerModal.jsx';

/**
 * Step2TemplateOrCustom.jsx
 * Choose a built-in template (auto-config + jump to review) or continue custom design.
 */
export default function Step2TemplateOrCustom({ onChoose, onAutoNext }) {
    const ctx = useProgramV2();
    const { state, dispatch } = ctx;
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState(false); // legacy side panel flag (kept for minimal diff)
    const [explainerOpen, setExplainerOpen] = useState(false);

    const templateCards = useMemo(() => Object.values(TEMPLATE_SPECS).map(spec => ({
        key: spec.key,
        title: spec.name,
        blurb: spec.blurb,
        detail: spec.recovery,
        spec
    })), []);

    function handleSelectTemplate(key) {
        setSelectedTemplate(key);
        setExplainerOpen(true);
    }

    function applyTemplate() {
        if (!selectedTemplate) return;
        const preset = getTemplatePreset(selectedTemplate, ctx);
        if (!preset) return;
        const spec = getTemplateSpec(selectedTemplate);
        dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
        dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
        if (spec) {
            dispatch({ type: 'SET_TEMPLATE_SPEC', payload: spec });
            if (spec.assistanceHint) dispatch({ type: 'SET_ASSISTANCE_HINT', payload: spec.assistanceHint });
        }
        dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
        onChoose && onChoose('template');
        onAutoNext && onAutoNext();
        setExplainerOpen(false);
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
            <div className="grid grid-cols-1 gap-6">
                {/* Template selection area */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Templates</h3>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {templateCards.map(card => {
                                const active = selectedTemplate === card.key;
                                return (
                                    <div
                                        key={card.key}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={active}
                                        onClick={() => handleSelectTemplate(card.key)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectTemplate(card.key); } }}
                                        className={[
                                            'relative rounded-lg border cursor-pointer group transition p-4 flex flex-col justify-between outline-none',
                                            active ? 'border-indigo-500 bg-indigo-600/10 ring-2 ring-indigo-400' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'
                                        ].join(' ')}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-white text-sm leading-snug pr-6">{card.title}</h4>
                                                {active && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                            </div>
                                            <p className="text-xs text-gray-400 leading-snug mb-3 flex-1">{card.blurb}</p>
                                            <ToggleButton on={active} className="mt-auto self-start text-xs">{active ? 'Selected' : 'Select'}</ToggleButton>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom build card */}
                    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Want Full Control?</h3>
                        <p className="text-sm text-gray-400 mb-4">Skip presets and design every layer yourself: supplemental strategy, assistance volume, conditioning, and advanced options.</p>
                        <ToggleButton on={false} onClick={chooseCustom} className="text-xs px-5">Customize Manually →</ToggleButton>
                    </div>
                </div>

            </div>
            <TemplateExplainerModal
                spec={selectedTemplate ? getTemplateSpec(selectedTemplate) : null}
                state={state}
                open={explainerOpen}
                onClose={() => setExplainerOpen(false)}
                onApply={applyTemplate}
            />
        </div>
    );
}
