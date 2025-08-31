import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import { useSearchParams } from 'react-router-dom';
import { useBuilderOptional } from '@/context/BuilderState';
import { useSchedule } from '@/store/scheduleStore';
import DndRotationPlanner from '@/components/program/steps/Step1/DndRotationPlanner';
import { mapRotationToEvents, liftColors } from '@/lib/calendar/mapRotation';
import YearCalendar from './YearCalendar';

const localizer = momentLocalizer(moment as any);

export default function CalendarPage() {
    const [searchParams] = useSearchParams();
    const builder = useBuilderOptional();
    const { daysPerWeek, days } = useSchedule();
    const [range, setRange] = React.useState<{ start: Date; end: Date }>(() => {
        const start = moment().startOf('month').toDate();
        const end = moment(start).endOf('month').toDate();
        return { start, end };
    });

    // Pull from Builder when available, else fall back to localStorage/state defaults
    const savedLS = React.useMemo(() => {
        try { return JSON.parse(window.localStorage.getItem('ph531.builder.ui.state') || 'null'); } catch { return null; }
    }, []);
    const builderState: any = builder?.state || savedLS || {};
    const setBuilder = React.useCallback((u: any) => {
        if (builder?.setState) {
            builder.setState(u);
        } else {
            // Persist minimal step1 subset when provider missing so navigation still works
            const next = { ...builderState, ...u };
            try { window.localStorage.setItem('ph531.builder.ui.state', JSON.stringify(next)); } catch { /* ignore */ }
        }
    }, [builder, builderState]);
    const startDateISO: string = builderState?.step1?.startDate || moment().format('YYYY-MM-DD');
    const step1 = builderState?.step1 || {};
    const rotation = step1.rotation || {};

    const events = React.useMemo(() => mapRotationToEvents({
        assignments: rotation,
        selectedDays: days,
        daysPerWeek: ([2, 3, 4].includes(daysPerWeek as any) ? daysPerWeek : 3) as 2 | 3 | 4,
        startDateISO,
        rangeStart: range.start,
        rangeEnd: range.end,
    }), [rotation, days, daysPerWeek, startDateISO, range.start, range.end]);

    const [mode, setMode] = React.useState<'week' | 'month' | 'year'>(() => {
        const v = (searchParams.get('view') || '').toLowerCase();
        return v === 'year' || v === 'week' || v === 'month' ? (v as any) : 'month';
    });
    const year = moment(startDateISO, 'YYYY-MM-DD').year();

    // For Year view, expand range to the full year to ensure all events are included
    const yearRange = React.useMemo(() => ({
        start: moment({ year, month: 0, day: 1 }).startOf('day').toDate(),
        end: moment({ year, month: 11, day: 31 }).endOf('day').toDate(),
    }), [year]);

    const yearEvents = React.useMemo(() => mapRotationToEvents({
        assignments: rotation,
        selectedDays: days,
        daysPerWeek: ([2, 3, 4].includes(daysPerWeek as any) ? daysPerWeek : 3) as 2 | 3 | 4,
        startDateISO,
        rangeStart: yearRange.start,
        rangeEnd: yearRange.end,
    }), [rotation, days, daysPerWeek, startDateISO, yearRange.start, yearRange.end]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-white">Training Calendar</h1>
                    <p className="text-sm text-gray-400">Mapped from your Step 1 rotation starting on the chosen date.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="inline-flex rounded border border-gray-700 overflow-hidden text-xs">
                        <button className={`px-3 py-1 ${mode === 'week' ? 'bg-gray-700 text-white' : 'text-gray-300'}`} onClick={() => setMode('week')}>Week</button>
                        <button className={`px-3 py-1 ${mode === 'month' ? 'bg-gray-700 text-white' : 'text-gray-300'}`} onClick={() => setMode('month')}>Month</button>
                        <button className={`px-3 py-1 ${mode === 'year' ? 'bg-gray-700 text-white' : 'text-gray-300'}`} onClick={() => setMode('year')}>Year</button>
                    </div>
                    <label className="text-sm text-gray-300">Start date
                        <input
                            type="date"
                            value={startDateISO}
                            onChange={(e) => setBuilder({ step1: { ...((builderState as any)?.step1 || {}), startDate: e.target.value } })}
                            className="ml-2 rounded border border-gray-700 bg-gray-800/60 px-2 py-1 text-sm text-gray-100"
                        />
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#0b1220] border border-gray-700 rounded p-2">
                    {mode !== 'year' ? (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            onRangeChange={(r: any) => {
                                if (Array.isArray(r) && r.length > 0) {
                                    setRange({ start: r[0], end: r[r.length - 1] });
                                } else if (r && r.start && r.end) {
                                    setRange({ start: r.start, end: r.end });
                                }
                            }}
                            views={['month', 'week'] as any}
                            popup
                            style={{ height: 720 }}
                            components={{
                                event: ({ event }: any) => (
                                    <div style={{ background: liftColors[(event?.resource?.lift) as keyof typeof liftColors] || '#3B82F6' }} className="px-1 py-0.5 rounded text-[11px] font-semibold">
                                        {event.title}
                                    </div>
                                )
                            }}
                        />
                    ) : (
                        <YearCalendar year={year} events={yearEvents} />
                    )}
                </div>
                <div>
                    <div className="bg-[#0b1220] border border-gray-700 rounded p-3 mb-4">
                        <h3 className="text-sm font-semibold text-[#ef4444] mb-2">Rotation</h3>
                        <DndRotationPlanner
                            value={rotation}
                            onChange={(next) => setBuilder({ step1: { ...step1, rotation: next } })}
                        />
                    </div>
                    <div className="bg-[#0b1220] border border-gray-700 rounded p-3">
                        <h3 className="text-sm font-semibold text-[#ef4444] mb-2">Legend</h3>
                        <ul className="text-xs text-gray-300 space-y-1">
                            {Object.entries(liftColors).map(([lift, color]) => (
                                <li key={lift} className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded" style={{ background: color }} /> {lift}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
