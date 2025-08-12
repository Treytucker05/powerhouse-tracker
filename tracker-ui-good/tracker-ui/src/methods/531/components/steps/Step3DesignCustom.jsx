import React, { useEffect, useMemo, useState } from 'react';
import { useProgramV2, setSchedule, setSupplemental, setAssistance } from '../../contexts/ProgramContextV2.jsx';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

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

    // Dev inspector toggle
    const [showInspector, setShowInspector] = useState(false);

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

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 3 — Custom Design</h2>
                <p className="text-gray-400 text-sm">Configure schedule order, warm-ups, supplemental strategy, assistance style, and deadlift rep style.</p>
            </div>

            {/* Schedule */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">A) Schedule</h3>
                    <div className="flex space-x-2">
                        <button onClick={setCanonical} className="px-3 py-1.5 text-xs rounded border border-gray-600 text-gray-300 hover:border-red-500">Canonical Order</button>
                        <button onClick={resetOrder} className="px-3 py-1.5 text-xs rounded border border-gray-600 text-gray-300 hover:border-red-500">Reset Order</button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        {['4day', '3day', '2day'].map(f => (
                            <label key={f} className={`flex items-center space-x-2 px-3 py-2 rounded border text-sm cursor-pointer ${frequency === f ? 'border-red-500 bg-red-600/10 text-red-300' : 'border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                                <input type="radio" className="hidden" checked={frequency === f} onChange={() => setFrequency(f)} />
                                <span>{f.replace('day', '-day')}</span>
                            </label>
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
                            <button onClick={() => { setWarmPctCsv('40,50,60'); setWarmRepsCsv('5,5,3'); }} className="px-3 py-1.5 text-xs rounded border border-gray-600 text-gray-300 hover:border-red-500">Standard</button>
                            <button onClick={() => { setWarmPctCsv('40,50'); setWarmRepsCsv('5,5'); }} className="px-3 py-1.5 text-xs rounded border border-gray-600 text-gray-300 hover:border-red-500">Minimal</button>
                        </div>
                    )}
                </div>
                <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-xs text-blue-100 flex space-x-2">
                    <Info className="w-4 h-4 mt-0.5" />
                    <span>Standard Wendler warm-up: 40/50/60% x 5/5/3 prepares joints & primes pattern.</span>
                </div>
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
                <div className="flex space-x-4 text-sm">
                    {['dead_stop', 'touch_and_go'].map(style => (
                        <label key={style} className={`px-3 py-2 rounded border cursor-pointer ${deadliftRepStyle === style ? 'border-red-500 bg-red-600/10 text-red-300' : 'border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                            <input type="radio" className="hidden" checked={deadliftRepStyle === style} onChange={() => setDeadliftRepStyle(style)} />
                            {style.replace('_', ' ')}
                        </label>
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
                <div className="flex flex-wrap gap-3 text-sm">
                    {['none', 'bbb'].map(s => (
                        <label key={s} className={`px-3 py-2 rounded border cursor-pointer ${suppStrategy === s ? 'border-red-500 bg-red-600/10 text-red-300' : 'border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                            <input type="radio" className="hidden" checked={suppStrategy === s} onChange={() => setSuppStrategy(s)} />
                            {s === 'none' ? 'None' : 'Boring But Big'}
                        </label>
                    ))}
                </div>
                {suppStrategy === 'bbb' && (
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs uppercase text-gray-400 mb-1">Pairing</label>
                            <div className="flex space-x-2">
                                {['same', 'opposite'].map(p => (
                                    <button key={p} onClick={() => setSuppPairing(p)} className={`px-3 py-2 rounded border ${suppPairing === p ? 'border-red-500 bg-red-600/20 text-red-300' : 'border-gray-600 text-gray-300 hover:border-gray-500'} text-xs font-medium`}>{p}</button>
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
                            <div className="text-xs text-gray-400 bg-gray-800/60 border border-gray-700 rounded p-3 leading-snug">
                                {assistMode === 'minimal' && 'Low accessory volume focusing on core lifts recovery.'}
                                {assistMode === 'triumvirate' && 'Two focused assistance movements per day.'}
                                {assistMode === 'periodization_bible' && 'Layered volume blocks targeting multiple patterns.'}
                                {assistMode === 'bodyweight' && 'Accessory emphasis on bodyweight movements.'}
                            </div>
                        )}
                    </div>
                    {assistMode === 'custom' && (
                        <div className="md:col-span-2 space-y-4">
                            {order.map((lift, idx) => (
                                <div key={lift} className="bg-gray-800/40 border border-gray-700 rounded p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-white">{lift} Day Assistance</h4>
                                        <button onClick={() => addCustomRow(idx)} className="text-xs px-2 py-1 rounded border border-gray-600 text-gray-300 hover:border-red-500">Add</button>
                                    </div>
                                    <div className="space-y-3">
                                        {(customPlan[lift] || []).map((row, rowIdx) => (
                                            <div key={rowIdx} className="grid grid-cols-12 gap-2 items-end">
                                                <div className="col-span-5">
                                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Name</label>
                                                    <input value={row.name} onChange={e => updateCustomRow(lift, rowIdx, { name: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" placeholder="Movement" />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Sets</label>
                                                    <input type="number" value={row.sets} min={1} max={10} onChange={e => updateCustomRow(lift, rowIdx, { sets: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Reps</label>
                                                    <input type="number" value={row.reps} min={1} max={30} onChange={e => updateCustomRow(lift, rowIdx, { reps: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-red-500" />
                                                </div>
                                                <div className="col-span-1 flex items-center">
                                                    <button onClick={() => removeCustomRow(lift, rowIdx)} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
                                                </div>
                                            </div>
                                        ))}
                                        {(customPlan[lift] || []).length === 0 && (
                                            <div className="text-xs text-gray-500">No assistance added.</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {assistMode === 'custom' && !validation.assistanceOk && (
                    <div className="text-xs text-yellow-300 flex items-start space-x-2 bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <span>Custom assistance invalid: ensure names & reps/sets within allowed ranges.</span>
                    </div>
                )}
            </section>

            {/* Validation Summary */}
            <section className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 flex flex-wrap gap-4">
                <div className={`flex items-center space-x-2 ${validation.scheduleOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Schedule</span></div>
                <div className={`flex items-center space-x-2 ${(!includeWarmups || validation.warmupsOk) ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Warm-ups</span></div>
                <div className={`flex items-center space-x-2 ${validation.supplementalOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Supplemental</span></div>
                <div className={`flex items-center space-x-2 ${validation.assistanceOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Assistance</span></div>
            </section>

            {/* Dev Inspector */}
            {import.meta.env.MODE !== 'production' && (
                <section className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 space-y-3 text-xs">
                    <button onClick={() => setShowInspector(s => !s)} className="px-3 py-1.5 rounded border border-gray-600 text-gray-300 hover:border-red-500">{showInspector ? 'Hide' : 'Show'} Inspector</button>
                    {showInspector && (
                        <>
                            <pre className="max-h-64 overflow-auto bg-black/40 p-3 rounded text-[11px] leading-snug text-gray-200">{JSON.stringify({ frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, suppStrategy, suppPairing, suppPct, assistMode, customPlan, deadliftRepStyle }, null, 2)}</pre>
                            <button onClick={() => navigator.clipboard.writeText(JSON.stringify({ frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, suppStrategy, suppPairing, suppPct, assistMode, customPlan, deadliftRepStyle }, null, 2))} className="text-gray-400 hover:text-gray-200">Copy JSON</button>
                        </>
                    )}
                </section>
            )}
        </div>
    );
}
