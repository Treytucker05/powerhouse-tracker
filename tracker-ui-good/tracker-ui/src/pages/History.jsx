// src/pages/History.jsx
import React, { useMemo, useState } from 'react';
import { Trophy, History as HistoryIcon, Filter, Download, Trash2, ChevronDown, CalendarClock, Activity } from 'lucide-react';
import { getHistory, clearHistory } from '../lib/fiveThreeOne/history';
import { getBestE1RMPerLift, getRepRecords, liftKey, getAmrapFromSession } from '../lib/fiveThreeOne/pr';
import { getActiveCycle } from '../lib/fiveThreeOne/persistCycle';
import { Link } from 'react-router-dom';

function Card({ title, children, right }) {
    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium">{title}</div>
                <div>{right}</div>
            </div>
            {children}
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="flex flex-col">
            <div className="text-gray-400 text-xs">{label}</div>
            <div className="text-white font-semibold">{value}</div>
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-600/40 text-xs">
            {children}
        </span>
    );
}

// Quick CSV from history
function toCSV(rows) {
    const headers = [
        'when', 'week', 'day', 'lift', 'tm', 'setIndex', 'weight', 'reps', 'amrap', 'e1RM', 'notes'
    ];
    const lines = [headers.join(',')];
    for (const s of rows) {
        const k = liftKey(s);
        const amrap = getAmrapFromSession(s);
        (s.mainSets || []).forEach((set, i) => {
            const e1 = (i === (s.mainSets.length - 1) || set.amrap) ? (amrap?.e1RM || '') : '';
            lines.push([
                JSON.stringify(s.when),
                s.week ?? '',
                JSON.stringify(s.day),
                JSON.stringify(k),
                s.tm ?? '',
                i + 1,
                set.weight ?? '',
                set.loggedReps ?? '',
                set.amrap ? 'Y' : '',
                e1,
                JSON.stringify(s.notes || '')
            ].join(','));
        });
    }
    return lines.join('\n');
}

