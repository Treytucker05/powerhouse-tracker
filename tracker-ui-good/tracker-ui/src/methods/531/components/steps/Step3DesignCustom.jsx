import React, { useEffect, useMemo, useState } from 'react';
import { useProgramV2, setSchedule, setSupplemental, setAssistance } from '../../contexts/ProgramContextV2.jsx';
import AssistanceCatalogPicker from '../assistance/AssistanceCatalogPicker.jsx';
import { ASSISTANCE_CATALOG, normalizeAssistance } from '../../assistance/index.js';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ToggleButton from '../ToggleButton.jsx';

const CORE_LIFTS = ['Press', 'Deadlift', 'Bench', 'Squat'];

function parseCsvNums(str) {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0).map(n => Number(n)).filter(n => Number.isFinite(n));
}

export default function Step3DesignCustom({ onValidChange }) {
    const { state, dispatch } = useProgramV2();
    const sched = state.schedule || {};
    const [frequency, setFrequency] = useState(sched.frequency || '4day');
    const [order, setOrder] = useState(sched.order || ['Press', 'Deadlift', 'Bench', 'Squat']);
    const [includeWarmups, setIncludeWarmups] = useState(sched.includeWarmups !== false);
    const [warmPctCsv, setWarmPctCsv] = useState((sched.warmupScheme?.percentages || [40, 50, 60]).join(','));
    const [warmRepsCsv, setWarmRepsCsv] = useState((sched.warmupScheme?.reps || [5, 5, 3]).join(','));

    const [deadliftRepStyle, setDeadliftRepStyle] = useState(state.deadliftRepStyle || 'dead_stop');
    const [activeLift, setActiveLift] = useState((sched.order && sched.order[0]) || 'Press');

    // Supplemental (custom path)
    const [suppStrategy, setSuppStrategy] = useState(state.supplemental?.strategy || 'none');
    const [suppPairing, setSuppPairing] = useState(state.supplemental?.pairing || 'same');
    const [suppPct, setSuppPct] = useState(state.supplemental?.percentOfTM || 50);

    // Assistance
    const [assistMode, setAssistMode] = useState(state.assistance?.mode || 'minimal');
    const initialCustomPlan = state.assistance?.customPlan || {};
    const [customPlan, setCustomPlan] = useState(initialCustomPlan);
    const [showDayPicker, setShowDayPicker] = useState(null); // day lift name or null
    const [swapTarget, setSwapTarget] = useState(null); // { lift, rowIdx }
    const flatCatalog = useMemo(() => {
        if (!ASSISTANCE_CATALOG) return [];
        if (Array.isArray(ASSISTANCE_CATALOG)) return ASSISTANCE_CATALOG;
        return Object.entries(ASSISTANCE_CATALOG).flatMap(([cat, arr]) => (arr || []).map(item => ({
            ...item,
            block: item.block || (cat === 'singleLeg' ? 'Single-Leg' : cat.charAt(0).toUpperCase() + cat.slice(1)),
            equipment: item.equip || item.equipment || []
        })));
    }, []);
    const BLOCKS = ['All', 'Push', 'Pull', 'Single-Leg', 'Posterior', 'Core'];
    const [blockFilter, setBlockFilter] = useState('All');

    // Equipment selector (drives automatic assistance filtering)
    const ALL_EQUIP = ["bw", "db", "bb", "machine", "cable", "band", "kb", "dip", "rings", "bench", "box", "landmine", "plate", "abwheel", "bar"];
    const [equip, setEquip] = useState(state.equipment || ['bw', 'db', 'bb']);
    function toggleEquip(key) {
        setEquip(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    }

    // Removed debug JSON inspector (was showInspector)

    // Frequency change resets order length
    useEffect(() => {
        setOrder(prev => {
            const desired = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
            let base = prev.slice(0, desired);
            while (base.length < desired) base.push(CORE_LIFTS[base.length] || 'Press');
            return base;
        });
    }, [frequency]);

    function updateOrder(idx, val) {
        setOrder(o => o.map((v, i) => i === idx ? val : v));
        if (val === 'Deadlift') setActiveLift('Deadlift');
        else if (activeLift === 'Deadlift' && !oIncludesDeadliftExceptIdx(idx, val)) {
            // if we replaced the only deadlift slot, switch active lift to first
            setActiveLift(val);
        }
    }

    function oIncludesDeadliftExceptIdx(changeIdx, newVal) {
        // helper to know if Deadlift still present after change
        return order.some((l, i) => (i === changeIdx ? newVal : l) === 'Deadlift');
    }

    function setCanonical() {
        setFrequency('4day');
        setOrder(['Press', 'Deadlift', 'Bench', 'Squat']);
    }
    function resetOrder() {
        const desired = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        setOrder(CORE_LIFTS.slice(0, desired));
    }

    // Assistance custom handlers
    function addCustomRow(dayIdx) {
        setCustomPlan(prev => {
            const key = order[dayIdx];
            const list = prev[key] ? [...prev[key]] : [];
            if (list.length >= 2) return prev; // cap at 2 items per spec
            list.push({ name: '', sets: 3, reps: 10 });
            return { ...prev, [key]: list };
        });
    }
    function updateCustomRow(dayLift, rowIdx, patch) {
        setCustomPlan(prev => {
            const list = prev[dayLift] ? [...prev[dayLift]] : [];
            if (!list[rowIdx]) return prev;
            list[rowIdx] = { ...list[rowIdx], ...patch };
            return { ...prev, [dayLift]: list };
        });
    }
    function removeCustomRow(dayLift, rowIdx) {
        setCustomPlan(prev => {
            const list = prev[dayLift] ? [...prev[dayLift]] : [];
            list.splice(rowIdx, 1);
            if (list.length === 0) {
                const clone = { ...prev };
                delete clone[dayLift];
                return clone;
            }
            return { ...prev, [dayLift]: list };
        });
    }

    // Validation logic
    const validation = useMemo(() => {
        const desired = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        let scheduleOk = order.length === desired;
        // Unique check (allow duplicates only for 2-day simple version? spec says unique lifts still)
        const unique = new Set(order);
        if (unique.size !== order.length) scheduleOk = false;
        if (!order.every(l => CORE_LIFTS.includes(l))) scheduleOk = false;

        let warmupsOk = true;
        let warmPercentages = parseCsvNums(warmPctCsv);
        let warmReps = parseCsvNums(warmRepsCsv);
        if (includeWarmups) {
            if (warmPercentages.length === 0 || warmPercentages.length !== warmReps.length) warmupsOk = false;
            if (warmPercentages.length > 5) warmupsOk = false;
            if (!warmPercentages.every(n => n > 0 && n < 100) || !warmReps.every(r => r > 0 && r < 30)) warmupsOk = false;
        }

        let supplementalOk = true;
        if (suppStrategy === 'bbb') {
            if (!(suppPct >= 50 && suppPct <= 70)) supplementalOk = false;
        }

        let assistanceOk = true;
        if (assistMode === 'custom') {
            for (const lift of order) {
                const rows = customPlan[lift] || [];
                if (rows.length > 2) { assistanceOk = false; break; }
                for (const r of rows) {
                    if (!r.name || r.name.trim().length === 0) { assistanceOk = false; break; }
                    if (!(r.sets >= 1 && r.sets <= 10)) { assistanceOk = false; break; }
                    if (!(r.reps >= 1 && r.reps <= 30)) { assistanceOk = false; break; }
                }
                if (!assistanceOk) break;
            }
        }

        const valid = scheduleOk && warmupsOk && supplementalOk && assistanceOk;
        return { valid, scheduleOk, warmupsOk, supplementalOk, assistanceOk };
    }, [frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, suppStrategy, suppPct, assistMode, customPlan]);

    useEffect(() => { onValidChange && onValidChange(validation.valid); }, [validation, onValidChange]);

    // Dispatch to context (debounced-ish via effect on dependencies)
    useEffect(() => {
        const id = setTimeout(() => {
            setSchedule(dispatch, { frequency, order, includeWarmups, warmupScheme: { percentages: parseCsvNums(warmPctCsv), reps: parseCsvNums(warmRepsCsv) } });
            dispatch({ type: 'SET_DEADLIFT_REP_STYLE', payload: deadliftRepStyle });
            if (suppStrategy === 'bbb') {
                setSupplemental(dispatch, { strategy: 'bbb', pairing: suppPairing, percentOfTM: suppPct, sets: 5, reps: 10 });
            } else {
                setSupplemental(dispatch, { strategy: 'none' });
            }
            if (assistMode === 'custom') {
                setAssistance(dispatch, { mode: 'custom', customPlan });
            } else {
                setAssistance(dispatch, { mode: assistMode });
            }
        }, 250);
        return () => clearTimeout(id);
    }, [frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, deadliftRepStyle, suppStrategy, suppPairing, suppPct, assistMode, customPlan, dispatch]);

    // Persist equipment selection (separate effect to avoid coupling with other debounce)
    useEffect(() => {
        const id = setTimeout(() => dispatch({ type: 'SET_EQUIPMENT', payload: equip }), 200);
        return () => clearTimeout(id);
    }, [equip, dispatch]);

    return (
        <div className="space-y-8">
            {/* Intro Card (rewritten for clarity + brevity) */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white">Design your cycle</h2>
                <p className="text-sm text-gray-400 mt-1">Set your warm-ups, main % by week, and supplemental style. You can convert assistance to custom later.</p>
                <ul className="mt-3 space-y-1 text-sm list-disc pl-5 text-gray-300">
                    <li><strong>Warm-ups:</strong> 40/50/60% of TM ramps without fatigue.</li>
                    <li><strong>Main:</strong> Week 1–3 last set AMRAP; Week 4 deload (no AMRAP) <span className="text-gray-400">(can optionally skip below if running a longer Leader block).</span></li>
                    <li><strong>Supplemental (BBB):</strong> 5×10 @ 50–70% (start 50–60% if new).</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3 flex flex-col gap-1">
                    <span>Change days/split in Step 2. Rounding set in Step 1.</span>
                    <span className="text-gray-400 italic">Conditioning: 2 easy LISS sessions weekly; don’t let conditioning hurt lifting.</span>
                </p>
                <div className="mt-4 bg-gray-900/40 border border-gray-700 rounded-md p-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold tracking-wide text-gray-300">Deload Week 4</div>
                        <label className="inline-flex items-center gap-2 text-xs text-gray-400">
                            <input
                                type="checkbox"
                                className="h-3 w-3"
                                checked={!(state?.advanced?.skipDeload)}
                                onChange={(e) => {
                                    dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), skipDeload: !e.target.checked } });
                                }}
                            />
                            <span>{state?.advanced?.skipDeload ? 'Off (skipped this cycle)' : 'On (default)'}</span>
                        </label>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                        Keep ON for standard 4-week cycles. Advanced users running multi-phase (Leader/Anchor) can disable interim deloads (e.g. only deload after final Anchor). When OFF, export will show only 3 loading weeks; progression still expects full recovery management on you.
                    </p>
                </div>
            </div>

            {/* Schedule */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">A) Schedule</h3>
                    <div className="flex space-x-2">
                        <ToggleButton on={false} onClick={setCanonical} className="text-xs">Canonical Order</ToggleButton>
                        <ToggleButton on={false} onClick={resetOrder} className="text-xs">Reset Order</ToggleButton>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        {['4day', '3day', '2day'].map(f => (
                            <ToggleButton key={f} on={frequency === f} onClick={() => setFrequency(f)}>{f.replace('day', '-day')}</ToggleButton>
                        ))}
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {order.map((lift, idx) => (
                            <div key={idx} className="space-y-1">
                                <label className="text-xs uppercase tracking-wide text-gray-400">Slot {idx + 1}</label>
                                <select
                                    value={lift}
                                    onFocus={() => setActiveLift(lift)}
                                    onChange={(e) => { updateOrder(idx, e.target.value); setActiveLift(e.target.value); }}
                                    className={`w-full bg-gray-800 border rounded px-2 py-2 text-sm text-white focus:border-red-500 ${activeLift === lift ? 'border-red-500' : 'border-gray-600'}`}
                                >
                                    {CORE_LIFTS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                {activeLift === 'Deadlift' && lift === 'Deadlift' && (
                                    <div className="mt-2 bg-gray-800/60 border border-gray-700 rounded p-2 space-y-1">
                                        <label className="text-[11px] font-medium text-gray-200">Deadlift rep style</label>
                                        <p className="text-[10px] text-gray-500">Affects how reps are performed.</p>
                                        <div className="flex items-center gap-3 text-[11px]" role="radiogroup" aria-label="Deadlift rep style">
                                            <label className="inline-flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="dlRepStyle"
                                                    value="dead_stop"
                                                    checked={deadliftRepStyle === 'dead_stop'}
                                                    onChange={() => setDeadliftRepStyle('dead_stop')}
                                                />
                                                <span>Reset each rep</span>
                                            </label>
                                            <label className="inline-flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="dlRepStyle"
                                                    value="touch_and_go"
                                                    checked={deadliftRepStyle === 'touch_and_go'}
                                                    onChange={() => setDeadliftRepStyle('touch_and_go')}
                                                />
                                                <span>Touch-and-go</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {!validation.scheduleOk && (
                        <div className="flex items-start space-x-2 text-yellow-300 text-xs bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <span>Schedule invalid: ensure unique lifts and correct number of slots.</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Warm-up Scheme */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">B) Warm-up Scheme</h3>
                <div className="flex items-center space-x-3 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={includeWarmups} onChange={(e) => setIncludeWarmups(e.target.checked)} />
                        <span className="text-gray-300">Include warm-ups</span>
                    </label>
                    {includeWarmups && (
                        <div className="flex space-x-2">
                            {(() => {
                                const pct = warmPctCsv.replace(/\s/g, '');
                                const reps = warmRepsCsv.replace(/\s/g, '');
                                const isStandard = pct === '40,50,60' && reps === '5,5,3';
                                const isMinimal = pct === '40,55' && reps === '5,3';
                                return (
                                    <>
                                        <ToggleButton
                                            on={isStandard}
                                            className="text-xs"
                                            title="Classic Wendler 3-set ramp"
                                            onClick={() => { setWarmPctCsv('40,50,60'); setWarmRepsCsv('5,5,3'); }}
                                        >Standard (3 sets)</ToggleButton>
                                        <ToggleButton
                                            on={isMinimal}
                                            className="text-xs"
                                            title="Fast ramp: first two sets only"
                                            onClick={() => { setWarmPctCsv('40,55'); setWarmRepsCsv('5,3'); }}
                                        >Minimal (2 quick)</ToggleButton>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
                {includeWarmups ? (
                    <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                        <Info className="w-4 h-4 mt-0.5" />
                        <span>
                            Choose a ramp that wakes tissues without stealing performance. Standard (40/50/60 x 5/5/3) gives more gradual practice; Minimal (40/55 x 5/3) is a faster primer for time‑crunched sessions. Adjust percentages or reps if bar speed feels off.
                        </span>
                    </div>
                ) : (
                    <div className="bg-gray-800/40 border border-gray-700/60 rounded p-3 text-[11px] text-gray-400 flex space-x-2 leading-snug">
                        <Info className="w-4 h-4 mt-0.5" />
                        <span>Warm-ups skipped. Make sure you still perform a few empty bar / light acclimation sets before main work.</span>
                    </div>
                )}
                {includeWarmups && (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Percentages</label>
                            <input value={warmPctCsv} onChange={e => setWarmPctCsv(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500" placeholder="40,50,60" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Reps</label>
                            <input value={warmRepsCsv} onChange={e => setWarmRepsCsv(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500" placeholder="5,5,3" />
                        </div>
                    </div>
                )}
                {includeWarmups && !validation.warmupsOk && (
                    <div className="text-xs text-yellow-300 flex items-start space-x-2 bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>Warm-up arrays must be equal length numeric lists (1-5 entries).</span>
                    </div>
                )}
            </section>

            {/* Deadlift rep style moved inline with schedule (above) */}

            {/* Supplemental */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">D) Supplemental</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                    {['none', 'bbb'].map(s => (
                        <ToggleButton key={s} on={suppStrategy === s} onClick={() => setSuppStrategy(s)}>{s === 'none' ? 'None' : 'Boring But Big'}</ToggleButton>
                    ))}
                </div>
                {suppStrategy === 'bbb' && (
                    <div className="space-y-4 text-sm">
                        <div>
                            <label className="text-sm font-medium text-gray-200">Supplemental pairing</label>
                            <p className="text-xs text-gray-500 mb-2">Choose how BBB is paired after your main lift.</p>
                            <div className="flex flex-wrap items-center gap-4" role="radiogroup" aria-label="Supplemental pairing">
                                <label className="inline-flex items-center gap-2 text-xs">
                                    <input
                                        type="radio"
                                        name="suppPairing"
                                        value="same"
                                        checked={suppPairing === 'same'}
                                        onChange={() => setSuppPairing('same')}
                                    />
                                    <span>Same lift (BBB 5×10 @ {suppPct || 50}% TM)</span>
                                </label>
                                <label className="inline-flex items-center gap-2 text-xs">
                                    <input
                                        type="radio"
                                        name="suppPairing"
                                        value="opposite"
                                        checked={suppPairing === 'opposite'}
                                        onChange={() => setSuppPairing('opposite')}
                                    />
                                    <span>Opposite lift (paired)</span>
                                </label>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="block text-xs uppercase text-gray-400">% of TM <span className="text-gray-500 lowercase font-normal">(50–70)</span></label>
                                <input type="number" value={suppPct} min={50} max={70} onChange={e => setSuppPct(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500" />
                                {!validation.supplementalOk && <p className="text-xs text-yellow-300">Range 50-70</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs uppercase text-gray-400">Sets × Reps</label>
                                <div className="text-gray-300 text-sm font-mono">5 × 10</div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Equipment (polished chips) */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">F) Equipment</h3>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-200">Equipment <span className="text-gray-500">({equip.length}/{ALL_EQUIP.length})</span></span>
                    <div className="text-xs text-gray-400">
                        <button type="button" className="underline mr-3" onClick={() => setEquip([...ALL_EQUIP])}>All</button>
                        <button type="button" className="underline" onClick={() => setEquip([])}>None</button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ALL_EQUIP.map(id => {
                        const active = equip.includes(id);
                        const equipmentLabelMap = { bw: 'Bodyweight', db: 'Dumbbells', bb: 'Barbell', kb: 'Kettlebell' };
                        const ambiguous = ['ghr', 'reverse_hyper'].includes(id);
                        const label = equipmentLabelMap[id] || id;
                        return (
                            <button
                                key={id}
                                type="button"
                                className={`px-2 py-1 rounded text-[11px] border transition-colors ${active ? 'bg-red-600/70 border-red-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'}`}
                                onClick={() => toggleEquip(id)}
                                title={ambiguous ? (id === 'ghr' ? 'Glute-Ham Raise machine' : 'Reverse hyperextension machine') : undefined}
                                aria-pressed={active}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                {equip.length === 0 && <div className="text-xs text-yellow-300">Select at least bodyweight (bw) or another implement.</div>}
            </section>

            {/* Assistance */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">E) Assistance</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                        <label className="block text-xs uppercase text-gray-400 mb-1">Mode</label>
                        <select value={assistMode} onChange={e => setAssistMode(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500">
                            <option value="minimal">Minimal</option>
                            <option value="triumvirate">Triumvirate</option>
                            <option value="periodization_bible">Periodization Bible</option>
                            <option value="bodyweight">Bodyweight Emphasis</option>
                            <option value="custom">Custom</option>
                        </select>
                        {assistMode !== 'custom' && (
                            <div className="text-[11px] text-gray-300 bg-gray-800/60 border border-gray-700 rounded p-3 leading-snug space-y-1">
                                {assistMode === 'minimal' && <p>Baseline: push / pull / core. Keep total work small while TMs settle.</p>}
                                {assistMode === 'triumvirate' && <p>Two focused assistance lifts (5 sets each). Coming soon.</p>}
                                {assistMode === 'periodization_bible' && <p>Layered multi-block assistance (coming soon).</p>}
                                {assistMode === 'bodyweight' && <p>Bodyweight emphasis for limited equipment.</p>}
                                {assistMode === 'custom' && <p>Manually define each slot after converting in Step 4.</p>}
                                <p className="text-gray-500">Target 25–50 total reps per assistance movement (BBB Same‑Lift variant: pick ONLY one movement). Use the low end if high supplemental volume or fatigue. Categories for variety: Upper – Pull / Core. Lower – Single-Leg / Posterior chain.</p>
                            </div>
                        )}
                    </div>
                    {assistMode === 'custom' && (
                        <div className="md:col-span-2 space-y-4">
                            {order.map((lift, idx) => {
                                const dayRows = customPlan[lift] || [];
                                return (
                                    <div key={lift} className="bg-gray-800/40 border border-gray-700 rounded p-3 relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-white">{lift} Day Assistance</h4>
                                            <div className="flex gap-2">
                                                <ToggleButton on={false} onClick={() => setShowDayPicker(showDayPicker === lift ? null : lift)} className="text-xs px-2 py-1">{showDayPicker === lift ? 'Close Picker' : 'Browse Catalog'}</ToggleButton>
                                                <ToggleButton on={false} onClick={() => addCustomRow(idx)} className="text-xs px-2 py-1">Add Blank</ToggleButton>
                                            </div>
                                        </div>
                                        {showDayPicker === lift && (
                                            <div className="mb-3">
                                                <AssistanceCatalogPicker
                                                    equipment={equip}
                                                    onPick={(x) => {
                                                        setCustomPlan(prev => {
                                                            const list = prev[lift] ? [...prev[lift]] : [];
                                                            if (list.length >= 2) return prev;
                                                            list.push({ name: x.name, sets: x.sets || 3, reps: x.reps || 10, block: x.block });
                                                            return { ...prev, [lift]: list };
                                                        });
                                                        setShowDayPicker(null);
                                                    }}
                                                    onClose={() => setShowDayPicker(null)}
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-3">
                                            {dayRows.map((row, rowIdx) => {
                                                const rowVolume = (Number(row.sets) || 0) * (Number(row.reps) || 0);
                                                return (
                                                    <div key={rowIdx} className="border border-gray-700/60 rounded p-2 space-y-2 bg-gray-800/30">
                                                        <div className="grid grid-cols-12 gap-2 items-end">
                                                            <div className="col-span-4">
                                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">Name</label>
                                                                <input value={row.name} onChange={e => updateCustomRow(lift, rowIdx, { name: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" placeholder="Movement" />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">Sets</label>
                                                                <input type="number" value={row.sets} min={1} max={10} onChange={e => updateCustomRow(lift, rowIdx, { sets: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">Reps</label>
                                                                <input type="number" value={row.reps} min={1} max={30} onChange={e => updateCustomRow(lift, rowIdx, { reps: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">Block</label>
                                                                <input value={row.block || ''} onChange={e => updateCustomRow(lift, rowIdx, { block: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" placeholder="(opt)" />
                                                            </div>
                                                            <div className="col-span-2 flex items-center gap-1">
                                                                <div className="text-[10px] px-1.5 py-1 rounded bg-gray-700/50 border border-gray-600 text-gray-300 font-mono" title="Sets × Reps volume">
                                                                    {(row.sets || 0)}×{(row.reps || 0)}
                                                                </div>
                                                                <ToggleButton on={false} onClick={() => setSwapTarget({ lift, rowIdx })} className="text-xs px-2 py-1">Swap</ToggleButton>
                                                                <ToggleButton on={false} onClick={() => removeCustomRow(lift, rowIdx)} className="text-xs px-2 py-1">✕</ToggleButton>
                                                            </div>
                                                        </div>
                                                        {swapTarget && swapTarget.lift === lift && swapTarget.rowIdx === rowIdx && (
                                                            <div className="mt-1">
                                                                <AssistanceCatalogPicker
                                                                    block={row.block}
                                                                    equipment={equip}
                                                                    onPick={(x) => {
                                                                        // Preserve existing sets/reps; update name/id/block
                                                                        updateCustomRow(lift, rowIdx, { name: x.name, id: x.id, block: x.block || row.block });
                                                                        // Simple volume mismatch hint (if default sets*approxReps differs > 60%)
                                                                        try {
                                                                            const parseReps = (r) => (typeof r === 'string' ? Number(r.split(/[^0-9]/).filter(Boolean)[0]) : r) || 0;
                                                                            const curVol = (row.sets || 0) * (row.reps || 0);
                                                                            const newVol = (x.sets || 0) * parseReps(x.reps);
                                                                            if (curVol && newVol && (newVol / curVol > 1.6 || curVol / newVol > 1.6)) {
                                                                                // attach transient flag
                                                                                updateCustomRow(lift, rowIdx, { volumeWarn: true });
                                                                                setTimeout(() => updateCustomRow(lift, rowIdx, { volumeWarn: false }), 3000);
                                                                            }
                                                                        } catch { /* noop */ }
                                                                        setSwapTarget(null);
                                                                    }}
                                                                    onClose={() => setSwapTarget(null)}
                                                                />
                                                            </div>
                                                        )}
                                                        {row.volumeWarn && <div className="text-[10px] text-amber-300">Volume mismatch vs default suggestion – adjust if needed.</div>}
                                                    </div>
                                                );
                                            })}
                                            {dayRows.length === 0 && <div className="text-xs text-gray-500">No assistance added.</div>}
                                            {dayRows.length > 0 && (() => {
                                                const dailyVolume = dayRows.reduce((sum, r) => sum + ((Number(r.sets) || 0) * (Number(r.reps) || 0)), 0);
                                                return (
                                                    <div className={`mt-1 text-[11px] flex items-center gap-2 ${dailyVolume > 100 ? 'text-amber-300' : 'text-gray-400'}`}>
                                                        <span className="font-mono px-1.5 py-0.5 rounded bg-gray-700/40 border border-gray-600 text-gray-300">Total: {dailyVolume}</span>
                                                        {dailyVolume > 100 && <span className="text-amber-300">High assistance volume – ensure recovery.</span>}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {assistMode === 'custom' && !validation.assistanceOk && (
                    <div className="text-xs text-yellow-300 flex items-start space-x-2 bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>Custom assistance invalid: ensure names & reps/sets within allowed ranges.</span>
                    </div>
                )}
                {assistMode === 'custom' && (() => {
                    // Weekly cumulative assistance volume (sum of all sets*reps across days)
                    const weeklyVolume = order.reduce((sum, lift) => {
                        const rows = customPlan[lift] || [];
                        return sum + rows.reduce((s, r) => s + ((Number(r.sets) || 0) * (Number(r.reps) || 0)), 0);
                    }, 0);
                    if (!weeklyVolume) return null;
                    const high = weeklyVolume > 400; // heuristic threshold; > ~400 reps/week of assistance can be high alongside main + supplemental
                    return (
                        <div className={`mt-3 text-[11px] flex items-center gap-2 ${high ? 'text-amber-300' : 'text-gray-400'}`}>
                            <span className="font-mono px-1.5 py-0.5 rounded bg-gray-700/40 border border-gray-600 text-gray-300">Weekly assistance reps: {weeklyVolume}</span>
                            {high && <span className="text-amber-300">High cumulative assistance – monitor recovery.</span>}
                        </div>
                    );
                })()}
                {assistMode !== 'custom' && (
                    <div className="space-y-3">
                        <div className="text-[11px] text-gray-300 bg-gray-800/60 border border-gray-700 rounded p-3 leading-snug">
                            <p className="font-semibold text-gray-200 mb-1">Template Assistance Preview</p>
                            <p className="text-gray-400">Below is the assistance that will be applied per main lift day using the selected mode.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                            {BLOCKS.map(b => (
                                <ToggleButton key={b} on={blockFilter === b} onClick={() => setBlockFilter(b)} className="px-2 py-1">{b}</ToggleButton>
                            ))}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {order.map(lift => {
                                const itemsRaw = normalizeAssistance(assistMode === 'minimal' ? 'triumvirate' : assistMode, lift, state) || [];
                                // Apply equipment + block filter for visibility
                                const items = itemsRaw.filter(it => {
                                    const okEquip = (it.equipment || []).every(tag => equip.includes(tag));
                                    const okBlock = blockFilter === 'All' || it.block === blockFilter;
                                    return okEquip && okBlock;
                                });
                                return (
                                    <div key={lift} className="bg-gray-800/40 border border-gray-700 rounded p-3">
                                        <h4 className="text-xs font-semibold text-gray-300 mb-2">{lift} Day</h4>
                                        {items.length ? (
                                            <ul className="space-y-1 text-[11px]">
                                                {items.map(it => <li key={it.name} className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] px-1 py-0.5 rounded bg-gray-700/40 border border-gray-600 text-gray-400">{it.block || '—'}</span>
                                                        <span className="text-gray-200">{it.name}</span>
                                                        <span className="text-gray-500">{it.sets}×{it.reps}</span>
                                                        <span className="text-[9px] text-gray-500">{(it.equipment || []).join(', ')}</span>
                                                    </div>
                                                    {it.note && <div className="text-[9px] text-gray-500 ml-5 leading-snug">{it.note}</div>}
                                                </li>)}
                                            </ul>
                                        ) : <div className="text-[11px] text-gray-500">None</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {assistMode === 'custom' && (
                    <div className="text-[10px] text-gray-500 mt-3">Cap 2 assistance movements per day. Browse catalog for authentic book-derived options; adjust sets/reps as desired.</div>
                )}
            </section>

            {/* Validation Summary */}
            <section className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 flex flex-wrap gap-4">
                <div className={`flex items-center space-x-2 ${validation.scheduleOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Schedule</span></div>
                <div className={`flex items-center space-x-2 ${(!includeWarmups || validation.warmupsOk) ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Warm-ups</span></div>
                <div className={`flex items-center space-x-2 ${validation.supplementalOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Supplemental</span></div>
                <div className={`flex items-center space-x-2 ${validation.assistanceOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Assistance</span></div>
            </section>

            {/* Debug JSON inspector removed */}
        </div>
    );
}
