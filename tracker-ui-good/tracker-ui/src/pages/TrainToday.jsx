// src/pages/TrainToday.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle, Clipboard, Play, SkipForward, AlertTriangle } from 'lucide-react';
import { getToday, advanceActiveCycle } from '../lib/fiveThreeOne/persistCycle.js';
import { addSession, estimate1RM, getHistory } from '../lib/fiveThreeOne/history.js';
import { useToast } from '../components/ui/Toast.jsx';
import { liftKey, getAmrapFromSession } from '../lib/fiveThreeOne/pr.js';
import { useNavigate, Link } from 'react-router-dom';

function Card({ title, children }) {
    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded px-4 py-3">
            <div className="text-white font-medium mb-2">{title}</div>
            {children}
        </div>
    );
}

function SetRow({ idx, set, onChange }) {
    const isAmrap = !!set.amrap; // prefer snapshot flag if present
    const [reps, setReps] = useState(set.reps ?? (isAmrap ? '' : set.targetReps ?? set.minReps ?? ''));
    const [done, setDone] = useState(false);

    useEffect(() => {
        onChange({ idx, reps: reps === '' ? null : Number(reps), done, weight: set.weight, amrap: isAmrap, percent: set.percent });
    }, [reps, done]);

    return (
        <div className="flex items-center justify-between gap-3 py-1">
            <div className="text-gray-300 text-sm">
                <span className="text-gray-400 mr-2">Set {idx + 1}:</span>
                <span className="font-mono">{set.weight} lb</span>
                {set.percent != null && <span className="text-gray-500"> ({set.percent}%)</span>}
                {' · '}
                {isAmrap ? <span className="text-red-300 font-semibold">AMRAP</span> : <span>{set.reps ?? set.targetReps ?? set.minReps} reps</span>}
            </div>
            <div className="flex items-center gap-2">
                <input
                    className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100 text-sm"
                    placeholder={isAmrap ? 'reps' : 'done'}
                    value={reps}
                    onChange={(e) => setReps(e.target.value.replace(/[^\d]/g, ''))}
                />
                <label className="flex items-center gap-1 text-sm text-gray-300">
                    <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
                    Done
                </label>
            </div>
        </div>
    );
}

