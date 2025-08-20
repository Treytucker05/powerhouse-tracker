import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/context/BuilderState';
import BuilderProgress from './BuilderProgress';

const approaches = [
    { id: 'classic531', label: 'Classic 5/3/1' },
    { id: '351', label: '3/5/1 Variant' },
    { id: '5spro', label: '5s Pro' },
    { id: 'leader_anchor', label: 'Leader / Anchor' },
    { id: 'comp_prep', label: 'Competition Prep' }
];

const supplementalOptions = ['fsl', 'ssl', 'bbb', 'bbs', 'widowmakers'];
const assistanceModes = ['minimal', 'balanced', 'template', 'custom'];
const conditioningPlans = ['minimal', 'standard', 'extensive'];

// Template-driven default mappings (approximate placeholders)
const TEMPLATE_DEFAULTS: Record<string, Partial<ReturnType<typeof defaultStep3>>> = {
    bbb: { scheduleFrequency: 4, supplemental: 'bbb', assistanceMode: 'balanced', warmupsEnabled: true, warmupScheme: 'standard', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    triumvirate: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'minimal' },
    periodization_bible: { scheduleFrequency: 4, supplemental: 'ssl', assistanceMode: 'balanced', warmupsEnabled: true, warmupScheme: 'standard', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    bodyweight: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'standard' },
    jackshit: { scheduleFrequency: 4, supplemental: 'fsl', assistanceMode: 'minimal', warmupsEnabled: true, warmupScheme: 'minimalist', approach: 'classic531', deload: true, conditioningPlan: 'minimal' }
};

const defaultStep3 = () => ({
    scheduleFrequency: 4 as 2 | 3 | 4,
    warmupsEnabled: true,
    warmupScheme: 'standard',
    approach: 'classic531',
    deload: true,
    supplemental: 'bbb',
    assistanceMode: 'balanced',
    conditioningPlan: 'standard',
    customNotes: ''
});

