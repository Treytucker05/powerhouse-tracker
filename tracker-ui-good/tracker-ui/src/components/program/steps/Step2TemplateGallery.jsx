// src/components/program/steps/Step2TemplateGallery.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Info, CheckCircle, AlertTriangle, Dumbbell, Layers, Activity } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { TEMPLATE_IDS } from '../../../lib/fiveThreeOne/assistanceRules.js';
import { useExerciseDB } from '../../../contexts/ExerciseDBContext.jsx';
import { loadCsv } from '@/lib/loadCsv';

const TILES = [
    { id: TEMPLATE_IDS.BBB, title: 'Boring But Big', blurb: 'Main 5/3/1 + 5×10 supplemental. Simple, high volume, great for muscle.', color: 'border-red-500' },
    { id: TEMPLATE_IDS.TRIUMVIRATE, title: 'Triumvirate', blurb: 'Exactly 3 lifts: main + 2 big accessories. Quality over quantity.', color: 'border-amber-500' },
    { id: TEMPLATE_IDS.PERIODIZATION_BIBLE, title: 'Periodization Bible', blurb: 'High volume bodybuilding-style categories for complete development.', color: 'border-blue-500' },
    { id: TEMPLATE_IDS.BODYWEIGHT, title: 'Bodyweight', blurb: 'All assistance is bodyweight. Minimum total reps per movement.', color: 'border-green-500' },
    { id: TEMPLATE_IDS.JACK_SHIT, title: '"I’m Not Doing Jack Shit"', blurb: 'Main 5/3/1 only. No assistance. Use sparingly.', color: 'border-gray-500' },
];

