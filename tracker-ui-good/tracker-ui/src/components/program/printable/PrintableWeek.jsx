// src/components/program/printable/PrintableWeek.jsx
import React, { useMemo, useState } from 'react';
import './printable.css';
import { buildWarmups, buildMainSets } from '../../../lib/fiveThreeOne/percentTables.js';
import { deriveLiftDayMap, DAYS } from '../../../lib/fiveThreeOne/scheduleHelpers.js';

const LIFT_LABEL = {
    press: 'Overhead Press',
    bench: 'Bench Press',
    squat: 'Squat',
    deadlift: 'Deadlift',
    press: 'Overhead Press' // in case schedule stores 'press'
};

function calcSetsForLift(tm, loadingOption, week, includeWarmups, roundTo = 5) {
    const warmups = buildWarmups(tm, includeWarmups, roundTo);
    const mains = buildMainSets(tm, loadingOption, week, roundTo);
    return [...warmups, ...mains];
}

export default function PrintableWeek({ state }) {
    const [week, setWeek] = useState(1);
    const [includeWarmups, setIncludeWarmups] = useState(true);
    const [roundInc, setRoundInc] = useState(5);

    // Current wizard shape stores per-lift data under state.lifts with .tm
    const lifts = state?.lifts || {};
    const tms = {
        press: Number(lifts?.press?.tm ?? 0),
        bench: Number(lifts?.bench?.tm ?? 0),
        squat: Number(lifts?.squat?.tm ?? 0),
        deadlift: Number(lifts?.deadlift?.tm ?? 0)
    };
    const loadingOption = Number(state?.loading?.option ?? state?.loadingOption ?? state?.cycle?.loadingOption ?? 1);

    const dayMap = useMemo(() => deriveLiftDayMap(state), [state]);
    const dayEntries = DAYS.map(d => ({ day: d, lift: dayMap[d] || null }))
        .filter(x => !!x.lift);

    return (
        <div className="printable-wrap">
            <div className="printable-controls no-print">
                <div className="row">
                    <label>Week</label>
                    <select value={week} onChange={e => setWeek(Number(e.target.value))}>
                        <option value={1}>Week 1 (5s)</option>
                        <option value={2}>Week 2 (3s)</option>
                        <option value={3}>Week 3 (5/3/1)</option>
                        <option value={4}>Week 4 (Deload)</option>
                    </select>

                    <label>Include Warm-ups</label>
                    <input type="checkbox" checked={includeWarmups} onChange={e => setIncludeWarmups(!!e.target.checked)} />

                    <label>Rounding</label>
                    <select value={roundInc} onChange={e => setRoundInc(Number(e.target.value))}>
                        <option value={5}>5 lb</option>
                        <option value={2.5}>2.5 lb</option>
                    </select>

                    <button onClick={() => window.print()}>Print</button>
                </div>
            </div>

            <div className="print-grid">
                {dayEntries.map(({ day, lift }) => {
                    // map schedule keys to TM keys
                    const tmKey = lift;
                    const tm = Number(tms?.[tmKey] || 0);

                    const sets = tm ? calcSetsForLift(tm, loadingOption, week, includeWarmups, roundInc) : [];

                    return (
                        <div className="print-card" key={day}>
                            <div className="header">
                                <div className="title">{day} — {LIFT_LABEL[tmKey] || lift}</div>
                                <div className="sub">TM: {tm ? `${tm} lb` : '—'}</div>
                            </div>
                            {!tm ? (
                                <div className="empty">No TM set for this lift.</div>
                            ) : (
                                <table className="set-table">
                                    <thead>
                                        <tr><th>Type</th><th>%TM</th><th>Weight</th><th>Reps</th></tr>
                                    </thead>
                                    <tbody>
                                        {sets.map((s, idx) => (
                                            <tr key={idx}>
                                                <td>{s.type === 'warmup' ? 'WU' : 'Main'}</td>
                                                <td>{s.pct}%</td>
                                                <td>{s.weight}</td>
                                                <td>{s.reps}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="notes">Notes:</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
