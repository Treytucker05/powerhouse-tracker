import moment from 'moment';
import type { Weekday } from '@/store/scheduleStore';

type Lift = 'Squat' | 'Bench' | 'Deadlift' | 'Press';
export type Assignments = Record<string, Lift>; // key `${row}:${Weekday}`

export type RbcEvent = { title: string; start: Date; end: Date; resource?: any };

const WD: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function weekdayLabel(d: Date): Weekday {
    const i = (d.getDay() + 6) % 7; // convert Sun=0..Sat=6 to Mon=0..Sun=6
    return WD[i];
}

/**
 * Map the Step 1 rotation assignments to real calendar-date events within a date range.
 * - For 4 days/week (single row), use row 0 for all weeks.
 * - For 2 or 3 days/week (two rows), alternate weekly rows starting from the ISO week of startDate.
 * - Only generate events on and after startDate.
 */
export function mapRotationToEvents(params: {
    assignments: Assignments;
    selectedDays: Weekday[];
    daysPerWeek: 2 | 3 | 4;
    startDateISO: string; // YYYY-MM-DD
    rangeStart: Date;
    rangeEnd: Date;
}): RbcEvent[] {
    const { assignments, selectedDays, daysPerWeek, startDateISO, rangeStart, rangeEnd } = params;
    const startDate = moment(startDateISO, 'YYYY-MM-DD').startOf('day');
    if (!startDate.isValid()) return [];
    const week0 = startDate.clone().startOf('isoWeek');
    const events: RbcEvent[] = [];
    const rows = daysPerWeek === 4 ? 1 : 2;

    // iterate each date within range
    const cur = moment(rangeStart).startOf('day');
    const end = moment(rangeEnd).startOf('day');
    while (cur.isSameOrBefore(end)) {
        // generate only on/after startDate
        if (cur.isSameOrAfter(startDate)) {
            const wd = weekdayLabel(cur.toDate());
            if (selectedDays.includes(wd)) {
                const weekIndex = cur.clone().startOf('isoWeek').diff(week0, 'weeks');
                const row = rows === 2 ? (Math.abs(weekIndex) % 2) : 0;
                const key = `${row}:${wd}`;
                const lift = assignments[key as keyof Assignments] as Lift | undefined;
                if (lift) {
                    const start = cur.toDate();
                    const end = moment(start).add(1, 'hour').toDate();
                    events.push({ title: lift, start, end, resource: { lift, row, weekday: wd, weekIndex } });
                }
            }
        }
        cur.add(1, 'day');
    }
    return events;
}

export const liftColors: Record<Lift, string> = {
    Squat: '#059669', // emerald-600
    Bench: '#0284c7', // sky-600
    Deadlift: '#b45309', // amber-700
    Press: '#a21caf', // fuchsia-700
};