export default function TrainToday() {
    const navigate = useNavigate();
    const { show } = useToast();
    const { active, today, weekObj } = useMemo(() => getToday(), []);
    const [warmupDone, setWarmupDone] = useState(() => (today?.warmups || []).map(() => false));
    const [mainResults, setMainResults] = useState(() => (today?.mainSets || []).map(() => ({ reps: null, done: false })));
    const [assistDone, setAssistDone] = useState(() => (today?.assistance || []).map(() => false));
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // If no active cycle, suggest starting one
        if (!active || !today) return;
        // Normalize mainResults length in case of shape drift
        if (mainResults.length !== (today.mainSets?.length || 0)) {
            setMainResults((today.mainSets || []).map(() => ({ reps: null, done: false })));
        }
    }, [active, today]);

    if (!active || !today) {
        return (
            <div className="max-w-3xl mx-auto p-4 space-y-4">
                <div className="bg-yellow-900/20 border border-yellow-700 rounded p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-yellow-100 text-sm">
                        <div className="font-semibold mb-1">No active 5/3/1 cycle found.</div>
                        <p>Go to the 5/3/1 Program Builder and press <b>Start Cycle</b>.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/program')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                    <Clipboard className="w-4 h-4" /> Open Program Builder
                </button>
            </div>
        );
    }

    const amrapIndex = (today.mainSets?.length || 0) - 1;
    const amrapSet = today.mainSets?.[amrapIndex];
    const amrapReps = mainResults?.[amrapIndex]?.reps || 0;
    const amrapE1RM = estimate1RM(amrapSet?.weight || 0, amrapReps);

    const markAllWarmups = () => setWarmupDone((today.warmups || []).map(() => true));

    const onChangeMain = (payload) => {
        setMainResults(prev => {
            const next = [...prev];
            next[payload.idx] = { reps: payload.reps, done: payload.done, weight: payload.weight, amrap: payload.amrap, percent: payload.percent };
            return next;
        });
    };

    const onComplete = () => {
        const session = {
            id: `531-${Date.now()}`,
            when: new Date().toISOString(),
            week: active.currentWeek,
            dayIndex: active.currentDayIndex,
            day: today.day,
            lift: today.lift,
            liftLabel: today.liftLabel,
            tm: today.tm,
            warmups: (today.warmups || []).map((w, i) => ({ ...w, done: !!warmupDone[i] })),
            mainSets: (today.mainSets || []).map((s, i) => ({
                ...s,
                loggedReps: mainResults[i]?.reps ?? null,
                done: !!mainResults[i]?.done
            })),
            assistance: (today.assistance || []).map((a, i) => ({ ...a, done: !!assistDone[i] })),
            notes,
            e1RM: amrapE1RM
        };
        // PR check against prior history for this lift
        const past = getHistory().filter(h => liftKey(h) === liftKey(session));
        const amrap = getAmrapFromSession(session);
        const didPR = amrap ? (() => {
            const best = past.reduce((mx, h) => {
                const a = getAmrapFromSession(h);
                return Math.max(mx, a?.e1RM || 0);
            }, 0);
            return (amrap.e1RM || 0) > best;
        })() : false;

        addSession(session);
        advanceActiveCycle();
        setSaved(true);
        if (didPR) {
            show(`PR! ${liftKey(session)} e1RM ${amrap.e1RM} — ${amrap.weight}×${amrap.reps}`, { kind: 'success', ttl: 4500 });
        } else {
            show('Session saved.', { kind: 'info', ttl: 2000 });
        }
        setTimeout(() => navigate('/'), 600);
    };

    const onSkip = () => {
        advanceActiveCycle();
        navigate(0); // refresh page to show next day
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl text-white font-semibold flex items-center gap-2">
                        <Activity className="w-6 h-6 text-red-400" /> Train Today
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Week {active.currentWeek} • Day {active.currentDayIndex + 1} • <b>{today.day}</b> • {today.liftLabel}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/print-week" className="px-3 py-1.5 rounded border border-gray-600 text-gray-100 hover:bg-gray-800 text-sm">
                        Print Week
                    </Link>
                    {saved && (
                        <div className="bg-green-900/20 border border-green-600 text-green-200 text-sm px-3 py-2 rounded inline-flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Session saved
                        </div>
                    )}
                </div>
            </div>

            {/* TMs recap */}
            <Card title="Training Max Recap">
                <div className="text-sm text-gray-300">
                    {today.liftLabel}: <span className="font-mono">{today.tm || 0} lb</span>
                </div>
            </Card>

            {/* Warm-ups */}
            <Card title="Warm-up Sets (40/50/60%)">
                {(today.warmups || []).length === 0 ? (
                    <div className="text-gray-400 text-sm">No warm-ups found.</div>
                ) : (
                    <div className="space-y-2">
                        {(today.warmups || []).map((w, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="text-gray-300">
                                    <span className="text-gray-400 mr-2">Set {i + 1}:</span>
                                    <span className="font-mono">{w.weight} lb</span>
                                    {w.percent != null && <span className="text-gray-500"> ({w.percent}%)</span>}
                                    {' · '}
                                    <span>{w.reps ?? 5} reps</span>
                                </div>
                                <label className="flex items-center gap-1 text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={!!warmupDone[i]}
                                        onChange={(e) => {
                                            const next = [...warmupDone];
                                            next[i] = e.target.checked;
                                            setWarmupDone(next);
                                        }}
                                    />
                                    Done
                                </label>
                            </div>
                        ))}
                        <button
                            onClick={markAllWarmups}
                            className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-600 text-gray-100 hover:bg-gray-800 text-xs"
                        >
                            Mark All Done
                        </button>
                    </div>
                )}
            </Card>

            {/* Main sets */}
            <Card title="Main Sets">
                {(today.mainSets || []).length === 0 ? (
                    <div className="text-gray-400 text-sm">No main sets found.</div>
                ) : (
                    <div className="space-y-2">
                        {(today.mainSets || []).map((s, i) => (
                            <SetRow key={i} idx={i} set={s} onChange={onChangeMain} />
                        ))}
                        {/* AMRAP guidance + e1RM */}
                        <div className="mt-2 text-xs text-gray-400">
                            Last set is AMRAP in Weeks 1–3. Stop 1 rep shy of failure; keep form tight.
                            {amrapSet && (
                                <div className="mt-1">
                                    e1RM from AMRAP ({amrapSet.weight} lb × {amrapReps || 0}):{' '}
                                    <span className="text-gray-200 font-mono">{amrapE1RM || 0} lb</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* Assistance */}
            <Card title="Assistance">
                {(today.assistance || []).length === 0 ? (
                    <div className="text-gray-400 text-sm">No assistance selected for this lift.</div>
                ) : (
                    <div className="space-y-2">
                        {(today.assistance || []).map((a, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="text-gray-300">
                                    {a.name || a.title || 'Assistance'}{' '}
                                    {a.sets && a.reps && <span className="text-gray-500">({a.sets}×{a.reps})</span>}
                                </div>
                                <label className="flex items-center gap-1 text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={!!assistDone[i]}
                                        onChange={(e) => {
                                            const next = [...assistDone];
                                            next[i] = e.target.checked;
                                            setAssistDone(next);
                                        }}
                                    />
                                    Done
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Notes */}
            <Card title="Notes">
                <textarea
                    className="w-full min-h-[90px] bg-gray-800 border border-gray-700 rounded p-2 text-gray-100 text-sm"
                    placeholder="Cues, pain, bar speed, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={onComplete}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                    <Play className="w-4 h-4" /> Complete Session
                </button>
                <button
                    onClick={onSkip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-600 text-gray-100 hover:bg-gray-800"
                >
                    <SkipForward className="w-4 h-4" /> Skip Day
                </button>
            </div>
        </div>
    );
}
