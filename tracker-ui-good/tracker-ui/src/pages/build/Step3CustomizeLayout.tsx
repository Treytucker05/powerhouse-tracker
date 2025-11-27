import React from 'react';
import { useBuilder } from '@/context/BuilderState';
import { useStep3 } from '@/store/step3Store';
import { resolveTemplateConfig } from '@/lib/531/templateSchema';
import SupplementalTab from '@/components/program/steps/Step3/tabs/SupplementalTab';
import AssistanceTab from '@/components/program/steps/Step3/tabs/AssistanceTab';
import WarmupJumpsThrowsTab from '@/components/program/steps/Step3/tabs/WarmupJumpsThrowsTab';
import ConditioningTab from '@/components/program/steps/Step3/tabs/ConditioningTab';
import StickySummary from '@/components/program/steps/Step3/StickySummary';
import { useProgramV2, selectPhasePlan, selectPhasePattern, setPhasePattern, selectSeventhWeek, setSeventhWeek, selectSupplementalSchemeId, setSupplementalSchemeId } from '@/methods/531/contexts/ProgramContextV2.jsx';

function PoliciesBar() {
    const { state: builder } = useBuilder();
    const step1 = (builder as any)?.step1 || {};
    const step2 = (builder as any)?.step2 || {};
    const tmPct = typeof step1?.tmPct === 'number' ? Math.round(step1.tmPct * 100) : undefined;
    const cfg = resolveTemplateConfig(step2?.templateId || null);
    const cfgName = (() => {
        if (!cfg) return step2?.templateLabel || 'Template';
        // derive a human title from known ids
        if (cfg.templateId === 'ssl_leader') return 'SSL Leader';
        if (cfg.templateId === 'fsl_leader') return 'FSL Leader';
        return step2?.templateLabel || 'Template';
    })();
    const title = `${cfgName} · ${cfg?.mainWork?.pattern || ''} + ${cfg?.supplemental?.scheme || ''}`.trim();
    const policies = cfg?.policiesRow || 'AMRAP Off · Jokers No · 7th Week required';
    return (
        <header className="sticky top-0 z-10 bg-[#0b1220] border-b border-gray-700">
            <div className="px-6 py-3">
                <div className="text-lg font-semibold text-white">{title}</div>
                <div className="text-xs text-gray-300 mt-1">{policies}</div>
                <div className="text-xs text-gray-400 mt-1">TM: {tmPct ? `${tmPct}%` : '—'} (from Step 1)</div>
            </div>
        </header>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-[#0b1220] border border-gray-800 rounded">
            <div className="px-4 py-2 border-b border-gray-800 text-sm font-semibold" style={{ color: '#ef4444' }}>{title}</div>
            <div className="p-4">{children}</div>
        </section>
    );
}

export default function Step3CustomizeLayout() {
    // Use existing tabs content inside cards to accelerate adoption.
    const { state } = useStep3();
    const { state: program, dispatch } = useProgramV2();
    const phasePlan = selectPhasePlan(program);
    const phasePattern = selectPhasePattern(program) as '2+1' | '3+1' | undefined;
    const seventh = selectSeventhWeek(program) as { mode: 'deload' | 'tm_test'; criteria: 'afterLeader' | 'every7th' };
    const suppSchemeId = (selectSupplementalSchemeId(program) as 'fsl' | 'ssl' | 'bbb' | 'bbs' | undefined) || 'fsl';
    const assistanceMinsMet = (() => {
        const t = state.assistance.perCategoryTarget || {} as any;
        const picks = state.assistance.picks || {} as any;
        const cur = (arr?: string[]) => (Array.isArray(arr) ? arr.length * 10 : 0);
        const cats: Array<'Pull' | 'Push' | 'Single-Leg/Core' | 'Core'> = ['Pull', 'Push', 'Single-Leg/Core', 'Core'];
        return cats.every(k => cur(picks[k]) >= Math.max(0, Math.min(200, Number(t[k] ?? 0))));
    })();
    const hard = state.conditioning.hardDays ?? 0;
    const easy = state.conditioning.easyDays ?? 0;
    const violates50 = (hard + easy) > 0 && hard > easy;
    const allowOver = !!state.conditioning.allowOverage;
    const canContinue = assistanceMinsMet && (!violates50 || allowOver);
    return (
        <div className="min-h-[60vh]">
            <PoliciesBar />
            <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6">
                    {/* Quick supplemental scheme picker (V2) */}
                    <Card title="Supplemental scheme (quick pick)">
                        <div className="text-sm text-gray-300">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { id: 'fsl', label: 'FSL (65/70/75%)', hint: 'First Set Last · recovery-friendly' },
                                    { id: 'ssl', label: 'SSL (75/80/85%)', hint: 'Second Set Last · heavier' },
                                    { id: 'bbb', label: 'BBB (5×10 @ ~50%)', hint: 'Boring But Big · high volume' },
                                    { id: 'bbs', label: 'BBS (5×5 @ 70%)', hint: 'Boring But Strong' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`px-3 py-2 rounded border text-left ${suppSchemeId === (opt.id as any) ? 'border-red-600 bg-red-600 text-white' : 'border-gray-700 bg-gray-900/60 text-gray-200 hover:border-red-500'}`}
                                        onClick={() => setSupplementalSchemeId(dispatch as any, opt.id as any)}
                                        aria-pressed={suppSchemeId === (opt.id as any)}
                                    >
                                        <div className="font-semibold text-[13px]">{opt.label}</div>
                                        <div className="text-[11px] text-gray-300">{opt.hint}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-2">These set the scheme in the 5/3/1 V2 engine. The detailed table below remains available for template exploration.</div>
                        </div>
                    </Card>
                    <Card title="Main Set Style">
                        <div className="text-sm text-gray-300">
                            <div className="mb-2">Leader vs. Anchor main set styles are fixed for this flow.</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="inline-flex items-center gap-2">
                                    <input type="radio" checked readOnly />
                                    <span>Leader main sets: <span className="font-semibold">5s Pro</span></span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input type="radio" checked readOnly />
                                    <span>Anchor main sets: <span className="font-semibold">PR Sets</span></span>
                                </label>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-2">Leader builds volume and technique with crisp sets; Anchor unlocks PR attempts on the final set.</div>
                            <div className="text-[11px] text-gray-500 mt-1">Current: Leader = {phasePlan?.leader?.mainSet || '5s_pro'} · Anchor = {phasePlan?.anchor?.mainSet || 'pr_sets'}</div>
                        </div>
                    </Card>
                    <Card title="Main + Supplemental">
                        {/* Reuse the Supplemental tab UI for now */}
                        <SupplementalTab />
                    </Card>
                    <Card title="Assistance (category-driven)">
                        <AssistanceTab />
                    </Card>
                    <Card title="Warm-ups, Jumps & Throws">
                        <WarmupJumpsThrowsTab />
                    </Card>
                    <Card title="Conditioning">
                        <ConditioningTab />
                    </Card>
                    <Card title="Cycle & 7th Week">
                        <div className="text-sm text-gray-300 space-y-3">
                            {/* Pattern picker */}
                            <div>
                                <div className="font-medium mb-1">Leader/Anchor Pattern</div>
                                <div className="flex flex-wrap gap-2">
                                    {(['2+1', '3+1'] as const).map(p => (
                                        <button
                                            key={p}
                                            className={`px-3 py-1.5 rounded border text-sm ${phasePattern === p ? 'border-red-600 bg-red-600 text-white' : 'border-gray-700 bg-gray-900/60 text-gray-200 hover:border-red-500'}`}
                                            onClick={() => setPhasePattern(dispatch as any, p)}
                                            aria-pressed={phasePattern === p}
                                        >{p}</button>
                                    ))}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-1">2+1 = two Leader cycles then Anchor; 3+1 = three Leaders then Anchor.</div>
                            </div>

                            {/* Seventh‑Week mode */}
                            <div>
                                <div className="font-medium mb-1">7th‑Week Protocol</div>
                                <div className="flex flex-wrap gap-2">
                                    {([
                                        { k: 'deload', label: 'Deload' },
                                        { k: 'tm_test', label: 'TM Test' }
                                    ] as const).map(opt => (
                                        <button
                                            key={opt.k}
                                            className={`px-3 py-1.5 rounded border text-sm ${(seventh?.mode || 'deload') === opt.k ? 'border-red-600 bg-red-600 text-white' : 'border-gray-700 bg-gray-900/60 text-gray-200 hover:border-red-500'}`}
                                            onClick={() => setSeventhWeek(dispatch as any, { mode: opt.k })}
                                            aria-pressed={(seventh?.mode || 'deload') === opt.k}
                                        >{opt.label}</button>
                                    ))}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-1">Deload reduces volume; TM Test builds to a conservative test set.</div>
                            </div>

                            {/* Seventh‑Week criteria */}
                            <div>
                                <div className="font-medium mb-1">When to run 7th‑Week</div>
                                <div className="flex flex-wrap gap-2">
                                    {([
                                        { k: 'afterLeader', label: 'After Leader' },
                                        { k: 'every7th', label: 'Every 7th Week' }
                                    ] as const).map(opt => (
                                        <button
                                            key={opt.k}
                                            className={`px-3 py-1.5 rounded border text-sm ${(seventh?.criteria || 'afterLeader') === opt.k ? 'border-red-600 bg-red-600 text-white' : 'border-gray-700 bg-gray-900/60 text-gray-200 hover:border-red-500'}`}
                                            onClick={() => setSeventhWeek(dispatch as any, { criteria: opt.k })}
                                            aria-pressed={(seventh?.criteria || 'afterLeader') === opt.k}
                                        >{opt.label}</button>
                                    ))}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-1">Choose automatic cadence. Defaults: After Leader; adjust as you prefer.</div>
                            </div>
                        </div>
                    </Card>
                    <Card title="Summary">
                        <div className="text-sm text-gray-300 mb-2">Session time estimate and recovery status appear in the sidebar summary.</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded border border-gray-700 text-gray-200 text-sm">Back</button>
                            <button disabled={!canContinue} className={`px-3 py-1 rounded text-sm ${canContinue ? 'border border-red-600 bg-red-600 text-white' : 'border border-gray-700 bg-gray-800 text-gray-400 cursor-not-allowed'}`}>Continue</button>
                        </div>
                    </Card>
                </div>
                <div>
                    <StickySummary />
                </div>
            </div>
        </div>
    );
}
