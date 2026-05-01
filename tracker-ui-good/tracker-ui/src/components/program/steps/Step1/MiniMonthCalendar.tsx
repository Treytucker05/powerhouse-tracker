import * as React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import { mapRotationToEvents, liftColors } from '@/lib/calendar/mapRotation';
import type { Assignments } from './DndRotationPlanner';
import { useSchedule } from '@/store/scheduleStore';

const localizer = momentLocalizer(moment as any);

type Props = {
    rotation: Assignments;
    startDateISO: string;
};

export default function MiniMonthCalendar({ rotation, startDateISO }: Props) {
    const { daysPerWeek, days } = useSchedule();

    const monthStart = React.useMemo(() => moment(startDateISO, 'YYYY-MM-DD').startOf('month').toDate(), [startDateISO]);
    const monthEnd = React.useMemo(() => moment(monthStart).endOf('month').toDate(), [monthStart]);

    const events = React.useMemo(() => mapRotationToEvents({
        assignments: rotation,
        selectedDays: days,
        daysPerWeek: ([2, 3, 4].includes(daysPerWeek as any) ? daysPerWeek : 3) as 2 | 3 | 4,
        startDateISO,
        rangeStart: monthStart,
        rangeEnd: monthEnd,
    }), [rotation, days, daysPerWeek, startDateISO, monthStart, monthEnd]);

    // Compute weeks spanned by this month in the calendar grid
    const weeks = React.useMemo(() => {
        const gridStart = moment(monthStart).startOf('week');
        const gridEnd = moment(monthEnd).endOf('week');
        const daysDiff = gridEnd.diff(gridStart, 'days') + 1;
        return Math.ceil(daysDiff / 7);
    }, [monthStart, monthEnd]);

    // Match DnD grid cell height (~56px) with a small header allowance (~28px)
    const height = 28 + weeks * 56;

    return (
        <div className="mt-4 border border-gray-700 rounded p-2 bg-[#0b1220]">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-200">This Month</h4>
                <div className="text-xs text-gray-400">{moment(monthStart).format('MMMM YYYY')}</div>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month'] as any}
                toolbar={false}
                popup
                style={{ height }}
                components={{
                    event: ({ event }: any) => (
                        <div style={{ background: liftColors[(event?.resource?.lift) as keyof typeof liftColors] || '#3B82F6' }} className="px-1 py-0.5 rounded text-[10px] font-semibold">
                            {event.title}
                        </div>
                    )
                }}
            />
        </div>
    );
}
