import React from 'react';
import { useBuilder } from '@/context/BuilderState';
import { useNavigate } from 'react-router-dom';
import BuilderProgress from './BuilderProgress';
import { tryGenerate531, GeneratedProgram531 } from '@/lib/program/generation/fiveThreeOneGenerator';
import { variantLabel } from '@/lib/variants/registry';
import { templateLabel, schemeLabel, schemeAmrap } from '@/lib/builder/templates';
import { supabase, getCurrentUserId } from '@/lib/supabaseClient';
import { syncToSupabase, syncToLocalStorage, checkTableExists } from '@/context/appHelpers';
import { toast } from 'react-toastify';
import { makeV2FromBuilder, writeProgramV2ToLocalStorage } from '@/lib/adapters/builderToProgramV2';
import { formatWeight, normalizeUnits } from '@/lib/units';

// Step 4: Preview & Export (scaffold)
// Focus: Provide a read-only style preview of generated program structure with week tabs and day cards.
// Future: Integrate real calculation & export modal.

const WEEKS = [1, 2, 3, 4];

// Export versioning – bump when program serialization shape changes
const EXPORT_VERSION = 1;

interface ExportPayload531 {
    program_type: string;
    program_name: string;
    version: number;
    methodology: '531';
    builder_snapshot: any; // Raw builder steps (for future migrations)
    generated: GeneratedProgram531; // Lightweight generated structure
}

function buildExportPayload(opts: { steps: any; program: GeneratedProgram531 }): ExportPayload531 {
    const { steps, program } = opts;
    const { step1, step2, step3 } = steps;

    // Enrich with human-readable metadata
    const variantLabels = step1?.variants ?
        Object.fromEntries(Object.entries(step1.variants as Record<string, string>).map(([k, v]) => [k, variantLabel(v) || v])) : {};

    return {
        program_type: 'five_three_one',
        program_name: '5/3/1 Builder (Preview)',
        version: EXPORT_VERSION,
        methodology: '531',
        builder_snapshot: {
            step1: steps.step1,
            step2: steps.step2,
            step3: steps.step3,
            // Additional export metadata
            export_metadata: {
                exportedAt: new Date().toISOString(),
                mainSetOption: step3?.mainSetOption || 1,
                roundingStrategy: step1?.roundingStrategy || 'nearest',
                variantLabels: variantLabels as Record<string, string>
            }
        },
        generated: program
    };
}

