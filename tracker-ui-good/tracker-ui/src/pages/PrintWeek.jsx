// src/pages/PrintWeek.jsx
import React, { useMemo, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight } from '../lib/fiveThreeOne/math';
import { getStandardWarmups } from '../lib/fiveThreeOne/validate';
import { getTrainingMaxesFromAny, getLoadingOptionFromAny, getLiftOrderFromAny, getClientMetaFromAny } from '../lib/fiveThreeOne/stateBridge.js';
import './print.css';

const LOADS = {
    1: [ // Option 1 (default)
        { pct: 65, reps: 5, amrap: false },
        { pct: 75, reps: 5, amrap: false },
        { pct: 85, reps: 5, amrap: true },
    ],
    2: [
        { pct: 75, reps: 5, amrap: false },
        { pct: 80, reps: 5, amrap: false },
        { pct: 85, reps: 5, amrap: true },
    ],
    3: [
        { pct: 75, reps: 5, amrap: false },
        { pct: 85, reps: 3, amrap: false },
        { pct: 95, reps: 1, amrap: true },
    ],
    4: [
        { pct: 40, reps: 5, amrap: false },
        { pct: 50, reps: 5, amrap: false },
        { pct: 60, reps: 5, amrap: false },
    ],
};

// per-week mapping depends on loading option 1 vs 2
function getWeekSets(week, loadingOption = 1) {
    if (Number(week) === 1) return loadingOption === 1 ? LOADS[1] : LOADS[2];
    if (Number(week) === 2) return [
        ...(loadingOption === 1
            ? [{ pct: 70, reps: 3 }, { pct: 80, reps: 3 }, { pct: 90, reps: 3, amrap: true }]
            : [{ pct: 80, reps: 3 }, { pct: 85, reps: 3 }, { pct: 90, reps: 3, amrap: true }]
        ),
    ];
    if (Number(week) === 3) return LOADS[3];
    if (Number(week) === 4) return LOADS[4];
    return LOADS[1];
}

const LIFT_LABELS = {
    squat: 'Squat',
    bench: 'Bench Press',
    deadlift: 'Deadlift',
    overhead_press: 'Overhead Press',
    press: 'Overhead Press',
};

function liftKeysFromOrder(order) {
    // Normalize possible values
    return order.map(k => (k === 'overhead_press' ? 'overhead_press' : k));
}

export default function PrintWeek() {
    const { unit, roundingIncrement } = useSettings();
    const [week, setWeek] = useState(() => {
        const urlWeek = new URLSearchParams(location.search).get('week');
        return Number(urlWeek || 1);
    });

    // Try to read any context you may have passed down (not required here)
    const programContext = null;

    const trainingMaxes = useMemo(
        () => getTrainingMaxesFromAny(programContext),
        [programContext]
    );
    const loadingOption = useMemo(
        () => getLoadingOptionFromAny(programContext),
        [programContext]
    );
    const liftOrder = useMemo(
        () => liftKeysFromOrder(getLiftOrderFromAny(programContext)),
        [programContext]
    );
    const clientMeta = useMemo(
        () => getClientMetaFromAny(programContext),
        [programContext]
    );

    const dayRows = liftOrder.map((liftKey) => {
        const tm = Number(trainingMaxes?.[liftKey]) || 0;
        const warmups = getStandardWarmups(tm).map(w => ({
            ...w,
            weight: toDisplayWeight(w.weight),
        }));
        const mainSets = getWeekSets(week, loadingOption).map(s => {
            const weight = toDisplayWeight(percentOfTM(tm, s.pct, roundingIncrement));
            return { ...s, weight };
        });
        return { liftKey, liftName: LIFT_LABELS[liftKey] || liftKey, warmups, mainSets, tm };
    });

    return (
        <div className="print-container">
            <div className="print-toolbar no-print">
                <div className="left">
                    <h1>Print Week</h1>
                    <div className="sub">
                        {clientMeta.clientName} • Unit: {unit} • Rounding: {roundingIncrement} {unit}
                    </div>
                </div>
                <div className="right">
                    <label>Week: </label>
                    <select value={week} onChange={e => setWeek(Number(e.target.value))}>
                        <option value={1}>Week 1</option>
                        <option value={2}>Week 2</option>
                        <option value={3}>Week 3</option>
                        <option value={4}>Deload</option>
                    </select>
                    <button onClick={() => window.print()} className="btn">Print</button>
                </div>
            </div>

            <div className="sheet">
                <div className="sheet-header">
                    <div>
                        <div className="title">{clientMeta.clientName} — 5/3/1 Program</div>
                        <div className="meta">Week {week} • Loading Option {loadingOption} • Unit: {unit}</div>
                    </div>
                    <div className="notes">Notes:</div>
                </div>

                {dayRows.map((row, idx) => (
                    <div className="day" key={row.liftKey}>
                        <div className="day-hd">{idx + 1}. {row.liftName} (TM: {toDisplayWeight(row.tm)} {unit})</div>
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th>Type</th><th>% TM</th><th>Reps</th><th>Weight</th><th>Check</th><th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {row.warmups.map((w, i) => (
                                    <tr key={`w${i}`}>
                                        <td>Warm‑up</td>
                                        <td>{w.pct}%</td>
                                        <td>{w.reps}</td>
                                        <td>{w.weight} {unit}</td>
                                        <td><input type="checkbox" /></td>
                                        <td></td>
                                    </tr>
                                ))}
                                {row.mainSets.map((s, i) => (
                                    <tr key={`m${i}`}>
                                        <td>{i < row.mainSets.length - 1 ? 'Set' : (s.amrap ? 'Top +' : 'Set')}</td>
                                        <td>{s.pct}%</td>
                                        <td>{s.reps}{s.amrap ? '+' : ''}</td>
                                        <td>{s.weight} {unit}</td>
                                        <td><input type="checkbox" /></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                <div className="footer">
                    Generated by Powerhouse Tracker • {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
