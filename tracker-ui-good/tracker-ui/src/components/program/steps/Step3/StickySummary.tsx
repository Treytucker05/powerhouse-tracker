import React from 'react';
import { useStep3 } from '@/store/step3Store';
import { estimateSessionMinutes, warningsForSelection } from '@/lib/531/rules';
import { calcRecovery } from '@/lib/531/recovery';
import { useSettings } from '@/store/settingsStore';
import { useSchedule } from '@/store/scheduleStore';
import { useBuilder } from '@/context/BuilderState';
import { buildStep3DefaultsFromSupplemental } from '@/lib/531/defaults';
import { resolveTemplateConfig } from '@/lib/531/templateSchema';

function Meter({ label, current, target }: { label: string; current: number; target: number }) {
    const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, target)) * 100)));
    return (
        <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-300">
                <span>{label}</span>
                <span>
                    {current}/{target}
                </span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
                <div className="h-2 bg-red-500 rounded" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h3 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h3>;
}

export default function StickySummary() {
    const { state, actions } = useStep3();
    const { bookMode } = useSettings();
    // Pull live schedule from store (top-level fields), and Step 2 split info
    const scheduleLive = useSchedule(s => ({ days: s.days, daysPerWeek: s.daysPerWeek, rotation: s.rotation }));
    const { state: builderState } = useBuilder();
    const step2 = (builderState as any)?.step2 || {};
    const supp = state.supplemental;
    const tplCfg = resolveTemplateConfig(((builderState as any)?.step2?.templateId) || null);
    const picks = state.assistance.picks;
    const targets = state.assistance.perCategoryTarget || {};
    const step1 = (builderState as any)?.step1 || {};
    const inheritedTM = typeof step1?.tmPct === 'number' ? Math.round(step1.tmPct * 100) + '%' : '—';

    // Heuristic: each pick ~10 reps proxy toward target display
    const currentReps = (arr?: string[]) => (Array.isArray(arr) ? arr.length * 10 : 0);

    const hard = state.conditioning.hardDays || 0;
    const easy = state.conditioning.easyDays || 0;
    const activities = state.conditioning.modalities || [];

    // Estimate session minutes from rules util (assumes unknown supplemental sets -> infer from sets×reps string if possible)
    const supplementalSets = React.useMemo(() => {
        const s = supp?.SupplementalSetsReps || '';
        const m = s.match(/(\d+)\s*[xX]\s*(\d+)/);
        // count sets only; if not parseable, assume 0
        return m ? Number(m[1]) : 0;
    }, [supp?.SupplementalSetsReps]);

    const assistanceTargets = state.assistance.perCategoryTarget || {};
    const jtCombined = state.warmup.jumpsThrowsDose || 0;
    const estMinutes = estimateSessionMinutes({
        mainPattern: (supp?.MainPattern as any) || '531',
        supplementalSets,
        assistanceTargets,
        jumpsThrows: jtCombined,
        jumpsPerDay: state.warmup.jumpsPerDay,
        throwsPerDay: state.warmup.throwsPerDay,
    });

    const warnings = warningsForSelection(supp, estMinutes, hard, state.cycle?.includeDeload !== false);
    const recovery = calcRecovery({
        minutes: Math.max(30, Math.min(180, Math.round(estMinutes))),
        hardConditioning: hard,
        easyConditioning: easy,
        assistanceVolumeScore: (() => {
            const t = Object.values(state.assistance.perCategoryTarget || {}).reduce((a, b) => a + (b || 0), 0);
            return Math.max(0, Math.min(1, t / 400));
        })()
    });
    const violates50 = (hard + easy) > 0 && hard > easy;
    const enforceBlock = bookMode === 'enforce' && (recovery.week < 60 || hard > 2 || Math.round(estMinutes) > 90 || violates50);

    const autoTrim = () => {
        const minutes = Math.max(1, Math.round(estMinutes));
        const factor = Math.min(1, 60 / minutes);
        const targets = state.assistance.perCategoryTarget || {} as Record<string, number>;
        const scaled: Record<string, number> = {};
        Object.keys(targets).forEach(k => { scaled[k] = Math.max(10, Math.round(targets[k] * factor)); });
        const nextHard = Math.min(2, hard || 0);
        const nextEasy = Math.max(easy || 0, nextHard);
        actions.setAssistance({ perCategoryTarget: scaled });
        actions.setConditioning({ hardDays: nextHard, easyDays: nextEasy });
    };

    // Apply Template Defaults
    const applyTemplateDefaults = () => {
        if (!supp) return;
        const patch = buildStep3DefaultsFromSupplemental(supp);
        if (patch.assistance) actions.setAssistance(patch.assistance);
        if (patch.warmup) actions.setWarmup(patch.warmup);
        if (patch.conditioning) actions.setConditioning(patch.conditioning);
    };

    // Optional auto-apply if Step 2 requested a handoff
    React.useEffect(() => {
        try {
            const flag = sessionStorage.getItem('applyTemplateDefaults');
            if (flag === '1' && supp) {
                applyTemplateDefaults();
                sessionStorage.removeItem('applyTemplateDefaults');
            }
        } catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supp]);

    // Compute a rotation label that prefers Step 2's split (e.g., 2D • A/B) when available
    const splitKey = (step2.splitKey || '') as '2D' | '3D' | '4D' | '';
    const splitLabel = (step2.splitLabel || '') as string;
    const computedRotation = splitKey ? `${splitKey}${splitLabel ? ': ' + splitLabel : ''}` : scheduleLive.rotation;
    const daysLabel = (scheduleLive.days || []).join(' · ') || '—';

    return (
        <aside className="sticky top-4 bg-[#111827] border border-gray-700 rounded p-4">
            <div className="space-y-4">
                {/* Schedule summary moved higher for clarity */}
                <div className="border border-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">Training Days</span>
                        <span className="text-sm font-semibold">{daysLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Rotation</span>
                        <span className="text-sm font-semibold">{computedRotation}</span>
                    </div>
                </div>
                <div>
                    <SectionHeading>Supplemental</SectionHeading>
                    {supp ? (
                        <ul className="text-sm text-gray-200 space-y-1">
                            <li>
                                <span className="text-gray-400">Template: </span>
                                {supp.Template}
                            </li>
                            <li>
                                <span className="text-gray-400">Sets×Reps: </span>
                                {supp.SupplementalSetsReps}
                            </li>
                            <li>
                                <span className="text-gray-400">%: </span>
                                {supp.SupplementalPercentSchedule}
                            </li>
                            <li>
                                <span className="text-gray-400">TM: </span>
                                {inheritedTM} <span className="text-[10px] text-gray-400">(from Step 1)</span>
                            </li>
                            {supp.MainPattern === '5s PRO' && supp.SupplementalScheme === 'SSL' && (
                                <li>
                                    <span className="text-gray-400">SSL % by week: </span>
                                    75/80/85% TM
                                </li>
                            )}
                            {supp.MainPattern === '5s PRO' && supp.SupplementalScheme === 'FSL' && (
                                <li>
                                    <span className="text-gray-400">FSL % by week: </span>
                                    65/70/75% TM
                                </li>
                            )}
                            {(supp.MainPattern === '5s PRO') && (
                                <li className="text-[11px] text-gray-400">
                                    {tplCfg?.policiesRow ? tplCfg.policiesRow : 'Policies: AMRAP Off · Jokers No · 7th Week between phases'}
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400">No supplemental selected yet.</p>
                    )}
                    {state.supplemental?.MainPattern && (
                        <div className="mt-2">
                            <span className="px-2 py-0.5 rounded bg-[#1f2937] text-xs">
                                Scheme: <strong>{state.supplemental.MainPattern}</strong>
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <SectionHeading>Assistance</SectionHeading>
                    <div className="space-y-2">
                        <div className="text-xs text-gray-400">Mode: <span className="text-gray-200">{state.assistance.mode || 'Preset'}</span></div>
                        <Meter label="Pull" current={currentReps(picks.Pull)} target={targets.Pull || 50} />
                        <Meter label="Push" current={currentReps(picks.Push)} target={targets.Push || 50} />
                        <Meter label="Single-Leg/Core" current={currentReps(picks['Single-Leg/Core'])} target={targets['Single-Leg/Core'] || 50} />
                        <Meter label="Core" current={currentReps(picks.Core)} target={targets.Core || 50} />
                        {supp && (
                            <button
                                onClick={applyTemplateDefaults}
                                className="mt-2 px-3 py-1 rounded bg-gray-900 border border-gray-700 text-xs text-gray-200 hover:border-red-500"
                            >Apply Template Defaults</button>
                        )}
                    </div>
                </div>

                <div>
                    <SectionHeading>Warm-up</SectionHeading>
                    <ul className="text-sm text-gray-200 space-y-1">
                        <li>
                            <span className="text-gray-400">Mobility: </span>
                            {state.warmup.mobility || '—'}
                        </li>
                        <li>
                            <span className="text-gray-400">Jumps: </span>
                            {typeof state.warmup.jumpsPerDay === 'number' ? state.warmup.jumpsPerDay : '—'}
                        </li>
                        <li>
                            <span className="text-gray-400">Throws: </span>
                            {typeof state.warmup.throwsPerDay === 'number' ? state.warmup.throwsPerDay : '—'}
                        </li>
                    </ul>
                </div>

                <div>
                    <SectionHeading>Cycle</SectionHeading>
                    <div className="text-sm text-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Deload week:</span>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={state.cycle?.includeDeload !== false}
                                        onChange={(e) => actions.setCycle({ includeDeload: !!e.target.checked })}
                                    />
                                    <span>{state.cycle?.includeDeload !== false ? 'included' : 'skipped'}</span>
                                </label>
                            </div>
                            {!!state.warmup.novFullPrep && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-700/40 border border-indigo-500 text-indigo-200">N.O.V. Prep</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1">Notes</label>
                            <textarea
                                value={state.cycle?.notes || ''}
                                onChange={(e) => actions.setCycle({ notes: e.target.value })}
                                rows={3}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-gray-100"
                                placeholder="Optional cycle notes (e.g., travel week, testing, tweaks)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <SectionHeading>Conditioning</SectionHeading>
                    <ul className="text-sm text-gray-200 space-y-1">
                        <li>
                            <span className="text-gray-400">Hard/Easy per week: </span>
                            {hard}/{easy}
                        </li>
                        <li>
                            <span className="text-gray-400">Activities: </span>
                            {activities.length ? activities.join(', ') : '—'}
                        </li>
                    </ul>
                </div>

                <div className="pt-2 border-t border-gray-700">

                    <SectionHeading>Time & Warnings</SectionHeading>
                    <p className="text-sm text-gray-200">Estimated session: ~{Math.max(30, Math.min(120, Math.round(estMinutes)))} min</p>
                    {warnings.length > 0 && (
                        <ul className="mt-2 text-xs text-yellow-300 list-disc list-inside space-y-1">
                            {warnings.map((w, i) => (
                                <li key={i}>{w}</li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="bg-gray-900/60 border border-gray-800 rounded p-3">
                            <div className="text-gray-300">Recovery (Day)</div>
                            <div className="text-gray-100 text-lg font-semibold">{recovery.day}</div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-800 rounded p-3">
                            <div className="text-gray-300">Recovery (Week)</div>
                            <div className="text-gray-100 text-lg font-semibold">{recovery.week}</div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-800 rounded p-3">
                            <div className="text-gray-300">Balance</div>
                            <div className={`text-lg font-semibold ${violates50 ? 'text-red-300' : 'text-emerald-300'}`}>{violates50 ? 'Hard > Easy' : 'OK'}</div>
                        </div>
                    </div>
                    {recovery.flags.length > 0 && (
                        <ul className="mt-2 text-xs text-yellow-300 list-disc list-inside space-y-1">
                            {recovery.flags.map((f, i) => (<li key={i}>{f}</li>))}
                        </ul>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                        {Math.round(estMinutes) > 60 && (
                            <button onClick={autoTrim} className="px-3 py-1 rounded bg-red-600 text-white text-xs border border-red-700 hover:bg-red-500">Auto-trim to ~60</button>
                        )}
                        {enforceBlock && (
                            <span className="text-xs text-red-300">Book Mode enforced — adjust plan to proceed.</span>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
