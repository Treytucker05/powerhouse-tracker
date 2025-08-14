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
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-3">
                <h2 className="text-2xl font-bold text-white">Step 3 — Custom Design</h2>
                <p className="text-gray-400 text-sm">Configure schedule order, warm-ups, supplemental strategy, assistance style, equipment, and deadlift rep style.</p>
                <div className="text-[11px] leading-snug bg-indigo-900/20 border border-indigo-700/40 rounded p-3 text-indigo-100">
                    <strong className="text-indigo-300">Warm up:</strong> 40%×5, 50%×5, 60%×3 of TM. Use ramp sets; rest 60–90s; focus on bar speed & bracing. Adjust if reps feel slow.
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
                                <select value={lift} onChange={(e) => updateOrder(idx, e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500">
                                    {CORE_LIFTS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
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

            {/* Deadlift Rep Style */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">C) Deadlift Rep Style</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                    {['dead_stop', 'touch_and_go'].map(style => (
                        <ToggleButton key={style} on={deadliftRepStyle === style} onClick={() => setDeadliftRepStyle(style)}>{style.replace('_', ' ')}</ToggleButton>
                    ))}
                </div>
                <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-xs text-blue-100 flex space-x-2">
                    <Info className="w-4 h-4 mt-0.5" />
                    <span>Dead-stop means resetting each rep (recommended for power & consistency). Touch-and-go can increase time under tension but requires control.</span>
                </div>
            </section>

            {/* Supplemental */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">D) Supplemental (Optional BBB)</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                    {['none', 'bbb'].map(s => (
                        <ToggleButton key={s} on={suppStrategy === s} onClick={() => setSuppStrategy(s)}>{s === 'none' ? 'None' : 'Boring But Big'}</ToggleButton>
                    ))}
                </div>
                {suppStrategy === 'bbb' && (
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs uppercase text-gray-400 mb-1">Pairing</label>
                            <div className="flex space-x-2">
                                {['same', 'opposite'].map(p => (
                                    <ToggleButton key={p} on={suppPairing === p} onClick={() => setSuppPairing(p)} className="text-xs px-3 py-2 capitalize">{p}</ToggleButton>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs uppercase text-gray-400 mb-1">% of TM</label>
                            <input type="number" value={suppPct} min={50} max={70} onChange={e => setSuppPct(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-2 text-sm text-white focus:border-red-500" />
                            {!validation.supplementalOk && <p className="text-xs text-yellow-300">Range 50-70</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs uppercase text-gray-400 mb-1">Sets x Reps</label>
                            <div className="text-gray-300 text-sm font-mono">5 x 10</div>
                        </div>
                    </div>
                )}
            </section>

            {/* Equipment */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">F) Equipment</h3>
                <p className="text-xs text-gray-400">Select equipment you truly have. Auto-picked assistance filters by availability. Use All / None for quick toggles.</p>
                <div className="flex gap-2 mb-2 flex-wrap items-center">
                    <ToggleButton
                        on={equip.length === ALL_EQUIP.length}
                        onClick={() => setEquip(equip.length === ALL_EQUIP.length ? [] : [...ALL_EQUIP])}
                        className="text-xs"
                        title="Toggle all equipment"
                    >{equip.length === ALL_EQUIP.length ? 'All (On)' : 'All'}</ToggleButton>
                    <ToggleButton on={equip.length === 0} onClick={() => setEquip([])} className="text-xs">None</ToggleButton>
                    <span className="text-[10px] text-gray-500">{equip.length}/{ALL_EQUIP.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ALL_EQUIP.map(k => (
                        <ToggleButton key={k} on={equip.includes(k)} onClick={() => toggleEquip(k)} className="capitalize text-xs px-2 py-1.5">{k}</ToggleButton>
                    ))}
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
                                {assistMode === 'minimal' && <p>Main lift + minimal accessories. Choose recovery over fatigue while dialing TMs.</p>}
                                {assistMode === 'triumvirate' && <p>Main + <strong>2</strong> moves (5×10–15). Balanced stimulus without junk volume.</p>}
                                {assistMode === 'periodization_bible' && <p>Three blocks (Push/Pull/Core or Hams/Quads/Abs) 5×10–20 — higher total, structured variety.</p>}
                                {assistMode === 'bodyweight' && <p>All assistance is bodyweight emphasis (push‑ups, chins, dips, core).</p>}
                                {assistMode === 'custom' && <p>Define each assistance slot manually in Step 4 after conversion.</p>}
                                <p className="text-gray-500">Switching modes later will override previous auto-picked items.</p>
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
                                            {dayRows.map((row, rowIdx) => (
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
                                            ))}
                                            {dayRows.length === 0 && <div className="text-xs text-gray-500">No assistance added.</div>}
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
