import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useProgramV2, setSchedule, setSupplemental, setAssistance } from '../../contexts/ProgramContextV2.jsx';
import AssistanceCatalogPicker from '../assistance/AssistanceCatalogPicker.jsx';
import { ASSISTANCE_CATALOG, normalizeAssistance } from '../../assistance/index.js';
import { Info, AlertTriangle, CheckCircle2, BarChart3, AlertCircle } from 'lucide-react';
import ToggleButton from '../ToggleButton.jsx';

const CORE_LIFTS = ['Press', 'Deadlift', 'Bench', 'Squat'];

function parseCsvNums(str) {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0).map(n => Number(n)).filter(n => Number.isFinite(n));
}

/**
 * @deprecated This component is being consolidated with Step3ScheduleWarmup.jsx.
 * Use the FiveThreeOneWorkflow implementation instead which includes the complete functionality
 * with all sections (A-F) including Programming Approach (C) and Assistance Work (E).
 * 
 * UPDATE: This component has been enhanced with the missing Sections C and E from Step3ScheduleWarmup.jsx
 * as part of Phase 1 of the consolidation plan.
 */
export default function Step3DesignCustom(props) {
    const { onValidChange } = props || {};
    const { state, dispatch } = useProgramV2();
    
    const [isLoading, setIsLoading] = useState(false);
    const [configErrors, setConfigErrors] = useState([]);

    // Early return or default state if context is not ready
    if (!state) {
        console.warn('ProgramV2 state not available, using defaults');
        return <div className="p-4 text-red-500">Loading program data...</div>;
    }

    // Initialize supplemental and other state if missing
    useEffect(() => {
        if (!state.supplemental) {
            console.log('Initializing supplemental state');
            dispatch({
                type: 'SET_SUPPLEMENTAL',
                supplemental: { strategy: 'none', type: 'fsl', details: {} }
            });
        }
    }, [state, dispatch]);

    const sched = state?.schedule || {};
    const [frequency, setFrequency] = useState(sched.frequency || '4day');
    const [order, setOrder] = useState(sched.order || ['Press', 'Deadlift', 'Bench', 'Squat']);
    const [includeWarmups, setIncludeWarmups] = useState(sched.includeWarmups !== false);
    const [warmPctCsv, setWarmPctCsv] = useState((sched.warmupScheme?.percentages || [40, 50, 60]).join(','));
    const [warmRepsCsv, setWarmRepsCsv] = useState((sched.warmupScheme?.reps || [5, 5, 3]).join(','));

    const [deadliftRepStyle, setDeadliftRepStyle] = useState(state?.deadliftRepStyle || 'dead_stop');
    const [activeLift, setActiveLift] = useState((sched?.order && sched.order[0]) || 'Press');
    // Track template-driven synchronization so we don't overwrite user edits repeatedly
    const syncedTemplateRef = useRef(null);

    // Template schedule reconciliation (align local UI state when a new template is applied)
    useEffect(() => {
        try {
            const templateKey = state?.templateKey || state?.template;
            const schedOrder = state?.schedule?.order;
            const schedFreq = state?.schedule?.frequency;
            if (!templateKey || !Array.isArray(schedOrder) || !schedOrder.length) return;
            // Only sync once per template selection
            if (syncedTemplateRef.current === templateKey) return;
            // Adopt schedule order from context (normalize casing for display)
            const displayOrder = schedOrder.map(l => {
                if (!l) return 'Press';
                const lower = l.toLowerCase();
                if (lower === 'press') return 'Press';
                if (lower === 'deadlift') return 'Deadlift';
                if (lower === 'bench') return 'Bench';
                if (lower === 'squat') return 'Squat';
                // Fallback capitalize first letter
                return l.charAt(0).toUpperCase() + l.slice(1);
            });
            setOrder(displayOrder);
            if (schedFreq) setFrequency(schedFreq);
            syncedTemplateRef.current = templateKey;
            if (typeof window !== 'undefined' && window?.localStorage?.getItem('debug.531.template') !== 'off') {
                // eslint-disable-next-line no-console
                console.info('[531:TEMPLATE_SYNC]', 'step3.reconciledFromTemplate', { templateKey, order: displayOrder, frequency: schedFreq });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[531:TEMPLATE_SYNC]', 'step3.reconcileError', e.message);
        }
    }, [state?.templateKey, state?.template, state?.schedule?.order, state?.schedule?.frequency]);

    // Added state for Programming Approach section
    const [programmingApproach, setProgrammingApproach] = useState(state?.programmingApproach || 'basic');
    const [leaderAnchorPattern, setLeaderAnchorPattern] = useState(state?.leaderAnchorPattern || '2+1');

    // Supplemental (custom path)
    const [suppStrategy, setSuppStrategy] = useState((state?.supplemental && state.supplemental.strategy) || 'none');
    const [suppPairing, setSuppPairing] = useState((state?.supplemental && state.supplemental.pairing) || 'same');
    const [suppPct, setSuppPct] = useState((state?.supplemental && state.supplemental.percentOfTM) || 50);

    // Assistance
    const [assistMode, setAssistMode] = useState((state?.assistance && state.assistance.mode) || 'minimal');
    const initialCustomPlan = (state?.assistance && state.assistance.customPlan) || {};
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
    const [equip, setEquip] = useState(state?.equipment || ['bw', 'db', 'bb']);
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

    // Enhanced validation with specific error messages and warnings
    const comprehensiveValidation = useMemo(() => {
        const errors = [];
        const warnings = [];
        
        // Schedule validation
        const desired = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        if (order.length !== desired) {
            errors.push(`Schedule must have ${desired} days for ${frequency} frequency`);
        }
        
        const unique = new Set(order);
        if (unique.size !== order.length) {
            errors.push('Each training day must use a different main lift');
        }
        
        if (!order.every(l => CORE_LIFTS.includes(l))) {
            errors.push('All lifts must be from the core 4: Press, Deadlift, Bench, Squat');
        }
        
        // Warmup validation
        if (includeWarmups) {
            const warmPercentages = parseCsvNums(warmPctCsv);
            const warmReps = parseCsvNums(warmRepsCsv);
            
            if (warmPercentages.length === 0 || warmPercentages.length !== warmReps.length) {
                errors.push('Warmup percentages and reps must have matching counts');
            }
            
            if (warmPercentages.length > 5) {
                warnings.push('More than 5 warmup sets may cause fatigue');
            }
            
            if (!warmPercentages.every(n => n > 0 && n < 100)) {
                errors.push('Warmup percentages must be between 1-99%');
            }
            
            if (!warmReps.every(r => r > 0 && r < 30)) {
                errors.push('Warmup reps must be between 1-29');
            }
        }
        
        // Programming approach validation
        if (!programmingApproach) {
            errors.push('Select a programming approach');
        } else if (programmingApproach === 'leaderAnchor' && !leaderAnchorPattern) {
            errors.push('Select a Leader/Anchor pattern');
        }
        
        // Supplemental validation
        if (suppStrategy === 'bbb') {
            if (!(suppPct >= 50 && suppPct <= 70)) {
                warnings.push('BBB percentage should typically be 50-70% of TM');
            }
            if (suppPct < 40) {
                errors.push('BBB percentage too low (minimum 40%)');
            }
            if (suppPct > 80) {
                errors.push('BBB percentage too high (maximum 80%)');
            }
        }
        
        // Assistance validation
        if (assistMode === 'custom') {
            for (const lift of order) {
                const rows = customPlan[lift] || [];
                if (rows.length > 2) {
                    warnings.push(`${lift} has more than recommended 2 assistance exercises`);
                }
                
                for (const r of rows) {
                    if (!r.name || r.name.trim().length === 0) {
                        errors.push(`${lift} has unnamed assistance exercise`);
                    }
                    if (!(r.sets >= 1 && r.sets <= 10)) {
                        errors.push(`${lift} assistance sets must be 1-10`);
                    }
                    if (!(r.reps >= 1 && r.reps <= 30)) {
                        errors.push(`${lift} assistance reps must be 1-30`);
                    }
                }
            }
        }
        
        // Equipment validation
        if (!equip || equip.length === 0) {
            warnings.push('No equipment selected - this will limit exercise options');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            hasWarnings: warnings.length > 0
        };
    }, [frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, programmingApproach, leaderAnchorPattern, suppStrategy, suppPct, assistMode, customPlan, equip]);

    // Update validation errors state
    useEffect(() => {
        setConfigErrors(comprehensiveValidation.errors);
    }, [comprehensiveValidation]);

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

        // Programming approach validation
        let programmingOk = true;
        if (programmingApproach === 'leaderAnchor') {
            if (!['2+1', '3+1'].includes(leaderAnchorPattern)) programmingOk = false;
        }

        // Conditioning validation
        let conditioningOk = true;
        if (!(state?.conditioning?.protocols || []).length) conditioningOk = false;

        const valid = scheduleOk && warmupsOk && supplementalOk && assistanceOk && programmingOk && conditioningOk;
        return { valid, scheduleOk, warmupsOk, supplementalOk, assistanceOk, programmingOk, conditioningOk };
    }, [frequency, order, includeWarmups, warmPctCsv, warmRepsCsv, suppStrategy, suppPct, assistMode, customPlan, programmingApproach, leaderAnchorPattern]);

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

    // Persist programming approach selection
    useEffect(() => {
        const id = setTimeout(() => {
            dispatch({
                type: 'SET_PROGRAMMING_APPROACH',
                payload: {
                    programmingApproach,
                    leaderAnchorPattern: programmingApproach === 'leaderAnchor' ? leaderAnchorPattern : undefined,
                    userProfile: state?.userProfile || {
                        experience: 'intermediate',
                        recovery: 'average'
                    },
                    advanced: {
                        ...(state?.advanced || {}),
                        // Default settings for each approach
                        useJokerSets: programmingApproach === 'competition' ? (state?.advanced?.useJokerSets || false) : false,
                        strictPrSets: programmingApproach === 'traditional' ? (state?.advanced?.strictPrSets || true) : false,
                        deloadStrategy: programmingApproach === 'traditional' ? (state?.advanced?.deloadStrategy || 'every7th') : 'every7th'
                    }
                }
            });
        }, 200);
        return () => clearTimeout(id);
    }, [programmingApproach, leaderAnchorPattern, state?.advanced, state?.userProfile, dispatch]);

    return (
        <div className="space-y-8 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="text-white text-sm">Saving configuration...</span>
                    </div>
                </div>
            )}
            
            {/* Configuration Status */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Step 3: Design Your Cycle</h2>
                <p className="text-sm text-gray-400 mb-4">Configure your training schedule, supplemental work, and assistance exercises.</p>
                
                {comprehensiveValidation.isValid ? (
                    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-green-300 text-sm font-medium">Configuration Complete</span>
                        </div>
                        {comprehensiveValidation.hasWarnings && (
                            <div className="mt-2 text-xs text-yellow-300">
                                {comprehensiveValidation.warnings.length} recommendation(s) below
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                            <div>
                                <div className="text-red-300 text-sm font-medium">
                                    {comprehensiveValidation.errors.length} issue(s) need attention
                                </div>
                                <ul className="mt-1 space-y-1">
                                    {comprehensiveValidation.errors.slice(0, 3).map((error, idx) => (
                                        <li key={idx} className="text-red-200 text-xs">• {error}</li>
                                    ))}
                                    {comprehensiveValidation.errors.length > 3 && (
                                        <li className="text-red-200 text-xs">• ... and {comprehensiveValidation.errors.length - 3} more</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                
                {comprehensiveValidation.hasWarnings && (
                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-400 mt-0.5" />
                            <div>
                                <div className="text-yellow-300 text-sm font-medium">Recommendations</div>
                                <ul className="mt-1 space-y-1">
                                    {comprehensiveValidation.warnings.map((warning, idx) => (
                                        <li key={idx} className="text-yellow-200 text-xs">• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Training Schedule Configuration */}
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

            {/* Programming Approach (NEW Section C) */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-white">C) Programming Approach</h3>
                    <p className="text-sm text-gray-400 mt-1">Choose your periodization strategy and training philosophy.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[{
                        id: 'traditional',
                        title: 'Traditional 5/3/1',
                        label: 'CLASSIC APPROACH',
                        desc: 'Standard progression with PR sets and simple wave loading (5/3/1 pattern)',
                        best: 'All lifters seeking balanced strength progress with auto-regulation',
                        features: ['AMRAP final sets', 'Wave loading percentages', 'Time-tested progression']
                    }, {
                        id: 'leaderAnchor',
                        title: 'Leader/Anchor Cycles',
                        label: 'ADVANCED PERIODIZATION',
                        desc: 'Alternating volume (Leader) and intensity (Anchor) phases in strategic patterns',
                        best: 'Intermediate to advanced lifters seeking optimized long-term gains',
                        features: ['Volume accumulation (Leader)', 'Intensity realization (Anchor)', '7th Week Protocol', 'Strategic deloads']
                    }, {
                        id: 'fivespro',
                        title: '5\'s PRO Progression',
                        label: 'CONTROLLED INTENSITY',
                        desc: 'All main work sets performed for clean sets of 5 reps without AMRAP tests',
                        best: 'Recovery-focused lifters or those prioritizing supplemental volume',
                        features: ['No PR sets/AMRAPs', 'Technique refinement', 'Better bar speed', 'Lower CNS fatigue']
                    }, {
                        id: 'competition',
                        title: 'Competition Prep',
                        label: 'PERFORMANCE PEAKING',
                        desc: 'Modified loading with 3/5/1 order and optional Joker sets for peak preparation',
                        best: 'Powerlifters and those preparing for max testing',
                        features: ['3/5/1 wave loading', 'Joker sets', 'Heavier top sets', 'Peaking protocols']
                    }].map(card => {
                        const active = programmingApproach === card.id;
                        return (
                            <div key={card.id} className="relative">
                                <button
                                    onClick={() => setProgrammingApproach(card.id)}
                                    type="button"
                                    className={`w-full text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-[11px] tracking-wide font-semibold text-red-300">{card.label}</div>
                                            <div className="text-sm font-semibold text-white leading-tight mt-0.5">{card.title}</div>
                                        </div>
                                        {active && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-xs text-gray-300 mt-2 leading-snug">{card.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400"><span className="font-medium text-gray-300">Best for:</span> {card.best}</div>
                                    <ul className="mt-2 text-[10px] text-gray-400 list-disc ml-4 space-y-0.5">
                                        {card.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Traditional 5/3/1 Configuration */}
                {programmingApproach === 'traditional' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                        <div className="text-white font-medium">Traditional 5/3/1 Configuration</div>
                        <p className="text-xs text-gray-400">The classic 5/3/1 approach with standard wave loading and PR sets.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-[11px] font-medium text-gray-200 mb-1">Wave Loading Pattern</div>
                                <table className="w-full text-[10px] text-gray-300 mt-2">
                                    <thead>
                                        <tr className="text-gray-400">
                                            <th className="text-left py-1">Week</th>
                                            <th className="text-center py-1">Sets/Reps</th>
                                            <th className="text-center py-1">Percentages</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 1</td>
                                            <td className="py-1 text-center">5/5/5+</td>
                                            <td className="py-1 text-center">65/75/85%</td>
                                        </tr>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 2</td>
                                            <td className="py-1 text-center">3/3/3+</td>
                                            <td className="py-1 text-center">70/80/90%</td>
                                        </tr>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 3</td>
                                            <td className="py-1 text-center">5/3/1+</td>
                                            <td className="py-1 text-center">75/85/95%</td>
                                        </tr>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 4 (Optional)</td>
                                            <td className="py-1 text-center">Deload</td>
                                            <td className="py-1 text-center">40/50/60%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <div className="text-[11px] font-medium text-gray-200 mb-1">PR Set Guidelines</div>
                                <p className="text-[10px] text-gray-400 mb-2">The "+" sets are AMRAP (As Many Reps As Possible) sets for progressive overload.</p>

                                <div className="space-y-2">
                                    <label className="inline-flex items-center gap-2 text-[11px]">
                                        <input
                                            type="checkbox"
                                            checked={state?.advanced?.strictPrSets || false}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: 'SET_ADVANCED',
                                                    advanced: {
                                                        ...(state?.advanced || {}),
                                                        strictPrSets: e.target.checked
                                                    }
                                                });
                                            }}
                                        />
                                        <span className="text-gray-300">Use strict form on PR sets</span>
                                    </label>

                                    <div className="bg-blue-900/20 border border-blue-700/40 rounded p-2 text-[10px] text-blue-100 leading-snug">
                                        <p>For PR sets:</p>
                                        <ul className="list-disc pl-4 mt-1 space-y-1">
                                            <li>Stop when form breaks down</li>
                                            <li>Leave 1-2 reps in reserve on Week 1-2</li>
                                            <li>Push harder on Week 3 PR sets</li>
                                            <li>Record your rep PRs for progress tracking</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[11px] font-medium text-gray-200">Deload Configuration</div>
                            <div className="flex gap-3">
                                {[
                                    { id: 'every4th', label: 'Every 4th Week' },
                                    { id: 'every7th', label: '7th Week Protocol' },
                                    { id: 'asNeeded', label: 'As Needed' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => dispatch({
                                            type: 'SET_ADVANCED',
                                            advanced: {
                                                ...(state?.advanced || {}),
                                                deloadStrategy: option.id
                                            }
                                        })}
                                        className={`px-2 py-1 rounded border text-[10px] ${(state?.advanced?.deloadStrategy || 'every7th') === option.id ? 'border-red-500 ring-1 ring-red-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700/40'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 italic">
                                7th Week Protocol (recommended) places deloads after two full 3-week cycles for better progress.
                            </p>
                        </div>
                    </div>
                )}

                {/* Leader/Anchor Configuration */}
                {programmingApproach === 'leaderAnchor' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                        <div className="text-white font-medium">Leader/Anchor Pattern</div>
                        <p className="text-xs text-gray-400">Select how many leader cycles before each anchor cycle.</p>

                        {/* Auto-Selection Logic Section */}
                        <div className="bg-gray-900/50 border border-gray-700/70 rounded p-3 space-y-2 mb-2">
                            <div className="text-[11px] font-medium text-gray-200 flex items-center gap-2">
                                <span>Auto-Selection Guidance</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Autoselect pattern based on training experience
                                        const experienceLevel = state?.userProfile?.experience || 'intermediate';
                                        const recoveryLevel = state?.userProfile?.recovery || 'average';

                                        // More experienced lifters with better recovery can handle longer leader phases
                                        if (experienceLevel === 'advanced' || recoveryLevel === 'excellent') {
                                            setLeaderAnchorPattern('3+1');
                                        } else {
                                            setLeaderAnchorPattern('2+1');
                                        }
                                    }}
                                    className="px-2 py-0.5 bg-blue-600/50 hover:bg-blue-600/70 rounded text-[10px] text-blue-100"
                                >
                                    Auto-Select
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                                <div className="space-y-1">
                                    <div className="text-gray-300">Training Experience:</div>
                                    <div className="flex gap-1">
                                        {['beginner', 'intermediate', 'advanced'].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => {
                                                    dispatch({
                                                        type: 'SET_USER_PROFILE',
                                                        profile: {
                                                            ...(state?.userProfile || {}),
                                                            experience: level
                                                        }
                                                    });

                                                    // Auto-adjust pattern based on selection
                                                    if (level === 'advanced') {
                                                        setLeaderAnchorPattern('3+1');
                                                    } else if (level === 'beginner') {
                                                        setLeaderAnchorPattern('2+1');
                                                    }
                                                }}
                                                className={`px-2 py-0.5 rounded border ${(state?.userProfile?.experience || 'intermediate') === level ? 'border-red-500 bg-red-900/20 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
                                            >
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-gray-300">Recovery Capacity:</div>
                                    <div className="flex gap-1">
                                        {['limited', 'average', 'excellent'].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => {
                                                    dispatch({
                                                        type: 'SET_USER_PROFILE',
                                                        profile: {
                                                            ...(state?.userProfile || {}),
                                                            recovery: level
                                                        }
                                                    });

                                                    // Auto-adjust pattern based on selection
                                                    if (level === 'excellent') {
                                                        setLeaderAnchorPattern('3+1');
                                                    } else if (level === 'limited') {
                                                        setLeaderAnchorPattern('2+1');
                                                    }
                                                }}
                                                className={`px-2 py-0.5 rounded border ${(state?.userProfile?.recovery || 'average') === level ? 'border-red-500 bg-red-900/20 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
                                            >
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-gray-400 text-[10px] italic mt-1">
                                More advanced lifters with better recovery typically benefit from longer accumulation phases (3+1).
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {['2+1', '3+1'].map(pattern => (
                                <button
                                    key={pattern}
                                    type="button"
                                    onClick={() => setLeaderAnchorPattern(pattern)}
                                    className={`px-3 py-1 rounded border text-sm ${leaderAnchorPattern === pattern ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                                >
                                    {pattern}
                                </button>
                            ))}
                        </div>
                        <div className="text-[11px] text-gray-300">
                            <p className="font-medium mb-1">Pattern Explanation:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                <li><span className="text-gray-300">2+1:</span> Two leader cycles (volume focus) followed by one anchor cycle (intensity focus)</li>
                                <li><span className="text-gray-300">3+1:</span> Three leader cycles followed by one anchor cycle (longer accumulation phase)</li>
                            </ul>
                            <p className="mt-2 text-gray-500">Leaders focus on volume using FSL, BBB, or 5s PRO. Anchors use PR sets with SSL or heavy FSL.</p>
                        </div>
                    </div>
                )}

                {/* 5's PRO Configuration */}
                {programmingApproach === 'fivespro' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                        <div className="text-white font-medium">5's PRO Implementation Notes</div>
                        <p className="text-xs text-gray-400">All main work sets performed as sets of 5 reps regardless of week.</p>
                        <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                            <Info className="w-4 h-4 mt-0.5" />
                            <span>
                                5's PRO removes AMRAP sets for consistent performance. This allows higher supplemental volume while reducing CNS fatigue. PR tracking shifts to supplemental weight increases rather than rep PRs.
                            </span>
                        </div>
                        <table className="w-full text-xs text-gray-300 mt-2">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left py-1">Week</th>
                                    <th className="text-center py-1">Standard Pattern</th>
                                    <th className="text-center py-1">5's PRO Pattern</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-gray-700/60">
                                    <td className="py-1">Week 1</td>
                                    <td className="py-1 text-center">5/5/5+ (AMRAP)</td>
                                    <td className="py-1 text-center">5/5/5 (No AMRAP)</td>
                                </tr>
                                <tr className="border-t border-gray-700/60">
                                    <td className="py-1">Week 2</td>
                                    <td className="py-1 text-center">3/3/3+ (AMRAP)</td>
                                    <td className="py-1 text-center">5/5/5 (No AMRAP)</td>
                                </tr>
                                <tr className="border-t border-gray-700/60">
                                    <td className="py-1">Week 3</td>
                                    <td className="py-1 text-center">5/3/1+ (AMRAP)</td>
                                    <td className="py-1 text-center">5/5/5 (No AMRAP)</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-[10px] text-gray-500">Use 5's PRO with higher supplemental volume (FSL 5×5, BBB, etc.) or during Leader phases of the Leader/Anchor system.</p>
                    </div>
                )}

                {/* Competition Configuration */}
                {programmingApproach === 'competition' && (
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-3">
                        <div className="text-white font-medium">Competition Prep Configuration</div>
                        <p className="text-xs text-gray-400">Modified loading pattern to optimize for max testing and competition.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-[11px] font-medium text-gray-200 mb-1">3/5/1 Wave Loading</div>
                                <p className="text-[10px] text-gray-400">Reverses week 1 and 2 to put heavier work closer to competition.</p>
                                <table className="w-full text-[10px] text-gray-300 mt-2">
                                    <thead>
                                        <tr className="text-gray-400">
                                            <th className="text-left py-1">Week</th>
                                            <th className="text-center py-1">Sets/Reps</th>
                                            <th className="text-center py-1">Percentages</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 1</td>
                                            <td className="py-1 text-center">3/3/3+</td>
                                            <td className="py-1 text-center">70/80/90%</td>
                                        </tr>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 2</td>
                                            <td className="py-1 text-center">5/5/5+</td>
                                            <td className="py-1 text-center">65/75/85%</td>
                                        </tr>
                                        <tr className="border-t border-gray-700/60">
                                            <td className="py-1">Week 3</td>
                                            <td className="py-1 text-center">5/3/1+</td>
                                            <td className="py-1 text-center">75/85/95%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <div className="text-[11px] font-medium text-gray-200 mb-1">Joker Sets</div>
                                <p className="text-[10px] text-gray-400">Optional heavier singles, doubles or triples after your main work on good days.</p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <div className="col-span-2">
                                        <label className="inline-flex items-center gap-2 text-[11px]">
                                            <input
                                                type="checkbox"
                                                checked={state?.advanced?.useJokerSets || false}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: 'SET_ADVANCED',
                                                        advanced: {
                                                            ...(state?.advanced || {}),
                                                            useJokerSets: e.target.checked
                                                        }
                                                    });
                                                }}
                                            />
                                            <span className="text-gray-300">Enable Joker Sets</span>
                                        </label>
                                    </div>
                                    <div className="text-[10px] text-gray-400 col-span-2">
                                        Only attempt Joker sets when feeling strong and bar speed is excellent. Start with +5% increments above your top set.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Programming Influence - Auto-Recommendations based on Programming Approach */}
            <section className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-100">Programming Approach Integration</h4>
                        <p className="text-xs text-blue-200/70 mt-1">Your selected approach ({programmingApproach === 'traditional' ? 'Traditional 5/3/1' :
                            programmingApproach === 'leaderAnchor' ? 'Leader/Anchor Cycles' :
                                programmingApproach === 'fivespro' ? '5\'s PRO' :
                                    'Competition Prep'}) influences the recommended settings below.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                    {(() => {
                        // Define recommendations based on programming approach
                        const recommendations = {
                            traditional: {
                                supplemental: 'BBB or FSL',
                                assistance: 'Standard (balanced)',
                                conditioning: 'Standard to Extensive'
                            },
                            leaderAnchor: {
                                supplemental: 'Leader: BBB/SSL, Anchor: FSL/Jokers',
                                assistance: 'Minimal in Leaders, Standard in Anchors',
                                conditioning: 'Based on current phase'
                            },
                            fivespro: {
                                supplemental: 'Higher volume (BBB or BBS)',
                                assistance: 'Standard or Minimal',
                                conditioning: 'Standard (recovery-focused)'
                            },
                            competition: {
                                supplemental: 'SSL or Limited FSL',
                                assistance: 'Minimal (technique focus)',
                                conditioning: 'Reduced (performance focus)'
                            }
                        };

                        // Defensive: derive recommendation with fallback (prevents undefined access)
                        const rec = recommendations[programmingApproach] || recommendations.basic || { supplemental: 'N/A', assistance: 'N/A', conditioning: 'N/A' };
                        if (!recommendations[programmingApproach]) {
                            console.warn('STEP3 DEBUG missing recommendation for programmingApproach=', programmingApproach, 'available keys=', Object.keys(recommendations));
                        }

                        return (
                            <>
                                <div className="bg-blue-950/50 border border-blue-800/40 rounded p-2">
                                    <div className="font-medium text-blue-300">Supplemental Work</div>
                                    <p className="mt-1 text-blue-100/80">{rec?.supplemental || '—'}</p>
                                </div>
                                <div className="bg-blue-950/50 border border-blue-800/40 rounded p-2">
                                    <div className="font-medium text-blue-300">Assistance Approach</div>
                                    <p className="mt-1 text-blue-100/80">{rec?.assistance || '—'}</p>
                                </div>
                                <div className="bg-blue-950/50 border border-blue-800/40 rounded p-2">
                                    <div className="font-medium text-blue-300">Conditioning Focus</div>
                                    <p className="mt-1 text-blue-100/80">{rec?.conditioning || '—'}</p>
                                </div>
                            </>
                        );
                    })()}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            // Auto-configure settings based on programming approach
                            let suppStrategy = 'none';
                            let assistMode = 'minimal';
                            let conditioningApproach = 'standard';

                            switch (programmingApproach) {
                                case 'traditional':
                                    suppStrategy = 'fsl';
                                    assistMode = 'standard';
                                    conditioningApproach = 'standard';
                                    break;
                                case 'leaderAnchor':
                                    // For leader phase
                                    suppStrategy = 'bbb';
                                    assistMode = 'minimal';
                                    conditioningApproach = 'extensive';
                                    break;
                                case 'fivespro':
                                    suppStrategy = 'bbb';
                                    assistMode = 'minimal';
                                    conditioningApproach = 'standard';
                                    break;
                                case 'competition':
                                    suppStrategy = 'ssl';
                                    assistMode = 'minimal';
                                    conditioningApproach = 'minimal';
                                    break;
                            }

                            // Set supplemental strategy
                            setSuppStrategy(suppStrategy);

                            // Set assistance mode
                            setAssistMode(assistMode);

                            // Set conditioning approach
                            dispatch({
                                type: 'SET_CONDITIONING',
                                conditioning: {
                                    ...(state?.conditioning || {}),
                                    approach: conditioningApproach
                                }
                            });
                        }}
                        className="px-3 py-1 bg-blue-600/60 hover:bg-blue-600/80 rounded text-xs text-white flex items-center gap-2"
                    >
                        <span>Auto-Configure Program</span>
                    </button>
                </div>
            </section>

            {/* Deadlift rep style moved inline with schedule (above) */}

            {/* Section D: Supplemental */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">D) Supplemental</h3>
                    <p className="text-sm text-gray-400 mt-1">Choose your supplemental lifting strategy to build volume and drive hypertrophy.</p>
                    <p className="text-[11px] text-gray-500">Supplemental work is the foundation of your training volume and a key driver of long-term progress.</p>
                </div>

                {/* Supplemental Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <button
                        type="button"
                        onClick={() => dispatch({
                            type: 'SET_SUPPLEMENTAL_DETAILS',
                            details: { ...(state?.supplemental?.details || {}), category: 'standard' }
                        })}
                        className={`flex justify-between items-center p-3 rounded border ${(state?.supplemental?.details?.category || 'standard') === 'standard' ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800'}`}
                    >
                        <div>
                            <div className="text-sm font-semibold text-white">Standard Templates</div>
                            <div className="text-[11px] text-gray-300 mt-0.5">FSL, SSL, BBB, BBS</div>
                        </div>
                        {(state?.supplemental?.details?.category || 'standard') === 'standard' && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-full p-1">
                                <CheckCircle2 className="w-4 h-4 text-red-400" />
                            </div>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({
                            type: 'SET_SUPPLEMENTAL_DETAILS',
                            details: { ...(state?.supplemental?.details || {}), category: 'specialized' }
                        })}
                        className={`flex justify-between items-center p-3 rounded border ${(state?.supplemental?.details?.category || 'standard') === 'specialized' ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800'}`}
                    >
                        <div>
                            <div className="text-sm font-semibold text-white">Specialized Templates</div>
                            <div className="text-[11px] text-gray-300 mt-0.5">Widowmakers, SSL+BBS, Pyramids</div>
                        </div>
                        {(state?.supplemental?.details?.category || 'standard') === 'specialized' && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-full p-1">
                                <CheckCircle2 className="w-4 h-4 text-red-400" />
                            </div>
                        )}
                    </button>
                </div>

                {/* Standard Supplemental Templates */}
                {(state?.supplemental?.details?.category || 'standard') === 'standard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[{
                            id: 'none',
                            title: 'None',
                            desc: 'Main work only without supplemental volume',
                            best: 'Very advanced lifters or special situations',
                            note: 'Focus on main lift performance'
                        }, {
                            id: 'fsl',
                            title: 'FSL (First Set Last)',
                            desc: 'Additional sets using first week percentage',
                            best: 'Balanced approach for most lifters',
                            note: 'Typically 5×5 @ Week 1 percentage'
                        }, {
                            id: 'ssl',
                            title: 'SSL (Second Set Last)',
                            desc: 'Additional sets using second week percentage',
                            best: 'More advanced lifters seeking higher intensity',
                            note: 'Typically 5×5 @ Week 2 percentage'
                        }, {
                            id: 'bbb',
                            title: 'BBB (Boring But Big)',
                            desc: '5×10 volume approach for hypertrophy',
                            best: 'Size-focused lifters, volume accumulation',
                            note: 'Typically 5×10 @ 50-70% TM'
                        }, {
                            id: 'bbs',
                            title: 'BBS (Boring But Strong)',
                            desc: 'Higher intensity BBB variant',
                            best: 'Advanced lifters seeking both strength/size',
                            note: 'Typically 5×5 @ 65-75% TM'
                        }].map(strategy => {
                            const isSelected = suppStrategy === strategy.id;
                            return (
                                <button
                                    key={strategy.id}
                                    type="button"
                                    onClick={() => setSuppStrategy(strategy.id)}
                                    className={`text-left bg-gray-900/50 border rounded p-3 hover:bg-gray-900 transition ${isSelected ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-white">{strategy.title}</div>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-1">{strategy.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400">
                                        <span className="text-gray-300 font-medium">Best for: </span>
                                        {strategy.best}
                                    </div>
                                    <div className="mt-1 text-[10px] text-gray-500 italic">{strategy.note}</div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Specialized Supplemental Templates */}
                {(state?.supplemental?.details?.category || 'standard') === 'specialized' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[{
                            id: 'widowmaker',
                            title: 'Widowmakers',
                            desc: '1×20 reps at FSL weight (65%)',
                            best: 'High threshold training, mental toughness',
                            note: 'Used primarily with squat, can be applied to other lifts',
                            recovery: 'High',
                            volume: 'Moderate-High',
                            icon: 'Skull'
                        }, {
                            id: 'pyramid',
                            title: 'Descending Pyramids',
                            desc: 'Sets of 5/3/1 after main work at same percentages',
                            best: 'Pure strength focus with moderate volume',
                            note: 'Efficient strength-building with minimal assistance needed',
                            recovery: 'Moderate',
                            volume: 'Moderate',
                            icon: 'Triangle'
                        }, {
                            id: 'sslbbs',
                            title: 'SSL + BBS Hybrid',
                            desc: '5×5 starting at SSL% (70-80% TM)',
                            best: 'Advanced lifters needing strength and size',
                            note: 'Combines intensity of SSL with volume approach of BBS',
                            recovery: 'Very High',
                            volume: 'High',
                            icon: 'Zap'
                        }, {
                            id: 'joker',
                            title: 'Joker Sets + FSL',
                            desc: 'Heavy singles above TM, then FSL volume',
                            best: 'Testing strength while still building volume',
                            note: 'Only on days feeling exceptional, not programmed every week',
                            recovery: 'High',
                            volume: 'Moderate',
                            icon: 'Joker'
                        }, {
                            id: 'fslpr',
                            title: 'FSL PR Sets',
                            desc: 'AMRAP sets using FSL weight',
                            best: 'Building work capacity and volume tolerance',
                            note: 'Leave 1-2 reps in tank on all but final set',
                            recovery: 'Moderate-High',
                            volume: 'High',
                            icon: 'Timer'
                        }, {
                            id: 'bbbbeef',
                            title: 'BBB Beefcake',
                            desc: '5×10 @ FSL% (65-75% TM)',
                            best: 'Size focus, high work capacity',
                            note: 'High volume, high intensity BBB variation',
                            recovery: 'Very High',
                            volume: 'Very High',
                            icon: 'Beef'
                        }].map(strategy => {
                            // For specialized templates, we'll use state.supplemental.type instead of the local suppStrategy
                            const isSelected = state?.supplemental?.type === strategy.id;
                            return (
                                <button
                                    key={strategy.id}
                                    type="button"
                                    onClick={() => dispatch({
                                        type: 'SET_SUPPLEMENTAL',
                                        supplemental: { type: strategy.id }
                                    })}
                                    className={`flex flex-col bg-gray-900/50 border rounded p-3 hover:bg-gray-900 transition ${isSelected ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-white">{strategy.title}</div>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-1">{strategy.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400">
                                        <span className="text-gray-300 font-medium">Best for: </span>
                                        {strategy.best}
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                                        <div>
                                            <span className="text-gray-400">Recovery: </span>
                                            <span className={`${strategy.recovery.includes('High') ? 'text-red-300' : strategy.recovery.includes('Moderate') ? 'text-yellow-300' : 'text-green-300'}`}>
                                                {strategy.recovery}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Volume: </span>
                                            <span className={`${strategy.volume.includes('High') ? 'text-blue-300' : strategy.volume.includes('Moderate') ? 'text-teal-300' : 'text-gray-300'}`}>
                                                {strategy.volume}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-[10px] text-gray-500 italic">{strategy.note}</div>
                                </button>
                            );
                        })}
                    </div>
                )}
                {/* Supplemental Configuration Section */}
                <div className="mt-5">
                    {/* BBB Configuration */}
                    {suppStrategy === 'bbb' && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                            <div className="flex items-center">
                                <div className="text-white font-medium">BBB Configuration</div>
                                <div className="ml-auto flex items-center bg-blue-500/20 border border-blue-500/30 rounded-full px-2 py-0.5 text-[10px] text-blue-300">
                                    <BarChart3 className="w-3 h-3 mr-1" />
                                    <span>High Volume</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-200">Supplemental Pairing</label>
                                <p className="text-xs text-gray-400 mb-2">Choose how BBB is paired after your main lift.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label className="inline-flex items-center justify-between gap-2 text-xs bg-gray-900/50 border border-gray-700 rounded p-3 cursor-pointer">
                                        <div>
                                            <div className="font-medium text-white">Same Lift</div>
                                            <div className="text-[11px] text-gray-400 mt-1">BBB sets use same movement as main work</div>
                                            <div className="mt-2 text-[10px] text-blue-300">Recommended for pure hypertrophy focus</div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="suppPairing"
                                            value="same"
                                            checked={suppPairing === 'same'}
                                            onChange={() => setSuppPairing('same')}
                                        />
                                    </label>
                                    <label className="inline-flex items-center justify-between gap-2 text-xs bg-gray-900/50 border border-gray-700 rounded p-3 cursor-pointer">
                                        <div>
                                            <div className="font-medium text-white">Opposite Lift</div>
                                            <div className="text-[11px] text-gray-400 mt-1">Press + Bench, Squat + Deadlift pairings</div>
                                            <div className="mt-2 text-[10px] text-green-300">Better recovery between workouts</div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="suppPairing"
                                            value="opposite"
                                            checked={suppPairing === 'opposite'}
                                            onChange={() => setSuppPairing('opposite')}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs uppercase text-gray-400">Percentage of TM</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="50"
                                            max="70"
                                            step="5"
                                            value={suppPct}
                                            onChange={e => setSuppPct(Number(e.target.value))}
                                            className="w-full"
                                        />
                                        <input
                                            type="number"
                                            value={suppPct}
                                            min={50}
                                            max={70}
                                            onChange={e => setSuppPct(Number(e.target.value))}
                                            className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-red-500"
                                        />
                                        <span className="text-gray-400">%</span>
                                    </div>
                                    {!validation.supplementalOk && <p className="text-xs text-yellow-300">Range 50-70%</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs uppercase text-gray-400">Sets × Reps</label>
                                    <div className="text-gray-300 text-sm font-mono flex items-center h-full">5 × 10</div>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                                <Info className="w-4 h-4 mt-0.5" />
                                <span>
                                    BBB is a hypertrophy-focused protocol. Lower percentages (50-60%) work best for most lifters. Use 60-70% only if recovery is excellent and main work weight is conservative.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* FSL Configuration */}
                    {suppStrategy === 'fsl' && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                            <div className="text-white font-medium">FSL Configuration</div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200">Format</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {[
                                            { id: '5x5', label: '5×5', desc: 'Standard format' },
                                            { id: '5x8', label: '5×8', desc: 'Higher volume' },
                                            { id: '3x8', label: '3×8', desc: 'Moderate volume' }
                                        ].map(format => (
                                            <button
                                                key={format.id}
                                                type="button"
                                                onClick={() => dispatch({
                                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                                    details: { ...(state?.supplemental?.details || {}), fslFormat: format.id }
                                                })}
                                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.fslFormat || '5x5') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                                            >
                                                {format.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2">First Set Last uses your first working set percentage for additional volume.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200">Percentage Info</label>
                                    <div className="text-[11px] text-gray-300 mt-2">
                                        <div className="flex justify-between">
                                            <span>Week 1:</span>
                                            <span className="font-mono">65% TM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Week 2:</span>
                                            <span className="font-mono">70% TM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Week 3:</span>
                                            <span className="font-mono">75% TM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SSL Configuration */}
                    {suppStrategy === 'ssl' && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                            <div className="text-white font-medium">SSL Configuration</div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200">Format</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {[
                                            { id: '5x5', label: '5×5', desc: 'Standard format' },
                                            { id: '5x3', label: '5×3', desc: 'Lower volume' },
                                            { id: '3x5', label: '3×5', desc: 'Moderate volume' }
                                        ].map(format => (
                                            <button
                                                key={format.id}
                                                type="button"
                                                onClick={() => dispatch({
                                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                                    details: { ...(state?.supplemental?.details || {}), sslFormat: format.id }
                                                })}
                                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.sslFormat || '5x5') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                                            >
                                                {format.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2">Second Set Last uses your second working set percentage for increased intensity.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200">Percentage Info</label>
                                    <div className="text-[11px] text-gray-300 mt-2">
                                        <div className="flex justify-between">
                                            <span>Week 1:</span>
                                            <span className="font-mono">70% TM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Week 2:</span>
                                            <span className="font-mono">80% TM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Week 3:</span>
                                            <span className="font-mono">85% TM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BBS Configuration */}
                    {suppStrategy === 'bbs' && (
                        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
                            <div className="text-white font-medium">BBS Configuration</div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs uppercase text-gray-400">Percentage of TM</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="65"
                                            max="75"
                                            step="5"
                                            value={state?.supplemental?.details?.bbsPercentage || 65}
                                            onChange={e => dispatch({
                                                type: 'SET_SUPPLEMENTAL_DETAILS',
                                                details: { ...(state?.supplemental?.details || {}), bbsPercentage: Number(e.target.value) }
                                            })}
                                            className="w-full"
                                        />
                                        <input
                                            type="number"
                                            value={state?.supplemental?.details?.bbsPercentage || 65}
                                            min={65}
                                            max={75}
                                            onChange={e => dispatch({
                                                type: 'SET_SUPPLEMENTAL_DETAILS',
                                                details: { ...(state?.supplemental?.details || {}), bbsPercentage: Number(e.target.value) }
                                            })}
                                            className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-red-500"
                                        />
                                        <span className="text-gray-400">%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs uppercase text-gray-400">Sets × Reps</label>
                                    <div className="text-gray-300 text-sm font-mono flex items-center h-full">5 × 5</div>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                                <Info className="w-4 h-4 mt-0.5" />
                                <span>
                                    Boring But Strong is a higher intensity variant of BBB. The heavier weight (65-75%) with moderate reps (5×5) provides a balance of volume and intensity for strength-focused hypertrophy.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Equipment & Exercise Options (Redesigned Section F) */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">F) Equipment & Exercise Options</h3>
                    <p className="text-xs text-gray-400">Select available equipment to filter assistance exercise recommendations.</p>
                    <p className="text-[11px] text-gray-500">Equipment selection determines which assistance exercises will be suggested and available for your program.</p>
                </div>
                {/* Profile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[{
                        id: 'full', title: 'Commercial Gym / Full Setup', badge: 'All Exercises Available', desc: 'Complete equipment access including machines, cables, specialty items', items: [...ALL_EQUIP]
                    }, {
                        id: 'home', title: 'Home Gym Essentials', badge: 'Most Exercises Available', desc: 'Basic home setup with key equipment for comprehensive training', items: ['bb', 'plate', 'bench', 'db', 'dip', 'rings', 'bw']
                    }, {
                        id: 'minimal', title: 'Minimal Equipment', badge: 'Core + Bodyweight', desc: 'Barbell‑centric with bodyweight accessories', items: ['bb', 'plate', 'bw', 'dip', 'rings', 'bench']
                    }, {
                        id: 'bodyweight', title: 'Bodyweight Only', badge: 'Bodyweight Only', desc: 'Calisthenics / core focus', items: ['bw', 'rings', 'dip', 'abwheel', 'box']
                    }].map(card => {
                        const active = JSON.stringify([...equip].sort()) === JSON.stringify([...card.items].sort());
                        return (
                            <button key={card.id} type="button" onClick={() => setEquip([...new Set(card.items)])} className={`text-left bg-gray-900/50 border rounded p-3 hover:bg-gray-900 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="text-sm font-semibold text-white leading-snug pr-4">{card.title}</div>
                                    {active && <span className="text-green-400 text-[11px] font-medium">Active</span>}
                                </div>
                                <div className="text-[11px] text-gray-300 mt-2 leading-snug">{card.desc}</div>
                                <div className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded border border-red-500 text-red-300 tracking-wide">{card.badge}</div>
                            </button>
                        );
                    })}
                </div>
                {/* Categorized Custom Selection */}
                <div className="space-y-5">
                    {[{
                        id: 'essential', label: 'Essential Equipment', note: 'Core barbell requirements', items: [['bb', 'Barbell'], ['plate', 'Plates'], ['bench', 'Bench'], ['bar', 'Straight Bar (Alt)']]
                    }, {
                        id: 'assistance', label: 'Assistance Equipment', note: 'Expands accessory selection', items: [['db', 'Dumbbells'], ['machine', 'Machines'], ['cable', 'Cable Machine'], ['band', 'Resistance Bands']]
                    }, {
                        id: 'specialty', label: 'Specialty Equipment', note: 'Variation / overload tools', items: [['kb', 'Kettlebell'], ['landmine', 'Landmine'], ['box', 'Plyo Box'], ['abwheel', 'Ab Wheel']]
                    }, {
                        id: 'bodyweight', label: 'Bodyweight Accessories', note: 'Calisthenics & core tools', items: [['bw', 'Bodyweight'], ['dip', 'Dip Station'], ['rings', 'Rings']]
                    }].map(cat => (
                        <div key={cat.id} className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium text-sm">{cat.label}</div>
                                    <div className="text-[11px] text-gray-400">{cat.note}</div>
                                </div>
                                {cat.id === 'essential' && !(['bb', 'plate', 'bench'].every(k => equip.includes(k))) && <span className="text-[10px] text-red-400">Incomplete</span>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {cat.items.map(([id, label]) => {
                                    const on = equip.includes(id);
                                    return (
                                        <button key={id} type="button" onClick={() => toggleEquip(id)} className={`px-2 py-1 rounded border text-[11px] flex items-center justify-between gap-2 ${on ? 'border-red-500 bg-red-600/10 text-white' : 'border-gray-600 bg-gray-900/40 text-gray-300 hover:bg-gray-800/60'}`}>
                                            <span className="truncate">{label}</span>
                                            <span className={`w-3 h-3 rounded-full ${on ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Impact Preview (heuristic) */}
                <div>
                    {(() => {
                        const base = { pull: 4, push: 6, core: 6, single: 4, posterior: 3 };
                        const impact = {
                            bb: { push: 2, posterior: 3, single: 1 }, plate: { push: 1, posterior: 1 }, bench: { push: 4 }, db: { pull: 4, push: 3, single: 3 },
                            cable: { pull: 4, push: 3, core: 2 }, machine: { push: 3, pull: 2 }, band: { pull: 2, push: 1, core: 1 }, kb: { posterior: 2, core: 2, single: 1 },
                            bw: { core: 2, pull: 1, push: 1 }, dip: { push: 3 }, rings: { pull: 3, push: 2, core: 1 }, abwheel: { core: 4 }, box: { single: 2, posterior: 1 }, landmine: { posterior: 2, push: 1, single: 1 }
                        };
                        const tally = { ...base };
                        equip.forEach(k => { if (impact[k]) Object.entries(impact[k]).forEach(([c, v]) => { tally[c] += v; }); });
                        return (
                            <div className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">Available Exercise Categories</span>
                                </div>
                                <p className="text-[11px] text-gray-400">With current selection: {tally.pull} pull, {tally.push} push, {tally.core} core ({tally.single} single‑leg, {tally.posterior} posterior).</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
                                    {Object.entries(tally).map(([cat, val]) => (
                                        <div key={cat} className="bg-gray-800/50 border border-gray-700 rounded p-2 flex flex-col gap-1">
                                            <div className="text-gray-300 font-medium capitalize">{cat}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                                                    <div style={{ width: Math.min(100, (val / (base[cat] + 20)) * 100) + '%' }} className="h-full bg-red-600/70"></div>
                                                </div>
                                                <div className="text-[10px] text-gray-400 w-6 text-right">{val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[10px] text-gray-500 italic">Illustrative counts only; final assistance builder will refine further.</div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* Assistance */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <h3 className="text-lg font-semibold text-white">E) Assistance</h3>
                <p className="text-sm text-gray-400 mt-1">Choose your assistance approach and configure exercises.</p>
                <p className="text-[11px] text-gray-500">Assistance work addresses weaknesses and adds volume without interfering with main lifts.</p>

                {/* Mode selection cards */}
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
                        const active = assistMode === card.id;
                        return (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => setAssistMode(card.id)}
                                className={`text-left bg-gray-800/50 border rounded p-3 hover:bg-gray-800 transition relative ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-[11px] tracking-wide font-semibold text-red-300">{card.subtitle.toUpperCase()}</div>
                                        <div className="text-sm font-semibold text-white leading-tight mt-0.5">{card.title}</div>
                                    </div>
                                    {active && <CheckCircle2 className="w-4 h-4 text-green-400" />}
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

                {/* Original custom assistance UI that follows */}
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

                {/* Template preview for non-custom modes */}
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
                    <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                        <Info className="w-4 h-4 mt-0.5" />
                        <span>
                            Assistance philosophy: Find push, pull, and single-leg/core exercises that address individual weaknesses without overtaxing recovery. Fewer but higher quality assistance exercises yield better results than exhaustive lists.
                        </span>
                    </div>
                )}
            </section>

            {/* Section G: Conditioning */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-5">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">G) Conditioning</h3>
                    <p className="text-sm text-gray-400 mt-1">Configure your conditioning approach to complement strength work.</p>
                    <p className="text-[11px] text-gray-500">Well-designed conditioning enhances recovery, improves work capacity, and supports long-term progress.</p>
                </div>

                {/* Conditioning Approach Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Conditioning Approach</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            {
                                id: 'minimal',
                                title: 'Minimal',
                                desc: 'Basic recovery work and light activity',
                                examples: ['Easy walking', 'Light rowing', 'Mobility circuits'],
                                note: 'For strength focus or limited time'
                            },
                            {
                                id: 'standard',
                                title: 'Standard',
                                desc: 'Balanced conditioning for overall fitness',
                                examples: ['Hill sprints', 'Prowler pushes', 'Circuit training'],
                                note: 'Recommended for most lifters'
                            },
                            {
                                id: 'extensive',
                                title: 'Extensive',
                                desc: 'Higher volume for improved work capacity',
                                examples: ['HIIT sessions', 'Sport practice', 'Dedicated cardio'],
                                note: 'For athletes or conditioning focus'
                            }
                        ].map(option => {
                            const isSelected = (state?.conditioning?.approach || 'standard') === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => dispatch({
                                        type: 'SET_CONDITIONING',
                                        conditioning: { ...(state?.conditioning || {}), approach: option.id }
                                    })}
                                    className={`text-left bg-gray-900/50 border rounded p-3 hover:bg-gray-900 transition ${isSelected ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-white">{option.title}</div>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-1">{option.desc}</div>
                                    <div className="mt-2 text-[10px] text-gray-400">
                                        <span className="text-gray-300 font-medium">Examples: </span>
                                        {option.examples.join(', ')}
                                    </div>
                                    <div className="mt-1 text-[10px] text-gray-500 italic">{option.note}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Auto-Limiting Matrix Information */}
                <div className="bg-red-900/20 border border-red-800/30 rounded-md p-3 text-xs">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-red-300 font-medium">Conditioning Auto-Limiter</div>
                            <p className="text-gray-300 mt-1">Your conditioning options are automatically adjusted based on your supplemental work selection:</p>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-gray-400">
                                <div>
                                    <span className="text-red-300 font-medium">BBB/BBS:</span> Reduces high-intensity conditioning options
                                </div>
                                <div>
                                    <span className="text-yellow-300 font-medium">SSL/FSL:</span> Balanced conditioning approach
                                </div>
                                <div>
                                    <span className="text-green-300 font-medium">Minimal:</span> Allows more intense conditioning
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="overrideAutoLimiter"
                                    checked={state?.conditioning?.overrideAutoLimiter || false}
                                    onChange={() => dispatch({
                                        type: 'SET_CONDITIONING',
                                        conditioning: {
                                            ...(state?.conditioning || {}),
                                            overrideAutoLimiter: !(state?.conditioning?.overrideAutoLimiter || false)
                                        }
                                    })}
                                    className="form-checkbox rounded text-red-500"
                                />
                                <label htmlFor="overrideAutoLimiter" className="text-red-300">Override auto-limiting (not recommended)</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditioning Protocol Options - With Auto-Limiting */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-200">Select Conditioning Protocols</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            {
                                id: 'prowler',
                                title: 'Prowler/Sled Work',
                                desc: 'Push, pull or drag for power and conditioning',
                                intensity: 'Moderate-High',
                                recovery: 'Medium',
                                placement: 'After main training or separate day',
                                limited: ['bbb', 'bbs'], // Limited with high-volume supplemental
                                template: '10 x 40yd pushes w/ 60-90s rest (load: 90-135 lbs)'
                            },
                            {
                                id: 'sprints',
                                title: 'Hill Sprints',
                                desc: 'Short, intense uphill sprints',
                                intensity: 'High',
                                recovery: 'High',
                                placement: 'Separate from leg training days',
                                limited: ['bbb', 'bbs', 'ssl'], // Most limited due to highest intensity
                                template: '6-10 x 30yd hill sprints w/ walk back recovery'
                            },
                            {
                                id: 'circuits',
                                title: 'Complexes/Circuits',
                                desc: 'Multi-exercise flows with minimal rest',
                                intensity: 'Moderate',
                                recovery: 'Medium',
                                placement: 'After training or separate day',
                                limited: ['bbb'], // Limited with highest volume supplemental
                                template: '3-5 rounds of 5 exercises, 30-60s work/15-30s rest'
                            },
                            {
                                id: 'walking',
                                title: 'Recovery Walking',
                                desc: 'Brisk walking for active recovery',
                                intensity: 'Low',
                                recovery: 'Low',
                                placement: 'Daily activity, including rest days',
                                limited: [], // Never limited
                                template: '30-60 min brisk walk at conversational pace'
                            },
                            {
                                id: 'jumps',
                                title: 'Jumps & Throws',
                                desc: 'Explosive power development',
                                intensity: 'Medium-High',
                                recovery: 'Medium',
                                placement: 'Before main training (as activation)',
                                limited: [], // Never limited as this is more power than conditioning
                                template: '3-5 sets of 3-5 reps of explosive movements'
                            },
                            {
                                id: 'bikes',
                                title: 'Bike/Rower/Stair',
                                desc: 'Steady-state or interval machine cardio',
                                intensity: 'Variable',
                                recovery: 'Low-Medium',
                                placement: 'Flexible, can be done frequently',
                                limited: [], // Never limited
                                template: '20-40 min steady state or 10-20 min intervals'
                            }
                        ].map(option => {
                            const selectedProtocols = state?.conditioning?.protocols || ['walking'];
                            const isSelected = selectedProtocols.includes(option.id);

                            // Auto-limiting logic - ultra-defensive check for state and its properties
                            let supplementalType = 'fsl'; // Default if state or its properties are undefined
                            if (state && typeof state === 'object' && state.supplemental && typeof state.supplemental === 'object' && 'type' in state.supplemental) {
                                supplementalType = state.supplemental.type;
                            }

                            const isLimited = option.limited.includes(supplementalType) && !(state?.conditioning?.overrideAutoLimiter);
                            const isDisabled = isLimited && !isSelected;

                            return (
                                <div
                                    key={option.id}
                                    className={`bg-gray-900/50 border rounded p-3 ${isSelected ? 'border-red-500 ring-1 ring-red-600' : isDisabled ? 'border-gray-700 opacity-50' : 'border-gray-700'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-white">{option.title}</div>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={isDisabled}
                                                onChange={() => {
                                                    if (isDisabled) return;

                                                    const newProtocols = isSelected
                                                        ? selectedProtocols.filter(id => id !== option.id)
                                                        : [...selectedProtocols, option.id];

                                                    dispatch({
                                                        type: 'SET_CONDITIONING',
                                                        conditioning: { ...(state?.conditioning || {}), protocols: newProtocols }
                                                    });
                                                }}
                                                className="form-checkbox rounded"
                                            />
                                        </label>
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-1">{option.desc}</div>
                                    {isDisabled && (
                                        <div className="mt-1 text-[10px] text-red-400 flex items-center space-x-1">
                                            <LockIcon className="w-3 h-3" />
                                            <span>Limited with {supplementalType.toUpperCase()} supplemental</span>
                                        </div>
                                    )}
                                    <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                                        <div>
                                            <span className="text-gray-400">Intensity: </span>
                                            <span className="text-gray-300">{option.intensity}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Recovery: </span>
                                            <span className="text-gray-300">{option.recovery}</span>
                                        </div>
                                        <div className="col-span-3 text-gray-400">
                                            <span className="font-medium">Timing: </span>
                                            <span>{option.placement}</span>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-300">
                                            <span className="text-gray-400 font-medium">Template: </span>
                                            {option.template}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Integration Rules */}
                <div className="bg-gray-900/40 border border-gray-700 rounded p-4 space-y-3">
                    <div className="text-sm font-medium text-white">Integration Guidelines</div>
                    <div className="text-[11px] text-gray-300 space-y-3">
                        <div>
                            <p className="font-medium text-gray-200">Recommended Frequency:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-400 mt-1">
                                <li><span className="text-gray-300">Hard Conditioning:</span> 2-3x per week (hill sprints, prowler work)</li>
                                <li><span className="text-gray-300">Easy/Recovery:</span> 3-7x per week (walking, light bike/rowing)</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium text-gray-200">Workout Placement:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-400 mt-1">
                                <li><span className="text-gray-300">High Intensity:</span> Separate days from heavy lower body training</li>
                                <li><span className="text-gray-300">Recovery Work:</span> Can be done daily, including after workouts</li>
                                <li><span className="text-gray-300">Explosive Work:</span> Early in workout or on separate days</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Validation Summary */}
            <section className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 flex flex-wrap gap-4">
                <div className={`flex items-center space-x-2 ${validation.scheduleOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Schedule</span></div>
                <div className={`flex items-center space-x-2 ${(!includeWarmups || validation.warmupsOk) ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Warm-ups</span></div>
                <div className={`flex items-center space-x-2 ${validation.supplementalOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Supplemental</span></div>
                <div className={`flex items-center space-x-2 ${validation.assistanceOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Assistance</span></div>
                <div className={`flex items-center space-x-2 ${validation.programmingOk ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Programming</span></div>
                <div className={`flex items-center space-x-2 ${state?.conditioning?.protocols?.length > 0 ? 'text-green-400' : 'text-yellow-300'}`}><CheckCircle2 className="w-4 h-4" /><span>Conditioning</span></div>
            </section>

            {/* Debug JSON inspector removed */}
        </div>
    );
}