export default function DesignCustomize() {
    const { step2, step3, setStep3 } = useBuilder();
    const navigate = useNavigate();
    const [locked, setLocked] = useState(false); // "Use Template Defaults" lock

    const setField = (field: string, value: any) => setStep3({ [field]: value } as any);

    // Apply template defaults when lock is enabled or when template changes while locked
    useEffect(() => {
        if (!locked) return; // only auto-apply when locked
        if (!step2.templateId) return;
        const defaults = TEMPLATE_DEFAULTS[step2.templateId];
        if (defaults) {
            setStep3({ ...defaults } as any);
        }
    }, [locked, step2.templateId, setStep3]);

    const manualApply = () => {
        if (!step2.templateId) return;
        const defaults = TEMPLATE_DEFAULTS[step2.templateId];
        if (defaults) setStep3({ ...defaults } as any);
    };

    // Debounced persistence for Step3
    useEffect(() => {
        const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
        if (isTest) return;
        const handle = setTimeout(async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const payload = { user_id: userId, step: 3, state: step3, updated_at: new Date().toISOString() };
                await supabase.from('program_builder_state').upsert(payload, { onConflict: 'user_id,step' });
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Persist step3 failed', e);
            }
        }, 600);
        return () => clearTimeout(handle);
    }, [step3]);

    // Hydrate Step3
    useEffect(() => {
        let active = true;
        const run = async () => {
            const isTest = typeof window === 'undefined' || (window as any)?.process?.env?.NODE_ENV === 'test';
            if (isTest) return;
            try {
                const userId = await getCurrentUserId();
                if (!userId) return;
                const { data } = await supabase.from('program_builder_state').select('*').eq('user_id', userId).eq('step', 3).single();
                if (data?.state && active) {
                    setStep3(data.state);
                }
            } catch (e) {
                if (import.meta.env.DEV) console.warn('Hydrate step3 failed', e);
            }
        };
        run();
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col" data-testid="step3-container">
            <div className="px-8 pt-6"><BuilderProgress current={3} /></div>
            <header className="px-8 pt-8 pb-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Customize Design</h1>
                    <p className="text-sm text-gray-400">Adjust schedule, warm-ups, supplemental & conditioning.</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm flex items-center gap-2">
                        <input type="checkbox" checked={locked} onChange={e => setLocked(e.target.checked)} />
                        <span>Use Template Defaults (lock)</span>
                    </label>
                    <button
                        type="button"
                        disabled={!step2.templateId}
                        onClick={manualApply}
                        className={`text-xs px-3 py-1 rounded border ${step2.templateId ? 'border-red-500 text-red-200 hover:bg-red-600/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >Apply Now</button>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    {step2.templateId && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-xs text-gray-400">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-gray-300 font-semibold">Template:</span>
                                <span className="px-2 py-0.5 rounded bg-gray-700/50 border border-gray-600 text-[10px] font-mono">{step2.templateId}</span>
                                {locked && <span className="px-2 py-0.5 rounded bg-red-600/70 text-white text-[10px]">Locked</span>}
                            </div>
                            <p className="leading-relaxed">Defaults are {locked ? 'applied & locked.' : 'available; enable lock or click Apply to load them.'}</p>
                        </div>
                    )}
                    {/* Schedule */}
                    <div data-testid="schedule-editor" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Schedule</h2>
                        <div className="flex gap-3 text-sm">
                            {[2, 3, 4].map(freq => (
                                <button key={freq} disabled={locked} onClick={() => setField('scheduleFrequency', freq)} className={`px-3 py-1 rounded border ${step3.scheduleFrequency === freq ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{freq}-Day</button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Drag & drop lift order coming later.</p>
                    </div>
                    {/* Warmups */}
                    <div data-testid="warmup-chooser" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Warm-ups</h2>
                        <label className="flex items-center gap-2 text-sm mb-3">
                            <input type="checkbox" disabled={locked} checked={!!step3.warmupsEnabled} onChange={e => setField('warmupsEnabled', e.target.checked)} /> Enable Warm-ups
                        </label>
                        <div className="flex gap-2 text-sm">
                            {['standard', 'minimalist', 'jumps_integrated'].map(s => (
                                <button key={s} disabled={locked} onClick={() => setField('warmupScheme', s)} className={`px-3 py-1 rounded border ${step3.warmupScheme === s ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{s.replace(/_/g, ' ')}</button>
                            ))}
                        </div>
                    </div>
                    {/* Approach */}
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Programming Approach</h2>
                        <div className="flex flex-wrap gap-2">
                            {approaches.map(a => (
                                <button key={a.id} data-testid={`approach-${a.id}`} disabled={locked} onClick={() => setField('approach', a.id)} className={`px-3 py-1 rounded border text-xs ${step3.approach === a.id ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{a.label}</button>
                            ))}
                        </div>
                    </div>
                    {/* Deload */}
                    <div data-testid="deload-toggle" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <span className="font-semibold">Deload Week</span>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" disabled={locked} checked={!!step3.deload} onChange={e => setField('deload', e.target.checked)} /> Enabled
                        </label>
                    </div>
                    {/* Supplemental */}
                    <div data-testid="supplemental-picker" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Supplemental</h2>
                        <div className="flex flex-wrap gap-2">
                            {supplementalOptions.map(opt => (
                                <button key={opt} disabled={locked} onClick={() => setField('supplemental', opt)} className={`px-3 py-1 rounded border text-xs ${step3.supplemental === opt ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    {/* Assistance */}
                    <div data-testid="assistance-picker" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Assistance</h2>
                        <div className="flex flex-wrap gap-2">
                            {assistanceModes.map(m => (
                                <button key={m} disabled={locked} onClick={() => setField('assistanceMode', m)} className={`px-3 py-1 rounded border text-xs ${step3.assistanceMode === m ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{m}</button>
                            ))}
                        </div>
                        {step3.assistanceMode === 'custom' && (
                            <p className="text-xs text-gray-500 mt-2">Custom picker coming soon.</p>
                        )}
                    </div>
                    {/* Conditioning */}
                    <div data-testid="conditioning-planner" className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                        <h2 className="font-semibold mb-3">Conditioning</h2>
                        <div className="flex flex-wrap gap-2">
                            {conditioningPlans.map(cp => (
                                <button key={cp} disabled={locked} onClick={() => setField('conditioningPlan', cp)} className={`px-3 py-1 rounded border text-xs ${step3.conditioningPlan === cp ? 'border-red-500 bg-gray-700' : 'border-gray-600 hover:bg-gray-700'}`}>{cp}</button>
                            ))}
                        </div>
                    </div>
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Live Summary</h3>
                        <ul className="text-xs space-y-1">
                            <li>Schedule: {step3.scheduleFrequency}-day</li>
                            <li>Warm-ups: {step3.warmupsEnabled ? step3.warmupScheme : 'off'}</li>
                            <li>Approach: {step3.approach}</li>
                            <li>Deload: {step3.deload ? 'on' : 'off'}</li>
                            <li>Supplemental: {step3.supplemental}</li>
                            <li>Assistance: {step3.assistanceMode}</li>
                            <li>Conditioning: {step3.conditioningPlan}</li>
                        </ul>
                    </div>
                </aside>
            </div>
            <footer className="px-8 py-4 border-t border-gray-800 flex items-center justify-end gap-4">
                <button onClick={() => navigate('/build/step2')} className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                <button onClick={() => navigate('/build/step4')} className="px-4 py-2 rounded border border-red-500 text-sm hover:bg-red-600/10">Next</button>
            </footer>
        </div>
    );
}