export default function Step2TemplateGallery({ data, updateData }) {
    const [templates, setTemplates] = useState([]);
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });
    const cfg = st.templateConfig || { bbbPair: 'same', bbbPercent: 60, bwTarget: 75 };
    const assistance = st.assistance || { options: { bbb: { percent: cfg.bbbPercent || 60, pairMode: cfg.bbbPair || 'same' } }, perDay: { press: [], deadlift: [], bench: [], squat: [] } };
    const { loaded: exLoaded, categoriesMap, exercises } = useExerciseDB();

    // Load templates CSV once
    useEffect(() => {
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/templates_master.csv`).then((rows) => {
            console.log("CSV Loaded:", rows);
            setTemplates(rows);
        });
    }, []);

    // Load additions (ids, assistance_targets, equipment) for persistence on selection
    const [tplAdditions, setTplAdditions] = useState([]);
    useEffect(() => {
        loadCsv(`${import.meta.env.BASE_URL}methodology/extraction/templates_additions.csv`).then(setTplAdditions).catch(() => setTplAdditions([]));
    }, []);

    // Helper to find row by name
    const byName = useMemo(() => {
        const map = {};
        exercises?.forEach(r => { map[r.exercise.toLowerCase()] = r; });
        return map;
    }, [exercises]);

    // Default seeding per template (only once when template selected & list empty)
    useEffect(() => {
        if (!st.template || !exLoaded) return;
        const perDay = { ...assistance.perDay };
        let changed = false;
        const ensure = (day, names) => {
            if (perDay[day] && perDay[day].length) return; // keep user edits
            const items = [];
            names.forEach(n => {
                const row = byName[n.toLowerCase()];
                if (row) {
                    const sets = Number(row.default_sets) || 5;
                    const reps = row.numeric_reps || (/amrap/i.test(row.default_reps) ? 10 : Number(row.default_reps) || 10);
                    const load = (/body|bw|bodyweight/i.test(row.equipment || '') || /AMRAP/i.test(row.default_reps)) ? { type: 'bw' } : undefined;
                    items.push({ name: row.exercise, sets, reps, load });
                }
            });
            if (items.length) { perDay[day] = items; changed = true; }
        };
        switch (st.template) {
            case TEMPLATE_IDS.TRIUMVIRATE:
                ensure('press', ['Dips', 'Chin-ups']);
                ensure('bench', ['DB Rows', 'Dips']);
                ensure('deadlift', ['Back Extension', 'Ab Wheel']);
                ensure('squat', ['Romanian Deadlift', 'Hanging Leg Raises']);
                break;
            case TEMPLATE_IDS.PERIODIZATION_BIBLE:
                // Dave Tate pattern: each day 3 categories; pick one starter exercise per category (user can swap later)
                ensure('press', ['DB Press', 'DB Rows', 'Dips']); // shoulders/chest, lats/upper back, triceps
                ensure('bench', ['DB Incline Press', 'Chin-ups', 'Close-Grip Bench']); // chest, lats/upper back, triceps
                ensure('deadlift', ['Romanian Deadlift', 'Leg Press', 'Hanging Leg Raises']); // hamstrings, quads, abs
                ensure('squat', ['Back Extension', 'Leg Press', 'Ab Wheel']); // hamstrings/low back, quads, abs
                break;
            case TEMPLATE_IDS.BODYWEIGHT:
                ensure('press', ['Push-Ups', 'Chin-ups', 'Dips']);
                ensure('bench', ['Push-Ups', 'Chin-ups', 'Dips']);
                ensure('deadlift', ['Chin-ups', 'Hanging Leg Raises']);
                ensure('squat', ['Push-Ups', 'Hanging Leg Raises', 'Sit-Ups']);
                break;
            case TEMPLATE_IDS.BBB:
            case TEMPLATE_IDS.JACK_SHIT:
            default:
                break;
        }
        if (changed) {
            set({ assistance: { ...assistance, perDay } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [st.template, exLoaded]);

    // Movement pattern balance validation (simple heuristic)
    const validation = useMemo(() => {
        if (!exLoaded) return { warnings: [] };
        const counts = { Pull: 0, Push: 0, Core: 0, Posterior: 0, 'Single-Leg': 0 };
        Object.values(assistance.perDay).forEach(list => list.forEach(it => {
            const row = byName[it.name.toLowerCase()];
            if (row) {
                counts[row.category_normalized] = (counts[row.category_normalized] || 0) + 1;
            }
        }));
        const warnings = [];
        if (counts.Pull < counts.Push) warnings.push('Pull work is lower than Push — consider adding a pull movement.');
        if (counts.Core < 2) warnings.push('Low core volume — add a core exercise.');
        if (counts.Posterior < 2 && (st.template === TEMPLATE_IDS.TRIUMVIRATE || st.template === TEMPLATE_IDS.PERIODIZATION_BIBLE)) warnings.push('Posterior chain underrepresented.');
        return { counts, warnings };
    }, [assistance.perDay, byName, exLoaded, st.template]);

    const choose = (id) => {
        // Persist template id
        set({ template: id });
        // Try to persist assistance targets + equipment if available
        const normId = String(id || '').toLowerCase();
        const idMap = { bbb: 'bbb', triumvirate: 'triumvirate', periodization_bible: 'periodization_bible', bodyweight: 'bodyweight', jack_shit: 'jack_shit' };
        const mapped = idMap[normId] || normId;
        let row = tplAdditions.find(r => String(r.id || '').toLowerCase() === mapped);
        if (!row) {
            // Fallback by display name contains
            const title = (TILES.find(t => t.id === id)?.title || '').toLowerCase();
            row = tplAdditions.find(r => String(r.display_name || '').toLowerCase().includes(title));
        }
        const split = (v) => String(v || '').split(/[|,;/]/g).map(s => s.trim().toLowerCase()).filter(Boolean);
        if (row) {
            const targets = split(row.assistance_targets);
            const equipment = split(row.equipment);
            updateData && updateData({ assistanceTargets: targets.length ? targets : ["push","pull","single_leg","core"], equipment });
        } else {
            // Persist sensible defaults if no additions row available
            updateData && updateData({ assistanceTargets: ["push","pull","single_leg","core"], equipment: [] });
        }
    };

    return (
        <div className="space-y-6">
            {templates.length > 0 && (
                <div className="mb-6 p-4 bg-neutral-900 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-2">Loaded Templates (CSV)</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        {templates.map((t, i) => (
                            <li key={i}>
                                {t["Template Name"]} — {t["Supplemental"]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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

            {/* Assistance configurator (pre-wizard) */}
            {st.template && st.template !== TEMPLATE_IDS.JACK_SHIT && (
                <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-white font-medium">Assistance Preview & Edits</div>
                        {!exLoaded && <div className="text-xs text-gray-400">Loading exercise database…</div>}
                    </div>
                    <p className="text-xs text-gray-400">These selections seed Step 5. You can refine later. Categories & defaults sourced from research database.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['press', 'bench', 'deadlift', 'squat'].map(day => {
                            const items = assistance.perDay[day] || [];
                            const canAdd = (() => {
                                switch (st.template) {
                                    case TEMPLATE_IDS.TRIUMVIRATE: return items.length < 2;
                                    case TEMPLATE_IDS.PERIODIZATION_BIBLE: return items.length < 3;
                                    case TEMPLATE_IDS.BODYWEIGHT: return items.length < 4;
                                    default: return false;
                                }
                            })();
                            return (
                                <div key={day} className="border border-gray-700 rounded p-3 bg-gray-800/40">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-200 font-medium capitalize">{day} Day</div>
                                        <div className="text-xs text-gray-500">{items.length} items</div>
                                    </div>
                                    <ul className="space-y-2 mb-2">
                                        {items.map((it, idx) => (
                                            <li key={idx} className="bg-gray-800/60 border border-gray-700 rounded p-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-100">{it.name}</span>
                                                    <span className="text-gray-400">{it.sets}×{it.reps}{it.load?.type === 'bw' && ' @BW'}</span>
                                                </div>
                                                <div className="mt-2 flex gap-2">
                                                    <select
                                                        className="flex-1 bg-gray-900 border border-gray-600 text-gray-200 rounded px-2 py-1"
                                                        value={it.name}
                                                        onChange={e => {
                                                            const row = byName[e.target.value.toLowerCase()];
                                                            if (!row) return;
                                                            const sets = Number(row.default_sets) || it.sets;
                                                            const reps = row.numeric_reps || (/amrap/i.test(row.default_reps) ? 10 : Number(row.default_reps) || it.reps);
                                                            const load = (/body|bw|bodyweight/i.test(row.equipment || '') || /AMRAP/i.test(row.default_reps)) ? { type: 'bw' } : undefined;
                                                            const next = { ...assistance };
                                                            next.perDay[day][idx] = { ...it, name: row.exercise, sets, reps, load };
                                                            set({ assistance: next });
                                                        }}
                                                    >
                                                        {Object.keys(categoriesMap).sort().map(cat => (
                                                            <optgroup key={cat} label={cat}>
                                                                {categoriesMap[cat].map(r => {
                                                                    const equip = r.equipment ? ` (${r.equipment.split(';')[0]})` : '';
                                                                    return <option key={r.exercise} value={r.exercise}>{r.exercise}{equip}</option>;
                                                                })}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            const next = { ...assistance };
                                                            next.perDay[day] = next.perDay[day].filter((_, i) => i !== idx);
                                                            set({ assistance: next });
                                                        }}
                                                        className="px-2 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-700/40"
                                                    >✕</button>
                                                </div>
                                            </li>
                                        ))}
                                        {!items.length && <li className="text-xs text-gray-500">No assistance yet.</li>}
                                    </ul>
                                    {canAdd && exLoaded && (
                                        <select
                                            className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded px-2 py-1 text-sm mb-2"
                                            value=""
                                            onChange={e => {
                                                const v = e.target.value; if (!v) return;
                                                const row = byName[v.toLowerCase()]; if (!row) return;
                                                const sets = Number(row.default_sets) || 5;
                                                const reps = row.numeric_reps || (/amrap/i.test(row.default_reps) ? 10 : Number(row.default_reps) || 10);
                                                const load = (/body|bw|bodyweight/i.test(row.equipment || '') || /AMRAP/i.test(row.default_reps)) ? { type: 'bw' } : undefined;
                                                const next = { ...assistance };
                                                next.perDay[day] = [...(next.perDay[day] || []), { name: row.exercise, sets, reps, load }];
                                                set({ assistance: next });
                                            }}
                                        >
                                            <option value="">+ Add Exercise</option>
                                            {Object.keys(categoriesMap).sort().map(cat => (
                                                <optgroup key={cat} label={cat}>
                                                    {categoriesMap[cat].map(r => {
                                                        const equip = r.equipment ? ` (${r.equipment.split(';')[0]})` : '';
                                                        return <option key={r.exercise} value={r.exercise}>{r.exercise}{equip}</option>;
                                                    })}
                                                </optgroup>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {!!validation.warnings.length && (
                        <div className="bg-yellow-900/20 border border-yellow-600 rounded p-3 text-yellow-200 text-xs space-y-1">
                            {validation.warnings.map((w, i) => <div key={i} className="flex gap-2"><AlertTriangle className="w-4 h-4" /> <span>{w}</span></div>)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
