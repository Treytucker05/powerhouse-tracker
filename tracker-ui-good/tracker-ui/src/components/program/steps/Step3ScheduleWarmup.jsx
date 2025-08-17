/**
 * Step3ScheduleWarmup.jsx - Complete Step 3 implementation with all sections A-F
 * 
 * This is the CONSOLIDATED version that includes:
 * - Section A: Schedule (frequency selection, lift order)
 * - Section B: Warm-up Scheme (standard/minimal options)
 * - Section C: Programming Approach (4 cards: Basic 4-Week, Leader/Anchor, Competition Prep, Specialized)
 * - Section D: Supplemental (FSL, SSL, BBB, 5s PRO, None options)
 * - Section E: Assistance (4 cards: Minimal, Standard, Custom, Template-Based)
 * - Section F: Equipment (profile cards: Full Gym, Home Gym, Minimal, Bodyweight)
 * 
 * This replaces both the older Step3WarmUp.jsx component and the Step3DesignCustom.jsx component
 * from the v2 implementation path.
 */
import React, { useState, useMemo } from 'react';
import { Info, Plus, Trash2, RotateCcw, CheckCircle, Filter, Layers, Settings as Cog, AlertTriangle } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { buildDaysByFrequency, resetToCanonical, liftOptions } from '../../../lib/fiveThreeOne/schedule.js';
import { useExerciseDB } from '../../../contexts/ExerciseDBContext.jsx';

