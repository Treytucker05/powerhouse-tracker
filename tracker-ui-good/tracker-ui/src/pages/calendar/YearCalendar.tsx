import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const localizer = momentLocalizer(moment as any);

type Props = {
    year: number;
    events: any[];
};

/**
 * YearCalendar: renders all 12 months for the given year using 12 month views.
 * We reuse react-big-calendar Month view per month with toolbar disabled.
 */
export default function YearCalendar({ year, events }: Props) {
    const months = React.useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {months.map((m) => {
                const date = moment({ year, month: m, day: 1 }).toDate();
                // Let RBC filter events for the month; passing all is okay.
                return (
                    <div key={m} className="bg-[#0b1220] border border-gray-700 rounded p-2">
                        <div className="text-center text-sm text-gray-300 font-medium mb-2">
                            {moment(date).format('MMMM YYYY')}
                        </div>
                        <Calendar
                            localizer={localizer}
                            date={date}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            toolbar={false}
                            views={{ month: true } as any}
                            style={{ height: 320 }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