const ProgramPreview: React.FC = () => {
    const navigate = useNavigate();
    const { step1, step2, step3 } = useBuilder();
    const [activeWeek, setActiveWeek] = React.useState(1);
    const [exporting, setExporting] = React.useState(false);
    const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
    const [viewMode, setViewMode] = React.useState<'cards' | 'grid'>('cards');
    const scheduleFrequency = step3?.scheduleFrequency || 4;

    // Seed the canonical ProgramV2 store from Builder Steps 1–3 for engine-driven flows
    React.useEffect(() => {
        try {
            if (!step1 || !step2 || !step3) return;
            const v2 = makeV2FromBuilder(step1 as any, step2 as any, step3 as any);
            writeProgramV2ToLocalStorage(v2);
        } catch (e) {
            // non-fatal in preview
            console.warn('Builder→V2 seed failed', e);
        }
        // run on initial mount and whenever builder steps materially change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step1, step2, step3]);

    const program = React.useMemo(() => {
        return tryGenerate531({
            tms: step1.tmTable,
            scheduleFrequency: scheduleFrequency as 2 | 3 | 4,
            includeDeload: !!step3?.deload,
            rounding: step1.rounding,
            schemeId: (step2?.schemeId as any) || 'scheme_531',
            supplemental: step3?.supplemental,
            assistanceMode: step3?.assistanceMode,
            liftOrder: step3?.liftOrder,
            liftRotation: step3?.liftRotation,
            mainSetOption: step3?.mainSetOption || 1,
            warmupsEnabled: !!step3?.warmupsEnabled,
            warmupScheme: step3?.warmupScheme as any,
            variants: step1?.variants
        });
    }, [step1.tmTable, scheduleFrequency, step3?.deload, step1.rounding, step2?.schemeId, step3?.supplemental, step3?.assistanceMode, step3?.liftOrder, step3?.liftRotation, step3?.mainSetOption, step3?.warmupsEnabled, step3?.warmupScheme, step1?.variants]);

    const weeksAvailable = program ? program.weeks.map(w => w.week) : [1, 2, 3, step3?.deload ? 4 : undefined].filter(Boolean) as number[];
    const activeWeekData = program?.weeks.find(w => w.week === activeWeek);
    const days = activeWeekData ? activeWeekData.days.map(d => d.main?.dayIndex || 0) : Array.from({ length: scheduleFrequency }, (_, i) => i + 1);

    const canExport = !!program;

    const handleExport = React.useCallback(async () => {
        if (!program || exporting) return;
        setExporting(true);
        try {
            const userId = await getCurrentUserId();
            const payload = buildExportPayload({ steps: { step1, step2, step3 }, program });

            // Persist a canonical ProgramV2 snapshot alongside export for engine consumers
            try {
                const v2 = makeV2FromBuilder(step1 as any, step2 as any, step3 as any);
                writeProgramV2ToLocalStorage(v2);
            } catch { /* non-blocking */ }

            // Always keep a local copy
            syncToLocalStorage('currentProgram', payload);

            if (!userId) {
                toast.info('Saved locally. Log in to sync with your profile.');
                setLastSavedAt(new Date().toISOString());
                return;
            }

            // Prefer using existing helper (will no-op if table missing)
            const tableExists = await checkTableExists('user_programs');
            if (!tableExists) {
                toast.info('Cloud table missing. Local save only.');
                setLastSavedAt(new Date().toISOString());
                return;
            }

            const result = await syncToSupabase('user_programs', payload, userId);
            if (result) {
                toast.success('Program exported to your profile.');
            } else {
                toast.info('Program saved locally (cloud sync unavailable).');
            }
            setLastSavedAt(new Date().toISOString());
        } catch (e: any) {
            console.error('Export failed', e);
            toast.error('Export failed – saved locally only.');
        } finally {
            setExporting(false);
        }
    }, [program, exporting, step1, step2, step3]);

    return (
        <div data-testid="step4-preview-root" className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            {/* Print helpers: hide most UI when printing and show a compact snapshot */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body, html { background: #ffffff !important; }
                }
                .print-only { display: none; }
            `}</style>
            <div className="px-8 pt-6"><BuilderProgress current={4} /></div>
            <header className="px-8 pt-4 pb-4 border-b border-gray-800 flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Step 4 · Preview & Export</h1>
                <p className="text-sm text-gray-400">{program ? 'Generated preview from your selections.' : 'Enter Training Maxes (Step 1) to generate preview.'}</p>
            </header>
            {/* Screen-only interactive preview */}
            <div className="no-print flex-1 grid grid-cols-12 gap-6 px-8 py-6">
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Navigation is handled by BuilderProgress and footer buttons; extra inline nav removed for clarity */}
                    <div>
                        {/* View Toggle */}
                        <div className="flex items-center gap-2 mb-3" data-testid="preview-view-toggle">
                            <span className="text-xs text-gray-400">View:</span>
                            <button
                                type="button"
                                data-testid="preview-toggle-cards"
                                onClick={() => setViewMode('cards')}
                                aria-pressed={viewMode === 'cards'}
                                className={`px-2.5 py-1 rounded border text-xs ${viewMode === 'cards' ? 'border-red-500 bg-red-600/10 text-red-200' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-300'}`}
                            >Cards</button>
                            <button
                                type="button"
                                data-testid="preview-toggle-grid"
                                onClick={() => setViewMode('grid')}
                                aria-pressed={viewMode === 'grid'}
                                className={`px-2.5 py-1 rounded border text-xs ${viewMode === 'grid' ? 'border-red-500 bg-red-600/10 text-red-200' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-300'}`}
                            >Grid</button>
                            <div className="flex-1" />
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="px-2.5 py-1 rounded border text-xs border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-300"
                            >Print Week</button>
                        </div>
                        <div data-testid="week-tabs" className="flex flex-wrap gap-2 mb-4">
                            {weeksAvailable.map(w => (
                                <button
                                    key={w}
                                    data-testid={`week-tab-${w}`}
                                    onClick={() => setActiveWeek(w)}
                                    aria-current={activeWeek === w ? 'page' : undefined}
                                    className={`px-3 py-1.5 rounded border text-xs font-medium transition ${activeWeek === w ? 'border-red-500 bg-red-600/10 text-red-200' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-300'}`}
                                >Week {w}</button>
                            ))}
                        </div>
                        {step2?.schemeId === 'scheme_5spro' && (
                            <div className="mb-3 text-[11px] text-amber-300">
                                5s Pro selected: main sets are straight 5s with no AMRAP.
                            </div>
                        )}
                        {viewMode === 'cards' ? (
                            <div data-testid="week-content" className="grid gap-4">
                                {days.map(d => {
                                    const dayData = activeWeekData?.days.find(dd => dd.main?.dayIndex === d);
                                    const main = dayData?.main;
                                    return (
                                        <div key={d} data-testid={`day-card-${activeWeek}-${d}`} className="rounded-md border border-gray-800 bg-gray-800/50 p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm">Week {activeWeek} · Day {d}</span>
                                                <span className="text-[10px] uppercase tracking-wide text-gray-500">{main ? (() => {
                                                    const code = step1?.variants?.[main.lift as keyof typeof step1.variants] || main.lift;
                                                    const label = variantLabel(code) || main.lift;
                                                    return label;
                                                })() : 'Pending'}</span>
                                            </div>
                                            <ul className="text-xs space-y-1 text-gray-300 ml-1">
                                                {dayData?.warmup && (
                                                    <li><span className="text-gray-400">Warm-up:</span> {dayData.warmup.replace(/^Warm-up:\s*/i, '')}</li>
                                                )}
                                                {main && main.sets.length > 0 ? (
                                                    main.sets.map((s, idx) => (
                                                        <li key={idx}><span className="text-gray-400">Set {idx + 1}:</span> {s.reps} @ {s.pct}% {s.weight ? `(${formatWeight(s.weight, step1.units)})` : ''}{s.type === 'amrap' ? ' AMRAP' : ''}</li>
                                                    ))
                                                ) : (
                                                    <li><span className="text-gray-400">Primary:</span> {program ? 'TM missing for this lift' : 'Enter TMs in Step 1'}</li>
                                                )}
                                                <li><span className="text-gray-400">Supplemental:</span> {(() => {
                                                    const sup = dayData?.supplemental;
                                                    if (!sup) return '(n/a)';
                                                    const units = normalizeUnits(step1?.units);
                                                    return sup.replace(/\((\d+(?:\.[0-9]+)?)\)/g, (_, n) => `(${formatWeight(n, units)})`);
                                                })()}</li>
                                                <li><span className="text-gray-400">Assistance:</span> {dayData?.assistance || '(n/a)'}</li>
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div data-testid="grid-preview" className="rounded-md border border-gray-800 bg-gray-800/40 p-2">
                                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
                                    {days.map(d => {
                                        const dayData = activeWeekData?.days.find(dd => dd.main?.dayIndex === d);
                                        const main = dayData?.main;
                                        const liftLabel = main ? (() => {
                                            const code = step1?.variants?.[main.lift as keyof typeof step1.variants] || main.lift;
                                            return variantLabel(code) || main.lift;
                                        })() : 'Pending';
                                        return (
                                            <div key={d} data-testid={`grid-cell-${activeWeek}-${d}`} className="border border-gray-800 rounded-sm bg-gray-900/40 p-2">
                                                <div className="text-[11px] font-semibold mb-1">Day {d}</div>
                                                <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{liftLabel}</div>
                                                <ul className="text-[11px] text-gray-300 space-y-0.5">
                                                    {main && main.sets.length > 0 ? (
                                                        main.sets.map((s, idx) => (
                                                            <li key={idx}>Set {idx + 1}: {s.reps} @ {s.pct}%{s.type === 'amrap' ? ' (AMRAP)' : ''}</li>
                                                        ))
                                                    ) : (
                                                        <li>Primary: {program ? 'TM missing' : 'Add TMs in Step 1'}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button onClick={() => navigate('/build/step3')} data-testid="back-step3" className="px-4 py-2 rounded border border-gray-600 text-sm hover:bg-gray-800">Back</button>
                        <button onClick={() => navigate('/build/step5')} data-testid="next-step5" className="px-4 py-2 rounded border border-red-500 text-sm hover:bg-red-600/10">Next: Progression</button>
                        <button
                            onClick={handleExport}
                            data-testid="export-json"
                            disabled={!canExport || exporting}
                            className={`px-4 py-2 rounded border text-sm transition ${!canExport || exporting ? 'border-gray-700 text-gray-500 cursor-not-allowed' : 'border-emerald-500 text-emerald-200 hover:bg-emerald-600/10'}`}
                        >{exporting ? 'Exporting...' : 'Export Program'}</button>
                    </div>
                </section>
                <aside className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-sm">
                        <h3 className="font-semibold mb-2">Summary</h3>
                        <ul className="text-xs space-y-1 text-gray-300">
                            <li data-testid="summary-fundamentals"><span className="text-gray-400">Units:</span> {step1?.units || 'n/a'} · TM% {step1?.tmPct || 90}</li>
                            <li data-testid="summary-template"><span className="text-gray-400">Template:</span> {templateLabel(step2?.templateId)} · <span className="text-gray-400">Scheme:</span> {schemeLabel(step2?.schemeId)}{(() => { const a = schemeAmrap(step2?.schemeId); return a ? ` · AMRAP: ${a}` : ''; })()}</li>
                            <li data-testid="summary-schedule"><span className="text-gray-400">Schedule Days:</span> {scheduleFrequency}</li>
                            <li data-testid="summary-deload"><span className="text-gray-400">Deload:</span> {step3?.deload ? 'Yes' : 'No'}</li>
                            <li data-testid="summary-mainset-option"><span className="text-gray-400">Main Set Option:</span> {step3?.mainSetOption || 1}</li>
                            {(() => {
                                const baseMap: Record<string, string> = { press: 'overhead_press', bench: 'bench_press', squat: 'back_squat', deadlift: 'conventional_deadlift' };
                                const variants = step1?.variants || {} as Record<string, string>;
                                const custom = Object.entries(variants).filter(([k, v]) => baseMap[k] && baseMap[k] !== v);
                                if (!custom.length) return null;
                                const list = custom.map(([k, v]) => `${k}: ${variantLabel(v) || v.replace(/_/g, ' ')}`).join(', ');
                                return <li data-testid="summary-variants" title={list}><span className="text-gray-400">Variants:</span> <span className="text-amber-300">{custom.length} customized</span></li>;
                            })()}
                            {program && <li><span className="text-gray-400">Generated Weeks:</span> {program.weeks.length}</li>}
                            {lastSavedAt && <li><span className="text-gray-400">Last Export:</span> {new Date(lastSavedAt).toLocaleTimeString()}</li>}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Print-only snapshot for current week */}
            <div className="print-only p-8">
                <div data-testid="print-snapshot" className="max-w-5xl mx-auto">
                    <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '4px', color: '#000' }}>5/3/1 Program — Week {activeWeek}</h1>
                    <div style={{ fontSize: '12px', color: '#000', marginBottom: '12px' }}>
                        Units: {normalizeUnits(step1?.units)} • Main Set Option: {step3?.mainSetOption || 1} • Generated: {new Date().toLocaleDateString()}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, gap: '8px' }}>
                        {days.map(d => {
                            const dayData = activeWeekData?.days.find(dd => dd.main?.dayIndex === d);
                            const main = dayData?.main;
                            return (
                                <div key={`print-${d}`} style={{ border: '1px solid #000', padding: '8px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>Day {d}</div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {main && main.sets?.length ? (
                                            main.sets.map((s, idx) => (
                                                <li key={idx} style={{ fontSize: '12px', color: '#000' }}>
                                                    Set {idx + 1}: {s.reps} @ {s.pct}%{s.type === 'amrap' ? ' (AMRAP)' : ''}{s.weight ? ` — ${formatWeight(s.weight, step1?.units)}` : ''}
                                                </li>
                                            ))
                                        ) : (
                                            <li style={{ fontSize: '12px', color: '#000' }}>Primary: {program ? 'TM missing' : 'Add TMs in Step 1'}</li>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramPreview;