export default function Step3ScheduleWarmup({ data, updateData }) {
    alert('STEP3SCHEDULEWARMUP IS LOADING!');
    console.log('STEP3SCHEDULEWARMUP IS RENDERING - This should show Sections C and E', { data });
    const st = data || {};
    const schedule = st.schedule || {};
    const warm = st.warmup || {};
    const supplemental = st.supplemental || {};
    const assistanceConfig = st.assistanceConfig || { mode: 'minimal' };
    const programmingApproach = st.programmingApproach || 'basic';
    const leaderAnchorPattern = st.leaderAnchorPattern || '2+1';
    const equipmentMap = st.equipmentMap || {
        barbell: false, plates: false, squat_rack: false, bench: false,
        dumbbells: false, cable_machine: false, machines: false, pullup_bar: false,
        kettlebells: false, resistance_bands: false, suspension_trainer: false, landmine: false,
        dip_station: false, rings: false, ab_wheel: false, plyo_box: false
    };
    const equipmentProfile = st.equipmentProfile || '';

    const set = (patch) => updateData({ ...st, ...patch });

    // Equipment profile defs
    const PROFILE_DEFS = {
        full: Object.keys(equipmentMap),
        home: ['barbell', 'plates', 'bench', 'dumbbells', 'pullup_bar'],
        minimal: ['barbell', 'plates', 'bench'],
        bodyweight: []
    };

    const applyEquipmentProfile = (profile) => {
        const allKeys = Object.keys(equipmentMap);
        let next = allKeys.reduce((acc, k) => ({ ...acc, [k]: false }), {});
        if (profile === 'full') {
            next = allKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {});
        } else if (PROFILE_DEFS[profile]) {
            PROFILE_DEFS[profile].forEach(k => { if (next[k] !== undefined) next[k] = true; });
        }
        set({ equipmentMap: next, equipmentProfile: profile });
    };

    const toggleEquip = (key) => {
        const next = { ...equipmentMap, [key]: !equipmentMap[key] };
        set({ equipmentMap: next });
    };

    const isProfileMatch = (id) => {
        if (!id || !PROFILE_DEFS[id]) return false;
        const wanted = new Set(PROFILE_DEFS[id]);
        // full means every key true
        return Object.entries(equipmentMap).every(([k, v]) => (wanted.has(k) ? v === true : v === false));
    };
    const activeProfileIsPure = isProfileMatch(equipmentProfile);
    const activeProfileDisplay = activeProfileIsPure ? equipmentProfile : (equipmentProfile ? `Custom (modified from ${equipmentProfile})` : 'Custom');

    const EQUIP_CATEGORIES = [
        {
            id: 'essential', label: 'Essential Equipment', note: 'Core barbell requirements', items: [
                ['barbell', 'Barbell'], ['plates', 'Plates'], ['squat_rack', 'Squat Rack'], ['bench', 'Bench']
            ]
        },
        {
            id: 'assistance', label: 'Assistance Equipment', note: 'Expands accessory selection', items: [
                ['dumbbells', 'Dumbbells'], ['cable_machine', 'Cable Machine'], ['machines', 'Machines'], ['pullup_bar', 'Pull-Up Bar']
            ]
        },
        {
            id: 'specialty', label: 'Specialty Equipment', note: 'Variation / overload tools', items: [
                ['kettlebells', 'Kettlebells'], ['resistance_bands', 'Resistance Bands'], ['suspension_trainer', 'Suspension Trainer'], ['landmine', 'Landmine']
            ]
        },
        {
            id: 'bodyweight', label: 'Bodyweight Accessories', note: 'Calisthenics & core tools', items: [
                ['dip_station', 'Dip Station'], ['rings', 'Rings'], ['ab_wheel', 'Ab Wheel'], ['plyo_box', 'Plyo Box']
            ]
        }
    ];

    // Impact scoring (simple heuristic – illustrative)
    const CATEGORY_BASE = { pull: 4, push: 6, core: 6, single: 4, posterior: 3 }; // bodyweight baseline
    const EQUIP_IMPACT = {
        barbell: { push: 4, posterior: 4, single: 1 },
        plates: { push: 1, posterior: 2, single: 1 },
        squat_rack: { push: 1, single: 2 },
        bench: { push: 6 },
        dumbbells: { pull: 6, push: 5, single: 4 },
        cable_machine: { pull: 5, push: 4, core: 3 },
        machines: { push: 5, pull: 4, posterior: 3 },
        pullup_bar: { pull: 8 },
        kettlebells: { posterior: 3, core: 2, single: 2 },
        resistance_bands: { pull: 3, push: 2, core: 2 },
        suspension_trainer: { core: 4, pull: 3, push: 2 },
        landmine: { posterior: 2, single: 2, push: 2 },
        dip_station: { push: 4 },
        rings: { pull: 5, push: 3, core: 2 },
        ab_wheel: { core: 4 },
        plyo_box: { single: 3, posterior: 1 }
    };
    const computeCategoryCounts = () => {
        const tally = { ...CATEGORY_BASE };
        Object.entries(equipmentMap).forEach(([k, v]) => { if (v && EQUIP_IMPACT[k]) { Object.entries(EQUIP_IMPACT[k]).forEach(([cat, inc]) => { tally[cat] += inc; }); } });
        return tally;
    };
    const catCounts = computeCategoryCounts();
    const impactSummary = `With current selection: ${catCounts.pull} pull exercises, ${catCounts.push} push exercises, ${catCounts.core} core exercises (${catCounts.single} single‑leg, ${catCounts.posterior} posterior variants also unlocked)`;

    const { loaded: exLoaded, categoriesMap } = useExerciseDB?.() || { loaded: false, categoriesMap: {} };
    const [stdCategoryFilter, setStdCategoryFilter] = useState([]); // selected category filters for Standard / Custom preview
    const toggleStdCategory = (cat) => setStdCategoryFilter(arr => arr.includes(cat) ? arr.filter(c => c !== cat) : [...arr, cat]);

    // Sample assistance exercise pools (lightweight preview only)
    const SAMPLE_LIBRARY = {
        push: ['Dips', 'Push Ups', 'DB Incline Press', 'Overhead DB Press'],
        pull: ['Chin Ups', 'Lat Pulldown', 'DB Row', 'Face Pulls'],
        core: ['Hanging Leg Raise', 'Ab Wheel', 'Plank'],
        single: ['Bulgarian Split Squat', 'Walking Lunge', 'Single-Leg RDL']
    };

    const MOVEMENT_BADGE_COLORS = {
        push: 'bg-rose-800/40 border-rose-600 text-rose-200',
        pull: 'bg-sky-800/40 border-sky-600 text-sky-200',
        core: 'bg-emerald-800/40 border-emerald-600 text-emerald-200',
        single: 'bg-amber-800/40 border-amber-600 text-amber-200',
        posterior: 'bg-indigo-800/40 border-indigo-600 text-indigo-200'
    };

    const allPreviewItems = useMemo(() => {
        // Build a flattened preview list with pattern → exercises
        const mode = assistanceConfig.mode;
        const structure = [];
        if (mode === 'minimal') {
            structure.push(
                { day: 'Press Day', items: [{ name: 'Chin Ups', cats: ['pull'], target: '3–5 × AMRAP (stop shy of failure)', why: 'Vertical pull balances pressing volume.' }, { name: 'Hanging Leg Raise', cats: ['core'], target: '3 × 10–15', why: 'Anterior core / trunk control.' }] },
                { day: 'Deadlift Day', items: [{ name: 'Back Extension', cats: ['core', 'posterior'], target: '3 × 12–15', why: 'Posterior chain endurance & trunk stability.' }, { name: 'DB Row', cats: ['pull'], target: '3 × 10', why: 'Upper back thickness for deadlift lockout.' }] },
                { day: 'Bench Day', items: [{ name: 'Dips', cats: ['push'], target: '2–3 × 8–12', why: 'Triceps / chest assistance with moderate volume.' }, { name: 'Face Pulls', cats: ['pull'], target: '2–3 × 12–15', why: 'Rear delts & scapular balance.' }] },
                { day: 'Squat Day', items: [{ name: 'Walking Lunge', cats: ['single'], target: '2 × 20 steps', why: 'Single‑leg stability & unilateral strength.' }, { name: 'Plank', cats: ['core'], target: '3 × 45–60s', why: 'Bracing endurance for heavy squats.' }] }
            );
        } else if (mode === 'standard') {
            // Balanced categories 25–50 reps each
            structure.push(
                { day: 'Press Day', items: [{ name: 'Chin Ups', cats: ['pull'], target: '25–35 reps total', why: 'Lats for pressing stability.' }, { name: 'DB Incline Press', cats: ['push'], target: '3 × 8–10', why: 'Upper chest development.' }, { name: 'Ab Wheel', cats: ['core'], target: '3 × 8–12', why: 'Anti‑extension core strength.' }] },
                { day: 'Deadlift Day', items: [{ name: 'Single-Leg RDL', cats: ['single', 'posterior'], target: '3 × 8', why: 'Unilateral posterior chain balance.' }, { name: 'Lat Pulldown', cats: ['pull'], target: '3 × 10–12', why: 'Lat strength for bar path control.' }, { name: 'Hanging Leg Raise', cats: ['core'], target: '3 × 10–12', why: 'Lower ab / hip flexor strength.' }] },
                { day: 'Bench Day', items: [{ name: 'DB Row', cats: ['pull'], target: '4 × 8–10', why: 'Horizontal pull to balance bench volume.' }, { name: 'Dips', cats: ['push'], target: '3 × 8–10', why: 'Triceps lockout strength.' }, { name: 'Face Pulls', cats: ['pull'], target: '3 × 12–15', why: 'Shoulder health / posture.' }] },
                { day: 'Squat Day', items: [{ name: 'Bulgarian Split Squat', cats: ['single'], target: '3 × 8', why: 'Unilateral leg strength / balance.' }, { name: 'Back Extension', cats: ['posterior', 'core'], target: '3 × 12–15', why: 'Posterior chain endurance.' }, { name: 'Plank', cats: ['core'], target: '3 × 45–60s', why: 'Isometric bracing.' }] }
            );
        } else if (mode === 'template') {
            structure.push(
                { day: 'Press Day', items: [{ name: 'BBB Press (5×10 @ 50–60%)', cats: ['push'], target: 'High volume', why: 'Hypertrophy / pattern practice.' }, { name: 'Chin Ups', cats: ['pull'], target: '25–50 reps', why: 'Upper back & elbow health.' }] },
                { day: 'Deadlift Day', items: [{ name: 'BBB Deadlift (5×10 @ 50–60%)', cats: ['posterior'], target: 'High hinge volume', why: 'Posterior chain hypertrophy.' }, { name: 'Hanging Leg Raise', cats: ['core'], target: '25–35 reps', why: 'Core strength for heavy pulls.' }] },
                { day: 'Bench Day', items: [{ name: 'BBB Bench (5×10 @ 50–60%)', cats: ['push'], target: 'High volume', why: 'Pressing muscle & endurance.' }, { name: 'DB Row', cats: ['pull'], target: '25–40 reps', why: 'Horizontal balance & scapular control.' }] },
                { day: 'Squat Day', items: [{ name: 'BBB Squat (5×10 @ 50–60%)', cats: ['single', 'posterior'], target: 'Volume', why: 'Leg / trunk work capacity.' }, { name: 'Back Extension', cats: ['posterior', 'core'], target: '25–40 reps', why: 'Posterior chain durability.' }] }
            );
        } else if (mode === 'custom') {
            // Placeholder: user will define later
            structure.push(
                { day: 'All Days', items: [{ name: 'You will fully customize assistance in the Assistance step (or future builder here).', cats: [], target: '', why: '' }] }
            );
        }
        return structure;
    }, [assistanceConfig.mode]);

    const filteredPreview = useMemo(() => {
        if (!stdCategoryFilter.length) return allPreviewItems;
        return allPreviewItems.map(day => ({ ...day, items: day.items.filter(it => it.cats.some(c => stdCategoryFilter.includes(c))) }))
            .filter(day => day.items.length);
    }, [allPreviewItems, stdCategoryFilter]);

    // Frequency handlers
    const setFrequency = (freq) => {
        const days = buildDaysByFrequency(freq);
        set({ schedule: { ...schedule, frequency: freq, days } });
    };

    const updateDayLift = (dayIndex, value) => {
        const days = [...(schedule.days || [])];
        days[dayIndex] = { ...days[dayIndex], lift: value };
        set({ schedule: { ...schedule, days } });
    };

    const removeDay = (dayIndex) => {
        const days = [...(schedule.days || [])];
        days.splice(dayIndex, 1);
        set({ schedule: { ...schedule, days } });
    };

    const addDay = () => {
        const nextId = `D${(schedule.days?.length || 0) + 1}`;
        set({ schedule: { ...schedule, days: [...(schedule.days || []), { id: nextId, lift: 'press' }] } });
    };
    const resetOrder = () => {
        set({ schedule: { ...schedule, days: resetToCanonical() } });
    };

    const setWarmPolicy = (policy) => {
        set({ warmup: { ...warm, policy } });
    };

    const updateCustomRow = (idx, field, value) => {
        const rows = [...(warm.custom || [])];
        rows[idx] = { ...rows[idx], [field]: field === 'pct' || field === 'reps' ? Number(value) : value };
        set({ warmup: { ...warm, custom: rows } });
    };

    const addCustomRow = () => {
        const rows = [...(warm.custom || [])];
        rows.push({ pct: 50, reps: 5 });
        set({ warmup: { ...warm, custom: rows } });
    };

    const removeCustomRow = (idx) => {
        const rows = [...(warm.custom || [])];
        rows.splice(idx, 1);
        set({ warmup: { ...warm, custom: rows } });
    };

    const setDeadliftStyle = (style) => {
        set({ warmup: { ...warm, deadliftRepStyle: style } });
    };

    const setSupplemental = (patch) => {
        set({ supplemental: { ...supplemental, ...patch } });
    };

    const setProgrammingApproach = (approach) => {
        set({ programmingApproach: approach });
    };
    const setLeaderAnchorPattern = (pattern) => {
        set({ leaderAnchorPattern: pattern });
    };
    const setAssistanceConfig = (patch) => {
        set({ assistanceConfig: { ...assistanceConfig, ...patch } });
    };

    const SUPP_OPTIONS = [
        {
            id: 'none',
            title: 'None',
            subtitle: 'Main 5/3/1 only',
            desc: 'Minimal time; focus on quality PR sets and basic assistance only.',
            when: 'Use when recovery/time limited or during deload-like life weeks.'
        },
        {
            id: 'fsl',
            title: 'First Set Last (FSL)',
            subtitle: '3×5 or 5×5 @ First Set %',
            desc: 'Down sets performed with the first work-set percentage each week (65 / 70 / 75%).',
            when: 'Lower supplemental volume; excellent for leader cycles and skill practice.'
        },
        {
            id: 'ssl',
            title: 'Second Set Last (SSL)',
            subtitle: '3×5 or 5×5 @ Second Set %',
            desc: 'Down sets at the second work-set percentage (75 / 80 / 85%).',
            when: 'Moderate balanced volume; good anchor cycle choice.'
        },
        {
            id: 'bbb',
            title: 'Boring But Big (BBB)',
            subtitle: '5×10 @ 50–70% TM',
            desc: 'High-volume straight sets building muscle & work capacity.',
            when: 'Hypertrophy focus; ensure nutrition & recovery are dialed in.'
        },
        {
            id: '5spro',
            title: '5s PRO',
            subtitle: '5×5 main work (no rep-outs)',
            desc: 'All main sets are sets of 5; AMRAP removed for submaximal, repeatable training.',
            when: 'Great for building base strength while controlling fatigue.'
        }
    ];

    const WEEK_INFO = [
        { week: 1, fsl: 65, ssl: 75 },
        { week: 2, fsl: 70, ssl: 80 },
        { week: 3, fsl: 75, ssl: 85 }
    ];

    // Debug component to help diagnose missing sections
    const RenderDebug = () => (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded mb-4">
            <h4 className="text-red-300 font-bold">Debug Info</h4>
            <div className="text-xs text-red-200 space-y-1">
                <div>Component: Step3ScheduleWarmup</div>
                <div>Data: {JSON.stringify({
                    hasWarmup: !!warm,
                    hasSupplemental: !!supplemental,
                    hasProgrammingApproach: !!programmingApproach,
                    hasAssistance: !!assistanceConfig,
                    dataKeys: Object.keys(st)
                })}</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <RenderDebug />
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 3: Training Schedule & Warm‑Up</h3>
                    <p className="text-gray-400 text-sm">Choose your training frequency and recommended lift order, then set warm‑ups and supplemental work.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.SCHEDULE_WARMUP} data={st} />
            </div>
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Scheduling Guidance</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li><b>Standard 4‑day order</b>: Press → Deadlift → Bench → Squat (Wendler recommendation for recovery spacing).</li>
                            <li>3‑day (rotating) cycles roll the 4th lift to the next week; maintain sequence.</li>
                            <li>2‑day option alternates Upper / Lower across weeks — minimal time approach.</li>
                            <li>Default warm‑up: <b>40/50/60% of TM for 5/5/3 reps</b> before the main sets.</li>
                            <li>Deadlift style: choose <b>Touch‑and‑Go</b> or <b>Dead‑Stop</b>.</li>
                            <li><b>Recovery:</b> Insert at least one rest day after any 2 consecutive training days.</li>
                            <li>Limit lifting frequency to <b>3–4 days/week</b>; more is rarely needed on 5/3/1.</li>
                            <li>Plan conditioning (hill sprints / Prowler) on separate days or after upper‑body sessions.</li>
                            <li><b>Why order matters:</b> Spacing squat & deadlift and alternating press/bench preserves bar speed & CNS freshness.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Frequency */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Weekly Frequency</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: '4day', title: '4 Days / Week', blurb: 'Each main lift gets its own day (recommended)' },
                        { id: '3day', title: '3 Days / Week', blurb: 'Rotating pattern; 4th lift rolls to next week' },
                        { id: '2day', title: '2 Days / Week', blurb: 'Upper / Lower alternating — minimal time' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFrequency(opt.id)}
                            className={`text-left px-3 py-2 rounded border h-full bg-gray-800/40 hover:bg-gray-800 transition ${schedule.frequency === opt.id ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600'}`}
                        >
                            <div className="text-sm font-semibold text-white">{opt.title}</div>
                            <div className="text-xs text-gray-400 mt-1 leading-snug">{opt.blurb}</div>
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <button onClick={resetOrder} className="inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-700/40 text-gray-100" title="Reset to recommended sequence">
                        <RotateCcw className="w-4 h-4" /> Reset to Standard
                    </button>
                    <button
                        onClick={addDay}
                        disabled={(schedule.days || []).length >= 4}
                        className={`inline-flex items-center gap-2 px-3 py-1 border rounded ${(schedule.days || []).length >= 4 ? 'border-gray-700 text-gray-500 cursor-not-allowed' : 'border-gray-500 hover:bg-gray-700/40 text-gray-100'}`}
                        title={(schedule.days || []).length >= 4 ? 'Max 4 training days per week for this template' : 'Add Day'}
                    >
                        <Plus className="w-4 h-4" /> Add Day
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(schedule.days || []).map((d, idx) => (
                        <div key={d.id} className="bg-gray-800/50 border border-gray-700 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-gray-200 font-medium">Day {idx + 1}</div>
                                <button onClick={() => removeDay(idx)} className="text-gray-400 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <label className="text-sm text-gray-300 mb-1 block">Main Lift</label>
                            <select
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                value={d.lift || 'press'}
                                onChange={(e) => updateDayLift(idx, e.target.value)}
                            >
                                {liftOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                {schedule.frequency === '3day' && (
                    <p className="mt-3 text-[11px] text-gray-500">Rotating pattern: the lift not shown this week appears first next week; maintain sequence.</p>
                )}
                {schedule.frequency === '2day' && (
                    <p className="mt-3 text-[11px] text-gray-500">Upper / Lower alternation: remaining lifts roll into subsequent weeks to keep progress moving.</p>
                )}
                {/* Scheduling warnings */}
                {((schedule.days || []).length > 2) && (
                    <div className="mt-3 text-xs text-yellow-300 bg-yellow-900/20 border border-yellow-600 rounded p-2">
                        Avoid training more than 2 days in a row — schedule a rest day between blocks of two sessions.
                    </div>
                )}
                {((schedule.days || []).length > 4) && (
                    <div className="mt-2 text-xs text-red-300 bg-red-900/20 border border-red-700 rounded p-2">
                        Reduce days: 5/3/1 base programming works best at 3–4 days/week.
                    </div>
                )}
            </div>

            {/* Warm-up policy */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Warm‑Up Policy</div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {[
                        { id: 'standard', label: 'Standard (40/50/60 × 5/5/3)' },
                        { id: 'minimal', label: 'Minimal (50/60 × 5/3)' },
                        { id: 'custom', label: 'Custom' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setWarmPolicy(opt.id)}
                            className={`px-3 py-1 rounded border ${warm.policy === opt.id ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700/40'} text-white`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {warm.policy === 'custom' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded p-3">
                        <div className="text-gray-200 font-medium mb-2">Custom Warm‑Up Rows</div>
                        <div className="space-y-2">
                            {(warm.custom || []).map((row, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                    <div>
                                        <label className="text-sm text-gray-300">Percent of TM</label>
                                        <input
                                            type="number" min="20" max="90" step="5"
                                            value={row.pct ?? 40}
                                            onChange={(e) => updateCustomRow(i, 'pct', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300">Reps</label>
                                        <input
                                            type="number" min="1" max="10" step="1"
                                            value={row.reps ?? 5}
                                            onChange={(e) => updateCustomRow(i, 'reps', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                        />
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <button onClick={() => removeCustomRow(i)} className="text-gray-400 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addCustomRow} className="mt-2 inline-flex items-center gap-2 px-3 py-1 border border-gray-600 rounded hover:bg-gray-700/40 text-gray-100">
                                <Plus className="w-4 h-4" /> Add Row
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Deadlift rep style (belongs to Warm‑ups Section B) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Deadlift Rep Style</div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'touch', label: 'Touch‑and‑Go' },
                        { id: 'deadstop', label: 'Dead‑Stop (reset each rep)' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setDeadliftStyle(opt.id)}
                            className={`px-3 py-1 rounded border ${warm.deadliftRepStyle === opt.id ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700/40'} text-white`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <p className="text-gray-400 text-xs mt-2">Pick whichever lets you keep tightness and best technique. This will display as a cue on Deadlift days.</p>
            </div>

            {/* Programming Approach (Section C) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                <div>
                    <div className="text-white font-medium mb-1">C) Programming Approach</div>
                    <p className="text-gray-400 text-xs">Choose your periodization strategy and training philosophy.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[{
                        id: 'basic',
                        title: 'Traditional 5/3/1 Progression',
                        label: 'BASIC 4‑WEEK CYCLES',
                        desc: 'Standard 4‑week blocks with linear progression and deload weeks',
                        best: 'Beginners to intermediate lifters seeking steady strength gains',
                        features: ['AMRAP sets', 'Simple progression', 'Proven results']
                    }, {
                        id: 'leaderAnchor',
                        title: 'Advanced Periodization',
                        label: 'LEADER / ANCHOR CYCLES',
                        desc: 'Alternating high‑volume and high‑intensity blocks (2+1 or 3+1 patterns)',
                        best: 'Intermediate to advanced lifters wanting sophisticated programming',
                        features: ['FSL leaders', 'PR anchor sets', '7th Week Protocol', 'Optimized recovery']
                    }, {
                        id: 'competition',
                        title: 'Meet Preparation',
                        label: 'COMPETITION PREP MODE',
                        desc: 'Structured timeline working backwards from competition date',
                        best: 'Powerlifters preparing for meets or testing true maxes',
                        features: ['Peak timing', 'Attempt selection', 'Competition warm‑ups', 'Coming Soon'],
                        comingSoon: true
                    }, {
                        id: 'specialized',
                        title: 'Situation‑Specific Programming',
                        label: 'SPECIALIZED MODES',
                        desc: 'Modified approaches for specific needs or limitations',
                        best: 'Home gym / time / recovery / demographic constraints',
                        features: ['Home Gym', 'Time‑Constrained', 'Injury Recovery', 'Age 50+', 'Coming Soon'],
                        comingSoon: true
                    }].map(card => {
                        const active = programmingApproach === card.id;
                        const disabled = card.comingSoon;
                        return (
                            <div key={card.id} className={`relative ${disabled ? 'opacity-60' : ''}`}>
                                <button
                                    onClick={() => !disabled && setProgrammingApproach(card.id)}
                                    className={`w-full text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'} ${disabled ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-[11px] tracking-wide font-semibold text-red-300">{card.label}</div>
                                            <div className="text-sm font-semibold text-white leading-tight mt-0.5">{card.title}</div>
                                        </div>
                                        {active && !disabled && <CheckCircle className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-xs text-gray-300 mt-2 leading-snug">{card.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400"><span className="font-medium text-gray-300">Best for:</span> {card.best}</div>
                                    <ul className="mt-2 text-[10px] text-gray-400 list-disc ml-4 space-y-0.5">
                                        {card.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                    {disabled && <div className="absolute top-2 right-2 text-[10px] bg-gray-700/70 px-2 py-0.5 rounded text-gray-200">Coming Soon</div>}
                                </button>
                            </div>
                        );
                    })}
                </div>
                {programmingApproach === 'basic' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 text-[11px] text-gray-400">
                        Uses classic 4‑week waves (5/3/1 + deload). Perform AMRAP on final work sets Weeks 1–3. Increase Training Max only after successful cycles with solid rep PRs.
                    </div>
                )}
                {programmingApproach === 'leaderAnchor' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <div className="text-white font-medium">Leader / Anchor Pattern</div>
                                <p className="text-xs text-gray-400">Select phasing. Leaders emphasize submaximal volume (often <b>5s PRO + FSL</b>). Anchor reintroduces PR sets & intensity. A <b>7th Week Protocol</b> (TM audit / deload) can be inserted between phases.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[{ id: '2+1', label: '2+1 Pattern', desc: '2 Leader cycles + 1 Anchor cycle (strength focus)' }, { id: '3+1', label: '3+1 Pattern', desc: '3 Leader cycles + 1 Anchor cycle (hypertrophy focus)' }].map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setLeaderAnchorPattern(p.id)}
                                        className={`px-3 py-1 rounded border text-xs md:text-sm ${leaderAnchorPattern === p.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                                        title={p.desc}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[11px] text-gray-400">
                                {leaderAnchorPattern === '2+1' && '2+1 selected: Emphasizes strength & neural efficiency with faster PR exposure.'}
                                {leaderAnchorPattern === '3+1' && '3+1 selected: Extends accumulation for added hypertrophy & work capacity before PR phase.'}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                            <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                                <div className="font-semibold text-white mb-1">Leader Cycles</div>
                                <ul className="list-disc ml-4 space-y-1 text-[11px] text-gray-400">
                                    <li>Main Sets: 5s PRO (no AMRAP)</li>
                                    <li>Supplemental: FSL volume {leaderAnchorPattern === '3+1' ? '(BBB optional early)' : ''}</li>
                                    <li>Goal: Accumulate fatigue‑manageable volume</li>
                                </ul>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                                <div className="font-semibold text-white mb-1">Anchor Cycle</div>
                                <ul className="list-disc ml-4 space-y-1 text-[11px] text-gray-400">
                                    <li>Main Sets: Standard 5/3/1 (PR sets)</li>
                                    <li>Supplemental: SSL or reduced FSL</li>
                                    <li>Goal: Realize PRs & reassess TM</li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-500 italic">Stored: approach=leaderAnchor, pattern={leaderAnchorPattern}. Generation engine will tag cycles and insert 7th Week as needed.</div>
                    </div>
                )}
                {programmingApproach === 'competition' && (
                    <div className="bg-gray-800/60 border border-dashed border-gray-600 rounded p-4 text-[11px] text-gray-400">
                        Competition prep workflow (timeline, attempt selection, peak management) coming soon. Current selection will be saved for future migration.
                    </div>
                )}
                {programmingApproach === 'specialized' && (
                    <div className="bg-gray-800/60 border border-dashed border-gray-600 rounded p-4 text-[11px] text-gray-400">
                        Specialized adaptive templates (Home Gym, Time‑Constrained, Injury Recovery, Age 50+) coming soon. Selection persisted for future feature unlock.
                    </div>
                )}
                <div className="text-[10px] text-gray-500 italic">Foundation stored in state (programmingApproach / leaderAnchorPattern) for downstream plan generation.</div>
            </div>



            {/* Supplemental Work Selector */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                <div>
                    <div className="text-white font-medium mb-1">Supplemental Work (Main Lift Volume)</div>
                    <p className="text-gray-400 text-xs">Choose ONE method. These are the authentic Wendler supplemental options. Assistance (accessories) is configured separately.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {SUPP_OPTIONS.map(opt => {
                        const active = supplemental.type === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setSupplemental({ type: opt.id })}
                                className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="text-sm font-semibold text-white leading-tight">{opt.title}</div>
                                    {active && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                                <div className="text-xs text-red-300 mt-1 font-medium">{opt.subtitle}</div>
                                <div className="text-xs text-gray-300 mt-2 leading-snug">{opt.desc}</div>
                                <div className="mt-2 text-[10px] text-gray-500 italic">{opt.when}</div>
                            </button>
                        );
                    })}
                </div>

                {/* Dynamic Config Panel */}
                {supplemental.type === 'fsl' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4">
                        <div className="text-white font-medium mb-2">First Set Last Configuration</div>
                        <p className="text-xs text-gray-400 mb-3">Perform additional volume with the first work set % each week. Choose total down-set volume.</p>
                        <div className="flex gap-2 mb-3">
                            {['3x5', '5x5'].map(v => (
                                <button key={v} onClick={() => setSupplemental({ fslVolume: v })} className={`px-3 py-1 rounded border text-sm ${supplemental.fslVolume === v ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}>{v}</button>
                            ))}
                        </div>
                        <table className="w-full text-xs text-gray-300">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left py-1">Week</th>
                                    <th className="text-left py-1">Main % First Set</th>
                                    <th className="text-left py-1">Down Sets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {WEEK_INFO.map(w => (
                                    <tr key={w.week} className="border-t border-gray-700/60">
                                        <td className="py-1">{w.week}</td>
                                        <td className="py-1">{w.fsl}%</td>
                                        <td className="py-1">{supplemental.fslVolume} @ {w.fsl}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-[10px] text-gray-500 mt-2">Use FSL for technical reinforcement and lower fatigue accumulation.</p>
                    </div>
                )}
                {supplemental.type === 'ssl' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4">
                        <div className="text-white font-medium mb-2">Second Set Last Configuration</div>
                        <p className="text-xs text-gray-400 mb-3">Additional volume with the second work set % each week (slightly heavier than FSL).</p>
                        <div className="flex gap-2 mb-3">
                            {['3x5', '5x5'].map(v => (
                                <button key={v} onClick={() => setSupplemental({ sslVolume: v })} className={`px-3 py-1 rounded border text-sm ${supplemental.sslVolume === v ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}>{v}</button>
                            ))}
                        </div>
                        <table className="w-full text-xs text-gray-300">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left py-1">Week</th>
                                    <th className="text-left py-1">Second Set %</th>
                                    <th className="text-left py-1">Down Sets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {WEEK_INFO.map(w => (
                                    <tr key={w.week} className="border-t border-gray-700/60">
                                        <td className="py-1">{w.week}</td>
                                        <td className="py-1">{w.ssl}%</td>
                                        <td className="py-1">{supplemental.sslVolume} @ {w.ssl}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-[10px] text-gray-500 mt-2">Choose SSL when you want a bit more intensity without BBB volume.</p>
                    </div>
                )}
                {supplemental.type === 'bbb' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                        <div className="text-white font-medium">Boring But Big Configuration</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-gray-400">Percent of TM</label>
                                <select
                                    value={supplemental.bbbPercent}
                                    onChange={e => setSupplemental({ bbbPercent: Number(e.target.value) })}
                                    className="w-full bg-gray-900 border border-gray-600 text-white rounded px-2 py-1 text-sm"
                                >
                                    {[50, 55, 60, 65, 70].map(p => <option key={p} value={p}>{p}%</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Pairing</label>
                                <select
                                    value={supplemental.bbbPairing}
                                    onChange={e => setSupplemental({ bbbPairing: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-600 text-white rounded px-2 py-1 text-sm"
                                >
                                    <option value="same">Same Lift</option>
                                    <option value="opposite">Opposite Lift</option>
                                </select>
                            </div>
                            <div className="text-xs text-gray-400 flex items-end">5×10 @ selected % of TM after main sets.</div>
                        </div>
                        <p className="text-[10px] text-gray-500">Same lift = skill & volume practice. Opposite lift = balance (Press↔Bench, Squat↔Deadlift).</p>
                    </div>
                )}
                {supplemental.type === '5spro' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4">
                        <div className="text-white font-medium mb-2">5s PRO Notes</div>
                        <p className="text-xs text-gray-300">All three weekly work sets are performed for 5 reps (no AMRAP / PR set). Keeps bar speed crisp and fatigue controlled. Pair with assistance for hypertrophy if needed.</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1 text-[11px] text-gray-400">
                            <li>Useful in leader phases before pushing rep PRs again.</li>
                            <li>Great with supplemental FSL or simple accessories.</li>
                        </ul>
                    </div>
                )}
                {supplemental.type === 'none' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 text-xs text-gray-300">
                        Focus solely on the 5/3/1 main sets. Ideal during stressful life periods or when re‑establishing training maxes.
                    </div>
                )}
                <div className="text-[10px] text-gray-500 italic">Choose one method per cycle. Changing mid‑cycle can distort progression tracking.</div>
            </div>

            {/* Assistance Work (NEW Section E) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-6">
                <div className="space-y-1">
                    <div className="text-white font-medium mb-1">E) Assistance Work</div>
                    <p className="text-gray-400 text-xs">Choose your assistance approach and configure exercises.</p>
                    <p className="text-[11px] text-gray-500">Assistance work addresses weaknesses and adds volume without interfering with main lifts.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700 rounded p-3 text-[11px] text-blue-100 leading-relaxed">
                    <div className="font-semibold mb-1">Process</div>
                    <div>1. Select assistance philosophy → 2. Configure exercises (if needed) → 3. Review final selection.</div>
                </div>
                {/* Mode selection cards */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[{
                            id: 'minimal', title: 'Minimal', subtitle: 'Low Volume', desc: 'Basic push/pull/core (25–50 total reps). Keep work small while TMs settle.', best: 'New cycle starts | limited recovery', features: ['Fast sessions', 'Low fatigue', 'Foundational balance']
                        }, {
                            id: 'standard', title: 'Standard', subtitle: 'Balanced', desc: 'Balanced assistance across movement patterns (50–75 reps per category).', best: 'General strength & physique', features: ['Push / Pull / Core', 'Single-Leg optional', 'Posterior chain focus']
                        }, {
                            id: 'custom', title: 'Custom', subtitle: 'Full Control', desc: 'Full control over assistance exercise selection and volume.', best: 'Advanced needs / targeting', features: ['Manual curation', 'Fine volume tuning', 'Specialization friendly']
                        }, {
                            id: 'template', title: 'Template-Based', subtitle: 'Wendler Sets', desc: 'Use proven assistance patterns from Wendler templates.', best: 'Hypertrophy blocks / structured variety', features: ['Preset volumes', 'Synergistic pairing', 'Reliable progression']
                        }].map(card => {
                            const active = assistanceConfig.mode === card.id;
                            return (
                                <button key={card.id} onClick={() => setAssistanceConfig({ mode: card.id })} className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-[11px] tracking-wide font-semibold text-red-300">{card.subtitle.toUpperCase()}</div>
                                            <div className="text-sm font-semibold text-white leading-tight mt-0.5">{card.title}</div>
                                        </div>
                                        {active && <CheckCircle className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-xs text-gray-300 mt-2 leading-snug">{card.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400"><span className="font-medium text-gray-300">Best for:</span> {card.best}</div>
                                    <ul className="mt-2 text-[10px] text-gray-400 list-disc ml-4 space-y-0.5">
                                        {card.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 italic">Stored: assistanceConfig.mode = {assistanceConfig.mode}</div>
                </div>
                {/* Category filters */}
                <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-300" />
                        <div className="text-white font-medium text-sm">Movement Pattern Filters</div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">Use filters to focus the preview. Strive for balanced coverage unless intentionally specializing.</p>
                    <div className="flex flex-wrap gap-2">
                        {[{ id: 'pull', label: 'Pull', tip: 'Balances pressing movements, improves posture' }, { id: 'push', label: 'Push', tip: 'Additional pressing volume, tricep development' }, { id: 'core', label: 'Core', tip: 'Trunk stability, injury prevention' }, { id: 'single', label: 'Single-Leg', tip: 'Unilateral strength, athletic development' }, { id: 'posterior', label: 'Posterior', tip: 'Hip hinge patterns, glute/hamstring strength' }].map(cat => {
                            const active = stdCategoryFilter.includes(cat.id);
                            return (
                                <button key={cat.id} title={cat.tip} onClick={() => toggleStdCategory(cat.id)} className={`px-4 py-1.5 rounded border text-xs font-medium transition ${active ? 'border-red-500 ring-2 ring-red-600 bg-red-600/10 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700/40'}`}>{cat.label}</button>
                            );
                        })}
                        <button onClick={() => setStdCategoryFilter([])} className="px-4 py-1.5 rounded border border-gray-700 text-xs text-gray-400 hover:bg-gray-700/40">Reset</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-[10px] text-gray-400">
                        <div><span className="font-semibold text-gray-300">Pull:</span> Balances pressing & shoulder health.</div>
                        <div><span className="font-semibold text-gray-300">Push:</span> Pressing volume & tricep strength.</div>
                        <div><span className="font-semibold text-gray-300">Core:</span> Trunk stability & bracing.</div>
                        <div><span className="font-semibold text-gray-300">Single-Leg:</span> Unilateral strength & balance.</div>
                        <div><span className="font-semibold text-gray-300">Posterior:</span> Hinge patterns & posterior chain.</div>
                    </div>
                </div>
                {/* Assistance Preview */}
                <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-300" />
                        <div className="text-white font-medium text-sm">Assistance Preview</div>
                    </div>
                    <p className="text-[11px] text-gray-400">Selected for movement balance and pattern diversity. Adjustments occur in the dedicated Assistance step.</p>
                    <div className="space-y-6">
                        {filteredPreview.map(day => (
                            <div key={day.day} className="border border-gray-700 rounded overflow-hidden">
                                <div className="px-3 py-2 bg-gray-900/70 text-white text-sm font-semibold flex justify-between items-center">
                                    <span>{day.day} Assistance</span>
                                    <span className="text-[10px] text-gray-400">{assistanceConfig.mode === 'minimal' ? 'Low Volume' : assistanceConfig.mode === 'standard' ? 'Balanced' : assistanceConfig.mode === 'template' ? 'Template' : 'Custom'}</span>
                                </div>
                                <ul className="divide-y divide-gray-800">
                                    {day.items.map((it, idx) => (
                                        <li key={idx} className="px-3 py-2 text-xs text-gray-300 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-gray-200">{it.name}</div>
                                                <div className="text-[10px] text-gray-400">{it.target}</div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {it.cats.map(c => (
                                                    <span key={c} className={`px-1.5 py-0.5 rounded border text-[10px] tracking-wide ${MOVEMENT_BADGE_COLORS[c] || 'border-gray-600 text-gray-300'}`}>{c.toUpperCase()}</span>
                                                ))}
                                            </div>
                                            {it.why && <div className="text-[10px] text-gray-500 italic leading-snug">{it.why}</div>}
                                        </li>
                                    ))}
                                    {!day.items.length && <li className="px-3 py-2 text-[10px] text-gray-500">No items (awaiting custom selection).</li>}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="text-[10px] text-gray-500 italic">Preview only – finalize later. Maintain recovery priority.</div>
                </div>
                {/* Pattern Balance */}
                <div className="bg-gray-800/60 border border-gray-700 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Cog className="w-4 h-4 text-gray-300" />
                        <div className="text-white font-medium text-sm">Pattern Balance Snapshot</div>
                    </div>
                    <PatternBalanceViewer items={filteredPreview} />
                </div>
            </div>

            {/* Equipment & Exercise Options (Section F) */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-6">
                <div className="space-y-1">
                    <div className="text-white font-medium mb-1">F) Equipment & Exercise Options</div>
                    <p className="text-gray-400 text-xs">Select available equipment to filter assistance exercise recommendations.</p>
                    <p className="text-[11px] text-gray-500">Equipment selection determines which assistance exercises will be suggested and available for your program.</p>
                </div>
                {/* Profile Cards */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[{
                            id: 'full', title: 'Commercial Gym / Full Setup', badge: 'All Exercises Available', desc: 'Complete equipment access including machines, cables, specialty items'
                        }, {
                            id: 'home', title: 'Home Gym Essentials', badge: 'Most Exercises Available', desc: 'Barbell, bench, dumbbells & pull‑up bar'
                        }, {
                            id: 'minimal', title: 'Minimal Equipment', badge: 'Core + Bodyweight', desc: 'Barbell + bodyweight accessories'
                        }, {
                            id: 'bodyweight', title: 'Bodyweight Only', badge: 'Bodyweight Assistance Only', desc: 'No external equipment selected'
                        }].map(card => {
                            const active = equipmentProfile === card.id && activeProfileIsPure;
                            return (
                                <button key={card.id} onClick={() => applyEquipmentProfile(card.id)} className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-white leading-snug pr-4">{card.title}</div>
                                        {active && <CheckCircle className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-2 leading-snug">{card.desc}</div>
                                    <div className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded border border-red-500 text-red-300 tracking-wide">{card.badge}</div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 italic">Active profile: {activeProfileDisplay}</div>
                </div>
                {/* Custom Equipment Selection */}
                <div className="space-y-5">
                    {EQUIP_CATEGORIES.map(cat => (
                        <div key={cat.id} className="bg-gray-800/50 border border-gray-700 rounded p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium text-sm">{cat.label}</div>
                                    <div className="text-[11px] text-gray-400">{cat.note}</div>
                                </div>
                                {cat.id === 'essential' && !(equipmentMap.barbell && equipmentMap.plates && equipmentMap.squat_rack && equipmentMap.bench) && <span className="text-[10px] text-red-400">Incomplete</span>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {cat.items.map(([key, label]) => {
                                    const on = !!equipmentMap[key];
                                    return (
                                        <button type="button" key={key} onClick={() => toggleEquip(key)} className={`group text-left px-2 py-1 rounded border text-[11px] flex items-center justify-between gap-2 ${on ? 'border-red-500 bg-red-600/10 text-white' : 'border-gray-600 bg-gray-900/40 text-gray-300 hover:bg-gray-800/60'}`}>
                                            <span className="truncate">{label}</span>
                                            <span className={`w-3 h-3 rounded-full ${on ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Impact Preview */}
                <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-300" />
                        <div className="text-white font-medium text-sm">Available Exercise Categories</div>
                    </div>
                    <p className="text-[11px] text-gray-400">{impactSummary}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
                        {Object.entries(catCounts).map(([cat, val]) => (
                            <div key={cat} className="bg-gray-900/50 border border-gray-700 rounded p-2 flex flex-col gap-1">
                                <div className="text-gray-300 font-medium capitalize">{cat}</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                                        <div style={{ width: Math.min(100, (val / (CATEGORY_BASE[cat] + 20)) * 100) + '%' }} className="h-full bg-red-600/70"></div>
                                    </div>
                                    <div className="text-[10px] text-gray-400 w-6 text-right">{val}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-[10px] text-gray-500 italic">Counts are illustrative. Final exercise pool may adjust based on programming approach and assistance mode.</div>
                </div>
            </div>

            {/* Step 3 Progress Summary */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 text-[11px] text-gray-300">
                {(() => {
                    const scheduleOk = !!(schedule.frequency && (schedule.days || []).length);
                    const warmOk = !!warm.policy; // basic
                    const progOk = !!programmingApproach;
                    const suppOk = !!supplemental.type;
                    const assistOk = !!assistanceConfig.mode;
                    const essentialOk = equipmentMap.barbell && equipmentMap.plates && equipmentMap.squat_rack && equipmentMap.bench;
                    const items = [
                        { id: 'schedule', label: 'Schedule', ok: scheduleOk },
                        { id: 'warm', label: 'Warm‑ups', ok: warmOk },
                        { id: 'programming', label: 'Programming', ok: progOk },
                        { id: 'supplemental', label: 'Supplemental', ok: suppOk },
                        { id: 'assistance', label: 'Assistance', ok: assistOk },
                        { id: 'equipment', label: 'Equipment', ok: essentialOk }
                    ];
                    return (
                        <div className="flex flex-wrap gap-3 items-center">
                            {items.map(it => (
                                <div key={it.id} className={`flex items-center gap-1 px-2 py-1 rounded border ${it.ok ? 'border-green-600 text-green-300' : 'border-gray-600 text-gray-400'}`}>
                                    {it.ok ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                                    <span>{it.label}</span>
                                </div>
                            ))}
                            {!essentialOk && <span className="text-yellow-400">Essential equipment incomplete (barbell, plates, rack, bench).</span>}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

// --- Helper component for pattern balance visualization ---
function PatternBalanceViewer({ items }) {
    const counts = { push: 0, pull: 0, core: 0, single: 0, posterior: 0 };
    items.forEach(day => day.items.forEach(it => it.cats.forEach(c => { if (counts[c] !== undefined) counts[c]++; })));
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const pct = (c) => Math.round((counts[c] / total) * 100);
    const bars = [
        { id: 'pull', label: 'Pull' },
        { id: 'push', label: 'Push' },
        { id: 'core', label: 'Core' },
        { id: 'single', label: 'Single-Leg' },
        { id: 'posterior', label: 'Posterior' }
    ];
    return (
        <div className="space-y-2 text-[11px] text-gray-300">
            {bars.map(b => (
                <div key={b.id} className="flex items-center gap-2">
                    <div className="w-20 text-gray-400">{b.label}</div>
                    <div className="flex-1 h-3 bg-gray-900 rounded overflow-hidden border border-gray-700">
                        <div style={{ width: pct(b.id) + '%' }} className={`h-full ${pct(b.id) > 35 ? 'bg-red-600/70' : 'bg-red-500/40'}`}></div>
                    </div>
                    <div className="w-10 text-right text-gray-400">{counts[b.id]}</div>
                </div>
            ))}
            <div className="text-[10px] text-gray-500 italic">Ensure no single pattern dominates unless purposefully specialized.</div>
        </div>
    );
}