function downloadBlob(name, data, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function History() {
    const [liftFilter, setLiftFilter] = useState('All');
    const history = useMemo(() => getHistory(), []);
    const best = useMemo(() => getBestE1RMPerLift(history), [history]);
    const reps = useMemo(() => getRepRecords(history), [history]);
    const cycle = useMemo(() => getActiveCycle(), []);

    const lifts = useMemo(() => {
        const s = new Set(history.map(liftKey).filter(Boolean));
        return ['All', ...Array.from(s)];
    }, [history]);

    const filtered = useMemo(() => {
        return history
            .slice()
            .reverse()
            .filter(s => liftFilter === 'All' ? true : liftKey(s) === liftFilter);
    }, [history, liftFilter]);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HistoryIcon className="w-6 h-6 text-red-400" />
                    <h2 className="text-2xl text-white font-semibold">History & PRs</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/train" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm">
                        <Activity className="w-4 h-4" /> Train Today
                    </Link>
                    <button
                        onClick={() => downloadBlob('history.json', JSON.stringify(history, null, 2), 'application/json')}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-600 text-gray-100 hover:bg-gray-800 text-sm"
                    >
                        <Download className="w-4 h-4" /> Export JSON
                    </button>
                    <button
                        onClick={() => downloadBlob('history.csv', toCSV(history), 'text/csv')}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-600 text-gray-100 hover:bg-gray-800 text-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button
                        onClick={() => { if (confirm('Clear all history? This cannot be undone.')) { clearHistory(); location.reload(); } }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded border border-red-700/60 text-red-300 hover:bg-red-900/20 text-sm"
                        title="Clear local history"
                    >
                        <Trash2 className="w-4 h-4" /> Clear
                    </button>
                </div>
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Cycle Status" right={<CalendarClock className="w-4 h-4 text-gray-400" />}>
                    <div className="flex items-center justify-between">
                        <Stat label="Status" value={cycle?.status || 'active'} />
                        <Stat label="Week" value={cycle?.currentWeek ?? '-'} />
                        <Stat label="Day" value={(cycle?.currentDayIndex ?? 0) + 1} />
                    </div>
                </Card>

                <Card title="Best e1RM by Lift" right={<Trophy className="w-4 h-4 text-yellow-400" />}>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.keys(best).length === 0 && <div className="text-gray-400">No PRs yet.</div>}
                        {Object.entries(best).map(([lift, v]) => (
                            <div key={lift} className="flex items-center justify-between">
                                <div className="text-gray-300">{lift}</div>
                                <div className="text-white font-mono">{v.e1RM} lb</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card
                    title="Filter"
                    right={<Filter className="w-4 h-4 text-gray-400" />}
                >
                    <select
                        value={liftFilter}
                        onChange={(e) => setLiftFilter(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100"
                    >
                        {lifts.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </Card>
            </div>

            {/* Rep Records */}
            <Card title="Rep Records (by AMRAP weight)">
                {Object.keys(reps).length === 0 ? (
                    <div className="text-gray-400 text-sm">No rep records yet.</div>
                ) : (
                    Object.entries(reps).map(([lift, table]) => (
                        <div key={lift} className="mb-4">
                            <div className="text-white font-semibold mb-1">{lift}</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400">
                                            <th className="text-left py-1">Weight (lb)</th>
                                            <th className="text-left py-1">Best Reps</th>
                                            <th className="text-left py-1">e1RM</th>
                                            <th className="text-left py-1">When</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(table)
                                            .sort((a, b) => Number(a[0]) - Number(b[0]))
                                            .map(([w, rec]) => (
                                                <tr key={w} className="border-t border-gray-800">
                                                    <td className="py-1 text-gray-200 font-mono">{w}</td>
                                                    <td className="py-1 text-gray-200">{rec.reps}</td>
                                                    <td className="py-1 text-gray-200 font-mono">{rec.e1RM}</td>
                                                    <td className="py-1 text-gray-400">{new Date(rec.when).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </Card>

            {/* Session list */}
            <Card title={`Sessions (${filtered.length})`}>
                {filtered.length === 0 ? (
                    <div className="text-gray-400 text-sm">No sessions found.</div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map((s) => {
                            const amrap = getAmrapFromSession(s);
                            const isPR = (() => {
                                // e1RM PR if bigger than any previous for this lift up to that date
                                const lift = liftKey(s);
                                const prev = getBestE1RMPerLift(
                                    getHistory().filter(h => h.when < s.when && liftKey(h) === lift)
                                )[lift];
                                const pastBest = prev?.e1RM ?? 0;
                                const now = (amrap?.e1RM ?? Number(s?.e1RM ?? 0)) || 0;
                                return now && now > pastBest;
                            })();

                            return (
                                <div key={s.id} className="border border-gray-800 rounded p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-white font-medium">
                                            {liftKey(s)} — Week {s.week}, Day {Number(s.dayIndex ?? s.dayIndex) + 1 || '?'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isPR && <Badge>PR</Badge>}
                                            <div className="text-xs text-gray-400">{new Date(s.when).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-300">
                                        {s.day && <span className="text-gray-400 mr-2">{s.day} ·</span>}
                                        TM: <span className="font-mono">{s.tm ?? '-'}</span>
                                        {amrap?.e1RM ? (
                                            <>
                                                {' · '}e1RM: <span className="font-mono">{amrap.e1RM} lb</span>
                                                {' · '}AMRAP: <span className="font-mono">{amrap.weight}×{amrap.reps}</span>
                                            </>
                                        ) : null}
                                    </div>
                                    <details className="mt-2">
                                        <summary className="text-gray-400 text-xs inline-flex items-center gap-1 cursor-pointer">
                                            <ChevronDown className="w-3 h-3" /> Sets
                                        </summary>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {(s.mainSets || []).map((set, i) => (
                                                <div key={i} className="bg-gray-900/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-300">
                                                    Set {i + 1}: <span className="font-mono">{set.weight} lb</span>{' · '}
                                                    {set.amrap ? <span className="text-red-300">AMRAP</span> : <span>{set.reps ?? set.targetReps ?? set.minReps} reps</span>}
                                                    {set.loggedReps != null && <> {' · '}logged: <span className="font-mono">{set.loggedReps}</span></>}
                                                </div>
                                            ))}
                                        </div>
                                        {(s.assistance || []).length > 0 && (
                                            <div className="mt-2 text-sm text-gray-400">
                                                Assistance: {(s.assistance || []).map((a, i) => a.name || a.title || `Ex ${i + 1}`).join(', ')}
                                            </div>
                                        )}
                                        {s.notes && <div className="mt-2 text-sm text-gray-400">Notes: {s.notes}</div>}
                                    </details>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
